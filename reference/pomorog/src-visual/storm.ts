const hash = (n: number) => { const x = Math.sin(n * 127.1 + 31.7) * 43758.5453; return x - Math.floor(x) }
const strikeTime = (id: number) => id === 0 ? 4.2 : id * 24 + 3 + hash(id) * 6

/** Scene time freezes with the game. A single flash, with irregular quiet gaps. */
export function stormAt(time: number) {
  let id = Math.floor(Math.max(0, time) / 24)
  if (time < strikeTime(id)) id--
  if (id < 0) return undefined
  const at = strikeTime(id), age = time - at
  const power = .8 + hash(id + 11) * .2
  const flash = age < .95 ? Math.min(1, age / .025) * Math.exp(-Math.max(0, age - .065) * 5.8) * power : 0
  return { id, at, age, flash, bolt: age < .24 ? Math.min(1, age / .012) * (1 - age / .24) : 0,
    thunderAt: at + 1.2 + hash(id + 71) * 1.2, power, side: hash(id + 5) > .5 ? 1 : -1 }
}
