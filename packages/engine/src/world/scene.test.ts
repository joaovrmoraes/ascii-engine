import { describe, expect, it } from 'vitest'
import { generateChunkGrid, rotateConnectors, type ChunkDef } from './scene'
import { createTerrainData } from './terrain'

const library: ChunkDef[] = [
  { id: 'reta', connectors: { n: 'mato', e: 'trilha', s: 'mato', w: 'trilha' } },
  { id: 'curva', connectors: { n: 'trilha', e: 'mato', s: 'mato', w: 'trilha' } },
  { id: 'curva2', connectors: { n: 'mato', e: 'trilha', s: 'trilha', w: 'mato' } },
  { id: 'vertical', connectors: { n: 'trilha', e: 'mato', s: 'trilha', w: 'mato' } },
  { id: 'mato', connectors: { n: 'mato', e: 'mato', s: 'mato', w: 'mato' }, weight: 2 },
  { id: 'lago', connectors: { n: 'mato', e: 'mato', s: 'mato', w: 'mato' }, biome: 'floresta' },
]

describe('chunk generation', () => {
  it('matches every shared edge and the outer border', () => {
    const grid = generateChunkGrid({ library, width: 5, height: 4, seed: 7, edge: 'mato' })!
    expect(grid).toHaveLength(20)
    const at = (x: number, z: number) => library.find(c => c.id === grid[z * 5 + x].id)!
    for (let z = 0; z < 4; z++)
      for (let x = 0; x < 5; x++) {
        if (x < 4) expect(at(x, z).connectors.e).toBe(at(x + 1, z).connectors.w)
        if (z < 3) expect(at(x, z).connectors.s).toBe(at(x, z + 1).connectors.n)
        if (x === 0) expect(at(x, z).connectors.w).toBe('mato')
      }
  })
  it('is deterministic for a seed and keeps pinned chunks', () => {
    const a = generateChunkGrid({
      library,
      width: 4,
      height: 4,
      seed: 3,
      fixed: [{ x: 1, z: 1, id: 'reta' }],
    })
    const b = generateChunkGrid({
      library,
      width: 4,
      height: 4,
      seed: 3,
      fixed: [{ x: 1, z: 1, id: 'reta' }],
    })
    expect(a).toEqual(b)
    expect(a![5].id).toBe('reta')
  })
  it('filters by biome and rotates connectors', () => {
    const grid = generateChunkGrid({ library, width: 3, height: 3, seed: 1, biome: 'pantano' })!
    expect(grid.some(c => c.id === 'lago')).toBe(false)
    expect(rotateConnectors({ n: 'a', e: 'b', s: 'c', w: 'd' }, 1)).toEqual({
      n: 'd',
      e: 'a',
      s: 'b',
      w: 'c',
    })
  })
})

describe('terrain data', () => {
  it('starts flat and fully painted with the first layer', () => {
    const data = createTerrainData(8, 5)
    expect(data.heights.every(h => h === 0)).toBe(true)
    expect(data.paint.slice(0, 4)).toEqual([255, 0, 0, 0])
  })
})

import { createTerrain } from './terrain'
describe('terrain brushes', () => {
  it('raises, smooths, paints and digs', () => {
    const terrain = createTerrain(createTerrainData(16, 33))
    terrain.apply({ brush: 'raise', x: 0, z: 0, radius: 3, strength: 2 })
    expect(terrain.heightAt(0, 0)).toBeCloseTo(2, 1)
    expect(terrain.heightAt(6, 6)).toBe(0)
    const peak = terrain.heightAt(0, 0)
    terrain.apply({ brush: 'smooth', x: 0, z: 0, radius: 3, strength: 1 })
    expect(terrain.heightAt(0, 0)).toBeLessThan(peak)
    terrain.apply({ brush: 'paint', x: 4, z: 4, radius: 1.5, strength: 1, layer: 2 })
    expect(terrain.layerAt(4, 4)).toBe(2)
    expect(terrain.grassAt(4, 4)).toBe(0)
    terrain.apply({ brush: 'dig', x: -5, z: -5, radius: 2, strength: 0.6 })
    expect(terrain.heightAt(-5, -5)).toBeLessThan(-0.5)
    expect(JSON.parse(JSON.stringify(terrain.toJSON())).heights).toHaveLength(33 * 33)
  })
})
