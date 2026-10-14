import { GLYPH_STYLE_KEYS, type GlyphStyle } from '../style'
import type { AtmosphereStyle } from './atmosphere'

/** A portable appearance recipe with optional lights for reproducible previews. */
export interface TextureAsset {
  name: string
  style: GlyphStyle
  /** Reproducible studio lights. Applying the texture never changes scene lighting. */
  previewLighting?: AtmosphereStyle
}
export function textureStyle(style: GlyphStyle): GlyphStyle {
  return structuredClone(Object.fromEntries(GLYPH_STYLE_KEYS.filter(key => style[key] !== undefined).map(key => [key, style[key]])))
}
