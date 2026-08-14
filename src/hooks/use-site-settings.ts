import { useAsync } from './use-async'
import { getSiteSettings, getAboutPageSettings } from '@/lib/sanity/fetch'

export function useSiteSettings() {
  return useAsync(getSiteSettings, [])
}

export function useAboutPageSettings() {
  return useAsync(getAboutPageSettings, [])
}
