import * as THREE from 'three'
import type { AddOptions, AsciiEngine } from '../engine'
import type { AsciiStyle } from '../presets/pomorog'
import type { ObjectTypeStyle } from '../style'
import type { GroundCover } from '../techniques/carpet'
import type { Water, WaterLook, WaterShape } from '../techniques/water'
import { createTerrain, type Terrain, type TerrainData } from './terrain'

/**
 * Scenes as JSON (phase 5): terrain, waters, a carpet and objects placed from
 * a prefab library, loadable by the engine without the editor. A prefab is a
 * reusable set (bonfire, bridge, tree…); editing the prefab's type style
 * changes every copy, a copy can override parts (§3.1).
 */
export interface PlacedObject {
  prefab: string
  position: [number, number, number]
  /** Turn around y (radians) and uniform scale. */
  rotation?: number
  scale?: number
  /** Instance layer and parts of this copy. */
  options?: AddOptions
}

export interface SceneWater { shape: WaterShape; look?: Partial<WaterLook>; level?: number }

export interface SceneDoc {
  version: 1
  name?: string
  style?: Partial<AsciiStyle>
  terrain?: TerrainData
  waters?: SceneWater[]
  /** Standing letters over painted grass layers. */
  carpet?: { count: number; seed?: number }
  objects: PlacedObject[]
}

export interface Prefab {
  title: string
  create(): THREE.Object3D
  /** Type style shared by every copy (registered as object type = prefab name). */
  style?: ObjectTypeStyle
  /** Per-frame animation of one copy. */
  update?(object: THREE.Object3D, time: number): void
}
export type PrefabLibrary = Record<string, Prefab>

export function emptyScene(name = 'cenário'): SceneDoc { return { version: 1, name, objects: [] } }

const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]
/** Meadow blades over a terrain: density from the painted layer, height from the relief. */
export function terrainCover(terrain: Terrain, count: number, waterLevel = -Infinity): GroundCover {
  return {
    count, extent: terrain.data.size, y: (x, z) => terrain.heightAt(x, z) - .06,
    density: (x, z) => terrain.grassAt(x, z, waterLevel),
    pick(random) {
      const flower = random() < .012, shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: .12 + random() * .16, color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
}

/** Builds a scene document into the engine. */
export function buildScene(engine: AsciiEngine, doc: SceneDoc, library: PrefabLibrary) {
  if (doc.style) engine.setStyle(doc.style)
  for (const [name, prefab] of Object.entries(library)) if (prefab.style) engine.setTypeStyle(name, prefab.style)
  const terrain = doc.terrain ? createTerrain(doc.terrain) : undefined
  if (terrain) engine.add(terrain.mesh)
  const waters: Water[] = []
  for (const entry of doc.waters ?? []) {
    const water = engine.createWater(entry.shape, { look: entry.look, level: entry.level })
    engine.add(water.mesh, { glyph: 'water' })
    waters.push(water)
  }
  const placed: { doc: PlacedObject; object: THREE.Object3D }[] = []
  function place(item: PlacedObject) {
    const prefab = library[item.prefab]
    if (!prefab) throw new Error(`ascii-engine: prefab desconhecido "${item.prefab}"`)
    const object = prefab.create()
    object.position.set(...item.position); object.rotation.y = item.rotation ?? 0; object.scale.setScalar(item.scale ?? 1)
    object.userData.prefab = item.prefab
    engine.add(object, { type: prefab.style ? item.prefab : undefined, ...item.options })
    placed.push({ doc: item, object })
    return object
  }
  doc.objects.forEach(place)
  let carpet = doc.carpet && terrain ? engine.createCarpet(terrainCover(terrain, doc.carpet.count, lowestWater()), doc.carpet.seed) : undefined
  if (carpet) engine.add(carpet.mesh, { glyph: 'carpet' })
  function lowestWater() { return waters.length ? Math.max(...waters.map((w) => w.mesh.position.y)) : -Infinity }

  return {
    terrain, waters, placed,
    /** Adds one object to the scene (and to the document). */
    place(item: PlacedObject) { doc.objects.push(item); return place(item) },
    /** Removes one placed object. */
    remove(object: THREE.Object3D) {
      const i = placed.findIndex((p) => p.object === object)
      if (i < 0) return
      doc.objects.splice(doc.objects.indexOf(placed[i].doc), 1)
      placed.splice(i, 1)
      engine.remove(object, { dispose: true })
    },
    /** Adds a water body (e.g. dug by the lake brush). */
    addWater(entry: SceneWater) {
      doc.waters = [...doc.waters ?? [], entry]
      const water = engine.createWater(entry.shape, { look: entry.look, level: entry.level })
      engine.add(water.mesh, { glyph: 'water' }); waters.push(water)
      return water
    },
    /** Rebuilds the carpet after painting (blades are generated once). */
    regrow(count = doc.carpet?.count ?? 40000) {
      if (!terrain) return
      if (carpet) engine.remove(carpet.mesh, { dispose: true })
      doc.carpet = { count, seed: doc.carpet?.seed }
      carpet = engine.createCarpet(terrainCover(terrain, count, lowestWater()), doc.carpet.seed)
      engine.add(carpet.mesh, { glyph: 'carpet' })
    },
    update(time: number) { for (const p of placed) library[p.doc.prefab]?.update?.(p.object, time) },
    /** The document, with the terrain as edited. */
    toJSON(): SceneDoc { return { ...doc, terrain: terrain?.toJSON() ?? doc.terrain } },
    dispose() {
      for (const p of placed) engine.remove(p.object, { dispose: true })
      if (terrain) { engine.remove(terrain.mesh); terrain.dispose() }
      for (const w of waters) engine.remove(w.mesh, { dispose: true })
      if (carpet) engine.remove(carpet.mesh, { dispose: true })
    },
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
