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
