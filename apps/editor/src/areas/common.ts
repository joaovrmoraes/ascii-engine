import * as THREE from 'three'
import { createCampfire, pushFireflies, pushLanternMotes, createDustTrail } from '@ascii-engine/core/pomorog'
import { type AsciiEngine, type GlyphCloud } from '@ascii-engine/core'
import { createCamp, createKit, type Kit } from '../scene/pomorogKit'
import { createAdventurer } from '../pomorog/models'
import { damp, smooth, turn } from '../pomorog/motion'
import type { AreaOptions } from './types'

/**
 * Pieces shared by the fixed Pomorog maps (`environment.ts` + `scene.ts`):
 * the camp at (-3, 2.6), the bonfire, the traveller on a route of waypoints
 * with the lantern, and the demo cycle (explore → rest at the bonfire).
 */
export const CAMP = new THREE.Vector3(-3, 0, 2.6)
export const CAMP_SEAT = new THREE.Vector3(-1.8, 0, 2.7)
const EXPLORE_SECONDS = 70, CAMP_SECONDS = 25

/**
 * The unlit floor of the screen-pass maps (`environment.ts → floorMaterial`):
 * dark speckle written with the `earth` ID (.9), turned into letters by the
 * screen pass. Kept for the approved swamp look.
 */
export function legacyFloor(forest = false) {
  const material = new THREE.ShaderMaterial({
    uniforms: { forest: { value: forest ? 1 : 0 } },
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
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 40), material)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.07
  floor.userData.glyph = 'screen'
  return floor
}

export interface RouteOptions {
  route: [number, number][]
  /** Ground height under the traveller (boardwalk, steps). */
  heightAt?: (x: number, z: number) => number
  /** Walking in water: slower, higher steps. */
  wadingAt?: (x: number, z: number) => boolean
  /** Lantern strength: 7 outdoors, 19 indoors. */
  lantern?: number
  /** The lean-to only travels with the procedural forest camp (Pomorog). */
  leanTo?: boolean
}

/** Camp, bonfire, traveller and lantern for a fixed map. */
export function createFixedMapActors(engine: AsciiEngine, options: AreaOptions, route: RouteOptions) {
  const kit: Kit = createKit()
  const campGroup = createCamp(kit, route.leanTo ?? false)
  campGroup.position.copy(CAMP)
  engine.add(campGroup, options.screen ? { glyph: 'screen' } : {})
  const fireLetters = engine.createParticles(1600)
  engine.add(fireLetters.mesh, { glyph: 'particle' })
  const fire = createCampfire(fireLetters, CAMP)
  engine.scene.add(fire.light)
  engine.setLights({ hearth: CAMP })

  const player = createAdventurer()
  engine.add(player.root, options.screen ? { glyph: 'screen', surface: 'actor' } : { type: 'hero' })
  player.root.position.set(-.8, 0, 2.7)
  const lanternPower = route.lantern ?? 7
  const lantern = new THREE.PointLight(0xffce83, lanternPower, 9, 1.65); engine.scene.add(lantern)
  const lanternModel = player.root.getObjectByName('traveller-lantern')!
  const ambient = engine.createParticles(1200)
  engine.add(ambient.mesh, { glyph: 'particle' })
  const dust = createDustTrail()
  engine.setActors({ hero: player.root.position })

  let routeIndex = 0, speed = 0, sitting = 0
  const destination = new THREE.Vector3(), delta = new THREE.Vector3()
  const feet = player.feet!.map(() => ({ position: new THREE.Vector3(), step: 0, grounded: true }))
  const state = { travelled: 0, wading: false, camping: !!options.camp, seated: false }

  return {
    player, feet, state, fire, fireLetters, ambient, campGroup, kit,
    /** Moves the traveller; returns metres travelled this frame. */
    update(time: number, dt: number) {
      const cycle = time % (EXPLORE_SECONDS + CAMP_SECONDS)
      state.camping = !!options.camp || cycle > EXPLORE_SECONDS
      if (state.camping) destination.copy(CAMP_SEAT)
      else {
        const point = route.route[routeIndex]
        destination.set(point[0], 0, point[1])
        if (Math.hypot(player.root.position.x - destination.x, player.root.position.z - destination.z) < .2) routeIndex = (routeIndex + 1) % route.route.length
      }
      delta.subVectors(destination, player.root.position); delta.y = 0
      const distance = delta.length()
      state.seated = state.camping && distance < .12
      sitting = damp(sitting, state.seated ? 1 : 0, state.seated ? 3.2 : 5.5, dt)
      const p = player.root.position
      state.wading = route.wadingAt?.(p.x, p.z) ?? false
      const targetSpeed = state.seated ? 0 : (state.wading ? 1.12 / 1.28 : 1) * 1.28 * smooth(distance / .45) * (1 - smooth(sitting * 1.5))
      speed = damp(speed, targetSpeed, targetSpeed > speed ? 6 : 10, dt)
      let travelled = 0
      if (distance > .015 && speed > .005) {
        const targetAngle = Math.atan2(delta.x, delta.z)
        player.root.rotation.y = turn(player.root.rotation.y, targetAngle, 6, dt)
        const alignment = .4 + .6 * Math.max(0, Math.cos(targetAngle - player.root.rotation.y))
        travelled = Math.min(distance, dt * speed * alignment)
        player.root.position.addScaledVector(delta.normalize(), travelled)
      }
      if (route.heightAt) p.y = damp(p.y, route.heightAt(p.x, p.z), 10, dt)
      if (state.seated) player.root.rotation.y = turn(player.root.rotation.y, Math.atan2(CAMP.x - p.x, CAMP.z - p.z), 5, dt)
      player.animate({ time, dt, speed, distance: travelled, attackAge: 9, hurtAge: 9, sitting, wading: state.wading })
      player.root.updateMatrixWorld(true)
      player.feet!.forEach((foot, i) => { foot.anchor.getWorldPosition(feet[i].position); feet[i].step = foot.step; feet[i].grounded = foot.grounded })
      lanternModel.getWorldPosition(lantern.position); lantern.position.y += .5
      lantern.intensity = lanternPower + Math.sin(time * 3.7) * .7 + Math.sin(time * 7.3) * .35
      engine.setLights({ lantern: lantern.position })
      state.travelled = travelled
      ambient.clear()
      pushLanternMotes(ambient, p, time)
      if (speed > 1.85) dust.add(p.x, p.z, time)
      dust.push(ambient, time)
      return travelled
    },
    /** Bonfire letters for this frame (`heat`, `steam` from the weather). */
    burn(time: number, heat = 1, steam = 0) { fireLetters.clear(); fire.update(time, engine.camera, heat, steam) },
    fireflies(cloud: GlyphCloud, time: number, dim = 1) { pushFireflies(cloud, player.root.position, time, { dim }) },
    focus(angle: number, target: THREE.Vector3) {
      target.copy(player.root.position); target.y = 1.05
      target.x -= Math.sin(angle) * 2; target.z -= Math.cos(angle) * 2
      return target
    },
  }
}
