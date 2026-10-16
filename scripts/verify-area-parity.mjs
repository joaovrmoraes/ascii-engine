import { benchmarkBrowser } from './bench-browser.mjs'
import { writeFile, mkdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
const args = process.argv.slice(2),
  option = name =>
    args
      .find(a => a.startsWith('--' + name + '='))
      ?.split('=')
      .slice(1)
      .join('='),
  scenes = args.filter(a => !a.startsWith('--')),
  before = option('before') ?? 'http://localhost:1445',
  after = option('after') ?? 'http://localhost:1440',
  sourceBefore = option('before-source') ?? '34c7ca9',
  output = option('out') ?? 'docs/captures/benchmarks-2026-10-15/phase-2/area-parity'
await mkdir(output, { recursive: true })
const browser = await benchmarkBrowser({ blockStorage: false }),
  results = []
try {
  await browser.send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await browser.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(()=>{let n=0;const raf=requestAnimationFrame.bind(window),interval=setInterval.bind(window);window.requestAnimationFrame=cb=>{function ready(){if(window.area?.id==='gltf'&&!area.state.startsWith('glb '))return raf(ready);cb(++n*1000/60)}return raf(ready)};window.setInterval=(fn,ms,...args)=>ms===50&&String(fn).includes('lastAnimationFrame')?0:interval(fn,ms,...args)})()`,
  })
  for (const scene of scenes.length
    ? scenes
    : [
        'reference',
        'dark_forest',
        'rain_marsh',
        'snow_pines',
        'old_mine',
        'sunken_cathedral',
        'gltf',
      ]) {
    for (const [label, base] of [
      ['before', before],
      ['after', after],
    ]) {
      await browser.navigate(
        `${base}/?area=${scene}&pause=3&peaceful=1&parity=1`,
        '!!window.engine && !!window.view && engine.time >= 3-1e-6',
      )
      await browser.evaluate(
        `for(const id of ['panel','status','selection'])document.getElementById(id)?.style.setProperty('visibility','hidden')`,
      )
      const shot = await browser.send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`${output}/${scene}-${label}.png`, Buffer.from(shot.data, 'base64'))
      await browser.check()
    }
    const r = spawnSync(
      'magick',
      [
        'compare',
        '-metric',
        'RMSE',
        `${output}/${scene}-before.png`,
        `${output}/${scene}-after.png`,
        'null:',
      ],
      { encoding: 'utf8' },
    )
    const rmse = Number(/\(([\d.e-]+)\)/.exec(r.stderr)?.[1])
    results.push({
      scene,
      rmse,
      clock: 'fixed injected rAF, fallback disabled, pause=3; GLTF animation waits for both models',
      sourceBefore,
      sourceAfter: 'working tree',
    })
    await writeFile(
      `${output}/${scenes.join('-') || 'results'}.json`,
      JSON.stringify(results, null, 2) + '\n',
    )
    console.log(scene, rmse)
  }
} finally {
  await browser.close()
}
if (results.some(r => !Number.isFinite(r.rmse) || r.rmse > 0.0001)) process.exitCode = 1
