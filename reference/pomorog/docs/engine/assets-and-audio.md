# Sprites, modelos de item e áudio de apresentação

## 1. Sprites fotografados (`snapshotAssets.ts`)

Itens, criaturas e herói na UI (inventário, bestiário, retratos) são
**fotografias dos próprios modelos 3D passadas pelo mesmo filtro ASCII**,
salvas como PNG em `public/sprites/` (85 hoje: 52 itens, 32 criaturas e o herói).

Receita:

1. Renderer sem antialias, `preserveDrawingBuffer`, DPR 1, saída linear.
   Fundo `0x020102`.
2. Luz de estúdio: hemisférica `0xd6d5e7/0x44323b` 2.0; principal
   `0xffe0af` 3.1 em (−4, 7, 6); contraluz `0xa6b9ed` 2.0 em (3, 3, −4).
3. Modelo: `createItemModel(id)`, `createCreature(família, id)` ou
   `createAdventurer()`, posado com `animate({ time: 2.6, … })`, marcado com
   `markActorInk` (alfabeto de ator).
4. Câmera ortográfica em `centro + (3.2, 2.8, 8)` (herói `2.3`), olhando o centro.
   Enquadramento pela caixa projetada no espaço da câmera, margem ×.54 (lâminas
   altas e criaturas largas ocupam a mesma área útil).
5. Tamanho: 256×240 (herói 180×220). Passe ASCII com `cellSize 6` e
   `brightness 1.35`.
6. `toDataURL('image/png')`; descarta geometria/materiais.

Fluxo: `pnpm dev` → `scripts/render-assets.html` mostra a galeria →
`pnpm assets:bake` (usa o Orca Browser) grava os PNGs e `manifest.json` com
sha256 → `pnpm assets:check` confere cobertura.

Tamanhos de exibição: item 192×176 (pequeno 88×81; inventário até 124×106;
equipado 72×66); retrato de criatura 92×84 (demo 100%×180); herói 88×108.
Fundo `#09080e`, `object-fit: contain`.

Ao mudar a geometria de algo que tem sprite, **refotografe** e atualize as
aparições. `art.ts` é arte textual legada/fallback.

## 2. Modelos de item (`itemModels.ts`)

Props pequenos com `MeshStandardMaterial` (`roughness .85`, `metalness .08`,
`flatShading`) numa paleta fixa: ferro `0xb7c2ce` (enferrujado `0xb4aaa0`),
ouro `0xe1b965`, couro `0x97614b`, madeira `0xa17c51`, escuro `0x34323e`, osso
`0xd8ccae`, vermelho `0xb7514e`, verde `0x83ae73`, roxo `0xa481d3`, azul `0x79b6d9`.
Primitivas: caixa, bola (icosaedro 1), cilindro 8 lados, toro, tubo por curva
(`strand`) e placa extrudada com chanfro (`plate`). Cada slot (arma, armadura,
material, consumível) tem receita própria por id (arco, cajado, espada,
escudo, frasco, etc.). Material define a cor da arte; raridade aparece no texto.

## 3. Áudio de apresentação (`src/ui/audio`)

- Um `AudioContext` para o app, ativado por gesto. Barramentos: mestre →
  efeitos / ambiente, com analisador. Volumes separados (geral, efeitos,
  ambiente) e mudo em `localStorage`.
- **Linha do tempo** (`timeline.ts`): lê quadros de apresentação (nunca o
  save) e emite eventos: passo (por superfície grama/pedra/madeira/água/neve,
  por distância percorrida), golpe, impacto, magia, encontro, morte, saque,
  sentar, trovão. Os eventos de combate chegam no impacto (`IMPACT_DELAY` + viagem).
  Retomar pausa ou aba oculta não repete golpes antigos.
- **Amostras** (WAV mono 32 kHz, −22 LUFS): passos 4×grama, 4×pedra, 3×madeira,
  4×água, chuva estéreo de 26 s, golpes na carne/metal, queda, entulho,
  espada (3 sopros + 3 contatos), moedas, bolsa, UI (abrir/fechar/clique), rangido.
  Fontes CC0 (Kenney, artisticdude, StarNinjas, Ylmir, rubberduck);
  processamento e licenças em `public/audio/README.md`.
- **Síntese** (`synthesis.ts`): trovão, vento, água, fogo, insetos, ar de
  caverna, gotas, vozes de criaturas, texturas de magia e resposta de reverb,
  geradas por RNG semeado.
- Mixagem por cena: ambiente por bioma, fogo por distância e pan, chuva pela
  intensidade, passos na água baixos e curtos, variação de rate/escolha para
  não repetir a mesma amostra.
- Silêncio em pausa e aba oculta. Controles em `AudioControls` sobre o mapa.
