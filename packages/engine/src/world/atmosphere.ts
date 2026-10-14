import type { AsciiStyle } from '../config'

/** Reusable lighting only: never overrides geometry, glyph techniques or weather. */
export const ATMOSPHERE_KEYS = ['atmosphere', 'inkTint', 'bodySceneLighting', 'inkFog', 'brightness', 'background', 'fog', 'hemisphere', 'moon', 'fill', 'bodyAmbient'] as const
export type AtmosphereStyle = Partial<Pick<AsciiStyle, typeof ATMOSPHERE_KEYS[number]>>
export interface AtmosphereAsset { name: string; style: AtmosphereStyle }
export function atmosphereStyle(style: Partial<AsciiStyle>): AtmosphereStyle {
  return structuredClone(Object.fromEntries(ATMOSPHERE_KEYS.filter(key => style[key] !== undefined).map(key => [key, style[key]])))
}
