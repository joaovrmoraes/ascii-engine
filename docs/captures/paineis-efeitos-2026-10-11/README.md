# Câmera, painéis e efeitos — 11/10/2026

- `aba-efeitos.png`: `cdpshot.mjs`, Chromium com GPU, formulário de efeitos
  aberto e painel inferior aumentado pelo gesto de redimensionamento.
- `painel-flutuante.png`: teste de interação, hierarquia destacada e
  redimensionada; efeito personalizado já salvo/colocado no mapa.
- `orca.png`: captura completa do Orca Browser, aba Efeitos aberta sobre
  o rascunho do dono; nenhuma alteração salva no conteúdo do mapa. Captura
  anterior ao ajuste final de distribuição dos campos da barra de efeitos.

`pnpm check`: 44 testes, tipos e build passaram. O aviso Vite de bundle
>500 kB permanece. `pnpm verify:authoring /tmp/ascii-workspace-final` passou
em todos os fluxos anteriores e nos novos: câmera em três ângulos/zooms,
redimensionamento, destaque, encaixe em outra borda, persistência do layout,
restauração dos painéis, criar/pré-visualizar/salvar/colocar/reabrir efeitos,
importar uma composição de efeito com identidades próprias, rejeitar JSON
inválido e liberar instâncias antigas. Sem exceções não tratadas na página.

O teste da câmera demonstrou o bug anterior: arrastar `[80, 40]` pixels
deslocava a cena em aproximadamente `[80, -43]`. Agora o erro fica abaixo
de 0,5 pixel nas duas direções e nos três enquadramentos testados.

Comparações sem atualizar baselines: referência 0,0000; floresta 0,0015;
pântano 0,1186; neve 0,0036; mina 0,0134; catedral 0,0077. Todas passaram.
Não houve validação de Tauri/mobile nem aprovação final de fidelidade.
