import { z } from 'zod'

export function assertSafeJson(value: unknown): void {
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Reserved key: ' + key)
    assertSafeJson(child)
  }
}

const json = z.record(z.string(), z.json())
const coordinate = z.number().min(-4096).max(4096)
const vec3 = z.tuple([coordinate, coordinate, coordinate])
const point = z.object({ x: coordinate, z: coordinate }).strict()
const key = z.string().min(1).max(200).refine(s => !['__proto__', 'constructor', 'prototype'].includes(s), 'Reserved key')
const stroke = z.object({ brush: z.enum(['raise', 'lower', 'smooth', 'flatten', 'paint', 'dig']), x: coordinate, z: coordinate, radius: z.number().positive().max(4096), strength: z.number().min(0).max(4096), layer: z.number().int().min(0).max(3).optional(), height: coordinate.optional() }).strict()

/** JSON is intentional for complete engine documents/recipes: parseScene is authoritative. */
export const commandSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('scene.replace'), document: json }).strict(),
  z.object({ op: z.literal('scene.patch'), patch: json.describe('Recursive merge; arrays replace arrays. All SceneDoc fields are accessible, including optional style.types[id].authored field lists above model declarations.'), unset: z.array(z.enum(['terrain', 'waters', 'carpet', 'assets', 'effects', 'atmospheres', 'textures', 'cameras', 'activeCamera', 'environment', 'style'])).optional() }).strict(),
  z.object({ op: z.literal('object.add'), object: json.describe('PlacedObject: prefab and position [x,y,z]; optional id, rotation3 in radians, scale3, options.parts.') }).strict(),
  z.object({ op: z.literal('object.update'), id: key, patch: json }).strict(),
  z.object({ op: z.literal('object.remove'), ids: z.array(key).min(1).max(20000) }).strict(),
  z.object({ op: z.literal('object.scatter'), prefab: key, count: z.number().int().min(1).max(2000), seed: z.number().int().min(0).max(4294967295), bounds: z.object({ minX: coordinate, maxX: coordinate, minZ: coordinate, maxZ: coordinate }).strict(), scale: z.tuple([z.number().positive(), z.number().positive()]).optional(), offsetY: coordinate.optional() }).strict(),
  z.object({ op: z.literal('terrain.create'), size: z.number().min(1).max(4096).default(32), resolution: z.number().int().min(2).max(513).default(129) }).strict(),
  z.object({ op: z.literal('terrain.stroke'), strokes: z.array(stroke).min(1).max(1000) }).strict(),
  z.object({ op: z.literal('water.paint'), index: z.number().int().nonnegative().optional(), points: z.array(point).min(1).max(1000), radius: z.number().positive().max(4096), mode: z.enum(['terrain', 'level']).default('terrain'), level: coordinate.optional(), erase: z.boolean().default(false), look: json.optional() }).strict(),
  z.object({ op: z.literal('water.update'), index: z.number().int().nonnegative(), patch: json }).strict(),
  z.object({ op: z.literal('water.remove'), index: z.number().int().nonnegative() }).strict(),
  z.object({ op: z.literal('effect.define'), id: key.regex(/^fx:custom-/), effect: json.describe('Complete EffectDef: name, duration, optional loop, emitters and light. See engine_reference effects.') }).strict(),
  z.object({ op: z.literal('asset.define'), id: key, name: z.string().min(1), source: z.string().startsWith('data:') }).strict(),
  z.object({ op: z.literal('resource.remove'), kind: z.enum(['assets', 'effects', 'atmospheres', 'textures']), id: key }).strict(),
  z.object({ op: z.literal('texture.define'), id: key, name: z.string().trim().min(1), style: json.describe('GlyphStyle recipe: surface/body world letters or legacy character screen. Omitted fields preserve mixed techniques. Screen uses scene cellSize and the legacy atlas.'), previewLighting: json.optional().describe('Optional studio lights. Applying the texture preserves scene lighting.') }).strict(),
  z.object({ op: z.literal('texture.apply'), id: key, objectId: key, part: key.optional(), link: z.boolean().optional().describe('True stores a live asset reference below local overrides. Omitted copies fields for compatibility.') }).strict(),
  z.object({ op: z.literal('texture.detach'), objectId: key, part: key.optional().describe('Omitted bakes all object and part links. Appearance is preserved.') }).strict(),
  z.object({ op: z.literal('atmosphere.define'), id: key, name: z.string().trim().min(1), style: json.describe('Lighting to save to Assets; omitted fields come from the current scene.') }).strict(),
  z.object({ op: z.literal('atmosphere.apply'), id: key }).strict(),
  z.object({ op: z.literal('atmosphere.set'), style: json.describe('AsciiStyle fields merged with the current style: moon, sky, fill, fog, inkTint, brightness...') }).strict(),
  z.object({ op: z.literal('camera.define'), id: key, camera: json.describe('SceneCamera: name, orthographic projection, position, XYZ rotation in radians, span (half-height in meters), aspect; optional near/far.') }).strict(),
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
  z.object({ method: z.literal('assets.import'), revision: z.number().int().nonnegative(), files: z.array(z.object({ name: z.string().min(1), data: z.string().describe('Base64 bytes'), mime: z.string().optional() }).strict()).min(1).max(100), preview: z.boolean().default(true) }).strict(),
  z.object({ method: z.literal('object.inspect'), id: key }).strict(),
  z.object({ method: z.literal('editor.view'), focus: vec3.optional(), angle: z.number().optional(), elevation: z.number().min(.02).max(Math.PI/2-.01).optional(), zoom: z.number().min(.18).max(4).optional(), paused: z.boolean().optional(), studio: z.enum(['scene', 'effects', 'atmosphere', 'textures']).optional(), cameraId: key.nullable().optional() }).strict(),
  z.object({ method: z.literal('water.disturb'), index: z.number().int().nonnegative(), x: coordinate, z: coordinate, strength: z.number().min(-1).max(1).default(.18), radius: z.number().min(.05).max(8).default(.6) }).strict(),
  z.object({ method: z.literal('editor.capture') }).strict(),
])
export type AuthoringRequest = z.infer<typeof requestSchema>
export const rpcSchema = z.object({ sessionId: z.string().uuid(), request: requestSchema }).strict()
export function commandJsonSchema() { return z.toJSONSchema(batchSchema) }
