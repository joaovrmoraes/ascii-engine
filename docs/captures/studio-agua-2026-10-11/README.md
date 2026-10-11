# Estúdio, água e colocação — 11/10/2026

Capturas do `pnpm verify:visual`, em Chromium isolado com GPU.

- `previa-com-gizmo.png`: pedregulho real antes de colocar, com gizmo.
  O teste arrasta o eixo de escala e confirma que Enter preserva a pose.
- `agua-na-encosta.png`: pincel contínuo sobre uma montanha; teste verifica
  que nenhum valor do heightmap foi achatado e que a malha tem normais
  inclinadas. A ondulação segue a descida; não é simulação hidráulica.
- `studio-atmosfera.png`: tela dedicada com controles de cor/luz/névoa.
- `studio-efeitos-luz.png`: tela dedicada com luz habilitada na receita.
- `reflexo-on.png` / `reflexo-off.png`: mesma cena e tempo, alterando somente
  a habilitação do reflexo. 444 pixels do quadro responderam no teste final.
  Ambas as águas coplanares recebem o mesmo espelho atualizado.
- `fogueira-luz-on.png` / `fogueira-luz-off.png`: tempo/câmera fixos, alterando
  só a PointLight. 3841 pixels responderam; uniforms da grama e dos corpos
  também foram conferidos.
- `studio-cdpshot.png`: captura adicional com `cdpshot.mjs`, abrindo o mapa
  exportado pelo teste MCP e a tela de Atmosfera.

O reflexo continua em letras, não uma imagem lisa na água. O passe auxiliar
usa materiais iluminados antes da conversão para evitar perder o reflexo
na dupla amostragem de letras. Encostas usam espelho planar local, uma
aproximação. Partículas do passe separado não são refletidas pelo espelho.
Águas antigas permanecem planas até a ação explícita Adaptar ao relevo.

Seis comparações passaram sem atualizar baselines: referência 0.0000,
floresta 0.0014, pântano 0.1219 (limite 0.2), neve 0.0053, mina 0.0120,
catedral 0.0096 (demais limites 0.04).
