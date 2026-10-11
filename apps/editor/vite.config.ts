import { defineConfig } from 'vite'

// Porta 1440 para não colidir com o Pomorog (1420/1430).
export default defineConfig({
  clearScreen: false,
  server: { port: 1440, strictPort: true },
  build: { target: 'es2022' },
})
