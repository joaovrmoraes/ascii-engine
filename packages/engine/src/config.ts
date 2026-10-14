import type { GlyphStyle, ObjectTypeStyle } from './style'

/** Renderer settings, independent of scene content and game rules. */
export interface AsciiStyle {
  cellSize: number
  brightness: number
  background: number
  fog: { color: number; density: number } | null
  hemisphere: { sky: number; ground: number; intensity: number }
  moon: {
    color: number
    intensity: number
    position: [number, number, number]
    shadowIntensity: number
    shadowExtent: number
    mapSize: number
  }
  fill: { color: number; intensity: number; position: [number, number, number] }
  interior: boolean
  bodyAmbient: number
  bodyLantern: number
  atmosphere: 'moon' | 'dusk' | 'ember'
  inkTint?: [number, number, number]
  bodySceneLighting?: boolean
  inkFog?: boolean
  glyphs: GlyphStyle
  types: Record<string, ObjectTypeStyle>
}

/** Established renderer numbers; content libraries supply their own type declarations. */
export const DEFAULT_ASCII_STYLE: AsciiStyle = {
  cellSize: 6,
  brightness: 1,
  background: 0x020102,
  fog: { color: 0x020102, density: .012 },
  hemisphere: { sky: 0xc2cec4, ground: 0x343321, intensity: 1.25 },
  moon: {
    color: 0xe0e7cc, intensity: 2.2, position: [-5, 12, 7],
    shadowIntensity: .62, shadowExtent: 16, mapSize: 1024,
  },
  fill: { color: 0x9bbfb5, intensity: .3, position: [6, 6, -7] },
  interior: false,
  bodyAmbient: .3,
  bodyLantern: .7,
  atmosphere: 'moon',
  glyphs: {},
  types: {},
}

/** Each engine owns its settings, including nested arrays and type styles. */
export function engineStyle(style: Partial<AsciiStyle> = {}): AsciiStyle {
  return structuredClone({ ...DEFAULT_ASCII_STYLE, ...style })
}
