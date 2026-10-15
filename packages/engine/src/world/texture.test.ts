import { describe, expect, it } from 'vitest'
import { parseScene } from './validation'
import { linkTexture, detachTexture, textureStyle } from './texture'
import { resolveGlyphStyle } from '../style'
import type { AddOptions } from '../engine'

describe('portable texture recipes', () => {
  const style = {
    alphabet: ' .:+#@',
    size: 0.2,
    spacing: 1.5,
    density: 0.7,
    strength: 1.2,
    contrast: 1.8,
    toneOffset: -0.1,
    shadowSteps: 4,
  }
  it('round-trips recipes and part overrides while preserving mixed techniques', () => {
    const doc = parseScene({
      version: 1,
      objects: [
        {
          prefab: 'tree',
          position: [0, 0, 0],
          options: { ...style, parts: { crown: { glyph: 'body' }, trunk: { glyph: 'surface' } } },
        },
      ],
      textures: { ink: { name: 'My ink', style } },
    })
    expect(parseScene(JSON.parse(JSON.stringify(doc))).textures?.ink.style).toEqual(style)
    const instance = doc.objects[0].options
    expect(
      resolveGlyphStyle({ instance, instanceParts: instance?.parts, part: 'crown' }).glyph,
    ).toBe('body')
    expect(
      resolveGlyphStyle({ instance, instanceParts: instance?.parts, part: 'trunk' }).alphabet,
    ).toBe(style.alphabet)
    expect(textureStyle({ ...style, color: undefined })).toEqual(style)
  })
  it.each([
    { alphabet: '' },
    { alphabet: '   ' },
    { alphabet: '\n#' },
    { alphabet: 'e\u0301' },
    { alphabet: '#'.repeat(129) },
    { spacing: 0 },
    { density: 0 },
    { strength: -1 },
    { gap: 0.3 },
    { contrast: 0 },
    { toneOffset: 2 },
    { shadowSteps: 2.5 },
    { size: NaN },
    { font: '\nmono' },
    { fontWeight: '700' },
    { open: 'true' },
    { faces: 'side' },
    { rotation: 8 },
    { palette: [1] },
    { palette: [0, 1.5] },
    { lighting: 'fake' },
    { emissive: -1 },
    { emissiveIntensity: 5 },
  ])('rejects invalid shader parameters: %j', invalid => {
    expect(() =>
      parseScene({ version: 1, objects: [], textures: { ink: { name: 'Ink', style: invalid } } }),
    ).toThrow()
  })
  it('preserves Unicode, fonts, palettes, visibility and independent preview lighting', () => {
    const recipe = {
      name: 'Symbols',
      style: {
        alphabet: ' é░▒▓█↑↗→',
        font: 'monospace',
        fontWeight: 700,
        open: true,
        faces: 'both',
        rotation: 0.5,
        palette: [0x224466, 0xffaa22],
        lighting: 'unlit',
        emissive: 0x337799,
        emissiveIntensity: 2,
      },
      previewLighting: { brightness: 1.3, background: 0x050508 },
    }
    const source = { version: 1, objects: [], textures: { symbols: recipe } }
    const doc = parseScene(source)
    expect(doc.textures?.symbols).toEqual(recipe)
    expect(doc.style).toBeUndefined()
    expect(parseScene(JSON.parse(JSON.stringify(doc))).textures?.symbols).toEqual(recipe)
    expect(() =>
      parseScene({
        ...source,
        textures: { symbols: { ...recipe, previewLighting: { glyphs: { size: 0.3 } } } },
      }),
    ).toThrow('not a lighting field')
  })
  it('rejects foreign fields and techniques in a texture asset', () => {
    for (const invalid of [{ glyph: 'particle' }, { background: 123 }])
      expect(() =>
        parseScene({ version: 1, objects: [], textures: { ink: { name: 'Ink', style: invalid } } }),
      ).toThrow()
  })
  it('accepts the legacy screen technique without migrating existing recipes', () => {
    const doc = parseScene({
      version: 1,
      objects: [],
      textures: {
        actor: { name: 'Character', style: { glyph: 'screen', surface: 'actor', color: 0x88cc44 } },
      },
    })
    expect(doc.textures?.actor.style.glyph).toBe('screen')
  })
  it('validates optional type authoring masks without changing legacy type styles', () => {
    const doc = {
      version: 1,
      objects: [],
      style: { types: { block: { style: { size: 0.2 }, authored: { style: ['size'] } } } },
    }
    expect(parseScene(doc).style?.types?.block.authored?.style).toEqual(['size'])
    expect(() =>
      parseScene({ ...doc, style: { types: { block: { authored: { style: ['position'] } } } } }),
    ).toThrow('unknown glyph field')
  })
})

const textures = {
  old: { name: 'Old', style: { alphabet: 'OO', color: 1 } },
  next: { name: 'Next', style: { alphabet: 'NN', color: 2, size: 0.2 } },
}
const resolved = (options: AddOptions, part?: string) =>
  resolveGlyphStyle({
    texture: options.texture ? textures[options.texture as keyof typeof textures].style : undefined,
    instance: textureStyle(options),
    part,
    instanceParts: options.parts,
    texturePart:
      part && options.parts?.[part]?.texture
        ? textures[options.parts[part].texture as keyof typeof textures].style
        : undefined,
  })
it('relinks detached fields and reports replacements while preserving unrelated overrides and own part links', () => {
  const source: AddOptions = {
    texture: 'old',
    density: 0.4,
    parts: { crown: { alphabet: 'XX', size: 0.7 }, trunk: { texture: 'old', color: 7 } },
  }
  const before = structuredClone(source),
    detached = detachTexture(source, textures)
  const linked = linkTexture(detached, textures, 'next')
  expect(source).toEqual(before)
  expect(new Set(linked.replaced)).toEqual(new Set(['alphabet', 'color', 'size']))
  expect(resolved(linked.options, 'crown')).toMatchObject({
    alphabet: 'NN',
    color: 2,
    size: 0.2,
    density: 0.4,
  })
  const own = linkTexture(source, textures, 'next').options
  expect(own.parts!.trunk).toEqual(source.parts!.trunk)
  expect(() => linkTexture(source, textures, 'missing')).toThrow(/unknown texture/)
})
it('part linking leaves siblings untouched, and detaching either level preserves every resolved part', () => {
  const source: AddOptions = {
    texture: 'old',
    color: 8,
    size: 0.8,
    parts: { crown: { alphabet: 'XX', size: 0.9 }, trunk: { color: 9 } },
  }
  const { options } = linkTexture(source, textures, 'next', 'crown')
  expect(resolved(options, 'crown')).toMatchObject({ alphabet: 'NN', color: 2, size: 0.2 })
  expect(resolved(options, 'trunk')).toEqual(resolved(source, 'trunk'))
  expect(resolved(detachTexture(options, textures, 'crown'), 'crown')).toEqual(
    resolved(options, 'crown'),
  )
  const detached = detachTexture(options, textures)
  for (const part of [undefined, 'crown', 'trunk'])
    expect(resolved(detached, part)).toEqual(resolved(options, part))
})
