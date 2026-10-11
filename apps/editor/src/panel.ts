import type { AsciiEngine } from '@ascii-engine/core'

interface PanelOptions {
  engine: AsciiEngine
  view: { angle: number; zoom: number; paused: boolean }
  areas: Record<string, { title: string }>
  areaId: string
  mode: string
  capture: () => void
}

/**
 * Live adjustments (seed of phase 4): area, letter mode, cell size and
 * brightness (the player's "Imagem" controls), zoom and rotation.
 * Changing area or mode reloads with the URL, so every view is shareable.
 */
export function createPanel({ engine, view, areas, areaId, mode, capture }: PanelOptions) {
  const root = document.getElementById('panel')!
  const go = (key: string, value: string) => { const p = new URLSearchParams(location.search); p.set(key, value); location.search = p.toString() }
  root.innerHTML = `
    <label>área <select data-k="area">${Object.entries(areas).map(([id, a]) => `<option value="${id}"${id === areaId ? ' selected' : ''}>${a.title}</option>`).join('')}</select></label>
    <label>modo <select data-k="mode">${[['letters', 'letras'], ['screen', 'tela (antigo)'], ['raw', 'sem passe de tela']].map(([v, t]) => `<option value="${v}"${v === mode ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>tamanho <input data-k="cell" type="range" min="5" max="12" step="1"><output></output></label>
    <label>luz <input data-k="light" type="range" min=".65" max="1.4" step=".05"><output></output></label>
    <label>zoom <input data-k="zoom" type="range" min=".75" max="1.5" step=".05"><output></output></label>
    <label>giro <input data-k="angle" type="range" min="-3.14" max="3.14" step=".05"><output></output></label>
    <button data-k="pause">[ pausar ]</button> <button data-k="shot">[ captura ]</button>`
  const input = (k: string) => root.querySelector<HTMLInputElement>(`[data-k="${k}"]`)!
  root.querySelector<HTMLSelectElement>('[data-k="area"]')!.onchange = (e) => go('area', (e.target as HTMLSelectElement).value)
  root.querySelector<HTMLSelectElement>('[data-k="mode"]')!.onchange = (e) => go('ascii', (e.target as HTMLSelectElement).value)
  const bind = (k: string, get: () => number, set: (v: number) => void, fmt = (v: number) => v.toFixed(2)) => {
    const el = input(k), out = el.nextElementSibling as HTMLOutputElement
    const show = () => { el.value = String(get()); out.textContent = fmt(get()) }
    el.oninput = () => { set(Number(el.value)); show() }
    return show
  }
  const shows = [
    bind('cell', () => engine.style.cellSize, (v) => engine.setStyle({ cellSize: v }), (v) => `${v}px`),
    bind('light', () => engine.style.brightness, (v) => engine.setStyle({ brightness: v }), (v) => `${Math.round(v * 100)}%`),
    bind('zoom', () => view.zoom, (v) => { view.zoom = v }),
    bind('angle', () => view.angle, (v) => { view.angle = v }),
  ]
  const pause = root.querySelector<HTMLButtonElement>('[data-k="pause"]')!
  pause.onclick = () => { view.paused = !view.paused; pause.textContent = view.paused ? '[ continuar ]' : '[ pausar ]' }
  root.querySelector<HTMLButtonElement>('[data-k="shot"]')!.onclick = capture
  const refresh = () => shows.forEach((show) => show())
  refresh()
  return { refresh }
}
