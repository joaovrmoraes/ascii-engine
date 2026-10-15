type Slot = 'left' | 'right' | 'bottom'
type Panel = 'hierarchy' | 'authoring-sidebar' | 'asset-browser'
type Bounds = { x: number; y: number; width: number; height: number }
type Layout = {
  sizes: Record<Slot, number>
  slots: Partial<Record<Slot, Panel>>
  floats: Partial<Record<Panel, Bounds>>
}
const KEY = 'ascii-editor-layout-v1'
const defaults = (): Layout => ({
  sizes: { left: 232, right: 320, bottom: 260 },
  slots: { left: 'hierarchy', right: 'authoring-sidebar', bottom: 'asset-browser' },
  floats: {},
})
const panels: Panel[] = ['hierarchy', 'authoring-sidebar', 'asset-browser']
const slots: Slot[] = ['left', 'right', 'bottom']
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, Math.max(min, max)))

/** Movable panels with edge docking and a browser-local layout. */
export function createPanelLayout(root: HTMLElement) {
  let layout = defaults(),
    z = 10
  const abort = new AbortController(),
    signal = abort.signal
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Layout | null
    if (
      saved &&
      slots.every(slot => Number.isFinite(saved.sizes?.[slot])) &&
      saved.slots &&
      saved.floats &&
      Object.keys(saved.slots).every(key => slots.includes(key as Slot))
    ) {
      const assigned = Object.values(saved.slots)
      if (
        assigned.every(id => panels.includes(id)) &&
        new Set(assigned).size === assigned.length &&
        panels.every(
          id =>
            assigned.includes(id) ||
            (saved.floats[id] &&
              ['x', 'y', 'width', 'height'].every(k =>
                Number.isFinite(saved.floats[id]![k as keyof Bounds]),
              )),
        )
      )
        layout = saved
    }
  } catch {
    /* A broken or unavailable preference must not hide the editor. */
  }
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(layout))
    } catch {
      /* Session layout still works. */
    }
  }
  const el = (id: Panel) => root.querySelector<HTMLElement>(`#${id}`)!
  const slotOf = (id: Panel) => slots.find(slot => layout.slots[slot] === id)
  function fit(bounds: Bounds): Bounds {
    const width = clamp(bounds.width, 220, innerWidth - 16),
      height = clamp(bounds.height, 150, innerHeight - 108)
    return {
      width,
      height,
      x: clamp(bounds.x, 0, innerWidth - width),
      y: clamp(bounds.y, 76, innerHeight - height - 24),
    }
  }
  function dimensions() {
    layout.sizes.left = clamp(layout.sizes.left, 180, Math.max(180, innerWidth * 0.35))
    layout.sizes.right = clamp(layout.sizes.right, 240, Math.max(240, innerWidth * 0.4))
    layout.sizes.bottom = clamp(layout.sizes.bottom, 160, innerHeight - 320)
    return {
      left: layout.slots.left ? layout.sizes.left : 0,
      right: layout.slots.right ? layout.sizes.right : 0,
      bottom: layout.slots.bottom ? layout.sizes.bottom : 0,
    }
  }
  function slotBounds(slot: Slot): Bounds {
    const s = dimensions()
    if (slot === 'left')
      return { x: 0, y: 76, width: layout.sizes.left, height: innerHeight - 100 - s.bottom }
    if (slot === 'right')
      return {
        x: innerWidth - layout.sizes.right,
        y: 76,
        width: layout.sizes.right,
        height: innerHeight - 100,
      }
    return {
      x: 0,
      y: innerHeight - layout.sizes.bottom - 24,
      width: innerWidth - s.right,
      height: layout.sizes.bottom,
    }
  }
  function apply() {
    const s = dimensions()
    for (const slot of slots)
      document.body.style.setProperty(`--${slot === 'bottom' ? 'library' : slot}`, `${s[slot]}px`)
    for (const id of panels) {
      const panel = el(id),
        slot = slotOf(id),
        bounds = slot ? slotBounds(slot) : fit(layout.floats[id]!)
      panel.dataset.dock = slot ?? 'floating'
      if (!slot) layout.floats[id] = bounds
      Object.assign(panel.style, {
        left: `${bounds.x}px`,
        top: `${bounds.y}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        right: 'auto',
        bottom: 'auto',
      })
      panel.querySelector<HTMLButtonElement>('.panel-dock')!.hidden = !!slot
    }
  }
  const indicator = document.createElement('div')
  indicator.id = 'dock-drop-preview'
  indicator.hidden = true
  root.append(indicator)
  function target(x: number, y: number): Slot | undefined {
    if (x < 64) return 'left'
    if (x > innerWidth - 64) return 'right'
    if (y > innerHeight - 80) return 'bottom'
  }
  function dock(id: Panel, slot: Slot, previous?: Slot) {
    const occupant = layout.slots[slot]
    const current = slotOf(id)
    if (current) delete layout.slots[current]
    if (occupant && occupant !== id) {
      if (previous && previous !== slot) layout.slots[previous] = occupant
      else
        layout.floats[occupant] = fit(
          layout.floats[id] ?? { x: 300, y: 160, width: 380, height: 380 },
        )
    }
    layout.slots[slot] = id
    delete layout.floats[id]
  }
  let finish: (() => void) | undefined
  for (const id of panels) {
    const panel = el(id),
      heading = panel.querySelector<HTMLElement>('.dock-heading')!
    panel.classList.add('movable-panel')
    heading.title = 'Drag to move; drop at an edge to dock. Double-click to restore docking.'
    const grip = document.createElement('span')
    grip.className = 'panel-grip'
    grip.textContent = '⠿'
    grip.title = 'Drag to move this panel'
    heading.prepend(grip)
    const button = document.createElement('button')
    button.className = 'panel-dock'
    button.textContent = 'Dock'
    button.title = 'Dock panel'
    button.onclick = () => {
      dock(id, panels.indexOf(id) === 0 ? 'left' : id === 'authoring-sidebar' ? 'right' : 'bottom')
      apply()
      save()
    }
    heading.append(button)
    const handle = document.createElement('div')
    handle.className = 'panel-resize'
    handle.role = 'separator'
    handle.title = 'Drag to resize'
    panel.append(handle)
    panel.addEventListener(
      'pointerdown',
      () => {
        if (!slotOf(id)) panel.style.zIndex = String(++z)
      },
      { signal },
    )
    heading.addEventListener(
      'dblclick',
      event => {
        if ((event.target as HTMLElement).closest('button,input,label')) return
        button.click()
      },
      { signal },
    )
    const start = (event: PointerEvent, resize: boolean) => {
      if (
        event.button !== 0 ||
        (!resize && (event.target as HTMLElement).closest('button,input,label,select'))
      )
        return
      event.preventDefault()
      finish?.()
      const rect = panel.getBoundingClientRect(),
        previous = slotOf(id),
        startSize = { ...layout.sizes },
        startX = event.clientX,
        startY = event.clientY
      const bounds = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      let moved = false,
        drop: Slot | undefined
      const interaction = new AbortController()
      const end = () => {
        interaction.abort()
        indicator.hidden = true
        document.body.classList.remove('moving-panel')
        if (moved && !resize && drop) dock(id, drop, previous)
        apply()
        save()
        finish = undefined
      }
      finish = end
      window.addEventListener(
        'pointermove',
        e => {
          const dx = e.clientX - startX,
            dy = e.clientY - startY
          if (!moved && Math.hypot(dx, dy) < 4) return
          moved = true
          document.body.classList.add('moving-panel')
          if (resize && previous)
            layout.sizes[previous] =
              startSize[previous] + (previous === 'left' ? dx : previous === 'right' ? -dx : -dy)
          else {
            if (previous) delete layout.slots[previous]
            layout.floats[id] = resize
              ? { ...bounds, width: bounds.width + dx, height: bounds.height + dy }
              : { ...bounds, x: bounds.x + dx, y: bounds.y + dy }
            panel.style.zIndex = String(++z)
            drop = resize ? undefined : target(e.clientX, e.clientY)
            indicator.hidden = !drop
            if (drop) {
              const b = slotBounds(drop)
              Object.assign(indicator.style, {
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: `${b.width}px`,
                height: `${b.height}px`,
              })
              indicator.textContent = 'Drop to dock'
            }
          }
          apply()
        },
        { signal: interaction.signal },
      )
      window.addEventListener('pointerup', end, { once: true, signal: interaction.signal })
      window.addEventListener('pointercancel', end, { once: true, signal: interaction.signal })
      window.addEventListener('blur', end, { once: true, signal: interaction.signal })
    }
    heading.addEventListener('pointerdown', event => start(event, false), { signal })
    handle.addEventListener('pointerdown', event => start(event, true), { signal })
  }
  window.addEventListener('resize', apply, { signal })
  apply()
  return {
    reset() {
      finish?.()
      layout = defaults()
      apply()
      save()
    },
    dispose() {
      finish?.()
      abort.abort()
      indicator.remove()
      for (const key of ['left', 'right', 'library']) document.body.style.removeProperty(`--${key}`)
    },
  }
}
