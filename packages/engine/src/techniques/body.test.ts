import { expect, it } from 'vitest'
import * as THREE from 'three'
import { updateSkinnedBody } from './body'

function fixture(relative?: boolean, interleaved = false) {
  const geometry = new THREE.BoxGeometry(1, 2, 0.6, 2, 3, 1)
  const count = geometry.attributes.position.count
  const joints = new Uint16Array(count * 4),
    weights = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    joints[i * 4 + 1] = 1
    weights[i * 4] = 0.35
    weights[i * 4 + 1] = 0.6
  }
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(joints, 4))
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4))
  if (relative !== undefined) {
    geometry.morphTargetsRelative = relative
    geometry.morphAttributes.position = [0, 1].map(m => {
      const a = new Float32Array(count * 3)
      for (let i = 0; i < a.length; i++)
        a[i] = (relative ? 0 : geometry.attributes.position.array[i]) + Math.sin(i + m) * 0.1
      return new THREE.Float32BufferAttribute(a, 3)
    })
  }
  if (interleaved) {
    const a = new Float32Array(count * 5)
    for (let i = 0; i < count; i++)
      a.set(geometry.attributes.position.array.slice(i * 3, i * 3 + 3), i * 5 + 1)
    geometry.setAttribute(
      'position',
      new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(a, 5), 3, 1),
    )
  }
  const mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshStandardMaterial())
  const root = new THREE.Bone(),
    joint = new THREE.Bone()
  root.add(joint)
  joint.position.y = 0.6
  mesh.add(root)
  mesh.position.set(0.4, 0.7, -0.8)
  mesh.rotation.y = 0.3
  mesh.scale.set(0.8, 1.2, 0.9)
  mesh.bind(new THREE.Skeleton([root, joint]))
  const corners = new Uint32Array(geometry.index!.array),
    bary = new Float32Array(corners.length)
  for (let i = 0; i < bary.length; i++) bary[i] = [0.2, 0.3, 0.5][i % 3]
  const letters = new THREE.BufferGeometry()
  letters.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(corners.length), 3),
  )
  letters.setAttribute(
    'normal',
    new THREE.Float32BufferAttribute(new Float32Array(corners.length), 3),
  )
  const points = new THREE.Points(letters)
  points.userData.skin = { mesh, corners, weights: bary }
  return { mesh, joint, points }
}

/** Frozen pre-optimization path, independent of the cache and scalar implementation. */
function reference(points: THREE.Points) {
  const { mesh, corners, weights } = points.userData.skin
  const position = new Float32Array(weights.length),
    normal = new Float32Array(weights.length)
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3(),
    p = new THREE.Vector3(),
    n = new THREE.Vector3()
  for (let i = 0; i < weights.length / 3; i++) {
    mesh.getVertexPosition(corners[i * 3], a)
    mesh.getVertexPosition(corners[i * 3 + 1], b)
    mesh.getVertexPosition(corners[i * 3 + 2], c)
    p.copy(a)
      .multiplyScalar(weights[i * 3])
      .addScaledVector(b, weights[i * 3 + 1])
      .addScaledVector(c, weights[i * 3 + 2])
    n.subVectors(b, a).cross(c.sub(a)).normalize()
    p.toArray(position, i * 3)
    n.toArray(normal, i * 3)
  }
  return { position, normal }
}
for (const [label, relative, interleaved] of [
  ['basic', undefined, false],
  ['relative morphs', true, false],
  ['absolute morphs', false, false],
  ['interleaved', true, true],
] as const)
  it(`matches all positions/normals over 600 animated poses: ${label}`, () => {
    const { mesh, joint, points } = fixture(relative, interleaved)
    let maximum = 0
    for (let step = 0; step < 600; step++) {
      joint.rotation.set(Math.sin(step / 60) * 0.7, step / 160, Math.cos(step / 50) * 0.2)
      mesh.position.x = Math.sin(step / 100)
      if (mesh.morphTargetInfluences)
        mesh.morphTargetInfluences.splice(0, 2, Math.sin(step / 73) * 0.4, 0.3)
      // Live geometry edits and weight changes must not use a stale rest-pose cache.
      if (step === 300) {
        mesh.geometry.attributes.position.setX(0, 0.38)
        mesh.geometry.attributes.skinWeight.setX(0, 0.25)
      }
      mesh.updateMatrixWorld(true)
      const expected = reference(points)
      updateSkinnedBody(points)
      for (const name of ['position', 'normal'] as const) {
        const actual = points.geometry.attributes[name].array
        for (let i = 0; i < actual.length; i++)
          maximum = Math.max(maximum, Math.abs(actual[i] - expected[name][i]))
      }
    }
    expect(maximum).toBeLessThanOrEqual(1e-5)
  })
it('retains custom getVertexPosition semantics and rebuilds for replaced geometry', () => {
  const { mesh, points } = fixture()
  const original = mesh.getVertexPosition.bind(mesh)
  mesh.getVertexPosition = (index, target) => original(index, target).addScalar(0.125)
  for (let i = 0; i < 2; i++) {
    mesh.updateMatrixWorld(true)
    const expected = reference(points)
    updateSkinnedBody(points)
    expect(Array.from(points.geometry.attributes.position.array)).toEqual(
      Array.from(expected.position),
    )
    mesh.geometry = mesh.geometry.clone()
  }
})
it('handles degenerate triangles without non-finite normals', () => {
  const { mesh, points } = fixture()
  points.userData.skin.corners.fill(0)
  mesh.updateMatrixWorld(true)
  updateSkinnedBody(points)
  expect(Array.from(points.geometry.attributes.normal.array).every(v => v === 0)).toBe(true)
})
it('preserves normalized weight attributes and detached bind matrices', () => {
  const { mesh, points, joint } = fixture()
  const values = new Uint8Array(mesh.geometry.attributes.position.count * 4)
  for (let i = 0; i < values.length; i++) values[i] = [63, 192, 0, 0][i % 4]
  mesh.geometry.setAttribute('skinWeight', new THREE.Uint8BufferAttribute(values, 4, true))
  mesh.bindMode = 'detached'
  joint.rotation.z = 0.6
  mesh.updateMatrixWorld(true)
  const expected = reference(points)
  updateSkinnedBody(points)
  expect(Array.from(points.geometry.attributes.position.array)).toEqual(
    Array.from(expected.position),
  )
  expect(Array.from(points.geometry.attributes.normal.array)).toEqual(Array.from(expected.normal))
})
