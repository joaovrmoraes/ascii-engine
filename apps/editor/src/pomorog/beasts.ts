import * as THREE from 'three'
import { attackPose, damp, hurtPose, type ActorMotion } from './motion'
import type { ActorModel } from './models'

/**
 * Articulated creatures: joints instead of glued ellipsoids, species palettes
 * and silhouettes that survive the screen-pass ASCII (ears, snout, mane,
 * horns, legs with knees, segmented tails and abdomens).
 */
type Mat = THREE.MeshStandardMaterial
const mat = (color: number, emissive = 0, intensity = 1) =>
  new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: intensity,
    roughness: 1,
    flatShading: true,
  })
const geo = {
  ball: new THREE.IcosahedronGeometry(1, 1),
  cone: new THREE.ConeGeometry(1, 1, 6),
  limb: new THREE.CylinderGeometry(0.75, 1, 1, 6),
  box: new THREE.BoxGeometry(1, 1, 1),
}

function part(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: Mat,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy = sx,
  sz = sx,
) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.scale.set(sx, sy, sz)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}
function joint(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  parent.add(g)
  return g
}
/** A bone hanging down from its joint (y = 0 to -length). */
function bone(
  parent: THREE.Object3D,
  material: Mat,
  length: number,
  top: number,
  bottom = top * 0.7,
) {
  const m = part(parent, geo.limb, material, 0, -length / 2, 0, 1, length, 1)
  m.scale.set((top + bottom) / 2, length, (top + bottom) / 2)
  return m
}

interface QuadSpec {
  hide: number
  belly: number
  dark: number
  eye: number
  size: number
  length: number
  legs: number
  neck: number
  snout: number
  ears?: 'pointed' | 'round' | 'none'
  mane?: number
  horns?: 'curl' | 'spike' | 'none'
  tusks?: boolean
  tail?: 'long' | 'short' | 'tuft'
  spines?: boolean
  stripes?: number
  jaw?: number
}
const QUAD: Record<string, QuadSpec> = {
  forest_wolf: {
    hide: 0x6f6a64,
    belly: 0xb7ab97,
    dark: 0x302c2a,
    eye: 0xe8c45a,
    size: 1,
    length: 1,
    legs: 1,
    neck: 0.9,
    snout: 1,
    ears: 'pointed',
    tail: 'long',
  },
  dire_wolf: {
    hide: 0x3f4247,
    belly: 0x8b8f93,
    dark: 0x1d1e21,
    eye: 0xff5a3a,
    size: 1.3,
    length: 1.05,
    legs: 1.05,
    neck: 0.95,
    snout: 1.1,
    ears: 'pointed',
    tail: 'long',
    spines: true,
  },
  thicket_panther: {
    hide: 0x2e3a2c,
    belly: 0x5f6d4f,
    dark: 0x141a14,
    eye: 0x9cf06a,
    size: 1.05,
    length: 1.25,
    legs: 0.9,
    neck: 0.8,
    snout: 0.7,
    ears: 'round',
    tail: 'long',
    stripes: 0x1a2318,
  },
  gilded_lion: {
    hide: 0xc49a4c,
    belly: 0xe2c784,
    dark: 0x5e3d1d,
    eye: 0xfff0a0,
    size: 1.3,
    length: 1.15,
    legs: 1,
    neck: 0.85,
    snout: 0.8,
    ears: 'round',
    mane: 0x8e5a24,
    tail: 'tuft',
  },
  tusk_brute: {
    hide: 0x6e4f3d,
    belly: 0x9a7a62,
    dark: 0x2f2119,
    eye: 0xff8a40,
    size: 1.35,
    length: 1.05,
    legs: 0.8,
    neck: 0.6,
    snout: 0.9,
    ears: 'pointed',
    tusks: true,
    tail: 'short',
    spines: true,
  },
  horned_maw: {
    hide: 0x7c3b33,
    belly: 0xc58c6c,
    dark: 0x2a1512,
    eye: 0xffd24a,
    size: 1.15,
    length: 0.95,
    legs: 0.85,
    neck: 0.7,
    snout: 1.2,
    ears: 'none',
    horns: 'curl',
    tail: 'short',
    jaw: 1.6,
  },
  stone_wyrm: {
    hide: 0x5f6662,
    belly: 0x9aa197,
    dark: 0x2a2e2c,
    eye: 0x7fe0ff,
    size: 1.4,
    length: 1.5,
    legs: 0.65,
    neck: 1.2,
    snout: 1.15,
    ears: 'none',
    horns: 'spike',
    tail: 'long',
    spines: true,
  },
}

export function createQuadruped(id: string): ActorModel {
  const s = QUAD[id] ?? QUAD.forest_wolf
  const hide = mat(s.hide),
    belly = mat(s.belly),
    dark = mat(s.dark),
    eyeMat = mat(s.eye, s.eye, 0.9)
  const root = new THREE.Group(),
    body = joint(root, 0, 0, 0)
  body.scale.setScalar(s.size)
  const L = 0.5 * s.length,
    H = 0.62 * s.legs
  // Spine: hips → chest, with the chest slightly higher like a stalking animal.
  const hips = joint(body, 0, H, -L),
    chest = joint(body, 0, H + 0.06, L * 0.55)
  part(hips, geo.ball, hide, 0, 0.05, 0, 0.27, 0.27, 0.34)
  part(body, geo.ball, hide, 0, H + 0.05, -L * 0.2, 0.26, 0.25, 0.42)
  part(body, geo.ball, belly, 0, H - 0.07, -L * 0.1, 0.2, 0.14, 0.4)
  part(chest, geo.ball, hide, 0, 0.05, 0, 0.3, 0.32, 0.32)
  part(chest, geo.ball, belly, 0, -0.1, 0.14, 0.2, 0.2, 0.18)
  if (s.stripes)
    for (let i = 0; i < 5; i++)
      part(body, geo.box, mat(s.stripes), 0, H + 0.2, -L + i * L * 0.38, 0.5, 0.03, 0.06)
  if (s.spines)
    for (let i = 0; i < 6; i++) {
      const sp = part(
        body,
        geo.cone,
        dark,
        0,
        H + 0.28 + Math.sin((i / 5) * Math.PI) * 0.05,
        -L * 0.9 + i * L * 0.33,
        0.05,
        0.2,
        0.07,
      )
      sp.rotation.x = -0.35
    }
  // Neck chain and head with an opening jaw.
  const neck = joint(chest, 0, 0.12, 0.18)
  neck.rotation.x = -0.55 + (1 - s.neck) * 0.4
  part(neck, geo.limb, hide, 0, 0.16 * s.neck, 0, 0.15, 0.34 * s.neck, 0.15)
  if (s.mane) {
    const mane = mat(s.mane)
    part(neck, geo.ball, mane, 0, 0.14, -0.02, 0.36, 0.4, 0.3)
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2,
        tuft = part(
          neck,
          geo.cone,
          mane,
          Math.cos(a) * 0.3,
          0.2 + Math.sin(a) * 0.28,
          -0.05,
          0.09,
          0.26,
          0.09,
        )
      tuft.rotation.z = a - Math.PI / 2
    }
  }
  const head = joint(neck, 0, 0.34 * s.neck, 0.02)
  head.rotation.x = 0.55
  part(head, geo.ball, hide, 0, 0.02, 0, 0.19, 0.17, 0.2)
  part(head, geo.box, hide, 0, 0.0, 0.2 * s.snout, 0.14, 0.1, 0.26 * s.snout)
  part(head, geo.ball, dark, 0, 0.03, 0.34 * s.snout, 0.05, 0.045, 0.04)
  const jaw = joint(head, 0, -0.06, 0.05)
  part(jaw, geo.box, belly, 0, -0.02, 0.14 * s.snout, 0.12, 0.05, 0.24 * s.snout)
  for (const side of [-1, 1]) {
    part(head, geo.ball, eyeMat, side * 0.1, 0.07, 0.12, 0.035, 0.03, 0.02)
    if (s.ears === 'pointed') {
      const ear = part(head, geo.cone, dark, side * 0.1, 0.2, -0.05, 0.06, 0.16, 0.04)
      ear.rotation.z = side * -0.25
    } else if (s.ears === 'round')
      part(head, geo.ball, dark, side * 0.12, 0.15, -0.06, 0.06, 0.06, 0.03)
    if (s.horns === 'curl')
      for (let i = 0; i < 4; i++)
        part(
          head,
          geo.ball,
          mat(0xd8cba7),
          side * (0.16 + i * 0.06),
          0.18 + Math.sin(i * 0.9) * 0.08,
          -0.08 - i * 0.06,
          0.06 - i * 0.008,
        )
    else if (s.horns === 'spike') {
      const horn = part(head, geo.cone, mat(0xc9c2a8), side * 0.08, 0.2, -0.12, 0.05, 0.3, 0.05)
      horn.rotation.x = -0.8
    }
    if (s.tusks) {
      const tusk = part(
        jaw,
        geo.cone,
        mat(0xeee2c2),
        side * 0.07,
        0.1,
        0.26 * s.snout,
        0.03,
        0.16,
        0.03,
      )
      tusk.rotation.x = -0.4
    }
    if (id === 'horned_maw' || s.jaw)
      for (let t = 0; t < 3; t++) {
        const tooth = part(
          head,
          geo.cone,
          mat(0xf2ead2),
          side * (0.03 + t * 0.02),
          -0.07,
          0.18 + t * 0.06,
          0.015,
          0.06,
          0.015,
        )
        tooth.rotation.x = Math.PI
      }
  }
  // Legs: thigh + shin + paw, front pair under the chest.
  const legs: { hip: THREE.Group; knee: THREE.Group; front: boolean; side: number }[] = []
  for (const front of [true, false])
    for (const side of [-1, 1]) {
      const hip = joint(front ? chest : hips, side * 0.16, front ? -0.05 : 0, front ? 0.04 : 0)
      const thigh = H * 0.52,
        shin = H * 0.5
      part(hip, geo.ball, hide, 0, -0.04, 0, 0.11, 0.14, 0.13)
      bone(hip, hide, thigh, 0.08)
      const knee = joint(hip, 0, -thigh, 0)
      bone(knee, dark, shin, 0.055)
      part(knee, geo.ball, dark, 0, -shin, 0.04, 0.06, 0.035, 0.08)
      legs.push({ hip, knee, front, side })
    }
  // Tail: a chain that trails and lashes.
  const tail: THREE.Group[] = []
  let parent: THREE.Object3D = joint(hips, 0, 0.1, -0.26)
  const segments = s.tail === 'short' ? 2 : 5
  for (let i = 0; i < segments; i++) {
    const seg = joint(parent, 0, 0, i ? -0.13 : 0)
    seg.rotation.x = i ? 0.12 : -2.1
    part(seg, geo.limb, i % 2 ? dark : hide, 0, 0.07, 0, 0.055 - i * 0.007, 0.16, 0.055 - i * 0.007)
    parent = joint(seg, 0, 0.14, 0)
    tail.push(seg)
  }
  if (s.tail === 'tuft') part(parent, geo.ball, mat(s.mane ?? s.dark), 0, 0.02, 0, 0.08, 0.1, 0.08)
  let gait = 0,
    locomotion = 0
  return {
    root,
    waterAnchor: body,
    height: (H + 0.62) * s.size + 0.2,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }: ActorMotion) {
      gait += distance / (0.9 * s.size)
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing, recoil } = attackPose(attackAge),
        hurt = hurtPose(hurtAge)
      const stride = gait * Math.PI * 2,
        breath = Math.sin(time * 2.1)
      // Crouch on the windup, lunge with the swing, rock back when hit.
      body.position.y =
        Math.abs(Math.sin(stride)) * 0.04 * locomotion - windup * 0.08 - death * 0.35
      body.position.z = -windup * 0.12 + swing * 0.42 - hurt * 0.16
      body.rotation.x = windup * 0.12 - swing * 0.16 - hurt * 0.14
      body.rotation.z = death * 1.4
      chest.position.y = H + 0.06 + breath * 0.012 - windup * 0.05
      neck.rotation.x =
        -0.55 +
        (1 - s.neck) * 0.4 -
        windup * 0.25 +
        swing * 0.35 +
        Math.sin(time * 0.9) * 0.04 * (1 - locomotion)
      head.rotation.x = 0.55 + windup * 0.2 - swing * 0.3 + hurt * 0.3
      head.rotation.y = Math.sin(time * 0.6) * 0.18 * (1 - locomotion) * (1 - swing)
      jaw.rotation.x =
        0.08 + breath * 0.03 + (windup * 0.35 + swing * 0.7 + recoil * 0.2) * (s.jaw ?? 1)
      for (const leg of legs) {
        const phase = stride + (leg.front === leg.side > 0 ? 0 : Math.PI)
        const lift = Math.max(0, Math.sin(phase))
        leg.hip.rotation.x =
          Math.cos(phase) * 0.45 * locomotion +
          (leg.front ? -swing * 0.5 : swing * 0.2) +
          windup * (leg.front ? 0.2 : -0.15)
        leg.knee.rotation.x =
          (leg.front ? -1 : 1) * (lift * 0.7 * locomotion + windup * 0.25 + 0.08)
      }
      tail.forEach((seg, i) => {
        seg.rotation.y = Math.sin(time * 2.4 - i * 0.7) * (0.12 + locomotion * 0.1 + hurt * 0.4)
        seg.rotation.x = (i ? 0.12 : -2.1) + Math.sin(time * 1.6 - i * 0.6) * 0.05 + windup * 0.1
      })
    },
  }
}

interface BugSpec {
  shell: number
  under: number
  dark: number
  eye: number
  size: number
  legs: number
  wings?: boolean
  abdomen: number
  mandibles?: boolean
  claws?: boolean
  eyes: number
  shellPlates?: boolean
}
const BUG: Record<string, BugSpec> = {
  giant_spider: {
    shell: 0x2b2228,
    under: 0x5d3a3a,
    dark: 0x140f12,
    eye: 0xff3b30,
    size: 1.1,
    legs: 4,
    abdomen: 1.5,
    mandibles: true,
    eyes: 8,
  },
  carapace_beetle: {
    shell: 0x2f5a52,
    under: 0x1d2b29,
    dark: 0x0e1514,
    eye: 0xb6ff8a,
    size: 1.05,
    legs: 3,
    abdomen: 1.2,
    mandibles: true,
    eyes: 2,
    shellPlates: true,
  },
  forest_wasp: {
    shell: 0xd8a83a,
    under: 0x2a2015,
    dark: 0x16110a,
    eye: 0xff7a2a,
    size: 0.9,
    legs: 3,
    abdomen: 1,
    wings: true,
    eyes: 2,
  },
  tide_crawler: {
    shell: 0x3d6d86,
    under: 0xc7b28c,
    dark: 0x1a2c36,
    eye: 0xfff2a8,
    size: 1.15,
    legs: 3,
    abdomen: 0.9,
    claws: true,
    eyes: 2,
    shellPlates: true,
  },
}

export function createArthropod(id: string): ActorModel {
  const s = BUG[id] ?? BUG.carapace_beetle
  const shell = mat(s.shell),
    under = mat(s.under),
    dark = mat(s.dark),
    eyeMat = mat(s.eye, s.eye, 1.2)
  const root = new THREE.Group(),
    body = joint(root, 0, 0, 0)
  body.scale.setScalar(s.size)
  const hover = s.wings ? 0.9 : 0,
    y = 0.36 + hover
  const thorax = joint(body, 0, y, 0.05)
  part(thorax, geo.ball, shell, 0, 0, 0, 0.2, 0.17, 0.22)
  const abdomen = joint(thorax, 0, 0.04, -0.18)
  abdomen.rotation.x = s.wings ? 0.5 : -0.12
  part(
    abdomen,
    geo.ball,
    shell,
    0,
    0,
    -0.26 * s.abdomen,
    0.27 * s.abdomen,
    0.24 * s.abdomen,
    0.34 * s.abdomen,
  )
  if (s.wings)
    for (let i = 0; i < 3; i++)
      part(abdomen, geo.box, under, 0, 0, -0.12 - i * 0.14, 0.5, 0.05, 0.04)
  if (s.wings) {
    const sting = part(abdomen, geo.cone, dark, 0, -0.02, -0.62, 0.04, 0.2, 0.04)
    sting.rotation.x = -Math.PI / 2
  }
  if (s.shellPlates)
    for (const side of [-1, 1]) {
      const plate = part(
        abdomen,
        geo.ball,
        mat(s.shell + 0x0a0a0a),
        side * 0.1,
        0.1,
        -0.3,
        0.17,
        0.1,
        0.36,
      )
      plate.rotation.z = side * 0.25
    }
  if (id === 'giant_spider')
    part(abdomen, geo.box, mat(0xb03a2e, 0x5a1810), 0, 0.25, -0.36, 0.1, 0.02, 0.16)
  const head = joint(thorax, 0, 0.02, 0.22)
  part(head, geo.ball, dark, 0, 0, 0.04, 0.14, 0.12, 0.13)
  for (let i = 0; i < s.eyes; i++) {
    const side = i % 2 ? 1 : -1,
      row = Math.floor(i / 2)
    part(
      head,
      geo.ball,
      eyeMat,
      side * (0.05 + row * 0.025),
      0.06 + row * 0.03,
      0.15 - row * 0.02,
      0.028 - row * 0.003,
    )
  }
  const pincers: THREE.Group[] = []
  if (s.mandibles || s.claws)
    for (const side of [-1, 1]) {
      const p = joint(head, side * 0.07, -0.05, 0.14)
      if (s.claws) {
        const arm = joint(thorax, side * 0.2, 0, 0.15)
        arm.rotation.set(-0.4, side * 0.5, side * 0.6)
        bone(arm, shell, 0.3, 0.05)
        const fore = joint(arm, 0, -0.3, 0)
        fore.rotation.x = -1.1
        part(fore, geo.ball, shell, 0, -0.12, 0, 0.1, 0.16, 0.08)
        part(fore, geo.cone, dark, side * 0.04, -0.28, 0, 0.04, 0.14, 0.04)
        pincers.push(arm)
      } else {
        const m = part(p, geo.cone, mat(0x9b8a6a), 0, 0, 0.06, 0.025, 0.14, 0.025)
        m.rotation.set(Math.PI / 2, 0, side * 0.5)
        pincers.push(p)
      }
    }
  const legs: { hip: THREE.Group; knee: THREE.Group; side: number; i: number }[] = []
  for (const side of [-1, 1])
    for (let i = 0; i < s.legs; i++) {
      const hip = joint(thorax, side * 0.15, -0.03, 0.12 - (i * 0.3) / Math.max(1, s.legs - 1))
      hip.rotation.set(0, side * (-0.5 + (i * 1) / Math.max(1, s.legs - 1)), side * -1.05)
      bone(hip, dark, 0.36, 0.03)
      const knee = joint(hip, 0, -0.36, 0)
      knee.rotation.z = side * 1.6
      bone(knee, dark, 0.42 + hover * 0.12, 0.025, 0.012)
      legs.push({ hip, knee, side, i })
    }
  const wings: THREE.Object3D[] = []
  if (s.wings)
    for (const side of [-1, 1]) {
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0xcfe3ea,
        emissive: 0x31424a,
        roughness: 1,
        transparent: true,
        opacity: 0.55,
      })
      const w = joint(thorax, side * 0.08, 0.12, 0)
      part(w, geo.ball, wingMat as Mat, side * 0.32, 0, -0.05, 0.32, 0.015, 0.12)
      wings.push(w)
    }
  let gait = 0,
    locomotion = 0
  return {
    root,
    waterAnchor: body,
    height: (y + 0.45) * s.size,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }: ActorMotion) {
      gait += distance / 0.45
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing } = attackPose(attackAge),
        hurt = hurtPose(hurtAge)
      const stride = gait * Math.PI * 2
      body.position.y =
        (s.wings ? Math.sin(time * 3.1) * 0.08 : Math.abs(Math.sin(stride * 2)) * 0.015) -
        death * (y * 0.8)
      body.position.z = -windup * 0.1 + swing * 0.38 - hurt * 0.12
      body.rotation.z = death * 2.6
      // Rear up on the windup (front legs and pincers lift), strike forward.
      thorax.rotation.x = -windup * 0.45 + swing * 0.3 - hurt * 0.2
      abdomen.rotation.x =
        (s.wings ? 0.5 + swing * 0.9 : -0.12 + Math.sin(time * 1.8) * 0.04) + windup * 0.2
      head.rotation.y = Math.sin(time * 1.1) * 0.1
      pincers.forEach((p, i) => {
        p.rotation.y = (i ? -1 : 1) * (Math.sin(time * 4) * 0.1 + windup * 0.6 - swing * 0.5)
      })
      wings.forEach((w, i) => {
        w.rotation.z = (i ? -1 : 1) * Math.sin(time * 38) * 0.6
      })
      for (const leg of legs) {
        const phase = stride + ((leg.i + (leg.side > 0 ? 1 : 0)) % 2) * Math.PI
        const lift = Math.max(0, Math.sin(phase)) * locomotion
        const front = leg.i === 0
        leg.hip.rotation.x =
          Math.cos(phase) * 0.35 * locomotion + (front ? -windup * 0.9 + swing * 0.4 : 0)
        leg.hip.rotation.z =
          leg.side * (-1.05 + lift * 0.35 + (front ? windup * 0.5 : 0)) +
          (s.wings ? leg.side * 0.5 : 0)
        leg.knee.rotation.z = leg.side * (1.6 - lift * 0.4 + Math.sin(time * 2 + leg.i) * 0.04)
      }
    },
  }
}

export const isQuadruped = (id: string) => id in QUAD
export const isArthropod = (id: string) => id in BUG

interface Folk {
  scale: number
  skin?: number
  cloth?: number
  armor?: number
  glow?: number
  float?: boolean
}
/** Humanoid and undead species: proportions and palette over the traveller rig. */
export const FOLK: Record<string, Folk> = {
  goblin_scout: { scale: 0.72, skin: 0x6f8f3c, cloth: 0x5a4127, armor: 0x7a6a52 },
  gremlin: { scale: 0.6, skin: 0x8a6a9e, cloth: 0x3b2f45, armor: 0x5f5568 },
  lizard_raider: { scale: 0.95, skin: 0x4c7f5b, cloth: 0x7b4a2a, armor: 0x8b7a5a },
  scale_sentinel: { scale: 1.12, skin: 0x3f6f62, cloth: 0x2f4a6a, armor: 0x5d8a80 },
  hollow_cultist: { scale: 1, skin: 0xcfc6b0, cloth: 0x3d2a4f, armor: 0x2a2233, glow: 0x5a2a8a },
  stone_ogre: { scale: 1.45, skin: 0x7d8379, cloth: 0x4f4636, armor: 0x5e5a50 },
  bone_knight: { scale: 1.08, cloth: 0x6a1c1c, armor: 0x444a56 },
  bone_crawler: { scale: 0.85, cloth: 0x3a3a30 },
  pale_wraith: {
    scale: 1.05,
    skin: 0xbfd6e8,
    cloth: 0x8fb0c8,
    armor: 0xa7c2d6,
    glow: 0x5d86a8,
    float: true,
  },
  pyre_shade: {
    scale: 1,
    skin: 0x2a1c16,
    cloth: 0x3a2018,
    armor: 0x2e2420,
    glow: 0xb2470f,
    float: true,
  },
}
export function dressFolk(model: ActorModel, id: string) {
  const f = FOLK[id]
  if (!f) return model
  model.root.scale.setScalar(f.scale)
  model.height *= f.scale
  const seen = new Set<THREE.Material>()
  model.root.traverse(o => {
    if (
      !(o instanceof THREE.Mesh) ||
      !(o.material instanceof THREE.MeshStandardMaterial) ||
      seen.has(o.material)
    )
      return
    const m = o.material
    seen.add(m)
    const hex = m.color.getHex()
    if ((hex === 0xb2a88d || hex === 0xc5c1a7) && f.skin) m.color.setHex(f.skin)
    else if ((hex === 0x8a5543 || hex === 0x505469) && f.cloth) m.color.setHex(f.cloth)
    else if (hex === 0xa19784 && f.armor) m.color.setHex(f.armor)
    if (f.glow && hex !== 0x292e2d) {
      m.emissive.setHex(f.glow)
      m.emissiveIntensity = 0.35
    }
  })
  if (f.float) {
    const animate = model.animate
    model.animate = motion => {
      animate(motion)
      model.root.children[0].position.y += 0.25 + Math.sin(motion.time * 1.8) * 0.08
    }
  }
  return model
}
