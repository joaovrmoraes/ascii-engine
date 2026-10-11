import { applyCommands, assertSafeJson, commandJsonSchema, requestSchema, summarizeScene, type AuthoringRequest } from '@ascii-engine/authoring'
import { pomorog, FOREST_WATER, POMOROG_EFFECTS, SURFACE_ALPHA, parseScene, type AsciiEngine, type SceneDoc } from '@ascii-engine/core'
import { importModelFiles } from '../scene/files'
import type { Area } from '../areas/types'

export function connectAuthoring(engine: AsciiEngine, area: Area, view: { angle: number; zoom: number; paused: boolean }, capture: () => string) {
  if (!area.authoring || !area.document) return
  const editor = area.authoring, snapshot = area.document, canvas = engine.renderer.domElement
  const sessionId = crypto.randomUUID()
  let revision = 0, applying = false, original: SceneDoc | undefined, socket: WebSocket | undefined, stopped = false
  const banner = document.createElement('div'); banner.id = 'ai-preview'; banner.hidden = true
  banner.innerHTML = '<span>Prévia da IA · ainda não salva</span><button data-ai="accept">Aplicar</button><button data-ai="cancel">Descartar</button><small role="status"></small>'
  document.body.append(banner)
  const state = () => ({ sessionId, revision, preview: !!original, scene: summarizeScene(snapshot()) })
  const hello = () => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'hello', sessionId, name: snapshot().name, revision, preview: !!original })) }
  const changed = () => { if (!applying) { revision++; hello() } }
  canvas.addEventListener('scene-document-changed', changed); canvas.addEventListener('scene-replaced', changed)
  const inert = new Map<HTMLElement, boolean>()
  function lock(value: boolean) {
    editor.lock(value)
    for (const id of ['panel', 'selection']) {
      const el = document.getElementById(id)
      if (!el) continue
      if (value && !inert.has(el)) { inert.set(el, el.inert); el.inert = true }
      else if (!value && inert.has(el)) { el.inert = inert.get(el)!; inert.delete(el) }
    }
  }
  // Keep camera navigation available, block editing shortcuts/drop/brushes in a preview.
  const guard = (event: Event) => {
    if (!applying && !original || banner.contains(event.target as Node)) return
    if (event instanceof PointerEvent && (event.button !== 0 || event.altKey)) return
    event.preventDefault(); event.stopImmediatePropagation()
  }
  for (const type of ['keydown', 'drop', 'pointerdown']) window.addEventListener(type, guard, true)

  async function request(raw: unknown): Promise<unknown> {
    assertSafeJson(raw)
    const req = requestSchema.parse(raw)
    if (applying) throw new Error('O editor está aplicando outra alteração; leia a cena novamente.')
    if ('revision' in req && req.revision !== revision) throw new Error(`Conflito de revisão: esperado ${revision}, recebido ${req.revision}. Leia scene.read antes de editar.`)
    if (req.method === 'scene.read') return { ...state(), ...(req.full ? { document: snapshot() } : {}) }
    if (req.method === 'engine.reference') {
      switch (req.topic) {
        case 'commands': return { commands: commandJsonSchema(), coordinates: 'Metros, Y para cima; rotação em radianos; cores inteiras RGB ou triplas conforme o campo. Leia a revisão antes de alterar. Prévia não grava; accept grava um passo de desfazer.', limits: { objects: 20000, effects: 256, atmospheres: 256, cameras: 128, terrainResolution: 513, pointLights: 8 } }
        case 'catalog': return editor.catalog()
        case 'style': return { defaults: pomorog, glyphKinds: ['surface','body','carpet','water','particle','screen'], surfaceFamilies: Object.keys(SURFACE_ALPHA), studioFields: { bodySceneLighting: true, inkFog: true, inkTint: [1, 1, 1] }, note: 'atmosphere.set faz merge recursivo e habilita luz/fog nas letras. options e options.parts por objeto; style.types para todas as cópias. surface/body são técnicas de malhas; water/carpet/particle exigem a geometria correspondente, não atribua essas técnicas a uma malha comum.' }
        case 'water': return { defaults: FOREST_WATER, modes: ['terrain: acompanha encosta, ondulação desce conforme a normal', 'level: nível plano, escava leito'], limitation: 'Reflexo planar; aproximação local nas encostas. Não é simulação física de fluidos.' }
        case 'effects': return { presets: POMOROG_EFFECTS, definition: 'EffectDef: name, duration (s), loop, emitters[]; light: {color,intensity,distance,decay,flicker,offset,fade}. Copie um preset e modifique; id fx:custom-NOME.', emitterFields: ['name','render','rate','bursts','start','duration','life','shape','offset','speed','velocity','gravity','drag','noise','attract','ground','spin','glyphs','size','color','alpha','glow','ring','beam','ribbon','heat','flipbook','max'] }
        case 'documents': return { version: 1, fields: ['name','style','terrain','waters','carpet','objects','assets','effects','atmospheres','cameras','activeCamera','environment'], example: { version: 1, name: 'Mapa', objects: [{ id: 'pedra-1', prefab: 'pedregulho', position: [0,0,0], rotation3: [0,0,0], scale3: [1,1,1], options: { glyph: 'body' } }] }, note: 'scene.read full=true retorna todo o documento; scene.replace/patch cobrem todos os campos suportados. assets contêm GLTF/GLB incorporado como data URI. atmospheres: {id:{name,style}} salva iluminação nos Assets; atmosphere.define salva e atmosphere.apply aplica pelo id. Exportação = este documento, sem regras do jogo.' }
      }
    }
    if (req.method === 'object.inspect') return editor.inspect(req.id)
    if (req.method === 'scene.validate') {
      const doc = applyCommands(snapshot(), req.commands)
      const known = new Set([...editor.catalog().filter(p => p.kind === 'builtin').map(p => p.id), ...Object.keys(doc.assets ?? {}), ...Object.keys(doc.effects ?? {})])
      for (const obj of doc.objects) if (!known.has(obj.prefab)) throw new Error('Prefab inexistente: ' + obj.prefab)
      return { valid: true, scene: summarizeScene(doc), note: 'Dados e referências válidos; arquivos de modelo são decodificados ao aplicar.' }
    }
    if (req.method === 'editor.view') { editor.view(req.focus, req.studio, req.cameraId); if (req.angle !== undefined) view.angle = req.angle; if (req.zoom !== undefined) view.zoom = req.zoom; if (req.paused !== undefined) view.paused = req.paused; return state() }
    if (req.method === 'editor.capture') return { sessionId, revision, mimeType: 'image/png', data: capture() }
    if (original && !req.method.startsWith('preview.')) throw new Error('Há uma prévia pendente. Aplique ou descarte antes de outra alteração.')
    applying = true; lock(true)
    try {
      if (req.method === 'scene.apply' || req.method === 'assets.import') {
        const before = snapshot()
        let doc: SceneDoc
        if (req.method === 'scene.apply') doc = applyCommands(before, req.commands)
        else {
          const files = req.files.map(f => {
            const bytes = Uint8Array.from(atob(f.data), c => c.charCodeAt(0)), file = new File([bytes], f.name.split('/').pop()!, { type: f.mime })
            Object.defineProperty(file, 'webkitRelativePath', { value: f.name }); return file
          })
          doc = { ...before, assets: { ...before.assets, ...await importModelFiles(files) } }
        }
        await editor.replace(parseScene(doc))
        if (req.preview) original = before
        else await editor.commit()
      } else if (req.method === 'preview.accept') {
        if (!original) throw new Error('Não há prévia pendente.')
        await editor.commit(); original = undefined
      } else if (req.method === 'preview.cancel') {
        if (!original) throw new Error('Não há prévia pendente.')
        await editor.replace(original); original = undefined
      } else if (req.method === 'history.undo' || req.method === 'history.redo') await editor.undo(req.method === 'history.redo')
      revision++
      return state()
    } finally { applying = false; lock(!!original); banner.hidden = !original; document.body.classList.toggle('ai-preview', !!original); hello() }
  }
  banner.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.onclick = () => void request({ method: `preview.${button.dataset.ai}`, revision }).catch(error => { banner.querySelector('small')!.textContent = String(error) }) })
  function connect() {
    if (stopped) return
    socket = new WebSocket('ws://127.0.0.1:1442/editor')
    socket.onopen = hello
    socket.onmessage = event => {
      const message = JSON.parse(String(event.data))
      if (message.type !== 'request') return
      void request(message.request).then(result => socket?.send(JSON.stringify({ type: 'result', id: message.id, result })), error => socket?.send(JSON.stringify({ type: 'result', id: message.id, error: String(error) })))
    }
    socket.onclose = () => { if (!stopped) setTimeout(connect, 3000) }
    socket.onerror = () => socket?.close()
  }
  connect()
  const api = { sessionId, request: request as (request: AuthoringRequest) => Promise<unknown> }
  Object.assign(window, { asciiEngineApi: api })
  import.meta.hot?.dispose(() => {
    stopped = true; socket?.close(); banner.remove(); document.body.classList.remove('ai-preview')
    canvas.removeEventListener('scene-document-changed', changed); canvas.removeEventListener('scene-replaced', changed)
    for (const type of ['keydown', 'drop', 'pointerdown']) window.removeEventListener(type, guard, true)
    lock(false)
  })
  return api
}
