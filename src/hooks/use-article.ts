import { useAsync } from './use-async'
import { getArticleBySlug } from '@/lib/sanity/fetch'

export function useArticle(slug: string | undefined) {
  return useAsync(() => (slug ? getArticleBySlug(slug) : Promise.resolve(null)), [slug])
}
