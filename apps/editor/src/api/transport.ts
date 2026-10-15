import type { AuthoringRequest } from '@ascii-engine/authoring'

export const bridgeEndpoint = 'http://127.0.0.1:1442'

export async function bridgeRequest<T>(sessionId: string, request: AuthoringRequest): Promise<T> {
  const response = await fetch(bridgeEndpoint + '/v1/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, request }),
    signal: AbortSignal.timeout(125000),
  })
  const value = await response.json()
  if (!response.ok) throw new Error(value.error ?? `HTTP ${response.status}`)
  return value.result as T
}
