import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroSignature } from './hero-signature'
import { SITE } from '@/content/site'
import type { CredibilityPoint } from '@/lib/sanity/types'

interface HeroProps {
  headline: string
  supportingCopy: string
  credibilityPoints?: CredibilityPoint[]
}

export function Hero({ headline, supportingCopy, credibilityPoints }: HeroProps) {
  return (
    <section className="container-editorial relative section-y-tight pt-14 sm:pt-20">
      {/* The reticle now frames just this block (eyebrow + headline + dek)
          instead of the whole section, so it reads as a frame around the
          headline rather than a faint mark lost in the section's empty
          space below the CTA row. -m-5/p-5 give it breathing room without
          shifting anything else's spacing. */}
      <div className="relative -m-5 p-5">
        <HeroSignature />

        <p className="hero-enter label-mono text-accent">{SITE.positioning}</p>

        <h1
          className="hero-enter mt-4 max-w-4xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '90ms' }}
        >
          {headline}
        </h1>

        <p className="hero-enter mt-6 max-w-xl text-lg text-ink-muted" style={{ animationDelay: '220ms' }}>
          {supportingCopy}
        </p>
      </div>

      {credibilityPoints && credibilityPoints.length > 0 ? (
        <ul
          className="hero-enter mt-6 flex flex-wrap gap-x-8 gap-y-2"
          style={{ animationDelay: '260ms' }}
        >
          {credibilityPoints.map((point) => (
            <li key={point.statement} className="text-sm text-ink-muted">
              <span className="font-medium text-ink">{point.statement}</span>
              {point.detail ? <span className="text-ink-faint"> — {point.detail}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="hero-enter mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: '320ms' }}>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
        >
          Selected work
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <a href="#evidence-index" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
          What counts as evidence →
        </a>
      </div>
    </section>
  )
}
