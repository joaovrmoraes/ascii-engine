import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'

const fract = (v: number) => v - Math.floor(v)

import { DEFAULT_HEAT_GRID, type HeatGridSpec } from '../fx/heat'
export type { HeatGridSpec } from '../fx/heat'
/** The optional preset owns its nested settings; editing it cannot alter core defaults. */
export const POMOROG_FIRE: HeatGridSpec = structuredClone(DEFAULT_HEAT_GRID)

/**
 * Bonfire as `particle` (Pomorog `effects.ts`): a heat grid anchored at the
 * logs and turned to the camera, an ember bed, sparks and smoke, plus its
 * point light. `heat` scales everything (rain quenches it).
 */
export function createCampfire(
  cloud: GlyphCloud,
  position: THREE.Vector3,
  spec: HeatGridSpec = POMOROG_FIRE,
) {
  const RAMP = spec.ramp,
    top = RAMP.length - 1
  const light = new THREE.PointLight(
    spec.light.color,
    spec.light.intensity,
    spec.light.distance,
    spec.light.decay,
  )
  light.position.set(position.x, spec.light.height, position.z)
  const right = new THREE.Vector3(),
    toward = new THREE.Vector3()
  return {
    light,
    position,
    /** Push this frame's letters; call between `cloud.clear()` and the engine render. */
    /** `heat` 0–1 (rain quenches it); `steam` 0–1 replaces the flame with pale vapour. */
    update(time: number, camera: THREE.Camera, heat = 1, steam = 0) {
      const camp = position
      light.position.set(camp.x, spec.light.height, camp.z)
      light.intensity =
        (spec.light.intensity -
          1 +
          Math.sin(time * 5.3) * 1.1 +
          Math.sin(time * 8.7 + 0.8) * 0.65) *
        heat
      right.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      toward
        .setFromMatrixColumn(camera.matrixWorld, 2)
        .setY(0)
        .normalize()
        .multiplyScalar(spec.toward)
      const { cols, rows } = spec,
        [cw, ch] = spec.cell
      for (let r = 0; r < rows; r++)
        for (let c = -cols; c <= cols; c++) {
          const h = r / (rows - 1)
          const width =
            (cols + 0.5) * (1 - h * 0.8) * (0.85 + 0.15 * Math.sin(time * 2.3 + r * 0.7))
          const shape =
            1 - Math.abs(c + Math.sin(time * 1.7 + r * 0.45) * h * 1.6) / Math.max(0.6, width)
          if (shape <= 0) continue
          const n =
            Math.sin(c * 1.7 + r * 0.9 - time * 7.5) *
            Math.sin(c * 0.6 - r * 1.3 - time * 5.1 + 1.3)
          const flick = fract(
            Math.sin((c + 13) * 12.9 + (r - Math.floor(time * 9)) * 78.2) * 43758.5,
          )
          const heatValue =
            (Math.pow(shape, 1.6) * (1 - h * 0.85) * 1.7 + n * 0.3 + flick * 0.2 - 0.12) * heat
          if (heatValue < 0.14 || (h > 0.55 && flick > 0.8)) continue
          const k = Math.min(top, Math.floor((1 - Math.min(1, heatValue)) * RAMP.length))
          const [glyph, colour] = RAMP[k]
          cloud.push(
            camp.x + toward.x + right.x * c * cw + (steam > 0 ? h * 0.25 : 0),
            0.2 + r * ch,
            camp.z + toward.z + right.z * c * cw,
            spec.letter,
            glyph,
            colour,
            0.9 + Math.min(0.1, heatValue * 0.1),
          )
        }
      const [hot, warm, cool] = spec.embers.letters,
        embers = spec.embers.count
      for (let i = 0; i < embers; i++) {
        // Ember bed: a ring of glowing letters on the logs that breathes.
        const a = (i / embers) * Math.PI * 2,
          r = 0.2 + fract(i * 0.618) * 0.32,
          glow = 0.55 + 0.45 * Math.sin(time * 2.7 + i * 1.9)
        cloud.push(
          camp.x + Math.cos(a) * r,
          0.1,
          camp.z + Math.sin(a) * r,
          0.15,
          glow > 0.75 ? hot : glow > 0.45 ? warm : cool,
          glow > 0.75 ? [1, 0.66, 0.25] : [0.85, 0.3, 0.08],
          (0.45 + glow * 0.5) * heat,
        )
      }
      const smoke = spec.smoke.letters
      for (let i = 0; i < spec.sparks + spec.smoke.count; i++) {
        const life = fract(time * (0.32 + fract(i * 0.41) * 0.3) + i * 0.618)
        const spark = i < spec.sparks
        const swirl = life * 5 + i
        cloud.push(
          camp.x + Math.sin(swirl) * (0.12 + life * 0.45),
          0.55 + life * (spark ? 2.6 : 2.2) * heat,
          camp.z + Math.cos(swirl) * (0.12 + life * 0.35),
          spark ? 0.13 : 0.2,
          spark ? (life < 0.2 ? '*' : '.') : smoke[i % smoke.length],
          spark ? [1, 0.75 - life * 0.3, 0.3] : spec.smoke.color,
          (1 - life) * (spark ? 1 : 0.5) * heat,
        )
      }
      if (steam > 0) {
        // Pale steam replaces the tall flame when a shower quenches the logs.
        for (let i = 0; i < 58; i++) {
          const life = fract(time * 0.42 + i * 0.618),
            a = i * 2.399
          const radius = 0.12 + life * 0.48
          cloud.push(
            camp.x + Math.cos(a + life * 3) * radius + life * 0.4,
            0.2 + life * 1.65,
            camp.z + Math.sin(a) * radius,
            0.11 + life * 0.07,
            '.,:~'[i % 4],
            [0.56, 0.63, 0.67],
            Math.sin(life * Math.PI) * steam * 0.6,
          )
        }
        for (let i = 0; i < 8; i++) {
          const life = fract(time * 2.1 + i * 0.618),
            a = i * 2.399
          cloud.push(
            camp.x + Math.cos(a) * (0.16 + life * 0.38),
            0.18 + Math.sin(life * Math.PI) * 0.28,
            camp.z + Math.sin(a) * (0.16 + life * 0.38),
            0.08,
            ',',
            [0.58, 0.68, 0.73],
            (1 - life) * 0.55,
          )
        }
      }
    },
  }
}
