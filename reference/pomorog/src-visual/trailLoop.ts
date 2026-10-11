/**
 * The hunt is a closed circuit: the bonfire sits at s = 0, the traveller walks
 * the whole loop and arrives back at the fire when the focus block ends.
 * Length = hunt seconds × average pace; the loop is a wobbling ring of radius
 * L / 2π whose wobble uses whole frequencies so it closes without a seam.
 */
export const LOOP_CHUNK = 20
/** Average metres per second a hunt covers (walking, jogging, pauses and fights). */
export const HUNT_PACE = 1.05

export interface TrailLoop {
  length: number; radius: number; chunks: number
  /** Trail centre point at arc length s, with unit tangent and outward normal. */
  point(s: number): { x: number; z: number; tx: number; tz: number; nx: number; nz: number }
  /** Arc length of the trail point nearest to (x, z), in [0, length). */
  nearest(x: number, z: number): number
  /** Signed distance from the trail centre line (positive outward). */
  offset(x: number, z: number): number
  uniforms: { loopShape: { value: number[] } }
}

export function loopLength(huntSeconds: number) {
  const chunks = Math.max(4, Math.round(huntSeconds * HUNT_PACE / LOOP_CHUNK))
  return chunks * LOOP_CHUNK
}

export function createTrailLoop(length: number): TrailLoop {
  const chunks = Math.round(length / LOOP_CHUNK), L = chunks * LOOP_CHUNK, R = L / (Math.PI * 2)
  const n1 = Math.max(1, Math.round(R * .043)), n2 = Math.max(2, Math.round(R * .11)), n3 = Math.max(3, Math.round(R * .27))
  const wobble = (t: number) => 2.4 * Math.sin(n1 * t) + 1.2 * Math.sin(n2 * t + 1.3) + .45 * Math.sin(n3 * t + .4)
  const wobbleD = (t: number) => 2.4 * n1 * Math.cos(n1 * t) + 1.2 * n2 * Math.cos(n2 * t + 1.3) + .45 * n3 * Math.cos(n3 * t + .4)
  const wrap = (s: number) => ((s % L) + L) % L
  // Centre below the start so s = 0 sits near the origin.
  const cz = -R
  return {
    length: L, radius: R, chunks,
    point(s: number) {
      const t = wrap(s) / R, r = R + wobble(t), dr = wobbleD(t)
      const sx = Math.sin(t), cs = Math.cos(t)
      const x = r * sx, z = cz + r * cs
      let tx = dr * sx + r * cs, tz = dr * cs - r * sx
      const len = Math.hypot(tx, tz) || 1; tx /= len; tz /= len
      return { x, z, tx, tz, nx: sx, nz: cs }
    },
    nearest(x: number, z: number) {
      const t = Math.atan2(x, z - cz)
      return wrap(t * R)
    },
    offset(x: number, z: number) {
      const t = Math.atan2(x, z - cz)
      return Math.hypot(x, z - cz) - (R + wobble(t))
    },
    // [R, cz, n1, n2, n3] for the GLSL mirror below.
    uniforms: { loopShape: { value: [R, cz, n1, n2, n3] } },
  }
}

/** GLSL mirror: signed distance to the trail and arc length. */
export const trailLoopGLSL = `
  uniform float loopShape[5];
  float trailOffset(vec2 p) {
    vec2 d = vec2(p.x, p.y - loopShape[1]);
    float t = atan(d.x, d.y);
    float w = 2.4 * sin(loopShape[2] * t) + 1.2 * sin(loopShape[3] * t + 1.3) + .45 * sin(loopShape[4] * t + .4);
    return length(d) - (loopShape[0] + w);
  }
`

/**
 * Pace programme: each 9 s segment is a walk, a jog or a pause-then-walk,
 * picked deterministically. The base speed is solved so that, with this
 * programme, the remaining distance is covered in the remaining time.
 */
export function paceAt(time: number) {
  const segment = Math.floor(time / 9), roll = fract(Math.sin(segment * 91.7) * 43758.5), into = time - segment * 9
  if (roll < .22) return into < 3.2 ? 0 : 1
  if (roll < .5) return 2.1
  return 1
}
const fract = (v: number) => v - Math.floor(v)
/** Long-run mean of paceAt, used to solve the base speed. */
export const MEAN_PACE = (() => { let sum = 0; const n = 4000; for (let i = 0; i < n; i++) sum += paceAt(i * .9 + .37); return sum / n })()

/** Base speed (m/s at pace 1) that brings the traveller home on time. */
export function solveBaseSpeed(remainingMetres: number, remainingSeconds: number) {
  // Bounded to a believable gait: ~1.45 m/s walking, ~3 m/s jogging at most.
  if (remainingSeconds <= .5) return 1.45
  return Math.min(1.45, Math.max(.35, remainingMetres / remainingSeconds / MEAN_PACE))
}
