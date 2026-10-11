import * as THREE from 'three'
import type { GroundCover } from '../techniques/carpet'
import type { GlyphStyle, ObjectTypeStyle } from '../style'

/**
 * The approved Pomorog look (10–11/10/2026), exterior "moon" atmosphere.
 * Numbers from `scene.ts`, `visual-pipeline.md` §10 and the player defaults.
 */
export interface AsciiStyle {
  /** Screen-pass cell in CSS px (player: 5–12, default 6). */
  cellSize: number
  /** Ink multiplier of screen pass, carpet and particles (player: .65–1.4). */
  brightness: number
  background: number
  fog: { color: number; density: number } | null
  hemisphere: { sky: number; ground: number; intensity: number }
  moon: { color: number; intensity: number; position: [number, number, number]; shadowIntensity: number; shadowExtent: number; mapSize: number }
  fill: { color: number; intensity: number; position: [number, number, number] }
  /** Interior = discovery by lantern; exterior = open moonlight. */
  interior: boolean
  /** `body`: ambient term (interior .12, snow .42, others .30). */
  bodyAmbient: number
  /** `body`: lantern strength (interior 1.2, exterior .7). */
  bodyLantern: number
  atmosphere: 'moon' | 'dusk' | 'ember'
  /** Global layer of the per-part letter style. */
  glyphs: GlyphStyle
  /** Object types known to the preset ("tree" → crown/trunk…). */
  types: Record<string, ObjectTypeStyle>
}

export const pomorog: AsciiStyle = {
  cellSize: 6,
  brightness: 1,
  background: 0x020102,
  fog: { color: 0x020102, density: .012 },
  hemisphere: { sky: 0xc2cec4, ground: 0x343321, intensity: 1.25 },
  moon: { color: 0xe0e7cc, intensity: 2.2, position: [-5, 12, 7], shadowIntensity: .62, shadowExtent: 16, mapSize: 1024 },
  fill: { color: 0x9bbfb5, intensity: .3, position: [6, 6, -7] },
  interior: false,
  bodyAmbient: .3,
  bodyLantern: .7,
  atmosphere: 'moon',
  glyphs: {},
  // Catalogue §19: crowns are open letter clouds, trunks carry bark letters.
  types: {
    tree: { style: { glyph: 'surface', surface: 'bark' }, parts: { crown: { glyph: 'body', surface: 'foliage', size: .19 }, trunk: { glyph: 'surface', surface: 'bark' } } },
    rock: { style: { glyph: 'body', surface: 'stone', size: .19 } },
    creature: { style: { glyph: 'body', size: .155 } },
    hero: { style: { glyph: 'screen', surface: 'actor' } },
    prop: { style: { glyph: 'surface', surface: 'wood' } },
    ground: { style: { glyph: 'surface', surface: 'earth' } },
  },
}

/** Pomorog interior (mine, cathedral): lantern discovery. */
export const pomorogInterior: AsciiStyle = {
  ...pomorog,
  hemisphere: { sky: 0xa6b9c6, ground: 0x25291e, intensity: .95 },
  moon: { ...pomorog.moon, color: 0xbac9cb, intensity: 1.5, shadowIntensity: 1 },
  fill: { ...pomorog.fill, color: 0x8295c1 },
  interior: true, bodyAmbient: .12, bodyLantern: 1.2,
}

/** Camera framing of `scene.ts`: span from viewport height, aspect and zoom (start .9). */
export function pomorogSpan(height: number, aspect: number, zoom = .9, combat = false) {
  const framing = Math.max(3.8, Math.min(4.7, height / 145))
  return Math.max(Math.max(framing, 4.6 / aspect) / Math.min(zoom, combat ? 1.5 : 2.2), combat ? 2.35 / aspect : 1.8)
}

const fract = (v: number) => v - Math.floor(v)
const hash = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453)
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
const fbm = (x: number, y: number) => noise(x, y) * .55 + noise(x * 2.1 + 7, y * 2.1 + 3) * .3 + noise(x * 4.3 + 1, y * 4.3 + 9) * .15
const smooth01 = (v: number) => { const t = Math.min(1, Math.max(0, v)); return t * t * (3 - 2 * t) }

/** Bare soil of the camp clearing, 0–1 (Pomorog `meadowSoil`, clearing term). */
export function campClearing(x: number, z: number, camp: { x: number; z: number }) {
  const edge = (fbm(x * 2.4, z * 2.4) - .5) * .5
  return 1 - smooth01((Math.hypot(x - camp.x, z - camp.z) - .72 + edge) / .45)
}

const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]

/**
 * Forest meadow carpet (Pomorog `groundCover.ts`, dark_forest): `| / \ ! v`,
 * rare `* o` flowers, emerald to olive. Glyphs: 0 | 1 / 2 \ 3 v 4 Y 5 ! 6 * 7 o 8 . 9 ,
 */
export function forestMeadowCover(options: { camp?: { x: number; z: number }; count?: number; extent?: number; center?: { x: number; z: number } } = {}): GroundCover {
  const camp = options.camp
  const soil = (x: number, z: number) => camp ? campClearing(x, z, camp) : 0
  return {
    count: options.count ?? 70000, extent: options.extent, center: options.center, y: () => -.06,
    density: (x, z) => 1 - soil(x, z) * 1.15,
    pick(random, x, z) {
      const bare = soil(x, z), flower = random() < .012
      const shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: (.12 + random() * .16) * (1 - bare * .5), color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
}

/**
 * Lit forest floor (Pomorog `forestWorld.ts`): moss, dry patches and the bare
 * camp clearing coloured from world position. Declare it as `surface`/`earth`.
 */
export function forestFloorMaterial(camp?: THREE.Vector3) {
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
  const campAt = { value: (camp ?? new THREE.Vector3(0, 0, 9999)).clone() }
  material.onBeforeCompile = (shader) => {
    shader.uniforms.campAt = campAt
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 forestWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nforestWorld = (modelMatrix * vec4(transformed, 1.)).xyz;')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 forestWorld;
      uniform vec3 campAt;
      float soilHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float soilNoise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(soilHash(i), soilHash(i + vec2(1., 0.)), f.x), mix(soilHash(i + vec2(0., 1.)), soilHash(i + 1.), f.x), f.y);
      }
      vec2 forestSoil(vec2 p) {
        float edge = (soilNoise(p * 2.4) - .5) * .5;
        float clearing = 1. - smoothstep(.75, 1.25, distance(p, campAt.xz) + edge);
        return vec2(clearing, 0.);
      }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 fp = forestWorld.xz;
        float mottle = soilNoise(fp * .32) * .55 + soilNoise(fp * .7 + 7.) * .3 + soilNoise(fp * 1.4 + 3.) * .15;
        float tuft = soilNoise(fp * 1.7 + 30.);
        vec3 moss = vec3(.15 + mottle * .09 + tuft * .07, .34 + mottle * .18 + tuft * .1, .11 + (1. - mottle) * .05);
        float dry = max(0., soilNoise(fp * .18 + 11.) - .55) * 2.2;
        moss += vec3(.13, .04, 0.) * dry;
        vec2 soil = forestSoil(fp);
        vec3 dirt = vec3(.36, .33, .26) * (.75 + tuft * .5);
        vec3 ground = mix(moss, dirt, soil.x) * .62;
        ground *= 1. - soil.y * .9;
        diffuseColor.rgb = pow(ground, vec3(2.2));`)
  }
  material.customProgramCacheKey = () => 'forest-floor'
  material.userData.asciiSurface = 'earth'
  return material
}
