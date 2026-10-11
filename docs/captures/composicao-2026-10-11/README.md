# Composição — câmeras e origem de efeitos

Antes: [Studio sem posicionamento](../studio-assets-2026-10-11/efeito-void-salvo.png).

- [Gizmo e origem da camada](efeito-origem-gizmo.png): Chama deslocada, outras camadas preservadas; receita salva.
- [Câmera na cena](camera-na-cena.png): gizmo e volume de visão auxiliares, fora do mundo ASCII.
- [Ver pela câmera](camera-cdpshot.png): captura com `cdpshot.mjs`, proporção 16:9 e inspetor.
- [Player](camera-player.png): documento reaberto e câmera inicial respeitada, sem auxiliares do editor.
- [Captura MCP](mcp-camera.png): enquadramento salvo capturado pela API/MCP.
- [Orca Browser](orca-gizmo.png): Studio com gizmo e campos XYZ, sem salvar conteúdo de teste no documento do dono.

[Composição](verify-composition.log), [autoria](verify-authoring.log),
[API/MCP](verify-api.log) e [regressão visual](verify-visual.log) passaram.

A verificação de composição usa mouse nativo no gizmo da câmera e da
camada. Confere um arrasto por ação de desfazer, separação do histórico do
efeito, salvamento com Ctrl S, reabertura e câmera inicial no player.
A câmera suportada é ortográfica; a navegação do editor é independente.
