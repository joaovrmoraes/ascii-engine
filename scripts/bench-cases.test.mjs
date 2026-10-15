import test from 'node:test'
import assert from 'node:assert/strict'
import { benchmarkCase } from './bench-cases.mjs'

test('keeps reference URLs and exposes explicit capacity axes', () => {
  assert.equal(benchmarkCase('skinning').query, 'bench=skinning')
  assert.equal(benchmarkCase('skinning-32').query, 'bench=skinning&creatures=32')
  assert.equal(benchmarkCase('particles-16').query, 'bench=particles&effect-groups=16')
  assert.equal(benchmarkCase('water-scale-128-pause').count, 128)
  assert.match(benchmarkCase('water-visible-4').query, /water-policy=off&water-layout=visible$/)
  assert.match(benchmarkCase('water-grid-257').query, /resolution=257&water-policy=off$/)
  assert.equal(benchmarkCase('water-grid-513').count, 513)
})
test('rejects malformed, unbounded or ambiguous cases before launching Chromium', () => {
  for (const id of [
    'skinning-0',
    'skinning-513',
    'particles-257',
    'water-grid-130',
    'water-scale-2',
    'water-visible-4-pause',
    'particles-2-off',
    'water-grid-NaN',
    'skinning-2&player=1',
  ])
    assert.throws(() => benchmarkCase(id), id)
})
