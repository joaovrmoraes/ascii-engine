# Auditoria do ASCII Engine — 11/10/2026

> Atualização posterior: os problemas centrais de persistência, sementes,
> descarte e autoria básica foram tratados. Veja o [guia da entrega visual](guia-editor-visual.md)
> e o [registro de validação](log.md). Este relatório preserva o estado anterior.

**Diagnóstico:** existe um núcleo gráfico ASCII substancial e funcional, com
cinco demonstrações do Pomorog. O editor ainda é um protótipo de ferramentas:
não fecha com segurança o ciclo de criar, editar, salvar, reabrir e exportar
um jogo próprio. Vale continuar sobre essa base.

Auditoria do commit `ed2d4f3`, com leitura do código, `pnpm check`, comparação
visual, capturas novas e sondas no navegador. As mudanças desta etapa são
documentação e evidências; os problemas de implementação abaixo permanecem
abertos. A cópia em `reference/` foi mantida intacta.

## Onde parou

O último commit acrescentou o modo jogador e exportação web/desktop. Antes
vieram efeitos, terreno/cenários, seleção por parte, GLTF, combate e as cinco
áreas. O registro anterior chamou as fases 1–6 e 8 de implementadas, mas
listou pendências que impedem considerá-las concluídas.

O critério do dono em `START.md` é conseguir **montar as cinco áreas pelo
editor**, no nível visual do Pomorog. Hoje é possível escolher e assistir às
cinco áreas; a montagem delas está em funções TypeScript em
[`apps/editor/src/areas/`](../apps/editor/src/areas/). Isso ainda não demonstra
que o usuário consegue construir essas mesmas áreas pelas ferramentas.

A integração de volta no repositório do Pomorog, Fase 7, não aconteceu.
Seu objetivo é provar que um jogo real consegue consumir o núcleo extraído.

## O que já funciona e o que está parcial

| Sistema | Evidência existente | Limite atual |
| --- | --- | --- |
| Renderização ASCII | Seis técnicas: `screen`, `surface`, `body`, `carpet`, `particle`, `water`; luz, sombra, profundidade e reflexos | API ainda estreita para personalizar alfabetos, espaçamento e acabamento por parte |
| Conteúdo Pomorog | Floresta, pântano, neve, mina e catedral renderizam; modelos, clima, fogo e combate foram portados | Áreas montadas em código; equivalência visual final com o Pomorog ainda não aprovada |
| Estilo por parte | Seleção, destaque, técnica, família, tamanho de `body` e camadas global/tipo/instância/parte | Ajustes da seleção não são coletados pelo salvamento do cenário |
| GLTF/GLB | Leitor, propriedades do Blender, animações e letras acompanhando esqueleto; demo exporta e reimporta dois GLBs | Sem biblioteca persistente de assets; importações ficam fora de `SceneDoc`; teste com exportador Three, não com arquivo real do Blender |
| Terreno | Elevar, baixar, suavizar, aplainar, pintar e cavar; mapa de alturas salvo em JSON | Uma área finita; sem desfazer, costura de chunks, rios desenhados, caminhos ou pincéis avançados; pintura muda cor/densidade, não a técnica de cada camada |
| Prefabs/cenários | Oito prefabs, colocar/apagar, terreno, águas e JSON; armazenamento local do sandbox | Biblioteca definida em código; falta editar e salvar prefabs, mover/girar/escalar pela interface; alguns prefabs mudam ao reabrir |
| Chunks | Circuito, carregamento por distância e gerador determinístico por conectores | Gerador de grade testado isoladamente; não conectado ao editor de cenários |
| Efeitos | Emissores, rajadas, curvas em dados, luz, fixação, orçamento, flipbooks e presets | Editor por JSON; sem curvas visuais, áudio, integração completa de gatilhos e persistência dos efeitos dentro da cena |
| Exportação | Script gera web com `game.json`; modo jogador abre sem os painéis principais | Exporta conteúdo conhecido pelo aplicativo; ainda não é um empacotador completo de projeto e assets. Desktop só tem compilação histórica registrada |
| Qualidade | 25 testes do núcleo, TypeScript e build passando; seis comparações visuais passando | Editor não tem testes automatizados; faltam testes de salvar/reabrir, importar/exportar e uso prolongado |

O editor é Vite + TypeScript + DOM; não há React nesta implementação.
O Tauri é uma casca mínima, sem comandos nativos de arquivos implementados.
O núcleo não importa o editor, React, Tauri nem o motor do jogo. Há, porém,
defaults Pomorog diretamente em `engine.ts` e no sistema de efeitos: a
separação em presets existe, mas a configuração neutra ainda pode melhorar.

## Por que ainda não parece uma engine de criação

A tela inicial abre uma demonstração, e o seletor “área” mistura mapas,
cenário editável, efeitos e testes técnicos. Não há um projeto que reúna
cenas, assets, prefabs, efeitos e configurações. Trocar de área recarrega a
página. O usuário encontra recursos separados, sem um documento central
que represente todo o trabalho.

No sandbox faltam hierarquia de objetos, controles de transformação,
duplicação, agrupamento, desfazer/refazer e navegação livre pelo terreno.
A câmera gira e aproxima em torno de um foco fixo. O painel de efeitos se
sobrepõe ao painel principal na captura de 1600×757. Esses detalhes de uso
pesam mais, neste momento, que acrescentar outra técnica gráfica.

O “jogador” exportado reproduz uma área/cena. Os encontros da floresta são
roteirizados em [`encounters.ts`](../apps/editor/src/areas/encounters.ts), e
não constituem um sistema genérico de regras, controle do personagem,
colisões, navegação, combate e progresso. Para o Pomorog, as regras devem
continuar no jogo: o núcleo precisa oferecer integração suficiente para
receber seus eventos e estados.

## Problemas concretos encontrados

### 1. Salvar cenário perde ajustes de aparência — prioridade crítica

Reprodução com a API real, em Chromium isolado:

- Criar uma árvore por `buildScene`, mudar a copa da instância para `.31`,
  o tamanho da copa do tipo para `.29` e o brilho para `.8`.
- Serializar com `toJSON()`: `objects[0].options` e `style` continuam ausentes.
- Reabrir: a instância não tem a alteração; o tipo volta a `.19`, da biblioteca.

[`world/scene.ts`](../packages/engine/src/world/scene.ts), `toJSON`, devolve
o documento original com o terreno atualizado, sem consultar os estilos
atuais da engine. Além disso, `buildScene` aplica `doc.style` antes de
registrar os estilos padrão dos prefabs, que podem sobrescrever os tipos
salvos. O painel altera a engine diretamente, sem atualizar o documento.

**Aceite da correção:** editar cada camada de estilo, salvar, recarregar em
uma sessão nova e obter os mesmos valores e aparência.

### 2. Objetos importados não entram no cenário salvo — prioridade crítica

Confirmado pelo fluxo do código: [`main.ts`](../apps/editor/src/main.ts)
mantém os modelos num array `imported`; `importFile` adiciona diretamente
à engine. O salvamento do sandbox só conhece os objetos de `buildScene`.
`SceneDoc` não possui catálogo nem referências a modelos externos.

Assim, um GLB pode aparecer e animar na tela sem fazer parte do arquivo
salvo ou do jogo exportado. O leitor local de `.gltf` também não possui um
fluxo para escolher e resolver os arquivos `.bin` e texturas acompanhantes.
Esse último caso precisa de teste com assets reais; a demo cobre GLB.

**Aceite:** importar um GLB, posicionar, ajustar partes, fechar e reabrir o
projeto e exportá-lo preservando o modelo, seus arquivos e sua animação.

### 3. O mesmo documento pode gerar outra árvore — prioridade alta

Confirmado comparando posições, escalas e matrizes das malhas de duas
construções do mesmo documento. A geometria foi diferente.
[`prefabs.ts`](../apps/editor/src/scene/prefabs.ts) usa `Math.random()` em
árvores, pedregulhos e cogumelos de troncos; o documento não guarda a semente
dessas instâncias.

**Aceite:** guardar a semente ou os parâmetros de construção de cada
instância; a geometria deve se repetir ao carregar e ao exportar.

### 4. Abrir documento inadequado pode inutilizar a edição — prioridade alta

`createSandbox(engine, { scene: emptyScene() })` lançou
`TypeError: Cannot read properties of undefined (reading 'data')`.
O formato do núcleo aceita cenário sem terreno, mas o editor presume
`scene.terrain!` ao construir seus controles.

Há ainda um problema de ordem em `reload`: descarta a cena atual antes de
construir a nova. Um prefab desconhecido ou dados inválidos podem falhar
depois que a cena anterior já foi retirada. Essa segunda conclusão vem
da leitura do código, não de um teste de recuperação da interface.

**Aceite:** validar documento e versão antes da troca; uma falha deve
preservar a cena atual e apresentar erro legível. Definir o comportamento
de cenas válidas sem terreno.

### 5. Remover camadas não encerra todo o trabalho — prioridade alta

Sonda: criar um `carpet`, adicionar, remover com `{ dispose: true }`,
instrumentar seu `update` e renderizar. O tapete removido recebeu mais uma
atualização. O array interno `carpets` não é limpo por `engine.remove`.

O caminho de “regerar grama” repete essa criação/remoção. Nuvens e chuva
também merecem revisão dos registros internos. A retenção do tapete foi
confirmada; seu impacto acumulado em memória/FPS não foi medido.

**Aceite:** criar/remover/regerar repetidamente sem crescer o número de
camadas ativas ou continuar atualizando camadas descartadas.

### 6. Evidência visual ainda não equivale a aceite do produto

`pnpm compare` compara a engine com suas próprias capturas anteriores.
Isso detecta regressões; não compara automaticamente Pomorog × engine.
O pântano admite erro normalizado de até `.20` porque a chuva varia.

A observação das capturas confirma as técnicas e a identidade visual
geral: cobertura de letras, copas abertas, construções em superfície,
herói no passe antigo e exceções de neve/pântano. Não foi feito um
alinhamento exato de câmera, tempo e resolução com o jogo original.
Continuam pendentes o recorte de oclusores, rótulos de atores e uma revisão
do acabamento de modelos importados. Na demo GLTF, a serpente apresenta
uma silhueta contínua bastante aparente; merece inspeção próxima com o
critério de “corpo feito de letras”.

## Ordem recomendada para melhorar

| Ordem | Entrega | Prova de que terminou |
| --- | --- | --- |
| 1 | Tornar salvar/reabrir confiável: estilos, sementes, validação e descarte | Cena editada reaparece igual em sessão nova; documento inválido não destrói o aberto; camadas não se acumulam |
| 2 | Completar um cenário autorável: assets persistentes, hierarquia, transformação, duplicar e desfazer/refazer | Montar uma pequena clareira com árvore, ponte, lago e modelo importado, salvar e exportar sem editar TypeScript |
| 3 | Unificar cenas, prefabs e efeitos num projeto | Um projeto carrega todos os dados/arquivos; alterar um prefab atualiza cópias e preserva sobrescritas |
| 4 | Transformar a floresta em primeira área montável pelo editor | Chunks/conectores e ambiente entram pelo documento; mapa editado é o mesmo que abre no jogador |
| 5 | Repetir a prova nas outras quatro áreas | Pântano, neve, mina e catedral construídos com os sistemas comuns, comparados com o Pomorog |
| 6 | Validar consumo pelo Pomorog e distribuição | Jogo consome a API, eventos dirigem animações/efeitos; validar desktop em execução após o fluxo web |

O primeiro marco útil é pequeno e verificável: **montar uma cena,
personalizar uma copa e um tronco, incluir um modelo externo, salvar,
fechar, reabrir igual e exportar**. Isso usa boa parte do trabalho pronto
e revela as conexões que faltam entre os sistemas.

Mar, cachoeira, erosão, editor de curvas avançado e novos efeitos podem
continuar depois desse marco. Não é necessário trazer regras do jogo
para `packages/engine` para alcançar esse resultado.

## Validação desta auditoria

| Verificação | Resultado |
| --- | --- |
| `pnpm check` | Passou: TypeScript, 25 testes em 7 arquivos, build |
| Editor | Script de teste apenas informa “sem testes ainda” |
| Build web | 62 módulos, JavaScript principal 896,18 kB / gzip 256,65 kB; aviso de bundle acima de 500 kB |
| `pnpm compare` | Referência `.0000`; floresta `.0095`; pântano `.0272`; neve `.0041`; mina `.0134`; catedral `.0088`; todos dentro dos limites |
| `cdpshot.mjs` | Sandbox, GLTF e efeitos capturados com estado `ready=true`; GLTF com clipe `swim`, efeito com emissores/letras ativos |
| Orca Browser | Sandbox aberto, controles inspecionados e screenshot obtido nesta sessão |
| Sondas via CDP | Perda de estilos, geometria variável, tapete removido ainda atualizado e erro com cenário sem terreno reproduzidos |

Capturas novas: [`captures/auditoria-2026-10-11/`](captures/auditoria-2026-10-11/).
O [registro de evidências](captures/auditoria-2026-10-11/README.md) contém
URLs, origem das imagens, exportação web e reprodução das sondas.

O indicador chegou a 60 FPS nas vistas headless congeladas; isso **não é
benchmark** de jogo. A captura do Orca mostrou frequência bem menor e
variável; não atribuí a causa sem medição específica. Não foram validados
desktop em execução, mobile, sessão prolongada, todos os formatos de
flipbook, GLBs reais de produção nem a integração no Pomorog.

## Documentação para a próxima retomada

Use `START.md`, `AGENTS.md`, este relatório e o histórico em `docs/log.md`.
A skill global `ascii-engine-workflow` ainda cita `specs/project/`, ADRs e
“Marco 1”, caminhos que não existem neste checkout. Também sugere push ao
concluir, enquanto a regra local exige pedido do dono. Esses trechos não
representam o estado atual: o plano vigente está em `START.md`, e nada
foi enviado ou publicado nesta auditoria.
