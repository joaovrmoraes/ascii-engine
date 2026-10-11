# Pomorog — pipeline visual completo

**Estado de 11/10/2026.** Este documento descreve tudo o que forma a imagem do
jogo: como o 3D é criado, como vira ASCII, cada filtro e seus parâmetros, luz,
brilho, água, reflexo, chuva, neve, fogo, efeitos de combate, criaturas, o
mundo procedural em circuito e como ajustar cada coisa. Arquivos citados ficam
em `src/ui/visual/` salvo indicação.

Leitura complementar:

- [Guia visual e UI/UX](style-guide.md): direção aprovada e critérios.
- [Manual de produção](production-guide.md): processo, validação, entrega.
- Skill `pomorog-ascii-visual` (`.claude/skills/` e `.agents/skills/`): guia
  curto de construção para agentes.
- [Registro de 10–11/10](ui/reference/meadow-combat-2026-10-10/README.md):
  pedidos, rejeições e capturas.

Índice: [1. Princípio](#1-princípio) · [2. Visão geral](#2-visão-geral-de-um-quadro) ·
[3. Criação do 3D](#3-criação-do-3d) · [4. Materiais e IDs](#4-ids-de-material-no-alpha) ·
[5. Passe de tela](#5-passe-de-tela-asciits) · [6. Letras na superfície](#6-letras-na-superfície-worldglyphts) ·
[7. Corpos de letras](#7-corpos-de-letras-glyphbodyts) · [8. Tapete de letras](#8-tapete-de-letras-grassts--groundcoverts) ·
[9. Partículas](#9-partículas-de-glifos-glyphcloudts) · [10. Luz e brilho](#10-luz-brilho-e-cor) ·
[11. Água e reflexo](#11-água-e-reflexo) · [12. Clima](#12-chuva-tempestade-e-neve) ·
[13. Fogo e efeitos](#13-fogo-e-efeitos-de-combate) · [14. Criaturas](#14-criaturas-e-herói) ·
[15. Mundo procedural](#15-mundo-procedural-em-circuito) · [16. Ajustes](#16-tabela-de-ajustes) ·
[17. Diagnóstico](#17-diagnóstico) · [18. Validação](#18-validar) ·
[19. Catálogo objeto por objeto](#19-catálogo-objeto-por-objeto)

---

## 1. Princípio

> O mundo é **feito de letras presas às coisas**, sobre fundo escuro.

O usuário rejeitou três abordagens; elas definem os limites:

| Rejeitado | Palavras do usuário | Por quê |
| --- | --- | --- |
| Grade de letras fixa na tela sobre o chão | "o filtro fica na tela e não nas coisas" | As letras não acompanham o objeto quando a câmera anda |
| Superfície 3D colorida com letras desenhadas por cima | "3D com textura de ASCII", "rocha 3D com escritos" | O fundo entre letras tem valor visível |
| Grade de letras projetada em formas redondas (copas, corpos) | "bola preenchida por letras, não árvore feita de letras" | A forma continua sólida; as letras só a decoram |

Consequências práticas:

- Espaço entre letras é **escuro** (zero absoluto ou fração mínima).
- **Sombreamento = escolha da letra** (`. : - = + * x % # @`), em degraus;
  cor plana por letra.
- Cada letra pertence a uma posição do mundo/objeto e se move com ele.
- Exceções aprovadas pelo usuário: o **herói** e os mapas do **pântano**
  (água/chuva) e da **neve** (chão e flocos) usam o modo de tela antigo.

## 2. Visão geral de um quadro

Ordem em `scene.ts → render()`:

```text
1. Simulação de apresentação: rota, ritmo, animação, efeitos (sem RNG do motor).
2. environment.renderWaterReflection(): câmera espelhada → textura de reflexo.
3. renderer → alvo offscreen (cor + profundidade). O alpha de cada pixel
   guarda o ID do material (seção 4).
4. Passe ASCII (ascii.ts) desenha a tela:
     - pixels com ID "glyph" (.85) → passam direto, só com luz comum;
     - os demais → grade de tela (modo antigo).
5. Por cima, com teste de profundidade: grama/tapete (grass.ts), água de
   partículas, chuva, efeitos (glyphCloud), neve caindo.
6. Rótulos HTML (nomes, barras de vida, números de dano).
```

Renderer: `WebGLRenderer` sem antialias, DPR limitado a 1,5,
`outputColorSpace = LinearSRGBColorSpace`, sombras `PCFShadowMap` 1024².
Câmera ortográfica isométrica seguindo o herói (seção 10.4).

## 3. Criação do 3D

Todo o 3D é procedural em Three.js (sem Blender, sem arquivos de modelo).

| Peça | Onde | Como |
| --- | --- | --- |
| Primitivas de cenário | `environment.ts` (`box`, `add`, `material`) | `BoxGeometry`, `DodecahedronGeometry`, cilindros; `MeshStandardMaterial` com `flatShading` e `roughness: 1` |
| Árvores | `wetlandTrees.ts` | Galhos em cilindros por pontos; copas em `InstancedMesh` de icosaedros (6 ramos × ~36 tufos) com cores por instância |
| Floresta procedural | `forestWorld.ts` | Pedaços de 20 m com árvores, pedras, destaques, água; seção 15 |
| Pisos | `forestWorld.ts`, `meadow.ts`, `groundCover.ts` (`createLitFloor`) | Plano iluminado com cor por shader ou textura canvas sRGB |
| Herói | `models.ts` (`createAdventurer`) | Rig de grupos: tronco, cabeça, braços (ombro/antebraço), pernas com IK de 2 ossos, capa de 3 painéis, lanterna |
| Criaturas | `beasts.ts`, `models.ts`, `wetlandCreatures.ts` | Quadrúpedes e artrópodes articulados; humanoides sobre o rig do herói; slime/serpente próprios |
| Acampamento | `environment.ts` (`campGroup`) | Grupo único (pedras, toras, abrigo, saco de dormir, caixa, assento) reposicionável |

Regras de modelagem:

- Escala: herói = **2,15 m**. Troncos, escoras, pedras e degraus seguem essa régua.
- Tipo de material define alfabeto e técnica (seção 4). Sem `tagSurface`
  explícito, `environment.ts` classifica pela cor em **HSL sRGB**:
  folhagem (`s > .18`, `h` entre `.2` e `.45`), madeira (tons quentes), senão pedra.
  Comparar canais lineares classificou pedra cinza-esverdeada como folhagem.
- Objetos de cenário sempre passam por `applyWorldGlyphs(grupo)` após montados.

## 4. IDs de material no alpha

O alvo offscreen guarda no **alpha** qual material é cada pixel. `surface.ts`:

| Tipo | Alpha | Usado em |
| --- | --- | --- |
| `reflection` | 0 | reflexo legado (modo tela) |
| `snow` | .1 | neve (chão de neve no modo tela) |
| `bark` | .2 | casca de árvore |
| `wetgrass` | .3 | grama submersa (pântano) |
| `wood` | .4 | madeira |
| `actor` | .5 | herói (`markActorInk`) |
| `stone` | .6 | pedra |
| `foliage` | .7 | folhas |
| `water` | .8 | água legada |
| `glyph` | **.85** | **tudo que já é feito de letras** (passa direto pelo passe de tela) |
| `earth` | .9 | terra |

- `tagSurface(material, kind)` injeta `gl_FragColor.a = X` com **duas casas**
  (`toFixed(2)`); `ascii.ts` compara com tolerância `.035`.
- Novo ID: ≥ `.05` de distância dos outros; `__tests__/surface.test.ts` valida
  o arredondamento de 8 bits.

## 5. Passe de tela (`ascii.ts`)

Converte a imagem offscreen em letras numa **grade fixa da tela**. Hoje serve
ao herói, ao pântano/neve e a `?ascii=screen`. Pixels com ID `glyph` saem cedo
(ver 5.4).

### 5.1 Grade e amostragem

- Célula do mundo: `cellSize` px (padrão **6**), altura `floor(size × 1.2)`.
  Atores: `max(4, floor(cellSize × .84 + .5))` (≈5 px) para preservar rosto/membros.
- Amostra no centro + 4 diagonais a 20% da célula: `cor = centro×.6 + .1×(4 vizinhas)`,
  depois `pow(cor, .4545)` (linear → gama).
- `grain = hash(célula)`: fixo por célula de tela, não sorteia a cada quadro.
- Profundidade → posição de mundo (`inverseProjection`, `cameraWorld`) para luz local.

### 5.2 Alfabetos e densidade

Atlas: canvas de células 24×32, **Courier New regular 29 px**, filtro linear.

| Material | Alfabeto | Densidade (índice na rampa) |
| --- | --- | --- |
| genérico | ` .,:;-~=+*ox%#@` | `light × 1.35` |
| ator | ` .:-=+*x%#@` | `light × 1.05 + .12` (máx .88) |
| folhagem | `.,;vcoax%#` | `.15 + light×.42 + grain×.48` |
| pedra | ` .:-=coO0#` | `.22 + light×.55 + grain×.2` |
| casca | `:\|/\\Il` | `.2 + grain×.79` |
| madeira | `.:\|/\\lIvt` | `grain` |
| terra | ` .,:coO*` | `.1 + grain×.85` |
| água | ` ._-~=~` | `.3 + grain×.65` |
| grama molhada | ` .,;v/\\` | `.25 + grain×.74` |
| neve | ` .,:;~+*coO` | `.18 + light×.25 + grain×.5` |
| reflexo | ` .,:-=+*ox%` | `light×1.5 + grain×.12` |

Bordas de profundidade (gradiente > `.006`, luz > `.12`, fora de folha/terra)
trocam a letra por `- | / \` conforme a direção.

### 5.3 Tinta, fundo e cobertura

```text
gain (força da letra): ator 1.22 · folha 1.08 · terra .83 · outros 1.05
ink = min(cor × gain × brightness, .96)  → illuminateInk() (seção 10)
exterior: ink *= 1.16 + .12 × (1 − smoothstep(.08,.55,tom))   (eleva meio-tons)
interior: ink *= 1.3
compressão de pico: ink = ink / (1 + ink × .42)
coverage = smoothstep(.05,.20,luz) [exterior] / smoothstep(.07,.23,luz) [interior]
  terra × step(.27,grain); folha × (.72+grain×.28); água × (.24+.26×step(.74,grain));
  reflexo × (.75+grain×.12); grama molhada × .72
fundo (paper) = max(vec3(.030,.040,.043), ink × surfaceColor)
  surfaceColor exterior: folha .27 · ator .18 · casca .10 · grama molhada .135 · água .09 · resto .07
  interior: ator .18 · folha .24 · madeira .28 · pedra .30 · água .09 · resto .07
saída = mix(paper, max(paper, ink), glifo × coverage)
neve: mix(ink × .58, ink, glifo × coverage × .84)   (exceção aprovada)
```

Sombra de contato (`contacts[2]`): sob herói e criatura escurece terra e grama molhada
até 72%, elipse de raio `.55` (herói) e `max(.5, altura × .45)` (criatura).

### 5.4 Passagem direta dos materiais `glyph`

Se o alpha é `.85`: `ink = pow(cor, .4545) × brightness`, sombra de contato
(60%, só perto do chão), `illuminateInk`, elevação de exterior/interior
igual à 5.3, compressão `ink/(1+ink×.42)`, mínimo `vec3(.022,.028,.032)`.
**Atenção:** como há `pow(.4545)`, um "quase preto" de `.004` vira cinza
visível. Para fundo preto use `0`.

## 6. Letras na superfície (`worldGlyph.ts`)

Para superfícies planas/retas: chão, ponte, tábuas, ruínas, troncos, caixas.
`glyphMaterial(material)` injeta no shader do `MeshStandardMaterial`
(depois de toda a iluminação do Three.js):

1. **Grade local**: posição do vértice × escala do objeto (e da instância),
   em metros; a face escolhe o plano pelo eixo dominante da normal
   (`xz` em pisos, `zy`/`xy` em paredes, letras em pé).
2. Célula `CELL[tipo]` × `CELL × 1.25`:

   | tipo | célula (m) | [força, fundo] |
   | --- | --- | --- |
   | ator | .12 | 2.4, .015 |
   | folhagem | .20 | 2.0, .012 |
   | pedra | .18 | 2.2, .012 |
   | madeira/casca | .17 | 2.3, .012 |
   | terra | .17 | 1.8, .01 |
   | genérico | .18 | 2.2, .012 |
   | neve | .13 | 1.2, .40 |
   | grama molhada | .17 | 2.1, .01 |

3. **Luz** = cor final do Three.js, comprimida `lit/(1 + lit×.9)`;
   `tom = luminância(pow(lit,.4545))`.
4. **Degrau**: `level = floor(tom × 1.5 × 6 + grain × .85) / 6` → letra da rampa:

   | tipo | rampa |
   | --- | --- |
   | ator | ` .:-=+*x%#@` |
   | folhagem | ` .,:;vcoa%#` |
   | pedra | ` .:-=coO0#` |
   | madeira | `.:-=\|/\\lt` |
   | casca | `:\|/\\Il\|` |
   | terra | ` .,,:;;co` |
   | neve | ` .,:;~+*coO` (nível por grão, contraste baixo) |

5. **Cor da letra**: matiz de `lit` com valor `pow(.18 + level×.82, 2.2) × força × .5`.
   **Fundo** = `lit × fundo` (≈1%: quase preto). `alpha = .85`.
6. Atlas: slots de 48 px, Courier New 46 px, mipmaps + anisotropia 4.
7. Encadeia injeções anteriores (cobertura/pegadas da neve) e só remove o
   `gl_FragColor.a` antigo.

`applyWorldGlyphs(root)` aplica isso a tudo, **exceto**: folhagem, neve de
galho e todo `Dodecahedron/Icosahedron/Octahedron` sólido, que vão para `glyphBody`.

## 7. Corpos de letras (`glyphBody.ts`)

Para formas orgânicas: copas, pedras, rochas, cristais, criaturas.

1. `MeshSurfaceSampler` espalha pontos pela superfície de cada malha
   (incluindo cada instância de `InstancedMesh`), com **espaçamento uniforme**:
   hash de células em coordenadas de mundo **compartilhado pelo corpo inteiro**
   (partes sobrepostas não empilham letras). Até 3000 pontos por malha.
2. Cada ponto vira um **point sprite com uma letra**, virado para a câmera,
   filho da malha (anda com o membro/galho).
3. Vértice: luz `ambient + difusa do luar×.7 + lanterna×.9 + fogueira×.8`;
   nível = `luz×.62 + (seed−.5)×.3 + brilho emissivo×.5` → rampa;
   cor = cor do material × `(.35 + luz×.8)` + calor da lanterna/fogueira + emissivo.
   Faces de costas não desenham (copa vira casca).
4. Rampas: ator ` .:-=+*x%#@`, folhagem ` .,:;vYv%&#`, pedra ` .:-=coO0#@`,
   neve ` .,:;+*oO@`, casca ` :\|!/\\lI#`.
5. Tamanho da letra (m): criaturas **.155**; cenário **.19**; folhagem e neve ×1,25;
   pedra ×.95, espaçamento .72 (mais densa), só faces da frente, cor ×1,45.
6. A malha original:
   - **aberta** (folhagem, neve de galho, pedra): `colorWrite = false`, não
     desenha, continua projetando sombra;
   - **criatura**: oclusor `MeshBasicMaterial` da própria cor × .035 (silhueta
     mínima, lê sobre neve), alpha `glyph`.
7. Atlas de 24 px/letra, Courier New 25 px, **sem mipmap** (point sprites não
   têm derivadas de UV; mipmap borrava cada letra num quadrado). Descarte com
   tinta < `.38`.
8. `updateGlyphBodies()` por quadro: tamanho em pixels
   (`altura / (top − bottom)` da câmera), posição/força da lanterna e fogueira,
   ambiente (interior .12, neve .42, demais .30).

## 8. Tapete de letras (`grass.ts` + `groundCover.ts`)

O que deu vida à floresta: milhares de **letras de pé** no mundo.

- Instâncias de um plano 1×1 (4 segmentos verticais) com atlas
  `| / \ v Y ! * o . ,` (monospace 34 px, mipmaps).
- Atributos por lâmina: posição, glifo, largura, altura, fase, cor.
- Vértice: dobra pelo vento (`sin(t×1.65 + x×.65 + z×.35)×.11` +
  `sin(t×2.6 + fase)×.035`), abre caminho ao redor de herói e criatura
  (raio .8/.75) e de um rastro de 12 pontos que se recupera em 2,5 s;
  escurece a 62% perto dos atores; névoa entre 10 e 21 m do foco.
- Fragmento: ponta mais clara (`.55 + .75×v`), luz de magia/aura via
  `setGlow()` (2 luzes, alcance 4 m), `illuminateInk`.
- Receitas por bioma (`groundCover.ts`):

  | Bioma | Quantidade | Conteúdo |
  | --- | --- | --- |
  | Floresta (circuito) | 90.000, dando a volta no herói em 36 m | `\|` `/` `\` `!` `v`, flores `*` `o`, verde esmeralda a oliva; máscara GLSL abre trilha/clareira/margens |
  | Floresta (fixa) | 70.000 | idem, com `meadowSoil` |
  | Mina | 26.000 | cascalho `. , o !`, minério cobre/verde |
  | Catedral | 22.000 | musgo e pó de pedra |
  | Pântano | 40.000 | junco nas ilhas |
  | Neve | 30.000 | crosta `. , * o`, capim seco na clareira derretida |

- Modo infinito (`infinite`): `base.xz = herói + mod(offset − herói + span/2, span) − span/2`;
  lâminas onde `forestSoil` indica terra/água são descartadas no vértice.

## 9. Partículas de glifos (`glyphCloud.ts`)

Point sprites com letra (`.,:;oOQ0cuvn|/\-=~*+#%^AX`, Courier New 29 px),
tamanho em metros convertido por `pixelScale`, cor e alpha por partícula,
oclusão pela profundidade do mundo (`worldDepth`). Usado por fogo, magia,
anéis, poeira, terra, vagalumes, água legada e neve caindo. Mínimo útil
≈ `.12` m; abaixo disso vira 1 px.

## 10. Luz, brilho e cor

### 10.1 Luzes da cena (`scene.ts`)

| Luz | Exterior | Interior | Neve |
| --- | --- | --- | --- |
| Hemisférica | `0xc2cec4`/`0x343321`, 1.25 | `0xa6b9c6`/`0x25291e`, .95 | `0xc9dfed`/`0x667987`, 1.35 |
| Direcional (lua) | `0xe0e7cc`, 2.2, sombra | `0xbac9cb`, 1.5 | `0xdfedfc`, 2.0 |
| Preenchimento | `0x9bbfb5`, .3 | `0x8295c1`, .3 | — |
| Lanterna (ponto) | 7 ± oscilação | 19 ± oscilação | — |
| Fogueira (ponto) | 14 (13 ± 1,1 ± .65) × força do fogo | idem | idem |

- Sombra do luar: `shadow.intensity = .62` em exteriores com letras; 1 em
  interiores/modo tela. No circuito, sol e alvo seguem o herói.
- Relâmpago (pântano): hemisférica +1,9 × flash, preenchimento +3,5 × flash.

### 10.2 `illuminateInk` (`illumination.ts`)

Compartilhado por passe de tela, grama e partículas.

- **Exterior** (céu aberto): `ink × (vec3(.96,1.02,1.02) + vec3(.22,.16,.07)×lanterna
  + vec3(.32,.17,.04)×fogueira + vec3(2.1,2.35,2.65)×relâmpago)`. Sem círculo de visão.
- **Interior** (mina/catedral): descoberta. Mapa 128² (42 m) com visível/explorado,
  linha de visada contra obstáculos na altura da lanterna, memória
  `vec3(.24,.29,.32)×explorado×.3`, luz `vec3(.64,.69,.76)` + lanterna + fogueira.
- Alcance: lanterna 5,8 m (expoente 1,35), fogueira 5 m (1,7). Pulso da
  lanterna `1 + sin(3,7t)×.035 + sin(7,3t)×.018`.

### 10.3 Brilho e tamanho (controles do jogador)

Em `AsciiWorld.tsx` (botão "Imagem"):

- **Luz** 65–140% (`asciiBrightness`, padrão 100%): multiplica a tinta do passe
  de tela, da grama e das partículas.
- **Tamanho** 5–12 px (`cellSize`, padrão 6): célula da grade de tela.
  Não afeta letras na superfície nem corpos (essas têm tamanho em metros).

### 10.4 Câmera

Ortográfica, ângulo base `π/7` + rotação do usuário (arrastar), altura 18 e
recuo 15 do foco. Zoom inicial .9 (roda: .75–1.5). Enquadramento
`span = max(3.8, min(4.7, altura/145))`, mais fechado em combate. Foco à frente
do herói (2 m; 1,25 em combate), puxado 32% para a criatura, suavizado
(`1 − e^(−3.5 dt)`). Oclusores entre câmera e atores ficam ocultos (raycast a cada .12 s).

### 10.5 Cores do chão

- Floresta (circuito): musgo `(.15+.09m, .34+.18m, .11+.05(1−m))`,
  manchas secas `+(.13,.04,0)`, terra `(.36,.33,.26)`, tudo ×.62, leito de água ×.1.
  Ruído de 3 oitavas em escala .32/.7/1.4.
- Mina: `0x2b241d…0x4a3d2e`; catedral: `0x2a302e…0x404842` com juntas de laje.

## 11. Água e reflexo

### 11.1 Reflexo planar (`waterReflection.ts`)

1. Câmera espelhada no plano da água (`y = nível`), com mesma projeção, órbita e zoom.
2. Renderiza a cena num alvo 640² com plano de recorte acima da água e sem
   atualizar sombras; a superfície da água fica oculta nesse passe.
3. `reflectionMatrix` (bias × projeção × vista) projeta pontos de mundo nesse alvo.

Custo: é o passe mais caro. No circuito, só a água mais próxima (< 11 m)
renderiza espelho.

### 11.2 Água em letras (`worldWaterGLSL`, floresta e catedral)

Célula `.15 × .19` m no plano da água, deslocada pela correnteza (`flow × tempo`).
Por célula, em ordem de prioridade:

1. **Reflexo em letras**: amostra o espelho **no centro da célula** (com tremor
   horizontal por fileira: `sin(fileira×1.3 + 2.1t)×.006`); se há objeto e
   luminância > .05, desenha uma letra da rampa ator pela luminância, matiz do
   objeto `(.3 + nível×.65)^2.2 × (.85,.97,1.1)`. Uma fileira em cada 4 fica
   vazia (espelho partido pela água).
2. **Espuma**: onde crista/margem > .12, letras ` .,:*+oO` em `(.32,.52,.62)`.
3. **Vegetação submersa** (quando aplicável): traços verdes.
4. **Água aberta**: fileiras esparsas `~ - =` (rampa ` .-_~=~-`), ondulação
   `sin(fileira×.9 + coluna×.15 − 1.4t)`, cor `(.07,.17,.22)` + brilho de lua
   em faixas lentas `(.12,.16,.18)×sheen^6`.
5. Fundo `0`.

### 11.3 Forma da água no circuito (`forestWorld.ts → waterEdge`)

- **Riacho** (`w > 0`): faixa de ±17 m ao longo de um ângulo; deslocamento
  lateral `sin(a×.29)×2.3 + sin(a×.83)×.5` (meandros), largura
  `w×(1 + .45 sin(a×.47))` e poças `max(0, sin(a×.23))³ × 2.2`.
- **Lago** (`w < 0`): raio `−w` com borda `1 + .2 sin 3θ + .1 sin 5θ + .05 sin 9θ`,
  achatado 1,2× em z, ao lado da trilha.
- Margem: terra até ~.75 m da água; pedras e juncos na faixa de −.45 a 0.
- Ponte: mede a extensão andando pela trilha a partir do cruzamento, centra
  no meio molhado, alinha à tangente da trilha; tábuas a cada .17 m, guarda-corpo e postes.
- O GLSL de `waterEdge` é compartilhado por chão, grama e água (mesma borda).

### 11.4 Pântano (versão aprovada antiga, `swampEnvironment.ts` + `swampWater.ts`)

- Superfície com profundidade real (`SWAMP_WATER_Y = .18`), sobe até +.13 no
  primeiro minuto (`flood = 1 − e^(−t/24)`); ilhas elípticas definem a margem.
- Shader: base `vec3(.006,.029,.025)`, ondas `sin(z×5+x×.8+.8t)·sin(x×3−.5t)`,
  brilho `sin(...)^18`, crista da hidrologia (`hydrology.texture`), espuma
  de margem, grama submersa por ruído (verde `(.025,.07,.009)`–`(.063,.145,.018)`),
  reflexo misturado (`reflectedWater`: cisalhamento horizontal, faixas, peso .56).
- Atores dentro da água ficam azulados até `nível + .45`.
- **Anéis ASCII** (passos, chuva, impactos): círculo com a letra escolhida
  pela orientação na tela: `-`/`_` em cima e embaixo, `|` nas laterais,
  `/` `\` nas diagonais. Passos também deixam anéis menores na margem
  encharcada (`puddle`). Ondas de arrasto seguem as botas.

## 12. Chuva, tempestade e neve

- **Chuva** (`rain.ts`, `rainStreaks.ts`): 800 gotas em traços de 1 px
  alinhados à queda 3D, cauda mais fraca, cor `(.68,.78,.84)`, oclusão por
  profundidade; impacto no fim da trajetória; intensidade `.65 + .35×chuvarada`.
- **Tempestade** (`storm.ts`, só pântano): raio a cada ~24 s ± 6, flash com
  subida de 25 ms e decaimento `e^(−5.8t)`, trovão atrasado 1,2–2,4 s.
- **Fogo na chuva**: força `.78 − apagão×.62`, vapor `.15 + apagão×.85`.
- **Neve** (`snow.ts`, `snowEnvironment.ts`): chão claro com cobertura por
  shader, deriva, **pegadas** pintadas num mapa 512² (dedos e calcanhar
  elípticos, somem em 110 s), clareira derretida ao redor da fogueira
  (raio 1,48 → 1,83), acúmulo nos galhos (`.28 → 1` em ~42 s), 950 flocos
  `. + *` lentos com deriva, ocultos sob as copas.

## 13. Fogo e efeitos de combate

Tudo em `effects.ts`, como apresentação.

### 13.1 Fogueira

- **Grade de calor** presa às toras e virada para a câmera, deslocada .45 m
  na direção da câmera (para não ficar atrás das toras): 11 colunas × 13 linhas,
  célula .15 × .19 m. Forma: largura que afina com a altura e oscila;
  calor = `forma^1.6 × (1 − h×.85) × 1.7 + ruído×.3 + cintilação×.2 − .12`.
- Letra pelo calor: `@` `#` `%` `x` `*` `+` `:` `.` com cores saturadas acima de
  1 (`(1.3,1.15,.55)` → `(.65,.12,.03)`); branco puro parecia cinza.
- Cama de brasas: anel de 26 letras `* + :` pulsando. Faíscas (22) subindo em
  espiral e fumaça cinza `, ; : ~` (12). Na chuva, vapor `. , : ~`.
- Luz: ponto `0xffac55` 14 + oscilação, alcance 7.

### 13.2 Combate

Glifos de combate com tamanho ×1,4.

| Efeito | Construção |
| --- | --- |
| Espada | Arco de 3 fileiras × 18 letras varrendo em .16 s (`#`/`/` na frente, `/ -` no meio, `: .` no rastro), estrela de raios `- \ \| /` e 18 faíscas com gravidade |
| Garras do monstro | Três rasgos vermelhos `\` (ponta `#`) desenhados em .12 s sobre o herói |
| Raio | Zigue-zague de 26 segmentos (`\| / \`) em três colunas (branco, azul, violeta), galhos, anel `~ - = +` no chão e estrela |
| Bola de fogo | Projétil `@` com rastro `# % x * + : .` em arco; explosão em dois anéis `O o` e 9 colunas de chama |
| Gelo | 13 espinhos `#` → `A` → `^` e cristais `*` |
| Anel de engajamento | 64 `o`/`*` vermelhos em elipse sob a criatura viva |
| Anel de impacto | Fecha sobre o herói em .28 s e abre em `*` |
| Aura de conjuração | Órbita dourada `o`/`*`, faíscas subindo e `PointLight` próprio (luz na grama) |
| Morte | 60 letras `@ # % * + : .` subindo e se espalhando por 1,6 s |
| Poeira | Ao correr (velocidade > 1,85) e na investida da criatura: `, : .` cinza que sobe e some em 1,1 s |
| Vagalumes | 70 motas `+`/`*` presas ao mundo dando a volta no herói (18 m), cintilando `sin^6` |

Sem sprites aditivos borrados (o brilho da fogueira e o halo da aura estão desligados).

## 14. Criaturas e herói

- **Herói**: passe de tela (`markActorInk`), por escolha do usuário. Animação
  procedural: passada por distância (1,05 m/ciclo, 60% de apoio), IK de joelho,
  contrarrotação do tronco, capa com arrasto, sentar, coleta, golpe
  (preparo .14 s / golpe .09 s / recuperação), dano. **Corrida**: `run`
  suavizado de `(velocidade − 1,55)/.9`, inclinação +.24 rad, braços ×1,9 e
  antebraços dobrados, quique maior, passada +12%, capa +.35.
- **Quadrúpedes** (`beasts.ts → QUAD`): lobo, lobo terrível, pantera, leão
  dourado, brutamontes de presas, bocarra de chifres, serpe de pedra. Coluna
  quadril → peito, pescoço → cabeça → mandíbula, 4 pernas coxa/canela/pata,
  cauda em cadeia; extras (orelhas, juba, chifres, presas, espinhos, listras).
  Galope por diagonais, agachar no preparo, investida, recuo ao levar dano.
- **Artrópodes** (`BUG`): aranha (8 olhos, marca vermelha), besouro (placas),
  vespa (asas a 38 Hz, ferrão, voo), caranguejo de maré (pinças). Pernas em
  2 segmentos com marcha alternada, empinar no preparo.
- **Humanoides/mortos-vivos** (`FOLK`): escala e paleta sobre o rig do viajante
  (goblin, gremlin, lagarto, sentinela, cultista, ogro, cavaleiro de ossos,
  rastejante, espectro e sombra flutuantes com brilho).
- Todas as criaturas usam **corpos de letras** (seção 7).
- **Entrada em cena** (`scene.ts → entryStyle`):
  - `charge` (feras/insetos): começa 11 m adiante pela trilha (fora do
    quadro), corre em velocidade constante e freia nos últimos metros; as
    patas ficam em cadência de galope (≤ 3,2 m/s).
  - `rise` (mortos-vivos, larva, caracol, rastejante, slime): sai do chão em
    1,25 s com tremor, rachaduras `- \ | /` radiais e terra espirrando.
  - `swoop` (voadores, olhos, imps, grimórios, espectros): desce de 9 m de
    distância e 4 m de altura com rastro de vento `~ -`.
  - Direção: trilha à frente, desviada para o lado na tela (nunca escondida atrás do herói).

## 15. Mundo procedural em circuito

Floresta Sombria. Arquivos `trailLoop.ts` e `forestWorld.ts`.

- **Circuito fechado**: comprimento = `segundos de caçada × 1,05 m/s`,
  arredondado em pedaços de 20 m (mín. 4). Anel de raio `L/2π` ondulado por
  `2.4 sin(n1 t) + 1.2 sin(n2 t + 1.3) + .45 sin(n3 t + .4)` com `n` inteiros
  (fecha sem emenda). `point(s)`, `nearest`, `offset` e GLSL `trailOffset`.
- **Fogueira em `s = 0`**, lado interno do anel (2,6 m), assento a 1,4 m,
  clareira livre de árvores/pedras (4,5 m).
- **Pedaços** (índice = `s / 20` módulo o total) semeados pelo índice; mantidos de
  −1 a +2 em torno do herói; cada um: até 11 árvores (2,6–13,6 m da trilha),
  34 pedras de passagem, 6 grupos de rochas e um destaque:
  - ruína de capela (22%);
  - tronco caído com cogumelos (23%);
  - pedras em pé (20%);
  - cogumelos luminosos (20%).

  Água em 46% dos pedaços (riacho 20%, lago 26%), nunca perto da fogueira.
- **Infinitos no shader**: piso de 64 m que segue o herói em passos de 3,4 m e
  tapete de grama que dá a volta nele. `forestSoilGLSL` desenha trilha,
  clareira e margens.
- **Ritmo**: `paceAt(t)` por trechos de 9 s: 22% pausa de 3,2 s e depois
  caminhada, 28% corrida ×2,1, 50% caminhada. Velocidade base
  `solveBaseSpeed(metros que faltam, segundos que faltam)` limitada a
  .35–1,45 m/s (corrida ≤ ~3 m/s). Combate e saque param o herói.
- **Tempo**: `VisualSettings.hunt = { total, remaining }` vem do `GameScreen`
  na fase `focus` (minutos de foco). Na demo, o circuito é dimensionado pelo
  tempo de caminhada (lutas param). Total novo → `setHuntLength` remonta o circuito.
- **Descanso**: vai pelo lado mais curto até a fogueira (corre se > 6 m) e senta.
- Depuração: `canvas.dataset.circuit = "progresso/comprimento camp:distância"`.

Demo (`?demo=1`): só a floresta. Ciclo comprimido: caminhadas de 6/16/12/18/14 s,
cinco encontros (lobo, larva, aranha, vespa, goblin), 30 s de fogueira e 3 s de
retomada, em loop sem recarregar o mundo. Pular para a fogueira só move a linha do tempo.

## 16. Tabela de ajustes

| Quero | Onde | O quê |
| --- | --- | --- |
| Letras do chão/construções maiores ou menores | `worldGlyph.ts → CELL` | metros por célula |
| Mais/menos contraste nas superfícies | `worldGlyph.ts → INK` | `[força, fundo]`; fundo é linear (.01 ≈ preto) |
| Mais degraus de sombra | `worldGlyph.ts` `steps` | padrão 6 |
| Letras das criaturas/pedras/copas | `glyphBody.ts` e `applyWorldGlyphs` | tamanho (.155/.19), espaçamento, rampas |
| Silhueta das criaturas na neve | `glyphBody.ts → darkOccluder` | fração da cor (.035) |
| Densidade/cor da grama | `groundCover.ts` | `count`, `density`, `pick` |
| Vento na grama | `grass.ts` vértice | amplitudes .11/.035 |
| Água: mais/menos fileiras | `worldGlyph.ts → waterLetters` | `grain < .22 + swell×.22` |
| Reflexo mais/menos presente | `waterLetters` | limiar de luminância .05, fileira vazia a cada 4, multiplicadores de cor |
| Forma dos riachos/lagos | `forestWorld.ts → waterEdge` (JS e GLSL iguais) | amplitudes de meandro, poças, borda |
| Frequência de água/destaques | `forestWorld.ts → waterFor/buildChunk` | limiares do sorteio |
| Tamanho do circuito | `trailLoop.ts → HUNT_PACE` | m/s médios |
| Ritmo andar/correr/parar | `trailLoop.ts → paceAt` | probabilidades e duração dos trechos |
| Velocidade máxima | `solveBaseSpeed` | limites .35–1,45 |
| Fogueira | `effects.ts` grade de calor | colunas/linhas, fórmula do calor, rampa de cores |
| Efeitos de combate | `effects.ts` (`fx` ×1,4) | tamanhos, quantidades, durações |
| Brilho global do modo tela | `ascii.ts` | `gain`, `surfaceColor`, elevação de exterior 1,16, compressão .42 |
| Luz geral | `scene.ts` | luzes da tabela 10.1 |
| Iluminação local | `illumination.ts` | alcances 5,8/5 e cores |
| Comparar com o modo antigo | URL | `?ascii=screen` |

Ao mudar uma função compartilhada entre JS e GLSL (`waterEdge`, trilha),
altere as duas versões juntas.

## 17. Diagnóstico

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Letras "nadam" com a câmera | Objeto no passe de tela | `applyWorldGlyphs` ou `glyphBody` |
| Fundo entre letras cinza | `pow(.4545)` da passagem direta | Use `0` |
| Letra virou quadrado borrado | Mipmap em point sprite | Atlas sem mipmap do tamanho da tela |
| Letras empilhadas | Espaçamento por malha | Hash compartilhado por corpo |
| Pedra/objeto virou "folhagem" | Classificação por cor | Confira HSL ou `tagSurface` |
| Herói sumiu / pose absurda | `dt` negativo | `dt` em `[0, .08]` |
| Shader não compila | Palavra reservada (ex.: `patch`) | Leia o console (`PAGE` no cdpshot) |
| Fogueira escondida | Grade atrás das toras/telhado | Deslocar para a câmera |
| Árvore em cima da fogueira | Clareira | `clear()` com raio da fogueira |
| FPS baixo | Reflexo, nº de pedaços, tapete | Reduzir nessa ordem |

Ferramentas temporárias úteis (remova depois): `window.__dbg` com posições,
renderizar `scene` sem ASCII para separar geometria de shader, posicionar o
herói longe da origem para testar a geração.

## 18. Validar

- **Orca Browser** (regra do projeto): `orca-ide goto/reload/screenshot --page <id>`,
  `orca-ide eval` para ler `canvas.dataset.*`. Painel oculto não desenha;
  painel estreito com `set viewport` gera mosaico.
- Sequências: `node .claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs <url> <prefixo> <espera> <n> <intervalo>`
  (Chromium headless com GPU; `EXPR`, `PRE`, `PREDELAY`). Descarte quadros pretos.
- Acompanhe um ciclo completo (fogueira → volta → fogueira) lendo `dataset.circuit`.
- `pnpm release:check`. Mudança só visual não exige `pnpm sim`.
- Salve antes/depois em `docs/ui/reference/<tema>-<data>/` com README.

Desempenho medido em 10/10: ~47 fps no modo de letras contra 54 no modo tela
(Chromium headless, Radeon RX 6600, 1600×757).

## 19. Catálogo objeto por objeto

Cada coisa visível usa **uma** das cinco técnicas. Saber qual técnica cada
objeto usa (e por quê) é o que permite criar coisas novas no mesmo estilo.

| Sigla | Técnica | Seção | Letras ficam presas a | Fundo entre letras |
| --- | --- | --- | --- | --- |
| **T** | Passe de tela (grade fixa na tela) | 5 | pixel da tela | cor discreta do objeto (`surfaceColor`) |
| **S** | Letras na superfície (grade local) | 6 | face do objeto, em metros | ~1% da luz (quase preto) |
| **C** | Corpo de letras (nuvem de point sprites) | 7 | ponto da superfície do objeto | nada (aberto) ou oclusor escuro |
| **G** | Tapete de letras de pé (instâncias) | 8 | posição no chão | o piso iluminado por baixo |
| **P** | Partículas de glifo (efeitos) | 9 | posição no espaço, recalculada por quadro | nada (transparente) |

### 19.1 Contrastes que explicam o estilo

| Par | Diferença | Motivo |
| --- | --- | --- |
| **Herói × construção** | Herói: **T** (grade de tela, célula ≈5 px, fundo `.18` da cor, alfabeto ` .:-=+*x%#@`). Ruína/ponte: **S** (célula .17–.18 m, fundo ≈1%, letra por degrau de luz) | Usuário preferiu o herói da primeira versão (rosto/silhueta mais legíveis em movimento). Construções retas aceitam bem uma grade na própria face; ali o "filtro na tela" estragava |
| **Herói × criatura** | Herói **T**; criaturas **C** (letras de .155 m presas a cada membro, oclusor da própria cor × .035) | Criaturas articuladas leem melhor como "feitas de letras" e acompanham galope/mandíbula; o herói ficou no estilo aprovado |
| **Copa da árvore × pedra** | Ambas **C**, abertas (sem corpo). Copa: rampa ` .,:;vYv%&#`, letras ×1,25 (≈.24 m), espaçamento folgado (.9), faces de trás aparecem até −.2 (copa volumosa e rendada), verde por instância. Pedra: rampa ` .:-=coO0#@`, letras ×.95 (≈.18 m), espaçamento denso (.72), **só faces da frente**, cor ×1,45 (cinza claro) | Copa precisa de silhueta irregular com buracos; pedra precisa de massa compacta. Com corpo escuro, a pedra virava "rocha 3D com escritos"; com grade de superfície, a copa virava "bola preenchida" |
| **Copa × tronco/galho** | Copa **C**; tronco e galhos **S** (casca ` :\|/\Il\|`, traços verticais) | Cilindros retos aceitam a grade local; a casca ganha veios verticais |
| **Fogo × caixa** | Fogo **P** (grade de calor virada para a câmera, recalculada todo quadro, `@ # % x * + : .`, cores > 1, sem fundo). Caixa **S** (madeira `.:-=\|/\lt`, estática, fundo quase preto) | O fogo é movimento puro e emite luz; a caixa é um sólido que recebe a luz do fogo e escurece pela sombra |
| **Chão × grama** | Chão **S** (piso iluminado, terra ` .,,:;;co`, célula .17 m); grama **G** (90 mil letras `\| / \ ! v` de pé, com vento e desvio dos pés) | O piso dá a cor/luz contínua e a trilha; o tapete dá profundidade, movimento e "vida" — sem ele o mapa parece outro estilo |
| **Trilha × grama** | Trilha é o próprio piso **S** com cor de terra `(.36,.33,.26)` e grama **removida** pela máscara GLSL (`trailOffset`) | A trilha precisa ler como caminho; só tufos curtos nas bordas |
| **Água × chão** | Água: shader próprio com letras por célula (seção 11.2: reflexo, espuma, fileiras `~ - =`) e fundo `0`. Chão: **S** | Água precisa se mover (correnteza, ondas) e refletir; usa a mesma lógica de "uma letra por célula" para não parecer "água de verdade" |
| **Reflexo × objeto refletido** | O reflexo é o espelho amostrado no **centro de cada célula** e convertido em letra pela luminância, com tremor por fileira e fileiras vazias | O reflexo não pode ser imagem contínua; deve ser feito de letras como o resto |
| **Ponte × tronco caído** | Ambos madeira **S**. Ponte: caixas finas (tábuas .17 m, guarda-corpos) alinhadas à trilha. Tronco: cilindro deitado com casca e cogumelos de prateleira | Mesma técnica; o que muda é a geometria |
| **Pedra pequena × pedregulho** | Ambos **C** rampa pedra. A pedrinha de trilha resulta em 1–3 letras; o pedregulho em dezenas | Tudo que é facetado (dodecaedro/icosaedro/octaedro) vira nuvem, independente do tamanho |
| **Fogueira × lanterna** | Fogueira: **P** + `PointLight` 14. Lanterna do herói: modelo (parte do herói, **T**) + `PointLight` 7/19 + calor no chão via `illuminateInk` | Só a fogueira tem chama visível em letras; a lanterna aparece como luz |
| **Efeito de magia × poeira** | Ambos **P**. Magia: grande (×1,4), saturada, com luz própria. Poeira: pequena, cinza `, : .`, sem luz | Hierarquia: combate chama atenção, ambiente não |
| **Chuva × neve** | Chuva: traços de 1 px (não glifos), rápidos, alinhados à queda. Neve: glifos `. + *` lentos com deriva | Glifos grandes na chuva pareciam neve (decisão anterior aprovada) |
| **Pântano/neve × floresta** | Pântano (água/chuva) e neve (chão/flocos): **T** antigo aprovado; árvores e objetos desses mapas seguem **S/C** | Escolha do usuário em 10/10 |

### 19.2 Catálogo completo

| Objeto | Técnica | Geometria / origem | Letras e cor | Movimento e luz |
| --- | --- | --- | --- | --- |
| Herói | T | Rig articulado (`models.ts`) | célula ≈5 px, ` .:-=+*x%#@`, capa vermelha, armadura clara | Passada, corrida, golpe, sentar; lanterna própria |
| Outros jogadores (online) | T | Mesmo rig, capa recolorida | idem | Interpolação de presença |
| Lobo, pantera, leão, brutamontes, bocarra, serpe | C | `beasts.ts → QUAD` | .155 m, rampa ator, paleta por espécie, olhos emissivos | Galope, investida, mandíbula, cauda |
| Aranha, besouro, vespa, caranguejo | C | `beasts.ts → BUG` | idem | Pernas alternadas, asas, pinças |
| Goblin, cultista, ogro, cavaleiro, espectros | C | rig do viajante + `FOLK` | idem, brilho emissivo nos mágicos | Animação do viajante; espectros flutuam |
| Slime, serpente, larva, caracol, olhos, elementais | C | `wetlandCreatures.ts`, `models.ts` | idem | Deformação/ondulação por família |
| Copas (floresta, pântano) | C aberta | `InstancedMesh` de icosaedros | ` .,:;vYv%&#`, ≈.24 m, verde por tufo | Balanço leve dos ramos; projetam sombra |
| Pinheiros (neve) | C aberta (galhos S) | cones/rochas em camadas | folhagem + neve de galho em letras | Balanço; acúmulo de neve |
| Troncos e galhos | S | cilindros | casca ` :\|/\Il\|`, .17 m | Estático; recebe sombra |
| Pedras de trilha, rochas, pedregulhos, cristais | C (só frente) | dodecaedro/icosaedro/octaedro | ` .:-=coO0#@`, ≈.18 m, cinza claro | Estático |
| Pedras em pé, muro/arco de ruína, tijolos | S | caixas | pedra ` .:-=coO0#` | Estático |
| Ponte, tábuas, abrigo, assento, caixa, saco de dormir | S | caixas | madeira `.:-=\|/\lt` (saco: tecido marrom) | Recebem luz da fogueira |
| Tronco caído | S + cogumelos S | cilindro + semiesferas | casca e madeira | — |
| Cogumelos luminosos | S | caixinha + semiesfera emissiva | pedra azul-esverdeada | Brilho próprio |
| Juncos de margem | S (folhagem fina) | caixas finas | verde | — |
| Chão da floresta | S | plano 64 m que segue o herói | terra ` .,,:;;co`, musgo/terra/leito por shader | Recebe luar, sombras, lanterna, fogueira, magia |
| Chão da mina / catedral | S | plano com textura canvas | terra; lajes com juntas na catedral | Descoberta pela lanterna |
| Grama da floresta | G | 90 mil instâncias em volta do herói | `\| / \ ! v`, flores `* o`, esmeralda a oliva | Vento, abre caminho para pés, luz de magia |
| Cascalho (mina), musgo (catedral), junco (pântano), crosta (neve) | G | receitas em `groundCover.ts` | ver seção 8 | Vento leve |
| Trilha / clareira / margens | S (máscara) | GLSL `forestSoil` | cor de terra, grama removida | — |
| Riacho e lago | shader de água em letras | plano + `waterEdge` | reflexo em letras, espuma ` .,:*+oO`, fileiras ` .-_~=~-` | Correnteza, ondas, brilho de lua |
| Reflexo | parte da água | câmera espelhada 640² | letras pela luminância, fileira vazia a cada 4 | Tremor por fileira |
| Água do pântano | T (antigo) | plano com profundidade | traços `~ -`, grama submersa, reflexo misturado | Enchente, chuva, ondas de botas |
| Anéis de passos/chuva | P | `swampWater.ts → ring` | `- _ \| / \` conforme a tela | Expandem e somem |
| Fogueira | P + luz | grade de calor 11×13 | `@ # % x * + : .`, ouro→brasa | Cintila, brasas, faíscas, fumaça; luz 14 |
| Vapor da fogueira (chuva) | P | — | `. , : ~` cinza | Sobe |
| Espada / garras / raio / fogo / gelo | P | seção 13.2 | ×1,4, cores fortes | Duração .3–1,25 s; luz em magia |
| Anéis de engajamento e impacto | P | elipses | `o *` vermelhos | Giram / fecham |
| Aura de conjuração | P + luz | órbita | `o *` dourado | Luz no chão e na grama |
| Morte da criatura | P | — | `@ # % * + : .` | Sobe e se espalha |
| Entrada: terra, rachaduras, vento | P | — | `, . \` ; : o *`, `- \ \| /`, `~ -` | 1–2 s |
| Poeira de corrida/investida | P | rastro de posições | `, : .` cinza | Some em 1,1 s |
| Vagalumes | P | 70 motas presas ao mundo | `+ *` verde-claro/branco | Cintilam |
| Chuva | traços de 1 px | `rainStreaks.ts` | `(.68,.78,.84)` | Rápida, impacto no fim |
| Relâmpago | luz + clarão | `storm.ts` | — | Flash curto, trovão atrasado |
| Neve caindo | P | `snowEnvironment.ts` | `. + *` | Lenta, deriva |
| Pegadas na neve | textura de cobertura | mapa 512² | marca no chão de neve | Somem em 110 s |
| Nomes, barra de vida, dano | HTML | `worldActors.ts` | fonte da UI | Projetados sobre o canvas |

### 19.3 Como decidir a técnica de algo novo

1. É o herói? → **T** (não mudar sem pedido).
2. É efeito, chama, luz em movimento, poeira, magia? → **P**.
3. É cobertura do chão (muitos itens pequenos de pé)? → **G**.
4. É forma orgânica/redonda/facetada (folhagem, pedra, criatura)? → **C**.
5. É sólido de faces retas (caixa, tábua, parede, tronco, piso)? → **S**.

Na prática: modele com o tipo de material certo e chame `applyWorldGlyphs`;
ele aplica S ou C automaticamente (seção 6). Criaturas passam por `glyphBody`
em `scene.ts`; efeitos vão em `effects.ts`; coberturas em `groundCover.ts`.
