import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'

const fract = (v: number) => v - Math.floor(v)

import { DEFAULT_HEAT_GRID, type HeatGridSpec } from '../fx/heat'
export type { HeatGridSpec } from '../fx/heat'
export const POMOROG_FIRE = DEFAULT_HEAT_GRID

/**
 * Bonfire as `particle` (Pomorog `effects.ts`): a heat grid anchored at the
 * logs and turned to the camera, an ember bed, sparks and smoke, plus its
 * point light. `heat` scales everything (rain quenches it).
 */
export function createCampfire(cloud: GlyphCloud, position: THREE.Vector3, spec: HeatGridSpec = POMOROG_FIRE) {
  const RAMP = spec.ramp, top = RAMP.length - 1
  const light = new THREE.PointLight(spec.light.color, spec.light.intensity, spec.light.distance, spec.light.decay)
  light.position.set(position.x, spec.light.height, position.z)
  const right = new THREE.Vector3(), toward = new THREE.Vector3()
  return {
    light, position,
    /** Push this frame's letters; call between `cloud.clear()` and the engine render. */
    /** `heat` 0–1 (rain quenches it); `steam` 0–1 replaces the flame with pale vapour. */
    update(time: number, camera: THREE.Camera, heat = 1, steam = 0) {
      const camp = position
      light.position.set(camp.x, spec.light.height, camp.z)
      light.intensity = (spec.light.intensity - 1 + Math.sin(time * 5.3) * 1.1 + Math.sin(time * 8.7 + .8) * .65) * heat
      right.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      toward.setFromMatrixColumn(camera.matrixWorld, 2).setY(0).normalize().multiplyScalar(spec.toward)
      const { cols, rows } = spec, [cw, ch] = spec.cell
      for (let r = 0; r < rows; r++) for (let c = -cols; c <= cols; c++) {
        const h = r / (rows - 1)
        const width = (cols + .5) * (1 - h * .8) * (.85 + .15 * Math.sin(time * 2.3 + r * .7))
        const shape = 1 - Math.abs(c + Math.sin(time * 1.7 + r * .45) * h * 1.6) / Math.max(.6, width)
        if (shape <= 0) continue
        const n = Math.sin(c * 1.7 + r * .9 - time * 7.5) * Math.sin(c * .6 - r * 1.3 - time * 5.1 + 1.3)
        const flick = fract(Math.sin((c + 13) * 12.9 + (r - Math.floor(time * 9)) * 78.2) * 43758.5)
        const heatValue = (Math.pow(shape, 1.6) * (1 - h * .85) * 1.7 + n * .3 + flick * .2 - .12) * heat
        if (heatValue < .14 || (h > .55 && flick > .8)) continue
        const k = Math.min(top, Math.floor((1 - Math.min(1, heatValue)) * RAMP.length))
        const [glyph, colour] = RAMP[k]
        cloud.push(camp.x + toward.x + right.x * c * cw + (steam > 0 ? h * .25 : 0), .2 + r * ch, camp.z + toward.z + right.z * c * cw, spec.letter, glyph, colour, .9 + Math.min(.1, heatValue * .1))
      }
      const [hot, warm, cool] = spec.embers.letters, embers = spec.embers.count
      for (let i = 0; i < embers; i++) {
        // Ember bed: a ring of glowing letters on the logs that breathes.
        const a = i / embers * Math.PI * 2, r = .2 + fract(i * .618) * .32, glow = .55 + .45 * Math.sin(time * 2.7 + i * 1.9)
        cloud.push(camp.x + Math.cos(a) * r, .1, camp.z + Math.sin(a) * r, .15, glow > .75 ? hot : glow > .45 ? warm : cool, glow > .75 ? [1, .66, .25] : [.85, .3, .08], (.45 + glow * .5) * heat)
      }
      const smoke = spec.smoke.letters
      for (let i = 0; i < spec.sparks + spec.smoke.count; i++) {
        const life = fract(time * (.32 + fract(i * .41) * .3) + i * .618)
        const spark = i < spec.sparks
        const swirl = life * 5 + i
        cloud.push(camp.x + Math.sin(swirl) * (.12 + life * .45), .55 + life * (spark ? 2.6 : 2.2) * heat, camp.z + Math.cos(swirl) * (.12 + life * .35),
          spark ? .13 : .2, spark ? (life < .2 ? '*' : '.') : smoke[i % smoke.length], spark ? [1, .75 - life * .3, .3] : spec.smoke.color, (1 - life) * (spark ? 1 : .5) * heat)
      }
      if (steam > 0) {
        // Pale steam replaces the tall flame when a shower quenches the logs.
        for (let i = 0; i < 58; i++) {
          const life = fract(time * .42 + i * .618), a = i * 2.399
          const radius = .12 + life * .48
          cloud.push(camp.x + Math.cos(a + life * 3) * radius + life * .4, .2 + life * 1.65,
            camp.z + Math.sin(a) * radius, .11 + life * .07, '.,:~'[i % 4], [.56, .63, .67], Math.sin(life * Math.PI) * steam * .6)
        }
        for (let i = 0; i < 8; i++) {
          const life = fract(time * 2.1 + i * .618), a = i * 2.399
          cloud.push(camp.x + Math.cos(a) * (.16 + life * .38), .18 + Math.sin(life * Math.PI) * .28,
            camp.z + Math.sin(a) * (.16 + life * .38), .08, ',', [.58, .68, .73], (1 - life) * .55)
        }
      }
    },
  }
}
