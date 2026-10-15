import { expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProjectExports } from './projectExport'

it('snapshots queued scenes, isolates owners, and recovers after a failed build', async () => {
  const root=await mkdtemp(join(tmpdir(),'ascii-exports-')), exports=createProjectExports(root)
  try {
    const snapshot={revision:3,document:{version:1,name:'Before',objects:[]}}
    const failed=exports.start('owner',snapshot,'web','Missing builder')
    const job=exports.start('owner',snapshot,'pomorog','Á scene / title')
    snapshot.document.name='After'
    expect(exports.artifact(job.id)).toBeUndefined()
    expect(()=>exports.status(job.id,'other')).toThrow(/not found/)
    await exports.idle()
    expect(exports.status(failed.id,'owner').status).toBe('failed')
    const ready=exports.status(job.id,'owner')
    expect(ready.status).toBe('ready'); expect(ready.revision).toBe(3)
    expect(ready.result!.filename).toBe('a-scene-title.pomorog.json')
    expect(JSON.parse(await readFile(ready.result!.artifact,'utf8')).name).toBe('Before')
    ready.result!.filename='changed'
    expect(exports.artifact(job.id)!.filename).toBe('a-scene-title.pomorog.json')
  } finally { await exports.idle(); await rm(root,{recursive:true,force:true}) }
})
