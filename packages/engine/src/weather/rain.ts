import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'
import type { Storm } from './storm'

/**
 * Rain (Pomorog `rain.ts` + `rainStreaks.ts`): fine 1 px strokes following the
 * 3D fall vector (glyphs read as snow), occluded by world depth, and the
 * lightning bolt as broken ASCII strokes. Drops are deterministic per index,
 * so splashes land exactly where a streak reaches the surface.
 */
const fract = (value: number) => value - Math.floor(value)
const hash = (value: number) => fract(Math.sin(value * 127.1 + 19.7) * 43758.5453)

export function rainDrop(index: number, time: number, span = 26) {
  const phase = fract(time * (1.1 + hash(index) * 0.35) + hash(index + 2000))
  const x = -span / 2 + hash(index * 3 + 1) * span,
    z = -span / 2 + hash(index * 3 + 2) * span
  return { phase, x: x + phase * 0.75, z: z + phase * 0.25, impactX: x + 0.75, impactZ: z + 0.25 }
}

/** Fine '/' strokes along the fall vector; width stays one pixel. */
export function createRainStreaks(capacity: number) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(capacity * 4 * 3),
    alphas = new Float32Array(capacity * 4)
  const position = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  const opacity = new THREE.BufferAttribute(alphas, 1).setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', position)
  geometry.setAttribute('opacity', opacity)
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    depthWrite: false,
    uniforms: {
      brightness: { value: 1 },
      color: { value: new THREE.Color(0.68, 0.78, 0.84) },
      worldDepth: { value: null },
      depthSize: { value: new THREE.Vector2(1, 1) },
      useWorldDepth: { value: 0 },
    },
    vertexShader: `attribute float opacity; varying float alpha;
      void main() { alpha=opacity; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform sampler2D worldDepth; uniform vec2 depthSize; uniform vec3 color;
      uniform float brightness,useWorldDepth; varying float alpha;
      void main() {
        if(useWorldDepth>.5 && gl_FragCoord.z>texture2D(worldDepth,gl_FragCoord.xy/depthSize).r+.00035)discard;
        vec3 ink=color*brightness;
        gl_FragColor=vec4(ink/(vec3(1.)+ink*.32),alpha);
      }`,
  })
  const mesh = new THREE.LineSegments(geometry, material)
  mesh.frustumCulled = false
  let vertices = 0
  function point(x: number, y: number, z: number, value: number) {
    const offset = vertices * 3
    positions[offset] = x
    positions[offset + 1] = y
    positions[offset + 2] = z
    alphas[vertices++] = value
  }
  return {
    mesh,
    material,
    occludeWith(texture: THREE.DepthTexture, width: number, height: number) {
      material.depthTest = false
      material.uniforms.worldDepth.value = texture
      material.uniforms.depthSize.value.set(width, height)
      material.uniforms.useWorldDepth.value = 1
    },
    clear() {
      vertices = 0
    },
    push(x: number, y: number, z: number, length: number, alpha: number) {
      if (vertices + 4 > alphas.length) return
      // Tail against velocity (.75, -6.5, .25), with a tiny gap between strokes.
      const dx = (-0.75 / 6.5) * length,
        dz = (-0.25 / 6.5) * length
      point(x, y, z, alpha)
      point(x + dx * 0.54, y + length * 0.54, z + dz * 0.54, alpha * 0.7)
      point(x + dx * 0.63, y + length * 0.63, z + dz * 0.63, alpha * 0.6)
      point(x + dx, y + length, z + dz, alpha * 0.1)
    },
    commit(brightness: number) {
      geometry.setDrawRange(0, vertices)
      position.needsUpdate = opacity.needsUpdate = true
      material.uniforms.brightness.value = brightness
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
export type RainStreaks = ReturnType<typeof createRainStreaks>

export interface RainOptions {
  count?: number
  /** Side of the square where drops fall (m, centred on the origin, Pomorog 26). */
  span?: number
  /** Only drops within this distance of `center` are drawn. */
  radius?: number
  /** Fall height above the water level. */
  height?: number
}

/** Rain belongs to world space, so rotating the camera preserves its depth. */
export function createRain(streaks: RainStreaks, bolts: GlyphCloud, options: RainOptions = {}) {
  const count = options.count ?? 800,
    span = options.span ?? 26,
    radius = options.radius ?? 10,
    fall = options.height ?? 6.5
  let strikeId = -1
  const strike = new THREE.Vector3(),
    view = new THREE.Vector3()
  return {
    count,
    span,
    drop: (index: number, time: number) => rainDrop(index, time, span),
    /** `intensity` 0–1 (Pomorog: .65 + .35 × shower); call between clear and render. */
    update(
      time: number,
      camera: THREE.Camera,
      center: THREE.Vector3,
      level: number,
      intensity: number,
      storm?: Storm,
    ) {
      camera.getWorldDirection(view)
      let visible = 0
      if (storm && storm.id !== strikeId) {
        strikeId = storm.id
        strike.set(center.x + storm.side * 2.8, level, center.z - 3.2)
      }
      for (let i = 0; i < count; i++) {
        const { x, z, phase } = rainDrop(i, time, span)
        if (Math.hypot(x - center.x, z - center.z) > radius) continue
        const y = level + (1 - phase) * fall
        // Near drops carry longer, lighter strokes. Distant rain stays fine.
        const depth = (x - center.x) * view.x + (y - 1) * view.y + (z - center.z) * view.z
        const near = THREE.MathUtils.clamp((2 - depth) / 7, 0, 1)
        const length = 0.23 + near * 0.15 + hash(i + 4000) * 0.06
        const besideHero = Math.hypot(x - center.x, z - center.z) < 0.65 && y < 2.35
        const alpha = (besideHero ? 0.34 : 0.7 + near * 0.15) * Math.min(1, phase * 10) * intensity
        streaks.push(x, y, z, length, alpha)
        visible++
      }
      if (storm && storm.bolt > 0) {
        // Broken ASCII strokes descend through the world, with a fork halfway up.
        for (let i = 0; i < 40; i++) {
          const h = i * 0.16,
            bend = Math.sin(i * 0.63 + storm.id) * 0.19 + Math.sin(i * 0.19) * 0.32
          bolts.push(
            strike.x + bend,
            strike.y + h,
            strike.z,
            0.23,
            i % 3 === 0 ? '|' : i % 3 === 1 ? '/' : '\\',
            [1.8, 2, 2.4],
            storm.bolt,
          )
          if (i > 18 && i < 31)
            bolts.push(
              strike.x + bend + (i - 18) * 0.095,
              strike.y + h,
              strike.z + 0.15,
              0.18,
              '/',
              [1.1, 1.4, 1.9],
              storm.bolt * 0.65,
            )
        }
      }
      return visible
    },
  }
}
