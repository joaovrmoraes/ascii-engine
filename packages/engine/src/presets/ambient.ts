import type { GlyphCloud } from '../techniques/particle'

/**
 * Ambient letters of the open map (Pomorog `effects.ts`), as small presets
 * that push into a particle buffer every frame.
 */
const fract = (v: number) => v - Math.floor(v)
const wrap = (v: number, span: number) => ((v % span) + span) % span - span / 2
type RGB = readonly [number, number, number]
type Point = { x: number; y?: number; z: number }

/** Fireflies and moon motes bound to the world, wrapping around `center` (18 m). */
export function pushFireflies(cloud: GlyphCloud, center: Point, time: number, options: { count?: number; span?: number; dim?: number } = {}) {
  const count = options.count ?? 70, span = options.span ?? 18, dim = options.dim ?? 1
  const mote: RGB = [.82, .96, .72], white: RGB = [1, .94, .64]
  for (let i = 0; i < count; i++) {
    const x = center.x + wrap(fract(i * .618) * span + Math.sin(time * .21 + i) * .6 - center.x, span)
    const z = center.z + wrap(fract(i * .382 + .17) * span + Math.cos(time * .17 + i * 1.3) * .6 - center.z, span)
    const twinkle = Math.max(0, Math.sin(time * (1.1 + fract(i * .71) * 1.6) + i * 2.1)) ** 6
    cloud.push(x, .25 + fract(i * .37) * 1.5 + Math.sin(time * .6 + i) * .14, z, .15 + twinkle * .07, twinkle > .55 ? '*' : '+',
      i % 4 ? mote : white, (.22 + twinkle * .78) * dim)
  }
}

/** Sparse drifting motes that catch the lantern around the hero. */
export function pushLanternMotes(cloud: GlyphCloud, hero: Point, time: number) {
  for (let i = 0; i < 24; i++) {
    const a = i * 2.399 + time * .06, radius = 1.1 + fract(i * .618) * 2.7
    const fade = Math.sin(time * .55 + i * 1.7) ** 6
    cloud.push(hero.x + Math.cos(a) * radius, .35 + fract(i * .37) * 1.8 + Math.sin(time * .45 + i) * .13,
      hero.z + Math.sin(a) * radius, .055, '.', [.85, .67, .35], fade * .3)
  }
}

/** Dust letters kicked up behind running boots; `add` a puff, `push` every frame. */
export function createDustTrail() {
  const trail: { x: number; z: number; t: number }[] = []
  let last = -1
  return {
    /** Adds a puff at most every `every` seconds. */
    add(x: number, z: number, time: number, every = .16) { if (time - last > every) { trail.push({ x, z, t: time }); last = time } },
    push(cloud: GlyphCloud, time: number) {
      for (let i = trail.length - 1; i >= 0; i--) {
        const d = trail[i], age = time - d.t
        if (age > 1.1 || age < 0) { trail.splice(i, 1); continue }
        for (let k = 0; k < 3; k++) {
          const a = k * 2.1 + d.t * 13
          cloud.push(d.x + Math.cos(a) * age * .5, .08 + age * .55 + k * .05, d.z + Math.sin(a) * age * .5, .17 + age * .08, k ? '.' : ',:'[Math.floor(d.t * 20) % 2], [.48, .44, .36], (1 - age / 1.1) * .75)
        }
      }
    },
  }
}
