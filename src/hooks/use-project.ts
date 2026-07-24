import { useAsync } from './use-async'
import { getProjectBySlug } from '@/lib/sanity/fetch'

export function useProject(slug: string | undefined) {
  return useAsync(() => (slug ? getProjectBySlug(slug) : Promise.resolve(null)), [slug])
}
