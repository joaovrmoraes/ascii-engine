import * as THREE from 'three'
import { createMarshWater, marshShoreGLSL, type MarshIsland } from '../pomorog/marshWater'
import { createRain, stormAt, type AsciiEngine, type AsciiPassHook, type GroundCover, type SurfaceKind } from '@ascii-engine/core'
import { createTree, declare } from '../scene/pomorogKit'
import { createShoreDetails } from '../scene/shoreDetails'
import { createFixedMapActors, legacyFloor } from './common'
import type { Area, AreaOptions } from './types'

/**
 * Rain Marsh (Pomorog `swampEnvironment.ts`, `swampWater.ts`, `rain.ts`,
 * `storm.ts`). Water and rain keep the approved old screen-pass look; trees,
 * stones, reeds, boardwalk and banks are letters on the objects.
 */
const WATER_Y = .18
const ISLANDS: MarshIsland[] = [
  { x: -3, z: 2.6, rx: 2.65, rz: 2.05 },
  { x: -5.7, z: -4.9, rx: 1.8, rz: 1.4 },
  { x: 5.4, z: -3, rx: 1.45, rz: 1.7 },
]
/** Rain fills the low banks over the first minute; showers come and go; rain quenches the fire. */
export function marshWeather(time: number) {
  const flood = 1 - Math.exp(-Math.max(0, time) / 24)
  const shower = .5 + .5 * Math.sin(time * .48 + .7)
  const quench = Math.pow(Math.max(0, Math.sin(time * .79 - .6)), 4)
  return { level: WATER_Y + flood * .13, flood, rain: .65 + shower * .35, fire: .78 - quench * .62, steam: .15 + quench * .85 }
}
const boardwalk = (x: number, z: number) => x > -4.1 && x < 1.8 && Math.abs(z - 4.95) < .6

/** Screen-pass hook: actors below the water line turn blue-grey (was `swampShoreGLSL` in `ascii.ts`). */
const hookUniforms = { wetWeather: { value: 1 }, waterLevel: { value: WATER_Y } }
export const marshHooks: AsciiPassHook[] = [{
  uniforms: hookUniforms,
  declarations: `uniform float wetWeather, waterLevel;\n${marshShoreGLSL(ISLANDS)}`,
  color: `if (wetWeather > .5 && actor > .5) {
    float wet = (1.-smoothstep(waterLevel, waterLevel+.45, worldPoint.y))
      * step(1.-(waterLevel-${WATER_Y.toFixed(2)})*1.35, marshShore(worldPoint.xz));
    color = mix(color, color * vec3(.55,.74,.85) + vec3(.025,.065,.085), wet*.7);
  }`,
}]

export function createMarsh(engine: AsciiEngine, options: AreaOptions = {}): Area {
  const root = new THREE.Group(); root.name = 'marsh'
  let seed = 7401
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const cube = new THREE.BoxGeometry(1, 1, 1), rock = new THREE.DodecahedronGeometry(1, 0), cylinder = new THREE.CylinderGeometry(.72, 1, 1, 7)
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  function material(color: number, surface: SurfaceKind) {
    const key = `${color}:${surface}`
    let mat = materials.get(key)
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({ color, roughness: .82, flatShading: true })
      // A little bounced moonlight keeps the unlit side of bare wood readable.
      if (surface === 'wood' || surface === 'bark') { mat.emissive.setHex(0x657786); mat.emissiveIntensity = .22 }
      materials.set(key, mat)
    }
    return mat
  }
  function mesh(geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, surface: SurfaceKind = 'wood') {
    const object = new THREE.Mesh(geometry, material(color, surface))
    object.position.set(x, y, z); object.scale.set(sx, sy, sz); object.castShadow = true; object.receiveShadow = true; root.add(object)
    return declare(object, surface)
  }

  const floor = legacyFloor(); engine.add(floor)
  // Rings, wakes and splashes live in the water's own particle buffer.
  const rings = engine.createParticles(16000)
  engine.add(rings.mesh, { glyph: 'particle' })
  const marsh = createMarshWater(rings, { islands: ISLANDS, baseLevel: WATER_Y, isWood: boardwalk })
  const pool = engine.addWater(marsh)
  engine.add(pool.mesh, { glyph: 'water' })

  for (const island of ISLANDS) {
    const bank = mesh(new THREE.CircleGeometry(1, 40), 0x4f6046, island.x, .17, island.z, island.rx, island.rz, 1, 'earth')
    bank.rotation.x = -Math.PI / 2
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, radius = .94 + random() * .12
      mesh(rock, 0x5b6665, island.x + Math.cos(a) * island.rx * radius, .12, island.z + Math.sin(a) * island.rz * radius, .12 + random() * .18, .12, .14, 'stone')
    }
  }
  // Eroded outcrops give the flooded lane a readable edge and tall reflections.
  for (const [x, z, size] of [[-2.8, -.1, .65], [3.2, 1.5, .52], [3.2, -3.8, .7], [-3.4, -4.4, .56], [-4.2, 4.3, .48]]) {
    const stone = mesh(rock, 0x929e99, x, .2 + size * .38, z, size, size * .85, size * .78, 'stone')
    stone.rotation.set(.16, x * 1.7, -.12)
    const moss = mesh(rock, 0x64815a, x - size * .12, .2 + size * 1.08, z, size * .8, size * .12, size * .64, 'foliage')
    moss.rotation.y = stone.rotation.y
    mesh(rock, 0x687c77, x + size * .8, .22, z + size * .3, size * .4, size * .3, size * .45, 'stone')
  }
  const reeds: { mesh: THREE.Mesh; rest: number; phase: number }[] = []
  for (let i = 0; i < 90; i++) {
    const x = (i % 2 ? -1 : 1) * (3.1 + random() * 4.4), z = -9 + random() * 18
    if (Math.hypot(x + 3, z - 2.6) < 2.7) continue
    for (let j = 0; j < 3; j++) {
      const h = .45 + random() * .65, px = x + (random() - .5) * .4, pz = z + (random() - .5) * .4
      const stem = mesh(cylinder, 0x5c746d, px, .17 + h / 2, pz, .025, h, .025, 'foliage')
      reeds.push({ mesh: stem, rest: (random() - .5) * .2, phase: i + j })
      if (j === 0) mesh(cylinder, 0x6f6651, px, .2 + h, pz, .065, .23, .065)
    }
  }
  // A damaged boardwalk and a stilt shack give scale to the flooded crossing.
  for (let i = 0; i < 29; i++) mesh(cube, i % 3 ? 0x6d6b5e : 0x858073, -4 + i * .2, .29, 4.95, .18, .10, 1.1).rotation.y = (random() - .5) * .05
  for (const x of [-3.8, -1.4, 1.5]) for (const z of [4.35, 5.55]) mesh(cylinder, 0x69716a, x, .5, z, .06, .95, .06)
  for (const x of [-6.5, -4.8]) for (const z of [-5.6, -4.1]) mesh(cube, 0x66716b, x, .8, z, .12, 1.6, .12)
  for (let i = 0; i < 11; i++) {
    mesh(cube, 0x5f625c, -6.6 + i * .18, .48, -4.8, .16, .1, 1.8)
    mesh(cube, 0x798076, -6.7 + i * .2, 2.1 - Math.abs(i - 5) * .1, -4.8, .18, .07, 2.1).rotation.z = i < 5 ? .46 : -.46
  }
  const floaters: THREE.Mesh[] = []
  for (let i = 0; i < 60; i++) {
    const x = -7 + random() * 14, z = -8 + random() * 16
    if (marsh.wetness(x, z, WATER_Y) < .5 || Math.abs(x) < 1.8) continue
    const pad = mesh(new THREE.CircleGeometry(.16 + random() * .09, 7, .15, Math.PI * 1.8), 0x49675e, x, .195, z, 1, 1, 1, 'foliage')
    pad.rotation.x = -Math.PI / 2; pad.rotation.z = random() * 6
    floaters.push(pad)
  }
  const banks = createShoreDetails(ISLANDS, boardwalk)
  root.add(banks.group)
  engine.add(root, options.screen ? { glyph: 'screen' } : {})

  const trees = [[-4.0, -.4, 3.9], [4.5, -2.2, 4.2], [-4.8, -6, 4.6], [4.1, -7.2, 4.7], [-6.7, 5.4, 4.1], [6.8, 6.5, 4.4], [.6, -10, 4.5]]
    .map(([x, z, h], i) => {
      const tree = createTree(x, z, h, 931 + i * 137, true)
      engine.add(tree.root, options.screen ? { glyph: 'screen', parts: { trunk: { surface: 'bark' }, crown: { surface: 'foliage' } } } : { type: 'tree' })
      return tree
    })

  // Sedge on the islands and soaked banks; open water stays clear.
  const pickOf = (list: number[], r: () => number) => list[Math.floor(r() * list.length)]
  const cover: GroundCover = {
    count: 40000, y: () => .17,
    density: (x, z) => marsh.wetness(x, z, WATER_Y) < .42 ? .9 : 0,
    pick(r) {
      const shade = .5 + r() * .55, olive = r()
      return { glyph: pickOf([0, 0, 1, 2, 5, 3], r), height: .14 + r() * .2, color: [(.16 + olive * .12) * shade, (.38 + olive * .06) * shade, (.3 - olive * .08) * shade] }
    },
  }
  const carpet = engine.createCarpet(cover)
  if (!options.screen) engine.add(carpet.mesh, { glyph: 'carpet' })

  const actors = createFixedMapActors(engine, options, {
    route: [[-.3, 3.4], [1.3, 3.4], [2.2, 1.2], [.7, -1.2], [-.4, -3.7], [-2.6, -4.1], [-.5, -1.7], [1.2, 1.2], [1.3, 4.95], [-2.5, 4.95], [-1.4, 3.1]],
    heightAt: (x, z) => boardwalk(x, z) ? .34 : 0,
    wadingAt: (x, z) => marsh.surface(x, z) === 'water',
  })
  const streaks = engine.createRainStreaks(800)
  engine.add(streaks.mesh, { glyph: 'particle' })
  const bolts = engine.createParticles(64)
  engine.add(bolts.mesh, { glyph: 'particle' })
  const rain = createRain(streaks, bolts)
  const { hemisphere, fill } = engine.lights
  let flash = 0

  return {
    id: 'rain_marsh', title: 'Rain Marsh',
    hero: actors.player.root.position,
    get state() { return `level:${marsh.level.toFixed(3)} fire:${marshWeather(engine.time).fire.toFixed(2)} wakes:${marsh.wakes} flash:${flash.toFixed(2)} wading:${actors.state.wading}` },
    focus: actors.focus,
    update(time, dt) {
      const weather = marshWeather(time), storm = stormAt(time)
      flash = storm?.flash ?? 0
      engine.setFlash(flash)
      hemisphere.intensity = engine.style.hemisphere.intensity + flash * 1.9
      fill.intensity = engine.style.fill.intensity + flash * 3.5
      hookUniforms.waterLevel.value = weather.level
      const travelled = actors.update(time, dt)
      const hero = actors.player.root.position
      streaks.clear(); bolts.clear()
      rain.update(time, engine.camera, hero, weather.level, weather.rain, storm)
      engine.setGain(streaks, 1 + flash * .55); engine.setGain(bolts, 1 + flash * .8)
      rings.clear()
      marsh.update(time, weather.level, engine.camera, {
        hero, heading: actors.player.root.rotation.y, travelled, active: true, dt, feet: actors.feet, rain,
      })
      actors.burn(time, weather.fire, weather.steam)
      actors.fireflies(actors.ambient, time, 1 - weather.rain * .6)
      banks.animate(time)
      trees.forEach((tree) => tree.animate(time))
      floaters.forEach((pad, i) => { pad.position.y = weather.level + .016 + Math.sin(time * 1.5 + i) * .007 })
      reeds.forEach(({ mesh: stem, rest, phase }) => { stem.rotation.z = rest + Math.sin(time * 1.6 + phase) * .045 })
    },
    dispose() {},
  }
}
