import { readFile, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { aggregatePoint, capacityAt } from './bench-capacity-data.mjs'
import { summarize } from './bench-stats.mjs'

export async function visibleWaterStudy(root) {
  root = resolve(root)
  const study = {}
  for (const label of ['before', 'after']) {
    const directory = join(root, label + '-capacity'),
      manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8')),
      axis = manifest.axes['water-visible'],
      points = []
    if (!['both-budgets-crossed', 'numeric-target-gate'].includes(axis.status))
      throw new Error('Incomplete visible-water study: ' + label)
    for (const point of axis.points) {
      const result = await aggregatePoint(directory, point)
      if (!result.stable) throw new Error('Unstable visible-water point')
      const rows = []
      for (const file of point.files) {
        const round = JSON.parse(await readFile(join(directory, file), 'utf8'))
        for (const run of round.runs)
          for (const values of run.samples) {
            const row = Object.fromEntries(round.columns.map((key, i) => [key, values[i]])),
              rest = row.frameCpuMs - row.waterStep - row.waterUpload - row.waterReflection
            if (!Number.isFinite(rest) || rest < -0.02)
              throw new Error('Water CPU sections are missing or overlap')
            rows.push({
              step: row.waterStep / point.load,
              preparation: row.waterUpload / point.load,
              reflection: row.waterReflection / point.load,
              rest: Math.max(0, rest) / point.load,
              activeCpu: row.frameCpuMs / point.load,
            })
          }
      }
      points.push({ ...result, perWater: summarize(rows) })
    }
    study[label] = {
      points,
      status: axis.status,
      numericCandidate: axis.numericCandidate ?? null,
      capacity60: capacityAt(points, 16.7),
      capacity30: capacityAt(points, 33.3),
    }
  }
  for (const point of study.after.points) {
    const before = study.before.points.find(p => p.load === point.load)
    if (before && point.hash !== before.hash)
      throw new Error('Fixed-step state differs after normal optimization at ' + point.load)
  }
  return study
}

export async function writeVisibleWaterReport(root) {
  const study = await visibleWaterStudy(root),
    compact = point => {
      const { environment, diagnostics, ...r } = point
      return {
        ...r,
        configuration: diagnostics[0].configuration,
        diagnostics: diagnostics[0].diagnostics,
      }
    },
    summary = Object.fromEntries(
      Object.entries(study).map(([key, axis]) => [
        key,
        { ...axis, points: axis.points.map(compact) },
      ]),
    ),
    f = n => n.toFixed(3),
    pair = v => `${f(v.p50)} / ${f(v.p95)}`,
    capacity = c => `${c.lowerBound ? '≥' : ''}${c.maximum} (${f(c.frameP95)} ms worst-round p95)`
  let report = `# Visible-water preparation: before and after\n\n[Protocol and validation](README.md). Every point uses the same seed, dt, view and scene, two rounds × five fresh Chromium processes × 600 warm-up/600 measured frames. No vsync, CPU 6, no extensions, ANGLE GL, 1920×1080/DPR 1. CPU/GPU overlap; GPU ranges can include submission gaps. No WASM.\n\n| Version | Largest measured at 60 fps | Largest measured at 30 fps | End condition |\n| --- | ---: | ---: | --- |\n`
  for (const [label, axis] of Object.entries(study))
    report += `| ${label} | ${capacity(axis.capacity60)} | ${capacity(axis.capacity30)} | ${axis.status} |\n`
  report +=
    '\nA ≥ mark is a tested lower bound. Qualification stops further collection for owner review; it is not an observed FPS ceiling. No interpolation between measured loads.\n\n## Full frame and bottleneck\n\nAll times are p50 / p95 ms; the separate worse-round p95 controls capacity.\n\n| Waters | Version | Frame | Worst round p95 ms | Active CPU | GPU range | Bottleneck | Frame-p50 round difference | Raw rounds |\n| ---: | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |\n'
  for (const [label, axis] of Object.entries(study))
    for (const p of axis.points)
      report += `| ${p.load} | ${label} | ${pair(p.stats.frameMs)} | ${f(p.capacityP95)} | ${pair(p.stats.frameCpuMs)} | ${pair(p.stats.gpuMs)} | ${p.bottleneck} | ${(p.repeatability * 100).toFixed(2)}% | ${p.files.map((file, i) => `[${i + 1}](${label}-capacity/${file})`).join(', ')} |\n`
  report +=
    '\n## CPU cost per visible water\n\nNormalize each frame by its water count, then compute percentiles. Remainder is computed per sample from active CPU minus the three disjoint water sections, before taking percentiles. It includes shared scene/render work amortized across waters. Do not add independent medians as if they were a measured CPU percentile. Preparation builds texture arrays/deforms geometry/rebuilds normals and bounds; actual GPU transfer happens during render submission. Reflection includes uniforms, culling, mirror selection and reflection submission.\n\n| Waters | Version | Simulation | Geometry/texture preparation | Mirrors/reflection | Remainder | Active CPU per water |\n| ---: | --- | ---: | ---: | ---: | ---: | ---: |\n'
  for (const [label, axis] of Object.entries(study))
    for (const p of axis.points)
      report += `| ${p.load} | ${label} | ${pair(p.perWater.step)} | ${pair(p.perWater.preparation)} | ${pair(p.perWater.reflection)} | ${pair(p.perWater.rest)} | ${pair(p.perWater.activeCpu)} |\n`
  report +=
    '\n## Frame p50 improvement at matched loads\n\n| Waters | Before ms | After ms | Reduction | State hash |\n| ---: | ---: | ---: | ---: | --- |\n'
  for (const p of study.after.points) {
    const b = study.before.points.find(b => b.load === p.load)
    if (b)
      report += `| ${p.load} | ${f(b.stats.frameMs.p50)} | ${f(p.stats.frameMs.p50)} | ${(100 * (1 - p.stats.frameMs.p50 / b.stats.frameMs.p50)).toFixed(2)}% | ${p.hash} (identical) |\n`
  }
  if (study.after.numericCandidate) {
    const n = study.after.numericCandidate
    report += `\n## Owner review gate\n\nStopped after ${n.load} visible waters: numeric step p50 ${f(n.stepP50)} ms / frame p50 ${f(n.frameP50)} ms = ${(n.frameShare * 100).toFixed(2)}%. Active CPU dominates GPU range in the aggregate and both rounds. This passes the original ≥15% numeric-CPU qualification rule after optimized JS. No WASM prototype, additional optimization or higher-load search was started beyond this gate. Qualification is not adoption: 2× isolated, ≥15% frame gain without p95 regression, parity and fallback remain unproven for any alternative.\n`
  }
  await writeFile(join(root, 'summary.json'), JSON.stringify(summary, null, 2) + '\n')
  await writeFile(join(root, 'results.md'), report)
  return study
}
if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const root =
    process.argv.find(a => a.startsWith('--root='))?.slice(7) ??
    'docs/captures/benchmarks-2026-10-16/visible-water'
  await writeVisibleWaterReport(root)
  console.log('Wrote visible-water results and summary')
}
