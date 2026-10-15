import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { benchmarkBrowser } from './bench-browser.mjs'
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.join('=')]
  }),
)
const mode = args.mode ?? 'skinning',
  before = args.before ?? 'http://localhost:1445',
  after = args.after ?? 'http://localhost:1440'
if (!['skinning', 'water'].includes(mode)) throw new Error('Use --mode=skinning|water')
const output = args.out ?? 'docs/captures/benchmarks-2026-10-15/phase-2/parity'
await mkdir(output, { recursive: true })
const browser = await benchmarkBrowser({ uncapped: true }),
  results = []
function compare(a, b) {
  if (a.length !== b.length) throw new Error('Array shape changed')
  let max = 0,
    different = 0
  for (let i = 0; i < a.length; i++) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i]))
      throw new Error('Non-finite simulation value')
    max = Math.max(max, Math.abs(a[i] - b[i]))
    if (a[i] !== b[i]) different++
  }
  return { values: a.length, maximumAbsoluteDifference: max, differentValues: different }
}
try {
  const variants =
    mode === 'skinning'
      ? [
          { id: 'skinning', query: 'skinning', steps: 1 },
          { id: 'skinning', query: 'skinning', steps: 60 },
          { id: 'skinning', query: 'skinning', steps: 240 },
          { id: 'skinning', query: 'skinning', steps: 1200 },
        ]
      : [1, 2, 4, 8].map(n => ({
          id: 'water-scale-' + n,
          query: 'water-scale&waters=' + n,
          steps: 1200,
        }))
  for (const { id, query, steps } of variants) {
    const snapshots = []
    for (const [label, url] of [
      ['before', before],
      ['after', after],
    ]) {
      await browser.navigate(
        `${url}/?bench=${query}&queue=2${mode === 'water' ? '&water-policy=' + (label === 'after' ? 'pause' : 'off') : ''}`,
      )
      const metadata = await browser.evaluate(
        `benchmark.run(0,${steps}).then(({samples,...metadata})=>metadata)`,
      )
      const snapshot = await browser.evaluate('benchmark.snapshot()')
      snapshots.push({ snapshot, metadata })
      await browser.check()
      const png = await browser.send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`${output}/${id}-${steps}-${label}.png`, Buffer.from(png.data, 'base64'))
    }
    const [a, b] = snapshots,
      arrays = []
    if (mode === 'skinning') {
      if (a.snapshot.bodies.length !== b.snapshot.bodies.length)
        throw new Error('Body count changed')
      for (let i = 0; i < a.snapshot.bodies.length; i++)
        for (const field of ['position', 'normal'])
          arrays.push({
            body: i,
            field,
            ...compare(a.snapshot.bodies[i][field], b.snapshot.bodies[i][field]),
          })
    } else
      for (const field of ['position', 'normal', 'depth', 'flowX', 'flowZ', 'foam'])
        arrays.push({
          water: 0,
          field,
          ...compare(a.snapshot.waters[0][field], b.snapshot.waters[0][field]),
        })
    if (arrays.some(a => a.maximumAbsoluteDifference > 1e-5)) throw new Error('Parity exceeds 1e-5')
    const image = spawnSync(
      'magick',
      [
        'compare',
        '-metric',
        'RMSE',
        `${output}/${id}-${steps}-before.png`,
        `${output}/${id}-${steps}-after.png`,
        'null:',
      ],
      { encoding: 'utf8' },
    )
    const imageRmse = Number(/\(([\d.e-]+)\)/.exec(image.stderr)?.[1])
    if (imageRmse !== 0) throw new Error('Image parity failed: ' + image.stderr)
    results.push({
      id,
      steps,
      arrays,
      imageRmse,
      before: {
        configuration: a.metadata.configuration,
        diagnostics: a.metadata.diagnostics,
        fingerprint: a.metadata.fingerprint,
      },
      after: {
        configuration: b.metadata.configuration,
        diagnostics: b.metadata.diagnostics,
        fingerprint: b.metadata.fingerprint,
      },
      storageCalls: 0,
    })
    await writeFile(
      `${output}/${mode}.json`,
      JSON.stringify({ before, after, dt: 1 / 60, results }, null, 2) + '\n',
    )
    console.log(
      'PASS',
      id,
      steps,
      'max',
      Math.max(...arrays.map(a => a.maximumAbsoluteDifference)),
      'image RMSE',
      imageRmse,
    )
  }
} finally {
  await browser.close()
}
