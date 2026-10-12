# Água calma, espuma e margem — 11/10/2026

Pedido: observar a água real no Orca, melhorar sua leitura e cuidar da
mistura aparente com grama ao girar a câmera. Direção escolhida pelo dono:
**água calma, reflexo legível e ondas suaves**.

## Comparações

| Caso | Antes | Depois |
| --- | --- | --- |
| Lago da cena do dono | [Antes](lago-antes.png) | [Ondas mais contínuas](lago-depois.png) |
| Água acumulada na encosta | [Espuma em blocos](encosta-antes.png) | [Espuma por agitação](encosta-depois.png) |
| Câmera rasante à margem | [Faixas na amostragem](margem-antes-amostragem.png) | [Gradientes contínuos](margem-depois-amostragem.png) |

As comparações usam cópia da cena e do estado de profundidade/corrente
capturado após cerca de 11 minutos no Orca, em Chromium isolado. A
comparação da margem isola a correção de amostragem dentro do novo visual.
O documento da aba do dono não foi substituído.

[Orca antes](orcas-antes.png) é captura da aba inteira. [Orca agora](orca-agora.png)
é o canvas real da mesma aba, obtido pelo CLI após renderização, com a
navegação atual do dono e tempo da engine de 412,5 s. Uma captura da página
inteira sofreu timeout e outra apresentou mosaico do compositor; foram
descartadas. Nenhuma imagem foi gerada por IA.

## O que mudou

- Frentes lentas de onda em espaço de mundo e poucos degraus de cor.
  Advecção em fases curtas evita multiplicar uma velocidade variável pelo
  tempo total; letras continuam presas à superfície.
- Espuma é transportada e decai. Sua origem é a convergência da corrente,
  sem usar diferença entre profundidade atual e inicial. Margens têm
  menos espuma e o alfabeto não satura em blocos de `O`.
- Espelho escolhe a superfície simulada de uma região calma próxima,
  acompanhando acúmulo de água. Ondulação regula tremor/brilho também.
- `textureGrad` usa derivadas da grade contínua, antes de `fract` e da
  escolha da letra. Saltos entre posições do atlas não provocam mais uma
  falsa redução de textura, que borrava fileiras na vista rasante.

## Validação

- `pnpm check`: **79 testes**, tipos e build passaram; [log](check.log).
- `pnpm compare`: seis vistas dentro dos limites existentes, sem alterar
  a base; [log](compare.log).
- `verify-water.mjs`: reflexo lateral/oposto, lago profundo parado,
  iluminação, interação, encosta, persistência e canais customizados;
  [log](verify-water.log).
- O teste de margem compara os pixels com/sem água em quatro giros e
  duas inclinações (0,12 e 0,55 rad). Projeta a lâmina completa, incluindo
  sua borda entre 0 e 8 cm; **zero pixels fora da margem tolerada** nas
  oito vistas. [Câmera baixa](margem-teste.png).
- Dois testes do núcleo verificam dissipação de espuma sem perda de
  volume, poça profunda parada e uma queda com nascente por 120 s.
- Sequência por `cdpshot.mjs`: [quadro 0](cdpshot-00.png),
  [quadro 1](cdpshot-01.png), [quadro 2](cdpshot-02.png), todos a 60 fps
  e sem erros no console; [log](cdpshot.log).

Continua sendo simulação superficial limitada à pintura, com espelho
planar nas regiões calmas. Ainda não resolve água volumétrica, respingos,
flutuação ou múltiplas superfícies refletoras em alturas diferentes no
mesmo corpo. A aprovação estética final continua com o dono. Tauri não
foi executado nesta etapa.
