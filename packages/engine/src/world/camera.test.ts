import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { applySceneCamera, type SceneCamera } from './camera'
import { parseScene } from './validation'

const camera: SceneCamera = {
  name: 'Plano geral',
  projection: 'orthographic',
  position: [3, 5, 8],
  rotation: [-0.4, 0.2, 0],
  span: 4,
  aspect: 16 / 9,
}
describe('portable cameras', () => {
  it('preserves initial camera and framing after serialization', () => {
    const doc = parseScene({
      version: 1,
      objects: [],
      cameras: { wide: camera },
      activeCamera: 'wide',
    })
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
    const view = new THREE.OrthographicCamera()
    applySceneCamera(view, doc.cameras!.wide)
    const center = view.position
      .clone()
      .addScaledVector(view.getWorldDirection(new THREE.Vector3()), 10)
      .project(view)
    expect(center.x).toBeCloseTo(0)
    expect(center.y).toBeCloseTo(0)
    expect((view.right - view.left) / (view.top - view.bottom)).toBeCloseTo(16 / 9)
    expect(view.position.toArray()).toEqual(camera.position)
  })
  it.each([
    { span: 0 },
    { aspect: 0 },
    { position: [0, 0] },
    { rotation: [0, NaN, 0] },
    { projection: 'invalid' },
    { near: 20, far: 2 },
  ])('rejects invalid cameras before rendering: %j', patch => {
    expect(() =>
      parseScene({ version: 1, objects: [], cameras: { wide: { ...camera, ...patch } } }),
    ).toThrow('Invalid scene')
  })
  it('rejects a missing initial camera reference', () =>
    expect(() => parseScene({ version: 1, objects: [], activeCamera: 'missing' })).toThrow(
      'camera not found',
    ))
})
