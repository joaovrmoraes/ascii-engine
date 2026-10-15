import * as THREE from 'three'
import { createWaterPaint, waterEdge, type BuiltScene, type SceneDoc } from '@ascii-engine/core'
import { waterLetterFields } from './letterControls'

interface WaterInspectorContext {
  index: number
  scene: BuiltScene
  snapshot(): SceneDoc
  replace(doc: SceneDoc): Promise<void>
  changed(): void
  reselect(): void
  paint(): void
  run(action: () => void | Promise<void>): void
  field(label: string, value: string, change: (value: string) => void, type?: string): void
  button(label: string, action: () => void | Promise<void>): void
  focus: THREE.Vector3
  message(text: string): void
}

export function renderWaterInspector(inspector: HTMLElement, context: WaterInspectorContext) {
  const { index, scene, snapshot, replace, changed, run, field, button, focus, message } = context
  const entry = snapshot().waters![index]
  field(
    'Name',
    entry.name ?? '',
    value =>
      run(async () => {
        const doc = snapshot()
        doc.waters![index].name = value || undefined
        await replace(doc)
        context.reselect()
        changed()
      }),
    'text',
  )
  const visibleRow = document.createElement('label'),
    visible = document.createElement('input')
  visibleRow.textContent = 'Visible'
  visible.type = 'checkbox'
  visible.checked = entry.visible ?? true
  visible.dataset.waterVisible = ''
  visible.onchange = () =>
    run(async () => {
      const doc = snapshot()
      doc.waters![index].visible = visible.checked
      await replace(doc)
      context.reselect()
      changed()
    })
  visibleRow.append(visible)
  inspector.append(visibleRow)
  const position = document.createElement('div')
  position.className = 'vector-row'
  const title = document.createElement('span')
  title.textContent = 'Position'
  position.append(title)
  for (const [axis, value, key] of [
    ['x', entry.shape.x, 'x'],
    ['y', entry.level ?? scene.waters[index].mesh.position.y, 'level'],
    ['z', entry.shape.z, 'z'],
  ] as const) {
    const label = document.createElement('label')
    label.className = `axis-${axis}`
    label.textContent = axis.toUpperCase()
    const input = document.createElement('input')
    input.type = 'number'
    input.step = '.1'
    input.value = String(value)
    input.dataset.field = `Position ${axis}`
    input.setAttribute('aria-label', `Position ${axis}`)
    input.onchange = () => {
      if (Number.isFinite(input.valueAsNumber)) void waterChange(key, input.valueAsNumber)
    }
    label.append(input)
    position.append(label)
  }
  inspector.append(position)
  for (const [key, label, value] of [
    ['size', 'Size', entry.shape.size],
    ['angle', 'Direction (degrees)', (entry.shape.angle * 180) / Math.PI],
    ['flow', 'Flow', entry.look?.flow ?? (entry.shape.kind === 'stream' ? 0.35 : 0.025)],
  ] as const)
    field(label, String(value), value => {
      void waterChange(key, Number(value))
    })
  const row = document.createElement('label'),
    reflect = document.createElement('input')
  row.textContent = 'Reflection'
  reflect.type = 'checkbox'
  reflect.checked = scene.waters[index].look.reflection.enabled
  reflect.onchange = () =>
    run(async () => {
      const doc = snapshot()
      doc.waters![index].look = {
        ...doc.waters![index].look,
        reflection: { ...scene.waters[index].look.reflection, enabled: reflect.checked },
      }
      await replace(doc)
      context.reselect()
      changed()
    })
  row.append(reflect)
  inspector.append(row)
  waterLetterFields(inspector, scene.waters[index].look, patch =>
    run(async () => {
      const doc = snapshot(),
        look = { ...doc.waters![index].look, ...patch }
      for (const [key, value] of Object.entries(look))
        if (value === undefined) delete (look as Record<string, unknown>)[key]
      doc.waters![index].look = look
      await replace(doc)
      context.reselect()
      changed()
    }),
  )
  const physics = scene.waters[index].physics
  const physicalRow = document.createElement('label'),
    physical = document.createElement('input')
  physicalRow.textContent = 'Simulate water'
  physical.type = 'checkbox'
  physical.checked = physics.enabled
  async function changePhysics(patch: Partial<typeof physics>) {
    await run(async () => {
      const doc = snapshot()
      doc.waters![index].physics = { ...physics, ...patch }
      await replace(doc)
      context.reselect()
      changed()
    })
  }
  physical.onchange = () => {
    void changePhysics({ enabled: physical.checked })
  }
  physicalRow.append(physical)
  inspector.append(physicalRow)
  for (const [key, label] of [
    ['depth', 'Initial depth (m)'],
    ['source', 'Source rate (m/s)'],
    ['damping', 'Flow resistance'],
    ['waves', 'Wave amplitude (m)'],
  ] as const)
    field(label, String(physics[key]), value => {
      void changePhysics({ [key]: Number(value) })
    })
  button('Test waves', () => {
    const water = scene.waters[index],
      d = water.dynamics,
      c = Math.cos(water.shape.angle),
      s = Math.sin(water.shape.angle)
    let best = Infinity,
      point = [0, 0]
    for (let i = 0; i < d.wet.length; i++)
      if (d.wet[i]) {
        const x = ((i % d.resolution) / (d.resolution - 1) - 0.5) * d.size,
          z = (Math.floor(i / d.resolution) / (d.resolution - 1) - 0.5) * d.size
        const wx = water.shape.x + c * x - s * z,
          wz = water.shape.z + s * x + c * z,
          distance = (wx - focus.x) ** 2 + (wz - focus.z) ** 2
        if (distance < best) {
          best = distance
          point = [wx, wz]
        }
      }
    water.disturb(point[0], point[1], 0.28, 1)
  })
  const waterHint = document.createElement('p')
  waterHint.className = 'empty-note'
  waterHint.textContent =
    'Gravity moves water downhill within the painted area. A zero source rate closes the inlet; moving objects in water generates waves. The Atmosphere main light controls the reflected highlight.'
  inspector.append(waterHint)
  if (!entry.shape.mask?.heights && scene.terrain)
    button('Fit to terrain', async () => {
      const doc = snapshot(),
        terrain = scene.terrain!,
        { size, resolution } = terrain.data
      const shape = createWaterPaint(size, resolution)
      for (let z = 0; z < resolution; z++)
        for (let x = 0; x < resolution; x++)
          shape.mask!.values[z * resolution + x] = waterEdge(
            entry.shape,
            (x / (resolution - 1)) * size - size / 2,
            (z / (resolution - 1)) * size - size / 2,
          )
      shape.mask!.heights = terrain.data.heights.map(height => height + 0.045)
      doc.waters![index] = { ...entry, shape, level: 0 }
      await replace(doc)
      context.reselect()
      changed()
    })
  if (entry.shape.kind === 'paint') button('Edit water in Terrain', context.paint)
  async function waterChange(key: string, value: number) {
    try {
      const doc = snapshot(),
        water = doc.waters![index]
      if (key === 'level') water.level = value
      else if (key === 'flow')
        water.look = {
          ...water.look,
          flow: value,
          pondDrift: [Math.cos(water.shape.angle) * value, Math.sin(water.shape.angle) * value],
        }
      else Object.assign(water.shape, { [key]: key === 'angle' ? (value * Math.PI) / 180 : value })
      await replace(doc)
      context.reselect()
      changed()
    } catch (error) {
      message(String(error))
    }
  }
}
