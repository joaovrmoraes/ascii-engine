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
  return structuredClone(
    Object.fromEntries(
      GLYPH_STYLE_KEYS.filter(key => style[key] !== undefined).map(key => [key, style[key]]),
    ),
  )
}

/** Each placed object is counted once, even if several parts use the asset. */
export function textureUsers(doc: SceneDoc, id: string) {
  return doc.objects.filter(
    item =>
      item.options?.texture === id ||
      Object.values(item.options?.parts ?? {}).some(part => part.texture === id),
  )
}

/** Bake links into overrides, preserving the resolved appearance of every part. */
export function detachTexture(
  options: AddOptions,
  textures: Record<string, TextureAsset>,
  part?: string,
): AddOptions {
  const next = structuredClone(options)
  const recipe = (id?: string) => (id ? textures[id]?.style : undefined)
  // A part link sits between the object-wide fields and the part's own fields.
  const bakePart = (name: string) => {
    const current = options.parts?.[name]
    if (current?.texture)
      next.parts![name] = mergeGlyphStyles(recipe(current.texture), textureStyle(current))
  }
  if (part) bakePart(part)
  else {
    Object.assign(next, mergeGlyphStyles(recipe(options.texture), textureStyle(options)))
    delete next.texture
    for (const name of Object.keys(options.parts ?? {})) bakePart(name)
  }
  return next
}

/**
 * Link a texture so it is visible: local fields the recipe defines are removed
 * from the linked level (an object link also clears them from parts without
 * their own link). Other local fields remain as overrides.
 */
export function linkTexture(
  options: AddOptions,
  textures: Record<string, TextureAsset>,
  id: string,
  part?: string,
): { options: AddOptions; replaced: string[] } {
  const recipe = textures[id]?.style
  if (!recipe) throw new Error(`ascii-engine: unknown texture "${id}"`)
  const next = structuredClone(options),
    keys = GLYPH_STYLE_KEYS.filter(key => recipe[key] !== undefined),
    replaced = new Set<string>()
  const clear = (style: Record<string, unknown>) => {
    for (const key of keys)
      if (style[key] !== undefined) {
        replaced.add(key)
        delete style[key]
      }
  }
  if (part) {
    next.parts = { ...next.parts, [part]: { ...next.parts?.[part], texture: id } }
    clear(next.parts[part] as Record<string, unknown>)
  } else {
    next.texture = id
    clear(next as Record<string, unknown>)
    for (const style of Object.values(next.parts ?? {}))
      if (!style.texture) clear(style as Record<string, unknown>)
  }
  return { options: next, replaced: [...replaced] }
}
