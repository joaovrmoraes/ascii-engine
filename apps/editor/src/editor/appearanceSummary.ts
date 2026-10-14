import * as THREE from 'three'
import { type AsciiEngine, type GlyphStyle } from '@ascii-engine/core'
import { defaultGlyphSize, glyphAlphabet, glyphLabel, modelGlyphColor } from './glyphCatalog'

/** Reports renderer-resolved values, including custom alphabets and their layers. */
export function renderAppearanceSummary(root: HTMLElement, target: THREE.Object3D, engine: AsciiEngine, fallback: GlyphStyle) {
  const meshes: THREE.Mesh[] = []
  target.traverse(node => { if (node instanceof THREE.Mesh && node.userData.glyphResolved) meshes.push(node) })
  const styles: GlyphStyle[] = meshes.length ? meshes.map(mesh => mesh.userData.glyphResolved) : [fallback]
  root.replaceChildren()
  function row(key: keyof GlyphStyle, title: string, values: string[], defaultSource = 'Renderer default', forcedSource?: string) {
    const item = document.createElement('div'); item.className = 'appearance-summary-row'
    const label = document.createElement('span'); label.textContent = title
    const value = document.createElement('span'); value.dataset.summary = key
    const unique = [...new Set(values)]; value.textContent = unique.length === 1 ? unique[0] : 'Mixed values'
    value.dataset.value = value.textContent; value.title = unique.join(' / ')
    const source = document.createElement('small'); source.dataset.summarySource = key
    const origins = forcedSource ? [forcedSource] : [...new Set(meshes.map(mesh => mesh.userData.glyphSources?.[key] ?? defaultSource))]
    source.textContent = origins.length === 1 ? origins[0] : 'Mixed sources'; source.title = origins.join(' / ')
    item.append(label, value, source); root.append(item)
  }
  row('glyph', 'Technique', styles.map(style => glyphLabel(style.glyph ?? 'Unknown')))
  row('surface', 'Family', styles.map(style => glyphLabel(style.surface ?? (style.glyph === 'screen' ? 'actor' : 'Model default'))))
  const screenOnly = styles.every(style => style.glyph === 'screen')
  row('alphabet', 'Letters', styles.map(glyphAlphabet), 'Family alphabet', screenOnly ? 'Legacy screen atlas' : undefined)
  row('size', 'Base size', styles.map(style => style.glyph === 'screen' ? `${engine.style.cellSize} px (scene cell)` : `${style.size ?? defaultGlyphSize(style)} m`), 'Renderer default', screenOnly ? 'Scene cell size' : undefined)
  row('color', 'Color', styles.map((style, index) => style.palette && style.glyph !== 'screen' ? `Palette (${style.palette.length} colors)` : '#' + (style.color ?? modelGlyphColor(meshes[index] ?? target)).toString(16).padStart(6, '0')), 'Model color')
}
