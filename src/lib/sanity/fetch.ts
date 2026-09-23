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
import { STATIC_ARTICLE_SUMMARIES } from '@/content/static-articles'

const STATIC_SLUGS = STATIC_ARTICLE_SUMMARIES.map((article) => article.slug)

function withStaticArticle(articles: SanityArticleSummary[]) {
  const withoutDuplicate = articles.filter((article) => !STATIC_SLUGS.includes(article.slug))
  return [...STATIC_ARTICLE_SUMMARIES, ...withoutDuplicate].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
}

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

export async function getAllArticles(): Promise<SanityArticleSummary[]> {
  const articles = await sanityClient.fetch<SanityArticleSummary[]>(allArticlesQuery)
  return withStaticArticle(articles)
}

export function getFeaturedArticles(): Promise<SanityArticleSummary[]> {
  return sanityClient.fetch(featuredArticlesQuery)
}

export async function getLatestArticles(limit = 3): Promise<SanityArticleSummary[]> {
  const articles = await sanityClient.fetch<SanityArticleSummary[]>(latestArticlesQuery, { limit })
  return withStaticArticle(articles).slice(0, limit)
}

export function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  return sanityClient.fetch(articleBySlugQuery, { slug })
}

/** Published article slugs including code-backed editorial pages. */
export async function getPublishedArticleSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(publishedArticleSlugsQuery)
  return Array.from(new Set([...STATIC_SLUGS, ...slugs]))
}

/** Total published article count including code-backed editorial pages. */
export async function getPublishedArticleCount(): Promise<number> {
  const count = await sanityClient.fetch<number>(publishedArticleCountQuery)
  return count + STATIC_ARTICLE_SUMMARIES.length
}
