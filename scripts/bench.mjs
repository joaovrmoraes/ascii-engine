import { execFileSync, spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { cpus, platform, release, arch, totalmem } from 'node:os'
import { join, resolve } from 'node:path'
import { benchmarkBrowser } from './bench-browser.mjs'
import { summarize as summary } from './bench-stats.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).map(argument => {
    const [key, ...value] = argument.replace(/^--/, '').split('=')
    if (!['round', 'frames', 'warmup', 'runs', 'out', 'verify', 'uncapped'].includes(key))
      throw new Error('Unknown option: ' + argument)
    return [key, value.length ? value.join('=') : true]
  }),
)
const verify = args.verify === true
if (args.uncapped !== undefined && args.uncapped !== true)
  throw new Error('Use --uncapped without a value')
const uncapped = args.uncapped === true
const frames = Number(args.frames ?? 600),
  warmup = Number(args.warmup ?? 600),
  runs = Number(args.runs ?? 5)
if (
  !verify &&
  (!Number.isInteger(frames) ||
    frames < 600 ||
    !Number.isInteger(runs) ||
    runs < 5 ||
    !Number.isInteger(warmup) ||
    warmup < 60)
)
  throw new Error('Use at least 600 measured frames, 5 runs and 60 warm-up frames')
const date = new Date().toISOString().slice(0, 10),
  round = String(args.round ?? (uncapped ? 'uncapped-round-1' : 'round-1'))
if (!/^[a-z0-9-]+$/.test(round)) throw new Error('Invalid round name')
const root = resolve(import.meta.dirname, '..'),
  output = resolve(
    args.out ?? join(root, 'docs/captures', `benchmarks-${date}`),
    verify ? 'verification' : round,
  )
const base = process.env.EDITOR_URL ?? 'http://localhost:1440'
await mkdir(output, { recursive: true })
if (
  !verify &&
  (await readFile(join(output, 'environment.json')).then(
    () => true,
    () => false,
  ))
)
  throw new Error('Round already exists; choose a new --round name to preserve raw measurements')
const read = path =>
  readFile(path, 'utf8').then(
    value => value.trim(),
    () => null,
  )
const command = (name, argv = []) => {
  const result = spawnSync(name, argv, { encoding: 'utf8', timeout: 5000 })
  return result.status === 0 ? result.stdout.trim() : null
}
const environment = {
  timestamp: new Date().toISOString(),
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  trackedChanges: execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
    cwd: root,
    encoding: 'utf8',
  }).trim(),
  framePacing: uncapped ? 'uncapped' : 'display',
  cpu: { model: cpus()[0].model, logicalCores: cpus().length },
  os: {
    platform: platform(),
    release: release(),
    arch: arch(),
    distribution: await read('/etc/os-release'),
  },
  memoryBytes: totalmem(),
  power: {
    profile: command('powerprofilesctl', ['get']),
    governor: await read('/sys/devices/system/cpu/cpu0/cpufreq/scaling_governor'),
    driver: await read('/sys/devices/system/cpu/cpu0/cpufreq/scaling_driver'),
    energyPreference: await read(
      '/sys/devices/system/cpu/cpu0/cpufreq/energy_performance_preference',
    ),
  },
}
if (!verify && environment.trackedChanges)
  throw new Error('Commit the benchmark source before measuring; tracked working tree is dirty')
const browser = await benchmarkBrowser({ uncapped })
Object.assign(environment, { chromium: browser.version, flags: browser.flags })
const columns = [
  'frame',
  'frameMs',
  'rafIntervalMs',
  'frameCpuMs',
  'renderCpuMs',
  'sceneCpuMs',
  'waterStep',
  'waterUpload',
  'skinning',
  'effects',
  'carpet',
  'bodyUniforms',
  'renderRest',
  'drawCalls',
  'triangles',
  'points',
  'gpuMs',
]
const flatten = sample => ({
  frame: sample.frame,
  frameMs: sample.frameMs,
  rafIntervalMs: sample.rafIntervalMs,
  frameCpuMs: sample.frameCpuMs,
  renderCpuMs: sample.cpuMs,
  sceneCpuMs: sample.sceneCpuMs,
  ...sample.timings,
  drawCalls: sample.drawCalls,
  triangles: sample.triangles,
  points: sample.points,
  gpuMs: sample.gpuMs,
})
const scenes = ['water', 'particles', 'skinning'],
  results = Object.fromEntries(scenes.map(name => [name, { scene: name, columns, runs: [] }]))
try {
  if (verify) {
    const checks = []
    for (const scene of scenes) {
      const states = []
      for (const profile of ['on', 'off']) {
        await browser.navigate(`${base}/?bench=${scene}&profile=${profile}`)
        const result = await browser.evaluate('benchmark.run(60,180)')
        await browser.check()
        if (
          result.samples.some(
            sample => !Number.isFinite(sample.rafIntervalMs) || sample.frameMs < sample.frameCpuMs,
          )
        )
          throw new Error('Frame wall interval does not contain its active CPU work')
        if (
          result.viewport.width !== 1920 ||
          result.viewport.height !== 1080 ||
          result.viewport.dpr !== 1
        )
          throw new Error('Incorrect viewport')
        if (scene === 'skinning' && result.fingerprint.skinnedPoints < 1)
          throw new Error('No skinned glyphs')
        const image = await browser.send('Page.captureScreenshot', { format: 'png' })
        await writeFile(
          join(output, scene + '-' + profile + '.png'),
          Buffer.from(image.data, 'base64'),
        )
        states.push(result.fingerprint)
      }
      if (JSON.stringify(states[0]) !== JSON.stringify(states[1]))
        throw new Error('Profiling changes simulation: ' + scene)
      checks.push({ scene, fingerprint: states[0], parity: 'exact', storageCalls: 0 })
      console.log('PASS fixed-step state and profiling on/off parity; no IndexedDB:', scene)
    }
    await writeFile(
      join(output, 'parity.json'),
      JSON.stringify({ environment, checks }, null, 2) + '\n',
    )
  } else {
    for (let run = 1; run <= runs; run++)
      for (const scene of scenes) {
        console.log(
          `START ${round} ${scene} ${run}/${runs}; ${warmup} warm-up + ${frames} measured frames`,
        )
        await browser.navigate(`${base}/?bench=${scene}&run=${run}`)
        const before = {
          timestamp: new Date().toISOString(),
          frequencyKHz: await read('/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq'),
        }
        const result = await browser.evaluate(`benchmark.run(${warmup},${frames})`)
        await browser.check()
        environment.gpu = {
          renderer: result.browser.renderer,
          vendor: result.browser.vendor,
          timer: result.gpu,
        }
        environment.timerResolutionMs = result.browser.timerResolutionMs
        await writeFile(
          join(output, 'environment.json'),
          JSON.stringify(environment, null, 2) + '\n',
        )
        if (
          result.samples.length !== frames ||
          result.visibilityChanges ||
          !result.browser.isolated ||
          result.samples.some(
            sample => !Number.isFinite(sample.rafIntervalMs) || sample.frameMs < sample.frameCpuMs,
          )
        )
          throw new Error('Invalid benchmark run')
        if (
          result.viewport.width !== 1920 ||
          result.viewport.height !== 1080 ||
          result.viewport.dpr !== 1
        )
          throw new Error('Incorrect benchmark viewport')
        const rows = result.samples.map(flatten),
          stats = summary(rows)
        const { samples, ...metadata } = result
        const entry = {
          run,
          before,
          after: {
            timestamp: new Date().toISOString(),
            frequencyKHz: await read('/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq'),
          },
          metadata,
          summary: stats,
          samples: rows.map(row => columns.map(key => row[key])),
        }
        const sceneResult = results[scene]
        sceneResult.runs.push(entry)
        const allRows = sceneResult.runs.flatMap(r =>
          r.samples.map(values => Object.fromEntries(columns.map((key, i) => [key, values[i]]))),
        )
        sceneResult.summary = summary(allRows)
        await writeFile(join(output, scene + '.json'), JSON.stringify(sceneResult) + '\n')
        console.log(
          `DONE ${scene} ${run}: frame p50/p95=${stats.frameMs.p50.toFixed(3)}/${stats.frameMs.p95.toFixed(3)} ms; CPU p50=${stats.frameCpuMs.p50.toFixed(3)} ms; GPU p50=${stats.gpuMs.p50?.toFixed(3) ?? 'unavailable'} ms`,
        )
      }
  }
  await writeFile(join(output, 'environment.json'), JSON.stringify(environment, null, 2) + '\n')
} finally {
  await browser.close()
}
