import { icon } from "../icons";
import { renderWaterInspector } from "../waterInspector";
import type { SandboxContext } from './context';

export function syncTransformFields(ctx: SandboxContext) {
    if (!ctx.selected || !ctx.ui)
        return;
    for (const [property, label] of [['position', 'Position'], ['rotation', 'Rotation'], ['scale', 'Scale']] as const)
        for (const axis of ['x', 'y', 'z'] as const) {
            const input = ctx.ui!.inspector.querySelector<HTMLInputElement>(`[data-field="${label} ${axis}"]`);
            if (input)
                input.value = String(Number((ctx.selected[property][axis] * (property === 'rotation' ? 180 / Math.PI : 1)).toFixed(3)));
        }
}

export function renderInspector(ctx: SandboxContext) {
    const inspector = ctx.ui!.inspector;
    inspector.replaceChildren();
    const field = (label: string, value: string, change: (value: string) => void, type = 'number') => {
        const row = document.createElement('label');
        row.textContent = label;
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.step = '.1';
        input.dataset.field = label;
        input.onchange = () => { if (type === 'number' && !Number.isFinite(input.valueAsNumber))
            return; ctx.run(() => change(input.value)); };
        row.append(input);
        inspector.append(row);
    };
    const actions = document.createElement('div');
    actions.className = 'object-actions';
    const button = (label: string, action: () => void | Promise<void>) => { if (!actions.parentNode)
        inspector.append(actions); const b = document.createElement('button'); b.textContent = label; b.onclick = () => ctx.run(action); actions.append(b); };
    if (ctx.cameraEditor?.selected)
        ctx.cameraEditor.inspector(inspector);
    else if (ctx.selected) {
        const object = ctx.selected;
        field('Name', object.name, value => { object.name = value; ctx.changed(); }, 'text');
        const row = document.createElement('label'), visible = document.createElement('input');
        row.textContent = 'Visible';
        visible.type = 'checkbox';
        visible.checked = object.visible;
        visible.onchange = () => { object.visible = visible.checked; ctx.gizmos?.attach(object.visible ? object : undefined); ctx.changed(); };
        row.append(visible);
        inspector.append(row);
        const component = document.createElement('div');
        component.className = 'component-title';
        component.innerHTML = icon('move') + ' Transform';
        inspector.append(component);
        for (const [property, label] of [['position', 'Position'], ['rotation', 'Rotation'], ['scale', 'Scale']] as const) {
            const row = document.createElement('div');
            row.className = 'vector-row';
            const title = document.createElement('span');
            title.textContent = label;
            row.append(title);
            for (const axis of ['x', 'y', 'z'] as const) {
                const cell = document.createElement('label');
                cell.className = `axis-${axis}`;
                cell.textContent = axis.toUpperCase();
                const input = document.createElement('input');
                input.type = 'number';
                input.step = property === 'rotation' ? '5' : '.1';
                input.dataset.field = `${label} ${axis}`;
                input.setAttribute('aria-label', `${label} ${axis}`);
                input.value = String(Number((object[property][axis] * (property === 'rotation' ? 180 / Math.PI : 1)).toFixed(3)));
                input.onchange = () => {
                    const value = input.valueAsNumber;
                    if (!Number.isFinite(value) || property === 'scale' && (value <= 0 || value > 1000)) {
                        ctx.syncTransformFields();
                        return;
                    }
                    object[property][axis] = value * (property === 'rotation' ? Math.PI / 180 : 1);
                    if (property === 'scale')
                        ctx.engine.setInstanceStyle(object, {});
                    ctx.changed();
                };
                cell.append(input);
                row.append(cell);
            }
            inspector.append(row);
        }
        const clips = object.userData.animationClips as string[] | undefined;
        if (clips?.length) {
            const select = document.createElement('select');
            select.append(new Option('Animation stopped', ''));
            clips.forEach(clip => select.append(new Option(clip, clip)));
            const index = ctx.scene.placed.findIndex(p => p.object === object);
            select.value = ctx.scene.placed[index].doc.animation ?? (ctx.scene.placed[index].doc.animation === null ? '' : clips[0]);
            select.onchange = () => ctx.run(async () => { const doc = ctx.snapshot(); doc.objects[index].animation = select.value || null; await ctx.replace(doc); ctx.choose(ctx.scene.placed[index].object); ctx.changed(); });
            inspector.append(select);
        }
        button('Focus [F]', () => { ctx.focus.copy(object.position); ctx.focus.y += .8; });
        button('Duplicate [Ctrl D]', ctx.duplicate);
        button('Export this item', ctx.exportItem);
    }
    else if (ctx.selectedWater >= 0) {
        const indexOfWater = ctx.selectedWater;
        renderWaterInspector(inspector, { index: ctx.selectedWater, scene: ctx.scene, snapshot: ctx.snapshot, replace: ctx.replace, changed: ctx.changed, run: ctx.run, field, button, focus: ctx.focus, message: ctx.message, reselect: () => { ctx.selectedWater = indexOfWater; },
            paint: () => { ctx.tool.kind = 'water'; ctx.gizmos?.attach(); ctx.ui?.selectPane('terrain'); ctx.refreshTools(); ctx.refreshHint(); },
        });
    }
    else {
        const hint = document.createElement('p');
        hint.className = 'inspector-empty';
        hint.innerHTML = icon('cursor') + '<strong>No object selected</strong><span>Click an object in the scene to edit its properties.</span><span>To add an object, drag an asset from the library below onto the map.</span>';
        inspector.append(hint);
    }
    if (ctx.selected || ctx.selectedWater >= 0)
        button('Delete [Delete]', ctx.removeSelected);
}
