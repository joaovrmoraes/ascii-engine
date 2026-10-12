# Editor visual — terrenos, mapas e itens

O editor agora abre diretamente em **http://localhost:1440** (`pnpm dev`).
Esta entrega fecha o fluxo de criar → editar → salvar → reabrir → exportar
conteúdo visual. Regras e interface do jogo continuam no Pomorog.

## Onde fica cada coisa

O espaço de trabalho segue a organização de editores como a Unity:

- **Hierarquia**, à esquerda: objetos que já estão no mapa, com busca.
- **Cena**, no centro: selecionar, posicionar e transformar com o mouse.
- **Inspetor**, à direita: nome, transformação e aparência do objeto;
  abas separadas para **Terreno** e **Ambiente**.
- **Projeto / Biblioteca**, embaixo: objetos disponíveis, separados em
  Natureza, Construções, Formas, Efeitos, Atmosferas e Importados, com busca.
- **Arquivo**, no topo: novo mapa/item, abrir, salvar e exportar.
  **Exibição**, acima da cena, guarda câmera e ajustes globais.

Para colocar algo, **arraste um objeto da biblioteca até o chão e solte**.
Ele entra selecionado, com as setas para mover. Também é possível clicar
no objeto da biblioteca e depois no chão; Shift permite colocar várias
cópias e Esc cancela a ferramenta.

Com o objeto selecionado, use **W** para mover, **E** para girar e **R**
para escalar; arraste os eixos ou anéis coloridos. Os valores XYZ também
podem ser digitados no inspetor. **Global/Local** escolhe a orientação dos
eixos; **Encaixar** usa passos de 0,5 m, 15° e 0,1 na escala. Um arraste
inteiro conta como uma ação de desfazer. Os controles de transformação
valem para objetos; água continua sendo ajustada pelos campos do inspetor.

**Prévia** usa a câmera inicial salva (ou a vista atual, se não houver uma),
oculta os controles de seleção na cena e desativa os painéis
de edição até clicar em **Voltar à edição**. O botão ao lado pausa as
animações. Esta prévia é visual, sem regras de jogo.

## Organizar os painéis

- Arraste o **título ou a alça ⠿** de Hierarquia, Inspetor ou Projeto para
  soltar e mover o painel pela janela.
- Ao chegar às bordas esquerda, direita ou inferior, uma faixa azul mostra
  onde o painel vai encaixar. Solte ali. O painel que ocupava esse espaço
  troca de lugar ou fica flutuante, sem perder o conteúdo.
- Arraste a **divisória junto à cena** para redimensionar um painel
  encaixado. Num painel flutuante, use o **canto inferior direito**.
- **Encaixar** ou duplo clique no título devolve o painel à sua borda
  original. **Arquivo → Restaurar painéis** recupera a disposição inicial.

Tamanho e posição ficam salvos neste navegador, separados do arquivo do
mapa. Os painéis ficam dentro da janela do editor; não são janelas nativas
separadas. A barra superior e a cena permanecem na estrutura principal.

## Criar um mapa

1. **Arquivo → Novo mapa** abre um terreno de 32 × 32 m com árvore, pedra e fogueira.
2. Na aba **Terreno** do inspetor, escolha elevar, baixar, suavizar, aplainar ou pintar.
   Arraste sobre o chão; cada traço é uma ação de desfazer. Shift inverte
   elevar/baixar. Aplainar mantém a altura do início do traço.
3. **Água** é um pincel contínuo: arraste para desenhar canais ou lagos;
   Shift apaga só água. **Seguir relevo** acompanha a encosta sem achatá-la,
   com ondulação descendo. **Nível plano (lago)** escava o leito. Selecione
   a água na hierarquia para ajustar contorno, nível, fluxo e reflexo.
   Para água antiga, **Adaptar ao relevo** converte seu contorno em máscara
   sobre o terreno; a conversão é explícita e pode ser desfeita.
4. Clique no objeto da biblioteca para ver o modelo real na mão, ou
   arraste-o para o chão. W/E/R fixam a prévia para ajustar o gizmo; Enter
   coloca a transformação inteira, Esc cancela. A biblioteca inclui árvore,
   pedras, caixa, ponte, ruína, tronco, formas básicas, fogueira e efeitos.
5. A lista à esquerda seleciona o objeto inteiro. O inspetor permite
   renomear, ocultar, mover, girar, escalar, duplicar e excluir.
6. O primeiro clique no mapa seleciona o objeto. Clique novamente na mesma
   parte, ou escolha-a na lista **parte** em **Aparência ASCII**, para ajustar
   técnica, família de letras e tamanho. O escopo pode ser instância, tipo
   ou global; todas essas camadas entram no arquivo.
7. **Ambiente → Clima** seleciona chuva/neve. **Estúdio → Atmosfera**
   abre a tela dedicada de iluminação, cor e névoa. Os ajustes ficam no mapa;
   não convertem seus objetos ou terreno automaticamente em outro bioma.

**Orbitar (O)** permite girar em 3D arrastando com o botão esquerdo,
incluindo inclinar para cima/baixo. **Alt + arraste esquerdo** e
**Shift + botão do meio** também orbitam. **Isométrica** restaura o ângulo
original. Botão direito/meio, ferramenta
**Q** ou Shift + arraste em modo de seleção deslocam o centro; roda
aproxima/afasta. **F** foca o objeto. **Ctrl D** duplica,
**Delete** exclui, **Ctrl Z** desfaz e **Ctrl Shift Z** refaz. **Ctrl S**
baixa o documento. Os atalhos não interceptam a edição de campos de texto.
Para deslocar a câmera não é preciso Ctrl: segure o botão direito e
arraste. O mapa acompanha o mouse na mesma direção e distância, incluindo
o movimento vertical, independentemente do giro ou zoom.

Os objetos mantêm a altura definida no inspetor quando o terreno muda.
Ao colocá-los, a altura inicial vem do chão. A grama é regerada ao terminar
um traço. A máscara de água é local ao seu contorno.

## Água: escoamento, reflexos e interação

Selecione **Água** na hierarquia. **Simular água** ativa a simulação de
água rasa: profundidade por célula, fluxo entre vizinhos, gravidade e
resistência. A água desce e acumula nas partes baixas da área pintada.
**Lâmina inicial** define a quantidade inicial; **Vazão na nascente** repõe
água nas extremidades altas. Com vazão zero, o domínio conserva volume.
**Ondulação** controla pequenas ondas de superfície; **Testar ondulação**
produz um impacto. Objetos movidos dentro da água e atores informados por
`engine.setActors` geram ondas e rastros.

O reflexo de um objeto depende do ângulo da câmera e de sua posição em
relação à margem. **Orbitar** permite conferir de todos os lados. Ele não
fica projetado permanentemente embaixo do objeto. O brilho do luar depende
da câmera, da normal da superfície e da luz principal em
**Estúdio → Atmosfera → Rotação/Altura da luz**. Cor e intensidade dessa
luz também afetam o brilho da água.

A simulação usa uma grade de altura limitada à área pintada, com até
129 × 129 células. Não é um fluido volumétrico: expansão automática para
fora da pintura, respingos balísticos, água sob saliências e flutuação de
corpos rígidos ainda não existem. Quedas acompanham o relevo; não há cortina
livre separada do terreno. Partes calmas têm reflexo planar de objetos;
as encostas recebem o reflexo da luz, evitando copiar um espelho horizontal
sobre a queda. Partículas do passe separado ainda não entram no espelho.

O arquivo salva `waters[].physics` e a superfície inicial; as ondas e o
escoamento reiniciam ao abrir. A simulação não altera o terreno nem grava
cada quadro no histórico. Pausar congela o movimento.

## Criar e reutilizar itens

**Arquivo → Novo item** abre um documento sem terreno. Monte-o com formas, prefabs
ou modelos importados, usando posição/rotação/escala. **Salvar arquivo**
salva a composição toda. **Exportar este item** salva só o objeto
selecionado, com origem reposicionada para `[0, 0, 0]`.

Em outro documento, **Inserir item salvo** acrescenta os objetos do arquivo
na posição da câmera e incorpora seus modelos/estilos. A composição entra
como objetos individuais: agrupamento, parentesco e edição vinculada de
prefabs ainda não existem. **Abrir** substitui o documento inteiro, com a
possibilidade de desfazer.

## Importar modelos

Use **Importar modelo** no topo da biblioteca, ou arraste arquivos sobre o editor:

- GLB com recursos incorporados;
- GLTF junto com seus `.bin` e imagens. Selecione todos de uma vez. Recursos
  ausentes geram uma mensagem; a cena aberta é preservada.
- Limite atual: 32 MB por arquivo de modelo. A biblioteca e o JSON final
  podem ser maiores, pois fontes são incorporadas em data URIs.
- Nós nomeados viram partes. As declarações `glyph`, `glyph_surface` e
  `glyph_size` do Blender continuam aceitas.
- Cada instância tem geometria, material e mixer próprios. O inspetor
  seleciona um clipe ou **Animação parada**. O arquivo salva o clipe, não o
  instante da reprodução; animações e efeitos reiniciam ao abrir.

Não há dependência do caminho do arquivo na máquina após a importação.
Texturas externas em GLB e formatos que precisam de decodificadores extras
não foram validados; prefira GLB incorporado ou GLTF com acompanhantes.

## Câmeras de composição

**Criar câmera**, na barra superior, captura o enquadramento atual e cria
um objeto na hierarquia. Se for a primeira câmera, ela se torna a câmera
inicial do documento. Ao selecioná-la, uma **prévia pequena no canto**
mostra o enquadramento ao vivo, inclusive enquanto arrasta o gizmo.
**Ampliar** abre essa vista na cena. Selecione-a para editar:

- **Posição / Rotação** no inspetor, ou **W / E** com o gizmo na cena.
- **Altura enquadrada** aproxima ou afasta a composição ortográfica.
- **Formato** escolhe 16:9, 4:3, 1:1 ou 9:16, sem esticar a imagem.
- **Ver pela câmera** mostra esse enquadramento. **Voltar à navegação**
  retorna à câmera livre do editor; o enquadramento salvo não muda.
- **Capturar enquadramento atual** substitui a pose pela vista do editor.
- **Apontar para o centro da vista** orienta a câmera para o foco atual.
- **Usar como câmera inicial** escolhe a vista de **Prévia**, player e exportação.
- **Duplicar câmera** permite testar outro plano sem perder o anterior.

Câmeras podem ser removidas e desfeitas/refeitas. Nome, pose, tamanho e
proporção acompanham salvar, reabrir, rascunho local e exportação. O ícone
e o volume de visão são auxiliares do editor; não aparecem no jogo.
A projeção atual é ortográfica, coerente com o visual do Pomorog;
não há câmera em perspectiva nem animação de câmera por keyframes ainda.

## Criar efeitos

1. Clique em **Estúdio → Efeitos**, ou em **Criar efeito** na barra superior.
   A tela dedicada mostra somente o efeito num espaço vazio. O mapa fica
   pausado; **Voltar à cena** restaura a vista e os painéis.
2. Escolha **Fogo, Fumaça, Faíscas, Magia, Explosão ou Raio**, ou use
   **Começar do zero**. O seletor também lista bases do Pomorog e efeitos
   salvos. As bases são copiadas, preservando as receitas originais.
3. Dê um nome e use **Essencial** para ajustar a camada selecionada:
   quantidade, tamanho das letras, tempo de vida, subida/queda, espalhamento
   e cor, conforme o tipo. As camadas podem ser adicionadas, duplicadas ou
   excluídas. **Avançado** abre forma, velocidade XYZ, gravidade, aparência
   e JSON (curvas, calor e flipbooks).
   Dê nomes às camadas e posicione sua **Origem X/Y/Z**, ou arraste o
   gizmo na prévia. **W** mostra o gizmo, **Q** o oculta e **F** enquadra.
   **Zerar posição** recoloca a camada na origem; o mapa não é alterado.
4. A prévia atualiza ao editar. **Reiniciar, Pausar, Parar, Enquadrar** e
   velocidade ficam abaixo da prévia. Arrastar gira; botão direito move;
   roda aproxima. Efeitos de disparo repetem automaticamente só na prévia.
5. **Salvar nos Assets** adiciona o efeito à categoria **Efeitos**.
   **Ver nos Assets** abre essa categoria. **Salvar e colocar na cena**
   ativa a colocação: clique no chão para criar uma instância.
   Duplo clique no asset salvo reabre a receita; salvar atualiza esse asset.
6. **Importar ou baixar arquivo** contém **Baixar efeito** (`.effect.json`)
   e **Abrir efeito**. Depois de importar, salve para adicionar aos Assets.

**Ctrl S**, dentro de cada Studio, salva nos Assets (efeito ou atmosfera).
Os botões ↶/↷ e Ctrl Z/Ctrl Shift Z desfazem/refazem o rascunho do efeito.
Um arrasto inteiro do gizmo conta como uma ação. O histórico do efeito é
separado do histórico da cena. Salvar incorpora as posições à receita;
**Salvar e colocar na cena** permite mover a composição inteira no mapa.

**Emitir luz** configura a luz pontual que ilumina objetos e grama ao
colocar o efeito no mapa. O espaço vazio não contém superfícies para
mostrar essa iluminação.

Os efeitos salvos acompanham salvar, reabrir, desfazer/refazer, exportar o
mapa e exportar/inserir um item, no campo `SceneDoc.effects`. Uma instância
segue a posição do objeto; orientação e escala ainda não transformam toda
a simulação de partículas. Efeitos sem repetição tocam uma vez na cena;
a repetição automática do estúdio não altera essa configuração.

## Criar atmosferas

No **Estúdio → Atmosfera**, comece com luar, entardecer ou brasas e ajuste
exposição, cor das letras, fundo, luz principal (direção/cor/intensidade),
sombra, luz ambiente, preenchimento e névoa. A prévia usa o mapa aberto.
Ctrl Z desfaz as alterações da cena.

Dê um nome e clique em **Salvar nos Assets**. O preset aparece em
**Assets → Atmosferas**; **Ver nos Assets** abre essa categoria.
Um clique no asset aplica a iluminação; duplo clique aplica e abre o
estúdio para editar. Salvar atualiza o mesmo preset; **Salvar cópia** cria
outro. Os presets ficam em `SceneDoc.atmospheres` e acompanham o arquivo
do projeto, rascunho local, desfazer/refazer e exportação. A iluminação
atual continua em `SceneDoc.style`.

**Baixar atmosfera** e **Abrir atmosfera**, dentro de **Importar ou baixar
arquivo**, transportam o preset em `.atmosphere.json`. Depois de importar,
use **Salvar nos Assets**. A biblioteca pertence ao documento aberto;
não é uma biblioteca global compartilhada entre projetos.

## Criar com IA

A API e o MCP permitem ler e editar todo o documento visual, importar
modelos, criar efeitos, esculpir/pintar, controlar atmosfera e exportar.
Uma prévia da IA mostra **Aplicar/Descartar**; um lote aceito é uma ação
de desfazer. A IA também pode aplicar diretamente. Cada aba tem uma sessão
e cada edição tem uma revisão para impedir sobrescrita de alterações novas.
Veja [conexão, ferramentas e exemplos](api-mcp.md).

## Salvar e exportar para o Pomorog

Há um rascunho automático em **IndexedDB**, por navegador/origem. O topo
informa sucesso ou falha. O histórico dura a sessão, com até 30 ações e
64 MB de snapshots; documentos grandes reduzem a quantidade de ações.
O arquivo baixado é o meio de levar o trabalho entre máquinas.

**Salvar arquivo** (`.ascii.json`) e **Exportar para Pomorog**
(`.pomorog.json`) contêm o mesmo `SceneDoc` versão 1: nome, terreno pintado,
água, grama, ambiente, estilos, instâncias com identidades/sementes,
transformações, assets e receitas de efeitos incorporados. Ambos podem ser abertos neste editor.

O Pomorog ainda precisa de um importador. A exportação não altera nenhum
checkout do jogo. Prefabs da biblioteca são receitas identificadas por
nome, não GLBs gerados: o futuro consumidor precisará de
`apps/editor/src/scene/prefabs.ts` e `pomorogKit.ts`, ou de receitas
compatíveis. Modelos importados estão incorporados no documento.

O contrato de consumo é:

```ts
const doc = parseScene(json)
const assets = await loadSceneAssets(doc)
const scene = buildScene(engine, doc, { ...prefabsDoJogo, ...assets.library })
// No loop visual: scene.update(time); engine.render(dt).
// Ao sair: scene.dispose(); assets.dispose().
```

O núcleo não importa a biblioteca do editor nem regras do Pomorog.
`parseScene` valida antes de alocar; `buildScene` limpa recursos se uma
construção falhar. No editor, o documento anterior só é descartado após a
construção da nova cena.

Para uma prévia web independente, com runtime e biblioteca incluídos:

```bash
pnpm export -- --title "Meu mapa" --scene docs/examples/mapa-prova.pomorog.json --out exports/meu-mapa
python -m http.server 1441 --directory exports/meu-mapa/web
```

Essa prévia apresenta o visual sem os painéis de autoria. Não é o jogo com
regras, inventário, missões ou interface.

## Exemplos e validação

- [Mapa com lago e chuva](examples/mapa-prova.pomorog.json): criado no teste
  de interação; inclui uma copa personalizada.
- [Item com modelos animados incorporados](examples/item-roundtrip.json):
  bloco e dois modelos mínimos de teste, GLTF e GLB. Não é arte final.
- [Câmera, painéis móveis e criação de efeitos](captures/paineis-efeitos-2026-10-11/README.md).
- [Primeira reorganização do espaço de trabalho](captures/editor-unity-2026-10-11/README.md).
- [Validação de persistência e exportação](captures/autoria-2026-10-11/README.md).
- `pnpm check`: tipos, testes unitários e build.
- Com `pnpm dev` aberto, `pnpm verify:authoring`: teste do editor real no
  Chromium isolado, incluindo arrastar da biblioteca e mover/girar/escalar
  pelos eixos com eventos reais de mouse. Saídas em `/tmp/ascii-authoring-verification`; outro
  diretório pode ser passado como argumento. Requer Chromium instalado.
- `pnpm compare`: seis vistas contra a base existente, sem atualizá-la.

## O que ainda não está completo

Esta é uma base funcional de autoria visual, não a conclusão de todos os
sistemas previstos em `START.md`. Permanecem: seleção múltipla e agrupamento,
biblioteca de prefabs compostos vinculados, editor de chunks com costuras e
conectores, paleta completa dos cinco biomas, mar/cachoeira/rios por spline,
pincéis avançados, curvas e linha do tempo gráficas para efeitos, ajustes completos de
alfabeto/cor/espaçamento por parte e a integração real do jogo. As cinco
áreas existentes continuam como referências montadas em código.

A chuva/neve do editor reaproveita as receitas visuais, mas ainda não inclui
as interações completas de pegadas, acumulação, derretimento e anéis do
pântano. Objetos/efeitos e terreno podem se sobrepor; a autoria não aplica
colisões nem regras de posicionamento. O encaixe dos painéis oferece uma
região por borda; ainda não há divisão arbitrária em várias colunas nem
agrupamento de todos os painéis em abas.
O app nativo Tauri e mobile não foram validados nesta entrega.
A aprovação de equivalência integral com o Pomorog continua
pendente.
