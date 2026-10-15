import * as THREE from 'three'
import { createCampfire, forestFloorMaterial, forestMeadowCover } from '@ascii-engine/core/pomorog'
import { type AsciiEngine, type GlyphStyle } from '@ascii-engine/core'
import { box, createTree, piece, pomorogKind, rock } from './pomorogKit'
import { createAdventurer } from '../pomorog/models'

/**
 * Phase 1 reference scene (START.md §5): `surface` ground, a crate, a stone
 * and a crown `body`, `carpet` grass, a `particle` bonfire and a `screen`
 * traveller. Layout from Pomorog's fixed Dark Forest camp (`environment.ts`).
 * `screenMode` puts everything in the old screen pass, for before/after.
 */
export function buildReferenceScene(
  engine: AsciiEngine,
  screenMode = false,
  heroYaw = Math.PI + 0.9,
) {
  const camp = new THREE.Vector3(-3, 0, 2.6)
  /** Declares a piece with the kind Pomorog gave its colour. */
  const declare = (style: GlyphStyle): GlyphStyle =>
    screenMode ? { glyph: 'screen', surface: style.surface } : style
  const flat = (mesh: THREE.Mesh, color: number) =>
    engine.add(mesh, declare({ glyph: 'surface', surface: pomorogKind(color) }))
  const stone = (mesh: THREE.Mesh) =>
    engine.add(mesh, declare({ glyph: 'body', surface: 'stone', size: 0.19 }))

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 40), forestFloorMaterial(camp))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.07
  floor.receiveShadow = true
  engine.add(floor, screenMode ? { glyph: 'screen', surface: 'earth' } : { type: 'ground' })

  // Camp: stone ring, crossed logs, bedroll, crate, seat and the lean-to.
  const campGroup = new THREE.Group()
  campGroup.position.copy(camp)
  engine.scene.add(campGroup)
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    campGroup.add(
      stone(piece(rock, 0x68726a, Math.cos(a) * 0.53, 0.08, Math.sin(a) * 0.53, 0.18, 0.13, 0.17)),
    )
  }
  for (const rotation of [-0.7, 0.7]) {
    const log = box(0x484438, 0, 0.11, 0, 0.76, 0.17, 0.15)
    log.rotation.y = rotation
    campGroup.add(flat(log, 0x484438))
  }
  const flatBox = (
    color: number,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) => {
    const mesh = box(color, x, y, z, w, h, d)
    campGroup.add(mesh)
    return flat(mesh, color)
  }
  flatBox(0x6b4a3a, -1.1, 0.13, 0.2, 0.75, 0.22, 1.3)
  flatBox(0x7d6a52, -1.1, 0.27, -0.35, 0.72, 0.2, 0.22)
  const crate = flatBox(0x646356, -0.3, 0.35, 1.4, 0.63, 0.65, 0.58)
  crate.name = 'crate'
  flatBox(0x78644c, 1.2, 0.23, 0.1, 0.55, 0.45, 0.85)
  for (let i = 0; i < 10; i++)
    flatBox(
      0x615743,
      -2.3 + i * 0.17,
      1.35 + Math.abs(i - 4.5) * -0.11,
      0.3,
      0.15,
      0.08,
      1.75,
    ).rotation.z = i < 5 ? 0.58 : -0.58
  for (const x of [-2.3, -0.8]) flatBox(0x55493c, x, 0.54, 0.95, 0.09, 1.1, 0.09)

  // A boulder and trail pebbles: open clouds of stone letters.
  const boulder = piece(rock, 0x879080, 0.9, 0.35, 0.6, 0.7, 0.85, 0.6)
  boulder.rotation.set(0.4, 0.8, 0.2)
  engine.scene.add(boulder)
  stone(boulder)
  let seed = 8203
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  for (let i = 0; i < 30; i++) {
    const z = -6 + random() * 14,
      x = -0.6 + Math.sin(z * 0.5) * 0.45 + (random() - 0.5) * 1.5
    if (Math.hypot(x - camp.x, z - camp.z) < 1.4) continue
    const pebble = piece(
      rock,
      [0x6c6a62, 0x7b7a70, 0x5f6460][i % 3],
      x,
      -0.005,
      z,
      0.08 + random() * 0.19,
      0.035,
      0.1 + random() * 0.19,
    )
    pebble.rotation.y = random() * 6
    engine.scene.add(pebble)
    stone(pebble)
  }

  // Trees: trunk `surface` (bark), crown `body` (foliage), by part.
  const trees = [
    [-5.7, -1.8, 4.3],
    [2.6, -4.1, 4.1],
    [-5.6, 5.6, 4.2],
    [4.6, 3.2, 4.5],
  ].map(([x, z, h]) => {
    const tree = createTree(x, z, h, Math.round((x + 10) * 819))
    engine.add(
      tree.root,
      screenMode
        ? { glyph: 'screen', parts: { trunk: { surface: 'bark' }, crown: { surface: 'foliage' } } }
        : { type: 'tree' },
    )
    return tree
  })

  // The traveller stays in the approved screen pass.
  const model = createAdventurer()
  const traveller = { ...model, lantern: model.root.getObjectByName('traveller-lantern')! }
  traveller.root.position.set(-0.8, 0, 2.7)
  traveller.root.rotation.y = heroYaw
  engine.add(traveller.root, { type: 'hero' })
  const lantern = new THREE.PointLight(0xffce83, 7, 9, 1.65)
  engine.scene.add(lantern)
  const lanternAt = new THREE.Vector3()

  // Carpet and bonfire.
  const carpet = engine.createCarpet(forestMeadowCover({ camp }))
  if (!screenMode) engine.add(carpet.mesh, { glyph: 'carpet' })
  const fireLetters = engine.createParticles(1600)
  engine.add(fireLetters.mesh, { glyph: 'particle' })
  const fire = createCampfire(fireLetters, camp)
  engine.scene.add(fire.light)
  engine.setLights({ hearth: camp })
  engine.setActors({ hero: traveller.root.position })

  return {
    camp,
    traveller,
    trees,
    carpet,
    crate,
    boulder,
    floor,
    id: 'reference',
    title: 'Reference scene (phase 1)',
    hero: traveller.root.position,
    state: 'static',
    focus(angle: number, target: THREE.Vector3) {
      target.copy(traveller.root.position)
      target.y = 1.05
      target.x -= Math.sin(angle) * 2
      target.z -= Math.cos(angle) * 2
      return target
    },
    dispose() {},
    update(time: number) {
      for (const tree of trees) tree.animate(time)
      traveller.animate({ time, dt: 1 / 60, speed: 0, distance: 0, attackAge: 9, hurtAge: 9 })
      traveller.root.updateMatrixWorld(true)
      traveller.lantern.getWorldPosition(lanternAt)
      lantern.position.copy(lanternAt)
      lantern.position.y += 0.5
      lantern.intensity = 7 + Math.sin(time * 3.7) * 0.7 + Math.sin(time * 7.3) * 0.35
      engine.setLights({ lantern: lantern.position })
      fireLetters.clear()
      fire.update(time, engine.camera)
    },
  }
}
