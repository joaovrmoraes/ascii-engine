import type { SceneDoc } from '@ascii-engine/core'

const database = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('ascii-engine-projects', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('documents')
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})
// Opening may fail in private/disabled storage; callers report this visibly.
void database.catch(() => {})
export async function readDraft(): Promise<unknown> {
  const db = await database
  return new Promise((resolve, reject) => {
    const request = db.transaction('documents').objectStore('documents').get('current')
    request.onsuccess = () => {
      try {
        resolve(
          request.result ?? JSON.parse(localStorage.getItem('ascii-engine:sandbox') ?? 'null'),
        )
      } catch (error) {
        reject(error)
      }
    }
    request.onerror = () => reject(request.error)
  })
}
export async function saveDraft(doc: SceneDoc): Promise<void> {
  const db = await database
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite')
    tx.objectStore('documents').put(doc, 'current')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}
