import {
  createWaterPaint,
  paintWater,
  waterEdge,
  type Brush,
  type BuiltScene,
} from '@ascii-engine/core'
import * as THREE from 'three'
import { fillAtmosphereSelect, matchingAtmosphere } from '../atmospheres'
import { glyphLabel } from '../glyphCatalog'
import { icon } from '../icons'
import { terrainLetterFields } from '../letterControls'
import type { SandboxContext, Tool } from './context'

export function refreshTools(ctx: SandboxContext) {
  if (!ctx.ui) return
  if (!ctx.library[ctx.tool.prefab]) {
    ctx.tool.prefab = 'arvore'
    if (ctx.tool.kind === 'place') ctx.tool.kind = 'select'
  }
  const layers = ctx.box.querySelector<HTMLSelectElement>('[data-k="layer"]')!
  layers.replaceChildren(
    ...(ctx.scene.terrain?.data.layers ?? []).map(
      (l, i) => new Option(glyphLabel(l.name), String(i)),
    ),
  )
  layers.value = String(ctx.tool.layer)
  layers.disabled = !ctx.scene.terrain
  ctx.box.querySelectorAll<HTMLButtonElement>('[data-brush]').forEach(button => {
    button.disabled = !ctx.scene.terrain
    const active = ctx.tool.kind === button.dataset.brush
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', String(active))
  })
  ctx.box.querySelector('[data-k="water-mode"]')!.closest('label')!.hidden =
    ctx.tool.kind !== 'water'
  const erase = ctx.ui!.get<HTMLButtonElement>('[data-object-tool=erase]')
  erase.classList.toggle('active', ctx.tool.kind === 'erase')
  erase.setAttribute('aria-pressed', String(ctx.tool.kind === 'erase'))
  ctx.ui!.get('[data-k="no-terrain"]').hidden = !!ctx.scene.terrain
  ctx.ui!.get<HTMLSelectElement>('[data-k="weather"]').value =
    ctx.snapshot().environment?.weather ?? 'none'
  ctx.ui!.get<HTMLInputElement>('[data-k="weather-intensity"]').value = String(
    ctx.snapshot().environment?.intensity ?? 1,
  )
  fillAtmosphereSelect(
    ctx.ui!.get<HTMLSelectElement>('[data-k="atmosphere"]'),
    ctx.snapshot(),
    matchingAtmosphere(ctx.snapshot(), ctx.engine.style) ?? 'current',
  )
  const root = ctx.box.querySelector<HTMLElement>('[data-k=terrain-letters]')!
  const layer = ctx.scene.terrain?.data.layers[ctx.tool.layer]
  root.hidden = !layer
  if (layer)
    terrainLetterFields(root, layer, patch =>
      ctx.run(async () => {
        const doc = ctx.snapshot()
        doc.terrain!.layers[ctx.tool.layer] = { ...doc.terrain!.layers[ctx.tool.layer], ...patch }
        await ctx.replace(doc)
        ctx.changed()
      }),
    )
  ctx.refreshLibrary()
}

export function bindTerrain(ctx: SandboxContext) {
  const el = <T extends HTMLElement>(key: string) => ctx.ui!.get<T>(`[data-k="${key}"]`)
  const brushes: [Tool, string, string][] = [
    ['raise', 'Raise', 'terrain'],
    ['lower', 'Lower', 'terrain'],
    ['smooth', 'Smooth', 'rock'],
    ['flatten', 'Flatten', 'grid'],
    ['paint', 'Paint', 'cursor'],
    ['water', 'Water', 'water'],
  ]
  ctx.box.innerHTML = `<div class="component-title">${icon('terrain')} Terrain tools</div><p data-k="no-terrain" class="empty-note" hidden>This item has no terrain. Use File → New map.</p><div class="brush-grid">${brushes.map(([key, title, symbol]) => `<button data-brush="${key}">${icon(symbol)}${title}</button>`).join('')}</div><label>Radius<input data-k="radius" type="range" min=".5" max="8" step=".25"></label><label>Water<select data-k="water-mode"><option value="terrain">Follow terrain</option><option value="level">Flat level (lake)</option></select></label><label>Strength<input data-k="strength" type="range" min=".01" max=".4" step=".01"></label><label>Layer<select data-k="layer"></select></label><button data-k="grow">Regrow grass</button><p class="empty-note">Drag over the terrain. Undo each stroke with Ctrl Z.</p><div data-k="terrain-letters"></div>`
  ctx.box.querySelectorAll<HTMLButtonElement>('[data-brush]').forEach(button => {
    button.onclick = () => {
      ctx.placement.clear()
      ctx.tool.kind = button.dataset.brush as Tool
      ctx.gizmos!.attach()
      ctx.refreshTools()
      ctx.refreshHint()
    }
  })
  for (const key of ['radius', 'strength'] as const) {
    const input = el<HTMLInputElement>(key)
    input.value = String(ctx.tool[key])
    input.oninput = () => {
      ctx.tool[key] = Number(input.value)
    }
  }
  el<HTMLSelectElement>('water-mode').onchange = e => {
    ctx.tool.waterMode = (e.target as HTMLSelectElement).value as 'terrain' | 'level'
    ctx.selectedWater = -1
  }
  el<HTMLSelectElement>('layer').onchange = e => {
    ctx.tool.layer = Number((e.target as HTMLSelectElement).value)
    ctx.refreshTools()
  }
  el('grow').onclick = () =>
    ctx.run(() => {
      ctx.scene.regrow()
      ctx.changed()
    })
  ctx.ui!.environment.innerHTML = `<div class="component-title">${icon('spark')} Scene environment</div><label>Weather<select data-k="weather"><option value="none">No precipitation</option><option value="rain">Rain</option><option value="snow">Snow</option></select></label><label>Weather intensity<input data-k="weather-intensity" type="range" min="0" max="1" step=".05" aria-label="Weather intensity"></label><label>Atmosphere<select data-k="atmosphere"><option value="moon">Moonlight</option><option value="dusk">Dusk</option><option value="ember">Ember</option></select></label><button data-k="open-studio">Open atmosphere studio</button><p class="empty-note">Settings saved with the map.</p>`
  el<HTMLSelectElement>('weather').onchange = e =>
    ctx.run(async () => {
      const doc = ctx.snapshot()
      doc.environment = {
        ...doc.environment,
        weather: (e.target as HTMLSelectElement).value as 'none' | 'rain' | 'snow',
      }
      await ctx.replace(doc)
      ctx.changed()
    })
  el<HTMLInputElement>('weather-intensity').onchange = e =>
    ctx.run(async () => {
      const doc = ctx.snapshot()
      doc.environment = {
        weather: doc.environment?.weather ?? 'none',
        intensity: (e.target as HTMLInputElement).valueAsNumber,
      }
      await ctx.replace(doc)
      ctx.changed()
    })
  el<HTMLSelectElement>('atmosphere').onchange = e => {
    const value = (e.target as HTMLSelectElement).value
    if (value.startsWith('asset:')) ctx.atmosphereStudio!.applyAsset(value.slice(6))
    else if (value !== 'current')
      ctx.atmosphereStudio!.setPreset(value as 'moon' | 'dusk' | 'ember')
  }
  el('open-studio').onclick = () => {
    ctx.atmosphereStudio!.refresh()
    ctx.ui!.showStudio('atmosphere')
  }
}

export function bindTerrainPainting(
  ctx: SandboxContext,
  groundAt: (event: { clientX: number; clientY: number }) => THREE.Vector3 | null | undefined,
  raycaster: THREE.Raycaster,
  ndc: THREE.Vector2,
) {
  let painting = false,
    strokeChanged = false,
    flattenHeight = 0
  let previousWaterPoint: THREE.Vector3 | undefined,
    lastRegrow = 0
  let strokeWater: BuiltScene['waters'][number] | undefined
  function act(e: PointerEvent, first: boolean) {
    let p = groundAt(e)
    if (painting && !first && ctx.tool.kind === 'water' && !strokeWater?.shape.mask?.heights)
      p = raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 1, 0), -flattenHeight),
        new THREE.Vector3(),
      )
    if (!p) {
      previousWaterPoint = undefined
      return
    }
    if (first) flattenHeight = p.y
    let kind = ctx.tool.kind
    if (e.shiftKey && (kind === 'raise' || kind === 'lower'))
      kind = kind === 'raise' ? 'lower' : 'raise'
    if (kind === 'place' && first) {
      ctx.placeAt(ctx.tool.prefab, p, e.shiftKey)
      strokeChanged = false
    } else if (kind === 'erase' && first) {
      const hit = ctx.engine.pick(ndc.x, ndc.y)
      if (hit && ctx.scene.placed.some(v => v.object === hit.object)) {
        ctx.scene.remove(hit.object)
        ctx.choose()
        strokeChanged = true
      }
    } else if (kind === 'water' && ctx.scene.terrain) {
      const terrain = ctx.scene.terrain
      if (first) {
        previousWaterPoint = undefined
        strokeWater =
          ctx.scene.waters[ctx.selectedWater]?.shape.kind === 'paint'
            ? ctx.scene.waters[ctx.selectedWater]
            : ctx.scene.waters.find(
                w =>
                  w.shape.kind === 'paint' &&
                  !!w.shape.mask?.heights === (ctx.tool.waterMode === 'terrain'),
              )
        if (!strokeWater && !e.shiftKey) {
          const shape = createWaterPaint(terrain.data.size, terrain.data.resolution)
          if (ctx.tool.waterMode === 'terrain')
            shape.mask!.heights = terrain.data.heights.map(height => height + 0.045)
          strokeWater = ctx.scene.addWater({
            shape,
            level: ctx.tool.waterMode === 'terrain' ? 0 : p.y - 0.05,
          })
        }
      }
      if (!strokeWater) return
      if (paintWater(strokeWater.shape, previousWaterPoint ?? p, p, ctx.tool.radius, e.shiftKey)) {
        strokeWater.refresh()
        if (!e.shiftKey && !strokeWater.shape.mask?.heights) {
          const { size, resolution, heights } = terrain.data,
            level = strokeWater.mesh.position.y
          for (let z = 0; z < resolution; z++)
            for (let x = 0; x < resolution; x++) {
              const edge = waterEdge(
                strokeWater.shape,
                (x / (resolution - 1)) * size - size / 2,
                (z / (resolution - 1)) * size - size / 2,
              )
              if (edge > -0.2)
                heights[z * resolution + x] = Math.min(
                  heights[z * resolution + x],
                  level - Math.max(-0.05, Math.min(0.65, edge * 0.8 + 0.08)),
                )
            }
          terrain.refresh()
        }
        strokeChanged = true
        if (performance.now() - lastRegrow > 150) {
          ctx.scene.regrow()
          lastRegrow = performance.now()
        }
      }
      previousWaterPoint = p.clone()
      ctx.gizmos!.cursor(p, ctx.tool.radius)
    } else if (ctx.scene.terrain && !['select', 'place', 'erase', 'water'].includes(kind)) {
      ctx.scene.terrain.apply({
        brush: kind as Brush,
        x: p.x,
        z: p.z,
        radius: ctx.tool.radius,
        strength: kind === 'paint' ? ctx.tool.strength * 4 : ctx.tool.strength,
        layer: ctx.tool.layer,
        height: flattenHeight,
      })
      strokeChanged = true
    }
  }
  addEventListener(
    'pointerdown',
    e => {
      if (
        ctx.busy ||
        ctx.preview ||
        ctx.cameraEditor?.viewed ||
        document.body.classList.contains('studio-mode') ||
        e.altKey ||
        (ctx.tool.kind === 'place' && ctx.gizmos!.hovered) ||
        ctx.tool.kind === 'select' ||
        e.target !== ctx.canvas ||
        e.button !== 0
      )
        return
      e.stopPropagation()
      painting = true
      strokeChanged = false
      act(e, true)
    },
    { capture: true, signal: ctx.signal.signal },
  )
  addEventListener(
    'pointermove',
    e => {
      if (painting) {
        e.stopPropagation()
        act(e, false)
      }
    },
    { capture: true, signal: ctx.signal.signal },
  )
  function syncWaterSlopes() {
    const terrain = ctx.scene.terrain
    if (!terrain) return
    for (const water of ctx.scene.waters) {
      const { shape } = water,
        mask = shape.mask
      if (!mask?.heights) continue
      const n = mask.resolution,
        c = Math.cos(shape.angle),
        s = Math.sin(shape.angle)
      for (let z = 0; z < n; z++)
        for (let x = 0; x < n; x++) {
          const lx = (x / (n - 1) - 0.5) * shape.size * 2,
            lz = (z / (n - 1) - 0.5) * shape.size * 2
          mask.heights[z * n + x] =
            terrain.heightAt(shape.x + c * lx - s * lz, shape.z + s * lx + c * lz) +
            0.045 -
            water.mesh.position.y
        }
      water.refresh()
    }
  }
  const endStroke = (e: Event) => {
    if (painting) {
      e.stopPropagation()
      painting = false
      if (strokeChanged) {
        syncWaterSlopes()
        ctx.scene.regrow()
        ctx.changed()
      }
    }
  }
  addEventListener('pointerup', endStroke, { capture: true, signal: ctx.signal.signal })
  addEventListener('pointercancel', endStroke, { capture: true, signal: ctx.signal.signal })
}
