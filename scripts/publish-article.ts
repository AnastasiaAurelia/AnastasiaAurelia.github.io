/** Publish exactly one reviewed article draft.
 * Run through Sanity CLI authentication:
 *   cd studio && npx sanity exec ../scripts/publish-article.ts --with-user-token -- <slug>
 * Publish a revision with an API token:
 *   node --env-file=studio/.env --env-file=scripts/.env.migration scripts/publish-article.ts <slug> --revision --expected-published-rev=<rev>
 */
import { createClient, type Patch } from '@sanity/client'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const slug = process.argv.find((argument) => /^[a-z0-9-]+$/.test(argument) && argument !== 'with-user-token')
if (!slug) throw new Error('Provide the exact article slug to publish.')

const studioRequire = createRequire(new URL('../studio/package.json', import.meta.url))
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const client = token && projectId && dataset
  ? createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })
  : (() => {
      const originalDirectory = process.cwd()
      try {
        process.chdir(fileURLToPath(new URL('../studio/', import.meta.url)))
        return studioRequire('sanity/cli').getCliClient({ apiVersion: '2025-01-01' })
      } finally {
        process.chdir(originalDirectory)
      }
    })()
const publishedId = `article-${slug}`
const draftId = `drafts.${publishedId}`
const revisionMode = process.argv.includes('--revision')
const expectedPublishedRevision = process.argv.find((argument) => argument.startsWith('--expected-published-rev='))?.split('=', 2)[1]

const draft = await client.fetch(`*[_id == $draftId && _type == "article" && slug.current == $slug][0]`, {
  draftId,
  slug,
})
if (!draft) throw new Error(`Expected draft ${draftId} with slug ${slug} was not found. Nothing published.`)

const existingPublished = await client.fetch(`*[_id == $publishedId][0]`, { publishedId }) as Record<string, unknown> | null
if (existingPublished && !revisionMode) throw new Error(`Published document ${publishedId} already exists. Refusing to overwrite it without --revision.`)
if (revisionMode && !existingPublished) throw new Error(`Cannot publish revision: ${publishedId} does not exist.`)
if (revisionMode && !expectedPublishedRevision) throw new Error('Revision publication requires --expected-published-rev=<rev>.')
if (revisionMode && existingPublished?._rev !== expectedPublishedRevision) throw new Error(`Concurrent modification detected for ${publishedId}; expected revision does not match.`)

const { _id: _draftId, _rev: _draftRevision, _createdAt: _draftCreatedAt, _updatedAt: _draftUpdatedAt, ...draftContent } = draft
if (revisionMode) {
  const systemFields = new Set(['_id', '_rev', '_createdAt', '_updatedAt', '_type'])
  const staleFields = Object.keys(existingPublished ?? {}).filter((field) => !systemFields.has(field) && !(field in draftContent))
  await client.transaction()
    .patch(publishedId, (patch: Patch) => {
      const guardedPatch = patch.ifRevisionId(expectedPublishedRevision!).set(draftContent)
      return staleFields.length ? guardedPatch.unset(staleFields) : guardedPatch
    })
    .delete(draftId)
    .commit()
  console.log(`Published revision to ${publishedId} and atomically removed only ${draftId}.`)
} else {
  await client.transaction().create({ ...draftContent, _id: publishedId }).delete(draftId).commit()
  console.log(`Published ${publishedId} and removed only its corresponding draft ${draftId}.`)
}
