/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves a project site at https://<user>.github.io/<repo>/,
  // so every asset URL has to start with the repo name.
  base: '/five-minute-hero/',
  test: {
    include: ['src/**/*.test.ts'],
  },
})
