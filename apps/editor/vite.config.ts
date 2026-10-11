import { defineConfig } from 'vite'

// Porta 1440 para não colidir com o Pomorog (1420/1430).
// `base: './'`: exported games (web folder or Tauri) load assets relatively.
export default defineConfig({
  base: './',
  clearScreen: false,
  server: { port: 1440, strictPort: true },
  build: { target: 'es2022' },
})
