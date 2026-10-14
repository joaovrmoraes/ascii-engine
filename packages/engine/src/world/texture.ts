import { GLYPH_STYLE_KEYS, type GlyphStyle } from '../style'
import type { AtmosphereStyle } from './atmosphere'
import type { AddOptions } from '../engine'
import type { SceneDoc } from './scene'
import { mergeGlyphStyles } from '../style'

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

/** Each placed object is counted once, even if several parts use the asset. */
export function textureUsers(doc: SceneDoc, id: string) {
  return doc.objects.filter(item => item.options?.texture === id || Object.values(item.options?.parts ?? {}).some(part => part.texture === id))
}

/** Bake links into overrides, preserving the current texture/instance ordering. */
export function detachTexture(options: AddOptions, textures: Record<string, TextureAsset>, part?: string): AddOptions {
  const next = structuredClone(options), own = textureStyle(options)
  const recipe = (id?: string) => id ? textures[id]?.style : undefined
  if (part) {
    const current = options.parts?.[part]
    if (current?.texture) next.parts![part] = mergeGlyphStyles(recipe(current.texture), own, textureStyle(current))
  } else {
    Object.assign(next, mergeGlyphStyles(recipe(options.texture), own)); delete next.texture
    for (const [name, current] of Object.entries(options.parts ?? {})) {
      if (current.texture) next.parts![name] = mergeGlyphStyles(recipe(options.texture), recipe(current.texture), own, textureStyle(current))
    }
  }
  return next
}
