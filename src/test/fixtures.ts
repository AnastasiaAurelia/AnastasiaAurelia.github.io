import type {
  SanityArticle,
  SanityArticleSummary,
  SanityExperience,
  SanityProjectSummary,
  SanitySiteSettings,
} from '@/lib/sanity/types'

/** Shared fixtures for tests that mock `@/lib/sanity/fetch` — kept realistic so tests stay meaningful. */

export const fixtureSiteSettings: SanitySiteSettings = {
  homepageHeadline: 'Computer Vision, Applied AI & Agentic Workflows',
  homepageSupportingCopy:
    'Product leadership across computer vision, applied AI, and agentic systems — from problem framing to production reliability.',
  credibilityPoints: [{ statement: 'Ships production AI systems', detail: 'Not just prototypes' }],
  aboutContent: [],
  capabilityGroups: [
    {
      title: 'Computer Vision Products',
      description: 'Turning perception models into products that hold up outside the lab.',
      capabilities: ['Detection', 'Recognition', 'Reliability engineering'],
    },
  ],
  contactEmail: 'your-email@gmail.com',
  linkedinUrl: undefined,
  githubUrl: undefined,
  resumeUrl: undefined,
  defaultSeoTitle: undefined,
  defaultSeoDescription: undefined,
  socialShareImage: undefined,
}

export const fixtureProjects: SanityProjectSummary[] = [
  {
    _id: 'project-computer-vision-lpr',
    title: 'Computer Vision and LPR Reliability',
    slug: 'computer-vision-lpr',
    shortSummary: 'A computer vision system for license plate recognition, built with a focus on real-world reliability.',
    projectType: 'Computer Vision',
    coverImage: undefined,
    tags: ['Computer Vision', 'Reliability Engineering'],
    featured: true,
    displayOrder: 0,
    externalUrl: undefined,
    githubUrl: undefined,
  },
  {
    _id: 'project-researchlens',
    title: 'ResearchLens',
    slug: 'researchlens',
    shortSummary: 'Applied AI product. Full case study not yet supplied.',
    projectType: 'Applied AI',
    coverImage: undefined,
    tags: ['Applied AI'],
    featured: true,
    displayOrder: 1,
    externalUrl: undefined,
    githubUrl: undefined,
  },
  {
    _id: 'project-agentic-workflows',
    title: 'Agentic Workflows',
    slug: 'agentic-workflows',
    shortSummary: 'Case study on designing and shipping agentic workflows.',
    projectType: 'Agentic Workflow',
    coverImage: undefined,
    tags: ['Agentic Workflow', 'Applied AI'],
    featured: true,
    displayOrder: 2,
    externalUrl: undefined,
    githubUrl: undefined,
  },
  {
    // Deliberately not featured — exercises the featured-filter, not just
    // the happy path where every fixture happens to be featured.
    _id: 'project-unfeatured-experiment',
    title: 'Unfeatured Experiment',
    slug: 'unfeatured-experiment',
    shortSummary: 'A project that should appear in the full index but never in Selected Work.',
    projectType: 'Other',
    coverImage: undefined,
    tags: [],
    featured: false,
    displayOrder: 3,
    externalUrl: undefined,
    githubUrl: undefined,
  },
]

export const fixtureArticles: SanityArticleSummary[] = [
  {
    _id: 'article-featured',
    title: 'Featured Test Article',
    slug: 'featured-test-article',
    excerpt: 'This article is featured and should appear in the Writing index featured slot and on the homepage.',
    coverImage: undefined,
    publishedAt: '2026-06-01T00:00:00.000Z',
    tags: ['test'],
    category: 'Applied AI',
    featured: true,
  },
  {
    _id: 'article-second',
    title: 'Second Test Article',
    slug: 'second-test-article',
    excerpt: 'A second, non-featured article for list/order/filter tests.',
    coverImage: undefined,
    publishedAt: '2026-05-01T00:00:00.000Z',
    tags: ['test'],
    category: 'Research',
    featured: false,
  },
]

export const fixtureArticleBody: SanityArticle = {
  _id: 'article-featured',
  title: 'Featured Test Article',
  slug: 'featured-test-article',
  excerpt: 'This article is featured and should appear in the Writing index featured slot and on the homepage.',
  coverImage: undefined,
  publishedAt: '2026-06-01T00:00:00.000Z',
  updatedAtOverride: undefined,
  tags: ['test'],
  category: 'Applied AI',
  featured: true,
  body: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 's1', text: 'The article body renders here.', marks: [] }],
    } as never,
  ],
  seoTitle: undefined,
  seoDescription: undefined,
  socialShareImage: undefined,
}

export const fixtureExperience: SanityExperience[] = [
  {
    _id: 'experience-1',
    company: 'Example Co',
    role: 'AI Product Manager',
    startDate: '2023-01-01',
    endDate: undefined,
    isCurrent: true,
    summary: 'Leading applied-AI product work.',
    achievements: ['Shipped a computer vision reliability initiative'],
    displayOrder: 0,
    visible: true,
  },
  {
    // Deliberately hidden — exercises the `visible` filter the mock (and
    // the real GROQ query) is supposed to apply.
    _id: 'experience-hidden',
    company: 'Should Not Appear Co',
    role: 'Hidden Role',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    isCurrent: false,
    summary: 'This entry has visible: false and must never render.',
    achievements: [],
    displayOrder: 1,
    visible: false,
  },
]
