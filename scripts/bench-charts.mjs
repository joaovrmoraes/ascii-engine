import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { writeCapacityReport } from './bench-capacity-report.mjs'
import { aggregatePoint, capacityAt } from './bench-capacity-data.mjs'
import { summarize, classifyBottleneck } from './bench-stats.mjs'

const root = resolve(
  process.argv.find(a => a.startsWith('--root='))?.slice(7) ??
    'docs/captures/benchmarks-2026-10-15',
)
const load = async path => JSON.parse(await readFile(join(root, path), 'utf8'))
const output = join(root, 'charts')
await mkdir(output, { recursive: true })
const colors = {
  blue: '#075fbb',
  orange: '#b04a00',
  ink: '#17243b',
  muted: '#475569',
  grid: '#d7e0eb',
  background: '#fbfcfe',
}
const xml = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c],
  )
const f = n => (Number.isFinite(n) ? n.toFixed(3) : 'n/a')
const text = (x, y, value, extra = '') => `<text x="${x}" y="${y}" ${extra}>${xml(value)}</text>`
const line = (x1, y1, x2, y2, color = colors.grid, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`
async function historical(files) {
  const rounds = await Promise.all(files.map(load)),
    rows = []
  for (const r of rounds)
    for (const run of r.runs) {
      if (
        run.metadata.frames !== 600 ||
        run.metadata.configuration.dt !== 1 / 60 ||
        run.metadata.gpuQueue.scheduler !== 'task'
      )
        throw new Error('Historical protocol mismatch')
      rows.push(...run.samples.map(v => Object.fromEntries(r.columns.map((k, i) => [k, v[i]]))))
    }
  const stats = summarize(rows)
  const environments = await Promise.all(
    files.map(file => load(file.replace(/[^/]+$/, 'environment.json'))),
  )
  if (new Set(environments.map(e => e.chromium.product)).size !== 1)
    throw new Error('Historical browser mismatch')
  return {
    stats,
    environment: environments[0],
    sources: environments.map(e => e.sourceCommit),
    bottleneck: classifyBottleneck(stats.frameCpuMs.p50, stats.gpuMs.p50),
    files,
  }
}
const skinBefore = await historical(
    [1, 2].map(n => `phase-2/before-skinning-round-${n}/skinning.json`),
  ),
  skinAfter = await historical([1, 2].map(n => `phase-2/after-skinning-round-${n}/skinning.json`))
const waterHistory = []
for (const count of [1, 2, 4, 8])
  for (const policy of ['off', 'pause'])
    waterHistory.push({
      count,
      policy,
      ...(await historical(
        [1, 2].map(
          n => `phase-2/water-scale-${count}-round-${n}/water-scale-${count}-${policy}.json`,
        ),
      )),
    })
const referenceWater = await historical([1, 2].map(n => `uncapped-round-${n}/water.json`)),
  referenceParticles = await historical([1, 2].map(n => `uncapped-round-${n}/particles.json`))
const manifest = await load('capacity/manifest.json')
const axisNames = [
  'skinning',
  'water-loaded-off',
  'water-loaded-pause',
  'water-visible',
  'particles',
  'water-grid',
]
const axes = {}
for (const name of axisNames) {
  const state = manifest.axes[name]
  if (
    !state ||
    ![
      'both-budgets-crossed',
      'tested-range-bound',
      'particle-buffer-bound',
      'resource-bound',
    ].includes(state.status)
  )
    throw new Error('Capacity axis is incomplete: ' + name)
  const points = []
  for (const p of state.points) {
    const r = await aggregatePoint(join(root, 'capacity'), p)
    if (!r.stable) throw new Error('Unstable chart point: ' + p.id)
    points.push({ ...r, capped: p.capped })
  }
  axes[name] = {
    label: state.label,
    status: state.status,
    resourceLimit: state.resourceLimit ?? null,
    points,
    capacity60: capacityAt(points, 16.7),
    capacity30: capacityAt(points, 33.3),
  }
}
const artifacts = []
function footer(datasets) {
  const env = datasets[0].environment,
    sources = [...new Set(datasets.flatMap(d => d.sources))]
      .sort()
      .map(s => s.slice(0, 7))
      .join(' / ')
  const cpu = env.cpu.model.match(/i[3579]-[A-Za-z0-9]+/)?.[0] ?? env.cpu.model,
    gpu = env.gpu.renderer.includes('ADL GT2') ? 'Intel ADL GT2' : env.gpu.renderer
  return `${cpu} / ${gpu} | ${env.chromium.product.replace(/^(Headless)?Chrome\//, 'Chromium ')} headless | ANGLE GL | 1920x1080 DPR 1 | commits ${sources}`
}
async function save(name, title, subtitle, content, height, datasets) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="${height}" viewBox="0 0 1120 ${height}" role="img" aria-labelledby="title desc"><title id="title">${xml(title)}</title><desc id="desc">${xml(subtitle)}. Every time axis starts at zero. CPU and GPU overlap.</desc><rect width="1120" height="${height}" fill="${colors.background}"/><g font-family="system-ui, sans-serif" fill="${colors.ink}" font-size="12">${text(28, 34, title, 'font-size="22" font-weight="700"')}${text(28, 58, subtitle, 'fill="' + colors.muted + '"')}${content}${line(28, height - 45, 1090, height - 45)}${text(28, height - 22, footer(datasets), 'font-size="11" fill="' + colors.muted + '"')}</g></svg>\n`
  await writeFile(join(output, name), svg)
  artifacts.push({
    file: name,
    sha256: createHash('sha256').update(svg).digest('hex'),
    sources: [...new Set(datasets.flatMap(d => d.sources))].sort(),
  })
}
function plot(x, y, width, height, yMax, xMax = 1) {
  let body = ''
  const px = v => x + (v / xMax) * width,
    py = v => y + height - (v / yMax) * height
  for (let i = 0; i <= 5; i++) {
    const v = (yMax * i) / 5
    body +=
      line(x, py(v), x + width, py(v)) +
      text(x - 10, py(v) + 4, Number(v.toFixed(1)), 'text-anchor="end"')
  }
  body +=
    line(x, y, x, y + height, colors.ink) +
    line(x, y + height, x + width, y + height, colors.ink) +
    text(x, y - 12, 'Time (ms)')
  return { body, px, py, x, y, width, height }
}
function budgets(p) {
  return [16.7, 33.3]
    .map(
      v =>
        line(p.x, p.py(v), p.x + p.width, p.py(v), '#6b344d', 'stroke-dasharray="7 5"') +
        text(
          p.x + p.width - 5,
          p.py(v) - 5,
          `${v} ms / ${v === 16.7 ? '60' : '30'} fps`,
          'text-anchor="end" fill="#6b344d"',
        ),
    )
    .join('')
}
function table(rows, columns, y) {
  const xs = columns.map(c => c.x)
  let out = ''
  out += `<rect x="65" y="${y - 19}" width="1005" height="26" fill="#e8eef6"/>`
  columns.forEach((c, i) => (out += text(xs[i], y, c.label, 'font-weight="700"')))
  rows.forEach((row, n) => {
    const at = y + 28 + n * 23
    columns.forEach((_, i) => (out += text(xs[i], at, row[i])))
    out += line(65, at + 7, 1070, at + 7)
  })
  return out
}
function bar(p, x, width, stat, color, label) {
  const y = p.py(stat.p50),
    top = p.py(stat.p95),
    mid = x + width / 2
  return (
    `<rect x="${x}" y="${y}" width="${width}" height="${p.py(0) - y}" fill="${color}"/>` +
    line(mid, y, mid, top, colors.ink, 'stroke-width="2"') +
    line(mid - 7, top, mid + 7, top, colors.ink, 'stroke-width="2"') +
    text(mid, top - 25, f(stat.p50), 'text-anchor="middle"') +
    text(mid, top - 9, f(stat.p95), 'text-anchor="middle" fill="' + colors.muted + '"') +
    text(mid, p.py(0) + 24, label, 'text-anchor="middle"')
  )
}
{
  let body = ''
  for (const [i, key, label] of [
    [0, 'skinning', 'Skinning step'],
    [1, 'frameMs', 'Full frame'],
  ]) {
    const p = plot(80 + i * 550, 125, 445, 280, 20)
    body += p.body + text(80 + i * 550, 93, label, 'font-size="16" font-weight="600"')
    body +=
      bar(p, 150 + i * 550, 90, skinBefore.stats[key], colors.orange, 'Original JS') +
      bar(p, 350 + i * 550, 90, skinAfter.stats[key], colors.blue, 'Optimized JS')
  }
  body += text(
    80,
    465,
    'Bars: p50. Whiskers: p95. Both numbers are labeled in ms. Fixed 16-creature fixture.',
  )
  body += text(
    80,
    490,
    `${(skinBefore.stats.skinning.p50 / skinAfter.stats.skinning.p50).toFixed(2)}x isolated speedup; ${(100 * (1 - skinAfter.stats.frameMs.p50 / skinBefore.stats.frameMs.p50)).toFixed(2)}% lower frame p50. Position/normal max error 0; controlled image RMSE 0.`,
  )
  await save(
    'skinning-before-after.svg',
    'Skinning: original vs optimized JavaScript',
    'Same scene, model, glyph density and fixed steps; original OS-default affinity protocol.',
    body,
    565,
    [skinBefore, skinAfter],
  )
}
{
  const scenes = [
      ['Water + rain', referenceWater],
      ['Particles', referenceParticles],
      ['Skinning before', skinBefore],
      ['Skinning optimized', skinAfter],
    ],
    p = plot(80, 120, 990, 300, 20)
  let body = p.body
  scenes.forEach(([name, r], i) => {
    const x = 125 + i * 245
    body +=
      bar(p, x, 65, r.stats.frameCpuMs, colors.blue, 'CPU') +
      bar(p, x + 90, 65, r.stats.gpuMs, colors.orange, 'GPU')
    body += text(x + 77, 475, `${name}: ${r.bottleneck}`, 'text-anchor="middle" font-weight="600"')
  })
  body +=
    text(
      80,
      520,
      'p50 bars, p95 whiskers; independent elapsed ranges, not a stacked CPU + GPU total.',
    ) +
    text(
      80,
      544,
      'Water GPU ranges can include submission gaps; compositor/presentation is excluded. Dominance band: 20%.',
    )
  await save(
    'cpu-vs-gpu.svg',
    'CPU vs GPU in the reference scenes',
    'Phase 1/2 fixed reference scenes; historical OS-default affinity. Values are p50 / p95 in ms.',
    body,
    615,
    scenes.map(s => s[1]),
  )
}
async function curve(
  name,
  title,
  subtitle,
  series,
  axisLabel,
  { p95Curves = false, capacity } = {},
) {
  const datasets = series.flatMap(s => s.points),
    xMin = Math.min(...datasets.map(p => p.load)),
    xMax = Math.max(...datasets.map(p => p.load)),
    max = Math.max(33.3, ...datasets.map(p => p.capacityP95 ?? p.stats.frameMs.p95)),
    yMax = Math.ceil((max * 1.18) / 5) * 5,
    p = plot(80, 125, 990, 300, yMax, xMax)
  if (p95Curves)
    p.px = value =>
      p.x + ((Math.log2(value) - Math.log2(xMin)) / (Math.log2(xMax) - Math.log2(xMin))) * p.width
  let body = p.body + budgets(p),
    rows = []
  const loads = [...new Set(datasets.map(p => p.load))].sort((a, b) => a - b)
  let lastTick = -Infinity
  for (const n of p95Curves ? loads : [0, ...loads]) {
    if (p.px(n) - lastTick < 42 && n !== xMax) continue
    lastTick = p.px(n)
    body +=
      line(p.px(n), 425, p.px(n), 431, colors.ink) +
      text(p.px(n), 449, n, 'text-anchor="middle" font-size="10"')
  }
  body += text(575, 478, axisLabel + (p95Curves ? ' (log2 scale)' : ''), 'text-anchor="middle"')
  series.forEach((s, index) => {
    const color = s.color ?? (index ? colors.orange : colors.blue),
      points = [...s.points].sort((a, b) => a.load - b.load)
    const path = points
      .map(
        (r, i) =>
          `${i ? 'L' : 'M'}${p.px(r.load)} ${p.py(p95Curves ? r.capacityP95 : r.stats.frameMs.p50)}`,
      )
      .join(' ')
    body += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${p95Curves ? 1 : 2.5}"${p95Curves ? ' stroke-opacity="0.35" stroke-dasharray="3 5"' : ''}/>`
    for (const r of points) {
      const med = r.stats.frameMs.p50,
        tail = r.capacityP95 ?? r.stats.frameMs.p95,
        x = p.px(r.load)
      body +=
        line(x, p.py(med), x, p.py(tail), color) +
        line(x - 5, p.py(tail), x + 5, p.py(tail), color) +
        `<circle cx="${x}" cy="${p.py(p95Curves ? tail : med)}" r="4" fill="${color}"><title>${xml(`${s.label}: load ${r.load}; p50 ${f(med)} ms; p95 ${f(tail)} ms`)}</title></circle>`
      rows.push([
        String(r.load),
        s.label,
        f(med),
        f(tail),
        f(r.stats.frameCpuMs.p50),
        f(r.stats.gpuMs.p50),
        r.bottleneck ?? classifyBottleneck(r.stats.frameCpuMs.p50, r.stats.gpuMs.p50),
      ])
    }
    body +=
      line(80 + index * 460, 88, 107 + index * 460, 88, color, 'stroke-width="3"') +
      text(115 + index * 460, 92, s.label)
  })
  body += text(
    80,
    503,
    p95Curves
      ? 'Dots: measured worse-round p95; lower whisker: pooled p50. Faint connectors are reading guides, not interpolation.'
      : 'Lines: pooled p50. Upper whisker: pooled p95. All values are tabulated below.',
    'fill="' + colors.muted + '"',
  )
  if (capacity) {
    const bound = c =>
      `${c.lowerBound ? 'at least ' : ''}${c.maximum}${c.nextFail ? `; next tested failure ${c.nextFail}` : ''}`
    body += text(
      80,
      522,
      `Largest tested passing load — 60 fps: ${bound(capacity.capacity60)} | 30 fps: ${bound(capacity.capacity30)}. ${capacity.status}.`,
    )
  }
  const resource = capacity?.resourceLimit
  if (resource)
    body += text(
      80,
      544,
      `Resource stop before ${resource.load}: projected ${(resource.projectedPeakBytes / 1024 ** 3).toFixed(2)} GiB RSS; ${(resource.availableBytes / 1024 ** 3).toFixed(2)} GiB available; 4 GiB system reserve.`,
      'font-size="11"',
    )
  body += table(
    rows,
    [
      { x: 80, label: 'Load' },
      { x: 150, label: 'Series' },
      { x: 350, label: 'Frame p50 ms' },
      { x: 500, label: p95Curves ? 'Worst p95 ms' : 'Frame p95 ms' },
      { x: 660, label: 'CPU p50 ms' },
      { x: 800, label: 'GPU p50 ms' },
      { x: 940, label: 'Bottleneck' },
    ],
    resource ? 568 : 544,
  )
  const height = 640 + rows.length * 23 + (resource ? 24 : 0)
  await save(name, title, subtitle, body, height, datasets)
}
await curve(
  'water-scale.svg',
  'Water at scale: hidden simulation work',
  'One visible water; every mask, mesh and solver is 129x129. Phase 2 source, matched scheduling controls.',
  ['off', 'pause'].map(policy => ({
    label: policy === 'off' ? 'Pause off' : 'Pause on',
    color: policy === 'off' ? colors.orange : colors.blue,
    points: waterHistory.filter(r => r.policy === policy).map(r => ({ ...r, load: r.count })),
  })),
  'Loaded waters',
)
for (const [axis, name, subtitle] of [
  [
    'skinning',
    'capacity-skinning.svg',
    'Seven bones per creature, size 0.09 m; fitted camera above 16; all creatures remain in frame.',
  ],
  [
    'water-loaded-off',
    'capacity-water-loaded-off.svg',
    '129x129 waters, one visible; all loaded water simulations and preparation remain active.',
  ],
  [
    'water-loaded-pause',
    'capacity-water-loaded-pause.svg',
    '129x129 waters, one visible; offscreen simulation/preparation pause, margin 4 m.',
  ],
  [
    'water-visible',
    'capacity-water-visible.svg',
    'All 129x129 waters visible; fitted camera, simulated reflection levels; no offscreen pausing.',
  ],
  [
    'particles',
    'capacity-effects.svg',
    'Each group: campfire + looping fire explosion + ice. Same eight locations; default particle budgets.',
  ],
  [
    'water-grid',
    'capacity-water-grid.svg',
    'One visible 28 m water. Mesh/mask widths 65/129/257/513; solver widths 65/129/129/129.',
  ],
])
  await curve(
    name,
    `Capacity: ${axes[axis].label}`,
    subtitle,
    [{ label: 'Optimized JS', points: axes[axis].points }],
    axis === 'water-grid'
      ? 'Mesh/mask grid width (samples per side)'
      : axis === 'particles'
        ? 'Simultaneous effect groups (3 effects per group)'
        : 'Load count',
    { p95Curves: true, capacity: axes[axis] },
  )
const compactAxes = Object.fromEntries(
  Object.entries(axes).map(([k, a]) => [
    k,
    {
      ...a,
      points: a.points.map(({ environment, diagnostics, ...r }) => ({
        ...r,
        configuration: diagnostics[0].configuration,
        diagnostics: diagnostics[0].diagnostics,
        effectStats: diagnostics[0].effectStats,
        skinnedPoints: diagnostics[0].skinnedPoints,
      })),
    },
  ]),
)
await writeFile(
  join(root, 'capacity/summary.json'),
  JSON.stringify(
    {
      profile: 'i5-12450H; Chromium headless; ANGLE GL',
      protocol: manifest.protocol,
      axes: compactAxes,
    },
    null,
    2,
  ) + '\n',
)
await writeFile(join(output, 'index.json'), JSON.stringify({ charts: artifacts }, null, 2) + '\n')
await writeCapacityReport(
  root,
  JSON.parse(await readFile(join(root, 'capacity/summary.json'), 'utf8')),
)
console.log('Generated', artifacts.map(a => a.file).join(', '))
