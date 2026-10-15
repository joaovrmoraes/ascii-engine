// Format versioned files only, leaving untracked drafts and other agents' plans alone.
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const mode = process.argv[2]
if (!['--check', '--write'].includes(mode) || process.argv.length !== 3) {
  console.error('Usage: node scripts/format.mjs --check|--write')
  process.exit(1)
}

const root = fileURLToPath(new URL('..', import.meta.url))
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
const cli = fileURLToPath(import.meta.resolve('prettier/bin/prettier.cjs'))
const result = spawnSync(process.execPath, [cli, mode, '--ignore-unknown', '--', ...files], {
  cwd: root,
  stdio: 'inherit',
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
