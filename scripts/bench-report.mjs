import { readFile, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { relativeDifference, summarize } from './bench-stats.mjs'

const root = resolve(
  process.argv[2] ?? `docs/captures/benchmarks-${new Date().toISOString().slice(0, 10)}`,
)
const rounds = process.argv.slice(3).length ? process.argv.slice(3) : ['round-1', 'round-2']
if (rounds.length !== 2) throw new Error('Supply exactly two round directories')
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
const numeric = new Set(['waterStep', 'skinning'])
const fmt = value => (value === null ? 'unavailable' : value.toFixed(3))
const report = [
  '# Simulation performance study — Phase 1',
  '',
  'Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.',
  '',
  '1920×1080 CSS pixels, DPR 1, dt 1/60 s, fixed camera and seeded scene. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. Raw files record the actual counts. Frame time is the performance.now() interval between actual callbacks, including pacing and dispatch jitter. Native rAF cadence, CPU work and asynchronous GPU elapsed ranges are recorded separately. Neither CPU submission nor GPU elapsed time alone is the full frame.',
  '',
  'Percentiles use nearest rank over equally sized runs. Share = subsystem p50 CPU / full-frame p50. The 15% gate also requires transferable numeric CPU work. Water upload combines array preparation with Three.js geometry updates; its total alone cannot establish a portable numeric kernel. Effects use JS objects; carpet/body uniforms and remaining submission fail the numeric-array condition. Skinned vertex math can qualify, with GPU skinning the preferred comparison.',
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
    delta = relativeDifference(a.frameMs.p50, b.frameMs.p50)
  if (delta > 0.05) stable = false
  report.push(
    `## ${scene}`,
    '',
    `Frame p50/p95/p99: **${fmt(stats.frameMs.p50)} / ${fmt(stats.frameMs.p95)} / ${fmt(stats.frameMs.p99)} ms**. Active CPU p50/p95: ${fmt(stats.frameCpuMs.p50)} / ${fmt(stats.frameCpuMs.p95)} ms. GPU range p50/p95: ${fmt(stats.gpuMs.p50)} / ${fmt(stats.gpuMs.p95)} ms. Draw calls p50/p95: ${fmt(stats.drawCalls.p50)} / ${fmt(stats.drawCalls.p95)}.`,
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
    const qualifies = share >= 0.15 && numeric.has(key)
    const qualification = qualifies
      ? key === 'skinning'
        ? 'Qualifies; compare GPU skinning'
        : 'Qualifies for later JS baseline'
      : share < 0.15
        ? 'Below 15%'
        : key === 'waterUpload'
          ? 'Mixed geometry/upload; kernel not established'
          : 'Not numeric-array work'
    report.push(
      `| ${labels[key]} | ${fmt(stats[key].p50)} | ${fmt(stats[key].p95)} | ${(share * 100).toFixed(2)}% | ${((stats[key].p50 / stats.frameCpuMs.p50) * 100).toFixed(2)}% | ${(variation * 100).toFixed(2)}% | ${qualification} |`,
    )
    targets.push({
      subsystem: key,
      ...stats[key],
      share,
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
  results.push({ scene, summary: stats, frameP50Difference: delta, targets })
}
if (
  await readFile(join(root, 'clock-diagnostic.json')).then(
    () => true,
    () => false,
  )
)
  report.push(
    '## Clock diagnostic',
    '',
    'Preliminary rounds used native rAF timestamp differences. An independent clock diagnostic showed these scheduled timestamps hide dispatch jitter at p95. Those raw rounds and their original report are retained under [preliminary-raf/](preliminary-raf/README.md), with the [diagnostic samples](clock-diagnostic.json). The final rounds use actual callback wall intervals and also retain native rAF cadence. Thresholds and simulation steps were unchanged.',
    '',
  )
report.push(
  '## Interpretation and limits',
  '',
  'The full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU and CPU ranges overlap and must not be added.',
  '',
  'Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.',
  '',
  `Full-frame repeatability: **${stable ? 'PASS' : 'FAIL'}**. See [round 1 environment](${rounds[0]}/environment.json) and [round 2 environment](${rounds[1]}/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.`,
  '',
)
await writeFile(
  join(root, 'summary.json'),
  JSON.stringify({ rounds, stable, results }, null, 2) + '\n',
)
await writeFile(join(root, 'README.md'), report.join('\n'))
console.log('Report:', join(root, 'README.md'), 'stability:', stable ? 'PASS' : 'FAIL')
if (!stable) process.exitCode = 1
