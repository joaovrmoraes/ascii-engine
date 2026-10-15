/** Build the gallery and browser editor into an ignored GitHub Pages artifact. */
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = join(root, '.cache/pages')
const run = (command, args, env = process.env) =>
  execFileSync(command, args, { cwd: root, stdio: 'inherit', env })

run(process.execPath, ['scripts/preview-readme.mjs', '--github-pages', '--generate-only'])
run('pnpm', ['--filter', '@ascii-engine/editor', 'build'], {
  ...process.env,
  VITE_PUBLIC_DEMO: 'true',
})

// Replace only this script's generated artifact, so obsolete hashed bundles do not accumulate.
rmSync(output, { recursive: true, force: true })
mkdirSync(output, { recursive: true })
// Copy tracked documentation only, excluding ignored browser profiles and caches.
const files = execFileSync('git', ['ls-files', '-z', 'docs'], { cwd: root, encoding: 'utf8' })
for (const file of files.split('\0').filter(Boolean)) {
  const target = join(output, file.slice('docs/'.length))
  mkdirSync(dirname(target), { recursive: true })
  cpSync(join(root, file), target)
}
cpSync(join(root, 'apps/editor/dist'), join(output, 'sandbox'), { recursive: true })
console.log(`Pages artifact: ${output}`)
