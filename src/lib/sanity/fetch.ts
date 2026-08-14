import { sanityClient } from './client'
import {
  allArticlesQuery,
  allProjectsQuery,
  articleBySlugQuery,
  featuredArticlesQuery,
  featuredProjectsQuery,
  latestArticlesQuery,
  projectBySlugQuery,
  publishedArticleCountQuery,
  publishedArticleSlugsQuery,
  siteSettingsQuery,
  homepageSiteSettingsQuery,
  aboutPageSiteSettingsQuery,
  visibleExperienceQuery,
} from './queries'
import type {
  SanityArticle,
  SanityArticleSummary,
  SanityExperience,
  SanityProject,
  SanityProjectSummary,
  SanitySiteSettings,
} from './types'

export function getFeaturedProjects(): Promise<SanityProjectSummary[]> {
  return sanityClient.fetch(featuredProjectsQuery)
}

export function getAllProjects(): Promise<SanityProjectSummary[]> {
  return sanityClient.fetch(allProjectsQuery)
}

export function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  return sanityClient.fetch(projectBySlugQuery, { slug })
}

export function getVisibleExperience(): Promise<SanityExperience[]> {
  return sanityClient.fetch(visibleExperienceQuery)
}

export function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return sanityClient.fetch(homepageSiteSettingsQuery)
}

export function getAboutPageSettings(): Promise<SanitySiteSettings | null> {
  return sanityClient.fetch(aboutPageSiteSettingsQuery)
}

export function getAllArticles(): Promise<SanityArticleSummary[]> {
  return sanityClient.fetch(allArticlesQuery)
}

export function getFeaturedArticles(): Promise<SanityArticleSummary[]> {
  return sanityClient.fetch(featuredArticlesQuery)
}

export function getLatestArticles(limit = 3): Promise<SanityArticleSummary[]> {
  return sanityClient.fetch(latestArticlesQuery, { limit })
}

export function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  return sanityClient.fetch(articleBySlugQuery, { slug })
}

/** Published article slugs only — used by sitemap generation. */
export function getPublishedArticleSlugs(): Promise<string[]> {
  return sanityClient.fetch(publishedArticleSlugsQuery)
}

/** Total published article count — backs the homepage Evidence Index Methods card. */
export function getPublishedArticleCount(): Promise<number> {
  return sanityClient.fetch(publishedArticleCountQuery)
}
