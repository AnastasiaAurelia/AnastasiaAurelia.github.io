const VISUALS = {
  'token-configuration': {
    src: '/articles/proxima-bundler/01-token-configuration.webp',
    alt: 'Proxima token configuration screen showing token details for the tutorial token.',
    caption: 'Token configuration · ~01:18. This layer defines the asset metadata; execution behavior is configured later.',
  },
  'launch-modes': {
    src: '/articles/proxima-bundler/02-launch-modes.webp',
    alt: 'Proxima launch settings screen with Block-0, Organic, and Manual launch modes.',
    caption: 'Launch settings · ~02:26. Block-0 is presented as execution-first; Organic mode spreads activity over time.',
  },
  'wallet-selection': {
    src: '/articles/proxima-bundler/03-wallet-selection.webp',
    alt: 'Proxima wallet selection interface for assigning wallets to a launch.',
    caption: 'Wallet selection · ~03:18. Several addresses can be coordinated by one launch workflow.',
  },
  'funder-distribution': {
    src: '/articles/proxima-bundler/04-funder-distribution.webp',
    alt: 'Proxima launch dashboard showing a funder and participating wallet rows before launch.',
    caption: 'Funding and distribution · ~03:48. The funder acts as the capital hub before wallet-level execution.',
  },
  'live-launch-dashboard': {
    src: '/articles/proxima-bundler/05-live-launch-dashboard.webp',
    alt: 'Proxima live launch dashboard with market chart, wallet status, and launch controls.',
    caption: 'Live launch management · ~05:26. Market state and coordinated wallet state are visible in the same control surface.',
  },
  'build-complete': {
    src: '/articles/proxima-bundler/06-build-complete.webp',
    alt: 'Proxima dashboard after the coordinated launch build reports success.',
    caption: 'Build completion · ~06:19. Here “build” means the configured launch execution completed, not software compilation.',
  },
  'organic-mode': {
    src: '/articles/proxima-bundler/07-organic-mode.webp',
    alt: 'Proxima Organic Mode launch settings screen.',
    caption: 'Organic mode · ~07:54. The recording describes buys being spread across multiple blocks, increasing market exposure.',
  },
  'organic-wallet-funding': {
    src: '/articles/proxima-bundler/08-organic-wallet-funding.webp',
    alt: 'Proxima Organic Mode wallet dashboard after the participating wallets are funded.',
    caption: 'Organic-mode wallets funded · ~09:17. The timing pattern changes, but the wallets remain centrally configured.',
  },
} as const

export function ProximaBundlerVisual({ id }: { id: string }) {
  const visual = VISUALS[id as keyof typeof VISUALS]
  if (!visual) return null

  return (
    <figure className="article-figure my-10">
      <img
        src={visual.src}
        alt={visual.alt}
        className="w-full rounded-sm border border-line"
        loading="lazy"
      />
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-muted">{visual.caption}</figcaption>
    </figure>
  )
}
