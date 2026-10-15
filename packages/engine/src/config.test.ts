import { describe, expect, it } from 'vitest'
import { DEFAULT_ASCII_STYLE, engineStyle } from './config'

describe('consumer-supplied renderer settings', () => {
  it('has no implicit game types', () => {
    expect(engineStyle().types).toEqual({})
    expect(engineStyle().glyphs).toEqual({})
  })

  it('does not share nested settings between engines', () => {
    const first = engineStyle(),
      second = engineStyle()
    first.moon.position[0] = 99
    first.types.custom = { style: { glyph: 'body' } }
    expect(second.moon.position).toEqual(DEFAULT_ASCII_STYLE.moon.position)
    expect(second.types).toEqual({})
  })

  it('owns a copy of the supplied type library', () => {
    const source = { custom: { style: { glyph: 'body' as const, size: 0.2 } } }
    const settings = engineStyle({ types: source, background: 0x123456 })
    settings.types.custom.style!.size = 0.4
    expect(source.custom.style.size).toBe(0.2)
    expect(settings.background).toBe(0x123456)
  })
})
