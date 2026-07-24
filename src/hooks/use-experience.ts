import { useAsync } from './use-async'
import { getVisibleExperience } from '@/lib/sanity/fetch'

export function useExperience() {
  return useAsync(getVisibleExperience, [])
}
