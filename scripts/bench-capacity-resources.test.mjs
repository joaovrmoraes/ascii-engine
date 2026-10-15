import test from 'node:test'
import assert from 'node:assert/strict'
import {
  waterMemoryDecision,
  SYSTEM_MEMORY_RESERVE_BYTES,
  memorySnapshot,
} from './bench-capacity-resources.mjs'
test('water growth preserves a 4 GiB system reserve and fails closed without a measured peak', () => {
  const gib = 1024 ** 3
  assert.equal(SYSTEM_MEMORY_RESERVE_BYTES, 4 * gib)
  const enough = waterMemoryDecision(2048, 1024, 2 * gib, 8 * gib)
  assert.equal(enough.allowed, true)
  assert.equal(enough.projectedPeakBytes, 4 * gib)
  assert.equal(waterMemoryDecision(2048, 1024, 2 * gib, 8 * gib - 1).allowed, false)
  assert.equal(waterMemoryDecision(2048, 1024, null, 8 * gib).allowed, false)
  assert.equal(waterMemoryDecision(2048, 1024, 2 * gib, null).allowed, false)
  assert.equal(waterMemoryDecision(1024, 1024, 2 * gib, 8 * gib).allowed, false)
})

test(
  'reads the live process high-water RSS used for allocation planning',
  { skip: process.platform !== 'linux' },
  async () => {
    const snapshot = await memorySnapshot(process.pid)
    assert.equal(snapshot.renderer.pid, process.pid)
    assert.ok(snapshot.renderer.rssBytes > 0)
    assert.ok(snapshot.renderer.peakRssBytes >= snapshot.renderer.rssBytes)
    assert.ok(snapshot.availableBytes > 0)
  },
)
