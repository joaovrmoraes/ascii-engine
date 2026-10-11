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

### Fase 2 — Água, reflexo, clima e fogo

`water` com reflexo em letras, a forma da água (`waterEdge`), a chuva com anéis
`|_____|`, a neve, a fogueira em grade de calor e os efeitos de combate como
presets de partículas.

### Fase 3 — Importação

Leitura de GLTF/GLB com `userData.glyph` (propriedades personalizadas do Blender),
um padrão razoável quando faltar a marcação, e `body` em malhas com esqueleto
(amostrar posições a partir dos ossos).

### Fase 4 — Editor

Painel com os ajustes ao vivo (tabela de ajustes, `visual-pipeline.md` §16),
presets salvos em JSON, captura de tela e comparação de imagens automática.

### Fase 5 — O Pomorog volta a usar a engine

O jogo passa a importar `@ascii-engine/core`. Ele precisa ficar idêntico nas
capturas aprovadas; isso prova que a extração foi fiel. Faça só com o dono
autorizando, no repositório do Pomorog.

### Fase 6 — Exportação

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
