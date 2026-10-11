import { z } from 'zod'

export function assertSafeJson(value: unknown): void {
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Chave reservada: ' + key)
    assertSafeJson(child)
  }
}

const json = z.record(z.string(), z.json())
const coordinate = z.number().min(-4096).max(4096)
const vec3 = z.tuple([coordinate, coordinate, coordinate])
const point = z.object({ x: coordinate, z: coordinate }).strict()
const key = z.string().min(1).max(200).refine(s => !['__proto__', 'constructor', 'prototype'].includes(s), 'Chave reservada')
const stroke = z.object({ brush: z.enum(['raise', 'lower', 'smooth', 'flatten', 'paint', 'dig']), x: coordinate, z: coordinate, radius: z.number().positive().max(4096), strength: z.number().min(0).max(4096), layer: z.number().int().min(0).max(3).optional(), height: coordinate.optional() }).strict()

/** JSON is intentional for complete engine documents/recipes: parseScene is authoritative. */
export const commandSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('scene.replace'), document: json }).strict(),
  z.object({ op: z.literal('scene.patch'), patch: json.describe('Mescla recursiva; listas substituem listas. Todos os campos de SceneDoc são acessíveis.'), unset: z.array(z.enum(['terrain', 'waters', 'carpet', 'assets', 'effects', 'atmospheres', 'cameras', 'activeCamera', 'environment', 'style'])).optional() }).strict(),
  z.object({ op: z.literal('object.add'), object: json.describe('PlacedObject: prefab e position [x,y,z]; id opcional, rotation3 em radianos, scale3, options.parts.') }).strict(),
  z.object({ op: z.literal('object.update'), id: key, patch: json }).strict(),
  z.object({ op: z.literal('object.remove'), ids: z.array(key).min(1).max(20000) }).strict(),
  z.object({ op: z.literal('object.scatter'), prefab: key, count: z.number().int().min(1).max(2000), seed: z.number().int().min(0).max(4294967295), bounds: z.object({ minX: coordinate, maxX: coordinate, minZ: coordinate, maxZ: coordinate }).strict(), scale: z.tuple([z.number().positive(), z.number().positive()]).optional(), offsetY: coordinate.optional() }).strict(),
  z.object({ op: z.literal('terrain.create'), size: z.number().min(1).max(4096).default(32), resolution: z.number().int().min(2).max(513).default(129) }).strict(),
  z.object({ op: z.literal('terrain.stroke'), strokes: z.array(stroke).min(1).max(1000) }).strict(),
  z.object({ op: z.literal('water.paint'), index: z.number().int().nonnegative().optional(), points: z.array(point).min(1).max(1000), radius: z.number().positive().max(4096), mode: z.enum(['terrain', 'level']).default('terrain'), level: coordinate.optional(), erase: z.boolean().default(false), look: json.optional() }).strict(),
  z.object({ op: z.literal('water.update'), index: z.number().int().nonnegative(), patch: json }).strict(),
  z.object({ op: z.literal('water.remove'), index: z.number().int().nonnegative() }).strict(),
  z.object({ op: z.literal('effect.define'), id: key.regex(/^fx:custom-/), effect: json.describe('EffectDef completo: name, duration, loop, emitters e light opcionais. Consulte engine_reference effects.') }).strict(),
  z.object({ op: z.literal('asset.define'), id: key, name: z.string().min(1), source: z.string().startsWith('data:') }).strict(),
  z.object({ op: z.literal('resource.remove'), kind: z.enum(['assets', 'effects', 'atmospheres']), id: key }).strict(),
  z.object({ op: z.literal('atmosphere.define'), id: key, name: z.string().trim().min(1), style: json.describe('Iluminação para salvar nos Assets; campos omitidos vêm da cena atual.') }).strict(),
  z.object({ op: z.literal('atmosphere.apply'), id: key }).strict(),
  z.object({ op: z.literal('atmosphere.set'), style: json.describe('Campos de AsciiStyle, mesclados com o estilo atual: moon, sky, fill, fog, inkTint, brightness...') }).strict(),
  z.object({ op: z.literal('camera.define'), id: key, camera: json.describe('SceneCamera: name, projection orthographic, position, rotation XYZ em radianos, span (meia altura em metros), aspect; near/far opcionais.') }).strict(),
  z.object({ op: z.literal('camera.update'), id: key, patch: json }).strict(),
  z.object({ op: z.literal('camera.remove'), id: key }).strict(),
  z.object({ op: z.literal('camera.activate'), id: key.nullable() }).strict(),
  z.object({ op: z.literal('environment.set'), weather: z.enum(['none', 'rain', 'snow']), intensity: z.number().min(0).max(1).default(1) }).strict(),
])
export const batchSchema = z.array(commandSchema).min(1).max(2000)
export type Command = z.infer<typeof commandSchema>

export const requestSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('scene.read'), full: z.boolean().default(false) }).strict(),
  z.object({ method: z.literal('engine.reference'), topic: z.enum(['commands', 'catalog', 'style', 'effects', 'water', 'documents']).default('commands') }).strict(),
  z.object({ method: z.literal('scene.apply'), revision: z.number().int().nonnegative(), commands: batchSchema, preview: z.boolean().default(true) }).strict(),
  z.object({ method: z.literal('scene.validate'), commands: batchSchema }).strict(),
  z.object({ method: z.literal('preview.accept'), revision: z.number().int().nonnegative() }).strict(),
  z.object({ method: z.literal('preview.cancel'), revision: z.number().int().nonnegative() }).strict(),
  z.object({ method: z.literal('history.undo'), revision: z.number().int().nonnegative() }).strict(),
  z.object({ method: z.literal('history.redo'), revision: z.number().int().nonnegative() }).strict(),
  z.object({ method: z.literal('assets.import'), revision: z.number().int().nonnegative(), files: z.array(z.object({ name: z.string().min(1), data: z.string().describe('Bytes em base64'), mime: z.string().optional() }).strict()).min(1).max(100), preview: z.boolean().default(true) }).strict(),
  z.object({ method: z.literal('object.inspect'), id: key }).strict(),
  z.object({ method: z.literal('editor.view'), focus: vec3.optional(), angle: z.number().optional(), zoom: z.number().min(.18).max(4).optional(), paused: z.boolean().optional(), studio: z.enum(['scene', 'effects', 'atmosphere']).optional(), cameraId: key.nullable().optional() }).strict(),
  z.object({ method: z.literal('editor.capture') }).strict(),
])
export type AuthoringRequest = z.infer<typeof requestSchema>
export const rpcSchema = z.object({ sessionId: z.string().uuid(), request: requestSchema }).strict()
export function commandJsonSchema() { return z.toJSONSchema(batchSchema) }
