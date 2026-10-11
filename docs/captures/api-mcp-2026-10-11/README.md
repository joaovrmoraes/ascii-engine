# Autoria real pelo MCP — 11/10/2026

Capturas do `pnpm verify:api`, em Chromium isolado com GPU, sem editar o
rascunho do navegador do dono. O cliente oficial MCP iniciou o servidor
stdio, descobriu ferramentas e passou pela ponte HTTP/WebSocket até o
mesmo editor visual. Não houve injeção direta de cena para executar os
comandos de autoria testados.

- `mcp-previa.png`: lote completo na cena, ainda não aceito, com botões
  Aplicar/Descartar e edição manual bloqueada.
- `mcp-cena.png`: imagem retornada por `editor_capture` ao cliente MCP.
- `mcp-cena-editor.png`: cena aceita, com modelo importado e edição manual
  posterior usada para verificar conflito de revisão.
- [Documento portátil](../../examples/mapa-mcp.pomorog.json): exportado
  pelo MCP com relevo, água, árvores, fogueira, efeito azul, atmosfera,
  chuva e um GLTF de teste incorporado.

Verificado: aplicação atômica, cancelamento integral, um desfazer por
lote, refazer, erro sem perda de recursos, conflito com revisão antiga,
importação com acompanhantes, inspeção de partes, captura PNG, exportação
sem sobrescrita acidental e reabertura idêntica. A configuração do cliente
MCP do dono não foi alterada; o cliente usado aqui é o de integração.

`orca-api-canvas.png`: leitura da cena do dono pela própria API no Orca,
sem edição (revisão 0). O canvas é renderizado sob demanda porque essa aba
não executava os quadros de animação. O screenshot do viewport do Orca
continuou expirando; esta imagem veio do canvas, não do viewport.
