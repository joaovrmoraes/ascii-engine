import * as THREE from 'three'
import { illuminationGLSL, illuminationUniforms } from './illumination'

export function pathCenter(z: number) { return Math.sin(z * .38) * 1.2 }

/** Each blade is a character in world space, bent by wind and passing bodies. */
/** A carpet of standing letters for any biome: grass, gravel, moss, snow crust. */
export interface GroundCover {
  count: number
  density: (x: number, z: number) => number
  y: (x: number, z: number) => number
  /** Glyph indices into | / \\ v Y ! * o . , and a colour for each blade. */
  pick: (random: () => number, x: number, z: number) => { glyph: number; height: number; color: [number, number, number] }
  /** Endless ground: blades wrap around the hero and a GLSL soil mask clears trail/banks. */
  infinite?: { glsl: string; uniforms: Record<string, { value: unknown }>; span: number }
}
export function createGrass(random: () => number, cover?: GroundCover) {
  const glyphs = ['|', '/', '\\', 'v', 'Y', '!', '*', 'o', '.', ',']
  const atlas = document.createElement('canvas')
  atlas.width = glyphs.length * 32; atlas.height = 48
  const ctx = atlas.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.font = '34px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  glyphs.forEach((glyph, i) => ctx.fillText(glyph, i * 32 + 16, 24))
  const texture = new THREE.CanvasTexture(atlas)
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = true
  const offsets: number[] = [], shapes: number[] = [], colors: number[] = []
  if (cover) for (let i = 0; i < cover.count; i++) {
    const x = (random() - .5) * 26, z = (random() - .5) * 26
    if (random() > cover.density(x, z)) continue
    const blade = cover.pick(random, x, z)
    offsets.push(x, cover.y(x, z), z)
    shapes.push(blade.glyph, blade.glyph >= 6 ? .16 + blade.height * .3 : blade.height * .4, blade.glyph >= 6 ? .1 + blade.height * .5 : blade.height, random() * 6.28)
    colors.push(...blade.color)
  }
  for (let i = 0; i < (cover ? 0 : 12000); i++) {
    const x = (random() - .5) * 24, z = (random() - .5) * 24
    const pathDistance = Math.abs(x - pathCenter(z))
    if (z < -3.5 && Math.abs(x) < 7.5) continue
    if (x > 2.3 && x < 5.9) continue
    if (Math.sin(x * 2.3) * Math.cos(z * 1.9) < .42) continue
    if (Math.hypot(x + 3, z - 2.6) < 1.15) continue
    if (pathDistance < .7 && random() < .94) continue
    if (Math.sin(x * .6 + z * .4) + Math.cos(z * .9) < -1.4 && random() < .65) continue
    const flower = random() < .026
    const short = pathDistance < 1.1
    const height = short ? .07 + random() * .07 : .1 + random() * .16
    offsets.push(x, .015, z)
    // A monospace proportion keeps /, Y and v recognizable as letters.
    shapes.push(flower ? 6 + Math.floor(random() * 2) : Math.floor(random() * 6), flower ? .23 : height * .42, flower ? height * .65 : height, random() * 6.28)
    const shade = .5 + random() * .5
    colors.push(...(flower ? [.54 * shade, .62 * shade, .52 * shade] : [.17 * shade, .34 * shade, .25 * shade]))
  }
  const base = new THREE.PlaneGeometry(1, 1, 1, 3)
  base.translate(0, .5, 0)
  const geometry = new THREE.InstancedBufferGeometry()
  geometry.index = base.index
  geometry.attributes.position = base.attributes.position
  geometry.attributes.uv = base.attributes.uv
  geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3))
  geometry.setAttribute('shape', new THREE.InstancedBufferAttribute(new Float32Array(shapes), 4))
  geometry.setAttribute('bladeColor', new THREE.InstancedBufferAttribute(new Float32Array(colors), 3))
  geometry.instanceCount = offsets.length / 3
  const trail = Array.from({ length: 12 }, () => new THREE.Vector4(100, 100, -100, 0))
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, depthWrite: true, depthTest: true,
    uniforms: {
      ...illuminationUniforms(),
      atlas: { value: texture }, time: { value: 0 }, brightness: { value: 1 }, right: { value: new THREE.Vector3(1, 0, 0) },
      hero: { value: new THREE.Vector3() }, enemy: { value: new THREE.Vector3(100, 0, 100) },
      trail: { value: trail }, focus: { value: new THREE.Vector3() }, tint: { value: new THREE.Color(1, 1, 1) },
      glow: { value: [new THREE.Vector4(), new THREE.Vector4()] }, glowColor: { value: [new THREE.Color(), new THREE.Color()] },
      ...(cover?.infinite?.uniforms ?? {}),
    },
    vertexShader: `
      ${cover?.infinite ? `#define INFINITE_GROUND\n#define GROUND_SPAN ${cover.infinite.span.toFixed(1)}\n${cover.infinite.glsl}` : ''}
      attribute vec3 offset, bladeColor;
      attribute vec4 shape;
      uniform float time;
      uniform vec3 right, hero, enemy, focus;
      uniform vec4 trail[12];
      varying vec2 vUv;
      varying vec3 vColor;
      varying vec3 worldPoint;
      varying float vGlyph, vFog;
      vec3 base;
      vec2 displace(vec2 center, float radius) {
        vec2 away = base.xz - center;
        float distance = length(away);
        return away / max(distance, .02) * pow(max(0., 1. - distance / radius), 2.);
      }
      void main() {
        vUv = uv; vGlyph = shape.x; vColor = bladeColor;
        base = offset;
        #ifdef INFINITE_GROUND
          base.xz = hero.xz + mod(offset.xz - hero.xz + GROUND_SPAN * .5, GROUND_SPAN) - GROUND_SPAN * .5;
          vec2 ground = forestSoil(base.xz);
          // Trail, camp clearing and stream banks stay bare; edges keep short tufts.
          if (fract(shape.w * 7.31) < ground.x * 1.15 || ground.y > .02) { gl_Position = vec4(2., 2., 2., 1.); return; }
        #endif
        vec2 force = displace(hero.xz, .8) * 1.35 + displace(enemy.xz, .75);
        for (int i = 0; i < 12; i++) {
          float age = time - trail[i].z;
          float recovery = max(0., 1. - age / 2.5) * trail[i].w;
          force += displace(trail[i].xy, .55) * recovery * .3;
        }
        float wind = sin(time * 1.65 + base.x * .65 + base.z * .35) * .11;
        wind += sin(time * 2.6 + shape.w) * .035;
        float tip = position.y * position.y;
        vec3 point = base + right * position.x * shape.y;
        point.y += position.y * shape.z * (1. - min(length(force) * .55, .78));
        point.xz += (force * .55 + vec2(wind, wind * .4)) * tip;
        worldPoint = point;
        vFog = smoothstep(10., 21., distance(base.xz, focus.xz));
        float nearby = min(distance(base.xz, hero.xz), distance(base.xz, enemy.xz));
        vColor *= mix(.62, 1., smoothstep(.65, 1.9, nearby));
        gl_Position = projectionMatrix * viewMatrix * vec4(point, 1.);
      }
    `,
    fragmentShader: `
      uniform sampler2D atlas;
      uniform float brightness;
      uniform vec3 tint;
      uniform vec4 glow[2];
      uniform vec3 glowColor[2];
      varying vec2 vUv;
      varying vec3 vColor;
      varying vec3 worldPoint;
      ${illuminationGLSL}
      varying float vGlyph, vFog;
      void main() {
        float ink = texture2D(atlas, vec2((vGlyph + vUv.x) / 10., vUv.y)).a;
        if (ink < .22) discard;
        vec3 color = vColor * tint * (.55 + .75 * vUv.y) * brightness;
        // Spell and aura lights spill over the blades, like the reference pools.
        vec3 spill = vec3(0.);
        for (int i = 0; i < 2; i++) spill += glowColor[i] * glow[i].w * pow(max(0., 1. - distance(worldPoint, glow[i].xyz) / 4.), 2.);
        color += vColor * spill * 2.2 + spill * .06;
        color = mix(color, vec3(.023, .033, .039), vFog);
        gl_FragColor = vec4(max(vec3(.035,.031,.055), illuminateInk(color * (.6 + .4 * ink), worldPoint)), 1.);
      }
    `,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  const scene = new THREE.Scene(); scene.add(mesh)
  const absent = new THREE.Vector3(100, 0, 100)
  let trailIndex = 0
  const last = new THREE.Vector3(100, 0, 100)
  return {
    scene, uniforms: material.uniforms, count: geometry.instanceCount,
    setGlow(index: number, light: THREE.PointLight) {
      const intensity = Math.min(1.5, light.intensity / 9)
      ;(material.uniforms.glow.value as THREE.Vector4[])[index].set(light.position.x, light.position.y, light.position.z, intensity)
      ;(material.uniforms.glowColor.value as THREE.Color[])[index].copy(light.color)
    },
    update(time: number, hero: THREE.Vector3, enemy: THREE.Vector3 | null, camera: THREE.Camera, focus: THREE.Vector3, atmosphere: string, brightness: number) {
      material.uniforms.time.value = time
      material.uniforms.brightness.value = brightness
      material.uniforms.hero.value.copy(hero)
      material.uniforms.enemy.value.copy(enemy ?? absent)
      material.uniforms.right.value.setFromMatrixColumn(camera.matrixWorld, 0)
      material.uniforms.focus.value.copy(focus)
      material.uniforms.tint.value.setRGB(atmosphere === 'ember' ? 1.3 : 1, atmosphere === 'dusk' ? .85 : 1, atmosphere === 'ember' ? .6 : 1)
      if (last.distanceToSquared(hero) > .06) {
        trail[trailIndex].set(hero.x, hero.z, time, 1)
        trailIndex = (trailIndex + 1) % trail.length
        last.copy(hero)
      }
    },
    dispose() { geometry.dispose(); base.dispose(); material.dispose(); texture.dispose() },
  }
}
