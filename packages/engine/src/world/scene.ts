import * as THREE from 'three'
import type { AddOptions, AsciiEngine } from '../engine'
import type { AsciiStyle } from '../config'
import type { ObjectTypeStyle } from '../style'
import type { GroundCover } from '../techniques/carpet'
import { waterHeightAt } from './waterPaint'
import { waterEdge, type Water, type WaterLook, type WaterShape } from '../techniques/water'
import { createTerrain, type Terrain, type TerrainData } from './terrain'
import { parseScene } from './validation'
import { createSceneWeather, type SceneEnvironment } from '../weather/sceneWeather'
import { createEffectPrefabs } from '../fx/prefabs'
import type { EffectDef } from '../fx/effects'
import type { AtmosphereAsset } from './atmosphere'
import type { SceneCamera } from './camera'
import type { TextureAsset } from './texture'

/**
 * Scenes as JSON (phase 5): terrain, waters, a carpet and objects placed from
 * a prefab library, loadable by the engine without the editor. A prefab is a
 * reusable set (bonfire, bridge, tree…); editing the prefab's type style
 * changes every copy, a copy can override parts (§3.1).
 */
export interface PlacedObject {
  id?: string
  name?: string
  seed?: number
  visible?: boolean
  prefab: string
  position: [number, number, number]
  /** Turn around y (radians) and uniform scale. */
  rotation?: number
  scale?: number
  rotation3?: [number, number, number]
  scale3?: [number, number, number]
  animation?: string | null
  /** Instance layer and parts of this copy. */
  options?: AddOptions
}

export interface SceneWater { shape: WaterShape; look?: Partial<WaterLook>; level?: number; physics?: Partial<import('./waterDynamics').WaterPhysics> }

export interface SceneDoc {
  version: 1
  name?: string
  style?: Partial<AsciiStyle>
  terrain?: TerrainData
  waters?: SceneWater[]
  /** Standing letters over painted grass layers. */
  carpet?: { count: number; seed?: number }
  objects: PlacedObject[]
  /** Portable model sources; keys are prefab ids. No machine-specific paths. */
  assets?: Record<string, { name: string; source: string }>
  /** User-authored visual effects; keys are portable prefab ids (fx:custom-*). */
  effects?: Record<string, EffectDef>
  /** Saved lighting presets in the document's resource library. */
  atmospheres?: Record<string, AtmosphereAsset>
  /** Reusable object/part appearances, saved by the texture studio. */
  textures?: Record<string, TextureAsset>
  cameras?: Record<string, SceneCamera>
  /** Initial composition when opening this document in the player. */
  activeCamera?: string
  environment?: SceneEnvironment
}

export interface Prefab {
  title: string
  create(context: { seed: number; random: () => number; item: PlacedObject }): THREE.Object3D
  /** Type style shared by every copy (registered as object type = prefab name). */
  style?: ObjectTypeStyle
  /** Per-frame animation of one copy. */
  update?(object: THREE.Object3D, time: number): void
  dispose?(object: THREE.Object3D): void
}
export type PrefabLibrary = Record<string, Prefab>

export function emptyScene(name = 'scene'): SceneDoc { return { version: 1, name, objects: [] } }

export function seededRandom(seed: number) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
}

const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]
/** Meadow blades over a terrain: density from the painted layer, height from the relief. */
export function terrainCover(terrain: Terrain, count: number, waterLevel: number | SceneWater[] = -Infinity): GroundCover {
  return {
    count, extent: terrain.data.size, y: (x, z) => terrain.heightAt(x, z) - .06,
    density: (x, z) => terrain.grassAt(x, z, typeof waterLevel === 'number' ? waterLevel : Math.max(-Infinity, ...waterLevel.filter(w => waterEdge(w.shape, x, z) > 0).map(w => waterHeightAt(w.shape, x, z, w.level ?? 0)))),
    pick(random) {
      const flower = random() < .012, shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: .12 + random() * .16, color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
}

/** Builds a scene document into the engine. */
export function buildScene(engine: AsciiEngine, source: SceneDoc, library: PrefabLibrary) {
  const doc = parseScene(source, library)
  library = { ...library, ...createEffectPrefabs(engine, doc.effects) }
  const previousStyle = engine.exportStyle()
  let terrain: Terrain | undefined
  let carpet: ReturnType<AsciiEngine['createCarpet']> | undefined
  let weather: ReturnType<typeof createSceneWeather> | undefined
  const waters: Water[] = []
  const placed: { doc: PlacedObject; object: THREE.Object3D }[] = []
  function dispose() {
    weather?.dispose()
    for (const p of placed) { library[p.doc.prefab]?.dispose?.(p.object); engine.remove(p.object, { dispose: true }) }
    if (terrain) engine.remove(terrain.mesh, { dispose: true })
    for (const w of waters) engine.remove(w.mesh, { dispose: true })
    if (carpet) engine.remove(carpet.mesh, { dispose: true })
  }
  try {
    for (const [name, prefab] of Object.entries(library)) if (prefab.style || doc.style?.types?.[name]?.authored) engine.setTypeStyle(name, prefab.style ?? {})
    if (doc.style) engine.setStyle(doc.style)
    terrain = doc.terrain ? createTerrain(doc.terrain) : undefined
    if (terrain) engine.add(terrain.mesh)
    for (const entry of doc.waters ?? []) {
      const water = engine.createWater(entry.shape, { look: entry.look, level: entry.level, physics: entry.physics })
      waters.push(water)
      engine.add(water.mesh, { glyph: 'water' })
    }
    doc.objects.forEach(place)
    carpet = doc.carpet && terrain ? engine.createCarpet(terrainCover(terrain, doc.carpet.count, doc.waters ?? []), doc.carpet.seed) : undefined
    if (carpet) engine.add(carpet.mesh, { glyph: 'carpet' })
    weather = createSceneWeather(engine, doc.environment, doc.terrain?.size)
  } catch (error) { dispose(); engine.setStyle(previousStyle, { replace: true }); throw error }
  function place(item: PlacedObject) {
    const prefab = library[item.prefab]
    if (!prefab) throw new Error(`ascii-engine: unknown prefab "${item.prefab}"`)
    const seed = item.seed ?? 48017
    const object = prefab.create({ seed, random: seededRandom(seed), item })
    object.position.set(...item.position); object.rotation.y = item.rotation ?? 0; object.scale.setScalar(item.scale ?? 1)
    if (item.rotation3) object.rotation.set(...item.rotation3)
    if (item.scale3) object.scale.set(...item.scale3)
    object.visible = item.visible ?? true
    object.name = item.name ?? prefab.title
    object.userData.sceneId = item.id
    object.userData.prefab = item.prefab
    try { engine.add(object, { type: prefab.style || doc.style?.types?.[item.prefab]?.authored ? item.prefab : undefined, ...item.options }) }
    catch (error) { prefab.dispose?.(object); engine.remove(object, { dispose: true }); throw error }
    placed.push({ doc: item, object })
    return object
  }

  return {
    terrain, waters, placed,
    /** Adds one object to the scene (and to the document). */
    place(item: PlacedObject) {
      const next = parseScene({ version: 1, objects: [{ ...item, id: item.id ?? crypto.randomUUID(), seed: item.seed ?? Math.floor(Math.random() * 4294967296) }] }, library).objects[0]
      const object = place(next)
      doc.objects.push(next)
      return object
    },
    /** Removes one placed object. */
    remove(object: THREE.Object3D) {
      const i = placed.findIndex((p) => p.object === object)
      if (i < 0) return
      doc.objects.splice(doc.objects.indexOf(placed[i].doc), 1)
      library[placed[i].doc.prefab]?.dispose?.(object)
      placed.splice(i, 1)
      engine.remove(object, { dispose: true })
    },
    /** Adds a water body (e.g. dug by the lake brush). */
    addWater(entry: SceneWater) {
      parseScene({ version: 1, objects: [], waters: [entry] })
      const water = engine.createWater(entry.shape, { look: entry.look, level: entry.level, physics: entry.physics })
      engine.add(water.mesh, { glyph: 'water' }); waters.push(water)
      doc.waters = [...doc.waters ?? [], entry]
      return water
    },
    /** Rebuilds the carpet after painting (blades are generated once). */
    regrow(count = doc.carpet?.count ?? 40000) {
      if (!terrain) return
      if (carpet) engine.remove(carpet.mesh, { dispose: true })
      doc.carpet = { count, seed: doc.carpet?.seed }
      carpet = engine.createCarpet(terrainCover(terrain, count, doc.waters ?? []), doc.carpet.seed)
      engine.add(carpet.mesh, { glyph: 'carpet' })
    },
    update(time: number) {
      weather?.update(time)
      for (const p of placed) {
        library[p.doc.prefab]?.update?.(p.object, time)
        if (p.object.visible) for (const water of waters) water.interact(p.object.uuid, p.object.position)
      }
    },
    /** The document, with the terrain as edited. */
    toJSON(): SceneDoc {
      return JSON.parse(JSON.stringify({
        ...doc, style: engine.exportStyle(), terrain: terrain?.toJSON() ?? doc.terrain,
        objects: placed.map(({ doc: item, object }) => ({
          ...item, name: object.name, visible: object.visible,
          position: object.position.toArray(), rotation3: [object.rotation.x, object.rotation.y, object.rotation.z], scale3: object.scale.toArray(),
          options: engine.instanceStyle(object),
        })),
      }))
    },
    dispose,
  }
}
export type BuiltScene = ReturnType<typeof buildScene>

/* ---------- Chunks with edge connectors and rule-based generation ---------- */

/** Connector names on each edge (e.g. 'trilha', 'riacho', 'mato'); equal names join. */
export interface Connectors { n: string; e: string; s: string; w: string }
export interface ChunkDef {
  id: string
  connectors: Connectors
  /** Relative frequency, biome tags and the scene content (relative to the chunk origin). */
  weight?: number
  biome?: string
  scene?: SceneDoc
}
export interface ChunkCell { id: string; x: number; z: number }

/** Turns a chunk's connectors a quarter turn clockwise `times` times. */
export function rotateConnectors(c: Connectors, times: number): Connectors {
  let r = c
  for (let i = 0; i < ((times % 4) + 4) % 4; i++) r = { n: r.w, e: r.n, s: r.e, w: r.s }
  return r
}

/**
 * Lays chunks on a grid so neighbouring connectors match (backtracking,
 * weighted by `weight`, deterministic for a seed). `fixed` pins chunks (the
 * camp at the start); `edge` is the connector required on the outer border.
 */
export function generateChunkGrid(options: { library: ChunkDef[]; width: number; height: number; seed: number; fixed?: ChunkCell[]; edge?: string; biome?: string }) {
  const { width, height } = options
  const library = options.biome ? options.library.filter((c) => !c.biome || c.biome === options.biome) : options.library
  let seed = options.seed >>> 0 || 1
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const byId = new Map(library.map((c) => [c.id, c]))
  const grid: (ChunkDef | undefined)[] = new Array(width * height)
  const fixed = new Map((options.fixed ?? []).map((f) => [f.z * width + f.x, f.id]))
  const fits = (c: ChunkDef, x: number, z: number) => {
    const left = x > 0 ? grid[z * width + x - 1] : undefined, up = z > 0 ? grid[(z - 1) * width + x] : undefined
    if (left && left.connectors.e !== c.connectors.w) return false
    if (up && up.connectors.s !== c.connectors.n) return false
    if (options.edge !== undefined) {
      if (x === 0 && c.connectors.w !== options.edge) return false
      if (z === 0 && c.connectors.n !== options.edge) return false
      if (x === width - 1 && c.connectors.e !== options.edge) return false
      if (z === height - 1 && c.connectors.s !== options.edge) return false
    }
    // A pinned neighbour to the right or below must still be reachable.
    const right = fixed.get(z * width + x + 1), down = fixed.get((z + 1) * width + x)
    if (x + 1 < width && right && byId.get(right)?.connectors.w !== c.connectors.e) return false
    if (z + 1 < height && down && byId.get(down)?.connectors.n !== c.connectors.s) return false
    return true
  }
  let steps = 0
  const solve = (cell: number): boolean => {
    if (cell === width * height) return true
    if (++steps > 200000) return false
    const x = cell % width, z = Math.floor(cell / width)
    const pinned = fixed.get(cell)
    let candidates = pinned ? [byId.get(pinned)!].filter(Boolean) : library.filter((c) => fits(c, x, z))
    if (pinned && candidates.length && !fits(candidates[0], x, z)) candidates = []
    // Weighted shuffle.
    const order = candidates.map((c) => ({ c, k: Math.pow(random(), 1 / Math.max(.001, c.weight ?? 1)) })).sort((a, b) => b.k - a.k)
    for (const { c } of order) {
      grid[cell] = c
      if (solve(cell + 1)) return true
    }
    grid[cell] = undefined
    return false
  }
  if (!solve(0)) return undefined
  return grid.map((c, i) => ({ id: c!.id, x: i % width, z: Math.floor(i / width) }))
}
