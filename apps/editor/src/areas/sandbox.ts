import * as THREE from 'three'
import { buildScene, createTerrainData, createHistory, emptyScene, loadSceneAssets, parseScene, pomorog, waterEdge, type AsciiEngine, type Brush, type BuiltScene, type SceneDoc } from '@ascii-engine/core'
import { createPrefabs } from '../scene/prefabs'
import { downloadDocument, importModelFiles } from '../scene/files'
import { readDraft, saveDraft } from '../scene/storage'
import type { Area, AreaOptions } from './types'
import '../authoring.css'

type Tool = 'select' | Brush | 'lake' | 'stream' | 'place' | 'erase'
export function defaultScene(): SceneDoc {
  return { ...emptyScene('Meu mapa'), terrain: createTerrainData(32, 129), carpet: { count: 60000, seed: 48017 }, objects: [
    { prefab: 'fogueira', position: [0, 0, 0] }, { prefab: 'arvore', position: [-4, 0, -3] }, { prefab: 'pedregulho', position: [3, 0, -2] },
  ] }
}

/** The editor and exported player build the very same portable document. */
export async function createSandbox(engine: AsciiEngine, options: AreaOptions = {}): Promise<Area> {
  const player = document.body.classList.contains('player')
  let note = '', initial = options.scene
  if (!initial && !player) try { const draft = await readDraft(); if (draft) initial = parseScene(draft) } catch (error) { note = `Rascunho indisponível: ${error}` }
  const builtins = createPrefabs(engine)
  let assets: Awaited<ReturnType<typeof loadSceneAssets>> = { library: {}, dispose() {} }
  let library = builtins, scene: BuiltScene
  try { assets = await loadSceneAssets(initial ?? defaultScene()); library = { ...builtins, ...assets.library }; scene = buildScene(engine, initial ?? defaultScene(), library) }
  catch (error) {
    assets.dispose()
    if (options.scene) throw error
    note = `Não foi possível abrir o rascunho: ${error}. Novo mapa aberto; o rascunho só será substituído ao editar.`
    initial = defaultScene(); library = builtins; assets = { library: {}, dispose() {} }; scene = buildScene(engine, initial, library)
  }
  let name = initial?.name ?? 'Meu mapa', selected: THREE.Object3D | undefined, selectedWater = -1, busy = false
  const snapshot = (): SceneDoc => ({ ...scene.toJSON(), name })
  const history = createHistory(snapshot(), 30)
  const focus = new THREE.Vector3(0, .8, 0), canvas = engine.renderer.domElement
  const signal = new AbortController()
  const tool = { kind: 'select' as Tool, radius: 2, strength: .08, layer: 1, prefab: 'arvore' }
  let toolbar: HTMLElement, hierarchy: HTMLElement, sidebar: HTMLElement, box: HTMLElement
  const run = (action: () => void | Promise<void>) => { if (busy) return; void Promise.resolve().then(action).catch(error => message(String(error))) }
  function message(text: string) { note = text; const el = toolbar?.querySelector('[data-k="note"]'); if (el) el.textContent = text }
  let saveRevision = 0
  async function persist() {
    const revision = ++saveRevision
    try { await saveDraft(snapshot()); if (revision === saveRevision) message('Rascunho salvo neste navegador') }
    catch (error) { message(`Falha no rascunho; use Salvar arquivo. ${error}`) }
  }
  function changed() { if (player || busy) return; history.commit(snapshot()); refreshHierarchy(); refreshHistory(); void persist() }
  function choose(object?: THREE.Object3D, fromCanvas = false) {
    selected = scene.placed.find(p => p.object === object)?.object; selectedWater = -1
    if (!fromCanvas) canvas.dispatchEvent(new CustomEvent('select-scene-object', { detail: selected }))
    refreshHierarchy()
  }
  async function replace(input: unknown) {
    if (busy) throw new Error('Aguarde a abertura atual.')
    busy = true
    for (const panel of [toolbar, hierarchy, sidebar]) if (panel) panel.inert = true
    let nextAssets: Awaited<ReturnType<typeof loadSceneAssets>> | undefined
    const previousStyle = engine.exportStyle()
    try {
      const doc = parseScene(input)
      nextAssets = await loadSceneAssets(doc)
      const nextLibrary = { ...builtins, ...nextAssets.library }
      parseScene(doc, nextLibrary)
      // Keep types used by the old scene valid until the candidate is built.
      const nextStyle = { ...structuredClone(pomorog), ...doc.style, types: { ...structuredClone(pomorog.types), ...Object.fromEntries(Object.entries(nextLibrary).filter(([, prefab]) => prefab.style).map(([key, prefab]) => [key, prefab.style!])), ...doc.style?.types } }
      engine.setStyle({ ...nextStyle, types: { ...previousStyle.types, ...nextStyle.types } }, { replace: true })
      const next = buildScene(engine, doc, nextLibrary)
      scene.dispose(); assets.dispose()
      scene = next; assets = nextAssets; library = nextLibrary; name = doc.name ?? 'Sem título'
      engine.setStyle(nextStyle, { replace: true })
      selected = undefined; selectedWater = -1
      canvas.dispatchEvent(new Event('scene-replaced'))
      refreshTools(); refreshHierarchy()
      if (toolbar) toolbar.querySelector<HTMLInputElement>('[data-k="name"]')!.value = name
    } catch (error) { nextAssets?.dispose(); engine.setStyle(previousStyle, { replace: true }); throw error }
    finally { busy = false; for (const panel of [toolbar, hierarchy, sidebar]) if (panel) panel.inert = false }
  }
  async function undo(redo = false) {
    const doc = redo ? history.redo() : history.undo()
    if (!doc) return
    try { await replace(doc); refreshHistory(); await persist() }
    catch (error) { redo ? history.undo() : history.redo(); throw error }
  }
  function duplicate() {
    if (!selected) return
    const item = snapshot().objects[scene.placed.findIndex(p => p.object === selected)]
    const object = scene.place({ ...item, id: crypto.randomUUID(), name: `${selected.name || library[item.prefab].title} cópia`, position: [item.position[0] + 1, item.position[1], item.position[2] + 1] })
    choose(object); changed()
  }
  async function removeSelected() {
    if (selected) { scene.remove(selected); choose(); changed() }
    else if (selectedWater >= 0) { const doc = snapshot(); doc.waters!.splice(selectedWater, 1); await replace(doc); changed() }
  }
  function exportItem() {
    if (!selected) return
    const doc = snapshot(), item = doc.objects[scene.placed.findIndex(p => p.object === selected)]
    downloadDocument({ version: 1, name: item.name || item.prefab, style: doc.style, objects: [{ ...item, position: [0, 0, 0] }], assets: doc.assets?.[item.prefab] ? { [item.prefab]: doc.assets[item.prefab] } : undefined }, 'item.json')
  }
  function refreshHistory() {
    if (!toolbar) return
    toolbar.querySelector<HTMLButtonElement>('[data-k="undo"]')!.disabled = !history.canUndo
    toolbar.querySelector<HTMLButtonElement>('[data-k="redo"]')!.disabled = !history.canRedo
  }
  function refreshTools() {
    if (!box) return
    const prefabs = box.querySelector<HTMLSelectElement>('[data-k="prefab"]')!
    prefabs.replaceChildren(...Object.entries(library).map(([key, value]) => new Option(value.title, key)))
    if (!library[tool.prefab]) tool.prefab = 'arvore'
    prefabs.value = tool.prefab
    const layers = box.querySelector<HTMLSelectElement>('[data-k="layer"]')!
    layers.replaceChildren(...(scene.terrain?.data.layers ?? []).map((l, i) => new Option(l.name, String(i))))
    layers.value = String(tool.layer); layers.disabled = !scene.terrain
    box.querySelectorAll<HTMLOptionElement>('[data-k="tool"] option').forEach(option => { option.disabled = !scene.terrain && !['select', 'place', 'erase'].includes(option.value) })
    if (!scene.terrain && !['select', 'place', 'erase'].includes(tool.kind)) tool.kind = 'select'
    box.querySelector<HTMLSelectElement>('[data-k="tool"]')!.value = tool.kind
    box.querySelector<HTMLSelectElement>('[data-k="weather"]')!.value = snapshot().environment?.weather ?? 'none'
    box.querySelector<HTMLSelectElement>('[data-k="atmosphere"]')!.value = engine.style.atmosphere
  }
  function refreshHierarchy() {
    if (!hierarchy) return
    const list = hierarchy.querySelector('[data-k="objects"]')!
    list.replaceChildren()
    for (const { object, doc } of scene.placed) {
      const button = document.createElement('button'); button.textContent = `${object.visible ? '◇' : '·'} ${object.name || library[doc.prefab].title}`
      button.className = object === selected ? 'active' : ''; button.onclick = () => choose(object); list.append(button)
    }
    scene.waters.forEach((water, i) => {
      const button = document.createElement('button'); button.textContent = `≈ ${water.shape.kind === 'pond' ? 'Lago' : 'Riacho'} ${i + 1}`
      button.className = selectedWater === i ? 'active' : ''; button.onclick = () => { choose(); selectedWater = i; refreshHierarchy() }; list.append(button)
    })
    const inspector = hierarchy.querySelector<HTMLElement>('[data-k="inspector"]')!; inspector.replaceChildren()
    const field = (label: string, value: string, change: (value: string) => void, type = 'number') => {
      const row = document.createElement('label'); row.textContent = label
      const input = document.createElement('input'); input.type = type; input.value = value; input.step = '.1'; input.dataset.field = label
      input.onchange = () => { if (type === 'number' && !Number.isFinite(input.valueAsNumber)) return; run(() => change(input.value)) }; row.append(input); inspector.append(row)
    }
    const button = (label: string, action: () => void | Promise<void>) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => run(action); inspector.append(b) }
    if (selected) {
      const object = selected
      field('Nome', object.name, value => { object.name = value; changed() }, 'text')
      const row = document.createElement('label'), visible = document.createElement('input'); row.textContent = 'Visível'; visible.type = 'checkbox'; visible.checked = object.visible
      visible.onchange = () => { object.visible = visible.checked; changed() }; row.append(visible); inspector.append(row)
      for (const [property, label] of [['position', 'Posição'], ['rotation', 'Rotação'], ['scale', 'Escala']] as const) {
        const title = document.createElement('p'); title.textContent = label + (property === 'rotation' ? ' (graus)' : ''); inspector.append(title)
        for (const axis of ['x', 'y', 'z'] as const) field(`${label} ${axis}`, String(Number((object[property][axis] * (property === 'rotation' ? 180 / Math.PI : 1)).toFixed(3))), value => {
          if (property === 'scale' && Number(value) <= 0) return
          object[property][axis] = Number(value) * (property === 'rotation' ? Math.PI / 180 : 1)
          if (property === 'scale') engine.setInstanceStyle(object, {})
          changed()
        })
      }
      const clips = object.userData.animationClips as string[] | undefined
      if (clips?.length) {
        const select = document.createElement('select'); select.append(new Option('Animação parada', ''))
        clips.forEach(clip => select.append(new Option(clip, clip)))
        const index = scene.placed.findIndex(p => p.object === object); select.value = scene.placed[index].doc.animation ?? (scene.placed[index].doc.animation === null ? '' : clips[0])
        select.onchange = () => run(async () => { const doc = snapshot(); doc.objects[index].animation = select.value || null; await replace(doc); choose(scene.placed[index].object); changed() }); inspector.append(select)
      }
      button('Focar [F]', () => { focus.copy(object.position); focus.y += .8 })
      button('Duplicar [Ctrl D]', duplicate); button('Exportar este item', exportItem)
    } else if (selectedWater >= 0) {
      const index = selectedWater, entry = snapshot().waters![index]
      for (const [key, label, value] of [['x', 'Posição x', entry.shape.x], ['z', 'Posição z', entry.shape.z], ['size', 'Tamanho', entry.shape.size], ['angle', 'Direção (graus)', entry.shape.angle * 180 / Math.PI], ['level', 'Nível', entry.level ?? 0], ['flow', 'Fluxo', entry.look?.flow ?? .35]] as const) {
        field(label, String(value), value => { void waterChange(key, Number(value)) })
      }
      async function waterChange(key: string, value: number) {
        try {
          const doc = snapshot(), water = doc.waters![index]
          if (key === 'level') water.level = value
          else if (key === 'flow') water.look = { ...water.look, flow: value }
          else Object.assign(water.shape, { [key]: key === 'angle' ? value * Math.PI / 180 : value })
          await replace(doc); selectedWater = index; changed()
        } catch (error) { message(String(error)) }
      }
    } else { const hint = document.createElement('p'); hint.textContent = 'Selecione um objeto na lista ou uma parte no mapa.'; inspector.append(hint) }
    if (selected || selectedWater >= 0) button('Excluir [Delete]', removeSelected)
  }

  if (!player) {
    document.body.classList.add('authoring')
    toolbar = document.createElement('header'); toolbar.id = 'authoring-toolbar'
    toolbar.innerHTML = `<strong>ASCII ENGINE</strong><input data-k="name" aria-label="Nome do documento"><button data-k="new">Novo mapa</button><button data-k="item">Novo item</button><label class="file">Abrir<input data-k="open" type="file" accept=".json" hidden></label><button data-k="save">Salvar arquivo</button><button data-k="export">Exportar para Pomorog</button><button data-k="undo" title="Desfazer (Ctrl Z)">↶</button><button data-k="redo" title="Refazer (Ctrl Shift Z)">↷</button><span data-k="note" role="status"></span>`
    document.body.append(toolbar)
    const el = <T extends HTMLElement>(key: string) => toolbar.querySelector<T>(`[data-k="${key}"]`)!
    el<HTMLInputElement>('name').value = name
    el<HTMLInputElement>('name').onchange = e => { name = (e.target as HTMLInputElement).value || 'Sem título'; changed() }
    el('new').onclick = () => run(async () => { await replace(defaultScene()); focus.set(0, .8, 0); changed() })
    el('item').onclick = () => run(async () => { await replace(emptyScene('Meu item')); focus.set(0, .8, 0); changed() })
    el('save').onclick = () => downloadDocument(snapshot())
    el('export').onclick = () => { downloadDocument(snapshot(), 'pomorog.json'); message('Pacote visual exportado; importador do Pomorog será integrado depois.') }
    el('undo').onclick = () => run(() => undo()); el('redo').onclick = () => run(() => undo(true))
    const opener = el<HTMLInputElement>('open')
    opener.onchange = () => { const file = opener.files?.[0]; opener.value = ''; if (file) run(async () => { await replace(JSON.parse(await file.text())); changed() }) }
    sidebar = document.createElement('aside'); sidebar.id = 'authoring-sidebar'; document.body.append(sidebar)
    sidebar.append(document.getElementById('panel')!)
    box = document.createElement('section'); box.id = 'tools'; sidebar.append(box)
    const brushes: [Tool, string][] = [['select', 'Selecionar / girar câmera'], ['raise', 'Elevar terreno'], ['lower', 'Baixar terreno'], ['smooth', 'Suavizar'], ['flatten', 'Aplainar'], ['paint', 'Pintar chão'], ['lake', 'Cavar lago'], ['stream', 'Cavar riacho'], ['place', 'Colocar objeto'], ['erase', 'Apagar objeto']]
    box.innerHTML = `<div class="title">CONSTRUIR</div><label>Ferramenta<select data-k="tool">${brushes.map(([key, title]) => `<option value="${key}">${title}</option>`).join('')}</select></label><label>Raio<input data-k="radius" type="range" min=".5" max="8" step=".25"></label><label>Força<input data-k="strength" type="range" min=".01" max=".4" step=".01"></label><label>Chão<select data-k="layer"></select></label><label>Objeto<select data-k="prefab"></select></label><button data-k="add">Adicionar no centro da vista</button><button data-k="grow">Regerar grama</button><p>Arraste para girar · roda para zoom<br>Botão direito ou Shift: mover câmera<br>Nos pincéis, Shift inverte subir/descer.</p>`
    box.querySelector<HTMLSelectElement>('[data-k="tool"]')!.onchange = e => { tool.kind = (e.target as HTMLSelectElement).value as Tool }
    for (const key of ['radius', 'strength'] as const) { const input = box.querySelector<HTMLInputElement>(`[data-k="${key}"]`)!; input.value = String(tool[key]); input.oninput = () => { tool[key] = Number(input.value) } }
    box.querySelector<HTMLSelectElement>('[data-k="layer"]')!.onchange = e => { tool.layer = Number((e.target as HTMLSelectElement).value) }
    box.querySelector<HTMLSelectElement>('[data-k="prefab"]')!.onchange = e => { tool.prefab = (e.target as HTMLSelectElement).value }
    box.querySelector<HTMLButtonElement>('[data-k="add"]')!.onclick = () => run(() => { choose(scene.place({ prefab: tool.prefab, position: [focus.x, scene.terrain?.heightAt(focus.x, focus.z) ?? 0, focus.z] })); changed() })
    box.querySelector<HTMLButtonElement>('[data-k="grow"]')!.onclick = () => run(() => { scene.regrow(); changed() })
    const environment = document.createElement('div')
    environment.innerHTML = '<label>Clima<select data-k="weather"><option value="none">Sem precipitação</option><option value="rain">Chuva</option><option value="snow">Neve</option></select></label><label>Atmosfera<select data-k="atmosphere"><option value="moon">Luar</option><option value="dusk">Entardecer</option><option value="ember">Brasa</option></select></label><label class="file">Inserir item salvo<input data-k="insert" type="file" accept=".json" hidden></label>'
    box.append(environment)
    box.querySelector<HTMLSelectElement>('[data-k="weather"]')!.onchange = e => run(async () => { const doc = snapshot(); doc.environment = { weather: (e.target as HTMLSelectElement).value as 'none' | 'rain' | 'snow' }; await replace(doc); changed() })
    box.querySelector<HTMLSelectElement>('[data-k="atmosphere"]')!.onchange = e => { engine.setStyle({ atmosphere: (e.target as HTMLSelectElement).value as 'moon' | 'dusk' | 'ember' }); changed() }
    const insert = box.querySelector<HTMLInputElement>('[data-k="insert"]')!
    insert.onchange = () => { const file = insert.files?.[0]; insert.value = ''; if (file) run(async () => {
      const item = parseScene(JSON.parse(await file.text())), doc = snapshot()
      if (item.terrain || item.waters?.length) throw new Error('Para inserir como item, salve um documento sem terreno nem água. Use Abrir para mapas.')
      const remap = new Map(Object.keys(item.assets ?? {}).map(key => [key, `asset-${crypto.randomUUID()}`]))
      for (const [key, asset] of Object.entries(item.assets ?? {})) { doc.assets ??= {}; doc.assets[remap.get(key)!] = asset }
      for (const object of item.objects) {
        const type = object.options?.type ?? object.prefab, typeStyle = item.style?.types?.[type]
        doc.objects.push({ ...object, id: crypto.randomUUID(), prefab: remap.get(object.prefab) ?? object.prefab,
          position: [object.position[0] + focus.x, object.position[1] + (scene.terrain?.heightAt(focus.x, focus.z) ?? 0), object.position[2] + focus.z],
          options: { ...item.style?.glyphs, ...typeStyle?.style, ...object.options, parts: { ...typeStyle?.parts, ...object.options?.parts } },
        })
      }
      await replace(doc); changed()
    }) }
    sidebar.append(document.getElementById('selection')!)
    hierarchy = document.createElement('aside'); hierarchy.id = 'hierarchy'; hierarchy.innerHTML = '<strong>OBJETOS DO DOCUMENTO</strong><div data-k="objects"></div><div data-k="inspector"></div>'; document.body.append(hierarchy)
    refreshTools(); refreshHierarchy(); refreshHistory(); message(note || 'Pronto · salvamento automático por ação')

    const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    let painting = false, strokeChanged = false, flattenHeight = 0
    function act(e: PointerEvent, first: boolean) {
      const rect = canvas.getBoundingClientRect(); ndc.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1)
      raycaster.setFromCamera(ndc, engine.camera)
      const p = scene.terrain ? raycaster.intersectObject(scene.terrain.mesh)[0]?.point : raycaster.ray.intersectPlane(plane, new THREE.Vector3())
      if (!p) return
      if (first) flattenHeight = p.y
      let kind = tool.kind
      if (e.shiftKey && (kind === 'raise' || kind === 'lower')) kind = kind === 'raise' ? 'lower' : 'raise'
      if (kind === 'place' && first) { choose(scene.place({ prefab: tool.prefab, position: [p.x, scene.terrain?.heightAt(p.x, p.z) ?? 0, p.z], rotation: Math.random() * Math.PI * 2 })); strokeChanged = true }
      else if (kind === 'erase' && first) { const hit = engine.pick(ndc.x, ndc.y); if (hit && scene.placed.some(v => v.object === hit.object)) { scene.remove(hit.object); choose(); strokeChanged = true } }
      else if ((kind === 'lake' || kind === 'stream') && first && scene.terrain) {
        const shape = { kind: kind === 'lake' ? 'pond' as const : 'stream' as const, x: p.x, z: p.z, angle: 0, size: tool.radius }
        const level = scene.terrain.heightAt(p.x, p.z) - .05, data = scene.terrain.toJSON(), { size, resolution } = data
        for (let z = 0; z < resolution; z++) for (let x = 0; x < resolution; x++) {
          const edge = waterEdge(shape, x / (resolution - 1) * size - size / 2, z / (resolution - 1) * size - size / 2)
          if (edge > -.4) data.heights[z * resolution + x] = Math.min(data.heights[z * resolution + x], level - Math.max(0, Math.min(.6, edge * .6 + .1)))
        }
        const doc = snapshot(); doc.terrain = data; doc.waters = [...doc.waters ?? [], { shape, level }]
        painting = false; run(async () => { await replace(doc); changed() })
      } else if (scene.terrain && !['select', 'place', 'erase', 'lake', 'stream'].includes(kind)) {
        scene.terrain.apply({ brush: kind as Brush, x: p.x, z: p.z, radius: tool.radius, strength: kind === 'paint' ? tool.strength * 4 : tool.strength, layer: tool.layer, height: flattenHeight }); strokeChanged = true
      }
    }
    addEventListener('pointerdown', e => { if (busy || tool.kind === 'select' || e.target !== canvas || e.button !== 0) return; e.stopPropagation(); painting = true; strokeChanged = false; act(e, true) }, { capture: true, signal: signal.signal })
    addEventListener('pointermove', e => { if (painting) { e.stopPropagation(); act(e, false) } }, { capture: true, signal: signal.signal })
    const endStroke = (e: Event) => { if (painting) { e.stopPropagation(); painting = false; if (strokeChanged) { scene.regrow(); changed() } } }
    addEventListener('pointerup', endStroke, { capture: true, signal: signal.signal }); addEventListener('pointercancel', endStroke, { capture: true, signal: signal.signal })
    addEventListener('keydown', e => {
      if (e.target instanceof HTMLElement && (e.target.matches('input,select,textarea') || e.target.isContentEditable)) return
      const modifier = e.ctrlKey || e.metaKey
      if (modifier && e.key.toLowerCase() === 'z') { e.preventDefault(); run(() => undo(e.shiftKey)) }
      else if (modifier && e.key.toLowerCase() === 's') { e.preventDefault(); downloadDocument(snapshot()) }
      else if (modifier && e.key.toLowerCase() === 'd') { e.preventDefault(); run(duplicate) }
      else if (e.key === 'Delete') run(removeSelected)
      else if (e.key.toLowerCase() === 'f' && selected) focus.copy(selected.position).add(new THREE.Vector3(0, .8, 0))
    }, { signal: signal.signal })
  }
  return {
    id: 'sandbox', title: 'Editor visual', hero: new THREE.Vector3(100, 0, 100),
    get state() { return `${scene.placed.length} objetos · ${scene.waters.length} águas${busy ? ' · abrindo…' : ''}${note ? ` · ${note}` : ''}` },
    focus: (_angle, target) => target.copy(focus), pan(x, z) { focus.x += x; focus.z += z },
    select: object => choose(object, true), changed, document: snapshot,
    async openDocument(doc) { await replace(doc); changed() },
    async importFiles(files) {
      if (busy) throw new Error('Aguarde a abertura atual.')
      message('Importando modelos…')
      const imported = await importModelFiles(files), doc = snapshot()
      doc.assets = { ...doc.assets, ...imported }
      for (const [prefab, asset] of Object.entries(imported)) doc.objects.push({ prefab, name: asset.name, position: [focus.x, scene.terrain?.heightAt(focus.x, focus.z) ?? 0, focus.z] })
      await replace(doc); choose(scene.placed.at(-1)?.object); changed()
    },
    update(time) { scene.update(time) },
    dispose() {
      signal.abort(); scene.dispose(); assets.dispose()
      if (!player) { document.body.append(document.getElementById('panel')!, document.getElementById('selection')!); toolbar.remove(); hierarchy.remove(); sidebar.remove(); document.body.classList.remove('authoring') }
    },
  }
}
