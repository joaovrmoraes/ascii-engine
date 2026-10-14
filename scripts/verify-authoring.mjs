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
  const action = async expression => { await evaluate(`(async () => { ${expression} })()`); await until('window.area && !area.state.includes("opening")'); await sleep(200) }
  const check = async (title, expression) => { if (!await evaluate(expression)) throw new Error(`FAIL: ${title}`); console.log(`PASS ${title}`) }
  const shot = async name => { await sleep(500); const result = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64')) }
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('change')); } }`)
  await check('map starts with stable object identities', 'area.document().objects.every(o => o.id && Number.isInteger(o.seed))')
  await check('terrain labels share the glyph vocabulary and preserve legacy layer names', `
    JSON.stringify(Array.from(document.querySelectorAll('[data-k=layer] option'), o => o.textContent)) ===
      JSON.stringify(['Moss', 'Earth', 'Stone', 'Snow']) &&
    JSON.stringify(area.document().terrain.layers.map(layer => layer.name)) ===
      JSON.stringify(['musgo', 'terra', 'pedra', 'neve'])`)
  await evaluate(`window.beforeDisplay = JSON.stringify(area.document()); window.displayURL = location.href;
    ui('[data-tab=view]'); ui('#authoring-toolbar [data-k=pause]')`)
  await check('Display is view-only and keeps style presets in File', `
    !document.querySelector('#panel [data-k=area], #panel [data-k=cell], #panel [data-k=light], #panel [data-k=import], #panel [data-k=save], #panel [data-k=load]') &&
    !!document.querySelector('[data-k=save-style]') && !!document.querySelector('[data-k=load-style]')`)
  await check('toolbar and Display share pause state without a DOM proxy', `
    view.paused && document.querySelector('#panel [data-k=pause]').getAttribute('aria-pressed') === 'true'`)
  await evaluate(`window.debugFrames = ['letters', 'screen', 'raw'].map(mode => {
    ui('#panel [data-k=mode]', mode); engine.render(0, {redraw:true}); return engine.renderer.domElement.toDataURL();
  }); ui('#panel [data-k=mode]', 'letters'); ui('#panel [data-k=zoom]', '1'); ui('#panel [data-k=angle]', '.5')`)
  await check('debug views change rendering live without saving styles or reloading', `
    new Set(debugFrames).size === 3 && location.href === displayURL &&
    engine.renderMode === 'glyphs' && JSON.stringify(area.document()) === beforeDisplay`)
  await evaluate(`ui('#panel [data-k=pause]'); ui('#panel [data-k=zoom]', '.8'); ui('#panel [data-k=angle]', '0'); ui('[data-tab=object]')`)
  await check('Display pause also updates the toolbar', `
    !view.paused && document.querySelector('#authoring-toolbar [data-k=pause]').getAttribute('aria-pressed') === 'false'`)
  await evaluate(`ui('[data-studio-page=atmosphere]')`)
  await check('Atmosphere owns exposure and screen cell size', `
    Number(document.querySelector('[data-studio-field="Exposure"]').value) === engine.style.brightness &&
    Number(document.querySelector('[data-studio-field="Screen cell size (px)"]').value) === engine.style.cellSize`)
  await evaluate(`ui('[data-k=close-studio]')`)

  // Real mouse drag from a library card into the viewport, using the browser's
  // native DataTransfer payload (not a scene API call).
  const mouse = (type, x, y, button = 'none', buttons = 0) => send('Input.dispatchMouseEvent', { type, x, y, button, buttons, clickCount: type === 'mousePressed' || type === 'mouseReleased' ? 1 : 0 })
  await evaluate(`window.projectPanTarget = () => {
    const point=engine.scene.children.find(o=>o.userData.sceneId==='object-1').position.clone().project(engine.camera), rect=document.querySelector('canvas').getBoundingClientRect();
    return {x:rect.x+(point.x+1)*rect.width/2,y:rect.y+(1-point.y)*rect.height/2};
  }; window.beforePanDoc=JSON.stringify(area.document());`)
  for (const [angle,zoom] of [[0,.8],[1.5,.45],[-1,1.5]]) {
    await evaluate(`view.angle=${angle}; view.zoom=${zoom}`); await sleep(2000)
    for (const [button,buttons,dx,dy] of [['right',2,80,40],['middle',4,-80,-40]]) {
      const before=await evaluate('projectPanTarget()')
      const origin=await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect(); return {x:r.x+r.width*.7,y:r.y+r.height*.6}})()`)
      await mouse('mousePressed',origin.x,origin.y,button,buttons)
      for(let i=1;i<=5;i++) {await mouse('mouseMoved',origin.x+dx*i/5,origin.y+dy*i/5,button,buttons); await sleep(30)}
      await mouse('mouseReleased',origin.x+dx,origin.y+dy,button); await sleep(100)
      const after=await evaluate('projectPanTarget()')
      if (Math.abs(after.x-before.x-dx)>.5 || Math.abs(after.y-before.y-dy)>.5) throw new Error(`Pan does not follow pointer: ${JSON.stringify({angle,zoom,dx,dy,before,after})}`)
    }
  }
  console.log('PASS right/middle pan follows mouse in both directions at three angles and zooms')
  await check('camera navigation preserves the document', 'JSON.stringify(area.document())===beforePanDoc')
  await evaluate('view.angle=0; view.zoom=.8'); await sleep(2000)
  await shot('navegacao-corrigida')

  // Native placement and object transforms must keep working after navigation.
  await send('Input.setInterceptDrags', { enabled: true })
  const dragPoints = await evaluate(`(() => { const card=document.querySelector('[data-prefab="caixa"]').getBoundingClientRect(), canvas=document.querySelector('canvas').getBoundingClientRect(); return {sx:card.x+card.width/2,sy:card.y+25,x:canvas.x+canvas.width*.6,y:canvas.y+canvas.height*.6} })()`)
  await mouse('mouseMoved', dragPoints.sx, dragPoints.sy)
  await mouse('mousePressed', dragPoints.sx, dragPoints.sy, 'left', 1)
  await mouse('mouseMoved', dragPoints.sx+12, dragPoints.sy-18, 'left', 1)
  for (let i=0; i<30 && !interceptedDrag; i++) await sleep(50)
  if (!interceptedDrag) throw new Error('Native card drag did not start')
  for (const type of ['dragEnter', 'dragOver', 'drop']) await send('Input.dispatchDragEvent', { type, x:dragPoints.x, y:dragPoints.y, data:interceptedDrag })
  await mouse('mouseReleased', dragPoints.x, dragPoints.y, 'left')
  await send('Input.setInterceptDrags', { enabled:false })
  await until('area.document().objects.length === 4')
  await check('native library drag creates a selected object at the drop point', 'area.document().objects[3].prefab === "caixa" && document.querySelector("#hierarchy .active")?.dataset.objectId === area.document().objects[3].id')
  await evaluate(`window.draggedId=area.document().objects[3].id; window.beforeGizmo=area.document().objects[3].position.slice(); window.cameraBefore=engine.camera.position.toArray();
    window.projectAxis = (offset) => { const object=engine.scene.children.find(o=>o.userData.sceneId===draggedId), point=object.position.clone(); point.x+=offset; point.project(engine.camera); const rect=document.querySelector('canvas').getBoundingClientRect(); return {x:rect.x+(point.x+1)/2*rect.width,y:rect.y+(1-point.y)/2*rect.height}; }`)
  async function dragXAxis(mode) {
    await action(`ui('[data-mode="${mode}"]'); ui('#hierarchy [data-object-id="'+draggedId+'"]')`)
    let handle
    for (let offset=.15; offset<4; offset+=.15) {
      const point=await evaluate(`projectAxis(${offset})`)
      await mouse('mouseMoved',point.x,point.y); await sleep(30)
      if (await evaluate('document.querySelector("canvas").dataset.transformAxis === "X"')) { handle=point; break }
    }
    if (!handle) throw new Error(`No X handle found for ${mode}`)
    const delta=await evaluate('(()=>{const a=projectAxis(0), b=projectAxis(1.2); return {x:b.x-a.x,y:b.y-a.y}})()')
    await mouse('mousePressed',handle.x,handle.y,'left',1)
    for(let i=1;i<=6;i++) { await mouse('mouseMoved',handle.x+delta.x*i/6,handle.y+delta.y*i/6,'left',1); await sleep(20) }
    await mouse('mouseReleased',handle.x+delta.x,handle.y+delta.y,'left'); await sleep(250)
  }
  await dragXAxis('translate')
  await check('dragging the X gizmo moves the object, updates inspector and leaves camera still', `area.document().objects[3].position[0] > beforeGizmo[0]+.5 && Math.abs(Number(document.querySelector('[data-field="Position x"]').value)-area.document().objects[3].position[0])<.01 && engine.camera.position.toArray().every((value,i)=>Math.abs(value-cameraBefore[i])<.001)`)
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('gizmo drag is one undo action', 'JSON.stringify(area.document().objects[3].position)===JSON.stringify(beforeGizmo)')
  await dragXAxis('scale')
  await check('scale gizmo changes the selected object', 'area.document().objects[3].scale3[0] > 1.2')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await action(`ui('#hierarchy [data-object-id="'+draggedId+'"]'); ui('[data-mode="rotate"]')`)
  await evaluate(`window.projectRing = angle => {
    const object=engine.scene.children.find(o=>o.userData.sceneId===draggedId), point=object.position.clone();
    const radius=(engine.camera.top-engine.camera.bottom)/engine.camera.zoom*.85/8;
    point.x+=Math.cos(angle)*radius; point.z+=Math.sin(angle)*radius; point.project(engine.camera);
    const rect=document.querySelector('canvas').getBoundingClientRect();
    return {x:rect.x+(point.x+1)/2*rect.width,y:rect.y+(1-point.y)/2*rect.height};
  }`)
  let ringAngle
  for (let angle=0; angle<Math.PI*2; angle+=Math.PI/12) {
    const point=await evaluate(`projectRing(${angle})`)
    await mouse('mouseMoved',point.x,point.y); await sleep(30)
    if(await evaluate('document.querySelector("canvas").dataset.transformAxis === "Y"')) {ringAngle=angle; break}
  }
  if (ringAngle===undefined) throw new Error('No Y rotation ring found')
  const ringStart=await evaluate(`projectRing(${ringAngle})`)
  await mouse('mousePressed',ringStart.x,ringStart.y,'left',1)
  let ringEnd=ringStart
  for(let i=1;i<=6;i++) {ringEnd=await evaluate(`projectRing(${ringAngle+i*Math.PI/36})`); await mouse('mouseMoved',ringEnd.x,ringEnd.y,'left',1); await sleep(20)}
  await mouse('mouseReleased',ringEnd.x,ringEnd.y,'left'); await sleep(250)
  await check('dragging the rotation ring turns the object', 'Math.abs(area.document().objects[3].rotation3[1]) > .1')
  await shot('workspace-gizmo')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await action(`ui('#authoring-toolbar [data-k="preview"]')`)
  await check('preview disables authoring without changing the document', 'document.body.classList.contains("previewing") && document.querySelector("#asset-browser").inert && area.document().objects.length===4')
  await action(`ui('#authoring-toolbar [data-k="preview"]'); ui('[data-mode="translate"]'); ui('#authoring-toolbar [data-k="undo"]')`)
  await check('undo also removes the dropped object', 'area.document().objects.length===3')

  await action(`ui('#hierarchy [data-object-id="object-2"]'); ui('[data-field="Position x"]', '-2.5')`)
  await check('transform edited in inspector is serialized', 'area.document().objects[1].position[0] === -2.5')
  await action(`ui('#selection [data-k="part"]', 'crown'); ui('#selection [data-k="size"]', '.24'); ui('#selection [data-k="apply"]')`)
  await check('part style is serialized', 'area.document().objects[1].options.parts.crown.size === .24')
  await evaluate('window.expected = area.document()')
  await action('await area.openDocument(JSON.parse(JSON.stringify(expected)))')
  await check('document roundtrip keeps geometry seeds, transforms and styles', 'JSON.stringify(area.document()) === JSON.stringify(expected)')
  await action(`ui('#authoring-toolbar [data-k="item"]')`)
  await check('terainless item opens', '!area.document().terrain && area.document().objects.length === 0')
  await action(`ui('[data-prefab="bloco"]'); const canvas = document.querySelector('canvas'), r = canvas.getBoundingClientRect(); canvas.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, button:0, clientX:r.left+r.width/2, clientY:r.top+r.height/2 })); canvas.dispatchEvent(new PointerEvent('pointerup', { bubbles:true, button:0, clientX:r.left+r.width/2, clientY:r.top+r.height/2 }));`)
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
    const json = {asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'blade',mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.8,.6,.3,1],metallicFactor:0,roughnessFactor:1},doubleSided:true}],buffers:[{uri:'item.bin',byteLength:buffer.byteLength}],bufferViews:[{buffer:0,byteOffset:0,byteLength:36},{buffer:0,byteOffset:36,byteLength:8},{buffer:0,byteOffset:44,byteLength:24}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-.5,0,0],max:[.5,1,0]},{bufferView:1,componentType:5126,count:2,type:'SCALAR',min:[0],max:[1]},{bufferView:2,componentType:5126,count:2,type:'VEC3'}],animations:[{name:'Float',channels:[{sampler:0,target:{node:0,path:'translation'}}],samplers:[{input:1,output:2}]}]}; return {json,buffer}; }
  `)
  await evaluate(`(async () => { const {json,buffer} = makeModel(); await area.importFiles([new File([JSON.stringify(json)],'item.gltf'), new File([buffer],'item.bin')]); })()`)
  await check('GLTF embeds companion buffer and registers animation', 'Object.values(area.document().assets).some(a=>a.name==="item.gltf") && engine.scene.children.some(o=>o.userData.animationClips?.includes("Float"))')
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
  await action(`(() => { const input = document.querySelector('#asset-browser [data-k="insert"]'), transfer = new DataTransfer(); transfer.items.add(new File([JSON.stringify(withAssets)], 'item.json')); input.files = transfer.files; input.dispatchEvent(new Event('change')); })()`)
  await until('area.document().objects.length === 6')
  await check('saved composition can be inserted with independent assets and identities', 'Object.keys(area.document().assets).length === 4 && new Set(area.document().objects.map(o=>o.id)).size === 6')
  await action('await area.openDocument(expected)')
  await action(`ui('#environment-settings [data-k="weather"]', 'rain')`)
  await check('rain is saved and registered', 'area.document().environment.weather === "rain" && engine.resources.rain === 1')
  await action(`ui('#environment-settings [data-k="weather"]', 'snow')`)
  await check('weather replacement frees rain', 'area.document().environment.weather === "snow" && engine.resources.rain === 0')
  await action(`ui('#environment-settings [data-k="weather"]', 'none')`)
  await evaluate('window.resourcesBefore = JSON.stringify(engine.resources)')
  await evaluate('(async () => { for (let i=0;i<6;i++) await area.openDocument(area.document()) })()')
  await check('repeated reopen does not accumulate layers or lights', 'JSON.stringify(engine.resources) === resourcesBefore')
  // Brush through pointer events, then undo a whole stroke.
  await action(`ui('[data-tab="terrain"]'); ui('[data-brush="raise"]')`)
  await evaluate(`(() => { const canvas = document.querySelector('canvas'), rect = canvas.getBoundingClientRect(); for(const type of ['pointerdown','pointermove','pointerup']) canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,button:0,clientX:rect.left+rect.width*.6,clientY:rect.top+rect.height*.6})); })()`)
  await check('terrain brush changes heightmap', 'area.document().terrain.heights.some(h=>h>0)')
  await action(`ui('#authoring-toolbar [data-k="undo"]')`)
  await check('undo restores entire stroke', 'area.document().terrain.heights.every(h=>h===0)')
  await action(`ui('[data-brush="water"]'); ui('[data-k="water-mode"]','level')`)
  await action(`(() => { const canvas = document.querySelector('canvas'), rect = canvas.getBoundingClientRect(); for(const type of ['pointerdown','pointerup']) canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,button:0,clientX:rect.left+rect.width*.68,clientY:rect.top+rect.height*.57})); })()`)
  await check('flat water brush carves and creates editable water', 'area.document().waters.length === 1 && area.document().terrain.heights.some(h=>h<0)')
  await action(`ui('[data-mode="translate"]'); ui('#authoring-toolbar [data-k="name"]', 'Map de prova'); ui('#environment-settings [data-k="weather"]', 'rain')`)
  await shot('mapa-com-lago')
  await evaluate('window.saved = JSON.stringify(area.document())')
  const saved = await evaluate('saved')
  await writeFile(join(output, 'mapa-prova.pomorog.json'), saved)
  await evaluate('window.__beforeReload = true')
  await send('Page.reload')
  await until('!window.__beforeReload && !!window.area && !!document.querySelector("canvas[data-ready]")')
  await check('browser reload restores IndexedDB draft with style, geometry and weather', `JSON.stringify(area.document()) === ${JSON.stringify(saved)}`)
  await shot('mapa-reaberto')
  await evaluate(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('change')); } }`)
  const bounds = selector => evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`)
  async function dragPointer(x,y,toX,toY) {
    await mouse('mouseMoved',x,y); await mouse('mousePressed',x,y,'left',1)
    for(let i=1;i<=8;i++) {await mouse('mouseMoved',x+(toX-x)*i/8,y+(toY-y)*i/8,'left',1);await sleep(30)}
    await mouse('mouseReleased',toX,toY,'left'); await sleep(250)
  }
  const dockedLibrary=await bounds('#asset-browser'), libraryEdge=await bounds('#asset-browser > .panel-resize')
  await dragPointer(libraryEdge.x+libraryEdge.width/2,libraryEdge.y+3,libraryEdge.x+libraryEdge.width/2,libraryEdge.y-97)
  await check('docked library resizes and viewport follows', `document.querySelector('#asset-browser').getBoundingClientRect().height > ${dockedLibrary.height+80} && document.querySelector('canvas').getBoundingClientRect().bottom <= document.querySelector('#asset-browser').getBoundingClientRect().top+1`)
  await action(`ui('[data-k="create-effect"]'); ui('[data-fx="name"]','Sparks azuis'); ui('[data-fx-mode="advanced"]'); ui('[data-effect-field="Glyphs / s"]','42'); ui('[data-effect-field="Start color"]','#7799ff')`)
  await sleep(700)
  await check('effects tab previews a new effect without modifying the map', `!document.querySelector('#effect-editor').hidden && !area.document().effects && !engine.fx.playing.some(e=>e.name==='Sparks azuis') && Number(document.querySelector('#effect-preview canvas').dataset.letters)>0 && getComputedStyle(document.querySelector('#app > canvas')).visibility==='hidden'`)
  await action(`ui('[data-fx="save"]')`)
  await until('Object.keys(area.document().effects??{}).length===1')
  await evaluate(`window.customEffectKey=Object.keys(area.document().effects)[0]`)
  await check('effect form saves its recipe into the document and library', `area.document().effects[customEffectKey].emitters[0].rate===42 && !!document.querySelector('[data-prefab="'+customEffectKey+'"]')`)
  await action(`ui('[data-fx-mode="simple"]')`)
  await evaluate('window.mapTime=engine.time; window.mapSnapshot=JSON.stringify(area.document()); window.mapCamera=engine.camera.matrixWorld.toArray().join()')
  await sleep(400)
  await check('void preview pauses map rendering and preserves document/camera', `engine.time===mapTime && JSON.stringify(area.document())===mapSnapshot && engine.camera.matrixWorld.toArray().join()===mapCamera`)
  await action(`ui('[data-preview="pause"]')`)
  const pausedTime=await evaluate('document.querySelector("#effect-preview canvas").dataset.time')
  await sleep(300)
  await check('effect playback can be paused independently', `document.querySelector('#effect-preview canvas').dataset.time===${JSON.stringify(pausedTime)}`)
  await action(`ui('[data-preview="restart"]')`)
  await check('restart restores visible particles', `Number(document.querySelector('#effect-preview canvas').dataset.letters)>0`)
  await shot('aba-efeitos')
  await action(`ui('[data-fx="place"]')`)
  await action(`(()=>{const canvas=document.querySelector('canvas'),r=canvas.getBoundingClientRect(); for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,button:0,clientX:r.x+r.width*.55,clientY:r.y+r.height*.55}))})()`)
  await check('saved effect is placed as an object with its portable recipe', `area.document().objects.some(o=>o.prefab===customEffectKey) && engine.fx.playing.some(e=>e.name==='Sparks azuis')`)
  await evaluate('window.effectDocument=area.document()')
  await action('await area.openDocument(JSON.parse(JSON.stringify(effectDocument)))')
  await check('custom effect survives rebuild without a global preset registration', `JSON.stringify(area.document())===JSON.stringify(effectDocument) && engine.fx.playing.some(e=>e.name==='Sparks azuis') && !engine.fx.library.has('Sparks azuis')`)
  await action(`(()=>{const doc=area.document(), item={version:1,objects:[doc.objects.find(o=>o.prefab===customEffectKey)],effects:{[customEffectKey]:doc.effects[customEffectKey]}}, input=document.querySelector('#asset-browser [data-k="insert"]'), transfer=new DataTransfer();transfer.items.add(new File([JSON.stringify(item)],'efeito-item.json'));input.files=transfer.files;input.dispatchEvent(new Event('change'))})()`)
  await check('inserting an effect item remaps both its recipe and instance', `Object.keys(area.document().effects).length===2 && new Set(area.document().objects.filter(o=>o.prefab.startsWith('fx:custom-')).map(o=>o.prefab)).size===2`)
  await action('await area.openDocument(effectDocument)')
  await check('replacing effects releases previous instances', `engine.fx.playing.filter(e=>e.name==='Sparks azuis').length===1`)
  await action(`ui('[data-project-tab="studio"]'); ui('[data-studio-tab="effects"]'); ui('[data-fx="json"]','{"name":"invalid","duration":0,"emitters":[]}'); ui('[data-fx="apply"]')`)
  await check('invalid effect JSON preserves the saved scene', `document.querySelector('.fx-status').textContent.includes('Invalid effect') && JSON.stringify(area.document())===JSON.stringify(effectDocument)`)
  await action(`ui('[data-project-tab="assets"]')`)
  await action(`ui('[data-project-tab="studio"]'); ui('[data-studio-tab="atmosphere"]'); ui('[data-studio="preset"]','dusk'); ui('[data-studio="name"]','Dusk salvo'); ui('[data-studio-field="Main intensity"]','2.75'); ui('[data-studio="save"]')`)
  await until('Object.keys(area.document().atmospheres??{}).length===1')
  await evaluate(`window.atmosphereKey=Object.keys(area.document().atmospheres)[0]; window.savedAtmosphere=area.document().atmospheres[atmosphereKey]`)
  await check('atmosphere save creates a named asset immediately', `savedAtmosphere.name==='Dusk salvo' && savedAtmosphere.style.moon.intensity===2.75 && !!document.querySelector('[data-atmosphere="'+atmosphereKey+'"]')`)
  await shot('atmosfera-salva')
  await action(`ui('[data-studio-field="Main intensity"]','3.5'); ui('[data-studio="save"]')`)
  await check('editing an atmosphere updates the same asset', `Object.keys(area.document().atmospheres).length===1 && area.document().atmospheres[atmosphereKey].style.moon.intensity===3.5`)
  await action(`await area.authoring.undo()`)
  await check('undo restores the previous atmosphere asset', `area.document().atmospheres[atmosphereKey].style.moon.intensity===2.75`)
  await action(`await area.authoring.undo(true)`)
  await check('redo restores the updated atmosphere asset', `area.document().atmospheres[atmosphereKey].style.moon.intensity===3.5`)
  await action(`ui('[data-studio="reveal"]')`)
  await check('view assets opens the Atmospheres category', `!document.body.classList.contains('studio-mode') && document.querySelector('[data-k="categories"] .active').textContent.includes('Atmospheres') && document.querySelector('[data-atmosphere="'+atmosphereKey+'"]')`)
  await shot('assets-atmosfera')
  await action(`ui('#environment-settings [data-k="atmosphere"]','moon'); ui('[data-atmosphere="'+atmosphereKey+'"]')`)
  await check('atmosphere asset applies its lighting to the open scene', `engine.style.moon.intensity===3.5 && engine.style.atmosphere==='dusk'`)
  await action(`document.querySelector('[data-atmosphere="'+atmosphereKey+'"]')?.dispatchEvent(new MouseEvent('dblclick'))`)
  await check('double click reopens a named atmosphere for editing', `document.body.classList.contains('studio-mode') && document.querySelector('[data-studio="name"]').value==='Dusk salvo'`)
  await action(`ui('[data-studio="copy"]')`)
  await check('save copy creates a separate atmosphere resource', `Object.keys(area.document().atmospheres).length===2`)
  await action(`ui('[data-project-tab="assets"]'); ui('[data-k="library"]')`)
  const effectCard = await evaluate(`(()=>{const card=document.querySelector('[data-prefab="'+customEffectKey+'"]');card.scrollIntoView({block:'center'});const r=card.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  for (const clickCount of [1,2]) for (const type of ['mousePressed','mouseReleased']) await send('Input.dispatchMouseEvent', { type, ...effectCard, button: 'left', buttons: type==='mousePressed'?1:0, clickCount })
  await sleep(300)
  await check('double click reopens a saved effect in the void', `document.body.classList.contains('effect-studio-active') && document.querySelector('[data-fx="name"]').value==='Sparks azuis' && Number(document.querySelector('#effect-preview canvas').dataset.letters)>0`)
  await action(`(()=>{const slider=document.querySelector('[data-quick="Count per second"]');slider.value='65';slider.dispatchEvent(new Event('input'))})()`)
  await action(`ui('[data-fx="save"]')`)
  await check('essential slider edits persist in the reusable recipe', `area.document().effects[customEffectKey].emitters[0].rate===65`)
  await check('saving the reopened effect updates instead of duplicating', `Object.keys(area.document().effects).length===1`)
  // Repeated switches exercise disposal of the isolated WebGL context.
  for(let i=0;i<3;i++) await action(`ui('[data-studio-tab="atmosphere"]'); ui('[data-studio-tab="effects"]')`)
  await check('reopening the stage still renders after disposing earlier previews', `Number(document.querySelector('#effect-preview canvas').dataset.letters)>0`)
  for (const id of ['fire','smoke','sparks','magic','explosion','lightning']) {
    await action(`ui('[data-effect-template="${id}"]')`)
    await check(`template ${id} opens a valid recipe without modifying saved assets`, `JSON.parse(document.querySelector('[data-fx="json"]').value).emitters.length>0 && Object.keys(area.document().effects).length===1`)
  }
  await action(`ui('[data-effect-template="fire"]')`)
  await sleep(1200); await shot('fogo-no-void')
  await action(`ui('[data-project-tab="assets"]')`)
  const hierarchy=await bounds('#hierarchy'), heading=await bounds('#hierarchy > .dock-heading')
  await dragPointer(heading.x+70,heading.y+14,heading.x+400,heading.y+114)
  await check('dragging a panel title detaches it and frees viewport space', `document.querySelector('#hierarchy').dataset.dock==='floating' && document.querySelector('canvas').getBoundingClientRect().left===0`)
  const floating=await bounds('#hierarchy'), corner=await bounds('#hierarchy > .panel-resize')
  await dragPointer(corner.x+8,corner.y+8,corner.x+88,corner.y+48)
  await check('floating panel can be resized', `document.querySelector('#hierarchy').getBoundingClientRect().width > ${floating.width+60}`)
  await shot('painel-flutuante')
  const floatingHeading=await bounds('#hierarchy > .dock-heading'), screen=await evaluate('({width:innerWidth,height:innerHeight})')
  await dragPointer(floatingHeading.x+70,floatingHeading.y+14,screen.width/2,screen.height-40)
  await check('panel docks to a different edge and displaces the previous occupant safely', `document.querySelector('#hierarchy').dataset.dock==='bottom' && document.querySelector('#asset-browser').dataset.dock==='floating'`)
  const layout=await evaluate('localStorage.getItem("ascii-editor-layout-v1")'), finalDoc=await evaluate('JSON.stringify(area.document())')
  await evaluate('window.__beforeReload=true'); await send('Page.reload')
  await until('!window.__beforeReload && !!window.area && !!document.querySelector("canvas[data-ready]")')
  await check('layout, effects and atmosphere assets restore after reloading the browser', `localStorage.getItem('ascii-editor-layout-v1')===${JSON.stringify(layout)} && document.querySelector('#hierarchy').dataset.dock==='bottom' && document.querySelector('#asset-browser').dataset.dock==='floating' && JSON.stringify(area.document())===${JSON.stringify(finalDoc)}`)
  await evaluate(`document.querySelector('[data-k="reset-layout"]').click()`)
  await check('restore panels brings every panel back', `document.querySelector('#hierarchy').dataset.dock==='left' && document.querySelector('#asset-browser').dataset.dock==='bottom' && document.querySelector('#authoring-sidebar').dataset.dock==='right'`)
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close(); chrome.kill()
  await new Promise(resolve => { if (chrome.exitCode !== null) resolve(); else chrome.once('exit', resolve) })
  await rm(profile, { recursive: true, force: true, maxRetries: 3 })
}
