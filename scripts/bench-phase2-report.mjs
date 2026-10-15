import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { summarize, relativeDifference, classifyBottleneck } from './bench-stats.mjs'

const directory = resolve(process.argv[2] ?? 'docs/captures/benchmarks-2026-10-15/phase-2')
const load = async path => JSON.parse(await readFile(join(directory, path), 'utf8'))
const fmt = n => (Number.isFinite(n) ? n.toFixed(3) : 'unavailable')
const pair = stat => `${fmt(stat.p50)} / ${fmt(stat.p95)}`
const pct = n => `${(n * 100).toFixed(2)}%`
async function collect(prefix, scene) {
  const rounds = await Promise.all([1, 2].map(n => load(`${prefix}-round-${n}/${scene}.json`)))
  const environments = await Promise.all(
    [1, 2].map(n => load(`${prefix}-round-${n}/environment.json`)),
  )
  for (const env of environments) {
    if (
      env.trackedChanges ||
      env.framePacing !== 'uncapped' ||
      env.scheduler !== 'task-with-gpu-backpressure' ||
      ![
        '--disable-gpu-vsync',
        '--disable-frame-rate-limit',
        '--use-angle=gl',
        '--headless=new',
      ].every(flag => env.flags.includes(flag))
    )
      throw new Error('Invalid environment: ' + prefix)
    if (
      prefix.startsWith('water-scale-') &&
      (!env.extensionsDisabled ||
        env.rendererCpu !== 6 ||
        !env.browserIsolation?.startsWith('fresh Chromium process') ||
        !['--disable-extensions', '--disable-component-extensions-with-background-pages'].every(
          flag => env.flags.includes(flag),
        ))
    )
      throw new Error('Invalid controlled water environment')
  }
  const rows = []
  for (const round of rounds) {
    if (round.runs.length !== 5) throw new Error('Expected five fresh runs: ' + scene)
    for (const run of round.runs) {
      const m = run.metadata
      if (
        m.frames !== 600 ||
        m.warmup !== 600 ||
        m.configuration.dt !== 1 / 60 ||
        m.configuration.seed !== 4242 ||
        m.configuration.carpetSeed !== 48017 ||
        m.viewport.width !== 1920 ||
        m.viewport.height !== 1080 ||
        m.viewport.dpr !== 1 ||
        m.visibilityChanges ||
        run.samples.length !== 600 ||
        m.gpuQueue.limit !== 2 ||
        m.gpuQueue.scheduler !== 'task' ||
        m.gpuQueue.completedFrames !== 1200 ||
        m.gpuQueue.peak > 2 ||
        m.gpu.dropped ||
        m.gpu.disjointEvents
      )
        throw new Error('Invalid run: ' + scene)
      if (prefix.startsWith('water-scale-')) {
        const count = Number(prefix.split('-').at(-1))
        if (
          m.configuration.waterCount !== count ||
          m.configuration.waterResolution !== 129 ||
          m.configuration.waterWidth !== 28 ||
          m.configuration.mapWidth !== 1024 ||
          m.configuration.spacing !== 64 ||
          m.configuration.expectedVisible !== 1 ||
          m.configuration.externalImpulses !== false ||
          m.configuration.waterPolicy !== (scene.endsWith('-pause') ? 'pause' : 'off')
        )
          throw new Error('Invalid water fixture')
        if (!Array.isArray(run.before.extensionTargets) || run.before.extensionTargets.length)
          throw new Error('Extension targets were not excluded')
        const pins = run.before.rendererAffinity
        if (
          pins?.length !== 1 ||
          pins[0].mainThreadCpu !== 6 ||
          pins[0].allowed !== '6' ||
          pins[0].probeMs !== 150 ||
          !pins[0].scope.includes('spares excluded')
        )
          throw new Error('Invalid active-renderer control')
      }
      for (const values of run.samples) {
        const row = Object.fromEntries(round.columns.map((key, i) => [key, values[i]]))
        if (
          !Number.isFinite(row.frameMs) ||
          !Number.isFinite(row.frameCpuMs) ||
          row.frameMs <= 0 ||
          row.rafIntervalMs !== null ||
          !Number.isFinite(row.gpuMs) ||
          !Number.isFinite(row.completedFrameMs) ||
          row.frameMs < row.frameCpuMs
        )
          throw new Error('Invalid clocks/timer: ' + scene)
        if (prefix.startsWith('water-scale-') && row.drawCalls !== 5)
          throw new Error('Water draw count changed')
        rows.push(row)
      }
    }
  }
  const stats = summarize(rows)
  const repeatability = relativeDifference(
    rounds[0].summary.frameMs.p50,
    rounds[1].summary.frameMs.p50,
  )
  const subsystemRepeatability = Object.fromEntries(
    Object.keys(stats).map(key => [
      key,
      relativeDifference(rounds[0].summary[key].p50, rounds[1].summary[key].p50),
    ]),
  )
  const roundBottlenecks = rounds.map(r =>
    classifyBottleneck(r.summary.frameCpuMs.p50, r.summary.gpuMs.p50),
  )
  const hashes = [...new Set(rounds.flatMap(r => r.runs.map(run => run.metadata.fingerprint.hash)))]
  if (hashes.length !== 1) throw new Error('Fixed-step state changed between runs: ' + scene)
  const visibleHashes = [
    ...new Set(
      rounds
        .flatMap(r => r.runs.map(run => run.metadata.fingerprint.visibleWaterHash))
        .filter(Boolean),
    ),
  ]
  return {
    scene,
    prefix,
    source: environments.map(e => e.sourceCommit),
    environment: environments[0],
    stats,
    repeatability,
    subsystemRepeatability,
    roundBottlenecks,
    stable: repeatability <= 0.05,
    hashes,
    visibleHashes,
    roundP50: rounds.map(r => r.summary.frameMs.p50),
    bottleneck: classifyBottleneck(stats.frameCpuMs.p50, stats.gpuMs.p50),
    waterCalls: rounds.map(r => r.runs.map(run => run.metadata.diagnostics.waterCalls)),
    measuredFrames: rows.length,
  }
}
const original = await collect('before-skinning', 'skinning'),
  optimized = await collect('after-skinning', 'skinning')
if (original.hashes[0] !== optimized.hashes[0]) throw new Error('Skinned positions changed')
const water = []
for (const count of [1, 2, 4, 8])
  for (const policy of ['off', 'pause']) {
    const result = await collect(`water-scale-${count}`, `water-scale-${count}-${policy}`)
    if (!result.environment.browserIsolation?.startsWith('fresh Chromium process'))
      throw new Error('Water requires fresh process isolation')
    if (
      !result.environment.extensionsDisabled ||
      !['--disable-extensions', '--disable-component-extensions-with-background-pages'].every(
        flag => result.environment.flags.includes(flag),
      )
    )
      throw new Error('Water qualification requires extensions disabled')
    if (result.environment.rendererCpu !== 6)
      throw new Error('Water qualification requires the explicit P-core control')
    if (result.visibleHashes.length !== 1) throw new Error('Visible water hash missing/unstable')
    for (const calls of result.waterCalls.flat())
      if (
        calls.length !== count ||
        calls.some((n, i) => n !== (i === 0 || policy === 'off' ? 1201 : 0))
      )
        throw new Error('Unexpected updateDynamics calls')
    water.push({ ...result, count, policy })
  }
if (new Set(water.flatMap(w => w.source)).size !== 1)
  throw new Error('Water source changed between cases')
if (new Set(water.flatMap(w => w.visibleHashes)).size !== 1)
  throw new Error('Visible water differs between variants/modes')
const all = [original, optimized, ...water],
  stable = all.every(r => r.stable)
const skinGain = 1 - optimized.stats.frameMs.p50 / original.stats.frameMs.p50
const skinSpeedup = original.stats.skinning.p50 / optimized.stats.skinning.p50
const serializable = r => {
  const { environment, ...rest } = r
  return rest
}
const summary = {
  status: 'Proposed; Phase 2 JS only; stopped before alternatives',
  protocol: {
    dt: 1 / 60,
    seed: 4242,
    width: 1920,
    height: 1080,
    dpr: 1,
    runs: 5,
    rounds: 2,
    warmup: 600,
    frames: 600,
    gpuQueue: 2,
    scheduler: 'MessageChannel task; asynchronous fences',
    vsync: false,
  },
  hardware: water[0].environment,
  skinning: {
    before: serializable(original),
    after: serializable(optimized),
    speedup: skinSpeedup,
    frameGain: skinGain,
  },
  water: water.map(serializable),
  repeatabilityPass: stable,
  visibleWaterHash: water[0].visibleHashes[0],
}
await writeFile(join(directory, 'summary.json'), JSON.stringify(summary, null, 2) + '\n')
const skinTable = [
  ['Original JS', original],
  ['Optimized JS (new baseline)', optimized],
]
  .map(
    ([name, r]) =>
      `| ${name} | ${pair(r.stats.skinning)} | ${pair(r.stats.frameCpuMs)} | ${pair(r.stats.gpuMs)} | ${pair(r.stats.frameMs)} | ${r.bottleneck} | ${pct(r.stats.skinning.p50 / r.stats.frameMs.p50)} | ${pct(r.repeatability)} |`,
  )
  .join('\n')
const waterTable = water
  .map(
    r =>
      `| ${r.count} | ${r.policy} | ${pair(r.stats.waterStep)} | ${pair(r.stats.waterUpload)} | ${pair(r.stats.frameCpuMs)} | ${pair(r.stats.gpuMs)} | ${pair(r.stats.frameMs)} | ${r.bottleneck} | ${pct(r.repeatability)} |`,
  )
  .join('\n')
const effects = [1, 2, 4, 8]
  .map(count => {
    const off = water.find(w => w.count === count && w.policy === 'off'),
      on = water.find(w => w.count === count && w.policy === 'pause')
    const describe = r => {
      if (r.bottleneck !== 'CPU' || r.stats.waterStep.p50 / r.stats.frameMs.p50 < 0.15)
        return 'Does not qualify'
      return r.roundBottlenecks.every(b => b === 'CPU')
        ? 'Meets raw CPU/share gate'
        : 'Aggregate gate; mixed round evidence'
    }
    return `| ${count} | ${pct(1 - on.stats.frameMs.p50 / off.stats.frameMs.p50)} | ${pct(off.stats.waterStep.p50 / off.stats.frameMs.p50)} → ${pct(on.stats.waterStep.p50 / on.stats.frameMs.p50)} | ${describe(off)} → ${describe(on)} |`
  })
  .join('\n')
const eightOff = water.find(w => w.count === 8 && w.policy === 'off'),
  eightOn = water.find(w => w.count === 8 && w.policy === 'pause')
const oneOff = water.find(w => w.count === 1 && w.policy === 'off')
const remainingCandidates = water.filter(
  r =>
    r.policy === 'pause' &&
    r.bottleneck === 'CPU' &&
    r.stats.waterStep.p50 / r.stats.frameMs.p50 >= 0.15,
)
const remainingNote = remainingCandidates.length
  ? remainingCandidates
      .map(
        r =>
          `${r.count} paused waters retain the aggregate gate: ${pct(r.stats.waterStep.p50 / r.stats.frameMs.p50)} step/frame, ${pct(r.stats.frameCpuMs.p50 / r.stats.gpuMs.p50 - 1)} CPU/GPU separation, round labels ${r.roundBottlenecks.join('/')}.`,
      )
      .join(' ')
  : 'No paused-water case retains the aggregate CPU/share gate.'
const text = `# Simulation performance study — Phase 2

Status: completed JS skinning and optional water scheduling; ADR 0004 stays **Proposed**. No GPU
skinning, WASM or toolchain installation. Water scheduling remains **disabled by default**.

## Protocol and scope

Same accepted uncapped Phase 1 protocol: Chromium headless, ANGLE GL, --disable-gpu-vsync and
--disable-frame-rate-limit; seeded scenes (4242, carpet 48017), fixed dt 1/60 s, 1920×1080, DPR 1.
Each case has two rounds of five fresh page loads, each 600 warm-up + 600 measured frames. No
IndexedDB read/write. MessageChannel steps bound GPU work to two asynchronous fences, retaining
overlap; every GPU frame/timer completes. No gl.finish or synchronous GPU wait. Frame time is
actual step interval, with observed completion interval, queue latency, scheduler cost and GPU
ranges retained in raw JSON. Percentiles use nearest rank over 6,000 measured frames per case.
Subsystem medians need not sum to frame median. CPU/GPU overlap and must not be added.

Hardware applicability: **i5-12450H**, Mesa Intel ADL GT2, Chromium **headless**, **ANGLE GL**.
These results describe this hardware/browser/workload profile. CPU elapsed submission may include
driver waiting; GPU range excludes compositor work. At least 20% CPU/GPU separation describes
dominance; otherwise the label is mixed. This descriptive band is unchanged from Phase 1.

Original skinning source ${original.source[0].slice(0, 7)} (unchanged kernel from 34c7ca9);
optimized source ${optimized.source[0].slice(0, 7)}. Both water modes use the same clean source
${water[0].source[0].slice(0, 7)}; the off mode preserves the original algorithm and arrays/images.
Environment files record exact commit, flags, CPU/GPU/OS/Chromium, power settings and per-run
frequency snapshots. No machine power settings changed. The owner confirmed the machine was idle, with no heavy
video/game/GPU work; normal background desktop activity is not independently eliminated.

The skinning before/after pair retains OS-default CPU affinity and original per-round browser reuse and passes the 5% gate. The initial
water rounds failed two frame gates (6.16% and 5.79%) and remain in
[unpinned-diagnostic/](unpinned-diagnostic/README.md). The final water rounds additionally use
--renderer-cpu=6: verified main-thread affinity for the active benchmark page on a P core. A 150 ms CPU probe
before warm-up identifies the executing renderer; spares are excluded and other existing
thread masks are verified unchanged. The probe advances no simulation state. A stopped
[spare-affinity attempt](spare-affinity-diagnostic/README.md) is also preserved and excluded.
Browser/GPU processes retain their masks. No machine power setting changes. This controls observed P/E migration; do not
compare different scenes as identical hardware scheduling workloads. Diagnostic CPU-step p50
0.750 ms on CPU 6 versus the unpinned per-run 0.740–1.490 ms range supports residency as a noise
contributor. It does not prove an exclusive cause; GPU tails/scheduling can also matter. Every
water off/on pair uses the same fixed control and a new Chromium process/profile per execution
(--fresh-browser), eliminating cross-variant process reuse. A controlled 1→2→1-water sequence
at CPU 6 moved one-water step p50 from 0.755 to 1.230 ms, then a new process returned 0.780 ms.
This observes process/history sensitivity, not an isolated proof of its internal cause;
JIT/GC, thermal and driver effects are not individually separated. [Diagnostic](order-diagnostic.json).
The fresh-process full matrix still failed five light-case frame gates; all 48,000 samples
remain in [extension-background-diagnostic/](extension-background-diagnostic/README.md).
The owned fresh browser was loading system extension service workers/background pages.
--no-extensions now disables them and asserts no extension targets before/after each measured
execution. A smoke confirms target absence, not that this was the exclusive noise cause.
Final water measurements block by map size: each off/pause pair has two five-run rounds,
with reversed policy order in round 2. This avoids coupling both rounds to different histories
of eight mixed workloads. All four pairs were remeasured under these controls; no old/new
runs are spliced. Counts, warm-up, dt, seed, queue, percentiles and <=5% gate stay unchanged.
[Isolation smoke](extension-background-diagnostic/extension-disabled-smoke.json),
[profiling/state/image verification](extension-free-verification/verification/parity.json).
[Partial host trace](host-samples.jsonl).

## A — Skinning

### Profile before changing the kernel

16 creatures contain **18,179 letters**, 1,091–1,177 per creature, seven bones each. Their 2,304
source vertices include **2,302 distinct sampled corners**. The old loop calls getVertexPosition
**54,537 times per frame** (three times per letter), repeating matrix products per skin weight.
The 100 µs CPU/32 KiB allocation diagnostic sampled 1,200 steps of clean source 34c7ca9. CPU
sampling self times: applyBoneTransform 9,287.394 ms (40.10% of 23,160.760 ms), matrix products
2,907.756 ms (12.55%), Vector3's generator 2,227.455 ms (9.62%), GC 1,070.825 ms (4.62%), versus
setXYZ 69.279 ms (0.30%). Three 0.186.1 spreads Vector3 into Vector4 in applyBoneTransform;
allocation samples identify the generator/spread churn. These diagnostic times are perturbed and
**are not benchmark percentiles**.

The fixture has two nonzero bone weights per vertex, so bone products fall from 109,074 to 112 per
frame. The new JS skins each distinct source vertex once, computes bone matrices once per frame, caches
double intermediates, then writes interpolated positions/face normals directly into existing
float32 attributes. The steady standard kernel allocates nothing and uses no generic per-vertex
methods. Nonstandard/interleaved/normalized attributes and custom mesh methods retain cached Three
calls for compatibility. Post-change sampling no longer reports allocation samples in the standard
kernel; initialization happens before sampling. See [before profile](profile/before.json), [after
profile](profile/after.json), losslessly gzipped CPU/heap profiles beside them, and
scripts/profile-skinning.mjs.

All times below are **p50 / p95 ms**.

| Implementation | Skinning | Active CPU | GPU range | Full frame | Bottleneck | Skinning/frame | Frame round difference |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: |
${skinTable}

Isolated JS gain: **${skinSpeedup.toFixed(2)}×**; full-frame p50 improvement **${pct(skinGain)}**,
with improved p95. Geometry/draw counts and final positions remain unchanged. GPU timing also
changes under the new submission cadence/shared hardware; do not attribute the frame gain by
adding independent CPU/GPU percentile savings. Skinning is now
${pct(optimized.stats.skinning.p50 / optimized.stats.frameMs.p50)} of a
${optimized.bottleneck}-dominant frame. **It no longer passes the 15% CPU-bottleneck gate; stop
this front and use optimized JS as baseline.** This is a JS optimization result, not adoption
evidence for a WASM/GPU implementation.

Parity against preserved original core: every letter position and normal after 1, 60, 240 and
1,200 steps has **max absolute difference 0** (limit 1e-5); each PNG has RMSE 0. Seven unit tests
cover 600 poses, morph targets, live geometry/weight edits, normalized/interleaved attributes,
detached binds, custom methods and degenerate triangles. Six existing areas and the GLTF creature
demo have exact controlled-clock image parity. GLTF waits for asynchronous model initialization
before animation; an unsynchronized diagnostic is retained and excluded. See [array/image
results](parity/skinning.json), [area results](area-parity/results.json),
[GLTF](area-parity/gltf.json) and [cdpshot page capture](cdpshot-skinning.png).

## B — Water at map scale

URL: /?bench=water-scale&waters=1|2|4|8&water-policy=off|pause&queue=2. Every water is 28 m wide
with a 129×129 grid; centres are 64 m apart on a 1,024 m floor. One water stays visible and
0/1/3/7 are offscreen. The seeded sloping bed initializes flow; no external rain/actor
disturbances run outside render. The fixture differs from Phase 1's rain scene and must not be
compared as the same workload. Each pair changes only the runtime scheduling option.

All values are **p50 / p95 ms**; prep includes texture-array construction, geometry deformation,
normals and bounds. It is not pure GPU upload time. Actual GPU transfers/submission belong to
render and GPU ranges. Three already avoids drawing fully culled meshes; the waste measured here
is CPU integration/preparation for every loaded water.

| Loaded waters | Policy | CPU step | CPU preparation | Active CPU | GPU range | Full frame | Bottleneck | Frame round difference |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
${waterTable}

| Loaded waters | Frame p50 improvement | Step/frame off → pause | Bottleneck-aware step decision |
| ---: | ---: | ---: | --- |
${effects}

${remainingNote}
Cases close to the 15% share or descriptive 20% CPU/GPU boundary require further
evidence; qualification does not select WASM. Mixed paused cases do not qualify
merely because their step share is above 15%.

Without the option, every loaded water receives 1,200 positive-dt updates plus the initial dt=0
invocation. Creation still initializes every water; these are per-frame counts. With pause, only the visible water receives them; hidden waters receive **zero**
updates. All ten runs of every variant confirm those counts. At eight waters, CPU step+preparation
p50 is ${fmt(eightOff.stats.waterStep.p50 + eightOff.stats.waterUpload.p50)} ms off versus
${fmt(eightOn.stats.waterStep.p50 + eightOn.stats.waterUpload.p50)} ms pause (sum of section
medians, not a full-frame percentile). Relative to one water, seven offscreen waters add
${fmt(eightOff.stats.frameCpuMs.p50 - oneOff.stats.frameCpuMs.p50)} ms of active CPU p50; the effect
is map-size dependent. The first scaling correction is **algorithmic scheduling**, not WASM. A raw
qualification in the all-updating large map does not justify porting avoidable work. One-water
differences and near-quantum sections should be interpreted with their run distributions, not as
universal gains.

The GPU query begins at the first visible reflection before the loop finishes updating subsequent
waters. Its elapsed range can include GPU idle/submission gaps while CPU simulation continues.
The five draw calls remain unchanged in all variants; GPU-range growth under heavier CPU load
is not evidence of extra water draw work. Together with shared CPU/iGPU power and submission
cadence, this limits comparisons of GPU ranges as active-device cost. The large all-updating
maps remain CPU-dominant; mixed results do not qualify a CPU kernel merely by CPU percentage.

Passing the numeric CPU/share gate in a remaining case only identifies a potential target.
It is not adoption: an alternative still needs a measured 2× isolated gain against optimized JS,
15% full-frame p50 gain, no p95 regression, parity and the JS fallback. Cases near 15% or the
CPU/GPU dominance boundary need their per-run/round distributions, not rounded percentages.
A passing aggregate with different per-round bottleneck labels is marked mixed evidence;
the CPU bottleneck is not robustly established by that aggregate alone.
If pausing is unacceptable for deterministic v0.2, the large-map off-mode cost remains relevant;
the optional speedup does not authorize a different default.

### Optional policy and determinism

Runtime API: createAsciiEngine(canvas, { offscreenWater: { mode: 'pause', margin: 4 } }). Default:
omit the option and update every loaded water. The entire transformed bounding sphere must miss
the frustum plus four world metres to skip engine-driven integration, CPU preparation/dirtying and
actor contacts. Conservative bounds can keep some truly hidden waters active. When the camera
returns, integrate **only the current dt**, with no catch-up. Depth/flow/foam can therefore differ
from uninterrupted simulation. Shader/ring clocks continue globally, so wind phase can jump;
explicit rain/disturb/refresh calls remain effective while hidden. This camera-dependent behavior
changes determinism and **is not enabled in editor/player defaults or stored in SceneDoc**.
Default enablement remains the owner's decision.

Visible water has exact array/image parity against original JS after 1,200 steps in all four
variants: positions, normals, depth, both flows and foam have max difference 0; image RMSE 0. All
80 measured water loads share visible-state hash **${water[0].visibleHashes[0]}**, including the
geometry, normals, physics and prepared texture array. Full-map hashes intentionally differ
between off/pause for multiple waters but repeat exactly for the same camera/policy. A 120-step
pause leaves offscreen arrays unchanged; return matches one fresh step over 166,410 values (max
difference 0), and explicit disturbance still changes flow. See [water parity](parity/water.json),
[pause/return](parity/water-resume.json), [Orca page result](parity/orca-water-pause.json).

## Repeatability, evidence and stopping point

Frame p50 repeatability gate (≤5% between the two rounds): **${stable ? 'PASS' : 'FAIL'}** for ${all.filter(r => r.stable).length}/${all.length} cases. Each case has
6,000 measured frames; the accepted phase data total 60,000 measured plus 60,000 warm-up frames, excluding retained
failed/unpinned and stopped-control diagnostics. Summary JSON retains per-subsystem round differences and per-round bottleneck labels. Raw per-run
samples include all subsystems, draw calls, CPU/GPU timing, completion interval, scheduler
overhead, final state and environment.

[Original skinning round 1](before-skinning-round-1/skinning.json), [round
2](before-skinning-round-2/skinning.json); [optimized round
1](after-skinning-round-1/skinning.json), [round 2](after-skinning-round-2/skinning.json); water environments for [one water](water-scale-1-round-1/environment.json),
[two](water-scale-2-round-1/environment.json), [four](water-scale-4-round-1/environment.json),
[eight](water-scale-8-round-1/environment.json), and corresponding round-2 directories.
Each directory holds its pair of raw variant JSON files. [Machine-readable summary](summary.json). Regenerate tables with node
scripts/bench-phase2-report.mjs.

Validation: [pnpm check](validation/check.log) passes (177 tests);
[pnpm compare](validation/compare.log), run after the final core changes in 0a4e072, retains
the same four historical failing areas, with no baseline updates or new failures.
The core tree is unchanged since that comparison. [Validation summary](validation/results.json).
Six controlled equal-clock area comparisons and
the GLTF comparison have RMSE 0. cdpshot/CDP captures are page-only, inspected and contain no
desktop content. Orca commands always use explicit page 157d306a-3e02-4891-9f04-6f30b39841c8 in a
separate profile; skinning and water runs/all fences complete, with expected skip counts.
The [final 120-step run](parity/orca-final-run.json) updates only the visible water with zero
IndexedDB calls. Earlier screenshot commands time out even during active rendering. The
[final JPEG attempt](parity/orca-final-screenshot-error.json) reports browser_tab_not_found,
although [evaluation on the same page immediately afterward](parity/orca-final-after-capture.json)
succeeds. The Orca capture remains unverified, without substituting a desktop screenshot.
The owner's editor draft and consolidation
plan remain untouched.

ADR 0004 stays Proposed. These numbers apply to this i5-12450H/headless/ANGLE GL profile; CPU
savings in GPU-limited scenes are not proof of frame gain. No Phase 3, GPU skinning, WASM,
toolchain, default enablement or push.
`
await writeFile(join(directory, 'README.md'), text)
console.log(
  stable ? 'PASS Phase 2 protocol/parity/repeatability' : 'FAIL repeatability',
  all.map(r => [r.scene, r.prefix, pct(r.repeatability)]),
)
if (!stable) process.exitCode = 1
