import * as THREE from 'three'
import type { AsciiEngine, GlyphStyle } from '@ascii-engine/core'
import { glyphLabel } from './editor/glyphCatalog'
import { renderAppearanceSummary } from './editor/appearanceSummary'

/** Selects an object or named part; appearance editing belongs to Texture Studio. */
export function createSelection(engine: AsciiEngine, canvas: HTMLCanvasElement, root: HTMLElement, callbacks: { select?: (object?: THREE.Object3D) => void; target?: (object?: THREE.Object3D, part?: string) => void; edit?: (object: THREE.Object3D, part?: string) => void; changed?: () => void; blocked?: () => boolean; objectFirst?: boolean } = {}) {
  let selected: Omit<NonNullable<ReturnType<AsciiEngine['pick']>>, 'node'> & { node: THREE.Object3D; level: 'part' | 'object' } | undefined
  const box = new THREE.Box3Helper(new THREE.Box3(), 0xd3b27c)
  box.userData.editorOnly = true
  box.visible = false; engine.particleScene.add(box)
  root.innerHTML = `
    <strong>ASCII appearance</strong><div data-k="what">click a scene part</div><div data-k="summary"></div><button data-k="edit-letters">Edit letters…</button>
    <label>part <select data-k="part"></select></label>
    <div class="glyph-help">Edit appearance in Texture Studio.</div>`
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

  function show() {
    callbacks.target?.(selected?.object, selected?.level === 'part' ? selected.part : undefined)
    if (!selected) { box.visible = false; root.hidden = true; return }
    root.hidden = false
    const target = selected.level === 'part' ? selected.node : selected.object
    box.box.setFromObject(target); box.visible = true
    const { common: style } = appearance(target)
    selected.style = style
    renderAppearanceSummary(el('summary'), target, engine, style)
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
    el<HTMLButtonElement>('edit-letters').disabled = !callbacks.edit
  }
  el<HTMLButtonElement>('edit-letters').onclick = () => { if (selected) callbacks.edit?.(selected.object, selected.level === 'part' ? selected.part : undefined) }
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
  canvas.addEventListener('scene-document-changed', () => { if (selected) show() })
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
  return { get selected() { return selected }, refresh: () => { box.visible = !preview && !!selected; if (selected) box.box.setFromObject(selected.level === 'part' ? selected.node : selected.object) } }
}
