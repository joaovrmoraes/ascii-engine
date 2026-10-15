import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { benchmarkBrowser } from './bench-browser.mjs'
const output =
  process.argv.find(a => a.startsWith('--out='))?.slice(6) ??
  'docs/captures/benchmarks-2026-10-15/capacity/policy-validation'
await mkdir(output, { recursive: true })
const browser = await benchmarkBrowser({ blockStorage: false }),
  results = { stationary: [], contexts: [], cameraPath: undefined }
const persist = () => writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n')
const assert = (ok, message) => {
  if (!ok) throw new Error(message)
}
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
  for (const scene of [
    'reference',
    'dark_forest',
    'rain_marsh',
    'snow_pines',
    'old_mine',
    'sunken_cathedral',
    'gltf',
  ]) {
    const state = []
    for (const policy of ['off', 'pause']) {
      await browser.navigate(
        `http://localhost:1440/?area=${scene}&pause=3&peaceful=1&water-policy=${policy}`,
        '!!window.engine && !!window.view && engine.time >= 3-1e-6',
      )
      state.push(
        await browser.evaluate(
          '({time:engine.time,policy:engine.offscreenWaterPolicy,waters:engine.waters.length})',
        ),
      )
      await browser.evaluate(
        `for(const id of ['panel','status','selection'])document.getElementById(id)?.style.setProperty('visibility','hidden')`,
      )
      await browser.check()
      const shot = await browser.send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`${output}/${scene}-${policy}.png`, Buffer.from(shot.data, 'base64'))
    }
    const image = spawnSync(
      'magick',
      [
        'compare',
        '-metric',
        'RMSE',
        `${output}/${scene}-off.png`,
        `${output}/${scene}-pause.png`,
        'null:',
      ],
      { encoding: 'utf8' },
    )
    const rmse = Number(/\(([\d.e-]+)\)/.exec(image.stderr)?.[1])
    assert(rmse === 0, 'Stationary image changed: ' + scene + ' ' + image.stderr)
    assert(!state[0].policy && state[1].policy?.mode === 'pause', 'Policy not applied: ' + scene)
    results.stationary.push({
      scene,
      state,
      imageRmse: rmse,
      clock: 'fixed 1/60 s rAF; pause=3; peaceful; async GLTF waits for models',
    })
    await persist()
    console.log('Stationary parity', scene, rmse)
  }
  for (const [query, expected] of [
    ['area=sandbox&pause=1', 'pause'],
    ['area=reference&player=1&pause=1', 'pause'],
    ['area=reference&player=1&pause=1&water-policy=off', 'off'],
    ['area=reference&pause=1&offline=1&water-policy=pause', 'off'],
    ['area=reference&pause=1&parity=1&water-policy=pause', 'off'],
  ]) {
    await browser.navigate(
      'http://localhost:1440/?' + query,
      '!!window.engine && !!window.view && engine.time >= 1-1e-6',
    )
    const actual = await browser.evaluate("engine.offscreenWaterPolicy?.mode ?? 'off'")
    assert(actual === expected, 'Incorrect context policy: ' + query)
    results.contexts.push({
      query,
      actual,
      profile: 'isolated temporary Chromium profile; owner IndexedDB untouched',
    })
  }
  const playerBase = process.argv.find(a => a.startsWith('--player-base='))?.slice(14)
  if (playerBase)
    for (const [query, expected] of [
      ['pause=1', 'pause'],
      ['pause=1&water-policy=off', 'off'],
      ['pause=1&water-policy=pause&offline=1', 'off'],
    ]) {
      await browser.navigate(
        `${playerBase}/?${query}`,
        "!!window.engine && !!window.view && engine.time>=1-1e-6 && document.body.classList.contains('player')",
      )
      const actual = await browser.evaluate("engine.offscreenWaterPolicy?.mode ?? 'off'")
      assert(actual === expected, 'Exported player water policy failed')
      results.contexts.push({ exportedPlayer: true, query, actual })
    }
  await browser.navigate(
    'http://localhost:1440/?area=sandbox&pause=1',
    '!!window.engine && !!window.view && engine.time >= 1-1e-6',
  )
  await browser.evaluate('document.querySelector("[data-tab=view]").click()')
  const box = await browser.evaluate(
    'document.querySelector("[data-k=water-policy]").getBoundingClientRect().toJSON()',
  )
  assert(box.width > 0 && box.height > 0, 'Display checkbox is hidden')
  results.nativeToggle = []
  for (const expected of ['off', 'pause']) {
    const point = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
      button: 'left',
      clickCount: 1,
    }
    await browser.send('Input.dispatchMouseEvent', { ...point, type: 'mousePressed', buttons: 1 })
    await browser.send('Input.dispatchMouseEvent', { ...point, type: 'mouseReleased', buttons: 0 })
    const state = await browser.evaluate(
      '({policy:engine.offscreenWaterPolicy??null,checked:document.querySelector("[data-k=water-policy]").checked,url:location.search})',
    )
    assert(
      (state.policy?.mode ?? 'off') === expected,
      'Native checkbox click did not update water policy',
    )
    assert(
      state.checked === (expected === 'pause'),
      'Native checkbox state differs from engine policy',
    )
    results.nativeToggle.push(state)
  }
  const toggle = await browser.evaluate(
    `(()=>{const el=document.querySelector('[data-k="water-policy"]');const original=engine.offscreenWaterPolicy;el.checked=false;el.dispatchEvent(new Event('change'));const off=engine.offscreenWaterPolicy;el.checked=true;el.dispatchEvent(new Event('change'));const on=engine.offscreenWaterPolicy;const copy=engine.offscreenWaterPolicy;copy.margin=99;let rejected=false;try{engine.setOffscreenWaterPolicy({mode:'pause',margin:-1})}catch{rejected=true}return{original,off,on,immutable:engine.offscreenWaterPolicy.margin===4,rejected,url:location.search}})()`,
  )
  assert(
    toggle.original?.mode === 'pause' &&
      !toggle.off &&
      toggle.on?.mode === 'pause' &&
      toggle.immutable &&
      toggle.rejected,
    'Runtime toggle failed',
  )
  results.toggle = toggle
  // Benchmarks bypass the editor and never open IndexedDB. Pause is intentional here:
  // ordinary parity=1 URLs would force full simulation and invalidate this scheduling test.
  for (const query of ['parity=1', 'offline=1']) {
    await browser.navigate(
      `http://localhost:1440/?bench=water-scale&waters=2&water-policy=pause&${query}`,
    )
    const r = await browser.evaluate(
      'benchmark.run(0,2).then(r=>({configuration:r.configuration,diagnostics:r.diagnostics}))',
    )
    assert(
      r.configuration.waterPolicy === 'off' && r.diagnostics.waterCalls.every(n => n === 3),
      'Benchmark reproducibility guard failed',
    )
    results.contexts.push({ query: 'bench=water-scale&water-policy=pause&' + query, ...r })
  }
  const visible = []
  for (const policy of ['off', 'pause']) {
    await browser.navigate(
      `http://localhost:1440/?bench=water-scale&waters=4&water-layout=visible&queue=2&water-policy=${policy}`,
    )
    const metadata = await browser.evaluate('benchmark.run(600,600).then(({samples,...m})=>m)')
    const snapshot = await browser.evaluate('benchmark.snapshot()')
    const shot = await browser.send('Page.captureScreenshot', { format: 'png' })
    await writeFile(`${output}/visible-4-${policy}.png`, Buffer.from(shot.data, 'base64'))
    assert(
      metadata.diagnostics.waterCalls.every(n => n === 1201),
      'Visible water was skipped',
    )
    visible.push({ metadata, snapshot })
    await browser.check()
  }
  let visibleMaximum = 0,
    visibleValues = 0
  for (let w = 0; w < 4; w++)
    for (const k of ['position', 'normal', 'depth', 'flowX', 'flowZ', 'foam']) {
      const a = visible[0].snapshot.waters[w][k],
        b = visible[1].snapshot.waters[w][k]
      assert(a.length === b.length, 'Visible array length changed')
      for (let i = 0; i < a.length; i++) {
        visibleMaximum = Math.max(visibleMaximum, Math.abs(a[i] - b[i]))
        visibleValues++
      }
    }
  const visibleImage = spawnSync(
    'magick',
    [
      'compare',
      '-metric',
      'RMSE',
      `${output}/visible-4-off.png`,
      `${output}/visible-4-pause.png`,
      'null:',
    ],
    { encoding: 'utf8' },
  )
  const visibleRmse = Number(/\(([\d.e-]+)\)/.exec(visibleImage.stderr)?.[1])
  assert(visibleMaximum === 0 && visibleRmse === 0, 'Visible multi-water parity failed')
  results.visibleWaters = {
    waters: 4,
    steps: 1200,
    dt: 1 / 60,
    values: visibleValues,
    maximumAbsoluteDifference: visibleMaximum,
    imageRmse: visibleRmse,
    metadata: visible.map(v => ({
      configuration: v.metadata.configuration,
      diagnostics: v.metadata.diagnostics,
      fingerprint: v.metadata.fingerprint,
    })),
  }
  await persist()
  console.log('All-visible numeric/image parity', results.visibleWaters)
  const trajectories = []
  for (const policy of ['pause', 'pause', 'off']) {
    await browser.navigate(
      `http://localhost:1440/?bench=water-scale&waters=2&water-policy=${policy}`,
    )
    const r = await browser.evaluate(`(()=>{
   // Same initial state, dt, external inputs and camera path on both repetitions.
   for(let i=0;i<180;i++){
    area.hero.x=i<60?0:i<120?64:0;
    engine.frame(area.hero,17,Math.PI/7,Math.atan2(18,15));
    area.update(engine.time+1/60,1/60);engine.render(1/60)
   }
   return {snapshot:benchmark.snapshot(),fingerprint:benchmark.fingerprint()}
  })()`)
    await browser.check()
    trajectories.push(r)
    const shot = await browser.send('Page.captureScreenshot', { format: 'png' })
    await writeFile(
      `${output}/camera-path-${policy}-${trajectories.length}.png`,
      Buffer.from(shot.data, 'base64'),
    )
  }
  let values = 0,
    repeatMaximum = 0,
    pauseVsFullMaximum = 0
  for (let w = 0; w < 2; w++)
    for (const k of ['position', 'normal', 'depth', 'flowX', 'flowZ', 'foam']) {
      const a = trajectories[0].snapshot.waters[w][k],
        b = trajectories[1].snapshot.waters[w][k],
        c = trajectories[2].snapshot.waters[w][k]
      for (let i = 0; i < a.length; i++) {
        repeatMaximum = Math.max(repeatMaximum, Math.abs(a[i] - b[i]))
        pauseVsFullMaximum = Math.max(pauseVsFullMaximum, Math.abs(a[i] - c[i]))
        values++
      }
    }
  assert(
    repeatMaximum === 0 && pauseVsFullMaximum > 0,
    'Camera-path determinism/intentional behavior not demonstrated',
  )
  results.cameraPath = {
    dt: 1 / 60,
    steps: 180,
    camera: 'water 0 for 60 steps; water 1 for 60; water 0 for 60',
    values,
    repeatMaximum,
    pauseVsFullMaximum,
    states: trajectories.map(t => ({
      fingerprint: t.fingerprint,
      diagnostics: t.snapshot.diagnostics,
    })),
    behavior:
      'Same initial state, seed, fixed steps, external inputs and camera path repeat exactly. Hidden waters skip integration/preparation; return advances only current dt, without catch-up.',
  }
  await persist()
  console.log('Policy verification complete', results.cameraPath)
} finally {
  await browser.close()
}
