import * as THREE from 'three'
import type { AsciiEngine } from '../engine'
import { snowflake } from './snow'
import { createRain } from './rain'

export interface SceneEnvironment {
  weather: 'none' | 'rain' | 'snow'
  intensity?: number
}

/** Reuses the original world-space rain/snow recipes. No game state or biome. */
export function createSceneWeather(
  engine: AsciiEngine,
  environment?: SceneEnvironment,
  extent = 32,
) {
  const intensity = environment?.intensity ?? 1
  if (!environment || environment.weather === 'none' || intensity === 0)
    return { update(_time: number) {}, dispose() {} }
  const center = new THREE.Vector3()
  const letters = engine.createParticles(environment.weather === 'snow' ? 1800 : 1)
  engine.add(letters.mesh, { glyph: 'particle' })
  const streaks = environment.weather === 'rain' ? engine.createRainStreaks(800) : undefined
  if (streaks) engine.add(streaks.mesh, { glyph: 'particle' })
  const rain = streaks ? createRain(streaks, letters, { span: extent, radius: extent }) : undefined
  return {
    update(time: number) {
      letters.clear()
      streaks?.clear()
      if (rain) rain.update(time, engine.camera, center, 0, intensity)
      else
        for (let i = 0; i < Math.floor(1600 * intensity); i++) {
          const flake = snowflake(i, time)
          letters.push(
            (flake.x * extent) / 26,
            flake.y,
            (flake.z * extent) / 26,
            flake.size,
            ['.', '+', '*'][i % 3],
            [0.78, 0.88, 0.94],
            Math.min(1, flake.phase * 8),
          )
        }
    },
    dispose() {
      engine.remove(letters.mesh, { dispose: true })
      if (streaks) engine.remove(streaks.mesh, { dispose: true })
    },
  }
}
