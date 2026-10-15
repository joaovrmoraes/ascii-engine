/**
 * Hunt pacing of the Pomorog circuit (`trailLoop.ts`): game behaviour, kept
 * in the editor. Each 9 s segment walks, jogs or pauses then walks.
 */
export const LOOP_CHUNK = 20
/** Average metres per second a hunt covers (walking, jogging, pauses and fights). */
export const HUNT_PACE = 1.05

export function loopLength(huntSeconds: number) {
  return Math.max(4, Math.round((huntSeconds * HUNT_PACE) / LOOP_CHUNK)) * LOOP_CHUNK
}

const fract = (v: number) => v - Math.floor(v)
export function paceAt(time: number) {
  const segment = Math.floor(time / 9),
    roll = fract(Math.sin(segment * 91.7) * 43758.5),
    into = time - segment * 9
  if (roll < 0.22) return into < 3.2 ? 0 : 1
  if (roll < 0.5) return 2.1
  return 1
}
/** Long-run mean of paceAt, used to solve the base speed. */
export const MEAN_PACE = (() => {
  let sum = 0
  const n = 4000
  for (let i = 0; i < n; i++) sum += paceAt(i * 0.9 + 0.37)
  return sum / n
})()

/** Base speed (m/s at pace 1) that brings the traveller home on time. */
export function solveBaseSpeed(remainingMetres: number, remainingSeconds: number) {
  if (remainingSeconds <= 0.5) return 1.45
  return Math.min(1.45, Math.max(0.35, remainingMetres / remainingSeconds / MEAN_PACE))
}
