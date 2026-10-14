import { describe, expect, it } from 'vitest'
import { parseScene } from './validation'
import { textureStyle } from './texture'
import { resolveGlyphStyle } from '../style'

describe('portable texture recipes', () => {
  const style = { alphabet: ' .:+#@', size: .2, spacing: 1.5, density: .7, strength: 1.2, contrast: 1.8, toneOffset: -.1, shadowSteps: 4 }
  it('round-trips recipes and part overrides while preserving mixed techniques', () => {
    const doc = parseScene({ version: 1, objects: [{ prefab: 'tree', position: [0, 0, 0], options: { ...style, parts: { crown: { glyph: 'body' }, trunk: { glyph: 'surface' } } } }], textures: { ink: { name: 'My ink', style } } })
    expect(parseScene(JSON.parse(JSON.stringify(doc))).textures?.ink.style).toEqual(style)
    const instance = doc.objects[0].options
    expect(resolveGlyphStyle({ instance, instanceParts: instance?.parts, part: 'crown' }).glyph).toBe('body')
    expect(resolveGlyphStyle({ instance, instanceParts: instance?.parts, part: 'trunk' }).alphabet).toBe(style.alphabet)
    expect(textureStyle({ ...style, color: undefined })).toEqual(style)
  })
  it.each([{ alphabet: '' }, { alphabet: '   ' }, { alphabet: '\n#' }, { alphabet: 'e\u0301' }, { alphabet: '#'.repeat(129) }, { spacing: 0 }, { density: 0 }, { strength: -1 }, { gap: .3 }, { contrast: 0 }, { toneOffset: 2 }, { shadowSteps: 2.5 }, { size: NaN }, { font: '\nmono' }, { fontWeight: '700' }, { open: 'true' }, { faces: 'side' }, { rotation: 8 }, { palette: [1] }, { palette: [0, 1.5] }, { lighting: 'fake' }, { emissive: -1 }, { emissiveIntensity: 5 }])('rejects invalid shader parameters: %j', invalid => {
    expect(() => parseScene({ version: 1, objects: [], textures: { ink: { name: 'Ink', style: invalid } } })).toThrow()
  })
  it('preserves Unicode, fonts, palettes, visibility and independent preview lighting', () => {
    const recipe = { name: 'Symbols', style: { alphabet: ' é░▒▓█↑↗→', font: 'monospace', fontWeight: 700, open: true, faces: 'both', rotation: .5, palette: [0x224466, 0xffaa22], lighting: 'unlit', emissive: 0x337799, emissiveIntensity: 2 }, previewLighting: { brightness: 1.3, background: 0x050508 } }
    const source = { version: 1, objects: [], textures: { symbols: recipe } }
    const doc = parseScene(source)
    expect(doc.textures?.symbols).toEqual(recipe)
    expect(doc.style).toBeUndefined()
    expect(parseScene(JSON.parse(JSON.stringify(doc))).textures?.symbols).toEqual(recipe)
    expect(() => parseScene({ ...source, textures: { symbols: { ...recipe, previewLighting: { glyphs: { size: .3 } } } } })).toThrow('not a lighting field')
  })
  it('rejects foreign fields and techniques in a texture asset', () => {
    for (const invalid of [{ glyph: 'screen' }, { glyph: 'particle' }, { background: 123 }]) expect(() => parseScene({ version: 1, objects: [], textures: { ink: { name: 'Ink', style: invalid } } })).toThrow()
  })
})
