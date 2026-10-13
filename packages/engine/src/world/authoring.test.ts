import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { createHistory } from './history'
import { parseScene } from './validation'
import { seededRandom, terrainCover } from './scene'
import { createTerrain, createTerrainData } from './terrain'
import { pomorog } from '../presets/pomorog'
import type { PrefabLibrary } from './scene'

const library: PrefabLibrary = { tree: { title: 'Árvore', create: () => new THREE.Group() } }
const legacy = { version: 1, objects: [{ prefab: 'tree', position: [1, 2, 3] }] }

describe('portable scene validation', () => {
  it('normalizes old documents without mutating them, with stable identities and geometry seeds', () => {
    const a = parseScene(legacy, library), b = parseScene(legacy, library)
    expect(a).toEqual(b)
    expect(legacy.objects[0]).not.toHaveProperty('seed')
    const randomA = seededRandom(a.objects[0].seed!), randomB = seededRandom(b.objects[0].seed!)
    expect(Array.from({ length: 100 }, randomA)).toEqual(Array.from({ length: 100 }, randomB))
    a.objects[0].position[0] = 50
    expect(legacy.objects[0].position[0]).toBe(1)
  })
  it('supports terrainless items, explicit transforms, embedded sources and saved styles', () => {
    const doc = parseScene({ ...legacy, style: structuredClone(pomorog), assets: { asset: { name: 'item.glb', source: 'data:model/gltf-binary;base64,AA==' } }, objects: [{ ...legacy.objects[0], scale3: [1, 2, 3], rotation3: [0, 1, 2], options: { parts: { crown: { glyph: 'body', size: .22 } } } }] })
    expect(doc.terrain).toBeUndefined()
    expect(doc.objects[0].options?.parts?.crown.size).toBe(.22)
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
  })
  it('preserves surface letter size and RGB colour overrides and rejects invalid colours', () => {
    const doc = parseScene({ ...legacy, objects: [{ ...legacy.objects[0], options: { glyph: 'surface', size: .4, color: 0x15aa55, parts: { crown: { color: 0x000000 } } } }] })
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
    for (const color of [-1, 0x1000000, .5, 'red']) expect(() => parseScene({ ...legacy, objects: [{ ...legacy.objects[0], options: { color } }] })).toThrow('Invalid scene')
  })
  it('round-trips named atmosphere assets without applying them to the scene', () => {
    const input = { ...legacy, atmospheres: { sunset: { name: 'Sunset', style: { background: 0x221100, fog: null, inkTint: [1,.7,.5] } } } }
    const doc = parseScene(input, library)
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
    expect(doc.style).toBeUndefined()
    doc.atmospheres!.sunset.style.inkTint![0] = .4
    expect(input.atmospheres.sunset.style.inkTint[0]).toBe(1)
  })
  it.each([
    { ...legacy, version: 2 },
    { ...legacy, objects: [{ prefab: 'missing', position: [0, 0, 0] }] },
    { ...legacy, objects: [{ prefab: 'tree', position: [0, NaN, 0] }] },
    { ...legacy, objects: [{ prefab: 'tree', position: [0, 0, 0], scale3: [0, 1, 1] }] },
    { ...legacy, terrain: { ...createTerrainData(8, 5), heights: [0] } },
    { ...legacy, waters: [{ shape: { kind: 'pond', x: 0, z: 0, angle: 0, size: 1 }, look: { cell: [0, 1] } }] },
    { ...legacy, style: { moon: { position: 'invalid' } } },
    { ...legacy, environment: { weather: 'rain', intensity: 2 } },
    { ...legacy, atmospheres: { dusk: { name: '', style: {} } } },
    { ...legacy, atmospheres: { dusk: { name: 'Dusk', style: { brightness: -1 } } } },
    { ...legacy, atmospheres: { dusk: { name: 'Dusk', style: { types: {} } } } },
    JSON.parse('{"version":1,"objects":[],"__proto__":{"polluted":true}}'),
  ])('rejects invalid data before it can reach scene allocation (%#)', input => expect(() => parseScene(input, library)).toThrow('Invalid scene'))
})

describe('document history', () => {
  it('undoes an entire brush stroke, restores a redo, and discards the old future after a new edit', () => {
    const doc = { terrain: createTerrainData(8, 5), name: 'A' }, history = createHistory(doc, 2)
    doc.terrain.heights[12] = 1; doc.terrain.heights[13] = 2
    history.commit(doc)
    expect(history.undo().terrain.heights[12]).toBe(0)
    expect(history.redo().terrain.heights[13]).toBe(2)
    history.undo(); doc.name = 'B'; history.commit(doc)
    expect(history.canRedo).toBe(false)
    const current = history.current(); current.name = 'mutated'
    expect(history.current().name).toBe('B')
    expect(history.commit(doc)).toBe(false)
  })
  it('bounds retained actions without corrupting the oldest snapshot', () => {
    const history = createHistory({ n: 0 }, 2)
    for (let n = 1; n <= 4; n++) history.commit({ n })
    expect(history.undo()).toEqual({ n: 3 }); expect(history.undo()).toEqual({ n: 2 })
    expect(history.canUndo).toBe(false)
  })
  it('evicts large previous snapshots while retaining the current document', () => {
    const history = createHistory({ text: 'a'.repeat(50) }, 30, 150)
    history.commit({ text: 'b'.repeat(50) })
    expect(history.canUndo).toBe(false)
    expect(history.current().text).toBe('b'.repeat(50))
  })
})

it('water only masks grass within its contour', () => {
  const terrain = createTerrain(createTerrainData(16, 17))
  const cover = terrainCover(terrain, 100, [{ shape: { kind: 'pond', x: 0, z: 0, angle: 0, size: 2 }, level: .1 }])
  expect(cover.density!(0, 0)).toBe(0)
  expect(cover.density!(6, 6)).toBeGreaterThan(0)
  terrain.dispose()
})
