import { readFile, writeFile } from 'node:fs/promises'
import { benchmarkBrowser } from './bench-browser.mjs'
const root = 'docs/captures/benchmarks-2026-10-15/capacity',
  manifest = JSON.parse(await readFile(root + '/manifest.json', 'utf8')),
  results = []
const browser = await benchmarkBrowser({ uncapped: true, disableExtensions: true })
try {
  for (const point of manifest.axes.particles.points) {
    await browser.navigate(
      `http://localhost:1440/?bench=particles&effect-groups=${point.load}&queue=2`,
    )
    const r = await browser.evaluate(`(async()=>{
   let maximumLive=engine.fx.stats.letters,cappedFrames=engine.fx.stats.letters>=engine.fx.stats.budget?1:0,maximumDrawn=0,drawBufferCappedFrames=0;
   const fx=engine.fx,update=fx.update;
   fx.update=(...args)=>{update(...args);const s=fx.stats;maximumLive=Math.max(maximumLive,s.letters);if(s.letters>=s.budget)cappedFrames++};
   const render=engine.render;
   const observeDraw=()=>{let n=0;engine.particleScene.traverse(o=>{if(o.isPoints&&o.geometry.attributes.shape){n+=o.geometry.drawRange.count;if(o.geometry.drawRange.count>=o.geometry.attributes.position.count)drawBufferCappedFrames++}});maximumDrawn=Math.max(maximumDrawn,n)};
   observeDraw();engine.render=(...args)=>{render(...args);observeDraw()};
   const r=await benchmark.run(600,600);
   return {maximumLive,cappedFrames,maximumDrawn,drawBufferCappedFrames,budget:fx.stats.budget,fingerprint:r.fingerprint,effectStats:r.effectStats}
  })()`)
    await browser.check()
    if (r.fingerprint.hash !== point.hash) throw new Error('Effect audit state changed')
    results.push({ load: point.load, effects: point.load * 3, ...r })
    console.log(
      'Effect audit',
      point.load,
      r.maximumLive,
      r.maximumDrawn,
      r.cappedFrames,
      r.drawBufferCappedFrames,
    )
    await writeFile(
      root + '/validation/effect-budget-audit.json',
      JSON.stringify(
        {
          protocol:
            'Untimed instrumentation audit over the same 600 warm-up + 600 measured steps; no accepted timing is replaced',
          results,
        },
        null,
        2,
      ) + '\n',
    )
  }
} finally {
  await browser.close()
}
