import * as THREE from 'three'
import { createGlyphCloud } from './glyphCloud'
import { swampSurface, swampWeather, swampWetness } from './swamp'
import { rainDrop, RAIN_COUNT } from './rain'
import type { SwampHydrology } from './swampHydrology'
import type { WaterFrame } from './water'
import { createFootWaterContacts } from './footWater'

const fract = (value: number) => value - Math.floor(value)
const hash = (value: number) => fract(Math.sin(value * 127.1 + 311.7) * 43758.5453)
type Ripple = { x: number; z: number; at: number; strength: number; rain?: boolean; displaced?: boolean; footHeading?: number }

export function createSwampWater(hydrology: SwampHydrology) {
  const scene = new THREE.Scene(), cloud = createGlyphCloud(16000)
  scene.add(cloud.mesh)
  const points: { x: number; z: number; seed: number }[] = []
  for (let z = -12; z < 12; z += .38) for (let x = -11; x < 11; x += .38) {
    if (swampWetness(x, z, .31) > .5) points.push({ x, z, seed: hash(x * 12 + z * 53) })
  }
  const ripples: Ripple[] = []
  const phases = new Float32Array(RAIN_COUNT).fill(-1)
  const footWater = createFootWaterContacts()
  let foeGait = 0, previousFeedback: string | undefined, level = .18, nextBodyWake = 0, nextFoeStep = 0
  const push = (x: number, z: number, time: number, strength: number, rain = false, footHeading?: number) => {
    if (swampSurface(x, z, level) !== 'water') return
    ripples.push({ x, z, at: time, strength, rain, footHeading })
  }
  function footWave(x: number, z: number, heading: number, radius: number, alpha: number, bow = false) {
    for (let i = 0; i < 13; i++) {
      if (!bow && (i === 3 || i === 9)) continue
      const angle = bow ? (i / 12 - .5) * Math.PI * 1.25 : i / 13 * Math.PI * 2
      const across = Math.sin(angle) * radius * .8, forward = Math.cos(angle) * radius
      const px = x + Math.cos(heading) * across + Math.sin(heading) * forward
      const pz = z - Math.sin(heading) * across + Math.cos(heading) * forward
      if (swampSurface(px, pz, level) !== 'water') continue
      cloud.push(px, level + .028, pz, .11, i % 3 ? '~' : '-', [.46,.62,.68], alpha)
    }
  }
  // Screen-space axes: each ring is drawn as an ASCII circle, picking the
  // letter from its tangent on screen — _ and - across the top and bottom,
  // | on the sides, / and \\ on the diagonals — like |____| in a terminal.
  const screenRight = new THREE.Vector3(1, 0, 0), screenDepth = new THREE.Vector3(0, 0, -1)
  function ring(x: number, z: number, radius: number, alpha: number, bright: number, seed: number, rain = false) {
    const count = Math.max(rain ? 8 : 14, Math.ceil(radius * (rain ? 26 : 22)))
    for (let i = 0; i < count; i++) {
      if (!rain && hash(i + seed * 7) < .1) continue
      const angle = i / count * Math.PI * 2
      const ox = Math.cos(angle), oz = Math.sin(angle)
      const px = x + ox * radius, pz = z + oz * radius
      // Wet banks show the rings too; only dry boardwalk planks stay clean.
      const surface = swampSurface(px, pz, level)
      if (surface === 'wood') continue
      const sx = ox * screenRight.x + oz * screenRight.z, sy = ox * screenDepth.x + oz * screenDepth.z
      const glyph = Math.abs(sy) > Math.abs(sx) * 1.9 ? (sy > 0 ? '-' : '_') : Math.abs(sx) > Math.abs(sy) * 1.9 ? '|' : sx * sy > 0 ? '/' : '\\'
      const dim = surface === 'water' ? 1 : .7
      cloud.push(px, surface === 'water' ? level + .045 : .2, pz, rain ? .13 : .19, glyph, [bright * .72 * dim, bright * .9 * dim, bright * dim], alpha * dim)
    }
  }
  return {
    scene, uniforms: cloud.uniforms, occludeWith: cloud.occludeWith,
    update(time: number, camera: THREE.OrthographicCamera, height: number, brightness: number, frame?: WaterFrame) {
      cloud.clear(); level = swampWeather(time).level
      screenRight.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      camera.getWorldDirection(screenDepth).setY(0).normalize()
      const hero = frame?.hero ?? new THREE.Vector3()
      const feet = footWater.sample(frame?.feet ?? [], level, frame?.dt ?? 0, frame?.active === true, frame?.travelled ?? 0)
      for (const foot of feet) {
        if (foot.landed) push(foot.x, foot.z, time, .8, false, frame?.heading ?? 0)
        else if (foot.puddle) push(foot.x, foot.z, time, .45, false, frame?.heading ?? 0)
        if (foot.drag > .12) {
          footWave(foot.x, foot.z, foot.heading, .12, foot.drag * .52, true)
          if (frame?.active) hydrology.field.disturb(foot.x, foot.z, foot.drag * (frame.dt ?? 0) * .5, .12)
        }
      }
      if (frame?.active) {
        foeGait += frame.foeTravelled ?? 0
        if (foeGait >= .4 && time >= nextFoeStep && frame.foe && !frame.foeDead) {
          foeGait = 0; nextFoeStep = time + .6; push(frame.foe.x, frame.foe.z, time, .75)
        }
        // A submerged creature displaces water even while swaying in place.
        if (frame.foe && !frame.foeDead && time > nextBodyWake) {
          nextBodyWake = time + 1.4; push(frame.foe.x, frame.foe.z, time, .45)
        }
        if (frame.feedbackId !== previousFeedback) {
          const struck = frame.feedbackTarget === 'player' ? hero : frame.foe
          if (struck) push(struck.x, struck.z, time + .2, frame.foeDead ? 1.7 : .85)
          previousFeedback = frame.feedbackId
        }
        // Splash exactly where a falling streak reaches the surface.
        for (let i = 0; i < RAIN_COUNT; i++) {
          const drop = rainDrop(i, time)
          if (phases[i] >= 0 && drop.phase < phases[i] && Math.hypot(drop.x - hero.x, drop.z - hero.z) < 9) {
            if (i % 3 === 0) push(drop.impactX, drop.impactZ, time, .24 + hash(i) * .18, true)
          }
          phases[i] = drop.phase
        }
      }
      for (const p of points) {
        if (Math.hypot(p.x - hero.x, p.z - hero.z) > 10 || swampSurface(p.x, p.z, level) !== 'water') continue
        const wave = Math.sin(p.z * 8 + Math.sin(p.x * 1.5) + time * .9) + Math.sin(p.x * 6 - time * .8) * .35
        if (wave < 1.05 || p.seed < .65) continue
        const light = .21 + wave * .055
        cloud.push(p.x, level + .025, p.z, .11, p.seed > .7 ? '~' : '-', [light * .53, light * .79, light], .5)
        const lamp = Math.exp(-((p.x - hero.x) ** 2 * 2.8 + (p.z - hero.z - .65) ** 2 * .7))
        if (lamp > .15) cloud.push(p.x, level + .04, p.z, .11, '-', [.55,.38,.18], lamp * .55)
      }
      for (let n = ripples.length - 1; n >= 0; n--) {
        const r = ripples[n], age = time - r.at, life = r.rain ? .65 : r.footHeading !== undefined ? 1.05 : 1.6
        if (age > life) { ripples.splice(n, 1); continue }
        if (age < 0) continue
        if (!r.displaced) { hydrology.field.disturb(r.x, r.z, r.strength * (r.rain ? .14 : .65), r.rain ? .13 : .28); r.displaced = true }
        const fade = Math.max(0, 1 - age / life)
        const force = Math.min(1, r.strength)
        if (r.footHeading !== undefined) {
          footWave(r.x, r.z, r.footHeading, .09 + age * .46, fade * .65)
          if (age > .12) footWave(r.x, r.z, r.footHeading, .055 + (age - .12) * .33, fade * .22)
          if (age < .3) for (let i = 0; i < 5; i++) {
            const direction = r.footHeading + Math.PI + (i - 2) * .55
            const spread = .04 + age * (.25 + hash(i) * .5)
            const y = level + .025 + Math.max(0, age * (.7 + hash(i + 8) * .25) - age * age * 3.8)
            cloud.push(r.x + Math.sin(direction) * spread, y, r.z + Math.cos(direction) * spread,
              .08, i % 2 ? '.' : ',', [.53,.7,.77], (1 - age / .3) * .7)
          }
          continue
        }
        ring(r.x, r.z, (r.rain ? .025 : .12) + age * (r.rain ? .38 : .64 * Math.sqrt(force)), fade * (r.rain ? .34 : .62 * force), r.rain ? .48 : .66, r.at, r.rain)
        if (r.rain && age < .12) for (const side of [-1, 1]) {
          cloud.push(r.x + side * age * .42, level + .04 + Math.sin(age / .12 * Math.PI) * .075,
            r.z + side * age * .18, .085, side < 0 ? ',' : '.', [.60,.74,.8], (1 - age / .12) * .6)
        }
        if (!r.rain && age < 1.2 && force > .6) ring(r.x, r.z, .12 + age * .55, (1 - age / 1.2) * .3 * force, .6, r.at + 2)
        if (age < .5 && !r.rain) for (let i = 0; i < 11; i++) {
          const angle = i * 2.399, radius = age * (.7 + hash(i) * 1.3)
          const y = Math.max(level, level + age * 2.2 * r.strength - age * age * 5)
          cloud.push(r.x + Math.cos(angle) * radius, y, r.z + Math.sin(angle) * radius, .105, i % 2 ? '.' : ',', [.5,.7,.82], (1 - age / .5) * .9)
        }
      }
      // Rain beads on shoulders and creature backs, then falls to the pool.
      for (const [body, bodyHeight] of [[hero, 1.75], [frame?.foe, frame?.foeHeight ?? .8]] as const) {
        if (!body || (body === frame?.foe && frame?.foeDead)) continue
        for (let i = 0; i < 9; i++) {
          const age = fract(time * 1.4 + i * .618), angle = i * 2.399
          const spread = .15 + age * .5
          const y = body.y + bodyHeight - .1 + age * .5 - age * age * 2.5
          if (y < level) continue
          cloud.push(body.x + Math.cos(angle) * spread, y, body.z + Math.sin(angle) * spread, .075, age < .2 ? ',' : '.', [.52,.68,.8], (1 - age) * .65)
        }
      }
      scene.userData.ripples = ripples.filter(r => !r.rain).length
      hydrology.update(time, frame?.active ? frame.dt ?? 0 : 0)
      cloud.commit(height, camera, brightness)
    },
    dispose() { cloud.dispose() },
  }
}
