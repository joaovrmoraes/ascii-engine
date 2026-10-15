import type { AsciiEngine } from '@ascii-engine/core'
import type { ViewControls } from './editor/viewControls'
import { downloadStylePreset, loadStylePreset } from './editor/stylePresets'

interface PanelOptions {
  engine: AsciiEngine
  view: { angle: number; zoom: number; paused: boolean }
  viewControls: ViewControls
  areas: Record<string, { title: string }>
  areaId: string
  mode: string
  legacyScreenComparison?: boolean
  capture: () => void
  importFiles: (files: File[]) => void
  changed?: () => void
  viewer?: boolean
  hideArea?: boolean
}

/**
 * Live adjustments (seed of phase 4): area, letter mode, cell size and
 * brightness (the player's "Image" controls), zoom and rotation.
 * Debug modes update the current renderer. Changing area or entering/leaving
 * the historical comparison rebuilds its scene recipe through the URL.
 */
export function createPanel({
  engine,
  view,
  viewControls,
  areas,
  areaId,
  mode,
  legacyScreenComparison = false,
  capture,
  importFiles,
  changed,
  viewer = false,
  hideArea = false,
}: PanelOptions) {
  const root = document.getElementById('panel')!
  const authoring = areaId === 'sandbox'
  root.classList.toggle('authoring-display', authoring)
  const go = (key: string, value: string) => {
    const p = new URLSearchParams(location.search)
    p.set(key, value)
    location.search = p.toString()
  }
  root.innerHTML = `
    ${
      hideArea || authoring
        ? ''
        : `<label>area <select data-k="area">${Object.entries(areas)
            .map(
              ([id, a]) =>
                `<option value="${id}"${id === areaId ? ' selected' : ''}>${a.title}</option>`,
            )
            .join('')}</select></label>`
    }
    <label>Debug render <select data-k="mode">${[['letters', 'Glyphs'], ['screen', 'Screen grid (debug)'], ['raw', 'Without screen pass (debug)'], ...(authoring ? [] : [['legacy-screen', 'Legacy screen comparison']])].map(([v, t]) => `<option value="${v}"${v === mode ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
    ${
      authoring
        ? ''
        : `<label>size <input data-k="cell" type="range" min="5" max="12" step="1"><output></output></label>
    <label>light <input data-k="light" type="range" min=".65" max="1.4" step=".05"><output></output></label>`
    }
    <label>${authoring ? 'Zoom' : 'zoom'} <input data-k="zoom" type="range" min="${authoring ? '.18' : '.75'}" max="${authoring ? '4' : '1.5'}" step=".05"><output></output></label>
    <label>${authoring ? 'Rotation' : 'rotation'} <input data-k="angle" type="range" min="-3.14" max="3.14" step=".05"><output></output></label>
    <button data-k="pause">${authoring ? 'Pause' : '[ pause ]'}</button> <button data-k="shot">${authoring ? 'Capture PNG' : '[ capture ]'}</button>
    ${authoring ? '<p class="empty-note">View settings stay in this session. Edit scene exposure and screen cell size in Atmosphere.</p>' : ''}
    ${
      viewer || authoring
        ? ''
        : `<label class="file">[ import models and files ]<input data-k="import" type="file" multiple accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" hidden></label>
    <button data-k="save">[ save preset .json ]</button>
    <label class="file">[ load preset .json ]<input data-k="load" type="file" accept=".json" hidden></label>`
    }`
  const input = (k: string) => root.querySelector<HTMLInputElement>(`[data-k="${k}"]`)!
  if (!hideArea && !authoring)
    root.querySelector<HTMLSelectElement>('[data-k="area"]')!.onchange = e =>
      go('area', (e.target as HTMLSelectElement).value)
  root.querySelector<HTMLSelectElement>('[data-k="mode"]')!.onchange = e => {
    const value = (e.target as HTMLSelectElement).value
    if (value === 'legacy-screen' || legacyScreenComparison) {
      go('ascii', value === 'screen' ? 'debug-screen' : value)
      return
    }
    engine.setRenderMode(value === 'letters' ? 'glyphs' : value === 'raw' ? 'raw' : 'screen')
    if (!authoring) {
      const params = new URLSearchParams(location.search)
      params.set('ascii', value === 'screen' ? 'debug-screen' : value)
      history.replaceState(null, '', '?' + params)
    }
  }
  const bind = (
    k: string,
    get: () => number,
    set: (v: number) => void,
    fmt = (v: number) => v.toFixed(2),
  ) => {
    const el = input(k),
      out = el.nextElementSibling as HTMLOutputElement
    const show = () => {
      el.value = String(get())
      out.textContent = fmt(get())
    }
    el.oninput = () => {
      set(Number(el.value))
      show()
    }
    el.onchange = () => {
      if (k === 'cell' || k === 'light') changed?.()
    }
    return show
  }
  const shows = [
    ...(authoring
      ? []
      : [
          bind(
            'cell',
            () => engine.style.cellSize,
            v => engine.setStyle({ cellSize: v }),
            v => `${v}px`,
          ),
          bind(
            'light',
            () => engine.style.brightness,
            v => engine.setStyle({ brightness: v }),
            v => `${Math.round(v * 100)}%`,
          ),
        ]),
    bind(
      'zoom',
      () => view.zoom,
      v => {
        view.zoom = v
      },
    ),
    bind(
      'angle',
      () => view.angle,
      v => {
        view.angle = v
      },
    ),
  ]
  const pause = root.querySelector<HTMLButtonElement>('[data-k="pause"]')!
  pause.onclick = viewControls.toggle
  const showPause = () => {
    pause.textContent = authoring
      ? view.paused
        ? 'Resume'
        : 'Pause'
      : view.paused
        ? '[ resume ]'
        : '[ pause ]'
    pause.setAttribute('aria-pressed', String(view.paused))
  }
  viewControls.subscribe(showPause)
  root.querySelector<HTMLButtonElement>('[data-k="shot"]')!.onclick = capture
  if (!viewer && !authoring) {
    const picker = input('import')
    picker.onchange = () => {
      importFiles(Array.from(picker.files ?? []))
      picker.value = ''
    }
    // Presets: the global letter layer, object types, lights and screen settings as JSON.
    root.querySelector<HTMLButtonElement>('[data-k="save"]')!.onclick = () => {
      downloadStylePreset(engine)
    }
    const loader = input('load')
    loader.onchange = async () => {
      const file = loader.files?.[0]
      loader.value = ''
      if (!file) return
      try {
        await loadStylePreset(engine, file)
        refresh()
        changed?.()
      } catch (error) {
        document.getElementById('status')!.dataset.note = `invalid preset: ${error}`
      }
    }
  }
  const refresh = () => {
    shows.forEach(show => show())
    showPause()
    input('mode').value = legacyScreenComparison
      ? 'legacy-screen'
      : engine.renderMode === 'glyphs'
        ? 'letters'
        : engine.renderMode
  }
  refresh()
  return { refresh }
}
