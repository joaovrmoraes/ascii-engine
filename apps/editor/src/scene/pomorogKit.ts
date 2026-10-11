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
  return hsl.s > .18 && hsl.h > .2 && hsl.h < .45 ? 'foliage' : hsl.s > .15 && (hsl.h < .14 || hsl.h > .95) ? 'wood' : 'stone'
}

const materials = new Map<number, THREE.MeshStandardMaterial>()
export function material(color: number) {
  if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }))
  return materials.get(color)!
}
export const cube = new THREE.BoxGeometry(1, 1, 1), rock = new THREE.DodecahedronGeometry(1, 0)
export function piece(geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx = 1, sy = sx, sz = sx) {
  const mesh = new THREE.Mesh(geometry, material(color))
  mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz)
  mesh.castShadow = true; mesh.receiveShadow = true
  return mesh
}
export const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number) => piece(cube, color, x, y, z, w, h, d)

/** Bent alder trunk with uneven crowns (Pomorog `wetlandTrees.ts`). Parts: `trunk`, `crown`. */
export function createTree(x: number, z: number, height: number, seed: number) {
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const root = new THREE.Group(); root.position.set(x, 0, z); root.name = 'tree'
  const trunk = new THREE.Group(); trunk.name = 'trunk'; root.add(trunk)
  const crown = new THREE.Group(); crown.name = 'crown'; root.add(crown)
  const wood = new THREE.MeshStandardMaterial({ color: 0x947d59, roughness: .92, flatShading: true })
  const branchGeometry = new THREE.CylinderGeometry(.58, 1, 1, 7)
  const up = new THREE.Vector3(0, 1, 0)
  function branch(a: THREE.Vector3, b: THREE.Vector3, radius: number) {
    const part = new THREE.Mesh(branchGeometry, wood)
    part.position.copy(a).lerp(b, .5); part.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize())
    part.scale.set(radius, a.distanceTo(b), radius); part.castShadow = part.receiveShadow = true; trunk.add(part)
  }
  const foot = new THREE.Vector3(0, .08, 0), fork = new THREE.Vector3(.19, height * .47, -.12)
  branch(foot, fork, .29)
  branch(fork, new THREE.Vector3(-.12, height * .88, .1), .17)
  for (let i = 0; i < 7; i++) {
    const a = i * 2.399
    branch(new THREE.Vector3(.03, .65, 0), new THREE.Vector3(Math.cos(a) * (.8 + random() * .4), .14, Math.sin(a) * .9), .14)
  }
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true, emissive: 0x2a4b37, emissiveIntensity: .16 })
  const leafGeometry = new THREE.IcosahedronGeometry(1, 0)
  const crowns: THREE.InstancedMesh[] = []
  let leaves: THREE.InstancedMesh
  const pose = new THREE.Object3D(), colors = [0x4d7955, 0x70956a, 0x91aa75, 0x3e6c52, 0xa5b686]
  let n = 0
  function leaf(px: number, py: number, pz: number, sx: number, sy: number, sz: number) {
    pose.position.set(px, py, pz); pose.scale.set(sx, sy, sz); pose.rotation.set(random() * .4, random() * 6, random() * .35)
    pose.updateMatrix(); leaves.setMatrixAt(n, pose.matrix); leaves.setColorAt(n++, new THREE.Color(colors[Math.floor(random() * colors.length)]))
  }
  for (let b = 0; b < 6; b++) {
    leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, 36); n = 0
    const angle = b * 2.399 + random() * .25, reach = 1.15 + random() * .65
    const tip = new THREE.Vector3(Math.cos(angle) * reach, height * (.72 + random() * .12), Math.sin(angle) * reach)
    branch(fork, tip, .10)
    branch(tip, tip.clone().add(new THREE.Vector3(Math.cos(angle) * .42, .15, Math.sin(angle) * .42)), .045)
    for (let k = 0; k < 24; k++) {
      const spread = random() * Math.PI * 2, radius = Math.sqrt(random()) * .95
      leaf(tip.x + Math.cos(spread) * radius, tip.y + .08 + random() * .52, tip.z + Math.sin(spread) * radius,
        .17 + random() * .23, .10 + random() * .16, .20 + random() * .23)
    }
    for (let curtain = 0; curtain < 4; curtain++) {
      const a = angle + (curtain - 1.5) * .38, length = .25 + random() * .65
      const cx = Math.cos(a) * (reach + .42), cz = Math.sin(a) * (reach + .42)
      for (let k = 0; k < 3; k++) {
        const taper = 1 - k * .2
        leaf(cx + Math.sin(k * .8 + a) * .09, tip.y - k * length / 3, cz, .16 * taper, length * .28, .20 * taper)
      }
    }
    leaves.count = n; leaves.castShadow = leaves.receiveShadow = true
    crowns.push(leaves); crown.add(leaves)
  }
  return { root, animate(time: number) {
    crowns.forEach((c, i) => {
      c.rotation.z = Math.sin(time * .85 + x * .7 + i * .6) * .012
      c.rotation.x = Math.sin(time * .62 + z * .4 + i * .4) * .009
    })
  } }
}

/** The traveller in a standing pose (Pomorog `models.ts → createAdventurer`, no animation). */
export function createTraveller() {
  const root = new THREE.Group(), body = new THREE.Group(); root.name = 'traveller'
  body.scale.set(.73, 1, 1); root.add(body)
  const torso = new THREE.Group(); torso.scale.z = .78; body.add(torso)
  const mat = (color: number, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true })
  const armor = mat(0xc4b7a1, .9), cloth = mat(0xb65342), dark = mat(0x292e2d), skin = mat(0xb2a88d), brass = mat(0xd4ad67, .8)
  function part(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = torso) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    return mesh
  }
  const bx = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = torso) => part(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent)
  const joint = (x: number, y: number, z: number, parent: THREE.Object3D = torso) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g }
  part(new THREE.CylinderGeometry(.245, .19, .59, 8), armor, 0, 1.3, 0)
  bx(.36, .12, .29, dark, 0, .99, 0)
  bx(.12, .09, .03, armor, 0, 1.01, .2)
  part(new THREE.CylinderGeometry(.20, .245, .34, 8, 1, true), cloth, 0, .88, -.02)
  bx(.25, .57, .065, cloth, 0, 1.29, .28)
  bx(.3, .39, .16, dark, 0, 1.34, -.24)
  const head = joint(0, 1.78, 0); head.scale.setScalar(.81)
  part(new THREE.SphereGeometry(.27, 7, 6), cloth, 0, 0, -.025, head)
  bx(.29, .23, .09, dark, 0, -.015, .22, head)
  bx(.23, .075, .02, skin, 0, -.065, .272, head)
  for (const x of [-.065, .065]) bx(.045, .028, .022, brass, x, .025, .272, head)
  part(new THREE.ConeGeometry(.26, .19, 5), cloth, 0, .2, -.05, head)
  bx(.38, .12, .33, cloth, 0, 1.57, 0)
  bx(.1, .1, .035, brass, -.15, 1.56, .245)
  const arms = [-1, 1].map((side) => {
    const arm = joint(side * .32, 1.48, 0); arm.rotation.z = side * .1
    part(new THREE.SphereGeometry(.115, 6, 4), armor, 0, -.03, 0, arm)
    part(new THREE.CylinderGeometry(.085, .067, .34, 6), cloth, 0, -.21, 0, arm)
    const forearm = joint(0, -.36, .015, arm)
    part(new THREE.CylinderGeometry(.078, .06, .3, 6), armor, 0, -.14, 0, forearm)
    part(new THREE.SphereGeometry(.08, 6, 4), dark, 0, -.33, .02, forearm)
    return { arm, forearm }
  })
  for (const side of [-1, 1]) {
    const leg = joint(side * .14, .83, 0, body)
    part(new THREE.CylinderGeometry(.092, .073, .37, 6), cloth, 0, -.17, 0, leg)
    const shin = joint(0, -.36, 0, leg)
    part(new THREE.CylinderGeometry(.1, .08, .3, 6), armor, 0, -.15, 0, shin)
    bx(.14, .13, .25, dark, 0, -.32, .065, shin)
  }
  const sheath = bx(.085, .75, .1, dark, -.32, .78, -.04); sheath.rotation.z = -.23
  bx(.27, .055, .07, armor, -.4, 1.15, -.04)
  const weapon = joint(0, -.28, .06, arms[1].forearm); weapon.rotation.x = -.38
  bx(.1, .25, .09, dark, 0, 0, 0, weapon)
  bx(.34, .07, .1, brass, 0, .15, 0, weapon)
  const blade = part(new THREE.CylinderGeometry(0, .12, .78, 4), armor, 0, .58, 0, weapon); blade.scale.z = .35
  part(new THREE.OctahedronGeometry(.09), brass, 0, -.17, 0, weapon)
  const shoulder = part(new THREE.IcosahedronGeometry(.16, 0), armor, -.33, 1.49, 0); shoulder.scale.set(1, .65, 1)
  bx(.22, .04, .25, brass, -.33, 1.49, .045)
  bx(.12, .55, .045, dark, -.1, 1.28, .33).rotation.z = -.46
  const lantern = joint(-.43, 1.01, .25); lantern.name = 'traveller-lantern'
  const flame = new THREE.MeshStandardMaterial({ color: 0xffd695, emissive: 0xffb340, emissiveIntensity: 1.5, roughness: 1 })
  bx(.17, .24, .14, flame, 0, 0, 0, lantern)
  for (const y of [-.14, .14]) bx(.23, .04, .20, brass, 0, y, 0, lantern)
  for (const x of [-.1, .1]) bx(.025, .28, .025, dark, x, 0, .085, lantern)
  part(new THREE.TorusGeometry(.08, .018, 4, 8), brass, 0, .23, 0, lantern)
  let capeParent = joint(0, 1.51, -.31)
  for (let i = 0; i < 3; i++) {
    const segment = joint(0, i ? -.24 : 0, 0, capeParent)
    bx(.37 + i * .025, .29, .025, cloth, 0, -.14, 0, segment)
    capeParent = segment
  }
  return { root, lantern, height: 2.15 }
}
