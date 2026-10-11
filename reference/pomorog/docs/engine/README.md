# Pomorog ASCII Engine — documentação

Tudo o que forma a imagem e a sensação do Pomorog: 3D procedural convertido
em ASCII, animação, efeitos, UI/UX, sprites e áudio de apresentação. A
documentação foi escrita para permitir **recriar qualquer parte do zero** e para servir de
base a uma engine dedicada a ASCII.

| Documento | Conteúdo |
| --- | --- |
| [Pipeline visual](../visual-pipeline.md) | Princípio, ordem de um quadro, criação do 3D, IDs de material, passe de tela, letras na superfície, corpos de letras, tapete, partículas, luz/brilho/cor, água e reflexo, clima, fogo e combate, criaturas, mundo procedural, tabela de ajustes, diagnóstico, validação e **catálogo objeto por objeto** (por que o herói difere da construção, a copa da pedra, o fogo da caixa…) |
| [Animação](animation.md) | Primitivas de movimento, herói (construção e cada fórmula do ciclo), corrida, locomoção, quadrúpedes, artrópodes, humanoides, slime, serpente, entradas em cena, câmera, ambiente animado, HUD no mundo |
| [UI/UX](ui-ux.md) | Princípios, tipografia, tokens de cor, layout e responsivo, mapa e controles, faixa de foco, lateral, demo, modais, componentes de texto, keyframes e durações, acessibilidade |
| [Sprites e áudio](assets-and-audio.md) | Fotografia dos modelos com o filtro ASCII, modelos de item, áudio de apresentação |
| [Recriar do zero](recreate-from-zero.md) | Passo a passo com o código-núcleo de cada técnica e checklist de fidelidade |

Leitura complementar: [guia visual](../style-guide.md) (direção e
critérios aprovados), [manual de produção](../production-guide.md) (processo e
entrega), skill `pomorog-ascii-visual` (guia curto para agentes) e o
[registro de 10–11/10](../ui/reference/meadow-combat-2026-10-10/README.md).

## Mapa do código

| Arquivo (`src/ui/visual/`) | Responsabilidade |
| --- | --- |
| `scene.ts` | Renderer, câmera, luzes, loop, locomoção, entradas, ordem de desenho |
| `ascii.ts` | Passe de tela e passagem direta dos materiais com letras |
| `surface.ts` | IDs de material no alpha |
| `worldGlyph.ts` | Letras na superfície, água em letras, `applyWorldGlyphs` |
| `glyphBody.ts` | Corpos/nuvens de letras (copas, pedras, criaturas) |
| `grass.ts`, `groundCover.ts`, `meadow.ts` | Tapete de letras e pisos |
| `glyphCloud.ts` | Partículas de glifos |
| `effects.ts` | Fogueira, combate, anéis, aura, poeira, morte, vagalumes |
| `illumination.ts`, `exploration.ts` | Luz local e descoberta em interiores |
| `waterReflection.ts`, `channelWater.ts`, `water.ts`, `swamp*.ts`, `footWater.ts`, `rippleField.ts`, `shoreDetails.ts` | Água, reflexo, pântano, ondas |
| `rain.ts`, `rainStreaks.ts`, `storm.ts`, `snow.ts`, `snowEnvironment.ts` | Clima |
| `environment.ts`, `forestWorld.ts`, `trailLoop.ts`, `wetlandTrees.ts` | Cenários, mundo em circuito, árvores |
| `models.ts`, `beasts.ts`, `wetlandCreatures.ts`, `motion.ts`, `actorInk.ts` | Herói, criaturas, animação |
| `worldActors.ts`, `peers.ts` | HUD no mundo, outros jogadores |
| `AsciiWorld.tsx`, `GameScreen.tsx`, `DemoScreen.tsx`, `demo.ts` | Componentes, demo |
| `snapshotAssets.ts`, `itemModels.ts`, `itemSprites.ts` | Sprites fotografados |
| `*.css` | UI (ver `ui-ux.md`) |
