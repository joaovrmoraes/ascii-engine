import * as THREE from 'three'

export interface GlyphSlot { glyph: string; font?: string; fontWeight?: 400 | 700 }

/** Owned 2D atlas, bounded in width even when several recipes share a material. */
export function createGlyphGrid(slots: GlyphSlot[], width: number, height: number, fontSize: number, baseline: number, transparent = false) {
  const columns = Math.min(128, slots.length), rows = Math.ceil(slots.length / columns)
  const canvas = document.createElement('canvas'); canvas.width = columns * width; canvas.height = rows * height
  const context = canvas.getContext('2d')!
  if (!transparent) { context.fillStyle = '#000'; context.fillRect(0, 0, canvas.width, canvas.height) }
  context.fillStyle = '#fff'; context.textAlign = 'center'; context.textBaseline = 'middle'
  slots.forEach((slot, index) => {
    context.font = `${slot.fontWeight ?? 400} ${fontSize}px ${slot.font ?? '"Courier New", monospace'}`
    context.fillText(slot.glyph, (index % columns + .5) * width, Math.floor(index / columns) * height + baseline, width * .9)
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true; texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter; texture.anisotropy = 4
  texture.userData.columns = columns; texture.userData.rows = rows
  return texture
}
