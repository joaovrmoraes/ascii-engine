# Edição da sessão no Remotion

Projeto independente da engine, com Remotion **4.0.534** e React. Usa a
filmagem do OBS como mídia; os mapas são criados pelos controles do editor.

## Tomada atual: Margem Viva

Saída padrão: `/home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11/edicao/`.

- `index.html`: player local com seis partes e filme completo.
- `ASCII-Engine-editado-master-444.mp4`: master que preserva melhor a cor das letras.
- `ASCII-Engine-editado.mp4`: versão H.264 4:2:0 para compatibilidade.
- `partes/`: terreno, água/vento, objetos, efeito/luz, atmosfera e câmera/exportação.
- `masters/`: intermediários; `previas/`: gráficos e capturas do Remotion.

**7min18,3**, 2560×1440, 30 fps, sem áudio. A captura 2560×1080 entra sem
redução, com títulos acima e abaixo. Terreno, objetos e atmosfera usam
1,15×–1,30×; água, grama, fogo e câmera ficam em velocidade normal.
A câmera final enquadra 6,5 m de altura, contra 15 m na tomada anterior.

A captura nova usa **I444 desde o OBS**, Rec.709 parcial, x264 CRF 16.
Não há aumento editorial de saturação (`SATURATION = 1`). A conversão para
4:2:0 ainda pode reduzir a cor dos traços finos; para avaliar a cor, prefira
o master em um player com suporte a H.264 4:4:4. Compressão e conversão de
RGB para YUV continuam tendo perdas; isso não é uma gravação sem perdas.

A filmagem anterior, **Lago das Brasas**, e suas entregas permanecem em
`/home/jonny/Videos/ASCII-Engine-2026-10-11/`. Sua linha do tempo está em
`src/editions/lago-das-brasas.ts`. Aquela captura era NV12/4:2:0 e recebeu
compensação de saturação em 1,4×; a compensação não deve ser aplicada à nova.
`npm run diagnose-color` mantém o ensaio histórico da captura anterior em
NV12; o teste da nova fonte está em `cor-teste-444.json`, na pasta da tomada.

## Reproduzir

Requer Node com execução nativa de TypeScript (22.18+), npm, Chromium,
FFmpeg e FFprobe. As dependências são locais, fora do workspace pnpm.

```bash
cd tools/video-edit
npm ci
npm run prepare-media
npm run check
npm run graphics
npm run compose
npm run finalize
```

`src/edit.ts` contém cortes, velocidades, notas, nome da cena, pasta de
origem e recorte do pôster. `ASCII_VIDEO_SOURCE` substitui a pasta de origem;
`ASCII_VIDEO_OUTPUT` substitui a saída; `REMOTION_BROWSER` escolhe o Chromium.
A pasta de origem deve conter `ASCII-Engine-criacao-completa.mp4`, 2560×1080,
30 fps. `prepare-media` copia a filmagem para `public/` e extrai o pôster.

Para reproduzir a edição antiga, preserve a linha do tempo atual e copie
o conteúdo de `src/editions/lago-das-brasas.ts` para `src/edit.ts`. Os dois conjuntos
incluem metadados de mídia e cor. A descrição da galeria em `finalize.mjs`
refere-se à tomada nova; ajuste-a ao reexportar a edição antiga.

```bash
npm run studio
```

Studio em `http://localhost:3456`, sem abrir janela automaticamente.
Composição `Completo` e seis composições independentes. `Video.tsx` contém
os títulos e animações, calculados por quadro.

Remotion gera cartelas, abertura, encerramento e faixas transparentes.
FFmpeg compõe essas faixas com a captura original e concatena os trechos.
As notas do rodapé trocam diretamente nesse fluxo; o Studio também anima
sua entrada. Abertura e cartelas mantêm as animações em ambas as formas.

`npm run render` é a alternativa integral pelo navegador, mais cara em RAM
e tempo. Aceita `-- --only=Abertura`, por exemplo. `npm run stills` gera cinco
imagens. Temporários ficam em `.cache/` no disco; vídeos e cache não entram
no Git. `finalize` valida contagem e decodificação dos sete MP4 compatíveis
e decodifica o master completo. O áudio silencioso do OBS é removido.
