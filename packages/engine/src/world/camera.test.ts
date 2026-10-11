import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { applySceneCamera, type SceneCamera } from './camera'
import { parseScene } from './validation'

const camera: SceneCamera = { name:'Plano geral', projection:'orthographic', position:[3,5,8], rotation:[-.4,.2,0], span:4, aspect:16/9 }
describe('câmeras portáteis', () => {
  it('preserva câmera inicial e enquadramento após serialização', () => {
    const doc = parseScene({version:1,objects:[],cameras:{wide:camera},activeCamera:'wide'})
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
    const view = new THREE.OrthographicCamera()
    applySceneCamera(view, doc.cameras!.wide)
    const center = view.position.clone().addScaledVector(view.getWorldDirection(new THREE.Vector3()), 10).project(view)
    expect(center.x).toBeCloseTo(0); expect(center.y).toBeCloseTo(0)
    expect((view.right-view.left)/(view.top-view.bottom)).toBeCloseTo(16/9)
    expect(view.position.toArray()).toEqual(camera.position)
  })
  it.each([{span:0},{aspect:0},{position:[0,0]},{rotation:[0,NaN,0]},{projection:'invalid'},{near:20,far:2}])('rejeita câmera inválida antes de renderizar: %j', patch => {
    expect(()=>parseScene({version:1,objects:[],cameras:{wide:{...camera,...patch}}})).toThrow('Cenário inválido')
  })
  it('rejeita referência inicial inexistente', () => expect(()=>parseScene({version:1,objects:[],activeCamera:'missing'})).toThrow('câmera inexistente'))
})
