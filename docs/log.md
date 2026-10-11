# Registro de trabalho

## 11/10/2026 — Usabilidade: espaço de trabalho inspirado na Unity

- Pedido do dono: a interface estava confusa, especialmente para colocar
  itens. Reorganizado o editor em hierarquia à esquerda, cena central,
  inspetor à direita e biblioteca embaixo. Ícones SVG, busca, categorias,
  menu Arquivo e abas separadas para objeto, terreno e ambiente.
- Colocação por arrastar e soltar da biblioteca, com indicação do ponto
  no chão; alternativa de clicar no item e depois no chão. Shift repete,
  Esc cancela. O objeto entra selecionado no modo mover.
- Controles visuais W/E/R para mover/girar/escalar, espaço local/global,
  encaixe e valores XYZ. Um arraste é uma ação de desfazer. Câmera:
  Alt + arraste gira; botão direito/meio ou ferramenta Q deslocam.
  Prévia desativa os painéis de edição e oculta os controles na cena.
- `apps/editor/src/editor/`: espaço de trabalho, símbolos e
  `TransformControls` em cena de sobreposição exclusiva do editor. Nenhuma
  dependência nova nem mudança no núcleo, shaders, receitas ou documento.
  Atualizados guia e `START.md` com a organização e os controles atuais.
- `pnpm check`: **41 testes**, tipos e build passaram. Aviso de bundle
  >500 kB permanece. `pnpm verify:authoring /tmp/unity-editor-final` passou
  com arraste nativo da biblioteca e transformações pelos três controles,
  inspetor, câmera estável ao transformar, histórico, prévia e os fluxos
  anteriores de importar/salvar/reabrir/exportar. Sem exceções na página.
- [Capturas antes/depois e métricas](captures/editor-unity-2026-10-11/README.md):
  `cdpshot.mjs`, integração via CDP e página inteira no **Orca Browser**.
  `pnpm compare` passou em cinco vistas e falhou na floresta durante a
  execução concorrente. A floresta passou ao repetir isoladamente
  (`pnpm compare floresta`), sem alterar código ou baseline; oscilação
  temporal registrada, causa não isolada.
- Limites: painéis fixos, seleção de um objeto, sem agrupamento. Água
  usa campos no inspetor; os eixos transformam objetos. As pendências de
  autoria das cinco áreas e do importador do Pomorog continuam no guia.
  Sem validação nova de Tauri/mobile.
- Branch local `feat/unity-editor-workspace`, sem push. Nenhuma alteração
  no checkout do Pomorog ou em `reference/`.

## 11/10/2026 — Autoria visual e exportação portável

- Escopo confirmado pelo dono: terrenos, mapas, itens e afins; regras e
  interface do jogo ficam fora. Plano em
  [`plano-autoria-pomorog.md`](plano-autoria-pomorog.md), guia e limites em
  [`guia-editor-visual.md`](guia-editor-visual.md).
- Conferidos sem alteração `~/Documents/pomorog` (`main`, `f79d3c7`, com
  mudanças locais do dono) e seu worktree visual `pearleye` (`27af922`).
  A referência deste repositório corresponde ao segundo.
- Documento: normalização/validação, identidades e sementes estáveis,
  transformações 3D, visibilidade, nome, estilos globais/de tipo/por parte,
  GLTF/GLB incorporados e escolha de clipe. A construção de uma cena que
  falha limpa recursos; o editor mantém a anterior até a nova ficar pronta.
- Editor: entrada padrão no sandbox; lista e inspetor de objetos/águas;
  mover/girar/escalar/duplicar/apagar/focar; seleção de partes por lista;
  mapa ou item sem terreno; inserir item salvo; desfazer/refazer por ação
  e traço; rascunho em IndexedDB com erro visível; exportação visual JSON.
- Ambiente: chuva/neve e efeitos da biblioteca no documento. Lago/riacho
  escavam usando o mesmo `waterEdge` do componente. Máscara de grama fica
  restrita ao contorno. Formas básicas permitem compor itens.
- Descarte: carpet/partículas/chuva deixam os registros de atualização;
  camadas removidas sem descarte podem ser readicionadas; efeitos possuem
  cancelamento imediato; fogueiras têm buffers independentes. Observável
  `engine.resources` usado nas verificações de recarga.
- Testes: `pnpm check` passou (**41 testes**, tipos e build),
  `pnpm verify:authoring /tmp/ascii-authoring-final` passou no Chromium real:
  transformações, partes, histórico, item sem terreno, GLTF+bin, GLB,
  clipes, dados malformados, falha durante construção, reabertura repetida,
  clima, pincéis, lago e restauração após recarregar o navegador. Nenhuma
  exceção não tratada na página. Aviso de bundle Vite >500 kB permanece.
- `pnpm compare`: seis vistas dentro dos limites existentes, sem atualizar
  baselines. [Capturas e métricas](captures/autoria-2026-10-11/README.md).
- Exportação web criada em `/tmp/ascii-authoring-export`, servida na porta
  1441 e capturada com `cdpshot.mjs`: modo jogador, 3 objetos, lago e chuva.
  Orca Browser: inspeção por snapshot e captura do canvas renderizado;
  screenshot da página completa falhou por timeout do compositor.
- Exemplos para abrir em [`examples/`](examples/). Atualizados `START.md`
  e `README.md`. Nenhuma alteração no Pomorog nem em `reference/`.
- Pendências: importador do Pomorog, fidelidade completa das cinco áreas,
  agrupamento/gizmos, biblioteca vinculada, editor de chunks/costuras,
  águas/pincéis avançados e editor completo de efeitos. A autoria básica
  está utilizável; o plano inteiro de engine não está concluído.
- Branch local `feat/scene-authoring`. Sem push, publicação ou teste novo
  de desktop/mobile.


## 11/10/2026 — Auditoria do estado real e retomada

- Relatório: [`relatorio-engine-2026-10-11.md`](relatorio-engine-2026-10-11.md).
  Código conferido no commit `ed2d4f3`, árvore inicialmente limpa.
- Diagnóstico: núcleo gráfico funcional e cinco áreas demonstráveis;
  autoria de um jogo pelo editor ainda incompleta. Corrigido o resumo de
  `START.md`, que tratava fases parciais como implementadas e sugeria que
  faltava somente aprovação visual. `README.md` aponta para a auditoria.
- Problemas reproduzidos em Chromium isolado: ajustes de instância/global
  ausentes no JSON; tipo sobrescrito pelo padrão do prefab ao reconstruir;
  árvore com geometria diferente para o mesmo documento; tapete removido
  ainda atualizado; sandbox falha com cenário sem terreno.
- Revisão de código: GLBs importados ficam fora do documento; recarga
  descarta a cena atual antes de validar/construir a nova; faltam ferramentas
  de autoria, integração dos chunks e projeto com assets persistentes.
- Testes: `pnpm check` passou (25 testes, TypeScript e build); `pnpm compare`
  passou nas seis vistas, sem atualizar baselines. Editor sem testes próprios.
- Capturas e reprodução em
  [`captures/auditoria-2026-10-11/`](captures/auditoria-2026-10-11/README.md):
  referência, cinco áreas, sandbox, GLTF, efeitos, exportação web e sandbox
  no **Orca Browser**. A captura no Orca funcionou nesta sessão.
- Exportação web refeita para pasta temporária, servida por HTTP e
  conferida em modo jogador; sem novo build/execução desktop ou mobile.
- Próximo marco recomendado: criar uma cena, ajustar partes, importar um
  modelo, salvar, reabrir igual e exportar. Começar por persistência,
  sementes, validação e descarte; depois completar as ferramentas previstas.
- Esta etapa altera apenas documentação e evidências. Os bugs encontrados
  continuam abertos; nenhuma alteração em `reference/`, push ou publicação.

As entradas abaixo registram o histórico de implementação e suas pendências
naquele momento; para o estado consolidado, consulte a auditoria acima.

## 11/10/2026 — Fase 1: núcleo extraído

**Estado:** fase 1 concluída no navegador headless; falta conferir no Orca
Browser (ver pendências).

### O que mudou

Porte de `reference/pomorog/src-visual/` para `packages/engine/src/`, com os
números, alfabetos, cores e a ordem de desenho preservados:

| Módulo | Origem | Mudanças em relação ao Pomorog |
| --- | --- | --- |
| `surface.ts` | `surface.ts` | `surfaceAlpha()` centraliza o `toFixed(2)`; teste novo |
| `illumination.ts`, `exploration.ts` | idem | `createIllumination({ interior, obstacles })` sem acampamento fixo; lanterna e fogueira por `place()` |
| `ascii.ts` | `ascii.ts` | sem `swampShoreGLSL`/`wetWeather`: o tom azulado do herói na água vira um gancho `AsciiPassHook` (fase 2) |
| `techniques/surface.ts` | `worldGlyph.ts` | `glyphMaterial` → `surfaceMaterial`; sem `applyWorldGlyphs` (a técnica é declarada); água fica para a fase 2 |
| `techniques/body.ts` | `glyphBody.ts` | uniforms por engine (não globais); aceita lista de malhas (uma parte = um corpo, hash único); `removeGlyphBody` para reaplicar estilo |
| `techniques/carpet.ts` | `grass.ts` | `createCarpet` exige receita; sai o prado fixo do jogo; `extent`/`center` na receita |
| `techniques/particle.ts` | `glyphCloud.ts` | igual; é o "buffer de letras" que os emissores do §3.3 vão alimentar |
| `techniques/screen.ts` | `actorInk.ts` | `markScreen(material, kind)` |
| `presets/pomorog.ts` | `scene.ts`, `forestWorld.ts`, `groundCover.ts` | estilo `pomorog` (luzes, névoa, célula 6, brilho 1, sombra .62), tipos `tree/rock/creature/hero/prop/ground`, piso da floresta, tapete do prado, enquadramento `pomorogSpan` |
| `presets/campfire.ts` | `effects.ts` (fogueira) | grade de calor como dado (`HeatGridSpec`, padrão `POMOROG_FIRE`) |
| `style.ts` | — | estilo por parte (§3.1): `global → tipo → parte do tipo → userData do nó → instância → parte da instância` |
| `engine.ts` | `scene.ts` (render) | `createAsciiEngine`, `add(obj, { glyph, surface, size, type, parts })`, `setPartStyle`, `setTypeStyle`, `createCarpet`, `createParticles`, `setStyle`, `setLights`, `setActors`, `frame`, `render(dt)` com `dt ∈ [0, .08]`, `debug.raw` |

Detalhes:

- A técnica é **declarada**. Um nó sem técnica resolvida gera erro com o nome
  do nó. `userData.glyph`/`userData.glyphStyle` valem por nó (base da fase 3).
- O engine **não altera materiais compartilhados**: cada técnica usa uma variante
  em cache por (material, estilo) e guarda o original, o que permite
  `setPartStyle` reaplicar só aquela parte.
- Correção encontrada ao validar: `Material.clone()` do Three não copia
  `onBeforeCompile`; sem copiar, o piso perdia a cor da floresta e virava
  `o`/`c` cinza em toda parte.
- Mantido por fidelidade: `pixelScale` e a resolução do passe de tela usam a
  altura em px CSS, como no Pomorog (com DPR 1,5 as letras de `body` e
  `particle` ficam proporcionalmente menores). Avaliar depois, com antes/depois.

Editor (`apps/editor`): `src/scene/reference.ts` monta o acampamento da
Floresta Sombria fixa do Pomorog: chão `surface`/terra, toras, saco de dormir,
caixa, assento e abrigo em `surface` (tipo da cor declarado com a mesma regra HSL
do Pomorog, `pomorogKind`), anel de pedras, pedregulho e pedrinhas `body`, 4
árvores com tronco `surface` e copa `body` (`type: 'tree'`, por parte), tapete
de 70 mil letras, fogueira `particle` e o viajante `screen` (modelo estático
copiado de `models.ts`). Na URL: `?ascii=screen` (modo tela antigo),
`?ascii=raw` (sem letras), `?angle=`, `?zoom=`, `?pause=`, `?yaw=`,
`?scene=terrain` (teste de relevo do §3.4). Arrastar gira a câmera.

### Capturas (`docs/captures/`, Chromium headless com GPU, 1600×757, DPR 1)

| Arquivo | Conteúdo |
| --- | --- |
| `fase1-referencia.png` | cena de referência, zoom .9; comparar com `procedural-forest-start.png` |
| `fase1-referencia-girada.png` | mesma cena, câmera +.6 rad: as letras acompanham chão, caixas e copas |
| `fase1-referencia-perto.png`, `fase1-perto-3x.png` | zoom 1.5 e recorte 2×; comparar com `after-world-glyph-closeup.png` e `ascii-fire-grid.png` |
| `fase1-modo-tela-antes.png` | tudo no passe de tela antigo (`?ascii=screen`): o "antes", equivalente às rejeitadas `rejected-screen-*` |
| `fase1-relevo.png` | terreno com colina, crista e depressão (`?scene=terrain`) |

Comparação: tapete `| / \ ! v` com flores `* o`, copas em nuvem `Y v % &`,
pedras em `o O 0 # @` cinza claro, tábuas e caixa com traços `/ |` sobre fundo
quase preto, fogueira `@ # % x * + : .` com brasas, e herói no passe de tela
(silhueta escura com letras laranja de 5 px, como na captura aprovada). Nenhum
objeto de cenário passa pela grade de tela.

### Testes

- `pnpm check`: typecheck, 9 testes (IDs de material, arredondamento de 8 bits,
  distância mínima entre IDs, injeção do alpha; resolução de estilo em camadas,
  copa × tronco, parte de uma instância) e build. Verde.
- Núcleo sem imports de jogo, React ou Tauri (só `three`); nomes de bioma
  aparecem apenas em `presets/pomorog.ts`.
- Sem erros de console (`PAGE` no cdpshot).

### Pendências

- **Orca Browser:** a aba `http://localhost:1440/?pause=4` foi aberta, mas o
  painel estava oculto e não desenhou quadros (captura expira). Conferir com o
  painel visível.
- Herói estático (sem animação de passada); a animação do `models.ts` fica para
  a fatia da Floresta.
- Relevo (§3.4): a grade troca de plano a 45° e deixa uma emenda visível na
  encosta; em encostas médias a letra estica. Considerar mistura triplanar ou
  grade alinhada à encosta na fase do terreno.
- Água (`worldWaterGLSL`, reflexo), chuva, neve e efeitos de combate: fase 2.
- Vagalumes/motas da lanterna (`effects.ts`) não portados.
- `setPartStyle`/`setTypeStyle` reaplicam a parte inteira (recria a nuvem de
  letras); suficiente para o editor da fase 4, sem otimização.

## 11/10/2026 — Fatia 1: Floresta Sombria

**Estado:** área montada no editor (`?area=dark_forest`, padrão), no nível das
capturas aprovadas (`procedural-forest-*.png`). Falta a aprovação do dono
lado a lado.

### Núcleo

- `techniques/water.ts`: água como componente (§3.2). Forma `stream`/`pond`
  (`waterEdge` em JS e GLSL iguais), aparência como dado (`WaterLook`, preset
  `FOREST_WATER` com os números do Pomorog: célula .15×.19, fileiras
  ` .-_~=~-`, espuma ` .,:*+oO`, reflexo com limiar .05 e fileira vazia a cada 4)
  e reflexo planar 640² convertido em letras por célula. `engine.createWater`
  e `{ glyph: 'water' }`; só a água mais próxima (< 11 m) renderiza espelho.
- `world/circuit.ts` (circuito fechado de `trailLoop.ts`) e `world/chunks.ts`
  (carregamento por distância, −1 a +2, semeado pelo índice).
- `presets/ambient.ts`: vagalumes, motas da lanterna e poeira de corrida.
- `engine.remove(obj, { dispose })` libera geometria, materiais, letras e
  águas, sem tocar peças marcadas como compartilhadas (`userData.shared`,
  `userData.sharedGeometry`). Objetos adicionados à parte dentro de outro
  (árvore dentro de um chunk) mantêm seus estilos.
- **Desempenho:** o reflexo derrubava para 27 fps (36 ms de CPU por quadro).
  Ligar e desligar o plano de recorte fazia o Three recalcular o programa de
  ~800 materiais duas vezes por quadro. Agora o engine mantém um plano de
  recorte fixo, longe da cena, e o reflexo só move esse plano: **60 fps**
  (o Pomorog media 47 com a mesma técnica).
- **Correção de fidelidade, com antes/depois:** o tapete infinito do Pomorog
  espalhava as lâminas em 26 m e dava a volta em 36 m, o que deixava uma faixa
  de 10 m sem grama andando com o herói (visível em `procedural-forest-600m.png`
  e em `floresta-antes-faixa-sem-grama.png`). Agora o tapete infinito se espalha
  pelo vão inteiro, com a quantidade escalada para a mesma densidade
  (90 000 × (36/26)² ≈ 172 600). O custo medido do tapete foi desprezível.

### Editor

- `src/areas/forest.ts`: porte de `forestWorld.ts` com o circuito, piso de 64 m
  que segue o herói em passos de 3,4 m, tapete infinito com máscara de solo
  (trilha, clareira, margens), chunks com árvores (copa `body`, tronco
  `surface`), pedras de passagem, rochas, destaque (ruína, tronco caído, pedras
  em pé, cogumelos), lago ou riacho com ponte, pedras e juncos de margem,
  acampamento em s = 0. As peças declaram a técnica no próprio nó
  (`userData.glyph`/`glyphStyle`), como um GLTF faria.
- Viajante animado (`models.ts` copiado em `src/pomorog/`), ritmo da demo
  (`paceAt`, `solveBaseSpeed`): caçada de 90 s em circuito de 100 m, 30 s na
  fogueira, partida, em loop.
- Painel de ajustes ao vivo (semente da fase 4): área, modo (letras, tela,
  sem passe de tela), tamanho 5–12 px, luz 65–140%, zoom, giro, pausa e captura.
- URL: `?area=`, `?ascii=`, `?hunt=<s>` (tamanho do circuito), `?at=<m>`
  (começa mais adiante, para testes), `?camp=1`, `?zoom=`, `?angle=`, `?pause=`.

### Capturas

`floresta-fogueira.png`, `floresta-lago.png`, `floresta-riacho-ponte.png`,
`floresta-riacho-modo-tela.png` (antes, modo tela) e
`floresta-antes-faixa-sem-grama.png` (faixa vazia do tapete antes da correção).

### Testes

`pnpm check` verde: 13 testes (novos: circuito fecha sem emenda e acha o
ponto mais próximo; chunks −1..+2 com volta; forma da água).

### Pendências da Floresta

- Criaturas e combate (lobo, efeitos de golpe) não entram nesta fatia; os
  modelos já estão copiados em `src/pomorog/`.
- Recorte de oclusores entre câmera e herói (raycast) não portado.
- Sem rótulos HTML (nome, vida).

## 11/10/2026 — Fatia 2: Pântano da Chuva

**Estado:** área montada (`?area=rain_marsh`). A água e a chuva mantêm o
visual antigo aprovado, no passe de tela. Árvores de várzea, pedras, juncos,
plantas aquáticas, margens, passarela e cabana são letras nos objetos.

### Núcleo

- `weather/storm.ts` (`stormAt`), `weather/rain.ts` (traços de 1 px ao longo
  da queda, raio em `| / \`, gotas determinísticas por índice) e
  `world/rippleField.ts` (ondas amortecidas em passo fixo).
- `presets/marshWater.ts`: preset de água "pântano antigo" (§3.2). Ilhas como
  dados, nível que sobe com a enchente, IDs antigos (água .8, grama submersa .3,
  reflexo 0), traços de onda, anéis ASCII `- _ | / \` pela tangente na tela
  (passos, chuva, corpos, golpes), espirros, ondas de arrasto das botas e
  gotas escorrendo dos ombros.
- O passe de tela recebe o tom azulado de quem está dentro d'água por um
  **gancho** (`marshHooks` no editor), não por import: era o acoplamento
  `swampShoreGLSL` que a fase 1 removeu.
- `engine.addWater` (qualquer água com espelho), `engine.createRainStreaks`,
  `engine.setGain` (o relâmpago clareia chuva e raio) e `engine.setFlash`.
- Materiais `ShaderMaterial` (água, piso antigo) passam intactos pelas
  técnicas `screen`/`surface`: já escrevem o próprio ID.
- Correção: `engine.add` ignorava `LineSegments`, e por isso a chuva não aparecia.

### Editor

- `src/areas/common.ts`: acampamento, fogueira (com vapor quando a chuva
  apaga o fogo), viajante numa rota de pontos, lanterna e o piso antigo do
  passe de tela, compartilhados pelas áreas fixas.
- `src/areas/marsh.ts` e `src/scene/shoreDetails.ts`: porte de
  `swampEnvironment.ts` e das margens. A técnica fica declarada em cada nó com
  a mesma regra do catálogo §19 (folhagem e rochas facetadas viram nuvem de
  letras; o resto, letras na face).

### Capturas

`pantano.png`, `pantano-perto-chuva-aneis.png` e `pantano-relampago.png`.
Comparar com o painel do pântano em `all-areas-ground-cover.png`.

### Pendências

- O pântano roda a ~40–49 fps no headless, contra 60 da floresta. O custo
  está no campo de ondas, recalculado na CPU a cada quadro, e no espelho
  sempre ativo. Otimizar depois.
- Sem som de trovão (áudio fica fora da engine por enquanto).

## 11/10/2026 — Fatia 3: Pinheiros Nevados

**Estado:** área montada (`?area=snow_pines`), equivalente ao painel da neve em
`all-areas-ground-cover.png`. Roda a 60 fps.

- Núcleo: `presets/snow.ts` com o chão de neve (cor por máscara de
  cobertura, clareira derretida que cresce de 1,48 a 1,83 m, mapa de pegadas
  512² com dedos e calcanhar que somem em 110 s), flocos `. + *` lentos que
  não caem sob as copas e derretem sobre a clareira, acúmulo
  (`snowAccumulation`), e o estilo `pomorogSnow` (luzes da neve, ambiente .42
  nos corpos de letras).
- Editor: `src/areas/snow.ts`. Pinheiros com galhos de folhas em nuvem de
  letras e prateleiras de neve (rampa `snow`) que engrossam com o tempo,
  pedregulhos, cerca quebrada, capim seco e tapete de crosta de neve.
- Capturas: `neve.png` e `neve-perto-pegadas.png`.

## 11/10/2026 — Fatias 4 e 5: Mina Antiga e Catedral Submersa

**Estado:** as duas áreas montadas (`?area=old_mine`, `?area=sunken_cathedral`),
equivalentes aos painéis de `all-areas-ground-cover.png`. 60 fps.

- Núcleo: `engine.setObstacles` refaz o mapa de descoberta com os obstáculos
  da cena já montada (a lanterna só revela o que enxerga). A água ganhou
  contorno livre (`edgeGLSL`, `crestGLSL`, `flow`, `distance`), usado nos
  corredores alagados da catedral (era `channelWater.ts`).
- Editor: `src/areas/interiors.ts` com o código de montagem do Pomorog quase
  literal: trilhos, escoras, rochas e cristais, lampiões pendurados com luz,
  cascalho, carrinho; lajes, colunas com nervuras, bancos, arcos, altar,
  vitral com brilho, fragmentos com musgo. Piso iluminado com textura
  (`createLitFloor`), lanterna 19, estilo `pomorogInterior`, tapetes de
  cascalho e de musgo.
- Correção nas áreas fixas: o abrigo de tábuas só existe no acampamento da
  floresta procedural (no Pomorog, `if (procedural)`); ele tinha entrado por
  engano no pântano e na neve. Capturas refeitas.
- Capturas: `mina.png`, `catedral.png` (e `neve.png`, `pantano.png` refeitas).

### Critério de sucesso (§1.1)

As 5 áreas do Pomorog podem ser montadas na engine e escolhidas no editor
(painel → área). Falta a comparação lado a lado aprovada pelo dono e a
conferência no Orca Browser com o painel visível.

## 11/10/2026 — Criaturas e efeitos de combate (Fase 2, combate)

- Núcleo: `presets/combat.ts` com os efeitos de combate do Pomorog
  (`effects.ts`), todos em letras e ×1,4: crescente da espada com estrela e
  faíscas, garras vermelhas, raio em três colunas, bola de fogo com rastro e
  explosão, espinhos de gelo, anel de engajamento, anel de impacto, aura de
  conjuração com luz própria (que acende a grama via `carpet.setGlow`),
  dissolução da criatura e entradas em cena (rachaduras e terra ao sair do
  chão, poeira na investida, vento no voo). `fx.hit()` recebe o golpe como o
  `feedback` do jogo.
- Editor: `src/areas/encounters.ts`. Os encontros da demo (lobo, larva,
  aranha, vespa, goblin) são criaturas de `models.ts`/`beasts.ts` com
  `type: 'creature'` (corpo de letras .155 m, oclusor escuro da própria cor),
  com entrada, golpes roteirizados, magias alternadas, morte e bolsa de saque
  no passe de tela. Ligado à Floresta (`?peaceful=1` desliga). A câmera
  recentraliza como no Pomorog (1,25 m à frente, puxada 32% para a criatura).
- Capturas: `floresta-combate-lobo.png` e `floresta-magias-aura-fogo.png`.

## 11/10/2026 — Fase 3: importação GLTF

- Núcleo: `import/gltf.ts`. `loadGlyphModel(url | ArrayBuffer)` lê .gltf/.glb.
  As propriedades personalizadas do Blender chegam por `extras` → `userData`:
  `glyph` (técnica), `glyph_surface`, `glyph_size` ou `glyphStyle` em JSON.
  Cada nó com nome vira uma parte (§3.1), e o mixer toca todos os clipes.
- Padrão quando falta marcação (`defaultGlyphStyle`), decidido por nome e
  geometria, nunca por cor:
  - malha com esqueleto → `body`;
  - nomes de folhagem ou neve, ou geometria facetada → `body`;
  - o resto → `surface`, com a família tirada do nome (casca, madeira, pedra, terra).
- `body` em malhas com esqueleto: cada letra guarda o triângulo e o peso
  baricêntrico e é re-esqueletizada a cada quadro (`updateSkinnedBody`), de
  modo que as letras acompanham os ossos.
- Editor:
  - a área `?area=gltf` monta uma serpente com 6 ossos e animação, e uma
    árvore com partes `tronco`/`copa` e propriedades no estilo do Blender;
    exporta para GLB (`GLTFExporter`) e reimporta pelo leitor, ou seja, o
    mesmo caminho de um arquivo do Blender;
  - o painel ganhou "importar .glb/.gltf" e arrastar e soltar na janela.
- Testes: 16 (novos: propriedades do Blender, padrão por nome e geometria,
  nós já marcados preservados).
- Captura: `gltf-serpente-arvore.png` (dois quadros da serpente nadando).
- Pendência: sem um .glb real do Blender no repositório; o teste usa o
  exportador do Three.

## 11/10/2026 — Fase 4: editor de ajustes

- **Seleção por parte (§3.1):**
  - um clique seleciona a parte sob o cursor, destacada com uma caixa dourada;
  - um segundo clique ou o Esc sobe para o objeto inteiro;
  - o painel à esquerda mostra a técnica, a família de letras e o tamanho
    resolvidos;
  - a mudança é salva onde o usuário escolhe: **só esta**
    (`setPartStyle`/`setInstanceStyle`), **todas desta parte neste tipo**
    (`setTypeStyle`) ou **estilo global** (`setStyle({ glyphs })`).
- Núcleo:
  - `engine.pick(ndc)` devolve objeto, nó, parte, tipo e estilo resolvido;
  - `engine.setInstanceStyle`, `engine.exportStyle` e `engine.types`;
  - cada nó guarda o estilo resolvido (`userData.glyphResolved`);
  - mudar a camada global ou os tipos re-resolve todos os objetos;
  - objetos adicionados à parte (a árvore dentro do chunk) mantêm seus
    estilos quando o pai é reaplicado;
  - a camada da instância não vaza mais `type`/`parts` para o estilo resolvido.
- **Presets em JSON:** "salvar preset .json" e "carregar preset .json" (camada
  global, tipos de objeto, luzes, tamanho da célula, brilho).
- **Comparação de imagens automática:** `pnpm compare` (`scripts/compare.mjs`)
  captura vistas congeladas de cada área no Chromium sem janela e compara com
  `docs/captures/baseline/` (ImageMagick, RMSE). Diferenças em
  `docs/captures/diff/` (fora do git). `--update` grava uma nova base.
  Repetibilidade medida:
  - referência, floresta, neve, mina e catedral: RMSE ≤ 0,014 entre execuções;
  - pântano: até 0,15, porque os anéis da chuva dependem do ritmo dos
    quadros; tem limite próprio.
- Captura: `estilo-por-parte-uma-copa.png`. Só a copa desta árvore foi
  trocada para `surface` (o visual rejeitado "bola cheia de letras",
  reproduzido de propósito); as outras copas seguem em nuvem de letras.
- Pendência: a tabela completa de ajustes do §16 (célula e tinta por
  material, rampas, vento) ainda está em constantes do shader. Hoje só ficam
  ao vivo a célula do passe de tela, o brilho, o zoom, o giro e o estilo por
  parte.

## 11/10/2026 — Fase 5: cenários, prefabs, chunks e terreno com pincéis (§3.4)

- Núcleo:
  - `world/terrain.ts`: terreno por mapa de alturas (malha de 32 m, 129²) com
    pincéis `raise`, `lower`, `smooth`, `flatten`, `dig` e `paint` (até 4
    camadas de chão com cor e densidade de grama: musgo, terra, pedra, neve);
    `heightAt`, `layerAt` e `grassAt`. É declarado como `surface`/terra, e a
    grade de letras segue o relevo.
  - `world/scene.ts`: formato `SceneDoc` em JSON (estilo, terreno, águas,
    tapete, objetos de prefab com posição, giro, escala e estilo por
    instância/parte). Funções `buildScene`, `place`, `remove`, `addWater`,
    `regrow` (refaz o tapete pelas camadas pintadas) e `toJSON`. O prefab
    vira tipo de objeto: mudar o estilo do tipo muda todas as cópias.
  - Geração por regras: `generateChunkGrid` encaixa chunks numa grade de modo
    que os conectores de borda casem (trilha, riacho, mato), com pesos,
    filtro de bioma, chunks fixos, borda exigida e semente determinística
    (com retrocesso). `rotateConnectors` gira os conectores. O carregamento
    por distância já existia (`createChunkStreamer`).
- Editor: área **Cenário** (`?area=sandbox`) com painel de ferramentas:
  - pincéis: esculpir ±, suavizar, aplainar, pintar chão, cavar lago (cava,
    pinta a margem e põe água), pôr objeto, apagar objeto;
  - controles de raio e força, regerar grama, salvar e abrir cenário .json,
    novo cenário;
  - o documento fica guardado no navegador (localStorage, quando disponível);
  - os prefabs (`scene/prefabs.ts`): árvore, pedregulho, caixa, ponte, ruína,
    pedras em pé, tronco caído e fogueira com fogo e luz.
- Testes: 21 (novos: chunks casando bordas e borda externa, determinismo e
  chunks fixos, bioma, rotação de conectores, pincéis de terreno).
- Captura: `cenario-pincel-lago-ponte-morro.png`, montada só com eventos de
  ponteiro (morro esculpido e suavizado, pedra pintada, lago cavado, ponte,
  ruína e árvores postas, grama regerada).
- Pendências:
  - em encostas muito íngremes as lâminas do tapete afundam na rampa
    (falta inclinar a lâmina pela normal);
  - costura automática entre chunks vizinhos e editor visual de chunks com
    conectores;
  - o editor de cenário ainda não monta mapas a partir do gerador de chunks
    (só os testes usam);
  - desfazer e refazer ainda não existem.

## 11/10/2026 — Fase 6: sistema de efeitos (§3.3)

- Núcleo `fx/effects.ts`: um efeito é um dado (`EffectDef`) com linha do
  tempo (duração, loop) e emissores.
  - **Emissão:** contínua (`rate`) ou em rajadas (`bursts`), dentro de uma
    janela da linha do tempo.
  - **Formas de nascimento:** ponto, esfera (volume ou casca), cone, anel,
    caixa e linha.
  - **Movimento:** velocidade e rapidez, gravidade, arrasto, ruído, atração,
    giro, pousar no chão.
  - **Ao longo da vida:** tamanho, cor e alfa por curva ou gradiente, brilho
    e **sequência de letras**.
  - **Tipos de render, todos em letras:** partícula, anel/onda de choque (com
    letra pela tangente na tela), feixe em zigue-zague, fita/rastro, grade de
    calor (a fogueira `HeatGridSpec`), decal no chão e **flipbook ASCII**.
  - **Luz própria** com cintilação e curva de esmaecimento.
  - **Fixação:** o efeito pode seguir um objeto, uma parte ou um osso
    (`instance.attach(obj)`).
  - **Orçamento:** letras por emissor (`max`) e por cena (`budget`).
- `engine.fx.play('fogueira', alvo)`: o sistema nasce no primeiro uso, com os
  efeitos do Pomorog já registrados.
- `fx/presets.ts`: efeitos do Pomorog refeitos como dados (fogueira, poeira,
  vagalumes, morte, aura, raio, explosão de fogo, gelo, anel de chuva,
  rastro).
- `fx/flipbook.ts`: imagem → letras por célula (o brilho escolhe a densidade
  da letra, a imagem dá a cor), em **sprite sheet**, **GIF/WebP animado**
  (`ImageDecoder` do navegador) ou **vídeo** amostrado em N quadros por
  segundo.
- Editor, área **Efeitos** (`?area=effects`):
  - lista de efeitos, tocar em loop ou uma vez, parar;
  - "preso ao alvo" (um poste andando em círculo);
  - JSON do efeito editável ao vivo, salvar efeito .json;
  - importar imagem, GIF ou vídeo como flipbook;
  - orçamento visível (letras, efeitos e emissores ativos).
- Testes: 25 (novos: rajada, envelhecimento e fim; loop com orçamento e grade
  de calor; letras fora do alfabeto; conversão de imagem em letras).
- Captura: `efeitos-presets.png` (fogueira, raio, explosão, gelo / aura,
  morte, rastro, flipbook de uma sprite sheet gerada).
- **Achado de fidelidade:**
  - o alfabeto das partículas do Pomorog (`glyphCloud.ts`) não tem `@` nem
    `x`;
  - a fogueira e os efeitos pedem `@ # % x …`, mas o jogo desenha `.` no lugar
    (`indexOf` = −1 → 0), e `ascii-fire-grid.png` de fato não mostra `@`;
  - a engine mantém o mesmo comportamento por fidelidade;
  - incluir `@`, `x` e `&` no alfabeto é uma melhoria a decidir com
    antes/depois.
- Pendências:
  - o editor ainda não tem curvas e gradientes gráficos, só o JSON;
  - forma "superfície de uma parte" e fixação em ossos por nome;
  - gatilhos por evento (ao bater, ao morrer, ao entrar na água) ainda são
    chamados pelo código;
  - som.

## 11/10/2026 — Fase 8: exportação (web e desktop)

- **Modo jogador:** se houver um `game.json` ao lado do `index.html` (título,
  área ou cenário de partida, estilo, zoom), o editor vira jogador, sem painéis
  nem seleção. `?player=1` mostra esse modo no editor. O Vite usa
  `base: './'`, então a pasta exportada funciona em qualquer caminho.
- **`pnpm export`** (`scripts/export.mjs`):
  `--title … --area <id> | --scene cenario.json [--zoom] [--desktop] [--bundle deb,appimage]`.
  Compila o editor, copia para `exports/<jogo>/web` (fora do git) e grava o
  `game.json` (e o `scene.json`). Com `--desktop`, gera uma configuração do
  Tauri com nome e identificador do jogo e compila o app.
- Verificado:
  - web: a pasta exportada da Floresta servida estaticamente abre como jogo
    (`exportacao-web-floresta.png`, título "Floresta Sombria", sem painéis);
  - desktop: o binário release compilou em 2m33s
    (`apps/editor/src-tauri/target/release/ascii-engine-editor`, sem
    instalador; `--bundle` gera .deb/AppImage).
- Não verificado:
  - a janela do app desktop não foi aberta (evitei abrir janelas no desktop
    do dono);
  - Android e iOS: os SDKs não estão instalados (só `adb`); o caminho é
    `tauri android init/build` e `tauri ios init/build` com a mesma pasta web.

## Conferências gerais pendentes

- **Orca Browser:** a aba existe, mas o painel do navegador está oculto e não
  desenha quadros (o screenshot expira). Tudo foi validado no Chromium sem
  janela com GPU (`cdpshot.mjs`, `pnpm compare`).
- **Fase 7** (o Pomorog usando a engine) espera autorização do dono.
