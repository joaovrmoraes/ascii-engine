import { benchmarkBrowser } from './bench-browser.mjs'
import { summarize } from './bench-stats.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { execFileSync } from 'node:child_process'

const out = process.argv[2] ?? '.cache/visible-water-study/profile',
  label = process.argv[3] ?? 'before',
  count = Number(process.argv[4] ?? 4)
if (![1, 2, 4, 8, 16, 32].includes(count)) throw new Error('Unsupported water count')
await mkdir(out, { recursive: true })
const browser = await benchmarkBrowser({ uncapped: true, disableExtensions: true })
try {
  await browser.navigate(
    `http://localhost:1440/?bench=water-scale&waters=${count}&water-layout=visible&water-policy=off&queue=2`,
  )
  const affinity = await browser.pinRenderer(6)
  await browser.send('Profiler.enable')
  await browser.send('Profiler.setSamplingInterval', { interval: 100 })
  await browser.send('HeapProfiler.enable')
  await browser.send('HeapProfiler.startSampling', {
    samplingInterval: 32768,
    includeObjectsCollectedByMajorGC: true,
    includeObjectsCollectedByMinorGC: true,
  })
  await browser.send('Profiler.start')
  const result = await browser.evaluate('benchmark.run(600,600)')
  const cpu = (await browser.send('Profiler.stop')).profile
  const heap = (await browser.send('HeapProfiler.stopSampling')).profile
  await browser.check()
  const nodes = new Map(cpu.nodes.map(n => [n.id, n])),
    self = new Map(),
    tree = new Map(cpu.nodes.flatMap(n => (n.children ?? []).map(id => [id, n.id])))
  cpu.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + cpu.timeDeltas[i]))
  const hot = [...self]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([id, us]) => {
      const stack = []
      for (let parent = id; parent; parent = tree.get(parent))
        stack.push(nodes.get(parent).callFrame.functionName)
      return { ...nodes.get(id).callFrame, milliseconds: us / 1000, stack }
    })
  const allocations = []
  function walk(node) {
    if (node.selfSize) allocations.push({ ...node.callFrame, bytes: node.selfSize })
    node.children.forEach(walk)
  }
  walk(heap.head)
  allocations.sort((a, b) => b.bytes - a.bytes)
  const evidence = {
    warning:
      'Sampling perturbs timing; diagnostic only. Includes warm-up and final fingerprint work.',
    source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    trackedChanges: execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      encoding: 'utf8',
    }).trim(),
    chromium: browser.version,
    flags: browser.flags,
    affinity,
    configuration: result.configuration,
    diagnostics: result.diagnostics,
    fingerprint: result.fingerprint,
    stats: summarize(result.samples.map(s => ({ ...s, ...s.timings }))),
    hot,
    allocations: allocations.slice(0, 40),
  }
  for (const [extension, data] of [
    ['cpuprofile.gz', gzipSync(JSON.stringify(cpu))],
    ['heapprofile.json.gz', gzipSync(JSON.stringify(heap))],
    ['json', JSON.stringify(evidence, null, 2) + '\n'],
  ])
    await writeFile(`${out}/${label}-${count}.${extension}`, data)
  console.log(
    'Profile recorded',
    label,
    count,
    hot.slice(0, 8).map(r => [r.functionName, r.milliseconds]),
  )
} finally {
  await browser.close()
}
