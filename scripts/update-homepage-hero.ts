/**
 * Update only the published homepage headline and supporting copy.
 * The patch is revision-guarded so a concurrent Studio edit aborts it.
 *
 * Run:
 *   node --env-file=studio/.env --env-file=scripts/.env.migration scripts/update-homepage-hero.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error('Sanity project, dataset, and write token are required.')
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })
const settings = await client.fetch<{ _rev: string } | null>('*[_id == "siteSettings"][0]{_rev}')

if (!settings) throw new Error('The published siteSettings document was not found.')

await client
  .patch('siteSettings')
  .ifRevisionId(settings._rev)
  .set({
    homepageHeadline: 'I turn messy AI work into clear, reliable systems teams can ship.',
    homepageSupportingCopy:
      'From business intent to technical execution — less ambiguity, less manual checking, fewer production surprises.',
  })
  .commit()

console.log('Published the updated homepage headline and supporting copy only.')
