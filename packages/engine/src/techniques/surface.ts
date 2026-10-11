import * as THREE from 'three'
import { SURFACE_ALPHA, type SurfaceKind } from '../surface'

/**
 * Technique `surface` (Pomorog `worldGlyph.ts`).
 * Characters drawn on the objects themselves, not by a screen-aligned grid:
 * each material projects a glyph lattice onto its own surface (in its local
 * frame, at world scale), so letters stay on the limb, trunk or stone as it
 * moves, turns and recedes — like the 18:03 boss-fight reference.
 */
export const SURFACE_ALPHABETS: Record<string, string> = {
  actor: ' .:-=+*x%#@', foliage: ' .,:;vcoa%#', stone: ' .:-=coO0#', wood: '.:-=|/\\lt', bark: ':|/\\Il|',
  earth: ' .,,:;;co', water: ' .-_~=~-', crest: ' .,:*+oO', generic: ' .,:;-~=+*ox%#', snow: ' .,:;~+*coO', wetgrass: ' .,;v/\\',
}
const KINDS = Object.keys(SURFACE_ALPHABETS)
let glyphs = ''
export const SURFACE_RANGES: Record<string, [number, number]> = {}
for (const kind of KINDS) { SURFACE_RANGES[kind] = [glyphs.length, SURFACE_ALPHABETS[kind].length]; glyphs += SURFACE_ALPHABETS[kind] }

/** Cell size in metres: actors carry finer letters to keep face, arms and legs. */
export const SURFACE_CELL: Record<string, number> = { actor: .12, foliage: .2, stone: .18, wood: .17, bark: .17, earth: .17, generic: .18, snow: .13, wetgrass: .17 }
/** Ink strength over the lit colour, and the quiet colour kept between strokes. */
export const SURFACE_INK: Record<string, [number, number]> = {
  // [letter strength, gap]. The gap is linear: .012 of the lit colour is near black.
  actor: [2.4, .015], foliage: [2.0, .012], stone: [2.2, .012], wood: [2.3, .012], bark: [2.3, .012], earth: [1.8, .01], generic: [2.2, .012], snow: [1.2, .4], wetgrass: [2.1, .01],
}
export const WORLD_GLYPH_ALPHA = SURFACE_ALPHA.glyph

let atlas: THREE.CanvasTexture | null = null
/** Shared atlas (also used by the water letters, phase 2). */
export function surfaceAtlas() {
  if (atlas) return atlas
  // Padded 64 px slots and mipmaps keep 6–8 px letters clean when minified.
  const canvas = document.createElement('canvas')
  const per = 48
  canvas.width = glyphs.length * per; canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'; ctx.font = '46px "Courier New", monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  Array.from(glyphs).forEach((g, i) => ctx.fillText(g, i * per + per / 2, 34))
  atlas = new THREE.CanvasTexture(canvas)
  atlas.generateMipmaps = true; atlas.minFilter = THREE.LinearMipmapLinearFilter; atlas.magFilter = THREE.LinearFilter
  atlas.anisotropy = 4
  atlas.userData.slot = per / canvas.width
  return atlas
}

function kindOf(material: THREE.Material, fallback: string) {
  const surface = material.userData.asciiSurface as SurfaceKind | undefined
  // Only kinds with a cell size have a surface lattice (water/crest are water letters).
  return surface && surface in SURFACE_CELL ? surface : fallback
}

/** Rewrites one standard material so its fragments are letters on its own surface. */
export function surfaceMaterial(material: THREE.MeshStandardMaterial, fallback = 'generic') {
  if (material.userData.worldGlyph) return material
  const kind = kindOf(material, fallback)
  const [start, count] = SURFACE_RANGES[kind], [gain, paper] = SURFACE_INK[kind]
  const texture = surfaceAtlas()
  material.userData.worldGlyph = kind
  // Keep earlier injections (snow cover, footprints), drop only their ID alpha.
  const previous = material.onBeforeCompile
  material.onBeforeCompile = (shader, renderer) => {
    previous.call(material, shader, renderer)
    shader.fragmentShader = shader.fragmentShader.replace(/\ngl_FragColor\.a = [0-9.]+;/g, '')
    shader.uniforms.glyphAtlas = { value: texture }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlyphPos; varying vec3 vGlyphNormal;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 glyphScale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
        vec3 glyphOffset = vec3(0.);
        #ifdef USE_INSTANCING
          glyphScale *= vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          glyphOffset = instanceMatrix[3].xyz * 1.37;
        #endif
        vGlyphPos = transformed * glyphScale + glyphOffset;
        vGlyphNormal = objectNormal / max(glyphScale, vec3(.001));`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D glyphAtlas;
        varying vec3 vGlyphPos; varying vec3 vGlyphNormal;
        float glyphHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        {
          // Project the lattice on the face's dominant axis, letters upright on walls.
          vec3 n = abs(normalize(vGlyphNormal));
          vec2 plane = n.y > max(n.x, n.z) ? vGlyphPos.xz : n.x > n.z ? vGlyphPos.zy : vGlyphPos.xy;
          vec2 cell = vec2(${SURFACE_CELL[kind].toFixed(3)}, ${(SURFACE_CELL[kind] * 1.25).toFixed(3)});
          vec2 grid = floor(plane / cell), inside = fract(plane / cell);
          float face = n.y > max(n.x, n.z) ? 1. : n.x > n.z ? 2. : 3.;
          float grain = glyphHash(vec3(grid, face));
          // Roll off hot lantern light first, then read the cell's value.
          vec3 lit = max(gl_FragColor.rgb, vec3(0.));
          lit = lit / (vec3(1.) + lit * .9);
          float tone = dot(pow(lit, vec3(.4545)), vec3(.2126, .7152, .0722));
          // An ASCII object, not a textured solid: shading is the choice of
          // letter (sparse . : to dense # @) in a few steps, the gap between
          // letters is near black, and each letter carries one flat colour.
          float steps = 6.;
          ${kind === 'snow'
            // Bright snow would saturate to the densest letter everywhere: let the
            // cell's grain pick sparse flakes, shade (and boot marks) thin them out.
            ? 'float level = clamp(.18 + tone * .25 + grain * .5, 0., .999);'
            : 'float level = clamp(floor(tone * 1.5 * steps + grain * .85) / steps, 0., .999);'}
          float index = ${start}.0 + floor(level * ${count}.0);
          float slot = ${texture.userData.slot.toFixed(6)};
          float ink = texture2D(glyphAtlas, vec2((index + .08 + inside.x * .84) * slot, .06 + inside.y * .88)).r;
          ink = smoothstep(.1, .45, ink)${kind === 'snow' ? ' * .84' : ''};
          vec3 hue = lit / max(dot(lit, vec3(.2126, .7152, .0722)), .002);
          vec3 letter = ${kind === 'snow' ? `lit * ${gain.toFixed(3)}` : `hue * pow(.18 + level * .82, 2.2) * ${gain.toFixed(3)} * .5`};
          gl_FragColor.rgb = mix(lit * ${paper.toFixed(3)}, letter, ink);
          gl_FragColor.a = ${WORLD_GLYPH_ALPHA.toFixed(2)};
        }`)
  }
  const previousKey = material.customProgramCacheKey.call(material)
  material.customProgramCacheKey = () => `world-glyph-${kind}-${previousKey}`
  material.needsUpdate = true
  return material
}

