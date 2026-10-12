import * as THREE from 'three'
import { waterMaskEdge, type WaterMask } from '../world/waterPaint'
import { surfaceAlpha } from '../surface'
import { surfaceAtlas, SURFACE_RANGES } from './surface'
import { createWaterDynamics, DEFAULT_WATER_PHYSICS, type WaterPhysics } from '../world/waterDynamics'

/**
 * Technique `water` as a component (§3.2), from Pomorog `worldGlyph.ts →
 * worldWaterGLSL`, `waterReflection.ts` and `forestWorld.ts → waterEdge`.
 * Every cell is one letter of one flat colour on a black gap: the mirrored
 * world turned into letters, foam, sparse drifting rows of ~ - =.
 */

/** Outline of a water body. `stream`: meandering band; `pond`: organic lake. */
export interface WaterShape {
  kind: 'stream' | 'pond' | 'paint'
  /** Freehand water: signed distance samples, square width = 2 × size. */
  mask?: WaterMask
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
  if (shape.kind === 'paint') return waterMaskEdge(shape, x, z)
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
export function waterLettersGLSL(look: WaterLook = FOREST_WATER, followSlope = false) {
  const texture = surfaceAtlas(), slot = (texture.userData.slot as number).toFixed(6)
  const [ws, wc] = SURFACE_RANGES.water, [cs, cc] = SURFACE_RANGES.crest, [rs, rc] = SURFACE_RANGES.actor, [gs, gc] = SURFACE_RANGES.wetgrass
  const r = look.reflection
  return `
    uniform sampler2D glyphAtlas, reflection;
    uniform mat4 reflectionMatrix;
    uniform float reflectionOn;
    uniform vec3 waterViewDirection, waterLightDirection, waterLightColor;
    uniform float waterLightPower, waterReflectionLevel;
    float waterHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float waterGlyph(float index, vec2 inside) {
      return smoothstep(.1, .45, texture2D(glyphAtlas, vec2((index + .08 + inside.x * .84) * ${slot}, .06 + inside.y * .88)).r);
    }
    // Pure ASCII water: every cell is one letter of one flat colour on a dark
    // gap. The mirror is sampled once per cell (at its centre) and turned into
    // a letter, so reflections are characters, never a continuous image.
    vec3 waterLettersNormal(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed, vec3 normal) {
      vec2 cell = vec2(${f(look.cell[0])}, ${f(look.cell[1])});
      vec2 plane = p.xz ${followSlope ? '' : '- flow * time'};
      vec2 drift = flow;
      ${followSlope ? 'if (normal.y < .6) { bool side = abs(normal.x) > abs(normal.z); plane = side ? p.zy : p.xy; drift = vec2(side ? flow.y : flow.x, -length(flow)); }' : ''}
      vec2 grid = floor(plane / cell), inside = fract(plane / cell);
      float grain = waterHash(grid);
      vec3 centre = vec3((grid + .5) * cell ${followSlope ? '' : '+ flow * time'}, p.y).xzy;
      centre.x += sin(grid.y * .7 + time * 1.2) * .05;
      vec4 mirror = reflectionMatrix * vec4(centre, 1.);
      vec2 uv = mirror.xy / mirror.w;
      // The mirror trembles row by row, like a reflection on moving water.
      uv.x += sin(grid.y * 1.3 + time * 2.1) * .002 + sin(grid.y * .41 - time * .9) * .001;
      vec4 seen = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
      float object = (1. - step(.96, seen.a)) * step(.0, min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y))) * reflectionOn;
      // A horizontal mirror cannot describe the side of a waterfall. Keep it
      // on the calm level; sloping water reflects directional light below.
      ${followSlope ? 'object *= smoothstep(.85,.98,normal.y) * (1.-smoothstep(.12,.35,abs(p.y-waterReflectionLevel)));' : ''}
      vec3 shown = pow(max(seen.rgb, vec3(0.)), vec3(.4545));
      float lum = dot(shown, vec3(.2126, .7152, .0722));
      vec3 gap = vec3(0.);
      // Reflection: drop rows so it reads as a broken mirror on water.
      float row = step(.5, mod(grid.y, ${f(r.rows)}));
      if (object > .5 && lum > ${f(r.threshold)} && row > .5) {
        float level = clamp(lum * 1.4, 0., .999);
        vec3 hue = shown / max(lum, .01);
        float fresnel = pow(1.-max(0.,dot(normal,waterViewDirection)),3.);
        vec3 ink = pow(hue * (.42 + level * .8), vec3(2.2)) * ${v3(r.tint)} * (1.+fresnel*.5);
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
      float swell = .5 + .5 * sin(${followSlope ? 'dot(grid, normalize(drift + vec2(.00001))) * .9 - time * (1.4 + length(drift) * 2.)' : 'grid.y * .9 + grid.x * .15 - time * 1.4'} + grain * 2.);
      if (grain < ${f(look.sparse)} + swell * ${f(look.sparse)}) return gap;
      float level = clamp(swell * .75 + grain * .3, 0., .999);
      // Moon sheen drifts across the surface in slow bands.
      vec3 waveNormal = normalize(normal + vec3(sin(centre.z*2.3+time*1.7)*.1,0.,cos(centre.x*1.9-time*1.2)*.12));
      vec3 reflected = reflect(-waterLightDirection, waveNormal);
      float alignment = max(0.,dot(reflected,waterViewDirection));
      float sheen = (pow(alignment,32.)*.7 + pow(alignment,180.)*1.8) * waterLightPower * reflectionOn * max(0.,waterLightDirection.y);
      vec3 ink = ${v3(look.open)} * (.6 + level * 1.2) + waterLightColor * ${v3(look.sheen)} * sheen * 5.;
      return mix(gap, ink, waterGlyph(${ws}.0 + 1. + floor(level * ${wc - 1}.0), inside));
    }
    vec3 waterLetters(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed) { return waterLettersNormal(p,time,crest,flow,vegetation,weed,vec3(0.,1.,0.)); }`
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
  const materials = new Map<THREE.Material, THREE.Material>()
  function mirrorMaterial(original: THREE.Material) {
    let material = materials.get(original)
    if (!material) {
      material = original.clone()
      const compile = original.onBeforeCompile
      material.onBeforeCompile = function(shader, renderer) {
        compile.call(this, shader, renderer)
        shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a = .85;')
      }
      material.customProgramCacheKey = () => `water-source-${original.customProgramCacheKey()}`
      material.colorWrite = true; material.depthWrite = true
      materials.set(original, material)
    }
    return material
  }
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  uniforms.reflection.value = target.texture
  return {
    render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.OrthographicCamera) {
      uniforms.reflection.value = target.texture
      surface.updateWorldMatrix(true, false)
      const level = surface.userData.waterReflectionLevel ?? surface.getWorldPosition(eye).y
      updateReflectionCamera(camera, mirror, level, uniforms.reflectionMatrix.value)
      const previous = renderer.getRenderTarget(), clipping = renderer.clippingPlanes, shadow = renderer.shadowMap.autoUpdate
      const visible = surface.visible
      // Reuse a standing plane when the renderer keeps one (the engine does):
      // changing the number of planes re-resolves every material's program.
      const standing = clipping.length === 1 ? clipping[0] : undefined
      const saved = standing?.clone()
      if (standing) standing.set(clip.normal, -level); else { clip.constant = -level; renderer.clippingPlanes = [clip] }
      surface.visible = false; renderer.shadowMap.autoUpdate = false
      // Capture the lit shapes before glyph conversion. Sampling sparse glyphs
      // and converting them again erased almost the entire reflected object.
      // Only this offscreen source is solid; water still emits broken glyph rows.
      const swapped: [THREE.Mesh, THREE.Material | THREE.Material[]][] = [], hidden: THREE.Object3D[] = []
      scene.traverseVisible(node => {
        if (node.userData.glyphBodyOf || node.userData.glyph === 'water') { hidden.push(node); node.visible = false; return }
        if (!(node instanceof THREE.Mesh)) return
        const original = node.userData.glyphBodyMaterial ?? node.userData.asciiOriginal
        if (!original) return
        swapped.push([node, node.material])
        node.material = Array.isArray(original) ? original.map(mirrorMaterial) : mirrorMaterial(original)
      })
      try { renderer.setRenderTarget(target); renderer.render(scene, mirror) }
      finally {
        for (const [mesh, material] of swapped) mesh.material = material
        for (const node of hidden) node.visible = true
        renderer.setRenderTarget(previous)
        if (standing && saved) standing.copy(saved); else renderer.clippingPlanes = clipping
        renderer.shadowMap.autoUpdate = shadow; surface.visible = visible
      }
    },
    dispose() { materials.forEach(material => material.dispose()); materials.clear(); target.dispose() },
  }
}

export interface WaterOptions {
  look?: Partial<WaterLook>
  physics?: Partial<WaterPhysics>
  /** Height of the surface (Pomorog: .018). */
  level?: number
  /**
   * Custom outline instead of `shape`: GLSL statements that set `float inside`
   * (> 0 in the water) from `vec3 p`; used by canals and flooded aisles.
   * Give `distance` too, so the engine picks the nearest mirror.
   */
  edgeGLSL?: string
  /** GLSL expression for the foam/crest strength (default `edge * .75`). */
  crestGLSL?: string
  /** Flow on the plane (m/s); default: along a stream, slow drift on a pond. */
  flow?: [number, number]
  distance?: (x: number, z: number) => number
  /** Plane size (m); by default it covers the shape. */
  size?: number
}

/** One water body: add `water.mesh` with `{ glyph: 'water' }`. */
export function createWater(shape: WaterShape, options: WaterOptions = {}) {
  const look: WaterLook = { ...FOREST_WATER, ...options.look, reflection: { ...FOREST_WATER.reflection, ...options.look?.reflection } }
  const mask = shape.kind === 'paint' ? shape.mask : undefined
  const physics = { ...DEFAULT_WATER_PHYSICS, enabled: !options.edgeGLSL || !!options.distance, ...options.physics }
  const size = mask ? shape.size * 2 : options.size ?? (shape.kind === 'stream' ? 38 : shape.size * 2.8 + 2)
  const resolution = mask?.resolution ?? Math.max(9, Math.min(129, Math.ceil(size / .22) + 1))
  const dynamicResolution = Math.min(129, resolution), data = new Float32Array(dynamicResolution ** 2 * 4)
  const dynamicsTexture = new THREE.DataTexture(data, dynamicResolution, dynamicResolution, THREE.RGBAFormat, THREE.FloatType)
  dynamicsTexture.minFilter = dynamicsTexture.magFilter = THREE.LinearFilter
  let dynamics: ReturnType<typeof createWaterDynamics>
  const contacts = new Map<string, THREE.Vector3>()
  const maskTexture = mask ? new THREE.DataTexture(new Float32Array(mask.values), mask.resolution, mask.resolution, THREE.RedFormat, THREE.FloatType) : undefined
  if (maskTexture) { maskTexture.minFilter = maskTexture.magFilter = THREE.NearestFilter; maskTexture.needsUpdate = true }
  const uniforms = {
    waterMask: { value: maskTexture ?? null }, maskResolution: { value: mask?.resolution ?? 1 },
    time: { value: 0 }, centre: { value: waterVec4(shape) },
    reflection: { value: null as THREE.Texture | null }, reflectionMatrix: { value: new THREE.Matrix4() },
    reflectionOn: { value: look.reflection.enabled ? 1 : 0 }, glyphAtlas: { value: surfaceAtlas() },
    waterViewDirection: { value: new THREE.Vector3(0,1,0) }, waterLightDirection: { value: new THREE.Vector3(-5,12,7).normalize() },
    waterLightColor: { value: new THREE.Color(0xe0e7cc) }, waterLightPower: { value: 1 }, waterReflectionLevel: { value: options.level ?? .018 },
    waterDynamics: { value: dynamicsTexture }, dynamicsSize: { value: size }, dynamicsOn: { value: physics.enabled ? 1 : 0 },
  }
  const flow = options.flow ? `vec2(${f(options.flow[0])}, ${f(options.flow[1])})` : shape.kind === 'stream'
    ? `vec2(cos(centre.z), sin(centre.z)) * ${f(look.flow)}`
    : `vec2(${f(look.pondDrift[0])}, ${f(look.pondDrift[1])})`
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec3 p; varying vec3 waterNormalWorld;
      void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;waterNormalWorld=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `varying vec3 p; varying vec3 waterNormalWorld; uniform float time; uniform vec4 centre;
      uniform sampler2D waterDynamics; uniform float dynamicsSize, dynamicsOn;
      ${waterEdgeGLSL}
      ${mask ? `
      uniform sampler2D waterMask; uniform float maskResolution;
      float paintedEdge(vec2 point) {
        vec2 d = point - centre.xy;
        vec2 uv = vec2(cos(centre.z)*d.x + sin(centre.z)*d.y, -sin(centre.z)*d.x + cos(centre.z)*d.y) / (-centre.w * 2.) + .5;
        if (min(uv.x,uv.y)<0. || max(uv.x,uv.y)>1.) return -1.;
        vec2 grid = uv * (maskResolution - 1.), base = min(floor(grid), vec2(maskResolution - 2.)), t = grid - base;
        vec2 texel = (base + .5) / maskResolution; float step = 1. / maskResolution;
        float a = texture2D(waterMask, texel).r, b = texture2D(waterMask, texel + vec2(step,0.)).r;
        float c = texture2D(waterMask, texel + vec2(0.,step)).r, d1 = texture2D(waterMask, texel + vec2(step)).r;
        return mix(mix(a,b,t.x),mix(c,d1,t.x),t.y);
      }` : ''}
      ${waterLettersGLSL(look, !!mask?.heights)}
      void main(){
        ${options.edgeGLSL ?? (mask ? 'float inside=paintedEdge(p.xz);' : 'float inside=waterEdge(p.xz,centre);')}
        if(inside<0.)discard;
        float edge=1.-smoothstep(0.,${f(look.bank)},inside);
        vec2 current = ${flow};
        ${mask?.heights ? `float slope=length(waterNormalWorld.xz); if(slope>.02) current=normalize(waterNormalWorld.xz)*(${f(look.flow)} + slope*.8);` : ''}
        vec2 d=p.xz-centre.xy;
        vec2 local=vec2(cos(centre.z)*d.x+sin(centre.z)*d.y,-sin(centre.z)*d.x+cos(centre.z)*d.y);
        vec4 dynamics=texture2D(waterDynamics,local/dynamicsSize+.5);
        if(dynamicsOn>.5 && dynamics.z<.002) discard;
        current += dynamics.xy * dynamicsOn;
        float turbulence = dynamics.w * dynamicsOn;
        gl_FragColor=vec4(waterLettersNormal(p,time,max(${options.crestGLSL ?? 'edge*.75'},turbulence),current,0.,vec3(0.),normalize(waterNormalWorld)),${surfaceAlpha('glyph')});
      }`,
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1)
  geometry.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.y = -shape.angle
  mesh.position.set(shape.x, options.level ?? .018, shape.z)
  mesh.userData.glyph = 'water'
  const base = new Float32Array(resolution ** 2)
  function localOf(x: number, z: number) { const dx = x - shape.x, dz = z - shape.z, c = Math.cos(shape.angle), s = Math.sin(shape.angle); return [c*dx+s*dz, -s*dx+c*dz] }
  function upload(time: number) {
    const n = dynamicResolution, c = Math.cos(shape.angle), s = Math.sin(shape.angle)
    for (let i = 0; i < n*n; i++) {
      const x = i%n, z = Math.floor(i/n), h = dynamics.depth[i]
      const vx = (dynamics.flowX[i] + (x ? dynamics.flowX[i-1] : 0)) / Math.max(.015, 2*h)
      const vz = (dynamics.flowZ[i] + (z ? dynamics.flowZ[i-n] : 0)) / Math.max(.015, 2*h)
      data[i*4] = c*vx-s*vz; data[i*4+1] = s*vx+c*vz; data[i*4+2] = h
      data[i*4+3] = Math.min(.8, Math.hypot(vx,vz)*.14 + Math.abs(h-physics.depth)*1.4)
    }
    dynamicsTexture.needsUpdate = true
    const position = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), z = position.getZ(i), h = dynamics.sample(dynamics.depth, x, z)
      const wave = Math.sin(x*2.3+time*1.7)*Math.cos(z*1.9-time*1.2)*Math.min(physics.waves,h*.15)
      position.setY(i, base[i] + (physics.enabled ? h - (mask?.heights ? .045 : physics.depth) + wave : 0))
    }
    position.needsUpdate = true; geometry.computeVertexNormals(); geometry.computeBoundingSphere(); geometry.computeBoundingBox()
  }
  function refresh() {
    if (mask && maskTexture) { (maskTexture.image.data as Float32Array).set(mask.values); maskTexture.needsUpdate = true }
    const n = dynamicResolution, bed = new Float32Array(n*n), wet = new Uint8Array(n*n), c = Math.cos(shape.angle), s = Math.sin(shape.angle)
    for (let i = 0; i < n*n; i++) {
      const x = (i%n/(n-1)-.5)*size, z = (Math.floor(i/n)/(n-1)-.5)*size
      const wx = shape.x+c*x-s*z, wz = shape.z+s*x+c*z
      wet[i] = (options.edgeGLSL && options.distance ? options.distance(wx,wz) <= 0 : waterEdge(shape,wx,wz) >= 0) ? 1 : 0
      bed[i] = mask?.heights ? waterMaskEdge(shape,wx,wz,mask.heights)-.045 : -physics.depth
    }
    for (let i = 0; i < base.length; i++) base[i] = mask?.heights?.[i] ?? 0
    dynamics = createWaterDynamics(n,size,bed,wet,physics); contacts.clear(); upload(0)
  }
  refresh()
  const reflection = createWaterReflection(mesh, uniforms)
  return {
    mesh, material, shape, look, reflection, uniforms, physics,
    get dynamics() { return dynamics },
    updateDynamics(dt: number, time: number) { if (physics.enabled && dt > 0) { dynamics.step(dt); upload(time) } },
    heightAt(x: number, z: number) {
      const [lx,lz] = localOf(x,z)
      return mesh.position.y + (physics.enabled ? dynamics.sample(dynamics.bed,lx,lz) + dynamics.sample(dynamics.depth,lx,lz) : mask?.heights ? waterMaskEdge(shape,x,z,mask.heights) : 0)
    },
    disturb(x: number, z: number, strength = .18, radius = .6) { if ((options.distance ? options.distance(x,z)>0 : waterEdge(shape,x,z)<0) || !physics.enabled) return; const [lx,lz] = localOf(x,z); dynamics.disturb(lx,lz,strength,radius) },
    interact(id: string, position: THREE.Vector3, radius = .45) {
      const previous = contacts.get(id), distance = previous?.distanceTo(position) ?? 0
      if (distance > .015 && distance < 4) {
        const steps = Math.max(1,Math.ceil(distance / .2))
        for (let i=1;i<=steps;i++) {
          const p = previous!.clone().lerp(position,i/steps)
          if (Math.abs(p.y-this.heightAt(p.x,p.z))<.65) this.disturb(p.x,p.z,Math.min(.25,distance*.6),radius)
        }
      }
      if (contacts.size > 256 && !previous) contacts.delete(contacts.keys().next().value!)
      contacts.set(id,position.clone())
    },
    /** A slope uses the nearest wet sample as its local mirror plane. */
    reflectionLevel(x: number, z: number) {
      if (!mask?.heights) return mesh.position.y
      const n = mask.resolution, c = Math.cos(shape.angle), s = Math.sin(shape.angle)
      let best = Infinity, level = mesh.position.y
      for (let iz = 0; iz < n; iz++) for (let ix = 0; ix < n; ix++) {
        const i = iz * n + ix; if (mask.values[i] <= 0) continue
        const lx = (ix / (n - 1) - .5) * shape.size * 2, lz = (iz / (n - 1) - .5) * shape.size * 2
        const d = (shape.x + c * lx - s * lz - x) ** 2 + (shape.z + s * lx + c * lz - z) ** 2
        if (d < best) { best = d; level = mask.heights[i] + mesh.position.y }
      }
      return level
    },
    /** Upload a changed paint mask without rebuilding the scene. */
    refresh,
    /** Distance (m) from a point to this water, 0 inside. */
    distance(x: number, z: number) { return options.distance ? options.distance(x, z) : Math.max(0, -waterEdge(shape, x, z)) },
    dispose() { dynamicsTexture.dispose(); maskTexture?.dispose(); reflection.dispose(); material.dispose(); mesh.geometry.dispose() },
  }
}

export type Water = ReturnType<typeof createWater>
