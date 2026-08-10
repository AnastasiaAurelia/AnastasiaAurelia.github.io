import type { SanityProjectSummary } from '@/lib/sanity/types'

/** One canonical destination per Work entry; projects without an article keep their project page. */
export function getProjectRoute(project: Pick<SanityProjectSummary, 'slug' | 'caseStudyArticle'>) {
  return project.caseStudyArticle?.slug
    ? `/articles/${project.caseStudyArticle.slug}`
    : `/work/${project.slug}`
}
