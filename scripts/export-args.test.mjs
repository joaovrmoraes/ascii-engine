import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseExportArgs } from './export-args.mjs'

for (const title of [
  '--desktop',
  '--scene',
  '--bundle',
  'A title with spaces',
  '--out=elsewhere',
]) {
  test(`consumes the literal title ${title}`, () => {
    assert.deepEqual(parseExportArgs(['--title', title, '--scene', 'scene.json']), {
      title,
      scene: 'scene.json',
      desktop: false,
    })
  })
}
test('supports equals values and independent boolean flags', () => {
  assert.deepEqual(
    parseExportArgs([
      '--',
      '--title=--scene',
      '--scene=input.json',
      '--desktop',
      '--out=exports/test',
      '--zoom=1.3',
    ]),
    { desktop: true, title: '--scene', scene: 'input.json', out: 'exports/test', zoom: '1.3' },
  )
  assert.equal(parseExportArgs(['--desktop=false']).desktop, false)
})
for (const argv of [['--title'], ['--out='], ['--unknown'], ['unexpected'], ['--desktop=maybe']]) {
  test(`rejects invalid arguments ${JSON.stringify(argv)}`, () =>
    assert.throws(() => parseExportArgs(argv)))
}
