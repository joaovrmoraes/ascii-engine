import * as THREE from 'three'
import { tagSurface, type AsciiSurface } from './surface'
import type { LightObstacle } from './exploration'
import { createSwampEnvironment } from './swampEnvironment'
import type { SwampHydrology } from './swampHydrology'
import { swampWeather } from './swamp'
import { createSnowEnvironment } from './snowEnvironment'
import { createChannelWater } from './channelWater'
import { createShoreDetails } from './shoreDetails'
import { createWetlandTree } from './wetlandTrees'
import { createMeadowFloor } from './meadow'
import { createLitFloor } from './groundCover'
import { createForestWorld } from './forestWorld'

/** Each location has its own geometry, all rendered through the same ASCII pass. */
export function createEnvironment(scene: THREE.Scene, locationId: string, hydrology?: SwampHydrology, worldGlyphs = false) {
  let seed = 8203
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  const trees: ReturnType<typeof createWetlandTree>[] = []
  const ornaments: THREE.Object3D[] = []
  const lanterns: THREE.Group[] = []
  let swamp: ReturnType<typeof createSwampEnvironment> | undefined
  let snow: ReturnType<typeof createSnowEnvironment> | undefined
  let banks: ReturnType<typeof createShoreDetails> | undefined
  const materialCache = new Map<string, THREE.MeshStandardMaterial>()
  const material = (color: number, surface?: AsciiSurface) => {
    const key = `${color}:${surface ?? 'auto'}`
    if (!materialCache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true })
      // Classify by perceptual hue: comparing linear channels turned grey-green
      // stones (camp ring, mine rubble) into foliage.
      const hsl = new THREE.Color(color).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace)
      const auto = hsl.s > .18 && hsl.h > .2 && hsl.h < .45 ? 'foliage' : hsl.s > .15 && (hsl.h < .14 || hsl.h > .95) ? 'wood' : 'stone'
      tagSurface(mat, surface ?? auto)
      materialCache.set(key, mat)
    }
    return materialCache.get(key)!
  }
  const cube = new THREE.BoxGeometry(1, 1, 1), rock = new THREE.DodecahedronGeometry(1, 0)
  function add(geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx = 1, sy = sx, sz = sx, parent: THREE.Object3D = scene, surface?: AsciiSurface) {
    const mesh = new THREE.Mesh(geometry, material(color, surface))
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz)
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    return mesh
  }
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, parent: THREE.Object3D = scene, surface?: AsciiSurface) => add(cube, color, x, y, z, w, h, d, parent, surface)
  const floorMaterial = new THREE.ShaderMaterial({
    uniforms: { forest: { value: locationId === 'dark_forest' ? 1 : 0 } },
    vertexShader: `varying vec3 world; void main() { vec4 p = modelMatrix * vec4(position, 1.); world = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }`,
    fragmentShader: `varying vec3 world; uniform float forest;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main() {
        float cluster = sin(world.x * 4.1 + sin(world.z * 1.2)) * sin(world.z * 3.3) + sin(world.x * 8. + world.z * 3.) * .3;
        float grains = hash(floor(world.xz * 15.));
        float groundCoverage = smoothstep(-.3, .6, cluster) * step(.23, grains);
        vec3 ground = mix(vec3(.0018,.0014,.003), mix(vec3(.035,.032,.05),vec3(.046,.052,.018),forest), groundCoverage * (.3 + grains * .7));
        float river = forest * (1. - smoothstep(1.1,1.3,abs(world.x - 3.95 - sin(world.z * .45) * .5)));
        gl_FragColor = vec4(mix(ground, vec3(.0005), river), .9);
      }`,
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 40), floorMaterial)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; scene.add(floor)
  let meadow: ReturnType<typeof createMeadowFloor> | undefined
  if (worldGlyphs && (locationId === 'old_mine' || locationId === 'sunken_cathedral')) {
    floor.visible = false; meadow = createLitFloor(locationId); scene.add(meadow.floor)
  }
  // Procedural forest: an endless trail generated in chunks (see forestWorld.ts).
  const procedural = worldGlyphs && locationId === 'dark_forest'
  let world: ReturnType<typeof createForestWorld> | undefined
  if (procedural) {
    floor.visible = false
    world = createForestWorld(scene, { add: (g, c, x, y, z, sx = 1, sy = sx, sz = sx, parent = scene, surface) => add(g, c, x, y, z, sx, sy, sz, parent, surface), box })
  } else if (locationId === 'dark_forest') {
    if (worldGlyphs) { floor.visible = false; meadow = createMeadowFloor(42, 40, new THREE.Vector3(-3, 0, 2.6)); scene.add(meadow.floor) }
    // A woodland clearing around the bonfire, an old chapel and a narrow river.
    // 00s, 18s and 25s in the reference board determine placement and scale.
    for (let i = 0; i < 95; i++) {
      const z = -9 + random() * 20, x = -.6 + Math.sin(z * .5) * .45 + (random() - .5) * 1.5
      const stone = add(rock, (worldGlyphs ? [0x6c6a62, 0x7b7a70, 0x5f6460] : [0x30303c, 0x41414e, 0x353640])[i % 3], x, -.005, z, .08 + random() * .19, .035, .1 + random() * .19)
      stone.rotation.y = random() * 6
    }
    const stoneColors = [0x656774, 0x717582, 0x555b69, 0x7b7f88]
    const ruins = new THREE.Group(); ruins.position.set(-.4, 0, -4.6); scene.add(ruins)
    function brick(x: number, y: number, z: number, w: number, h: number, d: number) {
      return box(stoneColors[Math.floor(random() * stoneColors.length)], x, y, z, w, h, d, ruins)
    }
    // A narrow chapel façade, with door recess, brick courses and a lancet window.
    for (let row = 0; row < 13; row++) for (let col = -4; col <= 4; col++) {
      const x = col * .49 + (row % 2) * .23
      if (Math.abs(x) < .83 && row < 7) continue
      if (Math.abs(x) < .34 && row > 8 && row < 12) continue
      if (row > 10 && Math.abs(x) > 2 - (row - 10) * .45) continue
      brick(x, .17 + row * .32, 0, .45, .29, .55)
    }
    for (let i = 0; i < 13; i++) {
      const a = i / 12 * Math.PI
      const stone = brick(Math.cos(a) * .9, 1.65 + Math.sin(a) * 1.1, .25, .27, .4, .5)
      stone.rotation.z = a - Math.PI / 2
    }
    for (const x of [-2.15, 2.15]) {
      brick(x, 1.7, .22, .45, 3.4, .95)
      brick(x, 3.45, .22, .65, .2, 1.05)
    }
    for (let i = 0; i < 3; i++) brick(0, .07 + i * .1, 1.2 - i * .28, 2.05, .14, .55)
    // A little lean-to at camp: split planks instead of smooth filled walls.
    for (let i = 0; i < 10; i++) {
      const plank = box(0x615743, -5.3 + i * .17, 1.35 + Math.abs(i - 4.5) * -.11, 2.9, .15, .08, 1.75)
      plank.rotation.z = i < 5 ? .58 : -.58
    }
    for (const x of [-5.3, -3.8]) box(0x55493c, x, .54, 3.55, .09, 1.1, .09)
    // A footbridge breaks the river's horizontal flowing lines.
    for (let i = 0; i < 19; i++) box(i % 3 ? 0x63594c : 0x81715c, 2.25 + i * .17, .16, -.9, .15, .13, 1.25)
    for (const z of [-1.58, -.22]) {
      box(0x6f6454, 3.8, .32, z, 3.5, .15, .1)
      for (const x of [2.25, 5.35]) box(0x8a7a60, x, .53, z, .09, 1.1, .09)
    }
    // Articulated branches and small leaf clusters, with light through the gaps.
    const treePositions = [[-5.7,-1.8,4.3],[-5.6,5.6,4.2],[2.6,-4.1,4.1],[7.8,3.6,4.5],[8.7,-3.6,4.8],[-4.1,-7.4,4.5],[3.7,7.8,4.4],[-7.5,1.6,4.8]]
    for (const [x,z,h] of treePositions) {
      const tree = createWetlandTree(x, z, h, Math.round((x + 10) * 819), false)
      scene.add(tree.root); trees.push(tree)
      for (let i = 0; i < 5; i++) add(rock,0x344b42,Math.cos(i*2.4)*.6,.18,Math.sin(i*2.4)*.6,.4,.3,.45,tree.root)
    }
    // Shore stones and reeds stay below the actor silhouettes.
    for (let i = 0; i < 45; i++) {
      const z = -8 + random()*18, x = 3.95 + Math.sin(z*.45)*.5 + (i%2 ? 1.3 : -1.3)
      add(rock,0x414c4f,x,.045,z,.1+random()*.18,.06+random()*.1,.15)
    }
    banks = createShoreDetails(scene, false)
  } else if (locationId === 'snow_pines') {
    floor.visible = false
    snow = createSnowEnvironment(scene)
  } else if (locationId === 'rain_marsh') {
    // Marsh water keeps its approved look (user's choice); banks and props carry letters.
    swamp = createSwampEnvironment(scene, hydrology!, false)
  } else if (locationId === 'old_mine') {

    // Twin rails, timber supports, a loaded cart and exposed copper veins.
    for (let z = -10; z < 10; z += .62) box(0x82704e, .7, -.005, z, 1.85, .13, .16)
    for (const x of [.05, 1.35]) box(0xa99876, x, .08, 0, .085, .12, 22, scene, 'stone')
    for (const z of [-5, -1, 4, 8]) {
      for (const x of [-3.1, 3.5]) {
        box(0x94734a, x, 1.48, z, .26, 2.96, .30)
        for (const y of [.28, 2.62]) box(0x5d655f, x, y, z, .30, .09, .34, scene, 'stone')
        const brace = box(0xab8755, x + (x < 0 ? .38 : -.38), 2.53, z, .15, 1.04, .17)
        brace.rotation.z = x < 0 ? -.65 : .65
      }
      box(0x94734a, .2, 3.02, z, 6.95, .24, .32)
    }
    for (let i = 0; i < 65; i++) {
      const x = (i % 2 ? -1 : 1) * (3.85 + random() * 1.4), z = -10 + random() * 22
      const stone = add(rock, [0x666b63, 0x879080, 0x77745a][i % 3], x, random() * .85, z, .4 + random() * .65, .6 + random() * 1.1, .4 + random() * .8, scene, 'stone')
      stone.rotation.set(random(), random(), random())
      if (i % 3 === 0) {
        const crystal = add(new THREE.OctahedronGeometry(.5), i % 2 ? 0xbf8746 : 0x639a81, x * .89, .3 + random() * .6, z, .3, .55, .35, scene, 'stone')
        crystal.rotation.z = (random() - .5) * .8
      }
    }
    for (const [x,z] of [[-2.88,1],[3.28,-4],[-2.88,6]]) {
      const lamp = new THREE.Group(); lamp.position.set(x, 2.8, z); scene.add(lamp); lanterns.push(lamp)
      box(0x686757,0,-.24,0,.025,.48,.025,lamp)
      const glass = box(0xd7ac65,0,-.60,0,.16,.25,.16,lamp,'stone')
      ;(glass.material as THREE.MeshStandardMaterial).emissive.setHex(0x765025)
      for (const y of [-.76,-.44]) box(0x5b6259,0,y,0,.24,.055,.24,lamp,'stone')
      for (const side of [-1,1]) box(0x5b6259,side*.1,-.60,.09,.025,.29,.025,lamp,'stone')
      const glow = new THREE.PointLight(0xe0ba7b, 3.8, 3.2, 1.7)
      glow.position.y = -.58; lamp.add(glow)
    }
    // Loose ballast and damp seams keep the rail bed from reading as empty void.
    for (let i = 0; i < 110; i++) {
      const x = (random() - .5) * 5.2, z = -9 + random() * 19
      if (Math.hypot(x + 3,z - 2.6) < 1) continue
      add(rock, i % 4 ? 0x727164 : 0x506d45, x, -.025, z, .05 + random() * .09, .04, .08 + random() * .1, scene, i % 4 ? 'stone' : 'foliage')
    }
    const cart = new THREE.Group(); cart.position.set(2.9, 0, -.8); scene.add(cart)
    box(0x8a765d, 0, .65, 0, 1.1, .7, 1.5, cart)
    box(0x303b3c, 0, 1.02, 0, .85, .05, 1.25, cart)
    for (const x of [-.57, .57]) for (const z of [-.47, .47]) {
      const wheel = add(new THREE.CylinderGeometry(.24, .24, .12, 10), 0x84918c, x, .26, z, 1, 1, 1, cart)
      wheel.rotation.z = Math.PI / 2
    }
    for (let i = 0; i < 7; i++) add(rock, 0x999084, (random() - .5) * .8, 1.04, (random() - .5), .26, .3, .28, cart)
  } else {
    // Flooded side aisles around a dry nave; paired pillars frame the route.
    for (let z = -10; z <= 11; z += .92) for (let x = -3; x <= 3; x++) {
      const tile = box((x + Math.round(z)) % 2 ? 0x455957 : 0x65716a, x * .87, -.035, z, .82, .09, .87, scene, 'stone')
      tile.rotation.y = (random() - .5) * .025
    }
    for (const side of [-1, 1]) {
      box(0x203a48, side * 5.2, -.06, 0, 3.1, .08, 24)
      for (const z of [-5, .5, 6]) {
        const x = side * 3.25
        box(0x929e98, x, .15, z, .87, .3, .87, scene, 'stone')
        add(new THREE.CylinderGeometry(.24, .31, 2.65, 8), 0x9baaa4, x, 1.6, z, 1, 1, 1, scene, 'stone')
        for (let rib = 0; rib < 4; rib++) {
          const a = rib * Math.PI / 2
          add(new THREE.CylinderGeometry(.065,.075,2.5,5),0xb1b7a4,x+Math.cos(a)*.25,1.6,z+Math.sin(a)*.25,1,1,1,scene,'stone')
        }
        box(0xc1bda5, x, 3, z, .78, .23, .78, scene, 'stone')
        for (let i = 0; i < 5; i++) add(rock,0x4e7349,x+(random()-.5)*.8,.08,z+(random()-.5)*.8,.13,.075,.15,scene,'foliage')
      }
      // Low pews leave the combat lane and bonfire visible.
      for (const z of [-2.3, 1.3, 4.8]) {
        box(0x615749, side * 2.6, .43, z, 1.25, .18, .45)
        box(0x716351, side * 2.6, .72, z - .18, 1.25, .52, .13)
      }
      for (let i = 0; i < 35; i++) {
        const ripple = box(0x5b7f8a, side * (4.1 + random() * 2), .01, -10 + random() * 22, .3 + random() * .6, .015, .03)
        ornaments.push(ripple)
      }
    }
    for (const z of [-5,.5]) for (let i = 0; i <= 16; i++) {
      if (z === .5 && i > 6 && i < 10) continue
      const a = i / 16 * Math.PI
      const rib = box(i % 3 ? 0x9ca9a0 : 0xb4b7a2,Math.cos(a)*3.25,2.92+Math.sin(a)*1.7,z,.52,.30,.37,scene,'stone')
      rib.rotation.z = Math.atan2(Math.cos(a)*1.7,-Math.sin(a)*3.25)
    }
    // Broken chancel window and central altar.
    box(0x8b8a86, 0, .6, -5.2, 2.4, 1.15, 1.05)
    box(0xc1b79c, 0, 1.22, -5.2, 2.7, .14, 1.2)
    for (let i = 0; i <= 14; i++) {
      const a = i / 14 * Math.PI
      const arch = box(0x8d96a0, Math.cos(a) * 3.25, 2.5 + Math.sin(a) * 3.25, -6.5, .5, .74, .6)
      arch.rotation.z = a - Math.PI / 2
    }
    for (const x of [-3.25, 3.25]) box(0x7e8d9c, x, 1.2, -6.5, .58, 2.4, .6)
    for (const x of [-1.7, -.8, 0, .8, 1.7]) {
      box(x === 0 ? 0xb2abb9 : 0x6a8d99, x, 3, -6.7, .17, 2.9 - Math.abs(x) * .4, .12)
    }
    for (let row = 0; row < 5; row++) for (let col = -2; col <= 2; col++) {
      if ((row + col + 5) % 7 === 0) continue
      const glass = box([0x729c91,0xa67852,0x8a707f][(row+col+5)%3],col*.53,2.02+row*.43,-6.72,.39,.32,.06,scene,'stone')
      ;(glass.material as THREE.MeshStandardMaterial).emissive.copy((glass.material as THREE.MeshStandardMaterial).color).multiplyScalar(.25)
    }
    for (let i = 0; i < 55; i++) {
      const side = i % 2 ? -1 : 1, x = side * (2.8 + random() * .85), z = -8 + random() * 17
      const fragment = add(rock,i%4 ? 0x8a9689 : 0x526f46,x,.055,z,.09+random()*.15,.06+random()*.1,.12+random()*.16,scene,i%4 ? 'stone' : 'foliage')
      fragment.rotation.y = random()*6
    }
    for (const x of [-1, 1]) {
      box(0xd9cbb0, x, 1.54, -5.2, .1, .5, .1)
      add(new THREE.OctahedronGeometry(.08), 0xe6c777, x, 1.87, -5.2, .6, 1.5, .6)
    }
  }
  const camp = new THREE.Vector3(-3, 0, 2.6)
  const campSeat = new THREE.Vector3(-1.8, 0, 2.7)
  const channel = (locationId === 'dark_forest' && !procedural) || locationId === 'sunken_cathedral'
    ? createChannelWater(scene, locationId === 'dark_forest', worldGlyphs) : undefined
  // Camp pieces live in one group (relative to the fire) so the endless
  // forest can pitch the camp wherever the traveller stops to rest.
  const campGroup = new THREE.Group(); campGroup.position.copy(camp); scene.add(campGroup)
  for (let i = 0; i < 9; i++) {
    const angle = i / 9 * Math.PI * 2
    add(rock, 0x68726a, Math.cos(angle) * .53, .08, Math.sin(angle) * .53, .18, .13, .17, campGroup)
  }
  for (const rotation of [-.7, .7]) {
    const log = box(0x484438, 0, .11, 0, .76, .17, .15, campGroup); log.rotation.y = rotation
  }
  const fireLight = new THREE.PointLight(0xffac55, 14, 7, 1.65); fireLight.position.set(camp.x, 1.05, camp.z); scene.add(fireLight)
  // Bedroll and a worn crate, left at the edge of the small camp.
  box(0x6b4a3a, -1.1, .13, .2, .75, .22, 1.3, campGroup)
  box(0x7d6a52, -1.1, .27, -.35, .72, .2, .22, campGroup)
  box(0x646356, -.3, .35, 1.4, .63, .65, .58, campGroup)
  // A low seat facing the fire, positioned clear of the route.
  box(0x78644c, 1.2, .23, .1, .55, .45, .85, campGroup)
  if (procedural) {
    // The lean-to travels with the camp.
    for (let i = 0; i < 10; i++) {
      const plank = box(0x615743, -2.3 + i * .17, 1.35 + Math.abs(i - 4.5) * -.11, .3, .15, .08, 1.75, campGroup)
      plank.rotation.z = i < 5 ? .58 : -.58
    }
    for (const x of [-2.3, -.8]) box(0x55493c, x, .54, .95, .09, 1.1, .09, campGroup)
  }
  /** The bonfire is the start and end of the hunt circuit (s = 0), on the inner side. */
  function pitchCamp() {
    if (!world) return
    const p = world.loop.point(0)
    camp.set(p.x - p.nx * 2.6, 0, p.z - p.nz * 2.6); campSeat.set(p.x - p.nx * 1.4, 0, p.z - p.nz * 1.4)
    campGroup.position.copy(camp); campGroup.rotation.y = Math.atan2(-p.nz, p.nx)
    fireLight.position.set(camp.x, 1.05, camp.z)
    world.soilUniforms.campAt.value.copy(camp)
    campGroup.updateMatrixWorld(true)
  }
  pitchCamp()
  function setHuntLength(length: number) { if (!world) return; world.setLength(length); pitchCamp() }
  // Chunks read the camp clearing when built: pitch first, then let them stream in.

  // Cut away only the geometry crossing a combatant's silhouette. The camera
  // can orbit freely without losing the action behind a timber or pillar.
  scene.updateMatrixWorld(true)
  const occluders: THREE.Object3D[] = []
  const lightObstacles: LightObstacle[] = []
  const bounds = new THREE.Box3()
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object.userData.keepInCutaway) return
    bounds.setFromObject(object)
    // Thin bricks and small leaf clusters can obscure the traveller too.
    if (bounds.max.y > .65 && bounds.max.y - bounds.min.y > .035) occluders.push(object)
    // Only geometry intersecting lantern height blocks sight. Treetops and low
    // rubble must not cast solid walls across the walkable clearing.
    // A faceted rock's bounding box is mostly empty space. Treating it as a
    // solid wall erases its own lit faces and the ore beside it.
    if (object.geometry !== rock && bounds.min.y < 1.2 && bounds.max.y > 1.2) lightObstacles.push({ minX: bounds.min.x, maxX: bounds.max.x, minZ: bounds.min.z, maxZ: bounds.max.z })
  })
  const ray = new THREE.Raycaster(), direction = new THREE.Vector3(), origin = new THREE.Vector3()
  const hidden = new Set<THREE.Object3D>()
  let lastCutaway = -1
  const lastCamera = new THREE.Vector3()
  return {
    snow,
    renderWaterReflection(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera, hero?: THREE.Vector3) {
      swamp?.reflection.render(renderer, camera); channel?.reflection.render(renderer, camera)
      if (world && hero) world.renderWaterReflection(renderer, camera, hero)
    },
    campSeat, camp, lightObstacles, procedural, world, setHuntLength,
    animate(time: number, camera: THREE.Camera, hero: THREE.Vector3, enemy?: THREE.Vector3) {
      world?.update(hero, time)
      swamp?.animate(time)
      channel?.animate(time)
      snow?.animate(time)
      banks?.animate(time)
      lanterns.forEach((lamp, i) => { lamp.rotation.z = Math.sin(time * .8 + i * 2.1) * .035 })
      trees.forEach(tree => tree.animate(time))
      ornaments.forEach((ripple, i) => { ripple.scale.x = .6 + Math.sin(time * 1.4 + i) * .25 })
      fireLight.intensity = (13 + Math.sin(time * 5.3) * 1.1 + Math.sin(time * 8.7 + .8) * .65) * (swamp ? swampWeather(time).fire : 1)
      if (time - lastCutaway > .12 || lastCutaway < 0 || lastCamera.distanceToSquared(camera.position) > .05) {
        lastCutaway = time
        lastCamera.copy(camera.position)
        hidden.forEach((object) => { object.visible = true }); hidden.clear()
        camera.getWorldDirection(direction).negate(); ray.far = 25
        for (const actor of [hero, enemy]) {
          if (!actor) continue
          for (const [height, side] of [[.35, 0], [1, 0], [1.8, 0], [.8, -.42], [.8, .42]]) {
            origin.copy(actor); origin.y += height
            origin.x += direction.z * side; origin.z -= direction.x * side
            ray.set(origin, direction)
            for (const hit of ray.intersectObjects(world ? [...occluders, ...world.occluders] : occluders, false)) hidden.add(hit.object)
          }
        }
        hidden.forEach((object) => { object.visible = false })
      }
    },
    dispose() { swamp?.dispose(); snow?.dispose(); meadow?.dispose(); world?.dispose(); channel?.dispose(); materialCache.forEach((mat) => mat.dispose()) },
  }
}
