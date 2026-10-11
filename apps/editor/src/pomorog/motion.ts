/** Frame-rate independent motion shared by the actors, camera and feedback. */
export const IMPACT_DELAY = .2
export const FIRE_TRAVEL_TIME = .22
export const feedbackImpactDelay = (spell?: string) => IMPACT_DELAY + (spell === 'fire' ? FIRE_TRAVEL_TIME : 0)
export const damp = (value: number, target: number, rate: number, dt: number) => value + (target - value) * (1 - Math.exp(-rate * dt))
export const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t) }
export function turn(value: number, target: number, rate: number, dt: number) {
  return value + Math.atan2(Math.sin(target - value), Math.cos(target - value)) * (1 - Math.exp(-rate * dt))
}
export function attackPose(age: number) {
  if (age < 0 || age > .76) return { windup: 0, swing: 0, recoil: 0 }
  const windup = smooth(age / .14) * (1 - smooth((age - .14) / .1))
  const swing = smooth((age - .14) / .09) * (1 - smooth((age - .3) / .46))
  const recoil = Math.sin(Math.max(0, Math.min(1, (age - .23) / .45)) * Math.PI)
  return { windup, swing, recoil }
}
export const hurtPose = (age: number) => age < 0 ? 0 : Math.exp(-age * 9) * Math.sin(Math.min(1, age / .075) * Math.PI / 2)

export interface ActorMotion {
  time: number
  dt: number
  speed: number
  distance: number
  attackAge: number
  hurtAge: number
  sitting?: number
  looting?: boolean
  casting?: boolean
  death?: number
  wading?: boolean
}

/** Stance stays on the ground, swing lifts the foot; stride follows metres travelled. */
export function footstep(phase: number, stride: number) {
  const p = ((phase % 1) + 1) % 1
  if (p < .6) return { z: stride * (.5 - p / .6), lift: 0 }
  const swing = (p - .6) / .4
  return { z: stride * (-.5 + smooth(swing)), lift: Math.sin(Math.PI * swing) ** 2 * .17 }
}
