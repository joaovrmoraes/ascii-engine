import * as THREE from 'three'
import { createGlyphCloud } from './glyphCloud'
import { smooth } from './motion'
import { createSwampWater } from './swampWater'
import type { SwampHydrology } from './swampHydrology'
import type { WaterFootPose } from './footWater'

export interface WaterFrame {
  hero: THREE.Vector3; foe?: THREE.Vector3; travelled: number; heading: number
  active: boolean; feedbackId?: string
  feet?: readonly WaterFootPose[]
  feedbackTarget?: 'player' | 'enemy'; foeTravelled?: number; foeHeight?: number; foeDead?: boolean; dt?: number
}

export const riverCenter = (z: number) => 3.95 + Math.sin(z * .45) * .5
export function createWater(locationId: string, hydrology?: SwampHydrology) {
  if (locationId === 'rain_marsh') return createSwampWater(hydrology!)
  const scene = new THREE.Scene(), cloud = createGlyphCloud(9000)
  scene.add(cloud.mesh)
  const points: { x: number; z: number; edge: boolean; seed: number }[] = []
  if (locationId !== 'old_mine' && locationId !== 'snow_pines' && locationId !== 'procedural') {
    for (let z = -10; z < 12; z += .18) {
      for (let lane = -13; lane <= 13; lane++) {
        if (locationId === 'dark_forest') points.push({ x: riverCenter(z) + lane * .09, z, edge: Math.abs(lane) === 13, seed: Math.sin(z * 3 + lane * 4) })
        else for (const side of [-1, 1]) points.push({ x: side * (5.2 + lane * .1), z, edge: Math.abs(lane) === 13, seed: Math.sin(z * 3 + lane * 4) })
      }
    }
  }
  return {
    scene, uniforms: cloud.uniforms, occludeWith: cloud.occludeWith,
    update(time: number, camera: THREE.OrthographicCamera, height: number, brightness: number, _frame?: WaterFrame) {
      cloud.clear()
      for (const p of points) {
        const wave = Math.sin(p.z * 8 - time * 1.5 + Math.sin(p.x * 2) * .3) * .5 + Math.sin(p.z * 3 + time * .8) * .3
        // Only the crests sit above the mirrored surface. Dense rows used to
        // cover reflected scenery with a second, almost solid alphabet.
        if (!p.edge && wave < .28) continue
        const light = p.edge ? .35 : .20 + Math.max(0, wave) * .16
        cloud.push(p.x, .045 + wave * .012, p.z, p.edge ? .15 : .13, p.edge || p.seed > .5 ? '~' : '-', [light * .68, light * .85, light], p.edge ? .50 : .58 * smooth((wave - .28) / .5))
      }
      cloud.commit(height, camera, brightness)
    },
    dispose() { cloud.dispose() },
  }
}
