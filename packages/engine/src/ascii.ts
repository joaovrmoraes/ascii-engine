import * as THREE from 'three'
import { illuminationGLSL, illuminationUniforms } from './illumination'
import { SURFACE_ALPHA } from './surface'

const WORLD_GLYPH_ALPHA = SURFACE_ALPHA.glyph

/**
 * Biome effects enter the screen pass through hooks, never by import.
 * `color` runs right after the cell colour is sampled, with `color` (gamma),
 * `worldPoint`, `actor`, `grain` and `sampleAtCenter` in scope.
 */
export interface AsciiPassHook {
  /** GLSL uniforms and functions, placed before main(). */
  declarations?: string
  /** GLSL statements that may change `color`. */
  color?: string
  uniforms?: Record<string, THREE.IUniform>
}

/**
 * Screen pass (Pomorog `ascii.ts`): a fixed screen grid for everything not yet
 * made of letters, and a direct path for the `glyph` (.85) materials.
 * Material-specific alphabets follow the supplied 12:31 video reference.
 */
export function createAsciiPass(hooks: AsciiPassHook[] = []) {
  const alphabets = { generic: ' .,:;-~=+*ox%#@', actor: ' .:-=+*x%#@', foliage: '.,;vcoax%#', stone: ' .:-=coO0#', wood: '.:|/\\lIvt', earth: ' .,:coO*', water: ' ._-~=~', wetgrass: ' .,;v/\\', bark: ':|/\\Il', snow: ' .,:;~+*coO', reflection: ' .,:-=+*ox%' }
  let glyphs = ''
  const ranges: Record<string, [number, number]> = {}
  for (const [key, letters] of Object.entries(alphabets)) { ranges[key] = [glyphs.length, letters.length]; glyphs += letters }
  const edgeStart = glyphs.length; glyphs += '-|/\\'
  const atlas = document.createElement('canvas')
  atlas.width = glyphs.length * 24; atlas.height = 32
  const ctx = atlas.getContext('2d')!
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, atlas.width, atlas.height)
  ctx.fillStyle = '#fff'; ctx.font = '29px "Courier New", monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  Array.from(glyphs).forEach((glyph, i) => ctx.fillText(glyph, i * 24 + 12, 17))
  const texture = new THREE.CanvasTexture(atlas)
  texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = false
  const range = (key: string) => `vec2(${ranges[key][0]}.0, ${ranges[key][1]}.0)`
  const material = new THREE.ShaderMaterial({
    depthTest: true, depthWrite: true, depthFunc: THREE.AlwaysDepth,
    uniforms: {
      ...illuminationUniforms(),
      sceneTexture: { value: null }, sceneDepth: { value: null }, glyphTexture: { value: texture },
      resolution: { value: new THREE.Vector2(1, 1) }, cellSize: { value: 6 }, brightness: { value: 1 },
      inverseProjection: { value: new THREE.Matrix4() }, cameraWorld: { value: new THREE.Matrix4() },
      contacts: { value: [new THREE.Vector4(100, 100, 0, 0), new THREE.Vector4(100, 100, 0, 0)] },
      ...Object.assign({}, ...hooks.map((hook) => hook.uniforms ?? {})),
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `
      uniform sampler2D sceneTexture, sceneDepth, glyphTexture;
      uniform vec2 resolution;
      uniform vec4 contacts[2];
      uniform float cellSize, brightness;
      uniform mat4 inverseProjection, cameraWorld;
      varying vec2 vUv;
      ${illuminationGLSL}
      ${hooks.map((hook) => hook.declarations ?? '').join('\n')}
      float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float isKind(float a, float kind) { return 1. - step(.035, abs(a - kind)); }
      float contactShade(vec3 p) {
        float shade = 0.;
        for (int i = 0; i < 2; i++) {
          vec2 d = (p.xz - contacts[i].xy) / max(contacts[i].z, .01);
          shade = max(shade, contacts[i].w * (1. - smoothstep(.25, 1., length(d * vec2(1., 1.15)))));
        }
        return shade;
      }
      void main() {
        vec4 direct = texture2D(sceneTexture, vUv);
        if (isKind(direct.a, ${WORLD_GLYPH_ALPHA.toFixed(2)}) > .5) {
          // Letters already live on the object's surface: keep them crisp and
          // only apply the shared light treatment, never the screen lattice.
          float d = texture2D(sceneDepth, vUv).r;
          vec4 w = cameraWorld * inverseProjection * vec4(vUv * 2. - 1., d * 2. - 1., 1.);
          vec3 p = w.xyz / w.w;
          vec3 ink = pow(max(direct.rgb, vec3(0.)), vec3(.4545)) * brightness;
          ink *= 1. - contactShade(p) * .6 * (1. - smoothstep(.05, .35, p.y));
          ink = illuminateInk(ink, p);
          bool sky = illuminationEnabled > .5 && discoveryEnabled < .5;
          if (sky) { float shade = dot(ink, vec3(.2126,.7152,.0722)); ink *= mix(1.16 + .12 * (1.-smoothstep(.08,.55,shade)), 1., stormFlash); }
          else if (illuminationEnabled > .5) ink *= 1.3;
          ink = ink / (vec3(1.) + ink * .42);
          gl_FragColor = vec4(max(ink, vec3(.022,.028,.032)), 1.);
          gl_FragDepth = d;
          return;
        }
        float actor = isKind(direct.a, .5);
        float size = mix(cellSize, max(4., floor(cellSize * .84 + .5)), actor);
        vec2 cell = vec2(size, floor(size * 1.2));
        vec2 pixel = vUv * resolution, grid = floor(pixel / cell);
        vec2 center = (grid + .5) * cell / resolution;
        vec4 sampleAtCenter = texture2D(sceneTexture, center);
        float stone = isKind(sampleAtCenter.a, .6), leaf = isKind(sampleAtCenter.a, .7);
        float bark = isKind(sampleAtCenter.a, .2);
        float snow = isKind(sampleAtCenter.a, .1);
        float reflection = isKind(sampleAtCenter.a, 0.);
        float wood = max(bark,isKind(sampleAtCenter.a, .4)), earth = isKind(sampleAtCenter.a, .9), water = isKind(sampleAtCenter.a, .8);
        float wetgrass = isKind(sampleAtCenter.a, .3);
        vec4 world = cameraWorld * inverseProjection * vec4(center * 2. - 1., texture2D(sceneDepth, center).r * 2. - 1., 1.);
        // Fixed screen cells avoid re-rolling every glyph while the camera moves.
        float grain = hash(vec3(grid, 17.));
        vec2 offset = cell * .2 / resolution;
        vec3 sampleColor = sampleAtCenter.rgb * .6 + .1 * (
          texture2D(sceneTexture, center + offset).rgb + texture2D(sceneTexture, center - offset).rgb
          + texture2D(sceneTexture, center + vec2(offset.x, -offset.y)).rgb + texture2D(sceneTexture, center + vec2(-offset.x, offset.y)).rgb);
        vec3 color = pow(max(sampleColor, vec3(0.)), vec3(.4545));
        vec3 worldPoint = world.xyz / world.w;
        ${hooks.map((hook) => hook.color ? `{ ${hook.color} }` : '').join('\n')}
        vec2 lamps = localLights(worldPoint);
        color += earth * (vec3(.23,.20,.12) * lamps.x + vec3(.28,.15,.05) * lamps.y);
        float light = dot(color, vec3(.2126, .7152, .0722));
        vec2 alphabet = ${range('generic')};
        float density = clamp(light * 1.35, 0., 1.);
        if (actor > .5) { alphabet = ${range('actor')}; density = clamp(light * 1.05 + .12, 0., .88); }
        else if (leaf > .5) { alphabet = ${range('foliage')}; density = clamp(.15 + light * .42 + grain * .48, .1, .95); }
        else if (stone > .5) { alphabet = ${range('stone')}; density = .22 + light * .55 + grain * .2; }
        else if (bark > .5) { alphabet = ${range('bark')}; density = .2 + grain * .79; }
        else if (wood > .5) { alphabet = ${range('wood')}; density = grain; }
        else if (earth > .5) { alphabet = ${range('earth')}; density = .1 + grain * .85; }
        else if (water > .5) { alphabet = ${range('water')}; density = .3 + grain * .65; }
        else if (wetgrass > .5) { alphabet = ${range('wetgrass')}; density = .25 + grain * .74; }
        else if (snow > .5) { alphabet = ${range('snow')}; density = .18 + light * .25 + grain * .5; }
        else if (reflection > .5) { alphabet = ${range('reflection')}; density = clamp(light * 1.5 + grain * .12, 0., .85); }
        float index = alphabet.x + floor(clamp(density, 0., .999) * alphabet.y);
        vec2 stepUv = cell * .5 / resolution;
        vec2 gradient = vec2(
          texture2D(sceneDepth, center + vec2(stepUv.x, 0.)).r - texture2D(sceneDepth, center - vec2(stepUv.x, 0.)).r,
          texture2D(sceneDepth, center + vec2(0., stepUv.y)).r - texture2D(sceneDepth, center - vec2(0., stepUv.y)).r);
        if (max(abs(gradient.x), abs(gradient.y)) > .006 && light > .12 && leaf < .5 && earth < .5) {
          float stroke = abs(gradient.x) > abs(gradient.y) * 2. ? 1. : abs(gradient.y) > abs(gradient.x) * 2. ? 0. : gradient.x * gradient.y < 0. ? 2. : 3.;
          index = ${edgeStart}.0 + stroke;
        }
        vec2 inside = fract(pixel / cell);
        float glyph = smoothstep(.14, .74, texture2D(glyphTexture, vec2((index + inside.x) / ${glyphs.length}.0, inside.y)).r);
        float gain = actor > .5 ? 1.22 : leaf > .5 ? 1.08 : earth > .5 ? .83 : 1.05;
        vec3 ink = min(color * gain * brightness, vec3(.96));
        ink = illuminateInk(ink, worldPoint);
        if (bark > .5) ink = max(ink * 1.1, vec3(.32,.27,.18));
        if (earth > .5 || wetgrass > .5) ink *= 1. - contactShade(worldPoint) * .72;
        bool openSky = illuminationEnabled > .5 && discoveryEnabled < .5;
        if (openSky) {
          // Lift outdoor midtones without bleaching their hue or strengthening
          // the font. Interiors retain their lantern/discovery contrast.
          float shade = dot(ink, vec3(.2126,.7152,.0722));
          float lift = 1.16 + .12 * (1.-smoothstep(.08,.55,shade));
          ink *= mix(lift, 1., stormFlash);
        }
        else if (illuminationEnabled > .5) ink *= 1.3;
        // Compress highlights after lighting: the lamp must not turn the font
        // into solid white pixels. Keep character size, soften ink weight.
        ink = ink / (vec3(1.) + ink * .42);
        float coverage = openSky ? smoothstep(.05, .20, light) : smoothstep(.07, .23, light);
        if (earth > .5) coverage *= step(.27, grain);
        if (leaf > .5) coverage *= .72 + grain * .28;
        if (water > .5) coverage *= .24 + .26 * step(.74, grain);
        // Reflected silhouettes need their own readable strokes, not the sparse
        // horizontal water alphabet that used to erase them. Still softer than actors.
        if (reflection > .5) coverage *= .75 + grain * .12;
        if (wetgrass > .5) coverage *= .72;
        vec3 paper = (openSky ? vec3(.030,.040,.043) : vec3(.025,.033,.038)) + vec3(.075,.10,.13) * stormFlash;
        // Quiet colour between strokes gives a continuous silhouette, while the
        // readable detail remains entirely in the regular-weight characters.
        float surfaceColor = leaf > .5 ? .20 : actor > .5 ? .14 : wetgrass > .5 ? .09 : water > .5 ? .04 : .025;
        if (openSky) surfaceColor = leaf > .5 ? .27 : actor > .5 ? .18 : bark > .5 ? .10 : wetgrass > .5 ? .135 : water > .5 ? .09 : .07;
        else if (illuminationEnabled > .5) surfaceColor = actor > .5 ? .18 : leaf > .5 ? .24 : wood > .5 ? .28 : stone > .5 ? .30 : water > .5 ? .09 : .07;
        if (reflection > .5) surfaceColor = .13;
        paper = max(paper, ink * surfaceColor);
        gl_FragColor = vec4(mix(paper, max(paper, ink), glyph * coverage), 1.);
        // Snow uses the same light strokes as the other materials. A restrained
        // blue-grey underlayer keeps the clearing bright between readable glyphs.
        if (snow > .5) gl_FragColor.rgb = mix(ink * .58, ink, glyph * coverage * .84);
        gl_FragDepth = texture2D(sceneDepth, vUv).r;
      }
    `,
  })
  const scene = new THREE.Scene(), geometry = new THREE.PlaneGeometry(2, 2)
  scene.add(new THREE.Mesh(geometry, material))
  return { scene, material, camera: new THREE.Camera(), dispose() { texture.dispose(); geometry.dispose(); material.dispose(); } }
}
