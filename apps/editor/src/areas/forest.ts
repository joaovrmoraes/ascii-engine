import * as THREE from 'three'
import {
  circuitGLSL, createCampfire, createChunkStreamer, createCircuit, createDustTrail, pushFireflies, pushLanternMotes,
  waterEdge, waterEdgeGLSL, type AsciiEngine, type Circuit, type GroundCover, type Water, type WaterShape,
} from '@ascii-engine/core'
import { cap, createCamp, createKit, createTree, log, rock } from '../scene/pomorogKit'
import { createAdventurer } from '../pomorog/models'
import { damp, smooth, turn } from '../pomorog/motion'
import { loopLength, paceAt, solveBaseSpeed } from '../pomorog/pacing'
import type { Area, AreaOptions } from './types'
import { createEncounters } from './encounters'

/**
 * Dark Forest (Pomorog `forestWorld.ts` + `scene.ts`): a closed winding trail
 * generated in 20 m chunks from the chunk index, the bonfire at s = 0, a lit
 * floor and a grass carpet that follow the traveller forever (shaders), lakes
 * and meandering streams with letter reflections and footbridges.
 */
const CHUNK = 20
const MAX_STREAMS = 3
/** Demo cycle (Pomorog `?demo=1`): a hunt sized by walking time, then the bonfire. */
const CAMP_SECONDS = 30, DEPART_SECONDS = 3

const forestSoilGLSL = `
  uniform vec4 streams[${MAX_STREAMS}];
  uniform vec3 campAt;
  ${circuitGLSL}
  float soilHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float soilNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(soilHash(i), soilHash(i + vec2(1., 0.)), f.x), mix(soilHash(i + vec2(0., 1.)), soilHash(i + 1.), f.x), f.y);
  }
  ${waterEdgeGLSL}
  // .x: bare soil 0-1 (trail, camp clearing, banks). .y: water bed.
  vec2 forestSoil(vec2 p) {
    float edge = (soilNoise(p * 2.4) - .5) * .5;
    float path = 1. - smoothstep(.26, .6, abs(trailOffset(p)) + edge);
    float clearing = 1. - smoothstep(.75, 1.25, distance(p, campAt.xz) + edge);
    float bank = 0., bed = 0.;
    for (int i = 0; i < ${MAX_STREAMS}; i++) {
      if (streams[i].w == 0.) continue;
      float inside = waterEdge(p, streams[i]);
      bank = max(bank, smoothstep(-.75 + edge * .4, -.1, inside));
      bed = max(bed, smoothstep(-.05, .1, inside));
    }
    return vec2(min(1., max(path * .85, max(clearing, bank * .8))), bed);
  }
`

const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]
/** Endless forest meadow: the same blades, wrapped around the hero forever. */
function proceduralForestCover(soilUniforms: Record<string, { value: unknown }>): GroundCover {
  return {
    // Pomorog: 90 000 over 26 m; same density over the full 36 m wrap.
    count: Math.round(90000 * (36 / 26) ** 2), y: () => -.06, density: () => 1,
    infinite: { glsl: forestSoilGLSL, uniforms: soilUniforms, span: 36 },
    pick(random) {
      const flower = random() < .012, shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: .12 + random() * .16, color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
}

interface Chunk { index: number; group: THREE.Group; trees: ReturnType<typeof createTree>[]; water?: Water; shape?: WaterShape }

export function createForest(engine: AsciiEngine, options: AreaOptions = {}): Area {
  const kit = createKit()
  const HUNT_SECONDS = options.hunt ?? 90
  let loop: Circuit = createCircuit(loopLength(HUNT_SECONDS), CHUNK)
  const soilUniforms = {
    loopShape: { value: [...loop.shape] },
    streams: { value: Array.from({ length: MAX_STREAMS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    campAt: { value: new THREE.Vector3(0, 0, 9999) },
  }

  // Lit floor: colour from world position, so it can follow the hero forever.
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
  floorMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, soilUniforms)
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 forestWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nforestWorld = (modelMatrix * vec4(transformed, 1.)).xyz;')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec3 forestWorld;\n${forestSoilGLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 fp = forestWorld.xz;
        float mottle = soilNoise(fp * .32) * .55 + soilNoise(fp * .7 + 7.) * .3 + soilNoise(fp * 1.4 + 3.) * .15;
        float tuft = soilNoise(fp * 1.7 + 30.);
        vec3 moss = vec3(.15 + mottle * .09 + tuft * .07, .34 + mottle * .18 + tuft * .1, .11 + (1. - mottle) * .05);
        float dry = max(0., soilNoise(fp * .18 + 11.) - .55) * 2.2;
        moss += vec3(.13, .04, 0.) * dry;
        vec2 soil = forestSoil(fp);
        vec3 dirt = vec3(.36, .33, .26) * (.75 + tuft * .5);
        vec3 ground = mix(moss, dirt, soil.x) * .62;
        ground *= 1. - soil.y * .9;
        diffuseColor.rgb = pow(ground, vec3(2.2));`)
  }
  floorMaterial.customProgramCacheKey = () => 'forest-world-floor'
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), floorMaterial)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  engine.add(floor, options.screen ? { glyph: 'screen', surface: 'earth' } : { type: 'ground' })

  // Camp at s = 0, on the inner side of the ring.
  const camp = new THREE.Vector3(), campSeat = new THREE.Vector3()
  const campGroup = createCamp(kit)
  engine.add(campGroup, options.screen ? { glyph: 'screen' } : {})
  const fireLetters = engine.createParticles(1600)
  engine.add(fireLetters.mesh, { glyph: 'particle' })
  const fire = createCampfire(fireLetters, camp)
  engine.scene.add(fire.light)
  function pitchCamp() {
    const p = loop.point(0)
    camp.set(p.x - p.nx * 2.6, 0, p.z - p.nz * 2.6); campSeat.set(p.x - p.nx * 1.4, 0, p.z - p.nz * 1.4)
    campGroup.position.copy(camp); campGroup.rotation.y = Math.atan2(-p.nz, p.nx)
    soilUniforms.campAt.value.copy(camp)
    campGroup.updateMatrixWorld(true)
  }
  pitchCamp()
  engine.setLights({ hearth: camp })

  const carpet = engine.createCarpet(proceduralForestCover(soilUniforms))
  if (!options.screen) engine.add(carpet.mesh, { glyph: 'carpet' })

  function seeded(index: number) {
    let seed = (Math.imul(index + 7919, 2654435761) ^ 0x5bd1e995) >>> 0
    return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  }
  function waterFor(index: number): WaterShape | undefined {
    // Keep the bonfire's surroundings dry.
    if (index < 1 || index >= loop.chunks - 1) return undefined
    const r = seeded(index * 31 + 5)
    const roll = r()
    if (roll > .46) return undefined
    const p = loop.point(index * CHUNK + CHUNK / 2 + (r() - .5) * 8)
    if (roll < .2) return { kind: 'stream', x: p.x, z: p.z, angle: Math.atan2(p.nz, p.nx) + (r() - .5) * .6, size: .9 + r() * .6 }
    // Pond beside the trail; the path skirts its bank.
    const radius = 2.4 + r() * 2.2, side = r() < .5 ? -1 : 1, off = side * (radius * 1.25 + 1.6)
    return { kind: 'pond', x: p.x + p.nx * off, z: p.z + p.nz * off, angle: r() * 6, size: radius }
  }

  function buildChunk(index: number): Chunk {
    const r = seeded(index), group = new THREE.Group(); group.name = `chunk-${index}`
    const trees: Chunk['trees'] = [], s0 = index * CHUNK
    /** World point `along` metres into this chunk and `side` metres off the trail. */
    const at = (along: number, side: number) => { const p = loop.point(s0 + along); return { x: p.x + p.nx * side, z: p.z + p.nz * side } }
    const spec = waterFor(index)
    const clear = (x: number, z: number, margin: number) => {
      if (Math.abs(loop.offset(x, z)) < margin) return false
      if (Math.hypot(x - camp.x, z - camp.z) < 4.5 + margin) return false
      if (spec && waterEdge(spec, x, z) > -margin * .6) return false
      return true
    }
    // Trees frame the trail at uneven distances; deeper woods on the edges.
    for (let i = 0; i < 11; i++) {
      const { x, z } = at(r() * CHUNK, (r() < .5 ? -1 : 1) * (2.6 + r() * 11))
      if (!clear(x, z, 2.4)) continue
      const tree = createTree(x, z, 3.6 + r() * 1.3, Math.floor(r() * 1e6), false)
      group.add(tree.root); trees.push(tree)
      for (let k = 0; k < 4; k++) kit.add(rock, 0x4f5a52, x + Math.cos(k * 2.4) * .6, .16, z + Math.sin(k * 2.4) * .6, .35, .26, .4, group, 'stone')
    }
    // Flat stepping stones along the trail.
    for (let i = 0; i < 34; i++) {
      const { x, z } = at(r() * CHUNK, (r() - .5) * 1.4)
      if (spec && waterEdge(spec, x, z) > -.2) continue
      if (Math.hypot(x - camp.x, z - camp.z) < 2.2) continue
      const stone = kit.add(rock, [0x6c6a62, 0x7b7a70, 0x5f6460][i % 3], x, -.005, z, .08 + r() * .19, .035, .1 + r() * .19, group, 'stone')
      stone.rotation.y = r() * 6
    }
    // Boulders and rock clusters in the grass.
    for (let i = 0; i < 6; i++) {
      const { x, z } = at(r() * CHUNK, (r() < .5 ? -1 : 1) * (2 + r() * 9))
      if (!clear(x, z, 1.6)) continue
      for (let k = 0; k < 3; k++) {
        const s = .25 + r() * .5
        const b = kit.add(rock, [0x6a706c, 0x787d78, 0x5c625f][k], x + (r() - .5) * 1.2, s * .4, z + (r() - .5) * 1.2, s, s * .8, s * .9, group, 'stone')
        b.rotation.set(r(), r() * 6, r())
      }
    }
    const feature = r()
    const side = r() < .5 ? -1 : 1, { x: fx, z: fz } = at(CHUNK * (.3 + r() * .4), side * (3.2 + r() * 2))
    if (index > 0 && feature < .22 && clear(fx, fz, 2.4)) {
      // Ruined chapel wall: brick courses, a broken arch and two buttresses.
      const ruin = new THREE.Group(); ruin.position.set(fx, 0, fz); ruin.rotation.y = r() * Math.PI; group.add(ruin)
      const colors = [0x656774, 0x717582, 0x555b69, 0x7b7f88]
      for (let row = 0; row < 9; row++) for (let col = -3; col <= 3; col++) {
        const x = col * .49 + (row % 2) * .23
        if (row > 3 && Math.abs(x) < .4) continue
        if (row > 5 + Math.sin(col * 1.7 + index) * 2) continue
        kit.box(colors[Math.floor(r() * 4)], x, .17 + row * .32, 0, .45, .29, .55, ruin, 'stone')
      }
      for (const x of [-1.8, 1.8]) kit.box(0x6a6e7a, x, 1.2, .2, .45, 2.4, .9, ruin, 'stone')
      for (let i = 0; i < 7; i++) { const a = i / 12 * Math.PI, s = kit.box(0x717582, Math.cos(a) * .7, 2 + Math.sin(a) * .8, .2, .25, .36, .5, ruin, 'stone'); s.rotation.z = a - Math.PI / 2 }
    } else if (feature < .45 && clear(fx, fz, 1.8)) {
      // Fallen trunk with shelf fungus.
      const t = kit.add(log, 0x6d5a42, fx, .22, fz, .22, 3 + r() * 1.5, .22, group, 'bark'); t.rotation.set(Math.PI / 2, 0, r() * Math.PI)
      for (let i = 0; i < 5; i++) kit.add(cap, 0xc9a96b, fx + (r() - .5) * 1.4, .35, fz + (r() - .5) * .3, .12, .06, .12, group, 'wood')
    } else if (feature < .65 && clear(fx, fz, 2)) {
      // Standing stones in a ring.
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * Math.PI * 2, h = .9 + r() * .8
        const s = kit.box(0x7a7f86, fx + Math.cos(a) * 1.3, h / 2, fz + Math.sin(a) * 1.3, .35, h, .28, group, 'stone'); s.rotation.set((r() - .5) * .15, a, (r() - .5) * .15)
      }
    } else if (feature < .85 && clear(fx, fz, 1.4)) {
      // Pale glowing mushrooms.
      const glow = new THREE.MeshStandardMaterial({ color: 0x9fd1c4, roughness: 1, flatShading: true, emissive: 0x2f6d63 })
      for (let i = 0; i < 9; i++) {
        const mx = fx + (r() - .5) * 1.6, mz = fz + (r() - .5) * 1.6, h = .1 + r() * .18
        kit.box(0xd6d0bd, mx, h / 2, mz, .03, h, .03, group, 'wood')
        const c = kit.add(cap, 0x9fd1c4, mx, h, mz, .07 + r() * .06, .05, .07 + r() * .06, group, 'stone')
        c.material = glow
      }
    }
    let water: Water | undefined
    if (spec) {
      water = engine.createWater(spec)
      group.add(water.mesh)
      if (spec.kind === 'stream') {
        // Footbridge where the trail meets the stream: walk the trail both
        // ways from the crossing to find the water's extent.
        const sc = loop.nearest(spec.x, spec.z)
        const wet = (ds: number) => { const p = loop.point(sc + ds); return waterEdge(spec, p.x, p.z) > -.1 }
        let ahead = .5, behind = .5
        while (ahead < 7 && wet(ahead)) ahead += .25
        while (behind < 7 && wet(-behind)) behind += .25
        const mid = loop.point(sc + (ahead - behind) / 2), half = (ahead + behind) / 2
        const bridge = new THREE.Group(); bridge.position.set(mid.x, 0, mid.z); bridge.rotation.y = Math.atan2(mid.tx, mid.tz); group.add(bridge)
        const span = half * 2 + .8
        for (let i = 0; i < Math.ceil(span / .17); i++) kit.box(i % 3 ? 0x63594c : 0x81715c, 0, .16, -span / 2 + i * .17, 1.25, .13, .15, bridge, 'wood')
        for (const x of [-.66, .66]) {
          kit.box(0x6f6454, x, .5, 0, .1, .1, span, bridge, 'wood')
          for (const z of [-span / 2, 0, span / 2]) kit.box(0x8a7a60, x, .5, z, .09, 1, .09, bridge, 'wood')
        }
      }
      // Bank stones and reeds follow the organic shoreline.
      const reach = spec.kind === 'stream' ? 30 : spec.size * 2.8, reachZ = spec.kind === 'stream' ? 30 : spec.size * 2.6
      for (let i = 0; i < 70; i++) {
        const x = spec.x + (r() - .5) * reach, z = spec.z + (r() - .5) * reachZ
        const e = waterEdge(spec, x, z)
        if (e > 0 || e < -.45 || Math.abs(loop.offset(x, z)) < 1) continue
        if (r() < .55) kit.add(rock, [0x414c4f, 0x55605d][i % 2], x, .045, z, .1 + r() * .18, .06 + r() * .1, .15, group, 'stone')
        else for (let k = 0; k < 3; k++) { const reed = kit.box(0x5c746d, x + (r() - .5) * .2, .3, z + (r() - .5) * .2, .025, .6 + r() * .4, .025, group, 'foliage'); reed.rotation.z = (r() - .5) * .3 }
      }
    }
    // Trees keep their own per-part styles; the rest is declared on each node.
    for (const tree of trees) engine.add(tree.root, options.screen ? { glyph: 'screen', parts: { trunk: { surface: 'bark' }, crown: { surface: 'foliage' } } } : { type: 'tree' })
    engine.add(group, options.screen ? { glyph: 'screen' } : {})
    if (water && options.screen) water.look.reflection.enabled = false
    return { index, group, trees, water, shape: spec }
  }

  let streamer = createChunkStreamer<Chunk>({
    count: loop.chunks, build: buildChunk,
    dispose: (chunk) => engine.remove(chunk.group, { dispose: true }),
  })

  // The traveller: screen pass, walking the circuit with the Pomorog pace.
  const player = createAdventurer()
  engine.add(player.root, options.screen ? { glyph: 'screen', surface: 'actor' } : { type: 'hero' })
  player.root.position.copy(campSeat)
  if (options.at) { const p = loop.point(options.at); player.root.position.set(p.x, 0, p.z); player.root.rotation.y = Math.atan2(p.tx, p.tz) }
  const lantern = new THREE.PointLight(0xffce83, 7, 9, 1.65); engine.scene.add(lantern)
  const lanternModel = player.root.getObjectByName('traveller-lantern')!
  const ambient = engine.createParticles(1200)
  engine.add(ambient.mesh, { glyph: 'particle' })
  const dust = createDustTrail()
  engine.setActors({ hero: player.root.position })
  // Walks between encounters, as in the demo (seconds of hunting).
  const WALKS = [6, 16, 12, 18, 14]
  const encounters = createEncounters(engine, player, options.screen ? undefined : carpet)
  let walked = 0, walkIndex = 0
  const toward = new THREE.Vector3()

  let lastArc = loop.nearest(player.root.position.x, player.root.position.z), huntProgress = 0
  let speed = 0, sitting = 0, phaseStart = 0, phase: 'hunt' | 'camp' | 'depart' = options.camp ? 'camp' : options.at ? 'hunt' : 'depart'
  if (options.at) huntProgress = options.at
  const destination = new THREE.Vector3(), delta = new THREE.Vector3()
  const moon = engine.lights.moon

  function updateChunks() {
    const index = Math.floor(loop.nearest(player.root.position.x, player.root.position.z) / CHUNK)
    if (!streamer.update(index)) return
    // The nearest streams shape the soil (banks, beds) of floor and carpet.
    const live = [...streamer.chunks.values()].filter((c) => c.shape).sort((a, b) => streamer.ring(a.index, index) - streamer.ring(b.index, index))
    soilUniforms.streams.value.forEach((v, i) => {
      const s = live[i]?.shape
      if (s) v.set(s.x, s.z, s.angle, s.kind === 'stream' ? s.size : -s.size); else v.set(0, 0, 0, 0)
    })
  }
  updateChunks()

  return {
    id: 'dark_forest', title: 'Dark Forest',
    hero: player.root.position,
    get state() { return `${phase} ${encounters.state} ${encounters.name} ${huntProgress.toFixed(0)}/${loop.length} camp:${player.root.position.distanceTo(campSeat).toFixed(1)}` },
    focus(angle, target) {
      // Pomorog framing: 2 m ahead (1.25 in combat), pulled 32% toward the creature.
      const foe = encounters.foe
      target.copy(player.root.position); target.y = foe ? .75 : 1.05
      target.x -= Math.sin(angle) * (foe ? 1.25 : 2); target.z -= Math.cos(angle) * (foe ? 1.25 : 2)
      if (foe) { target.lerp(foe, .32); target.y = .75 }
      return target
    },
    update(time, dt) {
      // Demo cycle: hunt the whole circuit, rest at the bonfire, depart.
      const age = time - phaseStart
      if (phase === 'hunt' && (huntProgress >= loop.length - 1.5 || age > HUNT_SECONDS * 1.6)) { phase = 'camp'; phaseStart = time }
      else if (phase === 'camp' && age > CAMP_SECONDS && !options.camp) { phase = 'depart'; phaseStart = time }
      else if (phase === 'depart' && age > DEPART_SECONDS) { phase = 'hunt'; phaseStart = time; huntProgress = 0 }
      const camping = phase === 'camp' || phase === 'depart' && age < DEPART_SECONDS * .5
      // Encounters along the hunt: the creature comes down the trail ahead.
      if (phase === 'hunt' && !encounters.active && !options.peaceful) {
        walked += dt
        if (walked > WALKS[walkIndex % WALKS.length]) {
          walked = 0; walkIndex++
          const ahead = loop.point(lastArc + 4)
          toward.set(ahead.x - player.root.position.x, 0, ahead.z - player.root.position.z).normalize()
          encounters.begin(time, toward, engine.camera)
        }
      }
      const fighting = encounters.update(time, dt)
      if (camping) {
        // Around the circuit (the shorter way) to the bonfire, then the seat.
        const forward = loop.length - lastArc
        if (Math.min(lastArc, forward) > 2.2 && player.root.position.distanceTo(campSeat) > 2.4) {
          const p = loop.point(lastArc + (forward < lastArc ? 2.4 : -2.4))
          destination.set(p.x, 0, p.z)
        } else destination.copy(campSeat)
      } else {
        // Follow the circuit a little ahead, with a gentle side-to-side wander.
        const p = loop.point(lastArc + 2.4), wander = Math.sin(lastArc * .23) * .35
        destination.set(p.x + p.nx * wander, 0, p.z + p.nz * wander)
      }
      delta.subVectors(destination, player.root.position); delta.y = 0
      const distance = delta.length()
      const seated = camping && distance < .12
      sitting = damp(sitting, seated ? 1 : 0, seated ? 3.2 : 5.5, dt)
      let pace = 1, base = 1.28
      if (camping) pace = player.root.position.distanceTo(campSeat) > 6 ? 2.1 : 1
      else {
        pace = paceAt(time)
        base = solveBaseSpeed(loop.length - huntProgress, Math.max(1, HUNT_SECONDS - age))
      }
      const targetSpeed = seated || fighting ? 0 : base * pace * smooth(distance / .45) * (1 - smooth(sitting * 1.5))
      speed = damp(speed, targetSpeed, targetSpeed > speed ? 6 : 10, dt)
      let travelled = 0
      if (distance > .015 && speed > .005 && !fighting) {
        const targetAngle = Math.atan2(delta.x, delta.z)
        player.root.rotation.y = turn(player.root.rotation.y, targetAngle, 6, dt)
        const alignment = .4 + .6 * Math.max(0, Math.cos(targetAngle - player.root.rotation.y))
        travelled = Math.min(distance, dt * speed * alignment)
        player.root.position.addScaledVector(delta.normalize(), travelled)
      }
      const arc = loop.nearest(player.root.position.x, player.root.position.z), L = loop.length
      let ds = arc - lastArc; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L
      if (!camping) huntProgress += ds
      lastArc = arc
      if (seated) {
        const fireAngle = Math.atan2(camp.x - player.root.position.x, camp.z - player.root.position.z)
        player.root.rotation.y = turn(player.root.rotation.y, fireAngle, 5, dt)
      }
      if (!fighting) player.animate({ time, dt, speed, distance: travelled, attackAge: 9, hurtAge: 9, sitting })
      player.root.updateMatrixWorld(true)
      lanternModel.getWorldPosition(lantern.position); lantern.position.y += .5
      lantern.intensity = 7 + Math.sin(time * 3.7) * .7 + Math.sin(time * 7.3) * .35
      engine.setLights({ lantern: lantern.position })

      // The moon's shadow frustum follows the traveller; the floor snaps in
      // whole letter cells so its letters never slide.
      const hero = player.root.position
      moon.position.set(hero.x - 5, 12, hero.z + 7); moon.target.position.set(hero.x, 0, hero.z); moon.target.updateMatrixWorld()
      const snap = 3.4
      floor.position.set(Math.round(hero.x / snap) * snap, -.07, Math.round(hero.z / snap) * snap)
      updateChunks()
      for (const chunk of streamer.chunks.values()) chunk.trees.forEach((t) => t.animate(time))

      fireLetters.clear(); fire.update(time, engine.camera)
      ambient.clear()
      pushLanternMotes(ambient, hero, time)
      pushFireflies(ambient, hero, time)
      if (speed > 1.85) dust.add(hero.x, hero.z, time)
      dust.push(ambient, time)
    },
    dispose() {
      streamer.clear()
      for (const o of [floor, campGroup, player.root, fireLetters.mesh, ambient.mesh, carpet.mesh]) engine.remove(o)
      engine.scene.remove(lantern, fire.light)
      streamer = undefined as never
    },
  }
}
