import { defineConfig } from 'vite'
import { startBridge } from '@ascii-engine/automation/bridge'

let closeBridge: (() => Promise<void>) | undefined

// Port 1440 avoids conflicts with Pomorog (1420/1430).
// `base: './'`: exported games (web folder or Tauri) load assets relatively.
export default defineConfig({
  base: './',
  clearScreen: false,
  plugins: [
    {
      name: 'ascii-authoring-api',
      async configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost')
          if (
            (url.pathname === '/' || url.pathname === '/benchmark.html') &&
            url.searchParams.has('bench')
          ) {
            if (!['water', 'particles', 'skinning'].includes(url.searchParams.get('bench')!)) {
              response.statusCode = 400
              response.end('Unknown benchmark scene')
              return
            }
            // Only the opt-in benchmark document gets high-resolution isolated timers.
            response.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
            request.url = `/benchmark.html${url.search}`
          }
          next()
        })
        // Dev starts the same service available separately through `pnpm api`.
        try {
          const bridge = await startBridge()
          let closing: Promise<void> | undefined
          closeBridge = () => (closing ??= bridge.close())
          server.httpServer?.once('close', () => {
            void closeBridge?.()
          })
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'EADDRINUSE') throw error
          const response = await fetch('http://127.0.0.1:1442/health').then(r => r.json())
          if (response.name !== 'ascii-engine-authoring')
            throw new Error('Port 1442 is occupied by another service.')
        }
      },
      // Vitest's middleware server has no HTTP server to emit the close event.
      closeBundle() {
        return closeBridge?.()
      },
    },
  ],
  server: { port: 1440, strictPort: true },
  build: { target: 'es2022' },
})
