import type { SceneDoc } from '@ascii-engine/core'
import { bridgeEndpoint, bridgeRequest } from '../api/transport'
import { downloadDocument } from '../scene/files'

interface ExportJob {
  id: string; sessionId: string; revision: number; title: string
  target: 'web' | 'desktop' | 'pomorog'
  status: 'queued' | 'building' | 'ready' | 'failed'
  error?: string; result?: { filename: string }
}

/** Packaging runs in the local bridge; closing the dialog does not cancel a build. */
export function createExportDialog(snapshot: () => SceneDoc) {
  const dialog = document.createElement('dialog')
  dialog.id = 'project-export'
  dialog.innerHTML = `<form method="dialog">
    <h2>Export</h2>
    <label>Target<select data-export="target">
      <option value="web">Web player (.zip)</option>
      <option value="desktop">Desktop · this platform (.zip)</option>
      <option value="pomorog">Pomorog document (.json)</option>
    </select></label>
    <label>Title<input data-export="title" maxlength="100" required></label>
    <p data-export="description"></p>
    <p role="status" data-export="status"></p>
    <a data-export="download" hidden>Download export</a>
    <footer><button type="button" data-export="start">Export</button><button data-export="close">Close</button></footer>
  </form>`
  document.body.append(dialog)
  const get = <T extends HTMLElement>(key: string) => dialog.querySelector<T>(`[data-export="${key}"]`)!
  const target = get<HTMLSelectElement>('target'), title = get<HTMLInputElement>('title')
  const status = get('status'), start = get<HTMLButtonElement>('start'), download = get<HTMLAnchorElement>('download')
  const storageKey = 'ascii-project-export'
  let job: ExportJob | undefined, timer: ReturnType<typeof setTimeout> | undefined, stopped = false
  const running = () => job?.status === 'queued' || job?.status === 'building'
  const describe = () => {
    get('description').textContent = target.value === 'web'
      ? 'A standalone visual player. Serve the web folder on a static host.'
      : target.value === 'desktop' ? 'A Tauri executable for this computer’s platform, plus the web player.'
      : 'A portable scene with embedded assets. Pomorog needs a SceneDoc importer; game rules are separate.'
  }
  const remember = () => { try { sessionStorage.setItem(storageKey, JSON.stringify(job)) } catch { /* Storage can be unavailable. */ } }
  function render() {
    const active = running()
    start.disabled = !!active; target.disabled = !!active; title.disabled = !!active
    if (active && job) { target.value = job.target; title.value = job.title; describe() }
    download.hidden = job?.status !== 'ready'
    if (!job) return
    status.textContent = job.status === 'ready' ? `Ready · ${job.title} · revision ${job.revision}`
      : job.status === 'failed' ? `Export failed: ${job.error ?? 'Unknown error'}`
      : `${job.status === 'queued' ? 'Queued' : 'Building'} · ${job.title}. You can close this dialog and keep editing.`
    if (job.status === 'ready') {
      download.href = `${bridgeEndpoint}/v1/exports/${job.id}/download`
      download.download = job.result?.filename ?? 'export.zip'
    }
  }
  async function poll() {
    if (!job || stopped) return
    try {
      job = await bridgeRequest<ExportJob>(job.sessionId, { method: 'project.export.status', jobId: job.id })
      if (stopped) return
      remember(); render()
      if (running()) timer = setTimeout(() => void poll(), 1500)
    } catch (error) {
      if (String(error).includes('Export job not found')) {
        job = { ...job!, status: 'failed', error: 'This export is no longer retained. Create a new export.' }
        remember(); render(); return
      }
      status.textContent = `Could not read export status. Keep pnpm api running. ${String(error)}`
      if (!stopped) timer = setTimeout(() => void poll(), 5000)
    }
  }
  target.onchange = describe
  start.onclick = async () => {
    if (!title.reportValidity()) return
    if (target.value === 'pomorog') {
      downloadDocument({ ...snapshot(), name: title.value.trim() || snapshot().name }, 'pomorog.json')
      status.textContent = 'Pomorog document downloaded.'
      job = undefined; try { sessionStorage.removeItem(storageKey) } catch { /* Optional cache. */ }
      download.hidden = true; return
    }
    start.disabled = true; target.disabled = true; title.disabled = true
    status.textContent = 'Starting export…'; download.hidden = true
    try {
      const sessionId = (window as unknown as { asciiEngineApi?: { sessionId: string } }).asciiEngineApi?.sessionId
      if (!sessionId) throw new Error('The authoring session is not ready.')
      job = await bridgeRequest<ExportJob>(sessionId, {
        method: 'project.export', target: target.value as 'web' | 'desktop', title: title.value.trim(),
      })
      remember(); render(); await poll()
    } catch (error) {
      status.textContent = `Could not start export. Run pnpm api locally. ${String(error)}`
      start.disabled = false; target.disabled = false; title.disabled = false
    }
  }
  describe()
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
    if (saved?.id && saved.sessionId) { job = saved; void poll() }
  } catch { /* A broken browser-only cache does not affect documents. */ }
  return {
    open() { title.value = job && running() ? job.title : snapshot().name ?? 'My scene'; render(); dialog.showModal() },
    dispose() { stopped = true; clearTimeout(timer); dialog.remove() },
  }
}
