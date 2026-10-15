/** Enforce package contracts and keep optional content out of generic renderer entries. */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { createRequire } from 'node:module'

const root = resolve(import.meta.dirname, '..')
const require = createRequire(join(root, 'apps/editor/package.json'))
const ts = require('typescript')
const engine = join(root, 'packages/engine/src')
const packages = ['packages/engine', 'packages/authoring', 'apps/automation', 'apps/editor']
const failures = []

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return files(path)
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') ? [path] : []
  })
}

function imports(path) {
  const ast = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true)
  const sources = []
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier))
        sources.push(node.moduleSpecifier.text)
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      if (ts.isStringLiteral(node.arguments[0])) sources.push(node.arguments[0].text)
      else failures.push(`Dynamic import must name its package contract: ${relative(root, path)}`)
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      if (ts.isStringLiteral(node.argument.literal)) sources.push(node.argument.literal.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return sources
}

function resolveSource(path, source) {
  const target = resolve(dirname(path), source)
  return [target + '.ts', join(target, 'index.ts')].find(existsSync)
}

for (const name of packages) {
  const directory = join(root, name),
    sources = files(join(directory, 'src'))
  const config = join(directory, 'vite.config.ts')
  if (existsSync(config)) sources.push(config)
  for (const path of sources)
    for (const source of imports(path)) {
      if (source.startsWith('@ascii-engine/')) {
        const dependency = source.split('/')[1]
        const allowed =
          name === 'packages/engine'
            ? []
            : name === 'packages/authoring'
              ? ['core']
              : name === 'apps/automation'
                ? ['authoring']
                : path === config
                  ? ['core', 'authoring', 'automation']
                  : ['core', 'authoring']
        if (!allowed.includes(dependency)) {
          failures.push(`${relative(root, path)} imports an upstream application: ${source}`)
        }
        if (name === 'packages/authoring' && /\/core\/(pomorog|presets)/.test(source)) {
          failures.push(`Document commands depend on an optional content library: ${source}`)
        }
      }
      if (!source.startsWith('.')) continue
      const target = resolve(dirname(path), source)
      if (!target.startsWith(directory + sep)) {
        failures.push(`${relative(root, path)} imports another package's source: ${source}`)
      }
    }
}

const visited = new Set()
function visit(path) {
  if (visited.has(path)) return
  visited.add(path)
  const name = relative(engine, path)
  if (name.startsWith('presets' + sep) || name === join('fx', 'presets.ts')) {
    failures.push(`Generic renderer entry reaches optional preset: ${name}`)
    return
  }
  for (const source of imports(path)) {
    if (source.startsWith('.')) {
      const next = resolveSource(path, source)
      if (!next) failures.push(`Unresolved core module: ${name} → ${source}`)
      else if (!next.startsWith(engine + sep))
        failures.push(`Core reaches outside its package: ${name}`)
      else visit(next)
    } else if (source !== 'three' && !source.startsWith('three/')) {
      failures.push(`Core imports external adapter: ${name} → ${source}`)
    }
  }
}

const exports = JSON.parse(readFileSync(join(root, 'packages/engine/package.json'), 'utf8')).exports
for (const entry of ['.', './techniques', './world', './fx']) {
  visit(resolve(root, 'packages/engine', exports[entry]))
}
for (const entry of ['./presets', './pomorog']) {
  if (!existsSync(resolve(root, 'packages/engine', exports[entry])))
    failures.push(`Missing public entry: ${entry}`)
}

if (failures.length) {
  failures.forEach(failure => console.error(failure))
  process.exitCode = 1
} else {
  console.log(
    `PASS package imports use public contracts; ${visited.size} generic core modules contain no optional preset or application dependency.`,
  )
}
