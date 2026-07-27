import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// GitHub user site: the repo is "AnastasiaAurelia.github.io", so the
// public site is served at the domain root, /. This is the single place
// that path is defined — main.tsx derives BrowserRouter's basename from
// Vite's resulting import.meta.env.BASE_URL instead of repeating it.
//
// Only applied to the production build: the dev server keeps serving at
// / so `npm run dev` is unaffected. `vite preview` after a build also
// serves at /, matching GitHub Pages exactly.
const REPO_BASE = '/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
