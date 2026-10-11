import * as THREE from 'three'
import { SURFACE_ALPHA, type AsciiSurface } from './surface'
import { glyphBody } from './glyphBody'

/**
 * Characters drawn on the objects themselves, not by a screen-aligned grid:
 * each material projects a glyph lattice onto its own surface (in its local
 * frame, at world scale), so letters stay on the limb, trunk or stone as it
 * moves, turns and recedes — like the 18:03 boss-fight reference.
 */
const ALPHABETS: Record<string, string> = {
  actor: ' .:-=+*x%#@', foliage: ' .,:;vcoa%#', stone: ' .:-=coO0#', wood: '.:-=|/\\lt', bark: ':|/\\Il|',
  earth: ' .,,:;;co', water: ' .-_~=~-', crest: ' .,:*+oO', generic: ' .,:;-~=+*ox%#', snow: ' .,:;~+*coO', wetgrass: ' .,;v/\\',
}
const KINDS = Object.keys(ALPHABETS)
let glyphs = ''
const RANGES: Record<string, [number, number]> = {}
for (const kind of KINDS) { RANGES[kind] = [glyphs.length, ALPHABETS[kind].length]; glyphs += ALPHABETS[kind] }

/** Cell size in metres: actors carry finer letters to keep face, arms and legs. */
const CELL: Record<string, number> = { actor: .12, foliage: .2, stone: .18, wood: .17, bark: .17, earth: .17, generic: .18, snow: .13, wetgrass: .17 }
/** Ink strength over the lit colour, and the quiet colour kept between strokes. */
const INK: Record<string, [number, number]> = {
  // [letter strength, gap]. The gap is linear: .012 of the lit colour is near black.
  actor: [2.4, .015], foliage: [2.0, .012], stone: [2.2, .012], wood: [2.3, .012], bark: [2.3, .012], earth: [1.8, .01], generic: [2.2, .012], snow: [1.2, .4], wetgrass: [2.1, .01],
}
export const WORLD_GLYPH_ALPHA = SURFACE_ALPHA.glyph

let atlas: THREE.CanvasTexture | null = null
function glyphAtlas() {
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

/**
 * Letters for water surfaces (ShaderMaterials): rows of ~ - = that drift with
 * the current, bright crests where waves break, and the mirrored world
 * (already made of letters) cut into rippling horizontal bands.
 */
export function worldWaterUniforms() { return { glyphAtlas: { value: glyphAtlas() } } }
export function worldWaterGLSL() {
  const texture = glyphAtlas(), slot = texture.userData.slot.toFixed(6)
  const [ws, wc] = RANGES.water, [cs, cc] = RANGES.crest, [rs, rc] = RANGES.actor, [gs, gc] = RANGES.wetgrass
  return `
    uniform sampler2D glyphAtlas;
    uniform mat4 reflectionMatrix;
    float waterHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float waterGlyph(float index, vec2 inside) {
      return smoothstep(.1, .45, texture2D(glyphAtlas, vec2((index + .08 + inside.x * .84) * ${slot}, .06 + inside.y * .88)).r);
    }
    // Pure ASCII water: every cell is one letter of one flat colour on a dark
    // gap. The mirror is sampled once per cell (at its centre) and turned into
    // a letter, so reflections are characters, never a continuous image.
    vec3 waterLetters(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed) {
      vec2 cell = vec2(.15, .19);
      vec2 plane = p.xz - flow * time;
      vec2 grid = floor(plane / cell), inside = fract(plane / cell);
      float grain = waterHash(grid);
      vec3 centre = vec3((grid + .5) * cell + flow * time, p.y).xzy;
      centre.x += sin(grid.y * .7 + time * 1.2) * .05;
      vec4 mirror = reflectionMatrix * vec4(centre, 1.);
      vec2 uv = mirror.xy / mirror.w;
      // The mirror trembles row by row, like a reflection on moving water.
      uv.x += sin(grid.y * 1.3 + time * 2.1) * .006 + sin(grid.y * .41 - time * .9) * .004;
      vec4 seen = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
      float object = (1. - step(.96, seen.a)) * step(.0, min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y)));
      vec3 shown = pow(max(seen.rgb, vec3(0.)), vec3(.4545));
      float lum = dot(shown, vec3(.2126, .7152, .0722));
      vec3 gap = vec3(0.);
      // Reflection: drop every third row so it reads as a broken mirror on water.
      float row = step(.26, fract(grid.y / 4.));
      if (object > .5 && lum > .05 && row > .5) {
        float level = clamp(lum * 1.4, 0., .999);
        vec3 hue = shown / max(lum, .01);
        vec3 ink = pow(hue * (.3 + level * .65), vec3(2.2)) * vec3(.85, .97, 1.1);
        return mix(gap, ink, waterGlyph(${rs}.0 + 1. + floor(level * ${rc - 1}.0), inside));
      }
      // Foam letters where waves break or boots disturb the surface.
      if (crest > .12 && grain < crest * 1.4) {
        float level = clamp(crest * 1.5 + grain * .3, 0., .999);
        return mix(gap, vec3(.32, .52, .62) * (.4 + crest), waterGlyph(${cs}.0 + 1. + floor(level * ${cc - 1}.0), inside));
      }
      // Submerged weed as sparse green strokes.
      if (vegetation > .3 && grain > .55) {
        return mix(gap, weed, waterGlyph(${gs}.0 + 1. + floor(grain * ${gc - 1}.0), inside) * .8);
      }
      // Open water: sparse rows of ~ - = drifting with the current.
      float swell = .5 + .5 * sin(grid.y * .9 + grid.x * .15 - time * 1.4 + grain * 2.);
      if (grain < .22 + swell * .22) return gap;
      float level = clamp(swell * .75 + grain * .3, 0., .999);
      // Moon sheen drifts across the surface in slow bands.
      float sheen = pow(.5 + .5 * sin(grid.x * .23 - grid.y * .31 + time * .5), 6.);
      vec3 ink = vec3(.07, .17, .22) * (.6 + level * 1.2) + vec3(.12, .16, .18) * sheen;
      return mix(gap, ink, waterGlyph(${ws}.0 + 1. + floor(level * ${wc - 1}.0), inside));
    }`
}

function kindOf(material: THREE.Material, fallback: string) {
  const surface = material.userData.asciiSurface as AsciiSurface | undefined
  return surface && surface in ALPHABETS ? surface : fallback
}

/** Rewrites one standard material so its fragments are letters on its own surface. */
export function glyphMaterial(material: THREE.MeshStandardMaterial, fallback = 'generic') {
  if (material.userData.worldGlyph) return material
  const kind = kindOf(material, fallback)
  const [start, count] = RANGES[kind], [gain, paper] = INK[kind]
  const texture = glyphAtlas()
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
          vec2 cell = vec2(${CELL[kind].toFixed(3)}, ${(CELL[kind] * 1.25).toFixed(3)});
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

/**
 * Converts the standard materials below a root (ground, bridge, ruins, props).
 * Leaf crowns stay on the screen pass: on round clusters, surface letters read
 * as a ball filled with text instead of a tree made of letters.
 */
export function applyWorldGlyphs(root: THREE.Object3D, fallback = 'generic') {
  const bodies: THREE.Mesh[] = [], flats: THREE.Mesh[] = []
  root.updateMatrixWorld(true)
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object.userData.glyphDone || object instanceof THREE.Points) return
    const m = object.material
    if (!(m instanceof THREE.MeshStandardMaterial)) return
    const g = object.geometry, kind = m.userData.asciiSurface
    // Crowns, snow caps and large faceted rocks become clouds of letters bound
    // to the object (a surface lattice on round forms reads as a filled ball).
    const faceted = g instanceof THREE.DodecahedronGeometry || g instanceof THREE.IcosahedronGeometry || g instanceof THREE.OctahedronGeometry
    const solid = !(object instanceof THREE.InstancedMesh)
    // Every faceted rock, pebble or crystal becomes letters (a pebble is one or two characters).
    if (kind === 'foliage' || (kind === 'snow' && !m.userData.glyphGround) || (faceted && solid)) bodies.push(object)
    else flats.push(object)
  })
  for (const mesh of bodies) glyphBody(mesh, .19, 'stone')
  for (const mesh of flats) glyphMaterial(mesh.material as THREE.MeshStandardMaterial, fallback)
}

