import { assetInfo,icon } from "../icons";
import type { SandboxContext } from './context';

export function refreshLibrary(ctx: SandboxContext) {
    if (!ctx.ui)
        return;
    const doc = ctx.snapshot(), atmospheres = doc.atmospheres ?? {};
    const categories = ctx.ui!.get('[data-k="categories"]');
    categories.replaceChildren();
    for (const category of ['All', 'Nature', 'Buildings', 'Shapes', 'Effects', 'Atmospheres', 'Textures', 'Imported']) {
        const button = document.createElement('button');
        button.innerHTML = icon('folder');
        const text = document.createElement('span');
        text.textContent = category;
        button.append(text);
        const count = Object.keys(ctx.library).filter(key => category === 'All' || assetInfo(key).category === category).length + (category === 'All' || category === 'Atmospheres' ? Object.keys(atmospheres).length : 0) + (category === 'All' || category === 'Textures' ? Object.keys(doc.textures ?? {}).length : 0);
        const badge = document.createElement('small');
        badge.textContent = String(count);
        button.append(badge);
        button.className = category === ctx.assetCategory ? 'active' : '';
        button.onclick = () => { ctx.assetCategory = category; ctx.refreshLibrary(); };
        categories.append(button);
    }
    const grid = ctx.ui!.get('[data-k="assets"]');
    grid.replaceChildren();
    for (const [key, prefab] of Object.entries(ctx.library)) {
        const info = assetInfo(key);
        if (ctx.assetCategory !== 'All' && info.category !== ctx.assetCategory || !ctx.normalized(prefab.title).includes(ctx.normalized(ctx.assetQuery)))
            continue;
        const card = document.createElement('button');
        card.className = 'asset-card';
        card.draggable = true;
        card.dataset.prefab = key;
        card.title = `Drag ${prefab.title} into the scene or click to place`;
        card.style.setProperty('--asset-color', info.color);
        card.innerHTML = `<span class="asset-thumbnail">${icon(info.icon)}</span>`;
        const label = document.createElement('span');
        label.textContent = prefab.title.replace('shape: ', '').replace('effect: ', '').replace(' (with fire and light)', '');
        card.append(label);
        card.classList.toggle('active', key === ctx.tool.prefab && ctx.tool.kind === 'place');
        card.onclick = () => ctx.beginPlacement(key);
        if (doc.effects?.[key]) {
            card.title += '; double-click to edit the effect';
            card.ondblclick = () => { ctx.effectEditor!.edit(key); ctx.ui!.showStudio('effects'); };
        }
        card.ondragstart = event => { if (!event.dataTransfer)
            return; ctx.tool.prefab = key; event.dataTransfer.setData('application/x-ascii-prefab', key); event.dataTransfer.effectAllowed = 'copy'; ctx.gizmos?.attach(); ctx.refreshHint(); };
        card.ondragend = () => { ctx.placement.clear(); ctx.gizmos?.cursor(); ctx.ui!.get('#placement-label').hidden = true; if (ctx.tool.kind === 'select' && ctx.transformMode !== 'hand' && ctx.transformMode !== 'orbit')
            ctx.gizmos?.attach(ctx.selected); };
        grid.append(card);
    }
    for (const [key, asset] of Object.entries(atmospheres)) {
        if (ctx.assetCategory !== 'All' && ctx.assetCategory !== 'Atmospheres' || !ctx.normalized(asset.name).includes(ctx.normalized(ctx.assetQuery)))
            continue;
        const card = document.createElement('button');
        card.className = 'asset-card';
        card.dataset.atmosphere = key;
        card.title = `Click to select ${asset.name}; double-click to edit; Apply to change the scene`;
        card.style.setProperty('--asset-color', '#b4a6cf');
        card.innerHTML = `<span class="asset-thumbnail">${icon('spark')}</span>`;
        const label = document.createElement('span');
        label.textContent = asset.name;
        card.append(label);
        card.onclick = () => { ctx.placement.clear(); ctx.tool.kind = 'select'; ctx.gizmos?.attach(ctx.selected); ctx.gizmos?.cursor(); ctx.refreshHint(); grid.querySelectorAll('.active').forEach(card => card.classList.remove('active')); card.classList.add('active'); grid.querySelector('[data-resource-action]')?.remove(); const action = document.createElement('button'); action.dataset.resourceAction = 'apply-atmosphere'; action.textContent = `Apply ${asset.name} to scene`; action.onclick = () => ctx.atmosphereStudio!.applyAsset(key); grid.append(action); };
        card.ondblclick = () => { ctx.atmosphereStudio!.applyAsset(key); ctx.ui!.showStudio('atmosphere'); };
        grid.append(card);
    }
    for (const [key, asset] of Object.entries(doc.textures ?? {})) {
        if (ctx.assetCategory !== 'All' && ctx.assetCategory !== 'Textures' || !ctx.normalized(asset.name).includes(ctx.normalized(ctx.assetQuery)))
            continue;
        const card = document.createElement('button');
        card.className = 'asset-card';
        card.dataset.texture = key;
        card.title = `Click to select ${asset.name}; double-click to edit; drag onto an object or part to link`;
        card.draggable = true;
        card.style.setProperty('--asset-color', '#96bfbe');
        const thumbnail = document.createElement('span');
        thumbnail.className = 'asset-thumbnail texture-thumbnail';
        thumbnail.textContent = asset.style.alphabet ?? '@#*:';
        const label = document.createElement('span');
        label.textContent = asset.name;
        card.append(thumbnail, label);
        card.onclick = () => { grid.querySelectorAll('.active').forEach(card => card.classList.remove('active')); card.classList.add('active'); ctx.message(`Texture selected: ${asset.name}. Drag onto an object or part; double-click to edit.`); };
        card.ondblclick = () => { ctx.textureStudio!.editAsset(key, true); ctx.ui!.showStudio('textures'); };
        card.ondragstart = event => { event.dataTransfer?.setData('application/x-ascii-texture', key); if (event.dataTransfer)
            event.dataTransfer.effectAllowed = 'link'; };
        grid.append(card);
    }
    if (!grid.childElementCount) {
        const hint = document.createElement('p');
        hint.className = 'empty-library';
        hint.textContent = ctx.assetCategory === 'Imported' ? 'Use Import model to add your GLB and GLTF files.' : ctx.assetCategory === 'Atmospheres' ? 'Create an atmosphere in the Studio and choose Save to Assets.' : ctx.assetCategory === 'Textures' ? 'Select an object, open Textures in the Studio and choose Save to Assets.' : 'No assets found.';
        grid.append(hint);
    }
}
