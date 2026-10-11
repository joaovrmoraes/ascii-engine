# ASCII Engine — ponto de partida

Leia este arquivo inteiro antes de qualquer alteração. Ele vale para qualquer
agente (Claude, Codex, outros) e para pessoas.

## 1. O que é

Uma engine que recebe uma cena 3D (Three.js) e a desenha **feita de letras**. As
letras ficam presas aos objetos, não a um filtro aplicado à tela. Ela nasce do
visual do **Pomorog**, um jogo pomodoro com caçada automática em ASCII 3D
isométrico, aprovado pelo dono em 10–11/10/2026. Todo o conhecimento de lá
está copiado em [`reference/pomorog/`](reference/pomorog/README.md).

Meta de uso, na voz do dono: *"jogar um 3D e converter pra ASCII"*. Um objeto
entra na cena com uma marcação de técnica e sai com o mesmo acabamento do
Pomorog. Nada de ajuste à mão em shader para cada caso.

## 1.1 Critério de sucesso (definido pelo dono em 11/10/2026)

> *"Se eu conseguir fazer meu game eu acho que já tá bom, todos os mapas que
> tem lá… pântano e afins, isso aí pra mim é sucesso."*

A engine está pronta quando as **5 áreas do Pomorog** podem ser montadas
nela, pelo editor, com o mesmo nível das capturas aprovadas:

| Área (id no jogo) | O que exige da engine |
| --- | --- |
| Floresta Sombria (`dark_forest`) | chunks em circuito, terreno, lago e riacho com reflexo, ponte, copas `body`, grama `carpet`, fogueira |
| Pântano da Chuva (`rain_marsh`) | água do pântano antigo, chuva com anéis `\|_____\|`, árvores de várzea, margens |
| Pinheiros Nevados (`snow_pines`) | chão de neve, neve caindo, neve nos galhos, pinheiros |
| Mina Antiga (`old_mine`) | interior escuro com descoberta pela luz, trilhos, vigas, veios de cobre, pedras |
| Catedral Submersa (`sunken_cathedral`) | construção em `surface`, água com reflexo, luz interna |

Ordem de ataque: **Floresta → Pântano → Neve → Mina → Catedral**. Cada área
é um marco: só puxa as funções que ela precisa e termina com capturas lado a
lado (Pomorog × engine) aprovadas pelo dono. Recursos dos §3.1–3.4 que
nenhuma área exige (mar, cachoeira, erosão, importar vídeo…) ficam para
depois desse critério estar cumprido.

## 2. Princípio visual (não negociável)

- **O mundo é feito de letras presas às coisas.** Quando a câmera gira, a letra
  acompanha a superfície e não fica parada na tela.
- O dono rejeitou três abordagens, que não devem voltar:
  1. **filtro de tela no mundo inteiro**, que "parece filtro na tela, não nas coisas";
  2. **3D liso com textura de letras**, que "parece 3D com textura ASCII";
  3. **bola cheia de letras** em copas, pedras e criaturas, quando fica uma esfera sólida pintada.
- Fonte Courier New regular, cor pelo material, vão escuro entre as letras,
  6 degraus de sombra e luar legível em exteriores.
- Detalhes, números e o catálogo objeto por objeto estão em
  [`reference/pomorog/docs/visual-pipeline.md`](reference/pomorog/docs/visual-pipeline.md).
  Imagens aprovadas e rejeitadas estão em
  [`reference/pomorog/images/`](reference/pomorog/images/README.md).

## 3. As técnicas (o coração da engine)

| `GlyphKind` | Técnica | Exemplos no Pomorog | Origem |
| --- | --- | --- | --- |
| `screen` | passe de tela por célula, com alfabeto de ator | herói | `ascii.ts`, `actorInk.ts` |
| `surface` | grade de letras no espaço local, injetada no material, 6 degraus | chão, ponte, construções, caixa, tronco | `worldGlyph.ts` |
| `body` | nuvem de sprites de letras, aberta ou sobre um oclusor escuro | copas, pedras, criaturas | `glyphBody.ts` |
| `carpet` | letras de pé instanciadas, com receita por bioma | grama, cobertura do chão | `grass.ts`, `groundCover.ts` |
| `particle` | glifos soltos | fogo (grade de calor), faíscas, chuva, neve, golpes | `glyphCloud.ts`, `effects.ts` |
| `water` | água em letras com o reflexo planar convertido em letras | lagos, riachos | `worldGlyph.ts`, `waterReflection.ts` |

Base comum: alvo de render fora da tela com profundidade e o **ID do material
gravado no alpha** (`surface.ts`, `glyph = .85`, sempre `toFixed(2)`).

**Regra nova da engine:** a técnica é **declarada** em cada objeto (por exemplo
`engine.add(mesh, { glyph: 'body' })` ou `userData.glyph` vindo do Blender e do
GLTF). O Pomorog adivinha pela cor em HSL, o que só funciona porque os modelos
foram feitos à mão; a engine não pode depender disso.

### 3.1 Estilo por parte (requisito do dono)

O ajuste é sempre **por parte**, nunca só pelo objeto inteiro. Exemplo do
dono: *"copa da árvore quero assim, mas o tronco quero assado"*. O próprio
Pomorog já faz isso: na árvore, a copa é `body` e o tronco é `surface`.

- **Parte** = um nó ou malha do modelo (`Object3D` com nome) ou um slot de
  material. No GLTF, cada parte nomeada no Blender vira uma parte na engine.
- Cada parte tem um **estilo de letras**: a técnica (`GlyphKind`) e os
  parâmetros dela, como alfabeto, tamanho e espaçamento da letra, cor e
  multiplicador de cor, força, vão escuro, degraus de sombra, aberto ou com
  oclusor e animação (balanço, cintilação).
- Os estilos vêm em camadas, e a mais específica vence:
  `preset global → tipo de objeto (ex.: "árvore") → tipo de parte (ex.: "copa") → instância → parte da instância`.
  Mudar a "copa" de todas as árvores e mudar só a copa desta árvore são
  ações diferentes e as duas existem.
- **API:** `engine.add(obj, { glyph, parts: { copa: { glyph: 'body', … }, tronco: { glyph: 'surface', … } } })`,
  `engine.setPartStyle(alvo, parte, estilo)` e `userData.glyph`/`userData.glyphStyle`
  por nó no GLTF.
- **Editor:** no espaço de autoria, clicar seleciona o objeto; outro clique
  na mesma parte ou a lista do inspetor seleciona a parte. Nas demonstrações,
  o primeiro clique seleciona a parte. O painel mostra a técnica e os parâmetros
  da parte com a escolha de onde salvar ("só esta", "todas desta parte
  neste tipo de objeto", "estilo global"). Destaque visual da parte selecionada.
- Na fase 1, desenhe as estruturas de dados já pensando nisso (estilo como
  objeto de dados resolvido por camadas), mesmo que o editor venha depois.

### 3.2 Água como componente (requisito do dono)

Água é um objeto que se coloca e ajusta, não um efeito preso a um bioma.

- **Tipos:** lago e poça (contorno desenhado), riacho e rio (traçado com
  largura e direção do fluxo), mar (plano com borda de praia), pântano (o
  estilo antigo aprovado do Pomorog, com anéis ASCII) e cachoeira (faixa
  vertical com espuma). Outros tipos podem ser criados a partir destes.
- **Parâmetros:** alfabeto e densidade das letras da água, cores (raso,
  fundo, espuma), velocidade e escala das ondas, direção e velocidade do fluxo,
  reflexo ligado ou desligado com força e quanto ele é convertido em letras,
  espuma e letras de margem, transparência pela profundidade, e anéis de
  chuva e de passos (`|_____|`, `-----`, `||----`) com tamanho e tempo de vida.
- **Interação:** passos, chuva, objetos caindo e efeitos geram anéis; quem
  está dentro da água tem o reflexo e a linha d'água recortados.
- Presets iniciais: "floresta" (lago e riacho com reflexo, do Pomorog), "pântano
  antigo" e "catedral". Cada água pode sobrescrever o preset.

### 3.3 Efeitos como nas engines de mercado (requisito do dono)

Um sistema de efeitos completo, no espírito do Shuriken ou VFX Graph da Unity e
do Niagara da Unreal, em que tudo vira **letras**.

- **Efeito** = um ou mais **emissores** com uma linha do tempo, que pode tocar
  em loop ou uma vez só.
- **Emissor:** quantas letras nascem (contínuo ou em rajada), quanto tempo
  cada uma vive, forma de nascimento (ponto, esfera, cone, anel, borda de
  malha, superfície de uma parte), velocidade, gravidade, arrasto, ruído,
  atração e colisão com o chão. Ao longo da vida da letra variam tamanho,
  cor, brilho, giro e **sequência de letras** (ex.: fogo `. : * # @`).
- **Tipos de render**, todos em letras:
  - partícula solta;
  - rastro e fita (corte de espada);
  - anel e onda de choque;
  - feixe (raio);
  - grade de simulação (a grade de calor do fogo, fumaça);
  - decal no chão (marca de queimado);
  - malha animada passando pela técnica `body` ou `surface`.
- **Luz e som:** um emissor pode acender uma luz que pisca e disparar um som.
- **Fixação e gatilhos:** o efeito pode ser preso a um objeto, a uma parte ou a
  um osso, ou posto no mundo. Gatilhos disponíveis: ao nascer, ao bater,
  ao morrer, ao entrar na água, por tempo, ou chamado pelo código
  (`engine.fx.play('fogo', alvo)`).
- **Importar animação pronta:**
  - **sprite sheet, GIF ou vídeo:** cada quadro é convertido em letras por
    célula (brilho vira a densidade da letra, a cor vem da imagem) e tocado
    como um flipbook ASCII. O flipbook pode ficar de frente para a câmera ou
    preso a um plano do mundo e pode ser usado como forma de nascimento das
    partículas;
  - **GLTF animado:** toca a animação e passa pela técnica de letras escolhida.
  - O alfabeto, a escala e a cor da conversão são ajustáveis, e o resultado é
    salvo como preset.
- **Editor:** prévia ao vivo com linha do tempo, curvas e gradientes editáveis,
  orçamento visível (letras e emissores ativos) e presets em JSON.
- **Desempenho:** um limite de letras por efeito e por cena, menos detalhe com a
  distância e reaproveitamento de partículas.

### 3.4 Terreno com pincéis, como na Unity (requisito do dono)

O terreno é esculpido e pintado com **pincéis**, no espírito do Terrain da
Unity, e o resultado sai em letras.

- **Base:** um mapa de alturas por chunk (grade de vértices) com costura
  automática entre vizinhos, e camadas pintadas de tipo de chão (grama, terra,
  pedra, areia, neve, lama, folhas). Cada tipo tem seu estilo de letras
  (`surface`) e seu tapete (`carpet`).
- **Pincel:** tamanho, força, suavidade da borda e formato (redondo,
  quadrado ou uma imagem em tons de cinza importada como carimbo). Tem espelho
  e ajuste para encaixar na grade. `Shift` inverte (subir/descer) e o
  desfazer funciona traço a traço.
- **Pincéis de forma:**
  - **subir/descer** (montanhas, morros, buracos);
  - **suavizar**;
  - **achatar** numa altura escolhida ou na altura do clique (platôs, bases de construção);
  - **ruído** (rugosidade natural);
  - **terraço** (degraus, encostas em camadas);
  - **erosão** simples (sulcos de chuva, encostas mais naturais);
  - **rampa** (de um ponto a outro, para caminhos e estradas).
- **Pincéis de pintura:**
  - **tipo de chão**, com mistura nas bordas;
  - **regra automática por inclinação e altura:** pedra em encosta íngreme,
    neve no alto, areia na beira da água. Ela pode ser desligada por área.
- **Pincéis de detalhe:**
  - **espalhar objetos** (árvores, pedras, arbustos), com densidade,
    variação de escala e giro, alinhamento ao chão e borracha;
  - **grama e flores** (densidade do `carpet`).
- **Pincel de água** (§3.2):
  - **lago:** pinta a área, que é cavada e enchida até um nível escolhido;
  - **rio e riacho:** desenha o traçado, que cava o leito, define largura e
    direção do fluxo e se ajusta ao relevo;
  - **mar:** nível da água para o mundo todo.
  O terreno e a água ficam ligados: mexer no relevo atualiza a margem.
- **Pincel de caminho:** traça a trilha, que achata e pinta o chão por baixo e
  serve de conector entre chunks.
- **Montanhas e paredões em letras:** encosta íngreme vira pedra com letras
  mais densas e degraus de sombra mais marcados. Paredões verticais usam
  `surface` com a grade alinhada à face, para as letras não esticarem.
- **Gerar e depois esculpir:** o gerador procedural (§ Fase 5) produz o
  relevo e a água iniciais, e os pincéis refinam à mão.

## 4. Arquitetura

```text
ascii-engine/
├── START.md · AGENTS.md · CLAUDE.md   instruções (CLAUDE.md importa AGENTS.md)
├── packages/engine/        @ascii-engine/core: TS puro + Three.js, sem UI nem Tauri
├── apps/editor/            editor Vite (porta 1440) + casca Tauri 2 (src-tauri)
├── reference/pomorog/      cópia de leitura: docs, imagens e src-visual
└── .claude/skills, .agents/skills   skill pomorog-ascii-visual (referência de construção)
```

- O **núcleo** não conhece jogo, UI nem Tauri. Ele roda em qualquer navegador.
  Módulos de `packages/engine/src/`:
  - `engine.ts`: `createAsciiEngine`; `add(obj, { glyph, type, parts })`,
    `remove`, `setPartStyle`, `setInstanceStyle`, `setTypeStyle`, `setStyle`,
    `pick`, `render(dt)`; `createCarpet`, `createParticles`, `createWater`,
    `addWater`, `createRainStreaks`, `fx`.
  - `surface.ts` (IDs no alpha), `style.ts` (estilo por parte em camadas),
    `ascii.ts` (passe de tela com ganchos `AsciiPassHook`), `illumination.ts`
    e `exploration.ts` (luz local e descoberta).
  - `techniques/`: `screen`, `surface`, `body` (com malhas de esqueleto),
    `carpet`, `particle` e `water` (componente com reflexo em letras).
  - `presets/`: `pomorog` (estilo e tipos), `campfire` (`HeatGridSpec`),
    `ambient` (vagalumes, motas, poeira), `combat`, `marshWater` (pântano
    antigo) e `snow`.
  - `weather/`: `rain` e `storm`.
  - `world/`: `circuit`, `chunks` (carregamento por distância),
    `rippleField`, `terrain` (pincéis) e `scene` (cenário em JSON, prefabs,
    gerador de chunks por conectores).
  - `fx/`: sistema de efeitos em dados, presets do Pomorog e flipbook ASCII.
  - `import/gltf.ts`: GLTF/GLB com `userData.glyph`.
- O **editor** é a vitrine e a ferramenta: as 5 áreas do Pomorog
  (`src/areas/`), a cena de referência, o cenário com pincéis, os efeitos, a
  importação GLTF, o painel de ajustes, a seleção por parte e os presets. O
  conteúdo do jogo (modelos, prefabs, ritmo da caçada) fica em
  `src/pomorog/` e `src/scene/`, nunca no núcleo. Com um `game.json` ao lado
  do `index.html`, o editor vira o jogador de um jogo exportado.
- Scripts: `pnpm compare` (comparação de imagens com a base) e
  `pnpm export -- --title … --area …|--scene … [--desktop]` (web e Tauri).
- O **Tauri** só entra para o que o navegador não faz: arquivos e empacotamento.
  Desenvolva e valide primeiro no navegador (`pnpm dev`). No Linux, o WebKitGTK
  do Tauri tem WebGL mais lento que o Chromium.

## 5. Plano em fases

Cada fase termina com `pnpm check` verde, capturas antes/depois e um registro
em `docs/log.md` (crie-o na fase 1).

### Fase 1 — Núcleo extraído (começar aqui)

Porte de `reference/pomorog/src-visual/` para `packages/engine/src/`:

1. `surface.ts` (IDs no alpha), com teste do `toFixed(2)`.
2. Renderer da engine: alvo de render com `DepthTexture`, ordem de desenho
   (`visual-pipeline.md` §2 e `recreate-from-zero.md` passo 10) e controle de
   brilho e tamanho de célula.
3. `ascii.ts`, o passe de tela, com a passagem direta para os materiais `glyph`.
   Remova o acoplamento com o pântano (`swampShoreGLSL`); efeitos de bioma
   entram por um gancho, não por import direto.
4. `illumination.ts` (luz local) como módulo da engine.
5. `worldGlyph.ts` → `surface`, `glyphBody.ts` → `body`, `grass.ts` → `carpet`
   e `glyphCloud.ts` → `particle`.
6. API inicial: `createAsciiEngine(canvas, options)`, `engine.add(object, { glyph })`,
   `engine.render(dt)`, `engine.setStyle(preset)` e o preset `pomorog`.
7. Cena de referência no editor: chão `surface`, uma caixa, uma pedra e uma
   copa `body`, grama `carpet`, uma fogueira simples `particle` e um boneco
   `screen`. Compare com `reference/pomorog/images/orca-world-glyph.png` e
   `after-world-glyph-closeup.png`.

Pronto quando: a cena do editor fica visualmente equivalente às capturas
aprovadas e nenhum módulo do núcleo importa nada específico do jogo.

### Estado em 11/10/2026

**Atualização de autoria visual:** o editor agora inicia no sandbox com
hierarquia, transformações, partes, duplicação/exclusão, desfazer/refazer,
rascunho em IndexedDB, modelos GLTF/GLB incorporados e exportação de
`SceneDoc`. Mapas e itens sem terreno podem ser salvos/reabertos; chuva,
neve e efeitos da biblioteca podem compor o documento. O pedido atual do
dono se limita ao visual exportável, sem regras nem interface de jogo.
Veja o [guia e limites da entrega](docs/guia-editor-visual.md) e os
[exemplos](docs/examples/). Isso fecha o marco de persistência/autoria
básica, mas não todos os recursos das fases abaixo.

**Usabilidade:** a pedido do dono, o espaço de trabalho foi reorganizado
com referência na Unity: hierarquia à esquerda, cena no centro, inspetor
à direita e biblioteca embaixo. Objetos entram por arrastar e soltar ou
clique seguido de posicionamento. W/E/R controlam mover/girar/escalar
pelos eixos, com coordenadas locais/globais e encaixe; Alt + arraste gira
a câmera. Terreno e ambiente possuem abas próprias. Os painéis são fixos.
`apps/editor/src/editor/` contém o espaço de trabalho, ícones SVG e
`TransformControls`: estes desenham numa cena de sobreposição exclusiva
do editor, fora do pipeline ASCII e do documento exportado.

No núcleo, `world/validation.ts` valida documentos, `world/history.ts`
guarda snapshots limitados, `import/assets.ts` resolve fontes incorporadas
e `weather/sceneWeather.ts` liga as receitas de precipitação ao documento.
As receitas de objetos do Pomorog continuam no editor. O futuro importador
do jogo precisará fornecer uma biblioteca compatível a `buildScene`.

**Diagnóstico anterior, preservado como contexto da auditoria:**

Existe uma implementação inicial das fases 1 a 6 e 8, com as 5 áreas
montadas **em código** e selecionáveis no editor. Isso ainda não cumpre o
critério de montá-las pelas ferramentas do editor. A autoria de cenários,
a persistência de estilos/assets e a integração entre sistemas estão
incompletas; não falta apenas aprovação visual.

Estado conferido, problemas reproduzidos e prioridades estão no
[`relatório de auditoria de 11/10`](docs/relatorio-engine-2026-10-11.md).
O próximo marco recomendado é criar uma cena, personalizar partes,
importar um modelo, salvar, reabrir igual e exportar. Primeiro, corrigir
persistência, sementes dos prefabs, validação de documentos e descarte de
camadas; depois completar as ferramentas de autoria já previstas abaixo.

`pnpm check` e as seis comparações com a base da engine passaram. O
sandbox foi capturado no Orca Browser. A equivalência final com o Pomorog
continua pendente. Desktop tem compilação histórica, sem execução
validada; a Fase 7 espera autorização no repositório do jogo. O histórico
de implementação permanece em `docs/log.md`.

### Ordem real de trabalho (marcos por área)

As fases abaixo descrevem **sistemas**. A ordem de execução segue as áreas
do §1.1: depois da Fase 1, cada área é uma **fatia vertical**, construída de
ponta a ponta com o mínimo de cada sistema que ela usa (terreno e pincel,
água, chunks, efeitos, ajustes por parte, salvar e carregar), e os sistemas
crescem a cada área. A Floresta Sombria é a primeira fatia e a prova do
caminho; se algo travar, descobre-se ali e não depois de editores grandes.

### Fase 2 — Água, reflexo, clima e fogo (porte do Pomorog)

Porte fiel do que existe: `water` com reflexo em letras, a forma da água
(`waterEdge`), a água do pântano, a chuva com anéis `|_____|`, a neve, a
fogueira em grade de calor e os efeitos de combate. Desde já, a água entra
como **componente configurável** (§3.2) e os efeitos como **dados de efeito**
(§3.3), e não como código fixo de um bioma. O que o Pomorog tem vira os
primeiros presets.

### Fase 3 — Importação

Leitura de GLTF/GLB com `userData.glyph` (propriedades personalizadas do Blender),
um padrão razoável quando faltar a marcação, e `body` em malhas com esqueleto
(amostrar posições a partir dos ossos). Animações do GLTF tocam normalmente.

Cada nó nomeado vira uma parte com estilo próprio (§3.1).

### Fase 4 — Editor de ajustes

Painel com os ajustes ao vivo (tabela de ajustes, `visual-pipeline.md` §16),
**seleção por parte** com estilos em camadas (§3.1), presets salvos em JSON,
captura de tela e comparação de imagens automática.

### Fase 5 — Cenários e chunks

O mundo é montado a partir de **chunks**, pedaços de cenário reutilizáveis,
como o circuito da floresta do Pomorog (`forestWorld.ts`, `trailLoop.ts`).

1. **Prefab:** um conjunto salvo e reutilizável, por exemplo a "fogueira" (lenha,
   efeito de fogo, luz e som) ou a "ponte" (tábuas, cordas e água por baixo).
   Ao editar o prefab, todas as cópias mudam; uma cópia pode sobrescrever
   partes (§3.1).
2. **Chunk:** um prefab de cenário com tamanho fixo, que traz terreno, tipo de
   chão, água, objetos, luzes, efeitos e **conectores de borda** (por onde
   passam a trilha, o riacho e o caminho). Fica numa biblioteca e tem marcações
   de bioma e raridade.
3. **Cenário:** uma grade, ou um circuito, de chunks. Pode ser montado à mão
   (arrastar chunks e girar) ou **gerado** por regras: conectores precisam
   casar, a semente define a variação, há pesos por bioma e chunks fixos
   (ex.: o acampamento no início). O resultado gerado pode ser editado e salvo.
4. **Carregamento por distância:** só os chunks perto da câmera existem;
   o resto é descarregado. O Pomorog já faz isso no circuito.
5. **Editor de chunk e de cenário:** posicionar, girar, escalar, duplicar,
   agrupar, desfazer e refazer, com o **terreno por pincéis** (§3.4):
   esculpir montanhas e vales, pintar o chão, espalhar objetos e grama,
   cavar lagos e rios, traçar caminhos. Costuras automáticas entre chunks
   vizinhos (relevo, chão, água e trilha contínuos).
6. **Ambiente por cenário:** chuva, neve, noite e luar, neblina e luzes locais.

Tudo salvo em JSON (prefab, chunk e cenário), carregável pela engine sem o editor.

### Fase 6 — Sistema de efeitos

O sistema de efeitos completo (§3.3), como o das engines de mercado, mas
gerando letras: editor de emissores com linha do tempo e prévia em loop,
importação de animações prontas (sprite sheet, GIF, vídeo, GLTF animado),
gatilhos e pontos de fixação. Os efeitos do Pomorog (fogueira, golpe, garras,
raio, gelo, aura, morte, poeira, entradas em cena) são refeitos como presets e
servem de teste de fidelidade.

### Fase 7 — O Pomorog volta a usar a engine

O jogo passa a importar `@ascii-engine/core`. Ele precisa ficar idêntico nas
capturas aprovadas; isso prova que a extração foi fiel. Faça só com o dono
autorizando, no repositório do Pomorog.

### Fase 8 — Exportação

Empacotar uma cena ou jogo pelo Tauri (desktop, depois Android e iOS) e pela web.

## 6. Comandos

```bash
pnpm install
pnpm dev                 # editor em http://localhost:1440
pnpm check               # typecheck + testes + build
pnpm tauri dev           # editor como app desktop
```

Capturas sem interface: `.claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs`
(Chromium sem janela com GPU, `--use-angle=gl`). Valide também no **Orca Browser**.
