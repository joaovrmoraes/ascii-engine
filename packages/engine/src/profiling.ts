import type * as THREE from 'three'

export const CPU_SUBSYSTEMS = [
  'waterStep',
  'waterUpload',
  'skinning',
  'effects',
  'carpet',
  'bodyUniforms',
  'renderRest',
] as const
export type CpuSubsystem = (typeof CPU_SUBSYSTEMS)[number]
export type CpuTimings = Record<CpuSubsystem, number>
export type WaterUpdateTimings = Pick<CpuTimings, 'waterStep' | 'waterUpload'>
export interface GpuSample {
  frame: number
  ms: number
}
export interface RenderSample {
  frame: number
  cpuMs: number
  timings: CpuTimings
  drawCalls: number
  triangles: number
  points: number
}
export interface EngineStats {
  readonly latest: RenderSample | undefined
  readonly gpu: {
    available: boolean
    status: 'unsupported' | 'pending' | 'ready' | 'disjoint'
    disjointEvents: number
    dropped: number
  }
  /** Completed GPU ranges, tagged with the original render frame. Never waits. */
  takeGpuSamples(): GpuSample[]
}

interface TimerExtension {
  TIME_ELAPSED_EXT: number
  GPU_DISJOINT_EXT: number
}

/** Constructed only on explicit opt-in. The disabled renderer creates no queries or timers. */
export function createRenderProfiler(
  renderer: THREE.WebGLRenderer,
  clock = () => performance.now(),
) {
  const gl = renderer.getContext() as WebGL2RenderingContext
  const extension = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension | null
  const gpu: EngineStats['gpu'] = {
    available: !!extension,
    status: extension ? 'pending' : 'unsupported',
    disjointEvents: 0,
    dropped: 0,
  }
  const timings = Object.fromEntries(CPU_SUBSYSTEMS.map(key => [key, 0])) as CpuTimings
  const pending: { query: WebGLQuery; frame: number }[] = []
  const completed: GpuSample[] = []
  let frame = 0,
    started = 0,
    section = 0,
    active: WebGLQuery | null = null,
    latest: RenderSample | undefined,
    previousAutoReset = true

  function pollGpu() {
    if (!extension) return
    if (gl.getParameter(extension.GPU_DISJOINT_EXT)) {
      gpu.status = 'disjoint'
      gpu.disjointEvents++
      for (const item of pending) gl.deleteQuery(item.query)
      pending.length = 0
      return
    }
    while (pending.length && gl.getQueryParameter(pending[0].query, gl.QUERY_RESULT_AVAILABLE)) {
      const item = pending.shift()!
      const ms = gl.getQueryParameter(item.query, gl.QUERY_RESULT) / 1e6
      gl.deleteQuery(item.query)
      completed.push({ frame: item.frame, ms })
      gpu.status = 'ready'
    }
  }

  return {
    timings,
    gpu,
    get latest() {
      return latest
    },
    takeGpuSamples() {
      pollGpu()
      return completed.splice(0)
    },
    begin() {
      started = clock()
      frame++
      for (const key of CPU_SUBSYSTEMS) timings[key] = 0
      pollGpu()
      previousAutoReset = renderer.info.autoReset
      renderer.info.autoReset = false
      renderer.info.reset()
    },
    startSection() {
      section = clock()
    },
    endSection(name: CpuSubsystem) {
      timings[name] += clock() - section
    },
    /** Start lazily just before the first reflection/main render submission. */
    startGpu() {
      if (!extension || active) return
      if (pending.length >= 8) {
        gpu.dropped++
        return
      }
      active = gl.createQuery()
      if (active) gl.beginQuery(extension.TIME_ELAPSED_EXT, active)
    },
    end() {
      if (active && extension) {
        gl.endQuery(extension.TIME_ELAPSED_EXT)
        pending.push({ frame, query: active })
        active = null
      }
      const cpuMs = clock() - started
      const measured = CPU_SUBSYSTEMS.reduce((sum, key) => sum + timings[key], 0)
      timings.renderRest = Math.max(0, cpuMs - measured)
      latest = {
        frame,
        cpuMs,
        timings: { ...timings },
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        points: renderer.info.render.points,
      }
      renderer.info.autoReset = previousAutoReset
    },
    dispose() {
      if (active && extension) {
        gl.endQuery(extension.TIME_ELAPSED_EXT)
        gl.deleteQuery(active)
      }
      for (const item of pending) gl.deleteQuery(item.query)
      pending.length = completed.length = 0
    },
  }
}
