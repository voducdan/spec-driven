import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/spec-driven/' : '/',
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2015', // Use more compatible ES2015 target
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Force everything into a single bundle for GitHub Pages compatibility
        inlineDynamicImports: true,
        format: 'es', // Use ES modules but more compatible
      },
    },
  },
})
