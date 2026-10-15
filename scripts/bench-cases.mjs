/** URL-addressable workloads; validating before launch avoids orphan browsers on bad input. */
export function benchmarkCase(id) {
  if (['water', 'particles', 'skinning'].includes(id)) return { id, query: `bench=${id}` }
  const match =
    /^(skinning|particles|water-visible|water-grid|water-scale)-(\d+)(?:-(off|pause))?$/.exec(id)
  if (!match) throw new Error('Unknown benchmark case: ' + id)
  const [, kind, digits, policy] = match,
    count = Number(digits)
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > (kind === 'water-grid' ? 513 : 512) ||
    (kind === 'particles' && count > 256)
  )
    throw new Error('Benchmark load out of range: ' + id)
  if ((kind === 'water-scale') !== !!policy) throw new Error('Invalid water policy: ' + id)
  if (kind === 'water-grid' && ![65, 129, 257, 513].includes(count))
    throw new Error('Unsupported grid: ' + id)
  const query =
    kind === 'skinning'
      ? `bench=skinning&creatures=${count}`
      : kind === 'particles'
        ? `bench=particles&effect-groups=${count}`
        : kind === 'water-grid'
          ? `bench=water-scale&waters=1&resolution=${count}&water-policy=off`
          : `bench=water-scale&waters=${count}&water-policy=${policy ?? 'off'}${kind === 'water-visible' ? '&water-layout=visible' : ''}`
  return { id, kind, count, policy, query }
}
