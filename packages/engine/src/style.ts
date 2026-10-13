import type { SurfaceKind } from './surface'

/** Technique of letters for an object or part. Declared, never guessed from colour. */
export type GlyphKind =
  | 'screen' // screen pass (hero)
  | 'surface' // letters on the local surface (buildings, bridge, ground)
  | 'body' // cloud of letters (crowns, stones, creatures)
  | 'carpet' // standing letters (grass, ground cover)
  | 'particle' // loose glyphs (fire, sparks, rain, snow)
  | 'water' // letters on water with reflection (phase 2)

/**
 * Letter style of one part: plain data, resolved by layers. Phase 1 covers the
 * technique, the letter family (alphabet, cell, ink of that material kind) and
 * the letter size and colour; more parameters join here (alphabet, spacing,
 * strength, gap, steps, open/occluder, sway).
 */
export interface GlyphStyle {
  glyph?: GlyphKind
  /** Letter family: alphabet, cell and ink of a material kind (`stone`, `foliage`, …). */
  surface?: SurfaceKind
  /** Letter size in metres: surface cell width or body base size. Screen uses cellSize. */
  size?: number
  /** Optional sRGB colour override. Omitted preserves the model's material colour. */
  color?: number
}

/** Styles for a type of object ("tree") and its types of part ("crown", "trunk"). */
export interface ObjectTypeStyle {
  style?: GlyphStyle
  parts?: Record<string, GlyphStyle>
}

/** Later layers win; `undefined` fields never erase earlier ones. */
export function mergeGlyphStyles(...layers: (GlyphStyle | undefined)[]): GlyphStyle {
  const out: GlyphStyle = {}
  for (const layer of layers) {
    if (!layer) continue
    for (const [key, value] of Object.entries(layer)) if (value !== undefined) (out as Record<string, unknown>)[key] = value
  }
  return out
}

export interface StyleLayers {
  /** Inferred import defaults, below every authored style layer. */
  defaults?: GlyphStyle
  global?: GlyphStyle
  type?: ObjectTypeStyle
  /** Style carried by the node itself (`userData.glyph` / `userData.glyphStyle`, e.g. from GLTF). */
  node?: GlyphStyle
  instance?: GlyphStyle
  instanceParts?: Record<string, GlyphStyle>
  /** Name of the part the node belongs to, if any. */
  part?: string
}

/**
 * Most specific wins:
 * global preset → object type → type of part → node data → instance → part of the instance.
 */
export function resolveGlyphStyle(layers: StyleLayers): GlyphStyle {
  const part = layers.part
  return mergeGlyphStyles(
    layers.defaults,
    layers.global,
    layers.type?.style,
    part ? layers.type?.parts?.[part] : undefined,
    layers.node,
    layers.instance,
    part ? layers.instanceParts?.[part] : undefined,
  )
}

/** Style written on a node: `userData.glyph` (technique) and `userData.glyphStyle` (the rest). */
export function nodeGlyphStyle(userData: Record<string, unknown>): GlyphStyle | undefined {
  const glyph = userData.glyph as GlyphKind | undefined, style = userData.glyphStyle as GlyphStyle | undefined
  if (!glyph && !style) return undefined
  return mergeGlyphStyles(style, glyph ? { glyph } : undefined)
}
