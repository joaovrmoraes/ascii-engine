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
 * custom alphabets, spacing and discrete shading. Omitted fields retain the
 * original Pomorog recipes.
 */
export interface GlyphStyle {
  glyph?: GlyphKind
  /** Letter family: alphabet, cell and ink of a material kind (`stone`, `foliage`, …). */
  surface?: SurfaceKind
  /** Letter size in metres: surface cell width or body base size. Screen uses cellSize. */
  size?: number
  /** Optional sRGB colour override. Omitted preserves the model's material colour. */
  color?: number
  /** Single Unicode characters ordered from sparse to dense; up to 128 slots. */
  alphabet?: string
  /** CSS font family available to the renderer; omitted retains Courier New. */
  font?: string
  fontWeight?: 400 | 700
  /** True removes the solid occluder and discards surface pixels between letters. */
  open?: boolean
  /** Body visibility; omitted retains the original front-face recipes. */
  faces?: 'front' | 'both'
  /** Letter rotation in radians within its cell/sprite. */
  rotation?: number
  /** Linear interpolation of 2–8 sRGB colors along the light ramp. */
  palette?: number[]
  /** Scene lights or uniform local shading; global exposure/tint still applies. */
  lighting?: 'scene' | 'unlit'
  /** Self-lit letters. Does not create a light illuminating other objects. */
  emissive?: number
  emissiveIntensity?: number
  /** Distance between letters relative to their size (1 = original recipe). */
  spacing?: number
  /** Fraction of occupied cells (surface) or relative sampling density (body). */
  density?: number
  /** Ink multiplier, without adding a visible solid surface between letters. */
  strength?: number
  /** Surface background between letters. Zero makes the underlying faces invisible. */
  gap?: number
  /** Contrast around the middle of the lighting ramp. */
  contrast?: number
  /** Offset of the lighting ramp, independent of ink strength. */
  toneOffset?: number
  /** Discrete shadow levels; omitted retains the technique's original shading. */
  shadowSteps?: number
}

export const GLYPH_STYLE_KEYS = ['glyph', 'surface', 'size', 'color', 'alphabet', 'font', 'fontWeight', 'open', 'faces', 'rotation', 'palette', 'lighting', 'emissive', 'emissiveIntensity', 'spacing', 'density', 'strength', 'gap', 'contrast', 'toneOffset', 'shadowSteps'] as const

/** One atlas slot per single character; control/combining sequences are unsupported. */
export function validGlyphAlphabet(value: unknown): value is string {
  return typeof value === 'string' && Array.from(value).length >= 1 && Array.from(value).length <= 128 && !!value.trim() && !/[\p{C}\p{M}\p{Zl}\p{Zp}]/u.test(value)
}

/** Styles for a type of object ("tree") and its types of part ("crown", "trunk"). */
export interface ObjectTypeStyle {
  style?: GlyphStyle
  parts?: Record<string, GlyphStyle>
  /** Fields explicitly authored above model declarations; absent retains legacy layering. */
  authored?: { style?: (keyof GlyphStyle)[]; parts?: Record<string, (keyof GlyphStyle)[]> }
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
function glyphLayers(layers: StyleLayers): [string, GlyphStyle | undefined][] {
  const part = layers.part
  const authored = (style: GlyphStyle | undefined, fields?: (keyof GlyphStyle)[]) => fields ? Object.fromEntries(fields.map(key => [key, style?.[key]])) : undefined
  return [['model default', layers.defaults], ['global', layers.global], ['type', layers.type?.style],
    ['type part', part ? layers.type?.parts?.[part] : undefined], ['model part', layers.node],
    ['authored type', authored(layers.type?.style, layers.type?.authored?.style)],
    ['authored type part', part ? authored(layers.type?.parts?.[part], layers.type?.authored?.parts?.[part]) : undefined],
    ['instance', layers.instance], ['instance part', part ? layers.instanceParts?.[part] : undefined]]
}
export function resolveGlyphStyle(layers: StyleLayers): GlyphStyle {
  return mergeGlyphStyles(...glyphLayers(layers).map(([, style]) => style))
}

/** Per-field provenance follows the exact same ordered layers as rendering. */
export function glyphStyleSources(layers: StyleLayers): Partial<Record<keyof GlyphStyle, string>> {
  const sources: Partial<Record<keyof GlyphStyle, string>> = {}
  for (const [name, style] of glyphLayers(layers)) {
    if (style) for (const key of GLYPH_STYLE_KEYS) if (style[key] !== undefined) sources[key] = name
  }
  return sources
}

/** Style written on a node: `userData.glyph` (technique) and `userData.glyphStyle` (the rest). */
export function nodeGlyphStyle(userData: Record<string, unknown>): GlyphStyle | undefined {
  const glyph = userData.glyph as GlyphKind | undefined, style = userData.glyphStyle as GlyphStyle | undefined
  if (!glyph && !style) return undefined
  return mergeGlyphStyles(style, glyph ? { glyph } : undefined)
}
