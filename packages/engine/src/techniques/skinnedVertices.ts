import * as THREE from 'three'

/** Double intermediates preserve getVertexPosition's arithmetic; GPU attributes remain float32. */
export function createSkinCache(mesh: THREE.SkinnedMesh, corners: Uint32Array) {
  return {
    geometry: mesh.geometry,
    indices: new Uint32Array(new Set(corners)),
    vertices: new Float64Array(mesh.geometry.attributes.position.count * 3),
    bones: new Float64Array(mesh.skeleton.bones.length * 16),
    matrix: new THREE.Matrix4(),
    fallback: new THREE.Vector3(),
  }
}
export type SkinCache = ReturnType<typeof createSkinCache>

function plain(attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) {
  return (
    attribute instanceof THREE.BufferAttribute &&
    !attribute.normalized &&
    !(attribute instanceof THREE.Float16BufferAttribute)
  )
}

/** Skin each distinct source vertex once, instead of three times per letter. */
export function updateSkinVertices(mesh: THREE.SkinnedMesh, cache: SkinCache) {
  const geometry = mesh.geometry
  const position = geometry.attributes.position
  const skinIndex = geometry.attributes.skinIndex
  const skinWeight = geometry.attributes.skinWeight
  const morphs = geometry.morphAttributes.position
  const influences = mesh.morphTargetInfluences
  let fast =
    plain(position) &&
    plain(skinIndex) &&
    plain(skinWeight) &&
    mesh.getVertexPosition === THREE.SkinnedMesh.prototype.getVertexPosition &&
    mesh.applyBoneTransform === THREE.SkinnedMesh.prototype.applyBoneTransform
  if (morphs && influences) for (let i = 0; i < morphs.length; i++) fast &&= plain(morphs[i])
  const { vertices, indices, bones } = cache
  // Interleaved/normalized attributes and custom mesh overrides retain Three's semantics.
  if (!fast) {
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i]
      mesh.getVertexPosition(index, cache.fallback)
      vertices[index * 3] = cache.fallback.x
      vertices[index * 3 + 1] = cache.fallback.y
      vertices[index * 3 + 2] = cache.fallback.z
    }
    return vertices
  }
  for (let i = 0; i < mesh.skeleton.bones.length; i++) {
    cache.matrix.multiplyMatrices(mesh.skeleton.bones[i].matrixWorld, mesh.skeleton.boneInverses[i])
    bones.set(cache.matrix.elements, i * 16)
  }
  const positions = position.array,
    joints = skinIndex.array,
    weights = skinWeight.array
  const bind = mesh.bindMatrix.elements,
    inverse = mesh.bindMatrixInverse.elements
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i],
      offset = index * position.itemSize
    let x = positions[offset],
      y = positions[offset + 1],
      z = positions[offset + 2]
    if (morphs && influences) {
      let mx = 0,
        my = 0,
        mz = 0
      for (let m = 0; m < morphs.length; m++) {
        const influence = influences[m]
        if (influence === 0) continue
        const morph = morphs[m].array,
          at = index * morphs[m].itemSize
        mx += (geometry.morphTargetsRelative ? morph[at] : morph[at] - x) * influence
        my += (geometry.morphTargetsRelative ? morph[at + 1] : morph[at + 1] - y) * influence
        mz += (geometry.morphTargetsRelative ? morph[at + 2] : morph[at + 2] - z) * influence
      }
      x += mx
      y += my
      z += mz
    }
    // Three uses Vector4 through bind/bones (without perspective division), then Vector3
    // for the inverse bind. Keep operation order, including non-unit weight sums.
    const bx = bind[0] * x + bind[4] * y + bind[8] * z + bind[12]
    const by = bind[1] * x + bind[5] * y + bind[9] * z + bind[13]
    const bz = bind[2] * x + bind[6] * y + bind[10] * z + bind[14]
    const bw = bind[3] * x + bind[7] * y + bind[11] * z + bind[15]
    x = 0
    y = 0
    z = 0
    for (let j = 0; j < 4; j++) {
      const weight = weights[index * skinWeight.itemSize + j]
      if (weight === 0) continue
      const at = joints[index * skinIndex.itemSize + j] * 16
      x += (bones[at] * bx + bones[at + 4] * by + bones[at + 8] * bz + bones[at + 12] * bw) * weight
      y +=
        (bones[at + 1] * bx + bones[at + 5] * by + bones[at + 9] * bz + bones[at + 13] * bw) *
        weight
      z +=
        (bones[at + 2] * bx + bones[at + 6] * by + bones[at + 10] * bz + bones[at + 14] * bw) *
        weight
    }
    const w = 1 / (inverse[3] * x + inverse[7] * y + inverse[11] * z + inverse[15])
    vertices[index * 3] = (inverse[0] * x + inverse[4] * y + inverse[8] * z + inverse[12]) * w
    vertices[index * 3 + 1] = (inverse[1] * x + inverse[5] * y + inverse[9] * z + inverse[13]) * w
    vertices[index * 3 + 2] = (inverse[2] * x + inverse[6] * y + inverse[10] * z + inverse[14]) * w
  }
  return vertices
}
