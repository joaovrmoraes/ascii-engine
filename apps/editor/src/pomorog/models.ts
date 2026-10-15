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
  const root = new THREE.Group(),
    body = new THREE.Group()
  body.scale.set(enemy ? 0.72 : 0.73, 1, 1)
  root.add(body)
  const torso = new THREE.Group()
  torso.scale.z = 0.78
  body.add(torso)
  const armor = new THREE.MeshStandardMaterial({
    color: enemy ? 0xa19784 : 0xc4b7a1,
    roughness: 0.9,
    flatShading: true,
  })
  const cloth = new THREE.MeshStandardMaterial({
    color: enemy ? 0x8a5543 : 0xb65342,
    roughness: 1,
    flatShading: true,
  })
  const dark = new THREE.MeshStandardMaterial({ color: 0x292e2d, roughness: 1, flatShading: true })
  const skin = new THREE.MeshStandardMaterial({ color: 0xb2a88d, roughness: 1, flatShading: true })
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4ad67,
    roughness: 0.8,
    flatShading: true,
  })
  function part(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = torso,
  ) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  const box = (
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = torso,
  ) => part(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent)
  const joint = (x: number, y: number, z: number, parent: THREE.Object3D = torso) => {
    const group = new THREE.Group()
    group.position.set(x, y, z)
    parent.add(group)
    return group
  }
  // A small articulated traveller: hood, breastplate, tabard, belt, boots and pack.
  part(new THREE.CylinderGeometry(0.245, 0.19, 0.59, 8), armor, 0, 1.3, 0)
  box(0.36, 0.12, 0.29, dark, 0, 0.99, 0)
  box(0.12, 0.09, 0.03, armor, 0, 1.01, 0.2)
  part(new THREE.CylinderGeometry(0.2, 0.245, 0.34, 8, 1, true), cloth, 0, 0.88, -0.02)
  box(0.25, 0.57, 0.065, cloth, 0, 1.29, 0.28)
  box(0.3, 0.39, 0.16, dark, 0, 1.34, -0.24)
  const head = joint(0, 1.78, 0)
  head.scale.setScalar(enemy ? 0.76 : 0.81)
  if (skeleton) {
    armor.color.setHex(0xc5c1a7)
    cloth.color.setHex(0x505469)
    part(new THREE.SphereGeometry(0.25, 8, 6), armor, 0, 0.015, 0, head)
    for (const x of [-0.1, 0.1]) box(0.12, 0.12, 0.06, dark, x, 0.03, 0.23, head)
    box(0.09, 0.09, 0.05, dark, 0, -0.08, 0.24, head)
    box(0.22, 0.075, 0.11, armor, 0, -0.2, 0.15, head)
    for (let i = 0; i < 4; i++) box(0.37 - i * 0.025, 0.045, 0.09, armor, 0, 1.47 - i * 0.105, 0.32)
  } else {
    part(new THREE.SphereGeometry(0.27, 7, 6), enemy ? armor : cloth, 0, 0, -0.025, head)
    box(0.29, 0.23, 0.09, dark, 0, -0.015, 0.22, head)
    box(0.23, 0.075, 0.02, skin, 0, -0.065, 0.272, head)
    for (const x of [-0.065, 0.065]) box(0.045, 0.028, 0.022, brass, x, 0.025, 0.272, head)
    part(new THREE.ConeGeometry(0.26, 0.19, 5), enemy ? armor : cloth, 0, 0.2, -0.05, head)
    box(0.38, 0.12, 0.33, cloth, 0, 1.57, 0)
    box(0.1, 0.1, 0.035, brass, -0.15, 1.56, 0.245)
  }
  const arms = [-1, 1].map(side => {
    const arm = joint(side * 0.32, 1.48, 0)
    arm.rotation.z = side * 0.1
    part(new THREE.SphereGeometry(0.115, 6, 4), armor, 0, -0.03, 0, arm)
    part(new THREE.CylinderGeometry(0.085, 0.067, 0.34, 6), cloth, 0, -0.21, 0, arm)
    const forearm = joint(0, -0.36, 0.015, arm)
    part(new THREE.CylinderGeometry(0.078, 0.06, 0.3, 6), armor, 0, -0.14, 0, forearm)
    part(new THREE.SphereGeometry(0.08, 6, 4), dark, 0, -0.33, 0.02, forearm)
    return { arm, forearm }
  })
  const legs = [-1, 1].map(side => {
    const leg = joint(side * 0.14, 0.83, 0, body)
    part(new THREE.CylinderGeometry(0.092, 0.073, 0.37, 6), cloth, 0, -0.17, 0, leg)
    const shin = joint(0, -0.36, 0, leg)
    part(new THREE.CylinderGeometry(0.1, 0.08, 0.3, 6), armor, 0, -0.15, 0, shin)
    const boot = box(0.14, 0.13, 0.25, dark, 0, -0.32, 0.065, shin)
    return { leg, shin, boot }
  })
  // A broad hood, asymmetric shoulder, red cloak and blade read clearly at map scale.
  const sheath = box(0.085, 0.75, 0.1, dark, -0.32, 0.78, -0.04)
  sheath.rotation.z = -0.23
  box(0.27, 0.055, 0.07, armor, -0.4, 1.15, -0.04)
  if (enemy) {
    const staff = part(
      new THREE.CylinderGeometry(0.04, 0.045, 1.5, 5),
      cloth,
      0,
      0.12,
      0.1,
      arms[1].forearm,
    )
    staff.rotation.x = -0.12
    part(new THREE.OctahedronGeometry(0.07), armor, 0, 0.88, 0.02, arms[1].forearm)
  } else {
    const weapon = joint(0, -0.28, 0.06, arms[1].forearm)
    weapon.rotation.x = -0.38
    box(0.1, 0.25, 0.09, dark, 0, 0, 0, weapon)
    box(0.34, 0.07, 0.1, brass, 0, 0.15, 0, weapon)
    const blade = part(new THREE.CylinderGeometry(0, 0.12, 0.78, 4), armor, 0, 0.58, 0, weapon)
    blade.scale.z = 0.35
    part(new THREE.OctahedronGeometry(0.09), brass, 0, -0.17, 0, weapon)
    const shoulder = part(new THREE.IcosahedronGeometry(0.16, 0), armor, -0.33, 1.49, 0)
    shoulder.scale.set(1, 0.65, 1)
    box(0.22, 0.04, 0.25, brass, -0.33, 1.49, 0.045)
    box(0.12, 0.55, 0.045, dark, -0.1, 1.28, 0.33).rotation.z = -0.46
    const lantern = joint(-0.43, 1.01, 0.25)
    lantern.name = 'traveller-lantern'
    const flame = new THREE.MeshStandardMaterial({
      color: 0xffd695,
      emissive: 0xffb340,
      emissiveIntensity: 1.5,
      roughness: 1,
    })
    box(0.17, 0.24, 0.14, flame, 0, 0, 0, lantern)
    for (const y of [-0.14, 0.14]) box(0.23, 0.04, 0.2, brass, 0, y, 0, lantern)
    for (const x of [-0.1, 0.1]) box(0.025, 0.28, 0.025, dark, x, 0, 0.085, lantern)
    part(new THREE.TorusGeometry(0.08, 0.018, 4, 8), brass, 0, 0.23, 0, lantern)
  }
  // Three hinged cloth panels carry the turn and settle behind the shoulders.
  const cape: THREE.Group[] = []
  let capeParent = joint(0, 1.51, -0.31)
  for (let i = 0; i < 3; i++) {
    const segment = joint(0, i ? -0.24 : 0, 0, capeParent)
    box((enemy ? 0.33 : 0.37) + i * 0.025, 0.29, 0.025, cloth, 0, -0.14, 0, segment)
    cape.push(segment)
    capeParent = segment
  }
  let gait = 0,
    locomotion = 0,
    crouch = 0,
    clothDrag = 0,
    run = 0
  const feet = legs.map(({ boot }) => ({ anchor: boot, step: 0, grounded: true }))
  return {
    root,
    height: 2.15,
    feet,
    animate({
      time,
      dt,
      speed,
      distance,
      attackAge,
      hurtAge,
      sitting = 0,
      looting = false,
      casting = false,
      death = 0,
      wading = false,
    }) {
      if (dt === 0) return
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 10, dt)
      // Jog: longer stride, forward lean, bigger arm swing and bounce.
      run = damp(run, smooth((speed - 1.55) / 0.9), 6, dt)
      const previousGait = gait
      gait += distance / (1.05 + run * 0.2)
      crouch = damp(crouch, looting && speed < 0.15 ? 1 : 0, 5, dt)
      const cycle = gait * Math.PI * 2,
        walk = locomotion * (1 - sitting)
      const { windup, swing, recoil } = attackPose(attackAge),
        hurt = hurtPose(hurtAge)
      const breath = Math.sin(time * 1.9)
      const settle = smooth(sitting)
      body.position.y =
        (Math.cos(cycle * 2) * (0.028 + run * 0.045) - 0.028 - run * 0.03) * walk +
        breath * 0.009 * (1 - walk) -
        settle * 0.52 -
        crouch * 0.12 -
        death * 0.4
      body.position.x = Math.sin(cycle) * 0.023 * walk
      body.position.z = -windup * 0.08 + swing * 0.34 - hurt * 0.12
      body.rotation.x =
        0.045 * walk +
        run * 0.24 -
        windup * 0.08 +
        swing * 0.13 -
        hurt * 0.17 +
        settle * 0.13 +
        crouch * 0.42
      body.rotation.z = Math.sin(cycle) * 0.035 * walk - hurt * 0.08 + death * 1.45
      torso.rotation.y = Math.sin(cycle) * 0.13 * walk - windup * 0.3 + swing * 0.38
      torso.rotation.z = -Math.sin(cycle) * 0.018 * walk
      armor.emissive.setRGB(hurt * 0.42, hurt * 0.08, hurt * 0.025)
      arms.forEach(({ arm, forearm }, i) => {
        const armSwing = Math.sin(cycle + i * Math.PI) * walk * (1 + run * 0.9)
        arm.rotation.x = armSwing * 0.32 - 0.08 - settle * 0.84 - crouch * 0.58
        arm.rotation.z = (i ? 1 : -1) * (0.1 + settle * 0.1) + breath * 0.012
        forearm.rotation.x = -0.18 - run * 0.75 - Math.max(0, -armSwing) * 0.24 - settle * 0.43
        forearm.rotation.y = 0
        if (i === 1) {
          arm.rotation.x += windup * 0.7 - swing * (casting ? 1.35 : 1.55) - recoil * 0.08
          arm.rotation.z += -windup * 0.24 + swing * 0.13
          forearm.rotation.x += -windup * 1.15 + swing * 0.12
          forearm.rotation.y = -windup * 0.35 + swing * 0.2
        } else {
          arm.rotation.x -= windup * 0.25 + swing * 0.3
          forearm.rotation.x -= windup * 0.4 + (casting ? swing * 0.7 : swing * 0.15)
        }
      })
      legs.forEach(({ leg, shin, boot }, i) => {
        feet[i].step += Math.floor(gait + i * 0.5) - Math.floor(previousGait + i * 0.5)
        feet[i].grounded = (gait + i * 0.5) % 1 < 0.6
        // One cycle covers 1.05 m; a 60% stance travels .63 m without skating.
        const step = footstep(gait + i * 0.5, (0.63 + run * 0.12) * walk)
        const z = step.z + (i ? -0.08 : 0.1) * swing
        const down = 0.68 - step.lift * walk * (wading ? 1.18 : 1) + body.position.y * (1 - settle)
        const reach = Math.min(0.719, Math.max(0.25, Math.hypot(z, down)))
        const knee =
          Math.PI -
          Math.acos(
            THREE.MathUtils.clamp((0.36 ** 2 + 0.36 ** 2 - reach ** 2) / (2 * 0.36 ** 2), -1, 1),
          )
        const hip = Math.atan2(-z, down) - knee / 2
        leg.rotation.x = THREE.MathUtils.lerp(hip, -1.5, settle)
        leg.rotation.z = (i ? 1 : -1) * settle * 0.07
        shin.rotation.x = THREE.MathUtils.lerp(knee, 1.5, settle)
        boot.rotation.x = -(hip + knee) * (1 - settle) + step.lift * walk * 0.65
      })
      head.rotation.y = Math.sin(time * 0.65) * 0.06 * (1 - walk) - torso.rotation.y * 0.55
      head.rotation.x = settle * 0.14 + crouch * 0.3 + windup * 0.06 - swing * 0.09 - hurt * 0.12
      clothDrag = damp(clothDrag, walk * 0.24 + run * 0.35 + swing * 0.24 - windup * 0.1, 4, dt)
      cape.forEach((segment, i) => {
        segment.rotation.x =
          0.12 +
          clothDrag +
          Math.sin(cycle - i * 0.7) * walk * 0.07 +
          Math.sin(time * 2.2 - i * 0.8) * 0.025 +
          settle * 0.28
        segment.rotation.z = Math.sin(cycle - i * 0.8) * walk * 0.035 - torso.rotation.y * 0.16
      })
    },
  }
}

export function createCreature(family: string, id: string): ActorModel {
  if (/slime/.test(id)) return createSlime()
  if (/serpent|snake/.test(id)) return createSerpent()
  if (isQuadruped(id)) return createQuadruped(id)
  if (isArthropod(id)) return createArthropod(id)
  if (family === 'humanoid' || family === 'undead')
    return dressFolk(createAdventurer(true, family === 'undead'), id)
  const root = new THREE.Group(),
    body = new THREE.Group()
  root.add(body)
  const hide = new THREE.MeshStandardMaterial({
    color: family === 'insect' ? 0xb19968 : 0xb19e89,
    roughness: 1,
    flatShading: true,
  })
  const dark = new THREE.MeshStandardMaterial({ color: 0x64534b, roughness: 1, flatShading: true })
  const limbs: THREE.Object3D[] = []
  function ellipsoid(
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    material = hide,
  ) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material)
    mesh.position.set(x, y, z)
    mesh.scale.set(sx, sy, sz)
    mesh.castShadow = true
    body.add(mesh)
    return mesh
  }
  const snail = /snail/.test(id),
    grub = /grub/.test(id)
  const eye = /gazer|watcher|seraph/.test(id),
    elemental = family === 'elemental'
  if (eye) {
    hide.color.setHex(0xaeb0c0)
    dark.color.setHex(0x554863)
    ellipsoid(0, 1.1, 0, 0.63, 0.55, 0.55)
    ellipsoid(0, 1.12, 0.48, 0.32, 0.34, 0.13, dark)
    const iris = new THREE.MeshStandardMaterial({ color: 0xd5bb73, emissive: 0x34290e })
    ellipsoid(0, 1.12, 0.59, 0.19, 0.23, 0.04, iris)
    ellipsoid(0, 1.12, 0.63, 0.08, 0.16, 0.025, dark)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const tendril = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.85, 6), dark)
      tendril.position.set(Math.cos(a) * 0.38, 0.46, Math.sin(a) * 0.35)
      tendril.rotation.z = Math.PI + Math.cos(a) * 0.4
      body.add(tendril)
      limbs.push(tendril)
    }
  } else if (elemental) {
    hide.color.setHex(0xda9c5a)
    hide.emissive.setHex(0x63300c)
    ellipsoid(0, 0.95, 0, 0.34, 0.53, 0.32)
    ellipsoid(0, 1.5, 0.02, 0.27, 0.25, 0.24)
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.43, 5), dark)
      horn.position.set(side * 0.24, 1.72, 0.01)
      horn.rotation.z = side * -0.4
      body.add(horn)
      ellipsoid(side * 0.11, 1.52, 0.24, 0.065, 0.07, 0.03, dark)
      limbs.push(ellipsoid(side * 0.45, 0.92, 0, 0.13, 0.38, 0.15))
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.7, 5), hide)
      flame.position.set(side * 0.19, 0.35, -0.08)
      flame.rotation.z = side * 0.3
      body.add(flame)
      limbs.push(flame)
    }
  } else if (snail) {
    // A low foot, two eye stalks and a coiled shell read as a snail in ASCII.
    ellipsoid(0, 0.17, 0.15, 0.32, 0.16, 0.85, dark)
    ellipsoid(0, 0.65, -0.12, 0.4, 0.56, 0.58)
    const spiralMaterial = new THREE.MeshStandardMaterial({ color: 0x503b2c, roughness: 1 })
    for (const side of [-1, 1]) {
      const points = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64,
          radius = 0.025 + t * 0.49,
          angle = t * Math.PI * 4
        return new THREE.Vector3(
          side * 0.41 * Math.sqrt(1 - (radius / 0.6) ** 2),
          0.65 + Math.cos(angle) * radius,
          -0.12 + Math.sin(angle) * radius,
        )
      })
      body.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, 0.038, 5, false),
          spiralMaterial,
        ),
      )
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.43, 6), dark)
      stalk.position.set(side * 0.16, 0.47, 0.78)
      stalk.rotation.z = side * -0.3
      body.add(stalk)
      limbs.push(stalk)
      ellipsoid(side * 0.22, 0.69, 0.78, 0.065, 0.07, 0.065)
    }
  } else if (grub) {
    hide.color.setHex(0xb87261)
    for (let i = 0; i < 7; i++) limbs.push(ellipsoid(0, 0.25, 0.72 - i * 0.22, 0.3, 0.26, 0.22))
    ellipsoid(0, 0.27, 0.93, 0.22, 0.2, 0.19, dark)
  } else if (family === 'insect') {
    ellipsoid(0, 0.42, 0, 0.47, 0.33, 0.65)
    ellipsoid(0, 0.4, 0.63, 0.27, 0.23, 0.27, dark)
    const legs = /spider/.test(id) ? 4 : 3
    for (const side of [-1, 1])
      for (let i = 0; i < legs; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.75, 5), dark)
        leg.position.set(side * 0.5, 0.25, -0.4 + (i * 0.8) / (legs - 1))
        leg.rotation.z = side * 1.1
        body.add(leg)
        limbs.push(leg)
      }
  } else {
    ellipsoid(0, 0.73, 0, 0.31, 0.4, 0.65)
    ellipsoid(0, 0.91, 0.58, 0.25, 0.28, 0.33)
    ellipsoid(0, 0.78, 0.89, 0.16, 0.14, 0.26, dark)
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.29, 4), dark)
      ear.position.set(side * 0.17, 1.2, 0.5)
      body.add(ear)
      for (const z of [-0.43, 0.4]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.055, 0.57, 5), dark)
        leg.position.set(side * 0.23, 0.31, z)
        leg.castShadow = true
        body.add(leg)
        limbs.push(leg)
      }
    }
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.65, 6), dark)
    tail.position.set(0, 0.7, -0.84)
    tail.rotation.x = -1.1
    body.add(tail)
  }
  const rest = limbs.map(limb => ({
    position: limb.position.clone(),
    rotation: limb.rotation.clone(),
  }))
  const baseGlow = hide.emissive.clone()
  let gait = 0,
    locomotion = 0
  return {
    root,
    waterAnchor: body,
    height: eye
      ? 1.9
      : elemental
        ? 2.1
        : family === 'insect'
          ? 1.1
          : grub
            ? 0.7
            : snail
              ? 1.35
              : 1.5,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }) {
      gait += distance / (family === 'insect' ? 0.52 : 0.85)
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing } = attackPose(attackAge),
        hurt = hurtPose(hurtAge)
      const floating = eye || elemental,
        stride = gait * Math.PI * 2
      body.position.y =
        Math.sin(time * 2.2) * (floating ? 0.12 : 0.035) +
        Math.cos(stride * 2) * 0.045 * locomotion -
        death * (floating ? 0.85 : 0.18)
      body.position.z = -windup * 0.15 + swing * 0.45 - hurt * 0.13
      body.rotation.x = windup * 0.2 - swing * 0.26 - hurt * 0.2 + Math.sin(time * 1.7) * 0.035
      body.rotation.z = death * 1.35 + Math.sin(time * 1.4) * 0.025 * (1 - death)
      body.scale.set(1, 1, 1)
      hide.emissive.copy(baseGlow)
      hide.emissive.r += hurt * 0.4
      hide.emissive.g += hurt * 0.08
      limbs.forEach((limb, i) => {
        const base = rest[i],
          phase = stride + (i % 2) * Math.PI + Math.floor(i / 2) * 0.6
        limb.position.copy(base.position)
        limb.rotation.copy(base.rotation)
        if (eye) {
          limb.rotation.x += Math.sin(time * 2.1 - i * 0.65) * 0.18 + swing * 0.3
          limb.rotation.z += Math.sin(time * 1.6 - i * 0.7) * 0.12
        } else if (elemental) {
          limb.rotation.x += Math.sin(time * 2.6 + i * 1.8) * 0.16 - swing * 0.65
          limb.position.y += Math.sin(time * 3 - i) * 0.05
        } else if (snail) {
          limb.rotation.x += Math.sin(time * 1.3 + i) * 0.09 - windup * 0.3
        } else if (grub) {
          limb.position.x += Math.sin(time * 2.5 - i * 0.65) * (0.025 + locomotion * 0.12)
          limb.position.y += Math.sin(time * 3 - i * 0.75) * 0.025
        } else if (family === 'insect') {
          limb.rotation.y += Math.sin(phase) * 0.28 * locomotion
          limb.rotation.z +=
            Math.max(0, Math.sin(phase)) * 0.18 * locomotion * (base.position.x > 0 ? -1 : 1)
          limb.rotation.x += Math.sin(time * 2.2 - i * 0.7) * 0.12 * (1 - locomotion) - swing * 0.3
        } else {
          limb.rotation.x += Math.sin(phase) * 0.52 * locomotion - swing * 0.15
          limb.position.y += Math.max(0, Math.sin(phase)) * 0.07 * locomotion
        }
      })
    },
  }
}
