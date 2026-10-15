import { describe, expect, it } from 'vitest'
import { createChunkStreamer } from './chunks'
import { createCircuit } from './circuit'
import { waterEdge } from '../techniques/water'

describe('circuit', () => {
  it('closes without a seam and rounds to whole chunks', () => {
    const loop = createCircuit(1590)
    expect(loop.length).toBe(1600)
    const a = loop.point(0),
      b = loop.point(loop.length)
    expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(1e-6)
  })
  it('finds the arc length and the offset of points on the line', () => {
    const loop = createCircuit(800)
    for (const s of [10, 200, 555]) {
      const p = loop.point(s)
      expect(Math.abs(loop.offset(p.x, p.z))).toBeLessThan(1e-6)
      expect(Math.abs(loop.nearest(p.x, p.z) - s)).toBeLessThan(1e-6)
    }
  })
})

describe('chunk streamer', () => {
  it('keeps -1..+2 around the current chunk and wraps', () => {
    const built: number[] = [],
      dropped: number[] = []
    const streamer = createChunkStreamer({
      count: 10,
      build: k => {
        built.push(k)
        return k
      },
      dispose: (_, k) => dropped.push(k),
    })
    streamer.update(0)
    expect([...streamer.chunks.keys()].sort((a, b) => a - b)).toEqual([0, 1, 2, 9])
    streamer.update(1)
    expect(dropped).toEqual([9])
    expect([...streamer.chunks.keys()].sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
    expect(streamer.ring(9, 1)).toBe(2)
  })
})

describe('water shape', () => {
  it('is inside at the centre of a pond and outside far away', () => {
    const pond = { kind: 'pond' as const, x: 2, z: 3, angle: 0.4, size: 3 }
    expect(waterEdge(pond, 2, 3)).toBeGreaterThan(2)
    expect(waterEdge(pond, 12, 3)).toBeLessThan(0)
  })
})
