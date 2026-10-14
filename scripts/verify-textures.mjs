/** Texture studio controls, rendering, module isolation and persistence in real WebGL. */
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
const output = process.argv[2] ?? '/tmp/ascii-texture-verification'
await mkdir(output, { recursive: true })
const profile = await mkdtemp(join(tmpdir(), 'ascii-textures-'))
const port = 11800 + Math.floor(Math.random() * 100)
const chrome = spawn('chromium', ['--headless=new', '--no-sandbox', '--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--window-size=1600,1000', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
try {
  let targets
  for (let i = 0; i < 100 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(100) } }
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => { socket.onopen = resolve })
  let id = 0
  const pending = new Map(), errors = []; let interceptedDrag
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    if (data.method === 'Input.dragIntercepted') interceptedDrag = data.params.data
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text + ': ' + data.params.exceptionDetails.exception?.description)
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push(data.params.args.map(a => a.value ?? a.description).join(' '))
    const request = pending.get(data.id)
    if (request) { clearTimeout(request.timer); pending.delete(data.id); data.error ? request.reject(new Error(data.error.message)) : request.resolve(data.result) }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id, timer = setTimeout(() => { pending.delete(key); reject(new Error(`Timeout: ${method}`)) }, 45000)
    pending.set(key, { resolve, reject, timer }); socket.send(JSON.stringify({ id: key, method, params }))
  })
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text)
    return response.result?.value
  }
  const until = async expression => { for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await sleep(100) }; throw new Error(`Timed out: ${expression}`) }
  const action = async expression => { await evaluate(`(async () => { ${expression} })()`); await until('window.area && !area.state.includes("opening")'); await sleep(200) }
  const check = async (title, expression) => { if (!await evaluate(expression)) throw new Error(`FAIL: ${title}`); console.log(`PASS ${title}`) }
  const shot = async name => { await sleep(500); const result = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name + '.png'), Buffer.from(result.data, 'base64')) }

  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  const downloads=join(profile,'downloads');await mkdir(downloads);
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads })
  await send('Page.navigate', { url: 'http://localhost:1440/?area=sandbox' })
  await until('!!window.area && !!document.querySelector("canvas[data-ready]")')
  const standalone = await evaluate(`(() => {
    const canvas=document.createElement('canvas');canvas.style.cssText='width:128px;height:128px';document.body.append(canvas);
    const pure=core.createAsciiEngine(canvas,{effects:[{name:'consumer-effect',duration:1,emitters:[{rate:0,life:1,glyphs:'.'}]}]});
    let missing=false;try{pure.fx.play('fogueira',pure.camera.position)}catch{missing=true}
    const instance=pure.fx.play('consumer-effect',pure.camera.position);
    const result={types:Object.keys(pure.exportStyle().types).length,noGameEffect:missing,customEffect:!!instance};
    pure.dispose();pure.renderer.forceContextLoss();canvas.remove();return result;
  })()`)
  if(standalone.types!==0||!standalone.noGameEffect||!standalone.customEffect)throw new Error('Generic engine still depends on an implicit game library')
  console.log('PASS standalone core has no game types/effects and accepts a consumer effect library')
  const treeSource = 'data:model/gltf+json;base64,' + (await readFile('docs/captures/gltf-appearance-2026-10-13/tree-parts.gltf')).toString('base64')
  await action(`window.ui = (selector, value) => { const el = document.querySelector(selector); if (!el) throw new Error(selector); if (value === undefined) el.click(); else { el.value=value; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); } };
    window.tf = (key,value) => ui('#texture-studio [data-texture-field="'+key+'"]',value);
    window.tx = (key,value) => ui('#texture-studio [data-texture="'+key+'"]',value);
    window.object = id => engine.scene.children.find(o=>o.userData.sceneId===id);
    window.select = id => ui('#hierarchy [data-object-id="'+id+'"]');
    await area.openDocument({version:1,name:'Texture studio validation',objects:[
      {id:'block',prefab:'bloco',name:'Sample block',position:[0,0,0],scale:3},
      {id:'tree',prefab:'arvore',name:'Tree',position:[4,0,0]},
      {id:'import',prefab:'asset:tree',name:'Imported tree',position:[-4,0,0]}],assets:{'asset:tree':{name:'Imported tree',source:${JSON.stringify(treeSource)}}}});
    select('block'); window.before=JSON.stringify(area.document()); ui('[data-k="create-texture"]');`)
  await until('document.querySelector("#texture-preview canvas").dataset.ready === "block"')
  await check('Textures is a separate module with an isolated object', 'document.body.classList.contains("texture-studio-active") && !document.querySelector("#texture-studio").hidden && document.querySelector("#effect-preview").hidden')
  await check('inspector and studio share family names and stable IDs', `(() => {
    const options = selector => Array.from(document.querySelectorAll(selector)).filter(o => o.value).map(o => [o.value, o.textContent]);
    const inspector = options('#selection [data-k=surface] option');
    return JSON.stringify(inspector) === JSON.stringify(options('#texture-studio [data-texture-field=surface] option')) &&
      inspector.some(([id, label]) => id === 'wetgrass' && label === 'Wet grass') &&
      inspector.some(([id, label]) => id === 'actor' && label === 'Character');
  })()`)
  for (const [id, part] of [['block', ''], ['tree', 'crown'], ['tree', 'trunk'], ['import', 'crown'], ['import', 'trunk']]) {
    await action(`ui('[data-k=close-studio]'); select('${id}'); ui('#selection [data-k=part]', '${part}');
      window.catalogColor = document.querySelector('#selection [data-k=color]').value;
      window.catalogSize = document.querySelector('#selection [data-k=size]').value || parseFloat(document.querySelector('#selection [data-k=size]').placeholder);
      window.catalogLetters = document.querySelector('#selection [data-k=letters]').textContent;
      ui('[data-k=create-texture]')`)
    await until(`document.querySelector('#texture-preview canvas').dataset.ready === '${id}'`)
    await check(`${id}/${part || 'object'}: panels agree on inherited color, size and alphabet`, `
      document.querySelector('#texture-studio [data-texture-field=color]').value === catalogColor &&
      Number(document.querySelector('#texture-studio [data-texture-number=size]').value) === Number(catalogSize) &&
      document.querySelector('#texture-studio .texture-ramp').textContent === catalogLetters &&
      (${JSON.stringify(id)} !== 'import' || catalogColor !== '#ffffff')`)
    if (part) await check(`${id}/${part}: panels share the selected part label`, `
      document.querySelector('#selection [data-k=part]').selectedOptions[0].textContent ===
      document.querySelector('#texture-studio [data-texture=part]').selectedOptions[0].textContent`)
  }
  await check('reading the shared catalog leaves the document unchanged', 'JSON.stringify(area.document()) === before')
  await action(`ui('[data-k=close-studio]'); window.catalogScene = area.document();
    const actor = structuredClone(catalogScene); actor.objects[0].options = {glyph:'body', surface:'actor'};
    await area.openDocument(actor); select('block'); ui('[data-k=create-texture]')`)
  await until('document.querySelector("#texture-preview canvas").dataset.ready === "block"')
  await check('inherited character body size matches the renderer default in both panels', `
    parseFloat(document.querySelector('#selection [data-k=size]').placeholder) === .155 &&
    Number(document.querySelector('#texture-studio [data-texture-number=size]').value) === .155`)
  await action(`ui('[data-k=close-studio]'); await area.openDocument(catalogScene); select('block');
    window.before = JSON.stringify(area.document()); ui('[data-k=create-texture]')`)
  await until('document.querySelector("#texture-preview canvas").dataset.ready === "block"')
  await action(`ui('[data-texture-preview="pause"]')`);
  await shot('01-surface-before')
  const capture = async () => { await sleep(150); return evaluate('area.capturePreview()') }
  const beforeLetters=await capture()
  await action(`tf('alphabet','....')`)
  const dots=await capture()
  await action(`tf('alphabet','@@@@')`)
  if (dots===await capture() || dots===beforeLetters) throw new Error('Alphabet does not change rendered letters')
  console.log('PASS custom alphabets change rendered letters')
  for(const [key,value] of [['size','.32'],['spacing','1.8'],['density','.4'],['strength','2.5'],['contrast','.2'],['toneOffset','-.5'],['shadowSteps','3'],['color','#72bece']]) {
    await action(`tx('reset')`); const previous=await capture(); await action(`tf('${key}','${value}')`)
    if(previous===await capture()) throw new Error('Rendered control has no effect: '+key)
    console.log('PASS rendered surface '+key)
  }
  await check('preview edits leave the source scene unchanged', 'JSON.stringify(area.document())===before')
  await action(`tx('undo')`); await check('texture history undoes RGB', '!document.querySelector("#texture-preview canvas").dataset.style.includes("color")')
  await action(`tx('redo')`); await check('texture history redoes RGB', 'JSON.parse(document.querySelector("#texture-preview canvas").dataset.style).color===0x72bece')
  await action(`tx('reset'); tf('alphabet',' .:-+#@'); tf('size','.25'); tf('spacing','1.5'); tf('color','#72bece'); tx('name','Blue hatch')`)
  await shot('02-surface-after')
  await evaluate(`document.querySelector('[data-texture-field=size]').closest('fieldset').scrollIntoView({block:'start'})`); await shot('05-layout-and-ink-controls');
  await evaluate(`document.querySelector('#texture-studio').scrollTop=0`);
  await action(`tx('apply')`)
  await check('apply persists the texture on only the selected object', 'area.document().objects[0].options.alphabet===" .:-+#@" && area.document().objects[0].options.color===0x72bece && !area.document().objects[1].options.alphabet')
  await check('inspector and studio agree on an explicit RGB override', `
    document.querySelector('#selection [data-k=color]').value === '#72bece' &&
    document.querySelector('#texture-studio [data-texture-field=color]').value === '#72bece'`)
  await action(`ui('[data-k="close-studio"]'); ui('[data-k="undo"]')`); await until('!area.document().objects[0].options.alphabet');
  await action(`ui('[data-k="redo"]')`); await until('area.document().objects[0].options.alphabet===" .:-+#@"');
  await action(`select('block'); ui('[data-k="create-texture"]'); tx('name','Blue hatch')`); await until('document.querySelector("#texture-preview canvas").dataset.ready==="block"');
  console.log('PASS scene undo/redo restores the applied texture');
  await action(`tx('save')`); await until('Object.keys(area.document().textures??{}).length===1 && document.querySelector("[data-texture=save]").disabled===false')
  await check('saved texture is portable in the document and library', 'Object.values(area.document().textures)[0].name==="Blue hatch" && !!document.querySelector(".asset-card[data-texture]")')
  await evaluate('window.saved=area.document(); window.textureKey=Object.keys(saved.textures)[0]')
  await action(`tx('export')`)
  let file
  for(let i=0;i<30 && !file;i++){try{file=JSON.parse(await readFile(join(downloads,'my.texture.json'),'utf8'))}catch{await sleep(100)}}
  if(file?.texture?.alphabet!==' .:-+#@') throw new Error('Texture download failed')
  await writeFile(join(output,'my.texture.json'),JSON.stringify(file,null,2));
  console.log('PASS portable texture download')
  const {root:domRoot}=await send('DOM.getDocument'); const {nodeId:importInput}=await send('DOM.querySelector',{nodeId:domRoot.nodeId,selector:'[data-texture=import]'});
  await action(`tf('alphabet','XYZ')`); await send('DOM.setFileInputFiles',{nodeId:importInput,files:[join(downloads,'my.texture.json')]});
  await until('document.querySelector("[data-texture-field=alphabet]").value===" .:-+#@"');
  console.log('PASS portable texture import restores the recipe')
  await action(`ui('[data-k="close-studio"]'); select('tree'); ui('[data-k="create-texture"]')`)
  await until('document.querySelector("#texture-preview canvas").dataset.ready==="tree"')
  await action(`tx('part','crown')`)
  for(const [key,value] of [['alphabet','oO@'],['size','.28'],['spacing','1.5'],['density','.5'],['strength','2'],['contrast','2'],['toneOffset','.3'],['shadowSteps','3'],['color','#dcba57']]){
    await action(`tx('reset')`); const previous=await capture(); await action(`tf('${key}','${value}')`)
    if(previous===await capture()) throw new Error('Rendered body control has no effect: '+key)
    console.log('PASS rendered body '+key)
  }
  await action(`tf('alphabet','oO@'); tf('size','.28'); tf('color','#dcba57')`)
  await shot('03-body-crown')
  await action(`tx('apply')`)
  await check('crown appearance preserves trunk technique', '(()=>{const root=object("tree");let crown=[],trunk=[];root.traverse(n=>{if(n.isMesh){if(n.userData.glyphPart==="crown")crown.push(n.userData.glyphResolved);if(n.userData.glyphPart==="trunk")trunk.push(n.userData.glyphResolved)}});return crown.length>0&&crown.every(s=>s.glyph==="body"&&s.alphabet==="oO@")&&trunk.every(s=>s.glyph==="surface"&&!s.alphabet)})()')
  await action(`tx('part','trunk')`); await check('switching parts preserves the committed crown in the preview', 'JSON.parse(document.querySelector("#texture-preview canvas").dataset.options).parts.crown.alphabet==="oO@"');
  await action(`tx('object','import')`); await until('document.querySelector("#texture-preview canvas").dataset.ready==="import"')
  await action(`tx('part','crown'); tx('asset',textureKey); tx('apply')`)
  await check('saved texture applies to both meshes in an imported named part', '(()=>{const root=object("import"),crown=root.getObjectByName("crown"),trunk=root.getObjectByName("trunk");let leaves=[];crown.traverse(n=>{if(n.isMesh)leaves.push(n.userData.glyphResolved)});return leaves.length===2&&leaves.every(s=>s.glyph==="body"&&s.surface==="foliage"&&s.alphabet===" .:-+#@"&&s.color===0x72bece)&&!trunk.userData.glyphResolved.alphabet})()')
  await shot('04-imported-part')
  await action(`ui('[data-studio-page="effects"]')`)
  await check('Effects owns its stage after switching modules', 'document.querySelector("#texture-preview").hidden && !document.querySelector("#effect-preview").hidden')
  await action(`ui('[data-studio-page="atmosphere"]')`)
  await check('Atmosphere returns to the map and releases isolated stages', 'document.querySelector("#texture-preview").hidden && document.querySelector("#effect-preview").hidden')
  await action(`ui('[data-k="close-studio"]'); window.finalDoc=area.document(); await area.openDocument(finalDoc)`)
  await check('save/reopen keeps assets, object texture and part overrides', 'JSON.stringify(area.document().textures)===JSON.stringify(finalDoc.textures) && area.document().objects[1].options.parts.crown.alphabet==="oO@" && area.document().objects[2].options.parts.crown.color===0x72bece')
  await sleep(500)
  await send('Page.reload'); await sleep(1000); await until('!!window.area && area.document().name==="Texture studio validation"')
  await check('browser draft reload keeps textures', 'Object.values(area.document().textures)[0].name==="Blue hatch" && area.document().objects[0].options.alphabet===" .:-+#@"')
  await evaluate(`window.persisted=area.document();document.querySelector('[data-k=create-texture]').click();document.querySelector('[data-texture=object]').value='block';document.querySelector('[data-texture=object]').dispatchEvent(new Event('change'));`);
  await until('document.querySelector("#texture-preview canvas").dataset.ready==="block"');
  await evaluate(`document.querySelector('[data-texture=model-color]').click()`);
  await check('model color clears an existing RGB override in preview','!JSON.parse(document.querySelector("#texture-preview canvas").dataset.style).color');
  await evaluate(`document.querySelector('[data-texture=undo]').click();document.querySelector('[data-texture=redo]').click()`);
  await check('texture redo preserves model-color reset','JSON.parse(document.querySelector("#texture-preview canvas").dataset.style).color===undefined');
  await evaluate(`const field=document.querySelector('[data-texture-field=alphabet]');field.value='';field.dispatchEvent(new Event('input'));field.dispatchEvent(new Event('change'));document.querySelector('[data-texture=apply]').click()`);
  await until('area.document().objects[0].options.color===undefined&&area.document().objects[0].options.alphabet===undefined');
  console.log('PASS applying cleared alphabet and RGB restores model defaults');
  await evaluate(`(async()=>{await area.openDocument(persisted)})()`);

  await evaluate(`window.ui=(selector,value)=>{const el=document.querySelector(selector);if(!el)throw new Error(selector);if(value===undefined)el.click();else{el.value=value;el.dispatchEvent(new Event('input'));el.dispatchEvent(new Event('change'));}};
    window.tf=(key,value)=>ui('#texture-studio [data-texture-field="'+key+'"]',value);
    window.tx=(key,value)=>ui('#texture-studio [data-texture="'+key+'"]',value);
    window.tl=(key,value)=>ui('#texture-studio [data-texture-light="'+key+'"]',value);
    window.object=id=>engine.scene.children.find(o=>o.userData.sceneId===id);
    window.originalLightSource=JSON.stringify(area.document());`);
  for(const [id,part] of [['block',''],['import','crown']]) {
    await action(`tx('object','${id}')`); await until(`document.querySelector('#texture-preview canvas').dataset.ready==='${id}'`);
    if(part) await action(`tx('part','${part}')`);
    for(const [key,value] of [['alphabet',' ↑→↓←░▒▓█'],['font','"DejaVu Sans", sans-serif'],['fontWeight','700'],['rotation','45'],['lighting','unlit'],['emissive','#ff5500']]) {
      await action(`tx('reset')`); const previous=await capture(); await action(`tf('${key}',${JSON.stringify(value)})`);
      if(previous===await capture())throw new Error('Expanded rendered control has no effect: '+id+'/'+key);
      console.log('PASS expanded rendered '+id+' '+key);
    }
    await action(`tx('reset');tf('emissive','#5599ff');tf('emissiveIntensity','0')`);const noGlow=await capture();await action(`tf('emissiveIntensity','2')`);
    if(noGlow===await capture())throw new Error('Emission intensity has no rendered effect: '+id);console.log('PASS expanded rendered '+id+' emission intensity');
    await action(`tx('reset')`);const oneColor=await capture();await action(`ui('[data-texture-field="palette-enabled"]')`);
    if(oneColor===await capture())throw new Error('Palette has no rendered effect: '+id);
    const paletteColor=await capture();await action(`ui('[data-texture-palette="1"]','#ff3355')`);
    if(paletteColor===await capture())throw new Error('Palette stops have no rendered effect: '+id);console.log('PASS expanded rendered '+id+' palette stops');
    await action(`tx('reset');tx('custom-lighting');tl('background','#303040');tf('open','false')`);const filled=await capture();await action(`tf('open','true')`);
    if(filled===await capture())throw new Error('Letters-only does not remove occluder: '+id);console.log('PASS expanded rendered '+id+' letters only');
    if(part){const front=await capture();await action(`tf('faces','both')`);if(front===await capture())throw new Error('Body back faces have no effect');console.log('PASS rendered body back-face visibility');}
    await action(`tx('reset');tl('background','#080a10');tl('main-color','#ffffff');tl('main-intensity','2.2')`);
    const whiteLight=await capture();await action(`tl('main-color','#ff5566')`);
    if(whiteLight===await capture())throw new Error('Colored preview light has no rendered effect: '+id);console.log('PASS colored preview light '+id);
    const bright=await capture();await action(`tl('main-intensity','.2')`);if(bright===await capture())throw new Error('Preview light intensity has no effect: '+id);console.log('PASS preview light intensity '+id);
    if(part)await action(`tx('part','')`);
    await action(`tl('main-intensity','2');tf('lighting','unlit')`);const unlit=await capture();await action(`tl('main-color','#33ff88')`);
    if(unlit!==await capture())throw new Error('Uniform local shading still reacts to main light color: '+id);console.log('PASS uniform local shading ignores main light color '+id);
    if(part)await action(`tx('part','${part}')`);
    await action(`tf('lighting','scene');tf('alphabet',' ↑↗→↘↓↙←↖');tf('font','"DejaVu Sans", sans-serif');tf('fontWeight','700');tf('open','true');tf('emissive','#000000');tf('size','.25');tf('spacing','1.4')`);
    await evaluate(`document.querySelector('[data-texture-field=open]').closest('fieldset').scrollIntoView({block:'start'})`);await shot('06-letters-only-'+id);
    await evaluate(`document.querySelector('[data-texture-light=main-color]').closest('fieldset').scrollIntoView({block:'start'})`);await shot('07-preview-lighting-'+id);
  }
  await check('font/palette/visibility/light editing preserves the source document','JSON.stringify(area.document())===originalLightSource');
  await action(`tx('name','Emerald symbols');tx('save')`);await until('Object.values(area.document().textures).some(t=>t.name===\"Emerald symbols\")');
  await check('saved texture stores Unicode, font, open mode and independent preview lights','Object.values(area.document().textures).some(t=>t.name===\"Emerald symbols\"&&t.style.alphabet.includes(\"↑\")&&t.style.fontWeight===700&&t.style.open===true&&t.previewLighting.moon.color===0x33ff88)');

  await rm(join(downloads,'my.texture.json'));await action(`tx('export')`);
  let expandedFile;for(let i=0;i<30&&!expandedFile;i++){try{expandedFile=JSON.parse(await readFile(join(downloads,'my.texture.json'),'utf8'))}catch{await sleep(100)}}
  if(!expandedFile?.texture?.open||expandedFile?.previewLighting?.moon?.color!==0x33ff88)throw new Error('Extended texture download did not preserve controls/light rig');
  await writeFile(join(output,'symbols.texture.json'),JSON.stringify(expandedFile,null,2));
  await action(`tf('alphabet','XYZ')`);const {root:extendedDom}=await send('DOM.getDocument');const {nodeId:extendedInput}=await send('DOM.querySelector',{nodeId:extendedDom.nodeId,selector:'[data-texture=import]'});
  await send('DOM.setFileInputFiles',{nodeId:extendedInput,files:[join(downloads,'my.texture.json')]});
  await until('JSON.parse(document.querySelector("#texture-preview canvas").dataset.style).alphabet.includes("↑")&&JSON.parse(document.querySelector("#texture-preview canvas").dataset.lighting).moon.color===0x33ff88');
  console.log('PASS extended file import/export preserves fonts, Unicode, visibility and lighting');
  await action(`tx('apply')`);await check('applying the texture preserves scene lights','area.document().style.moon.color!==0x33ff88');
  await evaluate('window.sceneLightBefore=area.document().style.moon.color;window.symbolsDoc=area.document()');
  await action(`tx('save-lighting')`);await until('Object.values(area.document().atmospheres??{}).some(a=>a.name===\"Emerald symbols lighting\")');
  await check('studio lights can be saved separately as an atmosphere','Object.values(area.document().atmospheres).some(a=>a.style.moon.color===0x33ff88)&&area.document().style.moon.color===sceneLightBefore');
  await action(`tx('apply-lighting')`);await until('area.document().style.moon.color===0x33ff88');console.log('PASS explicit apply transfers preview lighting to scene');
  await action(`ui('[data-k="close-studio"]');ui('[data-k="undo"]')`);await until('area.document().style.moon.color===sceneLightBefore');console.log('PASS scene undo restores applied preview lights');
  await action(`await area.openDocument(symbolsDoc)`);await check('expanded texture survives project reopen','Object.values(area.document().textures).some(t=>t.name===\"Emerald symbols\"&&t.style.open&&t.previewLighting.moon.color===0x33ff88)');

  await writeFile(output+'/test-scene.ascii.json',JSON.stringify(await evaluate('area.document()'),null,2))
  await writeFile(output+'/result.json',JSON.stringify({errors,passed:errors.length===0},null,2))
  if(errors.length) throw new Error('Runtime/shader errors: '+errors.join('\n'))
  console.log('PASS no runtime or shader errors')
} finally {
  socket?.close(); chrome.kill(); await sleep(100); await rm(profile,{recursive:true,force:true})
}
