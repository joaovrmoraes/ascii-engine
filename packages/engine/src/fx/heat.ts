/**
 * A heat-grid effect as data (seed of the §3.3 "simulation grid" render type).
 * Established default numbers for a heat-grid renderer.
 */
export interface HeatGridSpec {
  /** Columns each side of the axis and rows: 5 → 11 × 13. */
  cols: number
  rows: number
  /** Cell in metres (width, height) and letter size. */
  cell: [number, number]
  letter: number
  /** Distance pushed toward the camera so the logs never hide the flame. */
  toward: number
  /** Hot → cold: letter and colour (above 1 on purpose: pure white read as grey). */
  ramp: [string, [number, number, number]][]
  embers: { count: number; letters: [string, string, string] }
  sparks: number
  smoke: { count: number; letters: string; color: [number, number, number] }
  light: { color: number; intensity: number; distance: number; decay: number; height: number }
}

export const DEFAULT_HEAT_GRID: HeatGridSpec = {
  cols: 5, rows: 13, cell: [.15, .19], letter: .21, toward: .45,
  ramp: [['@', [1.3, 1.15, .55]], ['#', [1.3, .98, .3]], ['%', [1.25, .78, .16]], ['x', [1.2, .6, .1]], ['*', [1.1, .45, .07]], ['+', [1, .32, .05]], [':', [.85, .2, .04]], ['.', [.65, .12, .03]]],
  embers: { count: 26, letters: ['*', '+', ':'] },
  sparks: 22,
  smoke: { count: 12, letters: ',;:~', color: [.38, .36, .35] },
  light: { color: 0xffac55, intensity: 14, distance: 7, decay: 1.65, height: 1.05 },
}
