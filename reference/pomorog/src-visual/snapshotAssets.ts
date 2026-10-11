import * as THREE from 'three'
import { ITEMS, MONSTERS } from '../../engine'
import { createAdventurer, createCreature } from './models'
import { createItemModel } from './itemModels'
import { createAsciiPass } from './ascii'
import { markActorInk } from './actorInk'

/** Asset photography: the exact world ASCII shader, baked into PNGs for zero runtime cost. */
export function createAssetPhotographer() {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x020102)
  scene.add(new THREE.HemisphereLight(0xd6d5e7, 0x44323b, 2))
  const light = new THREE.DirectionalLight(0xffe0af, 3.1);light.position.set(-4,7,6);scene.add(light)
  const rim = new THREE.DirectionalLight(0xa6b9ed, 2);rim.position.set(3,3,-4);scene.add(rim)
  const target = new THREE.WebGLRenderTarget(1,1);target.depthTexture = new THREE.DepthTexture(1,1,THREE.UnsignedIntType)
  const ascii = createAsciiPass();ascii.material.uniforms.sceneTexture.value=target.texture;ascii.material.uniforms.sceneDepth.value=target.depthTexture
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,.01,100)
  return {
    take(kind: 'item'|'monster'|'hero', id: string) {
      const actor = kind==='hero' ? createAdventurer() : kind==='monster' ? createCreature(MONSTERS[id].family,id) : null
      const root = actor?.root ?? createItemModel(id)
      actor?.animate({ time: 2.6, dt: 1/60, speed: 0, distance: 0, attackAge: -1, hurtAge: -1 })
      markActorInk(root);scene.add(root)
      const width = kind==='hero'?180:256, height=kind==='hero'?220:240
      renderer.setSize(width,height);target.setSize(width,height)
      const bounds=new THREE.Box3().setFromObject(root), center=bounds.getCenter(new THREE.Vector3())
      camera.position.copy(center).add(new THREE.Vector3(3.2,kind==='hero'?2.3:2.8,8));camera.lookAt(center);camera.updateMatrixWorld()
      // Fit the silhouette in camera space: tall blades and wide creatures get
      // the same readable coverage instead of being lost inside square padding.
      const projected = new THREE.Box3()
      for (const x of [bounds.min.x,bounds.max.x]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [bounds.min.z,bounds.max.z]) {
        projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse))
      }
      const aspect=width/height, span=Math.max(projected.max.y-projected.min.y,(projected.max.x-projected.min.x)/aspect)*.54
      const mid=projected.getCenter(new THREE.Vector3())
      camera.left=mid.x-span*aspect;camera.right=mid.x+span*aspect;camera.top=mid.y+span;camera.bottom=mid.y-span
      camera.updateProjectionMatrix()
      ascii.material.uniforms.resolution.value.set(width,height);ascii.material.uniforms.cellSize.value=6
      ascii.material.uniforms.brightness.value=1.35
      ascii.material.uniforms.inverseProjection.value.copy(camera.projectionMatrixInverse);ascii.material.uniforms.cameraWorld.value.copy(camera.matrixWorld)
      renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(ascii.scene,ascii.camera)
      const png=renderer.domElement.toDataURL('image/png')
      scene.remove(root)
      const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(root.userData.materials??[])
      root.traverse((obj)=>{if(obj instanceof THREE.Mesh){geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach((material)=>materials.add(material))}})
      geometries.forEach((g)=>g.dispose());materials.forEach((m)=>m.dispose())
      return png
    },
    list: [{kind:'hero',id:'hero'},...Object.keys(ITEMS).map((id)=>({kind:'item',id})),...Object.keys(MONSTERS).map((id)=>({kind:'monster',id}))] as {kind:'item'|'monster'|'hero';id:string}[],
    dispose(){target.depthTexture?.dispose();target.dispose();ascii.dispose();renderer.dispose()},
  }
}
