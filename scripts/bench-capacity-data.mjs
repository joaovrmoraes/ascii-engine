import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { summarize, relativeDifference, classifyBottleneck, qualifyTarget } from './bench-stats.mjs'

export async function aggregatePoint(root, point) {
  const rounds = await Promise.all(
    point.files.map(file => readFile(resolve(root, file), 'utf8').then(JSON.parse)),
  )
  const environments = await Promise.all(
    point.files.map(file =>
      readFile(resolve(root, file, '../environment.json'), 'utf8').then(JSON.parse),
    ),
  )
  const all = [],
    roundStatistics = []
  const hashes = new Set()
  const sources = new Set()
  const diagnostics = [],
    memoryPeaks = []
  for (let i = 0; i < 2; i++) {
    const env = environments[i],
      round = rounds[i]
    if (
      env.trackedChanges ||
      env.framePacing !== 'uncapped' ||
      env.rendererCpu !== 6 ||
      !env.extensionsDisabled ||
      !env.browserIsolation.startsWith('fresh Chromium process') ||
      ![
        '--disable-gpu-vsync',
        '--disable-frame-rate-limit',
        '--disable-extensions',
        '--use-angle=gl',
      ].every(flag => env.flags.includes(flag))
    )
      throw new Error('Capacity protocol mismatch: ' + point.id)
    sources.add(env.sourceCommit)
    if (round.runs.length !== 5) throw new Error('Capacity requires five runs per round')
    const roundRows = []
    for (const run of round.runs) {
      if (run.after.memory?.renderer?.peakRssBytes)
        memoryPeaks.push(run.after.memory.renderer.peakRssBytes)
      const m = run.metadata,
        pin = run.before.rendererAffinity
      if (
        m.frames !== 600 ||
        m.warmup !== 600 ||
        m.configuration.dt !== 1 / 60 ||
        m.configuration.seed !== 4242 ||
        m.viewport.width !== 1920 ||
        m.viewport.height !== 1080 ||
        m.viewport.dpr !== 1 ||
        m.visibilityChanges ||
        m.gpu.disjointEvents ||
        m.gpu.dropped ||
        m.gpuQueue.completedFrames !== 1200 ||
        m.gpuQueue.limit !== 2 ||
        m.gpuQueue.scheduler !== 'task' ||
        m.gpuQueue.peak > 2 ||
        run.samples.length !== 600 ||
        pin?.length !== 1 ||
        pin[0].allowed !== '6' ||
        run.before.extensionTargets?.length !== 0
      )
        throw new Error('Invalid capacity execution: ' + point.id)
      hashes.add(m.fingerprint.hash)
      diagnostics.push({
        configuration: m.configuration,
        diagnostics: m.diagnostics,
        effectStats: m.effectStats,
        skinnedPoints: m.fingerprint.skinnedPoints,
      })
      for (const values of run.samples) {
        const row = Object.fromEntries(round.columns.map((key, j) => [key, values[j]]))
        if (
          !Number.isFinite(row.gpuMs) ||
          !Number.isFinite(row.frameMs) ||
          row.frameMs < row.frameCpuMs ||
          row.rafIntervalMs !== null ||
          !Number.isFinite(row.completedFrameMs)
        )
          throw new Error('Invalid capacity timing')
        all.push(row)
        roundRows.push(row)
      }
    }
    roundStatistics.push(summarize(roundRows))
  }
  if (hashes.size !== 1) throw new Error('Non-repeating fixed-step state: ' + point.id)
  if (sources.size !== 1 || new Set(environments.map(e => e.chromium.product)).size !== 1)
    throw new Error('Source/browser changed between capacity rounds')
  for (const d of diagnostics) {
    if (point.axis === 'skinning' && d.configuration.creatures !== point.load)
      throw new Error('Incorrect creature load')
    if (
      point.axis === 'particles' &&
      (d.configuration.campfires !== point.load || d.effectStats.effects !== point.load * 3)
    )
      throw new Error('Incorrect effect load')
    if (point.axis?.startsWith('water-')) {
      const count = point.axis === 'water-grid' ? 1 : point.load
      if (
        d.configuration.waterCount !== count ||
        d.configuration.waterResolution !== (point.axis === 'water-grid' ? point.load : 129)
      )
        throw new Error('Incorrect water load/grid')
      if (
        d.diagnostics.waterCalls.length !== count ||
        d.diagnostics.waterCalls.some(
          (calls, i) => calls !== (point.axis === 'water-loaded-pause' && i > 0 ? 0 : 1201),
        )
      )
        throw new Error('Incorrect scheduled water updates')
    }
  }
  const stats = summarize(all),
    repeatability = relativeDifference(
      roundStatistics[0].frameMs.p50,
      roundStatistics[1].frameMs.p50,
    )
  return {
    ...point,
    stats,
    repeatability,
    stable: repeatability <= 0.05,
    capacityP95: Math.max(...roundStatistics.map(r => r.frameMs.p95)),
    rounds: roundStatistics.map(r => ({
      frame: r.frameMs,
      cpu: r.frameCpuMs,
      gpu: r.gpuMs,
    })),
    bottleneck: classifyBottleneck(stats.frameCpuMs.p50, stats.gpuMs.p50),
    sources: [...sources],
    hash: [...hashes][0],
    diagnostics,
    environment: environments[0],
    sampleCount: all.length,
    peakRendererRssBytes: memoryPeaks.length ? Math.max(...memoryPeaks) : null,
    pointCountRange: [Math.min(...all.map(r => r.points)), Math.max(...all.map(r => r.points))],
  }
}

/** Report measured maxima, never an interpolated or untested integer capacity. */
export function capacityAt(points, budget) {
  const sorted = [...points].sort((a, b) => a.load - b.load)
  const passing = sorted.filter(p => p.stable && !p.capped && p.capacityP95 <= budget)
  const maximum = passing.at(-1)
  const nextFail = sorted.find(p => p.load > (maximum?.load ?? 0) && p.capacityP95 > budget)
  return {
    budget,
    maximum: maximum?.load ?? 0,
    frameP95: maximum?.capacityP95 ?? null,
    nextFail: nextFail?.load ?? null,
    lowerBound: !!maximum && !nextFail,
  }
}

/** Stop only on measured numeric work with CPU dominance in both complete rounds. */
export function visibleWaterCandidate(point) {
  const step = point.stats.waterStep?.p50,
    frame = point.stats.frameMs.p50
  if (
    point.stable !== true ||
    !Number.isFinite(step) ||
    !Number.isFinite(frame) ||
    frame <= 0 ||
    !qualifyTarget('waterStep', step, frame, point.bottleneck).qualifies ||
    point.rounds.length !== 2 ||
    !point.rounds.every(r => classifyBottleneck(r.cpu.p50, r.gpu.p50) === 'CPU')
  )
    return null
  return {
    load: point.load,
    subsystem: 'waterStep',
    frameShare: step / frame,
    stepP50: step,
    frameP50: frame,
    reason:
      'Remaining numeric CPU work passes the original qualification rule; stop for owner review, no WASM',
  }
}
