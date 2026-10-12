# Edição da gravação em seis partes

Pedido do dono: editar a sessão com Remotion e investigar a cor desbotada.
O material de origem é a gravação real do OBS da etapa anterior.

## Entrega

Pasta: `/home/jonny/Videos/ASCII-Engine-2026-10-11/edicao/`.

- `index.html`: escolher o filme ou uma das seis partes.
- `ASCII-Engine-editado.mp4`: filme completo compatível.
- `ASCII-Engine-editado-master-444.mp4`: master sem nova subamostragem de cor.
- `partes/`: seis arquivos MP4 independentes.
- Projeto reproduzível: [tools/video-edit](../../../tools/video-edit/README.md).

Edição 2560×1440 a 30 fps. Mantém a gravação 2560×1080 em tamanho nativo,
com títulos e explicações acima/abaixo dos controles. Abertura, seis cartelas,
rodapés que acompanham a ação e encerramento. Velocidade de 1,15× a 1,40×,
indicada no rodapé; sem áudio. Remotion gera a direção gráfica, animações e
faixas; FFmpeg faz a composição final para reduzir RAM e tempo de exportação.
Nenhuma cena foi alterada para a edição.

## Cor

[Ensaio controlado](analise-cor.json): a mesma captura PNG, codificada em
H.264 CRF 0, perdeu saturação em 4:2:0; 4:4:4 preservou a distribuição de cor.
Na região amostrada, saturação HSV média 0,417 → 0,274 em 4:2:0, contra 0,417
em 4:4:4. Os cinzas da interface gravada quase coincidem com a captura:
RGB `[48,49,56]` contra `[48,50,56]`. Faixa parcial/Rec.709 estão corretas.

Compensação editorial de saturação 1,4×, em RGB, sem alterar brilho/gamma.
Conversões explícitas de/para BT.709. Na validação, `eq` em YUV desviou
ligeiramente o matiz; foi substituído por matriz RGB antes da entrega.
Não recupera as cores já descartadas. O master 4:4:4 conserva melhor as
letras; a versão compatível 4:2:0 ainda tem perda residual nos traços finos.

## Evidências

- [Abertura](abertura.png): quadro da abertura animada no Remotion.
- [Efeito](efeito.png): quadro do vídeo exportado.
- [Câmera](camera.png): quadro do vídeo exportado.
- [Cor antes/depois](comparacao-cor.png): recorte do lago na gravação e no master editado.
- [Checagem da engine](pnpm-check.log): 79 testes, tipos e build passaram.
- [Verificação dos MP4](validacao-edicao.json): contagem de quadros e decodificação completa.
- [Master 4:4:4](validacao-master.txt): decodificação integral sem erros.
- [Capítulos e durações](capitulos-editados.json): 8236 quadros, 274,53 s no total.

Validação visual feita nas composições do Remotion e em quadros extraídos dos
MP4. Não foi necessária outra captura do editor por Orca/cdpshot: não houve
alteração na engine. Navegador de renderização sem janela; nenhuma mudança
no mosaico de janelas do Hyprland ou na configuração pessoal do OBS.
