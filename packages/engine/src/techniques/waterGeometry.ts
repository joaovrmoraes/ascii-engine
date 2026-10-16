import * as THREE from 'three'

const prototype = THREE.BufferAttribute.prototype
function plain(attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) {
  return (
    attribute instanceof THREE.BufferAttribute &&
    attribute.itemSize === 3 &&
    !attribute.normalized &&
    attribute.array instanceof Float32Array &&
    attribute.getX === prototype.getX &&
    attribute.getY === prototype.getY &&
    attribute.getZ === prototype.getZ &&
    attribute.setXYZ === prototype.setXYZ
  )
}

/** Replay Three's indexed normal accumulation with the same float32 writes. */
export function updateWaterNormals(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute('position'),
    normal = geometry.getAttribute('normal'),
    index = geometry.getIndex()
  if (
    geometry.computeVertexNormals !== THREE.BufferGeometry.prototype.computeVertexNormals ||
    !position ||
    !normal ||
    !plain(position) ||
    !plain(normal) ||
    normal.count !== position.count ||
    !index ||
    index.itemSize !== 1 ||
    index.normalized ||
    index.getX !== prototype.getX ||
    !(index.array instanceof Uint16Array || index.array instanceof Uint32Array)
  ) {
    geometry.computeVertexNormals()
    return
  }
  const positions = position.array as Float32Array,
    normals = normal.array as Float32Array,
    indices = index.array
  normals.fill(0)
  for (let i = 0; i < index.count; i += 3) {
    const a = indices[i] * 3,
      b = indices[i + 1] * 3,
      c = indices[i + 2] * 3,
      cbx = positions[c] - positions[b],
      cby = positions[c + 1] - positions[b + 1],
      cbz = positions[c + 2] - positions[b + 2],
      abx = positions[a] - positions[b],
      aby = positions[a + 1] - positions[b + 1],
      abz = positions[a + 2] - positions[b + 2],
      nx = cby * abz - cbz * aby,
      ny = cbz * abx - cbx * abz,
      nz = cbx * aby - cby * abx
    // Read all three old normals before writing, including repeated indices.
    const ax = normals[a] + nx,
      ay = normals[a + 1] + ny,
      az = normals[a + 2] + nz,
      bx = normals[b] + nx,
      by = normals[b + 1] + ny,
      bz = normals[b + 2] + nz,
      cx = normals[c] + nx,
      cy = normals[c + 1] + ny,
      cz = normals[c + 2] + nz
    normals[a] = ax
    normals[a + 1] = ay
    normals[a + 2] = az
    normals[b] = bx
    normals[b + 1] = by
    normals[b + 2] = bz
    normals[c] = cx
    normals[c + 1] = cy
    normals[c + 2] = cz
  }
  for (let i = 0; i < normals.length; i += 3) {
    const x = normals[i],
      y = normals[i + 1],
      z = normals[i + 2],
      inverseLength = 1 / (Math.sqrt(x * x + y * y + z * z) || 1)
    normals[i] = x * inverseLength
    normals[i + 1] = y * inverseLength
    normals[i + 2] = z * inverseLength
  }
  normal.needsUpdate = true
}
