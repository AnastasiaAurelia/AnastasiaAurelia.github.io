/**
 * Site-wide facts. Kept separate from project content so the shell
 * (nav, footer, homepage hero, SEO defaults) has one source of truth.
 *
 * Only verifiable facts live here. `social` starts empty rather than
 * guessed — add entries once real profile URLs are supplied.
 */
export interface SocialLink {
  label: string
  url: string
}

export const SITE = {
  name: 'Anastasia Aurelia',
  positioning: 'AI Product Manager',
  focusAreas: 'Computer Vision, Applied AI & Agentic Workflows',
  /** Used as the default meta description and homepage dek. */
  tagline:
    'Product leadership across computer vision, applied AI, and agentic systems — from problem framing to production reliability.',
  email: 'aurelanas@gmail.com',
  social: [] as SocialLink[],
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
  ],
  /** Placeholder — replace with the real production domain before launch.
   *  Feeds canonical URLs, OG tags, and the generated sitemap. */
  url: 'https://anastasia-aurelia.example',
} as const
