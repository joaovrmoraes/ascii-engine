import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { SURFACE_ALPHA, SURFACE_TOLERANCE, surfaceAlpha, tagSurface, type SurfaceKind } from './surface'

const kinds = Object.keys(SURFACE_ALPHA) as SurfaceKind[]
/** What the 8-bit offscreen target stores and the screen pass reads back. */
const stored = (literal: string) => Math.round(Number(literal) * 255) / 255
const matches = (alpha: number, id: number) => Math.abs(alpha - id) < SURFACE_TOLERANCE

describe('surface IDs', () => {
  it('writes every ID with two decimals', () => {
    for (const kind of kinds) expect(surfaceAlpha(kind)).toMatch(/^\d\.\d\d$/)
    expect(surfaceAlpha('glyph')).toBe('0.85')
  })

  it('survives the 8-bit alpha and matches only its own ID', () => {
    for (const kind of kinds) {
      const alpha = stored(surfaceAlpha(kind))
      const hits = kinds.filter((other) => matches(alpha, SURFACE_ALPHA[other]))
      expect(hits).toEqual([kind])
    }
  })

  it('keeps IDs at least .05 apart', () => {
    const values = kinds.map((k) => SURFACE_ALPHA[k]).sort((a, b) => a - b)
    for (let i = 1; i < values.length; i++) expect(values[i] - values[i - 1]).toBeGreaterThanOrEqual(.05 - 1e-9)
  })

  it('injects the alpha after lighting and keys the program by kind', () => {
    const material = tagSurface(new THREE.MeshStandardMaterial(), 'stone')
    const shader = { fragmentShader: 'x\n#include <dithering_fragment>\ny', vertexShader: '', uniforms: {} }
    material.onBeforeCompile(shader as unknown as THREE.WebGLProgramParametersWithUniforms, {} as THREE.WebGLRenderer)
    expect(shader.fragmentShader).toContain('gl_FragColor.a = 0.60;')
    expect(material.customProgramCacheKey()).toBe('ascii-surface-stone')
    expect(material.userData.asciiSurface).toBe('stone')
  })
})
