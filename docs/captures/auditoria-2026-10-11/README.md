# Evidências da auditoria — 11/10/2026

Código examinado: `ed2d4f3`. [Relatório](../../relatorio-engine-2026-10-11.md).
Nenhuma imagem é um antes/depois de alteração gráfica: o código da engine
não foi alterado nesta etapa. `reference/` e as baselines foram preservados.

## Capturas

| Arquivo | Origem / URL |
| --- | --- |
| [referencia.png](referencia.png) | `pnpm compare`, `/?area=reference&pause=3` |
| [floresta.png](floresta.png) | `pnpm compare`, `/?area=dark_forest&pause=5&peaceful=1` |
| [pantano.png](pantano.png) | `pnpm compare`, `/?area=rain_marsh&pause=6` |
| [neve.png](neve.png) | `pnpm compare`, `/?area=snow_pines&pause=6` |
| [mina.png](mina.png) | `pnpm compare`, `/?area=old_mine&pause=5` |
| [catedral.png](catedral.png) | `pnpm compare`, `/?area=sunken_cathedral&pause=5` |
| [sandbox.png](sandbox.png) | `cdpshot.mjs`, `/?area=sandbox&pause=3` |
| [gltf.png](gltf.png) | `cdpshot.mjs`, `/?area=gltf&pause=3` |
| [effects.png](effects.png) | `cdpshot.mjs`, `/?area=effects&pause=3` |
| [sandbox-orca.png](sandbox-orca.png) | Orca Browser, `http://localhost:1440/?area=sandbox`, 1705×919 |
| [exportacao-web.png](exportacao-web.png) | `cdpshot.mjs`, exportação servida em `http://127.0.0.1:1441/?pause=5` |

Headless: Chromium com GPU (`--use-angle=gl`), imagens de 1600×757.
O tamanho da janela solicitado pelo script é 1600×900; a imagem capturada
tem a área útil indicada. As seis imagens de comparação foram copiadas
de `docs/captures/diff/` após a execução, sem atualizar a base.

Foram abertas as referências `procedural-forest-start.png`,
`after-world-glyph-closeup.png` e `all-areas-ground-cover.png` do Pomorog.
A comparação de identidade visual foi qualitativa, com enquadramentos
diferentes, e não substitui o aceite do dono.

## Verificações

- `pnpm check`: passou; 25 testes em 7 arquivos. Editor sem testes próprios.
- `pnpm compare`: passou nas seis vistas. RMSE: referência `0.0000`,
  floresta `0.0095`, pântano `0.0272`, neve `0.0041`, mina `0.0134`,
  catedral `0.0088`.
- GLTF: dois modelos exportados/reimportados pela demo, 26852 e 31268 bytes,
  clipe `swim`, partes nomeadas; sem exceções nas capturas dessa demo.
- Efeitos: fogueira em execução; leitura de estado com 74 letras, um efeito,
  quatro emissores e orçamento de 6000 letras. O contador do painel pode
  estar um quadro atrás da leitura da engine.
- Orca: `snapshot` retornou os controles do sandbox e `screenshot` retornou
  imagem válida. Nesta sessão, não ocorreu a falha de painel oculto
  registrada nas etapas anteriores.

## Exportação web

Comando executado:

```bash
node scripts/export.mjs --title 'Auditoria ASCII Engine' \
  --area dark_forest --out /tmp/ascii-engine-audit-export-20261011-1700
```

A pasta `web` foi servida por HTTP local na porta 1441 e capturada com
`cdpshot.mjs`. Título observado: `Auditoria ASCII Engine`; classe `player`
ativa; painel principal com `display: none`; canvas pronto.

Não foi executado novo build desktop nem aberto o aplicativo Tauri.
O servidor temporário da exportação foi encerrado após a conferência.

## Sondas dos problemas de autoria

[`sondas.js`](sondas.js) chama a API real e os prefabs do editor; não usa
mocks. [`resultados-sondas.json`](resultados-sondas.json) registra as
observações relevantes da execução. O teste ocorreu em perfil Chromium
descartável, sem editar arquivos de projeto do usuário ou seu localStorage.

As sondas alteram a cena de teste e terminam com uma chamada deliberada a
um cenário sem terreno. Para reproduzir, use um perfil descartável, com
`pnpm dev` rodando. Na raiz do repositório:

```bash
python - <<'PY'
import os, pathlib, subprocess, tempfile
env = os.environ.copy()
env['PRE'] = pathlib.Path('docs/captures/auditoria-2026-10-11/sondas.js').read_text()
env['EXPR'] = 'JSON.stringify(window.audit)'
prefix = str(pathlib.Path(tempfile.mkdtemp(prefix='ascii-audit-')) / 'sonda')
subprocess.run([
    'node', '.claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs',
    'http://localhost:1440/?area=sandbox&pause=3', prefix, '4000', '1',
], env=env, check=True)
PY
```

Resultados: estilo da instância `.31` ausente no documento; brilho `.8`
ausente no documento; tipo `.29` substituído pelo padrão `.19`; geometria
da árvore diferente ao reconstruir; um `update` no tapete já removido;
`TypeError` ao construir o sandbox com `emptyScene()`.

Essas sondas não substituem testes automatizados de interface. O impacto
de uso prolongado e a recuperação após falha de abertura continuam pendentes.
