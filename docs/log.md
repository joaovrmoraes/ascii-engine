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
