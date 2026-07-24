import { NavLink } from 'react-router-dom'
import { SITE } from '@/content/site'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/" className="text-base font-medium tracking-tight">
          {SITE.name}
        </NavLink>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {SITE.nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'rounded-sm px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink',
                  isActive && 'text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
