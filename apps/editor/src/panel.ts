import { parseScene, type AsciiEngine } from '@ascii-engine/core'

interface PanelOptions {
  engine: AsciiEngine
  view: { angle: number; zoom: number; paused: boolean }
  areas: Record<string, { title: string }>
  areaId: string
  mode: string
  capture: () => void
  importFiles: (files: File[]) => void
  changed?: () => void
  viewer?: boolean
}

/**
 * Live adjustments (seed of phase 4): area, letter mode, cell size and
 * brightness (the player's "Image" controls), zoom and rotation.
 * Changing area or mode reloads with the URL, so every view is shareable.
 */
export function createPanel({ engine, view, areas, areaId, mode, capture, importFiles, changed, viewer = false }: PanelOptions) {
  const root = document.getElementById('panel')!
  const go = (key: string, value: string) => { const p = new URLSearchParams(location.search); p.set(key, value); location.search = p.toString() }
  root.innerHTML = `
    <label>area <select data-k="area">${Object.entries(areas).map(([id, a]) => `<option value="${id}"${id === areaId ? ' selected' : ''}>${a.title}</option>`).join('')}</select></label>
    <label>mode <select data-k="mode">${[['letters', 'glyphs'], ['screen', 'screen (legacy)'], ['raw', 'without screen pass']].map(([v, t]) => `<option value="${v}"${v === mode ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>size <input data-k="cell" type="range" min="5" max="12" step="1"><output></output></label>
    <label>light <input data-k="light" type="range" min=".65" max="1.4" step=".05"><output></output></label>
    <label>zoom <input data-k="zoom" type="range" min="${areaId === 'sandbox' ? '.18' : '.75'}" max="${areaId === 'sandbox' ? '4' : '1.5'}" step=".05"><output></output></label>
    <label>rotation <input data-k="angle" type="range" min="-3.14" max="3.14" step=".05"><output></output></label>
    <button data-k="pause">[ pause ]</button> <button data-k="shot">[ capture ]</button>
    ${viewer ? '' : `<label class="file">[ import models and files ]<input data-k="import" type="file" multiple accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" hidden></label>
    <button data-k="save">[ save preset .json ]</button>
    <label class="file">[ load preset .json ]<input data-k="load" type="file" accept=".json" hidden></label>`}`
  const input = (k: string) => root.querySelector<HTMLInputElement>(`[data-k="${k}"]`)!
  root.querySelector<HTMLSelectElement>('[data-k="area"]')!.onchange = (e) => go('area', (e.target as HTMLSelectElement).value)
  root.querySelector<HTMLSelectElement>('[data-k="mode"]')!.onchange = (e) => go('ascii', (e.target as HTMLSelectElement).value)
  const bind = (k: string, get: () => number, set: (v: number) => void, fmt = (v: number) => v.toFixed(2)) => {
    const el = input(k), out = el.nextElementSibling as HTMLOutputElement
    const show = () => { el.value = String(get()); out.textContent = fmt(get()) }
    el.oninput = () => { set(Number(el.value)); show() }
    el.onchange = () => { if (k === 'cell' || k === 'light') changed?.() }
    return show
  }
  const shows = [
    bind('cell', () => engine.style.cellSize, (v) => engine.setStyle({ cellSize: v }), (v) => `${v}px`),
    bind('light', () => engine.style.brightness, (v) => engine.setStyle({ brightness: v }), (v) => `${Math.round(v * 100)}%`),
    bind('zoom', () => view.zoom, (v) => { view.zoom = v }),
    bind('angle', () => view.angle, (v) => { view.angle = v }),
  ]
  const pause = root.querySelector<HTMLButtonElement>('[data-k="pause"]')!
  pause.onclick = () => { view.paused = !view.paused; pause.textContent = view.paused ? '[ resume ]' : '[ pause ]' }
  root.querySelector<HTMLButtonElement>('[data-k="shot"]')!.onclick = capture
  if (!viewer) {
    const picker = input('import')
    picker.onchange = () => { importFiles(Array.from(picker.files ?? [])); picker.value = '' }
    // Presets: the global letter layer, object types, lights and screen settings as JSON.
    root.querySelector<HTMLButtonElement>('[data-k="save"]')!.onclick = () => {
      const blob = new Blob([JSON.stringify(engine.exportStyle(), null, 2)], { type: 'application/json' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'preset-ascii.json'; a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    }
    const loader = input('load')
    loader.onchange = async () => {
      const file = loader.files?.[0]; loader.value = ''
      if (!file) return
      try { const doc = parseScene({ version: 1, objects: [], style: JSON.parse(await file.text()) }); engine.setStyle(doc.style!); refresh(); changed?.() } catch (error) { document.getElementById('status')!.dataset.note = `invalid preset: ${error}` }
    }
  }
  const refresh = () => shows.forEach((show) => show())
  refresh()
  return { refresh }
}
