import * as THREE from 'three'
import { tagSurface } from './surface'

/** Bent alder/willow trunks with uneven crowns and hanging leaf curtains. */
export function createWetlandTree(x: number, z: number, height: number, seed: number, marsh = true) {
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const root = new THREE.Group(); root.position.set(x, 0, z)
  const wood = tagSurface(new THREE.MeshStandardMaterial({ color: 0x947d59, roughness: .92, flatShading: true }), 'bark')
  const branchGeometry = new THREE.CylinderGeometry(.58, 1, 1, 7)
  const up = new THREE.Vector3(0, 1, 0)
  function branch(a: THREE.Vector3, b: THREE.Vector3, radius: number) {
    const part = new THREE.Mesh(branchGeometry, wood)
    part.position.copy(a).lerp(b, .5); part.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize())
    part.scale.set(radius, a.distanceTo(b), radius); part.castShadow = part.receiveShadow = true; root.add(part)
  }
  const foot = new THREE.Vector3(0, .08, 0), fork = new THREE.Vector3(.19, height * .47, -.12)
  branch(foot, fork, .29)
  branch(fork, new THREE.Vector3(-.12, height * .88, .1), .17)
  for (let i = 0; i < 7; i++) {
    const a = i * 2.399
    branch(new THREE.Vector3(.03, .65, 0), new THREE.Vector3(Math.cos(a) * (.8 + random() * .4), .14, Math.sin(a) * .9), .14)
  }
  const leafMaterial = tagSurface(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true, emissive: 0x2a4b37, emissiveIntensity: .16 }), 'foliage')
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
    // Separate boughs preserve gaps and let the actor cutaway hide one branch,
    // instead of removing the entire crown when a single leaf crosses the hero.
    leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, 36); n = 0
    const angle = b * 2.399 + random() * .25, reach = 1.15 + random() * .65
    const tip = new THREE.Vector3(Math.cos(angle) * reach, height * (.72 + random() * .12), Math.sin(angle) * reach)
    branch(fork, tip, .10)
    branch(tip, tip.clone().add(new THREE.Vector3(Math.cos(angle) * .42, .15, Math.sin(angle) * .42)), .045)
    // Small overlapping clusters retain gaps, lit facets and a ragged silhouette.
    for (let k = 0; k < 24; k++) {
      const spread = random() * Math.PI * 2, radius = Math.sqrt(random()) * .95
      leaf(tip.x + Math.cos(spread) * radius, tip.y + .08 + random() * .52, tip.z + Math.sin(spread) * radius,
        .17 + random() * .23, .10 + random() * .16, .20 + random() * .23)
    }
    for (let curtain = 0; curtain < 4; curtain++) {
      const a = angle + (curtain - 1.5) * .38, length = (marsh ? .55 : .25) + random() * .65
      const cx = Math.cos(a) * (reach + .42), cz = Math.sin(a) * (reach + .42)
      for (let k = 0; k < 3; k++) {
        const taper = 1 - k * .2
        leaf(cx + Math.sin(k * .8 + a) * .09, tip.y - k * length / 3, cz, .16 * taper, length * .28, .20 * taper)
      }
    }
    leaves.count = n; leaves.castShadow = leaves.receiveShadow = true
    crowns.push(leaves); root.add(leaves)
  }
  return { root, animate(time: number) {
    crowns.forEach((crown, i) => {
      crown.rotation.z = Math.sin(time * .85 + x * .7 + i * .6) * .012
      crown.rotation.x = Math.sin(time * .62 + z * .4 + i * .4) * .009
    })
  } }
}
