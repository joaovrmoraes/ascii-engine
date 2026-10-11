import type { OrthographicCamera } from 'three'

/** A portable composition camera. Rotation is XYZ Euler, in radians. */
export interface SceneCamera {
  name: string
  projection: 'orthographic'
  position: [number, number, number]
  rotation: [number, number, number]
  /** Half of the vertical field, in metres. */
  span: number
  aspect: number
  near?: number
  far?: number
}

/** The viewport must keep the declared aspect ratio to preserve composition. */
export function applySceneCamera(camera: OrthographicCamera, view: SceneCamera) {
  camera.position.set(...view.position); camera.rotation.set(...view.rotation, 'XYZ')
  camera.zoom = 1; camera.left = -view.span * view.aspect; camera.right = view.span * view.aspect
  camera.top = view.span; camera.bottom = -view.span; camera.near = view.near ?? .1; camera.far = view.far ?? 1000
  camera.updateProjectionMatrix(); camera.updateMatrixWorld()
}
