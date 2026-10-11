# Evidências de autoria — 11/10/2026

- `mapa-reaberto.png`: editor após mudar posição, estilo da copa, esculpir,
  desfazer, cavar lago, ativar chuva e recarregar o navegador. Documento do
  IndexedDB idêntico ao salvo, verificado por igualdade JSON.
- `item-com-modelos.png`: documento sem terreno, com bloco e modelos mínimos
  GLTF/GLB animados incorporados, depois de salvar/reconstruir.
- `player-exportado.png`: exportação web servida em `localhost:1441`, sem
  painéis, com três objetos, lago e chuva. Capturada com `cdpshot.mjs`.
- `orca-canvas.png`: canvas renderizado no **Orca Browser**, página
  `http://localhost:1440/?area=sandbox`, obtido com `engine.render` seguido
  de `canvas.toDataURL`. A árvore de acessibilidade e os controles foram
  inspecionados com `snapshot`. A captura da página completa pelo comando
  `screenshot` falhou por timeout de desenho do compositor; não confundir
  esta captura do canvas com uma validação da janela inteira.

As duas primeiras imagens vieram de `scripts/verify-authoring.mjs`, que
usa Chromium com GPU e perfil isolado. Não alteram o rascunho do usuário.
Para o antes do editor, ver `../auditoria-2026-10-11/sandbox.png`.

As seis comparações da engine permaneceram dentro dos limites da base:
referência 0.0000, floresta 0.0008, pântano 0.1300 (limite 0.2 por chuva),
neve 0.0051, mina 0.0107 e catedral 0.0062. Esses números medem regressão
contra a base da engine, não aprovação de fidelidade integral ao Pomorog.
