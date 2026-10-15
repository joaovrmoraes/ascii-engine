import { describe, expect, it } from 'vitest'
import { createTerrain, createTerrainData } from './terrain'
import { seededRandom, terrainCover } from './scene'
import { parseScene } from './validation'
import { waterAlphabetLayout, DEFAULT_WATER_LOOK } from '../techniques/water'

describe('optional component letter looks', () => {
  it('round-trips optional water identity/visibility and rejects incorrect values', () => {
    const water = {
      name: 'My lake',
      visible: false,
      level: 0.7,
      shape: { kind: 'pond', x: 1, z: 2, angle: 0, size: 3 },
    }
    expect(parseScene({ version: 1, objects: [], waters: [water] }).waters![0]).toEqual(water)
    expect(() =>
      parseScene({ version: 1, objects: [], waters: [{ ...water, visible: 0 }] }),
    ).toThrow()
    expect(() =>
      parseScene({ version: 1, objects: [], waters: [{ ...water, name: false }] }),
    ).toThrow()
  })
  it('keeps old documents and legacy water atlases untouched', () => {
    const source = {
      version: 1,
      objects: [],
      terrain: createTerrainData(8, 3),
      waters: [{ shape: { kind: 'pond', x: 0, z: 0, angle: 0, size: 2 } }],
    }
    expect(parseScene(source)).toEqual(source)
    expect(waterAlphabetLayout(DEFAULT_WATER_LOOK).custom).toBe(false)
  })
  it('bounds custom water atlases and keeps every channel range valid', () => {
    const layout = waterAlphabetLayout({
      ...DEFAULT_WATER_LOOK,
      alphabet: '@'.repeat(128),
      foamAlphabet: '*'.repeat(128),
      reflectionAlphabet: 'A'.repeat(128),
      rings: { enabled: true, alphabet: '|'.repeat(128) },
    })
    expect(layout.custom).toBe(true)
    expect(layout.columns).toBe(128)
    expect(layout.rows).toBe(5)
    for (const [start, count] of Object.values(layout.ranges)) {
      expect(start).toBeGreaterThanOrEqual(0)
      expect(start + count).toBeLessThanOrEqual(layout.slots.length)
    }
  })
  it('preserves blade placement/glyph distribution and dimensions when only color changes', () => {
    const plain = createTerrain(createTerrainData(8, 3)),
      data = createTerrainData(8, 3)
    data.layers[0].cover = { color: 0x55aa88 }
    const colored = createTerrain(data),
      original = terrainCover(plain, 10),
      edited = terrainCover(colored, 10)
    const randomA = seededRandom(42),
      randomB = seededRandom(42)
    for (let i = 0; i < 100; i++) {
      const before = original.pick(randomA, 0, 0),
        after = edited.pick(randomB, 0, 0)
      expect(after.glyph).toBe(before.glyph)
      expect(after.height).toBe(before.glyph >= 6 ? 0.1 + before.height * 0.5 : before.height)
      expect(after.width).toBe(before.glyph >= 6 ? 0.16 + before.height * 0.3 : before.height * 0.4)
      expect(randomA()).toBe(randomB())
    }
    plain.dispose()
    colored.dispose()
  })
  it('groups floor triangles by painted layer without multiplying draw calls per triangle', () => {
    const data = createTerrainData(8, 3)
    data.layers[0].look = { alphabet: 'AB' }
    data.paint.fill(0)
    for (let i = 0; i < 9; i++) data.paint[i * 4 + (i % 3 === 2 ? 1 : 0)] = 255
    const terrain = createTerrain(data)
    expect(Array.isArray(terrain.mesh.material)).toBe(true)
    expect(terrain.mesh.geometry.groups).toHaveLength(4)
    expect(terrain.mesh.geometry.groups.reduce((sum, group) => sum + group.count, 0)).toBe(
      terrain.mesh.geometry.index!.count,
    )
    expect(terrain.mesh.geometry.groups[0].count).toBeGreaterThan(0)
    expect(terrain.mesh.geometry.groups[1].count).toBeGreaterThan(0)
    terrain.dispose()
  })
  it.each([
    { look: { glyph: 'body' } },
    { cover: { alphabet: '\n' } },
    { cover: { height: 0 } },
    { cover: { wind: 5 } },
    { cover: { spacing: 1 } },
    { cover: { palette: [1] } },
  ])('rejects unsupported floor/cover data: %j', patch => {
    const terrain = createTerrainData(8, 3)
    Object.assign(terrain.layers[0], patch)
    expect(() => parseScene({ version: 1, objects: [], terrain })).toThrow()
  })
  it.each([
    { alphabet: '' },
    { foamAlphabet: '\n' },
    { reflectionAlphabet: 'A'.repeat(129) },
    { depthScale: 0 },
    { rings: { enabled: 'yes' } },
    { rings: { enabled: true, size: 0 } },
    { shallow: [1, 2] },
    { reflection: { ...DEFAULT_WATER_LOOK.reflection, strength: -1 } },
  ])('rejects invalid water look: %j', look => {
    expect(() =>
      parseScene({
        version: 1,
        objects: [],
        waters: [{ shape: { kind: 'pond', x: 0, z: 0, angle: 0, size: 2 }, look }],
      }),
    ).toThrow()
  })
})
