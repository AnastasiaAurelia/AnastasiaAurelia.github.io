import { sanityClient } from './client'
import {
  allProjectsQuery,
  featuredProjectsQuery,
  projectBySlugQuery,
  siteSettingsQuery,
  visibleExperienceQuery,
} from './queries'
import type { SanityExperience, SanityProject, SanityProjectSummary, SanitySiteSettings } from './types'

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
  return sanityClient.fetch(siteSettingsQuery)
}
