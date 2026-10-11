import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'
import type { AsciiStyle } from './pomorog'
import { pomorog } from './pomorog'

/**
 * Snow (Pomorog `snow.ts` + `snowEnvironment.ts`): a snow floor whose colour
 * comes from a cover mask (a thaw around the hearth that grows over time) and
 * a 512² footprint map (toe and heel ellipses that fade in 110 s); flakes
 * `. + *` drifting slowly, hidden under crowns and melting over the thaw;
 * accumulation 0.28 → 1 in ~42 s for snow caps.
 */
export const SNOW_TRACK_LIFE = 110
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const fract = (n: number) => n - Math.floor(n)
const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453)

/** Pomorog snow lights (hemisphere, moon) and the brighter body ambient. */
export const pomorogSnow: Partial<AsciiStyle> = {
  hemisphere: { sky: 0xc9dfed, ground: 0x667987, intensity: 1.35 },
  moon: { ...pomorog.moon, color: 0xdfedfc, intensity: 2 },
  bodyAmbient: .42,
}

export const snowAccumulation = (time: number) => .28 + .72 * (1 - Math.exp(-Math.max(0, time) / 42))
export const snowMeltRadius = (time: number) => 1.48 + .35 * (1 - Math.exp(-Math.max(0, time) / 38))

/** Slow flakes drift sideways in gusts; no rain-like straight velocity. */
export function snowflake(index: number, time: number) {
  const speed = .48 + hash(index + 23) * .48
  const phase = fract(hash(index + 7) + time * speed / 8)
  return {
    x: (hash(index * 3 + 1) - .5) * 26 + Math.sin(time * .42 + index) * .45 + Math.sin(time * .13) * .65,
    y: 8 * (1 - phase),
    z: (hash(index * 3 + 2) - .5) * 26 + Math.cos(time * .31 + index * 2.4) * .35,
    size: .085 + hash(index + 9) * .105,
    phase,
  }
}

export interface SnowBoot { position: { x: number; y: number; z: number }; step: number }
export interface SnowOptions {
  /** Centre of the thaw (the hearth). */
  hearth: { x: number; z: number }
  /** Side of the snow floor and footprint map (m, centred on the origin). */
  extent?: number
}

export function createSnowField(options: SnowOptions) {
  const hearth = options.hearth, extent = options.extent ?? 32
  /** 0 on the thaw, 1 under snow. */
  const cover = (x: number, z: number, time: number) => {
    const dx = x - hearth.x, dz = z - hearth.z
    const edge = Math.sin(dx * 3.1 + dz * 1.7) * .10 + Math.sin(dz * 4.3) * .055
    return smooth((Math.hypot(dx, dz) + edge - snowMeltRadius(time) + .2) / .55)
  }
  const coverGLSL = `
    float snowCoverAt(vec2 p, float time) {
      vec2 d = p - vec2(${hearth.x.toFixed(3)}, ${hearth.z.toFixed(3)});
      float edge = sin(d.x * 3.1 + d.y * 1.7) * .10 + sin(d.y * 4.3) * .055;
      float radius = 1.48 + .35 * (1. - exp(-max(0., time) / 38.));
      return smoothstep(radius - .2, radius + .35, length(d) + edge);
    }
  `
  const size = 512, pixels = new Uint8Array(size * size)
  const footprintMap = new THREE.DataTexture(pixels, size, size, THREE.RedFormat)
  footprintMap.minFilter = footprintMap.magFilter = THREE.LinearFilter; footprintMap.generateMipmaps = false
  const clock = { value: 0 }

  /** The snow floor: declare it `surface` with `snow` (the lattice keeps a light gap). */
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .94 })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.snowTime = clock; shader.uniforms.footprintMap = { value: footprintMap }
    shader.vertexShader = `varying vec3 snowWorld;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nsnowWorld=(modelMatrix*vec4(position,1.)).xyz;')
    shader.fragmentShader = `varying vec3 snowWorld; uniform float snowTime; uniform sampler2D footprintMap;\n${coverGLSL}\n${shader.fragmentShader}`
      .replace('#include <color_fragment>', `#include <color_fragment>
        float cover = snowCoverAt(snowWorld.xz, snowTime);
        float drift = sin(snowWorld.x * .8 + sin(snowWorld.z * .55)) * sin(snowWorld.z * 1.3) * .045;
        float track = texture2D(footprintMap, snowWorld.xz / ${extent.toFixed(1)} + .5).r;
        vec3 powder = vec3(.52,.65,.72) + drift;
        powder *= 1. - track * .68;
        vec3 thaw = vec3(.060,.046,.029) + vec3(.022,.024,.021) * (.5+.5*sin(snowWorld.x*11.+snowWorld.z*7.));
        diffuseColor.rgb *= mix(thaw, powder, cover);`)
  }
  material.customProgramCacheKey = () => 'ascii-snow-ground-v1'
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(extent, extent), material)
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.025; ground.receiveShadow = true
  ground.userData.glyph = 'surface'; ground.userData.glyphStyle = { surface: 'snow' }

  const prints: { x: number; z: number; heading: number; at: number; foot: number }[] = []
  let previous: number[] = [], lastStamp = -1, lastCount = -1
  function paintTracks(time: number) {
    pixels.fill(0)
    const cell = extent / size
    for (const print of prints) {
      const strength = (1 - (time - print.at) / SNOW_TRACK_LIFE) ** .7
      const cx = Math.floor((print.x / extent + .5) * size), cz = Math.floor((print.z / extent + .5) * size)
      const sin = Math.sin(print.heading), cos = Math.cos(print.heading)
      for (let iz = cz - 5; iz <= cz + 5; iz++) for (let ix = cx - 5; ix <= cx + 5; ix++) {
        if (ix < 0 || iz < 0 || ix >= size || iz >= size) continue
        const dx = (ix + .5) * cell - extent / 2 - print.x, dz = (iz + .5) * cell - extent / 2 - print.z
        const across = dx * cos - dz * sin, forward = dx * sin + dz * cos
        const toe = Math.hypot(across / .115, (forward - .045) / .16), heel = Math.hypot(across / .083, (forward + .12) / .075)
        const ink = Math.max(0, Math.min(1, (1 - Math.min(toe, heel)) / .32)) * strength
        const index = iz * size + ix; pixels[index] = Math.max(pixels[index], Math.round(ink * 255))
      }
    }
    footprintMap.needsUpdate = true; lastStamp = time; lastCount = prints.length
  }

  return {
    ground, material, cover, coverGLSL, prints,
    get footprintCount() { return prints.length },
    /** Boots stamp prints on snow (never in the thaw); prints fade in 110 s. */
    stamp(time: number, feet: readonly SnowBoot[], heading: number, active: boolean, travelled: number) {
      clock.value = time
      if (active) {
        while (prints.length && time - prints[0].at > SNOW_TRACK_LIFE) prints.shift()
        feet.forEach((foot, index) => {
          if (previous[index] === undefined || foot.step <= previous[index] || travelled <= 0 || foot.position.y > .28) return
          const { x, z } = foot.position
          if (cover(x, z, time) > .55) prints.push({ x, z, heading, at: time, foot: index })
        })
        if (prints.length > 256) prints.splice(0, prints.length - 256)
      }
      previous = feet.map((foot) => foot.step)
      if (lastStamp < 0 || prints.length !== lastCount || time - lastStamp > .15) paintTracks(time)
    },
    /** Falling flakes around `center`, hidden under `crowns`, melting over the thaw. */
    flakes(cloud: GlyphCloud, time: number, center: { x: number; z: number }, crowns: readonly { x: number; z: number; y: number; radius: number }[], count = 950) {
      for (let i = 0; i < count; i++) {
        const f = snowflake(i, time)
        if (Math.hypot(f.x - center.x, f.z - center.z) > 10) continue
        if (crowns.some((c) => Math.hypot(f.x - c.x, f.z - c.z) < c.radius && f.y < c.y)) continue
        const melt = cover(f.x, f.z, time) < .5 ? Math.min(1, Math.max(0, (f.y - .5) / 1.4)) : 1
        if (melt <= 0) continue
        cloud.push(f.x, f.y, f.z, f.size, i % 5 === 0 ? '*' : i % 3 === 0 ? '+' : '.', [.88, .94, 1], Math.min(1, .68 + f.size * 1.6) * melt)
      }
    },
    dispose() { footprintMap.dispose(); material.dispose(); ground.geometry.dispose() },
  }
}
export type SnowField = ReturnType<typeof createSnowField>
