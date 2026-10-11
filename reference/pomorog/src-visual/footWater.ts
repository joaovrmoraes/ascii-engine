import { swampSurface } from './swamp'

export interface WaterFootPose {
  position: { x: number; y: number; z: number }
  step: number
  grounded: boolean
}

/** Follow the animated boots, including the advancing foot during a turn. */
export function createFootWaterContacts() {
  const previous: { x: number; z: number; step: number; heading: number; drag: number }[] = []
  return {
    sample(feet: readonly WaterFootPose[], level: number, dt: number, active: boolean, travelled: number) {
      return feet.map((foot, index) => {
        const { x, y, z } = foot.position, last = previous[index]
        const dx = last ? x - last.x : 0, dz = last ? z - last.z : 0
        const distance = Math.hypot(dx, dz)
        const speed = active && dt > 0 && distance < .5 ? Math.min(4, distance / dt) : 0
        const wet = y - .065 < level && swampSurface(x, z, level) === 'water'
        const landed = !!last && active && travelled > 0 && wet && foot.step > last.step
        const heading = !active && last ? last.heading : Math.atan2(dx, dz)
        const drag = !active && last ? last.drag : wet && !foot.grounded && travelled > 0 ? Math.min(1, speed / 1.6) : 0
        previous[index] = { x, z, step: foot.step, heading, drag }
        // In the rain every step on soaked ground also leaves a small ring.
        const puddle = !!last && active && travelled > 0 && !wet && foot.step > last.step && swampSurface(x, z, level) !== 'wood'
        return { x, z, wet, landed, heading, drag, puddle }
      })
    },
  }
}
