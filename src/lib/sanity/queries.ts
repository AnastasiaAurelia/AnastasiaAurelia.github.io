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
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  homepageHeadline,
  homepageSupportingCopy,
  credibilityPoints,
  aboutContent,
  capabilityGroups,
  contactEmail,
  linkedinUrl,
  githubUrl,
  resumeUrl,
  defaultSeoTitle,
  defaultSeoDescription,
  socialShareImage,
}`
