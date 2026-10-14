import { DEFAULT_WATER_LOOK, type WaterLook } from '../techniques/water'

/** Forest appearance retains established numbers without sharing mutable core defaults. */
export const FOREST_WATER: WaterLook = structuredClone(DEFAULT_WATER_LOOK)
