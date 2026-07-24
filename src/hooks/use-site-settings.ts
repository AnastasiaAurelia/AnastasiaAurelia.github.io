import { useAsync } from './use-async'
import { getSiteSettings } from '@/lib/sanity/fetch'

export function useSiteSettings() {
  return useAsync(getSiteSettings, [])
}
