import test from 'node:test'
import assert from 'node:assert/strict'
import { capacityAt } from './bench-capacity-data.mjs'
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
