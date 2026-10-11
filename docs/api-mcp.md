# Autoria visual por IA — API e MCP

A IA tem acesso a todo o documento visual do editor: terreno, pintura,
água, modelos, objetos e suas partes, efeitos, luzes, atmosfera, clima e
exportação. Pode editar a cena aberta, apresentar uma prévia ou aplicar
diretamente. Cada lote aplicado vira uma ação de desfazer.

Isso cobre os recursos visuais implementados no editor. A API não cria
regras de jogo, não instala um importador no Pomorog e não adiciona ao
renderer recursos que ele ainda não implementa.

## Iniciar e conectar

Na raiz do projeto:

```sh
pnpm install
pnpm dev
```

Abra `http://localhost:1440/?area=sandbox`. O desenvolvimento inicia também
a API em `http://127.0.0.1:1442`. Cada aba recebe uma sessão própria; a IA
precisa escolher explicitamente o `sessionId`. O servidor não escolhe a
primeira aba automaticamente.

O servidor MCP usa **stdio**. Para um cliente MCP, adapte os caminhos de
[`.mcp.example.json`](../.mcp.example.json) à instalação. O comando direto é:

```sh
node /home/jonny/Documents/ascii-engine/apps/automation/node_modules/tsx/dist/cli.mjs \
  /home/jonny/Documents/ascii-engine/apps/automation/src/mcp.ts
```

Também existe `pnpm mcp` para iniciar pelo workspace. Esse processo fala
JSON-RPC pelo stdin/stdout; não é um terminal interativo. A configuração
global do seu cliente de IA não é modificada pelo projeto.

Para usar o editor compilado/desktop com a ponte separada, inicie `pnpm api`
e abra o editor. O player exportado não abre conexão de autoria. A integração
desktop ainda não foi executada nesta etapa; a verificação ponta a ponta
foi feita no editor web com Chromium e GPU.

`ASCII_ENGINE_API` muda o endereço consultado pelo servidor MCP. A ponte
escuta somente em loopback, na porta 1442; não é um serviço público.
Os navegadores autorizados são localhost:1440, 127.0.0.1:1440 e origens
locais do Tauri. API HTTP não habilita CORS para sites externos.

## Ferramentas MCP

| Ferramenta | Operação |
| --- | --- |
| `engine_sessions` | Lista cenas conectadas, revisão e prévia pendente. |
| `engine_reference` | Catálogo atual, esquema dos comandos, presets completos de efeitos/água/estilo e contrato do documento. |
| `scene_read` | Lê cena e revisão. `full: true` inclui todos os arrays e fontes incorporadas. |
| `scene_validate` | Valida lote e referências sem editar. Modelos são decodificados na aplicação. |
| `scene_apply` | Executa comandos em lote. `preview: true` por padrão; `false` aplica diretamente. |
| `scene_preview` | `accept` grava a prévia; `cancel` restaura a cena anterior. |
| `scene_history` | `undo`/`redo` no mesmo histórico usado pela interface. |
| `object_inspect` | Documento do objeto, partes, opções ASCII e clipes de animação. |
| `editor_view` | Foco XYZ, ângulo, zoom, pausa e tela do Estúdio. |
| `editor_capture` | Retorna imagem PNG da cena renderizada como conteúdo de imagem MCP. |
| `assets_import` | Importa GLB ou GLTF e acompanhantes de caminhos locais explícitos. |
| `scene_open` | Abre documento visual local, com prévia ou aplicação direta. |
| `scene_export` | Exporta documento incorporando modelos e efeitos; exige `overwrite: true` para substituir arquivo. |

Fluxo recomendado para a IA: listar sessões → ler cena/revisão → consultar
catálogo e referências necessárias → montar lote → prévia → capturar e
conferir → aceitar. A IA pode aceitar a própria prévia e aplicar diretamente.
Os botões **Aplicar** e **Descartar** também aparecem para a pessoa no
editor; não são uma aprovação obrigatória.

Durante a prévia, os controles de edição ficam bloqueados; a câmera
continua navegável. A prévia não entra no rascunho nem no histórico até
ser aceita. Fechar/recarregar a aba descarta a prévia não aceita. Edições
manuais avançam a revisão; um comando baseado numa revisão antiga falha.
Leia novamente antes de tentar outra vez, inclusive após timeout ou
desconexão, pois o editor pode ter concluído a operação.

## Comandos de documento

`engine_reference(topic: "commands")` entrega o JSON Schema completo.
As operações são:

| Grupo | Comandos |
| --- | --- |
| Documento completo | `scene.replace`, `scene.patch` |
| Objetos | `object.add`, `object.update`, `object.remove`, `object.scatter` |
| Terreno | `terrain.create`, `terrain.stroke` |
| Água | `water.paint`, `water.update`, `water.remove` |
| Recursos | `effect.define`, `asset.define`, `resource.remove` |
| Ambiente | `atmosphere.set`, `environment.set` |

`scene.patch` faz merge recursivo de objetos e substitui listas inteiras.
`unset` remove campos opcionais do documento. Essa operação permite editar
heightmaps, pesos/camadas de terreno, carpet, receitas avançadas, estilos
globais/por tipo e qualquer campo do contrato `SceneDoc`, mesmo sem um
comando específico. `scene.replace` aceita o documento completo.

Posições e medidas são em metros; Y é altura. `rotation3` usa radianos.
Cores inteiras são RGB hexadecimal convertido em número; `inkTint` e
cores de partículas usam triplas. Não atribua `water`, `carpet` ou `particle`
a uma malha comum: essas técnicas precisam das geometrias correspondentes.

Exemplo de lote, enviado com a revisão atual:

```json
{
  "revision": 0,
  "preview": true,
  "commands": [
    { "op": "terrain.create", "size": 32, "resolution": 129 },
    { "op": "terrain.stroke", "strokes": [
      { "brush": "raise", "x": 2, "z": -3, "radius": 5, "strength": 3 }
    ] },
    { "op": "water.paint", "mode": "terrain", "radius": 1,
      "points": [{ "x": 2, "z": -3 }, { "x": 0, "z": 0 }, { "x": -4, "z": 3 }] },
    { "op": "object.add", "object": {
      "id": "fogueira-central", "prefab": "fogueira", "position": [-3, 0, -2]
    } },
    { "op": "atmosphere.set", "style": {
      "moon": { "intensity": 1.8 }, "inkTint": [0.8, 0.9, 1]
    } },
    { "op": "environment.set", "weather": "rain", "intensity": 0.3 }
  ]
}
```

`water.paint` sem `index` cria uma água; com `index` continua a mesma máscara.
`erase: true` apaga apenas água. Modo `terrain` acompanha relevo existente;
modo `level` escava o leito e mantém superfície plana. A ondulação na
encosta desce segundo a normal; não há simulação de volume de fluido.
Reflexos continuam planares, com aproximação local para encostas.

Para criar objetos inéditos, componha os prefabs/formas disponíveis ou
importe GLTF/GLB. `assets_import` não adivinha arquivos acompanhantes:
liste o modelo, buffers e imagens. A resposta contém os novos ids para
`object.add`. `asset.define` aceita diretamente uma fonte incorporada.
Modelos inválidos não substituem a cena aberta. Para efeitos novos, copie
uma receita de `engine_reference(topic: "effects")`, altere seus emissores
e luz, e use `effect.define` com id `fx:custom-NOME`; depois posicione esse
id com `object.add`.

Para salvar iluminação nos Assets, use `atmosphere.define` com `id`, `name`
e `style`; campos omitidos herdam a iluminação atual. Isso adiciona
`SceneDoc.atmospheres[id]`, sem aplicar o preset. `atmosphere.apply` com
esse `id` aplica a iluminação, preservando o restante do documento.
`resource.remove` aceita `kind: "atmospheres"`. Catálogo, exportação,
prévia e histórico incluem esses recursos, como os criados pelo estúdio.
`atmosphere.set` continua ajustando a iluminação atual diretamente.
`editor_capture` captura a prévia isolada quando o estúdio de efeitos está aberto.

## API HTTP e JavaScript

```sh
curl http://127.0.0.1:1442/v1/sessions
curl http://127.0.0.1:1442/v1/request \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"UUID-DA-ABA","request":{"method":"scene.read","full":false}}'
```

O envelope HTTP é `{sessionId, request}`; sucesso retorna `{result}`;
erro retorna `{error}` com status não 2xx. Métodos disponíveis estão em
`packages/authoring/src/schema.ts`; usam nomes como `scene.apply`,
`preview.accept`, `history.undo`, `assets.import`, `editor.capture`.
Na importação HTTP, `files` contém `{name, data, mime?}` com bytes base64.

Na própria página:

```js
const api = window.asciiEngineApi
const state = await api.request({ method: 'scene.read', full: false })
await api.request({
  method: 'scene.apply', revision: state.revision, preview: false,
  commands: [{ op: 'object.add', object: { prefab: 'caixa', position: [1, 0, 2] } }],
})
```

O pacote `@ascii-engine/authoring` também exporta `applyCommands(doc, batch)`
para gerar/validar documentos sem editor nem GPU. Prefabs do catálogo e
decodificação de modelos são verificados pelo editor ao materializar a cena.

## Limites e validação

- 20000 objetos, 256 receitas de efeito e 256 atmosferas salvas; terreno/máscara até 513 × 513.
- Até 2000 comandos por lote, 1000 amostras por pincel e 2000 cópias por dispersão.
- 32 MB por modelo no importador; 45 MB totais de arquivos no MCP, 64 MB no transporte.
- Histórico do editor: até 30 ações/64 MB, podendo reduzir ações com modelos grandes.
- Até 8 luzes pontuais adicionais iluminam letras; muitas águas em níveis
  diferentes exigem mais passes de reflexo.
- A API não controla layout dos painéis nem configurações do sistema operacional.
  Cobre a autoria visual e a câmera do editor; não execução arbitrária de código.
- A conexão não instala automaticamente o MCP no cliente de IA. Configure o
  cliente com o exemplo; gravar arquivos no repositório não adiciona uma
  ferramenta a uma conversa já iniciada.

Verificações: `pnpm check`, `pnpm verify:api` (MCP oficial → HTTP → editor
real → exportar/reabrir, com perfil isolado), `pnpm verify:authoring`,
`pnpm verify:visual` e `pnpm compare`. Capturas em
[`captures/api-mcp-2026-10-11`](captures/api-mcp-2026-10-11/README.md).

O servidor usa o [SDK TypeScript oficial do MCP](https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server),
transporte stdio e descoberta de ferramentas com JSON Schema.
