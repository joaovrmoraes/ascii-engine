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
  Natureza, Construções, Formas, Efeitos e Importados, com busca.
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

**Prévia** oculta os controles de seleção na cena e desativa os painéis
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
3. **Lago** e **Riacho** escavam o leito e colocam água. O riacho
   usa o contorno procedural do Pomorog, com extensão de 34 m; ainda não é
   uma curva desenhada ponto a ponto. Selecione a água na lista para ajustar
   posição, tamanho, direção, nível e fluxo. Mover a água depois não escava
   automaticamente o novo local: ajuste o relevo com os pincéis.
4. Arraste um objeto da biblioteca para o chão. A biblioteca inclui árvore,
   pedras, caixa, ponte, ruína, tronco, formas básicas, fogueira e efeitos.
5. A lista à esquerda seleciona o objeto inteiro. O inspetor permite
   renomear, ocultar, mover, girar, escalar, duplicar e excluir.
6. O primeiro clique no mapa seleciona o objeto. Clique novamente na mesma
   parte, ou escolha-a na lista **parte** em **Aparência ASCII**, para ajustar
   técnica, família de letras e tamanho. O escopo pode ser instância, tipo
   ou global; todas essas camadas entram no arquivo.
7. Na aba **Ambiente**, **Clima** seleciona chuva/neve; **Atmosfera** muda o parâmetro de atmosfera
   existente da engine. Não converte o terreno nem os objetos em um bioma.

**Alt + arraste esquerdo** gira a câmera; botão direito/meio, ferramenta
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

## Criar efeitos

1. Abra a aba **Efeitos**, ao lado de Projeto, ou clique em **Criar efeito**
   na barra superior. Aumente a altura do painel se quiser ver mais campos.
2. Comece com **Novo efeito**, uma base do Pomorog ou um efeito já salvo no
   documento. Escolher uma base cria uma cópia para editar.
3. Ajuste duração e repetição; adicione, duplique ou exclua emissores.
   Os campos controlam tipo, emissão por segundo, rajada inicial, início,
   vida, forma de nascimento, velocidade XYZ, gravidade, arrasto, variação,
   giro, letras, tamanho inicial/final, cores e brilho.
4. **Prévia** toca no centro da vista. **Parar** remove apenas a prévia.
   Trocar para Projeto também a interrompe. Alterar os campos atualiza a
   prévia; ainda é preciso salvar para incorporar as alterações ao mapa.
5. **Salvar na biblioteca** guarda a receita no documento. **Salvar e
   colocar** também ativa a colocação: clique no chão para criar a instância.
   O efeito passa a aparecer na categoria **Efeitos** da biblioteca.
6. **Baixar efeito** exporta a receita como `.effect.json`; **Abrir efeito**
   importa uma receita. **Avançado — definição JSON** permite ajustar os
   parâmetros que ainda não têm campos, incluindo curvas, luz, grade de
   fogo e flipbook. Dados inválidos mostram uma mensagem e preservam a cena.

Os efeitos salvos acompanham salvar, reabrir, desfazer/refazer, exportar o
mapa e exportar/inserir um item. A composição usa o campo opcional
`SceneDoc.effects`; `buildScene` cria os prefabs a partir dessas receitas,
sem depender do editor. Uma instância segue a posição do objeto; orientação
e escala do objeto ainda não transformam toda a simulação de partículas.
As receitas originais do Pomorog continuam intactas. Efeitos sem repetição
tocam uma vez ao abrir a cena; a prévia pode ser reiniciada pelo botão.

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
