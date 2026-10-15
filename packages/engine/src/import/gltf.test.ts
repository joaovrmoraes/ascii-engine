import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { applyDefaultGlyphs, defaultGlyphStyle, normalizeGlyphData } from './gltf'

describe('gltf glyph data', () => {
  it('reads Blender custom properties', () => {
    const data = normalizeGlyphData({ glyph: 'Body', glyph_surface: 'foliage', glyph_size: '0.24' })
    expect(data).toMatchObject({ glyph: 'body', glyphStyle: { surface: 'foliage', size: 0.24 } })
    expect(normalizeGlyphData({ glyphStyle: '{"surface":"bark"}' }).glyphStyle).toEqual({
      surface: 'bark',
    })
    expect(normalizeGlyphData({ glyph: 'nonsense' }).glyph).toBeUndefined()
  })

  it('defaults by names and geometry, never by colour', () => {
    const leaves = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: 0xff0000 }),
    )
    leaves.name = 'Crown'
    expect(defaultGlyphStyle(leaves)).toEqual({ glyph: 'body', surface: 'foliage', size: 0.19 })
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
    )
    crate.name = 'crate'
    expect(defaultGlyphStyle(crate)).toEqual({ glyph: 'surface', surface: 'wood' })
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(), new THREE.MeshStandardMaterial())
    expect(defaultGlyphStyle(rock).glyph).toBe('body')
  })

  it('keeps declared nodes and marks the rest', () => {
    const root = new THREE.Group()
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(), new THREE.MeshStandardMaterial())
    trunk.name = 'tronco'
    const declared = new THREE.Group()
    declared.userData.glyph = 'screen'
    const hero = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
    declared.add(hero)
    root.add(trunk, declared)
    applyDefaultGlyphs(root)
    expect(trunk.userData.glyph).toBe('surface')
    expect(trunk.userData.glyphStyle).toEqual({ surface: 'bark' })
    expect(hero.userData.glyph).toBeUndefined()
  })
})
