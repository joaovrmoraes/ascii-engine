import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  percentile,
  summarize,
  relativeDifference,
  classifyBottleneck,
  qualifyTarget,
} from './bench-stats.mjs'

test('nearest-rank percentiles retain zero samples and exclude unavailable GPU data', () => {
  assert.equal(percentile([100, 0, 10, 20, null, NaN], 0.5), 10)
  assert.equal(percentile([100, 0, 10, 20], 0.95), 100)
  assert.equal(percentile([null, undefined], 0.5), null)
})
test('summary keeps absent GPU measurements absent and reports observed frame tails', () => {
  const stats = summarize([
    { frame: 1, frameMs: 16, gpuMs: null },
    { frame: 2, frameMs: 33, gpuMs: null },
  ])
  assert.deepEqual(stats.frameMs, { p50: 16, p95: 33, p99: 33 })
  assert.deepEqual(stats.gpuMs, { p50: null, p95: null, p99: null })
  assert.throws(() => summarize([]), /No measured frames/)
})
test('round differences are symmetric, including zero and missing values', () => {
  assert.equal(relativeDifference(10, 11), relativeDifference(11, 10))
  assert.ok(relativeDifference(16, 16.5) < 0.05)
  assert.ok(relativeDifference(16, 17) > 0.05)
  assert.equal(relativeDifference(0, 0), 0)
  assert.equal(relativeDifference(null, 10), null)
})

test('bottleneck classification preserves uncertainty and compares overlapping CPU/GPU ranges', () => {
  assert.equal(classifyBottleneck(5, 9), 'GPU')
  assert.equal(classifyBottleneck(15, 7), 'CPU')
  assert.equal(classifyBottleneck(10, 11), 'mixed')
  assert.equal(classifyBottleneck(5, null), 'unknown')
})

test('CPU share alone cannot qualify numeric work in a GPU-limited scene', () => {
  assert.equal(qualifyTarget('waterStep', 3, 10, 'GPU').qualifies, false)
  assert.equal(qualifyTarget('waterStep', 3, 10, 'mixed').qualifies, false)
  assert.equal(qualifyTarget('waterStep', 3, 10, 'unknown').qualifies, false)
  assert.equal(qualifyTarget('waterStep', 3, 10, 'CPU').qualifies, true)
})

test('qualification still requires numeric work and at least 15% of uncapped frame', () => {
  assert.equal(qualifyTarget('skinning', 2, 10, 'CPU').qualifies, true)
  assert.equal(qualifyTarget('waterStep', 1, 10, 'CPU').qualifies, false)
  assert.equal(qualifyTarget('waterUpload', 6, 10, 'CPU').qualifies, false)
  assert.equal(qualifyTarget('effects', 6, 10, 'CPU').qualifies, false)
})
