import { readFile } from 'node:fs/promises'
export const SYSTEM_MEMORY_RESERVE_BYTES = 4 * 1024 ** 3
const read = path => readFile(path, 'utf8').catch(() => null)
const bytes = (source, key) => {
  const value = new RegExp('^' + key + ':\\s+(\\d+)\\s+kB$', 'm').exec(source ?? '')?.[1]
  return value ? Number(value) * 1024 : null
}
/** Outside timed frames; Linux VmHWM includes the final state fingerprint's allocation peak. */
export async function memorySnapshot(pid) {
  const [status, system] = await Promise.all([
    pid ? read(`/proc/${pid}/status`) : null,
    read('/proc/meminfo'),
  ])
  return {
    renderer: status
      ? { pid, rssBytes: bytes(status, 'VmRSS'), peakRssBytes: bytes(status, 'VmHWM') }
      : null,
    availableBytes: bytes(system, 'MemAvailable'),
  }
}
export function waterMemoryDecision(
  load,
  previousLoad,
  previousPeakBytes,
  availableBytes,
  reserveBytes = SYSTEM_MEMORY_RESERVE_BYTES,
) {
  const known =
    [load, previousLoad, previousPeakBytes, availableBytes, reserveBytes].every(Number.isFinite) &&
    load > previousLoad &&
    previousLoad > 0 &&
    previousPeakBytes > 0 &&
    reserveBytes >= 0
  const projectedPeakBytes = known ? Math.ceil((previousPeakBytes * load) / previousLoad) : null
  return {
    allowed: known && availableBytes - projectedPeakBytes >= reserveBytes,
    load,
    previousLoad,
    previousPeakBytes,
    availableBytes,
    reserveBytes,
    projectedPeakBytes,
    reason: known
      ? 'Previous maximum renderer VmHWM scaled by count; reserve remains for system and other processes'
      : 'Memory observation is missing; do not increase the allocation',
  }
}
