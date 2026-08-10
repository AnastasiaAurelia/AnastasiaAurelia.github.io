import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { readFileSync } from 'node:fs'

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
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-sanity-draft-preview',
      configureServer(server) {
        server.middlewares.use('/__draft-preview', (request, response) => {
          const slug = request.url?.replace(/^\//, '').replace(/\.json$/, '')
          if (!slug || !/^[a-z0-9-]+$/.test(slug)) { response.statusCode = 400; response.end('Invalid slug'); return }
          try { response.setHeader('Content-Type', 'application/json'); response.end(readFileSync(path.resolve(__dirname, `.sanity-drafts/${slug}.json`), 'utf8')) }
          catch { response.statusCode = 404; response.end('Draft preview not found') }
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
