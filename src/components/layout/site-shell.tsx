import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Footer } from './footer'

export function SiteShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="skip-link rounded-sm bg-ink px-4 py-2 text-sm text-paper">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
