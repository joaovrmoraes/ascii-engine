/** Nearest-rank percentiles; unavailable GPU samples are excluded, zero CPU times are retained. */
export function percentile(values, q) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  return sorted.length ? sorted[Math.max(0, Math.ceil(sorted.length * q) - 1)] : null
}
export function summarize(rows) {
  if (!rows.length) throw new Error('No measured frames')
  return Object.fromEntries(
    Object.keys(rows[0])
      .filter(key => key !== 'frame')
      .map(key => [
        key,
        Object.fromEntries(
          [
            ['p50', 0.5],
            ['p95', 0.95],
            ['p99', 0.99],
          ].map(([name, q]) => [
            name,
            percentile(
              rows.map(row => row[key]),
              q,
            ),
          ]),
        ),
      ]),
  )
}
export function relativeDifference(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  return a === 0 && b === 0 ? 0 : Math.abs(a - b) / ((a + b) / 2)
}

/** Dominance is descriptive, not proof of an exclusive bottleneck or a speedup. */
export function classifyBottleneck(cpuMs, gpuMs) {
  if (!Number.isFinite(gpuMs) || gpuMs <= 0) return 'unknown'
  if (cpuMs >= gpuMs * 1.2) return 'CPU'
  if (gpuMs >= cpuMs * 1.2) return 'GPU'
  return 'mixed'
}

export function qualifyTarget(key, targetMs, frameMs, bottleneck) {
  if (!['waterStep', 'skinning'].includes(key))
    return {
      qualifies: false,
      reason:
        key === 'waterUpload'
          ? 'Mixed geometry/upload; kernel not established'
          : 'Not numeric-array work',
    }
  if (bottleneck !== 'CPU')
    return {
      qualifies: false,
      reason:
        bottleneck === 'GPU'
          ? 'GPU bottleneck; CPU gain is not a frame gain'
          : 'CPU bottleneck not established',
    }
  if (targetMs / frameMs < 0.15) return { qualifies: false, reason: 'Below 15% of uncapped frame' }
  return {
    qualifies: true,
    reason:
      key === 'skinning' ? 'Qualifies; compare GPU skinning' : 'Qualifies for later JS baseline',
  }
}
