import * as THREE from 'three'
import { createAsciiPass, type AsciiPassHook } from './ascii'
import { ABSENT, createIllumination } from './illumination'
import type { LightObstacle } from './exploration'
import { pomorog, type AsciiStyle } from './presets/pomorog'
import { nodeGlyphStyle, resolveGlyphStyle, type GlyphStyle, type ObjectTypeStyle } from './style'
import type { SurfaceKind } from './surface'
import { bodyUniforms, glyphBody, removeGlyphBody, updateGlyphBodies, type BodyRamp } from './techniques/body'
import { createCarpet, type Carpet, type GroundCover } from './techniques/carpet'
import { createGlyphCloud, type GlyphCloud } from './techniques/particle'
import { markScreen } from './techniques/screen'
import { surfaceMaterial } from './techniques/surface'

export interface AsciiEngineOptions {
  style?: Partial<AsciiStyle>
  /** Device pixel ratio cap (Pomorog: between 1 and 1.5). */
  maxPixelRatio?: number
  /** Biome effects for the screen pass. */
  hooks?: AsciiPassHook[]
  /** Interior light obstacles (lantern sight). */
  obstacles?: LightObstacle[]
}

/** Instance style plus the parts of this instance, by node name. */
export interface AddOptions extends GlyphStyle {
  /** Object type registered in the style ("tree", "rock", …). */
  type?: string
  parts?: Record<string, GlyphStyle>
}

interface Entry { object: THREE.Object3D; options: AddOptions }

const BODY_RAMPS: Partial<Record<SurfaceKind, BodyRamp>> = { actor: 'actor', foliage: 'foliage', stone: 'stone', snow: 'snow', bark: 'bark', wood: 'bark' }

/**
 * Creates the engine on a canvas. Objects enter with a declared technique
 * (`engine.add(mesh, { glyph: 'body' })`), whole or part by part.
 */
export function createAsciiEngine(canvas: HTMLCanvasElement, options: AsciiEngineOptions = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  const maxRatio = options.maxPixelRatio ?? 1.5
  renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio, maxRatio)))
  // The screen pass applies gamma itself.
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap

  let style: AsciiStyle = { ...pomorog, ...options.style }
  const scene = new THREE.Scene()
  /** Layers drawn after the screen pass, with depth (Pomorog render order). */
  const carpetScene = new THREE.Scene(), waterScene = new THREE.Scene(), particleScene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, .1, 90)
  const target = new THREE.WebGLRenderTarget(1, 1)
  const depth = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType)
  target.depthTexture = depth
  const ascii = createAsciiPass(options.hooks)
  ascii.material.uniforms.sceneTexture.value = target.texture
  ascii.material.uniforms.sceneDepth.value = target.depthTexture

  let illumination = createIllumination({ interior: style.interior, obstacles: options.obstacles })
  const bodies = bodyUniforms()
  const carpets: Carpet[] = [], clouds: GlyphCloud[] = []
  const entries = new Map<THREE.Object3D, Entry>()
  const types: Record<string, ObjectTypeStyle> = { ...style.types }

  const lights = new THREE.Group(); lights.name = 'ascii-style-lights'
  const hemisphere = new THREE.HemisphereLight()
  const moon = new THREE.DirectionalLight(); moon.castShadow = true
  moon.shadow.bias = -.001; moon.shadow.normalBias = .04
  const fill = new THREE.DirectionalLight()
  lights.add(hemisphere, moon, moon.target, fill); scene.add(lights)

  const lantern = { position: ABSENT.clone(), on: false }, hearth = { position: ABSENT.clone(), power: 1, on: false }
  const actors = { hero: null as THREE.Vector3 | null, foe: null as THREE.Vector3 | null, foeHeight: 1 }
  const focus = new THREE.Vector3()
  let width = 1, height = 1, time = 0

  function applyStyle() {
    scene.background = new THREE.Color(style.background)
    scene.fog = style.fog ? new THREE.FogExp2(style.fog.color, style.fog.density) : null
    hemisphere.color.setHex(style.hemisphere.sky); hemisphere.groundColor.setHex(style.hemisphere.ground); hemisphere.intensity = style.hemisphere.intensity
    moon.color.setHex(style.moon.color); moon.intensity = style.moon.intensity
    moon.position.set(...style.moon.position)
    moon.shadow.mapSize.set(style.moon.mapSize, style.moon.mapSize)
    const e = style.moon.shadowExtent
    Object.assign(moon.shadow.camera, { left: -e, right: e, top: e, bottom: -e, far: 40 }); moon.shadow.camera.updateProjectionMatrix()
    moon.shadow.intensity = style.moon.shadowIntensity
    fill.color.setHex(style.fill.color); fill.intensity = style.fill.intensity; fill.position.set(...style.fill.position)
    for (const carpet of carpets) carpet.uniforms.brightness.value = style.brightness
  }
  applyStyle()

  /** Same uniform objects in every pass that lights ink (Pomorog `Object.assign`). */
  function shareIllumination(uniforms: Record<string, THREE.IUniform>) { Object.assign(uniforms, illumination.uniforms) }
  shareIllumination(ascii.material.uniforms)

  function resize() {
    width = Math.max(canvas.clientWidth, 1); height = Math.max(canvas.clientHeight, 1)
    renderer.setSize(width, height, false)
    const size = renderer.getDrawingBufferSize(new THREE.Vector2()); target.setSize(size.x, size.y)
    for (const cloud of clouds) cloud.occludeWith(depth, size.x, size.y)
    ascii.material.uniforms.resolution.value.set(width, height)
  }

  // Per-part styling: every mesh resolves its own style; one part = one body.
  const materialCache = new Map<THREE.Material, Map<string, THREE.Material>>()
  function variant(material: THREE.Material, key: string, make: (copy: THREE.Material) => THREE.Material) {
    let byKey = materialCache.get(material)
    if (!byKey) materialCache.set(material, byKey = new Map())
    let made = byKey.get(key)
    if (!made) {
      // `clone()` drops shader injections: carry them over (floor colour, snow cover…).
      const copy = material.clone()
      copy.onBeforeCompile = material.onBeforeCompile
      if (Object.prototype.hasOwnProperty.call(material, 'customProgramCacheKey')) copy.customProgramCacheKey = material.customProgramCacheKey
      made = make(copy); made.userData.asciiOriginal = material; byKey.set(key, made)
    }
    return made
  }
  function swapMaterials(mesh: THREE.Mesh, key: string, make: (copy: THREE.Material) => THREE.Material) {
    if (!mesh.userData.asciiOriginal) mesh.userData.asciiOriginal = mesh.material
    const original = mesh.userData.asciiOriginal as THREE.Material | THREE.Material[]
    mesh.material = Array.isArray(original) ? original.map((m) => variant(m, key, make)) : variant(original, key, make)
  }

  function apply(entry: Entry) {
    const { object, options: instance } = entry
    const type = instance.type ? types[instance.type] : undefined
    if (instance.type && !type) throw new Error(`ascii-engine: tipo de objeto desconhecido "${instance.type}"`)
    const partNames = new Set([...Object.keys(type?.parts ?? {}), ...Object.keys(instance.parts ?? {})])
    const groups = new Map<string, { style: GlyphStyle; meshes: THREE.Object3D[] }>()
    const missing: string[] = []
    const visit = (node: THREE.Object3D, part: string | undefined, nodeStyle: GlyphStyle | undefined) => {
      if (node.userData.glyphBodyOf) return
      if (node.name && partNames.has(node.name)) part = node.name
      const own = nodeGlyphStyle(node.userData)
      if (own && node !== object) nodeStyle = { ...nodeStyle, ...own }
      if (node instanceof THREE.Mesh || node instanceof THREE.Points) {
        const style_ = resolveGlyphStyle({ global: style.glyphs, type, part, node: node === object ? own : nodeStyle, instance, instanceParts: instance.parts })
        if (!style_.glyph) missing.push(node.name || node.type)
        else {
          // A body is the whole part (or whole object): one spacing hash.
          const key = `${part ?? ''}|${JSON.stringify(style_)}`
          let group = groups.get(key)
          if (!group) groups.set(key, group = { style: style_, meshes: [] })
          group.meshes.push(node)
        }
      }
      for (const child of [...node.children]) visit(child, part, nodeStyle)
    }
    visit(object, undefined, undefined)
    if (missing.length) throw new Error(`ascii-engine: sem técnica declarada (glyph) em ${missing.slice(0, 5).join(', ')}`)
    for (const { style: s, meshes } of groups.values()) applyTechnique(s, meshes)
  }

  function applyTechnique(s: GlyphStyle, nodes: THREE.Object3D[]) {
    const meshes = nodes.filter((n): n is THREE.Mesh => n instanceof THREE.Mesh)
    switch (s.glyph) {
      case 'surface':
        for (const mesh of meshes) swapMaterials(mesh, `surface:${s.surface ?? ''}`, (copy) => {
          if (!(copy instanceof THREE.MeshStandardMaterial)) return copy
          if (s.surface) copy.userData.asciiSurface = s.surface
          return surfaceMaterial(copy)
        })
        return
      case 'screen':
        for (const mesh of meshes) swapMaterials(mesh, `screen:${s.surface ?? 'actor'}`, (copy) => markScreen(copy, s.surface ?? 'actor'))
        return
      case 'body': {
        const ramp = s.surface ? BODY_RAMPS[s.surface] : undefined
        const scenery = ramp && ramp !== 'actor'
        glyphBody(meshes, bodies, s.size ?? (scenery ? .19 : .155), 'actor', ramp)
        return
      }
      case 'carpet':
        for (const mesh of nodes) {
          if (!carpets.some((c) => c.mesh === mesh)) throw new Error('ascii-engine: carpet precisa vir de engine.createCarpet()')
          carpetScene.add(mesh)
        }
        return
      case 'particle':
        for (const mesh of nodes) {
          if (!clouds.some((c) => c.mesh === mesh)) throw new Error('ascii-engine: particle precisa vir de engine.createParticles()')
          particleScene.add(mesh)
        }
        return
      case 'water':
        throw new Error('ascii-engine: a técnica water chega na fase 2')
    }
  }

  function unapply(entry: Entry) {
    const meshes: THREE.Mesh[] = []
    entry.object.traverse((node) => { if (node instanceof THREE.Mesh) meshes.push(node) })
    for (const mesh of meshes) {
      if (mesh.userData.glyphBodyMaterial) removeGlyphBody(mesh)
      if (mesh.userData.asciiOriginal) { mesh.material = mesh.userData.asciiOriginal; delete mesh.userData.asciiOriginal }
    }
  }

  const debug = { raw: false }
  const engine = {
    /** `raw`: draw the 3D scene without letters, to separate geometry from shader. */
    debug,
    renderer, scene, camera, carpetScene, waterScene, particleScene,
    lights: { hemisphere, moon, fill },
    get style() { return style },
    get time() { return time },

    /**
     * Adds an object with a declared technique. Style layers, most specific
     * last: preset → `type` → type part → node `userData` → these options →
     * `parts[name]`. Parts are matched by node name and cover the subtree.
     */
    add<T extends THREE.Object3D>(object: T, options: AddOptions = {}): T {
      const entry: Entry = { object, options: { ...options, parts: { ...options.parts } } }
      const isLayer = object.userData.glyph === 'carpet' || object.userData.glyph === 'particle'
      if (!isLayer && !object.parent) scene.add(object)
      apply(entry)
      entries.set(object, entry)
      return object
    },
    remove(object: THREE.Object3D) {
      const entry = entries.get(object)
      if (entry) { unapply(entry); entries.delete(object) }
      object.removeFromParent()
    },
    /** Changes one part of one instance ("only this crown") and re-applies it. */
    setPartStyle(object: THREE.Object3D, part: string, partStyle: GlyphStyle) {
      const entry = entries.get(object)
      if (!entry) throw new Error('ascii-engine: objeto não foi adicionado com engine.add')
      entry.options.parts = { ...entry.options.parts, [part]: { ...entry.options.parts?.[part], ...partStyle } }
      unapply(entry); apply(entry)
    },
    /** Registers or changes an object type; `part` changes that part in every instance. */
    setTypeStyle(typeName: string, typeStyle: ObjectTypeStyle) {
      const previous = types[typeName]
      types[typeName] = { style: { ...previous?.style, ...typeStyle.style }, parts: { ...previous?.parts } }
      for (const [part, partStyle] of Object.entries(typeStyle.parts ?? {})) types[typeName].parts![part] = { ...previous?.parts?.[part], ...partStyle }
      for (const entry of entries.values()) if (entry.options.type === typeName) { unapply(entry); apply(entry) }
    },
    getTypeStyle(typeName: string): ObjectTypeStyle | undefined { return types[typeName] },

    /** A carpet of standing letters; add `carpet.mesh` with `{ glyph: 'carpet' }`. */
    createCarpet(cover: GroundCover, seed = 48017) {
      let s = seed
      const carpet = createCarpet(() => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }, cover)
      shareIllumination(carpet.uniforms)
      carpet.uniforms.brightness.value = style.brightness
      carpets.push(carpet)
      return carpet
    },
    /**
     * A letter buffer refilled every frame (`clear` → `push` → render commits).
     * Effects and future emitters (§3.3) write into it.
     */
    createParticles(capacity = 1600) {
      const cloud = createGlyphCloud(capacity)
      shareIllumination(cloud.uniforms)
      cloud.mesh.renderOrder = 2
      clouds.push(cloud)
      const size = renderer.getDrawingBufferSize(new THREE.Vector2())
      cloud.occludeWith(depth, size.x, size.y)
      return cloud
    },

    setStyle(next: Partial<AsciiStyle>) {
      const interior = style.interior
      style = { ...style, ...next }
      if (next.types) Object.assign(types, next.types)
      applyStyle()
      if (style.interior !== interior) {
        illumination.dispose()
        illumination = createIllumination({ interior: style.interior, obstacles: options.obstacles })
        shareIllumination(ascii.material.uniforms)
        for (const carpet of carpets) shareIllumination(carpet.uniforms)
        for (const cloud of clouds) shareIllumination(cloud.uniforms)
      }
    },
    /** Warm local lights that pick letters: the hero's lantern and the hearth. */
    setLights(next: { lantern?: THREE.Vector3 | null; hearth?: THREE.Vector3 | null; hearthPower?: number }) {
      if (next.lantern !== undefined) { lantern.on = !!next.lantern; lantern.position.copy(next.lantern ?? ABSENT) }
      if (next.hearth !== undefined) { hearth.on = !!next.hearth; hearth.position.copy(next.hearth ?? ABSENT) }
      if (next.hearthPower !== undefined) hearth.power = next.hearthPower
    },
    /** Hero and foe: grass parts around them, contact shadow under them. */
    setActors(next: { hero?: THREE.Vector3 | null; foe?: THREE.Vector3 | null; foeHeight?: number }) {
      if (next.hero !== undefined) actors.hero = next.hero
      if (next.foe !== undefined) actors.foe = next.foe
      if (next.foeHeight !== undefined) actors.foeHeight = next.foeHeight
    },
    /** Isometric framing: `focus + (sin a·15, 18, cos a·15)`, `a = π/7` by default. */
    frame(target: THREE.Vector3, span: number, angle = Math.PI / 7) {
      focus.copy(target)
      const aspect = width / height
      camera.left = -span * aspect; camera.right = span * aspect; camera.top = span; camera.bottom = -span
      camera.position.set(target.x + Math.sin(angle) * 15, target.y + 18, target.z + Math.cos(angle) * 15)
      camera.lookAt(target); camera.updateProjectionMatrix(); camera.updateMatrixWorld()
    },
    get size() { return { width, height } },
    resize,

    /** One frame. `dt` is clamped to [0, .08] (a negative step once blew up poses). */
    render(dt: number) {
      if (canvas.clientWidth !== width || canvas.clientHeight !== height) resize()
      dt = THREE.MathUtils.clamp(dt, 0, .08)
      time += dt
      camera.updateMatrixWorld()
      illumination.place(lantern.on ? lantern.position : null, hearth.on ? hearth.position : null)
      illumination.update(time, dt)
      const uniforms = ascii.material.uniforms
      uniforms.cellSize.value = style.cellSize
      uniforms.brightness.value = style.brightness
      uniforms.inverseProjection.value.copy(camera.projectionMatrixInverse)
      uniforms.cameraWorld.value.copy(camera.matrixWorld)
      const contacts = uniforms.contacts.value as THREE.Vector4[]
      if (actors.hero) contacts[0].set(actors.hero.x, actors.hero.z, .55, 1); else contacts[0].set(100, 100, 0, 0)
      if (actors.foe) contacts[1].set(actors.foe.x, actors.foe.z, Math.max(.5, actors.foeHeight * .45), 1); else contacts[1].set(100, 100, 0, 0)
      updateGlyphBodies(bodies, camera, height, lantern.position, lantern.on ? style.bodyLantern : 0, hearth.position, hearth.on ? hearth.power : 0, style.bodyAmbient)
      const hero = actors.hero ?? new THREE.Vector3(100, 0, 100)
      for (const carpet of carpets) carpet.update(time, hero, actors.foe, camera, focus, style.atmosphere, style.brightness)
      for (const cloud of clouds) cloud.commit(height, camera, style.brightness)

      // Draw order (visual-pipeline §2, recreate-from-zero step 10).
      renderer.autoClear = true
      if (debug.raw) { renderer.setRenderTarget(null); renderer.render(scene, camera); return }
      renderer.setRenderTarget(target); renderer.render(scene, camera)
      renderer.setRenderTarget(null); renderer.render(ascii.scene, ascii.camera)
      renderer.autoClear = false
      renderer.render(carpetScene, camera); renderer.render(waterScene, camera); renderer.render(particleScene, camera)
      renderer.autoClear = true
    },

    dispose() {
      for (const entry of entries.values()) unapply(entry)
      for (const carpet of carpets) carpet.dispose()
      for (const cloud of clouds) cloud.dispose()
      for (const byKey of materialCache.values()) for (const m of byKey.values()) m.dispose()
      illumination.dispose(); moon.shadow.dispose(); depth.dispose(); target.dispose(); ascii.dispose(); renderer.dispose()
    },
  }
  resize()
  return engine
}

export type AsciiEngine = ReturnType<typeof createAsciiEngine>
