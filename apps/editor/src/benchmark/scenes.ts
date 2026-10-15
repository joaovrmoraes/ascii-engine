import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createRain, createWaterPaint, type AsciiEngine } from '@ascii-engine/core'
import type { Area } from '../areas/types'

export const BENCHMARK_SCENES = ['water', 'particles', 'skinning', 'water-scale'] as const
export type BenchmarkScene = (typeof BENCHMARK_SCENES)[number]
export const BENCHMARK_DT = 1 / 60
export const BENCHMARK_SEED = 4242

export interface BenchmarkLoad {
  creatures?: number
  effectGroups?: number
  waterResolution?: number
  waterLayout?: 'loaded' | 'visible'
}

/** A small, genuine skinned humanoid fixture. Geometry is sampled by the normal body path. */
function skinnedCreature() {
  const bones = Array.from({ length: 7 }, () => new THREE.Bone())
  bones[1].position.y = 0.9
  bones[0].add(bones[1])
  bones[2].position.y = 0.7
  bones[1].add(bones[2])
  for (const [index, x] of [
    [3, -0.5],
    [4, 0.5],
  ]) {
    bones[index].position.set(x, 0.5, 0)
    bones[1].add(bones[index])
  }
  for (const [index, x] of [
    [5, -0.2],
    [6, 0.2],
  ]) {
    bones[index].position.set(x, 0.9, 0)
    bones[0].add(bones[index])
  }
  const parts = [
    [0.68, 0.85, 0.4, 0, 1.25, 0, 1],
    [0.42, 0.42, 0.4, 0, 1.95, 0, 2],
    [0.2, 0.7, 0.2, -0.5, 1.1, 0, 3],
    [0.2, 0.7, 0.2, 0.5, 1.1, 0, 4],
    [0.22, 0.8, 0.25, -0.2, 0.5, 0, 5],
    [0.22, 0.8, 0.25, 0.2, 0.5, 0, 6],
  ]
  const geometries = parts.map(([w, h, d, x, y, z, joint]) => {
    const g = new THREE.BoxGeometry(w, h, d).translate(x, y, z)
    const n = g.attributes.position.count
    const indices = new Uint16Array(n * 4),
      weights = new Float32Array(n * 4)
    for (let i = 0; i < n; i++) {
      indices[i * 4] = joint
      indices[i * 4 + 1] = 0
      weights[i * 4] = 0.9
      weights[i * 4 + 1] = 0.1
    }
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4))
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4))
    return g
  })
  const geometry = mergeGeometries(geometries)!
  geometries.forEach(g => g.dispose())
  const mesh = new THREE.SkinnedMesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0x9cae9a, roughness: 1 }),
  )
  mesh.name = 'Benchmark skinned creature'
  mesh.add(bones[0])
  mesh.bind(new THREE.Skeleton(bones))
  mesh.castShadow = true
  return { mesh, bones }
}

/** Fixed fixtures never instantiate the sandbox, storage, Studio or authoring adapters. */
export function createBenchmarkScene(
  engine: AsciiEngine,
  name: BenchmarkScene,
  waterCount = 1,
  load: BenchmarkLoad = {},
) {
  const focus = new THREE.Vector3(0, 0.6, 0)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(name === 'water-scale' ? 1024 : 34, name === 'water-scale' ? 1024 : 34),
    new THREE.MeshStandardMaterial({ color: 0x435441 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.08
  floor.receiveShadow = true
  engine.add(floor, { glyph: 'surface', surface: 'earth' })
  const cover = engine.createCarpet({
    count: 1800,
    extent: 30,
    density: x => (name.startsWith('water') ? (Math.abs(x) > 12 ? 1 : 0) : 1),
    y: () => 0,
    pick: random => ({ glyph: Math.floor(random() * 5), height: 0.22, color: [0.28, 0.44, 0.2] }),
  })
  engine.add(cover.mesh, { glyph: 'carpet' })
  let update = (_time: number) => {}
  const configuration: Record<string, unknown> = {
    name,
    seed: BENCHMARK_SEED,
    carpetSeed: 48017,
    cover: 1800,
    dt: BENCHMARK_DT,
  }
  const waterCalls: number[] = []
  if (name === 'water-scale') {
    if (!Number.isInteger(waterCount) || waterCount < 1 || waterCount > 512)
      throw new Error('Water count must be an integer in 1..512')
    const resolution = load.waterResolution ?? 129
    if (![65, 129, 257, 513].includes(resolution)) throw new Error('Unsupported water grid')
    const columns = Math.ceil(Math.sqrt(waterCount)),
      rows = Math.ceil(waterCount / columns)
    for (let i = 0; i < waterCount; i++) {
      const shape = createWaterPaint(28, resolution)
      if (load.waterLayout === 'visible') {
        shape.x = ((i % columns) - (columns - 1) / 2) * 32
        shape.z = (Math.floor(i / columns) - (rows - 1) / 2) * 32
      } else shape.x = i * 64
      shape.mask!.values.fill(1)
      // A seeded sloping bed initializes flow without out-of-render rain/actor impulses.
      shape.mask!.heights = Array.from({ length: resolution ** 2 }, (_, j) => {
        // Sample the same world-space bed at every grid size; exactly the old bed at 129.
        const z = (Math.floor(j / resolution) * 128) / (resolution - 1),
          x = ((j % resolution) * 128) / (resolution - 1)
        return (z - 64) * 0.001 + Math.sin((z * 129 + x) * 0.017 + BENCHMARK_SEED) * 0.002
      })
      const water = engine.createWater(shape, { physics: { enabled: true } })
      engine.add(water.mesh, { glyph: 'water' })
      waterCalls.push(0)
      const original = water.updateDynamics
      water.updateDynamics = (dt, time, timings) => {
        waterCalls[i]++
        original(dt, time, timings)
      }
    }
    Object.assign(configuration, {
      waterCount,
      waterResolution: resolution,
      waterCells: waterCount * resolution ** 2,
      waterWidth: 28,
      spacing: load.waterLayout === 'visible' ? 32 : 64,
      mapWidth: 1024,
      expectedVisible: load.waterLayout === 'visible' ? waterCount : 1,
      reflection: true,
      externalImpulses: false,
    })
  } else if (name === 'water') {
    const shape = createWaterPaint(28, 129)
    shape.mask!.values.fill(1)
    const water = engine.createWater(shape, {
      physics: { enabled: true },
      look: { rings: { enabled: true } },
    })
    engine.add(water.mesh, { glyph: 'water' })
    const streaks = engine.createRainStreaks(1000),
      bolts = engine.createParticles(1)
    engine.add(streaks.mesh, { glyph: 'particle' })
    engine.add(bolts.mesh, { glyph: 'particle' })
    const rain = createRain(streaks, bolts, { count: 1000, radius: 20 })
    update = time => {
      water.rain(time, 1)
      streaks.clear()
      rain.update(time, engine.camera, focus, 0.018, 1)
    }
    Object.assign(configuration, {
      waterResolution: 129,
      waterCells: 129 ** 2,
      waterWidth: 28,
      rain: 1000,
      reflection: true,
    })
  } else if (name === 'particles') {
    const groups = load.effectGroups ?? 8
    if (!Number.isInteger(groups) || groups < 1 || groups > 256)
      throw new Error('Effect groups must be an integer in 1..256')
    for (let i = 0; i < groups; i++) {
      // More simultaneous events share the original eight locations: fixed pixel footprint.
      const slot = i % 8
      const at = new THREE.Vector3(((slot % 4) - 1.5) * 4, 0, (Math.floor(slot / 4) - 0.5) * 5)
      engine.fx.play('fogueira', at)
      engine.fx.play('explosao-de-fogo', at, { loop: true })
      engine.fx.play('gelo', at, { loop: true })
    }
    Object.assign(configuration, {
      campfires: groups,
      combatEffects: groups * 2,
      effectSeed: 4242,
      effectBudget: 6000,
    })
  } else {
    const count = load.creatures ?? 16
    if (!Number.isInteger(count) || count < 1 || count > 512)
      throw new Error('Creature count must be an integer in 1..512')
    const columns = Math.ceil(Math.sqrt(count)),
      rows = Math.ceil(count / columns)
    const creatures = Array.from({ length: count }, (_, i) => {
      const creature = skinnedCreature()
      creature.mesh.position.set(
        ((i % columns) - (columns - 1) / 2) * 3,
        0,
        (Math.floor(i / columns) - (rows - 1) / 2) * 3,
      )
      engine.add(creature.mesh, { glyph: 'body', surface: 'actor', size: 0.09, open: true })
      return creature
    })
    update = time => {
      creatures.forEach(({ bones }, i) => {
        const phase = time * 3 + i * 0.3
        bones[1].rotation.y = Math.sin(phase) * 0.15
        bones[2].rotation.z = Math.sin(phase * 0.7) * 0.15
        bones[3].rotation.x = bones[6].rotation.x = Math.sin(phase) * 0.65
        bones[4].rotation.x = bones[5].rotation.x = -Math.sin(phase) * 0.65
      })
    }
    Object.assign(configuration, {
      creatures: count,
      bonesPerCreature: 7,
      skinWeights: [0.9, 0.1],
      bodySize: 0.09,
    })
  }
  const area: Area = {
    id: `benchmark-${name}`,
    title: `Benchmark: ${name}`,
    hero: focus,
    get state() {
      return 'Fixed benchmark fixture; no editor storage'
    },
    focus: (_angle, target) => target.copy(focus),
    update: time => update(time),
    dispose() {},
  }
  return {
    area,
    configuration,
    diagnostics: () => {
      const frustum = new THREE.Frustum().setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          engine.camera.projectionMatrix,
          engine.camera.matrixWorldInverse,
        ),
      )
      let visibleCreatures = 0
      engine.scene.traverse(object => {
        if (object instanceof THREE.SkinnedMesh && frustum.intersectsObject(object))
          visibleCreatures++
      })
      return {
        waterCalls: [...waterCalls],
        visibleCreatures,
        visibleWaters: engine.waters.filter(w => frustum.intersectsObject(w.mesh)).length,
        simulationResolutions: engine.waters.map(w =>
          'dynamics' in w ? (w.dynamics as { resolution: number }).resolution : null,
        ),
        reflectionLevels: [
          ...new Set(
            engine.waters
              .filter(w => frustum.intersectsObject(w.mesh))
              .map(w => w.mesh.userData.waterReflectionLevel),
          ),
        ],
      }
    },
  }
}
