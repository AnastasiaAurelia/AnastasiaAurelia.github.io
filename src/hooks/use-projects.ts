import { useAsync } from './use-async'
import { getAllProjects, getFeaturedProjects } from '@/lib/sanity/fetch'

export function useAllProjects() {
  return useAsync(getAllProjects, [])
}

export function useFeaturedProjects() {
  return useAsync(getFeaturedProjects, [])
}
