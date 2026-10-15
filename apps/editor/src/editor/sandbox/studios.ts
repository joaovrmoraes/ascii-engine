import { detachTexture, textureUsers } from '@ascii-engine/core'
import { createAtmosphereStudio } from '../atmosphere'
import { createSceneCameras } from '../cameras'
import { createEffectEditor } from '../effects'
import { createGizmos } from '../gizmos'
import { createTextureStudio } from '../textures'
import type { SandboxContext } from './context'

export function bindStudios(ctx: SandboxContext) {
  function selectAssetCategory(category: string) {
    ctx.assetCategory = category
    ctx.assetQuery = ''
    ctx.ui!.get<HTMLInputElement>('[data-k="asset-search"]').value = ''
    ctx.refreshLibrary()
  }
  function revealAssets(category: string) {
    ctx.ui!.showProject('assets')
    selectAssetCategory(category)
  }
  ctx.atmosphereStudio = createAtmosphereStudio(ctx.ui!.studioRoot, ctx.engine, ctx.changed, {
    reveal: () => revealAssets('Atmospheres'),
    definitions: () => ctx.snapshot().atmospheres ?? {},
    async save(key, asset) {
      const doc = ctx.snapshot()
      doc.atmospheres = { ...doc.atmospheres, [key]: asset }
      await ctx.replace(doc)
      selectAssetCategory('Atmospheres')
      ctx.changed()
    },
  })
  ctx.effectEditor = createEffectEditor(ctx.ui!.effectRoot, {
    reveal: () => revealAssets('Effects'),
    definitions: () => ctx.snapshot().effects ?? {},
    async save(key, definition) {
      const doc = ctx.snapshot()
      doc.effects = { ...doc.effects, [key]: definition }
      await ctx.replace(doc)
      selectAssetCategory('Effects')
      ctx.changed()
    },
    place(key) {
      ctx.ui!.showProject('assets')
      ctx.assetCategory = 'Effects'
      ctx.beginPlacement(key)
    },
  })
  ctx.textureStudio = createTextureStudio(ctx.ui!.textureRoot, {
    document: ctx.snapshot,
    objects: () => ctx.scene.placed.map(item => ({ id: item.doc.id!, object: item.object })),
    selected: () => ctx.scene.placed.find(item => item.object === ctx.selected)?.doc.id,
    type: id => {
      const object = ctx.scene.placed.find(item => item.doc.id === id)?.object
      return object ? (ctx.engine.instanceStyle(object)?.type ?? object.userData.prefab) : undefined
    },
    typeName: id => {
      const object = ctx.scene.placed.find(item => item.doc.id === id)?.object,
        type = object && (ctx.engine.instanceStyle(object)?.type ?? object.userData.prefab)
      return type ? (ctx.library[type]?.title ?? type) : undefined
    },
    select: id => ctx.choose(ctx.scene.placed.find(item => item.doc.id === id)?.object),
    reveal: () => revealAssets('Textures'),
    async saveLighting(name, style) {
      const chosen = ctx.selected?.userData.sceneId,
        doc = ctx.snapshot()
      doc.atmospheres = {
        ...doc.atmospheres,
        [`atmosphere-${crypto.randomUUID()}`]: { name, style: structuredClone(style) },
      }
      await ctx.replace(doc)
      if (chosen) ctx.choose(ctx.scene.placed.find(item => item.doc.id === chosen)?.object)
      selectAssetCategory('Atmospheres')
      ctx.changed()
    },
    async save(id, asset) {
      const chosen = ctx.selected?.userData.sceneId,
        doc = ctx.snapshot()
      doc.textures = { ...doc.textures, [id]: asset }
      await ctx.replace(doc)
      if (chosen) ctx.choose(ctx.scene.placed.find(item => item.doc.id === chosen)?.object)
      selectAssetCategory('Textures')
      ctx.changed()
    },
    async detach(id, part) {
      const doc = ctx.snapshot(),
        item = doc.objects.find(item => item.id === id)
      if (!item) throw new Error('Object not found: ' + id)
      item.options = detachTexture(item.options ?? {}, doc.textures ?? {}, part)
      await ctx.replace(doc)
      ctx.choose(ctx.scene.placed.find(item => item.doc.id === id)?.object)
      ctx.changed()
    },
    async remove(id) {
      const doc = ctx.snapshot()
      for (const item of textureUsers(doc, id))
        item.options = detachTexture(item.options ?? {}, doc.textures ?? {})
      delete doc.textures![id]
      await ctx.replace(doc)
      ctx.changed()
    },
    async apply(id, part, style, scope, textureId) {
      if (scope === 'global') {
        ctx.engine.setStyle({ glyphs: { ...ctx.engine.style.glyphs, ...style } })
        ctx.changed()
        return
      }
      const object = ctx.scene.placed.find(item => item.doc.id === id)?.object
      if (!object) throw new Error('Select an object before applying a texture.')
      if (part && !object.getObjectByName(part)) throw new Error('Part not found: ' + part)
      if (textureId) return ctx.applyTexture(object, textureId, part || undefined)
      if (scope === 'type') {
        const type = ctx.engine.instanceStyle(object)?.type ?? object.userData.prefab
        if (!type) throw new Error('This object has no shared type.')
        const fields = Object.keys(style) as (keyof typeof style)[]
        ctx.engine.setTypeStyle(
          type,
          part
            ? { parts: { [part]: style }, authored: { parts: { [part]: fields } } }
            : { style, authored: { style: fields } },
        )
        for (const item of ctx.scene.placed)
          if (item.doc.prefab === type && !ctx.engine.instanceStyle(item.object)?.type) {
            const options = { ...ctx.engine.instanceStyle(item.object), type }
            ctx.engine.setInstanceStyle(item.object, options)
          }
      } else if (part) ctx.engine.setPartStyle(object, part, style)
      else ctx.engine.setInstanceStyle(object, style)
      ctx.choose(object)
      ctx.changed()
    },
  })
  ctx.cameraEditor = createSceneCameras(ctx.engine, {
    viewChanged: () => {
      ctx.refreshHierarchy()
      ctx.refreshHint()
    },
    changed: ctx.changed,
    select: ctx.choose,
    focus: () => ctx.focus.clone(),
  })
  ctx.cameraEditor.load(ctx.scene.toJSON())
  ctx.gizmos = createGizmos(ctx.engine, {
    change: () => {
      if (ctx.tool.kind === 'place') ctx.placement.lock()
      else {
        ctx.cameraEditor?.syncSelected()
        ctx.syncTransformFields()
      }
    },
    commit: () => {
      if (ctx.tool.kind !== 'place') ctx.changed()
    },
    allowed: () =>
      !ctx.busy &&
      !ctx.preview &&
      !ctx.cameraEditor?.viewed &&
      !document.body.classList.contains('studio-mode') &&
      (ctx.tool.kind === 'select' || ctx.tool.kind === 'place') &&
      ctx.transformMode !== 'hand' &&
      ctx.transformMode !== 'orbit',
  })
  for (const surface of [ctx.ui!.sidebar, ctx.ui!.hierarchy]) {
    surface.addEventListener(
      'dragover',
      event => {
        if ((event as DragEvent).dataTransfer?.types.includes('application/x-ascii-texture'))
          event.preventDefault()
      },
      { signal: ctx.signal.signal },
    )
    surface.addEventListener(
      'drop',
      event => {
        const e = event as DragEvent,
          id = e.dataTransfer?.getData('application/x-ascii-texture')
        const objectId = (e.target as HTMLElement).closest<HTMLElement>('[data-object-id]')?.dataset
          .objectId
        const object = objectId
          ? ctx.scene.placed.find(item => item.doc.id === objectId)?.object
          : ctx.selected
        if (!id || !object || !ctx.snapshot().textures?.[id]) return
        e.preventDefault()
        e.stopPropagation()
        const part =
          surface === ctx.ui!.sidebar && ctx.appearanceObject === object
            ? ctx.appearancePart
            : undefined
        ctx.applyTexture(object, id, part)
      },
      { signal: ctx.signal.signal },
    )
  }
}
