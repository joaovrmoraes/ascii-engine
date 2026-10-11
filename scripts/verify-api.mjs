/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(new URL('../apps/automation/package.json', import.meta.url))
const { Client } = require('@modelcontextprotocol/client')
const { StdioClientTransport } = require('@modelcontextprotocol/client/stdio')
const root = new URL('..', import.meta.url).pathname
let client
const output = process.argv[2] ?? '/tmp/ascii-api-verification'
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
  await until('!!window.asciiEngineApi')
  const sessionId = await evaluate('asciiEngineApi.sessionId')
  client = new Client({name:'ascii-integration-test',version:'1.0.0'})
  await client.connect(new StdioClientTransport({command:process.execPath,args:[join(root,'apps/automation/node_modules/tsx/dist/cli.mjs'),join(root,'apps/automation/src/mcp.ts')],cwd:root,stderr:'pipe'}))
  const invoke=async(name,args={},expectError=false)=>{
    const result=await client.callTool({name,arguments:{sessionId,...args}})
    if (expectError) { if(!result.isError) throw new Error('Expected error: '+name); return JSON.parse(result.content[0].text) }
    if(result.isError) throw new Error(name+': '+result.content[0].text)
    return result.content[0].type==='image'?result:JSON.parse(result.content[0].text)
  }
  const assert=(condition,title)=>{if(!condition)throw new Error('FAIL '+title);console.log('PASS '+title)}
  const tools=await client.listTools()
  assert(tools.tools.length===13,'official MCP handshake and all 13 tools discoverable')
  const sessions=await invoke('engine_sessions')
  assert(sessions.some(s=>s.sessionId===sessionId),'isolated browser registered, session selected explicitly')
  const catalog=await invoke('engine_reference',{topic:'catalog'})
  assert(catalog.some(p=>p.id==='pedregulho')&&catalog.some(p=>p.id==='fogueira'),'MCP discovers actual editor prefab library')
  const schema=await invoke('engine_reference',{topic:'commands'})
  assert(!!schema.commands.items,'machine-readable command schema')
  let state=await invoke('scene_read',{full:true})
  const initial=state.document
  const commands=[
    {op:'scene.replace',document:{version:1,name:'Ambiente criado pelo MCP',objects:[]}},
    {op:'terrain.create',size:24,resolution:65},
    {op:'terrain.stroke',strokes:[{brush:'raise',x:1,z:-2,radius:5,strength:2},{brush:'paint',x:-3,z:0,radius:2,strength:1,layer:1}]},
    {op:'scene.patch',patch:{carpet:{count:35000,seed:48}}},
    {op:'water.paint',points:[{x:1,z:-2},{x:0,z:0},{x:-3,z:2}],radius:1,mode:'terrain'},
    {op:'object.add',object:{id:'fire',prefab:'fogueira',position:[-3,0,-1]}},
    {op:'object.add',object:{id:'rock',prefab:'pedregulho',position:[0,1.2,-3]}},
    {op:'object.scatter',prefab:'arvore',count:8,seed:123,bounds:{minX:4,maxX:8,minZ:-6,maxZ:2},scale:[.7,1.1]},
    {op:'effect.define',id:'fx:custom-blue',effect:{name:'Luz azul',duration:2,loop:true,emitters:[{rate:12,life:2,shape:{kind:'sphere',radius:.25},velocity:[0,.5,0],glyphs:'.+*',color:[.2,.6,1],size:.16,glow:2}],light:{color:0x3388ff,intensity:8,distance:7,offset:[0,.7,0]}}},
    {op:'object.add',object:{id:'blue',prefab:'fx:custom-blue',position:[-2,0,3]}},
    {op:'atmosphere.set',style:{moon:{intensity:1.9,color:0xaabbff},inkTint:[.85,.95,1],fog:{color:0x0a1020,density:.018}}},
    {op:'atmosphere.define',id:'blue-night',name:'Noite azul',style:{moon:{intensity:2.2}}},
    {op:'atmosphere.apply',id:'blue-night'},
    {op:'camera.define',id:'wide',camera:{name:'Plano MCP',projection:'orthographic',position:[10,12,16],rotation:[-.6,.3,0],span:10,aspect:16/9}},
    {op:'camera.activate',id:'wide'},
    {op:'environment.set',weather:'rain',intensity:.2},
  ]
  assert((await invoke('scene_validate',{commands})).valid,'complete batch validates without mutation')
  state=await invoke('scene_apply',{revision:state.revision,commands,preview:true})
  assert(state.preview&&state.scene.objects.length===11,'MCP creates terrain, continuous slope water, objects, custom effect, atmosphere and weather')
  await check('pending preview visibly locks editing and offers accept/cancel', 'document.querySelector("#editor-workspace").inert && !document.querySelector("#ai-preview").hidden')
  await invoke('editor_view',{focus:[0,1,-1],zoom:.55,angle:0,paused:false})
  await shot('mcp-previa')
  await invoke('scene_apply',{revision:state.revision-1,commands:[{op:'scene.patch',patch:{name:'Stale'}}],preview:false},true)
  assert((await invoke('scene_read')).scene.name==='Ambiente criado pelo MCP','stale revision rejected without overwriting scene')
  const canceled=await invoke('scene_preview',{revision:state.revision,action:'cancel'})
  assert(!canceled.preview,'preview cancel returns to saved scene')
  assert(JSON.stringify((await invoke('scene_read',{full:true})).document)===JSON.stringify(initial),'cancel restores entire original document')
  state=await invoke('scene_apply',{revision:canceled.revision,commands,preview:true})
  state=await invoke('scene_preview',{revision:state.revision,action:'accept'})
  const committed=(await invoke('scene_read',{full:true})).document
  state=await invoke('scene_history',{revision:state.revision,action:'undo'})
  assert(JSON.stringify((await invoke('scene_read',{full:true})).document)===JSON.stringify(initial),'entire AI batch undoes in a single step')
  state=await invoke('scene_history',{revision:state.revision,action:'redo'})
  assert(JSON.stringify((await invoke('scene_read',{full:true})).document)===JSON.stringify(committed),'redo restores full authored scene')
  const resources=await evaluate('JSON.stringify(engine.resources)')
  await invoke('scene_apply',{revision:state.revision,preview:false,commands:[{op:'object.add',object:{prefab:'missing',position:[0,0,0]}}]},true)
  await invoke('scene_apply',{revision:state.revision,preview:false,commands:[{op:'asset.define',id:'bad',name:'bad.glb',source:'data:model/gltf-binary;base64,YmFk'}]},true)
  assert(JSON.stringify((await invoke('scene_read',{full:true})).document)===JSON.stringify(committed)&&await evaluate('JSON.stringify(engine.resources)')===resources,'unknown prefab and broken model preserve scene and GPU resources')
  const buffer=new Float32Array([-.5,0,0,.5,0,0,0,1,0])
  const model={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'blade',mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0}}]}],buffers:[{uri:'mesh.bin',byteLength:buffer.byteLength}],bufferViews:[{buffer:0,byteLength:buffer.byteLength}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-.5,0,0],max:[.5,1,0]}]}
  const gltf=join(output,'model.gltf'), bin=join(output,'mesh.bin')
  await writeFile(gltf,JSON.stringify(model));await writeFile(bin,Buffer.from(buffer.buffer))
  await invoke('assets_import',{revision:state.revision,paths:[gltf],preview:false},true)
  state=await invoke('assets_import',{revision:state.revision,paths:[gltf,bin],preview:false})
  const imported=state.scene.assets.find(a=>a.name==='model.gltf')
  assert(!!imported,'MCP imports local GLTF with explicit companion bytes')
  state=await invoke('scene_apply',{revision:state.revision,preview:false,commands:[{op:'object.add',object:{id:'imported',prefab:imported.id,position:[-4,0,3],options:{glyph:'surface',surface:'stone'}}}]})
  const inspected=await invoke('object_inspect',{id:'imported'})
  assert(inspected.parts.some(p=>p.name==='blade'),'MCP inspects imported mesh parts')
  const capture=await invoke('editor_capture')
  await writeFile(join(output,'mcp-cena.png'),Buffer.from(capture.content[0].data,'base64'))
  assert(capture.content[0].mimeType==='image/png'&&capture.content[0].data.length>10000,'MCP returns actual rendered scene as image content')
  assert((await invoke('engine_reference',{topic:'catalog'})).some(asset=>asset.id==='blue-night'&&asset.kind==='atmosphere'),'MCP atmosphere appears in asset catalog')
  await invoke('editor_view',{cameraId:'wide'})
  assert((await invoke('object_inspect',{id:'wide'})).camera.name==='Plano MCP','MCP inspects a saved camera')
  const cameraCapture=await invoke('editor_capture')
  await writeFile(join(output,'mcp-camera.png'),Buffer.from(cameraCapture.content[0].data,'base64'))
  await check('MCP selects a saved composition camera', `document.querySelector('#app > canvas').dataset.cameraView==='Plano MCP' && engine.camera.position.x===10`)
  await invoke('editor_view',{cameraId:null})
  await invoke('editor_view',{studio:'effects'})
  const effectCapture=await invoke('editor_capture')
  await writeFile(join(output,'mcp-efeito-void.png'),Buffer.from(effectCapture.content[0].data,'base64'))
  assert(effectCapture.content[0].data.length>1000,'MCP captures the isolated effect stage')
  await check('API stage switch isolates preview', 'document.body.classList.contains("effect-studio-active") && !document.querySelector("#effect-preview").hidden')
  await invoke('editor_view',{studio:'scene'})
  const exported=join(output,'mcp-cenario.pomorog.json')
  await invoke('scene_export',{path:exported,overwrite:true})
  const data=JSON.parse(await readFile(exported,'utf8'))
  assert(data.activeCamera==='wide'&&data.cameras.wide.span===10&&data.atmospheres['blue-night'].style.moon.intensity===2.2&&data.effects['fx:custom-blue']&&data.assets[imported.id].source.startsWith('data:')&&data.waters[0].shape.mask.heights.length===65*65,'export embeds models, effects, atmosphere, terrain and slope water')
  await invoke('scene_export',{path:exported},true)
  assert(JSON.parse(await readFile(exported,'utf8')).name===data.name,'export refuses accidental file overwrite')
  state=await invoke('scene_open',{revision:state.revision,path:exported,preview:false})
  assert(JSON.stringify((await invoke('scene_read',{full:true})).document)===JSON.stringify(data),'export and reopen through MCP preserve complete document')
  const beforeHuman=state.revision
  await action(`document.querySelector('[data-k="name"]').value='Edição humana';document.querySelector('[data-k="name"]').dispatchEvent(new Event('change'))`)
  await invoke('scene_apply',{revision:beforeHuman,preview:false,commands:[{op:'scene.patch',patch:{name:'Overwrite'}}]},true)
  assert((await invoke('scene_read')).scene.name==='Edição humana','human UI edits advance revision and block stale AI writes')
  await shot('mcp-cena-editor')
  if(errors.length)throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  await client?.close();socket?.close();chrome.kill();await sleep(500)
  await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200})
}
