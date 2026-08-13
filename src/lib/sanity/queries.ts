/**
 * Every GROQ query the frontend runs, in one place — nothing is
 * inlined in a component. Draft-exclusion is enforced at the client
 * level (`perspective: 'published'` in `client.ts`), not per-query, so
 * there's a single point of truth for "public reads never see drafts."
 */

const PROJECT_SUMMARY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  shortSummary,
  projectType,
  coverImage,
  tags,
  featured,
  displayOrder,
  externalUrl,
  githubUrl,
  "caseStudyArticle": caseStudyArticle->{ title, "slug": slug.current, excerpt },
}`

const PROJECT_FULL_PROJECTION = `{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  shortSummary,
  projectType,
  coverImage,
  tags,
  featured,
  displayOrder,
  content,
  gallery,
  externalUrl,
  githubUrl,
  "caseStudyArticle": caseStudyArticle->{ title, "slug": slug.current, excerpt },
  seoTitle,
  seoDescription,
}`

export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(displayOrder asc) ${PROJECT_SUMMARY_PROJECTION}`

export const allProjectsQuery = `*[_type == "project"] | order(displayOrder asc) ${PROJECT_SUMMARY_PROJECTION}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] ${PROJECT_FULL_PROJECTION}`

/** Used by the migration script to detect an existing document before writing. */
export const projectSlugExistsQuery = `*[_type == "project" && slug.current == $slug][0]._id`

export const visibleExperienceQuery = `*[_type == "experience" && visible == true] | order(displayOrder asc) {
  _id,
  company,
  role,
  startDate,
  endDate,
  isCurrent,
  summary,
  achievements,
  displayOrder,
  secondary,
}`

const ARTICLE_SUMMARY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  tags,
  category,
  featured,
}`

const ARTICLE_FULL_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  updatedAtOverride,
  tags,
  category,
  featured,
  role,
  projectType,
  system,
  coreQuestion,
  evidence,
  status,
  body,
  seoTitle,
  seoDescription,
  socialShareImage,
}`

const BY_FEATURED_THEN_PUBLISHED_DESC = 'order(featured desc, publishedAt desc)'

export const allArticlesQuery = `*[_type == "article"] | ${BY_FEATURED_THEN_PUBLISHED_DESC} ${ARTICLE_SUMMARY_PROJECTION}`

export const featuredArticlesQuery = `*[_type == "article" && featured == true] | ${BY_FEATURED_THEN_PUBLISHED_DESC} ${ARTICLE_SUMMARY_PROJECTION}`

/** Latest N published articles, newest first — used by the homepage Latest Writing section. */
export const latestArticlesQuery = `*[_type == "article"] | order(publishedAt desc) [0...$limit] ${ARTICLE_SUMMARY_PROJECTION}`

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] ${ARTICLE_FULL_PROJECTION}`

/** Used by the migration/seed scripts to detect an existing document before writing. */
export const articleSlugExistsQuery = `*[_type == "article" && slug.current == $slug][0]._id`

/** Published article slugs only — used by sitemap generation. */
export const publishedArticleSlugsQuery = `*[_type == "article"].slug.current`

/**
 * Total published article count — same filter as `allArticlesQuery`, kept as a
 * dedicated count query so the homepage Evidence Index doesn't have to download
 * every article summary just to display one number.
 */
export const publishedArticleCountQuery = `count(*[_type == "article"])`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  homepageHeadline,
  homepageSupportingCopy,
  credibilityPoints,
  name,
  positioning,
  location,
  aboutContent,
  capabilityGroups,
  keyImpact,
  "technicalWork": technicalWork[] | order(sortOrder asc) {
    cvTitle,
    cvSummary,
    sortOrder,
    "article": articleRef-> { title, "slug": slug.current },
  },
  "education": education[] | order(sortOrder asc),
  "publications": publications[] | order(sortOrder asc),
  "skillGroups": skillGroups[] | order(sortOrder asc),
  contactEmail,
  linkedinUrl,
  githubUrl,
  resumeUrl,
  defaultSeoTitle,
  defaultSeoDescription,
  socialShareImage,
}`
