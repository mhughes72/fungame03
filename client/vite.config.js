import { defineConfig } from 'vite'

const BUILT_IN_MODES = new Set(['production', 'development', 'staging'])

export default defineConfig(({ mode }) => ({
  define: {
    // Expose VITE_SKIN to import.meta.env — any --mode that isn't a Vite
    // built-in is treated as a skin name (e.g. --mode love-boat → 'love-boat').
    'import.meta.env.VITE_SKIN': JSON.stringify(
      BUILT_IN_MODES.has(mode) ? 'default' : mode
    ),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // SSE needs these — disable buffering
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Accept', 'text/event-stream')
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
