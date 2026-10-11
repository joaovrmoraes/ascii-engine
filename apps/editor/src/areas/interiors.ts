import * as THREE from 'three'
import { type AsciiEngine, type GroundCover, type LightObstacle, pomorogInterior } from '@ascii-engine/core'
import { createKit, rock } from '../scene/pomorogKit'
import { createFixedMapActors } from './common'
import type { Area, AreaOptions } from './types'

/**
 * Interiors (Pomorog `environment.ts`, mine and cathedral branches): lit
 * floors with a canvas texture, discovery by lantern sight (obstacles taken
 * from the built scene), the brighter lantern (19). Geometry is ported as is;
 * each piece declares its technique on the node.
 */

/** Lit floors for interiors, so the letters belong to the ground (Pomorog `createLitFloor`). */
function litFloor(locationId: 'old_mine' | 'sunken_cathedral') {
  const palette = locationId === 'old_mine' ? [0x2b241d, 0x3b3128, 0x4a3d2e] : [0x2a302e, 0x343b38, 0x404842]
  const size = 256, canvas = document.createElement('canvas'); canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  let seed = 4127
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  ctx.fillStyle = `#${palette[0].toString(16).padStart(6, '0')}`; ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `#${palette[1 + Math.floor(random() * 2)].toString(16).padStart(6, '0')}`
    const w = 2 + random() * 10; ctx.fillRect(random() * size, random() * size, w, w * (.5 + random()))
  }
  if (locationId === 'sunken_cathedral') {
    // Flagstone joints.
    ctx.strokeStyle = '#1a1e1d'; ctx.lineWidth = 2
    for (let i = 0; i <= size; i += 32) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke() }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(6, 6)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 40), new THREE.MeshStandardMaterial({ map: texture, roughness: 1 }))
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true
  floor.userData.glyph = 'surface'; floor.userData.glyphStyle = { surface: 'earth' }
  return floor
}

/** Only geometry crossing lantern height blocks sight; faceted rocks never do (Pomorog `lightObstacles`). */
function lightObstacles(root: THREE.Object3D) {
  root.updateMatrixWorld(true)
  const list: LightObstacle[] = [], bounds = new THREE.Box3()
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object.geometry === rock) return
    bounds.setFromObject(object)
    if (bounds.min.y < 1.2 && bounds.max.y > 1.2) list.push({ minX: bounds.min.x, maxX: bounds.max.x, minZ: bounds.min.z, maxZ: bounds.max.z })
  })
  return list
}

const pickOf = (list: number[], random: () => number) => list[Math.floor(random() * list.length)]
/** Gravel, dust and glints of ore along the rail bed; walls stay rock. */
const mineCover: GroundCover = {
  count: 26000, y: () => -.03,
  density: (x) => Math.abs(x - .2) < 3.3 ? .75 : 0,
  pick(random) {
    const ore = random() < .05, shade = .45 + random() * .55
    return ore
      ? { glyph: pickOf([6, 7], random), height: .12, color: random() < .5 ? [.85 * shade, .52 * shade, .22 * shade] : [.32 * shade, .62 * shade, .5 * shade] }
      : { glyph: pickOf([8, 9, 8, 7, 9, 5], random), height: .05 + random() * .07, color: [.4 * shade, .36 * shade, .3 * shade] }
  },
}
/** Moss in the cracks and stone dust on the nave floor. */
const cathedralCover: GroundCover = {
  count: 22000, y: () => -.03,
  density: (x) => Math.abs(x) < 3.9 ? .6 : 0,
  pick(random) {
    const moss = random() < .55, shade = .45 + random() * .55
    return moss
      ? { glyph: pickOf([9, 3, 9, 5, 8], random), height: .05 + random() * .08, color: [.24 * shade, .42 * shade, .3 * shade] }
      : { glyph: pickOf([8, 9, 8], random), height: .04 + random() * .04, color: [.42 * shade, .44 * shade, .42 * shade] }
  },
}

function createInterior(engine: AsciiEngine, options: AreaOptions, locationId: 'old_mine' | 'sunken_cathedral'): Area {
  engine.setStyle(pomorogInterior)
  const root = new THREE.Group(); root.name = locationId
  const kit = createKit()
  let seed = 8203
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  const add = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, sx = 1, sy = sx, sz = sx, parent: THREE.Object3D = root, surface?: 'stone' | 'foliage' | 'wood') => kit.add(geometry, color, x, y, z, sx, sy, sz, parent, surface)
  const box = (color: number, x: number, y: number, z: number, w: number, h: number, d: number, parent: THREE.Object3D = root, surface?: 'stone' | 'foliage' | 'wood') => kit.box(color, x, y, z, w, h, d, parent, surface)
  const lanterns: THREE.Group[] = [], ornaments: THREE.Object3D[] = []
  root.add(litFloor(locationId))
  const water = locationId === 'sunken_cathedral' ? engine.createWater({ kind: 'pond', x: 0, z: 0, angle: 0, size: 1 }, {
    // Flooded side aisles (Pomorog `channelWater.ts`, cathedral).
    edgeGLSL: 'float shore=1.48-abs(abs(p.x)-5.2); float inside=(p.z<-10.||p.z>12.)?-1.:shore; float wave=sin(p.z*7.-time*.9+sin(p.x*2.)*.4);',
    crestGLSL: '(1.-smoothstep(0.,.18,inside))*.7+max(0.,wave-.85)',
    flow: [0, .06], size: 30,
    distance: (x, z) => Math.max(0, -(1.48 - Math.abs(Math.abs(x) - 5.2))) + Math.max(0, -10 - z, z - 12),
  }) : undefined
  if (water) { water.mesh.position.set(0, .018, 0); root.add(water.mesh) }
  if (locationId === 'old_mine') {

    // Twin rails, timber supports, a loaded cart and exposed copper veins.
    for (let z = -10; z < 10; z += .62) box(0x82704e, .7, -.005, z, 1.85, .13, .16)
    for (const x of [.05, 1.35]) box(0xa99876, x, .08, 0, .085, .12, 22, root, 'stone')
    for (const z of [-5, -1, 4, 8]) {
      for (const x of [-3.1, 3.5]) {
        box(0x94734a, x, 1.48, z, .26, 2.96, .30)
        for (const y of [.28, 2.62]) box(0x5d655f, x, y, z, .30, .09, .34, root, 'stone')
        const brace = box(0xab8755, x + (x < 0 ? .38 : -.38), 2.53, z, .15, 1.04, .17)
        brace.rotation.z = x < 0 ? -.65 : .65
      }
      box(0x94734a, .2, 3.02, z, 6.95, .24, .32)
    }
    for (let i = 0; i < 65; i++) {
      const x = (i % 2 ? -1 : 1) * (3.85 + random() * 1.4), z = -10 + random() * 22
      const stone = add(rock, [0x666b63, 0x879080, 0x77745a][i % 3], x, random() * .85, z, .4 + random() * .65, .6 + random() * 1.1, .4 + random() * .8, root, 'stone')
      stone.rotation.set(random(), random(), random())
      if (i % 3 === 0) {
        const crystal = add(new THREE.OctahedronGeometry(.5), i % 2 ? 0xbf8746 : 0x639a81, x * .89, .3 + random() * .6, z, .3, .55, .35, root, 'stone')
        crystal.rotation.z = (random() - .5) * .8
      }
    }
    for (const [x,z] of [[-2.88,1],[3.28,-4],[-2.88,6]]) {
      const lamp = new THREE.Group(); lamp.position.set(x, 2.8, z); root.add(lamp); lanterns.push(lamp)
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
      add(rock, i % 4 ? 0x727164 : 0x506d45, x, -.025, z, .05 + random() * .09, .04, .08 + random() * .1, root, i % 4 ? 'stone' : 'foliage')
    }
    const cart = new THREE.Group(); cart.position.set(2.9, 0, -.8); root.add(cart)
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
      const tile = box((x + Math.round(z)) % 2 ? 0x455957 : 0x65716a, x * .87, -.035, z, .82, .09, .87, root, 'stone')
      tile.rotation.y = (random() - .5) * .025
    }
    for (const side of [-1, 1]) {
      box(0x203a48, side * 5.2, -.06, 0, 3.1, .08, 24)
      for (const z of [-5, .5, 6]) {
        const x = side * 3.25
        box(0x929e98, x, .15, z, .87, .3, .87, root, 'stone')
        add(new THREE.CylinderGeometry(.24, .31, 2.65, 8), 0x9baaa4, x, 1.6, z, 1, 1, 1, root, 'stone')
        for (let rib = 0; rib < 4; rib++) {
          const a = rib * Math.PI / 2
          add(new THREE.CylinderGeometry(.065,.075,2.5,5),0xb1b7a4,x+Math.cos(a)*.25,1.6,z+Math.sin(a)*.25,1,1,1,root,'stone')
        }
        box(0xc1bda5, x, 3, z, .78, .23, .78, root, 'stone')
        for (let i = 0; i < 5; i++) add(rock,0x4e7349,x+(random()-.5)*.8,.08,z+(random()-.5)*.8,.13,.075,.15,root,'foliage')
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
      const rib = box(i % 3 ? 0x9ca9a0 : 0xb4b7a2,Math.cos(a)*3.25,2.92+Math.sin(a)*1.7,z,.52,.30,.37,root,'stone')
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
      const glass = box([0x729c91,0xa67852,0x8a707f][(row+col+5)%3],col*.53,2.02+row*.43,-6.72,.39,.32,.06,root,'stone')
      ;(glass.material as THREE.MeshStandardMaterial).emissive.copy((glass.material as THREE.MeshStandardMaterial).color).multiplyScalar(.25)
    }
    for (let i = 0; i < 55; i++) {
      const side = i % 2 ? -1 : 1, x = side * (2.8 + random() * .85), z = -8 + random() * 17
      const fragment = add(rock,i%4 ? 0x8a9689 : 0x526f46,x,.055,z,.09+random()*.15,.06+random()*.1,.12+random()*.16,root,i%4 ? 'stone' : 'foliage')
      fragment.rotation.y = random()*6
    }
    for (const x of [-1, 1]) {
      box(0xd9cbb0, x, 1.54, -5.2, .1, .5, .1)
      add(new THREE.OctahedronGeometry(.08), 0xe6c777, x, 1.87, -5.2, .6, 1.5, .6)
    }
  }
  engine.add(root, options.screen ? { glyph: 'screen' } : {})
  const carpet = engine.createCarpet(locationId === 'old_mine' ? mineCover : cathedralCover)
  if (!options.screen) engine.add(carpet.mesh, { glyph: 'carpet' })
  const actors = createFixedMapActors(engine, options, {
    route: [[-.7, 3.8], [-.7, .6], [-.5, -3.1], [.6, -3.5], [1.7, .4], [1.6, 5.6], [-.7, 5.6]],
    lantern: 19,
  })
  engine.setObstacles(lightObstacles(root))
  return {
    id: locationId, title: locationId === 'old_mine' ? 'Mina Antiga' : 'Catedral Submersa',
    hero: actors.player.root.position,
    state: 'lantern-discovery',
    focus: actors.focus,
    update(time, dt) {
      actors.update(time, dt)
      actors.burn(time)
      lanterns.forEach((lamp, i) => { lamp.rotation.z = Math.sin(time * .8 + i * 2.1) * .035 })
      ornaments.forEach((ripple, i) => { ripple.scale.x = .6 + Math.sin(time * 1.4 + i) * .25 })
    },
    dispose() {},
  }
}

export const createMine = (engine: AsciiEngine, options: AreaOptions = {}) => createInterior(engine, options, 'old_mine')
export const createCathedral = (engine: AsciiEngine, options: AreaOptions = {}) => createInterior(engine, options, 'sunken_cathedral')
