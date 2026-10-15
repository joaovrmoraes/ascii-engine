import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { WebSocketServer, WebSocket } from 'ws'
import { createReadStream } from 'node:fs'
import { createProjectExports } from './projectExport.ts'
// The schema entry keeps the transport independent of document rendering.
import { assertSafeJson, rpcSchema } from '@ascii-engine/authoring/schema'

const MAX_BYTES = 64 * 1024 * 1024
const origins = new Set(['http://localhost:1440', 'http://127.0.0.1:1440', 'tauri://localhost', 'http://tauri.localhost', 'https://tauri.localhost'])
const allowedOrigin = (origin?: string) => !origin || origins.has(origin)

/** Local transport only. Content operations remain in the browser/document layer. */
export async function startBridge(port = 1442) {
  const exports = createProjectExports()
  const sessions = new Map<string, { socket: WebSocket; name: string; revision: number; preview: boolean }>()
  const pending = new Map<string, { socket: WebSocket; resolve: (value: unknown) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>()
  const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_BYTES })
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    const reply = (status: number, value: unknown) => { if (!res.destroyed) { res.statusCode = status; res.end(JSON.stringify(value)) } }
    if (!allowedOrigin(req.headers.origin) || !['127.0.0.1', 'localhost', '[::1]'].includes((req.headers.host ?? '').replace(/:\d+$/, ''))) { reply(403, { error: 'The API only accepts local access from allowed origins.' }); return }
    if(req.headers.origin) {res.setHeader('Access-Control-Allow-Origin',req.headers.origin);res.setHeader('Vary','Origin')}
    if(req.method==='OPTIONS') {res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.statusCode=204;res.end();return}
    const download=req.url?.match(/^\/v1\/exports\/([a-f0-9-]+)\/download$/)
    if(req.method==='GET' && download) {
      const artifact=exports.artifact(download[1])
      if(!artifact) {reply(404,{error:'Export is not ready.'});return}
      res.setHeader('Content-Type',artifact.mime);res.setHeader('Content-Disposition',`attachment; filename="${artifact.filename}"`)
      createReadStream(artifact.artifact).on('error',()=>{if(!res.headersSent)reply(404,{error:'Export file is unavailable.'});else res.destroy()}).pipe(res);return
    }
    if (req.method === 'GET' && req.url === '/v1/sessions') { reply(200, [...sessions].map(([sessionId, s]) => ({ sessionId, name: s.name, revision: s.revision, preview: s.preview }))); return }
    if (req.method === 'GET' && req.url === '/health') { reply(200, { name: 'ascii-engine-authoring', version: 1 }); return }
    if (req.method !== 'POST' || req.url !== '/v1/request') { reply(404, { error: 'Use GET /v1/sessions or POST /v1/request.' }); return }
    if (!req.headers['content-type']?.startsWith('application/json')) { reply(415, { error: 'Send application/json.' }); return }
    try {
      const chunks: Buffer[] = []; let bytes = 0
      for await (const chunk of req) { bytes += chunk.length; if (bytes > MAX_BYTES) { reply(413, { error: '64 MB limit per request.' }); return }; chunks.push(Buffer.from(chunk)) }
      const input = JSON.parse(Buffer.concat(chunks).toString()); assertSafeJson(input)
      const { sessionId, request } = rpcSchema.parse(input)
      if(request.method==='project.export.status') {reply(200,{result:exports.status(request.jobId,sessionId)});return}
      const session = sessions.get(sessionId)
      if (!session || session.socket.readyState !== WebSocket.OPEN) { reply(404, { error: 'Editor disconnected. List sessions again.' }); return }
      const result = await new Promise<unknown>((resolve, reject) => {
        const id = randomUUID(), timer = setTimeout(() => { pending.delete(id); reject(new Error('Timed out waiting for the editor. Read the scene before retrying a change.')) }, 120000)
        pending.set(id, { socket: session.socket, resolve, reject, timer })
        session.socket.send(JSON.stringify({ type: 'request', id, request:request.method==='project.export' ? {method:'scene.read',full:true} : request }))
      })
      reply(200, { result:request.method==='project.export' ? exports.start(sessionId,result as {document:unknown;revision:number},request.target,request.title) : result })
    } catch (error) { reply(400, { error: error instanceof Error ? error.message : String(error) }) }
  })
  server.on('upgrade', (req, socket, head) => {
    if (req.url !== '/editor' || !req.headers.origin || !allowedOrigin(req.headers.origin)) { socket.destroy(); return }
    wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws))
  })
  wss.on('connection', socket => {
    let registered: string | undefined
    socket.on('message', data => {
      try {
        const message = JSON.parse(String(data))
        if (message.type === 'hello') {
          if (typeof message.sessionId !== 'string' || typeof message.name !== 'string' || !Number.isInteger(message.revision)) return
          if (registered && registered !== message.sessionId) return
          const existing = sessions.get(message.sessionId)
          if (existing && existing.socket !== socket) { socket.close(1008, 'Session already connected'); return }
          registered = message.sessionId
          sessions.set(registered!, { socket, name: message.name, revision: message.revision, preview: !!message.preview })
        } else if (message.type === 'result') {
          const call = pending.get(message.id)
          if (!call || call.socket !== socket) return
          clearTimeout(call.timer); pending.delete(message.id)
          if (message.error) call.reject(new Error(String(message.error))); else call.resolve(message.result)
        }
      } catch { socket.close(1008, 'Invalid message') }
    })
    socket.on('close', () => {
      if (registered && sessions.get(registered)?.socket === socket) sessions.delete(registered)
      for (const [id, call] of pending) if (call.socket === socket) { clearTimeout(call.timer); pending.delete(id); call.reject(new Error('Editor disconnected; check the revision before retrying.')) }
    })
  })
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => { server.removeListener('error', reject); resolve() }) })
  return { port: (server.address() as { port: number }).port, close: async () => { await exports.idle(); await new Promise<void>(resolve => { for (const client of wss.clients) client.terminate(); wss.close(); server.close(() => resolve()) }) } }
}
