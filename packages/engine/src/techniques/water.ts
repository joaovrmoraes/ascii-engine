import * as THREE from 'three'
import { surfaceAlpha } from '../surface'
import { surfaceAtlas, SURFACE_RANGES } from './surface'

/**
 * Technique `water` as a component (§3.2), from Pomorog `worldGlyph.ts →
 * worldWaterGLSL`, `waterReflection.ts` and `forestWorld.ts → waterEdge`.
 * Every cell is one letter of one flat colour on a black gap: the mirrored
 * world turned into letters, foam, sparse drifting rows of ~ - =.
 */

/** Outline of a water body. `stream`: meandering band; `pond`: organic lake. */
export interface WaterShape {
  kind: 'stream' | 'pond'
  x: number
  z: number
  /** Stream direction / pond outline phase, radians. */
  angle: number
  /** Stream half width, or pond radius (m). */
  size: number
}

/** Packed as the GLSL `vec4(x, z, angle, w)`: `w > 0` stream half width, `w < 0` pond radius. */
export function waterVec4(shape: WaterShape, out = new THREE.Vector4()) {
  return out.set(shape.x, shape.z, shape.angle, shape.kind === 'stream' ? shape.size : -shape.size)
}

/** > 0 inside the water (metres to the edge, roughly). Mirrors `waterEdgeGLSL`. */
export function waterEdge(shape: WaterShape, x: number, z: number) {
  const dx = x - shape.x, dz = z - shape.z, a0 = shape.angle
  if (shape.kind === 'stream') {
    const along = Math.cos(a0) * dx + Math.sin(a0) * dz
    if (Math.abs(along) > 17) return -9
    const across = -Math.sin(a0) * dx + Math.cos(a0) * dz - Math.sin(along * .29 + a0 * 7) * 2.3 - Math.sin(along * .83 + 1) * .5
    const pool = Math.max(0, Math.sin(along * .23 + a0 * 3)) ** 3 * 2.2
    return shape.size * (1 + .45 * Math.sin(along * .47 + 1.7)) + pool - Math.abs(across)
  }
  const a = Math.atan2(dz, dx)
  const r = shape.size * (1 + .2 * Math.sin(a * 3 + a0 * 5) + .1 * Math.sin(a * 5 + a0 * 11) + .05 * Math.sin(a * 9 + a0))
  return r - Math.hypot(dx, dz * 1.2)
}

/** Shared by water, ground and carpet so every bank agrees (change JS and GLSL together). */
export const waterEdgeGLSL = `
  // Water features: w > 0 a meandering stream (centre, angle, half width);
  // w < 0 an organic pond (radius -w). Returns > 0 inside the water.
  float waterEdge(vec2 p, vec4 s) {
    vec2 d = p - s.xy;
    if (s.w > 0.) {
      vec2 dir = vec2(cos(s.z), sin(s.z));
      float along = dot(d, dir);
      if (abs(along) > 17.) return -9.;
      float across = dot(d, vec2(-dir.y, dir.x)) - sin(along * .29 + s.z * 7.) * 2.3 - sin(along * .83 + 1.) * .5;
      float pool = pow(max(0., sin(along * .23 + s.z * 3.)), 3.) * 2.2;
      return s.w * (1. + .45 * sin(along * .47 + 1.7)) + pool - abs(across);
    }
    float a = atan(d.y, d.x);
    float r = -s.w * (1. + .2 * sin(a * 3. + s.z * 5.) + .1 * sin(a * 5. + s.z * 11.) + .05 * sin(a * 9. + s.z));
    return r - length(d * vec2(1., 1.2));
  }
`

type RGB = [number, number, number]
/** Look of the water letters. Defaults: Pomorog forest (lakes and streams). */
export interface WaterLook {
  /** Cell on the water plane (m). */
  cell: [number, number]
  /** Flow speed along a stream; ponds drift by `pondDrift`. */
  flow: number
  pondDrift: [number, number]
  /** Open water rows: base colour and moon sheen. */
  open: RGB
  sheen: RGB
  /** Fraction of empty cells: `grain < sparse + swell × sparse`. */
  sparse: number
  foam: RGB
  /** Foam band width at the bank (m) and its strength. */
  bank: number
  reflection: {
    enabled: boolean
    /** Minimum luminance for a mirrored cell to become a letter. */
    threshold: number
    /** One empty row in every `rows`. */
    rows: number
    tint: RGB
  }
}

export const FOREST_WATER: WaterLook = {
  cell: [.15, .19], flow: .35, pondDrift: [.02, .015],
  open: [.07, .17, .22], sheen: [.12, .16, .18], sparse: .22,
  foam: [.32, .52, .62], bank: .25,
  reflection: { enabled: true, threshold: .05, rows: 4, tint: [.85, .97, 1.1] },
}

const f = (v: number) => v.toFixed(4)
const v3 = (c: RGB) => `vec3(${f(c[0])}, ${f(c[1])}, ${f(c[2])})`

/** `waterLetters(p, time, crest, flow, vegetation, weed)` for a look. */
export function waterLettersGLSL(look: WaterLook = FOREST_WATER) {
  const texture = surfaceAtlas(), slot = (texture.userData.slot as number).toFixed(6)
  const [ws, wc] = SURFACE_RANGES.water, [cs, cc] = SURFACE_RANGES.crest, [rs, rc] = SURFACE_RANGES.actor, [gs, gc] = SURFACE_RANGES.wetgrass
  const r = look.reflection
  return `
    uniform sampler2D glyphAtlas, reflection;
    uniform mat4 reflectionMatrix;
    uniform float reflectionOn;
    float waterHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float waterGlyph(float index, vec2 inside) {
      return smoothstep(.1, .45, texture2D(glyphAtlas, vec2((index + .08 + inside.x * .84) * ${slot}, .06 + inside.y * .88)).r);
    }
    // Pure ASCII water: every cell is one letter of one flat colour on a dark
    // gap. The mirror is sampled once per cell (at its centre) and turned into
    // a letter, so reflections are characters, never a continuous image.
    vec3 waterLetters(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed) {
      vec2 cell = vec2(${f(look.cell[0])}, ${f(look.cell[1])});
      vec2 plane = p.xz - flow * time;
      vec2 grid = floor(plane / cell), inside = fract(plane / cell);
      float grain = waterHash(grid);
      vec3 centre = vec3((grid + .5) * cell + flow * time, p.y).xzy;
      centre.x += sin(grid.y * .7 + time * 1.2) * .05;
      vec4 mirror = reflectionMatrix * vec4(centre, 1.);
      vec2 uv = mirror.xy / mirror.w;
      // The mirror trembles row by row, like a reflection on moving water.
      uv.x += sin(grid.y * 1.3 + time * 2.1) * .006 + sin(grid.y * .41 - time * .9) * .004;
      vec4 seen = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
      float object = (1. - step(.96, seen.a)) * step(.0, min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y))) * reflectionOn;
      vec3 shown = pow(max(seen.rgb, vec3(0.)), vec3(.4545));
      float lum = dot(shown, vec3(.2126, .7152, .0722));
      vec3 gap = vec3(0.);
      // Reflection: drop rows so it reads as a broken mirror on water.
      float row = step(.26, fract(grid.y / ${f(r.rows)}));
      if (object > .5 && lum > ${f(r.threshold)} && row > .5) {
        float level = clamp(lum * 1.4, 0., .999);
        vec3 hue = shown / max(lum, .01);
        vec3 ink = pow(hue * (.3 + level * .65), vec3(2.2)) * ${v3(r.tint)};
        return mix(gap, ink, waterGlyph(${rs}.0 + 1. + floor(level * ${rc - 1}.0), inside));
      }
      // Foam letters where waves break or boots disturb the surface.
      if (crest > .12 && grain < crest * 1.4) {
        float level = clamp(crest * 1.5 + grain * .3, 0., .999);
        return mix(gap, ${v3(look.foam)} * (.4 + crest), waterGlyph(${cs}.0 + 1. + floor(level * ${cc - 1}.0), inside));
      }
      // Submerged weed as sparse green strokes.
      if (vegetation > .3 && grain > .55) {
        return mix(gap, weed, waterGlyph(${gs}.0 + 1. + floor(grain * ${gc - 1}.0), inside) * .8);
      }
      // Open water: sparse rows of ~ - = drifting with the current.
      float swell = .5 + .5 * sin(grid.y * .9 + grid.x * .15 - time * 1.4 + grain * 2.);
      if (grain < ${f(look.sparse)} + swell * ${f(look.sparse)}) return gap;
      float level = clamp(swell * .75 + grain * .3, 0., .999);
      // Moon sheen drifts across the surface in slow bands.
      float sheen = pow(.5 + .5 * sin(grid.x * .23 - grid.y * .31 + time * .5), 6.);
      vec3 ink = ${v3(look.open)} * (.6 + level * 1.2) + ${v3(look.sheen)} * sheen;
      return mix(gap, ink, waterGlyph(${ws}.0 + 1. + floor(level * ${wc - 1}.0), inside));
    }`
}

const reflectionBias = new THREE.Matrix4().set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1)
const waterNormal = new THREE.Vector3(0, 1, 0)
const eye = new THREE.Vector3(), look = new THREE.Vector3(), up = new THREE.Vector3()

/** Reflect the view across the water level, including orbit, pan and zoom. */
export function updateReflectionCamera(camera: THREE.OrthographicCamera, mirror: THREE.OrthographicCamera, level: number, matrix: THREE.Matrix4) {
  camera.updateMatrixWorld()
  camera.getWorldPosition(eye)
  camera.getWorldDirection(look).add(eye)
  up.set(0, 1, 0).applyQuaternion(camera.getWorldQuaternion(mirror.quaternion)).reflect(waterNormal)
  mirror.copy(camera)
  mirror.position.copy(eye); mirror.position.y = level * 2 - eye.y
  look.y = level * 2 - look.y
  mirror.up.copy(up); mirror.lookAt(look); mirror.updateMatrixWorld()
  matrix.copy(reflectionBias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse)
}

/** A real mirrored world (640² target), sampled per cell by the water letters. */
export function createWaterReflection(surface: THREE.Mesh, uniforms: { reflection: THREE.IUniform; reflectionMatrix: THREE.IUniform }, size = 640) {
  const target = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter })
  const mirror = new THREE.OrthographicCamera()
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  uniforms.reflection.value = target.texture
  return {
    render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.OrthographicCamera) {
      surface.updateWorldMatrix(true, false)
      const level = surface.getWorldPosition(eye).y
      updateReflectionCamera(camera, mirror, level, uniforms.reflectionMatrix.value)
      const previous = renderer.getRenderTarget(), clipping = renderer.clippingPlanes, shadow = renderer.shadowMap.autoUpdate
      const visible = surface.visible
      // Reuse a standing plane when the renderer keeps one (the engine does):
      // changing the number of planes re-resolves every material's program.
      const standing = clipping.length === 1 ? clipping[0] : undefined
      const saved = standing?.clone()
      if (standing) standing.set(clip.normal, -level); else { clip.constant = -level; renderer.clippingPlanes = [clip] }
      surface.visible = false; renderer.shadowMap.autoUpdate = false
      try { renderer.setRenderTarget(target); renderer.render(scene, mirror) }
      finally {
        renderer.setRenderTarget(previous)
        if (standing && saved) standing.copy(saved); else renderer.clippingPlanes = clipping
        renderer.shadowMap.autoUpdate = shadow; surface.visible = visible
      }
    },
    dispose() { target.dispose() },
  }
}

export interface WaterOptions {
  look?: Partial<WaterLook>
  /** Height of the surface (Pomorog: .018). */
  level?: number
  /**
   * Custom outline instead of `shape`: GLSL body returning `float inside` (> 0
   * in the water) from `vec3 p`; used by canals and flooded aisles.
   */
  edgeGLSL?: string
  /** Plane size (m); by default it covers the shape. */
  size?: number
}

/** One water body: add `water.mesh` with `{ glyph: 'water' }`. */
export function createWater(shape: WaterShape, options: WaterOptions = {}) {
  const look: WaterLook = { ...FOREST_WATER, ...options.look, reflection: { ...FOREST_WATER.reflection, ...options.look?.reflection } }
  const uniforms = {
    time: { value: 0 }, centre: { value: waterVec4(shape) },
    reflection: { value: null as THREE.Texture | null }, reflectionMatrix: { value: new THREE.Matrix4() },
    reflectionOn: { value: look.reflection.enabled ? 1 : 0 }, glyphAtlas: { value: surfaceAtlas() },
  }
  const flow = shape.kind === 'stream'
    ? `vec2(cos(centre.z), sin(centre.z)) * ${f(look.flow)}`
    : `vec2(${f(look.pondDrift[0])}, ${f(look.pondDrift[1])})`
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec3 p;
      void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `varying vec3 p; uniform float time; uniform vec4 centre;
      ${waterEdgeGLSL}
      ${waterLettersGLSL(look)}
      void main(){
        ${options.edgeGLSL ?? 'float inside=waterEdge(p.xz,centre);'}
        if(inside<0.)discard;
        float edge=1.-smoothstep(0.,${f(look.bank)},inside);
        gl_FragColor=vec4(waterLetters(p,time,edge*.75,${flow},0.,vec3(0.)),${surfaceAlpha('glyph')});
      }`,
  })
  const size = options.size ?? (shape.kind === 'stream' ? 38 : shape.size * 2.8 + 2)
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material)
  mesh.rotation.x = -Math.PI / 2; mesh.position.set(shape.x, options.level ?? .018, shape.z)
  mesh.userData.glyph = 'water'
  const reflection = createWaterReflection(mesh, uniforms)
  return {
    mesh, material, shape, look, reflection, uniforms,
    /** Distance (m) from a point to this water, 0 inside. */
    distance(x: number, z: number) { return Math.max(0, -waterEdge(shape, x, z)) },
    dispose() { reflection.dispose(); material.dispose(); mesh.geometry.dispose() },
  }
}

export type Water = ReturnType<typeof createWater>
