import * as THREE from 'three'
import { MONSTERS } from '../../engine'
import { createAsciiPass } from './ascii'
import { createGrass } from './grass'
import { createAdventurer, createCreature, type ActorModel } from './models'
import { createWorldActors } from './worldActors'
import { createPeers } from './peers'
import { createEnvironment } from './environment'
import { markActorInk } from './actorInk'
import { applyWorldGlyphs } from './worldGlyph'
import { glyphBody, updateGlyphBodies } from './glyphBody'
import { groundCoverFor, proceduralForestCover } from './groundCover'
import { loopLength, paceAt, solveBaseSpeed } from './trailLoop'
import { createEffects } from './effects'
import { createWater } from './water'
import { createIllumination } from './illumination'
import type { VisualSettings } from './types'
import { damp, smooth, turn, feedbackImpactDelay } from './motion'
import type { GameAudio } from '../audio/mixer'
import { createRain } from './rain'
import { swampBoardwalk, swampSurface, swampWeather } from './swamp'
import { createSwampHydrology } from './swampHydrology'
import { stormAt } from './storm'
import { snowAccumulation, snowCover, snowMeltRadius } from './snow'

export interface SceneHandle { dispose: () => void; resetCamera: () => void }

function disposeObject(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  root.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
      if (object instanceof THREE.InstancedMesh) object.dispose()
      geometries.add(object.geometry)
      ;(Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material))
    }
  })
  geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose())
}

/** Continuous meadow and ruins, framed at human scale like the supplied video. */
export function createDiorama(host: HTMLElement, getSettings: () => VisualSettings, report: (fps: number) => void, onFailure: () => void, onAdvance?: (seconds: number) => void, audio?: GameAudio): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio, 1.5)))
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
  const canvas = renderer.domElement
  canvas.setAttribute('role', 'img')
  canvas.setAttribute('aria-label', 'Hunt automática em cenário ASCII 3D. O personagem explora, combate e descansa sozinho; a câmera acompanha a ação.')
  host.appendChild(canvas)
  const sound = audio?.createScene()
  const labels = createWorldActors(host)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x020102)
  scene.fog = new THREE.FogExp2(0x020102, .012)
  // Scenery carries letters on its own surfaces in every area; actors and
  // tree crowns keep the screen pass. ?ascii=screen compares with the old look.
  const worldGlyphs = !location.search.includes('ascii=screen')
  // The traveller keeps the approved screen-pass ASCII (user's choice);
  // creatures are bodies made of letters that move with each limb.
  const inkActor = markActorInk
  const inkCreature = (root: THREE.Object3D) => worldGlyphs ? glyphBody(root, .155) : markActorInk(root)
  const peers = createPeers(scene, host, disposeObject, inkActor)
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, .1, 90)
  const target = new THREE.WebGLRenderTarget(1, 1)
  const depth = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType)
  target.depthTexture = depth
  const ascii = createAsciiPass()
  ascii.material.uniforms.sceneTexture.value = target.texture
  ascii.material.uniforms.sceneDepth.value = target.depthTexture
  // Independent seeds keep masonry identical when grass density changes.
  let grassSeed = 48017
  const interior = getSettings().locationId === 'old_mine' || getSettings().locationId === 'sunken_cathedral'
  const marsh = getSettings().locationId === 'rain_marsh'
  const snowy = getSettings().locationId === 'snow_pines'
  const ambient = new THREE.HemisphereLight(interior ? 0xa6b9c6 : snowy ? 0xc9dfed : 0xc2cec4, interior ? 0x25291e : snowy ? 0x667987 : 0x343321, interior ? .95 : snowy ? 1.35 : 1.25)
  const sun = new THREE.DirectionalLight(interior ? 0xbac9cb : snowy ? 0xdfedfc : 0xe0e7cc, interior ? 1.5 : snowy ? 2 : 2.2)
  sun.position.set(-5, 12, 7); sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, far: 40 })
  sun.shadow.bias = -.001; sun.shadow.normalBias = .04
  // The lit meadow still shows canopy shade, but the trees must not black it
  // out. Other areas keep their approved full-strength shadows.
  sun.shadow.intensity = worldGlyphs && !interior ? .62 : 1
  const fill = new THREE.DirectionalLight(interior ? 0x8295c1 : 0x9bbfb5, .3); fill.position.set(6, 6, -7)
  scene.add(ambient, sun, fill)

  const hydrology = marsh ? createSwampHydrology() : undefined
  const environment = createEnvironment(scene, getSettings().locationId ?? 'dark_forest', hydrology, worldGlyphs)
  const grass = createGrass(() => { grassSeed = (grassSeed * 1664525 + 1013904223) >>> 0; return grassSeed / 4294967296 },
    environment.world ? proceduralForestCover(environment.world.soilUniforms) : worldGlyphs ? groundCoverFor(getSettings().locationId ?? 'dark_forest') : undefined)
  if (worldGlyphs) applyWorldGlyphs(scene)
  const illumination = createIllumination(environment.lightObstacles, environment.camp, interior)
  const effects = createEffects(environment.camp)
  scene.add(effects.light, effects.aura)
  const water = createWater(environment.procedural ? 'procedural' : getSettings().locationId ?? 'dark_forest', hydrology)
  const rain = createRain(marsh)
  for (const uniforms of [ascii.material.uniforms, grass.uniforms, water.uniforms]) Object.assign(uniforms, illumination.uniforms)
  const player = createAdventurer(); inkActor(player.root); player.root.position.set(-.8, 0, 2.7); scene.add(player.root)
  const playerFeet = player.feet?.map(() => ({ position: new THREE.Vector3(), step: 0, grounded: true }))
  const lantern = new THREE.PointLight(0xffce83, 19, 9, 1.65)
  scene.add(lantern)
  const lanternModel = player.root.getObjectByName('traveller-lantern')!
  const loot = new THREE.Group()
  const lootMaterial = new THREE.MeshStandardMaterial({ color: 0xd5ba7a, roughness: 1 })
  const pouch = new THREE.Mesh(new THREE.IcosahedronGeometry(.2, 1), lootMaterial)
  pouch.scale.set(.85, 1, .7); loot.add(pouch)
  const tie = new THREE.Mesh(new THREE.TorusGeometry(.08, .025, 4, 6), lootMaterial)
  tie.position.y = .19; tie.rotation.x = Math.PI / 2; loot.add(tie)
  scene.add(loot); loot.visible = false; inkActor(loot)
  let enemy: ActorModel | null = null, creatureId = ''
  let spawnTime = 0, deathTime = -1, sitting = 0, speed = 0
  let entryStyle: 'charge' | 'rise' | 'swoop' = 'charge'
  const enemyAnchor = new THREE.Vector3(), enemyPrevious = new THREE.Vector3(), entryDirection = new THREE.Vector3()
  const enemyWaterPosition = new THREE.Vector3(), enemyWaterPrevious = new THREE.Vector3()
  const focus = new THREE.Vector3(-.8, .6, .4)
  const head = new THREE.Vector3(), enemyHead = new THREE.Vector3()
  const destination = new THREE.Vector3()
  const route = marsh
    ? [[-.3, 3.4], [1.3, 3.4], [2.2, 1.2], [.7, -1.2], [-.4, -3.7], [-2.6, -4.1], [-.5, -1.7], [1.2, 1.2], [1.3, 4.95], [-2.5, 4.95], [-1.4, 3.1]]
    : snowy ? [[-.8,3.8],[.4,2],[.9,-.4],[-.2,-3.2],[-1.3,-4.9],[.8,-2.9],[2.1,.4],[1.5,3.8],[-1,4.7]]
    : getSettings().locationId === 'dark_forest'
    ? [[-.7, 3.8], [-.7, 1.2], [.1, -2.3], [0, -5.7], [-1, -7.2], [0, -2.2], [2.3, -.9], [5.3, -.9], [6.1, 1.6], [5.3, -.9], [2.3, -.9], [-.7, 2.2]]
    : [[-.7, 3.8], [-.7, .6], [-.5, -3.1], [.6, -3.5], [1.7, .4], [1.6, 5.6], [-.7, 5.6]]
  let routeIndex = 0
  // Circuit state: the traveller starts at the bonfire seat; `travelled` is the
  // distance covered along the loop during the current hunt.
  let huntProgress = 0, lastArc = 0, lastRemaining = Infinity, huntTotal = 0
  const loopNow = () => environment.world!.loop
  if (environment.procedural) {
    const hunt = getSettings().hunt
    if (hunt) { huntTotal = hunt.total; environment.setHuntLength(loopLength(hunt.total)) }
    player.root.position.copy(environment.campSeat)
    lastArc = loopNow().nearest(player.root.position.x, player.root.position.z)
  }
  let width = 1, height = 1, dragAngle = 0, dragBase = 0, dragX = 0, dragY = 0, dragging = false, moved = false, wheelZoom = 1
  let time = 0, last = 0, raf = 0, frames = 0, sampleTime = 0, disposed = false, contextUnavailable = false
  let angle = Math.PI / 7, smoothZoom = getSettings().zoom
  let playerAttackTime = -10, enemyAttackTime = -10, playerHurtTime = -10, enemyHurtTime = -10
  let playerCasting = false
  let lastFeedback = getSettings().feedback?.id
  function resize() {
    width = Math.max(host.clientWidth, 1); height = Math.max(host.clientHeight, 1)
    renderer.setSize(width, height)
    const size = renderer.getDrawingBufferSize(new THREE.Vector2()); target.setSize(size.x, size.y)
    water.occludeWith(depth, size.x, size.y); rain.occludeWith(depth, size.x, size.y); effects.occludeWith(depth, size.x, size.y)
    environment.snow?.occludeWith(depth, size.x, size.y)
    ascii.material.uniforms.resolution.value.set(width, height)
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize()
  const pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    dragX = event.clientX; dragY = event.clientY; dragBase = dragAngle; dragging = true; moved = false
    canvas.setPointerCapture(event.pointerId)
  }
  const pointerMove = (event: PointerEvent) => {
    if (!dragging) return
    if (Math.hypot(event.clientX - dragX, event.clientY - dragY) > 6) moved = true
    if (moved) dragAngle = dragBase + (event.clientX - dragX) * .006
  }
  const pointerUp = (event: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }
  const pointerCancel = () => { dragging = false }
  const wheel = (event: WheelEvent) => { event.preventDefault(); wheelZoom = THREE.MathUtils.clamp(wheelZoom * Math.exp(-event.deltaY * .001), .75, 1.5) }
  const contextLost = (event: Event) => { event.preventDefault(); contextUnavailable = true; onFailure() }
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerCancel)
  canvas.addEventListener('wheel', wheel, { passive: false }); canvas.addEventListener('webglcontextlost', contextLost)
  const delta = new THREE.Vector3(), desiredFocus = new THREE.Vector3()
  function render(now: number) {
    if (disposed || contextUnavailable) return
    raf = requestAnimationFrame(render)
    if (document.hidden) { last = now; return }
    // rAF timestamps can precede the previous performance.now() after a heavy
    // frame; a negative step would make every damped pose diverge.
    const dt = THREE.MathUtils.clamp((now - (last || now)) / 1000, 0, .08); last = now
    const settings = getSettings(), movingTime = settings.playing ? dt : 0
    time += movingTime
    const weather = swampWeather(time)
    const storm = marsh ? stormAt(time) : undefined
    const flash = storm?.flash ?? 0
    illumination.uniforms.stormFlash.value = flash
    ambient.intensity = (interior ? .95 : snowy ? 1.35 : 1.25) + flash * 1.9
    fill.intensity = .3 + flash * 3.5
    if (settings.creature !== creatureId) {
      if (enemy) { scene.remove(enemy.root); disposeObject(enemy.root); enemy = null }
      creatureId = settings.creature ?? ''; enemyAttackTime = enemyHurtTime = -10
      if (creatureId) {
        enemy = createCreature(MONSTERS[creatureId]?.family ?? 'beast', creatureId)
        inkCreature(enemy.root); scene.add(enemy.root); spawnTime = time; deathTime = -1
        entryDirection.set(Math.cos(angle), 0, -Math.sin(angle))
        if (environment.procedural) {
          // Creatures come down the trail ahead, never out of a tree trunk.
          const ahead = loopNow().point(lastArc + 4)
          entryDirection.set(ahead.x - player.root.position.x, 0, ahead.z - player.root.position.z).normalize()
          // Offset sideways on screen so the creature is never hidden behind the hero.
          const side = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle))
          entryDirection.addScaledVector(side, Math.sign(side.dot(entryDirection) || 1) * .9).normalize()
        }
        const separation = Math.max(2.35, 140 * camera.top / height)
        enemyAnchor.copy(player.root.position).addScaledVector(entryDirection, separation)
        if (marsh) enemyAnchor.y = swampBoardwalk(enemyAnchor.x, enemyAnchor.z) ? .34 : 0
        // Creatures never pop in: beasts charge from off-screen, burrowers and
        // the dead claw out of the ground, flyers swoop down.
        const family = MONSTERS[creatureId]?.family
        entryStyle = family === 'undead' || /grub|snail|crawler|slime/.test(creatureId) ? 'rise'
          : /wasp|gazer|watcher|seraph|orb|grimoire|imp|wraith|shade/.test(creatureId) ? 'swoop' : 'charge'
        enemy.root.position.copy(enemyAnchor).addScaledVector(entryDirection, entryStyle === 'charge' ? 11 : entryStyle === 'swoop' ? 9 : 0)
        if (entryStyle === 'rise') enemy.root.position.y -= enemy.height + .2
        enemyWaterPosition.copy(enemy.root.position)
        enemy.root.rotation.y = Math.atan2(-entryDirection.x, -entryDirection.z) + .25
      }
    }
    if (settings.feedback?.id !== lastFeedback) {
      lastFeedback = settings.feedback?.id
      const hit = settings.feedback
      if (hit?.target === 'enemy') {
        playerAttackTime = time; playerCasting = !!hit.spell
        if (Math.abs(Number(hit.text)) > 0) enemyHurtTime = time + feedbackImpactDelay(hit.spell)
      } else if (hit) {
        enemyAttackTime = time
        if (Math.abs(Number(hit.text)) > 0) playerHurtTime = time + feedbackImpactDelay(hit.spell)
      }
    }
    if (settings.creature) destination.copy(player.root.position)
    else if (settings.looting) { destination.copy(loot.position); destination.y = 0 }
    else if (settings.activity === 'camp') {
      // Walk (or jog) along the trail to the bonfire, then sit facing it.
      // Around the circuit (the shorter way) to the bonfire, then the seat.
      if (environment.procedural) {
        const loop = loopNow(), forward = loop.length - lastArc
        if (Math.min(lastArc, forward) > 2.2 && player.root.position.distanceTo(environment.campSeat) > 2.4) {
          const p = loop.point(lastArc + (forward < lastArc ? 2.4 : -2.4))
          destination.set(p.x, 0, p.z)
        } else destination.copy(environment.campSeat)
      } else destination.copy(environment.campSeat)
    } else if (environment.procedural) {
      // Follow the circuit a little ahead, with a gentle side-to-side wander.
      const p = loopNow().point(lastArc + 2.4), wander = Math.sin(lastArc * .23) * .35
      destination.set(p.x + p.nx * wander, 0, p.z + p.nz * wander)
    } else {
      const point = route[routeIndex]
      destination.set(point[0], 0, point[1])
      if (Math.hypot(player.root.position.x - destination.x, player.root.position.z - destination.z) < .2) routeIndex = (routeIndex + 1) % route.length
    }
    delta.subVectors(destination, player.root.position); delta.y = 0
    const distance = delta.length()
    const seated = settings.activity === 'camp' && distance < .12
    sitting = damp(sitting, seated ? 1 : 0, seated ? 3.2 : 5.5, movingTime)
    let travelled = 0
    const wading = marsh && swampSurface(player.root.position.x, player.root.position.z, weather.level) === 'water'
    // Pace on the circuit: a programme of walking, jogging and pauses, with a
    // base speed solved from distance left ÷ time left so the traveller is
    // back at the bonfire when the focus block ends.
    let pace = 1, base = 1.28
    const hunt = settings.hunt
    if (environment.procedural) {
      if (hunt) {
        if (hunt.remaining > lastRemaining + 5 || hunt.total !== huntTotal) {
          // A new hunt: new circuit length, start the count from the fire.
          huntTotal = hunt.total; huntProgress = 0
          environment.setHuntLength(loopLength(hunt.total))
        }
        lastRemaining = hunt.remaining
      }
      if (!settings.creature && !settings.looting) {
        if (settings.activity === 'camp') pace = player.root.position.distanceTo(environment.campSeat) > 6 ? 2.1 : 1
        else {
          pace = paceAt(time)
          if (hunt) base = solveBaseSpeed(loopNow().length - huntProgress, hunt.remaining)
        }
      }
    }
    const targetSpeed = settings.creature || seated ? 0 : (wading ? 1.12 / 1.28 : 1) * base * pace * smooth(distance / .45) * (1 - smooth(sitting * 1.5))
    speed = damp(speed, targetSpeed, targetSpeed > speed ? 6 : 10, movingTime)
    if (distance > .015 && speed > .005) {
      const targetAngle = Math.atan2(delta.x, delta.z)
      player.root.rotation.y = turn(player.root.rotation.y, targetAngle, 6, movingTime)
      const alignment = .4 + .6 * Math.max(0, Math.cos(targetAngle - player.root.rotation.y))
      travelled = Math.min(distance, movingTime * speed * alignment)
      player.root.position.addScaledVector(delta.normalize(), travelled)
    }
    if (environment.procedural) {
      const arc = loopNow().nearest(player.root.position.x, player.root.position.z), L = loopNow().length
      let ds = arc - lastArc; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L
      huntProgress += ds; lastArc = arc
    }
    if (marsh) player.root.position.y = damp(player.root.position.y, swampBoardwalk(player.root.position.x, player.root.position.z) ? .34 : 0, 10, movingTime)
    const walking = speed > .12 && !seated
    if (seated) {
      const fireAngle = Math.atan2(environment.camp.x - player.root.position.x, environment.camp.z - player.root.position.z)
      player.root.rotation.y = turn(player.root.rotation.y, fireAngle, 5, movingTime)
    }
    angle = damp(angle, Math.PI / 7 + settings.rotation + dragAngle, 6, dt)
    smoothZoom = damp(smoothZoom, settings.zoom * wheelZoom, 6, dt)
    const aspect = width / height
    // Follow the action instead of fitting a distant island inside a black frame.
    const framing = Math.max(3.8, Math.min(4.7, height / 145))
    const span = Math.max(
      Math.max(framing, 4.6 / aspect) / Math.min(smoothZoom, settings.creature ? 1.5 : 2.2),
      settings.creature ? 2.35 / aspect : 1.8,
    )
    const lookAhead = settings.creature ? 1.25 : 2
    desiredFocus.copy(player.root.position); desiredFocus.y = settings.creature ? .75 : 1.05
    desiredFocus.x -= Math.sin(angle) * lookAhead; desiredFocus.z -= Math.cos(angle) * lookAhead
    let enemyTravelled = 0
    if (enemy) {
      enemyWaterPrevious.copy(enemyWaterPosition)
      const age = time - spawnTime
      enemyPrevious.copy(enemy.root.position)
      if (entryStyle === 'charge') {
        // Full gallop that brakes into position (ease-out).
        // Starts just beyond the frame and runs in at a steady sprint, braking
        // only over the last metres.
        const t = Math.min(1, age / 1.6), remain = t < .75 ? 1 - t * 1.08 : .19 * (1 - smooth((t - .75) / .25))
        enemy.root.position.copy(enemyAnchor).addScaledVector(entryDirection, Math.max(0, remain) * 11)
      } else if (entryStyle === 'swoop') {
        const t = 1 - (1 - Math.min(1, age / 1.5)) ** 2
        enemy.root.position.copy(enemyAnchor).addScaledVector(entryDirection, (1 - t) * 9)
        enemy.root.position.y = enemyAnchor.y + (1 - t) * 4
      } else {
        // Claws out of the soil with a shudder, then stands.
        const t = smooth((age - .25) / 1.25)
        enemy.root.position.copy(enemyAnchor)
        enemy.root.position.y = enemyAnchor.y - (1 - t) * (enemy.height + .2)
        enemy.root.position.x += Math.sin(age * 40) * .025 * (1 - t)
      }
      const enemyDistance = enemyPrevious.distanceTo(enemy.root.position)
      const facing = Math.atan2(player.root.position.x - enemy.root.position.x, player.root.position.z - enemy.root.position.z)
      enemy.root.rotation.y = turn(enemy.root.rotation.y, facing + .25, 7, movingTime)
      player.root.rotation.y = turn(player.root.rotation.y, facing + Math.PI - .2, 6, movingTime)
      desiredFocus.lerp(enemy.root.position, .32)
      desiredFocus.y = .75
      const dead = settings.creatureHp === 0
      if (dead && deathTime < 0) deathTime = time + feedbackImpactDelay(settings.feedback?.spell)
      const collapse = dead ? smooth((time - deathTime) / .85) : 0
      enemy.root.visible = collapse < 1
      // Legs keep a galloping cadence even during the fast entrance.
      const enemyStride = Math.min(enemyDistance, movingTime * 3.2)
      enemy.animate({ time, dt: movingTime, speed: movingTime > 0 ? enemyStride / movingTime : 0, distance: enemyStride,
        attackAge: time - enemyAttackTime,
        hurtAge: time - enemyHurtTime, death: collapse,
        wading: marsh && swampSurface(enemy.root.position.x, enemy.root.position.z, weather.level) === 'water' })
      enemy.root.updateMatrixWorld(true)
      ;(enemy.waterAnchor ?? enemy.root).getWorldPosition(enemyWaterPosition)
      enemyTravelled = Math.hypot(enemyWaterPosition.x - enemyWaterPrevious.x, enemyWaterPosition.z - enemyWaterPrevious.z)
      if (dead) loot.position.copy(enemy.root.position)
    }
    loot.visible = settings.looting === true || (!!enemy && settings.creatureHp === 0 && time - deathTime > .55)
    const lootAge = deathTime < 0 ? 1 : Math.max(0, time - deathTime - .55)
    loot.position.y = .24 + Math.abs(Math.sin(Math.min(1, lootAge / .7) * Math.PI * 2)) * .14 * Math.exp(-lootAge * 3)
    loot.rotation.y = Math.min(lootAge, .7) * 2
    player.animate({ time, dt: movingTime, speed, distance: travelled,
      attackAge: time - playerAttackTime,
      hurtAge: time - playerHurtTime,
      sitting, looting: settings.looting, casting: playerCasting, wading })
    const forest = !interior
    const fireOffset = delta.subVectors(environment.camp, player.root.position)
    sound?.update({ time, active: settings.playing, travelled,
      surface: snowy ? snowCover(player.root.position.x,player.root.position.z,time) > .55 ? 'snow' : 'grass' : marsh ? swampSurface(player.root.position.x, player.root.position.z, weather.level) : forest ? !environment.procedural && Math.abs(player.root.position.z + .9) < .65 && player.root.position.x > 2.6 ? 'wood' : 'grass' : 'stone',
      creature: settings.creature ?? null, family: MONSTERS[settings.creature ?? '']?.family,
      dead: settings.creatureHp === 0, feedback: settings.feedback, looting: !!settings.looting, lootId: settings.lootId, sitting,
      fireDistance: fireOffset.length(), firePan: THREE.MathUtils.clamp((fireOffset.x * Math.cos(angle) - fireOffset.z * Math.sin(angle)) / 6, -.8, .8),
      enemyPan: enemy ? .4 : 0, waterDistance: marsh ? 0 : Math.abs(player.root.position.x - 4.4),
      rainStrength: marsh ? weather.rain : 0, fireStrength: marsh ? weather.fire : 1,
      thunder: storm ? { id: storm.id, at: storm.thunderAt, power: storm.power, pan: storm.side * .45 } : undefined,
    }, settings.locationId ?? 'dark_forest')
    player.root.updateMatrixWorld(true)
    player.feet?.forEach((foot, i) => {
      foot.anchor.getWorldPosition(playerFeet![i].position)
      playerFeet![i].step = foot.step; playerFeet![i].grounded = foot.grounded
    })
    lanternModel.getWorldPosition(lantern.position)
    lantern.position.y += .5
    lantern.intensity = (interior ? 19 : 7) + Math.sin(time * 3.7) * .7 + Math.sin(time * 7.3) * .35
    illumination.update(time, dt, player.root.position)
    illumination.uniforms.hearthPosition.value.copy(environment.camp)
    if (environment.procedural) {
      // The moon's shadow frustum follows the traveller along the endless trail.
      sun.position.set(player.root.position.x - 5, 12, player.root.position.z + 7)
      sun.target.position.set(player.root.position.x, 0, player.root.position.z); sun.target.updateMatrixWorld()
    }
    focus.lerp(desiredFocus, 1 - Math.exp(-dt * 3.5))
    camera.left = -span * aspect; camera.right = span * aspect; camera.top = span; camera.bottom = -span
    camera.position.set(focus.x + Math.sin(angle) * 15, focus.y + 18, focus.z + Math.cos(angle) * 15)
    camera.lookAt(focus); camera.updateProjectionMatrix(); camera.updateMatrixWorld()
    peers.update(settings.peers ?? [], now / 1000, settings.playing ? dt : 0, camera, width, height)
    settings.onPose?.({ x: player.root.position.x, z: player.root.position.z, yaw: player.root.rotation.y, speed: settings.playing ? speed : 0, sitting })
    environment.animate(time, camera, player.root.position, enemy?.root.position)
    // Keep glyphs readable in screen pixels, even when the camera zooms out.
    ascii.material.uniforms.cellSize.value = settings.cellSize
    ascii.material.uniforms.brightness.value = settings.asciiBrightness
    ascii.material.uniforms.wetWeather.value = marsh ? 1 : 0
    ascii.material.uniforms.waterLevel.value = weather.level
    const contacts = ascii.material.uniforms.contacts.value as THREE.Vector4[]
    contacts[0].set(player.root.position.x, player.root.position.z, .55, 1 - sitting * .4)
    if (enemy?.root.visible) contacts[1].set(enemy.root.position.x, enemy.root.position.z, Math.max(.5, (enemy.height ?? 1) * .45), 1)
    else contacts[1].set(100, 100, 0, 0)
    ascii.material.uniforms.inverseProjection.value.copy(camera.projectionMatrixInverse)
    ascii.material.uniforms.cameraWorld.value.copy(camera.matrixWorld)
    updateGlyphBodies(camera, height, lantern.position, interior ? 1.2 : .7, environment.camp, marsh ? swampWeather(time).fire : 1, interior ? .12 : snowy ? .42 : .3)
    grass.setGlow(0, effects.light); grass.setGlow(1, effects.aura)
    grass.update(time, player.root.position, enemy?.root.position ?? null, camera, focus, settings.atmosphere, settings.asciiBrightness)
    water.update(time, camera, height, settings.asciiBrightness, { hero: player.root.position, feet: playerFeet,
      foe: enemy ? enemyWaterPosition : undefined, foeTravelled: enemyTravelled, foeHeight: enemy?.height, foeDead: settings.creatureHp === 0,
      travelled, heading: player.root.rotation.y, active: settings.playing, dt: movingTime,
      feedbackId: settings.feedback?.id, feedbackTarget: settings.feedback?.target })
    rain.update(time, camera, height, player.root.position, settings.asciiBrightness)
    environment.snow?.update(time, playerFeet ?? [], player.root.rotation.y, settings.playing, travelled, player.root.position, camera, height, settings.asciiBrightness)
    effects.update(time, settings, player.root.position, enemy?.root.position, camera, height, time - spawnTime, lantern.position, entryStyle, enemyAnchor, settings.playing ? speed : 0)
    renderer.autoClear = true
    environment.renderWaterReflection(renderer, camera, player.root.position)
    renderer.setRenderTarget(target); renderer.render(scene, camera)
    renderer.setRenderTarget(null); renderer.render(ascii.scene, ascii.camera)
    if (worldGlyphs || !settings.locationId || settings.locationId === 'dark_forest') {
      renderer.autoClear = false; renderer.render(grass.scene, camera); renderer.autoClear = true
    }
    renderer.autoClear = false
    renderer.render(water.scene, camera); renderer.render(rain.scene, camera); renderer.render(effects.scene, camera)
    if (environment.snow) renderer.render(environment.snow.weather, camera)
    renderer.autoClear = true
    head.copy(player.root.position); head.y += player.height - sitting * .53
    enemyHead.copy(enemy?.root.position ?? player.root.position); enemyHead.y += enemy?.height ?? 1
    labels.update(settings, camera, head, enemyHead, player.root.position, enemy?.root.position ?? player.root.position, width, height, time)
    canvas.dataset.ready = 'true'
    canvas.dataset.pose = sitting > .9 ? 'seated' : walking ? 'walking' : settings.creature ? 'combat' : 'idle'
    canvas.dataset.location = settings.locationId ?? 'dark_forest'
    canvas.dataset.lighting = interior ? 'lantern-discovery' : 'moonlight'
    canvas.dataset.weather = snowy ? 'snow' : marsh ? 'rain' : 'dry'
    canvas.dataset.lightning = flash.toFixed(3)
    canvas.dataset.wading = String(wading)
    if (environment.procedural) canvas.dataset.circuit = `${huntProgress.toFixed(0)}/${loopNow().length} camp:${player.root.position.distanceTo(environment.campSeat).toFixed(1)}`
    if (marsh) { canvas.dataset.waterLevel = weather.level.toFixed(3); canvas.dataset.fireHeat = weather.fire.toFixed(2); canvas.dataset.wakes = String(water.scene.userData.ripples) }
    if (snowy) { canvas.dataset.footprints = String(environment.snow?.footprintCount ?? 0); canvas.dataset.snowAccumulation = snowAccumulation(time).toFixed(3); canvas.dataset.meltRadius = snowMeltRadius(time).toFixed(3) }
    if (movingTime > 0) onAdvance?.(movingTime)
    frames++
    if (!sampleTime) sampleTime = now
    if (now - sampleTime > 1500) { report(Math.round(frames * 1000 / (now - sampleTime))); frames = 0; sampleTime = now }
  }
  render(performance.now())
  return {
    resetCamera() { dragAngle = 0; wheelZoom = 1 },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect()
      sound?.dispose()
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerCancel)
      canvas.removeEventListener('wheel', wheel); canvas.removeEventListener('webglcontextlost', contextLost)
      disposeObject(scene); environment.dispose()
      peers.dispose(); labels.dispose(); grass.dispose(); water.dispose(); hydrology?.dispose(); rain.dispose(); effects.dispose(); illumination.dispose(); sun.shadow.dispose(); depth.dispose(); target.dispose(); ascii.dispose(); renderer.dispose(); canvas.remove()
    },
  }
}
