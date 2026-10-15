import * as THREE from 'three'
import { downloadDocument } from '../../scene/files'
import { icon } from '../icons'
import type { SandboxContext } from './context'
import { bindTerrainPainting } from './terrain'

export function refreshHint(ctx: SandboxContext) {
  if (ctx.cameraEditor?.viewed) {
    ctx.ui?.hint(
      'Camera view · adjust framing in the inspector · Back to navigation enables scene editing',
    )
    return
  }
  if (ctx.preview) {
    ctx.ui?.hint(
      ctx.cameraEditor?.activeCamera()
        ? 'Preview through the initial camera · Back to editing to adjust'
        : 'Preview without a saved camera · create a camera to set the framing',
    )
    return
  }
  if (ctx.transformMode === 'orbit') {
    ctx.ui?.hint('Orbit · drag sideways and up/down · right drag to pan · scroll to zoom')
    return
  }
  if (ctx.tool.kind === 'water')
    ctx.ui?.hint(
      'Water · drag to paint · Shift erases water · adjust the radius to create lakes or channels',
      true,
    )
  else if (ctx.tool.kind === 'place')
    ctx.ui?.hint(
      `Place ${ctx.library[ctx.tool.prefab]?.title ?? 'object'} · click to place · W/E/R to adjust · Enter confirms · Esc cancels`,
      true,
    )
  else if (ctx.tool.kind !== 'select')
    ctx.ui?.hint(
      'Drag on the terrain to paint · Shift reverses height · Esc returns to selection',
      true,
    )
  else
    ctx.ui?.hint(
      ctx.selected
        ? 'Drag the axes to transform · W move · E rotate · R scale · F focus'
        : 'Drag an asset into the scene · O orbit in 3D · right drag to pan · scroll to zoom',
    )
}

export function setMode(
  ctx: SandboxContext,
  mode: typeof ctx.transformMode,
  cancelPlacement = false,
) {
  if (ctx.cameraEditor?.selected && mode === 'scale') mode = 'translate'
  const placing =
    ctx.tool.kind === 'place' && mode !== 'hand' && mode !== 'orbit' && !cancelPlacement
  if (placing) ctx.placement.lock()
  else ctx.placement.clear()
  ctx.transformMode = mode
  if (!placing) ctx.tool.kind = 'select'
  ctx.gizmos?.cursor()
  if (mode !== 'hand' && mode !== 'orbit') ctx.gizmos?.mode(mode)
  ctx.gizmos?.attach(
    mode !== 'hand' && mode !== 'orbit'
      ? placing
        ? ctx.placement.object
        : ctx.selected
      : undefined,
  )
  ctx.ui?.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => {
    const active = button.dataset.mode === mode
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', String(active))
  })
  ctx.refreshTools()
  ctx.refreshHint()
}

export function beginPlacement(ctx: SandboxContext, prefab: string) {
  if (ctx.busy || ctx.preview) return
  ctx.cameraEditor?.view(null)
  ctx.tool.prefab = prefab
  ctx.tool.kind = 'place'
  ctx.gizmos?.attach()
  ctx.ui?.selectPane('object')
  ctx.placement.show(
    prefab,
    ctx.focus.clone().setY(ctx.scene.terrain?.heightAt(ctx.focus.x, ctx.focus.z) ?? 0),
  )
  if (ctx.transformMode === 'hand' || ctx.transformMode === 'orbit') ctx.transformMode = 'translate'
  ctx.gizmos?.mode(ctx.transformMode)
  ctx.gizmos?.attach(ctx.placement.object)
  ctx.gizmos?.cursor()
  // Preserve card identity so a real second click can open its editor.
  ctx.ui?.root
    .querySelectorAll<HTMLElement>('.asset-card[data-prefab]')
    .forEach(card => card.classList.toggle('active', card.dataset.prefab === prefab))
  ctx.refreshHint()
}

export function placeAt(ctx: SandboxContext, prefab: string, point: THREE.Vector3, repeat = false) {
  if (ctx.busy || ctx.preview) return
  const ghost = ctx.placement.object,
    seed = ctx.placement.seed(prefab)
  const rotation3: [number, number, number] | undefined = ghost
    ? [ghost.rotation.x, ghost.rotation.y, ghost.rotation.z]
    : undefined
  const scale3 = ghost?.scale.toArray() as [number, number, number] | undefined
  if (ctx.placement.locked && ghost) point = ghost.position.clone()
  const y = ctx.placement.locked ? point.y : (ctx.scene.terrain?.heightAt(point.x, point.z) ?? 0)
  ctx.placement.clear()
  ctx.gizmos?.attach()
  const object = ctx.scene.place({
    prefab,
    seed,
    rotation3,
    scale3,
    position: [point.x, y, point.z],
  })
  ctx.choose(object)
  ctx.changed()
  if (repeat) ctx.beginPlacement(prefab)
  else {
    ctx.setMode('translate')
    ctx.gizmos?.cursor()
  }
}

export function bindSceneToolbar(ctx: SandboxContext) {
  const el = <T extends HTMLElement>(key: string) => ctx.ui!.get<T>(`[data-k="${key}"]`)
  el('library').onclick = () => {
    ctx.ui!.showProject('assets')
    ctx.assetCategory = 'All'
    ctx.assetQuery = ''
    el<HTMLInputElement>('asset-search').value = ''
    ctx.refreshLibrary()
    el('asset-search').focus()
  }
  el('create-camera').onclick = () => {
    ctx.cameraEditor!.view(null)
    ctx.setMode('translate', true)
    ctx.cameraEditor!.add()
  }
  el('create-texture').onclick = () => {
    ctx.textureStudio!.open(
      ctx.selected?.userData.sceneId,
      ctx.appearanceObject === ctx.selected ? ctx.appearancePart : '',
    )
    ctx.ui!.showStudio('textures')
  }
  el('create-effect').onclick = () => {
    ctx.ui!.showProject('effects')
    ctx.effectEditor!.newEffect()
  }
  el<HTMLInputElement>('search').oninput = e => {
    ctx.hierarchyQuery = (e.target as HTMLInputElement).value
    ctx.refreshHierarchy()
  }
  el<HTMLInputElement>('asset-search').oninput = e => {
    ctx.assetQuery = (e.target as HTMLInputElement).value
    ctx.refreshLibrary()
  }
  ctx.ui!.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => {
    button.onclick = () => ctx.setMode(button.dataset.mode as typeof ctx.transformMode)
  })
  el<HTMLSelectElement>('space').onchange = e =>
    ctx.gizmos!.space((e.target as HTMLSelectElement).value as 'world' | 'local')
  el('snap').onclick = () => {
    const on = el('snap').getAttribute('aria-pressed') !== 'true'
    el('snap').setAttribute('aria-pressed', String(on))
    el('snap').classList.toggle('active', on)
    ctx.gizmos!.snap(on)
  }
  el('frame').onclick = () => {
    ctx.focus.copy(ctx.selected?.position ?? new THREE.Vector3())
    ctx.focus.y += 0.8
  }
  el('reset-view').onclick = () => {
    ctx.cameraEditor!.view(null)
    ctx.canvas.dispatchEvent(new Event('editor-view-reset'))
  }
  ctx.ui!.root.querySelector<HTMLButtonElement>('[data-object-tool=erase]')!.onclick = () => {
    ctx.placement.clear()
    ctx.tool.kind = 'erase'
    ctx.gizmos?.attach()
    ctx.refreshTools()
    ctx.refreshHint()
  }
  el('cancel').onclick = () => ctx.setMode('translate', true)
  el('preview').onclick = () => {
    ctx.placement.clear()
    ctx.preview = !ctx.preview
    document.body.classList.toggle('previewing', ctx.preview)
    el('preview').innerHTML =
      icon(ctx.preview ? 'cursor' : 'play') + (ctx.preview ? ' Back to editing' : ' Preview')
    for (const panel of [ctx.hierarchy, ctx.sidebar, ctx.ui!.assets, ctx.ui!.get('.scene-tools')])
      panel.inert = ctx.preview
    ctx.gizmos!.cursor()
    ctx.canvas.dispatchEvent(new CustomEvent('editor-preview', { detail: ctx.preview }))
    ctx.refreshHint()
  }
  el('pause').onclick = () => ctx.options.viewControls?.toggle()
  const unsubscribePause = ctx.options.viewControls?.subscribe(paused => {
    el('pause').classList.toggle('active', paused)
    el('pause').setAttribute('aria-pressed', String(paused))
  })
  ctx.signal.signal.addEventListener('abort', () => unsubscribePause?.(), { once: true })
  ctx.ui!.root.addEventListener(
    'project-tab',
    event => {
      const pane = (event as CustomEvent).detail
      if (pane !== 'assets') {
        ctx.placement.clear()
        ctx.gizmos?.attach()
        ctx.gizmos?.cursor()
      } else ctx.gizmos?.attach(ctx.selected)
      if (pane === 'atmosphere') ctx.atmosphereStudio!.refresh()
    },
    { signal: ctx.signal.signal },
  )
}

export function bindSceneInput(ctx: SandboxContext) {
  const raycaster = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

  function groundAt(e: { clientX: number; clientY: number }) {
    const rect = ctx.canvas.getBoundingClientRect()
    ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(ndc, ctx.engine.camera)
    return ctx.scene.terrain
      ? raycaster.intersectObject(ctx.scene.terrain.mesh)[0]?.point
      : raycaster.ray.intersectPlane(plane, new THREE.Vector3())
  }
  bindTerrainPainting(ctx, groundAt, raycaster, ndc)
  ctx.canvas.addEventListener(
    'dragover',
    e => {
      if (
        e.dataTransfer?.types.includes('application/x-ascii-texture') &&
        !ctx.busy &&
        !ctx.preview
      ) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'link'
        return
      }
      if (!e.dataTransfer?.types.includes('application/x-ascii-prefab') || ctx.busy || ctx.preview)
        return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      const point = groundAt(e)
      ctx.gizmos!.cursor()
      ctx.placement.show(ctx.tool.prefab, point ?? undefined)
      const label = ctx.ui!.get('#placement-label')
      label.hidden = !point
      label.textContent = `+ ${ctx.library[ctx.tool.prefab]?.title ?? 'Object'}`
      label.style.left = `${e.clientX + 18}px`
      label.style.top = `${e.clientY + 18}px`
    },
    { signal: ctx.signal.signal },
  )
  ctx.canvas.addEventListener(
    'dragleave',
    () => {
      ctx.placement.clear()
      ctx.gizmos!.cursor()
      ctx.ui!.get('#placement-label').hidden = true
    },
    { signal: ctx.signal.signal },
  )
  ctx.canvas.addEventListener(
    'drop',
    e => {
      const texture = e.dataTransfer?.getData('application/x-ascii-texture')
      if (texture) {
        e.preventDefault()
        e.stopPropagation()
        const rect = ctx.canvas.getBoundingClientRect(),
          hit = ctx.engine.pick(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            1 - ((e.clientY - rect.top) / rect.height) * 2,
          )
        if (hit && ctx.scene.placed.some(item => item.object === hit.object)) {
          ctx.applyTexture(hit.object, texture, hit.part)
        }
        return
      }
      const key = e.dataTransfer?.getData('application/x-ascii-prefab')
      if (!key || !ctx.library[key]) return
      e.preventDefault()
      e.stopPropagation()
      const point = groundAt(e)
      ctx.gizmos!.cursor()
      ctx.ui!.get('#placement-label').hidden = true
      if (point) ctx.run(() => ctx.placeAt(key, point))
    },
    { signal: ctx.signal.signal },
  )
  ctx.canvas.addEventListener(
    'pointermove',
    e => {
      if (
        !ctx.preview &&
        !document.body.classList.contains('studio-mode') &&
        ctx.tool.kind !== 'select' &&
        !e.altKey &&
        e.buttons === 0
      ) {
        const point = groundAt(e)
        if (ctx.tool.kind === 'place') {
          if (!ctx.gizmos!.hovered && !ctx.gizmos!.consumed)
            ctx.placement.show(ctx.tool.prefab, point ?? undefined)
          ctx.gizmos!.attach(ctx.placement.object)
          ctx.gizmos!.cursor()
        } else ctx.gizmos!.cursor(point ?? undefined, ctx.tool.radius)
      }
    },
    { signal: ctx.signal.signal },
  )
  ctx.canvas.addEventListener(
    'pointerleave',
    () => {
      if (!ctx.placement.locked) ctx.placement.clear()
      ctx.gizmos!.cursor()
    },
    { signal: ctx.signal.signal },
  )

  ctx.canvas.addEventListener(
    'pointerup',
    e => {
      if (
        ctx.busy ||
        ctx.preview ||
        ctx.cameraEditor?.viewed ||
        document.body.classList.contains('studio-mode') ||
        ctx.gizmos?.consumed ||
        ctx.transformMode === 'orbit' ||
        ctx.transformMode === 'hand' ||
        e.altKey ||
        e.shiftKey ||
        ctx.tool.kind !== 'select' ||
        e.button !== 0
      )
        return
      const hit = ctx.cameraEditor?.pick(e)
      if (hit) {
        e.stopImmediatePropagation()
        ctx.choose(hit)
      }
    },
    { capture: true, signal: ctx.signal.signal },
  )
  addEventListener(
    'keydown',
    e => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 's' &&
        document.body.classList.contains('studio-mode')
      ) {
        e.preventDefault()
        if (!ctx.ui!.effectRoot.hidden) void ctx.effectEditor!.save()
        else if (!ctx.ui!.textureRoot.hidden) void ctx.textureStudio!.save()
        else void ctx.atmosphereStudio!.save()
        return
      }
      if (
        e.target instanceof HTMLElement &&
        (e.target.matches('input,select,textarea') || e.target.isContentEditable)
      )
        return
      if (e.key === 'Escape') {
        if (ctx.gizmos?.dragging) ctx.gizmos.cancel()
        else ctx.setMode('translate', true)
        return
      }
      if (ctx.preview || ctx.busy) return
      if (e.key === 'Enter' && ctx.tool.kind === 'place' && ctx.placement.object) {
        e.preventDefault()
        ctx.placeAt(ctx.tool.prefab, ctx.placement.object.position.clone(), e.shiftKey)
        return
      }
      const modifier = e.ctrlKey || e.metaKey
      if (modifier && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        ctx.run(() => ctx.undo(e.shiftKey))
      } else if (modifier && e.key.toLowerCase() === 's') {
        e.preventDefault()
        downloadDocument(ctx.snapshot())
      } else if (document.body.classList.contains('studio-mode')) return
      else if (modifier && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        ctx.run(ctx.duplicate)
      } else if (
        !modifier &&
        !e.altKey &&
        ['q', 'o', 'w', 'e', 'r'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault()
        ctx.setMode(
          ({ q: 'hand', o: 'orbit', w: 'translate', e: 'rotate', r: 'scale' } as const)[
            e.key.toLowerCase() as 'q' | 'o' | 'w' | 'e' | 'r'
          ],
        )
      } else if (e.key === 'Delete') ctx.run(ctx.removeSelected)
      else if (e.key.toLowerCase() === 'f' && ctx.selected)
        ctx.focus.copy(ctx.selected.position).add(new THREE.Vector3(0, 0.8, 0))
    },
    { signal: ctx.signal.signal },
  )
}
