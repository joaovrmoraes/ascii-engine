import { writeFile } from 'node:fs/promises'
import { benchmarkBrowser } from './bench-browser.mjs'
const b = await benchmarkBrowser({ uncapped: true })
try {
  await b.navigate('http://localhost:1440/?bench=water-scale&waters=2&water-policy=pause&queue=2')
  const initial = await b.evaluate('benchmark.snapshot()')
  await b.evaluate('benchmark.run(30,90)')
  const frozen = await b.evaluate('benchmark.snapshot()')
  let maxFrozen = 0
  for (const k of ['position', 'normal', 'depth', 'flowX', 'flowZ', 'foam'])
    for (let i = 0; i < initial.waters[1][k].length; i++)
      maxFrozen = Math.max(maxFrozen, Math.abs(initial.waters[1][k][i] - frozen.waters[1][k][i]))
  const resume = await b.evaluate(`(async()=>{
 const {createWater}=await import('/@fs/home/joao/orca/workspaces/ascii-engine/threadfin/packages/engine/src/techniques/water.ts')
 const hidden=engine.waters[1]
 const reference=createWater(structuredClone(hidden.shape),{physics:{...hidden.physics},look:hidden.look})
 const dt=1/60,time=engine.time+dt
 reference.updateDynamics(dt,time)
 area.hero.x=64
 engine.frame(area.hero,17,Math.PI/7,Math.atan2(18,15));engine.render(dt)
 let maximum=0,values=0
 for(const k of ['depth','flowX','flowZ','foam'])for(let i=0;i<reference.dynamics[k].length;i++){maximum=Math.max(maximum,Math.abs(reference.dynamics[k][i]-hidden.dynamics[k][i]));values++}
 for(const k of ['position','normal'])for(let i=0;i<reference.mesh.geometry.attributes[k].array.length;i++){maximum=Math.max(maximum,Math.abs(reference.mesh.geometry.attributes[k].array[i]-hidden.mesh.geometry.attributes[k].array[i]));values++}
 const before=Array.from(hidden.dynamics.flowX)
 hidden.disturb(64,0,.18,.6)
 const externalDisturbChangesState=before.some((v,i)=>v!==hidden.dynamics.flowX[i])
 reference.dispose()
 return {maximum,values,time:engine.time,diagnostics:benchmark.snapshot().diagnostics,externalDisturbChangesState}
 })()`)
  await b.check()
  if (
    maxFrozen !== 0 ||
    resume.maximum > 1e-5 ||
    !resume.externalDisturbChangesState ||
    frozen.diagnostics.waterCalls[1] !== 0 ||
    resume.diagnostics.waterCalls[1] !== 1
  )
    throw new Error('Pause/resume policy failed: ' + JSON.stringify({ maxFrozen, resume }))
  const result = {
    dt: 1 / 60,
    stepsPaused: 120,
    maxFrozen,
    frozenCalls: frozen.diagnostics.waterCalls,
    resume,
    behavior:
      'Only engine-scheduled integration/upload/actor contacts pause; shader clock and explicit external calls continue',
    storageCalls: 0,
  }
  await writeFile(
    'docs/captures/benchmarks-2026-10-15/phase-2/parity/water-resume.json',
    JSON.stringify(result, null, 2) + '\n',
  )
  console.log(result)
} finally {
  await b.close()
}
