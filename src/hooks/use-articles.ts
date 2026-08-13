import { useAsync } from './use-async'
import { getAllArticles, getFeaturedArticles, getLatestArticles, getPublishedArticleCount } from '@/lib/sanity/fetch'

export function useAllArticles() {
  return useAsync(getAllArticles, [])
}

export function useFeaturedArticles() {
  return useAsync(getFeaturedArticles, [])
}

export function useLatestArticles(limit = 3) {
  return useAsync(() => getLatestArticles(limit), [limit])
}

export function usePublishedArticleCount() {
  return useAsync(getPublishedArticleCount, [])
}
