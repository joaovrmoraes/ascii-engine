/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-authoring-verification'
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
  const until = async expression => { for (let i = 0; i < 150; i++) { try { if (await evaluate(expression)) return } catch(error) { if(!/Inspected target navigated|Execution context was destroyed|Cannot find context/.test(error.message)) throw error }; await sleep(100) }; throw new Error(`Timed out: ${expression}`) }
  const action = async expression => { await evaluate(`(async () => { ${expression} })()`); await until('window.area && !area.state.includes("opening")'); await sleep(200) }
  const check = async (title, expression) => { if (!await evaluate(expression)) throw new Error(`FAIL: ${title}`); console.log(`PASS ${title}`) }
  const shot = async name => { await sleep(500); const result = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64')) }
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('change')); } }`)
  const mouse = (type,x,y,button='none',buttons=0,modifiers=0) => send('Input.dispatchMouseEvent',{type,x,y,button,buttons,modifiers,clickCount:type==='mousePressed'||type==='mouseReleased'?1:0})
  const key = key => send('Input.dispatchKeyEvent',{type:'keyDown',key})
  await evaluate(`window.project=(x,y,z)=>{const p=engine.camera.position.clone().set(x,y,z).project(engine.camera),r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2}}; window.ghost=()=>engine.scene.children.find(o=>o.userData.editorPreview)`)
  await action(`window.original=JSON.stringify(area.document()); ui('[data-prefab="pedregulho"]')`)
  await check('asset selection previews the actual 3D object without changing the document', `!!ghost() && ghost().children.some(o=>o.isMesh) && JSON.stringify(area.document())===original`)
  await action(`ui('[data-mode="scale"]')`)
  await shot('previa-com-gizmo')
  let handle
  for(let offset=.12;offset<4;offset+=.08){const p=await evaluate(`project(ghost().position.x+${offset},ghost().position.y,ghost().position.z)`);await mouse('mouseMoved',p.x,p.y);await sleep(25);if(await evaluate(`document.querySelector('canvas').dataset.transformAxis==='X'`)){handle=p;break}}
  if(!handle) throw new Error('No preview gizmo X axis')
  await mouse('mousePressed',handle.x,handle.y,'left',1)
  for(let i=1;i<=6;i++){await mouse('mouseMoved',handle.x+i*8,handle.y,'left',1);await sleep(30)}
  await mouse('mouseReleased',handle.x+48,handle.y,'left');await sleep(200)
  await check('preview gizmo changes scale without placing or saving an object', `ghost().scale.x!==1 && JSON.stringify(area.document())===original`)
  await evaluate('window.previewSeed=ghost().userData; window.previewScale=ghost().scale.toArray(); window.previewPosition=ghost().position.toArray()')
  await key('Enter');await sleep(300)
  await check('Enter places the transformed preview and releases the ghost', `!ghost() && area.document().objects.length===4 && JSON.stringify(area.document().objects.at(-1).scale3)===JSON.stringify(previewScale) && JSON.stringify(area.document().objects.at(-1).position)===JSON.stringify(previewPosition)`)
  await action(`ui('[data-prefab="arvore"]')`);await key('Escape');await sleep(200)
  await check('Escape cancels preview with no remaining object', '!ghost() && area.document().objects.length===4')

  await action(`const terrain=core.createTerrainData(32,129);terrain.heights=terrain.heights.map((_,i)=>3*Math.exp(-(((i%129)/128*32-16+1)**2+(Math.floor(i/129)/128*32-16+2)**2)/12));window.hillDoc={version:1,terrain,carpet:{count:40000,seed:48},objects:[{prefab:'arvore',position:[-4,.8,-2]},{prefab:'fogueira',position:[3,.3,-2]}]}; await area.openDocument(hillDoc); view.zoom=.65; window.beforeWater=JSON.stringify(area.document()); ui('[data-tab="terrain"]'); ui('[data-brush="water"]'); ui('[data-k="water-mode"]','terrain')`)
  await sleep(1000)
  const points=await evaluate(`Array.from({length:7},(_,i)=>{const x=-4+i*1.3,z=.5;return project(x,3*Math.exp(-((x+1)**2+(z+2)**2)/12),z)})`)
  await mouse('mouseMoved',points[0].x,points[0].y)
  await mouse('mousePressed',points[0].x,points[0].y,'left',1)
  for(const p of points.slice(1)){await mouse('mouseMoved',p.x,p.y,'left',1);await sleep(50)}
  await mouse('mouseReleased',points.at(-1).x,points.at(-1).y,'left');await sleep(300)
  await check('one drag draws continuous water without flattening the mountain', `area.document().waters.length===1 && area.document().waters[0].shape.kind==='paint' && !!area.document().waters[0].shape.mask.heights && JSON.stringify(area.document().terrain)===JSON.stringify(JSON.parse(beforeWater).terrain) && [-3,-2,0,2,3].every(x=>core.waterEdge(area.document().waters[0].shape,x,.5)>0)`)
  await check('wet hillside mesh follows terrain and has downhill flow normals', `(()=>{const w=engine.waters[0],pos=w.mesh.geometry.attributes.position,n=w.mesh.geometry.attributes.normal;return pos.getY(64*129+64)>.5 && Array.from({length:n.count},(_,i)=>Math.hypot(n.getX(i),n.getZ(i))).some(s=>s>.1)})()`)
  await shot('agua-na-encosta')
  await evaluate('window.waterDocument=area.document()')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('undo removes the whole water stroke', 'JSON.stringify(area.document())===beforeWater')
  await action(`ui('#authoring-toolbar [data-k="redo"]')`)
  await check('redo restores water mask and slope', 'JSON.stringify(area.document())===JSON.stringify(waterDocument)')
  await evaluate('window.__beforeReload=true');await send('Page.reload');await until('!window.__beforeReload && !!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(`window.ui = (selector,value) => { const el=document.querySelector(selector); if(value===undefined) el.click(); else {el.value=value;el.dispatchEvent(new Event('change'))} }`)
  await check('painted water persists through browser reload', '!!area.document().waters[0].shape.mask.heights')

  await action(`ui('[data-project-tab="studio"]'); ui('[data-studio-tab="atmosphere"]'); ui('[data-studio="preset"]','dusk')`)
  await shot('studio-atmosfera')
  await check('studio opens a dedicated screen with a return to scene', `document.body.classList.contains('studio-mode') && !document.querySelector('#studio-toolbar').hidden && document.querySelector('canvas').getBoundingClientRect().height>600`)
  await check('studio contains effects and atmosphere; preset changes the scene lights', `!document.querySelector('#studio-workspace').hidden && !document.querySelector('#atmosphere-studio').hidden && document.querySelector('#effect-editor').hidden && engine.style.moon.color===0xffbd83 && engine.lights.moon.intensity===1.65`)
  await action(`ui('[data-studio-field="Main intensity"]','3'); ui('[data-studio-field="Main color"]','#66aaff');ui('[data-studio-field="Glyph color"]','#aaccff')`)
  await check('studio color and intensity changes persist in the portable document', `area.document().style.moon.intensity===3 && area.document().style.moon.color===0x66aaff && area.document().style.inkTint[0]===170/255`)
  await action(`ui('[data-studio-tab="effects"]'); ui('[data-fx="new"]'); ui('[data-effect-field="Emit light"]')`)
  // Checkbox click dispatches the real change event through its handler.
  await check('effect studio exposes color, intensity and reach', `!!document.querySelector('[data-effect-field="Light color"]') && !!document.querySelector('[data-effect-field="Range (m)"]')`)
  await action(`ui('[data-effect-field="Intensity"]','20');ui('[data-effect-field="Light color"]','#3388ff'); ui('[data-fx="save"]')`)
  await until('Object.keys(area.document().effects??{}).length===1')
  await check('effect recipe saves its light settings', `Object.values(area.document().effects)[0].light.intensity===20 && Object.values(area.document().effects)[0].light.color===0x3388ff`)
  await shot('studio-efeitos-luz')

  // Read actual GPU light uniforms with the camera fixed, then compare frames.
  await action(`await area.openDocument({version:1,terrain:core.createTerrainData(24,97),carpet:{count:45000,seed:1},objects:[{prefab:'fogueira',position:[0,0,0]},{prefab:'pedregulho',position:[2,0,0]}]});ui('[data-project-tab="assets"]');view.zoom=.9;view.paused=false`)
  await sleep(700);await evaluate('view.paused=true;window.fireLight=engine.scene.children.find(o=>o.userData.prefab==="fogueira").children.find(o=>o.isPointLight);void 0')
  await shot('fogueira-luz-on')
  await check('campfire light reaches the carpet and body letter uniforms', `(()=>{let body;engine.scene.traverse(o=>{if(o.isPoints&&o.material.uniforms.inkLightCount)body=o});return engine.carpetScene.children[0].material.uniforms.inkLightCount.value===1 && body.material.uniforms.inkLightCount.value===1})()`)
  await evaluate('fireLight.intensity=0');await sleep(200);await shot('fogueira-luz-off')

  await action(`const terrain=core.createTerrainData(32,129);terrain.heights.fill(-.8);await area.openDocument({version:1,terrain,objects:[{prefab:'arvore',position:[-2,0,-2]},{prefab:'caixa',position:[1,0,-1],scale:3}],waters:[{shape:{kind:'pond',x:0,z:1,angle:0,size:5},level:0},{shape:{kind:'pond',x:-5,z:1,angle:0,size:2},level:0}]});view.zoom=.75;area.pan(0,2)`)
  await sleep(600);await shot('reflexo-on')
  await check('visible coplanar waters both receive the same current reflection', 'engine.waters.every(w=>w.uniforms.reflectionOn.value===1) && engine.waters[0].uniforms.reflection.value===engine.waters[1].uniforms.reflection.value')
  await evaluate('engine.waters.forEach(w=>w.look.reflection.enabled=false)');await sleep(300);await shot('reflexo-off')
  for(const prefix of ['reflexo','fogueira-luz']) {
    const comparison=spawnSync('magick',['compare','-metric','AE',join(output,prefix+'-on.png'),join(output,prefix+'-off.png'),'null:'],{encoding:'utf8'}), changed=parseFloat(comparison.stderr)
    if(!(changed>300)) throw new Error(`${prefix}: insufficient rendered change (${comparison.stderr})`)
    console.log(`PASS ${prefix}: ${Math.round(changed)} pixels respond in the rendered frame`)
  }
  if(errors.length)throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close(); chrome.kill()
  await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once('exit', resolve) })
  await rm(profile, { recursive: true, force: true, maxRetries: 3 })
}
