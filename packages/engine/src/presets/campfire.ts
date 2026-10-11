import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'

const fract = (v: number) => v - Math.floor(v)

/**
 * A heat-grid effect as data (seed of the §3.3 "simulation grid" render type).
 * Defaults are the Pomorog bonfire.
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

export const POMOROG_FIRE: HeatGridSpec = {
  cols: 5, rows: 13, cell: [.15, .19], letter: .21, toward: .45,
  ramp: [['@', [1.3, 1.15, .55]], ['#', [1.3, .98, .3]], ['%', [1.25, .78, .16]], ['x', [1.2, .6, .1]], ['*', [1.1, .45, .07]], ['+', [1, .32, .05]], [':', [.85, .2, .04]], ['.', [.65, .12, .03]]],
  embers: { count: 26, letters: ['*', '+', ':'] },
  sparks: 22,
  smoke: { count: 12, letters: ',;:~', color: [.38, .36, .35] },
  light: { color: 0xffac55, intensity: 14, distance: 7, decay: 1.65, height: 1.05 },
}

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
    update(time: number, camera: THREE.Camera, heat = 1) {
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
        cloud.push(camp.x + toward.x + right.x * c * cw, .2 + r * ch, camp.z + toward.z + right.z * c * cw, spec.letter, glyph, colour, .9 + Math.min(.1, heatValue * .1))
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
    },
  }
}
