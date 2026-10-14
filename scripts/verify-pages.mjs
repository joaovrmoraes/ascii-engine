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
  check(await evaluate(`['dark_forest', 'sunken_cathedral', 'rain_marsh', 'snow_pines', 'old_mine'].every(id =>
    !!document.querySelector('[data-demo-map="' + id + '"]')) &&
    document.querySelectorAll('[data-demo-map]').length === 5`),
    'gallery exposes exactly five map buttons')
  check(await evaluate('document.querySelectorAll("iframe").length === 1'),
    'gallery embeds one reusable demo frame')
  await evaluate('document.querySelector("#live-demo-frame").scrollIntoView({block:"center"})')
  await until(`document.querySelector('#live-demo-frame').contentWindow.area?.id === 'dark_forest' &&
    !!document.querySelector('#live-demo-frame').contentDocument.querySelector('canvas[data-ready]')`)
  check(await evaluate(`!document.querySelector('#live-demo-frame').contentDocument.querySelector('[data-k=area]') &&
    !new URL(document.querySelector('#live-demo-open').href).searchParams.has('embed')`),
    'embedded controls omit the area menu and the separate link opens the standalone viewer')
  const galleryURL = await evaluate('location.href')
  const ready = id => `document.querySelector('#live-demo-frame').contentWindow.area?.id === '${id}' &&
    !!document.querySelector('#live-demo-frame').contentDocument.querySelector('canvas[data-ready]')`
  for (const id of ['rain_marsh', 'snow_pines', 'old_mine', 'sunken_cathedral', 'dark_forest']) {
    await evaluate(`document.querySelector('[data-demo-map="${id}"]').click()`)
    await until(ready(id))
    check(await evaluate('location.href') === galleryURL &&
      await evaluate(`document.querySelector('[data-demo-map="${id}"]').getAttribute('aria-pressed') === 'true' &&
        new URL(document.querySelector('#live-demo-open').href).searchParams.get('area') === '${id}'`),
      `embedded ${id} switches without leaving the gallery`)
  }
  await evaluate(`document.querySelector('[data-demo-map=sunken_cathedral]').click()`)
  await until(ready('sunken_cathedral'))
  await evaluate(`const frame = document.querySelector('#live-demo-frame');
    const mode = frame.contentDocument.querySelector('[data-k=mode]');
    mode.value = 'letters'; mode.dispatchEvent(new Event('change'))`)
  await until(`document.querySelector('#live-demo-frame').contentWindow.location.search.includes('ascii=letters') &&
    ${ready('sunken_cathedral')}`)
  await until(`document.querySelector('[data-demo-map=sunken_cathedral]').getAttribute('aria-pressed') === 'true'`)
  check(await evaluate('location.href') === galleryURL,
    'embedded control reloads keep the selected map and gallery URL')
  await shot('gallery-cathedral')
  await evaluate(`document.querySelector('#live-demo-frame').contentDocument.querySelector('[data-k=pause]').click()`)
  check(await evaluate('document.querySelector("#live-demo-frame").contentWindow.view.paused'),
    'embedded viewer controls remain interactive')
  await evaluate(`document.querySelector('[data-demo-map=dark_forest]').click()`)
  await until(ready('dark_forest'))
  check(await evaluate(`document.querySelector('[data-demo-map=dark_forest]').getAttribute('aria-pressed') === 'true'`),
    'map buttons still switch after navigation inside the frame')
  await evaluate(`document.querySelector('[data-demo-map=rain_marsh]').focus()`)
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13,
    text: '\r', unmodifiedText: '\r',
  })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await until(ready('rain_marsh'))
  check(await evaluate(`document.querySelector('[data-demo-map=rain_marsh]').getAttribute('aria-pressed') === 'true'`),
    'keyboard activation switches the embedded map')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  })
  check(await evaluate('document.documentElement.scrollWidth <= innerWidth'),
    'embedded gallery fits a mobile viewport without horizontal overflow')
  await shot('gallery-mobile')
  await send('Emulation.clearDeviceMetricsOverride')

  await send('Page.navigate', { url: new URL('watch.html', base).href })
  await until('!!document.querySelector("#live-demo-frame")')
  await evaluate('document.querySelector("#live-demo-frame").scrollIntoView({block:"center"})')
  await until(ready('dark_forest'))
  check(await evaluate('document.querySelectorAll("[data-demo-map]").length === 5'),
    'the video gallery also embeds the five-map viewer')

  await openArea('dark_forest')
  check(await evaluate(`JSON.stringify(Array.from(document.querySelector('[data-k=area]').options,
    option => option.value)) === JSON.stringify(['dark_forest','rain_marsh','snow_pines','old_mine','sunken_cathedral'])`),
    'public area menu contains only the five requested maps')
  check(await evaluate(`!document.querySelector('[data-k=import]') &&
    !document.querySelector('[data-k=save]') && !document.querySelector('[data-k=load]') &&
    !document.querySelector('#selection') && !document.querySelector('#editor-workspace') &&
    !window.asciiEngineApi`),
    'public demos expose viewing controls without authoring tools')
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
  for (const id of ['rain_marsh', 'snow_pines', 'old_mine']) await openArea(id)
  for (const id of ['sandbox', 'effects', 'gltf', 'reference', 'terrain']) {
    await send('Page.navigate', { url: new URL(`sandbox/?area=${id}`, base).href })
    await until('window.area?.id === "dark_forest" && !!document.querySelector("canvas[data-ready]")')
    console.log(`PASS authoring URL ${id} falls back to the forest demo`)
  }

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
