import { parseScene, type AsciiEngine } from '@ascii-engine/core'

export function downloadStylePreset(engine: AsciiEngine) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(engine.exportStyle(), null, 2)], { type: 'application/json' }))
  const link = document.createElement('a'); link.href = url; link.download = 'preset-ascii.json'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function loadStylePreset(engine: AsciiEngine, file: File) {
  const doc = parseScene({ version: 1, objects: [], style: JSON.parse(await file.text()) })
  engine.setStyle(doc.style!)
}
