import * as THREE from 'three'
import { createAsciiEngine, ENGINE_VERSION, pomorogSpan } from '@ascii-engine/core'
import { buildReferenceScene } from './scene/reference'
import { buildTerrainScene } from './scene/terrain'

// Reference scene of phase 1 (?scene=terrain: relief check). URL: ?ascii=screen (old screen pass), ?ascii=raw (no letters),
// ?angle=<rad> (extra camera turn), ?zoom=<.75–1.5>, ?pause=<seconds>, ?yaw=<hero turn>.
const params = new URLSearchParams(location.search)
const host = document.getElementById('app')!
const canvas = document.createElement('canvas')
canvas.style.width = canvas.style.height = '100%'; canvas.style.display = 'block'
host.appendChild(canvas)

const engine = createAsciiEngine(canvas)
const screenMode = params.get('ascii') === 'screen'
engine.debug.raw = params.get('ascii') === 'raw'
const terrain = params.get('scene') === 'terrain'
const scene = terrain ? buildTerrainScene(engine) : buildReferenceScene(engine, screenMode, params.has('yaw') ? Number(params.get('yaw')) : undefined)

let angle = Number(params.get('angle') ?? 0), drag = 0, dragX = 0, dragging = false
const zoom = Number(params.get('zoom') ?? .9)
const pauseAt = params.has('pause') ? Number(params.get('pause')) : Infinity
canvas.addEventListener('pointerdown', (e) => { dragging = true; dragX = e.clientX - drag / .006; canvas.setPointerCapture(e.pointerId) })
canvas.addEventListener('pointermove', (e) => { if (dragging) drag = (e.clientX - dragX) * .006 })
canvas.addEventListener('pointerup', () => { dragging = false })

const status = document.getElementById('status')!
const focus = new THREE.Vector3()
let last = 0, frames = 0, sample = 0, fps = 0
function frame(now: number) {
  const dt = last ? (now - last) / 1000 : 0; last = now
  const step = engine.time + dt > pauseAt ? Math.max(0, pauseAt - engine.time) : dt
  const a = Math.PI / 7 + angle + drag
  const { width, height } = engine.size
  // Pomorog framing: focus 2 m ahead of the hero, at chest height.
  if ('traveller' in scene) {
    focus.copy(scene.traveller.root.position); focus.y = 1.05
    focus.x -= Math.sin(a) * 2; focus.z -= Math.cos(a) * 2
  } else focus.copy(scene.focus)
  engine.frame(focus, pomorogSpan(height, width / height, zoom), a)
  scene.update(engine.time + step)
  engine.render(step)
  frames++
  if (now - sample > 1000) { fps = Math.round(frames * 1000 / (now - sample)); frames = 0; sample = now }
  status.textContent = `ascii-engine ${ENGINE_VERSION} · ${terrain ? 'relevo' : 'cena de referência'}${screenMode ? ' (modo tela)' : ''} · ${fps} fps · arraste para girar`
  canvas.dataset.ready = 'true'
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
Object.assign(window, { engine, referenceScene: scene })
