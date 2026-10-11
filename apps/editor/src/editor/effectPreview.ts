import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createAsciiEngine, parseEffect, type EffectDef, type EffectInstance } from '@ascii-engine/core'

/** A disposable, empty stage. Never borrows objects, camera or style from the map. */
export function createEffectPreview() {
  const root = document.createElement('section'); root.id = 'effect-preview'; root.hidden = true
  root.setAttribute('aria-label', 'Prévia isolada do efeito')
  root.innerHTML = `<canvas aria-label="Efeito em espaço vazio"></canvas>
    <div class="fx-preview-title"><strong>Prévia do efeito</strong><span>Espaço vazio</span></div>
    <div class="fx-playback"><button data-preview="restart">↻ Reiniciar</button><button data-preview="pause">Pausar</button><button data-preview="stop">Parar</button><button data-preview="frame">Enquadrar</button>
    <label>Velocidade <select data-preview="speed"><option value="0.25">0,25×</option><option value="0.5">0,5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label><output>0,00 s</output></div>
    <p class="fx-preview-hint">Arraste para girar · botão direito move · roda aproxima</p>`
  document.getElementById('app')!.append(root)
  let canvas = root.querySelector('canvas')!
  const time = root.querySelector('output')!
  const get = <T extends HTMLElement = HTMLButtonElement>(key: string) => root.querySelector<T>(`[data-preview="${key}"]`)!
  let engine: ReturnType<typeof createAsciiEngine> | undefined, controls: OrbitControls | undefined, instance: EffectInstance | undefined
  let definition: EffectDef | undefined, paused = false, stopped = false, speed = 1, idle = 0, span = 3.8
  const abort = new AbortController()
  function ensure() {
    if (engine) return
    engine = createAsciiEngine(canvas, { style: { background: 0, fog: null, interior: false, atmosphere: 'moon', inkTint: [1,1,1] }, maxPixelRatio: 1.5 })
    controls = new OrbitControls(engine.camera, canvas)
    controls.enableDamping = false; controls.minZoom = .15; controls.maxZoom = 12
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
    controls.addEventListener('change', () => draw(0))
  }
  function fit() {
    if (!engine || !definition || !controls) return
    // Conservative envelope for the original presets; editing a size never auto-zooms.
    let radius = 1.3, top = 2.5
    for (const e of definition.emitters) {
      const life = typeof e.life === 'number' ? e.life : e.life?.[1] ?? 1
      radius = Math.max(radius, e.shape?.radius ?? 0, (e.shape?.size?.[0] ?? 0) / 2, (e.shape?.size?.[2] ?? 0) / 2, e.ring?.to ?? 0, Math.abs(e.shape?.to?.[0] ?? 0), Math.abs(e.shape?.to?.[2] ?? 0))
      top = Math.max(top, (e.offset?.[1] ?? 0) + Math.max(0, e.velocity?.[1] ?? 0) * life, Math.abs(e.shape?.to?.[1] ?? 0))
    }
    span = Math.min(24, Math.max(2.2, radius * 1.5, top * .72))
    engine.resize(); engine.camera.zoom = 1
    controls.target.set(0, top * .35, 0)
    engine.frame(controls.target, span, Math.PI / 7); controls.update(); draw(0)
  }
  function draw(dt: number) {
    if (!engine || root.hidden) return
    const { width, height } = engine.size
    if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
      engine.resize()
      const aspect = engine.size.width / engine.size.height
      Object.assign(engine.camera, { left: -span * aspect, right: span * aspect, top: span, bottom: -span })
      engine.camera.updateProjectionMatrix()
    }
    engine.render(dt)
    canvas.dataset.time = String(engine.time); canvas.dataset.letters = String(instance?.letters ?? 0)
    canvas.dataset.effect = definition?.name ?? ''; canvas.dataset.state = stopped ? 'stopped' : paused ? 'paused' : 'playing'
    time.textContent = `${(instance?.time ?? 0).toFixed(2).replace('.', ',')} s`
  }
  function restart() {
    if (!definition || root.hidden) return
    ensure(); instance?.cancel(); instance = engine!.fx.play(definition, new THREE.Vector3())
    paused = false; stopped = false; idle = 0; get('pause').textContent = 'Pausar'
    if (definition.loop) for (let i = 0; i < 6; i++) draw(1 / 30)
    else draw(1 / 60)
  }
  function stop() { instance?.cancel(); instance = undefined; stopped = true; paused = false; get('pause').textContent = 'Pausar'; draw(0) }
  get('restart').onclick = restart; get('stop').onclick = stop; get('frame').onclick = fit
  get('pause').onclick = () => { if (stopped) restart(); else { paused = !paused; get('pause').textContent = paused ? 'Continuar' : 'Pausar'; draw(0) } }
  get<HTMLSelectElement>('speed').onchange = event => { speed = Number((event.target as HTMLSelectElement).value) }
  root.addEventListener('contextmenu', event => event.preventDefault(), { signal: abort.signal })
  return {
    show(def: EffectDef) { root.hidden = false; document.body.classList.add('effect-studio-active'); ensure(); definition = parseEffect(def); restart(); fit() },
    play(def: EffectDef, reframe = false) { definition = parseEffect(def); restart(); if (reframe) fit() },
    stop,
    frame(dt: number) {
      if (root.hidden) return false
      const step = paused || stopped ? 0 : Math.min(.04, Math.max(0, dt)) * speed
      if (instance?.done && !paused && !stopped) { idle += step; if (idle >= .5) restart() }
      draw(step); return true
    },
    capture() { if (root.hidden) return; draw(0); return canvas.toDataURL('image/png').split(',')[1] },
    hide() {
      stop(); root.hidden = true; document.body.classList.remove('effect-studio-active')
      controls?.dispose(); controls = undefined; engine?.dispose(); engine?.renderer.forceContextLoss(); engine = undefined
      const fresh = canvas.cloneNode(false) as HTMLCanvasElement; canvas.replaceWith(fresh); canvas = fresh
    },
    dispose() { this.hide(); abort.abort(); root.remove() },
  }
}
