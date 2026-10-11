import * as THREE from 'three'
import { tagSurface, SURFACE_ALPHA } from './surface'
import { SWAMP_ISLANDS, SWAMP_WATER_Y, swampWetness, swampWeather, swampShoreGLSL } from './swamp'
import type { SwampHydrology } from './swampHydrology'
import { createWetlandTree } from './wetlandTrees'
import { createWaterReflection, waterReflectionGLSL, waterReflectionUniforms } from './waterReflection'
import { createShoreDetails } from './shoreDetails'
import { WORLD_GLYPH_ALPHA, worldWaterGLSL, worldWaterUniforms } from './worldGlyph'

export function createSwampEnvironment(scene: THREE.Scene, hydrology: SwampHydrology, glyphs = false) {
  let seed = 7401
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  const cube = new THREE.BoxGeometry(1, 1, 1), rock = new THREE.DodecahedronGeometry(1, 0)
  const cylinder = new THREE.CylinderGeometry(.72, 1, 1, 7)
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  const reeds: { mesh: THREE.Mesh; rest: number; phase: number }[] = []
  const floaters: THREE.Mesh[] = []
  function material(color: number, surface: 'bark' | 'wood' | 'foliage' | 'earth' | 'stone' = 'wood') {
    const key = `${color}:${surface}`
    let mat = materials.get(key)
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({ color, roughness: .82, flatShading: true })
      // A little bounced moonlight keeps the unlit side of bare wood readable.
      if (surface === 'wood' || surface === 'bark') { mat.emissive.setHex(0x657786); mat.emissiveIntensity = .22 }
      tagSurface(mat, surface); materials.set(key, mat)
    }
    return mat
  }
  function mesh(geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, surface?: 'bark' | 'wood' | 'foliage' | 'earth' | 'stone') {
    const object = new THREE.Mesh(geometry, material(color, surface))
    object.position.set(x, y, z); object.scale.set(sx, sy, sz); object.castShadow = true; object.receiveShadow = true; scene.add(object)
    return object
  }
  // The pool is an actual depth-writing surface. Boots disappear below its level.
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, level: { value: SWAMP_WATER_Y }, waves: { value: hydrology.texture }, ...waterReflectionUniforms(), ...(glyphs ? worldWaterUniforms() : {}) },
    vertexShader: 'varying vec3 p; varying vec4 mirrorUv; uniform mat4 reflectionMatrix; void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;mirrorUv=reflectionMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: `varying vec3 p; uniform float time, level; uniform sampler2D waves;
      ${swampShoreGLSL}
      ${waterReflectionGLSL}
      ${glyphs ? worldWaterGLSL() : ''}
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
      void main(){
        float shore=swampShore(p.xz), bank=1.-(level-${SWAMP_WATER_Y})*1.35;
        if(shore<bank)discard;
        vec3 disturbance=texture2D(waves,p.xz/24.+.5).rgb-vec3(.502);
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
        ${glyphs ? `
        // Flooded meadow: submerged grass shows as dim green strokes below the rows.
        vec3 lettered=waterLetters(p,time,crest*1.4+shoreFoam*.4,vec2(.03,.05),grass,sod*2.2);
        gl_FragColor=vec4(lettered,${WORLD_GLYPH_ALPHA.toFixed(2)});` : `
        gl_FragColor=vec4(ink,signal>.009?${SURFACE_ALPHA.reflection.toFixed(1)}:grass*blade>.55?.3:.8);`}
      }`,
  })
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), waterMaterial)
  pool.rotation.x = -Math.PI / 2; pool.position.y = SWAMP_WATER_Y; scene.add(pool)
  const reflection = createWaterReflection(scene, pool, waterMaterial)
  for (const island of SWAMP_ISLANDS) {
    const bank = mesh(new THREE.CircleGeometry(1, 40), 0x4f6046, island.x, .17, island.z, island.rx, island.rz, 1, 'earth')
    bank.rotation.x = -Math.PI / 2
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, radius = .94 + random() * .12
      mesh(rock, 0x5b6665, island.x + Math.cos(a) * island.rx * radius, .12, island.z + Math.sin(a) * island.rz * radius, .12 + random() * .18, .12, .14, 'stone')
    }
  }
  // A few eroded outcrops give the flooded lane a readable edge and tall
  // reflected silhouettes. Keep the central autorun route clear.
  for (const [x, z, size] of [[-2.8,-.1,.65],[3.2,1.5,.52],[3.2,-3.8,.7],[-3.4,-4.4,.56],[-4.2,4.3,.48]]) {
    const stone = mesh(rock, 0x929e99, x, .2 + size * .38, z, size, size * .85, size * .78, 'stone')
    stone.rotation.set(.16, x * 1.7, -.12)
    const moss = mesh(rock, 0x64815a, x - size * .12, .2 + size * 1.08, z, size * .8, size * .12, size * .64, 'foliage')
    moss.rotation.y = stone.rotation.y
    mesh(rock, 0x687c77, x + size * .8, .22, z + size * .3, size * .4, size * .3, size * .45, 'stone')
  }
  // Broad, uneven crowns frame a navigable flooded lane.
  const trees = [[-4.0,-.4,3.9],[4.5,-2.2,4.2],[-4.8,-6,4.6],[4.1,-7.2,4.7],[-6.7,5.4,4.1],[6.8,6.5,4.4],[.6,-10,4.5]]
    .map(([x,z,h], i) => { const tree = createWetlandTree(x,z,h,931+i*137); scene.add(tree.root); return tree })
  for (let i = 0; i < 90; i++) {
    const x = (i % 2 ? -1 : 1) * (3.1 + random() * 4.4), z = -9 + random() * 18
    if (Math.hypot(x + 3, z - 2.6) < 2.7) continue
    for (let j = 0; j < 3; j++) {
      const h = .45 + random() * .65, px = x + (random() - .5) * .4, pz = z + (random() - .5) * .4
      const stem = mesh(cylinder, 0x5c746d, px, .17 + h / 2, pz, .025, h, .025, 'foliage')
      reeds.push({ mesh: stem, rest: (random() - .5) * .2, phase: i + j })
      if (j === 0) mesh(cylinder, 0x6f6651, px, .2 + h, pz, .065, .23, .065)
    }
  }
  // A damaged boardwalk and a stilt shack give scale to the flooded crossing.
  for (let i = 0; i < 29; i++) {
    const x = -4 + i * .2
    const plank = mesh(cube, i % 3 ? 0x6d6b5e : 0x858073, x, .29, 4.95, .18, .10, 1.1)
    plank.rotation.y = (random() - .5) * .05
  }
  for (const x of [-3.8,-1.4,1.5]) for (const z of [4.35,5.55]) mesh(cylinder, 0x69716a, x, .5, z, .06, .95, .06)
  for (const x of [-6.5,-4.8]) for (const z of [-5.6,-4.1]) mesh(cube, 0x66716b, x, .8, z, .12, 1.6, .12)
  for (let i = 0; i < 11; i++) {
    mesh(cube, 0x5f625c, -6.6 + i * .18, .48, -4.8, .16, .1, 1.8)
    const roof = mesh(cube, 0x798076, -6.7 + i * .2, 2.1 - Math.abs(i - 5) * .1, -4.8, .18, .07, 2.1)
    roof.rotation.z = i < 5 ? .46 : -.46
  }
  for (let i = 0; i < 60; i++) {
    const x = -7 + random() * 14, z = -8 + random() * 16
    if (swampWetness(x, z) < .5 || Math.abs(x) < 1.8) continue
    const pad = mesh(new THREE.CircleGeometry(.16 + random() * .09, 7, .15, Math.PI * 1.8), 0x49675e, x, .195, z, 1, 1, 1, 'foliage')
    pad.rotation.x = -Math.PI / 2; pad.rotation.z = random() * 6
    floaters.push(pad)
  }
  const banks = createShoreDetails(scene, true)
  return { reflection, dispose() { reflection.dispose() }, animate(time: number) {
    banks.animate(time)
    trees.forEach(tree => tree.animate(time))
    waterMaterial.uniforms.time.value = time
    waterMaterial.uniforms.level.value = pool.position.y = swampWeather(time).level
    floaters.forEach((pad, i) => { pad.position.y = pool.position.y + .016 + Math.sin(time * 1.5 + i) * .007 })
    reeds.forEach(({ mesh, rest, phase }) => { mesh.rotation.z = rest + Math.sin(time * 1.6 + phase) * .045 })
  } }
}
