import * as THREE from 'three'
import { surfaceAlpha, createWaterReflection, type GlyphCloud } from '@ascii-engine/core/techniques'
import { createRippleField } from '@ascii-engine/core/world'

/**
 * "Old marsh" water preset (§3.2), the approved Pomorog swamp
 * (`swampEnvironment.ts` pool + `swampWater.ts` + `swampHydrology.ts` +
 * `footWater.ts`). The pool stays in the screen pass on purpose (user's
 * choice): it writes the legacy IDs water (.8), submerged grass (.3) and
 * reflection (0). Around it: wave dashes, damped ripples, ASCII rings
 * (`- _ | / \` by screen tangent) for steps, rain and bodies, splashes and
 * rain beading on shoulders.
 */
export interface MarshIsland { x: number; z: number; rx: number; rz: number }
export type MarshSurface = 'water' | 'wood' | 'grass'

export interface MarshWaterOptions {
  islands: readonly MarshIsland[]
  /** Resting water level (Pomorog .18); `update` takes the current one. */
  baseLevel?: number
  /** Dry planks (boardwalk) that never show rings. */
  isWood?: (x: number, z: number) => boolean
  /** Pool and ripple field side (m). */
  extent?: number
}

const fract = (value: number) => value - Math.floor(value)
const hash = (value: number) => fract(Math.sin(value * 127.1 + 311.7) * 43758.5453)
type Ripple = { x: number; z: number; at: number; strength: number; rain?: boolean; displaced?: boolean; footHeading?: number }

/** Legacy planar reflection mixed into the water colour (screen-pass water). */
export const legacyReflectionGLSL = `
  uniform sampler2D reflection;
  varying vec4 mirrorUv;
  vec4 reflectedWater(vec3 p, float time, vec3 disturbance, float vegetation) {
    vec2 uv = mirrorUv.xy / mirrorUv.w;
    // Gentle horizontal shear retains the silhouette; boot/rain waves bend it locally.
    uv += vec2(sin(p.z * 10. + time * 1.3) * .0014 + disturbance.g * .035,
      sin(p.x * 6. - time * .65) * .0007 + disturbance.b * .018);
    float border = min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y));
    float valid = smoothstep(0., .015, border);
    vec4 reflected = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
    // The opaque background has alpha 1; tagged geometry carries its material ID.
    float object = 1. - step(.96, reflected.a);
    float bands = .68 + .32 * smoothstep(-.55, .65, sin(p.z * 17. + p.x * .6 - time * 1.1));
    float weight = .56 * valid * object * bands * (1. - clamp(vegetation, 0., 1.) * .42);
    return vec4(reflected.rgb * vec3(.82, .92, .98), weight);
  }
`

/** GLSL `float marshShore(vec2 p)`: elliptic distance to the nearest island (1 = its bank). */
export function marshShoreGLSL(islands: readonly MarshIsland[]) {
  return `float marshShore(vec2 p) {
    float shore=10.;
    ${islands.map((i) => `shore=min(shore,length((p-vec2(${i.x.toFixed(2)},${i.z.toFixed(2)}))/vec2(${i.rx.toFixed(3)},${i.rz.toFixed(3)})));`).join('\n')}
    return shore;
  }`
}

export interface FootPose { position: { x: number; y: number; z: number }; step: number; grounded: boolean }
export interface MarshFrame {
  hero: THREE.Vector3; heading: number; travelled: number; active: boolean; dt: number
  feet?: readonly FootPose[]
  foe?: THREE.Vector3; foeTravelled?: number; foeHeight?: number; foeDead?: boolean
  /** A hit: new id → splash ring on the struck body. */
  hit?: { id: string; target: 'hero' | 'foe' }
  /** Deterministic rain drops: a ring where a streak reaches the surface. */
  rain?: { count: number; drop(index: number, time: number): { phase: number; x: number; z: number; impactX: number; impactZ: number } }
}

export function createMarshWater(cloud: GlyphCloud, options: MarshWaterOptions) {
  const islands = options.islands, baseLevel = options.baseLevel ?? .18, extent = options.extent ?? 24
  const isWood = options.isWood ?? (() => false)
  let level = baseLevel
  const shore = (x: number, z: number) => Math.min(...islands.map((i) => Math.hypot((x - i.x) / i.rx, (z - i.z) / i.rz)))
  /** 0 on the islands, 1 in open water; the bank rises with the flood. */
  const wetness = (x: number, z: number, at = level) => {
    const bank = 1 - Math.max(0, at - baseLevel) * 1.35
    return Math.max(0, Math.min(1, (shore(x, z) - bank + .06) / .14))
  }
  const surface = (x: number, z: number, at = level): MarshSurface => isWood(x, z) ? 'wood' : wetness(x, z, at) > .5 ? 'water' : 'grass'
  const shoreGLSL = marshShoreGLSL(islands)

  // Damped shallow-water waves, sampled by the pool as crest and disturbance.
  const field = createRippleField(112, extent), pixels = new Uint8Array(field.size * field.size * 4)
  const waves = new THREE.DataTexture(pixels, field.size, field.size, THREE.RGBAFormat)
  waves.minFilter = waves.magFilter = THREE.LinearFilter; waves.generateMipmaps = false
  let lastShore = -1

  const uniforms = {
    time: { value: 0 }, level: { value: baseLevel }, waves: { value: waves as THREE.Texture },
    reflection: { value: null as THREE.Texture | null }, reflectionMatrix: { value: new THREE.Matrix4() },
  }
  // The pool is an actual depth-writing surface: boots disappear below its level.
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec3 p; varying vec4 mirrorUv; uniform mat4 reflectionMatrix; void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;mirrorUv=reflectionMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: `varying vec3 p; uniform float time, level; uniform sampler2D waves;
      ${shoreGLSL}
      ${legacyReflectionGLSL}
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
      void main(){
        float shore=marshShore(p.xz), bank=1.-(level-${baseLevel.toFixed(3)})*1.35;
        if(shore<bank)discard;
        vec3 disturbance=texture2D(waves,p.xz/${extent.toFixed(1)}+.5).rgb-vec3(.502);
        float ripple=sin(p.z*5.+p.x*.8+time*.8)*sin(p.x*3.-time*.5);
        float shine=pow(max(0.,sin(p.z*3.+p.x*.45+time*.45)),18.);
        float crest=clamp(dot(disturbance.gb,vec2(-1.2,1.6))+abs(disturbance.r)*.45,0.,.6);
        float shoreFoam=(1.-smoothstep(0.,.065,shore-bank))*(.6+.4*sin(p.x*8.+p.z*6.-time*1.5));
        vec3 ink=vec3(.006,.029,.025)+vec3(.002,.007,.006)*ripple+vec3(.015,.033,.030)*shine;
        ink+=vec3(.16,.29,.38)*crest+vec3(.035,.06,.075)*shoreFoam;
        // Algae and flattened grass remain visible through shallow water, in
        // broad irregular patches separated by open, blue-grey channels.
        vec2 bed=p.xz+vec2(sin(p.z*4.+time*.7),cos(p.x*3.-time*.6))*.025;
        float meadow=noise(bed*.65)*.7+noise(bed*1.8)*.3;
        float grass=smoothstep(.49,.69,meadow)+(1.-smoothstep(bank,bank+.28,shore))*.26;
        float blade=step(.3,noise(bed*8.));
        vec3 sod=mix(vec3(.025,.070,.009),vec3(.063,.145,.018),noise(bed*3.));
        ink=mix(ink,sod+vec3(.009,.016,.018)*shine+vec3(.13,.24,.3)*crest,clamp(grass*.85,0.,.85));
        vec4 reflected=reflectedWater(p,time,disturbance,grass);
        ink=mix(ink,reflected.rgb,reflected.a);
        float signal=dot(reflected.rgb,vec3(.2126,.7152,.0722))*reflected.a;
        gl_FragColor=vec4(ink,signal>.009?${surfaceAlpha('reflection')}:grass*blade>.55?${surfaceAlpha('wetgrass')}:${surfaceAlpha('water')});
      }`,
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), material)
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = baseLevel
  mesh.userData.glyph = 'screen'
  const reflection = createWaterReflection(mesh, uniforms)

  // Wave dashes on open water.
  const points: { x: number; z: number; seed: number }[] = []
  for (let z = -12; z < 12; z += .38) for (let x = -11; x < 11; x += .38) {
    if (wetness(x, z, baseLevel + .13) > .5) points.push({ x, z, seed: hash(x * 12 + z * 53) })
  }
  const ripples: Ripple[] = []
  let phases = new Float32Array(0)
  const previousFeet: { x: number; z: number; step: number; heading: number; drag: number }[] = []
  let foeGait = 0, previousHit: string | undefined, nextBodyWake = 0, nextFoeStep = 0
  const push = (x: number, z: number, time: number, strength: number, rain = false, footHeading?: number) => {
    if (surface(x, z) !== 'water') return
    ripples.push({ x, z, at: time, strength, rain, footHeading })
  }
  function footWave(x: number, z: number, heading: number, radius: number, alpha: number, bow = false) {
    for (let i = 0; i < 13; i++) {
      if (!bow && (i === 3 || i === 9)) continue
      const angle = bow ? (i / 12 - .5) * Math.PI * 1.25 : i / 13 * Math.PI * 2
      const across = Math.sin(angle) * radius * .8, forward = Math.cos(angle) * radius
      const px = x + Math.cos(heading) * across + Math.sin(heading) * forward
      const pz = z - Math.sin(heading) * across + Math.cos(heading) * forward
      if (surface(px, pz) !== 'water') continue
      cloud.push(px, level + .028, pz, .11, i % 3 ? '~' : '-', [.46, .62, .68], alpha)
    }
  }
  // Screen-space axes: each ring is an ASCII circle whose letter follows its
  // tangent on screen — _ and - across, | on the sides, / and \ diagonally.
  const screenRight = new THREE.Vector3(1, 0, 0), screenDepth = new THREE.Vector3(0, 0, -1)
  function ring(x: number, z: number, radius: number, alpha: number, bright: number, seed: number, rain = false) {
    const count = Math.max(rain ? 8 : 14, Math.ceil(radius * (rain ? 26 : 22)))
    for (let i = 0; i < count; i++) {
      if (!rain && hash(i + seed * 7) < .1) continue
      const angle = i / count * Math.PI * 2
      const ox = Math.cos(angle), oz = Math.sin(angle)
      const px = x + ox * radius, pz = z + oz * radius
      // Wet banks show the rings too; only dry boardwalk planks stay clean.
      const kind = surface(px, pz)
      if (kind === 'wood') continue
      const sx = ox * screenRight.x + oz * screenRight.z, sy = ox * screenDepth.x + oz * screenDepth.z
      const glyph = Math.abs(sy) > Math.abs(sx) * 1.9 ? (sy > 0 ? '-' : '_') : Math.abs(sx) > Math.abs(sy) * 1.9 ? '|' : sx * sy > 0 ? '/' : '\\'
      const dim = kind === 'water' ? 1 : .7
      cloud.push(px, kind === 'water' ? level + .045 : .2, pz, rain ? .13 : .19, glyph, [bright * .72 * dim, bright * .9 * dim, bright * dim], alpha * dim)
    }
  }
  function sampleFeet(feet: readonly FootPose[], dt: number, active: boolean, travelled: number) {
    return feet.map((foot, index) => {
      const { x, y, z } = foot.position, last = previousFeet[index]
      const dx = last ? x - last.x : 0, dz = last ? z - last.z : 0
      const distance = Math.hypot(dx, dz)
      const speed = active && dt > 0 && distance < .5 ? Math.min(4, distance / dt) : 0
      const wet = y - .065 < level && surface(x, z) === 'water'
      const landed = !!last && active && travelled > 0 && wet && foot.step > last.step
      const heading = !active && last ? last.heading : Math.atan2(dx, dz)
      const drag = !active && last ? last.drag : wet && !foot.grounded && travelled > 0 ? Math.min(1, speed / 1.6) : 0
      previousFeet[index] = { x, z, step: foot.step, heading, drag }
      // In the rain every step on soaked ground also leaves a small ring.
      const puddle = !!last && active && travelled > 0 && !wet && foot.step > last.step && surface(x, z) !== 'wood'
      return { x, z, wet, landed, heading, drag, puddle }
    })
  }

  return {
    mesh, material, reflection, uniforms, field, surface, wetness,
    get level() { return level },
    /** Mirror source for the engine: the marsh always renders its mirror. */
    distance: () => 0,
    look: { reflection: { enabled: true } },
    /** Ripples still drawn (not counting rain). */
    get wakes() { return ripples.filter((r) => !r.rain).length },
    /** Pushes this frame's letters; call between `cloud.clear()` and the render. */
    update(time: number, currentLevel: number, camera: THREE.Camera, frame: MarshFrame) {
      level = currentLevel
      uniforms.time.value = time; uniforms.level.value = level; mesh.position.y = level
      screenRight.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      camera.getWorldDirection(screenDepth).setY(0).normalize()
      const hero = frame.hero
      for (const foot of sampleFeet(frame.feet ?? [], frame.dt, frame.active, frame.travelled)) {
        if (foot.landed) push(foot.x, foot.z, time, .8, false, frame.heading)
        else if (foot.puddle) push(foot.x, foot.z, time, .45, false, frame.heading)
        if (foot.drag > .12) {
          footWave(foot.x, foot.z, foot.heading, .12, foot.drag * .52, true)
          if (frame.active) field.disturb(foot.x, foot.z, foot.drag * frame.dt * .5, .12)
        }
      }
      if (frame.active) {
        foeGait += frame.foeTravelled ?? 0
        if (foeGait >= .4 && time >= nextFoeStep && frame.foe && !frame.foeDead) {
          foeGait = 0; nextFoeStep = time + .6; push(frame.foe.x, frame.foe.z, time, .75)
        }
        // A submerged creature displaces water even while swaying in place.
        if (frame.foe && !frame.foeDead && time > nextBodyWake) { nextBodyWake = time + 1.4; push(frame.foe.x, frame.foe.z, time, .45) }
        if (frame.hit && frame.hit.id !== previousHit) {
          const struck = frame.hit.target === 'hero' ? hero : frame.foe
          if (struck) push(struck.x, struck.z, time + .2, frame.foeDead ? 1.7 : .85)
          previousHit = frame.hit.id
        }
        // Splash exactly where a falling streak reaches the surface.
        if (frame.rain) {
          if (phases.length !== frame.rain.count) phases = new Float32Array(frame.rain.count).fill(-1)
          for (let i = 0; i < frame.rain.count; i++) {
            const drop = frame.rain.drop(i, time)
            if (phases[i] >= 0 && drop.phase < phases[i] && Math.hypot(drop.x - hero.x, drop.z - hero.z) < 9) {
              if (i % 3 === 0) push(drop.impactX, drop.impactZ, time, .24 + hash(i) * .18, true)
            }
            phases[i] = drop.phase
          }
        }
      }
      for (const p of points) {
        if (Math.hypot(p.x - hero.x, p.z - hero.z) > 10 || surface(p.x, p.z) !== 'water') continue
        const wave = Math.sin(p.z * 8 + Math.sin(p.x * 1.5) + time * .9) + Math.sin(p.x * 6 - time * .8) * .35
        if (wave < 1.05 || p.seed < .65) continue
        const light = .21 + wave * .055
        cloud.push(p.x, level + .025, p.z, .11, p.seed > .7 ? '~' : '-', [light * .53, light * .79, light], .5)
        const lamp = Math.exp(-((p.x - hero.x) ** 2 * 2.8 + (p.z - hero.z - .65) ** 2 * .7))
        if (lamp > .15) cloud.push(p.x, level + .04, p.z, .11, '-', [.55, .38, .18], lamp * .55)
      }
      for (let n = ripples.length - 1; n >= 0; n--) {
        const r = ripples[n], age = time - r.at, life = r.rain ? .65 : r.footHeading !== undefined ? 1.05 : 1.6
        if (age > life) { ripples.splice(n, 1); continue }
        if (age < 0) continue
        if (!r.displaced) { field.disturb(r.x, r.z, r.strength * (r.rain ? .14 : .65), r.rain ? .13 : .28); r.displaced = true }
        const fade = Math.max(0, 1 - age / life)
        const force = Math.min(1, r.strength)
        if (r.footHeading !== undefined) {
          footWave(r.x, r.z, r.footHeading, .09 + age * .46, fade * .65)
          if (age > .12) footWave(r.x, r.z, r.footHeading, .055 + (age - .12) * .33, fade * .22)
          if (age < .3) for (let i = 0; i < 5; i++) {
            const direction = r.footHeading + Math.PI + (i - 2) * .55
            const spread = .04 + age * (.25 + hash(i) * .5)
            const y = level + .025 + Math.max(0, age * (.7 + hash(i + 8) * .25) - age * age * 3.8)
            cloud.push(r.x + Math.sin(direction) * spread, y, r.z + Math.cos(direction) * spread, .08, i % 2 ? '.' : ',', [.53, .7, .77], (1 - age / .3) * .7)
          }
          continue
        }
        ring(r.x, r.z, (r.rain ? .025 : .12) + age * (r.rain ? .38 : .64 * Math.sqrt(force)), fade * (r.rain ? .34 : .62 * force), r.rain ? .48 : .66, r.at, r.rain)
        if (r.rain && age < .12) for (const side of [-1, 1]) {
          cloud.push(r.x + side * age * .42, level + .04 + Math.sin(age / .12 * Math.PI) * .075,
            r.z + side * age * .18, .085, side < 0 ? ',' : '.', [.60, .74, .8], (1 - age / .12) * .6)
        }
        if (!r.rain && age < 1.2 && force > .6) ring(r.x, r.z, .12 + age * .55, (1 - age / 1.2) * .3 * force, .6, r.at + 2)
        if (age < .5 && !r.rain) for (let i = 0; i < 11; i++) {
          const angle = i * 2.399, radius = age * (.7 + hash(i) * 1.3)
          const y = Math.max(level, level + age * 2.2 * r.strength - age * age * 5)
          cloud.push(r.x + Math.cos(angle) * radius, y, r.z + Math.sin(angle) * radius, .105, i % 2 ? '.' : ',', [.5, .7, .82], (1 - age / .5) * .9)
        }
      }
      // Rain beads on shoulders and creature backs, then falls to the pool.
      if (frame.rain) for (const [body, bodyHeight] of [[hero, 1.75], [frame.foe, frame.foeHeight ?? .8]] as const) {
        if (!body || (body === frame.foe && frame.foeDead)) continue
        for (let i = 0; i < 9; i++) {
          const age = fract(time * 1.4 + i * .618), angle = i * 2.399
          const spread = .15 + age * .5
          const y = body.y + bodyHeight - .1 + age * .5 - age * age * 2.5
          if (y < level) continue
          cloud.push(body.x + Math.cos(angle) * spread, y, body.z + Math.sin(angle) * spread, .075, age < .2 ? ',' : '.', [.52, .68, .8], (1 - age) * .65)
        }
      }
      // Hydrology: shore mask twice a second, fixed-step waves, texture.
      if (lastShore < 0 || time - lastShore > .5) { field.setShore((x, z) => surface(x, z) === 'water'); lastShore = time }
      field.advance(frame.active ? frame.dt : 0)
      const heights = field.heights, size = field.size
      for (let z = 1; z < size - 1; z++) for (let x = 1; x < size - 1; x++) {
        const i = z * size + x, p = i * 4
        pixels[p] = Math.max(0, Math.min(255, 128 + heights[i] * 75))
        pixels[p + 1] = Math.max(0, Math.min(255, 128 + (heights[i + 1] - heights[i - 1]) * 110))
        pixels[p + 2] = Math.max(0, Math.min(255, 128 + (heights[i + size] - heights[i - size]) * 110))
        pixels[p + 3] = 255
      }
      waves.needsUpdate = true
    },
    /** GLSL `float marshShore(vec2 p)`: < bank on the islands (for hooks and floors). */
    shoreGLSL,
    dispose() { reflection.dispose(); material.dispose(); mesh.geometry.dispose(); waves.dispose() },
  }
}
export type MarshWater = ReturnType<typeof createMarshWater>
