/** Damped shallow-water waves. Fixed steps keep wakes consistent at 30/60 fps. */
export function createRippleField(size = 112, extent = 24) {
  let current = new Float32Array(size * size),
    previous = new Float32Array(size * size)
  const wet = new Uint8Array(size * size).fill(1)
  const step = extent / (size - 1),
    fixed = 1 / 60
  const propagation = ((2.6 * fixed) / step) ** 2
  let remainder = 0
  return {
    size,
    extent,
    get heights() {
      return current
    },
    setShore(isWet: (x: number, z: number) => boolean) {
      for (let z = 0; z < size; z++)
        for (let x = 0; x < size; x++) {
          const i = z * size + x
          wet[i] = Number(isWet(x * step - extent / 2, z * step - extent / 2))
          if (!wet[i]) current[i] = previous[i] = 0
        }
    },
    disturb(x: number, z: number, strength: number, radius = 0.3) {
      const gx = (x + extent / 2) / step,
        gz = (z + extent / 2) / step,
        reach = Math.ceil((radius * 2) / step)
      for (
        let iz = Math.max(1, Math.floor(gz) - reach);
        iz <= Math.min(size - 2, Math.ceil(gz) + reach);
        iz++
      ) {
        for (
          let ix = Math.max(1, Math.floor(gx) - reach);
          ix <= Math.min(size - 2, Math.ceil(gx) + reach);
          ix++
        ) {
          const i = iz * size + ix
          if (wet[i])
            current[i] +=
              Math.exp((-((ix - gx) ** 2 + (iz - gz) ** 2) * step * step) / (radius * radius)) *
              strength
        }
      }
    },
    advance(dt: number) {
      remainder += Math.min(0.1, Math.max(0, dt))
      while (remainder + 1e-9 >= fixed) {
        remainder -= fixed
        for (let z = 1; z < size - 1; z++)
          for (let x = 1; x < size - 1; x++) {
            const i = z * size + x,
              h = current[i]
            const laplacian =
              (wet[i - 1] ? current[i - 1] : h) +
              (wet[i + 1] ? current[i + 1] : h) +
              (wet[i - size] ? current[i - size] : h) +
              (wet[i + size] ? current[i + size] : h) -
              h * 4
            previous[i] = wet[i]
              ? Math.max(-2, Math.min(2, (h * 2 - previous[i] + propagation * laplacian) * 0.988))
              : 0
          }
        const swap = previous
        previous = current
        current = swap
      }
    },
  }
}
