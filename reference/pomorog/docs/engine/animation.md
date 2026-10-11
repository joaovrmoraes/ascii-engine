# Animação — referência completa

Toda animação é **procedural** (sem keyframes, sem mocap) sobre corpos
articulados de `THREE.Group`. Toda a animação é apresentação: as regras e o RNG ficam no
motor (`src/engine`). Arquivos: `motion.ts`, `models.ts`, `beasts.ts`,
`wetlandCreatures.ts`, `scene.ts`, `effects.ts`, `worldActors.ts`.

## 1. Primitivas de movimento (`motion.ts`)

| Função | Fórmula | Uso |
| --- | --- | --- |
| `damp(v, alvo, taxa, dt)` | `v + (alvo − v)(1 − e^(−taxa·dt))` | Suavização independente de FPS (velocidade, zoom, poses) |
| `smooth(x)` | `t²(3 − 2t)`, `t = clamp(x,0,1)` | Transições em S |
| `turn(a, alvo, taxa, dt)` | `a + atan2(sin(Δ), cos(Δ))(1 − e^(−taxa·dt))` | Giros pelo menor ângulo |
| `attackPose(idade)` | `windup = smooth(i/.14)·(1 − smooth((i−.14)/.1))`; `swing = smooth((i−.14)/.09)·(1 − smooth((i−.3)/.46))`; `recoil = sin(clamp((i−.23)/.45)·π)`; zero fora de 0–.76 s | Preparo → golpe → recuperação |
| `hurtPose(idade)` | `e^(−9i) · sin(min(1, i/.075)·π/2)` | Tranco ao levar dano |
| `footstep(fase, passada)` | apoio 60% (`z = passada(.5 − p/.6)`, sem elevação); balanço 40% (`z = passada(−.5 + smooth(s))`, `lift = sin(πs)²·.17`) | Pé que não desliza |
| `IMPACT_DELAY` | .2 s | Dano/som/efeito chegam no impacto |
| `FIRE_TRAVEL_TIME` | .22 s | Viagem da bola de fogo |

`dt` do quadro: `clamp((agora − anterior)/1000, 0, .08)`. O `0` evita a
divergência de `damp` com `dt` negativo; `.08` evita saltos depois de travadas.
Pausa ou aba oculta: `dt = 0` e nada anda.

## 2. Herói (`models.ts → createAdventurer`)

### 2.1 Construção

Escala do corpo `(.73, 1, 1)`; tronco com `z × .78`. Materiais `flatShading`:
armadura `0xc4b7a1`, tecido `0xb65342`, escuro `0x292e2d`, pele `0xb2a88d`,
latão `0xd4ad67`.

| Parte | Geometria | Posição (m) |
| --- | --- | --- |
| Peitoral | cilindro r .245/.19, h .59, 8 lados | y 1.30 |
| Cinto | caixa .36×.12×.29 | y .99 |
| Saia | cilindro aberto .20/.245, h .34 | y .88 |
| Tabardo | caixa .25×.57×.065 | y 1.29, z .28 |
| Mochila | caixa .3×.39×.16 | y 1.34, z −.24 |
| Cabeça (junta) | escala .81 | y 1.78 |
| Capuz | esfera .27 + cone .26×.19 | — |
| Rosto | caixas escuro/pele e olhos de latão | z .22–.27 |
| Ombros | caixa .38×.12×.33 | y 1.57 |
| Braço (junta) | ombro esfera .115, braço cilindro .085/.067 h .34 | x ±.32, y 1.48 |
| Antebraço (junta) | cilindro .078/.06 h .3, mão esfera .08 | y −.36 |
| Perna (junta) | coxa cilindro .092/.073 h .37 | x ±.14, y .83 |
| Canela (junta) | cilindro .1/.08 h .3, bota caixa .14×.13×.25 | y −.36 |
| Espada | cabo, guarda .34, lâmina cone 4 lados h .78 achatado .35 | no antebraço direito |
| Ombreira | icosaedro .16 achatado .65 | x −.33, y 1.49 |
| Lanterna | caixa emissiva `0xffd695`/`0xffb340` ×1.5, aros e alça | x −.43, y 1.01, z .25 |
| Capa | 3 painéis encadeados (.37+i·.025 × .29) | z −.31, y 1.51 |

Altura nominal 2,15 m. `feet` expõe as botas (passos, pegadas, ondas na água).

### 2.2 Ciclo por quadro

Entradas: `time, dt, speed, distance, attackAge, hurtAge, sitting, looting, casting, death, wading`.

```text
locomotion = damp(locomotion, min(1, speed/1.2), 10, dt)
run        = damp(run, smooth((speed − 1.55)/.9), 6, dt)        // corrida
gait      += distance / (1.05 + run × .2)                       // ciclos por metro
crouch     = damp(crouch, looting && speed < .15 ? 1 : 0, 5, dt)
cycle = gait × 2π ; walk = locomotion × (1 − sitting) ; settle = smooth(sitting)
breath = sin(time × 1.9)

corpo.y  = (cos(2·cycle)(.028 + run·.045) − .028 − run·.03)·walk + breath·.009(1 − walk)
           − settle·.52 − crouch·.12 − death·.4
corpo.x  = sin(cycle)·.023·walk
corpo.z  = −windup·.08 + swing·.34 − hurt·.12
corpo.rx = .045·walk + run·.24 − windup·.08 + swing·.13 − hurt·.17 + settle·.13 + crouch·.42
corpo.rz = sin(cycle)·.035·walk − hurt·.08 + death·1.45
tronco.ry = sin(cycle)·.13·walk − windup·.3 + swing·.38      // contrarrotação
```

Braços: balanço `sin(cycle + iπ)·walk·(1 + run·.9)`; braço `x = balanço·.32 − .08 −
settle·.84 − crouch·.58`; antebraço `−.18 − run·.75 − max(0, −balanço)·.24 −
settle·.43`. Braço da espada no golpe: `+windup·.7 − swing·1.55` (1.35 se magia),
antebraço `−windup·1.15 + swing·.12`. Braço da lanterna acompanha mais leve.

Pernas (IK de 2 ossos de .36 m):

```text
passo = footstep(gait + i·.5, (.63 + run·.12)·walk)
z = passo.z + (i ? −.08 : .1)·swing
baixo = .68 − passo.lift·walk·(wading ? 1.18 : 1) + corpo.y(1 − settle)
alcance = clamp(hypot(z, baixo), .25, .719)
joelho = π − acos((.36² + .36² − alcance²)/(2·.36²))
quadril = atan2(−z, baixo) − joelho/2
perna.rx = lerp(quadril, −1.5, settle) ; canela.rx = lerp(joelho, 1.5, settle)
bota.rx = −(quadril + joelho)(1 − settle) + passo.lift·walk·.65
pé apoiado = (gait + i·.5) mod 1 < .6 ; contador de passos para sons/pegadas
```

Cabeça: olha em volta parado (`sin(time·.65)·.06`), compensa o tronco
(`−tronco.ry·.55`), abaixa ao sentar/coletar, recua no dano.
Capa: `arrasto = damp(arrasto, walk·.24 + run·.35 + swing·.24 − windup·.1, 4, dt)`;
cada painel `rx = .12 + arrasto + sin(cycle − i·.7)·walk·.07 + sin(time·2.2 − i·.8)·.025
+ settle·.28`; `rz` segue o tronco.
Dano: emissivo da armadura `(hurt·.42, hurt·.08, hurt·.025)`.

### 2.3 Locomoção na cena (`scene.ts`)

```text
velocidade_alvo = combate/sentado ? 0 :
                  (na água ? 1.12/1.28 : 1) · base · ritmo · smooth(distância/.45) · (1 − smooth(sitting·1.5))
speed = damp(speed, alvo, alvo > speed ? 6 : 10, dt)            // acelera mais devagar que freia
giro = turn(rot, atan2(dx, dz), 6, dt)
avanço = min(distância, dt·speed·(.4 + .6·max(0, cos(alvo − rot))))   // não anda de lado
sitting = damp(sitting, sentado ? 1 : 0, sentado ? 3.2 : 5.5, dt)
```

- `base` e `ritmo`: no circuito, `solveBaseSpeed` e `paceAt` (`trailLoop.ts`).
  `paceAt`: trechos de 9 s, 22% parar 3,2 s e depois andar, 28% correr ×2,1,
  50% andar. `solveBaseSpeed(metros, segundos) = clamp(m/s/MEAN_PACE, .35, 1.45)`.
- Em combate o herói vira para a criatura (`facing + π − .2`).
- Sentar: anda até o assento e gira para o fogo (`turn(…, 5)`).

## 3. Criaturas

### 3.1 Quadrúpedes (`beasts.ts → createQuadruped`)

Espécies em `QUAD` (cores, tamanho, comprimento, pernas, pescoço, focinho, extras).
Esqueleto: `body → hips` (y = H, z = −L) e `chest` (y = H + .06, z = .55L);
`neck` (inclinação −.55) → `head` (+.55) → `jaw`; 4 `hip → knee` (coxa .52H,
canela .5H, pata); cauda em cadeia de 2–5 segmentos. `H = .62·legs`, `L = .5·length`.

```text
gait += distance/(.9·size) ; locomotion = damp(…, 9) ; stride = gait·2π
corpo.y = |sin(stride)|·.04·loc − windup·.08 − death·.35
corpo.z = −windup·.12 + swing·.42 − hurt·.16       // agacha, investe, recua
peito.y = H + .06 + breath·.012 − windup·.05
pescoço.rx = base − windup·.25 + swing·.35 (+ farejar parado)
cabeça.ry = sin(time·.6)·.18·(1 − loc)
mandíbula.rx = .08 + breath·.03 + (windup·.35 + swing·.7 + recoil·.2)·jaw
perna: fase = stride + (diagonal ? 0 : π) ; quadril.rx = cos(fase)·.45·loc ± golpe
       joelho.rx = ±(max(0, sin(fase))·.7·loc + windup·.25 + .08)
cauda[i].ry = sin(time·2.4 − i·.7)·(.12 + loc·.1 + hurt·.4)
```

Na entrada em investida, a velocidade usada para as patas é limitada a
3,2 m/s (cadência de galope sem patinar). Altura = `(H + .62)·size + .2`.

### 3.2 Artrópodes (`createArthropod`)

`BUG`: aranha (8 olhos, 4 pares), besouro (placas), vespa (asas, voa a .9 m),
caranguejo (pinças). Tórax, abdômen (inclinação, ferrão), cabeça com olhos
emissivos, mandíbulas/pinças, pernas em 2 segmentos (`hip` z ±1.05, `knee` z ±1.6).

```text
gait += distance/.45
corpo.y = voa ? sin(time·3.1)·.08 : |sin(2·stride)|·.015
tórax.rx = −windup·.45 + swing·.3 − hurt·.2          // empina e ataca
pinças.ry = ±(sin(time·4)·.1 + windup·.6 − swing·.5)
asas.rz = ±sin(time·38)·.6
perna: fase = stride + ((i + lado) mod 2)·π ; levanta = max(0, sin(fase))·loc
       quadril.rx = cos(fase)·.35·loc (dianteiras levantam no preparo)
```

### 3.3 Humanoides e mortos-vivos (`FOLK` + `dressFolk`)

Rig do herói (`createAdventurer(true, morto-vivo)`, com cajado no lugar da
espada) com escala e paleta por espécie: pele, roupa, armadura, brilho
emissivo .35 e, se `float`, deslocamento `+.25 + sin(time·1.8)·.08`.

### 3.4 Slime (`wetlandCreatures.ts`)

Coroa (esfera achatada) + 9 lobos na base + olhos com pálpebra.
`squash = breath·.115 + creep·.12·loc + windup·.28 − swing·.23 + vibração·.14 + hurt·.25`;
coroa `escala (1 + squash·.48, 1 − squash, 1 + squash·.35)`; lobos seguem com
atraso de fase; piscar a cada 4,7 s; morte achata (`y·(1 − .9·death)`).

### 3.5 Serpente

Tubo dinâmico de 24 segmentos × 7 lados recalculado por quadro ao longo de uma
onda `sin(fase − u·7)·amplitude·(.55 + .7u)`; pescoço ergue (`e^(−7u)`),
cabeça orienta pela tangente, mandíbula abre no golpe, língua pisca a cada 3,6 s,
listras acompanham pontos do corpo.

### 3.6 Olhos, elementais, caracol, larva (`models.ts`)

Elipsoides com tentáculos/chamas/antenas/segmentos animados por família:
tentáculos ondulam, chamas oscilam, larva serpenteia por segmento.

## 4. Entradas e saídas de cena (`scene.ts`)

| Estilo | Quem | Movimento | Efeito |
| --- | --- | --- | --- |
| `charge` | feras, insetos | começa 11 m adiante pela trilha; `remain = t < .75 ? 1 − 1.08t : .19(1 − smooth((t − .75)/.25))` com `t = idade/1.6` | poeira de letras no rastro |
| `rise` | `undead`, larva, caracol, rastejante, slime | sobe de `−(altura + .2)` em `smooth((idade − .25)/1.25)` com tremor `sin(40t)·.025` | rachaduras radiais `- \ \| /` e terra espirrando com gravidade |
| `swoop` | voadores, olhos, imps, grimórios, espectros | `t = 1 − (1 − idade/1.5)²`; de 9 m e 4 m de altura até o alvo | rastro de vento `~ -` |

Direção: ponto da trilha 4 m à frente, desviado para o lado da tela (×.9)
para nunca ficar atrás do herói. Morte: colapso `smooth((t − morte)/.85)`;
some e 60 letras sobem por 1,6 s; saque surge e quica (`|sin(2π·i)|·.14·e^(−3i)`).

## 5. Câmera

```text
ângulo = damp(ângulo, π/7 + rotação + arrasto_do_mouse, 6, dt)
zoom   = damp(zoom, zoom_usuário × roda(.75–1.5), 6, dt)
enquadramento = clamp(altura/145, 3.8, 4.7)
span = max(max(enq, 4.6/aspecto)/min(zoom, combate ? 1.5 : 2.2), combate ? 2.35/aspecto : 1.8)
foco_desejado = herói (y 1.05; .75 em combate) − direção_da_câmera × (combate ? 1.25 : 2)
                 + 32% em direção à criatura
foco = lerp(foco, desejado, 1 − e^(−3.5 dt))
câmera = foco + (sin(ângulo)·15, 18, cos(ângulo)·15), ortográfica ±span
```

Arrastar gira (`.006 rad/px` após 6 px); roda dá zoom (`e^(−Δ·.001)`).
Oclusores entre câmera e atores somem (raios em 5 alturas, a cada .12 s).

## 6. Ambiente animado

| Coisa | Animação |
| --- | --- |
| Copas | `rz = sin(t·.85 + x·.7 + i·.6)·.012`, `rx = sin(t·.62 + z·.4)·.009` por ramo |
| Grama | vento e desvio (ver `visual-pipeline.md` §8) |
| Lanternas da mina | `rz = sin(t·.8 + i·2.1)·.035` |
| Fogueira (luz) | `13 + sin(5.3t)·1.1 + sin(8.7t + .8)·.65` × força do fogo |
| Lanterna (luz) | `base + sin(3.7t)·.7 + sin(7.3t)·.35` |
| Juncos | `rz = repouso + sin(1.6t + fase)·.045` |
| Folhas flutuantes | `y = nível + .016 + sin(1.5t + i)·.007` |
| Água | ver `visual-pipeline.md` §11 |
| Neve nos galhos | escala `(.85 + .15d, .065 + .19d)`, `d = .28 + .72(1 − e^(−t/42))` |

## 7. Rótulos e números (`worldActors.ts`)

Camada HTML sobre o canvas, posicionada projetando cabeça e pés:

- Nome acima da cabeça (`@ VOCÊ` / nome da criatura).
- Vida da criatura em texto `[########] hp/max` (8 células) sob os pés.
- Dano: aparece no impacto (`IMPACT_DELAY` + viagem da magia), sobe 18 px/s
  por 1,5 s (`translate(−50%, −28 − idade·18 px)`), some nos últimos .5 s.
- Estalo de impacto: `\|/ -*- /|\` por .28 s (só se houve dano).

## 8. Interface: movimento

Ver `ui-ux.md` §6 (keyframes, durações e movimento reduzido).
