import * as path from 'path'

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from '../package.json'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: path.resolve(__dirname, '..'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, '../src/entry.ts'),
      fileName: () => 'index.js',
      formats: ['cjs'],
    },
    outDir: path.resolve(__dirname, '../api/_build'),
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies)],
    },
    minify: 'terser',
    // TODO: upload source maps to sentry
    sourcemap: true,
  },
  test: {
    environment: 'node',
  },
})
