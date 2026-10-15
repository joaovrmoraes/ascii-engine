import { benchmarkBrowser } from './bench-browser.mjs'
import { writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { execFileSync } from 'node:child_process'
const out = process.argv[2] ?? 'docs/captures/benchmarks-2026-10-15/phase-2/profile'
const label = process.argv[3] ?? 'before'
await (await import('node:fs/promises')).mkdir(out, { recursive: true })
const b = await benchmarkBrowser({ uncapped: true })
try {
  await b.navigate('http://localhost:1440/?bench=skinning&queue=2')
  const creatures = await b.evaluate(
    `(()=>{const rows=[];engine.scene.traverse(p=>{if(p.userData.skin){const s=p.userData.skin;rows.push({letters:p.geometry.attributes.position.count,sourceVertices:s.mesh.geometry.attributes.position.count,uniqueCorners:new Set(s.corners).size,bones:s.mesh.skeleton.bones.length})}});return rows})()`,
  )
  await b.send('Profiler.enable')
  await b.send('Profiler.setSamplingInterval', { interval: 100 })
  await b.send('HeapProfiler.enable')
  await b.send('HeapProfiler.startSampling', {
    samplingInterval: 32768,
    includeObjectsCollectedByMajorGC: true,
    includeObjectsCollectedByMinorGC: true,
  })
  await b.send('Profiler.start')
  const r = await b.evaluate('benchmark.run(600,600)')
  const cpu = await b.send('Profiler.stop')
  const heap = await b.send('HeapProfiler.stopSampling')
  await b.check()
  const nodes = new Map(cpu.profile.nodes.map(n => [n.id, n]))
  const self = new Map()
  cpu.profile.samples.forEach((id, i) =>
    self.set(id, (self.get(id) || 0) + cpu.profile.timeDeltas[i]),
  )
  const hot = [...self]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35)
    .map(([id, us]) => ({
      function: nodes.get(id).callFrame.functionName,
      url: nodes.get(id).callFrame.url,
      line: nodes.get(id).callFrame.lineNumber,
      ms: us / 1000,
    }))
  const alloc = []
  function walk(n) {
    if (n.selfSize)
      alloc.push({ function: n.callFrame.functionName, url: n.callFrame.url, bytes: n.selfSize })
    for (const c of n.children) walk(c)
  }
  walk(heap.profile.head)
  alloc.sort((a, b) => b.bytes - a.bytes)
  const evidence = {
    source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    flags: b.flags,
    chromium: b.version,
    browser: r.browser,
    creatures,
    frames: 1200,
    warning:
      'CPU and allocation sampling perturb timings; diagnostic only, not performance baseline',
    hot,
    allocations: alloc.slice(0, 35),
    gpuQueue: r.gpuQueue,
  }
  await writeFile(out + '/' + label + '.cpuprofile.gz', gzipSync(JSON.stringify(cpu.profile)))
  await writeFile(
    out + '/' + label + '.heapprofile.json.gz',
    gzipSync(JSON.stringify(heap.profile)),
  )
  await writeFile(out + '/' + label + '.json', JSON.stringify(evidence, null, 2) + '\n')
  console.log(JSON.stringify(evidence, null, 2))
} finally {
  await b.close()
}
