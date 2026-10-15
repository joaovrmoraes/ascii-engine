import type { GlyphStyle, ObjectTypeStyle } from './style'

/** Renderer settings, independent of scene content and game rules. */
export interface AsciiStyle {
  /** Screen-pass cell in CSS px (player: 5–12, default 6). */
  cellSize: number
  /** Ink multiplier of screen pass, carpet and particles (player: .65–1.4). */
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
  /** Interior = discovery by lantern; exterior = open moonlight. */
  interior: boolean
  /** `body`: ambient term (interior .12, snow .42, others .30). */
  bodyAmbient: number
  /** `body`: lantern strength (interior 1.2, exterior .7). */
  bodyLantern: number
  atmosphere: 'moon' | 'dusk' | 'ember'
  /** Optional studio tint, applied to ink in world space. */
  inkTint?: [number, number, number]
  /** Body letters follow the scene directional light; omitted keeps legacy shading. */
  bodySceneLighting?: boolean
  /** Fog reaches body/carpet/particle ink, in addition to mesh materials. */
  inkFog?: boolean
  /** Global layer of the per-part letter style. */
  glyphs: GlyphStyle
  /** Consumer-provided object types and named parts ("tree" → crown/trunk…). */
  types: Record<string, ObjectTypeStyle>
}

/** Established renderer numbers; content libraries supply their own type declarations. */
export const DEFAULT_ASCII_STYLE: AsciiStyle = {
  cellSize: 6,
  brightness: 1,
  background: 0x020102,
  fog: { color: 0x020102, density: 0.012 },
  hemisphere: { sky: 0xc2cec4, ground: 0x343321, intensity: 1.25 },
  moon: {
    color: 0xe0e7cc,
    intensity: 2.2,
    position: [-5, 12, 7],
    shadowIntensity: 0.62,
    shadowExtent: 16,
    mapSize: 1024,
  },
  fill: { color: 0x9bbfb5, intensity: 0.3, position: [6, 6, -7] },
  interior: false,
  bodyAmbient: 0.3,
  bodyLantern: 0.7,
  atmosphere: 'moon',
  glyphs: {},
  types: {},
}

/** Each engine owns its settings, including nested arrays and type styles. */
export function engineStyle(style: Partial<AsciiStyle> = {}): AsciiStyle {
  return structuredClone({ ...DEFAULT_ASCII_STYLE, ...style })
}
