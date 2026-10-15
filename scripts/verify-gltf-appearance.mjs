/** Real WebGL import/appearance regression checks. Optional model paths follow the output directory. */
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const output = resolve(process.argv[2] ?? '/tmp/ascii-gltf-appearance')
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-gltf-'))
const port = 11000 + Math.floor(Math.random() * 1000)
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Portable fixture with a named crown group and trunk mesh, like a Blender export.
function treeFixture() {
  const ring = Array.from({ length: 8 }, (_, i) => [Math.cos(i * Math.PI / 4) * .18, 0, Math.sin(i * Math.PI / 4) * .18])
  const trunk = ring.flatMap((a, i) => { const b = ring[(i + 1) % ring.length], up = p => [p[0], 2.6, p[2]]; return [a, up(a), b, b, up(a), up(b)].flat() })
  const leaves = [[1, 2.9, 0], [0, 2.9, 1], [-1, 2.9, 0], [0, 2.9, -1]]
  const crown = leaves.flatMap((a, i) => { const b = leaves[(i + 1) % 4]; return [a, [0, 4, 0], b, b, [0, 2.1, 0], a].flat() })
  const arrays = [], bufferViews = [], accessors = [], meshes = []
  let byteOffset = 0
  for (const [material, vertices] of [trunk, crown].entries()) {
    const positions = new Float32Array(vertices), normals = new Float32Array(vertices.length)
    for (let i = 0; i < vertices.length; i += 9) {
      const a = vertices.slice(i, i + 3), b = vertices.slice(i + 3, i + 6).map((v, k) => v - a[k]), c = vertices.slice(i + 6, i + 9).map((v, k) => v - a[k])
      const n = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]], length = Math.hypot(...n)
      for (let k = 0; k < 9; k++) normals[i + k] = n[k % 3] / length
    }
    const positionIndex = accessors.length
    for (const data of [positions, normals]) {
      const view = bufferViews.length
      bufferViews.push({ buffer: 0, byteOffset, byteLength: data.byteLength })
      arrays.push(Buffer.from(data.buffer)); byteOffset += data.byteLength
      const accessor = { bufferView: view, componentType: 5126, count: data.length / 3, type: 'VEC3' }
      if (data === positions) {
        accessor.min = [0, 1, 2].map(k => Math.min(...vertices.filter((_, i) => i % 3 === k)))
        accessor.max = [0, 1, 2].map(k => Math.max(...vertices.filter((_, i) => i % 3 === k)))
      }
      accessors.push(accessor)
    }
    meshes.push({ primitives: [{ attributes: { POSITION: positionIndex, NORMAL: positionIndex + 1 }, material }] })
  }
  return { asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0] }], nodes: [
    { name: 'tree', children: [1, 2] },
    { name: 'trunk', mesh: 0, extras: { glyph: 'surface', glyph_surface: 'bark' } },
    { name: 'crown', children: [3, 4], extras: { glyph: 'body', glyph_surface: 'foliage', glyph_size: .19 } },
    { name: 'leaf', mesh: 1 },
    { name: 'leaf2', mesh: 1, translation: [.7, .3, .2] },
  ], meshes, materials: [[.45, .25, .1, 1], [.12, .5, .2, 1]].map(baseColorFactor => ({ pbrMetallicRoughness: { baseColorFactor, metallicFactor: 0, roughnessFactor: 1 }, doubleSided: true })),
  buffers: [{ byteLength: byteOffset, uri: 'data:application/octet-stream;base64,' + Buffer.concat(arrays).toString('base64') }], bufferViews, accessors }
}
const fixture = join(profile, 'tree-parts.gltf')
await writeFile(fixture, JSON.stringify(treeFixture()))
const paths = process.argv.slice(3).map(path => resolve(path))
if (!paths.length) paths.push(fixture)
const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,1000', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

let socket
const errors = []
try {
  let targets
  for (let i = 0; i < 100 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(100) } }
  if (!targets) throw new Error('Chromium did not start')
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => { socket.onopen = resolve })
  let id = 0
  const pending = new Map()
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text)
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push(data.params.args.map(a => a.value ?? a.description).join(' '))
    const request = pending.get(data.id)
    if (request) { clearTimeout(request.timer); pending.delete(data.id); data.error ? request.reject(new Error(data.error.message)) : request.resolve(data.result) }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id, timer = setTimeout(() => { pending.delete(key); reject(new Error(`Timeout: ${method}`)) }, 30000)
    pending.set(key, { resolve, reject, timer }); socket.send(JSON.stringify({ id: key, method, params }))
  })
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
    return result.result?.value
  }
  const until = async expression => { for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await sleep(100) }; throw new Error(`Timed out: ${expression}`) }
  const check = async (title, expression) => { if (!await evaluate(expression)) throw new Error(`FAIL: ${title}`); console.log(`PASS ${title}`) }
  const shot = async name => { await sleep(200); const result = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64')) }
  const importFiles = async files => {
    const { root } = await send('DOM.getDocument')
    const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-k="model-import"]' })
    const count = await evaluate('area.document().objects.length')
    await send('DOM.setFileInputFiles', { nodeId, files })
    await until(`area.document().objects.length === ${count + files.filter(file=>/\.(glb|gltf)$/i.test(file)).length} && !area.state.includes('opening')`)
  }
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  await evaluate(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value = value; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); } };
    window.editPart = ''; window.editScope = 'instance';
    window.edit = (key,value) => {
      if (key === 'part') { editPart = value; ui(document.body.classList.contains('texture-studio-active') ? '[data-texture=part]' : '#selection [data-k=part]',value); return }
      if (key === 'scope') editScope = value;
      if (!document.body.classList.contains('texture-studio-active')) { ui('#selection [data-k=edit-letters]'); if (editPart) ui('[data-texture=part]',editPart); }
      const scope = editScope === 'instance' ? (editPart ? 'part' : 'object') : editScope; if (document.querySelector('[data-texture=scope]').value !== scope) ui('[data-texture=scope]',scope);
      if (key === 'scope') return;
      if (key === 'apply') { ui('[data-texture=apply]'); ui('[data-k=close-studio]'); return }
      if (key === 'inherit-color') { ui('[data-texture=model-color]'); return }
      ui(key === 'size' ? '[data-texture-number=size]' : '[data-texture-field='+key+']',value);
    };
    window.selectObject = id => { ui('[data-k=close-studio]'); editPart = ''; ui('#hierarchy [data-object-id="'+id+'"]'); };
    window.object = id => engine.scene.children.find(o=>o.userData.sceneId===id);
    window.mesh = id => { let found; object(id).traverse(n=>{if(!found && n.isMesh) found=n}); return found };
    window.pixels = () => {engine.render(0);return engine.renderer.domElement.toDataURL()};`)
  const recipe=join(output,'mixed.texture.json')
  await writeFile(recipe,JSON.stringify({version:1,name:'Mixed import ink',texture:{alphabet:'XZ'}}))
  await importFiles([...paths,recipe])
  await check('one File import routes models, companions and texture JSON together', `Object.values(area.document().textures??{}).some(asset=>asset.name==='Mixed import ink')`)
  await evaluate(`(async()=>{const doc=area.document();doc.name='GLTF appearance verification';doc.objects=doc.objects.filter(o=>o.prefab.startsWith('asset-'));delete doc.terrain;delete doc.carpet;doc.objects.forEach((o,i)=>o.position=[(i-(doc.objects.length-1)/2)*3,0,0]);await area.openDocument(doc);area.authoring.view([0,1,0],'scene');view.zoom=1.2;window.ids=area.document().objects.map(o=>o.id)})()`)
  const ids = await evaluate('ids')
  for (const id of ids) {
    const q = JSON.stringify(id)
    await evaluate(`selectObject(${q});edit('glyph','surface');edit('surface','wood');edit('size','.12');edit('apply');window.before=pixels();edit('size','.4');edit('apply')`)
    await check(`${id}: surface size changes the rendered pixels`, `pixels()!==before && mesh(${q}).userData.glyphResolved.size===.4`)
    await evaluate(`window.before=pixels();edit('surface','stone');edit('apply')`)
    await check(`${id}: family changes the letters`, `pixels()!==before && mesh(${q}).material.userData.worldGlyph==='stone'`)
    await evaluate(`edit('color','#26bb55');edit('apply')`)
    await check(`${id}: color overrides the original material`, `mesh(${q}).material.color.getHex()===0x26bb55`)
    await evaluate(`edit('inherit-color');edit('apply')`)
    await check(`${id}: model color can be restored`, `mesh(${q}).userData.glyphResolved.color===undefined && mesh(${q}).material.color.getHex()!==0x26bb55`)
    await evaluate(`edit('glyph','body');edit('size','.15');edit('apply');window.small=mesh(${q}).children.find(n=>n.isPoints).geometry.attributes.position.count;edit('size','.35');edit('apply');edit('color','#ff3366');edit('apply')`)
    await check(`${id}: body size and color affect glyph sprites`, `mesh(${q}).children.find(n=>n.isPoints).geometry.attributes.position.count < small && mesh(${q}).children.find(n=>n.isPoints).material.uniforms.tint.value.getHex()===0xff3366`)
    await check(`${id}: imported model supports the type scope`, `!document.querySelector('[data-texture=scope] option[value=type]').disabled`)
  }
  await shot('imported-models')

  // Two pristine instances of the same model must share type appearance; instance edits stay local.
  await evaluate(`(async()=>{const doc=area.document(),first=doc.objects[0];window.prefab=first.prefab;doc.objects=[{...first,id:'copy-a',position:[-2,0,0],options:{}},{...first,id:'copy-b',position:[2,0,0],options:{}}];await area.openDocument(doc);selectObject('copy-a');edit('scope','type');edit('glyph','body');edit('surface','stone');edit('size','.22');edit('apply')})()`)
  await check('type changes reach both imported copies', `['copy-a','copy-b'].every(id=>mesh(id).userData.glyphResolved.glyph==='body' && mesh(id).userData.glyphResolved.size===.22)`)
  await evaluate(`edit('scope','instance');edit('size','.4');edit('apply')`)
  await check('instance override affects only its copy', `mesh('copy-a').userData.glyphResolved.size===.4 && mesh('copy-b').userData.glyphResolved.size===.22`)
  await evaluate(`window.expected=JSON.stringify(area.document());(async()=>{await area.openDocument(JSON.parse(expected));selectObject('copy-a')})()`)
  await check('save/reopen preserves model, type and instance appearance', `JSON.stringify(area.document())===expected && mesh('copy-a').userData.glyphResolved.size===.4 && mesh('copy-b').userData.glyphResolved.size===.22`)
  await evaluate(`edit('size','.31');edit('apply');ui('#authoring-toolbar [data-k=undo]')`)
  await until(`mesh('copy-a').userData.glyphResolved.size===.4`)
  await evaluate(`ui('#authoring-toolbar [data-k=redo]')`)
  await until(`mesh('copy-a').userData.glyphResolved.size===.31`)
  console.log('PASS undo/redo restores imported appearance')

  await importFiles([fixture])
  await evaluate(`window.treeId=area.document().objects.at(-1).id;selectObject(treeId);area.authoring.view([0,2,0],'scene');view.zoom=1;edit('scope','instance');edit('size','.28');edit('apply');window.tree=object(treeId);undefined`)
  await check('whole-tree size preserves separate crown and trunk techniques', `tree.getObjectByName('trunk').userData.glyphResolved.glyph==='surface' && tree.getObjectByName('leaf').userData.glyphResolved.glyph==='body' && tree.getObjectByName('leaf').userData.glyphResolved.size===.28`)
  await evaluate(`edit('part','crown');edit('size','.12');edit('color','#77cc33');edit('apply')`)
  await check('named crown group edits its descendants without changing the trunk', `['leaf','leaf2'].every(name=>tree.getObjectByName(name).userData.glyphResolved.size===.12 && tree.getObjectByName(name).userData.glyphResolved.color===0x77cc33) && tree.getObjectByName('trunk').userData.glyphResolved.size===.28 && tree.getObjectByName('trunk').userData.glyphResolved.color===undefined`)
  await evaluate(`edit('part','trunk');edit('size','.1');edit('surface','wood');edit('apply')`)
  await check('trunk size and family change independently', `tree.getObjectByName('trunk').userData.glyphResolved.size===.1 && tree.getObjectByName('trunk').material.userData.worldGlyph==='wood' && tree.getObjectByName('leaf').userData.glyphResolved.size===.12`)
  await evaluate(`window.expected=JSON.stringify(area.document());(async()=>{await area.openDocument(JSON.parse(expected));selectObject(treeId);edit('part','crown')})()`)
  await check('nested imported part appearance survives save/reopen', `JSON.stringify(area.document())===expected && object(treeId).getObjectByName('leaf').userData.glyphResolved.size===.12`)
  await evaluate(`selectObject(treeId);undefined`)
  await sleep(200)
  const point = await evaluate(`(()=>{const root=object(treeId),p=root.position.clone();p.y+=2.9;p.project(engine.camera);const r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2}})()`)
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, ...point, button: type==='mouseMoved'?'none':'left', buttons: type==='mousePressed'?1:0, clickCount: 1 })
  await check('clicking a crown selects its named group after hierarchy selection', `document.querySelector('#selection [data-k=part]').value==='crown' && document.querySelector('#selection [data-k=what]').textContent.includes('part "crown"')`)
  await shot('imported-tree-parts')
  await evaluate(`(async()=>{const doc=area.document(),item=doc.objects.find(o=>o.id===treeId);doc.objects=[{...item,id:'tree-a',position:[-2,0,0],options:{}},{...item,id:'tree-b',position:[2,0,0],options:{}}];await area.openDocument(doc);selectObject('tree-a');edit('part','crown');edit('scope','type');edit('size','.32');edit('color','#aa66ff');edit('apply')})()`)
  await check('all-copy crown edits override Blender defaults and leave every trunk unchanged', `['tree-a','tree-b'].every(id=>object(id).getObjectByName('leaf').userData.glyphResolved.size===.32 && object(id).getObjectByName('leaf2').userData.glyphResolved.color===0xaa66ff && object(id).getObjectByName('trunk').userData.glyphResolved.glyph==='surface' && object(id).getObjectByName('trunk').userData.glyphResolved.color===undefined)`)
  await evaluate(`(async()=>{const doc=area.document();doc.objects=[{...doc.objects[0],id:'object-2'}];await area.openDocument(doc)})()`)
  await importFiles(paths.slice(0, 1))
  await check('import after deletion preserves existing IDs and allocates a unique new ID', `area.document().objects[0].id==='object-2' && area.document().objects[1].id!=='object-2' && new Set(area.document().objects.map(o=>o.id)).size===2`)
  if (errors.length) throw new Error(errors.join('\n'))
  await writeFile(join(output, 'result.json'), JSON.stringify({ models: paths.map(p=>p.split('/').at(-1)), errors, passed: true }, null, 2))
  console.log('PASS no runtime or shader errors')
} finally {
  socket?.close(); chrome.kill()
  await new Promise(resolve => chrome.exitCode !== null || chrome.signalCode !== null ? resolve() : chrome.once('exit', resolve))
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
