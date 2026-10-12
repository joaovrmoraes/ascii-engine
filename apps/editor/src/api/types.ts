import type { SceneDoc } from '@ascii-engine/core'

/** Boundary implemented by the scene controller; no HTTP/MCP in the engine. */
export interface AuthoringEditor {
  replace(doc: SceneDoc): Promise<void>
  commit(): Promise<void>
  undo(redo?: boolean): Promise<void>
  lock(value: boolean): void
  catalog(): { id: string; title: string; kind: 'builtin' | 'asset' | 'effect' | 'atmosphere' }[]
  inspect(id: string): unknown
  disturbWater(index: number, x: number, z: number, strength: number, radius: number): void
  view(focus?: [number, number, number], studio?: 'scene' | 'effects' | 'atmosphere', cameraId?: string | null): void
}
