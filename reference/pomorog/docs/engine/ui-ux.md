# UI/UX — referência completa

Interface em HTML/CSS por cima do canvas 3D-ASCII. React 19 + CSS puro.
Arquivos: `src/ui/tui/theme.css` (base/terminal), `src/ui/visual/game.css`
(estrutura do jogo e mapa), `src/ui/visual/expedition.css` (layout vigente,
carvão/cobre), `src/online/online.css` (entrada, presença, keyframes),
`src/ui/audio/audio.css`, componentes em `src/ui/visual/*.tsx`, `src/ui/modals`, `src/ui/screens`.

## 1. Princípios

- **O mapa domina.** A interface prepara a caçada e mostra o progresso; não cobre a ação.
- Linguagem de terminal: fonte monoespaçada, botões em colchetes `[ > Iniciar ]`,
  barras de texto `[####----]`, molduras `+-- TÍTULO --+`, ícones de caractere.
- Paleta carvão + cobre/areia, contraste por posição e cor, não por caixas
  arredondadas ou sombras. Nada de fundo verde dominante, glassmorphism ou ícones coloridos soltos.
- Toda informação também em texto (não só cor). Foco de teclado visível.
- Animação de UI curta, nunca atrasa ação nem desloca o alvo do clique; respeita `prefers-reduced-motion`.

## 2. Tipografia

- `--font: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace`
  (UI). O mundo usa **Courier New regular** nos atlas de letras (decisão separada).
- Tamanhos: rótulos 7–9 px com `letter-spacing .1–.17em` em maiúsculas; corpo
  10–12 px; títulos 13–24 px (`clamp(16px, 1.6vw, 24px)` no cabeçalho);
  relógio do foco 36 px com `letter-spacing −.04em`; marca 17–25 px.
- `font-weight: 400` quase sempre; hierarquia por cor e tamanho.

## 3. Cores (tokens)

`expedition.css` (`.game-screen`):

| Token | Valor | Uso |
| --- | --- | --- |
| `--c-bg` | `#101014` | fundo carvão |
| `--c-fg` | `#c8c4bd` | texto |
| `--c-dim` | `#89858c` | secundário |
| `--c-border` | `#343238` | bordas finas |
| `--c-yellow` | `#d3b27c` | cobre/areia, destaque, foco |
| `--c-red` | `#de8b7b` | dano/alerta |
| `--c-blue` | `#91abc8` | mana/info |
| `--c-cyan` | `#a0b5c2` | detalhe frio |
| `--c-green` | `#aab594` | positivo contido |

Superfícies: cabeçalho `#16151a`/`#121116`, lateral `#19181e`, cartão do
viajante `#1d1b21`, faixa de foco `#19171b`, mapa `#09080e`, modal `#1a171f`,
véu `#09070de8`. Botão principal: borda `#b48e62`, texto `#ebd4b1`, fundo
`#30241d` (hover `#4a3425`/`#e0b47c`, ativo desce 1 px). Abas ativas
`#ddbd94` com borda inferior `#c69a69`. Sobre o mapa: rótulos `#dfe0e3` com
contorno de sombra preta de 1 px; vida da criatura `#d09b88` em `#080809c9`;
dano `#fff2ce` (no herói `#ff9d85`), 19 px, 700.

## 4. Layout

```text
┌ masthead (64 px): marca · nota · teclas · demo ───────────────────────┐
│ online-bar (quando conectado)                                          │
├──────────────────────────────────────────────┬─────────────────────────┤
│ expedition-heading: "A EXPEDIÇÃO / 01" + nome │ traveller-card          │
│ + marcador de fase                            │ (retrato, nome, HP/MP,  │
├──────────────────────────────────────────────┤  carteira)              │
│                                              ├─────────────────────────┤
│              MAPA (canvas ASCII)              │ abas Expedição | Diário │
│   caption, controles de imagem/áudio, HUD     ├─────────────────────────┤
│   world-controls (rodapé do mapa)             │ conteúdo rolável        │
├──────────────────────────────────────────────┤ (rota, ritmo, guia,     │
│ focus-deck: relógio · etapas · ação principal │  diário, totais)        │
└──────────────────────────────────────────────┴─────────────────────────┘
grid: minmax(0,1fr) 316px (350 px ≥ 1800; 285 px ≤ 1150)
altura: calc(100dvh − 158px), mínimo 680 px
```

Responsivo: ≤ 850 px ou retrato (aspecto < 3/4) empilha (mapa `min(58dvh, 700px)`,
lateral em 2 colunas); ≤ 550 px compacta cabeçalho e textos. Não encolher
fontes/miniaturas indiscriminadamente; preservar ações e rolagem dos modais.

### 4.1 Mapa (`AsciiWorld.tsx`)

- `.ascii-world-canvas`: canvas ocupa o mapa menos 31 px do rodapé; cursor
  `grab`/`grabbing`; `touch-action: pan-y`.
- **Controles de imagem** (`details` `[ : ] Imagem`, canto superior direito):
  Luz 65–140% (passo 5%) e Tamanho 5–12 px; mostra FPS.
- **Áudio** (`AudioControls`, à esquerda dos controles de imagem): ativar/mudo/volumes.
- **Rodapé** (`.world-controls`): "Arraste para girar a câmera" e botões
  `[<>]` ampliar (tela cheia com 12 px de margem; `Esc` fecha; pausa fecha),
  `[<]` `[>]` girar 45°, `[-]` `[+]` zoom (.7–1.8, passo .12), `[R]` centralizar,
  `[~]`/`[=]` animações do cenário (desliga com movimento reduzido).
- **Legenda** (`.trail-caption`): símbolo `*`/`!`/`>` + estado ("Seguindo a trilha",
  nome da criatura, "Calor, descanso…") + subtítulo.
- **HUD no mundo** (`worldActors.ts`): ver `animation.md` §7.
- Erro de WebGL: mensagem e `[ Tentar novamente ]`.

### 4.2 Faixa de foco

Relógio grande (`SEU PRÓXIMO FOCO` / fase), etapas do bloco como quadrados de
24×22 com estados `current` (cobre) e `done`, e a ação principal que reflete o
estado real: Iniciar (`S`), Pausar/Retomar (`ESPAÇO`), Pular bonfire (`B`), etc.

### 4.3 Lateral

Cartão do viajante (retrato fotografado 88×108, nome, nível, HP/MP em barras
de texto, ouro), abas Expedição/Diário, seleção de rota (número grande 21 px,
mini-arte ASCII, nome, requisito), ritmo (foco, bonfire, pausa longa, blocos com
`−`/`+`), guia de campo (bestiário e saques com sprites), diário (totais em 3
colunas, encontro atual, eventos com hora).

### 4.4 Demo (`DemoScreen.tsx`)

Cabeçalho "POMOROG / EXPEDIÇÃO" + voltar; mapa com status `[ @ ] AUTORUN` /
`[ ! ] COMBATE AUTOMÁTICO`; vitais; `[ || Pausar ]`, `[ Bonfire ]`, relógio
`m:ss / m:ss · loop`, barra de progresso; lateral com encontro (retrato,
vida, ação), mochila (sprites) e nota do ciclo pomodoro.

### 4.5 Modais

Véu `#09070de8` (`veil-arrive`), painel `#1a171f` com borda `#887080`
(`panel-unfold`). Inventário com inspeção (quantidade, raridade, atributos,
requisitos, valor, comparação; inspecionar não altera, equipar/vender são
ações), ficha, equipamentos, skills, loja, amigos. Focáveis por teclado.

## 5. Componentes de texto

| Componente | Forma |
| --- | --- |
| Botão de comando | `[ > Rótulo ]` + `kbd` com a tecla |
| Barra | `[` + `#`×cheio + `-`×vazio + `]` (8–16 células) |
| Moldura de seção | `+-- TÍTULO --+` |
| Item de diário | `hora` (5–7ch) + texto, separador pontilhado |
| Marcador de fase | texto em maiúsculas com borda fina |
| Sprites | PNG fotografados dos modelos com o filtro ASCII (ver `assets.md`) |

## 6. Movimento da interface

| Keyframe | Definição | Onde / duração |
| --- | --- | --- |
| `camp-reveal` | opacidade 0→1, `translate 0 14px → 0` | cabeçalho .45 s (+.04), lateral .55 s (+.14), faixa de foco .6 s (+.22) |
| `map-unfold` | opacidade 0→1, `clip-path inset(8% 0) → 0` | mapa .8 s (+.07) |
| `panel-page` | opacidade 0→1, `translate 8px 0 → 0` | troca de aba .25 s |
| `world-awaken` | opacidade 0→1, `scale 1.035 → 1` | chegada ao mundo |
| `veil-arrive` | opacidade 0→1 | véu de modal |
| `panel-unfold` | opacidade 0→1, `translateY(14px) scale(.98) → none` | modal ~.26 s |
| `toast-arrive` | sobe 10 px, fica 10–85%, some | avisos |
| `loot-arrive` | opacidade e `translateY(6px)` | item novo |
| Botão principal | `transition: background, border-color, translate .16s` | hover/ativo |
| Dano no mundo | sobe 18 px/s, 1,5 s; estalo `\|/ -*- /\|\` .28 s | HUD |

`prefers-reduced-motion: reduce` desliga todas as animações de entrada, a
transição do botão e as animações do cenário (`[=]`).

## 7. Interação e acessibilidade

- Atalhos: `S` iniciar, `ESPAÇO` pausar/retomar, `B` pular bonfire, `Esc` fecha
  mapa ampliado/modais. Nunca acionam o jogo ao digitar em campos.
- Foco: `outline: 1px dashed var(--c-yellow); outline-offset: 3px`.
- Canvas com `role="img"` e `aria-label` descrevendo a caçada automática.
- Botões de ícone com `aria-label`; estados com `aria-pressed`/`aria-current`.
- Textos em PT/EN (`src/i18n`); a demo ainda tem textos em português.
- Áudio só após gesto; mudo e silêncio na pausa/aba oculta (ver `audio.md`).

## 8. Modo terminal clássico

`?view=terminal`: a UI antiga só de texto (`src/ui/tui`). Histórico, mantido
como alternativa; não é a direção vigente.
