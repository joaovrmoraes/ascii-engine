import { startBridge } from './bridge'
const bridge = await startBridge()
console.error('ASCII Engine API at http://127.0.0.1:1442')
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { void bridge.close().then(() => process.exit(0)) })
