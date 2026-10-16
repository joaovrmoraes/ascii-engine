import test from 'node:test'
import assert from 'node:assert/strict'
import { capacityAt, visibleWaterCandidate } from './bench-capacity-data.mjs'
test('uses the worse round p95, inclusive budget, and only observed stable uncapped loads', () => {
  const points = [
    { load: 1, capacityP95: 12, stable: true },
    { load: 2, capacityP95: 16.7, stable: true },
    { load: 4, capacityP95: 21, stable: true },
    { load: 8, capacityP95: 30, stable: false },
    { load: 16, capacityP95: 32, stable: true, capped: true },
  ]
  assert.equal(capacityAt(points, 16.7).maximum, 2)
  assert.equal(capacityAt(points, 16.7).nextFail, 4)
  assert.equal(capacityAt(points, 33.3).maximum, 4)
  assert.equal(capacityAt(points, 33.3).lowerBound, true)
})
test('does not infer capacity when even the smallest measured load fails', () => {
  assert.deepEqual(capacityAt([{ load: 65, capacityP95: 34, stable: true }], 16.7), {
    budget: 16.7,
    maximum: 0,
    frameP95: null,
    nextFail: 65,
    lowerBound: false,
  })
})

test('remaining water qualification keeps the 15% gate and needs two CPU-dominant rounds', () => {
  const point = {
    load: 4,
    stable: true,
    stats: { waterStep: { p50: 1.5 }, frameMs: { p50: 10 } },
    bottleneck: 'CPU',
    rounds: [
      { cpu: { p50: 12 }, gpu: { p50: 10 } },
      { cpu: { p50: 14 }, gpu: { p50: 10 } },
    ],
  }
  assert.equal(visibleWaterCandidate(point).frameShare, 0.15)
  assert.equal(visibleWaterCandidate({ ...point, stable: false }), null)
  assert.equal(
    visibleWaterCandidate({ ...point, stats: { ...point.stats, waterStep: { p50: 1.499 } } }),
    null,
  )
  assert.equal(visibleWaterCandidate({ ...point, bottleneck: 'GPU' }), null)
  assert.equal(
    visibleWaterCandidate({
      ...point,
      rounds: [point.rounds[0], { cpu: { p50: 11 }, gpu: { p50: 10 } }],
    }),
    null,
  )
  assert.equal(visibleWaterCandidate({ ...point, rounds: [point.rounds[0]] }), null)
  assert.equal(visibleWaterCandidate({ ...point, stats: { ...point.stats, waterStep: {} } }), null)
})
