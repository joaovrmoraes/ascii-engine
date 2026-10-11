import * as THREE from 'three'
import { createGlyphCloud } from './glyphCloud'
import { swampWeather } from './swamp'
import { stormAt } from './storm'
import { createRainStreaks } from './rainStreaks'

const fract = (value: number) => value - Math.floor(value)
const hash = (value: number) => fract(Math.sin(value * 127.1 + 19.7) * 43758.5453)
export const RAIN_COUNT = 800
export function rainDrop(index: number, time: number) {
  const phase = fract(time * (1.1 + hash(index) * .35) + hash(index + 2000))
  const x = -13 + hash(index * 3 + 1) * 26, z = -13 + hash(index * 3 + 2) * 26
  return { phase, x: x + phase * .75, z: z + phase * .25, impactX: x + .75, impactZ: z + .25 }
}

/** Rain belongs to world space, so rotating the camera preserves its depth. */
export function createRain(enabled: boolean) {
  const scene = new THREE.Scene(), cloud = enabled ? createGlyphCloud(64) : null
  const streaks = enabled ? createRainStreaks(RAIN_COUNT) : null
  if (cloud && streaks) scene.add(streaks.mesh, cloud.mesh)
  let strikeId = -1
  const strike = new THREE.Vector3(), view = new THREE.Vector3()
  return {
    scene,
    occludeWith(texture: THREE.DepthTexture, width: number, height: number) {
      cloud?.occludeWith(texture, width, height); streaks?.occludeWith(texture, width, height)
    },
    update(time: number, camera: THREE.OrthographicCamera, height: number, hero: THREE.Vector3, brightness: number) {
      if (!cloud || !streaks) return
      cloud.clear(); streaks.clear()
      const weather = swampWeather(time)
      camera.getWorldDirection(view)
      let visibleDrops = 0
      const storm = stormAt(time)
      if (storm && storm.id !== strikeId) {
        strikeId = storm.id
        strike.set(hero.x + storm.side * 2.8, weather.level, hero.z - 3.2)
      }
      for (let i = 0; i < RAIN_COUNT; i++) {
        const { x, z, phase } = rainDrop(i, time)
        if (Math.hypot(x - hero.x, z - hero.z) > 10) continue
        const y = weather.level + (1 - phase) * 6.5
        // Near drops carry longer, lighter strokes. Distant rain stays fine;
        // depth testing still puts it behind branches and the traveller.
        const depth = (x - hero.x) * view.x + (y - 1) * view.y + (z - hero.z) * view.z
        const near = THREE.MathUtils.clamp((2 - depth) / 7, 0, 1)
        const length = .23 + near * .15 + hash(i + 4000) * .06
        const besideHero = Math.hypot(x - hero.x, z - hero.z) < .65 && y < 2.35
        const alpha = (besideHero ? .34 : .70 + near * .15) * Math.min(1, phase * 10) * weather.rain
        streaks.push(x, y, z, length, alpha)
        visibleDrops++
      }
      if (storm && storm.bolt > 0) {
        // Broken ASCII strokes descend through the world, with a fork halfway up.
        for (let i = 0; i < 40; i++) {
          const h = i * .16, bend = Math.sin(i * .63 + storm.id) * .19 + Math.sin(i * .19) * .32
          cloud.push(strike.x + bend, strike.y + h, strike.z, .23, i % 3 === 0 ? '|' : i % 3 === 1 ? '/' : '\\', [1.8,2,2.4], storm.bolt)
          if (i > 18 && i < 31) cloud.push(strike.x + bend + (i - 18) * .095, strike.y + h, strike.z + .15, .18, '/', [1.1,1.4,1.9], storm.bolt * .65)
        }
      }
      scene.userData.drops = visibleDrops
      streaks.commit(brightness * (1 + (storm?.flash ?? 0) * .55))
      cloud.commit(height, camera, brightness * (1 + (storm?.flash ?? 0) * .8))
    },
    dispose() { cloud?.dispose(); streaks?.dispose() },
  }
}
