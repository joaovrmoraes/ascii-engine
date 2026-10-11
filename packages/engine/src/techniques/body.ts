import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { inkLightsGLSL, inkLightUniforms } from '../illumination'
import { SURFACE_ALPHA } from '../surface'

/**
 * Technique `body` (Pomorog `glyphBody.ts`).
 * Bodies made of letters: characters scattered over each part's surface,
 * facing the camera, riding along with the limb, bough or rock they belong
 * to. Nothing is filtered by a screen-locked grid. Solid bodies keep a dark
 * occluder between letters; leaf crowns stay open and ragged.
 */
export const BODY_RAMPS = {
  actor: ' .:-=+*x%#@',
  foliage: ' .,:;vYv%&#',
  stone: ' .:-=coO0#@',
  snow: ' .,:;+*oO@',
  bark: ' :|!/\\lI#',
}
export type BodyRamp = keyof typeof BODY_RAMPS
let glyphs = ''
const START: Record<string, number> = {}
for (const [k, v] of Object.entries(BODY_RAMPS)) { START[k] = glyphs.length; glyphs += v }
const GLYPH_ALPHA = SURFACE_ALPHA.glyph

/** Shared by every body of one engine: point size, moon and the warm lights. */
export function bodyUniforms() {
  return {
    ...inkLightUniforms(),
    pixelScale: { value: 60 },
    moon: { value: new THREE.Vector3(-5, 12, 7).normalize() },
    lantern: { value: new THREE.Vector4(0, 0, 0, 0) },
    hearth: { value: new THREE.Vector4(0, 0, 0, 0) },
    ambient: { value: .32 }, sunPower: { value: 1 }, sunColor: { value: new THREE.Color(1,1,1) },
  }
}
export type BodyUniforms = ReturnType<typeof bodyUniforms>

let atlas: THREE.CanvasTexture | null = null
function glyphAtlas() {
  if (atlas) return atlas
  // Sized near the on-screen letter (9–14 px) and without mipmaps: point
  // sprites have no UV derivatives, so mip selection blurred letters into squares.
  const per = 24, canvas = document.createElement('canvas')
  canvas.width = glyphs.length * per; canvas.height = 32
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'; ctx.font = '25px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  Array.from(glyphs).forEach((g, i) => ctx.fillText(g, i * per + per / 2, 17))
  atlas = new THREE.CanvasTexture(canvas)
  atlas.generateMipmaps = false; atlas.minFilter = THREE.LinearFilter; atlas.magFilter = THREE.LinearFilter
  return atlas
}

function lettersMaterial(shared: BodyUniforms, color: THREE.Color, glow: THREE.Color, size: number, ramp: BodyRamp, open: boolean) {
  const count = BODY_RAMPS[ramp].length
  return new THREE.ShaderMaterial({
    uniforms: { ...shared, atlas: { value: glyphAtlas() }, tint: { value: color }, glow: { value: glow } },
    vertexShader: `
      ${inkLightsGLSL}
      attribute vec3 glyphColor; attribute float seed;
      uniform float pixelScale, ambient, sunPower; uniform vec3 sunColor; uniform vec3 moon, tint, glow; uniform vec4 lantern, hearth;
      varying vec3 vColor; varying float vIndex;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.);
        vec3 n = normalize(mat3(modelMatrix) * normal);
        vec4 view = viewMatrix * world;
        float facing = dot(normalize(mat3(viewMatrix) * n), vec3(0., 0., 1.));
        float diffuse = max(dot(n, moon), 0.);
        float lamp = lantern.w * pow(max(0., 1. - distance(world.xyz, lantern.xyz) / 6.), 1.5);
        float fire = hearth.w * pow(max(0., 1. - distance(world.xyz, hearth.xyz) / 5.5), 1.7);
        vec3 point = pointInk(world.xyz);
        float light = ambient + diffuse * .7 * sunPower + lamp * .9 + fire * .8 + dot(point, vec3(.2126,.7152,.0722)) * .5;
        // Letter shape carries the shading; colour stays the material's own hue.
        float level = clamp(light * .62 + (seed - .5) * .3 + length(glow) * .5, .08, .999);
        vIndex = ${START[ramp]}.0 + 1.0 + floor(level * ${count - 1}.0);
        vColor = (glyphColor * tint * (.35 + light * .8) + vec3(.95, .6, .28) * (lamp * .25 + fire * .35) * tint + glow) * ${ramp === 'stone' ? '1.45' : '1.'};
        vColor = vColor * mix(vec3(1.), sunColor, diffuse * .6) + glyphColor * tint * point * .35;
        gl_Position = projectionMatrix * view;
        gl_Position.z -= .002 * gl_Position.w;
        gl_PointSize = facing < ${ramp === 'stone' ? '.05' : open ? '-.2' : '-.05'} ? 0. : ${size.toFixed(3)} * pixelScale;
      }`,
    fragmentShader: `
      uniform sampler2D atlas;
      varying vec3 vColor; varying float vIndex;
      void main() {
        vec2 uv = vec2((gl_PointCoord.x - .5) * 1.25 + .5, 1. - gl_PointCoord.y);
        if (uv.x < 0. || uv.x > 1.) discard;
        float ink = texture2D(atlas, vec2((vIndex + .08 + uv.x * .84) / ${glyphs.length}.0, .06 + uv.y * .88)).r;
        if (ink < .38) discard;
        gl_FragColor = vec4(vColor, ${GLYPH_ALPHA.toFixed(2)});
      }`,
  })
}

function triangleArea(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position, index = geometry.index
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const count = index ? index.count : pos.count
  let total = 0
  for (let i = 0; i < count; i += 3) {
    a.fromBufferAttribute(pos, index ? index.getX(i) : i)
    b.fromBufferAttribute(pos, index ? index.getX(i + 1) : i + 1)
    c.fromBufferAttribute(pos, index ? index.getX(i + 2) : i + 2)
    total += b.sub(a).cross(c.sub(a)).length() / 2
  }
  return total
}

/** Letters over a geometry; `matrices` place instances and `scale` sets world density. */
function scatter(geometry: THREE.BufferGeometry, spacing: number, matrices: THREE.Matrix4[], colors: THREE.Color[], worldScale: THREE.Vector3, seedBase: number, toWorld: THREE.Matrix4, taken: Set<string>) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
  const area = triangleArea(geometry)
  const positions: number[] = [], normals: number[] = [], tints: number[] = [], seeds: number[] = []
  const p = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3(), s = new THREE.Vector3()
  let seed = seedBase
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  ;(sampler as unknown as { randomFunction: () => number }).randomFunction = random
  // Even spacing (dart throwing on a world-scale hash) keeps every letter
  // readable: no clumps of overlapping glyphs that read as noise.
  const w = new THREE.Vector3()
  const key = (v: THREE.Vector3) => `${Math.floor(v.x / spacing)},${Math.floor(v.y / spacing)},${Math.floor(v.z / spacing)}`
  matrices.forEach((matrix, m) => {
    s.setFromMatrixScale(matrix).multiply(worldScale)
    const scaledArea = area * (s.x * s.y + s.y * s.z + s.x * s.z) / 3
    const count = Math.min(3000, Math.max(2, Math.round(scaledArea / (spacing * spacing))))
    nm.getNormalMatrix(matrix)
    for (let i = 0, tries = 0; i < count && tries < count * 6; tries++) {
      sampler.sample(p, n)
      p.applyMatrix4(matrix); n.applyMatrix3(nm).normalize()
      w.copy(p).applyMatrix4(toWorld)
      const k = key(w); if (taken.has(k)) continue
      taken.add(k); i++
      positions.push(p.x, p.y, p.z); normals.push(n.x, n.y, n.z)
      tints.push(colors[m].r, colors[m].g, colors[m].b); seeds.push(random())
    }
  })
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  out.setAttribute('glyphColor', new THREE.Float32BufferAttribute(tints, 3))
  out.setAttribute('seed', new THREE.Float32BufferAttribute(seeds, 1))
  return out
}

const white = new THREE.Color(1, 1, 1), noGlow = new THREE.Color(0, 0, 0)
const darkCache = new Map<THREE.Material, THREE.MeshBasicMaterial>()
const darkMaterials = new WeakSet<THREE.Material>()
/** Opaque near-black stand-in: hides what is behind, shows as the gap between letters. */
function darkOccluder(material: THREE.MeshStandardMaterial, tint = .035) {
  let dark = darkCache.get(material)
  if (!dark) {
    // A deep shade of the object's own colour: a silhouette on bright snow,
    // practically black on night ground.
    dark = new THREE.MeshBasicMaterial({ color: material.color.clone().multiplyScalar(tint) })
    dark.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>\ngl_FragColor.a = ${GLYPH_ALPHA.toFixed(2)};`)
    }
    dark.customProgramCacheKey = () => 'glyph-occluder'
    darkCache.set(material, dark); darkMaterials.add(dark)
  }
  return dark
}

function rampOf(material: THREE.MeshStandardMaterial, fallback: BodyRamp): BodyRamp {
  const kind = material.userData.asciiSurface as string | undefined
  if (kind === 'foliage') return 'foliage'
  if (kind === 'snow') return 'snow'
  if (kind === 'stone') return 'stone'
  if (kind === 'bark' || kind === 'wood') return 'bark'
  return fallback
}

const world = new THREE.Vector3()
/**
 * Turns a mesh hierarchy into letters. `open` meshes (foliage, snow caps)
 * lose their surface entirely; the rest keep a dark occluder.
 */
export function glyphBody(root: THREE.Object3D | THREE.Mesh[], shared: BodyUniforms, size = .1, fallback: BodyRamp = 'actor', force?: BodyRamp) {
  const meshes: THREE.Mesh[] = []
  if (Array.isArray(root)) { for (const mesh of root) { mesh.updateWorldMatrix(true, false); if (!mesh.userData.glyphDone) meshes.push(mesh) } }
  else {
    root.updateMatrixWorld(true)
    root.traverse((o) => { if (o instanceof THREE.Mesh && !o.userData.glyphDone) meshes.push(o) })
  }
  let seed = 9173
  // One spacing hash per body: overlapping parts must not stack letters.
  const taken = new Set<string>()
  /** Letter clouds that need a per-frame update (skinned). */
  const created: THREE.Points[] = []
  for (const mesh of meshes) {
    mesh.userData.glyphDone = true
    const material = mesh.material as THREE.MeshStandardMaterial
    if (!(material instanceof THREE.MeshStandardMaterial)) continue
    const ramp = force ?? rampOf(material, fallback)
    // Stones are an open shell of letters too: a dark body read as a hole.
    const open = ramp === 'foliage' || ramp === 'snow' || ramp === 'stone'
    const letter = ramp === 'stone' ? size * .95 : open ? size * 1.25 : size
    world.setFromMatrixScale(mesh.matrixWorld)
    const instanced = mesh instanceof THREE.InstancedMesh
    const matrices: THREE.Matrix4[] = [], colors: THREE.Color[] = []
    if (instanced) {
      for (let i = 0; i < mesh.count; i++) {
        const m = new THREE.Matrix4(); mesh.getMatrixAt(i, m); matrices.push(m)
        const c = new THREE.Color(1, 1, 1); if (mesh.instanceColor) mesh.getColorAt(i, c); colors.push(c)
      }
    } else { matrices.push(new THREE.Matrix4()); colors.push(white) }
    const spacing = letter * (ramp === 'stone' ? .72 : open ? .9 : .82)
    // Skinned meshes: letters follow the bones (positions re-skinned each frame).
    const skinned = mesh instanceof THREE.SkinnedMesh ? scatterSkinned(mesh, spacing, seed += 7919, taken) : undefined
    const geometry = skinned?.geometry ?? scatter(mesh.geometry, spacing, matrices, colors, world, seed += 7919, mesh.matrixWorld, taken)
    const points = new THREE.Points(geometry, lettersMaterial(shared, material.color, material.emissive ?? noGlow, letter, ramp, open))
    points.userData.glyphDone = true; points.userData.glyphBodyOf = mesh; points.frustumCulled = false
    if (skinned) { points.userData.skin = skinned.skin; created.push(points) }
    mesh.add(points)
    mesh.userData.glyphBodyMaterial = material
    if (open) {
      // Crowns become an open cloud of leaf letters; the clusters still cast shade.
      const hidden = material.clone(); hidden.colorWrite = false; hidden.depthWrite = false
      mesh.material = hidden; mesh.castShadow = true
    // Creatures keep a faint silhouette of their own colour (readable on snow).
    } else mesh.material = darkOccluder(material)
  }
  return created
}

interface Skin { mesh: THREE.SkinnedMesh; corners: Uint32Array; weights: Float32Array }
/**
 * Letters over a skinned mesh: each letter keeps its triangle and barycentric
 * weights, so it can be re-skinned every frame (`updateSkinnedBody`).
 */
function scatterSkinned(mesh: THREE.SkinnedMesh, spacing: number, seedBase: number, taken: Set<string>) {
  const geometry = mesh.geometry, pos = geometry.attributes.position, index = geometry.index
  const triangles = (index ? index.count : pos.count) / 3
  const corner = (t: number, k: number) => index ? index.getX(t * 3 + k) : t * 3 + k
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const cumulative = new Float32Array(triangles)
  let total = 0
  mesh.updateWorldMatrix(true, false)
  const scale = new THREE.Vector3().setFromMatrixScale(mesh.matrixWorld)
  for (let t = 0; t < triangles; t++) {
    a.fromBufferAttribute(pos, corner(t, 0)); b.fromBufferAttribute(pos, corner(t, 1)); c.fromBufferAttribute(pos, corner(t, 2))
    total += b.sub(a).cross(c.sub(a)).length() / 2
    cumulative[t] = total
  }
  let seed = seedBase
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const count = Math.min(3000, Math.max(2, Math.round(total * (scale.x * scale.y + scale.y * scale.z + scale.x * scale.z) / 3 / (spacing * spacing))))
  const corners: number[] = [], weights: number[] = [], seeds: number[] = []
  const p = new THREE.Vector3(), w = new THREE.Vector3()
  const key = (v: THREE.Vector3) => `${Math.floor(v.x / spacing)},${Math.floor(v.y / spacing)},${Math.floor(v.z / spacing)}`
  for (let i = 0, tries = 0; i < count && tries < count * 6; tries++) {
    const r = random() * total
    let lo = 0, hi = triangles - 1
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cumulative[mid] < r) lo = mid + 1; else hi = mid }
    let u = random(), v = random()
    if (u + v > 1) { u = 1 - u; v = 1 - v }
    const ia = corner(lo, 0), ib = corner(lo, 1), ic = corner(lo, 2)
    a.fromBufferAttribute(pos, ia); b.fromBufferAttribute(pos, ib); c.fromBufferAttribute(pos, ic)
    p.copy(a).multiplyScalar(1 - u - v).addScaledVector(b, u).addScaledVector(c, v)
    w.copy(p).applyMatrix4(mesh.matrixWorld)
    const k = key(w); if (taken.has(k)) continue
    taken.add(k); i++
    corners.push(ia, ib, ic); weights.push(1 - u - v, u, v); seeds.push(random())
  }
  const n = seeds.length
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage))
  out.setAttribute('glyphColor', new THREE.Float32BufferAttribute(new Float32Array(n * 3).fill(1), 3))
  out.setAttribute('seed', new THREE.Float32BufferAttribute(seeds, 1))
  const skin: Skin = { mesh, corners: new Uint32Array(corners), weights: new Float32Array(weights) }
  return { geometry: out, skin }
}

const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), vp = new THREE.Vector3(), vn = new THREE.Vector3()
/** Re-skins the letters of a skinned body (call after the animation, before rendering). */
export function updateSkinnedBody(points: THREE.Points) {
  const skin = points.userData.skin as Skin | undefined
  if (!skin) return
  const { mesh, corners, weights } = skin
  const position = points.geometry.attributes.position as THREE.BufferAttribute, normal = points.geometry.attributes.normal as THREE.BufferAttribute
  for (let i = 0; i < weights.length / 3; i++) {
    mesh.getVertexPosition(corners[i * 3], va); mesh.getVertexPosition(corners[i * 3 + 1], vb); mesh.getVertexPosition(corners[i * 3 + 2], vc)
    vp.copy(va).multiplyScalar(weights[i * 3]).addScaledVector(vb, weights[i * 3 + 1]).addScaledVector(vc, weights[i * 3 + 2])
    vn.subVectors(vb, va).cross(vc.sub(va)).normalize()
    position.setXYZ(i, vp.x, vp.y, vp.z); normal.setXYZ(i, vn.x, vn.y, vn.z)
  }
  position.needsUpdate = normal.needsUpdate = true
}

/** Per-frame: point size in pixels, moon and the warm lights that pick letters. */
export function updateGlyphBodies(shared: BodyUniforms, camera: THREE.OrthographicCamera, height: number, lantern: THREE.Vector3, lanternPower: number, hearth: THREE.Vector3, hearthPower: number, ambient: number) {
  shared.pixelScale.value = height / (camera.top - camera.bottom)
  shared.lantern.value.set(lantern.x, lantern.y, lantern.z, lanternPower)
  shared.hearth.value.set(hearth.x, hearth.y, hearth.z, hearthPower)
  shared.ambient.value = ambient
}

/** Undo `glyphBody` on one mesh: drop its letters and give back its material. */
export function removeGlyphBody(mesh: THREE.Mesh) {
  for (const child of [...mesh.children]) {
    if (child instanceof THREE.Points && child.userData.glyphBodyOf === mesh) {
      mesh.remove(child); child.geometry.dispose(); (child.material as THREE.Material).dispose()
    }
  }
  const original = mesh.userData.glyphBodyMaterial as THREE.Material | undefined
  if (original) { if (mesh.material !== original && !darkMaterials.has(mesh.material as THREE.Material)) (mesh.material as THREE.Material).dispose(); mesh.material = original }
  delete mesh.userData.glyphBodyMaterial; delete mesh.userData.glyphDone
}
