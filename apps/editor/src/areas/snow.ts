import * as THREE from 'three'
import { createSnowField, pomorogSnow, snowAccumulation, snowMeltRadius } from '../pomorog/snow'
import { type AsciiEngine, type GroundCover, type SurfaceKind } from '@ascii-engine/core'
import { declare } from '../scene/pomorogKit'
import { CAMP, createFixedMapActors } from './common'
import { usesLegacyScreenComparison, type Area, type AreaOptions } from './types'

/**
 * Snow Pines (Pomorog `snowEnvironment.ts`): snow floor with footprints and a
 * thaw around the fire, conifers of leaf clouds with snow shelves that build
 * up, boulders, a broken fence and slow flakes.
 */
export function createSnow(engine: AsciiEngine, options: AreaOptions = {}): Area {
  engine.setStyle(pomorogSnow)
  const root = new THREE.Group()
  root.name = 'snow_pines'
  let seed = 93207
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  const rock = new THREE.IcosahedronGeometry(1, 1),
    cube = new THREE.BoxGeometry(1, 1, 1)
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  function material(color: number, surface: SurfaceKind) {
    const key = `${color}:${surface}`
    if (!materials.has(key))
      materials.set(
        key,
        new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.95 }),
      )
    return materials.get(key)!
  }
  function mesh(
    geometry: THREE.BufferGeometry,
    color: number,
    surface: SurfaceKind,
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy = sx,
    sz = sx,
  ) {
    const m = new THREE.Mesh(geometry, material(color, surface))
    m.position.set(x, y, z)
    m.scale.set(sx, sy, sz)
    m.castShadow = m.receiveShadow = true
    parent.add(m)
    // Pomorog: snow caps are letter clouds (`snow` ramp), like foliage and faceted rocks.
    declare(m, surface)
    if (surface === 'snow') {
      m.userData.glyph = 'body'
      m.userData.glyphStyle = { surface: 'snow', size: 0.19 }
    }
    return m
  }
  const snow = createSnowField({ hearth: CAMP })
  root.add(snow.ground)

  const caps: { mesh: THREE.Mesh; base: number; width: number; depth: number }[] = []
  const trees: THREE.Group[] = []
  const crowns: { x: number; z: number; y: number; radius: number }[] = []
  const snowCap = (
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    width: number,
    depth: number,
  ) => {
    const m = mesh(rock, 0xd6e5e8, 'snow', parent, x, y, z, width, 0.08, depth)
    caps.push({ mesh: m, base: y, width, depth })
    return m
  }
  for (const [x, z, h] of [
    [-4.8, -2.8, 3.8],
    [3.6, -3.3, 4.2],
    [-5.4, 5.4, 4.0],
    [5, 3.8, 3.9],
    [1.1, -6.5, 4.4],
    [-2.6, -7.5, 3.4],
    [5.8, -0.4, 3.7],
    [-6.3, 0.3, 3.4],
  ]) {
    const tree = new THREE.Group()
    tree.position.set(x, 0, z)
    root.add(tree)
    trees.push(tree)
    mesh(
      new THREE.CylinderGeometry(0.1, 0.22, h * 0.87, 7),
      0x675a47,
      'bark',
      tree,
      0,
      h * 0.43,
      0,
      1,
    )
    // Overlapping needle boughs form a ragged conifer, with distinct upper snow shelves.
    for (let tier = 0; tier < 4; tier++) {
      const y = h * (0.34 + tier * 0.16),
        reach = 1.1 - tier * 0.23
      for (let b = 0; b < 5; b++) {
        const a = (b * Math.PI * 2) / 5 + tier * 0.63 + random() * 0.3
        const bx = Math.sin(a) * reach * 0.52,
          bz = Math.cos(a) * reach * 0.52
        const branch = mesh(
          new THREE.CylinderGeometry(0.025, 0.06, reach * 1.25, 5),
          0x6d6251,
          'wood',
          tree,
          bx * 0.6,
          y - 0.08,
          bz * 0.6,
          1,
        )
        branch.rotation.z = Math.sin(a) * 1.05
        branch.rotation.x = Math.cos(a) * 1.05
        const width = reach * (0.72 + random() * 0.12),
          depth = reach * (0.65 + random() * 0.16)
        const leaves = mesh(
          rock,
          [0x456d59, 0x59866d, 0x6b8c76][b % 3],
          'foliage',
          tree,
          bx,
          y,
          bz,
          width,
          0.22 + reach * 0.12,
          depth,
        )
        leaves.rotation.y = a
        const cap = snowCap(tree, bx, y + 0.21, bz, width * 0.92, depth * 0.91)
        cap.rotation.y = a
      }
    }
    mesh(new THREE.ConeGeometry(0.32, 0.9, 7), 0x4a695b, 'foliage', tree, 0, h - 0.1, 0, 1)
    snowCap(tree, 0, h + 0.1, 0, 0.23, 0.25)
    crowns.push({ x, z, y: h + 0.25, radius: 1.2 })
    for (let i = 0; i < 3; i++)
      snowCap(root, x + (random() - 0.5) * 0.9, 0.015, z + (random() - 0.5) * 0.9, 0.55, 0.5)
  }
  // Boulders and a broken fence give the clearing landmarks below the tree line.
  for (const [x, z, s] of [
    [-2.8, -4.9, 0.65],
    [2.5, 4.6, 0.6],
    [4.1, -0.7, 0.7],
    [-5, 1.5, 0.48],
    [-0.7, -7, 0.65],
  ]) {
    mesh(rock, 0x657b85, 'stone', root, x, s * 0.35, z, s, s * 0.6, s * 0.8)
    snowCap(root, x, s * 0.72, z, s * 0.85, s * 0.68)
  }
  for (let i = 0; i < 6; i++) {
    const x = -4.8 + i * 0.8,
      z = -4.4
    const post = mesh(cube, 0x706758, 'wood', root, x, 0.44, z, 0.11, 0.88, 0.12)
    post.rotation.z = (random() - 0.5) * 0.13
    snowCap(root, x, 0.89, z, 0.12, 0.13)
    if (i < 4) {
      mesh(cube, 0x807465, 'wood', root, x + 0.4, 0.65, z, 0.85, 0.1, 0.1)
      snowCap(root, x + 0.4, 0.71, z, 0.42, 0.1)
    }
  }
  for (let i = 0; i < 45; i++) {
    const x = (random() - 0.5) * 15,
      z = (random() - 0.5) * 20
    if (snow.cover(x, z, 0) < 0.8 || Math.abs(x) < 2.4) continue
    mesh(cube, 0x8e947c, 'wood', root, x, 0.12, z, 0.025, 0.24, 0.025).rotation.z =
      (random() - 0.5) * 0.55
  }
  engine.add(root, usesLegacyScreenComparison(options) ? { glyph: 'screen' } : {})

  // Snow crust letters on the field, dry grass where the fire melted it.
  const pickOf = (list: number[], r: () => number) => list[Math.floor(r() * list.length)]
  const cover: GroundCover = {
    count: 30000,
    y: () => -0.02,
    density: () => 0.7,
    pick(r, x, z) {
      const c = snow.cover(x, z, 0),
        shade = 0.6 + r() * 0.4
      return c > 0.5
        ? {
            glyph: pickOf([8, 9, 8, 6, 7], r),
            height: 0.04 + r() * 0.05,
            color: [0.62 * shade, 0.72 * shade, 0.8 * shade],
          }
        : {
            glyph: pickOf([0, 5, 1, 2], r),
            height: 0.08 + r() * 0.1,
            color: [0.42 * shade, 0.34 * shade, 0.2 * shade],
          }
    },
  }
  const carpet = engine.createCarpet(cover)
  if (!usesLegacyScreenComparison(options)) engine.add(carpet.mesh, { glyph: 'carpet' })

  const actors = createFixedMapActors(engine, options, {
    route: [
      [-0.8, 3.8],
      [0.4, 2],
      [0.9, -0.4],
      [-0.2, -3.2],
      [-1.3, -4.9],
      [0.8, -2.9],
      [2.1, 0.4],
      [1.5, 3.8],
      [-1, 4.7],
    ],
  })
  const flakes = engine.createParticles(1000)
  engine.add(flakes.mesh, { glyph: 'particle' })

  return {
    id: 'snow_pines',
    title: 'Snow Pines',
    hero: actors.player.root.position,
    get state() {
      return `prints:${snow.footprintCount} snow:${snowAccumulation(engine.time).toFixed(2)} melt:${snowMeltRadius(engine.time).toFixed(2)}`
    },
    focus: actors.focus,
    update(time, dt) {
      const travelled = actors.update(time, dt)
      snow.stamp(time, actors.feet, actors.player.root.rotation.y, true, travelled)
      const depth = snowAccumulation(time)
      caps.forEach(cap => {
        cap.mesh.scale.set(
          cap.width * (0.85 + depth * 0.15),
          0.065 + depth * 0.19,
          cap.depth * (0.85 + depth * 0.15),
        )
        cap.mesh.position.y = cap.base + depth * 0.065
      })
      trees.forEach((tree, i) => {
        tree.rotation.z = Math.sin(time * 0.55 + i * 1.7) * 0.008
      })
      flakes.clear()
      snow.flakes(flakes, time, actors.player.root.position, crowns)
      actors.burn(time)
    },
    dispose() {},
  }
}
