import type {
  SanityArticle,
  SanityArticleSummary,
  SanityExperience,
  SanityProjectSummary,
  SanitySiteSettings,
} from '@/lib/sanity/types'

/** Shared fixtures for tests that mock `@/lib/sanity/fetch` — kept realistic so tests stay meaningful. */

export const fixtureSiteSettings: SanitySiteSettings = {
  homepageHeadline: 'I turn messy AI work into clear, reliable systems teams can ship on time.',
  homepageSupportingCopy:
    'Less ambiguity, less manual checking, fewer late-night firefights — across computer vision, research intelligence, and agentic workflows.',
  credibilityPoints: [{ statement: 'Ships production AI systems', detail: 'Not just prototypes' }],
  name: 'Test Person',
  positioning: 'AI Product Manager | Test Positioning',
  location: 'Jakarta, Indonesia',
  aboutContent: [],
  capabilityGroups: [
    {
      title: 'Turn ambiguity into action',
      description: 'I turn vague, messy problems into clear priorities, owners, decisions, and next steps.',
    },
  ],
  keyImpact: [
    { value: '100,000+', label: 'Production transactions reviewed', sortOrder: 0 },
    { value: '5', label: 'Production LPR sites', sortOrder: 1 },
  ],
  technicalWork: [
    {
      cvTitle: 'Linked Technical Work',
      cvSummary: 'Has a live case study.',
      sortOrder: 0,
      article: { title: 'Featured Test Article', slug: 'featured-test-article' },
    },
    {
      cvTitle: 'Unlinked Technical Work',
      cvSummary: 'No case study exists yet, so this renders as text only.',
      sortOrder: 1,
      article: null,
    },
  ],
  education: [
    {
      institution: 'Test University',
      program: 'Test Program',
      startDate: '2018-08',
      endDate: '2022-01',
      coursework: ['Probability', 'Statistics'],
      honors: ['Most Outstanding Student'],
      sortOrder: 0,
    },
  ],
  publications: [{ title: 'Test Publication', venue: 'Test Venue', year: '2023', sortOrder: 0 }],
  skillGroups: [{ title: 'Data & Experimentation', skills: ['SQL', 'Python'], sortOrder: 0 }],
  contactEmail: 'your-email@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/test-profile',
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
    caseStudyArticle: undefined,
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
    caseStudyArticle: {
      title: 'Featured Test Article',
      slug: 'featured-test-article',
      excerpt: 'The canonical article summary replaces stale project placeholder copy.',
    },
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
    caseStudyArticle: undefined,
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
    caseStudyArticle: undefined,
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
    secondary: false,
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
    secondary: false,
  },
  {
    // Secondary/additional experience — exercises the About page's split
    // between the primary Experience list and Additional Experience.
    _id: 'experience-secondary',
    company: 'Kawai Piano Gallery',
    role: 'Piano Instructor',
    startDate: '2024-05-01',
    endDate: undefined,
    isCurrent: true,
    summary: undefined,
    achievements: [],
    displayOrder: 2,
    visible: true,
    secondary: true,
  },
]
