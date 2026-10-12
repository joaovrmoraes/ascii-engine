import * as THREE from 'three'
import type { GlyphCloud } from '../techniques/particle'
import { PARTICLE_GLYPHS } from '../techniques/particle'
import { POMOROG_FIRE, type HeatGridSpec } from '../presets/campfire'

/**
 * Effect system (§3.3): effects are data. An effect has emitters on a
 * timeline; each emitter spawns letters (continuous or bursts) from a shape,
 * moves them (velocity, gravity, drag, noise, attraction, ground) and varies
 * size, colour, brightness and the letter itself over their life. Render
 * kinds, all letters: loose particle, ring/shockwave, beam, ribbon (trail),
 * heat grid, ground decal and ASCII flipbook. An emitter can light a
 * flickering point light. Effects play at a point, follow an object (or a
 * part/bone) and stop by budget.
 */
export type Range = number | [number, number]
type RGB = [number, number, number]
/** Colour stops over life (t 0–1). Values above 1 are allowed: saturated fire. */
export type Gradient = { t: number; color: RGB }[]
/** Value stops over life (t 0–1). */
export type Curve = { t: number; v: number }[]

export interface ShapeDef {
  kind: 'point' | 'sphere' | 'cone' | 'ring' | 'box' | 'line'
  radius?: number
  /** Cone half-angle (rad), box size, line end (relative). */
  angle?: number
  size?: [number, number, number]
  to?: [number, number, number]
  /** Spawn on the surface only (sphere/ring rim). */
  surface?: boolean
}

export interface EmitterDef {
  /** Optional authoring label, preserved in portable recipes. */
  name?: string
  /** Render kind (default `particle`). */
  render?: 'particle' | 'ring' | 'beam' | 'ribbon' | 'heat' | 'decal' | 'flipbook'
  /** Letters per second while active. */
  rate?: number
  /** One-shot bursts: count at time (s) after start. */
  bursts?: { at: number; count: number }[]
  /** Active window on the effect timeline (s). */
  start?: number
  duration?: number
  life?: Range
  shape?: ShapeDef
  /** Offset from the effect origin (m). */
  offset?: [number, number, number]
  /** Speed along the shape normal (m/s) plus a constant velocity. */
  speed?: Range
  velocity?: [number, number, number]
  gravity?: number
  /** Velocity damping per second (0–1+). */
  drag?: number
  /** Random wander (m/s²). */
  noise?: number
  /** Pull toward the origin (m/s²); negative pushes out. */
  attract?: number
  /** Stop and settle on the ground (y = origin.y). */
  ground?: boolean
  /** Swirl around the vertical axis (rad/s). */
  spin?: number
  /** Letters over life: the sequence is read left (birth) to right (death). */
  glyphs?: string
  size?: Range | Curve
  color?: RGB | Gradient
  alpha?: number | Curve
  /** Multiplies the colour (brightness). */
  glow?: number
  /** Ring / shockwave: radius over life and letter count; letter picked by screen tangent. */
  ring?: { from: number; to: number; count: number; tangent?: boolean }
  /** Beam: zig-zag letters between offset and `shape.to`, re-rolled at `jitter` Hz. */
  beam?: { segments: number; jitter?: number; amplitude?: number }
  /** Ribbon: letters along the recent path of the target. */
  ribbon?: { length: number; spacing: number }
  /** Heat grid (fire): the Pomorog bonfire spec. */
  heat?: Partial<HeatGridSpec>
  /** Flipbook: frames of letters (rows of text) played at fps, facing the camera or flat on the ground. */
  flipbook?: { frames: string[][]; colors?: RGB[][][]; fps: number; cell: number; facing?: 'camera' | 'ground'; loop?: boolean }
  /** Cap of live letters for this emitter. */
  max?: number
}

export interface EffectDef {
  name: string
  /** Seconds; `loop` restarts the timeline. */
  duration: number
  loop?: boolean
  emitters: EmitterDef[]
  light?: { color: number; intensity: number; distance?: number; decay?: number; flicker?: number; offset?: [number, number, number]; fade?: Curve }
}

interface Letter { x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number; seed: number; settled: boolean }
interface EmitterState { def: EmitterDef; letters: Letter[]; carry: number; burstsDone: number; trail: THREE.Vector3[] }

const rand = (r: Range | undefined, fallback: number, random: () => number) => r === undefined ? fallback : typeof r === 'number' ? r : r[0] + (r[1] - r[0]) * random()
function sampleCurve(curve: Curve, t: number) {
  if (!curve.length) return 1
  if (t <= curve[0].t) return curve[0].v
  for (let i = 1; i < curve.length; i++) if (t <= curve[i].t) {
    const a = curve[i - 1], b = curve[i], k = (t - a.t) / Math.max(1e-6, b.t - a.t)
    return a.v + (b.v - a.v) * k
  }
  return curve[curve.length - 1].v
}
function sampleGradient(gradient: Gradient, t: number): RGB {
  if (!gradient.length) return [1, 1, 1]
  if (t <= gradient[0].t) return gradient[0].color
  for (let i = 1; i < gradient.length; i++) if (t <= gradient[i].t) {
    const a = gradient[i - 1], b = gradient[i], k = (t - a.t) / Math.max(1e-6, b.t - a.t)
    return [a.color[0] + (b.color[0] - a.color[0]) * k, a.color[1] + (b.color[1] - a.color[1]) * k, a.color[2] + (b.color[2] - a.color[2]) * k]
  }
  return gradient[gradient.length - 1].color
}
const isCurve = (v: unknown): v is Curve => Array.isArray(v) && typeof v[0] === 'object'
const isGradient = (v: unknown): v is Gradient => Array.isArray(v) && typeof v[0] === 'object'

/** Keeps only glyphs the particle atlas can draw. */
export function drawableGlyphs(text: string) { return Array.from(text).filter((g) => PARTICLE_GLYPHS.includes(g)).join('') }

export interface EffectInstance {
  readonly name: string
  readonly time: number
  readonly letters: number
  /** Follow an object (a part or bone too); `offset` in its local frame. */
  attach(object: THREE.Object3D | null): void
  position: THREE.Vector3
  stop(): void
  /** Remove all letters and its light immediately (scene deletion). */
  cancel(): void
  readonly done: boolean
}

const right = new THREE.Vector3(), up = new THREE.Vector3(), toward = new THREE.Vector3(), tmp = new THREE.Vector3()

/**
 * The runtime: register effect definitions, play them, and push their
 * letters into one particle buffer each frame. `budget` caps letters per
 * scene; every emitter also has its own `max`.
 */
export function createEffectSystem(cloud: GlyphCloud, scene: THREE.Object3D, options: { budget?: number } = {}) {
  const library = new Map<string, EffectDef>()
  const playing: (EffectInstance & { emitterCount: number; tick(dt: number, time: number, camera: THREE.Camera, redraw?: boolean): void; dispose(): void })[] = []
  const budget = options.budget ?? 6000
  let seed = 4242
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  let live = 0

  function play(source: string | EffectDef, at: THREE.Vector3 | THREE.Object3D, overrides: { loop?: boolean } = {}): EffectInstance {
    const found = typeof source === 'string' ? library.get(source) : source
    if (!found) throw new Error(`ascii-engine: efeito desconhecido "${source}"`)
    const name = found.name
    const def: EffectDef = found
    const emitters: EmitterState[] = def.emitters.map((e) => ({ def: e, letters: [], carry: 0, burstsDone: 0, trail: [] }))
    const position = at instanceof THREE.Vector3 ? at.clone() : new THREE.Vector3()
    let target: THREE.Object3D | null = at instanceof THREE.Object3D ? at : null
    let t = 0, stopped = false
    const loop = overrides.loop ?? def.loop ?? false
    const light = def.light ? new THREE.PointLight(def.light.color, 0, def.light.distance ?? 6, def.light.decay ?? 2) : undefined
    if (light) scene.add(light)
    const origin = new THREE.Vector3()
    const instance = {
      name, position, emitterCount: emitters.length,
      get time() { return t },
      get letters() { return emitters.reduce((n, e) => n + e.letters.length, 0) },
      get done() { return stopped && emitters.every((e) => e.letters.length === 0) },
      attach(object: THREE.Object3D | null) { target = object },
      stop() { stopped = true },
      cancel() {
        stopped = true
        const index = playing.indexOf(instance)
        if (index >= 0) { live -= instance.letters; playing.splice(index, 1) }
        for (const emitter of emitters) { emitter.letters.length = 0; emitter.trail.length = 0 }
        instance.dispose()
      },
      dispose() { if (light) { light.removeFromParent(); light.dispose() } },
      tick(dt: number, time: number, camera: THREE.Camera, redraw = false) {
        if (!redraw) t += dt
        if (!redraw && t > def.duration) { if (loop && !stopped) { t -= def.duration; for (const e of emitters) e.burstsDone = 0 } else stopped = true }
        if (target) target.getWorldPosition(position)
        origin.copy(position)
        right.setFromMatrixColumn(camera.matrixWorld, 0); up.setFromMatrixColumn(camera.matrixWorld, 1)
        toward.setFromMatrixColumn(camera.matrixWorld, 2)
        if (light && def.light) {
          const fade = def.light.fade ? sampleCurve(def.light.fade, Math.min(1, t / def.duration)) : 1
          const flicker = 1 + (def.light.flicker ?? 0) * (Math.sin(time * 5.3) * .6 + Math.sin(time * 8.7 + .8) * .4)
          light.intensity = stopped ? 0 : def.light.intensity * fade * flicker
          light.position.copy(origin).add(tmp.set(...(def.light.offset ?? [0, 1, 0])))
        }
        for (const state of emitters) emit(state, dt, time, camera, redraw)
      },
    }
    function spawn(state: EmitterState) {
      const e = state.def, shape = e.shape ?? { kind: 'point' }
      const max = e.max ?? 600
      if (state.letters.length >= max || live >= budget) return
      const r = shape.radius ?? 0
      let px = 0, py = 0, pz = 0, nx = 0, ny = 1, nz = 0
      switch (shape.kind) {
        case 'sphere': {
          const u = random() * 2 - 1, a = random() * Math.PI * 2, s = Math.sqrt(1 - u * u)
          nx = s * Math.cos(a); ny = u; nz = s * Math.sin(a)
          const d = shape.surface ? r : r * Math.cbrt(random())
          px = nx * d; py = ny * d; pz = nz * d
          break
        }
        case 'cone': {
          const a = random() * Math.PI * 2, tilt = random() * (shape.angle ?? .4)
          nx = Math.sin(tilt) * Math.cos(a); ny = Math.cos(tilt); nz = Math.sin(tilt) * Math.sin(a)
          const d = random() * r; px = Math.cos(a) * d; pz = Math.sin(a) * d
          break
        }
        case 'ring': {
          const a = random() * Math.PI * 2, d = shape.surface === false ? r * Math.sqrt(random()) : r
          nx = Math.cos(a); ny = 0; nz = Math.sin(a); px = nx * d; pz = nz * d
          break
        }
        case 'box': {
          const [sx, sy, sz] = shape.size ?? [1, 1, 1]
          px = (random() - .5) * sx; py = (random() - .5) * sy; pz = (random() - .5) * sz
          break
        }
        case 'line': {
          const [tx, ty, tz] = shape.to ?? [0, 1, 0], k = random()
          px = tx * k; py = ty * k; pz = tz * k
          break
        }
      }
      const [ox, oy, oz] = e.offset ?? [0, 0, 0], speed = rand(e.speed, 0, random), [vx, vy, vz] = e.velocity ?? [0, 0, 0]
      state.letters.push({ x: origin.x + ox + px, y: origin.y + oy + py, z: origin.z + oz + pz, vx: nx * speed + vx, vy: ny * speed + vy, vz: nz * speed + vz, age: 0, life: Math.max(.05, rand(e.life, 1, random)), seed: random(), settled: false })
      live++
    }
    function look(e: EmitterDef, life: number, letterSeed: number) {
      const glyphs = drawableGlyphs(e.glyphs ?? '.')
      const glyph = glyphs[Math.min(glyphs.length - 1, Math.floor(life * glyphs.length))] ?? '.'
      const size = isCurve(e.size) ? sampleCurve(e.size, life) : rand(e.size as Range | undefined, .16, () => letterSeed)
      const color = isGradient(e.color) ? sampleGradient(e.color, life) : (e.color as RGB | undefined) ?? [1, 1, 1]
      const glow = e.glow ?? 1
      const alpha = isCurve(e.alpha) ? sampleCurve(e.alpha, life) : e.alpha ?? 1
      return { glyph, size, color: [color[0] * glow, color[1] * glow, color[2] * glow] as RGB, alpha }
    }
    function emit(state: EmitterState, dt: number, time: number, camera: THREE.Camera, redraw: boolean) {
      const e = state.def, start = e.start ?? 0, end = start + (e.duration ?? def.duration)
      const active = !stopped && t >= start && t <= end
      const render = e.render ?? 'particle'
      // Shape-driven renders draw directly each frame (no particle state).
      if (render === 'heat') { if (active) heatGrid(e, time, camera); return }
      if (render === 'beam') { if (active) beam(e, time); return }
      if (render === 'flipbook') { if (active) flipbook(e, t - start); return }
      if (render === 'ribbon') { ribbon(state, e, active, !redraw); return }
      if (active && !redraw) {
        if (e.rate) { state.carry += e.rate * dt; while (state.carry >= 1) { state.carry--; spawn(state) } }
        if (e.bursts) while (state.burstsDone < e.bursts.length && t - start >= e.bursts[state.burstsDone].at) { for (let i = 0; i < e.bursts[state.burstsDone].count; i++) spawn(state); state.burstsDone++ }
      }
      const gravity = e.gravity ?? 0, drag = e.drag ?? 0, noise = e.noise ?? 0, attract = e.attract ?? 0, spin = e.spin ?? 0
      for (let i = state.letters.length - 1; i >= 0; i--) {
        const p = state.letters[i]
        if (!redraw) p.age += dt
        if (!redraw && p.age >= p.life) { state.letters.splice(i, 1); live--; continue }
        if (!p.settled && !redraw) {
          p.vy -= gravity * dt
          if (noise) { p.vx += (random() - .5) * noise * dt; p.vy += (random() - .5) * noise * dt; p.vz += (random() - .5) * noise * dt }
          if (attract) { tmp.set(origin.x - p.x, origin.y - p.y, origin.z - p.z); const d = Math.max(.1, tmp.length()); p.vx += tmp.x / d * attract * dt; p.vy += tmp.y / d * attract * dt; p.vz += tmp.z / d * attract * dt }
          if (spin) { const dx = p.x - origin.x, dz = p.z - origin.z, c = Math.cos(spin * dt), s = Math.sin(spin * dt); p.x = origin.x + dx * c - dz * s; p.z = origin.z + dx * s + dz * c }
          const k = Math.max(0, 1 - drag * dt)
          p.vx *= k; p.vy *= k; p.vz *= k
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt
          if (e.ground && p.y < origin.y + .02) { p.y = origin.y + .02; p.settled = true }
        }
        const life = p.age / p.life, l = look(e, life, p.seed)
        if (render === 'ring' && e.ring) ringAt(e, p, life, l)
        else if (render === 'decal') cloud.push(p.x, origin.y + .03, p.z, l.size, l.glyph, l.color, l.alpha)
        else cloud.push(p.x, p.y, p.z, l.size, l.glyph, l.color, l.alpha)
      }
    }
    /** A ring or shockwave of letters around the letter's spawn point, tangent letters on screen. */
    function ringAt(e: EmitterDef, p: Letter, life: number, l: ReturnType<typeof look>) {
      const ring = e.ring!, radius = ring.from + (ring.to - ring.from) * life
      for (let i = 0; i < ring.count; i++) {
        const a = i / ring.count * Math.PI * 2, ox = Math.cos(a), oz = Math.sin(a)
        let glyph = l.glyph
        if (ring.tangent) {
          const sx = ox * right.x + oz * right.z, sy = ox * -toward.x + oz * -toward.z
          glyph = Math.abs(sy) > Math.abs(sx) * 1.9 ? (sy > 0 ? '-' : '_') : Math.abs(sx) > Math.abs(sy) * 1.9 ? '|' : sx * sy > 0 ? '/' : '\\'
        }
        cloud.push(p.x + ox * radius, p.y, p.z + oz * radius, l.size, glyph, l.color, l.alpha)
      }
    }
    function beam(e: EmitterDef, time: number) {
      const b = e.beam ?? { segments: 20 }, [tx, ty, tz] = e.shape?.to ?? [0, 4, 0], [ox, oy, oz] = e.offset ?? [0, 0, 0]
      const life = Math.min(1, t / Math.max(.01, e.duration ?? def.duration)), l = look(e, life, .5)
      const roll = Math.floor(time * (b.jitter ?? 24)), amp = b.amplitude ?? .14
      let jx = 0, jz = 0
      for (let i = 0; i <= b.segments; i++) {
        const k = i / b.segments, step = Math.sin(roll * 3.1 + i * 2.7) * amp
        jx += step * right.x; jz += step * right.z
        const glyph = Math.abs(step) < amp * .35 ? '|' : step > 0 ? '/' : '\\'
        cloud.push(origin.x + ox + tx * k + jx, origin.y + oy + ty * k, origin.z + oz + tz * k + jz, l.size, glyph, l.color, l.alpha)
      }
    }
    function ribbon(state: EmitterState, e: EmitterDef, active: boolean, advance: boolean) {
      const spec = e.ribbon ?? { length: 2, spacing: .15 }
      const last = state.trail[0]
      if (advance && active && (!last || last.distanceTo(origin) >= spec.spacing)) state.trail.unshift(origin.clone())
      if (advance && !active && state.trail.length) state.trail.pop()
      while (state.trail.length * spec.spacing > spec.length) state.trail.pop()
      state.trail.forEach((p, i) => {
        const l = look(e, i / Math.max(1, state.trail.length - 1), .5)
        cloud.push(p.x + (e.offset?.[0] ?? 0), p.y + (e.offset?.[1] ?? 0), p.z + (e.offset?.[2] ?? 0), l.size, l.glyph, l.color, l.alpha)
      })
    }
    function heatGrid(e: EmitterDef, time: number, camera: THREE.Camera) {
      const spec = { ...POMOROG_FIRE, ...e.heat }, [ox, oy, oz] = e.offset ?? [0,0,0]
      const cols = spec.cols, rows = spec.rows, [cw, ch] = spec.cell
      const r = tmp.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize(), rx = r.x, rz = r.z
      const tw = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).setY(0).normalize().multiplyScalar(spec.toward)
      const fract = (v: number) => v - Math.floor(v)
      for (let row = 0; row < rows; row++) for (let c = -cols; c <= cols; c++) {
        const h = row / (rows - 1)
        const width = (cols + .5) * (1 - h * .8) * (.85 + .15 * Math.sin(time * 2.3 + row * .7))
        const shape = 1 - Math.abs(c + Math.sin(time * 1.7 + row * .45) * h * 1.6) / Math.max(.6, width)
        if (shape <= 0) continue
        const n = Math.sin(c * 1.7 + row * .9 - time * 7.5) * Math.sin(c * .6 - row * 1.3 - time * 5.1 + 1.3)
        const flick = fract(Math.sin((c + 13) * 12.9 + (row - Math.floor(time * 9)) * 78.2) * 43758.5)
        const heat = Math.pow(shape, 1.6) * (1 - h * .85) * 1.7 + n * .3 + flick * .2 - .12
        if (heat < .14 || (h > .55 && flick > .8)) continue
        const k = Math.min(spec.ramp.length - 1, Math.floor((1 - Math.min(1, heat)) * spec.ramp.length))
        const [glyph, colour] = spec.ramp[k]
        cloud.push(origin.x + ox + tw.x + rx * c * cw, origin.y + oy + .2 + row * ch, origin.z + oz + tw.z + rz * c * cw, spec.letter, glyph, colour, .9 + Math.min(.1, heat * .1))
      }
    }
    function flipbook(e: EmitterDef, elapsed: number) {
      const book = e.flipbook!
      if (!book.frames.length) return
      let index = Math.floor(elapsed * book.fps)
      index = book.loop === false ? Math.min(index, book.frames.length - 1) : index % book.frames.length
      const frame = book.frames[index], colors = book.colors?.[index]
      const rows = frame.length, cols = Math.max(...frame.map((line) => line.length))
      const [ox, oy, oz] = e.offset ?? [0, 0, 0], l = look(e, .5, .5)
      for (let row = 0; row < rows; row++) for (let col = 0; col < frame[row].length; col++) {
        const glyph = frame[row][col]
        if (glyph === ' ' || !PARTICLE_GLYPHS.includes(glyph)) continue
        const u = (col - cols / 2) * book.cell, v = (rows / 2 - row) * book.cell * 1.25
        const color = colors?.[row]?.[col] ?? l.color
        if (book.facing === 'ground') cloud.push(origin.x + ox + u, origin.y + oy + .03, origin.z + oz - v, l.size, glyph, color, l.alpha)
        else cloud.push(origin.x + ox + right.x * u + up.x * v, origin.y + oy + up.y * v + rows / 2 * book.cell * 1.25, origin.z + oz + right.z * u + up.z * v, l.size, glyph, color, l.alpha)
      }
    }
    playing.push(instance)
    return instance
  }

  return {
    library: library as ReadonlyMap<string, EffectDef>,
    register(...defs: EffectDef[]) { for (const def of defs) library.set(def.name, def) },
    play,
    /** Letters and emitters alive (the budget shown by the editor). */
    get stats() { return { letters: live, effects: playing.length, emitters: playing.reduce((n, p) => n + p.emitterCount, 0), budget } },
    get playing() { return playing as readonly EffectInstance[] },
    /** Advances every effect and pushes its letters; call between `cloud.clear()` and the render. */
    update(dt: number, time: number, camera: THREE.Camera, redraw = false) {
      for (let i = playing.length - 1; i >= 0; i--) {
        const p = playing[i]
        p.tick(dt, time, camera, redraw)
        if (!redraw && p.done) { live -= p.letters; p.dispose(); playing.splice(i, 1) }
      }
    },
    stopAll() { for (const p of playing) p.stop() },
    dispose() { for (const p of playing) p.dispose(); playing.length = 0; live = 0 },
  }
}
export type EffectSystem = ReturnType<typeof createEffectSystem>
