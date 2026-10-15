import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createRain, createWaterPaint, type AsciiEngine } from '@ascii-engine/core'
import type { Area } from '../areas/types'

export const BENCHMARK_SCENES = ['water', 'particles', 'skinning'] as const
export type BenchmarkScene = (typeof BENCHMARK_SCENES)[number]
export const BENCHMARK_DT = 1 / 60
export const BENCHMARK_SEED = 4242

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
export function createBenchmarkScene(engine: AsciiEngine, name: BenchmarkScene) {
  const focus = new THREE.Vector3(0, 0.6, 0)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 34),
    new THREE.MeshStandardMaterial({ color: 0x435441 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.08
  floor.receiveShadow = true
  engine.add(floor, { glyph: 'surface', surface: 'earth' })
  const cover = engine.createCarpet({
    count: 1800,
    extent: 30,
    density: x => (name === 'water' ? (Math.abs(x) > 12 ? 1 : 0) : 1),
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
  if (name === 'water') {
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
    for (let i = 0; i < 8; i++) {
      const at = new THREE.Vector3(((i % 4) - 1.5) * 4, 0, (Math.floor(i / 4) - 0.5) * 5)
      engine.fx.play('fogueira', at)
      engine.fx.play('explosao-de-fogo', at, { loop: true })
      engine.fx.play('gelo', at, { loop: true })
    }
    Object.assign(configuration, {
      campfires: 8,
      combatEffects: 16,
      effectSeed: 4242,
      effectBudget: 6000,
    })
  } else {
    const creatures = Array.from({ length: 16 }, (_, i) => {
      const creature = skinnedCreature()
      creature.mesh.position.set(((i % 4) - 1.5) * 3, 0, (Math.floor(i / 4) - 1.5) * 3)
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
      creatures: 16,
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
  return { area, configuration }
}
