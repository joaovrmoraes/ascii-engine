---
name: pomorog-ascii-visual
description: Guia do estilo gráfico vigente do Pomorog (mundo 3D feito de letras) e de como construir cada coisa nele — chão, grama, construções, árvores, pedras, água, fogo, criaturas, efeitos de combate, mundo procedural em circuito e o comportamento do herói. Use antes de criar ou alterar qualquer cenário, objeto, criatura, efeito ou mapa, ao receber vídeo/print de referência, ou ao depurar algo que sumiu ou "parece filtro na tela".
---

# Pomorog — o mundo é feito de letras

Leia inteiro antes de mexer em `src/ui/visual/`. A referência completa (cada
parâmetro, fórmula de animação, UI/UX, recriação do zero) está em
`docs/visual-pipeline.md` e `docs/engine/`. Direção e limites ficam em
`AGENTS.md` e `docs/style-guide.md`; esta skill diz **como construir**. O
estado aprovado foi definido com o usuário em 10/10/2026, a partir do vídeo da
luta contra o dragão (`docs/ui/reference/meadow-combat-2026-10-10/`). O mapa de
referência é a **Floresta Sombria** (`?demo=1`). Quando descobrir algo melhor,
acrescente aqui com data.

## 1. A regra que decide tudo

> Cada coisa é **feita de letras presas a ela**, sobre fundo escuro. Nunca
> uma grade de letras fixa na tela, nunca uma superfície 3D pintada com
> letras por cima.

Três sintomas que o usuário rejeitou, com as palavras dele:

| Sintoma | Causa | Correção |
| --- | --- | --- |
| "Filtro na tela, não nas coisas"; letras "nadam" quando a câmera anda | O objeto passou pelo passe de tela (`ascii.ts`) | Use uma das técnicas da seção 2 |
| "3D com textura de ASCII", "rocha 3D com escritos em cima" | Fundo entre letras com cor/valor visível | Fundo `0` absoluto ou superfície invisível |
| "Bola preenchida por letras, não árvore feita de letras" | Grade projetada na superfície de forma redonda/orgânica | Nuvem de letras (`glyphBody`), sem corpo visível |

O sombreamento vem da **escolha da letra** (`. : - = + * x % # @`), em
degraus, com cor plana por letra; não de um degradê de cor.

## 2. Qual técnica usar para cada coisa

| Objeto | Técnica | Arquivo | Notas |
| --- | --- | --- | --- |
| Chão (todas as áreas) | Piso **iluminado** + grade de letras local | `worldGlyph.ts` (`glyphMaterial`), pisos em `forestWorld.ts`/`groundCover.ts`/`meadow.ts` | Recebe luar, sombras e luzes pontuais. Superfície `earth` |
| Tapete do chão (grama, cascalho, musgo, crosta de neve) | Milhares de **letras de pé** instanciadas no mundo | `grass.ts` + receitas em `groundCover.ts` | É o que dá vida ao mapa; sem tapete o mapa "parece outro estilo" |
| Construções, ponte, tábuas, troncos retos, adereços de caixa | Grade de letras na superfície (fundo quase preto, letra por degrau) | `worldGlyph.ts` | Usuário: "perfeito" |
| Copas, folhagem, junco | **Nuvem de letras** aberta, corpo invisível | `glyphBody.ts` (rampa `foliage`) | Silhueta irregular e com buracos |
| Pedras e rochas (de pedrinha a pedregulho), cristais | Nuvem de letras aberta, só faces da frente, mais densa e clara | `glyphBody.ts` (rampa `stone`) | Pedrinha = 1–2 caracteres. Nada de corpo escuro |
| Criaturas | Modelos articulados (`beasts.ts`, `models.ts`) + nuvem de letras presa a cada membro | `glyphBody.ts` (rampa `actor`) | Silhueta de cor mínima (lê sobre neve) |
| **Herói** | **Passe de tela antigo** (`markActorInk`) | `scene.ts` | Escolha explícita do usuário. Não troque sem pedido |
| Água | Fileiras `~ - =` que correm, espuma, reflexo convertido em letras célula a célula | `worldGlyph.ts` (`worldWaterGLSL`) | Ver seção 5 |
| Fogo, magia, poeira, terra, vagalumes | Glifos no mundo (`glyphCloud`), sem sprites borrados | `effects.ts` | Ver seção 6 |
| Pântano (água e chuva) e neve (chão e flocos caindo) | Versão aprovada antiga | `swampEnvironment.ts`, `snowEnvironment.ts`, `ascii.ts` | Escolha do usuário; o resto do mapa segue a tabela |

`applyWorldGlyphs(root)` decide sozinho: `foliage`, neve de galho e todo
`Dodecahedron/Icosahedron/Octahedron` sólido vão para `glyphBody`; o resto vira
`glyphMaterial`. Material passado por `tagSurface(material, kind)` ou pela
classificação automática do `environment.ts`, que usa **HSL em sRGB**.

## 3. Receitas de construção

### Objeto novo de cenário
1. Modele com `kit.box`/`kit.add` (ou `box`/`add` do `environment.ts`) na escala
   do herói (2,15 m de altura).
2. Dê o tipo certo: `stone`, `wood`, `bark`, `earth`, `foliage`, `snow`.
3. Chame `applyWorldGlyphs(grupo)` **depois** de montar (os pedaços do mundo
   procedural já fazem isso).
4. Capture de perto (seção 9). Se parecer superfície pintada, é porque o
   material errado foi para `glyphMaterial`: troque o tipo ou a geometria.

### Bioma novo / outro mapa
Replique a receita da floresta, que é o que funciona:
1. **Piso iluminado** com cor calculada pela posição de mundo (shader) ou textura sRGB.
2. **Tapete de letras** em `groundCover.ts`: escolha glifos (`| / \ v Y ! * o . ,`),
   paleta, altura, densidade/máscara e, se o mundo for infinito, `infinite`
   com GLSL de máscara (trilha/margens).
3. Objetos pela tabela da seção 2.
4. Luz: exterior com luar legível; interior com descoberta pela lanterna.

### Criatura nova
- Quadrúpede ou artrópode: adicione uma entrada em `QUAD`/`BUG` (`beasts.ts`).
  Paleta própria (couro, ventre, escuro, olho emissivo), proporções e extras
  (orelhas, juba, chifres, presas, espinhos, cauda, asas, pinças, nº de olhos).
- Humanoide/morto-vivo: entrada em `FOLK` (escala, pele, roupa, armadura,
  brilho, flutuar) sobre o rig do viajante.
- Animação por família: articulações (quadril → joelho, pescoço → cabeça →
  mandíbula, cauda em cadeia), preparo/golpe/recuo e dano. Nunca translade um
  objeto rígido.
- Entrada em cena: ver seção 7.

## 4. Mundo procedural em circuito (Floresta Sombria)

**A caçada é um circuito fechado.** A fogueira fica em `s = 0`. O herói percorre a
volta inteira e chega de novo à fogueira quando o bloco de foco termina,
descansa e começa outra volta.

- `trailLoop.ts`: o comprimento é `tempo da caçada × HUNT_PACE`, arredondado em pedaços
  de 20 m. O anel tem raio `L/2π` e ondula com frequências **inteiras**, então
  fecha sem emenda. Funções: `point(s)` (centro, tangente, normal), `nearest(x,z)` → `s`,
  `offset(x,z)` (distância lateral) e espelho GLSL `trailOffset`.
- `forestWorld.ts`: pedaços indexados por `s` (módulo número de pedaços), semeados
  pelo índice (mesmo pedaço, mesmo conteúdo). Mantém de `-1` a `+2` ao redor do herói. Cada
  pedaço sorteia árvores, pedras de passagem, grupos de rochas e um destaque
  (ruína, tronco caído, pedras em pé, cogumelos que brilham). Às vezes também uma água:
  riacho sinuoso com poças e ponte, ou lago orgânico ao lado da trilha.
  Coloque coisas com `at(along, side)`, nunca com coordenadas fixas.
- O que não pode acabar fica no shader: o piso segue o herói em passos de
  3,4 m (múltiplo das células, para as letras não escorregarem) e a grama dá a volta ao
  redor do herói (`mod`). `forestSoilGLSL` limpa a trilha, a clareira e as margens.
- A sombra do luar acompanha o herói. Só a água mais próxima (< 11 m) renderiza espelho.
- Ao descartar, as árvores liberam a própria geometria/material; peças compartilhadas do kit não.
- `VisualSettings.hunt = { total, remaining }` (segundos) vem do `GameScreen`
  (fase `focus`) e da demo. Um total novo remonta o circuito (`setHuntLength`).

## 5. Água

- Nunca imagem contínua de "água de verdade" (o usuário achou "forçado").
  Toda célula é uma letra de uma cor:
  - **reflexo:** o espelho é amostrado **no centro da célula** e vira letra
    (rampa por luminância), com tremor por fileira e uma fileira a cada 4 vazia;
  - **espuma:** letras claras `.,:*+oO` onde há crista ou margem;
  - **água aberta:** fileiras esparsas `~ - =` que correm com a corrente, com brilho
    de lua em faixas lentas;
  - **fundo:** `0`.
- Forma: riacho com meandros fortes, largura variável e poças (`waterEdge`),
  ou lago de borda orgânica. Nunca uma faixa reta.
- Ponte: encontre a extensão da água andando pela trilha (`loop.point(sc ± d)`)
  e alinhe com a tangente da trilha.
- Anéis de chuva/passos (pântano): círculo ASCII com `-`/`_` em cima e embaixo,
  `|` nas laterais e `/` `\` nas diagonais, conforme a orientação na tela.

## 6. Fogo e efeitos

- **Fogueira:** grade de calor presa às toras e virada para a câmera. Uma letra
  legível por célula (`@ # % x * + : .` em ouro → laranja → brasa), cores
  saturadas acima de 1 (branco puro parece cinza), à frente das toras,
  cama de brasas, faíscas subindo em espiral e fumaça cinza.
- **Combate** (tudo ×1,4 de tamanho):
  - golpe de espada: arco grosso com rastro, estrela de raios `-\|/` e faíscas com gravidade;
  - garras do monstro: três rasgos vermelhos `\\\` sobre o herói;
  - raio: zigue-zague em três colunas;
  - fogo: projétil `@` com rastro e explosão em anel `O o` com colunas de chama;
  - gelo: espinhos `#A^`.
- **Anéis no chão:** engajamento sob a criatura e impacto no herói. **Morte:** o
  monstro se desfaz em letras que sobem.
- **Vagalumes** presos ao mundo; **poeira de letras** nos pés ao correr.
- Glifo de efeito menor que ~`.12` m some. Sem sprites aditivos borrados.

## 7. Comportamento (apresentação, nunca motor)

- **Ritmo:** `paceAt(time)` programa trechos de 9 s (andar, correr ×2,1, parar e
  depois andar). A velocidade base é `solveBaseSpeed(distância que falta, tempo
  que falta)`, já levando em conta a média do programa. Combate e saque param o herói; ele
  recupera depois. Corrida tem animação própria: inclinação, braços, cadência e poeira.
- **Fogueira:** fixa em `s = 0`. No descanso, ele vai pelo lado mais curto do
  circuito até o assento. Nunca teletransporte, nunca fogueira surgindo na tela.
- **Monstros não surgem do nada:**
  - feras e insetos correm de fora do quadro (16 m) pela trilha à frente e freiam;
  - mortos-vivos e escavadores (`undead`, larva, caracol, slime) saem do chão,
    com rachaduras `\|/` e terra espirrando;
  - voadores descem de longe e do alto.
- Demo (`?demo=1`): travada na floresta, ciclo pomodoro comprimido
  (caçada com cinco encontros → fogueira), em loop **sem remontar o mundo**.
  Pular para a fogueira só move a linha do tempo.

## 8. Armadilhas que já custaram horas

- **Passe de tela trava a grade sobre as coisas:** tudo o que passa por `ascii.ts` tem
  letras fixas na tela. Só o herói (por escolha) e os mapas antigos ficam ali.
- **"Quase preto" vira cinza** na passagem direta, que aplica `pow(.4545)`: use `0`.
- **Atlas com mipmap em point sprites** borra cada letra num quadrado cheio
  (sprites não têm derivadas). Use atlas do tamanho da letra na tela, sem mipmap.
- **Partes sobrepostas empilham letras:** compartilhe o hash de espaçamento por corpo, em coordenadas de mundo.
- **Cor em espaço linear** classificou pedra cinza-esverdeada como folhagem: use HSL sRGB.
- **`tagSurface` com `toFixed(1)`** confundia IDs: use duas casas (`surface.test.ts`).
- **`dt` negativo** (rAF antes do `performance.now()` anterior) explodiu a pose:
  limite `dt` a `[0, .08]`.
- **`patch` é palavra reservada no GLSL.** Leia o console (`PAGE` no `cdpshot`).
- **Point sprites não respeitam planos de recorte** no reflexo; tudo bem, mas lembre ao depurar.
- **Fogo escondido** sob telhado/toras: posicione a grade à frente (eixo da câmera).
- **Objeto esverdeado vira folhagem** (o saco de dormir virou nuvem de folhas). Confira a cor.
- Desempenho: o reflexo é o maior custo. Medido ~47 fps contra 54 no modo antigo
  (RX 6600, headless). Reduza pedaços ou espelhos antes de cortar o tapete.
- Avise **antes** de reverter qualquer coisa: o usuário acompanha ao vivo em
  `localhost:1430/?demo=1` e estranha recuos.

## 9. Capturar e validar

- Regra do projeto: validar no **Orca Browser** (`orca-ide goto/reload/screenshot --page <id>`).
  Painel oculto não desenha; painel estreito com `set viewport` gera mosaico. Declare a origem da evidência.
- Sequências/combate: `scripts/cdpshot.mjs` (Chromium headless com GPU,
  `--use-angle=gl`). Variáveis de ambiente:
  - `EXPR`: imprime estado antes de cada quadro;
  - `PRE` e `PREDELAY`: clica em algo após N ms.
  - Exemplo: `node scripts/cdpshot.mjs "http://localhost:1430/?demo=1" out/f 9000 8 300`.
  - Descarte quadros pretos.
- `canvas.dataset.circuit` mostra `progresso/comprimento` e a distância até o assento.
- Teste longe da origem posicionando o herói temporariamente (remova depois).
- Rode `pnpm release:check`. Mudança só visual não exige `pnpm sim`; diga isso.
- Salve antes/depois em `docs/ui/reference/<tema>-<data>/` com README e
  atualize índice, guia e retomada.

## Histórico

- 10/10/2026: vídeo da luta contra o dragão.
  - Rejeitados: filtro de tela no chão, textura de letras em tudo, letras na superfície de corpos redondos.
  - Aprovado: cenário com letras nos objetos e grama de letras de pé.
  - Depois vieram: tapete por bioma, `glyphBody` para copas, pedras e criaturas, fogo em grade de calor,
    monstros articulados com entradas, efeitos de combate maiores, água em letras sinuosa,
    circuito procedural com chegada calculada e ritmo andar/correr/parar.
  - Pântano e neve voltaram à versão anterior por escolha do usuário.
