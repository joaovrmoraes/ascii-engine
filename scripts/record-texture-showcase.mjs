/** Record the actual Texture Studio in isolated GPU Chromium; preserve the owner's draft. */
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const evidence = resolve(process.argv[2] ?? join(root, 'docs/captures/texture-pages-2026-10-14'))
const temporary = await mkdtemp(join(tmpdir(), 'ascii-texture-film-'))
const profile = join(temporary, 'profile'), framesDirectory = join(temporary, 'frames')
const video = join(root, '.cache/showcase/07-textures.mp4')
const gif = join(root, 'docs/showcase/gifs/07-textures.gif')
const poster = join(root, 'docs/showcase/posters/07-textures.png')
for (const path of [evidence, framesDirectory, join(root, '.cache/showcase'), join(root, 'docs/showcase/gifs'), join(root, 'docs/showcase/posters')]) await mkdir(path, { recursive: true })
const port = 11900 + Math.floor(Math.random() * 100)
const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,900', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let targets
  for (let attempt = 0; attempt < 100 && !targets; attempt++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(100) }
  }
  if (!targets) throw new Error('GPU Chromium did not start')
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => { socket.onopen = resolve })
  let id = 0, firstArrival = 0
  const pending = new Map(), frames = [], writes = [], errors = [], chapters = []
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text)
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push(data.params.args.map(value => value.value ?? value.description).join(' '))
    if (data.method === 'Page.screencastFrame') {
      firstArrival ||= performance.now()
      const file = join(framesDirectory, String(frames.length).padStart(6, '0') + '.jpg')
      frames.push({ file, timestamp: data.params.metadata.timestamp })
      writes.push(writeFile(file, Buffer.from(data.params.data, 'base64')))
      void send('Page.screencastFrameAck', { sessionId: data.params.sessionId }).catch(error => errors.push(error.message))
    }
    const request = pending.get(data.id)
    if (request) {
      clearTimeout(request.timer); pending.delete(data.id)
      data.error ? request.reject(new Error(data.error.message)) : request.resolve(data.result)
    }
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
  const until = async expression => {
    for (let attempt = 0; attempt < 150; attempt++) { if (await evaluate(expression)) return; await sleep(100) }
    throw new Error(`Timed out: ${expression}`)
  }
  const action = async expression => { await evaluate(`(async () => { ${expression} })()`); await sleep(250) }
  const shot = async name => {
    const result = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(join(evidence, name + '.png'), Buffer.from(result.data, 'base64'))
  }
  const chapter = async (title, detail) => {
    const start = Math.max(0, (performance.now() - firstArrival) / 1000)
    chapters.push({ start, title, detail }); console.log(`${start.toFixed(1)}s: ${title}`)
  }
  await send('Page.enable'); await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await action(`window.ui=(selector,value)=>{const element=document.querySelector(selector);if(!element)throw new Error(selector);if(value===undefined)element.click();else{element.value=value;element.dispatchEvent(new Event('input'));element.dispatchEvent(new Event('change'));}};
    window.tf=(key,value)=>ui('[data-texture-field="'+key+'"]',value);
    window.tx=(key,value)=>ui('[data-texture="'+key+'"]',value);
    window.tl=(key,value)=>ui('[data-texture-light="'+key+'"]',value);
    window.group=key=>document.querySelector('[data-texture-section="'+key+'"]').scrollIntoView({block:'start',behavior:'instant'});
    await area.openDocument({version:1,name:'Texture Studio showcase',style:{background:0x15202b},objects:[{id:'tree',prefab:'arvore',name:'Tree',position:[0,0,0]}]});
    ui('#hierarchy [data-object-id="tree"]'); window.sourceBefore=JSON.stringify(area.document()); ui('[data-k="create-texture"]');`)
  await until('document.querySelector("#texture-preview canvas").dataset.ready==="tree"')
  await send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1600, maxHeight: 900, everyNthFrame: 2 })
  while (!firstArrival) await sleep(50)

  await chapter('Select an object or named part', 'Work on a tree crown while the trunk keeps its own appearance.')
  await sleep(1500); await action(`tx('part','crown')`); await sleep(1800)
  await shot('01-object-and-part')
  await chapter('Choose letters and fonts', 'Custom alphabets, Unicode symbols and installed regular or bold fonts.')
  await action(`group('letters')`); await sleep(1200)
  await action(`ui('[data-texture-pattern="arrows"]')`); await sleep(1500)
  await action(`tf('font','"DejaVu Sans", sans-serif');tf('fontWeight','700');group('letters')`); await sleep(2000)
  await shot('02-letters-and-fonts')
  await chapter('Adjust size, spacing and rotation', 'Letters remain attached to the model as you refine their layout.')
  await action(`group('size-and-spacing')`); await sleep(1000)
  for (const size of [.22, .26, .30]) { await action(`tf('size','${size}')`); await sleep(300) }
  await action(`tf('spacing','1.4');tf('rotation','15');tf('density','.8')`); await sleep(1800)
  await shot('03-layout')
  await chapter('Show only the letters', 'Remove the solid body so the background shows through the gaps.')
  await action(`tf('open','false');group('letter-visibility')`); await sleep(2000)
  await action(`tf('open','true');group('letter-visibility')`); await sleep(2000)
  await shot('04-letters-only')
  await chapter('Shape the ink and colors', 'Tune contrast and use a palette from shadow to light.')
  await action(`group('ink-and-contrast');tf('color','#73d6a0');tf('strength','1.25');tf('contrast','1.3')`); await sleep(1700)
  await action(`ui('[data-texture-field="palette-enabled"]');ui('[data-texture-palette="0"]','#447e75');ui('[data-texture-palette="1"]','#c6ffbe');group('color-palette')`); await sleep(2000)
  await shot('05-color-palette')
  await chapter('Light the preview', 'Change light color and direction; scene lighting stays separate.')
  await action(`tx('custom-lighting');tl('main-intensity','2');group('preview-lighting')`); await sleep(1500)
  await action(`tl('main-color','#ff8a66');tl('azimuth','-55')`); await sleep(2000)
  await action(`tl('main-color','#62efae');tl('azimuth','35')`); await sleep(2000)
  await shot('06-preview-lights')
  if (!await evaluate('JSON.stringify(area.document())===sourceBefore')) throw new Error('Preview changed the source scene')
  await chapter('Apply and save a reusable texture', 'Apply to the selected part, save to Assets and reuse the recipe.')
  await action(`document.querySelector('#texture-studio').scrollTop=0;tx('name','Emerald arrows')`); await sleep(1200)
  await action(`tx('apply')`); await until('area.document().objects[0].options.parts.crown.alphabet.includes("↑")')
  await action(`tx('save')`); await until('Object.values(area.document().textures??{}).some(texture=>texture.name==="Emerald arrows")')
  await sleep(1700); await shot('07-saved-texture')
  await action(`tx('reveal')`); await sleep(2200); await shot('08-texture-library')
  const document = await evaluate('area.document()')
  if (!Object.values(document.textures).some(texture => texture.previewLighting && texture.style.open)) throw new Error('Saved texture omitted letters-only mode or preview lights')
  await writeFile(join(evidence, 'showcase.ascii.json'), JSON.stringify(document, null, 2) + '\n')
  await send('Page.stopScreencast'); await Promise.all(writes)
  if (errors.length) throw new Error(errors.join('\n'))
  if (frames.length < 60) throw new Error('Insufficient screencast frames')

  const lines = ['ffconcat version 1.0']
  for (let index = 0; index < frames.length; index++) {
    lines.push(`file '${frames[index].file}'`)
    lines.push(`duration ${index + 1 < frames.length ? Math.max(.001, frames[index + 1].timestamp - frames[index].timestamp) : .08}`)
  }
  lines.push(`file '${frames.at(-1).file}'`)
  const concat = join(temporary, 'frames.ffconcat'); await writeFile(concat, lines.join('\n') + '\n')
  const run = (command, args) => {
    const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
    if (result.status !== 0) throw new Error(`${command}: ${result.error ?? result.stderr}`)
    return result.stdout
  }
  const ffmpeg = args => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-threads', '2', '-filter_threads', '1', ...args])
  const font = '/usr/share/fonts/ttf-ia-writer/iAWriterDuoS-Regular.ttf'
  let textIndex = 0
  const textFilter = async (text, size, x, y, color, enable = '1') => {
    const file = join(temporary, `caption-${textIndex++}.txt`); await writeFile(file, text)
    return `drawtext=fontfile=${font}:textfile=${file}:fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}:enable='${enable}'`
  }
  const filters = ['fps=30', 'pad=1920:1080:160:90:color=0x0b0e0d',
    await textFilter('ASCII ENGINE', 23, 54, 34, '#edf0e6'),
    await textFilter('07 / TEXTURE STUDIO', 25, 1320, 34, '#83deb2')]
  for (let index = 0; index < chapters.length; index++) {
    const { start, title, detail } = chapters[index], end = chapters[index + 1]?.start ?? 999
    const enable = `gte(t,${start.toFixed(3)})*lt(t,${end.toFixed(3)})`
    filters.push(await textFilter(title, 24, 160, 1000, '#83deb2', enable), await textFilter(detail, 19, 160, 1034, '#c5cdc7', enable))
  }
  console.log(`Encoding ${frames.length} actual browser frames...`)
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', concat, '-vf', filters.join(','), '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-maxrate', '4000k', '-bufsize', '8000k', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-an', '-movflags', '+faststart', '-y', video])
  ffmpeg(['-ss', String(chapters[5].start + 3), '-i', video, '-frames:v', '1', '-update', '1', '-y', poster])
  const transform = 'fps=8,scale=800:-1:flags=lanczos'
  ffmpeg(['-ss', String(chapters[5].start + 1.5), '-t', '4', '-i', video, '-filter_complex_threads', '1', '-filter_complex', `${transform},split[a][b];[a]palettegen=stats_mode=diff:max_colors=128[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`, '-loop', '0', '-an', '-y', gif])
  const probe = file => JSON.parse(run('ffprobe', ['-v', 'error', '-count_frames', '-show_entries', 'stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_read_frames:format=duration,size', '-of', 'json', file]))
  const videoInfo = probe(video), gifInfo = probe(gif)
  if (videoInfo.streams[0].width !== 1920 || videoInfo.streams[0].height !== 1080 || Number(videoInfo.format.duration) < 30) throw new Error('Unexpected video dimensions/duration')
  if (Number(gifInfo.streams[0].nb_read_frames) !== 32 || (await stat(gif)).size > 5 * 1024 * 1024) throw new Error('Unexpected GIF animation/size')
  for (const file of [video, gif]) ffmpeg(['-xerror', '-i', file, '-f', 'null', '-'])
  await writeFile(join(evidence, 'recording.json'), JSON.stringify({ origin: 'Actual GPU Chromium screencast of the English editor in an isolated profile', frames: frames.length, chapters, video: videoInfo, gif: gifInfo, sourceIsolated: true, savedPartAndAsset: true, runtimeErrors: errors, fullDecode: 'passed' }, null, 2) + '\n')
  console.log(`PASS real editor recording, isolated preview, saved part/asset, 32-frame GIF and full MP4/GIF decode (${(Number(videoInfo.format.size)/1048576).toFixed(1)} MiB video).`)
} finally {
  socket?.close(); chrome.kill(); await sleep(500)
  await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
