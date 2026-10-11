import * as THREE from 'three'
import { SWAMP_ISLANDS, swampBoardwalk } from './swamp'
import { tagSurface } from './surface'

/** Actual bank geometry: it catches light, moves and appears in the water mirror. */
export function createShoreDetails(scene: THREE.Scene, marsh: boolean) {
  let seed = marsh ? 18371 : 21943
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const time = { value: 0 }
  const grassMaterial = tagSurface(new THREE.MeshStandardMaterial({
    color: 0xffffff, side: THREE.DoubleSide, roughness: 1,
    emissive: 0x294e35, emissiveIntensity: .16,
  }), 'wetgrass')
  const surfaceCompile = grassMaterial.onBeforeCompile
  grassMaterial.onBeforeCompile = (shader, renderer) => {
    surfaceCompile(shader, renderer)
    shader.uniforms.bankTime = time
    shader.vertexShader = 'uniform float bankTime;\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      float phase = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * .8;
      transformed.x += sin(bankTime * 1.45 + phase) * position.y * position.y * .16;
      transformed.z += cos(bankTime * .93 + phase) * position.y * .05;
    `)
  }
  grassMaterial.customProgramCacheKey = () => 'ascii-shore-grass-v1'

  // Three bent blades with a broad base and tapered tips; no billboard planes.
  const vertices: number[] = []
  for (let blade = 0; blade < 3; blade++) {
    const angle = blade * 2.399, width = .065, reach = .24 + blade * .06
    const point = (x: number, y: number, z: number) => [Math.cos(angle) * x - Math.sin(angle) * z, y, Math.sin(angle) * x + Math.cos(angle) * z]
    const a = point(-width, 0, 0), b = point(width, 0, 0)
    const c = point(reach - width * .45, .6, 0), d = point(reach + width * .45, .6, 0)
    const e = point(reach * 1.8, .84 + blade * .08, 0)
    vertices.push(...a, ...b, ...c, ...b, ...d, ...c, ...c, ...d, ...e)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.computeVertexNormals()
  const grasses = new THREE.InstancedMesh(geometry, grassMaterial, 2200)
  const pebbleMaterial = tagSurface(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .88, flatShading: true }), 'stone')
  const stones = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), pebbleMaterial, 180)
  const mossMaterial = tagSurface(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), 'foliage')
  const moss = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), mossMaterial, 180)
  const pose = new THREE.Object3D(), color = new THREE.Color()
  let blades = 0, rocks = 0
  const palette = [0x527951, 0x648e57, 0x809a66, 0x385e48, 0x47775e]
  for (let attempt = 0; attempt < 4800; attempt++) {
    const x = -8 + random() * 16, z = -10 + random() * 22
    const shore = marsh
      ? Math.min(...SWAMP_ISLANDS.map(i => Math.hypot((x - i.x) / i.rx, (z - i.z) / i.rz)))
      : Math.abs(x - 3.95 - Math.sin(z * .45) * .5)
    const onBank = marsh ? shore > .72 && shore < 1.22 : shore > 1.17 && shore < 2.1
    if (!onBank || Math.hypot(x + 3, z - 2.6) < 1.15 || (marsh && swampBoardwalk(x, z))) continue
    if (!marsh && Math.abs(z + .9) < .85) continue
    const patch = .5 + .5 * Math.sin(x * 4.7 + Math.sin(z * 2.8))
    if (random() < .12 + patch * .2) continue
    const ground = marsh ? .14 : -.035
    if (blades < grasses.count) {
      pose.position.set(x, ground, z)
      const height = .22 + random() * .35
      pose.scale.set(.7 + random() * .7, height, .7 + random() * .7)
      pose.rotation.set(0, random() * Math.PI * 2, 0); pose.updateMatrix()
      grasses.setMatrixAt(blades, pose.matrix)
      grasses.setColorAt(blades++, color.setHex(palette[Math.floor(random() * palette.length)]))
    }
    if (random() > .13 || rocks >= stones.count) continue
    const size = .10 + Math.pow(random(), 3) * .53
    pose.position.set(x, ground + size * .33, z)
    pose.scale.set(size, size * (.65 + random() * .3), size * (.8 + random() * .4))
    pose.rotation.set(random() * .3, random() * 6, random() * .2); pose.updateMatrix()
    stones.setMatrixAt(rocks, pose.matrix)
    stones.setColorAt(rocks, color.setHex([0x7a8b89, 0x9a9e91, 0x616e71][rocks % 3]))
    pose.position.y += size * .55; pose.scale.multiply(new THREE.Vector3(.86, .25, .82)); pose.updateMatrix()
    moss.setMatrixAt(rocks, pose.matrix)
    moss.setColorAt(rocks++, color.setHex(palette[Math.floor(random() * palette.length)]))
  }
  grasses.count = blades; stones.count = moss.count = rocks
  for (const mesh of [grasses, stones, moss]) {
    mesh.receiveShadow = true
    // Sparse patches must not vanish as one giant object in the actor cutaway.
    mesh.userData.keepInCutaway = true
    scene.add(mesh)
  }
  return { animate(seconds: number) { time.value = seconds } }
}
