import * as THREE from 'three'
import type { SurfaceKind } from '@ascii-engine/core'

/**
 * Pieces of the Pomorog reference scene, rebuilt for the editor. They are
 * game models (not engine code): the engine only sees declared techniques.
 */

/**
 * The kind Pomorog's `environment.ts` guessed from the colour (HSL in sRGB).
 * Used here only to declare the same kind explicitly, for fidelity.
 */
export function pomorogKind(color: number): SurfaceKind {
  const hsl = new THREE.Color(color).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace)
  return hsl.s > 0.18 && hsl.h > 0.2 && hsl.h < 0.45
    ? 'foliage'
    : hsl.s > 0.15 && (hsl.h < 0.14 || hsl.h > 0.95)
      ? 'wood'
      : 'stone'
}

const materials = new Map<number, THREE.MeshStandardMaterial>()
/** Kit materials are shared by every chunk: `engine.remove(…, { dispose })` keeps them. */
export function material(color: number) {
  if (!materials.has(color)) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })
    m.userData.shared = true
    materials.set(color, m)
  }
  return materials.get(color)!
}
export const cube = new THREE.BoxGeometry(1, 1, 1),
  rock = new THREE.DodecahedronGeometry(1, 0)
export const log = new THREE.CylinderGeometry(1, 1, 1, 8),
  cap = new THREE.SphereGeometry(1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2)
export function piece(
  geometry: THREE.BufferGeometry,
  color: number,
  x: number,
  y: number,
  z: number,
  sx = 1,
  sy = sx,
  sz = sx,
) {
  const mesh = new THREE.Mesh(geometry, material(color))
  mesh.position.set(x, y, z)
  mesh.scale.set(sx, sy, sz)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.sharedGeometry = true
  return mesh
}
export const box = (
  color: number,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
) => piece(cube, color, x, y, z, w, h, d)

/**
 * Declares the technique on the node itself (`userData.glyph`/`glyphStyle`,
 * as a GLTF from Blender would). The rule is Pomorog's catalogue §19.3:
 * foliage and faceted rocks are letter clouds, the rest letters on the face.
 */
export function declare(
  mesh: THREE.Mesh,
  kind: SurfaceKind = pomorogKind((mesh.material as THREE.MeshStandardMaterial).color.getHex()),
) {
  const g = mesh.geometry
  const faceted =
    g instanceof THREE.DodecahedronGeometry ||
    g instanceof THREE.IcosahedronGeometry ||
    g instanceof THREE.OctahedronGeometry
  mesh.userData.glyph = kind === 'foliage' || faceted ? 'body' : 'surface'
  mesh.userData.glyphStyle = {
    surface: kind,
    ...(mesh.userData.glyph === 'body' ? { size: 0.19 } : {}),
  }
  return mesh
}

/** Kit for area builders: pieces declared on creation, parented. */
export function createKit() {
  const add = (
    geometry: THREE.BufferGeometry,
    color: number,
    x: number,
    y: number,
    z: number,
    sx = 1,
    sy = sx,
    sz = sx,
    parent?: THREE.Object3D,
    kind?: SurfaceKind,
  ) => {
    const mesh = declare(piece(geometry, color, x, y, z, sx, sy, sz), kind)
    parent?.add(mesh)
    return mesh
  }
  const box = (
    color: number,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    parent?: THREE.Object3D,
    kind?: SurfaceKind,
  ) => add(cube, color, x, y, z, w, h, d, parent, kind)
  return { add, box }
}
export type Kit = ReturnType<typeof createKit>

/** The camp around the bonfire (Pomorog `environment.ts → campGroup`), relative to the fire. */
export function createCamp(kit: Kit, leanTo = true) {
  const group = new THREE.Group()
  group.name = 'camp'
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    kit.add(rock, 0x68726a, Math.cos(a) * 0.53, 0.08, Math.sin(a) * 0.53, 0.18, 0.13, 0.17, group)
  }
  for (const rotation of [-0.7, 0.7])
    kit.box(0x484438, 0, 0.11, 0, 0.76, 0.17, 0.15, group).rotation.y = rotation
  kit.box(0x6b4a3a, -1.1, 0.13, 0.2, 0.75, 0.22, 1.3, group)
  kit.box(0x7d6a52, -1.1, 0.27, -0.35, 0.72, 0.2, 0.22, group)
  kit.box(0x646356, -0.3, 0.35, 1.4, 0.63, 0.65, 0.58, group).name = 'crate'
  kit.box(0x78644c, 1.2, 0.23, 0.1, 0.55, 0.45, 0.85, group)
  if (leanTo) {
    for (let i = 0; i < 10; i++)
      kit.box(
        0x615743,
        -2.3 + i * 0.17,
        1.35 + Math.abs(i - 4.5) * -0.11,
        0.3,
        0.15,
        0.08,
        1.75,
        group,
      ).rotation.z = i < 5 ? 0.58 : -0.58
    for (const x of [-2.3, -0.8]) kit.box(0x55493c, x, 0.54, 0.95, 0.09, 1.1, 0.09, group)
  }
  return group
}

/** Bent alder/willow trunk with uneven crowns (Pomorog `wetlandTrees.ts`). Parts: `trunk`, `crown`. */
export function createTree(x: number, z: number, height: number, seed: number, marsh = false) {
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const root = new THREE.Group()
  root.position.set(x, 0, z)
  root.name = 'tree'
  const trunk = new THREE.Group()
  trunk.name = 'trunk'
  root.add(trunk)
  const crown = new THREE.Group()
  crown.name = 'crown'
  root.add(crown)
  const wood = new THREE.MeshStandardMaterial({
    color: 0x947d59,
    roughness: 0.92,
    flatShading: true,
  })
  const branchGeometry = new THREE.CylinderGeometry(0.58, 1, 1, 7)
  const up = new THREE.Vector3(0, 1, 0)
  function branch(a: THREE.Vector3, b: THREE.Vector3, radius: number) {
    const part = new THREE.Mesh(branchGeometry, wood)
    part.position.copy(a).lerp(b, 0.5)
    part.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize())
    part.scale.set(radius, a.distanceTo(b), radius)
    part.castShadow = part.receiveShadow = true
    trunk.add(part)
  }
  const foot = new THREE.Vector3(0, 0.08, 0),
    fork = new THREE.Vector3(0.19, height * 0.47, -0.12)
  branch(foot, fork, 0.29)
  branch(fork, new THREE.Vector3(-0.12, height * 0.88, 0.1), 0.17)
  for (let i = 0; i < 7; i++) {
    const a = i * 2.399
    branch(
      new THREE.Vector3(0.03, 0.65, 0),
      new THREE.Vector3(Math.cos(a) * (0.8 + random() * 0.4), 0.14, Math.sin(a) * 0.9),
      0.14,
    )
  }
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    flatShading: true,
    emissive: 0x2a4b37,
    emissiveIntensity: 0.16,
  })
  const leafGeometry = new THREE.IcosahedronGeometry(1, 0)
  const crowns: THREE.InstancedMesh[] = []
  let leaves: THREE.InstancedMesh
  const pose = new THREE.Object3D(),
    colors = [0x4d7955, 0x70956a, 0x91aa75, 0x3e6c52, 0xa5b686]
  let n = 0
  function leaf(px: number, py: number, pz: number, sx: number, sy: number, sz: number) {
    pose.position.set(px, py, pz)
    pose.scale.set(sx, sy, sz)
    pose.rotation.set(random() * 0.4, random() * 6, random() * 0.35)
    pose.updateMatrix()
    leaves.setMatrixAt(n, pose.matrix)
    leaves.setColorAt(n++, new THREE.Color(colors[Math.floor(random() * colors.length)]))
  }
  for (let b = 0; b < 6; b++) {
    leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, 36)
    n = 0
    const angle = b * 2.399 + random() * 0.25,
      reach = 1.15 + random() * 0.65
    const tip = new THREE.Vector3(
      Math.cos(angle) * reach,
      height * (0.72 + random() * 0.12),
      Math.sin(angle) * reach,
    )
    branch(fork, tip, 0.1)
    branch(
      tip,
      tip.clone().add(new THREE.Vector3(Math.cos(angle) * 0.42, 0.15, Math.sin(angle) * 0.42)),
      0.045,
    )
    for (let k = 0; k < 24; k++) {
      const spread = random() * Math.PI * 2,
        radius = Math.sqrt(random()) * 0.95
      leaf(
        tip.x + Math.cos(spread) * radius,
        tip.y + 0.08 + random() * 0.52,
        tip.z + Math.sin(spread) * radius,
        0.17 + random() * 0.23,
        0.1 + random() * 0.16,
        0.2 + random() * 0.23,
      )
    }
    for (let curtain = 0; curtain < 4; curtain++) {
      const a = angle + (curtain - 1.5) * 0.38,
        length = (marsh ? 0.55 : 0.25) + random() * 0.65
      const cx = Math.cos(a) * (reach + 0.42),
        cz = Math.sin(a) * (reach + 0.42)
      for (let k = 0; k < 3; k++) {
        const taper = 1 - k * 0.2
        leaf(
          cx + Math.sin(k * 0.8 + a) * 0.09,
          tip.y - (k * length) / 3,
          cz,
          0.16 * taper,
          length * 0.28,
          0.2 * taper,
        )
      }
    }
    leaves.count = n
    leaves.castShadow = leaves.receiveShadow = true
    crowns.push(leaves)
    crown.add(leaves)
  }
  return {
    root,
    animate(time: number) {
      crowns.forEach((c, i) => {
        c.rotation.z = Math.sin(time * 0.85 + x * 0.7 + i * 0.6) * 0.012
        c.rotation.x = Math.sin(time * 0.62 + z * 0.4 + i * 0.4) * 0.009
      })
    },
  }
}
