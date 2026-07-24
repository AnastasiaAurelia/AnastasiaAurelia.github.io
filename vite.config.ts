import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// GitHub project site: the repo is "REPOSITORY" (owner AnastasiaAurelia),
// not a <user>.github.io repo and no CNAME exists, so the public site is
// served under /REPOSITORY/, not /. This is the single place that path
// is defined — main.tsx derives BrowserRouter's basename from Vite's
// resulting import.meta.env.BASE_URL instead of repeating it.
//
// Only applied to the production build: the dev server keeps serving at
// / so `npm run dev` is unaffected. `vite preview` after a build serves
// at /REPOSITORY/, matching GitHub Pages exactly.
const REPO_BASE = '/REPOSITORY/'

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
