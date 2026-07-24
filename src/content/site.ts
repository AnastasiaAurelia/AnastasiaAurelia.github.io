/**
 * Site-wide facts and editorial copy. Kept separate from project content
 * so the shell (nav, footer, homepage narrative, SEO defaults) has one
 * source of truth.
 *
 * The prose fields (`thesis`, `domains`, `capability`) elaborate the
 * given positioning line and named focus/domain areas in fuller
 * editorial language. They describe the practice areas themselves —
 * not specific claimed achievements, employers, or metrics, none of
 * which have been supplied. `social` starts empty rather than guessed —
 * add entries once real profile URLs are supplied.
 */
export interface SocialLink {
  label: string
  url: string
}

export interface Domain {
  title: string
  description: string
}

export const SITE = {
  name: 'Anastasia Aurelia',
  positioning: 'AI Product Manager',
  focusAreas: 'Computer Vision, Applied AI & Agentic Workflows',
  /** Used as the default meta description and homepage dek. */
  tagline:
    'Product leadership across computer vision, applied AI, and agentic systems — from problem framing to production reliability.',

  /** Section 02 — Professional thesis. */
  thesis:
    'Applied AI succeeds or fails at its boundary conditions — where a model meets a camera it wasn’t trained on, or an agent meets a task it wasn’t scoped for. The work is that boundary: framing the problem correctly, owning the trade-offs no one wants to own, and building the reliability layer that makes a system trustworthy enough to ship.',

  /** Section 03 — Systems and domains. */
  domains: [
    {
      title: 'Computer Vision Products',
      description:
        'Turning perception models into products that hold up outside the lab — detection and recognition systems, and the reliability work around them.',
    },
    {
      title: 'Research Intelligence',
      description:
        'Structuring technical research into product direction — the layer between raw findings and a defensible roadmap decision.',
    },
    {
      title: 'Agentic Workflows',
      description:
        'Scoping multi-step, tool-using AI systems: what an agent should own outright, and where a human deliberately stays in the loop.',
    },
    {
      title: 'Product Reliability',
      description:
        'Treating reliability as a product requirement to design for, not an operational afterthought discovered after launch.',
    },
    {
      title: 'Technical Product Operations',
      description:
        'The cross-functional mechanics of shipping applied-AI product — sequencing work and translating between research, engineering, and the business.',
    },
  ] as Domain[],

  /** Section 06 — Capability statement. */
  capability:
    'The throughline across that work is fluency at the intersection of product strategy and technical systems: judging what an AI system should do, how it should fail safely, and who is accountable when it doesn’t. That means moving between research constraints, engineering trade-offs, and the cross-functional execution required to actually ship — with reliability treated as first-class scope, not a post-launch fix.',

  email: 'your-email@gmail.com',
  social: [] as SocialLink[],
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Writing', href: '/articles' },
    { label: 'About', href: '/about' },
  ],
  /** Placeholder — replace with the real production domain before launch.
   *  Feeds canonical URLs, OG tags, and the generated sitemap. */
  url: 'https://anastasia-aurelia.example',
} as const
