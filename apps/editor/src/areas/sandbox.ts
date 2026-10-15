import {
  buildScene,
  createEffectPrefabs,
  createHistory,
  linkTexture,
  loadSceneAssets,
  parseScene,
  type AsciiEngine,
  type Brush,
  type BuiltScene,
  type SceneDoc,
} from '@ascii-engine/core'
import { pomorog } from '@ascii-engine/core/pomorog'
import * as THREE from 'three'
import '../authoring.css'
import { createAtmosphereStudio } from '../editor/atmosphere'
import { createSceneCameras } from '../editor/cameras'
import { createEffectEditor } from '../editor/effects'
import { createExportDialog } from '../editor/exportDialog'
import { type Gizmos } from '../editor/gizmos'
import { createPlacementPreview } from '../editor/placement'
import type { SandboxContext } from '../editor/sandbox/context'
import {
  bindFiles,
  exportItem as exportItemModule,
  importSceneFiles,
} from '../editor/sandbox/files'
import { refreshHierarchy as refreshHierarchyModule } from '../editor/sandbox/hierarchy'
import {
  renderInspector,
  syncTransformFields as syncTransformFieldsModule,
} from '../editor/sandbox/inspector'
import {
  beginPlacement as beginPlacementModule,
  bindSceneInput,
  bindSceneToolbar,
  placeAt as placeAtModule,
  refreshHint as refreshHintModule,
  setMode as setModeModule,
} from '../editor/sandbox/interaction'
import { refreshLibrary as refreshLibraryModule } from '../editor/sandbox/library'
import { bindStudios } from '../editor/sandbox/studios'
import { bindTerrain, refreshTools as refreshToolsModule } from '../editor/sandbox/terrain'
import { createTextureStudio } from '../editor/textures'
import { createWorkspace, type Workspace } from '../editor/workspace'
import { defaultScene } from '../scene/defaultScene'
import { createPrefabs } from '../scene/prefabs'
import { readDraft, saveDraft } from '../scene/storage'
import type { Area, AreaOptions } from './types'
export { defaultScene } from '../scene/defaultScene'

type Tool = 'select' | Brush | 'water' | 'place' | 'erase'

/** The editor and exported player build the very same portable document. */
export async function createSandbox(engine: AsciiEngine, options: AreaOptions = {}): Promise<Area> {
  const player = document.body.classList.contains('player')
  let note = '',
    initial = options.scene
  if (!initial && !player)
    try {
      const draft = await readDraft()
      if (draft) initial = parseScene(draft)
    } catch (error) {
      note = `Draft unavailable: ${error}`
    }
  const builtins = createPrefabs(engine)
  let assets: Awaited<ReturnType<typeof loadSceneAssets>> = { library: {}, dispose() {} }
  let library = builtins,
    scene: BuiltScene
  try {
    assets = await loadSceneAssets(initial ?? defaultScene())
    library = { ...builtins, ...assets.library, ...createEffectPrefabs(engine, initial?.effects) }
    scene = buildScene(engine, initial ?? defaultScene(), library)
  } catch (error) {
    assets.dispose()
    if (options.scene) throw error
    note = `Could not open the draft: ${error}. Opened a new map; the draft will only be replaced when you edit.`
    initial = defaultScene()
    library = builtins
    assets = { library: {}, dispose() {} }
    scene = buildScene(engine, initial, library)
  }
  const placement = createPlacementPreview(engine, () => library)
  let name = initial?.name ?? 'My map',
    selected: THREE.Object3D | undefined,
    selectedWater = -1,
    busy = false,
    automationLocked = false
  let appearanceObject: THREE.Object3D | undefined,
    appearancePart = ''
  let cameraEditor: ReturnType<typeof createSceneCameras> | undefined
  let initialCamera = initial?.cameras?.[initial.activeCamera ?? '']
  const snapshot = (): SceneDoc => ({ ...scene.toJSON(), ...cameraEditor?.document(), name })
  const history = createHistory(snapshot(), 30)
  const focus = new THREE.Vector3(0, 1.6, -1.5),
    canvas = engine.renderer.domElement
  const signal = new AbortController()
  const tool = {
    kind: 'select' as Tool,
    radius: 2,
    strength: 0.08,
    layer: 1,
    prefab: 'arvore',
    waterMode: 'terrain' as 'terrain' | 'level',
  }
  let toolbar: HTMLElement, hierarchy: HTMLElement, sidebar: HTMLElement, box: HTMLElement
  let ui: Workspace | undefined, gizmos: Gizmos | undefined
  let atmosphereStudio: ReturnType<typeof createAtmosphereStudio> | undefined
  let effectEditor: ReturnType<typeof createEffectEditor> | undefined
  let textureStudio: ReturnType<typeof createTextureStudio> | undefined
  let exportDialog: ReturnType<typeof createExportDialog> | undefined
  let transformMode: 'hand' | 'orbit' | 'translate' | 'rotate' | 'scale' = 'translate',
    preview = false,
    assetCategory = 'All',
    assetQuery = '',
    hierarchyQuery = ''
  const run = (action: () => void | Promise<void>) => {
    if (busy) return
    void Promise.resolve()
      .then(action)
      .catch(error => message(String(error)))
  }
  function message(text: string) {
    note = text
    const el = toolbar?.querySelector('[data-k="note"]')
    if (el) el.textContent = text
  }
  let saveRevision = 0
  async function persist() {
    const revision = ++saveRevision
    try {
      await saveDraft(snapshot())
      if (revision === saveRevision) message('Draft saved in this browser')
    } catch (error) {
      message(`Could not save the draft; use Save file. ${error}`)
    }
  }
  function changed() {
    if (player || busy) return
    history.commit(snapshot())
    refreshHierarchy()
    refreshHistory()
    canvas.dispatchEvent(new Event('scene-document-changed'))
    void persist()
  }
  function choose(object?: THREE.Object3D, fromCanvas = false) {
    selected = cameraEditor?.isCamera(object)
      ? object
      : scene.placed.find(p => p.object === object)?.object
    selectedWater = -1
    cameraEditor?.select(selected)
    if (
      object &&
      (object === scene.terrain?.mesh || scene.waters.some(water => water.mesh === object))
    ) {
      selectedWater = scene.waters.findIndex(water => water.mesh === object)
      gizmos?.attach()
      canvas.dispatchEvent(new CustomEvent('select-scene-object', { detail: undefined }))
      ui?.selectPane(selectedWater >= 0 ? 'object' : 'terrain')
      refreshHierarchy()
      refreshHint()
      return
    }
    if (!fromCanvas)
      canvas.dispatchEvent(
        new CustomEvent('select-scene-object', {
          detail: cameraEditor?.isCamera(selected) ? undefined : selected,
        }),
      )
    if (selected) {
      tool.kind = 'select'
      ui?.selectPane('object')
    }
    gizmos?.attach(transformMode !== 'hand' && tool.kind === 'select' ? selected : undefined)
    refreshHierarchy()
    refreshHint()
  }
  async function replace(input: unknown) {
    if (busy) throw new Error('Wait for the current scene to finish opening.')
    placement.clear()
    busy = true
    for (const panel of [toolbar, hierarchy, sidebar, ui?.assets]) if (panel) panel.inert = true
    let nextAssets: Awaited<ReturnType<typeof loadSceneAssets>> | undefined
    const previousStyle = engine.exportStyle()
    try {
      const doc = parseScene(input)
      nextAssets = await loadSceneAssets(doc)
      const nextLibrary = {
        ...builtins,
        ...nextAssets.library,
        ...createEffectPrefabs(engine, doc.effects),
      }
      parseScene(doc, nextLibrary)
      // Keep types used by the old scene valid until the candidate is built.
      const nextStyle = {
        ...structuredClone(pomorog),
        ...doc.style,
        types: {
          ...structuredClone(pomorog.types),
          ...Object.fromEntries(
            Object.entries(nextLibrary)
              .filter(([, prefab]) => prefab.style)
              .map(([key, prefab]) => [key, prefab.style!]),
          ),
          ...doc.style?.types,
        },
      }
      engine.setStyle(
        { ...nextStyle, types: { ...previousStyle.types, ...nextStyle.types } },
        { replace: true },
      )
      const next = buildScene(engine, doc, nextLibrary)
      effectEditor?.stop()
      scene.dispose()
      assets.dispose()
      scene = next
      cameraEditor?.load(doc)
      initialCamera = doc.cameras?.[doc.activeCamera ?? '']
      assets = nextAssets
      library = nextLibrary
      name = doc.name ?? 'Untitled'
      engine.setStyle(nextStyle, { replace: true })
      engine.setTextures(doc.textures ?? {})
      selected = undefined
      selectedWater = -1
      gizmos?.attach()
      gizmos?.cursor()
      canvas.dispatchEvent(new Event('scene-replaced'))
      refreshTools()
      refreshHierarchy()
      effectEditor?.refresh()
      atmosphereStudio?.refresh()
      textureStudio?.refresh()
      if (toolbar) toolbar.querySelector<HTMLInputElement>('[data-k="name"]')!.value = name
    } catch (error) {
      nextAssets?.dispose()
      engine.setStyle(previousStyle, { replace: true })
      throw error
    } finally {
      busy = false
      for (const panel of [toolbar, hierarchy, sidebar, ui?.assets]) if (panel) panel.inert = false
    }
  }
  async function undo(redo = false) {
    const doc = redo ? history.redo() : history.undo()
    if (!doc) return
    try {
      await replace(doc)
      refreshHistory()
      await persist()
    } catch (error) {
      redo ? history.undo() : history.redo()
      throw error
    }
  }
  function duplicate() {
    if (cameraEditor?.selected) {
      cameraEditor.duplicate()
      return
    }
    if (!selected) return
    const item = snapshot().objects[scene.placed.findIndex(p => p.object === selected)]
    const object = scene.place({
      ...item,
      id: crypto.randomUUID(),
      name: `${selected.name || library[item.prefab].title} copy`,
      position: [item.position[0] + 1, item.position[1], item.position[2] + 1],
    })
    choose(object)
    changed()
  }
  async function removeSelected() {
    if (cameraEditor?.selected) {
      cameraEditor.remove()
      return
    }
    if (selected) {
      scene.remove(selected)
      choose()
      changed()
    } else if (selectedWater >= 0) {
      const doc = snapshot()
      doc.waters!.splice(selectedWater, 1)
      await replace(doc)
      changed()
    }
  }
  function applyTexture(object: THREE.Object3D, id: string, part?: string) {
    const result = linkTexture(
      engine.instanceStyle(object) ?? {},
      snapshot().textures ?? {},
      id,
      part,
    )
    engine.setInstanceOptions(object, result.options)
    choose(object)
    changed()
    message(
      `Texture linked.${result.replaced.length ? ' Replaced local fields: ' + result.replaced.join(', ') + '.' : ''}`,
    )
    return result.replaced
  }
  function exportItem() {
    return exportItemModule(ctx)
  }
  function refreshHistory() {
    if (!toolbar) return
    toolbar.querySelector<HTMLButtonElement>('[data-k="undo"]')!.disabled = !history.canUndo
    toolbar.querySelector<HTMLButtonElement>('[data-k="redo"]')!.disabled = !history.canRedo
  }
  function refreshHint() {
    return refreshHintModule(ctx)
  }
  function setMode(mode: typeof transformMode, cancelPlacement = false) {
    return setModeModule(ctx, mode, cancelPlacement)
  }
  function beginPlacement(prefab: string) {
    return beginPlacementModule(ctx, prefab)
  }
  function placeAt(prefab: string, point: THREE.Vector3, repeat = false) {
    return placeAtModule(ctx, prefab, point, repeat)
  }
  const normalized = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  function refreshLibrary() {
    return refreshLibraryModule(ctx)
  }
  function refreshTools() {
    return refreshToolsModule(ctx)
  }
  function syncTransformFields() {
    return syncTransformFieldsModule(ctx)
  }
  function refreshHierarchy() {
    return refreshHierarchyModule(ctx)
  }

  const ctx: SandboxContext = {
    get appearanceObject() {
      return appearanceObject
    },
    get appearancePart() {
      return appearancePart
    },
    get applyTexture() {
      return applyTexture
    },
    get assetCategory() {
      return assetCategory
    },
    set assetCategory(value) {
      assetCategory = value
    },
    get assetQuery() {
      return assetQuery
    },
    set assetQuery(value) {
      assetQuery = value
    },
    get atmosphereStudio() {
      return atmosphereStudio
    },
    set atmosphereStudio(value) {
      atmosphereStudio = value
    },
    get beginPlacement() {
      return beginPlacement
    },
    get box() {
      return box
    },
    get busy() {
      return busy
    },
    get cameraEditor() {
      return cameraEditor
    },
    set cameraEditor(value) {
      cameraEditor = value
    },
    get canvas() {
      return canvas
    },
    get changed() {
      return changed
    },
    get choose() {
      return choose
    },
    get duplicate() {
      return duplicate
    },
    get effectEditor() {
      return effectEditor
    },
    set effectEditor(value) {
      effectEditor = value
    },
    get engine() {
      return engine
    },
    get exportDialog() {
      return exportDialog
    },
    set exportDialog(value) {
      exportDialog = value
    },
    get exportItem() {
      return exportItem
    },
    get focus() {
      return focus
    },
    get gizmos() {
      return gizmos
    },
    set gizmos(value) {
      gizmos = value
    },
    get hierarchy() {
      return hierarchy
    },
    get hierarchyQuery() {
      return hierarchyQuery
    },
    set hierarchyQuery(value) {
      hierarchyQuery = value
    },
    get library() {
      return library
    },
    get message() {
      return message
    },
    get name() {
      return name
    },
    set name(value) {
      name = value
    },
    get normalized() {
      return normalized
    },
    get options() {
      return options
    },
    get placeAt() {
      return placeAt
    },
    get placement() {
      return placement
    },
    get preview() {
      return preview
    },
    set preview(value) {
      preview = value
    },
    get refreshHierarchy() {
      return refreshHierarchy
    },
    get refreshHint() {
      return refreshHint
    },
    get refreshLibrary() {
      return refreshLibrary
    },
    get refreshTools() {
      return refreshTools
    },
    get removeSelected() {
      return removeSelected
    },
    renderInspector: () => renderInspector(ctx),
    get replace() {
      return replace
    },
    get run() {
      return run
    },
    get scene() {
      return scene
    },
    get selected() {
      return selected
    },
    get selectedWater() {
      return selectedWater
    },
    set selectedWater(value) {
      selectedWater = value
    },
    get setMode() {
      return setMode
    },
    get sidebar() {
      return sidebar
    },
    get signal() {
      return signal
    },
    get snapshot() {
      return snapshot
    },
    get syncTransformFields() {
      return syncTransformFields
    },
    get textureStudio() {
      return textureStudio
    },
    set textureStudio(value) {
      textureStudio = value
    },
    get tool() {
      return tool
    },
    get transformMode() {
      return transformMode
    },
    set transformMode(value) {
      transformMode = value
    },
    get ui() {
      return ui
    },
    get undo() {
      return undo
    },
  }
  if (!player) {
    ui = createWorkspace()
    toolbar = ui.toolbar
    hierarchy = ui.hierarchy
    sidebar = ui.sidebar
    box = ui.tools
    bindStudios(ctx)
    bindFiles(ctx)
    bindSceneToolbar(ctx)
    bindTerrain(ctx)
    refreshTools()
    refreshHierarchy()
    refreshHistory()
    setMode('translate')
    message(note || 'Everything saved in this browser')
    bindSceneInput(ctx)
  }
  return {
    id: 'sandbox',
    title: 'Editor visual',
    hero: new THREE.Vector3(100, 0, 100),
    get state() {
      return `${scene.placed.length} objects · ${scene.waters.length} waters${busy ? ' · opening…' : ''}${automationLocked ? ' · AI editing' : note ? ` · ${note}` : ''}`
    },
    focus: (_angle, target) => target.copy(focus),
    pan(x, z, y = 0) {
      focus.x += x
      focus.z += z
      focus.y += y
    },
    select: object => choose(object, true),
    changed,
    document: snapshot,
    navigation(e) {
      if (player) return e.button !== 0 || e.shiftKey ? 'pan' : 'orbit'
      if (busy || preview || cameraEditor?.viewed || gizmos?.consumed) return false
      if (
        (e.button === 0 && (e.altKey || transformMode === 'orbit')) ||
        (e.button === 1 && e.shiftKey)
      )
        return 'orbit'
      if (e.button !== 0 || (e.shiftKey && tool.kind === 'select') || transformMode === 'hand')
        return 'pan'
      return false
    },
    blocksSelection: () =>
      busy ||
      automationLocked ||
      preview ||
      !!cameraEditor?.viewed ||
      document.body.classList.contains('studio-mode') ||
      !!gizmos?.consumed ||
      tool.kind !== 'select' ||
      transformMode === 'hand' ||
      transformMode === 'orbit',
    renderCameraPreview() {
      cameraEditor?.renderPreview(preview)
    },
    renderOverlay() {
      if (!player && !preview) {
        cameraEditor?.render()
        if (!cameraEditor?.viewed) gizmos?.render()
      }
    },
    cameraView: () =>
      player
        ? initialCamera
        : preview
          ? (cameraEditor?.activeCamera() ?? cameraEditor?.current())
          : cameraEditor?.current(),
    renderPreview: dt => textureStudio?.frame(dt) || effectEditor?.frame(dt) || false,
    capturePreview: () => textureStudio?.capture() ?? effectEditor?.capture(),
    setAppearanceSelection(object, part) {
      appearanceObject = object
      appearancePart = part ?? ''
    },
    editAppearance(object, part) {
      textureStudio?.open(object.userData.sceneId, part)
      ui?.showStudio('textures')
    },
    async openDocument(doc) {
      await replace(doc)
      changed()
    },
    authoring: player
      ? undefined
      : {
          replace,
          async commit() {
            history.commit(snapshot())
            refreshHierarchy()
            refreshHistory()
            canvas.dispatchEvent(new Event('scene-document-changed'))
            await persist()
          },
          undo,
          lock(value) {
            automationLocked = value
            placement.clear()
            gizmos?.attach()
            if (ui) ui.root.inert = value
          },
          catalog: () => [
            ...Object.entries(library).map(([id, prefab]) => ({
              id,
              title: prefab.title,
              kind: Object.hasOwn(builtins, id)
                ? ('builtin' as const)
                : Object.hasOwn(assets.library, id)
                  ? ('asset' as const)
                  : ('effect' as const),
            })),
            ...Object.entries(snapshot().atmospheres ?? {}).map(([id, asset]) => ({
              id,
              title: asset.name,
              kind: 'atmosphere' as const,
            })),
            ...Object.entries(snapshot().textures ?? {}).map(([id, asset]) => ({
              id,
              title: asset.name,
              kind: 'texture' as const,
            })),
          ],
          inspect(id) {
            if (snapshot().cameras?.[id]) return { camera: snapshot().cameras![id] }
            const placed = scene.placed.find(p => p.doc.id === id)
            if (!placed) throw new Error('Object not found: ' + id)
            const parts: {
              name: string
              glyph: unknown
              surface: unknown
              style: unknown
              sources: unknown
            }[] = []
            placed.object.traverse(node => {
              if (node instanceof THREE.Mesh)
                parts.push({
                  name: node.name,
                  glyph: node.userData.glyphResolved?.glyph,
                  surface: node.userData.glyphResolved?.surface,
                  style: node.userData.glyphResolved,
                  sources: node.userData.glyphSources,
                })
            })
            return {
              object: snapshot().objects.find(o => o.id === id),
              parts,
              options: engine.instanceStyle(placed.object),
              animationClips: placed.object.userData.animationClips ?? [],
            }
          },
          disturbWater(index, x, z, strength, radius) {
            const water = scene.waters[index]
            if (!water) throw new Error('Water not found: ' + index)
            water.disturb(x, z, strength, radius)
          },
          view(point, studio, cameraId) {
            if (cameraId !== undefined) cameraEditor?.view(cameraId)
            if (point) focus.set(...point)
            if (studio === 'scene') ui?.showProject('assets')
            else if (studio) ui?.showStudio(studio)
          },
        },
    importFiles(files) {
      return importSceneFiles(ctx, files)
    },
    update(time) {
      scene.update(time)
      placement.update(time)
    },
    dispose() {
      placement.clear()
      signal.abort()
      cameraEditor?.dispose()
      effectEditor?.dispose()
      textureStudio?.dispose()
      gizmos?.dispose()
      scene.dispose()
      assets.dispose()
      exportDialog?.dispose()
      ui?.dispose()
    },
  }
}
