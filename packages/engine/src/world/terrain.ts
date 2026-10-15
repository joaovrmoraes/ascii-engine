import * as THREE from 'three'
import type { GlyphStyle } from '../style'
import type { CarpetLook } from '../techniques/carpet'

/**
 * Terrain with brushes (§3.4): a height map on a grid, sculpted and painted
 * like the Unity terrain tools. Painted ground layers set the floor colour
 * (and later the letter family); the `surface` lattice follows the relief.
 * Plain data (`TerrainData`) round-trips through JSON.
 */
export interface GroundLayer {
  name: string
  /** sRGB colour of the lit floor under the letters. */
  color: number
  /** Carpet density on this layer (0 = bare). */
  grass: number
  look?: GlyphStyle
  cover?: CarpetLook
}

/** Pomorog palette: forest moss, trail earth, stone, snow. */
export const DEFAULT_LAYERS: GroundLayer[] = [
  { name: 'musgo', color: 0x3c5a26, grass: 1 },
  { name: 'terra', color: 0x5e5543, grass: 0.08 },
  { name: 'pedra', color: 0x5d6260, grass: 0 },
  { name: 'neve', color: 0xb9c9d1, grass: 0 },
]

export interface TerrainData {
  /** Side in metres and vertices per side. */
  size: number
  resolution: number
  heights: number[]
  /** Per vertex, weights of up to 4 layers (rgba), 0–255. */
  paint: number[]
  layers: GroundLayer[]
}

export type Brush = 'raise' | 'lower' | 'smooth' | 'flatten' | 'paint' | 'dig'

export interface BrushStroke {
  brush: Brush
  x: number
  z: number
  radius: number
  /** Metres per application (sculpt) or 0–1 (paint). */
  strength: number
  /** Layer index for `paint`. */
  layer?: number
  /** Target height for `flatten` (default: height under the centre). */
  height?: number
}

export function createTerrainData(
  size = 32,
  resolution = 129,
  layers = DEFAULT_LAYERS,
): TerrainData {
  const count = resolution * resolution
  const paint = new Array<number>(count * 4).fill(0)
  for (let i = 0; i < count; i++) paint[i * 4] = 255
  return {
    size,
    resolution,
    heights: new Array<number>(count).fill(0),
    paint,
    layers: layers.map(l => ({ ...l })),
  }
}

const smoothFalloff = (d: number) => {
  const t = Math.max(0, 1 - d)
  return t * t * (3 - 2 * t)
}

export function createTerrain(data: TerrainData = createTerrainData()) {
  const { size, resolution } = data
  const step = size / (resolution - 1)
  const geometry = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1)
  geometry.rotateX(-Math.PI / 2)
  const colors = new Float32Array(resolution * resolution * 3)
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    color: 0xffffff,
  })
  const mesh = new THREE.Mesh(geometry, material)
  const originalIndices = geometry.index!.array.slice()
  let layerMaterials: THREE.MeshStandardMaterial[] | undefined
  function prepareLooks() {
    if (!layerMaterials && !data.layers.some(layer => layer.look)) return
    layerMaterials?.forEach(material => material.dispose())
    layerMaterials = data.layers.some(layer => layer.look)
      ? data.layers.map(layer => {
          const copy = material.clone()
          copy.userData.glyphStyle = { glyph: 'surface', ...layer.look }
          return copy
        })
      : undefined
    mesh.material = (layerMaterials ?? material) as typeof material
    mesh.userData.terrainLooks = !!layerMaterials
    delete mesh.userData.asciiOriginal
  }
  prepareLooks()
  mesh.receiveShadow = true
  mesh.castShadow = true
  mesh.name = 'terrain'
  mesh.userData.glyph = 'surface'
  mesh.userData.glyphStyle = { surface: 'earth' }
  const layerColors = () => data.layers.map(l => new THREE.Color(l.color))
  let palette = layerColors()
  // Vertex (ix, iz): PlaneGeometry rows run along +z after the rotation.
  const index = (ix: number, iz: number) => iz * resolution + ix
  const worldOf = (ix: number, iz: number) => ({
    x: -size / 2 + ix * step,
    z: -size / 2 + iz * step,
  })

  function refresh(from = 0, to = resolution * resolution) {
    const position = geometry.attributes.position as THREE.BufferAttribute
    const c = new THREE.Color()
    for (let i = from; i < to; i++) {
      position.setY(i, data.heights[i])
      c.setRGB(0, 0, 0)
      let total = 0
      for (let k = 0; k < 4 && k < palette.length; k++) total += data.paint[i * 4 + k]
      for (let k = 0; k < 4 && k < palette.length; k++) {
        const w = data.paint[i * 4 + k] / Math.max(1, total)
        c.r += palette[k].r * w
        c.g += palette[k].g * w
        c.b += palette[k].b * w
      }
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    position.needsUpdate = true
    ;(geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
    if (layerMaterials) {
      const buckets = data.layers.map(() => [] as number[])
      for (let i = 0; i < originalIndices.length; i += 3) {
        let best = 0,
          weight = -1
        for (let k = 0; k < data.layers.length; k++) {
          const sum =
            data.paint[originalIndices[i] * 4 + k] +
            data.paint[originalIndices[i + 1] * 4 + k] +
            data.paint[originalIndices[i + 2] * 4 + k]
          if (sum > weight) {
            weight = sum
            best = k
          }
        }
        buckets[best].push(originalIndices[i], originalIndices[i + 1], originalIndices[i + 2])
      }
      geometry.clearGroups()
      let offset = 0
      const indices = geometry.index!.array
      buckets.forEach((bucket, index) => {
        indices.set(bucket, offset)
        geometry.addGroup(offset, bucket.length, index)
        offset += bucket.length
      })
      geometry.index!.needsUpdate = true
    }
  }
  refresh()

  /** Height at a world point (bilinear). */
  function heightAt(x: number, z: number) {
    const fx = THREE.MathUtils.clamp((x + size / 2) / step, 0, resolution - 1.001),
      fz = THREE.MathUtils.clamp((z + size / 2) / step, 0, resolution - 1.001)
    const ix = Math.floor(fx),
      iz = Math.floor(fz),
      tx = fx - ix,
      tz = fz - iz
    const h = data.heights
    const a = h[index(ix, iz)],
      b = h[index(ix + 1, iz)],
      c = h[index(ix, iz + 1)],
      d = h[index(ix + 1, iz + 1)]
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz
  }
  /** Dominant painted layer at a world point. */
  function layerAt(x: number, z: number) {
    const ix = Math.round(THREE.MathUtils.clamp((x + size / 2) / step, 0, resolution - 1)),
      iz = Math.round(THREE.MathUtils.clamp((z + size / 2) / step, 0, resolution - 1))
    const i = index(ix, iz)
    let best = 0
    for (let k = 1; k < 4; k++) if (data.paint[i * 4 + k] > data.paint[i * 4 + best]) best = k
    return best
  }

  /** Applies one brush stroke; returns true if something changed. */
  function apply(stroke: BrushStroke) {
    const { x, z, radius } = stroke
    const minX = Math.max(0, Math.floor((x - radius + size / 2) / step)),
      maxX = Math.min(resolution - 1, Math.ceil((x + radius + size / 2) / step))
    const minZ = Math.max(0, Math.floor((z - radius + size / 2) / step)),
      maxZ = Math.min(resolution - 1, Math.ceil((z + radius + size / 2) / step))
    if (minX > maxX || minZ > maxZ) return false
    const target = stroke.height ?? heightAt(x, z)
    const before = stroke.brush === 'smooth' ? data.heights.slice() : data.heights
    for (let iz = minZ; iz <= maxZ; iz++)
      for (let ix = minX; ix <= maxX; ix++) {
        const p = worldOf(ix, iz),
          w = smoothFalloff(Math.hypot(p.x - x, p.z - z) / radius)
        if (w <= 0) continue
        const i = index(ix, iz)
        switch (stroke.brush) {
          case 'raise':
            data.heights[i] += stroke.strength * w
            break
          case 'lower':
            data.heights[i] -= stroke.strength * w
            break
          case 'dig':
            data.heights[i] = Math.min(data.heights[i], data.heights[i] - stroke.strength * w)
            break
          case 'flatten':
            data.heights[i] += (target - data.heights[i]) * Math.min(1, stroke.strength * w)
            break
          case 'smooth': {
            let sum = 0,
              n = 0
            for (let dz = -1; dz <= 1; dz++)
              for (let dx = -1; dx <= 1; dx++) {
                const jx = ix + dx,
                  jz = iz + dz
                if (jx < 0 || jz < 0 || jx >= resolution || jz >= resolution) continue
                sum += before[index(jx, jz)]
                n++
              }
            data.heights[i] += (sum / n - data.heights[i]) * Math.min(1, stroke.strength * w)
            break
          }
          case 'paint': {
            const layer = stroke.layer ?? 0,
              amount = Math.min(1, stroke.strength * w)
            for (let k = 0; k < 4; k++) {
              const v = data.paint[i * 4 + k]
              data.paint[i * 4 + k] = Math.round(
                k === layer ? v + (255 - v) * amount : v * (1 - amount),
              )
            }
            break
          }
        }
      }
    refresh(index(0, minZ), index(resolution - 1, maxZ) + 1)
    return true
  }

  return {
    mesh,
    data,
    heightAt,
    layerAt,
    apply,
    refresh,
    /** Re-reads `data.layers` (colours changed). */
    setLayers(layers: GroundLayer[]) {
      data.layers = structuredClone(layers)
      palette = layerColors()
      prepareLooks()
      refresh()
    },
    /** Carpet density for a recipe: the painted layer's `grass`, zero under water. */
    grassAt(x: number, z: number, waterLevel = -Infinity) {
      if (heightAt(x, z) < waterLevel + 0.02) return 0
      return data.layers[layerAt(x, z)]?.grass ?? 0
    },
    toJSON(): TerrainData {
      return {
        ...data,
        heights: data.heights.map(h => Math.round(h * 1000) / 1000),
        paint: [...data.paint],
      }
    },
    dispose() {
      layerMaterials?.forEach(material => material.dispose())
      geometry.dispose()
      material.dispose()
    },
  }
}
export type Terrain = ReturnType<typeof createTerrain>
