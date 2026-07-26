import { NavLink } from 'react-router-dom'
import { SITE } from '@/content/site'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="container-editorial flex items-center justify-between gap-3 py-4 sm:gap-4">
        <NavLink to="/" className="group flex flex-col leading-none">
          <span className="whitespace-nowrap text-base font-medium tracking-tight">{SITE.name}</span>
          <span className="label-mono mt-1 text-ink-faint">{SITE.positioning}</span>
        </NavLink>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {SITE.nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'rounded-sm px-2 py-2 text-sm text-ink-muted transition-colors hover:text-ink sm:px-3',
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
