export interface LightObstacle { minX: number; maxX: number; minZ: number; maxZ: number }
export interface LightSource { x: number; z: number; radius: number }
const smooth = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t) }

/** Presentation-only discovery. No save, progression or combat state is changed. */
export function createExploration(obstacles: LightObstacle[], size = 128, extent = 42) {
  const cell = extent / size, half = extent / 2
  const blocked = new Uint8Array(size * size), visible = new Float32Array(size * size)
  const explored = new Float32Array(size * size), target = new Float32Array(size * size)
  const pixels = new Uint8Array(size * size * 4)
  const coordinate = (n: number) => Math.max(0, Math.min(size - 1, Math.floor((n + half) / cell)))
  for (const b of obstacles) {
    for (let z = coordinate(b.minZ); z <= coordinate(b.maxZ); z++) for (let x = coordinate(b.minX); x <= coordinate(b.maxX); x++) {
      const wx = (x + .5) * cell - half, wz = (z + .5) * cell - half
      if (wx >= b.minX - cell * .3 && wx <= b.maxX + cell * .3 && wz >= b.minZ - cell * .3 && wz <= b.maxZ + cell * .3) blocked[z * size + x] = 1
    }
  }
  function sight(x: number, z: number, tx: number, tz: number) {
    const dx = tx - x, dz = tz - z, steps = Math.ceil(Math.hypot(dx, dz) / (cell * .65))
    const start = coordinate(z) * size + coordinate(x), end = coordinate(tz) * size + coordinate(tx)
    for (let i = 1; i < steps; i++) {
      const index = coordinate(z + dz * i / steps) * size + coordinate(x + dx * i / steps)
      if (index !== start && index !== end && blocked[index]) return false
    }
    return true
  }
  return {
    size, extent, pixels,
    illuminate(sources: LightSource[]) {
      target.fill(0)
      for (const source of sources) {
        if (source.radius <= 0) continue
        for (let z = coordinate(source.z - source.radius); z <= coordinate(source.z + source.radius); z++) {
          for (let x = coordinate(source.x - source.radius); x <= coordinate(source.x + source.radius); x++) {
            const wx = (x + .5) * cell - half, wz = (z + .5) * cell - half
            const distance = Math.hypot(wx - source.x, wz - source.z)
            if (distance > source.radius || !sight(source.x, source.z, wx, wz)) continue
            const index = z * size + x
            target[index] = Math.max(target[index], 1 - smooth((distance / source.radius - .48) / .52))
          }
        }
      }
    },
    advance(dt: number) {
      // Characters emerge softly, then remain as a faint memory of the route.
      const approach = 1 - Math.exp(-Math.max(0, dt) * 5)
      for (let i = 0; i < visible.length; i++) {
        visible[i] += (target[i] - visible[i]) * approach
        explored[i] = Math.max(explored[i], visible[i])
        pixels[i * 4] = Math.round(visible[i] * 255)
        pixels[i * 4 + 1] = Math.round(explored[i] * 255)
        pixels[i * 4 + 3] = 255
      }
    },
    sample(x: number, z: number) {
      if (Math.abs(x) > half || Math.abs(z) > half) return { visible: 0, explored: 0 }
      const i = coordinate(z) * size + coordinate(x)
      return { visible: visible[i], explored: explored[i] }
    },
  }
}
