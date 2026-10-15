import { cp, mkdir, readFile, writeFile, realpath, rename } from 'node:fs/promises'
import { resolve, join, relative, sep } from 'node:path'
import { createHash } from 'node:crypto'

async function manifestAt(root) {
  return readFile(join(root, 'manifest.json'), 'utf8').then(JSON.parse, () => null)
}
async function canonicalReuse(manifest, from, to) {
  for (const axis of Object.values(manifest.axes))
    for (const point of axis.points) {
      if (point.reused)
        point.files = await Promise.all(
          point.files.map(async file => {
            const canonical = await realpath(resolve(from, file))
            return to ? relative(to, canonical) : canonical
          }),
        )
    }
  return manifest
}
/** Keep per-run writes out of repository/UI file watchers. Existing data is copied, never removed. */
export async function stageCapacityOutput(
  destination,
  cacheParent = resolve('.cache/bench-capacity'),
) {
  destination = resolve(destination)
  const root = join(
    resolve(cacheParent),
    createHash('sha256').update(destination).digest('hex').slice(0, 12),
  )
  if (root === destination || root.startsWith(destination + sep))
    throw new Error('Use a dedicated output folder, not an ancestor of the staging cache')
  await mkdir(root, { recursive: true })
  if (!(await manifestAt(root))) {
    const previous = await manifestAt(destination)
    if (previous) {
      await cp(destination, root, { recursive: true })
      await writeFile(
        join(root, 'manifest.json'),
        JSON.stringify(await canonicalReuse(previous, destination), null, 2) + '\n',
      )
    }
  }
  return root
}
/** Publish only after measurement. The final manifest refers to complete files and portable historical links. */
export async function publishCapacityOutput(root, destination) {
  root = resolve(root)
  destination = resolve(destination)
  if (
    root === destination ||
    destination.startsWith(root + sep) ||
    root.startsWith(destination + sep)
  )
    throw new Error('Staging and output must be separate folders')
  const manifest = await manifestAt(root)
  if (!manifest) throw new Error('No capacity manifest to publish')
  const published = await canonicalReuse(manifest, root, destination)
  await mkdir(destination, { recursive: true })
  await cp(root, destination, {
    recursive: true,
    filter: source => source !== join(root, 'manifest.json'),
  })
  const temporary = join(destination, 'manifest.json.tmp')
  await writeFile(temporary, JSON.stringify(published, null, 2) + '\n')
  await rename(temporary, join(destination, 'manifest.json'))
}
