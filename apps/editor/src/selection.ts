import * as THREE from 'three'
import type { AsciiEngine, GlyphKind, GlyphStyle, SurfaceKind } from '@ascii-engine/core'
import { GLYPH_FAMILIES, defaultGlyphSize, glyphAlphabet, glyphLabel, modelGlyphColor } from './editor/glyphCatalog'

/**
 * Part selection (§3.1, phase 4): a click selects the part under the cursor,
 * a second click (or Esc) climbs to the whole object. The panel shows the
 * resolved style and saves a change where the user chooses: this instance
 * only, this part in every object of the type, or the global style.
 */
const KINDS: GlyphKind[] = ['surface', 'body', 'screen']

export function createSelection(engine: AsciiEngine, canvas: HTMLCanvasElement, root: HTMLElement, callbacks: { select?: (object?: THREE.Object3D) => void; changed?: () => void; blocked?: () => boolean; objectFirst?: boolean } = {}) {
  let selected: Omit<NonNullable<ReturnType<AsciiEngine['pick']>>, 'node'> & { node: THREE.Object3D; level: 'part' | 'object' } | undefined
  const edited = new Set<keyof GlyphStyle>()
  let inheritColor = true
  const box = new THREE.Box3Helper(new THREE.Box3(), 0xd3b27c)
  box.userData.editorOnly = true
  box.visible = false; engine.particleScene.add(box)
  root.innerHTML = `
    <strong>ASCII appearance</strong><div data-k="what">click a scene part</div>
    <label>part <select data-k="part"></select></label>
    <label>Technique <select data-k="glyph"><option value="">Mixed / inherit</option>${KINDS.map((k) => `<option value="${k}">${glyphLabel(k)}</option>`).join('')}</select></label>
    <label>Glyph family <select data-k="surface"><option value="">Model default / mixed</option>${GLYPH_FAMILIES.map((k) => `<option value="${k}">${glyphLabel(k)}</option>`).join('')}</select></label>
    <div data-k="letters" class="glyph-letters"></div>
    <label>Size (m) <input data-k="size" type="number" min=".01" max="10" step=".01" placeholder="(inherit)"></label>
    <label>Color <span class="glyph-color"><input data-k="color" type="color" aria-label="Glyph color"><button data-k="inherit-color" title="Use the original model color">Model color</button></span></label>
    <label>save to <select data-k="scope">
      <option value="instance">this instance</option>
      <option value="type">this part in every object of this type</option>
      <option value="global">global style</option>
    </select></label>
    <button data-k="apply">Apply appearance</button>
    <div data-k="help" class="glyph-help">Family changes the letters. Color changes their color.</div>`
  const el = <T extends HTMLElement>(k: string) => root.querySelector<T>(`[data-k="${k}"]`)!
  const what = el<HTMLDivElement>('what')
  root.hidden = true

  function appearance(target: THREE.Object3D) {
    const styles: GlyphStyle[] = []
    target.traverse(node => {
      if (node instanceof THREE.Mesh && node.userData.glyphResolved) styles.push(node.userData.glyphResolved as GlyphStyle)
    })
    if (!styles.length) styles.push(selected?.style ?? {})
    const common: GlyphStyle = {}
    for (const key of ['glyph', 'surface', 'size', 'color'] as const) {
      const value = styles[0][key]
      if (styles.every(style => style[key] === value)) Object.assign(common, { [key]: value })
    }
    return { common, mixedSize: styles.some(style => style.size !== styles[0].size) }
  }

  function hints() {
    const glyph = el<HTMLSelectElement>('glyph').value
    const family = el<HTMLSelectElement>('surface').value
    el('letters').textContent = glyphAlphabet({ glyph: glyph as GlyphKind, surface: (family || undefined) as SurfaceKind | undefined })
    el<HTMLInputElement>('size').disabled = glyph === 'screen'
    el('help').textContent = glyph === 'screen' ? 'Screen letter size is controlled by Display. Family changes the letters.' : 'Size is in world meters. Family changes the letters; Color changes their color.'
  }

  function show() {
    edited.clear()
    if (!selected) { box.visible = false; root.hidden = true; return }
    root.hidden = false
    const target = selected.level === 'part' ? selected.node : selected.object
    box.box.setFromObject(target); box.visible = true
    const { common: style, mixedSize } = appearance(target)
    selected.style = style
    const parts = el<HTMLSelectElement>('part')
    parts.replaceChildren(new Option('Whole object', ''))
    const names = new Set<string>()
    selected.object.traverse(node => {
      if (node === selected!.object || !node.name || node instanceof THREE.Bone || node.userData.glyphBodyOf || node.userData.editorOnly) return
      let containsMesh = false
      node.traverse(child => { if (child instanceof THREE.Mesh) containsMesh = true })
      if (containsMesh) names.add(node.name)
    })
    names.forEach(name => parts.append(new Option(glyphLabel(name), name)))
    parts.value = selected.level === 'part' ? selected.part ?? '' : ''
    what.textContent = selected.level === 'part' && selected.part ? `part "${selected.part}" · ${selected.object.name}` : `object "${selected.object.name || selected.object.type}"`
    el<HTMLSelectElement>('glyph').value = style.glyph ?? ''
    el<HTMLSelectElement>('surface').value = style.surface ?? ''
    el<HTMLInputElement>('size').value = style.size ? String(style.size) : ''
    const defaultSize = defaultGlyphSize(style)
    el<HTMLInputElement>('size').placeholder = mixedSize ? 'Mixed sizes' : `${defaultSize} (inherit)`
    inheritColor = style.color === undefined
    el<HTMLInputElement>('color').value = '#' + (style.color ?? modelGlyphColor(target)).toString(16).padStart(6, '0')
    el<HTMLButtonElement>('inherit-color').disabled = inheritColor
    el<HTMLSelectElement>('scope').querySelector<HTMLOptionElement>('[value="type"]')!.disabled = !selected.type
    hints()
  }
  for (const key of ['glyph', 'surface', 'size'] as const) el<HTMLInputElement | HTMLSelectElement>(key).onchange = () => { edited.add(key); hints() }
  el<HTMLInputElement>('color').onchange = () => { inheritColor = false; edited.add('color'); el<HTMLButtonElement>('inherit-color').disabled = false }
  el<HTMLButtonElement>('inherit-color').onclick = () => { inheritColor = true; edited.add('color'); el<HTMLButtonElement>('inherit-color').disabled = true }
  el<HTMLSelectElement>('part').onchange = e => {
    if (!selected) return
    const name = (e.target as HTMLSelectElement).value
    const node = name ? selected.object.getObjectByName(name) : selected.object
    if (!node) return
    selected.node = node; selected.part = name || undefined; selected.level = name ? 'part' : 'object'
    selected.style = (node.userData.glyphResolved as GlyphStyle | undefined) ?? engine.instanceStyle(selected.object) ?? {}
    show()
  }

  let downX = 0, downY = 0, preview = false
  canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY })
  canvas.addEventListener('pointerup', (e) => {
    if (e.button !== 0 || e.shiftKey || e.altKey || callbacks.blocked?.()) return
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return
    const rect = canvas.getBoundingClientRect()
    const hit = engine.pick((e.clientX - rect.left) / rect.width * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    if (!hit) { selected = undefined; show(); callbacks.select?.(); return }
    // Authoring selects the object first; the next click enters the hit part.
    const sameObject = selected?.object === hit.object
    const samePart = sameObject && selected?.part === hit.part
    const level = callbacks.objectFirst
      ? !sameObject || !hit.part || samePart && selected!.level === 'part' ? 'object' : 'part'
      : samePart && selected!.level === 'part' || !hit.part ? 'object' : 'part'
    const node = hit.part ? hit.object.getObjectByName(hit.part) ?? hit.node : hit.node
    selected = { ...hit, node, level }
    show(); callbacks.select?.(hit.object)
  })
  canvas.addEventListener('scene-replaced', () => { selected = undefined; show() })
  canvas.addEventListener('editor-preview', event => { preview = (event as CustomEvent<boolean>).detail; box.visible = !preview && !!selected })
  canvas.addEventListener('select-scene-object', (event) => {
    const object = (event as CustomEvent<THREE.Object3D>).detail
    if (!object) { selected = undefined; show(); return }
    const instance = engine.instanceStyle(object)
    if (!instance) return
    selected = { object, node: object, part: undefined, type: instance.type, instance, style: instance, point: object.position.clone(), level: 'object' }
    show()
  })
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !selected || callbacks.blocked?.()) return
    if (selected.level === 'part') selected.level = 'object'; else selected = undefined
    show(); if (!selected) callbacks.select?.()
  })
  el<HTMLButtonElement>('apply').onclick = () => {
    if (!selected || !edited.size) return
    const sizeInput = el<HTMLInputElement>('size')
    if (edited.has('size') && !sizeInput.reportValidity()) return
    // Write only edited fields: changing the whole tree's size must preserve
    // the crown's body technique and the trunk's surface technique.
    const style: GlyphStyle = {}
    if (edited.has('glyph')) style.glyph = (el<HTMLSelectElement>('glyph').value || undefined) as GlyphKind | undefined
    if (edited.has('surface')) style.surface = (el<HTMLSelectElement>('surface').value || undefined) as SurfaceKind | undefined
    if (edited.has('size') && !sizeInput.disabled) style.size = sizeInput.value ? Number(sizeInput.value) : undefined
    if (edited.has('color')) style.color = inheritColor ? undefined : Number.parseInt(el<HTMLInputElement>('color').value.slice(1), 16)
    const part = selected.level === 'part' ? selected.part : undefined
    const scope = el<HTMLSelectElement>('scope').value
    if (scope === 'instance') part ? engine.setPartStyle(selected.object, part, style) : engine.setInstanceStyle(selected.object, style)
    else if (scope === 'type' && selected.type) engine.setTypeStyle(selected.type, part ? { parts: { [part]: style } } : { style })
    else engine.setStyle({ glyphs: { ...engine.style.glyphs, ...style } })
    // Re-read what the part resolves to now.
    selected.style = (selected.node.userData.glyphResolved as GlyphStyle | undefined) ?? style
    show()
    callbacks.changed?.()
  }
  return { get selected() { return selected }, refresh: () => { box.visible = !preview && !!selected; if (selected) box.box.setFromObject(selected.level === 'part' ? selected.node : selected.object) } }
}
