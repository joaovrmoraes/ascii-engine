import { CPU_SUBSYSTEMS, type RenderSample } from '@ascii-engine/core'
import { Vector3 } from 'three'
import { createAsciiEngine } from '../engine'
import { fullWaterSimulation } from '../waterPolicy'
import { BENCHMARK_DT, BENCHMARK_SCENES, createBenchmarkScene, type BenchmarkScene } from './scenes'

const params = new URLSearchParams(location.search)
const name = params.get('bench') as BenchmarkScene
if (!BENCHMARK_SCENES.includes(name)) throw new Error('Unknown benchmark scene')
const waterPolicy = fullWaterSimulation(params) ? 'off' : (params.get('water-policy') ?? 'off')
if (!['off', 'pause'].includes(waterPolicy)) throw new Error('Unknown water policy')
const canvas = document.querySelector('canvas')!
const engine = createAsciiEngine(canvas, {
  maxPixelRatio: 1,
  offscreenWater: waterPolicy === 'pause' ? { mode: 'pause', margin: 4 } : undefined,
  profiling: params.get('profile') !== 'off',
})
const { area, configuration, diagnostics } = createBenchmarkScene(
  engine,
  name,
  Number(params.get('waters') ?? 1),
  {
    creatures: params.has('creatures') ? Number(params.get('creatures')) : undefined,
    effectGroups: params.has('effect-groups') ? Number(params.get('effect-groups')) : undefined,
    waterResolution: params.has('resolution') ? Number(params.get('resolution')) : undefined,
    waterLayout: params.get('water-layout') === 'visible' ? 'visible' : 'loaded',
  },
)
if (name === 'water-scale') configuration.waterPolicy = waterPolicy
const camera = {
  focus: [0, 0.6, 0],
  span: name.startsWith('water') ? 17 : 9,
  angle: Math.PI / 7,
  elevation: Math.atan2(18, 15),
  retreat: 0,
}
if (params.has('creatures')) {
  const columns = Math.ceil(Math.sqrt(Number(configuration.creatures)))
  camera.span = Math.max(9, columns * 2.25)
  camera.retreat = Math.max(0, columns * 3 - 12)
}
if (params.get('water-layout') === 'visible') {
  const columns = Math.ceil(Math.sqrt(Number(configuration.waterCount)))
  camera.span = 17 * columns
  camera.retreat = (columns - 1) * 48
}
const direction = new Vector3()
function frame() {
  engine.frame(area.hero, camera.span, camera.angle, camera.elevation)
  if (camera.retreat) {
    engine.camera.getWorldDirection(direction)
    engine.camera.position.addScaledVector(direction, -camera.retreat)
    engine.camera.far = 90 + camera.retreat * 2
    engine.camera.updateProjectionMatrix()
    engine.camera.updateMatrixWorld()
  }
}
frame()
engine.render(0)
canvas.dataset.ready = 'true'

const gl = engine.renderer.getContext() as WebGL2RenderingContext
// Only the uncapped runner bounds overlapping GPU work. Default views stay unchanged.
const gpuQueueLimit = params.get('queue') === '2' ? 2 : 0
if (gpuQueueLimit && typeof gl.fenceSync !== 'function')
  throw new Error('Uncapped completion measurement requires WebGL2 fences')
const debug = gl.getExtension('WEBGL_debug_renderer_info')
let timerResolutionMs = Infinity,
  previousTick = performance.now()
for (let i = 0; i < 10000; i++) {
  const tick = performance.now()
  if (tick > previousTick) timerResolutionMs = Math.min(timerResolutionMs, tick - previousTick)
  previousTick = tick
}
function fingerprint() {
  let hash = 2166136261,
    values = 0,
    skinnedPoints = 0
  function add(array: ArrayLike<number>) {
    const bytes = new Uint8Array(new Float32Array(Array.from(array)).buffer)
    for (const byte of bytes) hash = Math.imul(hash ^ byte, 16777619) >>> 0
    values += array.length
  }
  for (const scene of [engine.scene, engine.carpetScene, engine.waterScene, engine.particleScene]) {
    scene.traverse(object => {
      const geometry = (object as import('three').Points).geometry
      if (geometry?.attributes.position) add(geometry.attributes.position.array)
      if (object.userData.skin) skinnedPoints += geometry.attributes.position.count
    })
  }
  for (const water of engine.waters) {
    const dynamics = (water as ReturnType<typeof engine.createWater>).dynamics
    if (dynamics) {
      add(dynamics.depth)
      add(dynamics.flowX)
      add(dynamics.flowZ)
      add(dynamics.foam)
    }
  }
  let visibleWaterHash: string | undefined
  if (name === 'water-scale') {
    const water = engine.waters[0] as ReturnType<typeof engine.createWater>
    let visible = 2166136261
    for (const array of [
      water.mesh.geometry.attributes.position.array,
      water.mesh.geometry.attributes.normal.array,
      water.dynamics.depth,
      water.dynamics.flowX,
      water.dynamics.flowZ,
      water.dynamics.foam,
      water.uniforms.waterDynamics.value.image.data!,
    ]) {
      const bytes = new Uint8Array(new Float32Array(Array.from(array)).buffer)
      for (const byte of bytes) visible = Math.imul(visible ^ byte, 16777619) >>> 0
    }
    visibleWaterHash = visible.toString(16)
  }
  return {
    hash: hash.toString(16),
    values,
    skinnedPoints,
    time: engine.time,
    ...(visibleWaterHash ? { visibleWaterHash } : {}),
  }
}

let hasRun = false,
  animation = 0
async function run(warmup = 600, frames = 600) {
  if (hasRun) throw new Error('Reload the page for a fresh benchmark run')
  if (!Number.isInteger(warmup) || warmup < 0 || !Number.isInteger(frames) || frames < 1)
    throw new Error('Invalid frame counts')
  hasRun = true
  const samples: (RenderSample & {
    frameMs: number
    rafIntervalMs: number | null
    frameCpuMs: number
    sceneCpuMs: number
    gpuMs: number | null
    schedulerCpuMs: number
    completedFrameMs: number | null
    gpuLatencyMs: number | null
  })[] = []
  const gpuSamples = new Map<number, number>()
  const pending: { sync: WebGLSync; frame: number; started: number }[] = []
  const completed = new Map<number, { interval: number; latency: number }>()
  const pollChannel = gpuQueueLimit ? new MessageChannel() : undefined
  let pollTimer = 0
  let count = 0,
    previous = 0,
    previousWall = 0,
    visibilityChanges = 0,
    peakGpuQueue = 0,
    pollCallbacks = 0,
    schedulerCpuMs = 0,
    totalSchedulerCpuMs = 0,
    lastCompletion = 0
  function pollFence() {
    const started = performance.now()
    pollCallbacks++
    if (pending.length) {
      const item = pending[0]
      if (performance.now() - item.started > 10000)
        throw new Error('GPU fence completion timed out')
      const status = gl.clientWaitSync(item.sync, 0, 0)
      if (status === gl.WAIT_FAILED) throw new Error('GPU fence failed')
      if (status !== gl.TIMEOUT_EXPIRED) {
        const now = performance.now()
        pending.shift()
        gl.deleteSync(item.sync)
        completed.set(item.frame, {
          interval: lastCompletion ? now - lastCompletion : 0,
          latency: now - item.started,
        })
        lastCompletion = now
      }
    }
    const cost = performance.now() - started
    schedulerCpuMs += cost
    totalSchedulerCpuMs += cost
  }
  const visibility = () => {
    visibilityChanges++
  }
  document.addEventListener('visibilitychange', visibility)
  try {
    await new Promise<void>((resolve, reject) => {
      // Uncapped render steps use tasks, independently of compositor/rAF cadence.
      // Each message task starts a fresh 1 ms timer, avoiding nested timer clamping.
      if (pollChannel)
        pollChannel.port1.onmessage = event => {
          if (event.data === 'step') {
            step(performance.now())
            return
          }
          pollTimer = window.setTimeout(() => {
            try {
              pollFence()
              if (pending.length >= gpuQueueLimit) pollChannel.port2.postMessage(null)
              else pollChannel.port2.postMessage('step')
            } catch (error) {
              reject(error)
            }
          }, 1)
        }
      function step(now: number) {
        try {
          if (document.hidden) throw new Error('Benchmark document became hidden')
          if (gpuQueueLimit && pending.length >= gpuQueueLimit) {
            pollFence()
            if (pending.length >= gpuQueueLimit) {
              pollChannel!.port2.postMessage(null)
              return
            }
          }
          const entered = performance.now()
          if (samples.length) {
            samples.at(-1)!.frameMs = entered - previousWall
            samples.at(-1)!.rafIntervalMs = gpuQueueLimit ? null : now - previous
          }
          previous = now
          previousWall = entered
          if (count === warmup + frames) {
            resolve()
            return
          }
          const started = performance.now()
          area.update(engine.time + BENCHMARK_DT, BENCHMARK_DT)
          frame()
          engine.render(BENCHMARK_DT)
          const frameCpuMs = performance.now() - started
          const stats = engine.stats?.latest
          if (gpuQueueLimit) {
            const fenceStarted = performance.now()
            const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
            if (!sync) throw new Error('GPU fence unavailable')
            pending.push({ sync, frame: stats?.frame ?? count + 2, started })
            peakGpuQueue = Math.max(peakGpuQueue, pending.length)
            gl.flush() // Submit without waiting; CPU and GPU remain overlapped.
            const cost = performance.now() - fenceStarted
            schedulerCpuMs += cost
            totalSchedulerCpuMs += cost
          }
          if (count >= warmup)
            samples.push({
              ...(stats ?? {
                frame: count + 2,
                cpuMs: 0,
                timings: Object.fromEntries(
                  CPU_SUBSYSTEMS.map(key => [key, 0]),
                ) as RenderSample['timings'],
                drawCalls: 0,
                triangles: 0,
                points: 0,
              }),
              frameMs: 0,
              rafIntervalMs: 0,
              frameCpuMs,
              sceneCpuMs: frameCpuMs - (stats?.cpuMs ?? 0),
              gpuMs: null,
              schedulerCpuMs,
              completedFrameMs: null,
              gpuLatencyMs: null,
            })
          schedulerCpuMs = 0
          for (const sample of engine.stats?.takeGpuSamples() ?? [])
            gpuSamples.set(sample.frame, sample.ms)
          count++
          if (pollChannel) pollChannel.port2.postMessage('step')
          else animation = requestAnimationFrame(step)
        } catch (error) {
          reject(error)
        }
      }
      if (pollChannel) pollChannel.port2.postMessage('step')
      else animation = requestAnimationFrame(step)
    })
    // Drain completed GPU work asynchronously; no extra simulation steps or gl.finish().
    const deadline = performance.now() + 10000
    while (pending.length) {
      if (performance.now() > deadline) throw new Error('GPU fence completion timed out')
      await new Promise<void>(resolve =>
        gpuQueueLimit ? window.setTimeout(resolve, 1) : requestAnimationFrame(() => resolve()),
      )
      pollFence()
      for (const sample of engine.stats?.takeGpuSamples() ?? [])
        gpuSamples.set(sample.frame, sample.ms)
    }
    // Poll asynchronously after the final submission; do not simulate extra steps or gl.finish().
    for (let i = 0; i < 60 && engine.stats?.gpu.available; i++) {
      await new Promise<void>(resolve =>
        gpuQueueLimit ? window.setTimeout(resolve, 1) : requestAnimationFrame(() => resolve()),
      )
      for (const sample of engine.stats.takeGpuSamples()) gpuSamples.set(sample.frame, sample.ms)
      if (gpuSamples.has(samples.at(-1)!.frame)) break
    }
    for (const sample of samples) {
      sample.gpuMs = gpuSamples.get(sample.frame) ?? null
      sample.completedFrameMs = completed.get(sample.frame)?.interval ?? null
      sample.gpuLatencyMs = completed.get(sample.frame)?.latency ?? null
    }
    return {
      configuration,
      camera,
      warmup,
      frames,
      frameClock: gpuQueueLimit
        ? 'performance.now free-running task interval; asynchronous bounded GPU queue; no rAF pacing'
        : 'performance.now callback interval; rAF cadence recorded separately',
      gpuQueue: {
        limit: gpuQueueLimit,
        scheduler: gpuQueueLimit ? 'task' : 'rAF',
        peak: peakGpuQueue,
        completedFrames: completed.size,
        pollCallbacks,
        totalSchedulerCpuMs,
        completionClock: 'CPU-observed asynchronous fence completion; includes polling delay',
        polling: 'non-nested 1 ms timers and task submissions; no spin or blocking GPU wait',
      },
      samples,
      fingerprint: fingerprint(),
      resources: engine.resources,
      diagnostics: diagnostics(),
      effectStats: name === 'particles' ? engine.fx.stats : undefined,
      visibilityChanges,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        dpr: devicePixelRatio,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      },
      gpu: engine.stats?.gpu ?? { available: false, status: 'profiling-disabled' },
      browser: {
        userAgent: navigator.userAgent,
        isolated: crossOriginIsolated,
        hardwareConcurrency: navigator.hardwareConcurrency,
        timerResolutionMs: Number.isFinite(timerResolutionMs) ? timerResolutionMs : null,
        renderer: debug
          ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER),
        vendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      },
    }
  } finally {
    clearTimeout(pollTimer)
    pollChannel?.port1.close()
    pollChannel?.port2.close()
    for (const item of pending) gl.deleteSync(item.sync)
    document.removeEventListener('visibilitychange', visibility)
  }
}

function snapshot() {
  const bodies: { position: number[]; normal: number[] }[] = []
  engine.scene.traverse(object => {
    if (!object.userData.skin) return
    const geometry = (object as import('three').Points).geometry
    bodies.push({
      position: Array.from(geometry.attributes.position.array),
      normal: Array.from(geometry.attributes.normal.array),
    })
  })
  const waters = engine.waters.map(source => {
    const water = source as ReturnType<typeof engine.createWater>
    return {
      position: Array.from(water.mesh.geometry.attributes.position.array),
      normal: Array.from(water.mesh.geometry.attributes.normal.array),
      depth: Array.from(water.dynamics.depth),
      flowX: Array.from(water.dynamics.flowX),
      flowZ: Array.from(water.dynamics.flowZ),
      foam: Array.from(water.dynamics.foam),
    }
  })
  return { bodies, waters, diagnostics: diagnostics(), time: engine.time }
}
Object.assign(window, {
  engine,
  area,
  benchmark: { ready: true, configuration, run, fingerprint, snapshot },
})
addEventListener(
  'pagehide',
  () => {
    cancelAnimationFrame(animation)
    engine.dispose()
  },
  { once: true },
)
