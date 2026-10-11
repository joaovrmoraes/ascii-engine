import * as THREE from 'three'
import { createExploration, type LightObstacle } from './exploration'

/** Shared by mesh ASCII, grass and water: darkness never leaves an overlay exposed. */
export const illuminationGLSL = `
  uniform sampler2D explorationMap;
  uniform float illuminationEnabled, discoveryEnabled, explorationExtent, lanternPulse, stormFlash;
  uniform vec3 lanternPosition, hearthPosition;
  vec2 discovered(vec3 p) {
    if (illuminationEnabled < .5 || discoveryEnabled < .5) return vec2(1.);
    vec2 uv = p.xz / explorationExtent + .5;
    if (min(uv.x, uv.y) < 0. || max(uv.x, uv.y) > 1.) return vec2(0.);
    return texture2D(explorationMap, uv).rg;
  }
  vec2 localLights(vec3 p) {
    float lamp = pow(max(0., 1. - distance(p.xz, lanternPosition.xz) / 5.8), 1.35) * lanternPulse;
    float hearth = pow(max(0., 1. - distance(p.xz, hearthPosition.xz) / 5.), 1.7);
    return vec2(lamp, hearth) * illuminationEnabled;
  }
  vec3 illuminateInk(vec3 ink, vec3 p) {
    if (illuminationEnabled < .5) return ink;
    vec2 discovery = discovered(p), lights = localLights(p);
    if (discoveryEnabled < .5) {
      // Open sky: cool moonlight keeps the whole landscape readable. Lantern
      // and hearth add local warmth, never a circular visibility restriction.
      return ink * (vec3(.96,1.02,1.02) + vec3(.22,.16,.07) * lights.x + vec3(.32,.17,.04) * lights.y
        + vec3(2.1,2.35,2.65) * stormFlash);
    }
    vec3 memory = vec3(.24,.29,.32) * discovery.y * .30;
    vec3 lit = vec3(.64,.69,.76) + vec3(.64,.52,.30) * lights.x + vec3(.75,.42,.16) * lights.y;
    return ink * (memory + lit * sqrt(discovery.x));
  }
`

export function illuminationUniforms() {
  return {
    explorationMap: { value: null as THREE.Texture | null }, illuminationEnabled: { value: 0 },
    discoveryEnabled: { value: 0 }, stormFlash: { value: 0 },
    explorationExtent: { value: 42 }, lanternPulse: { value: 1 },
    lanternPosition: { value: new THREE.Vector3() }, hearthPosition: { value: new THREE.Vector3() },
  }
}

export function createIllumination(obstacles: LightObstacle[], camp: THREE.Vector3, interior: boolean) {
  const field = createExploration(obstacles)
  const texture = new THREE.DataTexture(field.pixels, field.size, field.size, THREE.RGBAFormat)
  texture.minFilter = texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  const uniforms = illuminationUniforms()
  uniforms.explorationMap.value = texture; uniforms.illuminationEnabled.value = 1
  uniforms.discoveryEnabled.value = interior ? 1 : 0
  uniforms.hearthPosition.value.copy(camp)
  let lastRefresh = -1
  return {
    uniforms, sample: interior ? field.sample : () => ({ visible: 1, explored: 1 }),
    update(time: number, dt: number, hero: THREE.Vector3) {
      uniforms.lanternPosition.value.copy(hero)
      uniforms.lanternPulse.value = 1 + Math.sin(time * 3.7) * .035 + Math.sin(time * 7.3) * .018
      if (!interior) return
      if (lastRefresh < 0 || time - lastRefresh > .08) {
        field.illuminate([{ x: hero.x, z: hero.z, radius: 7.2 }, { x: camp.x, z: camp.z, radius: 4.6 }])
        lastRefresh = time
      }
      field.advance(dt); texture.needsUpdate = true
    },
    dispose() { texture.dispose() },
  }
}
