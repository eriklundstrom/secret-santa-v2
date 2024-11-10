import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  assetsInclude: ['**/*.glb'],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    port: '3000',
    host: '0.0.0.0',
  },
})
