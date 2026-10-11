import * as THREE from 'three'
import { buildScene, createTerrainData, createHistory, createEffectPrefabs, emptyScene, loadSceneAssets, parseScene, pomorog, waterEdge, type AsciiEngine, type Brush, type BuiltScene, type SceneDoc } from '@ascii-engine/core'
import { createPrefabs } from '../scene/prefabs'
import { downloadDocument, importModelFiles } from '../scene/files'
import { readDraft, saveDraft } from '../scene/storage'
import type { Area, AreaOptions } from './types'
import '../authoring.css'
import { createWorkspace, type Workspace } from '../editor/workspace'
import { createGizmos, type Gizmos } from '../editor/gizmos'
import { assetInfo, icon } from '../editor/icons'
import { createEffectEditor } from '../editor/effects'

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
  try { assets = await loadSceneAssets(initial ?? defaultScene()); library = { ...builtins, ...assets.library, ...createEffectPrefabs(engine, initial?.effects) }; scene = buildScene(engine, initial ?? defaultScene(), library) }
  catch (error) {
    assets.dispose()
    if (options.scene) throw error
    note = `Não foi possível abrir o rascunho: ${error}. Novo mapa aberto; o rascunho só será substituído ao editar.`
    initial = defaultScene(); library = builtins; assets = { library: {}, dispose() {} }; scene = buildScene(engine, initial, library)
  }
  let name = initial?.name ?? 'Meu mapa', selected: THREE.Object3D | undefined, selectedWater = -1, busy = false
  const snapshot = (): SceneDoc => ({ ...scene.toJSON(), name })
  const history = createHistory(snapshot(), 30)
  const focus = new THREE.Vector3(0, 1.6, -1.5), canvas = engine.renderer.domElement
  const signal = new AbortController()
  const tool = { kind: 'select' as Tool, radius: 2, strength: .08, layer: 1, prefab: 'arvore' }
  let toolbar: HTMLElement, hierarchy: HTMLElement, sidebar: HTMLElement, box: HTMLElement
  let ui: Workspace | undefined, gizmos: Gizmos | undefined
  let effectEditor: ReturnType<typeof createEffectEditor> | undefined
  let transformMode: 'hand' | 'translate' | 'rotate' | 'scale' = 'translate', preview = false, assetCategory = 'Todos', assetQuery = '', hierarchyQuery = ''
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
    if (object && (object === scene.terrain?.mesh || scene.waters.some(water => water.mesh === object))) {
      selectedWater = scene.waters.findIndex(water => water.mesh === object)
      gizmos?.attach(); canvas.dispatchEvent(new CustomEvent('select-scene-object', { detail: undefined }))
      ui?.selectPane(selectedWater >= 0 ? 'object' : 'terrain'); refreshHierarchy(); refreshHint(); return
    }
    if (!fromCanvas) canvas.dispatchEvent(new CustomEvent('select-scene-object', { detail: selected }))
    if (selected) { tool.kind = 'select'; ui?.selectPane('object') }
    gizmos?.attach(transformMode !== 'hand' && tool.kind === 'select' ? selected : undefined)
    refreshHierarchy(); refreshHint()
  }
  async function replace(input: unknown) {
    if (busy) throw new Error('Aguarde a abertura atual.')
    busy = true
    for (const panel of [toolbar, hierarchy, sidebar, ui?.assets]) if (panel) panel.inert = true
    let nextAssets: Awaited<ReturnType<typeof loadSceneAssets>> | undefined
    const previousStyle = engine.exportStyle()
    try {
      const doc = parseScene(input)
      nextAssets = await loadSceneAssets(doc)
      const nextLibrary = { ...builtins, ...nextAssets.library, ...createEffectPrefabs(engine, doc.effects) }
      parseScene(doc, nextLibrary)
      // Keep types used by the old scene valid until the candidate is built.
      const nextStyle = { ...structuredClone(pomorog), ...doc.style, types: { ...structuredClone(pomorog.types), ...Object.fromEntries(Object.entries(nextLibrary).filter(([, prefab]) => prefab.style).map(([key, prefab]) => [key, prefab.style!])), ...doc.style?.types } }
      engine.setStyle({ ...nextStyle, types: { ...previousStyle.types, ...nextStyle.types } }, { replace: true })
      const next = buildScene(engine, doc, nextLibrary)
      effectEditor?.stop(); scene.dispose(); assets.dispose()
      scene = next; assets = nextAssets; library = nextLibrary; name = doc.name ?? 'Sem título'
      engine.setStyle(nextStyle, { replace: true })
      selected = undefined; selectedWater = -1; gizmos?.attach(); gizmos?.cursor()
      canvas.dispatchEvent(new Event('scene-replaced'))
      refreshTools(); refreshHierarchy(); effectEditor?.refresh()
      if (toolbar) toolbar.querySelector<HTMLInputElement>('[data-k="name"]')!.value = name
    } catch (error) { nextAssets?.dispose(); engine.setStyle(previousStyle, { replace: true }); throw error }
    finally { busy = false; for (const panel of [toolbar, hierarchy, sidebar, ui?.assets]) if (panel) panel.inert = false }
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
    downloadDocument({ version: 1, name: item.name || item.prefab, style: doc.style, objects: [{ ...item, position: [0, 0, 0] }], assets: doc.assets?.[item.prefab] ? { [item.prefab]: doc.assets[item.prefab] } : undefined, effects: doc.effects?.[item.prefab] ? { [item.prefab]: doc.effects[item.prefab] } : undefined }, 'item.json')
  }
  function refreshHistory() {
    if (!toolbar) return
    toolbar.querySelector<HTMLButtonElement>('[data-k="undo"]')!.disabled = !history.canUndo
    toolbar.querySelector<HTMLButtonElement>('[data-k="redo"]')!.disabled = !history.canRedo
  }
  function refreshHint() {
    if (preview) { ui?.hint('Prévia do visual · clique em Voltar à edição para continuar'); return }
    if (tool.kind === 'place') ui?.hint(`Colocar ${library[tool.prefab]?.title ?? 'objeto'} · clique no chão · Shift mantém a ferramenta`, true)
    else if (tool.kind !== 'select') ui?.hint('Arraste no terreno para pintar · Shift inverte a altura · Esc volta à seleção', true)
    else ui?.hint(selected ? 'Arraste os eixos para transformar · W mover · E girar · R escalar · F focar' : 'Arraste um objeto da biblioteca para a cena · Alt + arraste gira a câmera · botão direito desloca')
  }
  function setMode(mode: typeof transformMode) {
    transformMode = mode; tool.kind = 'select'; gizmos?.cursor()
    if (mode !== 'hand') gizmos?.mode(mode)
    gizmos?.attach(mode !== 'hand' ? selected : undefined)
    ui?.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => { const active = button.dataset.mode === mode; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)) })
    refreshTools(); refreshHint()
  }
  function beginPlacement(prefab: string) {
    if (busy || preview) return
    tool.prefab = prefab; tool.kind = 'place'; gizmos?.attach(); ui?.selectPane('object')
    refreshLibrary(); refreshHint()
  }
  function placeAt(prefab: string, point: THREE.Vector3, repeat = false) {
    if (busy || preview) return
    const object = scene.place({ prefab, position: [point.x, scene.terrain?.heightAt(point.x, point.z) ?? 0, point.z] })
    choose(object); changed()
    if (repeat) beginPlacement(prefab)
    else { setMode('translate'); gizmos?.cursor() }
  }
  const normalized = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  function refreshLibrary() {
    if (!ui) return
    const categories = ui.get('[data-k="categories"]')
    categories.replaceChildren()
    for (const category of ['Todos', 'Natureza', 'Construções', 'Formas', 'Efeitos', 'Importados']) {
      const button = document.createElement('button'); button.innerHTML = icon('folder')
      const text = document.createElement('span'); text.textContent = category; button.append(text)
      const count = Object.keys(library).filter(key => category === 'Todos' || assetInfo(key).category === category).length
      const badge = document.createElement('small'); badge.textContent = String(count); button.append(badge)
      button.className = category === assetCategory ? 'active' : ''; button.onclick = () => { assetCategory = category; refreshLibrary() }; categories.append(button)
    }
    const grid = ui.get('[data-k="assets"]'); grid.replaceChildren()
    for (const [key, prefab] of Object.entries(library)) {
      const info = assetInfo(key)
      if (assetCategory !== 'Todos' && info.category !== assetCategory || !normalized(prefab.title).includes(normalized(assetQuery))) continue
      const card = document.createElement('button'); card.className = 'asset-card'; card.draggable = true; card.dataset.prefab = key
      card.title = `Arraste ${prefab.title} para a cena ou clique para posicionar`; card.style.setProperty('--asset-color', info.color)
      card.innerHTML = `<span class="asset-thumbnail">${icon(info.icon)}</span>`
      const label = document.createElement('span'); label.textContent = prefab.title.replace('forma: ', '').replace('efeito: ', '').replace(' (com fogo e luz)', ''); card.append(label)
      card.classList.toggle('active', key === tool.prefab && tool.kind === 'place')
      card.onclick = () => beginPlacement(key)
      card.ondragstart = event => { if (!event.dataTransfer) return; tool.prefab = key; event.dataTransfer.setData('application/x-ascii-prefab', key); event.dataTransfer.effectAllowed = 'copy'; gizmos?.attach(); refreshHint() }
      card.ondragend = () => { gizmos?.cursor(); ui!.get('#placement-label').hidden = true; if (tool.kind === 'select' && transformMode !== 'hand') gizmos?.attach(selected) }
      grid.append(card)
    }
    if (!grid.childElementCount) { const hint = document.createElement('p'); hint.className = 'empty-library'; hint.textContent = assetCategory === 'Importados' ? 'Use Importar modelo para adicionar seus GLB e GLTF.' : 'Nenhum objeto encontrado.'; grid.append(hint) }
  }
  function refreshTools() {
    if (!ui) return
    if (!library[tool.prefab]) { tool.prefab = 'arvore'; if (tool.kind === 'place') tool.kind = 'select' }
    const layers = box.querySelector<HTMLSelectElement>('[data-k="layer"]')!
    layers.replaceChildren(...(scene.terrain?.data.layers ?? []).map((l, i) => new Option(l.name, String(i))))
    layers.value = String(tool.layer); layers.disabled = !scene.terrain
    box.querySelectorAll<HTMLButtonElement>('[data-brush]').forEach(button => { button.disabled = !scene.terrain; const active = tool.kind === button.dataset.brush; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)) })
    ui.get('[data-k="no-terrain"]').hidden = !!scene.terrain
    ui.get<HTMLSelectElement>('[data-k="weather"]').value = snapshot().environment?.weather ?? 'none'
    ui.get<HTMLSelectElement>('[data-k="atmosphere"]').value = engine.style.atmosphere
    refreshLibrary()
  }
  function syncTransformFields() {
    if (!selected || !ui) return
    for (const [property, label] of [['position', 'Posição'], ['rotation', 'Rotação'], ['scale', 'Escala']] as const) for (const axis of ['x', 'y', 'z'] as const) {
      const input = ui.inspector.querySelector<HTMLInputElement>(`[data-field="${label} ${axis}"]`)
      if (input) input.value = String(Number((selected[property][axis] * (property === 'rotation' ? 180 / Math.PI : 1)).toFixed(3)))
    }
  }
  function refreshHierarchy() {
    if (!hierarchy) return
    const list = hierarchy.querySelector('[data-k="objects"]')!
    list.replaceChildren()
    ui!.get('[data-k="scene-name"]').textContent = name
    ui!.get('[data-k="count"]').textContent = String(scene.placed.length + scene.waters.length + (scene.terrain ? 1 : 0))
    if (scene.terrain && normalized('Terreno').includes(normalized(hierarchyQuery))) {
      const button = document.createElement('button'); button.innerHTML = icon('terrain') + '<span>Terreno</span>'; button.className = 'hierarchy-object terrain-row'
      button.onclick = () => { choose(); ui!.selectPane('terrain') }; list.append(button)
    }
    for (const { object, doc } of scene.placed) {
      const title = object.name || library[doc.prefab].title
      if (!normalized(title).includes(normalized(hierarchyQuery))) continue
      const button = document.createElement('button'); button.innerHTML = icon(assetInfo(doc.prefab).icon)
      const label = document.createElement('span'); label.textContent = title.replace(' (com fogo e luz)', ''); button.append(label)
      button.className = `hierarchy-object${object === selected ? ' active' : ''}${!object.visible ? ' muted' : ''}`; button.dataset.objectId = doc.id
      button.onclick = () => choose(object); button.ondblclick = () => { focus.copy(object.position); focus.y += .8 }; list.append(button)
    }
    scene.waters.forEach((water, i) => {
      const title = `${water.shape.kind === 'pond' ? 'Lago' : 'Riacho'} ${i + 1}`
      if (!normalized(title).includes(normalized(hierarchyQuery))) return
      const button = document.createElement('button'); button.innerHTML = icon('water') + `<span>${title}</span>`
      button.className = `hierarchy-object${selectedWater === i ? ' active' : ''}`; button.onclick = () => { choose(); selectedWater = i; ui!.selectPane('object'); refreshHierarchy() }; list.append(button)
    })
    const inspector = ui!.inspector; inspector.replaceChildren()
    const field = (label: string, value: string, change: (value: string) => void, type = 'number') => {
      const row = document.createElement('label'); row.textContent = label
      const input = document.createElement('input'); input.type = type; input.value = value; input.step = '.1'; input.dataset.field = label
      input.onchange = () => { if (type === 'number' && !Number.isFinite(input.valueAsNumber)) return; run(() => change(input.value)) }; row.append(input); inspector.append(row)
    }
    const actions = document.createElement('div'); actions.className = 'object-actions'
    const button = (label: string, action: () => void | Promise<void>) => { if (!actions.parentNode) inspector.append(actions); const b = document.createElement('button'); b.textContent = label; b.onclick = () => run(action); actions.append(b) }
    if (selected) {
      const object = selected
      field('Nome', object.name, value => { object.name = value; changed() }, 'text')
      const row = document.createElement('label'), visible = document.createElement('input'); row.textContent = 'Visível'; visible.type = 'checkbox'; visible.checked = object.visible
      visible.onchange = () => { object.visible = visible.checked; gizmos?.attach(object.visible ? object : undefined); changed() }; row.append(visible); inspector.append(row)
      const component = document.createElement('div'); component.className = 'component-title'; component.innerHTML = icon('move') + ' Transformação'; inspector.append(component)
      for (const [property, label] of [['position', 'Posição'], ['rotation', 'Rotação'], ['scale', 'Escala']] as const) {
        const row = document.createElement('div'); row.className = 'vector-row'
        const title = document.createElement('span'); title.textContent = label; row.append(title)
        for (const axis of ['x', 'y', 'z'] as const) {
          const cell = document.createElement('label'); cell.className = `axis-${axis}`; cell.textContent = axis.toUpperCase()
          const input = document.createElement('input'); input.type = 'number'; input.step = property === 'rotation' ? '5' : '.1'; input.dataset.field = `${label} ${axis}`; input.setAttribute('aria-label', `${label} ${axis}`)
          input.value = String(Number((object[property][axis] * (property === 'rotation' ? 180 / Math.PI : 1)).toFixed(3)))
          input.onchange = () => {
            const value = input.valueAsNumber
            if (!Number.isFinite(value) || property === 'scale' && (value <= 0 || value > 1000)) { syncTransformFields(); return }
            object[property][axis] = value * (property === 'rotation' ? Math.PI / 180 : 1)
            if (property === 'scale') engine.setInstanceStyle(object, {})
            changed()
          }
          cell.append(input); row.append(cell)
        }
        inspector.append(row)
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
    } else { const hint = document.createElement('p'); hint.className = 'inspector-empty'; hint.innerHTML = icon('cursor') + '<strong>Nenhum objeto selecionado</strong><span>Clique em um objeto na cena para editar suas propriedades.</span><span>Para adicionar: arraste um item da biblioteca abaixo até o mapa.</span>'; inspector.append(hint) }
    if (selected || selectedWater >= 0) button('Excluir [Delete]', removeSelected)
  }

  if (!player) {
    ui = createWorkspace(); toolbar = ui.toolbar; hierarchy = ui.hierarchy; sidebar = ui.sidebar; box = ui.tools
    effectEditor = createEffectEditor(ui.effectRoot, engine, {
      definitions: () => snapshot().effects ?? {},
      position: () => focus.clone().setY(scene.terrain?.heightAt(focus.x, focus.z) ?? 0),
      async save(key, definition) { const doc = snapshot(); doc.effects = { ...doc.effects, [key]: definition }; await replace(doc); changed() },
      place(key) { ui!.showProject('assets'); assetCategory = 'Efeitos'; beginPlacement(key) },
    })
    gizmos = createGizmos(engine, { change: syncTransformFields, commit: changed, allowed: () => !busy && !preview && tool.kind === 'select' && transformMode !== 'hand' })
    const el = <T extends HTMLElement>(key: string) => ui!.get<T>(`[data-k="${key}"]`)
    el<HTMLInputElement>('name').value = name
    el<HTMLInputElement>('name').onchange = e => { name = (e.target as HTMLInputElement).value || 'Sem título'; changed() }
    el('new').onclick = () => run(async () => { await replace(defaultScene()); focus.set(0, .8, 0); setMode('translate'); changed() })
    el('item').onclick = () => run(async () => { await replace(emptyScene('Meu item')); focus.set(0, .8, 0); setMode('translate'); changed() })
    const save = () => downloadDocument(snapshot())
    const exportScene = () => { downloadDocument(snapshot(), 'pomorog.json'); message('Exportado para Pomorog') }
    el('save').onclick = save; el('save-short').onclick = save
    el('export').onclick = exportScene; el('export-short').onclick = exportScene
    el('undo').onclick = () => run(() => undo()); el('redo').onclick = () => run(() => undo(true))
    const opener = el<HTMLInputElement>('open')
    opener.onchange = () => { const file = opener.files?.[0]; opener.value = ''; if (file) run(async () => { await replace(JSON.parse(await file.text())); setMode('translate'); changed() }) }
    el('library').onclick = () => { ui!.showProject('assets'); assetCategory = 'Todos'; assetQuery = ''; el<HTMLInputElement>('asset-search').value = ''; refreshLibrary(); el('asset-search').focus() }
    el('create-effect').onclick = () => { ui!.showProject('effects'); effectEditor!.newEffect() }
    el<HTMLInputElement>('search').oninput = e => { hierarchyQuery = (e.target as HTMLInputElement).value; refreshHierarchy() }
    el<HTMLInputElement>('asset-search').oninput = e => { assetQuery = (e.target as HTMLInputElement).value; refreshLibrary() }
    ui.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => { button.onclick = () => setMode(button.dataset.mode as typeof transformMode) })
    el<HTMLSelectElement>('space').onchange = e => gizmos!.space((e.target as HTMLSelectElement).value as 'world' | 'local')
    el('snap').onclick = () => { const on = el('snap').getAttribute('aria-pressed') !== 'true'; el('snap').setAttribute('aria-pressed', String(on)); el('snap').classList.toggle('active', on); gizmos!.snap(on) }
    el('frame').onclick = () => { focus.copy(selected?.position ?? new THREE.Vector3()); focus.y += .8 }
    el('cancel').onclick = () => setMode('translate')
    el('preview').onclick = () => {
      preview = !preview; document.body.classList.toggle('previewing', preview)
      el('preview').innerHTML = icon(preview ? 'cursor' : 'play') + (preview ? ' Voltar à edição' : ' Prévia')
      for (const panel of [hierarchy, sidebar, ui!.assets, ui!.get('.scene-tools')]) panel.inert = preview
      gizmos!.cursor(); canvas.dispatchEvent(new CustomEvent('editor-preview', { detail: preview })); refreshHint()
    }
    el('pause').onclick = () => { document.querySelector<HTMLButtonElement>('#panel [data-k="pause"]')?.click(); el('pause').classList.toggle('active') }
    const brushes: [Tool, string, string][] = [['raise', 'Elevar', 'terrain'], ['lower', 'Baixar', 'terrain'], ['smooth', 'Suavizar', 'rock'], ['flatten', 'Aplainar', 'grid'], ['paint', 'Pintar', 'cursor'], ['lake', 'Lago', 'water'], ['stream', 'Riacho', 'water'], ['erase', 'Apagar objeto', 'cube']]
    box.innerHTML = `<div class="component-title">${icon('terrain')} Ferramentas de terreno</div><p data-k="no-terrain" class="empty-note" hidden>Este item não tem terreno. Use Arquivo → Novo mapa.</p><div class="brush-grid">${brushes.map(([key, title, symbol]) => `<button data-brush="${key}">${icon(symbol)}${title}</button>`).join('')}</div><label>Raio<input data-k="radius" type="range" min=".5" max="8" step=".25"></label><label>Força<input data-k="strength" type="range" min=".01" max=".4" step=".01"></label><label>Camada<select data-k="layer"></select></label><button data-k="grow">Regerar grama</button><p class="empty-note">Arraste sobre o terreno. Cada traço pode ser desfeito com Ctrl Z.</p>`
    box.querySelectorAll<HTMLButtonElement>('[data-brush]').forEach(button => { button.onclick = () => { tool.kind = button.dataset.brush as Tool; gizmos!.attach(); refreshTools(); refreshHint() } })
    for (const key of ['radius', 'strength'] as const) { const input = el<HTMLInputElement>(key); input.value = String(tool[key]); input.oninput = () => { tool[key] = Number(input.value) } }
    el<HTMLSelectElement>('layer').onchange = e => { tool.layer = Number((e.target as HTMLSelectElement).value) }
    el('grow').onclick = () => run(() => { scene.regrow(); changed() })
    ui.environment.innerHTML = `<div class="component-title">${icon('spark')} Ambiente da cena</div><label>Clima<select data-k="weather"><option value="none">Sem precipitação</option><option value="rain">Chuva</option><option value="snow">Neve</option></select></label><label>Atmosfera<select data-k="atmosphere"><option value="moon">Luar</option><option value="dusk">Entardecer</option><option value="ember">Brasa</option></select></label><p class="empty-note">Configurações salvas junto com o mapa.</p>`
    el<HTMLSelectElement>('weather').onchange = e => run(async () => { const doc = snapshot(); doc.environment = { weather: (e.target as HTMLSelectElement).value as 'none' | 'rain' | 'snow' }; await replace(doc); changed() })
    el<HTMLSelectElement>('atmosphere').onchange = e => { engine.setStyle({ atmosphere: (e.target as HTMLSelectElement).value as 'moon' | 'dusk' | 'ember' }); changed() }
    const modelImport = el<HTMLInputElement>('model-import')
    modelImport.onchange = () => { const files = Array.from(modelImport.files ?? []); modelImport.value = ''; if (files.length) canvas.dispatchEvent(new CustomEvent('editor-import-files', { detail: files })) }
    const insert = el<HTMLInputElement>('insert')
    insert.onchange = () => { const file = insert.files?.[0]; insert.value = ''; if (file) run(async () => {
      const item = parseScene(JSON.parse(await file.text())), doc = snapshot()
      if (item.terrain || item.waters?.length) throw new Error('Para inserir como item, salve um documento sem terreno nem água. Use Abrir para mapas.')
      const remap = new Map(Object.keys(item.assets ?? {}).map(key => [key, `asset-${crypto.randomUUID()}`]))
      for (const [key, asset] of Object.entries(item.assets ?? {})) { doc.assets ??= {}; doc.assets[remap.get(key)!] = asset }
      for (const [key, definition] of Object.entries(item.effects ?? {})) { const id = `fx:custom-${crypto.randomUUID()}`; remap.set(key, id); doc.effects ??= {}; doc.effects[id] = definition }
      for (const object of item.objects) {
        const type = object.options?.type ?? object.prefab, typeStyle = item.style?.types?.[type]
        doc.objects.push({ ...object, id: crypto.randomUUID(), prefab: remap.get(object.prefab) ?? object.prefab,
          position: [object.position[0] + focus.x, object.position[1] + (scene.terrain?.heightAt(focus.x, focus.z) ?? 0), object.position[2] + focus.z],
          options: { ...item.style?.glyphs, ...typeStyle?.style, ...object.options, parts: { ...typeStyle?.parts, ...object.options?.parts } },
        })
      }
      await replace(doc); changed()
    }) }
    refreshTools(); refreshHierarchy(); refreshHistory(); setMode('translate'); message(note || 'Tudo salvo neste navegador')

    const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    let painting = false, strokeChanged = false, flattenHeight = 0
    function groundAt(e: { clientX: number; clientY: number }) {
      const rect = canvas.getBoundingClientRect(); ndc.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1)
      raycaster.setFromCamera(ndc, engine.camera)
      return scene.terrain ? raycaster.intersectObject(scene.terrain.mesh)[0]?.point : raycaster.ray.intersectPlane(plane, new THREE.Vector3())
    }
    canvas.addEventListener('dragover', e => {
      if (!e.dataTransfer?.types.includes('application/x-ascii-prefab') || busy || preview) return
      e.preventDefault(); e.dataTransfer.dropEffect = 'copy'
      const point = groundAt(e); gizmos!.cursor(point ?? undefined)
      const label = ui!.get('#placement-label'); label.hidden = !point; label.textContent = `+ ${library[tool.prefab]?.title ?? 'Objeto'}`; label.style.left = `${e.clientX + 18}px`; label.style.top = `${e.clientY + 18}px`
    }, { signal: signal.signal })
    canvas.addEventListener('dragleave', () => { gizmos!.cursor(); ui!.get('#placement-label').hidden = true }, { signal: signal.signal })
    canvas.addEventListener('drop', e => {
      const key = e.dataTransfer?.getData('application/x-ascii-prefab')
      if (!key || !library[key]) return
      e.preventDefault(); e.stopPropagation(); const point = groundAt(e)
      gizmos!.cursor(); ui!.get('#placement-label').hidden = true
      if (point) run(() => placeAt(key, point))
    }, { signal: signal.signal })
    canvas.addEventListener('pointermove', e => { if (!preview && tool.kind !== 'select' && !e.altKey && e.buttons === 0) { const point = groundAt(e); gizmos!.cursor(point ?? undefined, tool.kind === 'place' ? .44 : tool.radius) } }, { signal: signal.signal })
    canvas.addEventListener('pointerleave', () => gizmos!.cursor(), { signal: signal.signal })
    function act(e: PointerEvent, first: boolean) {
      const p = groundAt(e)
      if (!p) return
      if (first) flattenHeight = p.y
      let kind = tool.kind
      if (e.shiftKey && (kind === 'raise' || kind === 'lower')) kind = kind === 'raise' ? 'lower' : 'raise'
      if (kind === 'place' && first) { placeAt(tool.prefab, p, e.shiftKey); strokeChanged = false }
      else if (kind === 'erase' && first) { const hit = engine.pick(ndc.x, ndc.y); if (hit && scene.placed.some(v => v.object === hit.object)) { scene.remove(hit.object); choose(); strokeChanged = true } }
      else if ((kind === 'lake' || kind === 'stream') && first && scene.terrain) {
        const shape = { kind: kind === 'lake' ? 'pond' as const : 'stream' as const, x: p.x, z: p.z, angle: 0, size: tool.radius }
        const level = scene.terrain.heightAt(p.x, p.z) - .05, data = scene.terrain.toJSON(), { size, resolution } = data
        for (let z = 0; z < resolution; z++) for (let x = 0; x < resolution; x++) {
          const edge = waterEdge(shape, x / (resolution - 1) * size - size / 2, z / (resolution - 1) * size - size / 2)
          if (edge > -.4) data.heights[z * resolution + x] = Math.min(data.heights[z * resolution + x], level - Math.max(0, Math.min(.6, edge * .6 + .1)))
        }
        const doc = snapshot(); doc.terrain = data; doc.waters = [...doc.waters ?? [], { shape, level }]
        run(async () => { await replace(doc); changed() })
      } else if (scene.terrain && !['select', 'place', 'erase', 'lake', 'stream'].includes(kind)) {
        scene.terrain.apply({ brush: kind as Brush, x: p.x, z: p.z, radius: tool.radius, strength: kind === 'paint' ? tool.strength * 4 : tool.strength, layer: tool.layer, height: flattenHeight }); strokeChanged = true
      }
    }
    addEventListener('pointerdown', e => { if (busy || preview || e.altKey || tool.kind === 'select' || e.target !== canvas || e.button !== 0) return; e.stopPropagation(); painting = true; strokeChanged = false; act(e, true) }, { capture: true, signal: signal.signal })
    addEventListener('pointermove', e => { if (painting) { e.stopPropagation(); act(e, false) } }, { capture: true, signal: signal.signal })
    const endStroke = (e: Event) => { if (painting) { e.stopPropagation(); painting = false; if (strokeChanged) { scene.regrow(); changed() } } }
    addEventListener('pointerup', endStroke, { capture: true, signal: signal.signal }); addEventListener('pointercancel', endStroke, { capture: true, signal: signal.signal })
    addEventListener('keydown', e => {
      if (e.target instanceof HTMLElement && (e.target.matches('input,select,textarea') || e.target.isContentEditable)) return
      if (e.key === 'Escape') { if (gizmos?.dragging) gizmos.cancel(); else setMode('translate'); return }
      if (preview || busy) return
      const modifier = e.ctrlKey || e.metaKey
      if (modifier && e.key.toLowerCase() === 'z') { e.preventDefault(); run(() => undo(e.shiftKey)) }
      else if (modifier && e.key.toLowerCase() === 's') { e.preventDefault(); downloadDocument(snapshot()) }
      else if (modifier && e.key.toLowerCase() === 'd') { e.preventDefault(); run(duplicate) }
      else if (!modifier && !e.altKey && ['q', 'w', 'e', 'r'].includes(e.key.toLowerCase())) { e.preventDefault(); setMode(({ q: 'hand', w: 'translate', e: 'rotate', r: 'scale' } as const)[e.key.toLowerCase() as 'q' | 'w' | 'e' | 'r']) }
      else if (e.key === 'Delete') run(removeSelected)
      else if (e.key.toLowerCase() === 'f' && selected) focus.copy(selected.position).add(new THREE.Vector3(0, .8, 0))
    }, { signal: signal.signal })
  }
  return {
    id: 'sandbox', title: 'Editor visual', hero: new THREE.Vector3(100, 0, 100),
    get state() { return `${scene.placed.length} objetos · ${scene.waters.length} águas${busy ? ' · abrindo…' : ''}${note ? ` · ${note}` : ''}` },
    focus: (_angle, target) => target.copy(focus), pan(x, z) { focus.x += x; focus.z += z },
    select: object => choose(object, true), changed, document: snapshot,
    navigation(e) { if (player) return e.button !== 0 || e.shiftKey ? 'pan' : 'orbit'; if (busy || gizmos?.consumed) return false; if (e.altKey && e.button === 0) return 'orbit'; if (e.button !== 0 || e.shiftKey && tool.kind === 'select' || transformMode === 'hand') return 'pan'; return false },
    blocksSelection: () => busy || preview || !!gizmos?.consumed || tool.kind !== 'select' || transformMode === 'hand',
    renderOverlay() { if (!player) gizmos?.render() },
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
      signal.abort(); effectEditor?.dispose(); gizmos?.dispose(); scene.dispose(); assets.dispose()
      ui?.dispose()
    },
  }
}
