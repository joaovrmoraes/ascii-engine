// Comparação de imagens automática (fase 4): captura vistas fixas do editor em
// Chromium sem janela (GPU, --use-angle=gl) e compara com a base salva em
// docs/captures/baseline/ usando ImageMagick (`magick compare -metric RMSE`).
//
// Uso: node scripts/compare.mjs [--update] [nome...]
//   --update  grava as capturas atuais como nova base
//   nome      só estas vistas (padrão: todas)
// Saída: tabela com o erro RMSE normalizado (0 = idêntico) e as imagens de
// diferença em docs/captures/diff/. Sai com código 1 se alguma passar do limite.
// Requer o editor rodando (pnpm dev, porta 1440) e o `magick` no PATH.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const BASE = process.env.EDITOR_URL ?? 'http://localhost:1440'
// Cenas congeladas em `pause` segundos: o tempo da engine para e a imagem fica estável.
// `limit`: largest RMSE accepted. Rain rings start when a drop's phase wraps
// between two frames, so the marsh varies with the frame rate.
const VIEWS = {
  referencia: { path: '/?area=reference&pause=3' },
  floresta: { path: '/?area=dark_forest&pause=5&peaceful=1' },
  pantano: { path: '/?area=rain_marsh&pause=6', limit: .2 },
  neve: { path: '/?area=snow_pines&pause=6' },
  mina: { path: '/?area=old_mine&pause=5' },
  catedral: { path: '/?area=sunken_cathedral&pause=5' },
}
const LIMIT = Number(process.env.LIMIT ?? .04)
const args = process.argv.slice(2), update = args.includes('--update')
const names = args.filter((a) => !a.startsWith('--'))
const root = new URL('..', import.meta.url).pathname
const baseline = join(root, 'docs/captures/baseline'), diffs = join(root, 'docs/captures/diff')
mkdirSync(baseline, { recursive: true }); mkdirSync(diffs, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function capture(url, out) {
  const port = 9300 + Math.floor(Math.random() * 500), profile = join(tmpdir(), `compare-${port}`)
  const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars',
    '--window-size=1600,900', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
  try {
    let targets
    for (let i = 0; i < 50 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(200) } }
    const page = targets.find((t) => t.type === 'page')
    const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r })
    let id = 0; const pending = new Map()
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } }
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
    await send('Page.enable'); await send('Page.navigate', { url })
    // Wait until the engine time reached the pause.
    for (let i = 0; i < 60; i++) {
      await sleep(500)
      const r = await send('Runtime.evaluate', { expression: "window.engine && window.view ? engine.time >= view.pauseAt - 1e-6 : false", returnByValue: true })
      if (r.result?.result?.value) break
    }
    await sleep(800)
    // The panel is UI, not scene: hide it for the comparison.
    await send('Runtime.evaluate', { expression: "for (const id of ['panel','status','selection']) document.getElementById(id)?.style.setProperty('visibility','hidden')" })
    await sleep(200)
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
    ws.close()
  } finally {
    chrome.kill()
    // Chromium may still be flushing its profile: removal is best effort.
    await sleep(300)
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }) } catch { /* left for the OS */ }
  }
}

let failed = 0
for (const [name, { path, limit = LIMIT }] of Object.entries(VIEWS)) {
  if (names.length && !names.includes(name)) continue
  const current = join(diffs, `${name}-atual.png`), base = join(baseline, `${name}.png`)
  await capture(BASE + path, current)
  if (update || !existsSync(base)) { copyFileSync(current, base); console.log(`${name.padEnd(10)} base gravada`); continue }
  const result = spawnSync('magick', ['compare', '-metric', 'RMSE', base, current, join(diffs, `${name}-diferenca.png`)], { encoding: 'utf8' })
  const match = /\(([\d.e-]+)\)/.exec(result.stderr) ?? /\(([\d.e-]+)\)/.exec(result.stdout)
  const error = match ? Number(match[1]) : NaN
  const ok = error <= limit
  if (!ok) failed++
  console.log(`${name.padEnd(10)} RMSE ${Number.isFinite(error) ? error.toFixed(4) : result.stderr.trim()}  ${ok ? 'ok' : `ACIMA DO LIMITE ${limit}`}`)
}
process.exit(failed ? 1 : 0)
