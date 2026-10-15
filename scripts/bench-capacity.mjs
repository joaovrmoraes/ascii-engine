import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve, relative, dirname } from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { aggregatePoint, capacityAt } from './bench-capacity-data.mjs'
const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [k, ...v] = arg.replace(/^--/, '').split('=')
    if (!['out', 'axes'].includes(k)) throw new Error('Unknown option: ' + arg)
    return [k, v.join('=')]
  }),
)
const root = resolve(
  args.out ?? `docs/captures/benchmarks-${new Date().toISOString().slice(0, 10)}/capacity`,
)
await mkdir(root, { recursive: true })
const axes = {
  skinning: {
    label: 'Visible skinned creatures',
    loads: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    id: n => `skinning-${n}`,
  },
  'water-loaded-off': {
    label: 'Loaded waters, pause off',
    loads: [1, 2, 4, 8, 16, 32],
    id: n => `water-scale-${n}-off`,
  },
  'water-loaded-pause': {
    label: 'Loaded waters, pause on',
    loads: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    id: n => `water-scale-${n}-pause`,
  },
  'water-visible': {
    label: 'Simultaneously visible waters',
    loads: [1, 2, 4, 8, 16, 32],
    id: n => `water-visible-${n}`,
  },
  particles: {
    label: 'Simultaneous effect groups (3 effects each)',
    loads: [1, 2, 4, 8, 16, 24, 32, 64, 128, 256],
    id: n => `particles-${n}`,
  },
  'water-grid': {
    label: 'One visible water: geometry grid width',
    loads: [65, 129, 257, 513],
    id: n => `water-grid-${n}`,
  },
}
const manifestPath = join(root, 'manifest.json')
const manifest = await readFile(manifestPath, 'utf8').then(JSON.parse, () => ({
  protocol: {
    seed: 4242,
    dt: 1 / 60,
    warmup: 600,
    frames: 600,
    runs: 5,
    rounds: 2,
    uncapped: true,
    rendererCpu: 6,
    extensions: false,
    freshProcess: true,
    queue: 2,
    capacity: 'worst of two round frame p95; thresholds 16.7 and 33.3 ms',
    maximum: 'largest measured passing load; no interpolation',
    safety: 'at most 512 loaded waters; report a resource/untested bound if no budget crossing',
  },
  source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  axes: {},
}))
const save = () => writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
const selected = args.axes ? args.axes.split(',') : Object.keys(axes)
for (const axis of selected) if (!axes[axis]) throw new Error('Unknown capacity axis: ' + axis)
await save() // protocol is on disk before any measured sample
function command(argv) {
  return new Promise((ok, bad) => {
    const child = spawn('node', ['scripts/bench.mjs', ...argv], { stdio: 'inherit' })
    child.on('error', bad)
    child.on('exit', code => (code === 0 ? ok() : bad(new Error('Benchmark exited ' + code))))
  })
}
for (const axis of selected) {
  const spec = axes[axis],
    state = (manifest.axes[axis] ??= { label: spec.label, points: [], status: 'running' })
  for (const load of spec.loads) {
    if (state.points.some(p => p.load === load)) {
      if (state.points.at(-1).crossed30) break
      continue
    }
    const id = spec.id(load)
    let point = { id, axis, load, files: [] }
    const reuse =
      (axis.startsWith('water-loaded') && load <= 8) ||
      (axis === 'water-visible' && load === 1) ||
      (axis === 'water-grid' && load === 129)
    if (reuse) {
      const count = axis === 'water-grid' || axis === 'water-visible' ? 1 : load,
        policy = axis === 'water-loaded-pause' ? 'pause' : 'off'
      const parent = resolve(dirname(root), 'phase-2')
      point.files = [1, 2].map(n =>
        relative(
          root,
          join(parent, `water-scale-${count}-round-${n}`, `water-scale-${count}-${policy}.json`),
        ),
      )
      point.reused =
        'Phase 2: same optimized core, 28 m bed, camera, 129 grid, CPU6/fresh/no-extensions protocol'
    } else {
      for (const round of [1, 2]) {
        const name = `${id}-round-${round}`
        point.files.push(`${name}/${id}.json`)
        const existing = await readFile(join(root, name, `${id}.json`), 'utf8').then(
          JSON.parse,
          () => null,
        )
        if (existing?.runs.length === 5) continue
        await command([
          '--uncapped',
          '--renderer-cpu=6',
          '--fresh-browser',
          '--no-extensions',
          `--scenes=${id}`,
          `--round=${name}`,
          `--out=${root}`,
        ])
      }
    }
    const result = await aggregatePoint(root, point)
    if (!result.stable) {
      state.status = 'repeatability-failed'
      state.failed = point
      await save()
      throw new Error(
        `Frame p50 gate failed for ${id}: ${(result.repeatability * 100).toFixed(2)}%; raw rounds preserved`,
      )
    }
    const expectedVisible = axis === 'water-visible' ? load : 1
    for (const d of result.diagnostics) {
      if (axis === 'skinning' && d.diagnostics.visibleCreatures !== load)
        throw new Error('Some creatures are outside the frustum')
      if (
        !point.reused &&
        axis.startsWith('water-') &&
        d.diagnostics.visibleWaters !== expectedVisible
      )
        throw new Error('Water visibility does not match capacity axis')
      if (
        axis === 'water-grid' &&
        !point.reused &&
        d.diagnostics.simulationResolutions[0] !== Math.min(129, load)
      )
        throw new Error('Unexpected simulation grid')
    }
    const capped = axis === 'particles' && result.pointCountRange[1] >= 8000
    const record = {
      ...point,
      frame: result.stats.frameMs,
      cpu: result.stats.frameCpuMs,
      gpu: result.stats.gpuMs,
      capacityP95: result.capacityP95,
      repeatability: result.repeatability,
      bottleneck: result.bottleneck,
      stable: result.stable,
      capped,
      crossed30: result.capacityP95 > 33.3,
      hash: result.hash,
      pointCountRange: result.pointCountRange,
    }
    state.points.push(record)
    state.capacity60 = capacityAt(state.points, 16.7)
    state.capacity30 = capacityAt(state.points, 33.3)
    await save()
    console.log(
      'CAPACITY',
      axis,
      load,
      JSON.stringify({
        frame: record.frame,
        p95WorstRound: record.capacityP95,
        bottleneck: record.bottleneck,
        repeatability: record.repeatability,
        capped,
      }),
    )
    if (capped) {
      state.status = 'particle-buffer-bound'
      await save()
      break
    }
    if (record.crossed30) break
  }
  if (state.status === 'running')
    state.status = state.points.at(-1)?.crossed30 ? 'both-budgets-crossed' : 'tested-range-bound'
  await save()
}
console.log('Capacity manifest', manifestPath)
