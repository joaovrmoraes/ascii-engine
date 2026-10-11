import type { SceneDoc } from '@ascii-engine/core'

export function downloadDocument(doc: SceneDoc, suffix = 'ascii.json') {
  const blob = new Blob([JSON.stringify(doc)], { type: 'application/json' })
  const url = URL.createObjectURL(blob), a = document.createElement('a')
  a.href = url; a.download = `${(doc.name || 'cenario').replace(/[^\p{L}\p{N}_-]+/gu, '-')}.${suffix}`; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
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
  if (!models.length) throw new Error('Escolha um .glb ou um .gltf com seus arquivos .bin e imagens.')
  const assets: Record<string, { name: string; source: string }> = {}
  const byPath = new Map<string, File>()
  for (const file of files) { byPath.set(file.webkitRelativePath || file.name, file); if (!byPath.has(file.name)) byPath.set(file.name, file) }
  for (const file of models) {
    if (file.size > 32 * 1024 * 1024) throw new Error(`${file.name}: limite atual de 32 MB por modelo.`)
    let source: string
    if (/\.glb$/i.test(file.name)) source = await readData(file)
    else {
      const data = JSON.parse(await file.text())
      const path = file.webkitRelativePath || file.name, dir = path.slice(0, path.lastIndexOf('/') + 1)
      for (const entry of [...(data.buffers ?? []), ...(data.images ?? [])]) {
        if (!entry.uri || entry.uri.startsWith('data:')) continue
        const uri = decodeURIComponent(entry.uri)
        const match = byPath.get(dir + uri) ?? byPath.get(uri) ?? byPath.get(uri.split('/').pop()!)
        if (!match) throw new Error(`${file.name}: falta ${uri}. Selecione também os arquivos acompanhantes.`)
        entry.uri = await readData(match)
      }
      source = await readData(new Blob([JSON.stringify(data)], { type: 'model/gltf+json' }))
    }
    // loadSceneAssets validates these sources before replacing the open scene.
    assets[`asset-${crypto.randomUUID()}`] = { name: file.name, source }
  }
  return assets
}
