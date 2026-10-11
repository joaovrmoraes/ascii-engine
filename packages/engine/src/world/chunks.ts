/**
 * Chunks loaded by distance (Pomorog `forestWorld.ts`): content is built from
 * the chunk index (same index, same content), kept from `behind` to `ahead`
 * around the current chunk, and disposed when it falls out.
 */
export interface ChunkStreamerOptions<T> {
  /** Number of chunks in a closed circuit (indices wrap), or `Infinity`. */
  count: number
  build(index: number): T
  dispose(chunk: T, index: number): void
  behind?: number
  ahead?: number
}

export function createChunkStreamer<T>(options: ChunkStreamerOptions<T>) {
  const chunks = new Map<number, T>()
  const behind = options.behind ?? 1, ahead = options.ahead ?? 2
  let current = Number.NaN
  const wrap = (k: number) => Number.isFinite(options.count) ? ((k % options.count) + options.count) % options.count : k
  return {
    chunks: chunks as ReadonlyMap<number, T>,
    get current() { return current },
    /** Returns true when the set of live chunks changed. */
    update(index: number) {
      if (index === current) return false
      current = index
      const wanted = new Set<number>()
      for (let k = -behind; k <= ahead; k++) wanted.add(wrap(index + k))
      for (const [k, chunk] of chunks) if (!wanted.has(k)) { options.dispose(chunk, k); chunks.delete(k) }
      for (const k of wanted) if (!chunks.has(k)) chunks.set(k, options.build(k))
      return true
    },
    /** Ring distance between two indices (closed circuits). */
    ring(a: number, b: number) {
      if (!Number.isFinite(options.count)) return Math.abs(a - b)
      const n = options.count
      return Math.min(((a - b) % n + n) % n, ((b - a) % n + n) % n)
    },
    clear() { for (const [k, chunk] of chunks) options.dispose(chunk, k); chunks.clear(); current = Number.NaN },
  }
}
