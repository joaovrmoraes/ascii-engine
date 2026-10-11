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
- **Editor:** clicar seleciona a **parte** sob o cursor, e um segundo clique ou
  uma tecla sobe para o objeto. O painel mostra a técnica e os parâmetros
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
- O **editor** é a vitrine e a ferramenta: cena de teste, ajustes ao vivo e,
  depois, importação e exportação.
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
   agrupar, desfazer e refazer; pincel para espalhar árvores, pedras e grama
   com variação; pintar o tipo de chão (que define o tapete `carpet`);
   desenhar lagos, riachos e caminhos; costuras automáticas entre chunks
   vizinhos (chão, água e trilha contínuos).
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
