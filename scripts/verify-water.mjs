/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-water-verification'
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-authoring-'))
const port = 9800 + Math.floor(Math.random() * 100)
const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,1000', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let targets
  for (let i = 0; i < 100 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(100) } }
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => { socket.onopen = resolve })
  let id = 0
  const pending = new Map(), errors = []; let interceptedDrag
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Input.dragIntercepted') interceptedDrag = data.params.data
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text + ': ' + data.params.exceptionDetails.exception?.description)
    const request = pending.get(data.id)
    if (request) { clearTimeout(request.timer); pending.delete(data.id); data.error ? request.reject(new Error(data.error.message)) : request.resolve(data.result) }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id, timer = setTimeout(() => { pending.delete(key); reject(new Error(`Timeout: ${method}`)) }, 45000)
    pending.set(key, { resolve, reject, timer }); socket.send(JSON.stringify({ id: key, method, params }))
  })
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text)
    return response.result?.value
  }
  const until = async expression => { for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await sleep(100) }; throw new Error(`Timed out: ${expression}`) }
  const action = async expression => { await evaluate(`(async () => { ${expression} })()`); await until('window.area && !area.state.includes("abrindo")'); await sleep(200) }
  const check = async (title, expression) => { if (!await evaluate(expression)) throw new Error(`FAIL: ${title}`); console.log(`PASS ${title}`) }
  const shot = async name => { await sleep(500); const result = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64')) }
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('change')); } }`)

  const capture=async name=>{const data=await evaluate(`(()=>{engine.render(0,{redraw:true});return engine.renderer.domElement.toDataURL().split(',')[1]})()`);await writeFile(join(output,name+'.png'),Buffer.from(data,'base64'))}
  const changedPixels=(a,b)=>{const pixels=name=>{const r=spawnSync('magick',[join(output,name+'.png'),'-depth','8','rgb:-'],{maxBuffer:20000000});if(r.status!==0)throw new Error(String(r.stderr));return r.stdout};const x=pixels(a),y=pixels(b);if(x.length!==y.length)throw new Error('Image size changed');let changed=0;for(let i=0;i<x.length;i+=3)if(Math.max(Math.abs(x[i]-y[i]),Math.abs(x[i+1]-y[i+1]),Math.abs(x[i+2]-y[i+2]))>8)changed++;return changed}
  const difference=(a,b,min)=>{const pixels=changedPixels(a,b);if(!(pixels>min))throw new Error(`${a}: only ${pixels} changed pixels`);console.log(`PASS ${a}: ${pixels} pixels changed by more than 8/255`)}
  await action(`const terrain=core.createTerrainData(20,81),shape=core.createWaterPaint(20,81);core.paintWater(shape,{x:0,z:0},{x:0,z:0},4);shape.mask.heights=terrain.heights.map(h=>h+.045);await area.openDocument({version:1,terrain,objects:[{id:'cylinder',prefab:'cilindro',position:[0,0,-4.2]}],waters:[{shape,level:0,physics:{source:0,waves:0}}]});area.authoring.view([0,.5,-1]);view.zoom=1;view.angle=-Math.PI/7;view.elevation=.35;view.paused=true`)
  await capture('cilindro-reflexo-lateral')
  await evaluate('engine.waters[0].look.reflection.enabled=false');await capture('cilindro-sem-reflexo')
  difference('cilindro-reflexo-lateral','cilindro-sem-reflexo',200)
  await evaluate('engine.waters[0].look.reflection.enabled=true;view.angle=Math.PI-Math.PI/7');await sleep(200);await capture('cilindro-vista-oposta')
  await evaluate('engine.waters[0].look.reflection.enabled=false');await capture('cilindro-vista-oposta-sem-reflexo')
  if(changedPixels('cilindro-vista-oposta','cilindro-vista-oposta-sem-reflexo')>100)throw new Error('Reflection should fall outside the lake from the opposite bank')
  console.log('PASS reflected cylinder changes with view direction and disappears outside the wet footprint')
  await action(`const doc=area.document();doc.objects=[];await area.openDocument(doc);view.angle=-Math.PI/7;view.elevation=Math.atan2(6,12);engine.setStyle({moon:{...engine.style.moon,position:[0,6,-12]}})`)
  await capture('luar-alinhado')
  await evaluate('engine.setStyle({moon:{...engine.style.moon,position:[12,6,0]}})');await capture('luar-rotacionado')
  difference('luar-alinhado','luar-rotacionado',300)
  await action(`const doc=area.document();doc.objects=[{id:'walker',prefab:'cilindro',position:[0,0,0]}];await area.openDocument(doc);view.angle=-Math.PI/7;view.elevation=.8;engine.setStyle({moon:{...engine.style.moon,position:[12,6,0]}});area.update(engine.time,0)`)
  await capture('agua-antes-impacto')
  await evaluate(`window.beforeImpact=JSON.stringify(area.document());const o=engine.scene.children.find(o=>o.userData.sceneId==='walker');for(let i=0;i<20;i++){o.position.x+=.045;area.update(engine.time,0);engine.waters[0].updateDynamics(1/60,engine.time)}o.position.x=0;area.update(engine.time,0)`)
  await check('moving an object in shallow water produces physical displacement',`engine.waters[0].dynamics.depth.some((h,i)=>engine.waters[0].dynamics.wet[i]&&Math.abs(h-.08)>.003)`)
  await capture('agua-rastro-do-objeto')
  difference('agua-antes-impacto','agua-rastro-do-objeto',60)
  await check('water simulation never writes transient state into the document',`JSON.stringify(area.document())===beforeImpact`)
  await action(`const terrain=core.createTerrainData(20,81);terrain.heights=terrain.heights.map((_,i)=>4*Math.exp(-(((i%81)/80*20-10+3)**2)/7));const shape=core.createWaterPaint(20,81);core.paintWater(shape,{x:-3,z:0},{x:5,z:0},1.1);shape.mask.heights=terrain.heights.map(h=>h+.045);await area.openDocument({version:1,terrain,carpet:{count:20000,seed:1},objects:[],waters:[{shape,level:0,physics:{source:.04}}]});area.authoring.view([-1,1.5,0]);view.zoom=.8;view.angle=.5;view.elevation=.6;view.paused=true`)
  await capture('encosta-inicio')
  await evaluate(`window.beforeFlow=JSON.stringify(area.document());for(let i=0;i<240;i++)engine.waters[0].updateDynamics(1/60,engine.time+i/60)`)
  await check('gravity drives a downhill current and changes depth on the slope',`engine.waters[0].dynamics.flowX.some(q=>q>.005) && engine.waters[0].dynamics.depth.every(h=>Number.isFinite(h)&&h>=0) && engine.waters[0].dynamics.depth.some(h=>h>.12)`)
  await capture('encosta-escoando')
  await check('flow leaves sculpted terrain and authored water unchanged',`JSON.stringify(area.document())===beforeFlow`)
  await check('wet water vertices remain above the mountain surface',`(()=>{const w=engine.waters[0],p=w.mesh.geometry.attributes.position,d=area.document().terrain;for(let i=0;i<p.count;i++)if(w.dynamics.wet[i] && w.dynamics.depth[i]>.003 && p.getY(i)<d.heights[i]-.002)return false;return true})()`)
  await action(`Array.from(document.querySelectorAll('.hierarchy-object')).find(b=>b.textContent==='Água 1').click();ui('[data-field="Lâmina inicial (m)"]','0.12')`)
  await check('water inspector persists physical settings',`area.document().waters[0].physics.depth===.12`)
  await action(`ui('[data-field="Vazão na nascente (m/s)"]','0')`)
  await check('water source can be closed in the inspector',`area.document().waters[0].physics.source===0`)
  await shot('inspetor-agua')
  await send('Page.navigate',{url:'http://localhost:1440/?area=sunken_cathedral&pause=5'})
  await sleep(1000);await until('!!window.engine && !!document.querySelector("canvas[data-ready]")')
  await check('custom channel outlines retain their CPU simulation footprint',`engine.waters[0].dynamics.wet.some(v=>v===1) && engine.waters[0].heightAt(5.2,0)>.01`)
  await capture('catedral-agua')
  if(errors.length)throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close();chrome.kill();await new Promise(resolve=>chrome.exitCode!==null?resolve():chrome.once('exit',resolve));await rm(profile,{recursive:true,force:true,maxRetries:3})
}
