import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { stageCapacityOutput, publishCapacityOutput } from './bench-capacity-files.mjs'

test('measurement stays in staging until explicit publication; historical symlinks resolve portably', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'capacity-output-'))
  t.after(() => rm(temp, { recursive: true, force: true }))
  const output = join(temp, 'docs/capacity'),
    history = join(temp, 'docs/phase-2'),
    alias = join(temp, 'history-alias')
  await mkdir(output, { recursive: true })
  await mkdir(history)
  await writeFile(join(history, 'water.json'), 'original raw data\n')
  await symlink(history, alias, 'dir')
  const manifest = {
    axes: {
      water: {
        points: [{ reused: 'audited historical point', files: ['../../history-alias/water.json'] }],
      },
    },
  }
  await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest))
  await writeFile(join(output, 'README.md'), 'preserved documentation\n')
  const root = await stageCapacityOutput(output, join(temp, 'cache'))
  await mkdir(join(root, 'new-run'))
  await writeFile(join(root, 'new-run/water.json'), 'new raw data\n')
  const staged = JSON.parse(await readFile(join(root, 'manifest.json')))
  staged.axes.water.points.push({ files: ['new-run/water.json'] })
  await writeFile(join(root, 'manifest.json'), JSON.stringify(staged))
  await assert.rejects(readFile(join(output, 'new-run/water.json')))
  assert.deepEqual(JSON.parse(await readFile(join(output, 'manifest.json'))), manifest)
  await publishCapacityOutput(root, output)
  const published = JSON.parse(await readFile(join(output, 'manifest.json')))
  assert.equal(published.axes.water.points[0].files[0], '../phase-2/water.json')
  assert.equal(
    await readFile(join(output, published.axes.water.points[0].files[0]), 'utf8'),
    'original raw data\n',
  )
  assert.equal(
    await readFile(join(output, published.axes.water.points[1].files[0]), 'utf8'),
    'new raw data\n',
  )
  assert.equal(await readFile(join(output, 'README.md'), 'utf8'), 'preserved documentation\n')
  assert.equal(await stageCapacityOutput(output, join(temp, 'cache')), root)
})
test('rejects recursive publication and output ancestors before copying', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'capacity-guard-'))
  t.after(() => rm(temp, { recursive: true, force: true }))
  await assert.rejects(stageCapacityOutput(temp, join(temp, 'cache')), /dedicated output/)
  await assert.rejects(publishCapacityOutput(temp, join(temp, 'nested')), /separate folders/)
})
