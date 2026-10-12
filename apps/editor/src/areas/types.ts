import type * as THREE from 'three'

export interface AreaOptions {
  /** Everything in the old screen pass (before/after comparisons). */
  screen?: boolean
  /** Stay at the bonfire. */
  camp?: boolean
  /** Hunt length in seconds: sizes the circuit (demo: 90 s → 100 m). */
  hunt?: number
  /** Start the traveller this many metres along the circuit (testing far from the camp). */
  at?: number
  /** No encounters. */
  peaceful?: boolean
  /** A scene document to open (sandbox / exported games). */
  scene?: import('@ascii-engine/core').SceneDoc
}

/** One map of the game, built on the engine. */
export interface Area {
  id: string
  title: string
  hero: THREE.Vector3
  /** Short state for `canvas.dataset.state` (circuit progress, weather…). */
  readonly state: string
  /** Camera focus for a view angle. */
  focus(angle: number, target: THREE.Vector3): THREE.Vector3
  update(time: number, dt: number): void
  dispose(): void
  importFiles?(files: File[]): Promise<void>
  select?(object?: THREE.Object3D): void
  changed?(): void
  pan?(x: number, z: number, y?: number): void
  document?(): import('@ascii-engine/core').SceneDoc
  openDocument?(doc: unknown): Promise<void>
  authoring?: import('../api/types').AuthoringEditor
  navigation?(event: PointerEvent): 'pan' | 'orbit' | false
  blocksSelection?(): boolean
  renderOverlay?(): void
  renderCameraPreview?(): void
  cameraView?(): import('@ascii-engine/core').SceneCamera | undefined
  renderPreview?(dt: number): boolean
  capturePreview?(): string | undefined
}
