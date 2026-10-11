import * as THREE from 'three'
import type { AsciiSurface } from './surface'
import { createWetlandTree } from './wetlandTrees'
import { applyWorldGlyphs, WORLD_GLYPH_ALPHA, worldWaterGLSL, worldWaterUniforms } from './worldGlyph'
import { createWaterReflection, waterReflectionGLSL, waterReflectionUniforms } from './waterReflection'

/**
 * Dark Forest circuit. The hunt is a closed winding loop (trailLoop.ts) whose
 * length matches the focus block; the bonfire sits at s = 0. The world is
 * generated in 20 m chunks along the loop from a fixed seed (same chunk, same
 * content), created ahead and disposed behind. Ground, grass carpet and the trail live
 * in shaders (world space), so they never run out. Presentation only: the
 * Hunt's rules and RNG stay in the engine.
 */
import { createTrailLoop, LOOP_CHUNK, trailLoopGLSL, type TrailLoop } from './trailLoop'
export const CHUNK = LOOP_CHUNK
const MAX_STREAMS = 3

const waterEdgeGLSL = `
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
export const forestSoilGLSL = `
  uniform vec4 streams[${MAX_STREAMS}];
  uniform vec3 campAt;
  ${trailLoopGLSL}
  float soilHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float soilNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(soilHash(i), soilHash(i + vec2(1., 0.)), f.x), mix(soilHash(i + vec2(0., 1.)), soilHash(i + 1.), f.x), f.y);
  }
  ${waterEdgeGLSL}
  // .x: bare soil 0-1 (trail, camp clearing, banks). .y: water bed.
  vec2 forestSoil(vec2 p) {
    float edge = (soilNoise(p * 2.4) - .5) * .5;
    float path = 1. - smoothstep(.26, .6, abs(trailOffset(p)) + edge);
    float clearing = 1. - smoothstep(.75, 1.25, distance(p, campAt.xz) + edge);
    float bank = 0., bed = 0.;
    for (int i = 0; i < ${MAX_STREAMS}; i++) {
      if (streams[i].w == 0.) continue;
      float inside = waterEdge(p, streams[i]);
      bank = max(bank, smoothstep(-.75 + edge * .4, -.1, inside));
      bed = max(bed, smoothstep(-.05, .1, inside));
    }
    return vec2(min(1., max(path * .85, max(clearing, bank * .8))), bed);
  }
`

export interface ForestKit {
  add: (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx?: number, sy?: number, sz?: number, parent?: THREE.Object3D, surface?: AsciiSurface) => THREE.Mesh
  box: (color: number, x: number, y: number, z: number, w: number, h: number, d: number, parent?: THREE.Object3D, surface?: AsciiSurface) => THREE.Mesh
}
interface WaterSpec { cx: number; cz: number; angle: number; w: number }
interface Stream extends WaterSpec { mesh: THREE.Mesh; material: THREE.ShaderMaterial; reflection: ReturnType<typeof createWaterReflection> }
interface Chunk { index: number; group: THREE.Group; trees: ReturnType<typeof createWetlandTree>[]; stream?: Stream; occluders: THREE.Object3D[] }

const rock = new THREE.DodecahedronGeometry(1, 0), log = new THREE.CylinderGeometry(1, 1, 1, 8), cap = new THREE.SphereGeometry(1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2)

export function createForestWorld(scene: THREE.Scene, kit: ForestKit, initialLength = 1600) {
  let loop: TrailLoop = createTrailLoop(initialLength)
  const soilUniforms = {
    loopShape: { value: [...loop.uniforms.loopShape.value] },
    streams: { value: Array.from({ length: MAX_STREAMS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    campAt: { value: new THREE.Vector3(0, 0, 9999) },
  }
  // Lit floor: colour from world position, so it can follow the hero forever.
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
  floorMaterial.userData.asciiSurface = 'earth'
  floorMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, soilUniforms)
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 forestWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nforestWorld = (modelMatrix * vec4(transformed, 1.)).xyz;')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec3 forestWorld;\n${forestSoilGLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 fp = forestWorld.xz;
        float mottle = soilNoise(fp * .32) * .55 + soilNoise(fp * .7 + 7.) * .3 + soilNoise(fp * 1.4 + 3.) * .15;
        float tuft = soilNoise(fp * 1.7 + 30.);
        vec3 moss = vec3(.15 + mottle * .09 + tuft * .07, .34 + mottle * .18 + tuft * .1, .11 + (1. - mottle) * .05);
        float dry = max(0., soilNoise(fp * .18 + 11.) - .55) * 2.2;
        moss += vec3(.13, .04, 0.) * dry;
        vec2 soil = forestSoil(fp);
        vec3 dirt = vec3(.36, .33, .26) * (.75 + tuft * .5);
        vec3 ground = mix(moss, dirt, soil.x) * .62;
        ground *= 1. - soil.y * .9;
        diffuseColor.rgb = pow(ground, vec3(2.2));`)
  }
  floorMaterial.customProgramCacheKey = () => 'forest-world-floor'
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), floorMaterial)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  scene.add(floor)
  applyWorldGlyphs(floor)

  const chunks = new Map<number, Chunk>()
  function seeded(index: number) {
    let seed = (Math.imul(index + 7919, 2654435761) ^ 0x5bd1e995) >>> 0
    return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  }
  /** Mirrors the GLSL waterEdge: > 0 inside the water. */
  function waterEdge(sp: WaterSpec, x: number, z: number) {
    const dx = x - sp.cx, dz = z - sp.cz
    if (sp.w > 0) {
      const along = Math.cos(sp.angle) * dx + Math.sin(sp.angle) * dz
      if (Math.abs(along) > 17) return -9
      const across = -Math.sin(sp.angle) * dx + Math.cos(sp.angle) * dz - Math.sin(along * .29 + sp.angle * 7) * 2.3 - Math.sin(along * .83 + 1) * .5
      const pool = Math.max(0, Math.sin(along * .23 + sp.angle * 3)) ** 3 * 2.2
      return sp.w * (1 + .45 * Math.sin(along * .47 + 1.7)) + pool - Math.abs(across)
    }
    const a = Math.atan2(dz, dx)
    const r = -sp.w * (1 + .2 * Math.sin(a * 3 + sp.angle * 5) + .1 * Math.sin(a * 5 + sp.angle * 11) + .05 * Math.sin(a * 9 + sp.angle))
    return r - Math.hypot(dx, dz * 1.2)
  }
  function waterFor(index: number): WaterSpec | undefined {
    // Keep the bonfire's surroundings dry.
    if (index < 1 || index >= loop.chunks - 1) return undefined
    const r = seeded(index * 31 + 5)
    const roll = r()
    if (roll > .46) return undefined
    const p = loop.point(index * CHUNK + CHUNK / 2 + (r() - .5) * 8)
    if (roll < .2) return { cx: p.x, cz: p.z, angle: Math.atan2(p.nz, p.nx) + (r() - .5) * .6, w: .9 + r() * .6 }
    // Pond beside the trail; the path skirts its bank.
    const radius = 2.4 + r() * 2.2, side = r() < .5 ? -1 : 1, off = side * (radius * 1.25 + 1.6)
    return { cx: p.x + p.nx * off, cz: p.z + p.nz * off, angle: r() * 6, w: -radius }
  }
  function createStream(spec: WaterSpec, parent: THREE.Group): Stream {
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, centre: { value: new THREE.Vector4(spec.cx, spec.cz, spec.angle, spec.w) }, ...waterReflectionUniforms(), ...worldWaterUniforms() },
      vertexShader: `varying vec3 p; varying vec4 mirrorUv; uniform mat4 reflectionMatrix;
        void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;mirrorUv=reflectionMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader: `varying vec3 p; uniform float time; uniform vec4 centre;
        ${waterEdgeGLSL}
        ${waterReflectionGLSL}
        ${worldWaterGLSL()}
        void main(){
          float inside=waterEdge(p.xz,centre);
          if(inside<0.)discard;
          float edge=1.-smoothstep(0.,.25,inside);
          vec2 flow=centre.w>0.?vec2(cos(centre.z),sin(centre.z))*.35:vec2(.02,.015);
          gl_FragColor=vec4(waterLetters(p,time,edge*.75,flow,0.,vec3(0.)),${WORLD_GLYPH_ALPHA.toFixed(2)});
        }`,
    })
    const size = spec.w > 0 ? 38 : -spec.w * 2.8 + 2
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material)
    mesh.rotation.x = -Math.PI / 2; mesh.position.set(spec.cx, .018, spec.cz)
    parent.add(mesh)
    return { ...spec, mesh, material, reflection: createWaterReflection(scene, mesh, material) }
  }

  function buildChunk(index: number): Chunk {
    const r = seeded(index), group = new THREE.Group(); scene.add(group)
    const trees: Chunk['trees'] = [], s0 = index * CHUNK
    /** World point `along` metres into this chunk and `side` metres off the trail. */
    const at = (along: number, side: number) => { const p = loop.point(s0 + along); return { x: p.x + p.nx * side, z: p.z + p.nz * side } }
    const spec = waterFor(index)
    const clear = (x: number, z: number, margin: number) => {
      if (Math.abs(loop.offset(x, z)) < margin) return false
      // Keep a clearing around the bonfire (start and end of the circuit).
      const camp = soilUniforms.campAt.value
      if (Math.hypot(x - camp.x, z - camp.z) < 4.5 + margin) return false
      if (spec && waterEdge(spec, x, z) > -margin * .6) return false
      return true
    }
    // Trees frame the trail at uneven distances; deeper woods on the edges.
    for (let i = 0; i < 11; i++) {
      const { x, z } = at(r() * CHUNK, (r() < .5 ? -1 : 1) * (2.6 + r() * 11))
      if (!clear(x, z, 2.4)) continue
      const tree = createWetlandTree(x, z, 3.6 + r() * 1.3, Math.floor(r() * 1e6), false)
      group.add(tree.root); trees.push(tree)
      for (let k = 0; k < 4; k++) kit.add(rock, 0x4f5a52, x + Math.cos(k * 2.4) * .6, .16, z + Math.sin(k * 2.4) * .6, .35, .26, .4, group, 'stone')
    }
    // Flat stepping stones along the trail.
    for (let i = 0; i < 34; i++) {
      const { x, z } = at(r() * CHUNK, (r() - .5) * 1.4)
      if (spec && waterEdge(spec, x, z) > -.2) continue
      if (Math.hypot(x - soilUniforms.campAt.value.x, z - soilUniforms.campAt.value.z) < 2.2) continue
      const stone = kit.add(rock, [0x6c6a62, 0x7b7a70, 0x5f6460][i % 3], x, -.005, z, .08 + r() * .19, .035, .1 + r() * .19, group, 'stone')
      stone.rotation.y = r() * 6
    }
    // Boulders and rock clusters in the grass.
    for (let i = 0; i < 6; i++) {
      const { x, z } = at(r() * CHUNK, (r() < .5 ? -1 : 1) * (2 + r() * 9))
      if (!clear(x, z, 1.6)) continue
      for (let k = 0; k < 3; k++) {
        const s = .25 + r() * .5
        const b = kit.add(rock, [0x6a706c, 0x787d78, 0x5c625f][k], x + (r() - .5) * 1.2, s * .4, z + (r() - .5) * 1.2, s, s * .8, s * .9, group, 'stone')
        b.rotation.set(r(), r() * 6, r())
      }
    }
    const feature = r()
    const side = r() < .5 ? -1 : 1, { x: fx, z: fz } = at(CHUNK * (.3 + r() * .4), side * (3.2 + r() * 2))
    if (index > 0 && feature < .22 && clear(fx, fz, 2.4)) {
      // Ruined chapel wall: brick courses, a broken arch and two buttresses.
      const ruin = new THREE.Group(); ruin.position.set(fx, 0, fz); ruin.rotation.y = r() * Math.PI; group.add(ruin)
      const colors = [0x656774, 0x717582, 0x555b69, 0x7b7f88]
      for (let row = 0; row < 9; row++) for (let col = -3; col <= 3; col++) {
        const x = col * .49 + (row % 2) * .23
        if (row > 3 && Math.abs(x) < .4) continue
        if (row > 5 + Math.sin(col * 1.7 + index) * 2) continue
        kit.box(colors[Math.floor(r() * 4)], x, .17 + row * .32, 0, .45, .29, .55, ruin, 'stone')
      }
      for (const x of [-1.8, 1.8]) kit.box(0x6a6e7a, x, 1.2, .2, .45, 2.4, .9, ruin, 'stone')
      for (let i = 0; i < 7; i++) { const a = i / 12 * Math.PI, s = kit.box(0x717582, Math.cos(a) * .7, 2 + Math.sin(a) * .8, .2, .25, .36, .5, ruin, 'stone'); s.rotation.z = a - Math.PI / 2 }
    } else if (feature < .45 && clear(fx, fz, 1.8)) {
      // Fallen trunk with shelf fungus.
      const t = kit.add(log, 0x6d5a42, fx, .22, fz, .22, 3 + r() * 1.5, .22, group, 'bark'); t.rotation.set(Math.PI / 2, 0, r() * Math.PI)
      for (let i = 0; i < 5; i++) kit.add(cap, 0xc9a96b, fx + (r() - .5) * 1.4, .35, fz + (r() - .5) * .3, .12, .06, .12, group, 'wood')
    } else if (feature < .65 && clear(fx, fz, 2)) {
      // Standing stones in a ring.
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * Math.PI * 2, h = .9 + r() * .8
        const s = kit.box(0x7a7f86, fx + Math.cos(a) * 1.3, h / 2, fz + Math.sin(a) * 1.3, .35, h, .28, group, 'stone'); s.rotation.set((r() - .5) * .15, a, (r() - .5) * .15)
      }
    } else if (feature < .85 && clear(fx, fz, 1.4)) {
      // Pale glowing mushrooms.
      for (let i = 0; i < 9; i++) {
        const mx = fx + (r() - .5) * 1.6, mz = fz + (r() - .5) * 1.6, h = .1 + r() * .18
        kit.box(0xd6d0bd, mx, h / 2, mz, .03, h, .03, group, 'wood')
        const c = kit.add(cap, 0x9fd1c4, mx, h, mz, .07 + r() * .06, .05, .07 + r() * .06, group, 'stone')
        ;(c.material as THREE.MeshStandardMaterial).emissive.setHex(0x2f6d63)
      }
    }
    let stream: Stream | undefined
    if (spec) {
      stream = createStream(spec, group)
      if (spec.w > 0) {
        // Footbridge across the stream where the trail meets it (spans the water's normal).
        // Walk the trail both ways from the crossing to find the water's extent.
        const sc = loop.nearest(spec.cx, spec.cz)
        const wet = (ds: number) => { const p = loop.point(sc + ds); return waterEdge(spec, p.x, p.z) > -.1 }
        let ahead = .5, behind = .5
        while (ahead < 7 && wet(ahead)) ahead += .25
        while (behind < 7 && wet(-behind)) behind += .25
        const mid = loop.point(sc + (ahead - behind) / 2), half = (ahead + behind) / 2
        const bridge = new THREE.Group(); bridge.position.set(mid.x, 0, mid.z); bridge.rotation.y = Math.atan2(mid.tx, mid.tz); group.add(bridge)
        const span = half * 2 + .8
        for (let i = 0; i < Math.ceil(span / .17); i++) kit.box(i % 3 ? 0x63594c : 0x81715c, 0, .16, -span / 2 + i * .17, 1.25, .13, .15, bridge, 'wood')
        for (const x of [-.66, .66]) {
          kit.box(0x6f6454, x, .5, 0, .1, .1, span, bridge, 'wood')
          for (const z of [-span / 2, 0, span / 2]) kit.box(0x8a7a60, x, .5, z, .09, 1, .09, bridge, 'wood')
        }
      }
      // Bank stones and reeds follow the organic shoreline.
      for (let i = 0; i < 70; i++) {
        const x = spec.cx + (r() - .5) * (spec.w > 0 ? 30 : -spec.w * 2.8), z = spec.cz + (r() - .5) * (spec.w > 0 ? 30 : -spec.w * 2.6)
        const e = waterEdge(spec, x, z)
        if (e > 0 || e < -.45 || Math.abs(loop.offset(x, z)) < 1) continue
        if (r() < .55) kit.add(rock, [0x414c4f, 0x55605d][i % 2], x, .045, z, .1 + r() * .18, .06 + r() * .1, .15, group, 'stone')
        else for (let k = 0; k < 3; k++) { const reed = kit.box(0x5c746d, x + (r() - .5) * .2, .3, z + (r() - .5) * .2, .025, .6 + r() * .4, .025, group, 'foliage'); reed.rotation.z = (r() - .5) * .3 }
      }
    }
    group.updateMatrixWorld(true)
    applyWorldGlyphs(group)
    const occluders: THREE.Object3D[] = []
    const bounds = new THREE.Box3()
    group.traverse((o) => { if (o instanceof THREE.Mesh && !(o instanceof THREE.Points) && bounds.setFromObject(o).max.y > .65) occluders.push(o) })
    return { index, group, trees, stream, occluders }
  }
  function disposeChunk(chunk: Chunk) {
    scene.remove(chunk.group)
    // Trees own their geometry and materials; shared kit pieces are left alone.
    for (const tree of chunk.trees) tree.root.traverse((o) => {
      if (o instanceof THREE.Mesh && !(o instanceof THREE.Points)) { o.geometry.dispose(); (o.material as THREE.Material).dispose() }
    })
    chunk.stream?.reflection.dispose(); chunk.stream?.material.dispose()
    chunk.group.traverse((o) => {
      if (o instanceof THREE.Points) { o.geometry.dispose(); (o.material as THREE.Material).dispose() }
      else if (o instanceof THREE.InstancedMesh) o.dispose()
    })
  }

  const occluders: THREE.Object3D[] = []
  let current = Number.NaN
  const snap = 3.4
  return {
    soilUniforms, occluders,
    get loop() { return loop },
    /** A new focus length reshapes the circuit (only between hunts). */
    setLength(length: number) {
      if (createTrailLoop(length).length === loop.length) return
      loop = createTrailLoop(length)
      soilUniforms.loopShape.value.splice(0, 5, ...loop.uniforms.loopShape.value)
      for (const chunk of chunks.values()) disposeChunk(chunk)
      chunks.clear(); current = Number.NaN
    },
    update(hero: THREE.Vector3, time: number) {
      floor.position.set(Math.round(hero.x / snap) * snap, -.07, Math.round(hero.z / snap) * snap)
      const index = Math.floor(loop.nearest(hero.x, hero.z) / CHUNK)
      if (index !== current) {
        current = index
        const n = loop.chunks, wanted = new Set([-1, 0, 1, 2].map((k) => ((index + k) % n + n) % n))
        for (const [k, chunk] of chunks) if (!wanted.has(k)) { disposeChunk(chunk); chunks.delete(k) }
        for (const k of wanted) if (!chunks.has(k)) chunks.set(k, buildChunk(k))
        occluders.length = 0
        const ring = (k: number) => Math.min(((k - index) % n + n) % n, ((index - k) % n + n) % n)
        const live = [...chunks.values()].filter((c) => c.stream).sort((a, b) => ring(a.index) - ring(b.index))
        soilUniforms.streams.value.forEach((v, i) => {
          const s = live[i]?.stream
          if (s) v.set(s.cx, s.cz, s.angle, s.w); else v.set(0, 0, 0, 0)
        })
        for (const c of chunks.values()) occluders.push(...c.occluders)
      }
      for (const c of chunks.values()) { c.trees.forEach((t) => t.animate(time)); if (c.stream) c.stream.material.uniforms.time.value = time }
    },
    /** Only the nearest stream renders its mirror each frame. */
    renderWaterReflection(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera, hero: THREE.Vector3) {
      let best: Stream | undefined, distance = Infinity
      for (const c of chunks.values()) if (c.stream) {
        const score = Math.max(0, -waterEdge(c.stream, hero.x, hero.z))
        if (score < distance) { distance = score; best = c.stream }
      }
      if (best && distance < 11) best.reflection.render(renderer, camera)
    },

    dispose() {
      for (const chunk of chunks.values()) disposeChunk(chunk)
      chunks.clear(); floor.geometry.dispose(); floorMaterial.dispose()
    },
  }
}
