import { describe, expect, it } from 'vitest'
import { mergeGlyphStyles, nodeGlyphStyle, resolveGlyphStyle } from './style'

describe('glyph style layers', () => {
  const tree = { style: { glyph: 'surface' as const, surface: 'bark' as const }, parts: { crown: { glyph: 'body' as const, surface: 'foliage' as const } } }

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
