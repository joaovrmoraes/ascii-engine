# Registro de trabalho

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
