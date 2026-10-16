import * as THREE from 'three'
import { expect, it } from 'vitest'
import { updateWaterNormals } from './waterGeometry'

function parity(geometry: THREE.BufferGeometry) {
  const reference = geometry.clone()
  reference.computeVertexNormals()
  updateWaterNormals(geometry)
  const actual = geometry.getAttribute('normal') as THREE.BufferAttribute,
    expected = reference.getAttribute('normal')
  let different = 0
  for (let i = 0; i < actual.array.length; i++)
    if (!Object.is(actual.array[i], expected.array[i])) different++
  expect(different).toBe(0)
  expect(actual.version).toBeGreaterThan(0)
  reference.dispose()
}

it('matches every Three float32 normal for changing water grids and topology', () => {
  for (const resolution of [9, 65, 129, 257]) {
    const geometry = new THREE.PlaneGeometry(28, 28, resolution - 1, resolution - 1)
    geometry.rotateX(-Math.PI / 2)
    for (const time of [0, 0.3, 20]) {
      const position = geometry.getAttribute('position')
      for (let i = 0; i < position.count; i++)
        position.setY(i, Math.sin(position.getX(i) * 2.3 + time) * Math.cos(position.getZ(i)) * 0.7)
      parity(geometry)
    }
    const index = geometry.getIndex()!
    index.setX(0, index.getX(1)) // A degenerate triangle repeats an index.
    parity(geometry)
    geometry.dispose()
  }
})

it('uses Three for non-indexed geometry, missing normals and normalized/interleaved attributes', () => {
  const geometry = new THREE.PlaneGeometry(3, 5, 3, 4).toNonIndexed()
  parity(geometry)
  geometry.deleteAttribute('normal')
  parity(geometry)
  const indexed = new THREE.PlaneGeometry(3, 5, 3, 4)
  const original = indexed.getAttribute('position')
  indexed.setAttribute(
    'position',
    new THREE.BufferAttribute(new Int16Array(original.array.map(v => v * 1000)), 3, true),
  )
  parity(indexed)
  const data = new THREE.InterleavedBuffer(new Float32Array(original.count * 4), 4)
  const interleaved = new THREE.InterleavedBufferAttribute(data, 3, 1)
  for (let i = 0; i < original.count; i++)
    interleaved.setXYZ(i, original.getX(i), original.getY(i), original.getZ(i))
  indexed.setAttribute('position', interleaved)
  parity(indexed)
  geometry.dispose()
  indexed.dispose()
})

it('honors custom normal reconstruction and attribute accessors', () => {
  const geometry = new THREE.PlaneGeometry(3, 5, 3, 4)
  let calls = 0
  geometry.computeVertexNormals = function () {
    calls++
    THREE.BufferGeometry.prototype.computeVertexNormals.call(this)
  }
  parity(geometry)
  expect(calls).toBe(1)
  geometry.computeVertexNormals = THREE.BufferGeometry.prototype.computeVertexNormals
  const position = geometry.getAttribute('position')
  const getY = position.getY
  position.getY = function (index) {
    return getY.call(this, index) + 0.2 * Math.sin(index)
  }
  const reference = geometry.clone()
  reference.getAttribute('position').getY = position.getY
  reference.computeVertexNormals()
  updateWaterNormals(geometry)
  expect(Array.from(geometry.getAttribute('normal').array)).toEqual(
    Array.from(reference.getAttribute('normal').array),
  )
  geometry.dispose()
  reference.dispose()
})
