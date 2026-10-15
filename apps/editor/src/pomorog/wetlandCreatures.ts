import * as THREE from 'three'
import { attackPose, damp, hurtPose, smooth } from './motion'
import type { ActorModel } from './models'

const material = (color: number) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.83, flatShading: true })
const mesh = (
  parent: THREE.Object3D,
  shape: THREE.BufferGeometry,
  ink: THREE.Material,
  x: number,
  y: number,
  z: number,
  sx = 1,
  sy = sx,
  sz = sx,
) => {
  const part = new THREE.Mesh(shape, ink)
  part.position.set(x, y, z)
  part.scale.set(sx, sy, sz)
  part.castShadow = true
  part.receiveShadow = true
  parent.add(part)
  return part
}

/** Broad deformation survives the ASCII cell size: the skirt follows the core. */
export function createSlime(): ActorModel {
  const root = new THREE.Group(),
    body = new THREE.Group(),
    crown = new THREE.Group()
  body.name = 'slime-body'
  crown.name = 'slime-crown'
  root.add(body)
  body.add(crown)
  const skin = material(0x819773),
    underside = material(0x506754),
    eye = material(0xe3cf8b),
    pupil = material(0x242d28)
  eye.emissive.setHex(0x443415)
  eye.emissiveIntensity = 0.3
  const sphere = new THREE.IcosahedronGeometry(1, 1)
  mesh(crown, sphere, skin, 0, 0.5, 0, 0.58, 0.58, 0.55)
  mesh(crown, sphere, underside, -0.2, 0.52, -0.13, 0.2, 0.22, 0.18)
  const lobes = Array.from({ length: 9 }, (_, i) => {
    const a = (i * Math.PI * 2) / 9
    return {
      a,
      mesh: mesh(
        body,
        sphere,
        skin,
        Math.cos(a) * 0.43,
        0.18,
        Math.sin(a) * 0.42,
        0.25,
        0.19,
        0.25,
      ),
    }
  })
  const eyes = [-1, 1].map(side => {
    const lid = new THREE.Group()
    lid.position.set(side * 0.19, 0.62, 0.48)
    crown.add(lid)
    mesh(lid, sphere, pupil, 0, 0, 0, 0.13, 0.11, 0.06)
    mesh(lid, sphere, eye, 0, 0, 0.04, 0.085, 0.075, 0.035)
    mesh(lid, sphere, pupil, side * 0.015, 0, 0.075, 0.027, 0.068, 0.022)
    return lid
  })
  let gait = 0,
    locomotion = 0
  return {
    root,
    height: 1.35,
    waterAnchor: body,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }) {
      if (dt === 0) return
      gait += distance / 0.8
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing } = attackPose(attackAge),
        hurt = hurtPose(hurtAge)
      const creep = Math.sin(gait * Math.PI * 2),
        breath = Math.sin(time * 2.7)
      const settling =
        attackAge > 0.24 && attackAge < 1.1
          ? Math.sin((attackAge - 0.24) * 23) * Math.exp(-(attackAge - 0.24) * 4.5)
          : 0
      const squash =
        breath * 0.115 +
        creep * 0.12 * locomotion +
        windup * 0.28 -
        swing * 0.23 +
        settling * 0.14 +
        hurt * 0.25
      body.position.set(
        Math.sin(time * 1.4) * 0.045 * (1 - death),
        Math.max(0, creep) * 0.13 * locomotion + swing * 0.17 - death * 0.18,
        -windup * 0.24 + swing * 0.9 - hurt * 0.25,
      )
      body.rotation.set(-swing * 0.18 + windup * 0.12, 0, Math.sin(time * 2.1) * 0.07 + hurt * 0.15)
      body.scale.set(1 + death * 0.65, 1 - death * 0.9, 1 + death * 0.65)
      crown.scale.set(1 + squash * 0.48, 1 - squash, 1 + squash * 0.35)
      crown.position.set(Math.sin(time * 2.7 - 0.7) * 0.065, -0.015, swing * 0.1)
      for (const { a, mesh: lobe } of lobes) {
        const trail =
          Math.sin(time * 3.1 - a * 1.6) * 0.065 +
          Math.sin(gait * Math.PI * 2 - a) * locomotion * 0.12
        const radius = 0.43 + squash * 0.16 + trail
        lobe.position.set(
          Math.cos(a) * radius,
          0.16 + Math.max(0, trail) * 0.8,
          Math.sin(a) * radius - swing * 0.13,
        )
        lobe.scale.set(0.25 + trail * 0.4, 0.18 - squash * 0.06, 0.25 + trail * 0.6)
      }
      const blinkPhase = time % 4.7,
        blink = smooth((blinkPhase - 4.35) / 0.09) * (1 - smooth((blinkPhase - 4.47) / 0.13))
      eyes.forEach((lid, i) => {
        lid.scale.y = Math.max(0.1, 1 - blink * 0.9 - windup * 0.32)
        lid.rotation.z = (i ? 1 : -1) * (windup * 0.2 - hurt * 0.15)
      })
      skin.emissive.setRGB(hurt * 0.32, hurt * 0.065, 0.015)
    },
  }
}

/** A continuous articulated body avoids the disconnected beads of the old snake. */
export function createSerpent(): ActorModel {
  const root = new THREE.Group(),
    body = new THREE.Group(),
    head = new THREE.Group(),
    jaw = new THREE.Group()
  body.name = 'serpent-body'
  head.name = 'serpent-head'
  root.add(body)
  body.add(head)
  head.add(jaw)
  const skin = material(0x839775),
    belly = material(0xb2b18c),
    dark = material(0x354938),
    eye = material(0xdaca78)
  eye.emissive.setHex(0x49390a)
  eye.emissiveIntensity = 0.4
  const shape = new THREE.IcosahedronGeometry(1, 1)
  mesh(head, shape, skin, 0, 0.04, 0.08, 0.28, 0.19, 0.34)
  mesh(head, shape, dark, 0, -0.035, 0.2, 0.245, 0.055, 0.28)
  jaw.position.set(0, -0.025, -0.04)
  mesh(jaw, shape, belly, 0, -0.095, 0.2, 0.22, 0.07, 0.27)
  for (const side of [-1, 1]) {
    mesh(head, shape, eye, side * 0.235, 0.115, 0.16, 0.052, 0.065, 0.072)
    const fang = mesh(head, new THREE.ConeGeometry(0.034, 0.15, 5), belly, side * 0.14, -0.05, 0.36)
    fang.rotation.z = Math.PI
  }
  const tongue = mesh(
    jaw,
    new THREE.BoxGeometry(0.04, 0.025, 0.28),
    material(0x95574b),
    0,
    -0.07,
    0.53,
  )
  const segments = 24,
    sides = 7,
    centers = Array.from({ length: segments + 1 }, () => new THREE.Vector3())
  const positions = new Float32Array((segments + 1) * sides * 3),
    indices: number[] = []
  for (let i = 0; i < segments; i++)
    for (let j = 0; j < sides; j++) {
      const a = i * sides + j,
        b = i * sides + ((j + 1) % sides),
        c = a + sides,
        d = b + sides
      indices.push(a, c, b, b, c, d)
    }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
  )
  geometry.setIndex(indices)
  const coil = mesh(body, geometry, skin, 0, 0, 0)
  coil.frustumCulled = false
  const tangent = new THREE.Vector3(),
    right = new THREE.Vector3(),
    up = new THREE.Vector3()
  const stripes = Array.from({ length: 10 }, () =>
    mesh(body, shape, dark, 0, 0, 0, 0.15, 0.055, 0.08),
  )
  let gait = 0,
    locomotion = 0
  function pose(
    time: number,
    windup: number,
    swing: number,
    hurt: number,
    death: number,
    wading: boolean,
  ) {
    const amplitude = 0.18 + locomotion * 0.14 + windup * 0.12
    const phase = time * (1.8 + locomotion * 1.2) + gait * 2
    body.position.set(
      Math.sin(time * 1.1) * 0.04,
      -death * 0.27,
      -windup * 0.24 + swing * 1.05 - hurt * 0.24,
    )
    body.rotation.z = hurt * 0.18
    for (let i = 0; i <= segments; i++) {
      const u = i / segments,
        neck = Math.exp(-u * 7)
      centers[i].set(
        Math.sin(phase - u * 7) * amplitude * (0.55 + u * 0.7) * (1 - swing * neck * 0.75),
        (wading ? 0.34 : 0.2) +
          neck * (0.42 + windup * 0.35 - swing * 0.14) +
          Math.sin(phase - u * 7) * 0.04 -
          death * neck * 0.4,
        0.62 - u * 2.3 - windup * neck * 0.16 + swing * neck * 0.2,
      )
    }
    for (let i = 0; i <= segments; i++) {
      tangent
        .subVectors(centers[Math.min(segments, i + 1)], centers[Math.max(0, i - 1)])
        .normalize()
      right.set(-tangent.z, 0, tangent.x).normalize()
      up.crossVectors(right, tangent).normalize()
      const radius = (0.205 * (1 - (i / segments) ** 1.5) + 0.018) * (1 - death * 0.45)
      for (let j = 0; j < sides; j++) {
        const a = (j / sides) * Math.PI * 2,
          n = (i * sides + j) * 3
        positions[n] = centers[i].x + radius * (Math.cos(a) * right.x + Math.sin(a) * up.x)
        positions[n + 1] = centers[i].y + radius * (Math.cos(a) * right.y + Math.sin(a) * up.y)
        positions[n + 2] = centers[i].z + radius * (Math.cos(a) * right.z + Math.sin(a) * up.z)
      }
    }
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    head.position.copy(centers[0])
    head.rotation.set(
      -windup * 0.28 + swing * 0.36 + hurt * 0.2 + death * 0.45,
      Math.atan2(centers[0].x - centers[2].x, centers[0].z - centers[2].z),
      Math.sin(time * 1.8) * 0.075,
    )
    jaw.rotation.x = windup * 0.55 + swing * 0.7 + Math.max(0, Math.sin(time * 1.9)) * 0.08
    tongue.visible = death < 0.1 && (windup > 0.1 || time % 3.6 > 3.1)
    tongue.scale.z = 0.7 + Math.sin(time * 28) * 0.3
    stripes.forEach((stripe, i) => {
      const center = centers[3 + i * 2]
      stripe.position.copy(center)
      stripe.position.y += 0.16 * (1 - i / 12)
      stripe.scale.x = 0.16 * (1 - i / 12)
    })
    skin.emissive.setRGB(hurt * 0.32, hurt * 0.065, 0.008)
  }
  pose(0, 0, 0, 0, 0, false)
  return {
    root,
    height: 1.4,
    waterAnchor: body,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0, wading = false }) {
      if (dt === 0) return
      gait += distance / 0.9
      locomotion = damp(locomotion, Math.min(1, speed / 1.2), 8, dt)
      const { windup, swing } = attackPose(attackAge)
      pose(time, windup, swing, hurtPose(hurtAge), death, wading)
    },
  }
}
