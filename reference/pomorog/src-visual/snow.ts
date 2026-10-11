export const SNOW_CAMP = { x: -3, z: 2.6 }
export const SNOW_EXTENT = 32
export const SNOW_TRACK_LIFE = 110
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const fract = (n: number) => n - Math.floor(n)
const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453)

export const snowAccumulation = (time: number) => .28 + .72 * (1 - Math.exp(-Math.max(0, time) / 42))
export const snowMeltRadius = (time: number) => 1.48 + .35 * (1 - Math.exp(-Math.max(0, time) / 38))
export function snowCover(x: number, z: number, time: number) {
  const dx = x - SNOW_CAMP.x, dz = z - SNOW_CAMP.z
  const edge = Math.sin(dx * 3.1 + dz * 1.7) * .10 + Math.sin(dz * 4.3) * .055
  return smooth((Math.hypot(dx, dz) + edge - snowMeltRadius(time) + .2) / .55)
}

/** Shared footprint/ground boundary: boots cannot stamp snow into the fire's thaw. */
export const snowCoverGLSL = `
  float snowCoverAt(vec2 p, float time) {
    vec2 d = p - vec2(-3., 2.6);
    float edge = sin(d.x * 3.1 + d.y * 1.7) * .10 + sin(d.y * 4.3) * .055;
    float radius = 1.48 + .35 * (1. - exp(-max(0., time) / 38.));
    return smoothstep(radius - .2, radius + .35, length(d) + edge);
  }
`

export interface SnowBoot { position: { x: number; y: number; z: number }; step: number }
export interface SnowPrint { x: number; z: number; heading: number; at: number; foot: number }
export function createSnowTracks() {
  const prints: SnowPrint[] = []
  let previous: number[] = []
  return {
    prints,
    update(time: number, feet: readonly SnowBoot[], heading: number, active: boolean, travelled: number) {
      if (active) {
        while (prints.length && time - prints[0].at > SNOW_TRACK_LIFE) prints.shift()
        feet.forEach((foot, index) => {
          if (previous[index] === undefined || foot.step <= previous[index] || travelled <= 0 || foot.position.y > .28) return
          const { x, z } = foot.position
          if (snowCover(x, z, time) > .55) prints.push({ x, z, heading, at: time, foot: index })
        })
        if (prints.length > 256) prints.splice(0, prints.length - 256)
      }
      previous = feet.map(foot => foot.step)
      return prints
    },
  }
}

/** Slow flakes drift sideways in gusts; no rain-like straight velocity. */
export function snowflake(index: number, time: number) {
  const speed = .48 + hash(index + 23) * .48
  const phase = fract(hash(index + 7) + time * speed / 8)
  return {
    x: (hash(index * 3 + 1) - .5) * 26 + Math.sin(time * .42 + index) * .45 + Math.sin(time * .13) * .65,
    y: 8 * (1 - phase),
    z: (hash(index * 3 + 2) - .5) * 26 + Math.cos(time * .31 + index * 2.4) * .35,
    size: .085 + hash(index + 9) * .105,
    phase,
  }
}
