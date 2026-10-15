/** Integration checks on the real WebGL editor, in an isolated browser profile. */
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-display-verification'
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-authoring-'))
const port = 9800 + Math.floor(Math.random() * 100)
const chrome = spawn(
  'chromium',
  [
    '--headless=new',
    '--no-sandbox',
    '--use-angle=gl',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--hide-scrollbars',
    '--window-size=1600,1000',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let targets
  for (let i = 0; i < 100 && !targets; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
    } catch {
      await sleep(100)
    }
  }
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => {
    socket.onopen = resolve
  })
  let id = 0
  const pending = new Map(),
    errors = []
  let interceptedDrag
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Input.dragIntercepted') interceptedDrag = data.params.data
    if (data.method === 'Runtime.exceptionThrown')
      errors.push(
        data.params.exceptionDetails.text +
          ': ' +
          data.params.exceptionDetails.exception?.description,
      )
    const request = pending.get(data.id)
    if (request) {
      clearTimeout(request.timer)
      pending.delete(data.id)
      data.error ? request.reject(new Error(data.error.message)) : request.resolve(data.result)
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const key = ++id,
        timer = setTimeout(() => {
          pending.delete(key)
          reject(new Error(`Timeout: ${method}`))
        }, 45000)
      pending.set(key, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: key, method, params }))
    })
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.exception?.description ?? response.exceptionDetails.text,
      )
    return response.result?.value
  }
  const until = async expression => {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return
      await sleep(100)
    }
    throw new Error(`Timed out: ${expression}`)
  }
  const action = async expression => {
    await evaluate(`(async () => { ${expression} })()`)
    await until('window.area && !area.state.includes("opening")')
    await sleep(200)
  }
  const check = async (title, expression) => {
    if (!(await evaluate(expression))) throw new Error(`FAIL: ${title}`)
    console.log(`PASS ${title}`)
  }
  const shot = async name => {
    await sleep(500)
    const result = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64'))
  }
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(
    `window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('change')); } }`,
  )
  for (const id of [
    'reference',
    'dark_forest',
    'rain_marsh',
    'snow_pines',
    'old_mine',
    'sunken_cathedral',
  ]) {
    await send('Page.navigate', {
      url: 'http://localhost:1440/?area=' + id + '&pause=0&peaceful=1',
    })
    await until(
      `!!window.area && area.id===${JSON.stringify(id)} && !!document.querySelector('canvas[data-ready]')`,
    )
    await evaluate(
      `window.displayMarker=crypto.randomUUID();window.displayStyle=JSON.stringify(engine.exportStyle());window.displayTechniques=[];engine.scene.traverse(node=>{if(node.userData.glyphResolved)displayTechniques.push([node.uuid,node.userData.glyphResolved.glyph])})`,
    )
    const marker = await evaluate('displayMarker')
    for (const mode of ['raw', 'screen', 'letters']) {
      await action(
        `const select=document.querySelector('#panel [data-k=mode]');select.value=${JSON.stringify(mode)};select.dispatchEvent(new Event('change'));engine.render(0)`,
      )
      await check(
        `${id} ${mode} is live debug without changing recipes`,
        `displayMarker===${JSON.stringify(marker)} && engine.renderMode===${JSON.stringify(mode === 'letters' ? 'glyphs' : mode)} && JSON.stringify(engine.exportStyle())===displayStyle && (()=>{const now=[];engine.scene.traverse(node=>{if(node.userData.glyphResolved)now.push([node.uuid,node.userData.glyphResolved.glyph])});return JSON.stringify(now)===JSON.stringify(displayTechniques)})()`,
      )
      if (id === 'sunken_cathedral' && mode === 'screen') await shot('display-debug-screen')
    }
  }
  await send('Page.navigate', { url: 'http://localhost:1440/?area=old_mine&ascii=screen&pause=0' })
  await until(
    `!!window.area && area.id==='old_mine' && !!document.querySelector('canvas[data-ready]')`,
  )
  await check(
    'old ascii=screen URL remains explicitly labeled legacy comparison',
    `document.querySelector('#panel [data-k=mode]').value==='legacy-screen' && document.querySelector('#panel [data-k=mode] option:checked').textContent==='Legacy screen comparison' && engine.renderMode==='glyphs' && document.querySelector('#app>canvas').dataset.legacyScreenComparison==='true'`,
  )
  await shot('legacy-screen-labeled')
  await evaluate(
    `document.querySelector('#panel [data-k=mode]').value='screen';document.querySelector('#panel [data-k=mode]').dispatchEvent(new Event('change'))`,
  )
  await until(
    `location.search.includes('ascii=debug-screen') && !!window.area && !!document.querySelector('canvas[data-ready]') && engine.renderMode==='screen'`,
  )
  await check(
    'leaving legacy comparison rebuilds the normal recipe and enables debug separately',
    `document.querySelector('#app>canvas').dataset.legacyScreenComparison==='false'`,
  )
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('PASS no uncaught page exceptions')
} finally {
  socket?.close()
  chrome.kill()
  await new Promise(resolve => {
    if (chrome.exitCode !== null) resolve()
    else chrome.once('exit', resolve)
  })
  await rm(profile, { recursive: true, force: true, maxRetries: 3 })
}
