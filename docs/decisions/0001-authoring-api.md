# 0001 — Autoria visual local por API e MCP

Data: 11/10/2026. Escopo solicitado pelo dono: IA pode criar todo o conteúdo
visual e também editar a cena aberta, com prévia e desfazer.

O contrato é o mesmo `SceneDoc` que o editor salva/exporta. Comandos
atômicos em `packages/authoring` transformam cópias e validam antes da
materialização. `scene.replace/patch` dão acesso a todos os campos, além
de comandos convenientes para terreno, água, objetos, recursos e ambiente.

O adaptador do editor materializa a candidata antes de liberar a antiga,
mantém revisão da sessão, bloqueia edição durante prévia e usa o histórico
já existente. A IA pode aplicar diretamente ou aceitar sua prévia; não há
aprovação humana obrigatória. Uma revisão antiga é rejeitada.

A ponte HTTP/WebSocket fica em `apps/automation`, escuta só loopback:1442
e exige sessão explícita. Não escolhe automaticamente outra aba. Vite
inicia a ponte em desenvolvimento; `pnpm api` é a entrada independente.
O MCP oficial usa stdio e adapta ferramentas à API. Acesso a arquivos
locais fica no processo MCP, em caminhos explícitos; o documento incorpora
os recursos e não guarda caminhos privados da máquina.

O núcleo não importa HTTP, MCP, UI ou regras do jogo. Receitas Pomorog
continuam na biblioteca do editor. O player exportado não se conecta à
ponte. A integração final do jogo continua fora desta mudança.

Limitações: editor precisa estar aberto; sessão muda ao recarregar;
prévia não aceita é volátil; desktop ainda precisa de execução validada;
controle de painéis e sistema operacional não integra a API de conteúdo.
Testes cobrem contrato, isolamento/erros, transporte e MCP até o renderer
real, importação, exportação e reabertura.
