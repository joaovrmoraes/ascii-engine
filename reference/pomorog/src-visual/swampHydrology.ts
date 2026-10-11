import * as THREE from 'three'
import { createRippleField } from './rippleField'
import { swampSurface, swampWeather } from './swamp'

export function createSwampHydrology() {
  const field = createRippleField(), pixels = new Uint8Array(field.size * field.size * 4)
  const texture = new THREE.DataTexture(pixels, field.size, field.size, THREE.RGBAFormat)
  texture.minFilter = texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = false
  let lastShore = -1
  return {
    field, texture,
    update(time: number, dt: number) {
      const weather = swampWeather(time)
      if (lastShore < 0 || time - lastShore > .5) {
        field.setShore((x, z) => swampSurface(x, z, weather.level) === 'water'); lastShore = time
      }
      field.advance(dt)
      const heights = field.heights, size = field.size
      for (let z = 1; z < size - 1; z++) for (let x = 1; x < size - 1; x++) {
        const i = z * size + x, p = i * 4
        pixels[p] = Math.max(0, Math.min(255, 128 + heights[i] * 75))
        pixels[p + 1] = Math.max(0, Math.min(255, 128 + (heights[i + 1] - heights[i - 1]) * 110))
        pixels[p + 2] = Math.max(0, Math.min(255, 128 + (heights[i + size] - heights[i - size]) * 110))
        pixels[p + 3] = 255
      }
      texture.needsUpdate = true
    },
    dispose() { texture.dispose() },
  }
}
export type SwampHydrology = ReturnType<typeof createSwampHydrology>
