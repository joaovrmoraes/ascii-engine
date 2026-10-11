/**
 * A closed winding circuit (Pomorog `trailLoop.ts`): a ring of radius L / 2π
 * that wobbles with whole frequencies, so it closes without a seam. Chunks are
 * laid along it by arc length. Point s = 0 sits near the origin.
 */
export interface Circuit {
  length: number; radius: number; chunks: number; chunkLength: number
  /** Centre point at arc length s, with unit tangent and outward normal. */
  point(s: number): { x: number; z: number; tx: number; tz: number; nx: number; nz: number }
  /** Arc length of the point nearest to (x, z), in [0, length). */
  nearest(x: number, z: number): number
  /** Signed distance from the centre line (positive outward). */
  offset(x: number, z: number): number
  /** `[R, cz, n1, n2, n3]` for `circuitGLSL`. */
  shape: number[]
}

export function createCircuit(length: number, chunkLength = 20): Circuit {
  const chunks = Math.max(1, Math.round(length / chunkLength)), L = chunks * chunkLength, R = L / (Math.PI * 2)
  const n1 = Math.max(1, Math.round(R * .043)), n2 = Math.max(2, Math.round(R * .11)), n3 = Math.max(3, Math.round(R * .27))
  const wobble = (t: number) => 2.4 * Math.sin(n1 * t) + 1.2 * Math.sin(n2 * t + 1.3) + .45 * Math.sin(n3 * t + .4)
  const wobbleD = (t: number) => 2.4 * n1 * Math.cos(n1 * t) + 1.2 * n2 * Math.cos(n2 * t + 1.3) + .45 * n3 * Math.cos(n3 * t + .4)
  const wrap = (s: number) => ((s % L) + L) % L
  const cz = -R
  return {
    length: L, radius: R, chunks, chunkLength,
    point(s: number) {
      const t = wrap(s) / R, r = R + wobble(t), dr = wobbleD(t)
      const sx = Math.sin(t), cs = Math.cos(t)
      const x = r * sx, z = cz + r * cs
      let tx = dr * sx + r * cs, tz = dr * cs - r * sx
      const len = Math.hypot(tx, tz) || 1; tx /= len; tz /= len
      return { x, z, tx, tz, nx: sx, nz: cs }
    },
    nearest(x: number, z: number) { return wrap(Math.atan2(x, z - cz) * R) },
    offset(x: number, z: number) {
      const t = Math.atan2(x, z - cz)
      return Math.hypot(x, z - cz) - (R + wobble(t))
    },
    shape: [R, cz, n1, n2, n3],
  }
}

/** GLSL mirror: `trailOffset(p)`, signed distance to the circuit centre line. */
export const circuitGLSL = `
  uniform float loopShape[5];
  float trailOffset(vec2 p) {
    vec2 d = vec2(p.x, p.y - loopShape[1]);
    float t = atan(d.x, d.y);
    float w = 2.4 * sin(loopShape[2] * t) + 1.2 * sin(loopShape[3] * t + 1.3) + .45 * sin(loopShape[4] * t + .4);
    return length(d) - (loopShape[0] + w);
  }
`
