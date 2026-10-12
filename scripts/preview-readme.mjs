// Local README preview with a player for each feature video.
// Usage: node scripts/preview-readme.mjs [porta=4178]
import { createServer } from 'node:http'
import { createReadStream, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = join(root, 'docs/showcase/index.html')
const escape = text => text.replace(/[&<>\"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])
const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Renders the syntax used by this README without extra dependencies.
function inline(text) {
  const tokens = []
  const token = html => { tokens.push(html); return `\u0000${tokens.length - 1}\u0000` }
  text = text.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+\.mp4)\)/g, (_, label, poster, src) =>
    token(`<video controls playsinline preload="none" poster="${escape(poster)}" aria-label="${escape(label)}" src="${escape(src)}"><a href="${escape(src)}">${escape(label)}</a></video>`))
  text = text.replace(/`([^`]+)`/g, (_, code) => token(`<code>${escape(code)}</code>`))
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, label, src) => token(`<img loading="lazy" src="${escape(src)}" alt="${escape(label)}">`))
  text = text.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (_, label, href) => token(`<a href="${escape(href)}">${escape(label)}</a>`))
  return escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[index])
}
function render(markdown) {
  const blocks = [], paragraph = [], list = [], code = []
  let fenced = false
  const flush = () => {
    if (paragraph.length) blocks.push(`<p>${inline(paragraph.splice(0).join(' '))}</p>`)
    if (list.length) blocks.push(`<ul>${list.splice(0).map(item => `<li>${inline(item)}</li>`).join('')}</ul>`)
  }
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) {
      flush()
      if (fenced) { blocks.push(`<pre><code>${escape(code.splice(0).join('\n'))}</code></pre>`); fenced = false }
      else fenced = true
      continue
    }
    if (fenced) { code.push(line); continue }
    if (!line.trim()) { flush(); continue }
    const heading = /^(#{1,6}) (.+)$/.exec(line)
    if (heading) { flush(); const level = heading[1].length; blocks.push(`<h${level} id="${slug(heading[2])}">${inline(heading[2])}</h${level}>`); continue }
    if (line.startsWith('- ')) { if (paragraph.length) flush(); list.push(line.slice(2)); continue }
    if (list.length && line.startsWith('  ')) { list[list.length - 1] += ' ' + line.trim(); continue }
    if (list.length) flush()
    paragraph.push(line)
  }
  flush()
  return blocks.join('\n')
}

function generate() {
  const body = render(readFileSync(join(root, 'README.md'), 'utf8'))
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="../../"><title>ASCII Engine — README</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#0d1117;color:#e6edf3;font:16px/1.65 system-ui,-apple-system,sans-serif}main{max-width:1080px;margin:32px auto;padding:40px 48px;border:1px solid #30363d;border-radius:8px}header{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:#919ba7;font-size:13px;border-bottom:1px solid #30363d;padding-bottom:18px;margin-bottom:28px}h1{font-size:40px;letter-spacing:-1.2px;margin:0 0 14px}h2{font-size:26px;margin:48px 0 16px;padding-bottom:10px;border-bottom:1px solid #30363d}h3{font-size:22px;margin:42px 0 12px}p{margin:14px 0}a{color:#8bbaff;text-decoration:none}a:hover{text-decoration:underline}img,video{display:block;width:100%;height:auto;border-radius:6px;background:#050708}video{border:1px solid #30363d;aspect-ratio:16/9}code{font:14px/1.6 ui-monospace,monospace;background:#20262e;padding:3px 6px;border-radius:4px}pre{padding:18px 20px;overflow:auto;border-radius:6px;background:#161b22}pre code{padding:0;background:none}li{margin:7px 0}ul{padding-left:24px}nav{display:flex;flex-wrap:wrap;gap:8px 20px;margin:20px 0;font-size:14px}h1+p{font-size:22px}h1+p strong{font-weight:500}h3+ p{color:#b4beca}@media(max-width:700px){main{margin:0;border:0;border-radius:0;padding:24px 18px}h1{font-size:34px}h2{font-size:23px}header{font-size:12px}}
</style></head><body><main><header><span>ASCII ENGINE / README PREVIEW</span><a href="README.md">Open Markdown</a></header>
<nav aria-label="Videos"><a href="#01-terrain">Terrain</a><a href="#02-water-paths-and-wind">Water and wind</a><a href="#03-objects-and-composition">Objects</a><a href="#04-effects-and-lighting">Effects</a><a href="#05-atmosphere">Atmosphere</a><a href="#06-cameras-preview-and-export">Cameras and export</a></nav>
${body}</main><script>document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()})));</script></body></html>\n`)
}
generate()
if (process.argv.includes('--generate-only')) process.exit(0)
const port = Number(process.argv[2] ?? 4178)
const types = { '.html': 'text/html; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.png': 'image/png', '.mp4': 'video/mp4', '.json': 'application/json', '.svg': 'image/svg+xml' }
createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (pathname.split('/').some(part => part.startsWith('.') && part !== '')) throw new Error('Hidden path')
    const path = resolve(root, `.${pathname === '/' ? '/docs/showcase/index.html' : pathname}`)
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Path outside project')
    if (path === output) generate()
    const stat = statSync(path)
    if (stat.isDirectory()) {
      const entries = readdirSync(path).map(name => `<li><a href="${encodeURIComponent(name)}">${escape(name)}</a></li>`).join('')
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(`<!doctype html><meta charset="utf-8"><ul>${entries}</ul>`); return
    }
    const headers = { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' }
    const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range ?? '')
    let start = 0, end = stat.size - 1, status = 200
    if (range) {
      start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), end) : end
      if (start > end) { response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); response.end(); return }
      status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`
    }
    headers['Content-Length'] = end - start + 1
    response.writeHead(status, headers)
    if (request.method === 'HEAD') response.end()
    else createReadStream(path, { start, end }).pipe(response)
  } catch { response.writeHead(404); response.end('File not found') }
}).listen(port, '127.0.0.1', () => console.log(`README preview: http://localhost:${port}/docs/showcase/index.html`))
