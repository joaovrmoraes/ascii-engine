import type { EffectDef } from './effects'

/**
 * Pomorog effects remade as data (fidelity test of the effect system).
 * Numbers follow `effects.ts`; combat letters are ×1.4 there, here sizes
 * already include it.
 */
const fire: [number, number, number][] = [
  [1.3, 1.15, 0.55],
  [1.3, 0.98, 0.3],
  [1.25, 0.78, 0.16],
  [1.1, 0.45, 0.07],
  [0.65, 0.12, 0.03],
]
export const POMOROG_EFFECTS: EffectDef[] = [
  {
    name: 'fogueira',
    duration: 4,
    loop: true,
    light: {
      color: 0xffac55,
      intensity: 14,
      distance: 7,
      decay: 1.65,
      flicker: 0.08,
      offset: [0, 1.05, 0],
    },
    emitters: [
      { render: 'heat' },
      // Ember bed, sparks spiralling up, grey smoke.
      {
        shape: { kind: 'ring', radius: 0.36, surface: false },
        rate: 40,
        life: [0.6, 1.2],
        glyphs: '*+:',
        size: 0.15,
        color: [
          { t: 0, color: [1, 0.66, 0.25] },
          { t: 1, color: [0.85, 0.3, 0.08] },
        ],
        alpha: [
          { t: 0, v: 0.9 },
          { t: 1, v: 0.3 },
        ],
      },
      {
        offset: [0, 0.55, 0],
        shape: { kind: 'sphere', radius: 0.15 },
        rate: 14,
        life: [1.2, 2.2],
        speed: [0.2, 0.4],
        velocity: [0, 1.4, 0],
        spin: 2.5,
        glyphs: '*...',
        size: 0.13,
        color: [1, 0.75, 0.3],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
      {
        offset: [0, 0.7, 0],
        shape: { kind: 'sphere', radius: 0.2 },
        rate: 6,
        life: [2, 3],
        velocity: [0.05, 0.9, 0],
        noise: 0.6,
        glyphs: ',;:~',
        size: 0.2,
        color: [0.38, 0.36, 0.35],
        alpha: [
          { t: 0, v: 0.5 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'poeira',
    duration: 0.2,
    emitters: [
      {
        bursts: [{ at: 0, count: 6 }],
        shape: { kind: 'sphere', radius: 0.1 },
        life: 1.1,
        speed: [0.3, 0.5],
        velocity: [0, 0.55, 0],
        drag: 0.5,
        glyphs: ',:.',
        size: [
          { t: 0, v: 0.17 },
          { t: 1, v: 0.26 },
        ],
        color: [0.48, 0.44, 0.36],
        alpha: [
          { t: 0, v: 0.75 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'vagalumes',
    duration: 10,
    loop: true,
    emitters: [
      {
        shape: { kind: 'box', size: [14, 1.5, 14] },
        offset: [0, 1, 0],
        rate: 7,
        life: [4, 8],
        noise: 0.4,
        glyphs: '+*+',
        size: [
          { t: 0, v: 0.15 },
          { t: 0.5, v: 0.22 },
          { t: 1, v: 0.15 },
        ],
        color: [0.82, 0.96, 0.72],
        alpha: [
          { t: 0, v: 0 },
          { t: 0.3, v: 1 },
          { t: 0.6, v: 0.2 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'morte',
    duration: 1.6,
    emitters: [
      {
        bursts: [{ at: 0, count: 60 }],
        shape: { kind: 'sphere', radius: 0.4 },
        offset: [0, 0.7, 0],
        life: [1.1, 1.6],
        speed: [0.3, 0.8],
        velocity: [0, 1.3, 0],
        glyphs: '@#%*+:.',
        size: 0.24,
        color: [
          { t: 0, color: [0.9, 0.82, 0.66] },
          { t: 1, color: [1, 0.6, 0.25] },
        ],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'aura',
    duration: 1.1,
    light: {
      color: 0xffc66b,
      intensity: 9,
      distance: 4.5,
      decay: 1.6,
      offset: [0, 0.9, 0],
      fade: [
        { t: 0, v: 0 },
        { t: 0.5, v: 1 },
        { t: 1, v: 0 },
      ],
    },
    emitters: [
      {
        bursts: [{ at: 0, count: 36 }],
        shape: { kind: 'ring', radius: 0.62 },
        offset: [0, 0.95, 0],
        spin: 5,
        life: 1.1,
        glyphs: 'o*',
        size: 0.2,
        color: [1, 0.82, 0.38],
        alpha: [
          { t: 0, v: 0 },
          { t: 0.5, v: 0.9 },
          { t: 1, v: 0 },
        ],
      },
      {
        rate: 24,
        shape: { kind: 'ring', radius: 0.35, surface: false },
        offset: [0, 0.1, 0],
        velocity: [0, 2, 0],
        life: 1,
        glyphs: '*+',
        size: 0.18,
        color: [1, 0.82, 0.38],
        alpha: [
          { t: 0, v: 0.9 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'raio',
    duration: 0.5,
    light: {
      color: 0x8caaff,
      intensity: 12,
      distance: 7,
      offset: [0, 1, 0],
      fade: [
        { t: 0, v: 1 },
        { t: 1, v: 0 },
      ],
    },
    emitters: [
      {
        render: 'beam',
        offset: [0, 0.9, 0],
        shape: { kind: 'line', to: [0, 5.7, 0] },
        beam: { segments: 26, jitter: 24, amplitude: 0.14 },
        size: 0.34,
        color: [0.92, 0.96, 1],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
      {
        render: 'ring',
        bursts: [{ at: 0, count: 1 }],
        offset: [0, 0.06, 0],
        life: 0.7,
        ring: { from: 0.3, to: 2, count: 36 },
        glyphs: '~-=+',
        size: 0.25,
        color: [0.58, 0.78, 1],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'explosao-de-fogo',
    duration: 0.9,
    light: {
      color: 0xff991f,
      intensity: 12,
      distance: 7,
      offset: [0, 0.9, 0],
      fade: [
        { t: 0, v: 1 },
        { t: 1, v: 0 },
      ],
    },
    emitters: [
      {
        render: 'ring',
        bursts: [{ at: 0, count: 1 }],
        offset: [0, 0.1, 0],
        life: 0.8,
        ring: { from: 0, to: 1.8, count: 28 },
        glyphs: 'Oo',
        size: 0.31,
        color: [1, 0.85, 0.5],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
      {
        bursts: [{ at: 0, count: 54 }],
        shape: { kind: 'cone', radius: 0.45, angle: 0.25 },
        speed: [1, 2.2],
        gravity: 1.5,
        life: [0.5, 0.9],
        glyphs: '@#%x+.',
        size: [
          { t: 0, v: 0.31 },
          { t: 1, v: 0.2 },
        ],
        color: [
          { t: 0, color: fire[0] },
          { t: 0.4, color: fire[2] },
          { t: 1, color: fire[4] },
        ],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'gelo',
    duration: 1.25,
    emitters: [
      {
        bursts: [{ at: 0, count: 13 }],
        shape: { kind: 'ring', radius: 0.6 },
        velocity: [0, 1.5, 0],
        drag: 3,
        life: 1.2,
        glyphs: '##A^',
        size: 0.3,
        color: [
          { t: 0, color: [0.58, 0.78, 1] },
          { t: 1, color: [0.85, 0.95, 1] },
        ],
        alpha: [
          { t: 0, v: 1 },
          { t: 0.8, v: 1 },
          { t: 1, v: 0 },
        ],
      },
      {
        rate: 16,
        shape: { kind: 'sphere', radius: 0.6 },
        offset: [0, 0.3, 0],
        velocity: [0, 1.2, 0],
        life: 0.8,
        glyphs: '*',
        size: 0.22,
        color: [0.85, 0.95, 1],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'anel-de-chuva',
    duration: 0.1,
    emitters: [
      {
        render: 'ring',
        bursts: [{ at: 0, count: 1 }],
        life: 0.65,
        ring: { from: 0.025, to: 0.27, count: 10, tangent: true },
        size: 0.13,
        color: [0.35, 0.43, 0.48],
        alpha: [
          { t: 0, v: 0.34 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
  {
    name: 'rastro',
    duration: 6,
    loop: true,
    emitters: [
      {
        render: 'ribbon',
        ribbon: { length: 2.4, spacing: 0.16 },
        offset: [0, 0.9, 0],
        glyphs: '#/-:.',
        size: 0.25,
        color: [
          { t: 0, color: [1, 0.94, 0.64] },
          { t: 1, color: [0.75, 0.88, 1] },
        ],
        alpha: [
          { t: 0, v: 1 },
          { t: 1, v: 0 },
        ],
      },
    ],
  },
]
