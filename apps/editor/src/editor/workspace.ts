import { icon } from './icons'
import { createPanelLayout } from './layout'

/** Docked editor shell. All controls are wired by the scene controller/main. */
export function createWorkspace() {
  document.body.classList.add('authoring')
  const root = document.createElement('div'); root.id = 'editor-workspace'
  root.innerHTML = `
    <header id="studio-toolbar" hidden><button data-k="close-studio">← Back to scene</button><strong>Studio</strong><nav aria-label="Studio workspace"><button data-studio-page="effects">Effects</button><button data-studio-page="atmosphere">Atmosphere</button></nav><span>Live preview</span></header>
    <header id="authoring-toolbar">
      <div class="menu-row"><strong class="brand">${icon('cube')} ASCII Engine</strong>
        <details class="editor-menu"><summary>File</summary><div class="menu-items">
          <button data-k="new">New map <kbd>terrain</kbd></button><button data-k="item">New item <kbd>empty</kbd></button>
          <label class="file">Open document…<input data-k="open" type="file" accept=".json" hidden></label>
          <button data-k="save">Save file <kbd>Ctrl S</kbd></button><button data-k="export">Export for Pomorog…</button><button data-k="reset-layout">Reset panels</button>
        </div></details>
        <button data-k="undo" title="Undo (Ctrl Z)" aria-label="Undo">↶</button><button data-k="redo" title="Redo (Ctrl Shift Z)" aria-label="Redo">↷</button>
        <span class="document-title"><input data-k="name" aria-label="Document name"><span class="document-kind">Visual scene</span></span>
        <span data-k="note" class="save-note" role="status"></span>
      </div>
      <div class="main-toolbar">
        <button data-k="library">${icon('plus')} Add object</button>
        <button data-k="create-camera">${icon('camera')} Create camera</button>
        <button data-k="create-effect">${icon('spark')} Create effect</button>
        <button data-k="save-short">${icon('save')} Save</button>
        <div class="preview-controls"><button data-k="preview">${icon('play')} Preview</button><button data-k="pause" title="Pause animation" aria-label="Pause animation">${icon('pause')}</button></div>
        <button data-k="export-short" class="export-action">Export ${icon('import')}</button>
      </div>
    </header>
    <aside id="hierarchy" aria-label="Hierarchy">
      <div class="dock-heading">Hierarchy <span data-k="count"></span></div>
      <label class="search-field">${icon('search')}<input data-k="search" type="search" placeholder="Search scene" aria-label="Search scene"></label>
      <div class="scene-name">▾ ${icon('cube')} <span data-k="scene-name"></span></div>
      <div data-k="objects" role="list" aria-label="Scene objects"></div>
      <div class="hierarchy-footer">Everything in this map</div>
    </aside>
    <div id="scene-toolbar">
      <div class="scene-tab"><span class="active">${icon('cube')} Scene</span><span class="scene-description">Editor view</span></div>
      <div class="scene-tools" role="toolbar" aria-label="Scene tools">
        <button data-mode="orbit" title="Orbit in 3D (O): drag in the scene">${icon('rotate')}<span>Orbit</span></button>
        <button data-mode="hand" title="Pan (Q)">${icon('hand')}<span>Q</span></button>
        <button data-mode="translate" title="Move (W)">${icon('move')}<span>W</span></button>
        <button data-mode="rotate" title="Rotate (E)">${icon('rotate')}<span>E</span></button>
        <button data-mode="scale" title="Scale (R)">${icon('scale')}<span>R</span></button>
        <span class="tool-divider"></span>
        <select data-k="space" aria-label="Transform space"><option value="world">Global</option><option value="local">Local</option></select>
        <button data-k="snap" aria-pressed="false" title="Snap: 0.5 m / 15° / 0.1 scale">${icon('grid')} Snap</button>
        <button data-k="frame" title="Focus selection (F)">${icon('focus')}</button>
        <button data-k="reset-view" title="Reset isometric angle">Isometric</button>
        <button data-k="view" class="view-action">Display ▾</button>
      </div>
    </div>
    <div id="scene-hint"><span data-k="instruction"></span><button data-k="cancel" hidden>Cancel <kbd>Esc</kbd></button></div>
    <div id="placement-label" hidden></div>
    <aside id="authoring-sidebar" aria-label="Inspector">
      <div class="dock-heading">Inspector</div>
      <nav class="inspector-tabs" aria-label="Inspector panels"><button data-tab="object">Object</button><button data-tab="terrain">Terrain</button><button data-tab="environment">Environment</button></nav>
      <section data-pane="object"><div id="object-inspector" data-k="inspector"></div><div data-mount="selection"></div></section>
      <section data-pane="terrain" hidden><div id="tools"></div></section>
      <section data-pane="environment" hidden><div id="environment-settings"></div></section>
      <section data-pane="view" hidden><div class="component-title">Scene display</div><div data-mount="panel"></div></section>
    </aside>
    <section id="asset-browser" aria-label="Asset library">
      <div class="dock-heading"><div class="project-tabs"><button data-project-tab="assets">${icon('folder')} Project</button><button data-project-tab="studio">${icon('spark')} Studio</button></div>
        <div class="asset-actions"><label class="file">${icon('import')} Import model<input data-k="model-import" type="file" multiple accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" hidden></label><label class="file">Insert saved item<input data-k="insert" type="file" accept=".json" hidden></label></div>
      </div>
      <div class="asset-body"><nav data-k="categories" aria-label="Asset categories"></nav><div class="asset-content">
        <div class="asset-search-row"><label class="search-field">${icon('search')}<input data-k="asset-search" type="search" placeholder="Search assets…" aria-label="Search assets"></label><span>Drag into the scene · or click and choose a position</span></div>
        <div data-k="assets" role="list" aria-label="Available assets"></div>
      </div></div><section id="studio-workspace" hidden><nav class="studio-tabs" aria-label="Studio"><button data-studio-tab="effects">Effects</button><button data-studio-tab="atmosphere">Atmosphere</button></nav><section id="effect-editor" hidden></section><section id="atmosphere-studio" hidden></section></section>
    </section>`
  document.body.append(root)
  root.querySelector('[data-mount="panel"]')!.append(document.getElementById('panel')!)
  root.querySelector('[data-mount="selection"]')!.append(document.getElementById('selection')!)
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!
  const sidebar = get('#authoring-sidebar'), hierarchy = get('#hierarchy'), toolbar = get('#authoring-toolbar')
  let pane = 'object'
  const selectPane = (next: string) => {
    pane = next
    sidebar.querySelectorAll<HTMLElement>('[data-pane]').forEach(el => { el.hidden = el.dataset.pane !== next })
    sidebar.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(el => { const active = el.dataset.tab === next; el.classList.toggle('active', active); el.setAttribute('aria-pressed', String(active)) })
  }
  sidebar.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(el => { el.onclick = () => selectPane(el.dataset.tab!) })
  get('[data-k="view"]').onclick = () => selectPane(pane === 'view' ? 'object' : 'view')
  let studioPane: 'effects' | 'atmosphere' = 'effects'
  function showProject(tab: 'assets' | 'effects' | 'studio') {
    if (tab === 'effects') { studioPane = 'effects'; tab = 'studio' }
    document.body.classList.toggle('studio-mode', tab === 'studio')
    get('#studio-toolbar').hidden = tab !== 'studio'
    get('#asset-browser .asset-body').hidden = tab !== 'assets'
    get('#studio-workspace').hidden = tab !== 'studio'
    get('#effect-editor').hidden = tab !== 'studio' || studioPane !== 'effects'
    get('#atmosphere-studio').hidden = tab !== 'studio' || studioPane !== 'atmosphere'
    get('.asset-actions').hidden = tab !== 'assets'
    root.querySelectorAll<HTMLButtonElement>('[data-project-tab]').forEach(button => { button.classList.toggle('active', button.dataset.projectTab === tab); button.setAttribute('aria-pressed', String(button.dataset.projectTab === tab)) })
    root.querySelectorAll<HTMLButtonElement>('[data-studio-tab], [data-studio-page]').forEach(button => { const active = (button.dataset.studioTab ?? button.dataset.studioPage) === studioPane; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)) })
    root.dispatchEvent(new CustomEvent('project-tab', { detail: tab === 'studio' ? studioPane : tab }))
  }
  function showStudio(pane: typeof studioPane) { studioPane = pane; showProject('studio') }
  root.querySelectorAll<HTMLButtonElement>('[data-project-tab]').forEach(button => { button.onclick = () => showProject(button.dataset.projectTab as 'assets' | 'studio') })
  root.querySelectorAll<HTMLButtonElement>('[data-studio-tab], [data-studio-page]').forEach(button => { button.onclick = () => showStudio((button.dataset.studioTab ?? button.dataset.studioPage) as typeof studioPane) })
  get('[data-k="close-studio"]').onclick = () => showProject('assets')
  const layout = createPanelLayout(root)
  get('[data-k="reset-layout"]').onclick = () => layout.reset()
  root.querySelectorAll('.menu-items button, .menu-items label').forEach(el => el.addEventListener('click', () => root.querySelector('details')?.removeAttribute('open')))
  selectPane('object'); showProject('assets')
  return {
    root, toolbar, hierarchy, sidebar, tools: get('#tools'), inspector: get('#object-inspector'), environment: get('#environment-settings'), assets: get('#asset-browser'), effectRoot: get('#effect-editor'), studioRoot: get('#atmosphere-studio'), get, selectPane, showProject, showStudio,
    hint(text: string, cancel = false) { get('[data-k="instruction"]').textContent = text; get('[data-k="cancel"]').hidden = !cancel; get('#scene-hint').classList.toggle('placing', cancel) },
    dispose() { layout.dispose(); document.body.append(document.getElementById('panel')!, document.getElementById('selection')!); root.remove(); document.body.classList.remove('authoring', 'previewing', 'studio-mode') },
  }
}
export type Workspace = ReturnType<typeof createWorkspace>
