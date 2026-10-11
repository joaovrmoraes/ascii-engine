import * as THREE from 'three'
import { attackPose, damp, hurtPose, smooth } from './motion'
import type { ActorModel } from './models'

const material = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: .83, flatShading: true })
const mesh = (parent: THREE.Object3D, shape: THREE.BufferGeometry, ink: THREE.Material, x: number, y: number, z: number, sx = 1, sy = sx, sz = sx) => {
  const part = new THREE.Mesh(shape, ink)
  part.position.set(x, y, z); part.scale.set(sx, sy, sz); part.castShadow = true; part.receiveShadow = true; parent.add(part)
  return part
}

/** Broad deformation survives the ASCII cell size: the skirt follows the core. */
export function createSlime(): ActorModel {
  const root = new THREE.Group(), body = new THREE.Group(), crown = new THREE.Group()
  body.name = 'slime-body'; crown.name = 'slime-crown'; root.add(body); body.add(crown)
  const skin = material(0x819773), underside = material(0x506754), eye = material(0xe3cf8b), pupil = material(0x242d28)
  eye.emissive.setHex(0x443415); eye.emissiveIntensity = .3
  const sphere = new THREE.IcosahedronGeometry(1, 1)
  mesh(crown, sphere, skin, 0, .5, 0, .58, .58, .55)
  mesh(crown, sphere, underside, -.2, .52, -.13, .2, .22, .18)
  const lobes = Array.from({ length: 9 }, (_, i) => {
    const a = i * Math.PI * 2 / 9
    return { a, mesh: mesh(body, sphere, skin, Math.cos(a) * .43, .18, Math.sin(a) * .42, .25, .19, .25) }
  })
  const eyes = [-1, 1].map(side => {
    const lid = new THREE.Group(); lid.position.set(side * .19, .62, .48); crown.add(lid)
    mesh(lid, sphere, pupil, 0, 0, 0, .13, .11, .06)
    mesh(lid, sphere, eye, 0, 0, .04, .085, .075, .035)
    mesh(lid, sphere, pupil, side * .015, 0, .075, .027, .068, .022)
    return lid
  })
  let gait = 0, locomotion = 0
  return {
    root, height: 1.35, waterAnchor: body,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0 }) {
      if (dt === 0) return
      gait += distance / .8; locomotion = damp(locomotion, Math.min(1, speed / 1.2), 9, dt)
      const { windup, swing } = attackPose(attackAge), hurt = hurtPose(hurtAge)
      const creep = Math.sin(gait * Math.PI * 2), breath = Math.sin(time * 2.7)
      const settling = attackAge > .24 && attackAge < 1.1 ? Math.sin((attackAge - .24) * 23) * Math.exp(-(attackAge - .24) * 4.5) : 0
      const squash = breath * .115 + creep * .12 * locomotion + windup * .28 - swing * .23 + settling * .14 + hurt * .25
      body.position.set(Math.sin(time * 1.4) * .045 * (1 - death), Math.max(0, creep) * .13 * locomotion + swing * .17 - death * .18, -windup * .24 + swing * .9 - hurt * .25)
      body.rotation.set(-swing * .18 + windup * .12, 0, Math.sin(time * 2.1) * .07 + hurt * .15)
      body.scale.set(1 + death * .65, 1 - death * .9, 1 + death * .65)
      crown.scale.set(1 + squash * .48, 1 - squash, 1 + squash * .35)
      crown.position.set(Math.sin(time * 2.7 - .7) * .065, -.015, swing * .1)
      for (const { a, mesh: lobe } of lobes) {
        const trail = Math.sin(time * 3.1 - a * 1.6) * .065 + Math.sin(gait * Math.PI * 2 - a) * locomotion * .12
        const radius = .43 + squash * .16 + trail
        lobe.position.set(Math.cos(a) * radius, .16 + Math.max(0, trail) * .8, Math.sin(a) * radius - swing * .13)
        lobe.scale.set(.25 + trail * .4, .18 - squash * .06, .25 + trail * .6)
      }
      const blinkPhase = time % 4.7, blink = smooth((blinkPhase - 4.35) / .09) * (1 - smooth((blinkPhase - 4.47) / .13))
      eyes.forEach((lid, i) => { lid.scale.y = Math.max(.1, 1 - blink * .9 - windup * .32); lid.rotation.z = (i ? 1 : -1) * (windup * .2 - hurt * .15) })
      skin.emissive.setRGB(hurt * .32, hurt * .065, .015)
    },
  }
}

/** A continuous articulated body avoids the disconnected beads of the old snake. */
export function createSerpent(): ActorModel {
  const root = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group(), jaw = new THREE.Group()
  body.name = 'serpent-body'; head.name = 'serpent-head'; root.add(body); body.add(head); head.add(jaw)
  const skin = material(0x839775), belly = material(0xb2b18c), dark = material(0x354938), eye = material(0xdaca78)
  eye.emissive.setHex(0x49390a); eye.emissiveIntensity = .4
  const shape = new THREE.IcosahedronGeometry(1, 1)
  mesh(head, shape, skin, 0, .04, .08, .28, .19, .34)
  mesh(head, shape, dark, 0, -.035, .2, .245, .055, .28)
  jaw.position.set(0, -.025, -.04)
  mesh(jaw, shape, belly, 0, -.095, .2, .22, .07, .27)
  for (const side of [-1, 1]) {
    mesh(head, shape, eye, side * .235, .115, .16, .052, .065, .072)
    const fang = mesh(head, new THREE.ConeGeometry(.034, .15, 5), belly, side * .14, -.05, .36)
    fang.rotation.z = Math.PI
  }
  const tongue = mesh(jaw, new THREE.BoxGeometry(.04, .025, .28), material(0x95574b), 0, -.07, .53)
  const segments = 24, sides = 7, centers = Array.from({ length: segments + 1 }, () => new THREE.Vector3())
  const positions = new Float32Array((segments + 1) * sides * 3), indices: number[] = []
  for (let i = 0; i < segments; i++) for (let j = 0; j < sides; j++) {
    const a = i * sides + j, b = i * sides + (j + 1) % sides, c = a + sides, d = b + sides
    indices.push(a, c, b, b, c, d)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)); geometry.setIndex(indices)
  const coil = mesh(body, geometry, skin, 0, 0, 0); coil.frustumCulled = false
  const tangent = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3()
  const stripes = Array.from({ length: 10 }, () => mesh(body, shape, dark, 0, 0, 0, .15, .055, .08))
  let gait = 0, locomotion = 0
  function pose(time: number, windup: number, swing: number, hurt: number, death: number, wading: boolean) {
    const amplitude = .18 + locomotion * .14 + windup * .12
    const phase = time * (1.8 + locomotion * 1.2) + gait * 2
    body.position.set(Math.sin(time * 1.1) * .04, -death * .27, -windup * .24 + swing * 1.05 - hurt * .24)
    body.rotation.z = hurt * .18
    for (let i = 0; i <= segments; i++) {
      const u = i / segments, neck = Math.exp(-u * 7)
      centers[i].set(Math.sin(phase - u * 7) * amplitude * (.55 + u * .7) * (1 - swing * neck * .75),
        (wading ? .34 : .2) + neck * (.42 + windup * .35 - swing * .14) + Math.sin(phase - u * 7) * .04 - death * neck * .4,
        .62 - u * 2.3 - windup * neck * .16 + swing * neck * .2)
    }
    for (let i = 0; i <= segments; i++) {
      tangent.subVectors(centers[Math.min(segments, i + 1)], centers[Math.max(0, i - 1)]).normalize()
      right.set(-tangent.z, 0, tangent.x).normalize(); up.crossVectors(right, tangent).normalize()
      const radius = (.205 * (1 - (i / segments) ** 1.5) + .018) * (1 - death * .45)
      for (let j = 0; j < sides; j++) {
        const a = j / sides * Math.PI * 2, n = (i * sides + j) * 3
        positions[n] = centers[i].x + radius * (Math.cos(a) * right.x + Math.sin(a) * up.x)
        positions[n + 1] = centers[i].y + radius * (Math.cos(a) * right.y + Math.sin(a) * up.y)
        positions[n + 2] = centers[i].z + radius * (Math.cos(a) * right.z + Math.sin(a) * up.z)
      }
    }
    geometry.attributes.position.needsUpdate = true; geometry.computeVertexNormals()
    head.position.copy(centers[0])
    head.rotation.set(-windup * .28 + swing * .36 + hurt * .2 + death * .45,
      Math.atan2(centers[0].x - centers[2].x, centers[0].z - centers[2].z), Math.sin(time * 1.8) * .075)
    jaw.rotation.x = windup * .55 + swing * .7 + Math.max(0, Math.sin(time * 1.9)) * .08
    tongue.visible = death < .1 && (windup > .1 || time % 3.6 > 3.1)
    tongue.scale.z = .7 + Math.sin(time * 28) * .3
    stripes.forEach((stripe, i) => { const center = centers[3 + i * 2]; stripe.position.copy(center); stripe.position.y += .16 * (1 - i / 12); stripe.scale.x = .16 * (1 - i / 12) })
    skin.emissive.setRGB(hurt * .32, hurt * .065, .008)
  }
  pose(0, 0, 0, 0, 0, false)
  return {
    root, height: 1.4, waterAnchor: body,
    animate({ time, dt, speed, distance, attackAge, hurtAge, death = 0, wading = false }) {
      if (dt === 0) return
      gait += distance / .9; locomotion = damp(locomotion, Math.min(1, speed / 1.2), 8, dt)
      const { windup, swing } = attackPose(attackAge)
      pose(time, windup, swing, hurtPose(hurtAge), death, wading)
    },
  }
}
