# Engine para criar o Pomorog

Pedido do dono em 11/10/2026: completar a engine para permitir criar seu
jogo, consultando `~/Documents/pomorog`. Este plano concretiza o escopo de
autoria já descrito em `START.md` e as correções da auditoria.

**Escopo esclarecido pelo dono:** somente visual por enquanto: terrenos,
mapas, itens e afins, exportáveis para o Pomorog mesmo que ele ainda não
tenha importador. Regras e interface do jogo ficam fora. “Execução” abaixo
significa prévia do conteúdo visual, não implementação do jogo.

## Fontes conferidas

- `~/Documents/pomorog`: checkout `main`, `f79d3c7`, versão anterior em
  terminal; há alterações locais do dono, preservadas.
- `~/orca/workspaces/pomorog/pearleye`: `27af922`, versão 3D ASCII vigente,
  mesma origem de `reference/pomorog`; limpa na conferência.
- Motor: eventos de encontro, ataque, magia, dano, morte, loot e descanso;
  tempo por timestamp e RNG determinístico. Regras ficam no jogo.
- Visual: cinco biomas, viajante automático, fogueira, criaturas articuladas,
  clima, luz, água e efeitos. A câmera não controla o personagem.

## Entregas e aceite

1. Documento confiável: salvar estilos de todas as camadas, transformações,
   sementes e modelos; validar antes de substituir; descartar recursos.
2. Autoria: hierarquia, transformar, duplicar, excluir, focar seleção,
   desfazer/refazer por ação/traço; persistência e arquivos portáveis.
3. Assets: GLB e GLTF com arquivos acompanhantes, instâncias independentes,
   animação e estilos por parte preservados no ciclo salvar/reabrir/exportar.
4. Cenários e execução: selecionar ambiente, águas e efeitos, salvar a cena
   e executá-la no jogador; manter disponíveis as cinco referências.
5. Prova de criação: construir uma cena pela interface, editar partes,
   importar modelo animado, salvar, reabrir e exportar; testar falhas de
   abertura e histórico; validar no Chromium e no Orca Browser.

Não considerar a engine completa apenas porque compila. A conclusão deste
escopo exige as provas de autoria/exportação acima. A integração real do
jogo e a equivalência integral das cinco áreas são trabalhos posteriores;
não bloqueiam a exportação visual solicitada. Registrar limites no log.

## Decisões de implementação

Manter TypeScript + Three no núcleo e DOM no editor. Evoluir `SceneDoc`
sem invalidar arquivos de versão 1: campos novos opcionais, identidade e
semente normalizadas ao carregar. Assets portáveis fazem parte do documento;
nenhuma dependência de um caminho absoluto desta máquina. O histórico guarda
documentos, não objetos Three. Controles operam sobre os mesmos dados que
são usados no salvamento e no jogador.

O Pomorog é fonte de leitura nesta etapa; nenhum de seus checkouts é alterado.
As skills globais antigas que citam `specs/project`, React e Canvas 2D não
descrevem esta arquitetura. Valem o `START.md`, o `AGENTS.md` local e o pedido
atual. Nenhum push ou publicação está incluído.
