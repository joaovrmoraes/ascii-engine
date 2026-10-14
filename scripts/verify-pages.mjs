/** Exercise the production Pages artifact and public deployment in isolated GPU Chromium. */
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const base = new URL(process.argv[2] ?? 'https://joaovrmoraes.github.io/ascii-engine/')
const output = process.argv[3] ?? '/tmp/ascii-pages-verification'
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-pages-'))
const port = 9800 + Math.floor(Math.random() * 100)
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu',
  '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,1000',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket

try {
  let targets
  for (let i = 0; i < 100 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() }
    catch { await sleep(100) }
  }
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => { socket.onopen = resolve })
  let id = 0
  const pending = new Map(), errors = [], failed = [], sockets = []
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text)
    }
    if (data.method === 'Network.responseReceived' && data.params.response.status >= 400) {
      failed.push(data.params.response.url)
    }
    if (data.method === 'Network.webSocketCreated') sockets.push(data.params.url)
    const request = pending.get(data.id)
    if (!request) return
    clearTimeout(request.timer); pending.delete(data.id)
    if (data.error) request.reject(new Error(data.error.message))
    else request.resolve(data.result)
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id
    const timer = setTimeout(() => {
      pending.delete(key); reject(new Error(`Timeout: ${method}`))
    }, 45000)
    pending.set(key, { resolve, reject, timer })
    socket.send(JSON.stringify({ id: key, method, params }))
  })
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', {
      expression, awaitPromise: true, returnByValue: true,
    })
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text)
    }
    return response.result?.value
  }
  const until = async expression => {
    for (let i = 0; i < 200; i++) {
      if (await evaluate(expression)) return
      await sleep(100)
    }
    throw new Error(`Timed out: ${expression}`)
  }
  const check = (condition, title) => {
    if (!condition) throw new Error(`FAIL ${title}`)
    console.log(`PASS ${title}`)
  }
  const shot = async name => {
    const capture = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(join(output, name + '.png'), Buffer.from(capture.data, 'base64'))
  }
  const openArea = async area => {
    await send('Page.navigate', { url: new URL(`sandbox/?area=${area}`, base).href })
    await until(`window.area?.id === ${JSON.stringify(area)} && !!document.querySelector('canvas[data-ready]')`)
    await sleep(400)
    check(await evaluate('!document.body.classList.contains("player")'), `${area} retains sandbox controls`)
    // Editor overlays reset Three's counters; inspect a direct world render.
    check(await evaluate('(() => { engine.render(0, {redraw:true}); return engine.renderer.info.render.calls > 0 })()') &&
      (area === 'sandbox' || await evaluate('engine.scene.children.length > 0')),
      `${area} renders real WebGL content beneath the project path`)
  }

  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable')
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Page.navigate', { url: base.href })
  await until('!!document.querySelector("#try-in-your-browser")')
  check(await evaluate('document.querySelectorAll("video").length === 7'), 'gallery retains seven video chapters')
  check(await evaluate(`['dark_forest', 'sunken_cathedral', 'sandbox'].every(id =>
    !!document.querySelector('#try-in-your-browser + p + ul a[href$="?area=' + id + '"]'))`),
    'gallery exposes direct forest, cathedral and scene editor links')
  await shot('gallery')

  await openArea('dark_forest')
  await shot('dark-forest')
  await evaluate('document.querySelector("[data-k=pause]").click()')
  check(await evaluate('view.paused'), 'visitors can pause the forest demo')
  await evaluate(`const rotation = document.querySelector('[data-k=angle]');
    rotation.value = '.81'; rotation.dispatchEvent(new Event('input'))`)
  check(await evaluate('Math.abs(view.angle - .81) < .001'), 'visitors can rotate the demo camera')
  await evaluate(`const light = document.querySelector('[data-k=light]');
    light.value = '1.2'; light.dispatchEvent(new Event('input'))`)
  check(await evaluate('Math.abs(engine.style.brightness - 1.2) < .001'), 'visitors can adjust demo lighting')

  await evaluate(`const menu = document.querySelector('[data-k=area]');
    menu.value = 'sunken_cathedral'; menu.dispatchEvent(new Event('change'))`)
  await until('window.area?.id === "sunken_cathedral" && !!document.querySelector("canvas[data-ready]")')
  check(await evaluate('location.pathname.endsWith("/sandbox/") && location.search.includes("sunken_cathedral")'),
    'area switching preserves the hosted subdirectory and shareable URL')
  await shot('sunken-cathedral')
  for (const id of ['rain_marsh', 'snow_pines', 'old_mine', 'sandbox']) await openArea(id)

  await until('!!window.asciiEngineApi')
  await evaluate(`(async () => {
    const state = await asciiEngineApi.request({method:'scene.read'});
    await asciiEngineApi.request({method:'scene.apply',revision:state.revision,preview:false,
      commands:[{op:'scene.replace',document:{version:1,name:'Public sandbox check',
        objects:[{id:'public-block',prefab:'bloco',position:[0,0,0],scale:3}]}}]});
  })()`)
  check(await evaluate('area.document().objects[0].id === "public-block"'),
    'production scene editor supports document authoring without a bridge')
  await evaluate(`document.querySelector('[data-object-id="public-block"]').click();
    document.querySelector('[data-k="create-texture"]').click()`)
  await until('document.querySelector("#texture-preview canvas")?.dataset.ready === "public-block"')
  check(await evaluate('document.body.classList.contains("texture-studio-active")'),
    'production Texture Studio opens its isolated preview')
  await evaluate(`const alphabet = document.querySelector('[data-texture-field=alphabet]');
    alphabet.value = 'XYZ'; alphabet.dispatchEvent(new Event('input'));
    alphabet.dispatchEvent(new Event('change'));
    document.querySelector('[data-texture=apply]').click()`)
  await until('area.document().objects[0].options?.alphabet === "XYZ"')
  console.log('PASS public Texture Studio applies custom letters to a scene object')
  await shot('texture-studio')
  await evaluate(`document.querySelector('[data-k="close-studio"]').click();
    document.querySelector('[data-k="undo"]').click()`)
  await until('!area.document().objects[0].options?.alphabet')
  console.log('PASS public editor undoes the texture change')
  await sleep(500)
  const saved = await evaluate('JSON.stringify(area.document())')
  await send('Page.reload')
  await until('window.area?.id === "sandbox" && !!window.asciiEngineApi')
  check(await evaluate('JSON.stringify(area.document())') === saved,
    'public editor restores the saved draft after a reload')

  check(sockets.length === 0, 'public sandbox never attempts a local WebSocket connection')
  check(failed.length === 0, 'gallery and all demos load without failed HTTP responses' +
    (failed.length ? ': ' + failed.join(', ') : ''))
  check(errors.length === 0, 'no uncaught production page exceptions' +
    (errors.length ? ': ' + errors.join('\n') : ''))
  await writeFile(join(output, 'result.json'), JSON.stringify({ base: base.href, failed, errors, sockets }, null, 2))
} finally {
  socket?.close(); chrome.kill()
  await rm(profile, { recursive: true, force: true }).catch(() => {})
}
