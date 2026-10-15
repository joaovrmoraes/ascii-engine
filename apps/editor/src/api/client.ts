import {
  applyCommands,
  assertSafeJson,
  commandJsonSchema,
  requestSchema,
  summarizeScene,
  type AuthoringRequest,
} from '@ascii-engine/authoring'
import { pomorog, POMOROG_EFFECTS } from '@ascii-engine/core/pomorog'
import {
  DEFAULT_WATER_LOOK,
  DEFAULT_WATER_PHYSICS,
  SURFACE_ALPHA,
  parseScene,
  type AsciiEngine,
  type SceneDoc,
} from '@ascii-engine/core'
import { importModelFiles } from '../scene/files'
import type { Area } from '../areas/types'
import { bridgeRequest } from './transport'

export function connectAuthoring(
  engine: AsciiEngine,
  area: Area,
  view: { angle: number; elevation: number; zoom: number; paused: boolean },
  capture: () => string,
) {
  if (!area.authoring || !area.document) return
  const editor = area.authoring,
    snapshot = area.document,
    canvas = engine.renderer.domElement
  const sessionId = crypto.randomUUID()
  let revision = 0,
    applying = false,
    original: SceneDoc | undefined,
    socket: WebSocket | undefined,
    stopped = false
  const banner = document.createElement('div')
  banner.id = 'ai-preview'
  banner.hidden = true
  banner.innerHTML =
    '<span>AI preview · not saved yet</span><button data-ai="accept">Apply</button><button data-ai="cancel">Discard</button><small role="status"></small>'
  document.body.append(banner)
  const state = () => ({
    sessionId,
    revision,
    preview: !!original,
    scene: summarizeScene(snapshot()),
  })
  const hello = () => {
    if (socket?.readyState === WebSocket.OPEN)
      socket.send(
        JSON.stringify({
          type: 'hello',
          sessionId,
          name: snapshot().name,
          revision,
          preview: !!original,
        }),
      )
  }
  const changed = () => {
    if (!applying) {
      revision++
      hello()
    }
  }
  canvas.addEventListener('scene-document-changed', changed)
  canvas.addEventListener('scene-replaced', changed)
  const inert = new Map<HTMLElement, boolean>()
  function lock(value: boolean) {
    editor.lock(value)
    for (const id of ['panel', 'selection']) {
      const el = document.getElementById(id)
      if (!el) continue
      if (value && !inert.has(el)) {
        inert.set(el, el.inert)
        el.inert = true
      } else if (!value && inert.has(el)) {
        el.inert = inert.get(el)!
        inert.delete(el)
      }
    }
  }
  // Keep camera navigation available, block editing shortcuts/drop/brushes in a preview.
  const guard = (event: Event) => {
    if ((!applying && !original) || banner.contains(event.target as Node)) return
    if (event instanceof PointerEvent && (event.button !== 0 || event.altKey)) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  for (const type of ['keydown', 'drop', 'pointerdown']) window.addEventListener(type, guard, true)

  async function request(raw: unknown): Promise<unknown> {
    assertSafeJson(raw)
    const req = requestSchema.parse(raw)
    if (applying) throw new Error('The editor is applying another change; read the scene again.')
    if (req.method === 'project.export' || req.method === 'project.export.status')
      return bridgeRequest(sessionId, req)
    if ('revision' in req && req.revision !== revision)
      throw new Error(
        `Revision conflict: expected ${revision}, received ${req.revision}. Read scene.read before editing.`,
      )
    if (req.method === 'scene.read')
      return { ...state(), ...(req.full ? { document: snapshot() } : {}) }
    if (req.method === 'engine.reference') {
      switch (req.topic) {
        case 'commands':
          return {
            commands: commandJsonSchema(),
            coordinates:
              'Meters, Y up; rotations in radians; colors as RGB integers or triples depending on the field. Read the revision before editing. Preview does not save; accept creates one undo step.',
            limits: {
              objects: 20000,
              effects: 256,
              atmospheres: 256,
              textures: 256,
              cameras: 128,
              terrainResolution: 513,
              pointLights: 8,
            },
          }
        case 'catalog':
          return editor.catalog()
        case 'style':
          return {
            defaults: pomorog,
            glyphKinds: ['surface', 'body', 'carpet', 'water', 'particle', 'screen'],
            surfaceFamilies: Object.keys(SURFACE_ALPHA),
            glyphStyle: {
              glyph: 'Technique',
              surface: 'Letter family; preserves model color',
              size: 'Meters: surface cell width or body base size; screen uses style.cellSize',
              color: 'Optional sRGB integer, 0x000000..0xffffff; omitted inherits model color',
            },
            textureFields: {
              alphabet:
                '1–128 single Unicode characters from sparse to dense, without control/combining sequences',
              font: 'Installed CSS font family, max 100 characters; device fallback applies',
              fontWeight: '400 or 700',
              open: 'true removes the solid body and discards empty surface pixels',
              faces: 'front or both (body)',
              rotation: 'Radians, -PI..PI',
              palette: '2–8 integer RGB colors, shadow to light; replaces base color',
              lighting: 'scene or unlit (global exposure/tint still applies)',
              emissive: 'RGB self light, does not illuminate other objects',
              emissiveIntensity: '0–4',
              spacing: '.5–4, relative to the original recipe',
              density: '.05–1',
              strength: '0–4 ink multiplier',
              gap: '0–.015; texture studio uses 0 for black gaps',
              contrast: '.1–4',
              toneOffset: '-1–1',
              shadowSteps: '2–16 integer',
            },
            studioFields: { bodySceneLighting: true, inkFog: true, inkTint: [1, 1, 1] },
            note: 'atmosphere.set merges recursively and enables lighting/fog on glyphs. Per-object options and options.parts; style.types applies to every instance, including imported assets. Imported glyph declarations are defaults below editor layers. Parts match named nodes/groups; meshes are not automatically segmented. surface/body are mesh techniques; water/carpet/particle require their corresponding geometry and cannot be assigned to an ordinary mesh.',
          }
        case 'water':
          return {
            defaults: DEFAULT_WATER_LOOK,
            physics: DEFAULT_WATER_PHYSICS,
            modes: [
              'terrain: gravity-driven flow within the painted area',
              'level: flat lake with a carved bed',
            ],
            letterFields: [
              'alphabet',
              'foamAlphabet',
              'reflectionAlphabet',
              'font',
              'fontWeight',
              'shallow',
              'deep',
              'depthScale',
              'rings',
              'reflection.strength',
            ],
            interaction:
              'Optional glyph rings respond to impacts and scene rain. water.disturb produces transient impulses; moving objects and actors generate waves.',
            limitation:
              'Shallow-water heightfield simulation: no 3D volumes, ballistic splashes, rigid-body buoyancy or expansion beyond the mask. Objects reflect on calm planar regions; slopes reflect directional light.',
          }
        case 'effects':
          return {
            presets: POMOROG_EFFECTS,
            definition:
              'EffectDef: name, duration (s), loop, emitters[]; light: {color,intensity,distance,decay,flicker,offset,fade}. Copy a preset and modify it; id fx:custom-NAME.',
            emitterFields: [
              'name',
              'render',
              'rate',
              'bursts',
              'start',
              'duration',
              'life',
              'shape',
              'offset',
              'speed',
              'velocity',
              'gravity',
              'drag',
              'noise',
              'attract',
              'ground',
              'spin',
              'glyphs',
              'size',
              'color',
              'alpha',
              'glow',
              'ring',
              'beam',
              'ribbon',
              'heat',
              'flipbook',
              'max',
            ],
          }
        case 'documents':
          return {
            version: 1,
            fields: [
              'name',
              'style',
              'terrain',
              'waters',
              'carpet',
              'objects',
              'assets',
              'effects',
              'atmospheres',
              'textures',
              'cameras',
              'activeCamera',
              'environment',
            ],
            example: {
              version: 1,
              name: 'Map',
              objects: [
                {
                  id: 'stone-1',
                  prefab: 'pedregulho',
                  position: [0, 0, 0],
                  rotation3: [0, 0, 0],
                  scale3: [1, 1, 1],
                  options: { glyph: 'body' },
                },
              ],
            },
            note: 'scene.read full=true returns the entire document; scene.replace/patch cover every supported field. assets contain embedded GLTF/GLB as data URIs. atmospheres: {id:{name,style}} saves lighting in Assets; atmosphere.define saves and atmosphere.apply applies by id. textures: {id:{name,style}} saves GlyphStyle recipes; texture.define saves and texture.apply copies fields by default; link:true stores options.texture or options.parts[name].texture and removes fields defined by the recipe at that level (also unlinked parts for object links). Order: object texture, instance, part texture, instance part. Saving that asset updates every linked user. texture.detach bakes links into local overrides; resource.remove refuses textures in use. Optional previewLighting stores a studio AtmosphereStyle; applying the texture preserves scene lighting. Export = this document, without game rules.',
          }
      }
    }
    if (req.method === 'object.inspect') return editor.inspect(req.id)
    if (req.method === 'water.disturb') {
      editor.disturbWater(req.index, req.x, req.z, req.strength, req.radius)
      return state()
    }
    if (req.method === 'scene.validate') {
      const doc = applyCommands(snapshot(), req.commands)
      const known = new Set([
        ...editor
          .catalog()
          .filter(p => p.kind === 'builtin')
          .map(p => p.id),
        ...Object.keys(doc.assets ?? {}),
        ...Object.keys(doc.effects ?? {}),
      ])
      for (const obj of doc.objects)
        if (!known.has(obj.prefab)) throw new Error('Prefab not found: ' + obj.prefab)
      return {
        valid: true,
        scene: summarizeScene(doc),
        note: 'Data and references are valid; model files are decoded when applied.',
      }
    }
    if (req.method === 'editor.view') {
      editor.view(req.focus, req.studio, req.cameraId)
      if (req.angle !== undefined) view.angle = req.angle
      if (req.elevation !== undefined) view.elevation = req.elevation
      if (req.zoom !== undefined) view.zoom = req.zoom
      if (req.paused !== undefined) view.paused = req.paused
      return state()
    }
    if (req.method === 'editor.capture')
      return { sessionId, revision, mimeType: 'image/png', data: capture() }
    if (original && !req.method.startsWith('preview.'))
      throw new Error('A preview is pending. Apply or discard it before another change.')
    applying = true
    lock(true)
    try {
      if (req.method === 'scene.apply' || req.method === 'assets.import') {
        const before = snapshot()
        let doc: SceneDoc
        if (req.method === 'scene.apply') doc = applyCommands(before, req.commands)
        else {
          const files = req.files.map(f => {
            const bytes = Uint8Array.from(atob(f.data), c => c.charCodeAt(0)),
              file = new File([bytes], f.name.split('/').pop()!, { type: f.mime })
            Object.defineProperty(file, 'webkitRelativePath', { value: f.name })
            return file
          })
          doc = { ...before, assets: { ...before.assets, ...(await importModelFiles(files)) } }
        }
        await editor.replace(parseScene(doc))
        if (req.preview) original = before
        else await editor.commit()
      } else if (req.method === 'preview.accept') {
        if (!original) throw new Error('No preview is pending.')
        await editor.commit()
        original = undefined
      } else if (req.method === 'preview.cancel') {
        if (!original) throw new Error('No preview is pending.')
        await editor.replace(original)
        original = undefined
      } else if (req.method === 'history.undo' || req.method === 'history.redo')
        await editor.undo(req.method === 'history.redo')
      revision++
      return state()
    } finally {
      applying = false
      lock(!!original)
      banner.hidden = !original
      document.body.classList.toggle('ai-preview', !!original)
      hello()
    }
  }
  banner.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
    button.onclick = () =>
      void request({ method: `preview.${button.dataset.ai}`, revision }).catch(error => {
        banner.querySelector('small')!.textContent = String(error)
      })
  })
  function connect() {
    if (stopped) return
    socket = new WebSocket('ws://127.0.0.1:1442/editor')
    socket.onopen = hello
    socket.onmessage = event => {
      const message = JSON.parse(String(event.data))
      if (message.type !== 'request') return
      void request(message.request).then(
        result => socket?.send(JSON.stringify({ type: 'result', id: message.id, result })),
        error =>
          socket?.send(JSON.stringify({ type: 'result', id: message.id, error: String(error) })),
      )
    }
    socket.onclose = () => {
      if (!stopped) setTimeout(connect, 3000)
    }
    socket.onerror = () => socket?.close()
  }
  // The hosted sandbox keeps its in-page API without contacting visitors' local services.
  if (import.meta.env.VITE_PUBLIC_DEMO !== 'true') connect()
  const api = { sessionId, request: request as (request: AuthoringRequest) => Promise<unknown> }
  Object.assign(window, { asciiEngineApi: api })
  import.meta.hot?.dispose(() => {
    stopped = true
    socket?.close()
    banner.remove()
    document.body.classList.remove('ai-preview')
    canvas.removeEventListener('scene-document-changed', changed)
    canvas.removeEventListener('scene-replaced', changed)
    for (const type of ['keydown', 'drop', 'pointerdown'])
      window.removeEventListener(type, guard, true)
    lock(false)
  })
  return api
}
