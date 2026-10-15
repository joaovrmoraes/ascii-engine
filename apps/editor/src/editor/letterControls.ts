import {
  validGlyphAlphabet,
  type GlyphStyle,
  type GroundLayer,
  type WaterLook,
} from '@ascii-engine/core'
import { GLYPH_FAMILIES, glyphLabel } from './glyphCatalog'

export function validateAlphabetInput(input: HTMLInputElement) {
  input.setCustomValidity(
    input.value && !validGlyphAlphabet(input.value)
      ? 'Use 1–128 single characters, including a visible character. Control and combining sequences are unsupported.'
      : '',
  )
}
export function alphabetInput(value = '', placeholder = 'Use default letters') {
  const input = document.createElement('input')
  input.type = 'text'
  input.maxLength = 256
  input.spellcheck = false
  input.value = value
  input.placeholder = placeholder
  input.addEventListener('input', () => validateAlphabetInput(input))
  validateAlphabetInput(input)
  return input
}

/** The same alphabet validation and field construction serve all lettered components. */
export function letterFields(root: HTMLElement) {
  function row(label: string, input: HTMLElement) {
    const row = document.createElement('label')
    row.textContent = label
    row.append(input)
    root.append(row)
  }
  function text(
    key: string,
    label: string,
    value: string | undefined,
    update: (value: string | undefined) => void,
    alphabet = false,
  ) {
    const input = alphabet ? alphabetInput(value) : document.createElement('input')
    input.type = 'text'
    input.value = value ?? ''
    input.dataset.letter = key
    input.setAttribute('aria-label', label)
    input.onchange = () => {
      if (input.reportValidity()) update(input.value || undefined)
    }
    row(label, input)
  }
  function number(
    key: string,
    label: string,
    value: number | undefined,
    fallback: number,
    min: number,
    max: number,
    step: number,
    update: (value: number | undefined) => void,
  ) {
    const input = document.createElement('input')
    input.type = 'number'
    input.value = value === undefined ? '' : String(value)
    input.placeholder = String(fallback)
    input.min = String(min)
    input.max = String(max)
    input.step = String(step)
    input.dataset.letter = key
    input.setAttribute('aria-label', label)
    input.onchange = () => {
      if (input.reportValidity()) update(input.value ? input.valueAsNumber : undefined)
    }
    row(label, input)
  }
  function select(
    key: string,
    label: string,
    value: string | undefined,
    choices: [string, string][],
    update: (value: string | undefined) => void,
  ) {
    const input = document.createElement('select')
    input.append(new Option('Use default', ''))
    choices.forEach(([value, label]) => input.append(new Option(label, value)))
    input.value = value ?? ''
    input.dataset.letter = key
    input.onchange = () => update(input.value || undefined)
    row(label, input)
  }
  function color(
    key: string,
    label: string,
    value: number | undefined,
    fallback: number,
    update: (value: number | undefined) => void,
  ) {
    const controls = document.createElement('span')
    controls.className = 'glyph-color'
    const input = document.createElement('input')
    input.type = 'color'
    input.value = '#' + (value ?? fallback).toString(16).padStart(6, '0')
    input.dataset.letter = key
    input.onchange = () => update(parseInt(input.value.slice(1), 16))
    input.setAttribute('aria-label', label)
    const clear = document.createElement('button')
    clear.textContent = 'Default'
    clear.type = 'button'
    clear.onclick = () => update(undefined)
    controls.append(input, clear)
    row(label, controls)
  }
  return { text, number, select, color }
}
function section(root: HTMLElement, title: string) {
  const box = document.createElement('fieldset'),
    legend = document.createElement('legend')
  legend.textContent = title
  box.append(legend)
  root.append(box)
  return box
}
const hex = (rgb: number[]) =>
  rgb
    .map(channel => Math.round(Math.min(1, channel) * 255))
    .reduce((color, channel) => (color << 8) | channel, 0)
const rgb = (color: number): [number, number, number] => [
  (color >> 16) / 255,
  ((color >> 8) & 255) / 255,
  (color & 255) / 255,
]

export function waterLetterFields(
  root: HTMLElement,
  look: WaterLook,
  update: (patch: Partial<WaterLook>) => void,
) {
  const fields = letterFields(section(root, 'Water letters'))
  for (const [key, label] of [
    ['alphabet', 'Water alphabet'],
    ['foamAlphabet', 'Foam alphabet'],
    ['reflectionAlphabet', 'Reflection alphabet'],
  ] as const)
    fields.text(key, label, look[key], value => update({ [key]: value }), true)
  fields.text('font', 'Font', look.font, font => update({ font }))
  fields.select(
    'fontWeight',
    'Font weight',
    look.fontWeight?.toString(),
    [
      ['400', 'Regular'],
      ['700', 'Bold'],
    ],
    value => update({ fontWeight: value ? (Number(value) as 400 | 700) : undefined }),
  )
  fields.number('cell-x', 'Cell width (m)', look.cell[0], 0.15, 0.01, 2, 0.01, value =>
    update({ cell: [value ?? 0.15, look.cell[1]] }),
  )
  fields.number('cell-z', 'Cell height (m)', look.cell[1], 0.19, 0.01, 2, 0.01, value =>
    update({ cell: [look.cell[0], value ?? 0.19] }),
  )
  fields.number('sparse', 'Row sparsity', look.sparse, 0.22, 0, 1, 0.01, value =>
    update({ sparse: value ?? 0.22 }),
  )
  fields.color('open', 'Base water color', hex(look.open), hex(look.open), value =>
    update({ open: value === undefined ? undefined : rgb(value) }),
  )
  fields.color('sheen', 'Moon sheen color', hex(look.sheen), hex(look.sheen), value =>
    update({ sheen: value === undefined ? undefined : rgb(value) }),
  )
  for (const [key, label] of [
    ['shallow', 'Shallow color'],
    ['deep', 'Deep color'],
    ['foam', 'Foam color'],
  ] as const)
    fields.color(
      key,
      label,
      look[key] ? hex(look[key]!) : undefined,
      hex(key === 'foam' ? look.foam : look.open),
      value => update({ [key]: value === undefined ? undefined : rgb(value) }),
    )
  fields.number('depthScale', 'Deep color at (m)', look.depthScale, 0.5, 0.005, 10, 0.005, value =>
    update({ depthScale: value }),
  )
  fields.number(
    'reflection-strength',
    'Reflection strength',
    look.reflection.strength,
    1,
    0,
    4,
    0.05,
    value => update({ reflection: { ...look.reflection, strength: value } }),
  )
  fields.number('bank', 'Foam bank width (m)', look.bank, 0.25, 0.001, 10, 0.001, value =>
    update({ bank: value ?? 0.25 }),
  )
  fields.number(
    'reflection-threshold',
    'Reflection threshold',
    look.reflection.threshold,
    0.05,
    0,
    4,
    0.01,
    value => update({ reflection: { ...look.reflection, threshold: value ?? 0.05 } }),
  )
  fields.number(
    'reflection-rows',
    'Reflection row interval',
    look.reflection.rows,
    4,
    1,
    10000,
    1,
    value => update({ reflection: { ...look.reflection, rows: value ?? 4 } }),
  )
  fields.color(
    'reflection-tint',
    'Reflection tint',
    hex(look.reflection.tint),
    hex(look.reflection.tint),
    value =>
      update({
        reflection: {
          ...look.reflection,
          tint: value === undefined ? look.reflection.tint : rgb(value),
        },
      }),
  )
  const rings = look.rings ?? { enabled: false },
    ringFields = letterFields(section(root, 'Impact and rain rings'))
  ringFields.select(
    'rings-enabled',
    'Glyph rings',
    String(rings.enabled),
    [
      ['true', 'Enabled'],
      ['false', 'Disabled'],
    ],
    value => update({ rings: { ...rings, enabled: value === 'true' } }),
  )
  ringFields.text(
    'rings-alphabet',
    'Ring alphabet',
    rings.alphabet,
    value => update({ rings: { ...rings, alphabet: value } }),
    true,
  )
  ringFields.color(
    'rings-color',
    'Ring color',
    rings.color ? hex(rings.color) : undefined,
    hex(look.foam),
    value => update({ rings: { ...rings, color: value === undefined ? undefined : rgb(value) } }),
  )
  ringFields.number('rings-size', 'Ring radius (m)', rings.size, 1.5, 0.05, 20, 0.05, value =>
    update({ rings: { ...rings, size: value } }),
  )
  ringFields.number(
    'rings-lifetime',
    'Ring lifetime (s)',
    rings.lifetime,
    1.2,
    0.1,
    20,
    0.1,
    value => update({ rings: { ...rings, lifetime: value } }),
  )
}

export function terrainLetterFields(
  root: HTMLElement,
  layer: GroundLayer,
  update: (patch: Partial<GroundLayer>) => void,
) {
  root.replaceChildren()
  const look = layer.look ?? {},
    floor = letterFields(section(root, `${glyphLabel(layer.name)} floor letters`))
  floor.color('layer-color', 'Layer base color', layer.color, layer.color, value =>
    update({ color: value ?? layer.color }),
  )
  const set = (patch: GlyphStyle) => update({ look: { ...look, ...patch, glyph: 'surface' } })
  floor.select(
    'floor-family',
    'Family',
    look.surface,
    GLYPH_FAMILIES.map(key => [key, glyphLabel(key)]),
    value => set({ surface: value as GlyphStyle['surface'] }),
  )
  floor.text('floor-alphabet', 'Alphabet', look.alphabet, value => set({ alphabet: value }), true)
  floor.text('floor-font', 'Font', look.font, value => set({ font: value }))
  floor.select(
    'floor-weight',
    'Font weight',
    look.fontWeight?.toString(),
    [
      ['400', 'Regular'],
      ['700', 'Bold'],
    ],
    value => set({ fontWeight: value ? (Number(value) as 400 | 700) : undefined }),
  )
  floor.color('floor-color', 'Glyph color', look.color, layer.color, value => set({ color: value }))
  floor.select(
    'floor-open',
    'Visibility',
    look.open?.toString(),
    [
      ['true', 'Letters only'],
      ['false', 'Dark gaps'],
    ],
    value => set({ open: value === undefined ? undefined : value === 'true' }),
  )
  for (const [key, label, fallback, min, max, step] of [
    ['size', 'Size (m)', 0.17, 0.01, 10, 0.01],
    ['spacing', 'Spacing', 1, 0.5, 4, 0.05],
    ['density', 'Density', 1, 0.05, 1, 0.05],
    ['strength', 'Ink strength', 1, 0, 4, 0.05],
    ['gap', 'Gap tint', 0, 0, 0.015, 0.001],
    ['contrast', 'Contrast', 1, 0.1, 4, 0.05],
    ['toneOffset', 'Light threshold', 0, -1, 1, 0.05],
    ['shadowSteps', 'Shadow levels', 6, 2, 16, 1],
  ] as const)
    floor.number(`floor-${key}`, label, look[key], fallback, min, max, step, value =>
      set({ [key]: value }),
    )
  floor.number(
    'floor-rotation',
    'Rotation (degrees)',
    look.rotation === undefined ? undefined : (look.rotation * 180) / Math.PI,
    0,
    -180,
    180,
    1,
    value => set({ rotation: value === undefined ? undefined : (value * Math.PI) / 180 }),
  )
  floor.select(
    'floor-lighting',
    'Lighting response',
    look.lighting,
    [
      ['scene', 'Scene lights'],
      ['unlit', 'Uniform local shading'],
    ],
    value => set({ lighting: value as GlyphStyle['lighting'] }),
  )
  floor.color('floor-emissive', 'Self light color', look.emissive, 0, value =>
    set({ emissive: value }),
  )
  floor.number(
    'floor-emissiveIntensity',
    'Self light intensity',
    look.emissiveIntensity,
    1,
    0,
    4,
    0.05,
    value => set({ emissiveIntensity: value }),
  )
  const palette = (text?: string) =>
    text ? text.split(',').map(value => parseInt(value.trim().replace(/^#/, ''), 16)) : undefined
  floor.text(
    'floor-palette',
    'Palette (2–8 hex colors)',
    look.palette?.map(color => '#' + color.toString(16).padStart(6, '0')).join(', '),
    value => set({ palette: palette(value) }),
  )
  const cover = layer.cover ?? {},
    grass = letterFields(section(root, `${glyphLabel(layer.name)} standing letters`)),
    setCover = (patch: GroundLayer['cover']) => update({ cover: { ...cover, ...patch } })
  grass.number('cover-amount', 'Layer cover amount', layer.grass, 0, 0, 1, 0.05, value =>
    update({ grass: value ?? 0 }),
  )
  grass.text(
    'cover-alphabet',
    'Alphabet',
    cover.alphabet,
    value => setCover({ alphabet: value }),
    true,
  )
  grass.text('cover-font', 'Font', cover.font, value => setCover({ font: value }))
  grass.select(
    'cover-weight',
    'Font weight',
    cover.fontWeight?.toString(),
    [
      ['400', 'Regular'],
      ['700', 'Bold'],
    ],
    value => setCover({ fontWeight: value ? (Number(value) as 400 | 700) : undefined }),
  )
  grass.color('cover-color', 'Color', cover.color, 0x4c8038, value => setCover({ color: value }))
  grass.text(
    'cover-palette',
    'Palette (2–8 hex colors)',
    cover.palette?.map(color => '#' + color.toString(16).padStart(6, '0')).join(', '),
    value => setCover({ palette: palette(value) }),
  )
  for (const [key, label, fallback, min, max, step] of [
    ['height', 'Height (m)', 0.2, 0.01, 5, 0.01],
    ['width', 'Width (m)', 0.08, 0.005, 5, 0.005],
    ['density', 'Relative density', 1, 0, 1, 0.05],
    ['wind', 'Wind strength', 1, 0, 4, 0.05],
  ] as const)
    grass.number(`cover-${key}`, label, cover[key], fallback, min, max, step, value =>
      setCover({ [key]: value }),
    )
}
