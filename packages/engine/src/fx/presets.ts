import type { EffectDef } from './effects'

/**
 * Pomorog effects remade as data (fidelity test of the effect system).
 * Numbers follow `effects.ts`; combat letters are ×1.4 there, here sizes
 * already include it.
 */
const fire: [number, number, number][] = [[1.3, 1.15, .55], [1.3, .98, .3], [1.25, .78, .16], [1.1, .45, .07], [.65, .12, .03]]
export const POMOROG_EFFECTS: EffectDef[] = [
  {
    name: 'fogueira', duration: 4, loop: true,
    light: { color: 0xffac55, intensity: 14, distance: 7, decay: 1.65, flicker: .08, offset: [0, 1.05, 0] },
    emitters: [
      { render: 'heat' },
      // Ember bed, sparks spiralling up, grey smoke.
      { shape: { kind: 'ring', radius: .36, surface: false }, rate: 40, life: [.6, 1.2], glyphs: '*+:', size: .15, color: [{ t: 0, color: [1, .66, .25] }, { t: 1, color: [.85, .3, .08] }], alpha: [{ t: 0, v: .9 }, { t: 1, v: .3 }] },
      { offset: [0, .55, 0], shape: { kind: 'sphere', radius: .15 }, rate: 14, life: [1.2, 2.2], speed: [.2, .4], velocity: [0, 1.4, 0], spin: 2.5, glyphs: '*...', size: .13, color: [1, .75, .3], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
      { offset: [0, .7, 0], shape: { kind: 'sphere', radius: .2 }, rate: 6, life: [2, 3], velocity: [.05, .9, 0], noise: .6, glyphs: ',;:~', size: .2, color: [.38, .36, .35], alpha: [{ t: 0, v: .5 }, { t: 1, v: 0 }] },
    ],
  },
  {
    name: 'poeira', duration: .2,
    emitters: [{ bursts: [{ at: 0, count: 6 }], shape: { kind: 'sphere', radius: .1 }, life: 1.1, speed: [.3, .5], velocity: [0, .55, 0], drag: .5, glyphs: ',:.', size: [{ t: 0, v: .17 }, { t: 1, v: .26 }], color: [.48, .44, .36], alpha: [{ t: 0, v: .75 }, { t: 1, v: 0 }] }],
  },
  {
    name: 'vagalumes', duration: 10, loop: true,
    emitters: [{ shape: { kind: 'box', size: [14, 1.5, 14] }, offset: [0, 1, 0], rate: 7, life: [4, 8], noise: .4, glyphs: '+*+', size: [{ t: 0, v: .15 }, { t: .5, v: .22 }, { t: 1, v: .15 }], color: [.82, .96, .72], alpha: [{ t: 0, v: 0 }, { t: .3, v: 1 }, { t: .6, v: .2 }, { t: 1, v: 0 }] }],
  },
  {
    name: 'morte', duration: 1.6,
    emitters: [{ bursts: [{ at: 0, count: 60 }], shape: { kind: 'sphere', radius: .4 }, offset: [0, .7, 0], life: [1.1, 1.6], speed: [.3, .8], velocity: [0, 1.3, 0], glyphs: '@#%*+:.', size: .24, color: [{ t: 0, color: [.9, .82, .66] }, { t: 1, color: [1, .6, .25] }], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] }],
  },
  {
    name: 'aura', duration: 1.1,
    light: { color: 0xffc66b, intensity: 9, distance: 4.5, decay: 1.6, offset: [0, .9, 0], fade: [{ t: 0, v: 0 }, { t: .5, v: 1 }, { t: 1, v: 0 }] },
    emitters: [
      { bursts: [{ at: 0, count: 36 }], shape: { kind: 'ring', radius: .62 }, offset: [0, .95, 0], spin: 5, life: 1.1, glyphs: 'o*', size: .2, color: [1, .82, .38], alpha: [{ t: 0, v: 0 }, { t: .5, v: .9 }, { t: 1, v: 0 }] },
      { rate: 24, shape: { kind: 'ring', radius: .35, surface: false }, offset: [0, .1, 0], velocity: [0, 2, 0], life: 1, glyphs: '*+', size: .18, color: [1, .82, .38], alpha: [{ t: 0, v: .9 }, { t: 1, v: 0 }] },
    ],
  },
  {
    name: 'raio', duration: .5,
    light: { color: 0x8caaff, intensity: 12, distance: 7, offset: [0, 1, 0], fade: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
    emitters: [
      { render: 'beam', offset: [0, .9, 0], shape: { kind: 'line', to: [0, 5.7, 0] }, beam: { segments: 26, jitter: 24, amplitude: .14 }, size: .34, color: [.92, .96, 1], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
      { render: 'ring', bursts: [{ at: 0, count: 1 }], offset: [0, .06, 0], life: .7, ring: { from: .3, to: 2, count: 36 }, glyphs: '~-=+', size: .25, color: [.58, .78, 1], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
    ],
  },
  {
    name: 'explosao-de-fogo', duration: .9,
    light: { color: 0xff991f, intensity: 12, distance: 7, offset: [0, .9, 0], fade: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
    emitters: [
      { render: 'ring', bursts: [{ at: 0, count: 1 }], offset: [0, .1, 0], life: .8, ring: { from: 0, to: 1.8, count: 28 }, glyphs: 'Oo', size: .31, color: [1, .85, .5], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
      { bursts: [{ at: 0, count: 54 }], shape: { kind: 'cone', radius: .45, angle: .25 }, speed: [1, 2.2], gravity: 1.5, life: [.5, .9], glyphs: '@#%x+.', size: [{ t: 0, v: .31 }, { t: 1, v: .2 }], color: [{ t: 0, color: fire[0] }, { t: .4, color: fire[2] }, { t: 1, color: fire[4] }], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
    ],
  },
  {
    name: 'gelo', duration: 1.25,
    emitters: [
      { bursts: [{ at: 0, count: 13 }], shape: { kind: 'ring', radius: .6 }, velocity: [0, 1.5, 0], drag: 3, life: 1.2, glyphs: '##A^', size: .3, color: [{ t: 0, color: [.58, .78, 1] }, { t: 1, color: [.85, .95, 1] }], alpha: [{ t: 0, v: 1 }, { t: .8, v: 1 }, { t: 1, v: 0 }] },
      { rate: 16, shape: { kind: 'sphere', radius: .6 }, offset: [0, .3, 0], velocity: [0, 1.2, 0], life: .8, glyphs: '*', size: .22, color: [.85, .95, 1], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] },
    ],
  },
  {
    name: 'anel-de-chuva', duration: .1,
    emitters: [{ render: 'ring', bursts: [{ at: 0, count: 1 }], life: .65, ring: { from: .025, to: .27, count: 10, tangent: true }, size: .13, color: [.35, .43, .48], alpha: [{ t: 0, v: .34 }, { t: 1, v: 0 }] }],
  },
  {
    name: 'rastro', duration: 6, loop: true,
    emitters: [{ render: 'ribbon', ribbon: { length: 2.4, spacing: .16 }, offset: [0, .9, 0], glyphs: '#/-:.', size: .25, color: [{ t: 0, color: [1, .94, .64] }, { t: 1, color: [.75, .88, 1] }], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }] }],
  },
]
