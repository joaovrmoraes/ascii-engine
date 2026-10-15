import { describe, expect, it } from 'vitest'
import { createWaterDynamics } from './waterDynamics'
import { parseScene } from './validation'

const volume = (a: Float32Array) => a.reduce((sum, v) => sum + v, 0)
describe('shallow water dynamics', () => {
  it('moves downhill, conserves water in a closed domain and stays finite at a steep drop', () => {
    const n = 33,
      bed = Float32Array.from({ length: n * n }, (_, i) => (i % n < 16 ? 2 : 0))
    const wet = new Uint8Array(n * n).fill(1),
      sim = createWaterDynamics(n, 8, bed, wet, { source: 0, waves: 0 })
    const before = volume(sim.depth)
    for (let i = 0; i < 180; i++) sim.step(1 / 60)
    expect(volume(sim.depth)).toBeCloseTo(before, 3)
    expect(sim.depth.every(h => Number.isFinite(h) && h >= 0)).toBe(true)
    expect(sim.depth[16 * n + 14]).toBeLessThan(0.08)
    expect(sim.depth[16 * n + 18]).toBeGreaterThan(0.08)
    expect(sim.flowX[16 * n + 15]).toBeGreaterThan(0)
  })
  it('propagates an impact into surrounding water without leaking through a dry bank', () => {
    const n = 33,
      wet = Uint8Array.from({ length: n * n }, (_, i) => (i % n < 24 ? 1 : 0))
    const sim = createWaterDynamics(n, 8, new Float32Array(n * n), wet, { source: 0, waves: 0 })
    const before = volume(sim.depth)
    sim.disturb(0, 0, 0.12, 0.5)
    for (let i = 0; i < 90; i++) sim.step(1 / 60)
    expect(Math.abs(sim.depth[16 * n + 20] - 0.08)).toBeGreaterThan(0.0005)
    expect(sim.depth[16 * n + 26]).toBe(0)
    expect(volume(sim.depth)).toBeCloseTo(before, 3)
  })
  it('keeps still water level, allows a pause, and supplies only uphill sources', () => {
    const n = 17,
      bed = Float32Array.from({ length: n * n }, (_, i) => 2 - (i % n) * 0.1),
      wet = new Uint8Array(n * n).fill(1)
    const sim = createWaterDynamics(n, 4, bed, wet, { source: 0.1 })
    const before = volume(sim.depth)
    sim.step(0)
    expect(volume(sim.depth)).toBe(before)
    for (let i = 0; i < 180; i++) sim.step(1 / 60)
    expect(volume(sim.depth)).toBeGreaterThan(before)
    const flat = createWaterDynamics(n, 4, new Float32Array(n * n), wet)
    for (let i = 0; i < 60; i++) flat.step(1 / 60)
    expect(flat.depth.every(h => Math.abs(h - 0.08) < 1e-7)).toBe(true)
  })
  it('exports settings and rejects unstable input', () => {
    const doc = {
      version: 1,
      objects: [],
      waters: [
        {
          shape: { kind: 'pond', x: 0, z: 0, angle: 0, size: 3 },
          physics: { depth: 0.2, source: 0, waves: 0.02 },
        },
      ],
    }
    expect(parseScene(doc).waters![0].physics).toEqual(doc.waters[0].physics)
    expect(() =>
      parseScene({ ...doc, waters: [{ ...doc.waters[0], physics: { depth: -1 } }] }),
    ).toThrow()
  })
  it('keeps a deep calm pool clear and lets old foam disappear without changing its volume', () => {
    const n = 17,
      wet = new Uint8Array(n * n).fill(1)
    const sim = createWaterDynamics(n, 4, new Float32Array(n * n), wet, { source: 0, depth: 0.8 })
    for (let i = 0; i < 120; i++) sim.step(1 / 60)
    expect(sim.foam.every(f => f === 0)).toBe(true)
    const before = volume(sim.depth)
    sim.foam[8 * n + 8] = 0.6
    for (let i = 0; i < 360; i++) sim.step(1 / 60)
    expect(Math.max(...sim.foam)).toBeLessThan(0.001)
    expect(volume(sim.depth)).toBeCloseTo(before, 4)
  })
  it('creates bounded foam at a running drop after several minutes, without covering the pool in foam', () => {
    const n = 17,
      bed = Float32Array.from({ length: n * n }, (_, i) => Math.max(0, 2 - (i % n) * 0.25))
    const sim = createWaterDynamics(n, 4, bed, new Uint8Array(n * n).fill(1), { source: 0.04 })
    for (let i = 0; i < 2400; i++) sim.step(0.05)
    expect(sim.foam.every(f => Number.isFinite(f) && f >= 0 && f <= 0.650001)).toBe(true)
    expect(sim.depth.every(h => Number.isFinite(h) && h >= 0)).toBe(true)
    expect(Math.max(...sim.foam)).toBeGreaterThan(0)
    expect(sim.foam[8 * n + 14]).toBeLessThan(0.08)
  })
})
