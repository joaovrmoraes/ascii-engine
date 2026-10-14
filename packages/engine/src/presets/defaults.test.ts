import { describe, expect, it } from 'vitest'
import { DEFAULT_HEAT_GRID } from '../fx/heat'
import { DEFAULT_WATER_LOOK } from '../techniques/water'
import { POMOROG_FIRE } from './campfire'
import { FOREST_WATER } from './water'

describe('optional preset ownership', () => {
  it('keeps core heat defaults intact when the fire preset is edited', () => {
    const defaults = structuredClone(DEFAULT_HEAT_GRID)
    const original = structuredClone(POMOROG_FIRE)
    expect(POMOROG_FIRE).toEqual(defaults)

    try {
      POMOROG_FIRE.cell[0] = .9
      POMOROG_FIRE.ramp[0][0] = '!'
      POMOROG_FIRE.ramp[0][1][0] = .1
      POMOROG_FIRE.smoke.color[0] = .8
      POMOROG_FIRE.light.intensity = 99
      expect(DEFAULT_HEAT_GRID).toEqual(defaults)
    } finally {
      Object.assign(POMOROG_FIRE, original)
    }
  })

  it('keeps core water defaults intact when the forest preset is edited', () => {
    const defaults = structuredClone(DEFAULT_WATER_LOOK)
    const original = structuredClone(FOREST_WATER)
    expect(FOREST_WATER).toEqual(defaults)

    try {
      FOREST_WATER.cell[0] = .9
      FOREST_WATER.open[0] = .8
      FOREST_WATER.reflection.enabled = false
      FOREST_WATER.reflection.tint[0] = .1
      expect(DEFAULT_WATER_LOOK).toEqual(defaults)
    } finally {
      Object.assign(FOREST_WATER, original)
    }
  })
})
