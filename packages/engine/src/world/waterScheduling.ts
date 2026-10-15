import * as THREE from 'three'

export interface OffscreenWaterPolicy {
  mode: 'pause'
  /** Extra world-space metres beyond the camera frustum. Default 4. */
  margin?: number
}

/** Optional engine scheduling only; explicit rain/disturb/refresh calls are never intercepted. */
export function createWaterUpdateGate(policy: OffscreenWaterPolicy) {
  const margin = policy.margin ?? 4
  if (policy.mode !== 'pause' || !Number.isFinite(margin) || margin < 0)
    throw new Error('Offscreen water requires mode=pause and a finite nonnegative margin')
  const sphere = new THREE.Sphere()
  return (mesh: THREE.Mesh, frustum: THREE.Frustum) => {
    mesh.updateWorldMatrix(true, false)
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere()
    sphere.copy(mesh.geometry.boundingSphere!).applyMatrix4(mesh.matrixWorld)
    sphere.radius += margin
    return frustum.intersectsSphere(sphere)
  }
}
