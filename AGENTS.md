# Instruções para agentes — ASCII Engine

Vale para qualquer modelo (Codex, Claude, GPT, outros).

## Leia antes de alterar

1. [`START.md`](START.md): objetivo, princípio visual, técnicas, arquitetura e fases.
2. [`reference/pomorog/README.md`](reference/pomorog/README.md): o que é a
   referência e como ler cada documento.
3. Para qualquer coisa visual, leia a skill `pomorog-ascii-visual` e
   `reference/pomorog/docs/visual-pipeline.md` (inclusive o catálogo, §19).
   Abra as imagens em `reference/pomorog/images/`; ler só o texto não basta.
4. `docs/log.md` (quando existir): o que já foi feito e onde parou.

## Regras

- **Letras presas às coisas.** Nunca resolva um visual aplicando filtro de tela
  ao mundo inteiro, textura de letras sobre 3D liso ou nuvem que vira uma esfera
  sólida. Essas três abordagens foram rejeitadas pelo dono.
- **Fidelidade antes de invenção.** Na extração, preserve números, alfabetos,
  cores e ordem de desenho do Pomorog. Melhorias vêm depois e com antes/depois.
  Não use skills de design para reinterpretar o estilo.
- **O núcleo é independente.** `packages/engine` não importa React, Tauri, regras
  de jogo nem nada de bioma específico. Efeitos de bioma entram por ganchos ou
  presets.
- **A técnica é declarada** (`GlyphKind`). Não classifique pela cor.
- `reference/` é **somente leitura**. Os caminhos citados lá (`src/ui/visual/…`,
  `docs/…`) são do repositório do Pomorog; o arquivo correspondente está em
  `reference/pomorog/src-visual/` ou `reference/pomorog/docs/`.
- **Valide vendo.** Use `pnpm check`, capturas com `cdpshot.mjs` e o **Orca
  Browser** em `http://localhost:1440`. Declare quando algo não pôde ser verificado.
- **Git:** confira `git status` antes de editar. Não faça reset, limpeza, push nem
  publicação por suposição. Commits locais pequenos ao fim de cada etapa
  validada são permitidos; o push só acontece quando o dono pedir.
- **Avise antes de reverter** qualquer coisa que o dono já viu ou aprovou.
- Escreva em português nos documentos e mensagens ao dono. Código e
  identificadores ficam em inglês.

## Ao concluir uma etapa

Atualize `docs/log.md` com o que mudou, as capturas (salve em `docs/captures/`),
os testes rodados e o que ficou pendente. Atualize `START.md` se a arquitetura
ou o plano mudarem.
