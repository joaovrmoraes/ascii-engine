import * as THREE from 'three'
import type { GroundCover } from './grass'
import { meadowSoil } from './meadow'
import { swampWetness } from './swamp'
import { snowCover } from './snow'
import { forestSoilGLSL } from './forestWorld'

/**
 * The recipe that made the forest work, per biome: a lit floor plus a dense
 * carpet of standing letters that belong to the world (they sway, part
 * around boots and catch spell light). Glyphs: 0 | 1 / 2 \ 3 v 4 Y 5 ! 6 * 7 o 8 . 9 ,
 */
const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]
const camp = { x: -3, z: 2.6 }

/** Endless forest meadow: the same blades, wrapped around the hero forever. */
export function proceduralForestCover(soilUniforms: Record<string, { value: unknown }>): GroundCover {
  return {
    count: 90000, y: () => -.06, density: () => 1,
    infinite: { glsl: forestSoilGLSL, uniforms: soilUniforms, span: 36 },
    pick(random) {
      const flower = random() < .012, shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: .12 + random() * .16, color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
}

export function groundCoverFor(locationId: string): GroundCover | undefined {
  if (locationId === 'dark_forest') return {
    count: 70000, y: () => -.06,
    density: (x, z) => 1 - meadowSoil(x, z, camp).soil * 1.15,
    pick(random, x, z) {
      const soil = meadowSoil(x, z, camp).soil, flower = random() < .012
      const shade = .55 + random() * .6, warm = random()
      return flower
        ? { glyph: 6 + Math.floor(random() * 2), height: .2, color: [.62 * shade, .66 * shade, .5 * shade] }
        : { glyph: pickOf([0, 0, 1, 2, 5, 5, 3], random), height: (.12 + random() * .16) * (1 - soil * .5), color: [(.2 + warm * .14) * shade, (.46 + warm * .06) * shade, (.26 - warm * .1) * shade] }
    },
  }
  if (locationId === 'old_mine') return {
    // Gravel, dust and glints of ore along the rail bed; walls stay rock.
    count: 26000, y: () => -.03,
    density: (x) => Math.abs(x - .2) < 3.3 ? .75 : 0,
    pick(random) {
      const ore = random() < .05, shade = .45 + random() * .55
      return ore
        ? { glyph: pickOf([6, 7], random), height: .12, color: random() < .5 ? [.85 * shade, .52 * shade, .22 * shade] : [.32 * shade, .62 * shade, .5 * shade] }
        : { glyph: pickOf([8, 9, 8, 7, 9, 5], random), height: .05 + random() * .07, color: [.4 * shade, .36 * shade, .3 * shade] }
    },
  }
  if (locationId === 'sunken_cathedral') return {
    // Moss in the cracks and stone dust on the nave floor.
    count: 22000, y: () => -.03,
    density: (x) => Math.abs(x) < 3.9 ? .6 : 0,
    pick(random) {
      const moss = random() < .55, shade = .45 + random() * .55
      return moss
        ? { glyph: pickOf([9, 3, 9, 5, 8], random), height: .05 + random() * .08, color: [.24 * shade, .42 * shade, .3 * shade] }
        : { glyph: pickOf([8, 9, 8], random), height: .04 + random() * .04, color: [.42 * shade, .44 * shade, .42 * shade] }
    },
  }
  if (locationId === 'rain_marsh') return {
    // Sedge on the islands and soaked banks; open water stays clear.
    count: 40000, y: () => .17,
    density: (x, z) => swampWetness(x, z) < .42 ? .9 : 0,
    pick(random) {
      const shade = .5 + random() * .55, olive = random()
      return { glyph: pickOf([0, 0, 1, 2, 5, 3], random), height: .14 + random() * .2, color: [(.16 + olive * .12) * shade, (.38 + olive * .06) * shade, (.3 - olive * .08) * shade] }
    },
  }
  if (locationId === 'snow_pines') return {
    // Snow crust letters on the field, dry grass where the fire melted it.
    count: 30000, y: () => -.02,
    density: () => .7,
    pick(random, x, z) {
      const cover = snowCover(x, z, 0), shade = .6 + random() * .4
      return cover > .5
        ? { glyph: pickOf([8, 9, 8, 6, 7], random), height: .04 + random() * .05, color: [.62 * shade, .72 * shade, .8 * shade] }
        : { glyph: pickOf([0, 5, 1, 2], random), height: .08 + random() * .1, color: [.42 * shade, .34 * shade, .2 * shade] }
    },
  }
  return undefined
}

/** Lit floors for interiors, so the ASCII lattice belongs to the ground (not the screen). */
export function createLitFloor(locationId: string) {
  const palette = locationId === 'old_mine' ? [0x2b241d, 0x3b3128, 0x4a3d2e] : [0x2a302e, 0x343b38, 0x404842]
  const size = 256, canvas = document.createElement('canvas'); canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  let seed = 4127
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  ctx.fillStyle = `#${palette[0].toString(16).padStart(6, '0')}`; ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `#${palette[1 + Math.floor(random() * 2)].toString(16).padStart(6, '0')}`
    const w = 2 + random() * 10; ctx.fillRect(random() * size, random() * size, w, w * (.5 + random()))
  }
  if (locationId === 'sunken_cathedral') {
    // Flagstone joints.
    ctx.strokeStyle = '#1a1e1d'; ctx.lineWidth = 2
    for (let i = 0; i <= size; i += 32) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke() }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(6, 6)
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 1 })
  material.userData.asciiSurface = 'earth'
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 40), material)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  return { floor, dispose() { texture.dispose(); material.dispose(); floor.geometry.dispose() } }
}
