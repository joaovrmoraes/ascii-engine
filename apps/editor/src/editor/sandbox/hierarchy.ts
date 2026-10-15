import { assetInfo,icon } from "../icons";
import type { SandboxContext } from './context';

export function refreshHierarchy(ctx: SandboxContext) {
    if (!ctx.hierarchy)
        return;
    const list = ctx.hierarchy.querySelector('[data-k="objects"]')!;
    list.replaceChildren();
    ctx.ui!.get('[data-k="scene-name"]').textContent = ctx.name;
    ctx.ui!.get('[data-k="count"]').textContent = String(ctx.scene.placed.length + ctx.scene.waters.length + (ctx.scene.terrain ? 1 : 0) + (ctx.cameraEditor?.entries().length ?? 0));
    if (ctx.scene.terrain && ctx.normalized('Terrain').includes(ctx.normalized(ctx.hierarchyQuery))) {
        const button = document.createElement('button');
        button.innerHTML = icon('terrain') + '<span>Terrain</span>';
        button.className = 'hierarchy-object terrain-row';
        button.onclick = () => { ctx.choose(); ctx.ui!.selectPane('terrain'); };
        list.append(button);
    }
    for (const { object, doc } of ctx.scene.placed) {
        const title = object.name || ctx.library[doc.prefab].title;
        if (!ctx.normalized(title).includes(ctx.normalized(ctx.hierarchyQuery)))
            continue;
        const button = document.createElement('button');
        button.innerHTML = icon(assetInfo(doc.prefab).icon);
        const label = document.createElement('span');
        label.textContent = title.replace(' (with fire and light)', '');
        button.append(label);
        button.className = `hierarchy-object${object === ctx.selected ? ' active' : ''}${!object.visible ? ' muted' : ''}`;
        button.dataset.objectId = doc.id;
        button.onclick = () => ctx.choose(object);
        button.ondblclick = () => { ctx.focus.copy(object.position); ctx.focus.y += .8; };
        list.append(button);
    }
    for (const { id, object, active } of ctx.cameraEditor?.entries() ?? []) {
        if (!ctx.normalized(object.name).includes(ctx.normalized(ctx.hierarchyQuery)))
            continue;
        const button = document.createElement('button');
        button.className = `hierarchy-object${object === ctx.selected ? ' active' : ''}`;
        button.dataset.cameraId = id;
        button.innerHTML = icon('camera');
        const label = document.createElement('span');
        label.textContent = object.name + (active ? ' · initial' : '');
        button.append(label);
        button.onclick = () => ctx.choose(object);
        list.append(button);
    }
    ctx.scene.waters.forEach((water, i) => {
        const title = ctx.snapshot().waters?.[i].name || `${water.shape.kind === 'paint' ? 'Water' : water.shape.kind === 'pond' ? 'Lake' : 'Stream'} ${i + 1}`;
        if (!ctx.normalized(title).includes(ctx.normalized(ctx.hierarchyQuery)))
            return;
        const button = document.createElement('button');
        button.innerHTML = icon('water');
        const label = document.createElement('span');
        label.textContent = title;
        button.append(label);
        button.dataset.waterIndex = String(i);
        button.className = `hierarchy-object${ctx.selectedWater === i ? ' active' : ''}`;
        button.classList.toggle('muted', !water.mesh.visible);
        button.onclick = () => { ctx.choose(); ctx.selectedWater = i; ctx.ui!.selectPane('object'); ctx.refreshHierarchy(); };
        list.append(button);
    });
    ctx.renderInspector();
}
