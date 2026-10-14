import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { forestFloorMaterial, forestMeadowCover } from '@ascii-engine/core/pomorog'
import { loadGlyphModel, type AsciiEngine, type GlyphModel } from '@ascii-engine/core'
import type { Area, AreaOptions } from './types'

/**
 * Import check (phase 3): models built here are exported to GLB with
 * Blender-style custom properties, then read back by `loadGlyphModel`, so the
 * whole path (extras → userData → techniques, parts, skinned letters,
 * animation) runs as with a file from Blender.
 */

/** A serpent with 6 bones and a swimming animation; no glyph marks (default: skinned → body). */
function serpent() {
  const segments = 6, length = 3
  const geometry = new THREE.CylinderGeometry(.16, .26, length, 10, segments * 4, false)
  geometry.rotateZ(Math.PI / 2)
  const position = geometry.attributes.position
  const skinIndex: number[] = [], skinWeight: number[] = []
  for (let i = 0; i < position.count; i++) {
    const t = (position.getX(i) + length / 2) / length * segments
    const bone = Math.min(segments - 1, Math.floor(t)), next = Math.min(segments - 1, bone + 1), f = t - bone
    skinIndex.push(bone, next, 0, 0); skinWeight.push(1 - f, f, 0, 0)
  }
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndex, 4))
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeight, 4))
  const bones: THREE.Bone[] = []
  for (let i = 0; i < segments; i++) {
    const bone = new THREE.Bone(); bone.name = `spine${i}`
    bone.position.x = i === 0 ? -length / 2 : length / segments
    if (i) bones[i - 1].add(bone)
    bones.push(bone)
  }
  const material = new THREE.MeshStandardMaterial({ color: 0x6f7a4a, roughness: 1, flatShading: true, name: 'serpent-hide' })
  const mesh = new THREE.SkinnedMesh(geometry, material); mesh.name = 'body'
  const root = new THREE.Group(); root.name = 'serpent'
  root.add(bones[0], mesh); mesh.bind(new THREE.Skeleton(bones))
  root.position.y = .35
  const times = [0, .5, 1, 1.5, 2], tracks: THREE.KeyframeTrack[] = []
  bones.forEach((bone, i) => {
    const values: number[] = []
    for (const t of times) values.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(t * Math.PI - i * .9) * .45).toArray())
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values))
  })
  return { root, clip: new THREE.AnimationClip('swim', 2, tracks) }
}

/** A tree authored like in Blender: parts named, technique as custom properties. */
function authoredTree() {
  const root = new THREE.Group(); root.name = 'tree'
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.14, .26, 2.6, 7), new THREE.MeshStandardMaterial({ color: 0x947d59, roughness: .92, flatShading: true }))
  trunk.name = 'trunk'; trunk.position.y = 1.3
  trunk.userData = { glyph: 'surface', glyph_surface: 'bark' }
  const crown = new THREE.Group(); crown.name = 'crown'; crown.position.y = 2.7
  crown.userData = { glyph: 'body', glyph_surface: 'foliage', glyph_size: .19 }
  const leaf = new THREE.MeshStandardMaterial({ color: 0x5f8a5f, roughness: 1, flatShading: true })
  for (let i = 0; i < 9; i++) {
    const a = i * 2.399, r = .3 + (i % 3) * .3
    const lump = new THREE.Mesh(new THREE.IcosahedronGeometry(.5 + (i % 2) * .15, 0), leaf)
    lump.position.set(Math.cos(a) * r, (i % 3) * .3, Math.sin(a) * r); crown.add(lump)
  }
  // A plain crate with no marks: the default reads the name ("crate" → wood).
  const crate = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .7), new THREE.MeshStandardMaterial({ color: 0x7d6a52, roughness: 1, flatShading: true }))
  crate.name = 'crate'; crate.position.set(1.2, .35, .6)
  root.add(trunk, crown, crate)
  return root
}

async function roundTrip(root: THREE.Object3D, animations: THREE.AnimationClip[] = []) {
  const glb = await new GLTFExporter().parseAsync(root, { binary: true, animations }) as ArrayBuffer
  return { model: await loadGlyphModel(glb), bytes: glb.byteLength }
}

export function createGltfDemo(engine: AsciiEngine, _options: AreaOptions = {}): Area {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), forestFloorMaterial())
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  engine.add(floor, { type: 'ground' })
  const carpet = engine.createCarpet(forestMeadowCover({ count: 40000, extent: 22 }))
  engine.add(carpet.mesh, { glyph: 'carpet' })
  const models: GlyphModel[] = []
  let state = 'loading'
  const hero = new THREE.Vector3(100, 0, 100)
  ;(async () => {
    const s = serpent()
    const a = await roundTrip(s.root, [s.clip])
    a.model.scene.position.set(-1.6, 0, .4)
    engine.add(a.model.scene, { type: 'creature' })
    const b = await roundTrip(authoredTree())
    b.model.scene.position.set(1.2, 0, -.6)
    engine.add(b.model.scene)
    models.push(a.model, b.model)
    state = `glb ${a.bytes}+${b.bytes} B · parts: ${b.model.parts.join(', ')} · clips: ${a.model.animations.map((c) => c.name).join(', ')}`
  })().catch((error) => { state = `error: ${error}`; console.error(error) })
  return {
    id: 'gltf', title: 'GLTF import (demo)', hero,
    get state() { return state },
    focus: (_angle, target) => target.set(0, .8, 0),
    update(_time, dt) { for (const model of models) model.update(dt) },
    dispose() {},
  }
}

/** Panel action: a .glb/.gltf file dropped or chosen is placed in front of the camera. */
export async function importFile(engine: AsciiEngine, file: File, at: THREE.Vector3) {
  const model = await loadGlyphModel(await file.arrayBuffer())
  model.scene.position.copy(at)
  engine.add(model.scene)
  return model
}
