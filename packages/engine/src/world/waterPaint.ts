import type { WaterShape } from '../techniques/water'

/** Signed distance samples over a square, persisted as ordinary scene JSON. */
export interface WaterMask {
  resolution: number
  values: number[]
  heights?: number[]
}
export function createWaterPaint(size: number, resolution = 129): WaterShape {
  return {
    kind: 'paint',
    x: 0,
    z: 0,
    angle: 0,
    size: size / 2,
    mask: { resolution, values: new Array(resolution ** 2).fill(-size * 2) },
  }
}

/** Bilinear signed distance, identical to the water shader's four samples. */
export function waterMaskEdge(
  shape: WaterShape,
  x: number,
  z: number,
  values = shape.mask?.values,
) {
  const mask = shape.mask
  if (!mask || !values) return -Infinity
  const dx = x - shape.x,
    dz = z - shape.z,
    c = Math.cos(shape.angle),
    s = Math.sin(shape.angle)
  const u = (c * dx + s * dz) / (shape.size * 2) + 0.5,
    v = (-s * dx + c * dz) / (shape.size * 2) + 0.5
  if (u < 0 || v < 0 || u > 1 || v > 1)
    return -1 - Math.hypot(Math.max(0, -u, u - 1), Math.max(0, -v, v - 1)) * shape.size * 2
  const n = mask.resolution,
    fx = u * (n - 1),
    fz = v * (n - 1),
    ix = Math.min(n - 2, Math.floor(fx)),
    iz = Math.min(n - 2, Math.floor(fz))
  const tx = fx - ix,
    tz = fz - iz,
    a = values[iz * n + ix],
    b = values[iz * n + ix + 1],
    d = values[(iz + 1) * n + ix],
    e = values[(iz + 1) * n + ix + 1]
  return (a * (1 - tx) + b * tx) * (1 - tz) + (d * (1 - tx) + e * tx) * tz
}

/** Sweep a circular brush between two points, even when pointer events are sparse. */
export function paintWater(
  shape: WaterShape,
  from: { x: number; z: number },
  to: { x: number; z: number },
  radius: number,
  erase = false,
) {
  if (shape.kind !== 'paint' || !shape.mask) return false
  const { resolution: n, values } = shape.mask,
    c = Math.cos(shape.angle),
    s = Math.sin(shape.angle)
  const vx = to.x - from.x,
    vz = to.z - from.z,
    length2 = vx * vx + vz * vz
  let changed = false
  for (let iz = 0; iz < n; iz++)
    for (let ix = 0; ix < n; ix++) {
      const lx = (ix / (n - 1) - 0.5) * shape.size * 2,
        lz = (iz / (n - 1) - 0.5) * shape.size * 2
      const x = shape.x + c * lx - s * lz,
        z = shape.z + s * lx + c * lz
      const t = length2
        ? Math.max(0, Math.min(1, ((x - from.x) * vx + (z - from.z) * vz) / length2))
        : 0
      const edge = radius - Math.hypot(x - from.x - vx * t, z - from.z - vz * t),
        i = iz * n + ix
      const next =
        Math.round((erase ? Math.min(values[i], -edge) : Math.max(values[i], edge)) * 10000) / 10000
      if (next !== values[i]) {
        values[i] = next
        changed = true
      }
    }
  return changed
}

/** Water surface height, including painted slopes. */
export function waterHeightAt(shape: WaterShape, x: number, z: number, level = 0) {
  return shape.mask?.heights ? level + waterMaskEdge(shape, x, z, shape.mask.heights) : level
}
