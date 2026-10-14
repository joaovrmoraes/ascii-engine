/** Publish the generated site on its hosting branch without changing the source checkout. */
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = join(root, '.cache/pages')
if (!existsSync(join(output, 'sandbox/index.html'))) throw new Error('Run pnpm pages:build first.')
const env = {
  ...process.env,
  GIT_INDEX_FILE: join(root, '.cache/pages.index'),
  GIT_AUTHOR_NAME: 'github-actions[bot]',
  GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
  GIT_COMMITTER_NAME: 'github-actions[bot]',
  GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
}
const git = (args, cwd = root) =>
  execFileSync('git', args, { cwd, env, encoding: 'utf8' }).trim()
const source = git(['rev-parse', 'HEAD'])
const remote = git(['ls-remote', '--heads', 'origin', 'gh-pages'])
let parent
if (remote) {
  git(['fetch', 'origin', 'gh-pages:refs/remotes/origin/gh-pages'])
  parent = git(['rev-parse', 'refs/remotes/origin/gh-pages'])
}
const gitDir = git(['rev-parse', '--absolute-git-dir'])
git(['read-tree', '--empty'])
git([`--git-dir=${gitDir}`, `--work-tree=${output}`, 'add', '--all', '--force'], output)
const tree = git(['write-tree'])
const changed = !parent || git(['rev-parse', `${parent}^{tree}`]) !== tree
if (changed) {
  const commit = git(['commit-tree', tree, ...(parent ? ['-p', parent] : []),
    '-m', `Publish map demos from ${source}`])
  console.log(`Hosting commit ${commit}, source ${source}`)
  if (!process.argv.includes('--dry-run')) {
    git(['push', 'origin', `${commit}:refs/heads/gh-pages`])
  }
} else console.log(`Hosting tree is current: ${parent}`)
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
}
