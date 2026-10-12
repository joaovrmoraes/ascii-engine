# Sessão de composição gravada no OBS — 11/10/2026

Gravação real da janela do editor pelo OBS nativo, usando o portal PipeWire
do Hyprland. Editor em tela cheia na área 5 e OBS na área 6. Cliques, arrastos
e ajustes pela interface, com cursor visível. Perfil separado do mapa do dono
aberto no Orca. Nenhuma alteração no código da engine nesta etapa.

## Arquivos entregues

- [Vídeo MP4](/home/jonny/Videos/ASCII-Engine-2026-10-11/ASCII-Engine-criacao-completa.mp4):
  310,6 segundos, 2560×1080, 30 fps, H.264, sem áudio.
- [Mapa editável](/home/jonny/Videos/ASCII-Engine-2026-10-11/Lago-das-Brasas.ascii.json).
- [Exportação Pomorog](/home/jonny/Videos/ASCII-Engine-2026-10-11/Lago-das-Brasas.pomorog.json).

O master `2026-10-11 22-23-26.mkv` está na mesma pasta. Vídeos ficam fora do
repositório. Tentativas com falhas de captura foram separadas em `bastidores/`.

## Capítulos

| Início | Conteúdo |
| --- | --- |
| 00:00 | Novo mapa, elevação e suavização do terreno |
| 00:43 | Pincel de água e caminho |
| 01:19 | Árvores, pedras, ruína e tronco |
| 02:16 | Estúdio de efeito: chama, camadas, luz e salvar nos Assets |
| 03:11 | Estúdio de atmosfera: cor, iluminação, névoa e salvar nos Assets |
| 04:04 | Água, câmera com miniatura, salvar, exportar e Prévia |

## Evidências do próprio vídeo

Quadros extraídos do MP4 final por FFmpeg, sem substituição por screenshots:

- [Terreno](terreno.png), segundo 35.
- [Estúdio de efeito e luz](efeito.png), segundo 163.
- [Estúdio de atmosfera](atmosfera.png), segundo 222.
- [Câmera](camera.png), segundo 285.
- [Prévia final](previa-final.png), segundo 306.

## Verificação

- [Metadados do vídeo](validacao-video.json) e
  [resultado da decodificação integral](validacao-video.txt): sem erros.
- [Leitura do mapa exportado](validacao-mapa.json) pelo parser da engine:
  terreno de 32 m, 10 objetos, uma água, um efeito, uma atmosfera e uma câmera
  inicial válida. Mapa e exportação foram baixados pelos botões da interface.
- [pnpm check](pnpm-check.log): 79 testes, tipos e build passaram. Avisos de
  chunks grandes e anotações do Zod permanecem.

A sessão cobre a composição pedida, sem narração. Não verifica consumo do
arquivo pelo Pomorog nem demonstra todas as ferramentas avançadas da engine.
OBS foi encerrado normalmente ao terminar e o foco voltou para o Orca.
