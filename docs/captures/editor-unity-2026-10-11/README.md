# Espaço de trabalho inspirado na Unity — 11/10/2026

Pedido do dono: simplificar a interface e a colocação de itens, usando a
organização visual da Unity como referência. O acabamento ASCII da cena
continua sendo o do Pomorog.

- [Antes](../autoria-2026-10-11/mapa-reaberto.png): lista/inspetor juntos
  à esquerda, ferramentas sobre a cena e colocação por formulário.
- [Espaço de trabalho](espaco-de-trabalho.png): captura com `cdpshot.mjs`,
  Chromium com GPU, 1600 × 757, mapa inicial, fogueira selecionada e zoom
  de inspeção 0,65. Canvas pronto, três objetos, inspetor e modo mover
  confirmados antes da captura.
- [Rotação com mouse](rotacao-mouse.png): 1600 × 857, gerada pelo teste
  `verify:authoring` depois de arrastar uma caixa da biblioteca e girá-la
  pelo anel Y. O inspetor mostra a rotação resultante.
- [Orca Browser](orca-editor.png): página completa, 2148 × 919, captura
  real pelo comando `orca-ide screenshot`. Árvore selecionada, setas de
  movimento e inspetor visíveis. Conferidos DOM e acessibilidade. Nesta
  etapa a captura da página inteira funcionou, ao contrário da etapa
  anterior de autoria.

## Verificação

`pnpm check`: tipos, 41 testes e build passaram. Aviso de bundle Vite acima
de 500 kB permanece. `pnpm verify:authoring /tmp/unity-editor-final` passou:
arrastar nativo da biblioteca, mover e escalar pelo eixo X, girar pelo
anel Y, sincronizar inspetor, desfazer uma transformação inteira, prévia,
persistência, importação GLTF/GLB, exportação, pincéis e restauração do
rascunho. Nenhuma exceção não tratada na página.

Comparações contra a base da engine, sem atualizar baselines:

| Vista | RMSE final | Limite |
| --- | ---: | ---: |
| Referência | 0,0000 | 0,04 |
| Floresta | 0,0096 | 0,04 |
| Pântano | 0,1138 | 0,20 |
| Neve | 0,0041 | 0,04 |
| Mina | 0,0158 | 0,04 |
| Catedral | 0,0059 | 0,04 |

A primeira execução de `pnpm compare`, concorrente com o teste de
interação, falhou apenas na floresta (0,1352). `pnpm compare floresta`,
reexecutado isoladamente, passou com 0,0096 sem alteração de código ou
baseline. Há sensibilidade temporal no teste; a causa da oscilação não foi
isolada. Estes números não são aprovação de equivalência ao Pomorog.

Painéis ainda fixos, sem seleção múltipla/agrupamento. App nativo Tauri e
mobile não foram testados nesta etapa.

Referência de organização consultada: [janelas do editor da Unity](https://docs.unity.com/en-us/engine/7000.0/manual/unity-editor/editor-windows-views-reference).
