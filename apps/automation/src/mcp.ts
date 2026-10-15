import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import { readFile, writeFile, link, rename, unlink } from 'node:fs/promises'
import { resolve, relative, dirname, basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import { batchSchema, requestSchema } from '@ascii-engine/authoring/schema'

const endpoint = process.env.ASCII_ENGINE_API ?? 'http://127.0.0.1:1442'
const session = { sessionId: z.string().uuid().describe('Identifier returned by engine_sessions; explicitly choose the scene to edit.') }
const revision = z.number().int().nonnegative().describe('Current revision returned by scene_read or the latest change.')
const text = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] })
async function http(path: string, body?: unknown): Promise<any> {
  const response = await fetch(endpoint + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(125000) } : { signal: AbortSignal.timeout(5000) })
  const value = await response.json()
  if (!response.ok) throw new Error(value.error ?? `HTTP ${response.status}`)
  return value
}
const call = async (sessionId: string, request: unknown) => (await http('/v1/request', { sessionId, request: requestSchema.parse(request) })).result
const safe = <T>(handler: (args: T) => Promise<ReturnType<typeof text> | { content: { type: 'image'; data: string; mimeType: string }[] }>) => async (args: T) => {
  try { return await handler(args) } catch (error) { return { isError: true, ...text({ error: error instanceof Error ? error.message : String(error) }) } }
}

export function createMcpServer() {
  const server = new McpServer({ name: 'ascii-engine', version: '0.1.0' })
  server.registerTool('engine_sessions', { description: 'Lists open scenes. Start here; every edit requires sessionId to avoid targeting a different tab.', inputSchema: z.object({}), annotations: { readOnlyHint: true } }, safe(async () => text(await http('/v1/sessions'))))
  server.registerTool('engine_reference', { description: 'Discovers the live catalog, command schema, full effect recipes, default style and document contract.', inputSchema: z.object({ ...session, topic: z.enum(['commands','catalog','style','effects','water','documents']).default('commands') }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, topic }) => text(await call(sessionId, { method: 'engine.reference', topic }))))
  server.registerTool('scene_read', { description: 'Reads the current revision and scene. full=true includes the heightmap, water masks and embedded models to export or edit any field.', inputSchema: z.object({ ...session, full: z.boolean().default(false) }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, full }) => text(await call(sessionId, { method: 'scene.read', full }))))
  server.registerTool('scene_apply', { description: 'Creates or edits visual content in an atomic batch. Preview by default; preview=false applies directly with undo. Every runtime field is accessible through scene.replace/patch. texture.apply link:true creates visible links by clearing fields defined by the recipe at that level (and unlinked parts for object links); part links win over object-wide fields; texture.detach bakes them without visual changes. terrain.layer edits surface floor and standing-letter cover recipes; water.update edits water/foam/reflection alphabets, depth colors and opt-in rings.', inputSchema: z.object({ ...session, revision, commands: batchSchema, preview: z.boolean().default(true) }) }, safe(async ({ sessionId, ...args }) => text(await call(sessionId, { method: 'scene.apply', ...args }))))
  server.registerTool('scene_validate', { description: 'Validates a batch without changing the scene. GLB/GLTF decoding happens when applied.', inputSchema: z.object({ ...session, commands: batchSchema }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, commands }) => text(await call(sessionId, { method: 'scene.validate', commands }))))
  server.registerTool('scene_preview', { description: 'Applies or discards the preview. The agent may confirm directly; accepting records one history action.', inputSchema: z.object({ ...session, revision, action: z.enum(['accept','cancel']) }) }, safe(async ({ sessionId, revision, action }) => text(await call(sessionId, { method: `preview.${action}`, revision }))))
  server.registerTool('scene_history', { description: 'Undoes or redoes an action in the open scene, including human actions. Requires the current revision.', inputSchema: z.object({ ...session, revision, action: z.enum(['undo','redo']) }) }, safe(async ({ sessionId, revision, action }) => text(await call(sessionId, { method: `history.${action}`, revision }))))
  server.registerTool('object_inspect', { description: 'Reads an object, its named parts and ASCII style to edit technique, letter family, size in meters and RGB color per part.', inputSchema: z.object({ ...session, id: z.string() }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, id }) => text(await call(sessionId, { method: 'object.inspect', id }))))
  server.registerTool('water_disturb', { description: 'Produces a water wave to test impacts or steps. Transient impulse: does not change the document or revision; unpause to see propagation.', inputSchema: z.object({ ...session, index: z.number().int().nonnegative(), x: z.number(), z: z.number(), strength: z.number().min(-1).max(1).default(.18), radius: z.number().min(.05).max(8).default(.6) }) }, safe(async ({sessionId,...args})=>text(await call(sessionId,{method:'water.disturb',...args}))))
  server.registerTool('editor_view', { description: 'Sets camera view, zoom and pause or opens the effects, atmosphere or textures Studio. Does not change the document.', inputSchema: z.object({ ...session, focus: z.tuple([z.number(),z.number(),z.number()]).optional(), angle: z.number().optional(), elevation: z.number().min(.02).max(Math.PI/2-.01).optional(), zoom: z.number().min(.18).max(4).optional(), paused: z.boolean().optional(), studio: z.enum(['scene','effects','atmosphere','textures']).optional(), cameraId: z.string().nullable().optional() }) }, safe(async ({ sessionId, ...args }) => text(await call(sessionId, { method: 'editor.view', ...args }))))
  server.registerTool('editor_capture', { description: 'Captures the rendered ASCII scene for visual inspection.', inputSchema: z.object(session), annotations: { readOnlyHint: true } }, safe(async ({ sessionId }) => { const result = await call(sessionId, { method: 'editor.capture' }); return { content: [{ type: 'image' as const, data: result.data, mimeType: result.mimeType }] } }))
  server.registerTool('assets_import', { description: 'Imports local GLB or GLTF models with explicitly listed companions. Embeds assets and returns catalog IDs without placing instances automatically.', inputSchema: z.object({ ...session, revision, paths: z.array(z.string()).min(1).max(100), preview: z.boolean().default(true) }) }, safe(async ({ sessionId, revision, paths, preview }) => {
    const root = dirname(resolve(paths.find(p => /\.(gltf|glb)$/i.test(p)) ?? paths[0])), files = []; let bytes = 0
    for (const path of paths) { const content = await readFile(resolve(path)); bytes += content.length; if (bytes > 45 * 1024 * 1024) throw new Error('45 MB total import limit.'); const name = relative(root, resolve(path)).split('\\').join('/'); files.push({ name, data: content.toString('base64') }) }
    return text(await call(sessionId, { method: 'assets.import', revision, files, preview }))
  }))
  server.registerTool('scene_open', { description: 'Opens a local .ascii.json/.pomorog.json document in the selected scene; validates and supports preview and undo.', inputSchema: z.object({ ...session, revision, path: z.string(), preview: z.boolean().default(true) }) }, safe(async ({ sessionId, revision, path, preview }) => text(await call(sessionId, { method: 'scene.apply', revision, preview, commands: [{ op: 'scene.replace', document: JSON.parse(await readFile(resolve(path), 'utf8')) }] }))))
  server.registerTool('scene_export', { description: 'Exports the portable visual document with assets and effects to an explicit local path. Requires an importer in Pomorog; does not modify game files.', inputSchema: z.object({ ...session, path: z.string(), overwrite: z.boolean().default(false) }) }, safe(async ({ sessionId, path, overwrite }) => {
    const result = await call(sessionId, { method: 'scene.read', full: true }), target = resolve(path)
    const temporary = resolve(dirname(target), `.${basename(target)}.${randomUUID()}.tmp`)
    try {
      await writeFile(temporary, JSON.stringify(result.document), { flag: 'wx' })
      if (overwrite) await rename(temporary, target); else { await link(temporary, target); await unlink(temporary) }
    } finally { await unlink(temporary).catch(() => {}) }
    return text({ path: target, revision: result.revision, preview: result.preview, objects: result.document.objects.length })
  }))
  server.registerTool('project_export', {
    description: 'Captures the selected scene and queues a local Web player ZIP, Tauri desktop ZIP for this platform, or portable Pomorog JSON. Does not publish or modify the scene. Keep pnpm api running; poll project_export_status for the artifact path and download URL. Desktop requires the installed Tauri toolchain.',
    inputSchema: z.object({ ...session, target: z.enum(['web','desktop','pomorog']), title: z.string().trim().min(1).max(100) }),
  }, safe(async ({sessionId,...args}) => text(await call(sessionId,{method:'project.export',...args}))))
  server.registerTool('project_export_status', {
    description: 'Reads a queued/building/ready/failed export job using its original sessionId, including after the editor reconnects. Ready jobs include local artifact paths; download from /v1/exports/<id>/download on the API endpoint.',
    inputSchema: z.object({...session,jobId:z.string().uuid()}), annotations:{readOnlyHint:true},
  }, safe(async ({sessionId,jobId}) => text(await call(sessionId,{method:'project.export.status',jobId}))))
  return server
}

void serveStdio(createMcpServer)
