import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { createEffectSystem, drawableGlyphs } from './effects'
import { imageToGlyphFrame } from './flipbook'
import { POMOROG_EFFECTS } from './presets'
import { parseEffect } from './validation'
import { parseScene } from '../world/validation'
import { POMOROG_FIRE } from '../presets/campfire'

/** A particle buffer stand-in that records pushes. */
function fakeCloud() {
  const pushed: { glyph: string; y: number }[] = []
  return {
    pushed,
    cloud: {
      push: (_x: number, y: number, _z: number, _s: number, glyph: string) => {
        pushed.push({ glyph, y })
      },
    },
  }
}

describe('effect system', () => {
  it('redraws a secondary camera without advancing particles or their random stream', () => {
    function simulate(preview: boolean) {
      const points: number[][] = [],
        cloud = { push: (x: number, y: number, z: number) => points.push([x, y, z]) }
      const fx = createEffectSystem(cloud as never, new THREE.Scene()),
        camera = new THREE.PerspectiveCamera()
      fx.play(
        { name: 'teste', duration: 3, emitters: [{ rate: 12, life: 2, noise: 2 }] },
        new THREE.Vector3(),
      )
      for (let i = 0; i < 30; i++) {
        if (preview) fx.update(0, i / 60, camera, true)
        points.length = 0
        fx.update(1 / 60, i / 60, camera)
      }
      fx.dispose()
      return points
    }
    expect(simulate(true)).toEqual(simulate(false))
  })
  it.each(['heat', 'ribbon'] as const)('preserves XYZ layer offsets for %s', render => {
    function sample(offset: [number, number, number]) {
      const points: number[][] = [],
        cloud = { push: (x: number, y: number, z: number) => points.push([x, y, z]) }
      const fx = createEffectSystem(cloud as never, new THREE.Scene())
      fx.play(
        { name: 'Layer', duration: 2, emitters: [{ name: 'Minha camada', render, offset }] },
        new THREE.Vector3(),
      )
      fx.update(0.02, 0.5, new THREE.PerspectiveCamera())
      fx.dispose()
      return points
    }
    const before = sample([0, 0, 0]),
      after = sample([2, 3, -4])
    expect(before.length).toBeGreaterThan(0)
    expect(after).toHaveLength(before.length)
    after.forEach((point, i) =>
      point.forEach((value, axis) => expect(value).toBeCloseTo(before[i][axis] + [2, 3, -4][axis])),
    )
  })
  it('plays portable definitions with the same name independently, without replacing a preset', () => {
    const { pushed, cloud } = fakeCloud(),
      fx = createEffectSystem(cloud as never, new THREE.Scene())
    const definition = {
      name: 'custom',
      duration: 1,
      emitters: [{ bursts: [{ at: 0, count: 1 }], glyphs: '+', life: 1 }],
    }
    fx.register(definition)
    const a = fx.play(
      { ...definition, emitters: [{ ...definition.emitters[0], glyphs: '*' }] },
      new THREE.Vector3(),
    )
    const b = fx.play('custom', new THREE.Vector3())
    fx.update(0.01, 0.01, new THREE.PerspectiveCamera())
    expect(pushed.map(p => p.glyph).sort()).toEqual(['*', '+'])
    expect(fx.stats.emitters).toBe(2)
    expect(fx.library.get('custom')).toBe(definition)
    a.cancel()
    b.cancel()
    expect(fx.stats.effects).toBe(0)
  })
  it('bursts, ages and finishes a one-shot effect', () => {
    const { pushed, cloud } = fakeCloud()
    const fx = createEffectSystem(cloud as never, new THREE.Scene())
    fx.register(...POMOROG_EFFECTS)
    const camera = new THREE.PerspectiveCamera()
    const death = fx.play('morte', new THREE.Vector3())
    fx.update(0.016, 0, camera)
    expect(pushed.length).toBe(60)
    expect(fx.stats.letters).toBe(60)
    for (let i = 0; i < 120; i++) fx.update(0.02, i * 0.02, camera)
    expect(death.done).toBe(true)
    expect(fx.playing.length).toBe(0)
  })
  it('loops continuous emitters, respects the budget and draws the heat grid', () => {
    const { pushed, cloud } = fakeCloud()
    const fx = createEffectSystem(cloud as never, new THREE.Scene(), { budget: 30 })
    fx.register(...POMOROG_EFFECTS)
    const camera = new THREE.PerspectiveCamera()
    fx.play('fogueira', new THREE.Vector3())
    for (let i = 0; i < 300; i++) fx.update(0.02, i * 0.02, camera)
    expect(fx.stats.letters).toBeLessThanOrEqual(30)
    expect(pushed.some(p => p.glyph === '#' || p.glyph === '%')).toBe(true)
  })
  it('keeps only drawable glyphs (the Pomorog particle atlas has no @ or x)', () => {
    expect(drawableGlyphs('@#a%x+')).toBe('#%+')
  })
  it('deleting a scene effect releases its letters, budget and light immediately', () => {
    const { cloud } = fakeCloud(),
      scene = new THREE.Scene()
    const fx = createEffectSystem(cloud as never, scene)
    fx.register(...POMOROG_EFFECTS)
    const effect = fx.play('aura', new THREE.Vector3())
    fx.update(0.02, 0.02, new THREE.PerspectiveCamera())
    expect(scene.children.length).toBe(1)
    expect(fx.stats.letters).toBeGreaterThan(0)
    effect.cancel()
    effect.cancel()
    expect(fx.stats.letters).toBe(0)
    expect(fx.playing).toHaveLength(0)
    expect(scene.children).toHaveLength(0)
    fx.play('fogueira', new THREE.Vector3())
    fx.dispose()
    expect(scene.children).toHaveLength(0)
  })
})

describe('portable effect authoring', () => {
  it('preserves the Pomorog presets and custom effects through scene JSON without an editor library', () => {
    for (const effect of POMOROG_EFFECTS) expect(parseEffect(effect)).toEqual(effect)
    expect(
      parseEffect({
        name: 'calor',
        duration: 3,
        emitters: [{ render: 'heat', heat: POMOROG_FIRE }],
      }).emitters[0].heat,
    ).toEqual(POMOROG_FIRE)
    const effect = POMOROG_EFFECTS[1]
    const doc = parseScene(
      {
        version: 1,
        effects: { 'fx:custom-dust': effect },
        objects: [{ prefab: 'fx:custom-dust', position: [0, 0, 0] }],
      },
      {},
    )
    expect(parseScene(JSON.parse(JSON.stringify(doc)), {})).toEqual(doc)
    expect(doc.effects!['fx:custom-dust']).not.toBe(effect)
  })
  it('rejects malformed effect data before playback or scene replacement', () => {
    const base = { name: 'teste', duration: 1, emitters: [] }
    for (const value of [
      { ...base, duration: 0 },
      { ...base, emitters: [{ life: [3, 1] }] },
      { ...base, emitters: [{ render: 'unknown' }] },
      { ...base, emitters: [{ ring: { from: 0, to: 1, count: Infinity } }] },
      { ...base, emitters: [{ shape: { kind: 'box', size: [1] } }] },
      { ...base, emitters: [{ heat: { rows: 1 } }] },
      JSON.parse('{"name":"teste","duration":1,"emitters":[],"__proto__":{}}'),
    ])
      expect(() => parseEffect(value)).toThrow('Invalid effect')
    expect(() =>
      parseScene({
        version: 1,
        objects: [],
        effects: { 'fx:custom-bad': { ...base, emitters: [{ rate: -1 }] } },
      }),
    ).toThrow('Invalid effect')
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
