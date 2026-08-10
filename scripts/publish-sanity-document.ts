/** Atomically publish an existing Sanity draft as a guarded document revision.
 *
 * Example:
 *   node --env-file=studio/.env --env-file=scripts/.env.migration \
 *     scripts/publish-sanity-document.ts project project-computer-vision-lpr \
 *     --revision --expected-published-rev=<rev>
 */
import { createClient } from '@sanity/client'

const [documentType, publishedId] = process.argv.slice(2).filter((argument) => !argument.startsWith('--'))
const revisionMode = process.argv.includes('--revision')
const expectedRevision = process.argv
  .find((argument) => argument.startsWith('--expected-published-rev='))
  ?.slice('--expected-published-rev='.length)

if (!documentType || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(documentType)) {
  throw new Error('A valid Sanity document type is required.')
}
if (!publishedId || publishedId.startsWith('drafts.') || !/^[a-zA-Z0-9._-]+$/.test(publishedId)) {
  throw new Error('A valid published Sanity document ID is required.')
}
if (!revisionMode || !expectedRevision) {
  throw new Error('Revision publication requires --revision and --expected-published-rev=<rev>.')
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Sanity project, dataset, and Editor-capable token are required.')

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false, perspective: 'raw' })
const draftId = `drafts.${publishedId}`
const state = await client.fetch<{
  published?: Record<string, unknown>
  draft?: Record<string, unknown>
}>(`{
  "published": *[_id == $published][0],
  "draft": *[_id == $draft][0]
}`, { published: publishedId, draft: draftId })

if (!state.published) throw new Error(`Published document ${publishedId} does not exist.`)
if (!state.draft) throw new Error(`Revision draft ${draftId} does not exist.`)
if (state.published._type !== documentType || state.draft._type !== documentType) {
  throw new Error(`Expected both siblings to have type ${documentType}.`)
}
if (state.published._rev !== expectedRevision) {
  throw new Error(`Concurrent modification detected for ${publishedId}; expected revision does not match.`)
}

const publishedSlug = (state.published.slug as { current?: string } | undefined)?.current
const draftSlug = (state.draft.slug as { current?: string } | undefined)?.current
if (publishedSlug && draftSlug && publishedSlug !== draftSlug) {
  throw new Error(`Slug mismatch: published=${publishedSlug}, draft=${draftSlug}.`)
}

const systemFields = new Set(['_id', '_rev', '_createdAt', '_updatedAt'])
const draftContent = Object.fromEntries(Object.entries(state.draft).filter(([field]) => !systemFields.has(field)))
const fieldsRemovedByRevision = Object.keys(state.published).filter(
  (field) => !systemFields.has(field) && field !== '_type' && !(field in draftContent),
)

await client
  .transaction()
  .patch(publishedId, (patch) => {
    const guarded = patch.ifRevisionId(expectedRevision).set(draftContent)
    return fieldsRemovedByRevision.length ? guarded.unset(fieldsRemovedByRevision) : guarded
  })
  .delete(draftId)
  .commit()

console.log(`Published ${documentType} revision to ${publishedId} and atomically removed only ${draftId}.`)
