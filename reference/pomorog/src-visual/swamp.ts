/** Shared shoreline: renderer, footsteps and wake agree about dry land. */
export const SWAMP_WATER_Y = .18
// Rain fills the low banks over the first minute. The central hearth stays above
// the flood; rain, rather than a submerged hearth, intermittently quenches it.
export function swampWeather(time: number) {
  const flood = 1 - Math.exp(-Math.max(0, time) / 24)
  const shower = .5 + .5 * Math.sin(time * .48 + .7)
  const quench = Math.pow(Math.max(0, Math.sin(time * .79 - .6)), 4)
  return { level: SWAMP_WATER_Y + flood * .13, flood, rain: .65 + shower * .35, fire: .78 - quench * .62, steam: .15 + quench * .85 }
}
export const SWAMP_ISLANDS = [
  { x: -3, z: 2.6, rx: 2.65, rz: 2.05 },
  { x: -5.7, z: -4.9, rx: 1.8, rz: 1.4 },
  { x: 5.4, z: -3, rx: 1.45, rz: 1.7 },
] as const
export function swampWetness(x: number, z: number, level = SWAMP_WATER_Y) {
  const shore = Math.min(...SWAMP_ISLANDS.map((i) => Math.hypot((x - i.x) / i.rx, (z - i.z) / i.rz)))
  const bank = 1 - Math.max(0, level - SWAMP_WATER_Y) * 1.35
  return Math.max(0, Math.min(1, (shore - bank + .06) / .14))
}
export function swampBoardwalk(x: number, z: number) {
  return x > -4.1 && x < 1.8 && Math.abs(z - 4.95) < .6
}
export const swampSurface = (x: number, z: number, level = SWAMP_WATER_Y) => swampBoardwalk(x, z) ? 'wood' as const : swampWetness(x, z, level) > .5 ? 'water' as const : 'grass' as const

export const swampShoreGLSL = `float swampShore(vec2 p) {
  float shore=10.;
  ${SWAMP_ISLANDS.map((i) => `shore=min(shore,length((p-vec2(${i.x.toFixed(2)},${i.z.toFixed(2)}))/vec2(${i.rx},${i.rz})));`).join('\n')}
  return shore;
}`
