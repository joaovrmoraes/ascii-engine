import * as THREE from 'three'
import type { AsciiEngine, GlyphKind, GlyphStyle, SurfaceKind } from '@ascii-engine/core'

/**
 * Part selection (§3.1, phase 4): a click selects the part under the cursor,
 * a second click (or Esc) climbs to the whole object. The panel shows the
 * resolved style and saves a change where the user chooses: this instance
 * only, this part in every object of the type, or the global style.
 */
const KINDS: GlyphKind[] = ['surface', 'body', 'screen']
const FAMILIES: SurfaceKind[] = ['earth', 'stone', 'wood', 'bark', 'foliage', 'snow', 'wetgrass', 'actor']
const LABELS: Record<string, string> = { surface: 'Letras na superfície', body: 'Volume de letras', screen: 'Personagem (tela)', earth: 'Terra', stone: 'Pedra', wood: 'Madeira', bark: 'Casca', foliage: 'Folhagem', snow: 'Neve', wetgrass: 'Grama úmida', actor: 'Personagem', crown: 'Copa', trunk: 'Tronco' }

export function createSelection(engine: AsciiEngine, canvas: HTMLCanvasElement, root: HTMLElement, callbacks: { select?: (object?: THREE.Object3D) => void; changed?: () => void; blocked?: () => boolean; objectFirst?: boolean } = {}) {
  let selected: Omit<NonNullable<ReturnType<AsciiEngine['pick']>>, 'node'> & { node: THREE.Object3D; level: 'part' | 'object' } | undefined
  const box = new THREE.Box3Helper(new THREE.Box3(), 0xd3b27c)
  box.userData.editorOnly = true
  box.visible = false; engine.particleScene.add(box)
  root.innerHTML = `
    <strong>Aparência ASCII</strong><div data-k="what">clique numa parte da cena</div>
    <label>parte <select data-k="part"></select></label>
    <label>Técnica <select data-k="glyph">${KINDS.map((k) => `<option value="${k}">${LABELS[k]}</option>`).join('')}</select></label>
    <label>Material <select data-k="surface"><option value="">Padrão do objeto</option>${FAMILIES.map((k) => `<option value="${k}">${LABELS[k]}</option>`).join('')}</select></label>
    <label>tamanho <input data-k="size" type="number" min=".08" max=".5" step=".01" placeholder="(herdar)"></label>
    <label>salvar em <select data-k="scope">
      <option value="instance">só esta</option>
      <option value="type">todas desta parte neste tipo</option>
      <option value="global">estilo global</option>
    </select></label>
    <button data-k="apply">Aplicar aparência</button>`
  const el = <T extends HTMLElement>(k: string) => root.querySelector<T>(`[data-k="${k}"]`)!
  const what = el<HTMLDivElement>('what')
  root.hidden = true

  function show() {
    if (!selected) { box.visible = false; root.hidden = true; return }
    root.hidden = false
    const target = selected.level === 'part' ? selected.node : selected.object
    box.box.setFromObject(target); box.visible = true
    const style = selected.style ?? {}
    const parts = el<HTMLSelectElement>('part')
    parts.replaceChildren(new Option('Objeto inteiro', ''))
    const names = new Set<string>()
    selected.object.traverse(node => { if (node !== selected!.object && node.name && !node.userData.glyphBodyLetters && !(node instanceof THREE.Points)) names.add(node.name) })
    names.forEach(name => parts.append(new Option(LABELS[name] ?? name, name)))
    parts.value = selected.level === 'part' ? selected.part ?? '' : ''
    what.textContent = `${selected.type ? `tipo ${selected.type} · ` : ''}${selected.level === 'part' && selected.part ? `parte "${selected.part}"` : `objeto "${selected.object.name || selected.object.type}"`}`
    el<HTMLSelectElement>('glyph').value = style.glyph ?? 'surface'
    el<HTMLSelectElement>('surface').value = style.surface ?? ''
    el<HTMLInputElement>('size').value = style.size ? String(style.size) : ''
    el<HTMLSelectElement>('scope').querySelector<HTMLOptionElement>('[value="type"]')!.disabled = !selected.type
  }
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
    // Second click on the same part climbs to the whole object.
    const same = selected && selected.object === hit.object && (selected.part === hit.part)
    selected = { ...hit, level: callbacks.objectFirst ? (same && selected!.level === 'object' && hit.part ? 'part' : 'object') : (same && selected!.level === 'part' || !hit.part ? 'object' : 'part') }
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
    if (!selected) return
    const size = Number(el<HTMLInputElement>('size').value)
    const style: GlyphStyle = {
      glyph: el<HTMLSelectElement>('glyph').value as GlyphKind,
      surface: (el<HTMLSelectElement>('surface').value || undefined) as SurfaceKind | undefined,
      size: size > 0 ? size : undefined,
    }
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
