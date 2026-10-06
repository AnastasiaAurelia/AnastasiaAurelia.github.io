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
