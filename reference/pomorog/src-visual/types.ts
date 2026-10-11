import type { Pose, Presence } from '../../online/types'

export type Atmosphere = 'moon' | 'dusk' | 'ember'
export type Activity = 'explore' | 'camp'

export interface VisualSettings {
  locationId?: string
  looting?: boolean
  lootId?: string
  atmosphere: Atmosphere
  activity: Activity
  cellSize: number
  asciiBrightness: number
  playing: boolean
  zoom: number
  rotation: number
  creature?: string | null
  creatureName?: string
  creatureHp?: number
  creatureMaxHp?: number
  playerLabel?: string
  peers?: Presence[]
  onPose?: (pose: Pose) => void
  feedback?: { id: string; text: string; target: 'player' | 'enemy'; spell?: 'fire' | 'lightning' | 'frost' }
  /** Focus block timing: the circuit length and arrival pace are solved from it. */
  hunt?: { total: number; remaining: number }
}

export const DEFAULT_SETTINGS: VisualSettings = {
  atmosphere: 'moon', activity: 'explore',
  cellSize: 6, asciiBrightness: 1, playing: true, zoom: .9, rotation: 0,
}
