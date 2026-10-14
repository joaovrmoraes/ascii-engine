import * as THREE from 'three'
import type { GlyphStyle } from '../style'

/** Custom atlases belong to their material and are released with it. */
export function customGlyphAtlas(alphabet: string, body = false, style: GlyphStyle = {}) {
  const canvas = document.createElement('canvas'), per = body ? 24 : 48
  const characters = Array.from(alphabet)
  canvas.width = characters.length * per; canvas.height = body ? 32 : 64
  const context = canvas.getContext('2d')!
  context.fillStyle = '#000'; context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#fff'; context.font = `${style.fontWeight ?? 400} ${body ? 25 : 46}px ${style.font ?? '"Courier New", monospace'}`
  context.textAlign = 'center'; context.textBaseline = 'middle'
  characters.forEach((glyph, i) => context.fillText(glyph, (i + .5) * per, body ? 17 : 34, per * .9))
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = !body; texture.minFilter = body ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter; texture.anisotropy = body ? 1 : 4; texture.userData.slot = 1 / characters.length
  return texture
}

/** A flat color per character; interpolation happens between light levels. */
export function glyphPaletteGLSL(palette?: number[]) {
  if (!palette) return ''
  const color = (hex: number) => { const c = new THREE.Color(hex); return `vec3(${c.r.toFixed(6)},${c.g.toFixed(6)},${c.b.toFixed(6)})` }
  return `vec3 glyphPalette(float level) {
    float value = clamp(level, 0., 1.) * ${(palette.length - 1).toFixed(1)};
    ${palette.slice(0, -1).map((hex, i) => `if (value <= ${(i + 1).toFixed(1)}) return mix(${color(hex)}, ${color(palette[i + 1])}, clamp(value - ${i.toFixed(1)}, 0., 1.));`).join('\n')}
    return ${color(palette[palette.length - 1])};
  }`
}

export function ownGlyphAtlas(material: THREE.Material, texture: THREE.Texture) {
  material.addEventListener('dispose', () => texture.dispose())
}
