import { icon } from './icons'
import { createPanelLayout } from './layout'

/** Docked editor shell. All controls are wired by the scene controller/main. */
export function createWorkspace() {
  document.body.classList.add('authoring')
  const root = document.createElement('div'); root.id = 'editor-workspace'
  root.innerHTML = `
    <header id="studio-toolbar" hidden><button data-k="close-studio">← Voltar à cena</button><strong>Estúdio</strong><nav aria-label="Área do estúdio"><button data-studio-page="effects">Efeitos</button><button data-studio-page="atmosphere">Atmosfera</button></nav><span>Prévia ao vivo</span></header>
    <header id="authoring-toolbar">
      <div class="menu-row"><strong class="brand">${icon('cube')} ASCII Engine</strong>
        <details class="editor-menu"><summary>Arquivo</summary><div class="menu-items">
          <button data-k="new">Novo mapa <kbd>terreno</kbd></button><button data-k="item">Novo item <kbd>vazio</kbd></button>
          <label class="file">Abrir documento…<input data-k="open" type="file" accept=".json" hidden></label>
          <button data-k="save">Salvar arquivo <kbd>Ctrl S</kbd></button><button data-k="export">Exportar para Pomorog…</button><button data-k="reset-layout">Restaurar painéis</button>
        </div></details>
        <button data-k="undo" title="Desfazer (Ctrl Z)" aria-label="Desfazer">↶</button><button data-k="redo" title="Refazer (Ctrl Shift Z)" aria-label="Refazer">↷</button>
        <span class="document-title"><input data-k="name" aria-label="Nome do documento"><span class="document-kind">Cena visual</span></span>
        <span data-k="note" class="save-note" role="status"></span>
      </div>
      <div class="main-toolbar">
        <button data-k="library">${icon('plus')} Adicionar objeto</button>
        <button data-k="create-camera">${icon('camera')} Criar câmera</button>
        <button data-k="create-effect">${icon('spark')} Criar efeito</button>
        <button data-k="save-short">${icon('save')} Salvar</button>
        <div class="preview-controls"><button data-k="preview">${icon('play')} Prévia</button><button data-k="pause" title="Pausar animação" aria-label="Pausar animação">${icon('pause')}</button></div>
        <button data-k="export-short" class="export-action">Exportar ${icon('import')}</button>
      </div>
    </header>
    <aside id="hierarchy" aria-label="Hierarquia">
      <div class="dock-heading">Hierarquia <span data-k="count"></span></div>
      <label class="search-field">${icon('search')}<input data-k="search" type="search" placeholder="Buscar na cena" aria-label="Buscar na cena"></label>
      <div class="scene-name">▾ ${icon('cube')} <span data-k="scene-name"></span></div>
      <div data-k="objects" role="list" aria-label="Objetos da cena"></div>
      <div class="hierarchy-footer">Tudo o que está neste mapa</div>
    </aside>
    <div id="scene-toolbar">
      <div class="scene-tab"><span class="active">${icon('cube')} Cena</span><span class="scene-description">Vista do editor</span></div>
      <div class="scene-tools" role="toolbar" aria-label="Ferramentas da cena">
        <button data-mode="orbit" title="Orbitar em 3D (O): arraste na cena">${icon('rotate')}<span>Orbitar</span></button>
        <button data-mode="hand" title="Navegar (Q)">${icon('hand')}<span>Q</span></button>
        <button data-mode="translate" title="Mover (W)">${icon('move')}<span>W</span></button>
        <button data-mode="rotate" title="Girar (E)">${icon('rotate')}<span>E</span></button>
        <button data-mode="scale" title="Escalar (R)">${icon('scale')}<span>R</span></button>
        <span class="tool-divider"></span>
        <select data-k="space" aria-label="Espaço das transformações"><option value="world">Global</option><option value="local">Local</option></select>
        <button data-k="snap" aria-pressed="false" title="Encaixe: 0,5 m / 15° / escala 0,1">${icon('grid')} Encaixar</button>
        <button data-k="frame" title="Focar seleção (F)">${icon('focus')}</button>
        <button data-k="reset-view" title="Restaurar ângulo isométrico">Isométrica</button>
        <button data-k="view" class="view-action">Exibição ▾</button>
      </div>
    </div>
    <div id="scene-hint"><span data-k="instruction"></span><button data-k="cancel" hidden>Cancelar <kbd>Esc</kbd></button></div>
    <div id="placement-label" hidden></div>
    <aside id="authoring-sidebar" aria-label="Inspetor">
      <div class="dock-heading">Inspetor</div>
      <nav class="inspector-tabs" aria-label="Painéis do inspetor"><button data-tab="object">Objeto</button><button data-tab="terrain">Terreno</button><button data-tab="environment">Ambiente</button></nav>
      <section data-pane="object"><div id="object-inspector" data-k="inspector"></div><div data-mount="selection"></div></section>
      <section data-pane="terrain" hidden><div id="tools"></div></section>
      <section data-pane="environment" hidden><div id="environment-settings"></div></section>
      <section data-pane="view" hidden><div class="component-title">Exibição da cena</div><div data-mount="panel"></div></section>
    </aside>
    <section id="asset-browser" aria-label="Biblioteca de objetos">
      <div class="dock-heading"><div class="project-tabs"><button data-project-tab="assets">${icon('folder')} Projeto</button><button data-project-tab="studio">${icon('spark')} Estúdio</button></div>
        <div class="asset-actions"><label class="file">${icon('import')} Importar modelo<input data-k="model-import" type="file" multiple accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" hidden></label><label class="file">Inserir item salvo<input data-k="insert" type="file" accept=".json" hidden></label></div>
      </div>
      <div class="asset-body"><nav data-k="categories" aria-label="Categorias de objetos"></nav><div class="asset-content">
        <div class="asset-search-row"><label class="search-field">${icon('search')}<input data-k="asset-search" type="search" placeholder="Buscar objetos…" aria-label="Buscar objetos"></label><span>Arraste para a cena · ou clique e escolha um ponto</span></div>
        <div data-k="assets" role="list" aria-label="Objetos disponíveis"></div>
      </div></div><section id="studio-workspace" hidden><nav class="studio-tabs" aria-label="Estúdio"><button data-studio-tab="effects">Efeitos</button><button data-studio-tab="atmosphere">Atmosfera</button></nav><section id="effect-editor" hidden></section><section id="atmosphere-studio" hidden></section></section>
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
