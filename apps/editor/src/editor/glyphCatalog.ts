import * as THREE from 'three'
import {
  BODY_RAMPS,
  SCREEN_ALPHABETS,
  SURFACE_ALPHABETS,
  SURFACE_CELL,
  type GlyphStyle,
  type SurfaceKind,
} from '@ascii-engine/core'

/** Editor vocabulary; saved family, part and terrain identifiers remain unchanged. */
export const GLYPH_FAMILIES = [
  'earth',
  'stone',
  'wood',
  'bark',
  'foliage',
  'snow',
  'wetgrass',
  'actor',
] as const satisfies readonly SurfaceKind[]

const labels: Record<string, string> = {
  surface: 'Surface glyphs',
  body: 'Glyph body',
  screen: 'Character (screen)',
  earth: 'Earth',
  stone: 'Stone',
  wood: 'Wood',
  bark: 'Bark',
  foliage: 'Foliage',
  snow: 'Snow',
  wetgrass: 'Wet grass',
  actor: 'Character',
  moss: 'Moss',
  crown: 'Crown',
  trunk: 'Trunk',
}
const legacyNames: Record<string, string> = {
  musgo: 'moss',
  terra: 'earth',
  pedra: 'stone',
  neve: 'snow',
  copa: 'crown',
  tronco: 'trunk',
}

export function glyphLabel(id: string): string {
  const key = Object.hasOwn(legacyNames, id) ? legacyNames[id] : id
  return Object.hasOwn(labels, key) ? labels[key] : id
}

function bodyRamp(family?: SurfaceKind): keyof typeof BODY_RAMPS {
  if (family === 'wood') return 'bark'
  return family && Object.hasOwn(BODY_RAMPS, family) ? (family as keyof typeof BODY_RAMPS) : 'actor'
}

/** Base size in world metres, before the body's family-specific sprite multiplier. */
export function defaultGlyphSize(style: GlyphStyle): number {
  if (style.glyph === 'surface')
    return SURFACE_CELL[style.surface ?? 'generic'] ?? SURFACE_CELL.generic
  return bodyRamp(style.surface) === 'actor' ? 0.155 : 0.19
}

export function glyphAlphabet(style: GlyphStyle): string {
  if (style.glyph === 'screen')
    return (
      SCREEN_ALPHABETS[style.surface as keyof typeof SCREEN_ALPHABETS] ?? SCREEN_ALPHABETS.actor
    )
  if (style.alphabet !== undefined) return style.alphabet
  return style.glyph === 'body'
    ? BODY_RAMPS[bodyRamp(style.surface)]
    : (SURFACE_ALPHABETS[style.surface ?? 'generic'] ?? SURFACE_ALPHABETS.generic)
}

/** Read the model's sRGB colour, before surface variants and dark body occluders. */
export function modelGlyphColor(target?: THREE.Object3D): number {
  let color = 0xffffff
  target?.traverse(node => {
    if (!(node instanceof THREE.Mesh) || node.userData.editorOnly) return
    const original = node.userData.asciiOriginal ?? node.userData.glyphBodyMaterial ?? node.material
    const material = Array.isArray(original) ? original[0] : original
    if (material instanceof THREE.MeshStandardMaterial) color = material.color.getHex()
  })
  // Mixed objects retain the inspector's representative last-mesh colour.
  return color
}
