/**
 * Optional Pomorog content pack. `/pomorog` is its official import alias;
 * `/presets` exposes the same API for compatibility, not a separate library.
 */
export {
  pomorog,
  pomorogInterior,
  pomorogSpan,
  forestMeadowCover,
  forestFloorMaterial,
  campClearing,
  type AsciiStyle,
} from './pomorog'
export { createCampfire, POMOROG_FIRE, type HeatGridSpec } from './campfire'
export { FOREST_WATER } from './water'
export { pushFireflies, pushLanternMotes, createDustTrail } from './ambient'
export { POMOROG_EFFECTS } from '../fx/presets'
