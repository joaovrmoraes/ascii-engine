import * as THREE from 'three'
import { attackPose, damp, footstep, hurtPose, smooth, type ActorMotion } from './motion'
import { createSerpent, createSlime } from './wetlandCreatures'
import { createArthropod, createQuadruped, dressFolk, isArthropod, isQuadruped } from './beasts'

export interface ActorModel {
  root: THREE.Group
  height: number
  waterAnchor?: THREE.Object3D
  feet?: { anchor: THREE.Object3D; step: number; grounded: boolean }[]
  animate: (motion: ActorMotion) => void
}

export function createAdventurer(enemy = false, skeleton = false): ActorModel {
  const root = new THREE.Group(), body = new THREE.Group()
  body.scale.set(enemy ? .72 : .73, 1, 1)
  root.add(body)
  const torso = new THREE.Group(); torso.scale.z = .78; body.add(torso)
  const armor = new THREE.MeshStandardMaterial({ color: enemy ? 0xa19784 : 0xc4b7a1, roughness: .9, flatShading: true })
  const cloth = new THREE.MeshStandardMaterial({ color: enemy ? 0x8a5543 : 0xb65342, roughness: 1, flatShading: true })
  const dark = new THREE.MeshStandardMaterial({ color: 0x292e2d, roughness: 1, flatShading: true })
  const skin = new THREE.MeshStandardMaterial({ color: 0xb2a88d, roughness: 1, flatShading: true })
  const brass = new THREE.MeshStandardMaterial({ color: 0xd4ad67, roughness: .8, flatShading: true })
  function part(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = torso) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    return mesh
  }
  const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = torso) => part(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent)
  const joint = (x: number, y: number, z: number, parent: THREE.Object3D = torso) => { const group = new THREE.Group(); group.position.set(x, y, z); parent.add(group); return group }
  // A small articulated traveller: hood, breastplate, tabard, belt, boots and pack.
  part(new THREE.CylinderGeometry(.245, .19, .59, 8), armor, 0, 1.3, 0)
  box(.36, .12, .29, dark, 0, .99, 0)
  box(.12, .09, .03, armor, 0, 1.01, .2)
  part(new THREE.CylinderGeometry(.20, .245, .34, 8, 1, true), cloth, 0, .88, -.02)
  box(.25, .57, .065, cloth, 0, 1.29, .28)
  box(.3, .39, .16, dark, 0, 1.34, -.24)
  const head = joint(0, 1.78, 0)
  head.scale.setScalar(enemy ? .76 : .81)
  if (skeleton) {
    armor.color.setHex(0xc5c1a7); cloth.color.setHex(0x505469)
    part(new THREE.SphereGeometry(.25, 8, 6), armor, 0, .015, 0, head)
    for (const x of [-.1, .1]) box(.12, .12, .06, dark, x, .03, .23, head)
    box(.09, .09, .05, dark, 0, -.08, .24, head)
    box(.22, .075, .11, armor, 0, -.2, .15, head)
    for (let i = 0; i < 4; i++) box(.37 - i * .025, .045, .09, armor, 0, 1.47 - i * .105, .32)
  } else {
    part(new THREE.SphereGeometry(.27, 7, 6), enemy ? armor : cloth, 0, 0, -.025, head)
    box(.29, .23, .09, dark, 0, -.015, .22, head)
    box(.23, .075, .02, skin, 0, -.065, .272, head)
    for (const x of [-.065, .065]) box(.045, .028, .022, brass, x, .025, .272, head)
    part(new THREE.ConeGeometry(.26, .19, 5), enemy ? armor : cloth, 0, .2, -.05, head)
    box(.38, .12, .33, cloth, 0, 1.57, 0)
    box(.1, .1, .035, brass, -.15, 1.56, .245)
  }
  const arms = [-1, 1].map((side) => {
    const arm = joint(side * .32, 1.48, 0)
    arm.rotation.z = side * .1
    part(new THREE.SphereGeometry(.115, 6, 4), armor, 0, -.03, 0, arm)
    part(new THREE.CylinderGeometry(.085, .067, .34, 6), cloth, 0, -.21, 0, arm)
    const forearm = joint(0, -.36, .015, arm)
    part(new THREE.CylinderGeometry(.078, .06, .3, 6), armor, 0, -.14, 0, forearm)
    part(new THREE.SphereGeometry(.08, 6, 4), dark, 0, -.33, .02, forearm)
    return { arm, forearm }
  })
  const legs = [-1, 1].map((side) => {
    const leg = joint(side * .14, .83, 0, body)
    part(new THREE.CylinderGeometry(.092, .073, .37, 6), cloth, 0, -.17, 0, leg)
    const shin = joint(0, -.36, 0, leg)
    part(new THREE.CylinderGeometry(.1, .08, .3, 6), armor, 0, -.15, 0, shin)
    const boot = box(.14, .13, .25, dark, 0, -.32, .065, shin)
    return { leg, shin, boot }
  })
  // A broad hood, asymmetric shoulder, red cloak and blade read clearly at map scale.
  const sheath = box(.085, .75, .1, dark, -.32, .78, -.04)
  sheath.rotation.z = -.23
  box(.27, .055, .07, armor, -.4, 1.15, -.04)
  if (enemy) {
    const staff = part(new THREE.CylinderGeometry(.04, .045, 1.5, 5), cloth, 0, .12, .1, arms[1].forearm)
    staff.rotation.x = -.12
    part(new THREE.OctahedronGeometry(.07), armor, 0, .88, .02, arms[1].forearm)
  } else {
    const weapon = joint(0, -.28, .06, arms[1].forearm); weapon.rotation.x = -.38
    box(.1, .25, .09, dark, 0, 0, 0, weapon)
    box(.34, .07, .1, brass, 0, .15, 0, weapon)
    const blade = part(new THREE.CylinderGeometry(0, .12, .78, 4), armor, 0, .58, 0, weapon)
    blade.scale.z = .35
    part(new THREE.OctahedronGeometry(.09), brass, 0, -.17, 0, weapon)
    const shoulder = part(new THREE.IcosahedronGeometry(.16, 0), armor, -.33, 1.49, 0)
    shoulder.scale.set(1, .65, 1)
    box(.22, .04, .25, brass, -.33, 1.49, .045)
    box(.12, .55, .045, dark, -.1, 1.28, .33).rotation.z = -.46
    const lantern = joint(-.43, 1.01, .25)
    lantern.name = 'traveller-lantern'
    const flame = new THREE.MeshStandardMaterial({ color: 0xffd695, emissive: 0xffb340, emissiveIntensity: 1.5, roughness: 1 })
    box(.17, .24, .14, flame, 0, 0, 0, lantern)
    for (const y of [-.14, .14]) box(.23, .04, .20, brass, 0, y, 0, lantern)
    for (const x of [-.1, .1]) box(.025, .28, .025, dark, x, 0, .085, lantern)
    part(new THREE.TorusGeometry(.08, .018, 4, 8), brass, 0, .23, 0, lantern)
  }
  // Three hinged cloth panels carry the turn and settle behind the shoulders.
  const cape: THREE.Group[] = []
  let capeParent = joint(0, 1.51, -.31)
  for (let i = 0; i < 3; i++) {
    const segment = joint(0, i ? -.24 : 0, 0, capeParent)
    box((enemy ? .33 : .37) + i * .025, .29, .025, cloth, 0, -.14, 0, segment)
    cape.push(segment); capeParent = segment
  }
  let gait = 0, locomotion = 0, crouch = 0, clothDrag = 0, run = 0
  const feet = legs.map(({ boot }) => ({ anchor: boot, step: 0, grounded: true }))
  return {
    root, height: 2.15, feet,
    animate({ time, dt, speed, distance, attackAge, hurtAge, sitting = 0, looting = false, casting = false, death = 0, wading = false }) {
      if (dt === 0) return
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 10, dt)
      // Jog: longer stride, forward lean, bigger arm swing and bounce.
      run = damp(run, smooth((speed - 1.55) / .9), 6, dt)
      const previousGait = gait
      gait += distance / (1.05 + run * .2)
      crouch = damp(crouch, looting && speed < .15 ? 1 : 0, 5, dt)
      const cycle = gait * Math.PI * 2, walk = locomotion * (1 - sitting)
      const { windup, swing, recoil } = attackPose(attackAge), hurt = hurtPose(hurtAge)
      const breath = Math.sin(time * 1.9)
      const settle = smooth(sitting)
      body.position.y = (Math.cos(cycle * 2) * (.028 + run * .045) - .028 - run * .03) * walk + breath * .009 * (1 - walk) - settle * .52 - crouch * .12 - death * .4
      body.position.x = Math.sin(cycle) * .023 * walk
      body.position.z = -windup * .08 + swing * .34 - hurt * .12
      body.rotation.x = .045 * walk + run * .24 - windup * .08 + swing * .13 - hurt * .17 + settle * .13 + crouch * .42
      body.rotation.z = Math.sin(cycle) * .035 * walk - hurt * .08 + death * 1.45
      torso.rotation.y = Math.sin(cycle) * .13 * walk - windup * .3 + swing * .38
      torso.rotation.z = -Math.sin(cycle) * .018 * walk
      armor.emissive.setRGB(hurt * .42, hurt * .08, hurt * .025)
      arms.forEach(({ arm, forearm }, i) => {
        const armSwing = Math.sin(cycle + i * Math.PI) * walk * (1 + run * .9)
        arm.rotation.x = armSwing * .32 - .08 - settle * .84 - crouch * .58
        arm.rotation.z = (i ? 1 : -1) * (.1 + settle * .1) + breath * .012
        forearm.rotation.x = -.18 - run * .75 - Math.max(0, -armSwing) * .24 - settle * .43
        forearm.rotation.y = 0
        if (i === 1) {
          arm.rotation.x += windup * .7 - swing * (casting ? 1.35 : 1.55) - recoil * .08
          arm.rotation.z += -windup * .24 + swing * .13
          forearm.rotation.x += -windup * 1.15 + swing * .12
          forearm.rotation.y = -windup * .35 + swing * .2
        } else {
          arm.rotation.x -= windup * .25 + swing * .3
          forearm.rotation.x -= windup * .4 + (casting ? swing * .7 : swing * .15)
        }
      })
      legs.forEach(({ leg, shin, boot }, i) => {
        feet[i].step += Math.floor(gait + i * .5) - Math.floor(previousGait + i * .5)
        feet[i].grounded = (gait + i * .5) % 1 < .6
        // One cycle covers 1.05 m; a 60% stance travels .63 m without skating.
        const step = footstep(gait + i * .5, (.63 + run * .12) * walk)
        const z = step.z + (i ? -.08 : .1) * swing
        const down = .68 - step.lift * walk * (wading ? 1.18 : 1) + body.position.y * (1 - settle)
        const reach = Math.min(.719, Math.max(.25, Math.hypot(z, down)))
        const knee = Math.PI - Math.acos(THREE.MathUtils.clamp((.36 ** 2 + .36 ** 2 - reach ** 2) / (2 * .36 ** 2), -1, 1))
        const hip = Math.atan2(-z, down) - knee / 2
        leg.rotation.x = THREE.MathUtils.lerp(hip, -1.5, settle)
        leg.rotation.z = (i ? 1 : -1) * settle * .07
        shin.rotation.x = THREE.MathUtils.lerp(knee, 1.5, settle)
        boot.rotation.x = -(hip + knee) * (1 - settle) + step.lift * walk * .65
      })
      head.rotation.y = Math.sin(time * .65) * .06 * (1 - walk) - torso.rotation.y * .55
      head.rotation.x = settle * .14 + crouch * .3 + windup * .06 - swing * .09 - hurt * .12
      clothDrag = damp(clothDrag, walk * .24 + run * .35 + swing * .24 - windup * .1, 4, dt)
      cape.forEach((segment, i) => {
        segment.rotation.x = .12 + clothDrag + Math.sin(cycle - i * .7) * walk * .07 + Math.sin(time * 2.2 - i * .8) * .025 + settle * .28
        segment.rotation.z = Math.sin(cycle - i * .8) * walk * .035 - torso.rotation.y * .16
      })
    },
  }
}

export function createCreature(family: string, id: string): ActorModel {
  if (/slime/.test(id)) return createSlime()
  if (/serpent|snake/.test(id)) return createSerpent()
  if (isQuadruped(id)) return createQuadruped(id)
  if (isArthropod(id)) return createArthropod(id)
  if (family === 'humanoid' || family === 'undead') return dressFolk(createAdventurer(true, family === 'undead'), id)
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body)
  const hide = new THREE.MeshStandardMaterial({ color: family === 'insect' ? 0xb19968 : 0xb19e89, roughness: 1, flatShading: true })
  const dark = new THREE.MeshStandardMaterial({ color: 0x64534b, roughness: 1, flatShading: true })
  const limbs: THREE.Object3D[] = []
  function ellipsoid(x: number, y: number, z: number, sx: number, sy: number, sz: number, material = hide) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material)
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; body.add(mesh)
    return mesh
  }
  const snail = /snail/.test(id), grub = /grub/.test(id)
  const eye = /gazer|watcher|seraph/.test(id), elemental = family === 'elemental'
  if (eye) {
    hide.color.setHex(0xaeb0c0); dark.color.setHex(0x554863)
    ellipsoid(0, 1.1, 0, .63, .55, .55)
    ellipsoid(0, 1.12, .48, .32, .34, .13, dark)
    const iris = new THREE.MeshStandardMaterial({ color: 0xd5bb73, emissive: 0x34290e })
    ellipsoid(0, 1.12, .59, .19, .23, .04, iris)
    ellipsoid(0, 1.12, .63, .08, .16, .025, dark)
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2
      const tendril = new THREE.Mesh(new THREE.ConeGeometry(.11, .85, 6), dark)
      tendril.position.set(Math.cos(a) * .38, .46, Math.sin(a) * .35)
      tendril.rotation.z = Math.PI + Math.cos(a) * .4; body.add(tendril); limbs.push(tendril)
    }
  } else if (elemental) {
    hide.color.setHex(0xda9c5a); hide.emissive.setHex(0x63300c)
    ellipsoid(0, .95, 0, .34, .53, .32)
    ellipsoid(0, 1.5, .02, .27, .25, .24)
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(.13, .43, 5), dark)
      horn.position.set(side * .24, 1.72, .01); horn.rotation.z = side * -.4; body.add(horn)
      ellipsoid(side * .11, 1.52, .24, .065, .07, .03, dark)
      limbs.push(ellipsoid(side * .45, .92, 0, .13, .38, .15))
      const flame = new THREE.Mesh(new THREE.ConeGeometry(.15, .7, 5), hide)
      flame.position.set(side * .19, .35, -.08); flame.rotation.z = side * .3; body.add(flame); limbs.push(flame)
    }
  } else if (snail) {
    // A low foot, two eye stalks and a coiled shell read as a snail in ASCII.
    ellipsoid(0, .17, .15, .32, .16, .85, dark)
    ellipsoid(0, .65, -.12, .4, .56, .58)
    const spiralMaterial = new THREE.MeshStandardMaterial({ color: 0x503b2c, roughness: 1 })
    for (const side of [-1, 1]) {
      const points = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64, radius = .025 + t * .49, angle = t * Math.PI * 4
        return new THREE.Vector3(side * .41 * Math.sqrt(1 - (radius / .6) ** 2), .65 + Math.cos(angle) * radius, -.12 + Math.sin(angle) * radius)
      })
      body.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, .038, 5, false), spiralMaterial))
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(.035, .05, .43, 6), dark)
      stalk.position.set(side * .16, .47, .78); stalk.rotation.z = side * -.3; body.add(stalk); limbs.push(stalk)
      ellipsoid(side * .22, .69, .78, .065, .07, .065)
    }
  } else if (grub) {
    hide.color.setHex(0xb87261)
    for (let i = 0; i < 7; i++) limbs.push(ellipsoid(0, .25, .72 - i * .22, .3, .26, .22))
    ellipsoid(0, .27, .93, .22, .2, .19, dark)
  } else if (family === 'insect') {
    ellipsoid(0, .42, 0, .47, .33, .65)
    ellipsoid(0, .4, .63, .27, .23, .27, dark)
    const legs = /spider/.test(id) ? 4 : 3
    for (const side of [-1, 1]) for (let i = 0; i < legs; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.035, .025, .75, 5), dark)
      leg.position.set(side * .5, .25, -.4 + i * .8 / (legs - 1)); leg.rotation.z = side * 1.1; body.add(leg); limbs.push(leg)
    }
  } else {
    ellipsoid(0, .73, 0, .31, .4, .65)
    ellipsoid(0, .91, .58, .25, .28, .33)
    ellipsoid(0, .78, .89, .16, .14, .26, dark)
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(.1, .29, 4), dark)
      ear.position.set(side * .17, 1.2, .5); body.add(ear)
      for (const z of [-.43, .4]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(.08, .055, .57, 5), dark)
        leg.position.set(side * .23, .31, z); leg.castShadow = true; body.add(leg); limbs.push(leg)
      }
    }
    const tail = new THREE.Mesh(new THREE.ConeGeometry(.13, .65, 6), dark)
    tail.position.set(0, .7, -.84); tail.rotation.x = -1.1; body.add(tail)
  }
  const rest = limbs.map((limb) => ({ position: limb.position.clone(), rotation: limb.rotation.clone() }))
  const baseGlow = hide.emissive.clone()
  let gait = 0, locomotion = 0
  return {
    root, waterAnchor: body, height: eye ? 1.9 : elemental ? 2.1 : family === 'insect' ? 1.1 : grub ? .7 : snail ? 1.35 : 1.5,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }) {
      gait += distance / (family === 'insect' ? .52 : .85)
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing } = attackPose(attackAge), hurt = hurtPose(hurtAge)
      const floating = eye || elemental, stride = gait * Math.PI * 2
      body.position.y = Math.sin(time * 2.2) * (floating ? .12 : .035) + Math.cos(stride * 2) * .045 * locomotion - death * (floating ? .85 : .18)
      body.position.z = -windup * .15 + swing * .45 - hurt * .13
      body.rotation.x = windup * .2 - swing * .26 - hurt * .2 + Math.sin(time * 1.7) * .035
      body.rotation.z = death * 1.35 + Math.sin(time * 1.4) * .025 * (1 - death)
      body.scale.set(1, 1, 1)
      hide.emissive.copy(baseGlow); hide.emissive.r += hurt * .4; hide.emissive.g += hurt * .08
      limbs.forEach((limb, i) => {
        const base = rest[i], phase = stride + (i % 2) * Math.PI + Math.floor(i / 2) * .6
        limb.position.copy(base.position); limb.rotation.copy(base.rotation)
        if (eye) {
          limb.rotation.x += Math.sin(time * 2.1 - i * .65) * .18 + swing * .3
          limb.rotation.z += Math.sin(time * 1.6 - i * .7) * .12
        } else if (elemental) {
          limb.rotation.x += Math.sin(time * 2.6 + i * 1.8) * .16 - swing * .65
          limb.position.y += Math.sin(time * 3 - i) * .05
        } else if (snail) {
          limb.rotation.x += Math.sin(time * 1.3 + i) * .09 - windup * .3
        } else if (grub) {
          limb.position.x += Math.sin(time * 2.5 - i * .65) * (.025 + locomotion * .12)
          limb.position.y += Math.sin(time * 3 - i * .75) * .025
        } else if (family === 'insect') {
          limb.rotation.y += Math.sin(phase) * .28 * locomotion
          limb.rotation.z += Math.max(0, Math.sin(phase)) * .18 * locomotion * (base.position.x > 0 ? -1 : 1)
          limb.rotation.x += Math.sin(time * 2.2 - i * .7) * .12 * (1 - locomotion) - swing * .3
        } else {
          limb.rotation.x += Math.sin(phase) * .52 * locomotion - swing * .15
          limb.position.y += Math.max(0, Math.sin(phase)) * .07 * locomotion
        }
      })
    },
  }
}
