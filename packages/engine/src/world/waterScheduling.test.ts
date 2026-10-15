import { expect, it } from 'vitest'
import * as THREE from 'three'
import { createWaterUpdateGate } from './waterScheduling'

function view() {
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100)
  camera.position.set(0, 20, 0)
  camera.up.set(0, 0, -1)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()
  const frustum = new THREE.Frustum().setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
  )
  return { camera, frustum }
}
it('keeps visible waters and a conservative world-space frustum margin active', () => {
  const { frustum } = view(),
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
  mesh.rotation.x = -Math.PI / 2
  const active = createWaterUpdateGate({ mode: 'pause', margin: 4 })
  expect(active(mesh, frustum)).toBe(true)
  mesh.position.x = 14
  expect(active(mesh, frustum)).toBe(true)
  mesh.position.x = 16
  expect(active(mesh, frustum)).toBe(false)
  mesh.position.x = 11
  expect(active(mesh, frustum)).toBe(true)
})
it('uses transformed complete bounds, including parent transforms and camera changes', () => {
  const { camera } = view(),
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(28, 28)),
    parent = new THREE.Group()
  mesh.rotation.x = -Math.PI / 2
  parent.add(mesh)
  parent.position.x = 64
  const frustum = () =>
    new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
    )
  const active = createWaterUpdateGate({ mode: 'pause' })
  expect(active(mesh, frustum())).toBe(false)
  camera.position.x = 64
  camera.lookAt(64, 0, 0)
  camera.updateMatrixWorld()
  expect(active(mesh, frustum())).toBe(true)
  parent.scale.setScalar(5)
  parent.position.x = 120
  expect(active(mesh, frustum())).toBe(true)
})
it('rejects invalid policy margins instead of silently culling visible water', () => {
  for (const margin of [-1, NaN, Infinity])
    expect(() => createWaterUpdateGate({ mode: 'pause', margin })).toThrow()
  expect(() => createWaterUpdateGate({ mode: 'pause', margin: 0 })).not.toThrow()
})
