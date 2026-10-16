import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { benchmarkBrowser } from './bench-browser.mjs'
const root = resolve('docs/captures/benchmarks-2026-10-15'),
  output = resolve(
    process.argv.find(a => a.startsWith('--out='))?.slice(6) ?? join(root, 'capacity/validation'),
  )
await mkdir(output, { recursive: true })
const index = JSON.parse(await readFile(join(root, 'charts/index.json'), 'utf8'))
const allowed = new Map(
  await Promise.all(
    index.charts.map(async c => ['/' + c.file, await readFile(join(root, 'charts', c.file))]),
  ),
)
const server = createServer((req, res) => {
  const body = allowed.get(req.url)
  res.writeHead(body ? 200 : 404, { 'Content-Type': 'image/svg+xml' })
  res.end(body ?? 'Not found')
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const browser = await benchmarkBrowser({ disableExtensions: true }),
  results = []
try {
  await browser.send('Emulation.setDeviceMetricsOverride', {
    width: 1140,
    height: 1700,
    deviceScaleFactor: 1,
    mobile: false,
  })
  for (const chart of index.charts) {
    const bytes = allowed.get('/' + chart.file),
      hash = createHash('sha256').update(bytes).digest('hex')
    if (hash !== chart.sha256) throw new Error('Chart checksum changed')
    await browser.navigate(
      `http://127.0.0.1:${port}/${chart.file}`,
      "!!document.querySelector('svg text')",
    )
    const layout = await browser.evaluate(
      `(()=>{const svg=document.querySelector('svg'),box=svg.viewBox.baseVal;return {width:box.width,height:box.height,title:svg.querySelector('title').textContent,background:svg.querySelector('rect').getAttribute('fill'),textCount:svg.querySelectorAll('text').length,clipped:[...svg.querySelectorAll('text')].map(el=>({text:el.textContent,box:el.getBBox()})).filter(({box:b})=>b.x<0||b.y<0||b.x+b.width>box.width||b.y+b.height>box.height).map(({text})=>text)}})()`,
    )
    if (layout.clipped.length || layout.background !== '#fbfcfe')
      throw new Error('Chart layout failed: ' + JSON.stringify(layout))
    results.push({ file: chart.file, sha256: hash, ...layout })
    if (
      [
        'skinning-before-after.svg',
        'capacity-water-loaded-pause.svg',
        'capacity-water-visible.svg',
      ].includes(chart.file)
    ) {
      const shot = await browser.send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: layout.width, height: layout.height, scale: 1 },
        captureBeyondViewport: true,
      })
      await writeFile(
        join(output, chart.file.replace('.svg', '-preview.png')),
        Buffer.from(shot.data, 'base64'),
      )
    }
    await browser.check()
    console.log('Layout OK', chart.file)
  }
  await writeFile(join(output, 'chart-layout.json'), JSON.stringify(results, null, 2) + '\n')
} finally {
  await browser.close()
  await new Promise(r => server.close(r))
}
