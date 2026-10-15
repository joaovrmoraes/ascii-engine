import type { AsciiEngine, Brush, BuiltScene, SceneDoc } from '@ascii-engine/core'
import type * as THREE from 'three'
import type { AreaOptions } from '../../areas/types'
import type { createPrefabs } from '../../scene/prefabs'
import type { createAtmosphereStudio } from '../atmosphere'
import type { createSceneCameras } from '../cameras'
import type { createEffectEditor } from '../effects'
import type { createExportDialog } from '../exportDialog'
import type { Gizmos } from '../gizmos'
import type { createPlacementPreview } from '../placement'
import type { createTextureStudio } from '../textures'
import type { Workspace } from '../workspace'
export type Tool = 'select' | Brush | 'water' | 'place' | 'erase'

/** Live ports between editor modules and document/history coordination. */
export interface SandboxContext {
  readonly appearanceObject: THREE.Object3D | undefined
  readonly appearancePart: string
  readonly applyTexture: (object: THREE.Object3D, id: string, part?: string) => string[]
  assetCategory: string
  assetQuery: string
  atmosphereStudio: ReturnType<typeof createAtmosphereStudio> | undefined
  readonly beginPlacement: (prefab: string) => void
  readonly box: HTMLElement
  readonly busy: boolean
  cameraEditor: ReturnType<typeof createSceneCameras> | undefined
  readonly canvas: HTMLCanvasElement
  readonly changed: () => void
  readonly choose: (object?: THREE.Object3D, fromCanvas?: boolean) => void
  readonly duplicate: () => void
  effectEditor: ReturnType<typeof createEffectEditor> | undefined
  readonly engine: AsciiEngine
  exportDialog: ReturnType<typeof createExportDialog> | undefined
  readonly exportItem: () => void
  readonly focus: THREE.Vector3
  gizmos: Gizmos | undefined
  readonly hierarchy: HTMLElement
  hierarchyQuery: string
  readonly library: ReturnType<typeof createPrefabs>
  readonly message: (text: string) => void
  name: string
  readonly normalized: (text: string) => string
  readonly options: AreaOptions
  readonly placeAt: (prefab: string, point: THREE.Vector3, repeat?: boolean) => void
  readonly placement: ReturnType<typeof createPlacementPreview>
  preview: boolean
  readonly refreshHierarchy: () => void
  readonly refreshHint: () => void
  readonly refreshLibrary: () => void
  readonly refreshTools: () => void
  readonly removeSelected: () => Promise<void>
  renderInspector(): void
  readonly replace: (input: unknown) => Promise<void>
  readonly run: (action: () => void | Promise<void>) => void
  readonly scene: BuiltScene
  readonly selected: THREE.Object3D | undefined
  selectedWater: number
  readonly setMode: (
    mode: 'translate' | 'rotate' | 'scale' | 'hand' | 'orbit',
    cancelPlacement?: boolean,
  ) => void
  readonly sidebar: HTMLElement
  readonly signal: AbortController
  readonly snapshot: () => SceneDoc
  readonly syncTransformFields: () => void
  textureStudio: ReturnType<typeof createTextureStudio> | undefined
  readonly tool: {
    kind: Tool
    radius: number
    strength: number
    layer: number
    prefab: string
    waterMode: 'terrain' | 'level'
  }
  transformMode: 'translate' | 'rotate' | 'scale' | 'hand' | 'orbit'
  readonly ui: Workspace | undefined
  readonly undo: (redo?: boolean) => Promise<void>
}
