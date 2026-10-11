# Pomorog — guia visual e UI/UX

**Base aprovada: 10/10/2026; atualizada em 11/10/2026** com as letras presas
aos objetos (vídeo da luta contra o dragão). A referência técnica completa
(como cada coisa é construída, cada parâmetro e como ajustar) está em
[pipeline visual](visual-pipeline.md) e na [documentação da engine](engine/README.md).
Este guia mantém a direção e os critérios.
O usuário quer preservar esta direção e concentrar as próximas versões em
jogabilidade, balanceamento e refinamentos pontuais de modelos. Os valores
abaixo descrevem o ponto de partida; não substituem a comparação visual.

Conteúdo: [identidade](#identidade), [ASCII](#ascii-e-legibilidade),
[cores](#cores-e-luz), [cenários](#cenários), [movimento](#personagens-e-movimento),
[UI/UX](#interface-e-experiência), [assets](#itens-e-retratos), [som](#som),
[processo](#como-chegamos-aqui), [revisão](#critério-de-revisão).

## Identidade

**Melhorias visuais continuam autorizadas quando pedidas.** A referência define
a identidade compartilhada, sem congelar cada asset ou limitar sua qualidade.
Por exemplo, "melhora o sprite desse bicho" permite refazer sua silhueta,
proporções, detalhes, cores locais e articulação quando isso ajudar o resultado;
depois, fotografar o modelo novamente e atualizar retratos/aparições afetadas.
Procure ganho perceptível de legibilidade, personalidade e movimento. O bicho
deve continuar pertencendo ao mesmo universo ASCII. Não usar um defeito do print
atual como motivo para recusar ou enfraquecer o refinamento pedido. Uma mudança
global de direção também pode ser feita quando o usuário a solicitar.

RPG de fantasia visto por câmera isométrica, com volume, luz, movimento e
materiais legíveis **em caracteres**. O personagem vive a aventura sozinho
enquanto a pessoa trabalha. O mapa é o centro visual; os comandos preparam a
Hunt e organizam o progresso.

Três condições precisam coexistir:

1. **Reconhecimento:** árvore, água, fogo, chão, herói e inimigo identificáveis
   no tamanho normal da janela, inclusive durante a caminhada.
2. **ASCII evidente:** caracteres visíveis com respiro, sem ampliar um print.
   Não basta desenhar contornos sobre uma superfície lisa.
3. **Continuidade:** cor e volume conectam as letras, sem virar uma parede de
   símbolos brilhantes que esconde a ação.

O [índice de referências](ui/reference/README.md) define quais capturas seguir.
As imagens da alpha documentam a organização da UI; o mundo nelas é anterior às
correções de luz. Prints finais de neve, chuva e interiores definem o acabamento
mais recente dos cenários.

## ASCII e legibilidade

**Estado vigente:** o mundo é feito de letras presas às coisas, sobre fundo
escuro. Cenário sólido usa letras na superfície; copas, pedras e criaturas são
nuvens de letras; o chão tem um tapete de letras de pé; água, reflexo, fogo e
efeitos são letras por célula/partícula. O **passe de tela** descrito abaixo
continua em uso no herói (escolha do usuário), no pântano (água/chuva), na
neve (chão/flocos) e em `?ascii=screen`. Detalhes em [visual-pipeline.md](visual-pipeline.md).

Passe de tela: geometria low poly em Three.js fornece forma, luz, cor e profundidade. O shader
converte a cena em células com alfabetos por material. Uma base de cor discreta
mantém as silhuetas conectadas. Essa base faz parte do resultado aprovado:
retirá-la fragmenta/escurece o mapa; fortalecê-la demais faz parecer 3D comum.

| Parâmetro | Base atual | Intenção |
| --- | --- | --- |
| Célula do mundo | 6 × 7 pixels do framebuffer | Letras reconhecíveis e cenário legível |
| Célula dos atores | 5 × 6 no padrão | Preservar rosto, braços e pernas |
| Fonte do atlas | Courier New regular, 29 px em células 24 × 32 | Traço leve; atlas reduzido na tela |
| Controle de luz | 1,0 / 100% | Avaliar sem compensar defeitos pelo slider |
| Zoom inicial | 0,9 | Escala compartilhada entre áreas |
| Renderer | DPR limitado a 1,5, sem antialias | Controlar custo e leitura das células |
| Amostragem | Centro + quatro amostras por célula | Reter detalhes finos da geometria |

Pixels do framebuffer não equivalem necessariamente a pixels CSS. Compare com
viewport e DPR registrados; não calibre apenas por um print ampliado.

Pedra tende a `.:-=coO0#`; casca/madeira a traços verticais e diagonais;
folhagem a `.,;vcoax%#`; água a traços horizontais; neve a ` .,:;~+*coO`.
Alfabetos completos em [ascii.ts](../src/ui/visual/ascii.ts).

Preserve peso regular, cor local, grão estável e densidade moderada. Evite negrito
global, bloom em todas as letras, célula minúscula para esconder o ASCII, grandes
massas de `@`/`#` ou sorteio de letras a cada frame.

### Letras presas aos objetos (vigente)

Pedidos de 10–11/10 ([registro](ui/reference/meadow-combat-2026-10-10/README.md)).
Rejeitados: grade de tela sobre o chão ("filtro na tela"), textura de letras
sobre sólidos ("3D com textura"), grade em formas redondas ("bola preenchida
por letras"). Vigente:

| Coisa | Técnica |
| --- | --- |
| Chão, ponte, ruínas, caixas, troncos | Letras na superfície, grade local em metros, fundo ≈1%, 6 degraus de letra (`worldGlyph.ts`) |
| Copas, pedras, cristais | Nuvem aberta de letras (`glyphBody.ts`) |
| Criaturas | Modelos articulados + nuvem de letras presa a cada membro |
| Herói | Passe de tela (escolha do usuário) |
| Grama/cascalho/musgo | Tapete de letras de pé (`grass.ts`, `groundCover.ts`) |
| Água e reflexo | Uma letra por célula: reflexo amostrado no centro da célula, espuma, fileiras `~ - =` |
| Fogo, magia, poeira | Glifos no mundo (`effects.ts`), sem sprites borrados |

Efeitos de combate (todas as áreas): golpe de espada em arco, garras,
raio, bola de fogo, gelo, anel de engajamento, anel de impacto, aura com luz,
morte que se desfaz em letras, poeira ao correr, vagalumes, sombra de contato.
Glifos de efeito abaixo de ~`.12` m somem; use `o`, `+`, `*`.

### Floresta em circuito

A Floresta Sombria é um circuito procedural fechado com comprimento
calculado pelo bloco de foco; a fogueira fica no início/fim. O herói anda,
corre e para, chegando à fogueira no fim da caçada; monstros chegam correndo,
saem do chão ou descem do ar. Detalhes em `visual-pipeline.md` §15 e `engine/animation.md`.

### Caso especial: neve

A primeira neve tinha base muito preenchida e pontuação escura discreta. O
usuário gostou do mapa, mas percebeu perda de ASCII. A correção aprovada usa
caracteres claros sobre azul-cinza, apenas no material de neve:

```glsl
// Referência da revisão aprovada; implementação em ascii.ts.
density = .18 + light * .25 + grain * .5;
gl_FragColor.rgb = mix(ink * .58, ink, glyph * coverage * .84);
```

Essa base maior é específica de neve clara. Não generalize para todos os
materiais nem restaure a antiga base `.86` com letras escuras. Confira pegadas,
fogo, galhos e flocos juntos ao ajustar o contraste.

![Neve com o ASCII aprovado](ui/reference/snow-2026-10-10/ascii-after-walking.png)

## Cores e luz

Fantasia noturna com materiais coloridos. Folhas verdes, madeira marrom, água
azul-esverdeada, pedra cinza, capa vermelha e fogo âmbar. A luz não deve tingir
tudo de azul ou verde. Contraste quente/frio orienta sem apagar o restante.

| Contexto | Leitura desejada | Regressão a evitar |
| --- | --- | --- |
| Floresta/pântano | Luar, tons médios, chão e árvores identificáveis | Preto fora do alcance da lanterna |
| Mina/catedral | Descoberta por lanterna, memória do caminho, arquitetura próxima legível | Clarear como exterior ou esconder todas as faces |
| Neve | Mais clara, azul-cinza, pinheiros verdes, calor localizado | Branco estourado ou superfície lisa |
| Fogueira | Chama viva e luz quente localizada | Disco laranja plano |
| Tempestade | Clarão breve revela cores dos materiais | Lavagem branca, estrobo contínuo, letras estouradas |

O shader eleva tons médios de exteriores e comprime picos de brilho. Corrija
primeiro o material/ambiente responsável; alterações globais exigem comparar os
cinco mapas. A lanterna não deve transformar caracteres em blocos brancos.

## Cenários

| Região / ID | Assinatura | Preservar |
| --- | --- | --- |
| Floresta Sombria / `dark_forest` | Copas volumosas, ruínas, capim, rio e acampamento | Tufos, separação água/chão, luar |
| Mina Antiga / `old_mine` | Rocha facetada, trilhos, vagão, escoras, minério e lanternas | Escala da madeira, cascalho, descoberta |
| Catedral Submersa / `sunken_cathedral` | Colunas finas, arcos/nervuras, pedra cinza-esverdeada, vitrais, musgo, água lateral | Arquitetura sem blocos que escondem o ator |
| Pântano da Chuva / `rain_marsh` | Árvores curvas, raízes, água rasa, grama submersa, chuva | Casca visível, verde sob água, ondas pequenas nos pés |
| Pinheiral Nevado / `snow_pines` | Pinheiros em camadas, chão claro, galhos cobertos, fogueira | Acúmulo, pegadas, flocos, clareira derretida |

A escala do personagem é a régua. Não compense um modelo desproporcional mudando
a câmera toda. Troncos, escoras, colunas e pedras precisam da mesma escala de
detalhes. Preserve o tratamento de oclusores que permite acompanhar os atores.

### Chuva, água e tempestade

- Chuva usa **traços finos, compridos e rápidos**, alinhados à queda em 3D.
  Atualmente: 800 gotas, segmentos de um pixel, cauda mais fraca. É uma exceção
  intencional aos glifos: partículas grandes de caracteres pareciam neve.
- Gotas respeitam profundidade; impacto acontece no fim da trajetória e não
  muda aleatoriamente de lugar com o FPS.
- Água cobre parte das pernas de herói/criaturas. Verde-escuro da grama aparece
  sob a lâmina d'água; margem e profundidade não podem parecer piso azul sólido.
- Ondas nascem nas botas animadas e seguem contato/direção. Poucos respingos
  baixos; evitar anéis gigantes e explosões a cada passo.
- Reflexos são reconhecíveis, invertidos e deformados suavemente, mais discretos
  que os corpos reais. O pedido de 10/10 às 17:35 mostrou que traços de água muito
  densos ou um espelho excessivamente fraco apagam essa leitura. Usar caracteres
  próprios para a silhueta e preservar áreas de água mais calmas; referência e
  revisão em [reflexos](ui/reference/water-reflection-2026-10-10/README.md).
- Chama perde força, solta vapor e se recupera; luz e som acompanham a chuva.
- Relâmpago irregular, clarão curto, trovão atrasado. Tempestade só no pântano.

### Neve

- Flocos `.`, `+`, `*` lentos, com deriva e oclusão; não reutilizar chuva branca.
- Cobertura nos galhos/pedras cresce durante a visita; bioma reconhecível desde
  a entrada, com neve inicial.
- Pegadas saem das botas apoiadas, ficam no terreno e são recobertas em cerca
  de 110 s. Não marcar pé no ar, personagem parado ou chão derretido.
- Fogueira mantém terra úmida com borda irregular e derretimento gradual.
- Pausa congela flocos, acúmulo, marcas e derretimento. São efeitos da visita,
  não um estado climático persistente no save.

## Personagens e movimento

Herói esguio, cabeça/ombros/tronco contidos, braços e pernas separados, capa
vermelha, armadura assimétrica, espada e lanterna. Evitar bloco largo ou boneco
minúsculo. As animações são procedurais sobre corpos articulados.

- Aceleração, frenagem e giros amortecidos por tempo, independentes de FPS.
- Passada por distância percorrida: apoio, recuperação, joelhos, transferência
  de peso e contrarrotação do tronco.
- Cabeça e segmentos da capa têm movimento secundário.
- Aproximação, ataque, dano, morte, coleta, sentar e levantar têm transições;
  novos eventos não reiniciam bruscamente toda a pose.
- Preparação, golpe e recuperação distinguíveis; som, dano e efeito chegam no
  impacto, incluindo tempo de viagem de magia.
- Criaturas têm movimento por família: slime deforma, serpente articula corpo,
  pescoço e mandíbula; quadrúpedes galopam com coluna, pescoço, mandíbula e
  cauda; artrópodes alternam pernas e empinam. Não transladar um objeto rígido.
- O herói corre em trechos (inclina o tronco, braços maiores, poeira) e para
  para olhar em volta; criaturas nunca surgem do nada. Fórmulas em
  [engine/animation.md](engine/animation.md).
- Câmera acompanha/enquadra suavemente; girá-la não move o encontro ou os efeitos.

Há bastante animação, mas o jogo não exige reação manual durante o foco.
Preserve pausa, aba oculta e movimento reduzido. O relógio da apresentação
não é o relógio da Hunt real.

## Interface e experiência

### Organização

**Mapa amplo + lateral compacta.** Identidade/vitais, abas Expedição/Diário e
preparação ficam na lateral. Timer e ação principal abaixo do mapa. Conta e
presença têm sua barra. Inventário, ficha, equipamentos, skills e loja têm painéis.

Informação nova de preparo vai para expedição; resultado para diário/cidade;
detalhe para contexto. Evite novos cartões permanentes para cada sistema sobre
o mapa. `game.css` fornece base; **`expedition.css`** refina o layout principal.
As antigas três colunas de `game.css` não são referência para recriar a UI atual.

### Paleta e tipografia

Tokens atuais de `expedition.css`:

| Papel | Cor |
| --- | --- |
| Fundo carvão | `#101014` |
| Texto principal | `#c8c4bd` |
| Texto secundário | `#89858c` |
| Bordas | `#343238` |
| Cobre/areia | `#d3b27c` |
| Dano/alerta | `#de8b7b` |
| Azul | `#91abc8` |
| Ciano | `#a0b5c2` |
| Verde contido | `#aab594` |

Use a pilha monoespaçada `--font`, bordas finas, contraste e posição para
hierarquia. Fundo verde dominante, cartões arredondados genéricos, glassmorphism
e ícones coloridos desconectados dos assets não pertencem à direção. Tipografia
da UI e peso do atlas do mundo são decisões separadas.

### Interação

- Ação principal reflete o estado real: iniciar, pausar, retomar, descansar.
- Preserve clique/atalhos anunciados; não acionar o jogo ao digitar em campos.
- Inventário mostra quantidade, raridade, atributos, requisitos, valor e
  comparação. Inspecionar não altera personagem; equipar/vender são ações reais.
- Controles de imagem recolhidos; os padrões devem funcionar sem calibrar shader.
- Tela estreita reorganiza a lateral abaixo do mapa, preservando ações e rolagem
  dos modais. Não encolher fontes/miniaturas indiscriminadamente.
- Estados e restrições têm texto, não só cor. Preserve foco de teclado.
- Textos normais seguem PT/EN em `src/i18n`; demo ainda tem textos em português.

### Entradas e transições

Opacidade, deslocamento curto e revelação gradual: painel ~250 ms, modal ~260 ms,
chegada da expedição 450–800 ms com pequenos atrasos. Esse ritmo não significa
animar cada atualização do timer. Reuse CSS existente antes de trazer outra
biblioteca. Preserve `prefers-reduced-motion`; animação não atrasa ações nem
esconde erros ou desloca o alvo do clique.

## Itens e retratos

Sprites são **fotografias dos modelos próprios com o filtro ASCII do mundo**,
salvas em PNG: atualmente 52 itens, 32 criaturas e herói. Silhueta ajustada ao
enquadramento; espada, escudo, frasco e material precisam ser distinguíveis na
miniatura. Material define a cor da arte; raridade aparece no texto/estado.

Mude a geometria e fotografe novamente. Compare mapa, mochila, loja, bestiário
e loot. `art.ts` permanece como arte textual/fallback legado, mas não substitui
silenciosamente os PNGs aprovados. Não inserir sprites sem filtro ou de estilo
independente para resolver um asset isolado.

## Som

Ambiente por bioma e fogo por distância. Chuva com detalhe de gotas e estéreo;
ruído branco constante foi percebido como chiado. Passos na água baixos/curtos,
sem graves estrondosos. Espada tem passagem de ar + contato breve com variação.
Áudio acompanha contato, deslocamento e impacto.

Preserve geral/efeitos/ambiente, mute, ativação por gesto e silêncio na pausa/aba
oculta. Fontes/licenças/processamento em [áudio](../public/audio/README.md).
Não extrair áudio dos vídeos de referência para distribuir no jogo.

## Como chegamos aqui

Síntese dos pedidos e revisões preservadas, não um relato de etapas inexistentes:

| Etapa | Problema percebido | Direção que ficou |
| --- | --- | --- |
| POC isométrica | Aparência genérica, mapa ilegível | 3D fornece forma/luz; acabamento ASCII |
| Vídeos de 08/10 | Objetos irreconhecíveis, letras fortes ou pequenas demais | Alfabetos por material e escala consistente |
| Autorun/movimento | Cena vazia, criaturas rígidas | Andar/lutar/saquear/sentar; articulação por família |
| v0.1/UI | Fundo verde, organização ruim, itens inconsistentes | Carvão/cobre, mapa dominante, sprites dos modelos |
| Luz de 09/10 | Escuridão geral, letras estouradas | Luar externo; descoberta só dentro; fonte regular |
| Pântano | Chuva invisível, água sem contato, árvores apagadas | Traços, ondas nas botas, casca e grama visíveis |
| Vídeo de 19:15 | Falta de cor, personagem largo | Materiais coloridos, herói esguio, árvores/reflexos |
| Revisão da chuva | Claro demais, parecia neve | Tons médios equilibrados e gotas finas rápidas |
| Interiores | Mina/catedral destoavam | Arquitetura, escala e oclusão alinhadas |
| Neve | Mapa bom, pouco ASCII | Glifos claros mais presentes só na neve |

Blender foi autorizado se necessário; o pipeline atual é procedural em Three.js.
Não afirmar que houve pipeline Blender, captura de movimento ou geração de
assets por IA. A POC evoluiu para uma alpha; referências visuais orientaram a
gramática, e geometrias/implementação foram produzidas no projeto.

## Critério de revisão

Compare no tamanho real e em movimento, com padrões. Print bonito não valida
chuva, contato dos pés ou continuidade da pose.

- Identifico ator, inimigo, chão, água, árvores e fogo?
- Reconheço ASCII sem excesso de tinta ou superfície lisa?
- Materiais mantêm cores sob sombra, lanterna e clarão?
- A área parece parte do mesmo jogo das outras quatro?
- Movimento, som e terreno concordam?
- Informação nova cabe na hierarquia e funciona por teclado?
- Pausa/troca de área/retorno não deixam efeitos ou sons presos?

Salve antes/depois sem tratar cores posteriormente e atualize o índice.
O guia protege o estado aprovado; um pedido explícito posterior pode atualizá-lo.
