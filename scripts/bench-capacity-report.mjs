// Derived tables only; all timing values come from the retained raw samples.
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
export async function writeCapacityReport(root, summary) {
  root = resolve(root)
  const f = n => n.toFixed(3)
  const max = c =>
    `${c.lowerBound ? '≥' : ''}${c.maximum}${c.nextFail ? ` (next tested failure: ${c.nextFail})` : ''}`
  let report = `# Optimized JavaScript capacity — measured results\n\nSee the [protocol](README.md), [raw manifest](manifest.json) and [machine/environment JSON beside every raw run](manifest.json).\n\nEvery fresh point: two rounds × five executions × 600 warm-up/600 measured frames; seed 4242, dt 1/60 s, uncapped Chromium, 1920×1080 DPR 1, ANGLE GL, active renderer main thread on P-core CPU 6, fresh process/profile, no extensions. Historical reuse is limited to exactly matched Phase 2 water points. Percentiles are nearest-rank over 6,000 measured frames. Capacity compares the worse of two round p95 values with 16.7/33.3 ms. CPU and GPU overlap and are not summed; a 20% separation describes dominance. GPU water ranges can contain CPU submission gaps.\n\nThe largest measured passing load is a measured bound, not an interpolated exact maximum. A ≥ symbol means the tested range ended without crossing that budget. Every accepted frame-p50 repeatability gate is ≤5%; final fixed-step hashes agree across ten executions per point.\n\n| Axis | Largest measured at 60 fps | Largest measured at 30 fps | End condition |\n| --- | ---: | ---: | --- |\n`
  for (const a of Object.values(summary.axes))
    report += `| ${a.label} | ${max(a.capacity60)} | ${max(a.capacity30)} | ${a.status} |\n`
  report +=
    '\n## All measured points\n\nCPU and GPU are elapsed ranges in milliseconds; they include the renderer/driver work captured by their respective instruments. The frame includes dispatch and GPU queue pacing, with no vsync. “Worst p95” controls the capacity result; pooled p95 is retained alongside it.\n'
  for (const a of Object.values(summary.axes)) {
    report += `\n### ${a.label}\n\n| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |\n| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |\n`
    for (const p of a.points) {
      report += `| ${p.load}${p.capped ? ' (resource capped)' : ''} | ${f(p.stats.frameMs.p50)} / ${f(p.stats.frameMs.p95)} | ${f(p.capacityP95)} | ${f(p.stats.frameCpuMs.p50)} / ${f(p.stats.frameCpuMs.p95)} | ${f(p.stats.gpuMs.p50)} / ${f(p.stats.gpuMs.p95)} | ${p.bottleneck} | ${(100 * p.repeatability).toFixed(2)}% | ${p.files.map((file, i) => `[${i + 1}](${file})`).join(', ')} |\n`
    }
    report += '\n'
    if (a.points[0]?.id.startsWith('skinning')) {
      report += '| Creatures | Skinned letters | Creatures in frustum |\n| ---: | ---: | ---: |\n'
      for (const p of a.points)
        report += `| ${p.load} | ${p.skinnedPoints} | ${p.diagnostics.visibleCreatures} |\n`
    }
    if (a.points[0]?.id.startsWith('particles')) {
      report +=
        '| Groups | Effects | Emitters | Live letters at end | Timed draw-point range |\n| ---: | ---: | ---: | ---: | ---: |\n'
      for (const p of a.points)
        report += `| ${p.load} | ${p.effectStats.effects} | ${p.effectStats.emitters} | ${p.effectStats.letters} | ${p.pointCountRange.join('–')} |\n`
    }
    if (a.points[0]?.axis.startsWith('water-')) {
      report +=
        '| Load | Mesh / solver width | Visible waters | Reflection levels | Draw calls p50 |\n| ---: | ---: | ---: | ---: | ---: |\n'
      for (const p of a.points)
        report += `| ${p.load} | ${p.configuration.waterResolution} / ${p.diagnostics.simulationResolutions?.[0] ?? Math.min(129, p.configuration.waterResolution)} | ${p.diagnostics.visibleWaters ?? p.configuration.expectedVisible} | ${p.diagnostics.reflectionLevels?.length ?? 'not recorded (historical)'} | ${p.stats.drawCalls.p50} |\n`
    }
    if (a.resourceLimit) {
      const r = a.resourceLimit
      report += `\n**Resource stop:** load ${r.load} was not allocated. Projected renderer peak ${(r.projectedPeakBytes / 1024 ** 3).toFixed(3)} GiB, available ${(r.availableBytes / 1024 ** 3).toFixed(3)} GiB, reserve ${(r.reserveBytes / 1024 ** 3).toFixed(0)} GiB. This is an operational memory bound, not an observed frame-time ceiling.\n`
    }
    report += '\n'
    if (a.points[0]?.configuration)
      report += `Configuration is recorded per point in [summary.json](summary.json). Sources: ${[...new Set(a.points.flatMap(p => p.sources))].map(s => '`' + s.slice(0, 7) + '`').join(', ')}.\n`
  }
  report += `\n## Workload boundaries\n\n- Creature counts use one fixed seven-bone, 144-source-vertex model and alphabet/density; the ground patch stays 34 m wide; every creature remains visible, with a fitted orthographic camera at larger loads. This does not maintain constant projected creature size or predict arbitrary imported models.\n- Loaded-water tests keep one 28 m water visible and place others 64 m apart. Pause affects engine integration, preparation and actor contacts, while global shader clocks and explicit rain/disturb calls continue. The static ground patch stays 1,024 m wide; extra hidden waters can lie beyond it and keep their own local beds. This axis measures water scheduling/resources, not large-map terrain complexity. The initial cap of 512 was amended before further measurement: growth must fit a linear projection of the previous maximum renderer VmHWM while leaving 4 GiB of available RAM for the system/other processes. A resource stop is a measured lower bound, not an FPS ceiling.\n- Visible-water tests fit the view to non-overlapping 28 m waters. Simulation can produce different reflection levels and separate mirror passes; actual levels/draw calls are in raw metadata. Pausing cannot skip these waters.\n- Each effect group has three effects: campfire, looping fire explosion and ice. Groups repeat the same eight positions, increasing overdraw. Keep the default 6,000 live-letter and 8,000 draw-buffer budgets; a saturated buffer is a resource bound.\n- Grid widths 65/129/257/513 are mesh/mask widths. The engine already caps the physics width at 129: solver widths are 65/129/129/129. Costs above 129 are not a 257/513 physics solver measurement.\n- Lines connect measured loads without a monotonic fit or capacity interpolation. Full-frame queue/dispatch overhead can make smaller-load intervals non-monotonic. These axes are separate workloads, not additive promises for one combined scene. Values are specific to this i5-12450H / Chromium headless / ANGLE GL machine, not desktop Tauri, WebKitGTK, mobile or another GPU.\n`
  await writeFile(join(root, 'capacity/results.md'), report)
  console.log('Wrote capacity/results.md')
}
if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const root = resolve(
    process.argv.find(a => a.startsWith('--root='))?.slice(7) ??
      'docs/captures/benchmarks-2026-10-15',
  )
  const summary = JSON.parse(await readFile(join(root, 'capacity/summary.json'), 'utf8'))
  await writeCapacityReport(root, summary)
}
