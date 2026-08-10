import { useAsync } from './use-async'
import { getArticleBySlug } from '@/lib/sanity/fetch'
import type { SanityArticle } from '@/lib/sanity/types'

export function useArticle(slug: string | undefined) {
  const localPreview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'local'
  return useAsync(async () => {
    if (!slug) return null
    if (localPreview) {
      const response = await fetch(`/__draft-preview/${slug}.json`)
      if (!response.ok) throw new Error('Local draft preview is unavailable. Run the importer first.')
      return response.json() as Promise<SanityArticle>
    }
    return getArticleBySlug(slug)
  }, [slug, localPreview])
}
