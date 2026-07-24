import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET. Copy .env.example to .env.local and fill in the values.',
  )
}

/**
 * Fixed to a specific UTC date rather than "vX" or a moving tag, so a
 * future Sanity API change can't silently alter response shapes here.
 * Bump deliberately, not automatically.
 */
const API_VERSION = '2025-01-01'

/**
 * Public, read-only client — CDN-backed, no token. This can only ever
 * read published content; draft documents are invisible to it by
 * design, which is what keeps unpublished work off the live site.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: API_VERSION,
  useCdn: true,
  perspective: 'published',
})
