/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn } from 'node:child_process'
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
  const pending = new Map(), errors = []
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
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
  await check('map starts with stable object identities', 'area.document().objects.every(o => o.id && Number.isInteger(o.seed))')
  await action(`ui('#hierarchy [data-k="objects"] button:nth-child(2)'); ui('[data-field="Posição x"]', '-2.5')`)
  await check('transform edited in inspector is serialized', 'area.document().objects[1].position[0] === -2.5')
  await action(`ui('#selection [data-k="part"]', 'crown'); ui('#selection [data-k="size"]', '.24'); ui('#selection [data-k="apply"]')`)
  await check('part style is serialized', 'area.document().objects[1].options.parts.crown.size === .24')
  await evaluate('window.expected = area.document()')
  await action('await area.openDocument(JSON.parse(JSON.stringify(expected)))')
  await check('document roundtrip keeps geometry seeds, transforms and styles', 'JSON.stringify(area.document()) === JSON.stringify(expected)')
  await action(`ui('#authoring-toolbar [data-k="item"]')`)
  await check('terainless item opens', '!area.document().terrain && area.document().objects.length === 0')
  await action(`ui('#tools [data-k="prefab"]', 'bloco'); ui('#tools [data-k="add"]')`)
  await check('object added to item', 'area.document().objects[0].prefab === "bloco"')
  await action(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true, bubbles: true }))`)
  await check('duplicate has independent identity', 'area.document().objects.length === 2 && area.document().objects[0].id !== area.document().objects[1].id')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('undo duplicate', 'area.document().objects.length === 1')
  await action(`ui('#authoring-toolbar [data-k="redo"]')`)
  await check('redo duplicate', 'area.document().objects.length === 2')
  await action(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }))`)
  await check('keyboard undo', 'area.document().objects.length === 1')
  await evaluate(`window.beforeInvalid = JSON.stringify(area.document()); window.beforeResources = JSON.stringify(engine.resources)`)
  await evaluate(`(async () => { for (const invalid of [{version:99, objects:[]}, {version:1, objects:[{prefab:'missing',position:[0,0,0]}]}, {version:1, objects:[{prefab:'caixa',position:[0,0,0]},{prefab:'caixa',position:[1,0,0],options:{glyph:'water'}}]}, {version:1, objects:[],assets:{broken:{name:'bad.glb',source:'data:model/gltf-binary;base64,YmFk'}}}]) { let failed = false; try { await area.openDocument(invalid) } catch { failed = true }; if (!failed) throw new Error('invalid doc accepted'); if (JSON.stringify(area.document()) !== beforeInvalid) throw new Error('old scene lost after failure'); if (JSON.stringify(engine.resources) !== beforeResources) throw new Error('leaked resources after failure') } })()`)
  console.log('PASS malformed JSON, unknown prefab, build failure and broken model preserve current document/resources')
  // A minimal animated glTF with a companion .bin, then the same asset as GLB.
  await evaluate(`window.makeModel = () => {
    const buffer = new Float32Array([-.5,0,0, .5,0,0, 0,1,0, 0,1, 0,0,0, 0,.5,0]);
    const json = {asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'blade',mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.8,.6,.3,1],metallicFactor:0,roughnessFactor:1},doubleSided:true}],buffers:[{uri:'item.bin',byteLength:buffer.byteLength}],bufferViews:[{buffer:0,byteOffset:0,byteLength:36},{buffer:0,byteOffset:36,byteLength:8},{buffer:0,byteOffset:44,byteLength:24}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-.5,0,0],max:[.5,1,0]},{bufferView:1,componentType:5126,count:2,type:'SCALAR',min:[0],max:[1]},{bufferView:2,componentType:5126,count:2,type:'VEC3'}],animations:[{name:'Flutuar',channels:[{sampler:0,target:{node:0,path:'translation'}}],samplers:[{input:1,output:2}]}]}; return {json,buffer}; }
  `)
  await evaluate(`(async () => { const {json,buffer} = makeModel(); await area.importFiles([new File([JSON.stringify(json)],'item.gltf'), new File([buffer],'item.bin')]); })()`)
  await check('GLTF embeds companion buffer and registers animation', 'Object.values(area.document().assets).some(a=>a.name==="item.gltf") && engine.scene.children.some(o=>o.userData.animationClips?.includes("Flutuar"))')
  await evaluate(`(async () => {
    const {json,buffer} = makeModel(); delete json.buffers[0].uri;
    const text = new TextEncoder().encode(JSON.stringify(json)); const length = Math.ceil(text.length/4)*4, glb = new ArrayBuffer(12+8+length+8+buffer.byteLength), view = new DataView(glb), bytes = new Uint8Array(glb);
    view.setUint32(0,0x46546c67,true); view.setUint32(4,2,true); view.setUint32(8,glb.byteLength,true); view.setUint32(12,length,true); view.setUint32(16,0x4e4f534a,true); bytes.fill(32,20,20+length); bytes.set(text,20); view.setUint32(20+length,buffer.byteLength,true); view.setUint32(24+length,0x004e4942,true); bytes.set(new Uint8Array(buffer.buffer),28+length);
    await area.importFiles([new File([glb],'item.glb')]);
  })()`)
  await check('GLB is portable too', 'Object.values(area.document().assets).some(a=>a.name==="item.glb")')
  await evaluate('window.withAssets = area.document()')
  await action('await area.openDocument(JSON.parse(JSON.stringify(withAssets)))')
  await check('animated models survive reopen', 'area.document().objects.length === 3 && Object.keys(area.document().assets).length === 2')
  await shot('item-com-modelos')
  await action(`ui('#authoring-toolbar [data-k="export"]')`)
  await writeFile(join(output, 'item-roundtrip.json'), JSON.stringify(await evaluate('area.document()')))
  await action(`(() => { const input = document.querySelector('#tools [data-k="insert"]'), transfer = new DataTransfer(); transfer.items.add(new File([JSON.stringify(withAssets)], 'item.json')); input.files = transfer.files; input.dispatchEvent(new Event('change')); })()`)
  await until('area.document().objects.length === 6')
  await check('saved composition can be inserted with independent assets and identities', 'Object.keys(area.document().assets).length === 4 && new Set(area.document().objects.map(o=>o.id)).size === 6')
  await action('await area.openDocument(expected)')
  await action(`ui('#tools [data-k="weather"]', 'rain')`)
  await check('rain is saved and registered', 'area.document().environment.weather === "rain" && engine.resources.rain === 1')
  await action(`ui('#tools [data-k="weather"]', 'snow')`)
  await check('weather replacement frees rain', 'area.document().environment.weather === "snow" && engine.resources.rain === 0')
  await action(`ui('#tools [data-k="weather"]', 'none')`)
  await evaluate('window.resourcesBefore = JSON.stringify(engine.resources)')
  await evaluate('(async () => { for (let i=0;i<6;i++) await area.openDocument(area.document()) })()')
  await check('repeated reopen does not accumulate layers or lights', 'JSON.stringify(engine.resources) === resourcesBefore')
  // Brush through pointer events, then undo a whole stroke.
  await action(`ui('#tools [data-k="tool"]', 'raise')`)
  await evaluate(`(() => { const canvas = document.querySelector('canvas'), rect = canvas.getBoundingClientRect(); for(const type of ['pointerdown','pointermove','pointerup']) canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,button:0,clientX:rect.left+rect.width*.6,clientY:rect.top+rect.height*.6})); })()`)
  await check('terrain brush changes heightmap', 'area.document().terrain.heights.some(h=>h>0)')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('undo restores entire stroke', 'area.document().terrain.heights.every(h=>h===0)')
  await action(`ui('#tools [data-k="tool"]', 'lake')`)
  await action(`(() => { const canvas = document.querySelector('canvas'), rect = canvas.getBoundingClientRect(); canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,clientX:rect.left+rect.width*.68,clientY:rect.top+rect.height*.57})); })()`)
  await check('lake brush carves and creates editable water', 'area.document().waters.length === 1 && area.document().terrain.heights.some(h=>h<0)')
  await action(`ui('#tools [data-k="tool"]', 'select'); ui('#authoring-toolbar [data-k="name"]', 'Mapa de prova'); ui('#tools [data-k="weather"]', 'rain')`)
  await shot('mapa-com-lago')
  await evaluate('window.saved = JSON.stringify(area.document())')
  const saved = await evaluate('saved')
  await writeFile(join(output, 'mapa-prova.pomorog.json'), saved)
  await evaluate('window.__beforeReload = true')
  await send('Page.reload')
  await until('!window.__beforeReload && !!window.area && !!document.querySelector("canvas[data-ready]")')
  await check('browser reload restores IndexedDB draft with style, geometry and weather', `JSON.stringify(area.document()) === ${JSON.stringify(saved)}`)
  await shot('mapa-reaberto')
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close(); chrome.kill()
  await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once('exit', resolve) })
  await rm(profile, { recursive: true, force: true, maxRetries: 3 })
}
