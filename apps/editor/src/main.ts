import * as THREE from 'three'
import * as core from '@ascii-engine/core'
import { createAsciiEngine, ENGINE_VERSION, pomorogSpan } from '@ascii-engine/core'
import { createForest } from './areas/forest'
import { createMarsh, marshHooks } from './areas/marsh'
import { createSnow } from './areas/snow'
import { createCathedral, createMine } from './areas/interiors'
import { createGltfDemo, importFile } from './areas/gltfDemo'
import { createSandbox } from './areas/sandbox'
import { createEffectsArea } from './areas/effects'
import type { GlyphModel } from '@ascii-engine/core'
import type { Area, AreaOptions } from './areas/types'
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
import { createSelection } from './selection'

/**
 * ASCII Engine editor. URL: ?area=<id>, ?ascii=screen|raw, ?angle=<rad>,
 * ?zoom=<.75–1.5>, ?pause=<seconds>, ?camp=1, ?hunt=<seconds>, ?at=<metres>, ?peaceful=1, ?cell=<px>, ?light=<.65–1.4>.
 */
export const AREAS: Record<string, AreaEntry> = {
  dark_forest: { title: 'Floresta Sombria', create: createForest },
  rain_marsh: { title: 'Pântano da Chuva', create: createMarsh, hooks: marshHooks },
  snow_pines: { title: 'Pinheiros Nevados', create: createSnow },
  old_mine: { title: 'Mina Antiga', create: createMine },
  sunken_cathedral: { title: 'Catedral Submersa', create: createCathedral },
  sandbox: { title: 'Cenário: terreno e prefabs', create: createSandbox },
  effects: { title: 'Efeitos (sistema)', create: createEffectsArea },
  gltf: { title: 'Importação GLTF (teste)', create: createGltfDemo },
  reference: { title: 'Cena de referência', create: (engine, options) => buildReferenceScene(engine, options.screen) },
  terrain: { title: 'Relevo (teste)', create: (engine) => buildTerrainScene(engine) },
}

const params = new URLSearchParams(location.search)
/**
 * Exported games ship a `game.json` next to index.html: the starting area or
 * scene, the title and the style. It turns the editor into a player (no
 * panels, no selection). `?player=1` previews that mode.
 */
interface GameConfig { title?: string; area?: string; scene?: string; style?: Partial<core.AsciiStyle>; zoom?: number }
const game: GameConfig | undefined = await fetch('./game.json').then((r) => r.ok ? r.json() : undefined).catch(() => undefined)
const player = !!game || params.has('player')
if (player) document.body.classList.add('player')
if (game?.title) document.title = game.title
const sceneDoc: core.SceneDoc | undefined = game?.scene ? await fetch(game.scene).then((r) => r.json()) : undefined
const host = document.getElementById('app')!
const canvas = document.createElement('canvas')
canvas.style.width = canvas.style.height = '100%'; canvas.style.display = 'block'
host.appendChild(canvas)

const areaId = params.get('area') ?? game?.area ?? (sceneDoc ? 'sandbox' : params.get('scene') ?? 'sandbox')
const entry = AREAS[areaId] ?? AREAS.dark_forest
const engine = createAsciiEngine(canvas, { hooks: entry.hooks, style: game?.style })
const mode = params.get('ascii') ?? 'letters'
engine.debug.raw = mode === 'raw'
const area = await Promise.resolve().then(() => entry.create(engine, { screen: mode === 'screen', camp: params.has('camp'), hunt: params.has('hunt') ? Number(params.get('hunt')) : undefined, at: params.has('at') ? Number(params.get('at')) : undefined, peaceful: params.has('peaceful'), scene: sceneDoc })).catch(error => {
  const message = document.createElement('p'); message.textContent = `Não foi possível abrir a cena: ${error}`; message.style.cssText = 'position:fixed;inset:20px;z-index:10;background:#141219;padding:20px'; document.body.append(message)
  throw error
})
const view = {
  angle: Number(params.get('angle') ?? 0), zoom: Number(params.get('zoom') ?? game?.zoom ?? (area.id === 'sandbox' && !player ? .8 : .9)),
  paused: false, pauseAt: params.has('pause') ? Number(params.get('pause')) : Infinity,
}
if (params.has('cell')) engine.setStyle({ cellSize: Number(params.get('cell')) })
if (params.has('light')) engine.setStyle({ brightness: Number(params.get('light')) })

let drag = 0, dragX = 0, dragging = false, panning = false, lastX = 0, lastY = 0
const panDelta = new THREE.Vector3(), panUp = new THREE.Vector3(), panForward = new THREE.Vector3()
canvas.addEventListener('contextmenu', e => e.preventDefault())
canvas.addEventListener('pointerdown', (e) => {
  const navigation = area.navigation ? area.navigation(e) : (e.button !== 0 || e.shiftKey ? 'pan' : 'orbit')
  if (!navigation) return
  dragging = true; panning = navigation === 'pan'; lastX = e.clientX; lastY = e.clientY; dragX = e.clientX - drag / .006; canvas.setPointerCapture(e.pointerId)
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
    if (Math.abs(panForward.y) > 1e-6) {
      panDelta.addScaledVector(panForward, -panDelta.y / panForward.y)
      area.pan(panDelta.x, panDelta.z)
    }
    lastX = e.clientX; lastY = e.clientY
  } else drag = (e.clientX - dragX) * .006
})
canvas.addEventListener('pointerup', () => { dragging = false })
canvas.addEventListener('pointercancel', () => { dragging = false })
canvas.addEventListener('wheel', (e) => { e.preventDefault(); view.zoom = THREE.MathUtils.clamp(view.zoom * Math.exp(-e.deltaY * .001), area.id === 'sandbox' ? .18 : .75, area.id === 'sandbox' ? 4 : 1.5) }, { passive: false })

const imported: GlyphModel[] = []
const importAt = (file: File) => importFile(engine, file, area.focus(angle, new THREE.Vector3()).setY(0))
  .then((model) => { imported.push(model); status.dataset.note = `importado: ${file.name} (${model.parts.length} partes)` })
  .catch((error) => { status.dataset.note = `erro ao importar ${file.name}: ${error}` })
addEventListener('dragover', (e) => e.preventDefault())
const importFiles = (files: File[]) => {
  if (player) return
  const action = area.importFiles ? area.importFiles(files) : Promise.all(files.map(importAt))
  void action.catch(error => { status.dataset.note = String(error) })
}
addEventListener('drop', (e) => { e.preventDefault(); const files = Array.from(e.dataTransfer?.files ?? []); if (files.length) importFiles(files) })
canvas.addEventListener('editor-import-files', e => importFiles((e as CustomEvent<File[]>).detail))
const panel = createPanel({ engine, view, areas: AREAS, areaId, mode, capture: () => captureNext = true, importFiles, changed: area.changed })
const selection = player ? { refresh() {} } : createSelection(engine, canvas, document.getElementById('selection')!, { select: area.select, changed: area.changed, blocked: area.blocksSelection, objectFirst: area.id === 'sandbox' })
const status = document.getElementById('status')!
const focus = new THREE.Vector3()
let last = 0, frames = 0, sample = 0, fps = 0, captureNext = false
let angle = Math.PI / 7
function frame(now: number) {
  requestAnimationFrame(frame)
  if (document.hidden) { last = now; return }
  const real = last ? (now - last) / 1000 : 0; last = now
  let dt = view.paused ? 0 : THREE.MathUtils.clamp(real, 0, .08)
  if (engine.time + dt > view.pauseAt) dt = Math.max(0, view.pauseAt - engine.time)
  const { width, height } = engine.size
  angle += (Math.PI / 7 + view.angle + drag - angle) * (1 - Math.exp(-6 * Math.min(real, .1)))
  if (dt > 0) { area.update(engine.time + dt, dt); for (const model of imported) model.update(dt) }
  engine.frame(area.focus(angle, focus), pomorogSpan(height, width / height, view.zoom), angle)
  selection.refresh()
  engine.render(dt)
  area.renderOverlay?.()
  if (captureNext) { captureNext = false; download(canvas.toDataURL('image/png')) }
  frames++
  if (now - sample > 1000) { fps = Math.round(frames * 1000 / (now - sample)); frames = 0; sample = now; panel.refresh() }
  if (!player) status.textContent = `ascii-engine ${ENGINE_VERSION} · ${area.title}${mode !== 'letters' ? ` (${mode})` : ''} · ${fps} fps · ${area.state}${status.dataset.note ? ` · ${status.dataset.note}` : ''}`
  canvas.dataset.ready = 'true'; canvas.dataset.state = area.state; canvas.dataset.fps = String(fps)
}
requestAnimationFrame(frame)
function download(url: string) {
  const a = document.createElement('a'); a.href = url; a.download = `${area.id}-${Date.now()}.png`; a.click()
}
Object.assign(window, { engine, area, view, core })
if (!player) {
  const { connectAuthoring } = await import('./api/client')
  connectAuthoring(engine, area, view, () => {
    // A tool capture must work even when the host suspends animation frames.
    const captureAngle = Math.PI / 7 + view.angle + drag, { width, height } = engine.size
    area.update(engine.time, 0)
    engine.frame(area.focus(captureAngle, focus), pomorogSpan(height, width / height, view.zoom), captureAngle)
    engine.render(0); area.renderOverlay?.()
    return canvas.toDataURL('image/png').split(',')[1]
  })
}
