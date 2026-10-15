import { parseScene, type SceneDoc, type ObjectTypeStyle, type TextureAsset, type AtmosphereAsset } from '@ascii-engine/core'

export function downloadDocument(doc: SceneDoc, suffix = 'ascii.json') {
  const blob = new Blob([JSON.stringify(doc)], { type: 'application/json' })
  const url = URL.createObjectURL(blob), a = document.createElement('a')
  a.href = url; a.download = `${(doc.name || 'scene').replace(/[^\p{L}\p{N}_-]+/gu, '-')}.${suffix}`; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type ImportedResource = { kind:'item'; document:SceneDoc } | { kind:'texture'; asset:TextureAsset } | { kind:'atmosphere'; asset:AtmosphereAsset }
export function readImportedResource(input: unknown, filename: string): ImportedResource {
  if (!input || typeof input!=='object' || Array.isArray(input)) throw new Error('Choose an item, texture or atmosphere JSON file.')
  const value=input as Record<string,unknown>
  if (value.version!==1) throw new Error('Unsupported file. Use Load style preset for legacy style JSON.')
  const name=typeof value.name==='string' && value.name.trim() ? value.name : filename
  if (value.texture) {
    const doc=parseScene({version:1,objects:[],textures:{imported:{name,style:value.texture,...(value.previewLighting ? {previewLighting:value.previewLighting} : {})}}})
    return {kind:'texture',asset:doc.textures!.imported}
  }
  if (value.atmosphere) {
    const doc=parseScene({version:1,objects:[],atmospheres:{imported:{name,style:value.atmosphere}}})
    return {kind:'atmosphere',asset:doc.atmospheres!.imported}
  }
  const document=parseScene(value)
  if(document.terrain || document.waters?.length) throw new Error('This is a map. Use File → Open map to replace the map; Import adds resources to the current map.')
  return {kind:'item',document}
}

/** Insert without flattening type/global defaults above linked recipes. */
export function insertSceneItem(source: SceneDoc, item: SceneDoc, offset: [number,number,number], defaults: Record<string,ObjectTypeStyle | undefined> = {}): SceneDoc {
  const doc=structuredClone(source), remap=new Map(Object.keys(item.assets ?? {}).map(key=>[key,`asset-${crypto.randomUUID()}`]))
  for(const [key,asset] of Object.entries(item.assets ?? {})) (doc.assets ??= {})[remap.get(key)!]=structuredClone(asset)
  for(const [key,definition] of Object.entries(item.effects ?? {})) { const id=`fx:custom-${crypto.randomUUID()}`;remap.set(key,id);(doc.effects ??= {})[id]=structuredClone(definition) }
  for(const asset of Object.values(item.atmospheres ?? {})) (doc.atmospheres ??= {})[`atmosphere-${crypto.randomUUID()}`]=structuredClone(asset)
  const textures=new Map<string,string>()
  for(const [key,asset] of Object.entries(item.textures ?? {})) { const id=`texture-${crypto.randomUUID()}`;textures.set(key,id);(doc.textures ??= {})[id]=structuredClone(asset) }
  for(const camera of Object.values(item.cameras ?? {})) (doc.cameras ??= {})[`camera-${crypto.randomUUID()}`]={...structuredClone(camera),position:camera.position.map((value,index)=>value+offset[index]) as [number,number,number]}
  const types=new Map<string,string>()
  for(const object of item.objects) {
    const type=object.options?.type ?? object.prefab, style=item.style?.types?.[type] ?? defaults[object.prefab]
    const options=structuredClone(object.options ?? {})
    if(options.texture) options.texture=textures.get(options.texture) ?? options.texture
    for(const part of Object.values(options.parts ?? {})) if(part.texture) part.texture=textures.get(part.texture) ?? part.texture
    let insertedType=types.get(type)
    if(!insertedType) { insertedType=`item-type-${crypto.randomUUID()}`;types.set(type,insertedType);doc.style ??= {};doc.style.types ??= {};doc.style.types[insertedType]={...structuredClone(style),style:{...item.style?.glyphs,...style?.style}} }
    options.type=insertedType
    doc.objects.push({...structuredClone(object),id:crypto.randomUUID(),prefab:remap.get(object.prefab) ?? object.prefab,position:object.position.map((value,index)=>value+offset[index]) as [number,number,number],options})
  }
  return parseScene(doc)
}

function readData(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file)
  })
}

/** Embed every external buffer/image so exported models do not depend on this PC. */
export async function importModelFiles(files: File[]): Promise<Record<string, { name: string; source: string }>> {
  const models = files.filter(f => /\.(glb|gltf)$/i.test(f.name))
  if (!models.length) throw new Error('Choose a .glb or .gltf with its .bin files and images.')
  const assets: Record<string, { name: string; source: string }> = {}
  const byPath = new Map<string, File>()
  for (const file of files) { byPath.set(file.webkitRelativePath || file.name, file); if (!byPath.has(file.name)) byPath.set(file.name, file) }
  for (const file of models) {
    if (file.size > 32 * 1024 * 1024) throw new Error(`${file.name}: current limit is 32 MB per model.`)
    let source: string
    if (/\.glb$/i.test(file.name)) source = await readData(file)
    else {
      const data = JSON.parse(await file.text())
      const path = file.webkitRelativePath || file.name, dir = path.slice(0, path.lastIndexOf('/') + 1)
      for (const entry of [...(data.buffers ?? []), ...(data.images ?? [])]) {
        if (!entry.uri || entry.uri.startsWith('data:')) continue
        const uri = decodeURIComponent(entry.uri)
        const match = byPath.get(dir + uri) ?? byPath.get(uri) ?? byPath.get(uri.split('/').pop()!)
        if (!match) throw new Error(`${file.name}: missing ${uri}. Also select the companion files.`)
        entry.uri = await readData(match)
      }
      source = await readData(new Blob([JSON.stringify(data)], { type: 'model/gltf+json' }))
    }
    // loadSceneAssets validates these sources before replacing the open scene.
    assets[`asset-${crypto.randomUUID()}`] = { name: file.name, source }
  }
  return assets
}
