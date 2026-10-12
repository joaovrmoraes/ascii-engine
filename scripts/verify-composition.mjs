/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-composition-verification'
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

  const mouse=(type,x,y,button='none',buttons=0)=>send('Input.dispatchMouseEvent',{type,x,y,button,buttons,clickCount:type==='mousePressed'||type==='mouseReleased'?1:0})
  await action(`ui('[data-mode="orbit"]')`)
  const viewport=await evaluate(`(()=>{const r=document.querySelector('#app > canvas').getBoundingClientRect();return{x:r.x+r.width*.5,y:r.y+r.height*.5}})()`)
  await evaluate('window.beforeOrbit=engine.camera.position.toArray();window.originalDoc=JSON.stringify(area.document())')
  await mouse('mouseMoved',viewport.x,viewport.y);await sleep(100)
  await mouse('mousePressed',viewport.x,viewport.y,'left',1)
  for(let i=1;i<=5;i++){await mouse('mouseMoved',viewport.x+85*i/5,viewport.y-65*i/5,'left',1);await sleep(30)}
  await mouse('mouseReleased',viewport.x+85,viewport.y-65,'left');await sleep(200)
  await check('orbit button rotates both azimuth and elevation without modifying the scene',`Math.abs(engine.camera.position.y-beforeOrbit[1])>1 && Math.abs(engine.camera.position.x-beforeOrbit[0])>1 && JSON.stringify(area.document())===originalDoc`)
  await action(`ui('[data-k="reset-view"]');ui('[data-mode="translate"]')`)
  await evaluate('window.originalObjects=JSON.stringify(area.document().objects); window.originalResources=JSON.stringify(engine.resources)')
  await action(`ui('[data-k="create-camera"]')`)
  await evaluate('window.cameraId=area.document().activeCamera')
  await check('create camera captures the current view and adds a hierarchy object', `!!cameraId && !!document.querySelector('[data-camera-id="'+cameraId+'"]') && area.document().cameras[cameraId].projection==='orthographic'`)
  await action(`ui('[data-camera-field="Nome da câmera"]','Plano da fogueira'); ui('[data-field="Posição x"]','8'); ui('[data-camera-field="Altura enquadrada (m)"]','16'); ui('[data-camera-field="Formato"]',String(16/9))`)
  await check('camera inspector saves pose, name, span and aspect', `area.document().cameras[cameraId].position[0]===8 && area.document().cameras[cameraId].span===8 && area.document().cameras[cameraId].aspect===16/9`)
  await check('selecting a camera opens its live corner preview',`!document.querySelector('#camera-preview').hidden && document.querySelector('#camera-preview canvas').dataset.previewCamera===cameraId`)
  await evaluate('window.miniBefore=document.querySelector("#camera-preview canvas").toDataURL()')
  await action(`ui('[data-field="Posição x"]','9')`);await sleep(150)
  await check('camera edits update the mini view',`document.querySelector('#camera-preview canvas').toDataURL()!==miniBefore`)
  await action(`ui('[data-field="Posição x"]','8');ui('[data-k="preview"]')`)
  await check('play preview uses the active saved camera and hides helpers',`document.body.classList.contains('previewing') && engine.camera.position.x===8 && document.querySelector('#camera-preview').hidden && document.querySelector('#app > canvas').dataset.cameraView==='Plano da fogueira'`)
  await action(`ui('[data-k="preview"]')`)
  await check('returning from play restores editor navigation',`!document.querySelector('#app > canvas').dataset.cameraView && !area.cameraView()`)
  await action(`ui('[data-camera-action="view"]')`)
  await until('document.querySelector("#app > canvas").dataset.cameraView === "Plano da fogueira"')
  await check('viewing a camera preserves its exact pose and aspect ratio', `engine.camera.position.x===8 && Math.abs(document.querySelector('#app > canvas').clientWidth/document.querySelector('#app > canvas').clientHeight-16/9)<.003 && !document.querySelector('#camera-view-bar').hidden`)
  await shot('camera-enquadramento')
  await action(`ui('[data-camera-action="view"]'); ui('[data-k="frame"]')`)
  await sleep(1500)
  await evaluate(`window.cameraPose=area.document().cameras[cameraId].position.slice(); window.editorCamera=engine.camera.position.toArray(); window.projectCameraAxis=(offset)=>{const point=engine.camera.position.clone().set(...area.document().cameras[cameraId].position);point.x+=offset;point.project(engine.camera);const r=document.querySelector('#app > canvas').getBoundingClientRect();return {x:r.x+(point.x+1)/2*r.width,y:r.y+(1-point.y)/2*r.height}}`)
  let handle
  for(let offset=.15;offset<4;offset+=.15){const p=await evaluate(`projectCameraAxis(${offset})`);await mouse('mouseMoved',p.x,p.y);await sleep(35);if(await evaluate(`document.querySelector('#app > canvas').dataset.transformAxis==='X'`)){handle=p;break}}
  if(!handle)throw new Error('No camera X gizmo found')
  const delta=await evaluate(`(()=>{const a=projectCameraAxis(0),b=projectCameraAxis(1);return {x:b.x-a.x,y:b.y-a.y}})()`)
  await mouse('mousePressed',handle.x,handle.y,'left',1)
  for(let i=1;i<=6;i++){await mouse('mouseMoved',handle.x+delta.x*i/6,handle.y+delta.y*i/6,'left',1);await sleep(30)}
  await mouse('mouseReleased',handle.x+delta.x,handle.y+delta.y,'left');await sleep(200)
  await check('native gizmo moves the saved camera while the editor camera stays still', `area.document().cameras[cameraId].position[0]>cameraPose[0]+.5 && engine.camera.position.toArray().every((n,i)=>Math.abs(n-editorCamera[i])<.001)`)
  await shot('camera-na-cena')
  await check('gizmo movement updates the saved preview pose',`JSON.parse(document.querySelector('#camera-preview canvas').dataset.pose).position[0]>cameraPose[0]+.5`)
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('camera gizmo is one undo action', `JSON.stringify(area.document().cameras[cameraId].position)===JSON.stringify(cameraPose)`)
  await action(`ui('#authoring-toolbar [data-k="redo"]')`)
  await action(`ui('[data-camera-id="'+cameraId+'"]'); ui('[data-field="Rotação y"]','25')`)
  await check('camera rotation is portable in radians', `Math.abs(area.document().cameras[cameraId].rotation[1]-25*Math.PI/180)<.001`)
  await action(`ui('[data-camera-action="duplicate"]')`)
  await check('camera duplicates independently', `Object.keys(area.document().cameras).length===2 && area.document().activeCamera===cameraId`)
  await action(`Array.from(document.querySelectorAll('#object-inspector button')).find(b=>b.textContent.startsWith('Excluir')).click()`)
  await check('camera removal leaves the active composition intact', `Object.keys(area.document().cameras).length===1 && area.document().activeCamera===cameraId`)
  await check('camera authoring does not add world geometry or engine resources', `JSON.stringify(area.document().objects)===originalObjects && JSON.stringify(engine.resources)===originalResources`)
  await action('area.authoring.view([0,1.6,0])')
  await evaluate('window.beforeStudio=JSON.stringify(area.document())')
  await action(`ui('[data-k="create-effect"]'); ui('[data-effect-template="fire"]'); ui('[data-effect-offset="0"]','1'); ui('[data-effect-offset="1"]','.5'); ui('[data-effect-offset="2"]','-.5')`)
  await check('effect layers expose named origins and show their transform gizmo', `document.querySelector('.fx-emitter-list .active').textContent==='Chama' && JSON.parse(document.querySelector('#effect-preview canvas').dataset.offset)[0]===1`)
  await action(`ui('[data-fx="undo"]')`)
  await check('local undo restores effect origin without undoing the scene', `JSON.parse(document.querySelector('[data-fx="json"]').value).emitters[0].offset[2]===0 && JSON.stringify(area.document())===beforeStudio`)
  await action(`ui('[data-fx="redo"]')`)
  await evaluate(`window.beforeLayer=JSON.parse(document.querySelector('[data-fx="json"]').value).emitters[0].offset.slice()`)
  const axis=await evaluate(`(()=>{const c=document.querySelector('#effect-preview canvas'),r=c.getBoundingClientRect(),p=JSON.parse(c.dataset.gizmoX);return {a:{x:r.x+p[0][0],y:r.y+p[0][1]},b:{x:r.x+p[1][0],y:r.y+p[1][1]}}})()`)
  let effectHandle
  for(let t=.3;t<1.3;t+=.08){const p={x:axis.a.x+(axis.b.x-axis.a.x)*t,y:axis.a.y+(axis.b.y-axis.a.y)*t};await mouse('mouseMoved',p.x,p.y);await sleep(35);if(await evaluate(`document.querySelector('#effect-preview canvas').dataset.transformAxis==='X'`)){effectHandle=p;break}}
  if(!effectHandle)throw new Error('No effect X gizmo found')
  const dx=axis.b.x-axis.a.x,dy=axis.b.y-axis.a.y
  await mouse('mousePressed',effectHandle.x,effectHandle.y,'left',1)
  for(let i=1;i<=6;i++){await mouse('mouseMoved',effectHandle.x+dx*i/6,effectHandle.y+dy*i/6,'left',1);await sleep(25)}
  await mouse('mouseReleased',effectHandle.x+dx,effectHandle.y+dy,'left');await sleep(200)
  await check('native gizmo moves only the selected effect layer', `JSON.parse(document.querySelector('[data-fx="json"]').value).emitters[0].offset[0]>beforeLayer[0]+.1 && JSON.stringify(area.document())===beforeStudio`)
  await action(`ui('[data-fx="undo"]')`)
  await check('a full layer drag is one local undo action', `JSON.stringify(JSON.parse(document.querySelector('[data-fx="json"]').value).emitters[0].offset)===JSON.stringify(beforeLayer)`)
  await action(`ui('[data-fx="redo"]'); ui('[data-fx="name"]','Fogo composto'); window.dispatchEvent(new KeyboardEvent('keydown',{key:'s',ctrlKey:true,bubbles:true,cancelable:true}))`)
  await check('saved effect includes layer names and positioned heat grid', `Object.values(area.document().effects)[0].emitters[0].name==='Chama' && Object.values(area.document().effects)[0].emitters[0].offset[0]>1`)
  await shot('efeito-origem-gizmo')
  await action(`ui('[data-fx="place"]')`)
  await check('placing a composed effect gives the whole object a scene gizmo', `document.querySelector('#app > canvas').dataset.transformMode==='translate'`)
  await action(`(()=>{const c=document.querySelector('#app > canvas'),r=c.getBoundingClientRect();for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new PointerEvent(type,{bubbles:true,button:0,clientX:r.x+r.width*.5,clientY:r.y+r.height*.6}))})()`)
  await check('the composed effect is placed with its saved recipe', `area.document().objects.some(o=>o.prefab.startsWith('fx:custom-'))`)
  const saved=await evaluate('JSON.stringify(area.document())')
  await writeFile(join(output,'composicao.pomorog.json'),saved)
  await send('Page.reload');await until('!!window.area && !!document.querySelector("canvas[data-ready]")');await sleep(300)
  await check('scene reload keeps composition cameras and positioned effect assets', `JSON.stringify(area.document())===${JSON.stringify(saved)}`)
  // The exported-player path must honour the same saved camera.
  await send('Page.navigate',{url:'http://localhost:1440/?area=sandbox&player=1'});await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await action(`await area.openDocument(${saved})`)
  await until('document.querySelector("#app > canvas").dataset.cameraView === "Plano da fogueira"')
  await check('player honours initial composition camera without editor UI', `!document.querySelector('#editor-workspace') && Math.abs(engine.camera.rotation.y-${JSON.parse(saved).cameras[JSON.parse(saved).activeCamera].rotation[1]})<.001`)
  await shot('camera-player')
  await send('Page.addScriptToEvaluateOnNewDocument',{source:'window.requestAnimationFrame=()=>0'})
  await send('Page.navigate',{url:'http://localhost:1440/?area=sandbox'})
  await sleep(1200);await until('!!window.engine && engine.time>.1 && !!document.querySelector("canvas[data-ready]")')
  await check('visible embedded pages animate even when requestAnimationFrame is suspended',`engine.time>.1 && document.visibilityState==='visible'`)
  await evaluate('window.fallbackBefore=engine.camera.position.y;view.elevation=.2');await sleep(150)
  await check('fallback renderer also updates camera navigation',`Math.abs(engine.camera.position.y-fallbackBefore)>1`)
  if(errors.length)throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close(); chrome.kill()
  await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once('exit', resolve) })
  await rm(profile, { recursive: true, force: true, maxRetries: 3 })
}
