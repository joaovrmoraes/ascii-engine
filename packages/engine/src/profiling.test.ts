import { expect, it } from 'vitest'
import type * as THREE from 'three'
import { createRenderProfiler } from './profiling'

function fixture(supported = false) {
  let now = 0,
    available = false,
    disjoint = false,
    deleted = 0
  const gl = {
    QUERY_RESULT_AVAILABLE: 1,
    QUERY_RESULT: 2,
    getExtension: () => (supported ? { TIME_ELAPSED_EXT: 3, GPU_DISJOINT_EXT: 4 } : null),
    getParameter: () => disjoint,
    createQuery: () => ({}),
    beginQuery() {},
    endQuery() {},
    deleteQuery() {
      deleted++
    },
    getQueryParameter: (_query: object, key: number) => (key === 1 ? available : 1500000),
  }
  const renderer = {
    getContext: () => gl,
    info: {
      autoReset: true,
      render: { calls: 0, triangles: 0, points: 0 },
      reset() {
        this.render.calls = 0
      },
    },
  }
  return {
    renderer,
    profiler: createRenderProfiler(renderer as unknown as THREE.WebGLRenderer, () => now),
    time(value: number) {
      now = value
    },
    ready() {
      available = true
    },
    disjoint() {
      disjoint = true
    },
    deleted: () => deleted,
  }
}

it('accounts for disjoint CPU sections and the remaining render without changing counter reset policy', () => {
  const f = fixture(),
    p = f.profiler
  p.begin()
  expect(f.renderer.info.autoReset).toBe(false)
  f.time(2)
  p.startSection()
  f.time(5)
  p.endSection('skinning')
  p.startSection()
  f.time(7)
  p.endSection('waterReflection')
  p.timings.waterStep = 4
  f.renderer.info.render.calls = 42
  f.time(20)
  p.end()
  expect(p.latest).toMatchObject({
    cpuMs: 20,
    drawCalls: 42,
    timings: { skinning: 3, waterStep: 4, waterReflection: 2, renderRest: 11 },
  })
  expect(f.renderer.info.autoReset).toBe(true)
  expect(p.gpu.status).toBe('unsupported')
  expect(p.takeGpuSamples()).toEqual([])
  p.begin()
  f.time(21)
  p.end()
  expect(p.latest!.timings.skinning).toBe(0)
})

it('returns asynchronous GPU results with their original frame and rejects disjoint samples', () => {
  const f = fixture(true),
    p = f.profiler
  p.begin()
  p.startGpu()
  p.end()
  expect(p.takeGpuSamples()).toEqual([])
  f.ready()
  expect(p.takeGpuSamples()).toEqual([{ frame: 1, ms: 1.5 }])
  expect(f.deleted()).toBe(1)
  p.begin()
  p.startGpu()
  p.end()
  f.disjoint()
  expect(p.takeGpuSamples()).toEqual([])
  expect(p.gpu.status).toBe('disjoint')
  expect(f.deleted()).toBe(2)
  p.dispose()
})
