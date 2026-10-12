/** Shallow water on a bounded height field. Units: metres, seconds, m²/s flux. */
export interface WaterPhysics {
  enabled: boolean
  depth: number
  gravity: number
  damping: number
  /** Water supplied at uphill ends, metres of depth/second. Zero closes the system. */
  source: number
  /** Small wind waves added only to the rendered surface, in metres. */
  waves: number
}
export const DEFAULT_WATER_PHYSICS: WaterPhysics = { enabled: true, depth: .08, gravity: 9.81, damping: 2, source: .04, waves: .012 }

export function createWaterDynamics(resolution: number, size: number, bed: Float32Array, wet: Uint8Array, options: Partial<WaterPhysics> = {}) {
  const settings = { ...DEFAULT_WATER_PHYSICS, ...options }, n = resolution, length = n * n, dx = size / (n - 1)
  const depth = new Float32Array(length), flowX = new Float32Array(length), flowZ = new Float32Array(length)
  // Foam is transported by the current and dies away. Water depth alone does
  // not make foam: a deep, still pool must eventually have a clear surface.
  const foam = new Float32Array(length), nextFoam = new Float32Array(length)
  const scale = new Float32Array(length), source = new Uint8Array(length)
  for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
    const i = z * n + x; if (!wet[i]) continue
    depth[i] = settings.depth
    const neighbours = [x > 0 ? i - 1 : i, x < n - 1 ? i + 1 : i, z > 0 ? i - n : i, z < n - 1 ? i + n : i]
    const lower = neighbours.some(j => wet[j] && bed[j] < bed[i] - .005)
    const higher = neighbours.some(j => wet[j] && bed[j] > bed[i] + .005)
    source[i] = lower && !higher ? 1 : 0
  }
  function step(seconds: number) {
    if (!settings.enabled || seconds <= 0) return
    let remaining = Math.min(seconds, .08)
    while (remaining > 1e-7) {
      let maxDepth = settings.depth
      for (let i = 0; i < length; i++) maxDepth = Math.max(maxDepth, depth[i])
      // CFL bound and outgoing-volume limiter keep steep drops finite/positive.
      const dt = Math.min(remaining, 1 / 60, .2 * dx / Math.sqrt(settings.gravity * Math.max(.01, maxDepth)))
      remaining -= dt
      const friction = Math.exp(-settings.damping * dt), k = dt / dx
      for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
        const i = z * n + x
        if (!wet[i]) continue
        function flux(j: number, previous: number) {
          if (!wet[j]) return 0
          // Hydrostatic reconstruction: a dry high ledge cannot suck water up.
          const barrier = Math.max(bed[i], bed[j]), a = Math.max(0, bed[i] + depth[i] - barrier), b = Math.max(0, bed[j] + depth[j] - barrier)
          return (previous + settings.gravity * (a + b) * .5 * (a - b) * k) * friction
        }
        flowX[i] = x < n - 1 ? flux(i + 1, flowX[i]) : 0
        flowZ[i] = z < n - 1 ? flux(i + n, flowZ[i]) : 0
      }
      for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
        const i = z * n + x
        const out = Math.max(0, flowX[i]) + Math.max(0, flowZ[i]) + (x ? Math.max(0, -flowX[i - 1]) : 0) + (z ? Math.max(0, -flowZ[i - n]) : 0)
        scale[i] = out ? Math.min(1, depth[i] / (out * k)) : 1
      }
      for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
        const i = z * n + x
        if (x < n - 1) { const q = flowX[i] * scale[flowX[i] > 0 ? i : i + 1]; flowX[i] = q; depth[i] -= q * k; depth[i + 1] += q * k }
        if (z < n - 1) { const q = flowZ[i] * scale[flowZ[i] > 0 ? i : i + n]; flowZ[i] = q; depth[i] -= q * k; depth[i + n] += q * k }
      }
      for (let i = 0; i < length; i++) {
        depth[i] = Math.max(0, depth[i])
        if (source[i]) depth[i] += Math.min(settings.source * dt, Math.max(0, settings.depth - depth[i]))
      }
      for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
        const i = z*n+x, h = depth[i]
        if (!wet[i] || h < .002) { nextFoam[i] = 0; continue }
        const vx = (flowX[i] + (x ? flowX[i-1] : 0)) / Math.max(.015,2*h)
        const vz = (flowZ[i] + (z ? flowZ[i-n] : 0)) / Math.max(.015,2*h)
        const incoming = (x ? flowX[i-1] : 0) + (z ? flowZ[i-n] : 0) - flowX[i] - flowZ[i]
        const breaking = Math.max(0,incoming/dx-.035) * Math.min(1,Math.hypot(vx,vz)*.5)
        const moved = sample(foam,(x/(n-1)-.5)*size-vx*dt,(z/(n-1)-.5)*size-vz*dt)
        nextFoam[i] = Math.min(.65, moved*Math.exp(-dt*1.1) + breaking*dt*3)
      }
      foam.set(nextFoam)
    }
  }
  /** Impulse redistributes existing water; it does not create extra volume. */
  function disturb(x: number, z: number, strength = .18, radius = .6) {
    for (let iz = 0; iz < n; iz++) for (let ix = 0; ix < n; ix++) {
      const i = iz * n + ix; if (!wet[i] || depth[i] < .001) continue
      const rx = (ix / (n - 1) - .5) * size - x, rz = (iz / (n - 1) - .5) * size - z
      const d = Math.hypot(rx, rz), weight = Math.exp(-d * d / Math.max(.01, radius * radius)) * strength
      if (d > radius * 3) continue
      if (ix < n - 1 && wet[i + 1]) flowX[i] += (rx + dx * .5) / Math.max(radius, d) * weight
      if (iz < n - 1 && wet[i + n]) flowZ[i] += (rz + dx * .5) / Math.max(radius, d) * weight
    }
  }
  function sample(values: ArrayLike<number>, x: number, z: number) {
    const fx = Math.max(0, Math.min(n - 1, (x / size + .5) * (n - 1))), fz = Math.max(0, Math.min(n - 1, (z / size + .5) * (n - 1)))
    const ix = Math.min(n - 2, Math.floor(fx)), iz = Math.min(n - 2, Math.floor(fz)), tx = fx - ix, tz = fz - iz, i = iz * n + ix
    return (values[i] * (1 - tx) + values[i + 1] * tx) * (1 - tz) + (values[i + n] * (1 - tx) + values[i + n + 1] * tx) * tz
  }
  return { settings, depth, flowX, flowZ, foam, bed, wet, resolution, size, step, disturb, sample }
}
