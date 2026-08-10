import type { SanityImageObject } from '@sanity/image-url'
import type { PortableTextBlock } from '@portabletext/types'

/**
 * Shapes matching the Studio schema exactly (`studio/schemaTypes`).
 * These are the raw documents GROQ returns — `src/content` no longer
 * defines its own competing shape; pages consume these directly.
 */

export interface SanityImageWithAlt extends SanityImageObject {
  alt: string
  caption?: string
}

export interface GalleryImage extends SanityImageWithAlt {
  label?: string
}

export type ProjectType =
  | 'Computer Vision'
  | 'Applied AI'
  | 'Research Intelligence'
  | 'Agentic Workflow'
  | 'Product Management'
  | 'Other'

/** A `projectSection` Portable Text block — a chapter marker inline in `content`. */
export interface ProjectSectionBlock {
  _type: 'projectSection'
  _key: string
  title: string
  identifier: string
  introText?: string
}

export interface MetricHighlightBlock {
  _type: 'metricHighlight'
  _key: string
  label: string
  value: string
  context: string
}

export interface DecisionCalloutBlock {
  _type: 'decisionCallout'
  _key: string
  decision: string
  reasoning: string
  consequence?: string
}

export interface ArchitectureDiagramBlock extends SanityImageObject {
  _type: 'architectureDiagram'
  _key: string
  alt: string
  caption?: string
  explanation?: string
}

export interface CodeBlock {
  _type: 'code'
  _key: string
  language?: string
  code: string
  filename?: string
}

/** Any member of `project.content` — standard blocks plus the custom ones. */
export type ProjectContentBlock =
  | PortableTextBlock
  | ProjectSectionBlock
  | MetricHighlightBlock
  | DecisionCalloutBlock
  | ArchitectureDiagramBlock
  | CodeBlock
  | (SanityImageObject & { _type: 'image'; _key: string; alt: string; caption?: string })

export interface SanityProject {
  _id: string
  _updatedAt: string
  title: string
  slug: string
  shortSummary: string
  projectType: ProjectType
  coverImage?: SanityImageWithAlt
  tags: string[]
  featured: boolean
  displayOrder: number
  content: ProjectContentBlock[]
  gallery?: GalleryImage[]
  externalUrl?: string
  githubUrl?: string
  seoTitle?: string
  seoDescription?: string
}

/** Card-level projection used for listings — no `content`/`gallery`. */
export type SanityProjectSummary = Pick<
  SanityProject,
  | '_id'
  | 'title'
  | 'slug'
  | 'shortSummary'
  | 'projectType'
  | 'coverImage'
  | 'tags'
  | 'featured'
  | 'displayOrder'
  | 'externalUrl'
  | 'githubUrl'
>

export interface SanityExperience {
  _id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  summary?: string
  achievements?: string[]
  displayOrder: number
  visible: boolean
  secondary?: boolean
}

export interface CredibilityPoint {
  statement: string
  detail?: string
}

export interface CapabilityGroup {
  title: string
  description: string
  capabilities?: string[]
}

/** The inline image block for `article.body` — see `articleImage.ts`. Individual array member, freely reorderable. */
export interface ArticleImageBlock extends SanityImageObject {
  _type: 'articleImage'
  _key: string
  alt: string
  caption?: string
  source?: string
  sourceUrl?: string
  layout?: 'normal' | 'wide' | 'full'
}

/** Any member of `article.body` — standard blocks plus the custom ones. */
export type ArticleContentBlock =
  | PortableTextBlock
  | ArticleImageBlock
  | MetricHighlightBlock
  | DecisionCalloutBlock
  | ArchitectureDiagramBlock
  | CodeBlock
  | { _type: 'math'; _key: string; latex: string; display?: boolean; databaseDefinition?: string }
  | { _type: 'dataTable'; _key: string; caption?: string; headers: string[]; rows?: Array<{ _key: string; cells: string[] }> }
  | { _type: 'callout'; _key: string; title: string; body: string; tone?: 'info' | 'warning' | 'success' }
  | { _type: 'processDiagram'; _key: string; title: string; variant?: 'pipeline' | 'timeline'; steps: Array<{ _key: string; label: string; field?: string }>; relationships?: string[]; warning?: string; caption?: string }
  | SwimlaneDiagramBlock

export interface SwimlaneDiagramBlock {
  _type: 'swimlaneDiagram'
  _key: string
  title: string
  summary?: string
  lanes: Array<{
    _key: string
    name: string
    nodes: Array<{
      _key: string
      label: string
      detail?: string
      state?: 'process' | 'decision' | 'pending' | 'blocked' | 'success'
      transitions?: string[]
    }>
  }>
  caption?: string
}

export type ArticleCategory =
  | 'Applied AI'
  | 'Product Management'
  | 'Computer Vision'
  | 'Computer Vision / Data Validation'
  | 'Data Validation / Systems Reconciliation'
  | 'Computer Vision / Performance Diagnostics'
  | 'Data Quality / Measurement Systems'
  | 'Computer Vision / Statistical Validation'
  | 'Computer Vision / Machine Learning'
  | 'Computer Vision / Infrastructure'
  | 'Product Systems / Systems Design'
  | 'Research'
  | 'Agentic Workflows'
  | 'Career'
  | 'Other'

export interface SanityArticle {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: SanityImageWithAlt
  publishedAt: string
  updatedAtOverride?: string
  tags: string[]
  category?: ArticleCategory
  featured: boolean
  role?: string
  projectType?: string
  system?: string
  coreQuestion?: string
  evidence?: string
  status?: string
  body: ArticleContentBlock[]
  seoTitle?: string
  seoDescription?: string
  socialShareImage?: SanityImageWithAlt
}

/** Card-level projection used for listings — no `body`. */
export type SanityArticleSummary = Pick<
  SanityArticle,
  '_id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt' | 'tags' | 'category' | 'featured'
>

export interface Education {
  institution: string
  program: string
  location?: string
  startDate: string
  endDate?: string
  status?: string
  coursework?: string[]
  honors?: string[]
  sortOrder: number
}

export interface Publication {
  title: string
  venue: string
  year: string
  url?: string
  sortOrder: number
}

export interface SkillGroup {
  title: string
  skills: string[]
  sortOrder: number
}

export interface ImpactStat {
  value: string
  label: string
  sortOrder: number
}

export interface TechnicalWorkHighlight {
  cvTitle: string
  cvSummary: string
  sortOrder: number
  article?: { title: string; slug: string } | null
}

export interface SanitySiteSettings {
  homepageHeadline: string
  homepageSupportingCopy: string
  credibilityPoints?: CredibilityPoint[]
  name?: string
  positioning?: string
  location?: string
  aboutContent?: PortableTextBlock[]
  capabilityGroups?: CapabilityGroup[]
  keyImpact?: ImpactStat[]
  technicalWork?: TechnicalWorkHighlight[]
  education?: Education[]
  publications?: Publication[]
  skillGroups?: SkillGroup[]
  contactEmail: string
  linkedinUrl?: string
  githubUrl?: string
  resumeUrl?: string
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  socialShareImage?: SanityImageWithAlt
}
