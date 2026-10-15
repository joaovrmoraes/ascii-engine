import type { OffscreenWaterPolicy } from '@ascii-engine/core'

/** Offline and ordinary parity views simulate every loaded water, regardless of live defaults. */
export function fullWaterSimulation(params: URLSearchParams) {
  return params.get('offline') === '1' || params.get('parity') === '1'
}

/** Session/render policy only; this is never a SceneDoc field. */
export function resolveWaterPolicy(
  params: URLSearchParams,
  explicit: { present: boolean; policy?: OffscreenWaterPolicy } = { present: false },
): OffscreenWaterPolicy | undefined {
  if (fullWaterSimulation(params)) return undefined
  if (explicit.present) return explicit.policy
  const query = params.get('water-policy')
  if (query !== null && !['off', 'pause'].includes(query))
    throw new Error('water-policy must be off or pause')
  if (query === 'off' || (query === null && params.has('bench'))) return undefined
  return { mode: 'pause', margin: 4 }
}
