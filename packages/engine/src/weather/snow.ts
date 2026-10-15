/** Deterministic world-space snow samples; contacts and cover policy belong to the consumer. */
const fract = (n: number) => n - Math.floor(n)
const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453)

/** Slow flakes drift sideways in gusts; no rain-like straight velocity. */
export function snowflake(index: number, time: number) {
  const speed = 0.48 + hash(index + 23) * 0.48
  const phase = fract(hash(index + 7) + (time * speed) / 8)
  return {
    x:
      (hash(index * 3 + 1) - 0.5) * 26 +
      Math.sin(time * 0.42 + index) * 0.45 +
      Math.sin(time * 0.13) * 0.65,
    y: 8 * (1 - phase),
    z: (hash(index * 3 + 2) - 0.5) * 26 + Math.cos(time * 0.31 + index * 2.4) * 0.35,
    size: 0.085 + hash(index + 9) * 0.105,
    phase,
  }
}
