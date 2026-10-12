# Margem Viva — gravação próxima

Pedido: refazer a filmagem com menos distância de câmera para mostrar a
movimentação da grama, água e efeitos. Captura iniciada em 11/10/2026;
edição concluída em 12/10/2026.

OBS nativo 32.2.2, portal PipeWire da janela do editor, 2560×1080/30 fps,
I444, Rec.709 parcial e x264 CRF 16. Editor em tela cheia no espaço 5,
OBS no 6, Orca preservado no 3. Nenhuma configuração pessoal persistente
do OBS/Hyprland foi alterada. OBS e navegador de demonstração encerrados
normalmente após a captura. O mapa do dono no Orca não foi substituído.

A criação foi feita pelos controles visíveis: mapa, pincéis de relevo/água/
chão, biblioteca, estúdio de efeito com luz e camadas, estúdio de atmosfera,
Assets, câmera com miniatura, salvar, exportar e Prévia. A API da engine
foi usada somente para consultar estado/projetar coordenadas, sem montar
ou alterar a cena. Mouse real pelo Hyprland/ydotool; texto/roda/teclas por
CDP no Chromium externo. O provedor Computer Use do Orca continuou
indisponível por dependência de Python/AT-SPI.

## Enquadramento e movimento

- Zoom de trabalho 1,0–1,9, com deslocamento para a área sendo editada.
- Vista baixa e próxima da grama; pausas de 9 s para vento, fogo e água.
- Câmera final com altura enquadrada de **6,5 m**, contra **15 m** antes;
  Prévia final parada por 14 s. Sem mudança no código visual da engine.
- Capturas abaixo foram **extraídas do MP4 do OBS**, não de uma cena refeita:
  [grama](grama.png), [fogo](fogo.png), [água](agua.png), [prévia](previa.png).
- `movimento.json`: quatro trechos de 3 s, 90 quadros cada, recortes dentro
  do canvas (sem contador de fps). Todos os 90 hashes diferem em cada trecho;
  nenhum par consecutivo idêntico. Indica ausência de congelamento nesses
  trechos; não substitui inspeção visual de toda a filmagem.
- `obs-final.jsonl`: 30 fps, zero quadros perdidos na renderização e na saída.
- `marcas.jsonl`: marcas de tempo durante a operação; pausas do OBS excluídas.
- `validacao-mapa.json`: `parseScene` aceitou Margem Viva, 10 objetos,
  uma água, um efeito salvo, uma atmosfera salva e uma câmera inicial.

## Cor

`cor-teste-444.json` compara a distribuição de cor do screenshot com um
quadro de teste do OBS, na mesma vista, mas em instantes diferentes.
Saturação média HSV dos pixels claros: 0,389 na tela e 0,330 na captura.
O cinza da interface é idêntico: RGB 48/50/56. A captura em 4:4:4 preserva
melhor a cor dos glifos; ainda há compressão e conversão RGB/YUV.
A nova edição usa saturação 1,0, sem a compensação 1,4× da captura antiga.
A versão compatível em 4:2:0 continua sujeita à perda de cor em traços finos.

## Entrega e limites

Arquivos grandes fora do Git:
`/home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11/`.

- Master OBS MKV e remux MP4 sem áudio.
- `Margem-Viva.ascii.json` e `Margem-Viva.pomorog.json`.
- Edição Remotion em `edicao/`: filme completo, master 4:4:4, seis partes
  compatíveis e `index.html` para navegação local.
- 13149 quadros editados, **7min18,3**, 2560×1440/30 fps. Água, vento, fogo
  e câmera em velocidade normal. Aceleração 1,15×–1,30× nas outras etapas,
  indicada no rodapé. A captura entra sem redução, com faixas fora da UI.
- Filmagem anterior preservada. Não há áudio/narração, importação de modelo
  externo nem teste da exportação dentro do Pomorog nesta sessão.

`pnpm check`: 79 testes, tipos e build passaram. Tipos do projeto Remotion
passaram. Permanecem os avisos conhecidos de tamanho de chunk e Zod.
A evidência é do Chromium externo capturado pelo OBS; o editor embutido
no Orca não foi usado para esta filmagem.

O filme compatível e as seis partes passaram na contagem exata de quadros
e na decodificação integral por FFmpeg com erro fatal habilitado:
[validacao-edicao.json](validacao-edicao.json).

Quadros da edição: [abertura](abertura-editada.png),
[grama em velocidade normal](grama-editada.png) e
[efeito na margem](efeito-editado.png).

O master 4:4:4 também passou na decodificação integral sem erros
([registro](validacao-master.txt)). A galeria local aponta para os sete MP4
compatíveis, o master e o mapa editável.
