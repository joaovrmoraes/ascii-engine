import { expect, it } from 'vitest'
import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import { startBridge } from './bridge'

it('routes by explicit session, blocks external origins and fails on disconnection', async () => {
  const bridge = await startBridge(0), base = `http://127.0.0.1:${bridge.port}`
  const connect = async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${bridge.port}/editor`, { origin:'http://localhost:1440' }), id = randomUUID()
    await new Promise<void>(resolve => ws.once('open', resolve))
    ws.send(JSON.stringify({type:'hello',sessionId:id,name:id,revision:0}))
    ws.on('message', data => { const req=JSON.parse(String(data)); ws.send(JSON.stringify({type:'result',id:req.id,result:{editor:id}})) })
    return { ws, id }
  }
  try {
    const a=await connect(), b=await connect()
    const post=(sessionId:string, origin?:string)=>fetch(base+'/v1/request',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify({sessionId,request:{method:'scene.read'}})})
    expect((await (await post(a.id)).json()).result.editor).toBe(a.id)
    expect((await (await post(b.id)).json()).result.editor).toBe(b.id)
    expect((await post(a.id,'https://unrelated.example')).status).toBe(403)
    const cors=await fetch(base+'/v1/request',{method:'OPTIONS',headers:{Origin:'http://localhost:1440','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}})
    expect(cors.status).toBe(204)
    expect(cors.headers.get('access-control-allow-origin')).toBe('http://localhost:1440')
    expect((await fetch(base+'/v1/exports/'+randomUUID()+'/download')).status).toBe(404)
    expect((await fetch(base+'/v1/request',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'})).status).toBe(415)
    const invalid=await fetch(base+'/v1/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({request:{method:'scene.read'}})})
    expect(invalid.status).toBe(400)
    a.ws.close(); await new Promise<void>(resolve=>a.ws.once('close',()=>resolve()))
    expect((await post(a.id)).status).toBe(404)
    b.ws.close()
  } finally { await bridge.close() }
})
