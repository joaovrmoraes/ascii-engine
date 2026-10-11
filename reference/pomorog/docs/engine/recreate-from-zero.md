# Recriar a engine ASCII do zero

Passo a passo para reconstruir, num projeto Three.js vazio, a mesma
conversão 3D → ASCII do Pomorog. Cada passo traz o código-núcleo. Os valores
exatos e as variações estão em [visual-pipeline.md](../visual-pipeline.md); a
implementação de referência está em `src/ui/visual/`.

## Passo 0 — Base

```ts
const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace   // o shader faz a gama
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, .1, 90)  // isométrica
const target = new THREE.WebGLRenderTarget(w, h)
target.depthTexture = new THREE.DepthTexture(w, h, THREE.UnsignedIntType)
```

Câmera: posição `foco + (sin a·15, 18, cos a·15)`, `a = π/7`, `lookAt(foco)`.
Luzes: hemisférica + direcional com sombra (seção 10 do pipeline).

## Passo 1 — ID do material no alpha

```ts
const IDS = { reflection: 0, snow: .1, bark: .2, wetgrass: .3, wood: .4, actor: .5,
              stone: .6, foliage: .7, water: .8, glyph: .85, earth: .9 }
function tagSurface(m: THREE.Material, kind: keyof typeof IDS) {
  m.onBeforeCompile = (s) => { s.fragmentShader = s.fragmentShader.replace(
    '#include <dithering_fragment>', `#include <dithering_fragment>\ngl_FragColor.a = ${IDS[kind].toFixed(2)};`) }
  m.customProgramCacheKey = () => 'surface-' + kind
}
```

## Passo 2 — Passe de tela (modo clássico)

Quad em tela cheia lendo cor + profundidade do alvo:

```glsl
float isKind(float a, float k) { return 1. - step(.035, abs(a - k)); }
void main() {
  vec4 direct = texture2D(sceneTexture, vUv);
  if (isKind(direct.a, .85) > .5) { /* já é letra: só luz comum (passo 3) */ }
  vec2 cell = vec2(cellSize, floor(cellSize * 1.2));
  vec2 pixel = vUv * resolution, grid = floor(pixel / cell);
  vec2 center = (grid + .5) * cell / resolution;
  vec4 c = texture2D(sceneTexture, center);
  vec2 o = cell * .2 / resolution;          // centro×.6 + 4 diagonais×.1
  vec3 col = c.rgb * .6 + .1 * (texture2D(sceneTexture, center + o).rgb + texture2D(sceneTexture, center - o).rgb
            + texture2D(sceneTexture, center + vec2(o.x, -o.y)).rgb + texture2D(sceneTexture, center + vec2(-o.x, o.y)).rgb);
  col = pow(max(col, 0.), vec3(.4545));
  float light = dot(col, vec3(.2126, .7152, .0722));
  float grain = hash(vec3(grid, 17.));      // fixo por célula
  // escolha de alfabeto por isKind(c.a, …) e densidade (tabela 5.2)
  float index = alphabet.x + floor(clamp(density, 0., .999) * alphabet.y);
  vec2 inside = fract(pixel / cell);
  float glyph = smoothstep(.14, .74, texture2D(glyphAtlas, vec2((index + inside.x) / N, inside.y)).r);
  vec3 ink = min(col * gain * brightness, vec3(.96));
  ink = ink / (1. + ink * .42);             // comprime picos
  vec3 paper = max(vec3(.03, .04, .043), ink * surfaceColor);
  gl_FragColor = vec4(mix(paper, max(paper, ink), glyph * coverage), 1.);
  gl_FragDepth = texture2D(sceneDepth, vUv).r;   // camadas seguintes respeitam profundidade
}
```

Atlas: canvas com todos os alfabetos em sequência, Courier New 29 px em
células 24×32, branco sobre preto.

## Passo 3 — Letras na superfície (sólidos retos)

Injete no fim do `MeshStandardMaterial` (depois da luz do Three.js):

```glsl
// vértice
vec3 s = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
vGlyphPos = transformed * s;            // metros no espaço local
vGlyphNormal = objectNormal / s;
// fragmento, depois de <dithering_fragment>
vec3 n = abs(normalize(vGlyphNormal));
vec2 plane = n.y > max(n.x, n.z) ? vGlyphPos.xz : n.x > n.z ? vGlyphPos.zy : vGlyphPos.xy;
vec2 cell = vec2(CELL, CELL * 1.25);
vec2 grid = floor(plane / cell), inside = fract(plane / cell);
float grain = hash(vec3(grid, faceId));
vec3 lit = gl_FragColor.rgb; lit = lit / (1. + lit * .9);
float tone = dot(pow(lit, vec3(.4545)), vec3(.2126, .7152, .0722));
float level = clamp(floor(tone * 1.5 * 6. + grain * .85) / 6., 0., .999);   // 6 degraus
float ink = smoothstep(.1, .45, glyphAt(rampStart + floor(level * rampLen), inside));
vec3 hue = lit / max(dot(lit, vec3(.2126, .7152, .0722)), .002);
vec3 letter = hue * pow(.18 + level * .82, 2.2) * STRENGTH * .5;
gl_FragColor = vec4(mix(lit * GAP /* ≈.012 */, letter, ink), .85);   // ID glyph
```

No passe de tela, pixels `.85` saem por aqui:
`ink = pow(cor, .4545) × brilho → luz local → elevação → ink/(1 + .42ink)`.
O fundo precisa ser `0` (a gama transforma "quase preto" em cinza).

## Passo 4 — Corpos de letras (orgânicos, criaturas)

```ts
const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
// pontos espaçados: hash de células em mundo, compartilhado pelo corpo inteiro
for (…) { sampler.sample(p, n); const k = cellKey(p.applyMatrix4(world)); if (!taken.has(k)) { taken.add(k); push(p, n, seed) } }
const points = new THREE.Points(geometry, lettersMaterial); mesh.add(points)  // anda com o membro
```

```glsl
// vértice
float facing = dot(normalize(mat3(viewMatrix) * n), vec3(0, 0, 1));
float light = ambient + max(dot(n, moon), 0.) * .7 + lamp * .9 + fire * .8;
vIndex = rampStart + 1. + floor(clamp(light * .62 + (seed - .5) * .3, .08, .999) * (rampLen - 1.));
vColor = tint * (.35 + light * .8);
gl_PointSize = facing < cutoff ? 0. : LETTER_METERS * pixelScale;  // pixelScale = altura / (top − bottom)
// fragmento
vec2 uv = vec2((gl_PointCoord.x - .5) * 1.25 + .5, 1. - gl_PointCoord.y);
if (texture2D(atlas, …).r < .38) discard;
gl_FragColor = vec4(vColor, .85);
```

Malha original: aberta (`colorWrite = false`, mantém sombra) para copas e
pedras; oclusor de cor mínima para criaturas. Atlas **sem mipmap**.

## Passo 5 — Tapete de letras de pé

`InstancedBufferGeometry` de um plano 1×1 (4 segmentos verticais), atributos
`offset`, `shape(glifo, largura, altura, fase)`, `bladeColor`. No vértice:
plano voltado para a direita da câmera (`right × position.x × largura`),
altura com vento `sin(t·1.65 + x·.65 + z·.35)·.11` aplicado em `y²`,
afastamento de atores `away/|away| × (1 − d/r)²`. Para mundo infinito:
`base.xz = herói + mod(offset − herói + span/2, span) − span/2`. Fragmento:
`discard` se tinta < .22; cor × (.55 + .75·uv.y).

## Passo 6 — Partículas de glifo

`THREE.Points` com `position`, `inkColor`, `shape(glifo, tamanho m, alpha)`,
`gl_PointSize = tamanho × pixelScale × 1.45`, oclusão comparando
`gl_FragCoord.z` com a textura de profundidade do mundo. Use para fogo, magia,
poeira, anéis, vagalumes, neve.

## Passo 7 — Água em letras + reflexo

```ts
// câmera espelhada no plano y = nível
mirror.copy(camera); mirror.position.y = 2 * nível − eye.y; look.y = 2 * nível − look.y
up.reflect(normal); mirror.up.copy(up); mirror.lookAt(look)
reflectionMatrix = bias × mirror.projection × mirror.inverseWorld
// render da cena (água oculta, plano de recorte acima da água) num alvo 640²
```

```glsl
vec2 cell = vec2(.15, .19), plane = p.xz - flow * time;
vec2 grid = floor(plane / cell), inside = fract(plane / cell);
vec3 centre = vec3((grid.x + .5) * cell.x + flow.x * time, p.y, (grid.y + .5) * cell.y + flow.y * time);
vec4 m = reflectionMatrix * vec4(centre, 1.); vec2 uv = m.xy / m.w;
uv.x += sin(grid.y * 1.3 + time * 2.1) * .006;                 // tremor por fileira
vec4 seen = texture2D(reflection, uv);
if (objeto && luminância > .05 && fract(grid.y / 4.) > .26) → letra (rampa ator) com a cor refletida
else if (crista > .12) → espuma " .,:*+oO"
else if (grain >= .22 + swell * .22) → fileira " .-_~=~-" em (.07,.17,.22) + brilho de lua
else → 0
```

## Passo 8 — Fogo em grade de calor

```ts
const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
const toward = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).setY(0).normalize().multiplyScalar(.45)
for (let r = 0; r < 13; r++) for (let c = -5; c <= 5; c++) {
  const h = r / 12, width = 5.5 * (1 - h * .8) * (.85 + .15 * Math.sin(t * 2.3 + r * .7))
  const shape = 1 - Math.abs(c + Math.sin(t * 1.7 + r * .45) * h * 1.6) / Math.max(.6, width)
  if (shape <= 0) continue
  const heat = shape ** 1.6 * (1 - h * .85) * 1.7 + noise * .3 + flicker * .2 - .12
  if (heat < .14) continue
  const [glyph, colour] = RAMP[Math.min(7, Math.floor((1 - Math.min(1, heat)) * 8))]  // @ # % x * + : .
  cloud.push(camp.x + toward.x + right.x * c * .15, .2 + r * .19, camp.z + toward.z + right.z * c * .15, .21, glyph, colour, .95)
}
```

## Passo 9 — Mundo em circuito

```ts
const L = chunks * 20, R = L / (2 * Math.PI)            // comprimento pelo tempo da caçada
const n = [round(R * .043), round(R * .11), round(R * .27)]   // inteiros → fecha
const wobble = (t) => 2.4 * sin(n0 * t) + 1.2 * sin(n1 * t + 1.3) + .45 * sin(n2 * t + .4)
point(s): t = s / R; r = R + wobble(t); x = r·sin t; z = cz + r·cos t
nearest(x, z) = atan2(x, z − cz) · R ; offset = |(x, z − cz)| − (R + wobble)
```

Pedaços de 20 m por índice `floor(s/20) mod N`, semeados pelo índice, mantidos de
−1 a +2. Piso e tapete infinitos no shader (máscara `trailOffset`). Ritmo:
`base = clamp(metros que faltam / segundos que faltam / média do programa, .35, 1.45)`
× `paceAt(t)`.

## Passo 10 — Ordem de desenho

```ts
reflection.render(renderer, camera)
renderer.setRenderTarget(target); renderer.render(scene, camera)
renderer.setRenderTarget(null);   renderer.render(asciiScene, quadCamera)
renderer.autoClear = false
renderer.render(grassScene, camera); renderer.render(waterScene, camera)
renderer.render(rainScene, camera);  renderer.render(effectsScene, camera)
renderer.autoClear = true
```

## Checklist de fidelidade

- [ ] Nenhum objeto de cenário no passe de tela (exceto escolhas explícitas).
- [ ] Fundo entre letras `0`/≈1%; sombreamento por degrau de letra.
- [ ] Orgânicos como nuvem de letras; sólidos retos com grade local.
- [ ] Tapete de letras de pé em todo chão aberto.
- [ ] Água e reflexo em letras por célula; nunca imagem contínua.
- [ ] Efeitos só com glifos; sem sprites borrados.
- [ ] Atlas de point sprite sem mipmap; `dt` limitado a `[0, .08]`.
- [ ] Capturas antes/depois em movimento.
