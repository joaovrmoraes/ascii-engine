// Sequência de capturas do jogo em Chromium headless com GPU, via CDP.
// Uso: node cdpshot.mjs <url> <prefixo-saida> [esperaMs=8000] [quantidade=1] [intervaloMs=1000]
// Opcional: PRE='js' roda 3,5 s após abrir (ex.: clicar em uma área da demo);
//           EXPR='js' é avaliado e impresso antes de cada captura (estado/pose).
// Alguns quadros podem sair pretos (temporização do compositor): descarte-os.
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const [url, out, first = '8000', count = '1', every = '1000'] = process.argv.slice(2)
if (!url || !out) {
  console.error('uso: node cdpshot.mjs <url> <prefixo> [esperaMs] [quantidade] [intervaloMs]')
  process.exit(1)
}
const port = 9300 + Math.floor(Math.random() * 500)
// --use-angle=gl usa a GPU real. Swiftshader roda a ~2 FPS e quebra o combate.
const chrome = spawn(
  'chromium',
  [
    '--headless=new',
    '--no-sandbox',
    '--use-angle=gl',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--hide-scrollbars',
    '--window-size=1600,900',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${out}-prof`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const sleep = ms => new Promise(r => setTimeout(r, ms))
let targets
for (let i = 0; i < 50 && !targets; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
  } catch {
    await sleep(200)
  }
}
const page = targets.find(t => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r => {
  ws.onopen = r
})
let id = 0
const pending = new Map()
ws.onmessage = m => {
  const d = JSON.parse(m.data)
  if (
    d.method === 'Runtime.exceptionThrown' ||
    (d.method === 'Runtime.consoleAPICalled' && /error|warn/.test(d.params.type))
  )
    console.log('PAGE', JSON.stringify(d.params).slice(0, 600))
  if (pending.has(d.id)) {
    pending.get(d.id)(d)
    pending.delete(d.id)
  }
}
const send = (method, params = {}) =>
  new Promise(r => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Runtime.enable')
await send('Page.enable')
await send('Page.bringToFront')
await send('Emulation.setFocusEmulationEnabled', { enabled: true })
await send('Page.navigate', { url })
if (process.env.PRE) {
  await sleep(3500)
  await send('Runtime.evaluate', { expression: process.env.PRE })
}
await sleep(Number(first))
for (let i = 0; i < Number(count); i++) {
  if (process.env.EXPR)
    console.log(
      'state',
      (await send('Runtime.evaluate', { expression: process.env.EXPR })).result?.result?.value,
    )
  const r = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${out}-${String(i).padStart(2, '0')}.png`, Buffer.from(r.result.data, 'base64'))
  if (i < count - 1) await sleep(Number(every))
}
chrome.kill()
process.exit(0)
