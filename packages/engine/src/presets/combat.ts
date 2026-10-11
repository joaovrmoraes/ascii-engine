import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'
import { createDustTrail } from './ambient'

/**
 * Combat effects (Pomorog `effects.ts`), all in letters, ×1.4 so they read
 * from across the map: sword crescent with spokes and sparks, creature claws,
 * lightning, fireball, frost spikes, engagement and impact rings, casting aura
 * with its own light, death dissolve and creature entrances (rise, charge
 * dust, swoop wind). Presets for the §3.3 effect system.
 */
export const IMPACT_DELAY = .2
export const FIRE_TRAVEL_TIME = .22
export type Spell = 'fire' | 'lightning' | 'frost'
export type Entry = 'charge' | 'rise' | 'swoop'

const fract = (v: number) => v - Math.floor(v)
const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t) }
const warm = [1, .63, .2], white = [1, .94, .64], blue = [.58, .78, 1], violet = [.57, .51, .94]
const danger = [.95, .3, .22], gold = [1, .82, .38]

export interface CombatFrame {
  hero: THREE.Vector3
  foe?: THREE.Vector3
  foeDead?: boolean
  /** Seconds since the creature appeared, its entrance and the anchor it arrives at. */
  spawnAge?: number
  entry?: Entry
  anchor?: THREE.Vector3
}

export function createCombatEffects(cloud: GlyphCloud) {
  const burst = new THREE.Vector3(), origin = new THREE.Vector3()
  /** Spell light at the burst; the aura lights the meadow around the caster. */
  const light = new THREE.PointLight(0xffaa55, 0, 7, 2)
  const aura = new THREE.PointLight(0xffc66b, 0, 4.5, 1.6)
  const dust = createDustTrail()
  let began = -10, spell: Spell | 'slash' = 'slash'
  let castAt = -10, struckAt = -10, deathAt = -1
  return {
    light, aura,
    /**
     * A blow (Pomorog `feedback`): `damage` false is a miss. The caster's aura
     * starts on a spell; a blow on the hero starts the claws and impact ring.
     */
    hit(time: number, blow: { target: 'hero' | 'foe'; damage: boolean; spell?: Spell; hero: THREE.Vector3; foe?: THREE.Vector3 }) {
      if (blow.target === 'foe' && blow.spell) castAt = time
      if (blow.target === 'hero' && blow.damage) struckAt = time
      if (blow.damage && (blow.spell || spell === 'slash' || time - began > 1.25)) {
        began = time + IMPACT_DELAY; spell = blow.spell ?? 'slash'
        burst.copy(blow.target === 'hero' ? blow.hero : blow.foe ?? blow.hero); burst.y = .9
        origin.copy(blow.target === 'hero' ? blow.foe ?? blow.hero : blow.hero); origin.y = 1.25
      }
    },
    /** Pushes this frame's letters; call between `cloud.clear()` and the render. */
    update(time: number, camera: THREE.Camera, frame: CombatFrame) {
      const { hero, foe, foeDead = false, spawnAge = 9, entry = 'charge', anchor } = frame
      const age = time - began
      light.position.copy(burst)
      light.color.setHex(spell === 'fire' ? 0xff991f : 0x8caaff)
      light.intensity = spell === 'slash' || age < 0 ? 0 : Math.max(0, 1 - age / 1.25) * 12
      // Combat effects read from across the map: bolder letters than ambient motes.
      const fx = (x: number, y: number, z: number, size: number, glyph: string, ink: readonly number[], alpha = 1) => cloud.push(x, y, z, size * 1.4, glyph, ink, alpha)
      if (age >= 0 && age < 1.25) {
        const dx = burst.x - origin.x, dz = burst.z - origin.z, length = Math.hypot(dx, dz) || 1
        const ax = dx / length, az = dz / length, px = -az, pz = ax
        const star = (cx: number, cy: number, cz: number, radius: number, alpha: number, colour: readonly number[], size: number) => {
          // Radial spokes drawn with the letter that matches their direction.
          for (let spoke = 0; spoke < 8; spoke++) {
            const a = spoke / 8 * Math.PI * 2, glyph = '-\\|/-\\|/'[spoke]
            for (let k = 1; k <= 3; k++) fx(cx + px * Math.cos(a) * radius * k / 3, cy + Math.sin(a) * radius * k / 3, cz + pz * Math.cos(a) * radius * k / 3, size, glyph, colour, alpha * (1.1 - k * .25))
          }
        }
        if (spell === 'fire') {
          const travel = Math.min(1, age / FIRE_TRAVEL_TIME), explosion = Math.max(0, age - FIRE_TRAVEL_TIME)
          const hx = THREE.MathUtils.lerp(origin.x, burst.x, travel), hz = THREE.MathUtils.lerp(origin.z, burst.z, travel)
          const hy = THREE.MathUtils.lerp(origin.y, burst.y, travel) + Math.sin(travel * Math.PI) * .7
          if (travel < 1) {
            light.position.set(hx, hy, hz)
            fx(hx, hy, hz, .32, '@', white, 1)
            for (let i = 1; i < 16; i++) {
              const back = Math.max(0, travel - i * .045)
              fx(THREE.MathUtils.lerp(origin.x, burst.x, back) + Math.sin(i * 3 + time * 20) * .04, THREE.MathUtils.lerp(origin.y, burst.y, back) + Math.sin(back * Math.PI) * .7,
                THREE.MathUtils.lerp(origin.z, burst.z, back), .28 - i * .014, '#%x*+:..'[Math.min(7, Math.floor(i / 2))], i < 4 ? [1, .85, .45] : warm, 1 - i / 16)
            }
          } else {
            const e = explosion
            for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 28; i++) {
              const a = i / 28 * Math.PI * 2, radius = e * (2.2 - ring * .7)
              fx(burst.x + Math.cos(a) * radius, .1 + ring * .25, burst.z + Math.sin(a) * radius, .22, ring ? 'o' : 'O', ring ? warm : [1, .85, .5], Math.max(0, 1 - e / .8))
            }
            for (let c = 0; c < 9; c++) {
              const a = c * 2.399, r = .15 + fract(c * .618) * .45
              for (let k = 0; k < 6; k++) {
                const h = k / 5
                fx(burst.x + Math.cos(a) * r, .1 + h * (1.3 * Math.min(1, e * 4)), burst.z + Math.sin(a) * r, .22 - h * .08, '@#%x+.'[k], h < .3 ? white : warm, Math.max(0, 1 - e / .9) * (1 - h * .4))
              }
            }
            if (e < .3) star(burst.x, burst.y, burst.z, .4 + e * 3, 1 - e / .3, [1, .9, .55], .2)
          }
        } else if (spell === 'lightning') {
          const flicker = .6 + .4 * Math.cos(age * 60) ** 2, fade = Math.max(0, 1 - age * 2.4) * flicker
          let x = burst.x, z = burst.z
          for (let i = 0; i < 26; i++) {
            const y = burst.y + i * .22, step = Math.sin(Math.floor(age * 24) * 3.1 + i * 2.7) * .14
            const glyph = Math.abs(step) < .05 ? '|' : step > 0 ? '/' : '\\'
            fx(x, y, z, .24, glyph, [.92, .96, 1], fade)
            fx(x + px * .1, y, z + pz * .1, .2, glyph, blue, fade * .8)
            fx(x - px * .1, y, z - pz * .1, .2, glyph, violet, fade * .6)
            x += px * step; z += pz * step
            if (i % 7 === 3) for (let b2 = 1; b2 < 4; b2++) fx(x + px * b2 * .14 * (i % 2 ? 1 : -1), y - b2 * .12, z + pz * b2 * .14, .16, i % 2 ? '\\' : '/', blue, fade * .7)
          }
          for (let i = 0; i < 36; i++) {
            const a = i / 36 * Math.PI * 2, radius = .3 + age * 2.4 * (.6 + fract(i * .4) * .4)
            fx(burst.x + Math.cos(a) * radius, .06, burst.z + Math.sin(a) * radius, .18, '~-=+'[i % 4], i % 3 ? blue : violet, Math.max(0, 1 - age * 1.4))
          }
          if (age < .25) star(burst.x, burst.y, burst.z, .7, 1 - age / .25, [.85, .92, 1], .22)
        } else if (spell === 'frost') {
          for (let spike = 0; spike < 13; spike++) {
            const a = spike / 13 * Math.PI * 2, radius = .55 + age * .4, h = (.7 + fract(spike * .618) * 1.4) * smooth((age - spike * .012) * 6)
            for (let j = 0; j < 9; j++) {
              const p = j / 8
              fx(burst.x + Math.cos(a) * radius * (1 - p * .25), .08 + p * h, burst.z + Math.sin(a) * radius * (1 - p * .25), .24 - p * .08, j === 8 ? '^' : j > 5 ? 'A' : '#', j > 5 ? [.85, .95, 1] : blue, Math.min(1, (1.25 - age) * 3))
            }
          }
          for (let i = 0; i < 20; i++) {
            const life = fract(age * 1.5 + i * .618), a = i * 2.399
            fx(burst.x + Math.cos(a) * life * 1.2, .3 + life * 1.4, burst.z + Math.sin(a) * life * 1.2, .16, '*', [.85, .95, 1], (1 - life) * Math.min(1, (1.25 - age) * 3))
          }
        } else if (age < .6) {
          // Sword: a thick crescent sweeps across the target leaving a fading
          // trail, then a star of spokes and sparks that fall with gravity.
          const sweep = Math.min(1, age / .16)
          for (let row = 0; row < 3; row++) for (let i = 0; i < 18; i++) {
            const p = i / 17
            if (p > sweep) continue
            const behind = sweep - p, alpha = Math.max(0, 1 - behind * 2.2) * Math.max(0, 1 - Math.max(0, age - .16) / .3)
            if (alpha <= 0) continue
            const arc = -1.1 + p * 2.2, r = .75 + row * .12
            const glyph = behind < .12 ? (row === 1 ? '#' : '/') : behind < .35 ? (row === 1 ? '/' : '-') : row === 1 ? ':' : '.'
            fx(burst.x + px * Math.sin(arc) * r - ax * .25, burst.y + Math.cos(arc) * r * .6 - .15, burst.z + pz * Math.sin(arc) * r - az * .25,
              .2 + (row === 1 ? .04 : 0), glyph, behind < .12 ? white : [.75, .88, 1], alpha)
          }
          if (age > .12 && age < .4) star(burst.x, burst.y, burst.z, .25 + (age - .12) * 2.5, 1 - (age - .12) / .28, white, .2)
          for (let i = 0; i < 18; i++) {
            const t2 = Math.max(0, age - .12), a = i * 2.399, v = 1.4 + fract(i * .37) * 1.6
            if (t2 <= 0) continue
            fx(burst.x + px * Math.cos(a) * v * t2 - ax * t2 * .6, burst.y + Math.sin(a) * v * t2 * .7 + 1.2 * t2 - 4.5 * t2 * t2, burst.z + pz * Math.cos(a) * v * t2 - az * t2 * .6,
              .14, i % 3 ? '.' : '*', [1, .85, .5], Math.max(0, 1 - t2 / .45))
          }
        }
      }
      // Creature claws: three red rakes over the hero when a blow lands.
      const clawAge = time - struckAt - IMPACT_DELAY + .05
      if (clawAge >= 0 && clawAge < .5) {
        const draw = Math.min(1, clawAge / .12), fade = Math.max(0, 1 - Math.max(0, clawAge - .12) / .38)
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), cx = right.x, cz = right.z
        for (let c = 0; c < 3; c++) for (let i = 0; i < 9; i++) {
          const p = i / 8; if (p > draw) continue
          const off = (c - 1) * .2
          fx(hero.x + cx * (off + (p - .5) * .5), 1.75 - p * 1.1, hero.z + cz * (off + (p - .5) * .5), .22, p > draw - .2 ? '#' : '\\', [1, .28 + p * .1, .22], fade)
        }
      }
      // A slain creature dissolves into letters that rise and scatter.
      if (foe && foeDead) { if (deathAt < 0) deathAt = time } else deathAt = -1
      const dissolve = deathAt < 0 ? -1 : time - deathAt
      if (dissolve >= 0 && dissolve < 1.6) for (let i = 0; i < 60; i++) {
        const life = Math.min(1, dissolve / 1.6), a = i * 2.399, start = fract(i * .618)
        const rise = Math.max(0, dissolve - start * .4)
        if (rise <= 0) continue
        fx(foe!.x + Math.cos(a) * (.2 + rise * .6), .2 + start * 1.1 + rise * 1.3, foe!.z + Math.sin(a) * (.2 + rise * .5),
          .17, '@#%*+:.'[Math.min(6, Math.floor(rise * 5))], i % 4 ? [.9, .82, .66] : [1, .6, .25], Math.max(0, 1 - rise / 1.2) * (1 - life * .3))
      }
      const fighting = foe && !foeDead
      if (foe && fighting && spawnAge > .5) {
        // A dotted engagement ring on the ground marks who is in the fight.
        const reveal = smooth((spawnAge - .5) / .6), radius = .95
        for (let i = 0; i < 64; i++) {
          const a = i / 64 * Math.PI * 2 + time * .25
          cloud.push(foe.x + Math.cos(a) * radius, .05, foe.z + Math.sin(a) * radius * .92, i % 8 ? .15 : .19, i % 8 ? 'o' : '*', danger, .8 * reveal * (i % 2 ? .65 : 1))
        }
      }
      const strikeAge = time - struckAt
      if (strikeAge >= 0 && strikeAge < .6) {
        // The incoming blow tightens a red ring on the hero, then it flashes out.
        const closing = Math.min(1, strikeAge / .28), radius = strikeAge < .28 ? 1.2 - closing * .8 : .4 + (strikeAge - .28) * 2.2
        const alpha = strikeAge < .28 ? .35 + closing * .6 : Math.max(0, 1 - (strikeAge - .28) / .32)
        for (let i = 0; i < 40; i++) {
          const a = i / 40 * Math.PI * 2
          cloud.push(hero.x + Math.cos(a) * radius, .06, hero.z + Math.sin(a) * radius, strikeAge < .28 ? .15 : .2, strikeAge < .28 ? 'o' : '*', danger, alpha)
        }
      }
      const castAge = time - castAt
      aura.intensity = 0
      if (castAge >= 0 && castAge < 1.1) {
        // Golden aura: an orbit of glyphs, rising motes and a warm pool of light.
        const strength = Math.sin(Math.min(1, castAge / 1.1) * Math.PI)
        aura.intensity = strength * 9
        aura.position.set(hero.x, .9, hero.z)
        for (let i = 0; i < 36; i++) {
          const a = i / 36 * Math.PI * 2 + castAge * 5, tilt = Math.sin(a * 2 + castAge * 3) * .12
          cloud.push(hero.x + Math.cos(a) * .62, .95 + tilt, hero.z + Math.sin(a) * .62, i % 3 ? .15 : .2, i % 3 ? 'o' : '*', gold, strength * .9)
        }
        for (let i = 0; i < 26; i++) {
          const life = fract(castAge * 1.4 + i * .618), a = i * 2.399
          cloud.push(hero.x + Math.cos(a) * (.25 + life * .3), .1 + life * 2.1, hero.z + Math.sin(a) * (.25 + life * .3), i % 2 ? .13 : .17, i % 2 ? '+' : '*', i % 3 ? gold : white, strength * (1 - life))
        }
      }
      if (foe && anchor && spawnAge < 2.2) {
        const dirt = [.5, .4, .27]
        if (entry === 'rise') {
          // The ground cracks open in radiating strokes, then soil erupts.
          const crack = Math.min(1, spawnAge / .3), fade = Math.max(0, 1 - Math.max(0, spawnAge - 1.2) / 1)
          for (let spoke = 0; spoke < 10; spoke++) {
            const a = spoke / 10 * Math.PI * 2 + .3, glyph = '-\\|/-\\|/-\\'[Math.round(spoke / 10 * 8) % 8]
            for (let k = 1; k <= 4; k++) {
              if (k / 4 > crack) continue
              const r = .25 + k * .22 * (1 + fract(spoke * .37) * .4)
              cloud.push(anchor.x + Math.cos(a) * r, .04, anchor.z + Math.sin(a) * r, .2, glyph, [.3, .24, .16], fade * .95)
            }
          }
          for (let i = 0; i < 46; i++) {
            const t = spawnAge - .2 - fract(i * .618) * .9
            if (t < 0 || t > .9) continue
            const a = i * 2.399, v = 1 + fract(i * .41) * 1.5
            cloud.push(anchor.x + Math.cos(a) * (.2 + v * t * .6), .1 + v * t * 1.6 - 3.2 * t * t, anchor.z + Math.sin(a) * (.2 + v * t * .6),
              .18, ',.`;:o*'[i % 7], i % 5 ? dirt : [.62, .56, .44], 1 - t / .9)
          }
        } else if (entry === 'charge') {
          // Dust kicked up along the charge, settling behind the creature.
          if (spawnAge < 1.4) dust.add(foe.x, foe.z, time, .045)
        } else {
          // Wind streaks fall away as the flyer swoops in.
          for (let i = 0; i < 24; i++) {
            const t = spawnAge - fract(i * .618) * .8
            if (t < 0 || t > .7) continue
            cloud.push(foe.x + Math.sin(i * 3.1) * .6, foe.y + .4 + t * 1.6 + fract(i * .37) * .6, foe.z + Math.cos(i * 2.3) * .6, .18, i % 2 ? '~' : '-', [.7, .78, .82], (1 - t / .7) * .8)
          }
        }
      }
      dust.push(cloud, time)
    },
  }
}
export type CombatEffects = ReturnType<typeof createCombatEffects>
