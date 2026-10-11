import * as THREE from 'three'
import { pathCenter } from './grass'
import { riverCenter } from './water'

const fract = (v: number) => v - Math.floor(v)
const hash = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453)
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
const fbm = (x: number, y: number) => noise(x, y) * .55 + noise(x * 2.1 + 7, y * 2.1 + 3) * .3 + noise(x * 4.3 + 1, y * 4.3 + 9) * .15

/**
 * A lit forest floor: it receives moonlight, tree/actor shadows and every point
 * light (fire, lantern, spells). The ASCII pass turns its green into blades and
 * its bare soil into grit, so light pools read on the ground like in the
 * 18:03 boss-fight reference.
 */
export function createMeadowFloor(width: number, depth: number, camp: THREE.Vector3) {
  const size = 512, canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!, image = ctx.createImageData(size, size)
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    // Without flipY, canvas row 0 is v = 0, which lies at +z once laid flat.
    const x = (px / size - .5) * width, z = (.5 - py / size) * depth
    const patch = fbm(x * .32, z * .32), tuft = fbm(x * 1.7 + 30, z * 1.7)
    // Meadow: saturated moss, yellow-green dry patches and darker hollows.
    let r = .15 + patch * .09 + tuft * .07, g = .34 + patch * .18 + tuft * .10, b = .11 + (1 - patch) * .05
    const dry = Math.max(0, fbm(x * .18 + 11, z * .18 - 4) - .55) * 2.2
    r += dry * .13; g += dry * .04
    const { soil, bed } = meadowSoil(x, z, camp)
    const grit = .75 + tuft * .5
    r = r + (.36 * grit - r) * soil; g = g + (.33 * grit - g) * soil; b = b + (.26 * grit - b) * soil
    // Blades carry the bright green; the floor below stays a darker bed.
    r *= .62; g *= .62; b *= .62
    // The river bed stays almost black under the reflective water plane.
    r *= 1 - bed * .9; g *= 1 - bed * .9; b *= 1 - bed * .85
    const i = (py * size + px) * 4
    image.data[i] = Math.min(255, r * 255); image.data[i + 1] = Math.min(255, g * 255); image.data[i + 2] = Math.min(255, b * 255); image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0 })
  material.userData.asciiSurface = 'earth'
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  return { floor, dispose() { texture.dispose(); material.dispose(); floor.geometry.dispose() } }
}

/** Bare soil (footpath, ruined courtyard, trodden camp, muddy banks) and river bed, 0–1. */
export function meadowSoil(x: number, z: number, camp: { x: number; z: number }) {
  const edge = (fbm(x * 2.4, z * 2.4) - .5) * .5
  const path = 1 - smooth01((Math.abs(x - pathCenter(z)) - .26 + edge) / .3)
  const court = z < -3.5 && Math.abs(x) < 7.5 ? smooth01((-3.5 - z) / .9 + edge) * smooth01((7.5 - Math.abs(x)) / .9) : 0
  const clearing = 1 - smooth01((Math.hypot(x - camp.x, z - camp.z) - .72 + edge) / .45)
  const riverDistance = Math.abs(x - riverCenter(z))
  const bank = 1 - smooth01((riverDistance - 1.25 + edge * .6) / .45)
  return { soil: Math.min(1, Math.max(path * .85, court * .75, clearing, bank * .8)), bed: 1 - smooth01((riverDistance - 1.05) / .12) }
}

function smooth01(v: number) { const t = Math.min(1, Math.max(0, v)); return t * t * (3 - 2 * t) }
