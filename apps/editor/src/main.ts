import * as THREE from 'three'
import * as core from '@ascii-engine/core'
import { ENGINE_VERSION, applySceneCamera } from '@ascii-engine/core'
import { pomorogSpan } from '@ascii-engine/core/pomorog'
import { createAsciiEngine } from './engine'
import { createForest } from './areas/forest'
import { createMarsh, marshHooks } from './areas/marsh'
import { createSnow } from './areas/snow'
import { createCathedral, createMine } from './areas/interiors'
import { createGltfDemo, importFile } from './areas/gltfDemo'
import { createSandbox } from './areas/sandbox'
import { createEffectsArea } from './areas/effects'
import type { GlyphModel } from '@ascii-engine/core'
import { usesLegacyScreenComparison, type Area, type AreaOptions } from './areas/types'
import { buildReferenceScene } from './scene/reference'
import { buildTerrainScene } from './scene/terrain'
import type { AsciiEngine, AsciiPassHook } from '@ascii-engine/core'

export interface AreaEntry {
  title: string
  create: (engine: AsciiEngine, options: AreaOptions) => Area | Promise<Area>
  /** Screen-pass hooks the area needs (the engine builds the pass with them). */
  hooks?: AsciiPassHook[]
}
import { createPanel } from './panel'
import { createViewControls } from './editor/viewControls'
import { createSelection } from './selection'

/**
 * ASCII Engine editor. URL: ?area=<id>, ?ascii=debug-screen|raw|legacy-screen, ?angle=<rad>,
 * ?zoom=<.75–1.5>, ?pause=<seconds>, ?camp=1, ?hunt=<seconds>, ?at=<metres>, ?peaceful=1, ?cell=<px>, ?light=<.65–1.4>.
 */
const publicDemo = import.meta.env.VITE_PUBLIC_DEMO === 'true'
const demoAreas: Record<string, AreaEntry> = {
  dark_forest: { title: 'Dark Forest', create: createForest },
  rain_marsh: { title: 'Rain Marsh', create: createMarsh, hooks: marshHooks },
  snow_pines: { title: 'Snow Pines', create: createSnow },
  old_mine: { title: 'Old Mine', create: createMine },
  sunken_cathedral: { title: 'Sunken Cathedral', create: createCathedral },
}
export const AREAS: Record<string, AreaEntry> = publicDemo ? demoAreas : {
  ...demoAreas,
  sandbox: { title: 'Scene: terrain and prefabs', create: createSandbox },
  effects: { title: 'Effects (system)', create: createEffectsArea },
  gltf: { title: 'GLTF import (demo)', create: createGltfDemo },
  reference: { title: 'Reference scene', create: (engine, options) => buildReferenceScene(engine, usesLegacyScreenComparison(options)) },
  terrain: { title: 'Terrain (demo)', create: (engine) => buildTerrainScene(engine) },
}

const params = new URLSearchParams(location.search)
/**
 * Exported games ship a `game.json` next to index.html: the starting area or
 * scene, the title and the style. It turns the editor into a player (no
 * panels, no selection). `?player=1` previews that mode.
 */
interface GameConfig { title?: string; area?: string; scene?: string; style?: Partial<core.AsciiStyle>; zoom?: number }
const game: GameConfig | undefined = publicDemo
  ? undefined
  : await fetch('./game.json').then((r) => r.ok ? r.json() : undefined).catch(() => undefined)
const player = !!game || params.has('player')
if (player) document.body.classList.add('player')
if (publicDemo) document.getElementById('selection')!.remove()
if (game?.title) document.title = game.title
const sceneDoc: core.SceneDoc | undefined = game?.scene ? await fetch(game.scene).then((r) => r.json()) : undefined
const host = document.getElementById('app')!
const canvas = document.createElement('canvas')
canvas.style.width = canvas.style.height = '100%'; canvas.style.display = 'block'
host.appendChild(canvas)

const requestedArea = params.get('area')
const areaId = publicDemo
  ? (requestedArea && Object.hasOwn(demoAreas, requestedArea) ? requestedArea : 'dark_forest')
  : requestedArea ?? game?.area ?? (sceneDoc ? 'sandbox' : params.get('scene') ?? 'sandbox')
const entry = AREAS[areaId] ?? AREAS.dark_forest
const engine = createAsciiEngine(canvas, { hooks: entry.hooks, style: game?.style })
const requestedMode = params.get('ascii') ?? 'letters'
const legacyScreenComparison = areaId !== 'sandbox' && (requestedMode === 'screen' || requestedMode === 'legacy-screen')
const mode = legacyScreenComparison ? 'legacy-screen' : requestedMode === 'debug-screen' ? 'screen' : requestedMode
engine.debug.raw = mode === 'raw'
const view = {
  angle: Number(params.get('angle') ?? 0), zoom: Number(params.get('zoom') ?? game?.zoom ?? (areaId === 'sandbox' && !player ? .8 : .9)),
  elevation: THREE.MathUtils.clamp(Number(params.get('elevation') ?? Math.atan2(18, 15)), .02, Math.PI / 2 - .01),
  paused: false, pauseAt: params.has('pause') ? Number(params.get('pause')) : Infinity,
}
const viewControls = createViewControls(view)
const area = await Promise.resolve().then(() => entry.create(engine, { viewControls, legacyScreenComparison, camp: params.has('camp'), hunt: params.has('hunt') ? Number(params.get('hunt')) : undefined, at: params.has('at') ? Number(params.get('at')) : undefined, peaceful: params.has('peaceful'), scene: sceneDoc })).catch(error => {
  const message = document.createElement('p'); message.textContent = `Could not open the scene: ${error}`; message.style.cssText = 'position:fixed;inset:20px;z-index:10;background:#141219;padding:20px'; document.body.append(message)
  throw error
})
engine.setRenderMode(mode === 'raw' ? 'raw' : mode === 'screen' ? 'screen' : 'glyphs')
canvas.dataset.legacyScreenComparison = String(legacyScreenComparison)
if (params.has('cell')) engine.setStyle({ cellSize: Number(params.get('cell')) })
if (params.has('light')) engine.setStyle({ brightness: Number(params.get('light')) })

let dragging = false, panning = false, lastX = 0, lastY = 0
const panDelta = new THREE.Vector3(), panUp = new THREE.Vector3(), panForward = new THREE.Vector3()
canvas.addEventListener('contextmenu', e => e.preventDefault())
canvas.addEventListener('pointerdown', (e) => {
  const navigation = area.navigation ? area.navigation(e) : (e.button !== 0 || e.shiftKey ? 'pan' : 'orbit')
  if (!navigation || area.cameraView?.()) return
  dragging = true; panning = navigation === 'pan'; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId)
})
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return
  if (panning && area.pan) {
    const camera = engine.camera, rect = canvas.getBoundingClientRect()
    const dx = (e.clientX - lastX) * (camera.right - camera.left) / (rect.width * camera.zoom)
    const dy = (e.clientY - lastY) * (camera.top - camera.bottom) / (rect.height * camera.zoom)
    panDelta.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(-dx)
    panUp.setFromMatrixColumn(camera.matrixWorld, 1)
    panDelta.addScaledVector(panUp, dy)
    // Project screen movement onto the ground, keeping the grabbed point
    // under the pointer regardless of the camera's angle or zoom.
    camera.getWorldDirection(panForward)
    if (Math.abs(panForward.y) > .15) {
      panDelta.addScaledVector(panForward, -panDelta.y / panForward.y)
      area.pan(panDelta.x, panDelta.z)
    } else area.pan(panDelta.x, panDelta.z, panDelta.y)
  } else {
    view.angle += (e.clientX - lastX) * .006
    view.elevation = THREE.MathUtils.clamp(view.elevation + (e.clientY - lastY) * .006, .02, Math.PI / 2 - .01)
  }
  lastX = e.clientX; lastY = e.clientY
})
canvas.addEventListener('pointerup', () => { dragging = false })
canvas.addEventListener('pointercancel', () => { dragging = false })
canvas.addEventListener('editor-view-reset', () => { view.angle = 0; view.elevation = Math.atan2(18, 15) })
canvas.addEventListener('wheel', (e) => { e.preventDefault(); if (area.cameraView?.()) return; view.zoom = THREE.MathUtils.clamp(view.zoom * Math.exp(-e.deltaY * .001), area.id === 'sandbox' ? .18 : .75, area.id === 'sandbox' ? 4 : 1.5) }, { passive: false })

const imported: GlyphModel[] = []
const importAt = (file: File) => importFile(engine, file, area.focus(angle, new THREE.Vector3()).setY(0))
  .then((model) => { imported.push(model); status.dataset.note = `imported: ${file.name} (${model.parts.length} parts)` })
  .catch((error) => { status.dataset.note = `import error for ${file.name}: ${error}` })
addEventListener('dragover', (e) => e.preventDefault())
const importFiles = (files: File[]) => {
  if (player || publicDemo) return
  const action = area.importFiles ? area.importFiles(files) : Promise.all(files.map(importAt))
  void action.catch(error => { status.dataset.note = String(error) })
}
addEventListener('drop', (e) => { e.preventDefault(); const files = Array.from(e.dataTransfer?.files ?? []); if (files.length) importFiles(files) })
canvas.addEventListener('editor-import-files', e => importFiles((e as CustomEvent<File[]>).detail))
const panel = createPanel({ engine, view, viewControls, areas: AREAS, areaId, mode, legacyScreenComparison, viewer: publicDemo, hideArea: publicDemo && params.has('embed'), capture: () => captureNext = true, importFiles, changed: area.changed })
const selection = player || publicDemo ? { refresh() {} } : createSelection(engine, canvas, document.getElementById('selection')!, { select: area.select, changed: area.changed, target: area.setAppearanceSelection, edit: area.editAppearance, blocked: area.blocksSelection, objectFirst: area.id === 'sandbox' })
const status = document.getElementById('status')!
const focus = new THREE.Vector3()
let last = 0, frames = 0, sample = 0, fps = 0, captureNext = false
let angle = Math.PI / 7
function compositionCamera() {
  const camera = area.cameraView?.()
  if (camera) {
    const width = Math.min(host.clientWidth, host.clientHeight * camera.aspect), height = width / camera.aspect
    Object.assign(canvas.style, { width: `${width}px`, height: `${height}px`, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' })
    if (engine.size.width !== canvas.clientWidth || engine.size.height !== canvas.clientHeight) engine.resize()
    canvas.dataset.cameraView = camera.name; applySceneCamera(engine.camera, camera); return true
  }
  if (canvas.dataset.cameraView) {
    Object.assign(canvas.style, { width: '100%', height: '100%', position: '', left: '', top: '', transform: '' }); delete canvas.dataset.cameraView; engine.resize()
  }
  return false
}
function frame(now: number) {
  if (document.hidden) { last = now; return }
  const real = last ? (now - last) / 1000 : 0; last = now
  if (area.renderPreview?.(Math.max(0, real))) {
    status.textContent = `${document.body.classList.contains('texture-studio-active') ? 'Texture' : 'Effect'} studio · isolated preview · the map is paused`
    return
  }
  let dt = view.paused ? 0 : THREE.MathUtils.clamp(real, 0, .08)
  if (engine.time + dt > view.pauseAt) dt = Math.max(0, view.pauseAt - engine.time)
  const composed = compositionCamera()
  const { width, height } = engine.size
  angle = Math.PI / 7 + view.angle
  if (dt > 0) { area.update(engine.time + dt, dt); for (const model of imported) model.update(dt) }
  if (!composed) engine.frame(area.focus(angle, focus), pomorogSpan(height, width / height, view.zoom), angle, view.elevation)
  area.renderCameraPreview?.()
  selection.refresh()
  engine.render(dt)
  area.renderOverlay?.()
  if (captureNext) { captureNext = false; download(canvas.toDataURL('image/png')) }
  frames++
  if (now - sample > 1000) { fps = Math.round(frames * 1000 / (now - sample)); frames = 0; sample = now; panel.refresh() }
  if (!player) status.textContent = `ascii-engine ${ENGINE_VERSION} · ${area.title}${mode !== 'letters' ? ` (${mode})` : ''} · ${fps} fps · ${area.state}${status.dataset.note ? ` · ${status.dataset.note}` : ''}`
  canvas.dataset.ready = 'true'; canvas.dataset.state = area.state; canvas.dataset.fps = String(fps)
}
// Embedded webviews can stay visible while their compositor suspends rAF.
// Keep interaction/preview alive at 20 fps there; stop the fallback as soon as
// native animation frames return, and never animate a hidden document.
let lastAnimationFrame = performance.now()
function animationFrame(now: number) { lastAnimationFrame = now; frame(now); requestAnimationFrame(animationFrame) }
requestAnimationFrame(animationFrame)
const frameFallback = setInterval(() => { const now = performance.now(); if (!document.hidden && now - lastAnimationFrame > 150) frame(now) }, 50)
addEventListener('pagehide', () => clearInterval(frameFallback), { once: true })
function download(url: string) {
  const a = document.createElement('a'); a.href = url; a.download = `${area.id}-${Date.now()}.png`; a.click()
}
Object.assign(window, { engine, area, view, core })
if (!player && !publicDemo) {
  const { connectAuthoring } = await import('./api/client')
  connectAuthoring(engine, area, view, () => {
    const preview = area.capturePreview?.()
    if (preview) return preview
    // A tool capture must work even when the host suspends animation frames.
    const composed = compositionCamera()
    const captureAngle = Math.PI / 7 + view.angle, { width, height } = engine.size
    area.update(engine.time, 0)
    if (!composed) engine.frame(area.focus(captureAngle, focus), pomorogSpan(height, width / height, view.zoom), captureAngle, view.elevation)
    area.renderCameraPreview?.()
    engine.render(0); area.renderOverlay?.()
    return canvas.toDataURL('image/png').split(',')[1]
  })
}
