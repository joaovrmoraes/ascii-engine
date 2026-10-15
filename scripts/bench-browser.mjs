import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export async function benchmarkBrowser({
  blockStorage = true,
  uncapped = false,
  disableExtensions = false,
} = {}) {
  const profile = await mkdtemp(join(tmpdir(), 'ascii-benchmark-'))
  const flags = [
    ...(disableExtensions
      ? ['--disable-extensions', '--disable-component-extensions-with-background-pages']
      : []),
    '--headless=new',
    '--no-sandbox',
    '--use-angle=gl',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    '--force-device-scale-factor=1',
    ...(uncapped ? ['--disable-gpu-vsync', '--disable-frame-rate-limit'] : []),
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ]
  const chrome = spawn('chromium', flags, { stdio: ['ignore', 'ignore', 'pipe'] })
  let stderr = ''
  chrome.stderr.on('data', data => {
    stderr += data
    if (stderr.length > 65536) stderr = stderr.slice(-65536)
  })
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  let address
  for (let i = 0; i < 200 && !address; i++) {
    address = /DevTools listening on (ws:\/\/[^\s]+)/.exec(stderr)?.[1]
    if (!address) await sleep(50)
  }
  if (!address) {
    chrome.kill()
    throw new Error('Chromium did not expose DevTools: ' + stderr.slice(-1000))
  }
  const port = new URL(address).port
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
  const socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.onopen = resolve
    socket.onerror = reject
  })
  let id = 0
  const pending = new Map(),
    errors = []
  socket.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown')
      errors.push(
        message.params.exceptionDetails.exception?.description ??
          message.params.exceptionDetails.text,
      )
    const call = pending.get(message.id)
    if (call) {
      clearTimeout(call.timer)
      pending.delete(message.id)
      message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result)
    }
  }
  function send(method, params = {}, timeout = 300000) {
    return new Promise((resolve, reject) => {
      const key = ++id,
        timer = setTimeout(() => {
          pending.delete(key)
          reject(new Error('CDP timed out: ' + method))
        }, timeout)
      pending.set(key, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: key, method, params }))
    })
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ?? result.exceptionDetails.text,
      )
    return result.result?.value
  }
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  if (blockStorage)
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `window.benchmarkStorageCalls=[];for(const method of ['open','deleteDatabase','databases'])if(IDBFactory.prototype[method])IDBFactory.prototype[method]=function(){benchmarkStorageCalls.push(method);throw new Error('IndexedDB is forbidden in benchmarks: '+method)}`,
    })
  async function extensionTargets() {
    const targets = (await send('Target.getTargets')).targetInfos
    return targets
      .filter(target => target.url.startsWith('chrome-extension://'))
      .map(({ type, url }) => ({ type, url }))
  }
  return {
    send,
    evaluate,
    extensionTargets,
    processId: chrome.pid,
    flags: flags.map(flag =>
      flag.startsWith('--user-data-dir=') ? '--user-data-dir=<isolated temporary profile>' : flag,
    ),
    version: await send('Browser.getVersion'),
    async navigate(url, ready = '!!window.benchmark?.ready') {
      errors.length = 0
      await send('Page.navigate', { url })
      await send('Page.bringToFront')
      for (let i = 0; i < 600; i++) {
        if (errors.length) throw new Error(errors.join('\n'))
        try {
          if (await evaluate(ready)) return
        } catch (error) {
          if (!/context|navigat/i.test(error.message)) throw error
        }
        await sleep(100)
      }
      throw new Error('Page did not become ready: ' + url)
    },
    async pinRenderer(cpu) {
      if (cpu === undefined) return null
      if (!Number.isInteger(cpu) || cpu < 0) throw new Error('Invalid renderer CPU')
      const candidates = []
      const ticks = async pid => {
        const stat = await readFile(`/proc/${pid}/stat`, 'utf8').catch(() => '')
        if (!stat) return -1
        const fields = stat
          .slice(stat.lastIndexOf(')') + 2)
          .trim()
          .split(/\s+/)
        return Number(fields[11]) + Number(fields[12])
      }
      for (const pid of await readdir('/proc')) {
        if (!/^\d+$/.test(pid)) continue
        const command = await readFile(`/proc/${pid}/cmdline`, 'utf8').catch(() => '')
        // Chromium rewrites argv as a space-separated process title on Linux.
        const argv = command.split(/[\0\s]+/)
        if (
          !argv.includes('--type=renderer') ||
          !argv.includes(`--user-data-dir=${profile}`) ||
          argv.includes('--extension-process') ||
          argv.includes('--top-chrome-webui')
        )
          continue
        candidates.push({ pid, before: await ticks(pid) })
      }
      // Identify this page's executing renderer, not a spare that will later inherit its mask.
      // The probe precedes all warm-up, changes no simulation state, and is not a timed sample.
      await evaluate(
        `(()=>{const until=performance.now()+150;while(performance.now()<until){};return benchmark.ready})()`,
      )
      const ranked = await Promise.all(
        candidates.map(async candidate => ({
          ...candidate,
          delta: (await ticks(candidate.pid)) - candidate.before,
        })),
      )
      ranked.sort((a, b) => b.delta - a.delta)
      const active = ranked[0]
      if (!active || active.delta < 5 || (ranked[1] && active.delta < ranked[1].delta * 2))
        throw new Error('Could not identify the active benchmark renderer unambiguously')
      const masks = async () => {
        const result = {}
        for (const tid of await readdir(`/proc/${active.pid}/task`)) {
          const status = await readFile(`/proc/${active.pid}/task/${tid}/status`, 'utf8').catch(
            () => '',
          )
          if (status) result[tid] = /^Cpus_allowed_list:\s+(.+)$/m.exec(status)?.[1]
        }
        return result
      }
      const before = await masks()
      execFileSync('taskset', ['-pc', String(cpu), active.pid], { encoding: 'utf8' })
      const after = await masks()
      if (after[active.pid] !== String(cpu)) throw new Error('Renderer affinity was not applied')
      let unchangedOtherThreads = 0
      for (const [tid, mask] of Object.entries(before)) {
        if (tid === active.pid || after[tid] === undefined) continue
        if (after[tid] !== mask) throw new Error('Affinity changed a non-main thread')
        unchangedOtherThreads++
      }
      return [
        {
          pid: Number(active.pid),
          mainThreadCpu: cpu,
          allowed: after[active.pid],
          probeMs: 150,
          probeTicks: active.delta,
          unchangedOtherThreads,
          scope: 'active benchmark page main thread only; spares excluded',
        },
      ]
    },
    async check() {
      if (errors.length) throw new Error(errors.join('\n'))
      if (disableExtensions && (await extensionTargets()).length)
        throw new Error('Extension targets are active despite --no-extensions')
      const storage = await evaluate('window.benchmarkStorageCalls')
      if (storage?.length) throw new Error('Benchmark used IndexedDB: ' + storage)
    },
    async close() {
      for (const call of pending.values()) {
        clearTimeout(call.timer)
        call.reject(new Error('Browser closed'))
      }
      pending.clear()
      socket.close()
      chrome.kill()
      if (chrome.exitCode === null) await new Promise(resolve => chrome.once('exit', resolve))
      await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    },
  }
}
