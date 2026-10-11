import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import { readFile, writeFile, link, rename, unlink } from 'node:fs/promises'
import { resolve, relative, dirname, basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import { batchSchema, requestSchema } from '@ascii-engine/authoring'

const endpoint = process.env.ASCII_ENGINE_API ?? 'http://127.0.0.1:1442'
const session = { sessionId: z.string().uuid().describe('Identificador retornado por engine_sessions; escolha explicitamente a cena desejada.') }
const revision = z.number().int().nonnegative().describe('Revisão atual retornada por scene_read ou pela última alteração.')
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
  server.registerTool('engine_sessions', { description: 'Lista cenas abertas. Comece aqui; todas as edições exigem sessionId para nunca escolher outra aba por engano.', inputSchema: z.object({}), annotations: { readOnlyHint: true } }, safe(async () => text(await http('/v1/sessions'))))
  server.registerTool('engine_reference', { description: 'Descobre catálogo real, esquema dos comandos, receitas completas de efeitos, estilo padrão e contrato de documentos.', inputSchema: z.object({ ...session, topic: z.enum(['commands','catalog','style','effects','water','documents']).default('commands') }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, topic }) => text(await call(sessionId, { method: 'engine.reference', topic }))))
  server.registerTool('scene_read', { description: 'Lê revisão e cena atual. full=true inclui heightmap, máscaras de água e modelos incorporados para exportar ou editar qualquer campo.', inputSchema: z.object({ ...session, full: z.boolean().default(false) }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, full }) => text(await call(sessionId, { method: 'scene.read', full }))))
  server.registerTool('scene_apply', { description: 'Cria/edita todo o conteúdo visual em lote atômico. Prévia por padrão; preview=false aplica diretamente e permite desfazer. Todo campo do runtime é acessível por scene.replace/patch.', inputSchema: z.object({ ...session, revision, commands: batchSchema, preview: z.boolean().default(true) }) }, safe(async ({ sessionId, ...args }) => text(await call(sessionId, { method: 'scene.apply', ...args }))))
  server.registerTool('scene_validate', { description: 'Valida um lote sem alterar a cena. Decodificação de GLB/GLTF ocorre ao aplicar.', inputSchema: z.object({ ...session, commands: batchSchema }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, commands }) => text(await call(sessionId, { method: 'scene.validate', commands }))))
  server.registerTool('scene_preview', { description: 'Aplica ou descarta a prévia. A IA pode confirmar diretamente; aceitar grava uma única ação no histórico.', inputSchema: z.object({ ...session, revision, action: z.enum(['accept','cancel']) }) }, safe(async ({ sessionId, revision, action }) => text(await call(sessionId, { method: `preview.${action}`, revision }))))
  server.registerTool('scene_history', { description: 'Desfaz ou refaz uma ação na cena aberta, incluindo ações humanas. Exige revisão atual.', inputSchema: z.object({ ...session, revision, action: z.enum(['undo','redo']) }) }, safe(async ({ sessionId, revision, action }) => text(await call(sessionId, { method: `history.${action}`, revision }))))
  server.registerTool('object_inspect', { description: 'Lê objeto, suas partes e estilo ASCII para editar técnica/família/tamanho por parte.', inputSchema: z.object({ ...session, id: z.string() }), annotations: { readOnlyHint: true } }, safe(async ({ sessionId, id }) => text(await call(sessionId, { method: 'object.inspect', id }))))
  server.registerTool('editor_view', { description: 'Posiciona câmera, zoom, pausa ou abre Estúdio de efeitos/atmosfera. Não altera o documento.', inputSchema: z.object({ ...session, focus: z.tuple([z.number(),z.number(),z.number()]).optional(), angle: z.number().optional(), zoom: z.number().min(.18).max(4).optional(), paused: z.boolean().optional(), studio: z.enum(['scene','effects','atmosphere']).optional(), cameraId: z.string().nullable().optional() }) }, safe(async ({ sessionId, ...args }) => text(await call(sessionId, { method: 'editor.view', ...args }))))
  server.registerTool('editor_capture', { description: 'Captura a cena ASCII renderizada para a IA conferir visualmente o resultado.', inputSchema: z.object(session), annotations: { readOnlyHint: true } }, safe(async ({ sessionId }) => { const result = await call(sessionId, { method: 'editor.capture' }); return { content: [{ type: 'image' as const, data: result.data, mimeType: result.mimeType }] } }))
  server.registerTool('assets_import', { description: 'Importa modelos locais GLB ou GLTF com acompanhantes explicitamente listados. Incorpora recursos e devolve ids no catálogo, sem posicionar cópias automaticamente.', inputSchema: z.object({ ...session, revision, paths: z.array(z.string()).min(1).max(100), preview: z.boolean().default(true) }) }, safe(async ({ sessionId, revision, paths, preview }) => {
    const root = dirname(resolve(paths.find(p => /\.(gltf|glb)$/i.test(p)) ?? paths[0])), files = []; let bytes = 0
    for (const path of paths) { const content = await readFile(resolve(path)); bytes += content.length; if (bytes > 45 * 1024 * 1024) throw new Error('Limite total de 45 MB para importação.'); const name = relative(root, resolve(path)).split('\\').join('/'); files.push({ name, data: content.toString('base64') }) }
    return text(await call(sessionId, { method: 'assets.import', revision, files, preview }))
  }))
  server.registerTool('scene_open', { description: 'Abre documento .ascii.json/.pomorog.json local na cena escolhida; valida e permite prévia/desfazer.', inputSchema: z.object({ ...session, revision, path: z.string(), preview: z.boolean().default(true) }) }, safe(async ({ sessionId, revision, path, preview }) => text(await call(sessionId, { method: 'scene.apply', revision, preview, commands: [{ op: 'scene.replace', document: JSON.parse(await readFile(resolve(path), 'utf8')) }] }))))
  server.registerTool('scene_export', { description: 'Exporta o documento visual portátil com assets/efeitos para caminho local explícito. Ainda depende de importador no Pomorog; não altera arquivos do jogo.', inputSchema: z.object({ ...session, path: z.string(), overwrite: z.boolean().default(false) }) }, safe(async ({ sessionId, path, overwrite }) => {
    const result = await call(sessionId, { method: 'scene.read', full: true }), target = resolve(path)
    const temporary = resolve(dirname(target), `.${basename(target)}.${randomUUID()}.tmp`)
    try {
      await writeFile(temporary, JSON.stringify(result.document), { flag: 'wx' })
      if (overwrite) await rename(temporary, target); else { await link(temporary, target); await unlink(temporary) }
    } finally { await unlink(temporary).catch(() => {}) }
    return text({ path: target, revision: result.revision, preview: result.preview, objects: result.document.objects.length })
  }))
  return server
}

void serveStdio(createMcpServer)
