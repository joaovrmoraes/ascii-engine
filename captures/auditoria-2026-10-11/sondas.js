// Auditoria: executar somente em navegador/perfil descartável, no servidor de desenvolvimento.
(async () => {
  const { createPrefabs } = await import('/src/scene/prefabs.ts');
  const { createSandbox } = await import('/src/areas/sandbox.ts');
  const { core, engine } = window;
  const library = createPrefabs(engine);
  const doc = { version: 1, objects: [{ prefab: 'arvore', position: [40, 0, 40] }] };
  const built = core.buildScene(engine, doc, library);
  const tree = built.placed[0].object;
  engine.setPartStyle(tree, 'crown', { size: .31 });
  engine.setTypeStyle('arvore', { parts: { crown: { size: .29 } } });
  engine.setStyle({ brightness: .8 });
  const saved = JSON.parse(JSON.stringify(built.toJSON()));
  const audit = {
    persistence: {
      liveInstance: engine.instanceStyle(tree), savedInstance: saved.objects[0].options ?? null,
      liveBrightness: engine.style.brightness, savedStyle: saved.style ?? null,
      liveTypeSize: engine.types.arvore.parts.crown.size,
    },
  };
  const again = core.buildScene(engine, saved, library);
  audit.persistence.reopenedInstance = engine.instanceStyle(again.placed[0].object);
  audit.persistence.reopenedTypeSize = engine.types.arvore.parts.crown.size;
  function geometrySignature(object) {
    const result = [];
    object.traverse(n => { if (n.isMesh) result.push({ p: n.position.toArray(), s: n.scale.toArray(), matrix: n.instanceMatrix ? Array.from(n.instanceMatrix.array.slice(0, 64)) : null }); });
    return JSON.stringify(result);
  }
  audit.prefabSameDocumentSameGeometry = geometrySignature(tree) === geometrySignature(again.placed[0].object);
  let carpetUpdates = 0;
  const carpet = engine.createCarpet({ count: 1, extent: 1, y: () => 0, density: () => 1, pick: () => ({ glyph: 0, height: .1, color: [.2, .5, .2] }) });
  engine.add(carpet.mesh, { glyph: 'carpet' });
  const update = carpet.update;
  carpet.update = (...args) => { carpetUpdates++; update(...args); };
  engine.remove(carpet.mesh, { dispose: true });
  engine.render(0);
  audit.removedCarpetStillUpdated = carpetUpdates;
  try { createSandbox(engine, { scene: core.emptyScene('empty') }); audit.emptyScene = 'loaded'; }
  catch (error) { audit.emptyScene = String(error); }
  built.dispose(); again.dispose();
  window.audit = audit;
})().catch(error => { window.audit = { error: String(error), stack: error.stack }; });
