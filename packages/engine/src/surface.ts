import * as THREE from 'three'

/**
 * Material IDs written to the offscreen alpha (Pomorog `surface.ts`). The alpha
 * chooses an alphabet in the screen pass, never transparency.
 */
export type SurfaceKind =
  | 'reflection'
  | 'snow'
  | 'bark'
  | 'wetgrass'
  | 'wood'
  | 'actor'
  | 'stone'
  | 'foliage'
  | 'water'
  | 'earth'
  | 'glyph'

export const SURFACE_ALPHA: Record<SurfaceKind, number> = {
  reflection: 0,
  snow: 0.1,
  bark: 0.2,
  wetgrass: 0.3,
  wood: 0.4,
  actor: 0.5,
  stone: 0.6,
  foliage: 0.7,
  water: 0.8,
  earth: 0.9,
  glyph: 0.85,
}

/** Tolerance used by the screen pass when comparing an alpha to an ID. */
export const SURFACE_TOLERANCE = 0.035

/** GLSL literal for an ID, always with two decimals (`toFixed(1)` once turned .85 into .9). */
export function surfaceAlpha(kind: SurfaceKind) {
  return SURFACE_ALPHA[kind].toFixed(2)
}

/** Writes the material ID into `gl_FragColor.a` after lighting. */
export function tagSurface<T extends THREE.Material>(material: T, kind: SurfaceKind): T {
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>\ngl_FragColor.a = ${surfaceAlpha(kind)};`,
    )
  }
  material.customProgramCacheKey = () => `ascii-surface-${kind}`
  material.userData.asciiSurface = kind
  material.needsUpdate = true
  return material
}
