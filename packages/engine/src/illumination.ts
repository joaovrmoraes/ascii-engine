import * as THREE from 'three'
import { createExploration, type LightObstacle } from './exploration'

/** Portable point lights reach every letter technique, not just Three's meshes. */
export const MAX_INK_LIGHTS = 8
export const inkLightsGLSL = `
  uniform int inkLightCount;
  uniform vec4 inkLightPosition[8], inkLightColor[8];
  uniform vec3 atmosphereTint;
  vec3 pointInk(vec3 p) {
    vec3 light = vec3(0.);
    for (int i = 0; i < 8; i++) {
      if (i >= inkLightCount) break;
      float d = distance(p, inkLightPosition[i].xyz);
      float range = inkLightPosition[i].w;
      float falloff = pow(max(0., 1. - d / range), 2.);
      light += inkLightColor[i].rgb * inkLightColor[i].w * falloff / (1. + d * d * .2);
    }
    return light;
  }
`
export function inkLightUniforms() {
  return {
    inkLightCount: { value: 0 },
    atmosphereTint: { value: new THREE.Color(1, 1, 1) },
    inkLightPosition: { value: Array.from({ length: MAX_INK_LIGHTS }, () => new THREE.Vector4()) },
    inkLightColor: { value: Array.from({ length: MAX_INK_LIGHTS }, () => new THREE.Vector4()) },
  }
}

/**
 * Local light shared by the screen pass, carpets and particles (Pomorog
 * `illumination.ts`). Darkness never leaves an overlay exposed.
 * Exterior: moonlight everywhere, lantern and hearth add warmth.
 * Interior (`discoveryEnabled`): what the lantern sees, plus a faint memory.
 */
export const illuminationGLSL = `
  ${inkLightsGLSL}
  uniform sampler2D explorationMap;
  uniform float illuminationEnabled, discoveryEnabled, explorationExtent, lanternPulse, stormFlash;
  uniform vec3 lanternPosition, hearthPosition, inkFogColor;
  uniform float inkFogDensity;
  vec3 inkFog(vec3 ink, vec3 p) {
    float distanceToEye = distance(cameraPosition, p);
    return mix(ink, inkFogColor, 1. - exp(-inkFogDensity * inkFogDensity * distanceToEye * distanceToEye));
  }
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
    ink *= atmosphereTint;
    vec3 point = pointInk(p);
    vec2 discovery = discovered(p), lights = localLights(p);
    if (discoveryEnabled < .5) {
      // Open sky: cool moonlight keeps the whole landscape readable. Lantern
      // and hearth add local warmth, never a circular visibility restriction.
      return inkFog(ink * (vec3(.96,1.02,1.02) + vec3(.22,.16,.07) * lights.x + vec3(.32,.17,.04) * lights.y
        + vec3(2.1,2.35,2.65) * stormFlash + point), p);
    }
    vec3 memory = vec3(.24,.29,.32) * discovery.y * .30;
    vec3 lit = vec3(.64,.69,.76) + vec3(.64,.52,.30) * lights.x + vec3(.75,.42,.16) * lights.y;
    return inkFog(ink * (memory + (lit + point) * sqrt(discovery.x)), p);
  }
`

export type IlluminationUniforms = ReturnType<typeof illuminationUniforms>

/** Far away: a missing lantern or hearth contributes nothing. */
export const ABSENT = new THREE.Vector3(1e4, 0, 1e4)

export function illuminationUniforms() {
  return {
    ...inkLightUniforms(),
    inkFogColor: { value: new THREE.Color() },
    inkFogDensity: { value: 0 },
    explorationMap: { value: null as THREE.Texture | null },
    illuminationEnabled: { value: 0 },
    discoveryEnabled: { value: 0 },
    stormFlash: { value: 0 },
    explorationExtent: { value: 42 },
    lanternPulse: { value: 1 },
    lanternPosition: { value: ABSENT.clone() },
    hearthPosition: { value: ABSENT.clone() },
  }
}

export interface IlluminationOptions {
  /** Interior: discovery by lantern sight. Exterior (default): open moonlight. */
  interior?: boolean
  /** Footprints that block lantern sight in interiors. */
  obstacles?: LightObstacle[]
}

/**
 * One set of uniforms, shared by reference with every material that calls
 * `illuminateInk` (Pomorog assigns the same objects to each pass).
 */
export function createIllumination(options: IlluminationOptions = {}) {
  const interior = !!options.interior
  const field = createExploration(options.obstacles ?? [])
  const texture = new THREE.DataTexture(field.pixels, field.size, field.size, THREE.RGBAFormat)
  texture.minFilter = texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  const uniforms = illuminationUniforms()
  uniforms.explorationMap.value = texture
  uniforms.illuminationEnabled.value = 1
  uniforms.discoveryEnabled.value = interior ? 1 : 0
  uniforms.explorationExtent.value = field.extent
  let lastRefresh = -1
  return {
    uniforms,
    interior,
    sample: interior ? field.sample : () => ({ visible: 1, explored: 1 }),
    /** Lantern and hearth positions; `null` removes one. */
    place(lantern: THREE.Vector3 | null, hearth: THREE.Vector3 | null) {
      uniforms.lanternPosition.value.copy(lantern ?? ABSENT)
      uniforms.hearthPosition.value.copy(hearth ?? ABSENT)
    },
    update(time: number, dt: number) {
      uniforms.lanternPulse.value = 1 + Math.sin(time * 3.7) * 0.035 + Math.sin(time * 7.3) * 0.018
      if (!interior) return
      if (lastRefresh < 0 || time - lastRefresh > 0.08) {
        const lantern = uniforms.lanternPosition.value,
          hearth = uniforms.hearthPosition.value
        field.illuminate([
          { x: lantern.x, z: lantern.z, radius: 7.2 },
          { x: hearth.x, z: hearth.z, radius: 4.6 },
        ])
        lastRefresh = time
      }
      field.advance(dt)
      texture.needsUpdate = true
    },
    dispose() {
      texture.dispose()
    },
  }
}
