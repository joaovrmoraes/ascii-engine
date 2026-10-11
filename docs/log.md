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
