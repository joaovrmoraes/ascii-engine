import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

export type ExportTarget = 'web' | 'desktop' | 'pomorog'
interface Job {
  id: string; sessionId: string; revision: number; title: string; target: ExportTarget
  status: 'queued' | 'building' | 'ready' | 'failed'
  error?: string
  result?: { directory: string; artifact: string; filename: string; mime: string; web?: string }
}

/** Queue builds because Vite and Cargo share output directories in the workspace. */
export function createProjectExports(root = fileURLToPath(new URL('../../../', import.meta.url))) {
  const jobs = new Map<string, Job>()
  let queue = Promise.resolve()
  const view = (job: Job) => structuredClone(job)
  return {
    start(sessionId: string, snapshot: {document:unknown; revision:number}, target: ExportTarget, title: string) {
      const job: Job = {id:randomUUID(),sessionId,revision:snapshot.revision,title,target,status:'queued'}
      jobs.set(job.id,job)
      const document = JSON.stringify(snapshot.document)
      queue = queue.then(async()=>{
        job.status='building'
        const exportsRoot=join(root,'exports');await mkdir(exportsRoot,{recursive:true})
        const directory=await mkdtemp(join(exportsRoot,'project-'))
        const slug=title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'scene'
        const scene=join(directory,'scene.json');await writeFile(scene,document)
        const log=createWriteStream(join(directory,'build.log'))
        async function run(command:string,args:string[],cwd=root) {
          await new Promise<void>((resolve,reject)=>{
            const child=spawn(command,args,{cwd,env:{...process.env,NODE_ENV:'production'},stdio:['ignore','pipe','pipe']})
            let recent=''
            for(const stream of [child.stdout,child.stderr]) stream.on('data',chunk=>{log.write(chunk);recent=(recent+String(chunk)).slice(-6000)})
            child.once('error',reject);child.once('close',code=>code===0 ? resolve() : reject(new Error(`Export command exited ${code}: ${recent}`)))
          })
        }
        try {
          if(target==='pomorog') {
            const filename=slug+'.pomorog.json',artifact=join(directory,filename);await writeFile(artifact,document)
            job.result={directory,artifact,filename,mime:'application/json'}
          } else {
            await run(process.execPath,[join(root,'scripts/export.mjs'),'--title',title,'--scene',scene,'--out',directory,...(target==='desktop' ? ['--desktop'] : [])])
            const folders=['web']
            if(target==='desktop') {
              await mkdir(join(directory,'desktop'))
              const extension=process.platform==='win32' ? '.exe' : ''
              await cp(join(root,'apps/editor/src-tauri/target/release/ascii-engine-editor'+extension),join(directory,'desktop',slug+extension))
              folders.push('desktop')
            }
            await writeFile(join(directory,'README.txt'),target==='web' ? 'Serve the web folder with a static HTTP server. It contains the player and portable scene.\n' : 'Run the executable in desktop on the build machine platform. The same scene is also in web.\n')
            const filename=`${slug}-${target}.zip`,artifact=join(directory,filename)
            await run('zip',['-rq',artifact,...folders,'README.txt'],directory)
            job.result={directory,artifact,filename,mime:'application/zip',web:join(directory,'web')}
          }
          job.status='ready'
        } finally { log.end() }
      }).catch(error=>{job.status='failed';job.error=error instanceof Error ? error.message : String(error)})
      return view(job)
    },
    status(id:string,sessionId:string) {
      const job=jobs.get(id)
      if(!job || job.sessionId!==sessionId) throw new Error('Export job not found for this editor session.')
      return view(job)
    },
    artifact(id:string) { return jobs.get(id)?.status==='ready' ? jobs.get(id)?.result : undefined },
    idle() { return queue },
  }
}
