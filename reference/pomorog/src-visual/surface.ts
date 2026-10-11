import * as THREE from 'three'

export type AsciiSurface = 'reflection' | 'snow' | 'bark' | 'wetgrass' | 'wood' | 'actor' | 'stone' | 'foliage' | 'water' | 'earth' | 'glyph'
export const SURFACE_ALPHA: Record<AsciiSurface, number> = { reflection: 0, snow: .1, bark: .2, wetgrass: .3, wood: .4, actor: .5, stone: .6, foliage: .7, water: .8, earth: .9, glyph: .85 }

/** A material ID in the offscreen alpha chooses an alphabet, never transparency. */
export function tagSurface<T extends THREE.Material>(material: T, kind: AsciiSurface): T {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>\ngl_FragColor.a = ${SURFACE_ALPHA[kind].toFixed(2)};`)
  }
  material.customProgramCacheKey = () => `ascii-surface-${kind}`
  material.userData.asciiSurface = kind
  material.needsUpdate = true
  return material
}
