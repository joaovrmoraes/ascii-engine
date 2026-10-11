# Letras nos objetos e efeitos de combate — 10/10/2026

**Pedido:** o usuário enviou `WhatsApp Video 2026-10-10 at 18.03.46.mp4` (reel de
outro jogo ASCII 3D, luta contra um dragão) e pediu esse nível. Também pediu
que as melhores técnicas fiquem na skill
[pomorog-ascii-visual](../../../../.claude/skills/pomorog-ascii-visual/SKILL.md).

Estado: **Floresta Sombria, versão que o usuário indicou como alvo** ("se
voltar só personagem, monstros e topo da árvore pro antigo, acerta 100%").
Chão, grama, ponte e construções usam letras na superfície. Herói, monstros
e copas usam o passe de tela aprovado. As outras áreas continuam como antes.

## Estado final (11/10)

Depois das rodadas abaixo, a direção foi generalizada: cenário com letras na
superfície, copas/pedras/criaturas como nuvens de letras, tapete por bioma,
fogo em grade de calor, água em letras sinuosa, monstros articulados com
entradas, Floresta em circuito procedural. Pântano (água/chuva) e neve
(chão/flocos) voltaram à versão anterior. Herói no passe de tela. Referência
técnica: [pipeline visual](../../../visual-pipeline.md) e [engine](../../../engine/README.md).
Capturas adicionais: `procedural-forest-*.png`, `all-areas-ground-cover.png`, `ascii-fire-grid.png`.

## Primeira tentativa, rejeitada

A primeira versão clareou o chão e fez lâminas de grama **no passe de tela**.
O usuário respondeu: "você aplicou o filtro na tela, e não nas coisas… achei
feio". A grade fixa na tela ficou dominante no chão inteiro. Os arquivos
`rejected-screen-*.png` guardam essa versão só como histórico.

## Direção atual: letras na superfície

| Vídeo | Implementação |
| --- | --- |
| Grama = muitas lâminas-caractere soltas no mundo, verdes variados, pontas claras | `grass.ts` modo campo: 70 mil glifos de pé, densos onde o chão é grama (`meadowSoil`), luz de magia/aura nas lâminas |
| Dragão = fileiras de letras acompanhando a asa e o corpo | `worldGlyph.ts`: cada material projeta sua própria grade de letras (espaço local, escala de mundo, eixo dominante da face); a letra anda/gira com o membro |
| Luz e sombra mudam a cor das letras | Iluminação real do Three.js, com fundo escuro entre letras e controle de saturação antes da mistura |
| Anéis/aura/faíscas | `effects.ts`, já eram glifos no mundo |

Rodadas de feedback na mesma noite:

1. Letras na superfície de **tudo**: "3D com textura de ASCII, não objeto ASCII".
2. Fundo escuro e sombreamento por letra: chão, ponte e construção "perfeitos";
   herói, monstros e copas pareciam "uma bola preenchida por letras"
   ([captura](rejected-surface-actors-crowns.png)).
3. Decisão: atores e copas voltam ao passe de tela (`markActorInk`; folhas
   ficam fora de `applyWorldGlyphs`).

O passe de tela (`ascii.ts`) deixa passar os materiais com alpha `glyph` (`.85`)
aplicando só o tratamento de luz comum. `?ascii=screen` volta ao modo antigo
na floresta para comparação.

## Correções mantidas da primeira tentativa

1. `tagSurface` usava `toFixed(1)` (um ID `.95` virava terra). Agora usa duas
   casas; `surface.test.ts` valida os IDs.
2. `dt` negativo (timestamp do rAF antes do `performance.now()` anterior) fazia
   `damp()` divergir e o herói sumir. `dt` agora fica entre 0 e .08.
3. Sombra de contato sob herói/criatura e efeitos de combate: anel de
   engajamento, anel de impacto, aura com luz e vagalumes.

## Capturas

| Arquivo | Conteúdo |
| --- | --- |
| [comparison.png](comparison.png) | Antes / letras nos objetos / vídeo |
| [orca-world-glyph.png](orca-world-glyph.png) | **Orca Browser**, largura cheia; etapa intermediária (atores ainda com textura) |
| [after-world-glyph-combat.png](after-world-glyph-combat.png) | Combate com o lobo (Chromium headless, GPU) |
| [after-world-glyph-closeup.png](after-world-glyph-closeup.png) | Herói e lobo no passe antigo sobre o chão novo, 3× |
| [rejected-surface-actors-crowns.png](rejected-surface-actors-crowns.png) | Atores com letras na superfície (rejeitado) |
| [before-forest-combat.png](before-forest-combat.png) | Antes |
| [after-other-areas.png](after-other-areas.png) | Outras áreas, efeitos de combate apenas |
| `rejected-screen-*.png` | Primeira tentativa rejeitada |
| `reference-3/13/24.png` | Quadros do vídeo |

## Verificação e limites

- `pnpm release:check` passou na versão final: 122 testes, fronteiras, servidor, sprites,
  build web e bundle do servidor. Nenhum número do motor mudou; sem simulação.
- Letras com células de 6–8 px ficam pouco legíveis em DPR 1. Parecem textura,
  não letras isoladas. Ajuste fino de tamanho e alfabetos por material continua aberto.
- Sprites (inventário/bestiário) não mudaram; atores continuam no passe de tela.
- Mina, catedral, pântano e neve ainda não receberam o chão/construções novos.
- Docker e instaladores não foram reconstruídos.
