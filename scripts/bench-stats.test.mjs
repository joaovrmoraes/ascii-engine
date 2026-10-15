import { test } from 'node:test'
import assert from 'node:assert/strict'
import { percentile, summarize, relativeDifference } from './bench-stats.mjs'

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
