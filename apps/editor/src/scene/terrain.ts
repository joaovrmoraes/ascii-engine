import * as THREE from 'three'
import { forestFloorMaterial, forestMeadowCover } from '@ascii-engine/core/pomorog'
import { type AsciiEngine } from '@ascii-engine/core'

/** Height of the test relief: a hill, a ridge with a steep face and a hollow. */
export function reliefHeight(x: number, z: number) {
  const hill = 2.4 * Math.exp(-((x - 3) ** 2 + (z + 2) ** 2) / 10)
  const ridge = (1.8 / (1 + Math.exp(-(x + z + 4) * 3))) * Math.exp(-((x - z) ** 2) / 40)
  const hollow = -1.2 * Math.exp(-((x + 4) ** 2 + (z - 3) ** 2) / 6)
  return hill + ridge + hollow
}

/**
 * Relief check for §3.4: the `surface` lattice on slopes and steep faces
 * (each fragment picks its plane by the dominant normal axis).
 */
export function buildTerrainScene(engine: AsciiEngine) {
  const geometry = new THREE.PlaneGeometry(30, 30, 160, 160)
  geometry.rotateX(-Math.PI / 2)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++)
    position.setY(i, reliefHeight(position.getX(i), position.getZ(i)))
  geometry.computeVertexNormals()
  const ground = new THREE.Mesh(geometry, forestFloorMaterial())
  ground.receiveShadow = true
  ground.castShadow = true
  engine.add(ground, { type: 'ground' })
  const cover = forestMeadowCover({ count: 50000 })
  const carpet = engine.createCarpet({ ...cover, y: (x, z) => reliefHeight(x, z) - 0.06 })
  engine.add(carpet.mesh, { glyph: 'carpet' })
  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x78644c, roughness: 1, flatShading: true }),
  )
  crate.position.set(3, reliefHeight(3, -2) + 0.35, -2)
  crate.castShadow = crate.receiveShadow = true
  engine.add(crate, { type: 'prop' })
  return {
    id: 'terrain',
    title: 'Relevo (teste §3.4)',
    hero: new THREE.Vector3(100, 0, 100),
    state: 'static',
    focus: (_angle: number, target: THREE.Vector3) => target.set(0, 1, 0),
    update() {},
    dispose() {},
  }
}
