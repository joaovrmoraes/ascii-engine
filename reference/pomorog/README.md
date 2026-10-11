# Referência: Pomorog

Cópia de leitura, feita em 11/10/2026 a partir do commit `27af922` do Pomorog
(branch `joaovrmoraes/scenery-ascii-visual-polish`). **Não edite.** Os caminhos
citados dentro dos documentos são do repositório do Pomorog:

| Citado como | Aqui |
| --- | --- |
| `src/ui/visual/<arquivo>.ts` | `src-visual/<arquivo>.ts` |
| `docs/visual-pipeline.md`, `docs/style-guide.md`, `docs/production-guide.md` | `docs/` |
| `docs/engine/*.md` | `docs/engine/` |
| `docs/ui/reference/meadow-combat-2026-10-10/` | `images/` |
| skill `pomorog-ascii-visual` | `.claude/skills/pomorog-ascii-visual/` na raiz |

## Ordem de leitura

1. `docs/engine/README.md`: índice e mapa do código.
2. `docs/visual-pipeline.md`: a referência técnica completa. O §19 é o
   catálogo objeto por objeto, que diz qual técnica cada coisa usa e por quê.
3. `docs/engine/recreate-from-zero.md`: passo a passo com o código-núcleo; é a
   base direta da fase 1.
4. `docs/engine/animation.md`, `ui-ux.md` e `assets-and-audio.md`, conforme a fase.
5. `docs/style-guide.md` e `docs/production-guide.md`: direção e processo do
   jogo, úteis como contexto.
6. `images/README.md`: o registro de 10–11/10 com as capturas. Os arquivos
   `reference-*` são quadros do vídeo de inspiração; os `rejected-*` mostram o
   que **não** fazer.

## Sobre `src-visual/`

É a pasta `src/ui/visual/` inteira, só os `.ts`, sem testes nem componentes
React. Alguns arquivos importam código do jogo que não foi copiado (`types`,
motor, i18n); isso é esperado. Leia como especificação, não como código para
compilar aqui.
