import { expect, it } from 'vitest'
import { mkdtemp, readFile, rm, mkdir, readdir, writeFile, utimes } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProjectExports } from './projectExport'

it('snapshots queued scenes, isolates owners, and recovers after a failed build', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ascii-exports-')),
    exports = createProjectExports(root)
  try {
    const snapshot = { revision: 3, document: { version: 1, name: 'Before', objects: [] } }
    const failed = exports.start('owner', snapshot, 'web', 'Missing builder')
    const job = exports.start('owner', snapshot, 'pomorog', 'Á scene / title')
    snapshot.document.name = 'After'
    expect(exports.artifact(job.id)).toBeUndefined()
    expect(() => exports.status(job.id, 'other')).toThrow(/not found/)
    await exports.idle()
    expect(exports.status(failed.id, 'owner').status).toBe('failed')
    const ready = exports.status(job.id, 'owner')
    expect(ready.status).toBe('ready')
    expect(ready.revision).toBe(3)
    expect(ready.result!.filename).toBe('a-scene-title.pomorog.json')
    expect(JSON.parse(await readFile(ready.result!.artifact, 'utf8')).name).toBe('Before')
    ready.result!.filename = 'changed'
    expect(exports.artifact(job.id)!.filename).toBe('a-scene-title.pomorog.json')
  } finally {
    await exports.idle()
    await rm(root, { recursive: true, force: true })
  }
})

it('retains the last five completed exports on disk and in memory, including cleanup after a restart', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ascii-retention-')),
    exports = createProjectExports(root)
  try {
    const folder = join(root, 'exports')
    await mkdir(join(folder, 'manual-export'), { recursive: true })
    await writeFile(join(folder, 'manual-export', 'keep.txt'), 'manual')
    for (let index = 0; index < 6; index++) {
      const directory = join(folder, 'project-old-' + index)
      await mkdir(directory)
      await writeFile(join(directory, 'old.txt'), 'old')
      await utimes(directory, 1, 1)
    }
    const jobs = Array.from({ length: 7 }, (_, index) =>
      exports.start(
        'owner',
        { document: { version: 1, objects: [] }, revision: index },
        'pomorog',
        'Scene ' + index,
      ),
    )
    expect(exports.status(jobs.at(-1)!.id, 'owner').status).toBe('queued')
    await exports.idle()
    for (const job of jobs.slice(0, 2)) {
      expect(() => exports.status(job.id, 'owner')).toThrow(/not found/)
      expect(exports.artifact(job.id)).toBeUndefined()
    }
    for (const job of jobs.slice(2)) expect(exports.status(job.id, 'owner').status).toBe('ready')
    expect((await readdir(folder)).filter(name => name.startsWith('project-'))).toHaveLength(5)
    expect(await readFile(join(folder, 'manual-export', 'keep.txt'), 'utf8')).toBe('manual')
  } finally {
    await exports.idle()
    await rm(root, { recursive: true, force: true })
  }
})
