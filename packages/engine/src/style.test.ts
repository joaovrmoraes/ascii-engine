import { describe, expect, it } from 'vitest'
import { glyphStyleSources, mergeGlyphStyles, nodeGlyphStyle, resolveGlyphStyle } from './style'

describe('glyph style layers', () => {
  it('resolves an object link below its local fields and a part link below only that part\'s fields', () => {
    const layers = { global: { size: .1 }, node: { size: .2 }, texture: { size: .3, alphabet: 'AB', density: .5 }, texturePart: { size: .4, color: 123 }, instance: { size: .5, density: .9 }, instanceParts: { crown: { color: 456, texture: 'ink' } }, part: 'crown' }
    expect(resolveGlyphStyle(layers)).toEqual({ size: .4, alphabet: 'AB', density: .9, color: 456 })
    expect(glyphStyleSources(layers)).toEqual({ size: 'linked part texture', alphabet: 'linked texture', density: 'instance', color: 'instance part' })
  })
  it('reports per-field origins without changing resolution or treating undefined as an override', () => {
    const layers = { defaults: { glyph: 'surface' as const }, global: { size: .17, color: 0xffffff }, type: { style: { size: .2 } }, instance: { color: 0x44bb66, size: undefined } }
    expect(glyphStyleSources(layers)).toEqual({ glyph: 'model default', size: 'type', color: 'instance' })
    expect(resolveGlyphStyle(layers)).toEqual({ glyph: 'surface', size: .2, color: 0x44bb66 })
  })
  const tree = { style: { glyph: 'surface' as const, surface: 'bark' as const }, parts: { crown: { glyph: 'body' as const, surface: 'foliage' as const } } }
  it('only promotes explicitly authored type fields, preserving legacy declarations and instance precedence', () => {
    const type = { style: { size: .22 }, parts: { crown: { size: .19 } } }
    const node = { size: .12, glyph: 'body' as const }
    expect(resolveGlyphStyle({ type, node, part: 'crown' }).size).toBe(.12)
    const authored = { ...type, authored: { style: ['size' as const] } }
    expect(resolveGlyphStyle({ type: authored, node, part: 'crown' })).toEqual({ size: .22, glyph: 'body' })
    expect(resolveGlyphStyle({ type: authored, node, part: 'crown', instance: { size: .4 } }).size).toBe(.4)
    expect(resolveGlyphStyle({ type: { ...authored, authored: { style: ['size'], parts: { crown: ['size'] } } }, node, part: 'crown' }).size).toBe(.19)
  })

  it('gives crown and trunk of one tree different styles', () => {
    expect(resolveGlyphStyle({ type: tree, part: 'crown' })).toEqual({ glyph: 'body', surface: 'foliage' })
    expect(resolveGlyphStyle({ type: tree, part: 'trunk' })).toEqual({ glyph: 'surface', surface: 'bark' })
  })

  it('resolves global > type > type part > node > instance > instance part', () => {
    const style = resolveGlyphStyle({
      global: { glyph: 'screen', surface: 'generic' as never, size: .1 },
      type: tree, part: 'crown',
      node: { size: .2 },
      instance: { size: .3 },
      instanceParts: { crown: { size: .4 } },
    })
    expect(style).toEqual({ glyph: 'body', surface: 'foliage', size: .4 })
    expect(resolveGlyphStyle({ type: tree, part: 'crown', instance: { size: .3 } }).size).toBe(.3)
  })

  it('changing this crown does not change the other parts', () => {
    const parts = { crown: { surface: 'snow' as const } }
    expect(resolveGlyphStyle({ type: tree, part: 'crown', instanceParts: parts }).surface).toBe('snow')
    expect(resolveGlyphStyle({ type: tree, part: 'trunk', instanceParts: parts }).surface).toBe('bark')
  })

  it('ignores undefined fields and reads node data', () => {
    expect(mergeGlyphStyles({ size: 1 }, { size: undefined })).toEqual({ size: 1 })
    expect(nodeGlyphStyle({ glyph: 'body', glyphStyle: { size: .2 } })).toEqual({ size: .2, glyph: 'body' })
    expect(nodeGlyphStyle({})).toBeUndefined()
  })

  it('lets authored styles override inferred import defaults while keeping explicit node declarations', () => {
    const defaults = { glyph: 'surface' as const, surface: 'wood' as const }
    expect(resolveGlyphStyle({ defaults, global: { size: .3 }, type: tree, part: 'crown' })).toEqual({ glyph: 'body', surface: 'foliage', size: .3 })
    expect(resolveGlyphStyle({ defaults, type: tree, part: 'crown', node: { glyph: 'screen' } }).glyph).toBe('screen')
    expect(resolveGlyphStyle({ defaults, instance: { color: 0x00ff00 } })).toEqual({ ...defaults, color: 0x00ff00 })
  })
})
