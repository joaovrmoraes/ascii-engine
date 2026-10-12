# Edição da sessão no Remotion

Projeto independente da engine, com Remotion **4.0.534** e React. Usa a
gravação original do OBS como mídia: nenhuma cena é reconstruída para o vídeo.

## Entrega

Saída padrão: `/home/jonny/Videos/ASCII-Engine-2026-10-11/edicao/`.

- `index.html`: player local com seleção das seis partes.
- `ASCII-Engine-editado.mp4`: filme completo, H.264 4:2:0 compatível.
- `ASCII-Engine-editado-master-444.mp4`: master com cor 4:4:4.
- `partes/`: terreno, água, objetos, efeito/luz, atmosfera e câmera/exportação.
- `masters/`: intermediários; `previas/`: imagens do Remotion;
  `diagnostico/`: comparação e ensaio controlado da cor.

2560×1440, 30 fps, aproximadamente **4min35**, sem áudio. A gravação de
2560×1080 entra sem redução: as faixas editoriais ocupam o espaço acima e
abaixo dela. Cartelas identificam as etapas; textos explicam a ação em curso.
Aceleração de 1,15× a 1,40×, indicada no rodapé. Abertura e encerramento usam
um quadro da própria gravação, recortado para tirar os painéis do editor.

## Reproduzir

Requer Node com execução de TypeScript nativa (22.18+), npm, Chromium,
FFmpeg e FFprobe. As dependências são locais e não entram no workspace pnpm.

```bash
cd tools/video-edit
npm ci
npm run prepare-media
npm run check
npm run graphics
npm run compose
npm run finalize
```

`ASCII_VIDEO_SOURCE` aponta para a pasta da gravação;
`ASCII_VIDEO_OUTPUT` escolhe a saída; `REMOTION_BROWSER` escolhe o Chromium.
Esses caminhos podem ser absolutos e conter espaços.

```bash
npm run studio
```

Studio em `http://localhost:3456`, sem abrir janela automaticamente.
Composição `Completo` e seis composições independentes para ajustar a edição.
`src/edit.ts` centraliza cortes, velocidades, textos e duração. `Video.tsx`
contém a direção gráfica e as animações, calculadas por quadro.

O fluxo de exportação econômico renderiza cartelas, abertura, encerramento e
faixas pelo Remotion. FFmpeg combina as faixas transparentes com a gravação,
aplica a correção e concatena os trechos. As entradas de texto do rodapé
trocam diretamente nesse fluxo; a prévia integral no Studio também anima
a entrada dos textos. Cartelas e abertura mantêm as animações do Remotion.

`npm run render` é a alternativa integral pelo navegador, mais cara em RAM
e tempo nesta máquina. `npm run stills` gera cinco imagens para inspeção.
As sequências temporárias ficam em `.cache/` no disco, fora do tmpfs.

## Cor: causa, correção e limite

O OBS usou NV12/4:2:0 e faixa parcial Rec.709. O arquivo está identificado
corretamente como `yuv420p`, `tv`, `bt709`. A amostra cinza da interface ficou
em RGB `[48,49,56]` no vídeo, contra `[48,50,56]` na captura: não há evidência
de um erro global de faixa que justifique levantar pretos ou alterar gamma.

O ensaio `npm run diagnose-color` codifica o **mesmo PNG** em H.264 CRF 0,
mantendo a matriz/faixa e variando somente 4:2:0/4:4:4. Na região da cena:

| Medida | Original | 4:2:0 | 4:4:4 |
| --- | ---: | ---: | ---: |
| Saturação HSV média dos pixels com máximo RGB ≥40 | 0,417 | 0,274 | 0,417 |
| Erro RMS RGB (0–255), contra o original | — | 5,198 | 0,756 |

A gravação real também sofreu compressão com perdas e contém animação em
outro instante; sua distribuição é comparável, mas seu RMSE contra esse
PNG não seria uma comparação controlada.

A edição compensa a saturação em **1,4×**, preservando brilho/gamma e preto.
Não é recuperação exata das cores descartadas. O master 4:4:4 evita outra
subamostragem; os MP4 compatíveis voltam a 4:2:0, com alguma perda residual
nos glifos muito finos. Para futuras capturas ASCII, testar RGB/I444 na
origem é mais eficaz do que compensar depois. Nenhuma configuração do OBS
do dono foi alterada nesta edição.

Conversão e saída explícitas em Rec.709; quadros PNG no Remotion conforme
a [documentação de cor do renderer](https://www.remotion.dev/docs/renderer/render-media#colorspace).
Os ajustes de saturação usam uma matriz RGB pelo
[colorchannelmixer do FFmpeg](https://ffmpeg.org/ffmpeg-filters.html#colorchannelmixer),
com conversões explícitas de/para BT.709. O filtro `eq` em YUV produziu um
pequeno desvio de matiz no teste da interface e foi substituído antes da entrega.

## Validação

`finalize.mjs` verifica todos os MP4 entregues com decodificação integral e
compara a contagem de quadros com a composição. `validacao-edicao.json`
guarda duração, codec, tamanho e resultado; `validacao-master.txt` guarda
a conferência do master. Não publicar nem substituir a gravação original.
