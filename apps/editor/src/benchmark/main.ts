import { CPU_SUBSYSTEMS, type RenderSample } from '@ascii-engine/core'
import { createAsciiEngine } from '../engine'
import { BENCHMARK_DT, BENCHMARK_SCENES, createBenchmarkScene, type BenchmarkScene } from './scenes'

const params = new URLSearchParams(location.search)
const name = params.get('bench') as BenchmarkScene
if (!BENCHMARK_SCENES.includes(name)) throw new Error('Unknown benchmark scene')
const canvas = document.querySelector('canvas')!
const engine = createAsciiEngine(canvas, {
  maxPixelRatio: 1,
  profiling: params.get('profile') !== 'off',
})
const { area, configuration } = createBenchmarkScene(engine, name)
const camera = {
  focus: [0, 0.6, 0],
  span: name === 'water' ? 17 : 9,
  angle: Math.PI / 7,
  elevation: Math.atan2(18, 15),
}
engine.frame(area.hero, camera.span, camera.angle, camera.elevation)
engine.render(0)
canvas.dataset.ready = 'true'

const gl = engine.renderer.getContext()
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
  return { hash: hash.toString(16), values, skinnedPoints, time: engine.time }
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
    frameCpuMs: number
    sceneCpuMs: number
    gpuMs: number | null
  })[] = []
  const gpuSamples = new Map<number, number>()
  let count = 0,
    previous = 0,
    visibilityChanges = 0
  const visibility = () => {
    visibilityChanges++
  }
  document.addEventListener('visibilitychange', visibility)
  try {
    await new Promise<void>((resolve, reject) => {
      function step(now: number) {
        try {
          if (document.hidden) throw new Error('Benchmark document became hidden')
          if (samples.length) samples.at(-1)!.frameMs = now - previous
          previous = now
          const started = performance.now()
          area.update(engine.time + BENCHMARK_DT, BENCHMARK_DT)
          engine.frame(area.hero, camera.span, camera.angle, camera.elevation)
          engine.render(BENCHMARK_DT)
          const frameCpuMs = performance.now() - started
          const stats = engine.stats?.latest
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
              frameCpuMs,
              sceneCpuMs: frameCpuMs - (stats?.cpuMs ?? 0),
              gpuMs: null,
            })
          for (const sample of engine.stats?.takeGpuSamples() ?? [])
            gpuSamples.set(sample.frame, sample.ms)
          count++
          if (count === warmup + frames) resolve()
          else animation = requestAnimationFrame(step)
        } catch (error) {
          reject(error)
        }
      }
      animation = requestAnimationFrame(step)
    })
    // Associate each interval with the work submitted in that frame, including the last one.
    await new Promise<void>(resolve =>
      requestAnimationFrame(now => {
        samples.at(-1)!.frameMs = now - previous
        resolve()
      }),
    )
    // Poll asynchronously after the final submission; do not simulate extra steps or gl.finish().
    for (let i = 0; i < 60 && engine.stats?.gpu.available; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      for (const sample of engine.stats.takeGpuSamples()) gpuSamples.set(sample.frame, sample.ms)
      if (gpuSamples.has(samples.at(-1)!.frame)) break
    }
    for (const sample of samples) sample.gpuMs = gpuSamples.get(sample.frame) ?? null
    return {
      configuration,
      camera,
      warmup,
      frames,
      samples,
      fingerprint: fingerprint(),
      resources: engine.resources,
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
    document.removeEventListener('visibilitychange', visibility)
  }
}

Object.assign(window, { engine, area, benchmark: { ready: true, configuration, run, fingerprint } })
addEventListener(
  'pagehide',
  () => {
    cancelAnimationFrame(animation)
    engine.dispose()
  },
  { once: true },
)
