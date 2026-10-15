import * as THREE from 'three'
import { textureUsers, GLYPH_STYLE_KEYS, createHistory, parseScene, textureStyle, type AtmosphereStyle, type GlyphStyle, type SceneDoc, type TextureAsset } from '@ascii-engine/core'
import { createTexturePreview } from './texturePreview'
import { alphabetInput, validateAlphabetInput } from './letterControls'
import { atmosphereChoices, fillAtmosphereSelect, matchingAtmosphere } from './atmospheres'
import { GLYPH_FAMILIES, defaultGlyphSize, glyphAlphabet, glyphLabel, modelGlyphColor } from './glyphCatalog'

interface TextureDraft extends TextureAsset { cleared?: (keyof GlyphStyle)[] }
export type TextureScope = 'part' | 'object' | 'type' | 'global'

export function createTextureStudio(root: HTMLElement, callbacks: {
  document(): SceneDoc
  objects(): { id: string; object: THREE.Object3D }[]
  selected(): string | undefined
  select(id: string): void
  save(id: string, asset: TextureAsset): Promise<void>
  apply(id: string, part: string, style: GlyphStyle, scope: TextureScope, textureId?: string): Promise<string[] | void>
  detach(id: string, part?: string): Promise<void>
  remove(id: string): Promise<void>
  type(id: string): string | undefined
  typeName(id: string): string | undefined
  saveLighting(name: string, style: AtmosphereStyle): Promise<void>
  reveal(): void
}) {
  let objectId = '', part = '', draft: TextureDraft = { name: 'My texture', style: {} }, baseline: GlyphStyle = {}
  let initialLayer: GlyphStyle = {}
  let scope: TextureScope = 'object', assetOnly = false, recipeDraft = false
  const touched = new Set<keyof GlyphStyle>()
  let selectedKey: string | undefined, active = false, saving = false
  const abort = new AbortController(), history = createHistory(draft, 60), stage = createTexturePreview(selectPart)
  root.innerHTML = `<div class="fx-heading"><h2>Create texture</h2><p>Select an object or part, adjust its letters and save a reusable appearance.</p></div>
    <fieldset class="texture-target"><legend>Preview object</legend><label>Object<select data-texture="object" aria-label="Texture object"></select></label><label>Part<select data-texture="part" aria-label="Texture part"></select></label><label>Apply to<select data-texture="scope" aria-label="Texture scope"></select></label><p class="empty-note">Edits appear in the isolated preview. Apply when ready to update the scene.</p></fieldset>
    <label class="fx-name">Texture name<input data-texture="name" aria-label="Texture name" value="My texture"></label>
    <div class="fx-toolbar"><select data-texture="asset" aria-label="Saved texture"></select><button data-texture="reset">Reset edits</button><button data-texture="undo" aria-label="Undo texture edit">↶</button><button data-texture="redo" aria-label="Redo texture edit">↷</button></div>
    <p class="fx-status" role="status">Choose an object to begin.</p><nav class="texture-controls-nav" aria-label="Texture controls"></nav><div class="fx-fields studio-fields texture-fields"></div>
    <details class="fx-files"><summary>Import or download file</summary><button data-texture="export">Download texture</button><label class="file">Open texture<input data-texture="import" type="file" accept=".json" hidden></label></details>
    <footer class="studio-save"><span data-texture="saved-note">Not yet saved to Assets</span><p data-texture="users"></p><div><button data-texture="detach">Detach target</button><button data-texture="delete">Delete asset</button><button data-texture="apply" class="primary">Apply to object</button><button data-texture="save">Save to Assets</button><button data-texture="copy">Save copy</button><button data-texture="reveal">Show in Assets</button></div></footer>`
  const get = <T extends HTMLElement = HTMLElement>(key: string) => root.querySelector<T>(`[data-texture="${key}"]`)!
  const status = (message: string) => { root.querySelector('.fx-status')!.textContent = message }
  const target = () => callbacks.objects().find(item => item.id === objectId)?.object
  const asset = (): TextureAsset => ({ name: draft.name, style: textureStyle(draft.style), ...(draft.previewLighting ? { previewLighting: structuredClone(draft.previewLighting) } : {}) })
  function previewStyle(): GlyphStyle {
    const patch: GlyphStyle = { ...draft.style, ...Object.fromEntries((draft.cleared ?? []).map(key => [key, undefined])) }
    for (const key of touched) if (!(key in patch)) Object.assign(patch, { [key]: initialLayer[key] })
    if (selectedKey || recipeDraft) return patch
    const edits = Object.fromEntries([...touched].filter(key => key in patch).map(key => [key, patch[key]]))
    return scope === 'type' || scope === 'global' ? edits : { gap: 0, ...edits }
  }
  function applyPreview(nextPart: string, style: GlyphStyle, nextScope: TextureScope) { stage.apply(nextPart, style, nextScope, (nextScope === 'object' || nextScope === 'part') ? selectedKey : undefined) }
  function beginEdits() {
    touched.clear()
    const options = callbacks.document().objects.find(item => item.id === objectId)?.options
    const type = callbacks.document().style?.types?.[callbacks.type(objectId) ?? '']
    initialLayer = textureStyle(scope === 'global' ? callbacks.document().style?.glyphs ?? {} : scope === 'type' ? (part ? type?.parts?.[part] : type?.style) ?? {} : (part ? options?.parts?.[part] : options) ?? {})
  }
  function clear(key: keyof GlyphStyle) { touched.add(key); delete draft.style[key]; draft.cleared = [...new Set([...(draft.cleared ?? []), key])] }
  function retain(key: keyof GlyphStyle) { touched.add(key); draft.cleared = draft.cleared?.filter(field => field !== key) }
  function startingStyle() {
    const style = structuredClone(baseline)
    // Carry ink settings across shapes while each part keeps its declaration.
    // Technique/family enter a reusable recipe only when explicitly chosen.
    delete style.glyph; delete style.surface
    return style
  }

  function appearance() {
    if (scope === 'global') return textureStyle(callbacks.document().style?.glyphs ?? {})
    const object = target(), node = part ? object?.getObjectByName(part) : object
    const styles: GlyphStyle[] = []
    node?.traverse(child => { if (child instanceof THREE.Mesh && child.userData.glyphResolved) styles.push(child.userData.glyphResolved) })
    const common: GlyphStyle = {}
    if (styles.length) for (const key of GLYPH_STYLE_KEYS) { const value = styles[0][key]; if (styles.every(s => JSON.stringify(s[key]) === JSON.stringify(value))) Object.assign(common, { [key]: value }) }
    // The texture module authors world-attached mesh techniques.
    if (common.glyph && !['surface', 'body', 'screen'].includes(common.glyph)) delete common.glyph
    return { ...textureStyle(common), gap: 0 }
  }
  function savedNote() {
    root.querySelector('h2')!.textContent = selectedKey ? `Edit texture: ${draft.name}` : 'New texture'
    const saved = selectedKey ? callbacks.document().textures?.[selectedKey] : undefined
    get('saved-note').textContent = saved && JSON.stringify(saved) === JSON.stringify(asset()) ? 'Saved in Assets → Textures' : 'Changes not yet saved to Assets'
    get<HTMLButtonElement>('reveal').disabled = !saved
    get<HTMLButtonElement>('undo').disabled = !history.canUndo; get<HTMLButtonElement>('redo').disabled = !history.canRedo
    get<HTMLButtonElement>('apply').disabled = (scope !== 'global' && !target()) || saving
    const users = selectedKey ? textureUsers(callbacks.document(), selectedKey) : []
    get('users').textContent = selectedKey ? `Used by ${users.length} objects${users.length ? ': ' + users.map(item => item.name ?? item.id).join(', ') : ''}` : ''
    get<HTMLButtonElement>('delete').disabled = !saved || saving
    const options = callbacks.document().objects.find(item => item.id === objectId)?.options
    get<HTMLButtonElement>('detach').disabled = scope === 'type' || scope === 'global' || !(scope === 'part' ? options?.parts?.[part]?.texture : options?.texture || Object.values(options?.parts ?? {}).some(part => part.texture))
    get('apply').textContent = scope === 'global' ? 'Apply globally' : scope === 'type' ? 'Apply to every copy' : scope === 'part' ? 'Apply to part' : 'Apply to object'
  }
  function edited(commit = true) {
    if (commit) history.commit(draft)
    applyPreview(scope === 'object' ? '' : part, previewStyle(), scope); stage.setLighting(draft.previewLighting); savedNote()
    status('Preview updated. Apply to update the selected object; Save to Assets keeps a reusable texture.')
  }
  function refreshTargets() {
    const objects = get<HTMLSelectElement>('object'); objects.replaceChildren(new Option('No target · editing asset only', ''))
    for (const item of callbacks.objects()) objects.append(new Option(item.object.name || item.id, item.id))
    objects.value = objectId
    const parts = get<HTMLSelectElement>('part'); parts.replaceChildren(new Option('Whole object · preserve mixed techniques', ''))
    const names = new Set<string>(), object = target()
    object?.traverse(node => {
      if (node === object || !node.name || node instanceof THREE.Bone || node.userData.glyphBodyOf || node.userData.editorOnly) return
      let containsMesh = false; node.traverse(child => { if (child instanceof THREE.Mesh) containsMesh = true })
      if (containsMesh) names.add(node.name)
    })
    names.forEach(name => parts.append(new Option(glyphLabel(name), name))); parts.value = part
    const scopes = get<HTMLSelectElement>('scope'), type = callbacks.type(objectId)
    scopes.replaceChildren(new Option('This part', 'part'), new Option('This object', 'object'), new Option(`Every ${callbacks.typeName(objectId) ?? 'object of this type'}${part ? ` · ${glyphLabel(part)}` : ''}`, 'type'), new Option('Global style', 'global'))
    scopes.options[0].disabled = !part; scopes.options[2].disabled = !type
    if (scope === 'part' && !part || scope === 'type' && !type) scope = 'object'
    scopes.value = scope
    const assets = get<HTMLSelectElement>('asset'); assets.replaceChildren(new Option('Open a saved texture…', ''))
    for (const [id, asset] of Object.entries(callbacks.document().textures ?? {})) assets.append(new Option(asset.name, id))
    assets.value = selectedKey ?? ''
  }
  function render() {
    refreshTargets(); savedNote(); get<HTMLInputElement>('name').value = draft.name
    const fields = root.querySelector('.texture-fields')!; fields.replaceChildren()
    const navigation = root.querySelector('.texture-controls-nav')!; navigation.replaceChildren()
    const effective = { ...baseline, ...previewStyle() }
    function group(title: string, hint?: string) {
      const box = document.createElement('fieldset'), legend = document.createElement('legend'); legend.textContent = title; box.append(legend)
      if (hint) { const note = document.createElement('p'); note.className = 'empty-note'; note.textContent = hint; box.append(note) }
      box.dataset.textureSection = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const jump = document.createElement('button'); jump.textContent = title; jump.dataset.textureJump = box.dataset.textureSection
      jump.onclick = () => box.scrollIntoView({ block: 'start', behavior: 'smooth' }); navigation.append(jump)
      fields.append(box); return box
    }
    function select(box: HTMLElement, label: string, key: 'glyph' | 'surface' | 'faces' | 'lighting' | 'fontWeight', choices: [string, string][]) {
      const row = document.createElement('label'); row.textContent = label
      const input = document.createElement('select'); input.dataset.textureField = key; input.setAttribute('aria-label', label)
      const current = choices.find(([id]) => id === String(baseline[key]))?.[1] ?? 'mixed parts'
      input.append(new Option(`Keep current · ${current}`, ''))
      choices.forEach(([id, name]) => input.append(new Option(name, id))); input.value = String(draft.style[key] ?? '')
      input.onchange = () => { if (input.value) { retain(key); Object.assign(draft.style, { [key]: key === 'fontWeight' ? Number(input.value) : input.value }) } else { retain(key); delete draft.style[key] } edited(); render() }
      row.append(input); box.append(row)
    }
    function slider(box: HTMLElement, key: 'size' | 'spacing' | 'density' | 'strength' | 'contrast' | 'toneOffset' | 'shadowSteps' | 'rotation' | 'gap' | 'emissiveIntensity', label: string, fallback: number, min: number, max: number, step: number) {
      const row = document.createElement('label'); row.className = 'texture-slider'; row.textContent = label
      const input = document.createElement('input'), output = document.createElement('input')
      input.type = 'range'; output.type = 'number'; input.dataset.textureField = key; output.dataset.textureNumber = key
      input.setAttribute('aria-label', label); output.setAttribute('aria-label', label + ' value')
      for (const field of [input, output]) { field.min = String(min); field.max = String(max); field.step = String(step) }
      output.max = key === 'size' ? '10' : String(max)
      const current = key === 'rotation' ? (effective.rotation ?? 0) * 180 / Math.PI : effective[key] ?? fallback
      input.max = String(Math.max(max, current))
      input.value = output.value = String(Number(current.toFixed(4)))
      const update = (source: HTMLInputElement, commit: boolean) => {
        if (!source.checkValidity()) return
        touched.add(key); draft.style[key] = key === 'rotation' ? source.valueAsNumber * Math.PI / 180 : source.valueAsNumber; input.max = String(Math.max(max, source.valueAsNumber)); input.value = output.value = source.value; edited(commit)
      }
      input.oninput = () => update(input, false); input.onchange = () => update(input, true)
      output.oninput = () => update(output, false); output.onchange = () => update(output, true)
      row.append(output, input); box.append(row)
    }
    const letters = group('Letters', 'Characters run from sparse to dense. A whole-object edit keeps different part techniques unless you choose one.')
    select(letters, 'Technique', 'glyph', ['surface', 'body', 'screen'].map(key => [key, glyphLabel(key)]))
    select(letters, 'Glyph family', 'surface', GLYPH_FAMILIES.map(key => [key, glyphLabel(key)]))
    const alphabetRow = document.createElement('label'); alphabetRow.textContent = 'Custom alphabet'
    const alphabet = alphabetInput(effective.alphabet, 'Use family letters'); alphabet.dataset.textureField = 'alphabet'; alphabet.setAttribute('aria-label', 'Custom alphabet')
    alphabet.value = effective.alphabet ?? ''; alphabet.placeholder = 'Use family letters'; alphabet.spellcheck = false
    alphabet.oninput = () => {
      validateAlphabetInput(alphabet)
      if (!alphabet.checkValidity()) { status(alphabet.validationMessage); return }
      if (alphabet.value) { retain('alphabet'); draft.style.alphabet = alphabet.value } else clear('alphabet')
      edited(false); updateRamp()
    }
    alphabet.onchange = () => { if (alphabet.reportValidity()) edited() }; alphabetRow.append(alphabet); letters.append(alphabetRow)
    const ramp = document.createElement('pre'); ramp.className = 'texture-ramp'; ramp.setAttribute('aria-label', 'Texture letters'); letters.append(ramp)
    function updateRamp() { ramp.textContent = glyphAlphabet({ ...baseline, ...previewStyle() }) }
    updateRamp()
    const patterns = document.createElement('div'); patterns.className = 'texture-patterns'
    for (const [name, letters] of [['Shading', ' .:-=+*#@'], ['Letters', ' .abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'], ['Digits', ' 0123456789'], ['Binary', ' 01'], ['Blocks', ' ░▒▓█'], ['Arrows', ' ·↑↗→↘↓↙←↖']]) {
      const button = document.createElement('button'); button.textContent = name; button.dataset.texturePattern = name.toLowerCase()
      button.onclick = () => { retain('alphabet'); draft.style.alphabet = letters; edited(); render() }; patterns.append(button)
    }
    letters.append(patterns)
    const fontRow = document.createElement('label'); fontRow.textContent = 'Font family'
    const font = document.createElement('input'); font.type = 'text'; font.maxLength = 100; font.dataset.textureField = 'font'; font.setAttribute('aria-label', 'Font family')
    font.value = effective.font ?? ''; font.placeholder = '"Courier New", monospace'; font.setAttribute('list', 'texture-fonts')
    const fonts = document.createElement('datalist'); fonts.id = 'texture-fonts'
    for (const value of ['"Courier New", monospace', '"DejaVu Sans Mono", monospace', '"DejaVu Sans", sans-serif', 'Georgia, serif', 'monospace']) fonts.append(new Option(value, value))
    font.oninput = () => { if (font.value.trim()) { retain('font'); draft.style.font = font.value } else clear('font'); edited(false) }
    font.onchange = () => edited(); fontRow.append(font, fonts); letters.append(fontRow)
    const fontNote = document.createElement('p'); fontNote.className = 'empty-note'; fontNote.textContent = 'Uses fonts installed on the viewing device. Missing fonts use the fallback family.'; letters.append(fontNote)
    select(letters, 'Font weight', 'fontWeight', [['400', 'Regular'], ['700', 'Bold']])
    const visibility = group('Letter visibility', 'Letters only removes the solid body and lets the world behind show through the gaps.')
    const visibilityRow = document.createElement('label'); visibilityRow.textContent = 'Body between letters'
    const body = document.createElement('select'); body.dataset.textureField = 'open'; body.setAttribute('aria-label', 'Body between letters')
    body.append(new Option('Keep object recipe', ''), new Option('Letters only · no solid body', 'true'), new Option('Dark occluder', 'false')); body.value = effective.open === undefined ? '' : String(effective.open)
    body.onchange = () => { retain('open'); if (body.value) draft.style.open = body.value === 'true'; else delete draft.style.open; edited(); render() }; visibilityRow.append(body); visibility.append(visibilityRow)
    select(visibility, 'Body faces', 'faces', [['front', 'Front faces'], ['both', 'Front and back faces']])
    slider(visibility, 'gap', 'Gap tint (surface)', 0, 0, .015, .001)
    const surfaceNote = document.createElement('p'); surfaceNote.className = 'empty-note'; surfaceNote.textContent = 'Gap tint affects surfaces with an occluder. Body faces affects glyph bodies.'; visibility.append(surfaceNote)
    const layout = group('Size and spacing', 'World meters keep letters attached to the object as the camera moves.')
    const size = defaultGlyphSize(effective)
    slider(layout, 'size', 'Letter size (m)', size, .01, 1, .01)
    if (effective.glyph === 'screen') {
      layout.querySelectorAll<HTMLInputElement>('[data-texture-field=size],[data-texture-number=size]').forEach(input => input.disabled = true)
      const note = document.createElement('p'); note.className = 'empty-note'; note.textContent = 'Screen letter size uses scene cell size in Atmosphere.'; layout.append(note)
    }
    slider(layout, 'spacing', 'Spacing', 1, .5, 4, .05); slider(layout, 'density', 'Density', 1, .05, 1, .05)
    slider(layout, 'rotation', 'Letter rotation (degrees)', 0, -180, 180, 1)
    const ink = group('Ink and contrast')
    const colorRow = document.createElement('label'); colorRow.textContent = 'Glyph color'
    const color = document.createElement('input'); color.type = 'color'; color.dataset.textureField = 'color'; color.setAttribute('aria-label', 'Texture color')
    const object = target(), node = part ? object?.getObjectByName(part) : object
    color.value = '#' + (effective.color ?? modelGlyphColor(node)).toString(16).padStart(6, '0')
    color.disabled = !!effective.palette
    color.oninput = () => { retain('color'); draft.style.color = parseInt(color.value.slice(1), 16); edited(false) }; color.onchange = () => edited()
    const inherit = document.createElement('button'); inherit.textContent = 'Model color'; inherit.dataset.texture = 'model-color'
    inherit.onclick = () => { clear('color'); edited(); render() }; colorRow.append(color, inherit); ink.append(colorRow)
    slider(ink, 'strength', 'Ink strength', 1, 0, 4, .05); slider(ink, 'contrast', 'Contrast', 1, .1, 4, .05)
    slider(ink, 'toneOffset', 'Light threshold', 0, -1, 1, .05); slider(ink, 'shadowSteps', 'Shadow levels', 6, 2, 16, 1)
    const palette = group('Color palette', 'Replaces the base glyph color. Colors run from shadow to light; each letter keeps one flat color.')
    const paletteToggle = document.createElement('label'); paletteToggle.textContent = 'Use palette'
    const paletteEnabled = document.createElement('input'); paletteEnabled.type = 'checkbox'; paletteEnabled.checked = !!draft.style.palette; paletteEnabled.dataset.textureField = 'palette-enabled'
    paletteEnabled.onchange = () => { retain('palette'); if (paletteEnabled.checked) draft.style.palette = [0x315d76, 0xa9e1d0]; else clear('palette'); edited(); render() }; paletteToggle.append(paletteEnabled); palette.append(paletteToggle)
    for (const [index, value] of (draft.style.palette ?? []).entries()) {
      const row = document.createElement('label'); row.textContent = `${index + 1} · ${index === 0 ? 'Shadow' : index === draft.style.palette!.length - 1 ? 'Light' : 'Midtone'}`
      const input = document.createElement('input'); input.type = 'color'; input.value = '#' + value.toString(16).padStart(6, '0'); input.dataset.texturePalette = String(index)
      input.oninput = () => { draft.style.palette![index] = parseInt(input.value.slice(1), 16); edited(false) }; input.onchange = () => edited(); row.append(input); palette.append(row)
    }
    if (draft.style.palette) for (const [name, op] of [['Add color', 1], ['Remove color', -1]] as const) {
      const button = document.createElement('button'); button.textContent = name; button.dataset.texturePaletteAction = String(op)
      button.disabled = op > 0 ? draft.style.palette.length >= 8 : draft.style.palette.length <= 2
      button.onclick = () => { if (op > 0) draft.style.palette!.push(draft.style.palette!.at(-1)!); else draft.style.palette!.pop(); edited(); render() }; palette.append(button)
    }
    const response = group('Material lighting', 'Self light makes letters glow; use scene lights to illuminate other objects.')
    select(response, 'Lighting response', 'lighting', [['scene', 'React to scene lights'], ['unlit', 'Uniform local shading']])
    const glowRow = document.createElement('label'); glowRow.textContent = 'Self light color'
    const glow = document.createElement('input'); glow.type = 'color'; glow.dataset.textureField = 'emissive'; glow.value = '#' + (effective.emissive ?? 0).toString(16).padStart(6, '0'); glow.setAttribute('aria-label', 'Self light color')
    glow.oninput = () => { retain('emissive'); draft.style.emissive = parseInt(glow.value.slice(1), 16); edited(false) }; glow.onchange = () => edited(); glowRow.append(glow); response.append(glowRow)
    slider(response, 'emissiveIntensity', 'Self light intensity', 1, 0, 4, .05)
    renderLighting(group('Preview lighting', 'Choose current scene lighting, a built-in preset or a saved atmosphere. The map stays unchanged.'))
    if (effective.glyph === 'screen') {
      fields.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-texture-field]').forEach(input => {
        if (!['glyph', 'surface', 'color', 'emissive', 'emissiveIntensity'].includes(input.dataset.textureField!)) input.disabled = true
      })
      fields.querySelectorAll<HTMLInputElement>('[data-texture-number],[data-texture-palette]').forEach(input => input.disabled = true)
      const note = document.createElement('p'); note.className = 'empty-note'; note.textContent = 'Character screen rendering uses the legacy atlas. Custom alphabets, fonts and world-letter controls apply to surface/body techniques.'; letters.append(note)
    }
  }
  function renderLighting(box: HTMLElement) {
    const row = document.createElement('label'); row.textContent = 'Preview atmosphere'
    const select = document.createElement('select'); select.dataset.texture = 'preview-atmosphere'
    const doc = callbacks.document(), value = draft.previewLighting ? matchingAtmosphere(doc, draft.previewLighting) ?? 'legacy' : 'current'
    fillAtmosphereSelect(select, doc, value, value === 'legacy')
    select.onchange = () => { if (select.value === 'legacy') return; const choice = atmosphereChoices(doc).find(choice => choice.id === select.value); if (choice) draft.previewLighting = structuredClone(choice.style); else delete draft.previewLighting; edited(); render() }
    row.append(select); box.append(row)
    if (value === 'legacy') {
      const convert = document.createElement('button'); convert.textContent = 'Save as atmosphere'; convert.dataset.texture = 'convert-lighting'
      convert.onclick = async () => { convert.disabled = true; try { await callbacks.saveLighting(draft.name.trim() + ' lighting', draft.previewLighting!); render(); status('Preview lighting saved as an atmosphere. Edit its lights in Atmosphere Studio.') } catch (error) { status(String(error)); convert.disabled = false } }
      box.append(convert)
    }

    const hint = document.createElement('p'); hint.className = 'empty-note'
    hint.textContent = 'Preview only. Edit lights in Atmosphere Studio; apply scene lighting from Environment.'
    box.append(hint)
  }
  async function showObject(id: string, nextPart = '') {
    assetOnly = false; recipeDraft = false; objectId = id; part = nextPart; scope = part ? 'part' : 'object'; baseline = appearance(); beginEdits(); draft = { name: 'My texture', style: startingStyle() }
    selectedKey = part ? callbacks.document().objects.find(item => item.id === id)?.options?.parts?.[part]?.texture : callbacks.document().objects.find(item => item.id === id)?.options?.texture; if (selectedKey) { draft = structuredClone(callbacks.document().textures![selectedKey]); recipeDraft = true } history.reset(draft); render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting)
    if (active) await stage.show(callbacks.document(), objectId)
    status(target() ? 'Adjust the letters in the preview, then apply or save.' : 'Add or import an object in the scene, then select it here.')
  }
  function selectPart(value: string) { part = value; if (scope !== 'type' && scope !== 'global') scope = part ? 'part' : 'object'; baseline = appearance(); beginEdits(); if (!selectedKey && !recipeDraft) draft.style = startingStyle(); draft.cleared = []; history.reset(draft); render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting) }
  function undo(redo = false) { const next = redo ? history.redo() : history.undo(); if (next) { draft = next; render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting) } }
  function editAsset(key: string, withoutTarget = false) { const asset = callbacks.document().textures?.[key]; if (!asset) return; recipeDraft = true; if (withoutTarget) { assetOnly = true; objectId = ''; part = ''; scope = 'object' } selectedKey = key; beginEdits(); baseline = appearance(); draft = structuredClone(asset); history.reset(draft); render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting); if (active && withoutTarget) void stage.show(callbacks.document()); status('Saved texture opened. Choose a target to apply, or edit this asset only.') }
  async function save(copy = false) {
    if (saving) return
    draft.name = get<HTMLInputElement>('name').value.trim()
    if (!draft.name) { status('Name the texture before saving.'); get('name').focus(); return }
    try {
      parseScene({ version: 1, objects: [], textures: { draft: asset() } }); saving = true; root.querySelectorAll<HTMLButtonElement>('.studio-save button').forEach(button => button.disabled = true)
      const id = !copy && selectedKey ? selectedKey : `texture-${crypto.randomUUID()}`
      await callbacks.save(id, asset()); selectedKey = id; refreshTargets(); status('Saved to Assets → Textures. Select an object and open the texture to reuse it.')
    } catch (error) { status(String(error)) }
    finally { saving = false; root.querySelectorAll<HTMLButtonElement>('.studio-save button').forEach(button => button.disabled = false); savedNote() }
  }
  async function apply() {
    if (scope !== 'global' && !target() || saving) return
    try { parseScene({ version: 1, objects: [], textures: { draft: asset() } }); const linkedId = scope === 'object' || scope === 'part' ? selectedKey : undefined; if (linkedId) await callbacks.save(linkedId, asset()); const replaced = await callbacks.apply(objectId, scope === 'object' ? '' : part, previewStyle(), scope, linkedId); stage.commit(); status('Texture applied.' + (replaced?.length ? ' Replaced local fields: ' + replaced.join(', ') + '.' : '') + ' Ctrl Z in the scene undoes the change.') }
    catch (error) { status(String(error)) }
  }
  get<HTMLSelectElement>('object').onchange = e => { const id = (e.target as HTMLSelectElement).value; callbacks.select(id); if (assetOnly) { assetOnly = false; objectId = id; baseline = appearance(); beginEdits(); render(); void stage.show(callbacks.document(), id); applyPreview(part, previewStyle(), scope) } else void showObject(id) }
  get<HTMLSelectElement>('scope').onchange = e => { scope = (e.target as HTMLSelectElement).value as TextureScope; baseline = appearance(); beginEdits(); if (!selectedKey && !recipeDraft) draft.style = startingStyle(); draft.cleared = []; history.reset(draft); render(); applyPreview(part, previewStyle(), scope) }
  get<HTMLSelectElement>('part').onchange = e => selectPart((e.target as HTMLSelectElement).value)
  get<HTMLSelectElement>('asset').onchange = e => editAsset((e.target as HTMLSelectElement).value)
  get<HTMLInputElement>('name').oninput = () => { draft.name = get<HTMLInputElement>('name').value; savedNote() }; get<HTMLInputElement>('name').onchange = () => history.commit(draft)
  get('reset').onclick = () => { draft.style = startingStyle(); draft.cleared = []; edited(); render() }
  get('undo').onclick = () => undo(); get('redo').onclick = () => undo(true)
  get('detach').onclick = async () => { try { await callbacks.detach(objectId, scope === 'part' ? part : undefined); baseline = appearance(); beginEdits(); render(); status('Detached: the appearance is now a local snapshot.'); if (active) await stage.show(callbacks.document(), objectId) } catch (error) { status(String(error)) } }
  get('delete').onclick = async () => { if (!selectedKey) return; const count = textureUsers(callbacks.document(), selectedKey).length; if (!confirm(count ? `Delete this texture and detach its ${count} users, preserving their appearance?` : 'Delete this texture asset?')) return; try { await callbacks.remove(selectedKey); selectedKey = undefined; render(); status('Texture deleted. Its users retain their appearance.') } catch (error) { status(String(error)) } }
  get('apply').onclick = () => { void apply() }; get('save').onclick = () => { void save() }; get('copy').onclick = () => { void save(true) }; get('reveal').onclick = callbacks.reveal
  get('export').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, name: draft.name, texture: textureStyle(draft.style), ...(draft.previewLighting ? { previewLighting: draft.previewLighting } : {}) }, null, 2)], { type: 'application/json' })), link = document.createElement('a')
    link.href = url; link.download = 'my.texture.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  get<HTMLInputElement>('import').onchange = async e => {
    const input = e.target as HTMLInputElement, file = input.files?.[0]; input.value = ''; if (!file) return
    try {
      const content = JSON.parse(await file.text()); if (content.version !== 1 || !content.texture) throw new Error('Invalid texture file.')
      const asset = { name: typeof content.name === 'string' ? content.name : file.name, style: content.texture, ...(content.previewLighting ? { previewLighting: content.previewLighting } : {}) }
      parseScene({ version: 1, objects: [], textures: { imported: asset } }); beginEdits(); recipeDraft = true; draft = asset; selectedKey = undefined; history.reset(draft); render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting); status('Texture opened. Apply to the selection or save to Assets.')
    } catch (error) { status(String(error)) }
  }
  addEventListener('keydown', event => {
    if (!active || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z' || event.target instanceof HTMLElement && event.target.matches('input,textarea')) return
    event.preventDefault(); event.stopImmediatePropagation(); undo(event.shiftKey)
  }, { signal: abort.signal })
  root.closest('#editor-workspace')!.addEventListener('project-tab', event => {
    active = (event as CustomEvent).detail === 'textures'
    if (active) {
      if (assetOnly) { render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting); void stage.show(callbacks.document()); return }
      const id = assetOnly ? '' : callbacks.selected() ?? objectId
      if (id !== objectId || !target()) void showObject(id)
      else { render(); applyPreview(part, previewStyle(), scope); stage.setLighting(draft.previewLighting); void stage.show(callbacks.document(), objectId) }
    } else stage.hide()
  }, { signal: abort.signal })
  render()
  return { save, apply, editAsset, frame: stage.frame, capture: stage.capture,
    open(id?: string, nextPart = '') { void showObject(id ?? callbacks.selected() ?? objectId, nextPart) },
    refresh() { refreshTargets(); savedNote(); if (active) void stage.show(callbacks.document(), objectId) },
    dispose() { abort.abort(); stage.dispose() },
  }
}
