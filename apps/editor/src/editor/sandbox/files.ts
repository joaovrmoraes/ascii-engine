import { emptyScene } from "@ascii-engine/core"
import { defaultScene } from '../../scene/defaultScene'
import { downloadDocument,importModelFiles,insertSceneItem,readImportedResource } from "../../scene/files"
import { createExportDialog } from "../exportDialog"
import { downloadStylePreset,loadStylePreset } from "../stylePresets"
import type { SandboxContext } from './context'

export function exportItem(ctx: SandboxContext) {
    if (!ctx.selected)
        return;
    const doc = ctx.snapshot(), item = doc.objects[ctx.scene.placed.findIndex(p => p.object === ctx.selected)];
    downloadDocument({ version: 1, name: item.name || item.prefab, style: doc.style, textures: doc.textures, objects: [{ ...item, position: [0, 0, 0] }], assets: doc.assets?.[item.prefab] ? { [item.prefab]: doc.assets[item.prefab] } : undefined, effects: doc.effects?.[item.prefab] ? { [item.prefab]: doc.effects[item.prefab] } : undefined }, 'item.json');
}

export function bindFiles(ctx: SandboxContext) {
    const el = <T extends HTMLElement>(key: string) => ctx.ui!.get<T>(`[data-k="${key}"]`);
    el<HTMLInputElement>('name').value = ctx.name;
    el<HTMLInputElement>('name').onchange = e => { ctx.name = (e.target as HTMLInputElement).value || 'Untitled'; ctx.changed(); };
    el('new').onclick = () => ctx.run(async () => { await ctx.replace(defaultScene()); ctx.focus.set(0, .8, 0); ctx.setMode('translate'); ctx.changed(); });
    el('item').onclick = () => ctx.run(async () => { await ctx.replace(emptyScene('My item')); ctx.focus.set(0, .8, 0); ctx.setMode('translate'); ctx.changed(); });
    const save = () => downloadDocument(ctx.snapshot());
    ctx.exportDialog = createExportDialog(ctx.snapshot);
    const exportScene = () => ctx.exportDialog!.open();
    el('save').onclick = save;
    el('save-short').onclick = save;
    el('export').onclick = exportScene;
    el('export-short').onclick = exportScene;
    el('undo').onclick = () => ctx.run(() => ctx.undo());
    el('redo').onclick = () => ctx.run(() => ctx.undo(true));
    const opener = el<HTMLInputElement>('open');
    opener.onchange = () => { const file = opener.files?.[0]; opener.value = ''; if (file)
        ctx.run(async () => { await ctx.replace(JSON.parse(await file.text())); ctx.setMode('translate'); ctx.changed(); }); };
    el('save-style').onclick = () => downloadStylePreset(ctx.engine);
    el<HTMLInputElement>('load-style').onchange = e => {
        const input = e.target as HTMLInputElement, file = input.files?.[0];
        input.value = '';
        if (file)
            ctx.run(async () => { await loadStylePreset(ctx.engine, file); ctx.atmosphereStudio?.refresh(); ctx.changed(); });
    };
    const modelImport = el<HTMLInputElement>('model-import');
    modelImport.onchange = () => { const files = Array.from(modelImport.files ?? []); modelImport.value = ''; if (files.length)
        ctx.canvas.dispatchEvent(new CustomEvent('editor-import-files', { detail: files })); };
}


export async function importSceneFiles(ctx: SandboxContext, files: File[]) {
    if (ctx.busy)
        throw new Error('Wait for the current scene to finish opening.');
    ctx.message('Importing resources…');
    const hasModels = files.some(file => /\.(glb|gltf)$/i.test(file.name));
    const imported = hasModels ? await importModelFiles(files) : {};
    let doc = ctx.snapshot(), category = hasModels ? 'Imported' : 'All';
    const resources = files.filter(file => /\.json$/i.test(file.name));
    if (!hasModels && !resources.length)
        throw new Error('Choose an item, texture, atmosphere, GLB or GLTF file.');
    for (const file of resources) {
        const resource = readImportedResource(JSON.parse(await file.text()), file.name);
        if (resource.kind === 'item')
            doc = insertSceneItem(doc, resource.document, [ctx.focus.x, ctx.scene.terrain?.heightAt(ctx.focus.x, ctx.focus.z) ?? 0, ctx.focus.z], Object.fromEntries(Object.entries(ctx.library).map(([key, prefab]) => [key, prefab.style])));
        else if (resource.kind === 'texture') {
            (doc.textures ??= {})[`texture-${crypto.randomUUID()}`] = resource.asset;
            category = 'Textures';
        }
        else {
            (doc.atmospheres ??= {})[`atmosphere-${crypto.randomUUID()}`] = resource.asset;
            category = 'Atmospheres';
        }
    }
    if (hasModels)
        doc.assets = { ...doc.assets, ...imported };
    for (const [prefab, asset] of Object.entries(imported))
        doc.objects.push({ id: crypto.randomUUID(), prefab, name: asset.name, position: [ctx.focus.x, ctx.scene.terrain?.heightAt(ctx.focus.x, ctx.focus.z) ?? 0, ctx.focus.z] });
    await ctx.replace(doc);
    if (hasModels)
        ctx.choose(ctx.scene.placed.at(-1)?.object);
    ctx.changed();
    if (ctx.ui) {
        ctx.assetCategory = category;
        ctx.refreshLibrary();
    }
}
