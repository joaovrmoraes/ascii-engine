// Exportação de um jogo/cena (fase 8).
//
// Uso:
//   node scripts/export.mjs --title "Meu Jogo" (--area dark_forest | --scene cenario.json)
//                           [--out exports/meu-jogo] [--zoom 1.1] [--desktop] [--bundle deb,appimage]
//
// Web: compila o editor (Vite), copia para `--out/web` e grava `game.json`, que
// o transforma em jogador (sem painéis): basta servir a pasta estaticamente.
// Desktop (--desktop): empacota a mesma pasta com o Tauri, com nome e
// identificador próprios. Android e iOS seguem o mesmo caminho (`tauri android
// build` / `tauri ios build`) quando os SDKs estiverem instalados.
import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const args = process.argv.slice(2)
const arg = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback }
const title = arg('title', 'ASCII Engine')
const slug = title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jogo'
const out = resolve(arg('out', join(root, 'exports', slug)))
const area = arg('area'), scene = arg('scene'), zoom = arg('zoom')
if (!area && !scene) { console.error('informe --area <id> ou --scene <arquivo.json>'); process.exit(1) }

const run = (cmd, cmdArgs, cwd = root) => {
  console.log(`$ ${cmd} ${cmdArgs.join(' ')}`)
  const r = spawnSync(cmd, cmdArgs, { cwd, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

// 1. Web build.
run('pnpm', ['--filter', '@ascii-engine/editor', 'exec', 'vite', 'build'])
const web = join(out, 'web')
rmSync(web, { recursive: true, force: true }); mkdirSync(web, { recursive: true })
cpSync(join(root, 'apps/editor/dist'), web, { recursive: true })
const game = { title, ...(area ? { area } : {}), ...(zoom ? { zoom: Number(zoom) } : {}) }
if (scene) { cpSync(resolve(scene), join(web, 'scene.json')); game.scene = './scene.json' }
writeFileSync(join(web, 'game.json'), JSON.stringify(game, null, 2))
console.log(`web: ${web} (sirva a pasta, por exemplo: python -m http.server -d "${web}")`)

// 2. Desktop with Tauri.
if (args.includes('--desktop')) {
  const tauriDir = join(root, 'apps/editor/src-tauri')
  const base = JSON.parse(readFileSync(join(tauriDir, 'tauri.conf.json'), 'utf8'))
  const config = {
    productName: title,
    identifier: `dev.asciiengine.${slug.replace(/-/g, '')}`,
    build: { beforeBuildCommand: '', beforeDevCommand: '', frontendDist: web },
    app: { windows: [{ ...base.app.windows[0], title }] },
    bundle: { active: !!arg('bundle'), targets: arg('bundle') ? arg('bundle').split(',') : 'all' },
  }
  const configPath = join(out, 'tauri.game.conf.json')
  writeFileSync(configPath, JSON.stringify(config, null, 2))
  run('pnpm', ['--filter', '@ascii-engine/editor', 'exec', 'tauri', 'build', '--config', configPath, ...(arg('bundle') ? [] : ['--no-bundle'])])
  const binary = join(tauriDir, 'target/release', existsSync(join(tauriDir, 'target/release/ascii-engine-editor')) ? 'ascii-engine-editor' : '')
  console.log(`desktop: ${binary || join(tauriDir, 'target/release')} ${arg('bundle') ? `(pacotes em ${join(tauriDir, 'target/release/bundle')})` : '(binário, sem instalador)'}`)
}
console.log(`pronto: ${basename(out)}`)
