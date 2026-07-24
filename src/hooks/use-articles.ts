import { useAsync } from './use-async'
import { getAllArticles, getFeaturedArticles, getLatestArticles } from '@/lib/sanity/fetch'

export function useAllArticles() {
  return useAsync(getAllArticles, [])
}

export function useFeaturedArticles() {
  return useAsync(getFeaturedArticles, [])
}

export function useLatestArticles(limit = 3) {
  return useAsync(() => getLatestArticles(limit), [limit])
}
