/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile, rm, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname } from 'node:path'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-export-verification'
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-authoring-'))
const port = 9800 + Math.floor(Math.random() * 100)
const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,1000', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket, staticServer
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
  await until('!!window.asciiEngineApi')
  await action(`await area.openDocument({version:1,name:'Export fixture',objects:[{id:'block',prefab:'bloco',position:[0,0,0],options:{texture:'ink'}}],textures:{ink:{name:'Export ink',style:{alphabet:'XZ',color:0x66bb99}}},waters:[{name:'Hidden lake',visible:false,shape:{kind:'pond',x:0,z:0,size:2,angle:0}}]}); await area.authoring.commit()`)
  const expected=await evaluate('area.document()')
  const jobs={}
  const titles={web:'--desktop',desktop:'--scene'}
  for(const target of ['web','desktop']) {
    await action(`ui('[data-k=export]');ui('[data-export=target]',${JSON.stringify(target)});ui('[data-export=title]',${JSON.stringify(titles[target])});ui('[data-export=start]')`)
    await until(`!!sessionStorage.getItem('ascii-project-export') && JSON.parse(sessionStorage.getItem('ascii-project-export')).target===${JSON.stringify(target)}`)
    const initial=await evaluate(`JSON.parse(sessionStorage.getItem('ascii-project-export'))`)
    await check(`${target} packaging queues without mutating the scene`, `JSON.stringify(area.document())===${JSON.stringify(JSON.stringify(expected))}`)
    await shot('export-'+target+'-building')
    await action(`ui('[data-export=close]')`)
    if(target==='web') {
      await send('Page.reload')
      await until('!!window.area && !!window.asciiEngineApi && !!document.querySelector("canvas[data-ready]")')
      await until(`!!window.asciiEngineApi && window.asciiEngineApi.sessionId!==${JSON.stringify(initial.sessionId)}`)
      await evaluate(`window.ui=(selector,value)=>{const el=document.querySelector(selector);if(value===undefined)el.click();else{el.value=value;el.dispatchEvent(new Event('change'))}}`)
    }
    let job
    for(let i=0;i<600;i++) {
      const response=await fetch('http://127.0.0.1:1442/v1/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:initial.sessionId,request:{method:'project.export.status',jobId:initial.id}})})
      const result=await response.json();if(!response.ok)throw new Error(JSON.stringify(result))
      job=result.result
      if(job.status==='failed')throw new Error(job.error)
      if(job.status==='ready')break
      if(i%30===0) console.log(`BUILD ${target}: ${job.status}`)
      await sleep(1000)
    }
    if(job?.status!=='ready')throw new Error('Build timed out')
    jobs[target]=job
    console.log('PASS '+target+' build ready')
    if(target==='web' && await stat(join(job.result.directory,'tauri.game.conf.json')).then(()=>true,()=>false))throw new Error('Literal --desktop title was treated as a flag')
    console.log('PASS literal flag-like title '+titles[target]+' is preserved without changing the target')
    const archive=await fetch('http://127.0.0.1:1442/v1/exports/'+job.id+'/download')
    if(!archive.ok || archive.headers.get('content-type')!=='application/zip')throw new Error('Invalid download')
    await writeFile(join(output,job.result.filename),Buffer.from(await archive.arrayBuffer()))
    const listing=spawnSync('unzip',['-l',job.result.artifact],{encoding:'utf8'})
    if(listing.status!==0||!listing.stdout.includes('web/scene.json'))throw new Error('Invalid archive')
    const scene=JSON.parse(await readFile(join(job.result.web,'scene.json'),'utf8'))
    if(JSON.stringify(scene)!==JSON.stringify(expected))throw new Error('Export changed scene')
    if(target==='desktop') {
      const executable=join(job.result.directory,'desktop','scene')
      if(!((await stat(executable)).mode & 0o111))throw new Error('Desktop executable permission missing')
      if(!listing.stdout.includes('desktop/scene'))throw new Error('Desktop binary absent')
    }
    await action(`ui('[data-k=export]')`)
    await until(`document.querySelector('[data-export=status]').textContent.startsWith('Ready')`)
    await check(`${target} ready download is available in the dialog`, `!document.querySelector('[data-export=download]').hidden`)
    await shot('export-'+target+'-ready')
    await action(`ui('[data-export=close]')`)
  }
  await writeFile(join(output,'jobs.json'),JSON.stringify(jobs,null,2))
  staticServer=createServer(async(req,res)=>{
    try {
      const path=new URL(req.url,'http://localhost').pathname.replace(/^\/demo\//,'') || 'index.html'
      if(path.includes('..'))throw new Error('Invalid path')
      const file=join(jobs.web.result.web,path)
      const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json'}
      res.setHeader('Content-Type',types[extname(file)]??'application/octet-stream');res.end(await readFile(file))
    }catch{res.statusCode=404;res.end()}
  })
  await new Promise(resolve=>staticServer.listen(0,'127.0.0.1',resolve))
  await send('Page.navigate',{url:`http://127.0.0.1:${staticServer.address().port}/demo/`})
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await check('exported Web player runs from a relative subfolder without editor UI', `document.body.classList.contains('player') && !document.querySelector('#editor-workspace') && document.title==='--desktop'`)
  await check('player preserves linked recipes and hidden water', `area.document().textures.ink.style.alphabet==='XZ' && area.document().waters[0].visible===false && engine.scene.children.some(o=>o.name==='Hidden lake'&&!o.visible)`)
  await shot('export-web-player')
  if(errors.length)throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  if(staticServer)await new Promise(resolve=>staticServer.close(resolve))
  socket?.close();chrome.kill()
  await new Promise(resolve=>{if(chrome.exitCode!==null)resolve();else chrome.once('exit',resolve)})
  await rm(profile,{recursive:true,force:true,maxRetries:3})
}
