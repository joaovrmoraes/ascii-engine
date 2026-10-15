import { defineConfig } from 'vite'
import { startBridge } from '@ascii-engine/automation/bridge'

// Port 1440 avoids conflicts with Pomorog (1420/1430).
// `base: './'`: exported games (web folder or Tauri) load assets relatively.
export default defineConfig({
  base: './',
  clearScreen: false,
  plugins: [
    {
      name: 'ascii-authoring-api',
      async configureServer(server) {
        // Dev starts the same service available separately through `pnpm api`.
        try {
          const bridge = await startBridge()
          server.httpServer?.once('close', () => {
            void bridge.close()
          })
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'EADDRINUSE') throw error
          const response = await fetch('http://127.0.0.1:1442/health').then(r => r.json())
          if (response.name !== 'ascii-engine-authoring')
            throw new Error('Port 1442 is occupied by another service.')
        }
      },
    },
  ],
  server: { port: 1440, strictPort: true },
  build: { target: 'es2022' },
})
