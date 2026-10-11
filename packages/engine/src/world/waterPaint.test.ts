import { describe, expect, it } from 'vitest'
import { createWaterPaint, paintWater, waterHeightAt } from './waterPaint'
import { waterEdge } from '../techniques/water'
import { parseScene } from './validation'
import { createTerrain, createTerrainData } from './terrain'
import { terrainCover } from './scene'

describe('freehand water', () => {
  it('sweeps an uninterrupted channel, preserves dry land and erases part of a stroke', () => {
    const shape = createWaterPaint(16, 65)
    paintWater(shape, {x:-5,z:0}, {x:5,z:0}, .8)
    for (let x = -5; x <= 5; x += .25) expect(waterEdge(shape, x, 0)).toBeGreaterThan(.7)
    expect(waterEdge(shape, 0, 2)).toBeLessThan(0)
    paintWater(shape, {x:0,z:0}, {x:0,z:0}, 1, true)
    expect(waterEdge(shape, 0, 0)).toBeLessThan(0)
    expect(waterEdge(shape, -4, 0)).toBeGreaterThan(0)
    expect(waterEdge(shape, 20, 0)).toBeLessThan(0)
  })
  it('handles transformed masks and survives scene export/import', () => {
    const shape = createWaterPaint(12, 49); shape.x = 8; shape.z = -4; shape.angle = Math.PI / 3
    paintWater(shape, {x:7,z:-4}, {x:10,z:-2}, .75)
    const scene = parseScene(JSON.parse(JSON.stringify({version:1,objects:[],waters:[{shape}]})))
    expect(waterEdge(scene.waters![0].shape, 8.5, -3)).toBeGreaterThan(.6)
    expect(waterEdge(scene.waters![0].shape, 0, 0)).toBeLessThan(0)
    expect(() => parseScene({version:1,objects:[],waters:[{shape:{...shape,mask:{resolution:4,values:[1]}}}]})).toThrow()
  })
  it('follows a hillside and removes grass from wet high ground', () => {
    const data = createTerrainData(16, 65)
    data.heights = data.heights.map((_,i) => (i % 65) / 64 * 5)
    const terrain = createTerrain(data), shape = createWaterPaint(16, 65)
    shape.mask!.heights = data.heights.map(h => h + .045)
    paintWater(shape, {x:-6,z:0}, {x:6,z:0}, .8)
    expect(waterHeightAt(shape, 4, 0)).toBeCloseTo(terrain.heightAt(4,0)+.045)
    expect(waterHeightAt(shape, 4, 0)).toBeGreaterThan(waterHeightAt(shape,-4,0))
    const cover = terrainCover(terrain, 100, [{shape,level:0}])
    expect(cover.density!(4,0)).toBe(0)
    expect(cover.density!(4,3)).toBeGreaterThan(0)
    terrain.dispose()
    const bad = structuredClone(shape); bad.mask!.heights = [Infinity]
    expect(() => parseScene({version:1,objects:[],waters:[{shape:bad}]})).toThrow()
  })
})
