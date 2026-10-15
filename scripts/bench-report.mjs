import { readFile, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { relativeDifference, summarize, classifyBottleneck, qualifyTarget } from './bench-stats.mjs'

const root = resolve(
  process.argv[2] ?? `docs/captures/benchmarks-${new Date().toISOString().slice(0, 10)}`,
)
const rounds = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ['uncapped-round-1', 'uncapped-round-2']
if (rounds.length !== 2) throw new Error('Supply exactly two round directories')
for (const round of rounds) {
  const environment = JSON.parse(await readFile(join(root, round, 'environment.json'), 'utf8'))
  if (
    environment.framePacing !== 'uncapped' ||
    !['--disable-gpu-vsync', '--disable-frame-rate-limit'].every(flag =>
      environment.flags.includes(flag),
    )
  )
    throw new Error(
      'Qualification requires uncapped rounds; display-paced data only describes presentation cadence',
    )
}
const paced = JSON.parse(await readFile(join(root, 'vsync-summary.json'), 'utf8'))
const scenes = ['water', 'particles', 'skinning'],
  subsystems = [
    'waterStep',
    'waterUpload',
    'skinning',
    'effects',
    'carpet',
    'bodyUniforms',
    'renderRest',
  ]
const labels = {
  waterStep: 'Water step',
  waterUpload: 'Water upload / geometry preparation',
  skinning: 'Skinned vertex math',
  effects: 'Effects',
  carpet: 'Carpet',
  bodyUniforms: 'Body uniforms',
  renderRest: 'Remaining render submission',
}
const fmt = value => (value === null ? 'unavailable' : value.toFixed(3))
const report = [
  '# Simulation performance study — Phase 1',
  '',
  'Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.',
  '',
  'Methodology amendment: the original display-paced measurements were limited by presentation cadence near 16.665 ms. Their frame shares and repeatability do not establish workload cost. The original [vsync report](vsync-report.md), [summary](vsync-summary.json) and round-1/round-2 raw data are preserved. The measurements below disable GPU vsync and the frame-rate limit; qualification uses these uncapped results and the observed CPU/GPU bottleneck.',
  '',
  '1920×1080 CSS pixels, DPR 1, dt 1/60 s, unchanged fixed camera and seeded scenes. Chromium adds --disable-gpu-vsync and --disable-frame-rate-limit. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. The uncapped harness submits free-running MessageChannel tasks instead of requestAnimationFrame; rafIntervalMs is null. Frame time is the performance.now() interval between actual simulation/render steps with at most two GPU frames in flight. Asynchronous fences apply backpressure and all frames drain at the end; CPU frame N can overlap GPU frame N-1. Completion-observation intervals, latency, CPU/GPU ranges, scheduler cost and sustained mean frame time are reported separately. No gl.finish, synchronous GPU wait or per-frame CPU/GPU serialization is used. Completion observation includes polling delay; neither metric claims physical scanout time.',
  '',
  'Percentiles use nearest rank over equally sized runs. Frame share = subsystem CPU p50 / uncapped frame p50; CPU share = subsystem CPU p50 / active CPU frame p50. Classification compares active CPU p50 with GPU-range p50: at least 20% separation means CPU- or GPU-dominant, otherwise mixed; missing GPU timing means unknown. This is a descriptive inference, not proof of an exclusive bottleneck. CPU submission can include driver backpressure. CPU/GPU overlap and must not be added. A target requires numeric-array work, at least 15% of the uncapped frame and evidence of a CPU bottleneck. A CPU speedup in a GPU-limited scene is not a measured frame gain. Water upload includes Three.js geometry updates; its aggregate does not establish a portable kernel.',
  '',
]
const results = []
let stable = true
for (const scene of scenes) {
  const data = await Promise.all(
    rounds.map(async round =>
      JSON.parse(await readFile(join(root, round, scene + '.json'), 'utf8')),
    ),
  )
  if (data.some(d => d.runs.some(run => !run.metadata.frameClock?.startsWith('performance.now'))))
    throw new Error('These rounds only measure scheduled rAF cadence; use the wall-clock rounds')
  if (
    data.some(d =>
      d.runs.some(
        run => run.metadata.gpuQueue?.limit !== 2 || run.metadata.gpuQueue?.scheduler !== 'task',
      ),
    )
  )
    throw new Error(
      'Uncapped submission alone is not completed-frame throughput; use bounded GPU queue rounds',
    )
  if (
    data.some(
      d =>
        d.runs.length < 5 ||
        d.runs.some(run => run.metadata.frames < 600 || run.samples.length !== run.metadata.frames),
    )
  )
    throw new Error('A complete round requires at least five runs of at least 600 measured frames')
  const rows = data.flatMap(d =>
    d.runs.flatMap(run =>
      run.samples.map(sample => Object.fromEntries(d.columns.map((key, i) => [key, sample[i]]))),
    ),
  )
  const stats = summarize(rows),
    a = data[0].summary,
    b = data[1].summary,
    delta = relativeDifference(a.frameMs.p50, b.frameMs.p50),
    bottleneck = classifyBottleneck(stats.frameCpuMs.p50, stats.gpuMs.p50),
    pacedStats = paced.results.find(result => result.scene === scene).summary,
    meanFrameMs = rows.reduce((sum, row) => sum + row.frameMs, 0) / rows.length,
    meanCompletedFrameMs = rows.reduce((sum, row) => sum + row.completedFrameMs, 0) / rows.length
  if (delta > 0.05) stable = false
  report.push(
    `## ${scene}`,
    '',
    `Frame p50/p95/p99: **${fmt(stats.frameMs.p50)} / ${fmt(stats.frameMs.p95)} / ${fmt(stats.frameMs.p99)} ms**. Active CPU p50/p95: ${fmt(stats.frameCpuMs.p50)} / ${fmt(stats.frameCpuMs.p95)} ms. GPU range p50/p95: ${fmt(stats.gpuMs.p50)} / ${fmt(stats.gpuMs.p95)} ms. Draw calls p50/p95: ${fmt(stats.drawCalls.p50)} / ${fmt(stats.drawCalls.p95)}.`,
    '',
    `**Bottleneck classification: ${bottleneck}**. Active CPU / GPU p50 ratio: ${stats.gpuMs.p50 ? (stats.frameCpuMs.p50 / stats.gpuMs.p50).toFixed(2) : 'unavailable'}. Original paced frame p50/p95: ${fmt(pacedStats.frameMs.p50)} / ${fmt(pacedStats.frameMs.p95)} ms (context only).`,
    '',
    `Asynchronously observed GPU-completion interval p50/p95: ${fmt(stats.completedFrameMs.p50)} / ${fmt(stats.completedFrameMs.p95)} ms. In-flight frame latency p50/p95: ${fmt(stats.gpuLatencyMs.p50)} / ${fmt(stats.gpuLatencyMs.p95)} ms (latency is not throughput). Fence/scheduler CPU p50/p95: ${fmt(stats.schedulerCpuMs.p50)} / ${fmt(stats.schedulerCpuMs.p95)} ms, reported separately from active scene CPU.`,
    '',
    `Sustained mean step / completion interval: ${fmt(meanFrameMs)} / ${fmt(meanCompletedFrameMs)} ms per frame. These means are additional throughput context, not relabeled p50 values.`,
    '',
    `Round frame p50: ${fmt(a.frameMs.p50)} vs ${fmt(b.frameMs.p50)} ms; symmetric difference **${(delta * 100).toFixed(2)}%** (${delta <= 0.05 ? 'within 5%' : 'UNSTABLE; investigate before concluding'}).`,
    '',
    '| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- |',
  )
  const targets = []
  for (const key of subsystems) {
    const share = stats[key].p50 / stats.frameMs.p50,
      variation = relativeDifference(a[key].p50, b[key].p50)
    const { qualifies, reason: qualification } = qualifyTarget(
      key,
      stats[key].p50,
      stats.frameMs.p50,
      bottleneck,
    )
    report.push(
      `| ${labels[key]} | ${fmt(stats[key].p50)} | ${fmt(stats[key].p95)} | ${(share * 100).toFixed(2)}% | ${((stats[key].p50 / stats.frameCpuMs.p50) * 100).toFixed(2)}% | ${(variation * 100).toFixed(2)}% | ${qualification} |`,
    )
    targets.push({
      subsystem: key,
      ...stats[key],
      share,
      cpuShare: stats[key].p50 / stats.frameCpuMs.p50,
      roundP50Difference: variation,
      qualifies,
      qualification,
    })
  }
  const fingerprints = data.flatMap(d => d.runs.map(run => run.metadata.fingerprint.hash))
  if (new Set(fingerprints).size !== 1) throw new Error('Scene state was not repeatable: ' + scene)
  report.push(
    '',
    `Final state hash: ${fingerprints[0]} in all ${fingerprints.length} runs. GPU samples: ${rows.filter(row => row.gpuMs !== null).length}/${rows.length}. Timer quantum: ${data[0].runs[0].metadata.browser.timerResolutionMs} ms.`,
    '',
    `Raw data: [${rounds[0]}](${rounds[0]}/${scene}.json), [${rounds[1]}](${rounds[1]}/${scene}.json).`,
    '',
  )
  results.push({
    scene,
    summary: stats,
    meanFrameMs,
    meanCompletedFrameMs,
    pacedSummary: pacedStats,
    bottleneck,
    frameP50Difference: delta,
    targets,
  })
}
const pacedWater = paced.results.find(result => result.scene === 'water').summary
report.push(
  '## Why water CPU share is not a WASM case',
  '',
  `In the original paced data, water step p50 was ${fmt(pacedWater.waterStep.p50)} ms out of ${fmt(pacedWater.frameCpuMs.p50)} ms active CPU: **${((100 * pacedWater.waterStep.p50) / pacedWater.frameCpuMs.p50).toFixed(1)}% of CPU time** (20.9% rounded). Its 6.00% share of the paced frame used a vsync-dependent denominator. Neither percentage establishes a frame bottleneck. Original GPU p50 was ${fmt(pacedWater.gpuMs.p50)} ms, already above active CPU. In an ideal overlapping pipeline, shortening CPU work while it remains below GPU service time need not change throughput. Even a 2× water step is only a CPU saving, not evidence of the required 15% full-frame gain. The uncapped CPU/GPU measurements above decide whether that inference holds.`,
  '',
)
if (
  await readFile(join(root, 'clock-diagnostic.json')).then(
    () => true,
    () => false,
  )
)
  report.push(
    '## Clock diagnostic',
    '',
    'Earlier preliminary rounds used native rAF timestamp differences, which hide dispatch jitter. Those raw rounds remain under [preliminary-raf/](preliminary-raf/README.md), with [diagnostic samples](clock-diagnostic.json). Subsequent paced rounds fixed the wall clock but retained display pacing; see [vsync-report.md](vsync-report.md). The current uncapped rounds retain the same wall clock, simulation steps and workloads and additionally remove the presentation cap.',
    '',
  )
report.push(
  '## Interpretation and limits',
  '',
  'The uncapped full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU ranges exclude browser compositor/presentation work; active CPU measures elapsed submission and may include driver waiting. Bottleneck labels describe this workload and environment, not every scene that uses the subsystem.',
  '',
  'Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.',
  '',
  `Full-frame repeatability: **${stable ? 'PASS' : 'FAIL'}**. See [round 1 environment](${rounds[0]}/environment.json) and [round 2 environment](${rounds[1]}/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.`,
  '',
  'See [uncapped study notes](uncapped-notes.md) for validation, visual evidence and measurement limitations; [original notes](study-notes.md) describe the prior paced stage.',
  '',
  'A partial [submission-only diagnostic](submission-diagnostic/README.md) is also preserved: simply removing the cap allowed CPU callbacks to outrun GPU completion and drop timer queries. Those data are excluded; every accepted uncapped run bounds the queue to two and completes all GPU frames and available timer samples.',
  '',
  'A complete [rAF-bounded experiment](raf-bounded-diagnostic/README.md) also remains available: water callback p50 failed repeatability (6.40%) despite stable CPU/GPU medians and mean throughput. The accepted method removes rAF/compositor scheduling from uncapped render steps; that failure is not silently reported as a pass or discarded.',
  '',
)
await writeFile(
  join(root, 'summary.json'),
  JSON.stringify({ mode: 'uncapped', rounds, stable, results }, null, 2) + '\n',
)
await writeFile(join(root, 'README.md'), report.join('\n'))
console.log('Report:', join(root, 'README.md'), 'stability:', stable ? 'PASS' : 'FAIL')
if (!stable) process.exitCode = 1
