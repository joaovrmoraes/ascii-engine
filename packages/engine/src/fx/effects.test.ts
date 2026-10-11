import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { createEffectSystem, drawableGlyphs } from './effects'
import { imageToGlyphFrame } from './flipbook'
import { POMOROG_EFFECTS } from './presets'

/** A particle buffer stand-in that records pushes. */
function fakeCloud() {
  const pushed: { glyph: string; y: number }[] = []
  return { pushed, cloud: { push: (_x: number, y: number, _z: number, _s: number, glyph: string) => { pushed.push({ glyph, y }) } } }
}

describe('effect system', () => {
  it('bursts, ages and finishes a one-shot effect', () => {
    const { pushed, cloud } = fakeCloud()
    const fx = createEffectSystem(cloud as never, new THREE.Scene())
    fx.register(...POMOROG_EFFECTS)
    const camera = new THREE.PerspectiveCamera()
    const death = fx.play('morte', new THREE.Vector3())
    fx.update(.016, 0, camera)
    expect(pushed.length).toBe(60)
    expect(fx.stats.letters).toBe(60)
    for (let i = 0; i < 120; i++) fx.update(.02, i * .02, camera)
    expect(death.done).toBe(true)
    expect(fx.playing.length).toBe(0)
  })
  it('loops continuous emitters, respects the budget and draws the heat grid', () => {
    const { pushed, cloud } = fakeCloud()
    const fx = createEffectSystem(cloud as never, new THREE.Scene(), { budget: 30 })
    fx.register(...POMOROG_EFFECTS)
    const camera = new THREE.PerspectiveCamera()
    fx.play('fogueira', new THREE.Vector3())
    for (let i = 0; i < 300; i++) fx.update(.02, i * .02, camera)
    expect(fx.stats.letters).toBeLessThanOrEqual(30)
    expect(pushed.some((p) => p.glyph === '#' || p.glyph === '%')).toBe(true)
  })
  it('keeps only drawable glyphs (the Pomorog particle atlas has no @ or x)', () => {
    expect(drawableGlyphs('@#a%x+')).toBe('#%+')
  })
})

describe('flipbook conversion', () => {
  it('turns brightness into denser letters and keeps hue', () => {
    // 2×1 image: black, bright orange.
    const data = [0, 0, 0, 255, 255, 128, 0, 255]
    const frame = imageToGlyphFrame({ data, width: 2, height: 1 }, { cols: 2, rows: 1 })
    expect(frame.text[0][0]).toBe(' ')
    expect(frame.text[0][1]).not.toBe(' ')
    expect(frame.colors[0][1][0]).toBeCloseTo(1)
    expect(frame.colors[0][1][2]).toBeCloseTo(0)
  })
})
