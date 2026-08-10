/** Publish exactly one reviewed article draft.
 * Run through Sanity CLI authentication:
 *   cd studio && npx sanity exec ../scripts/publish-article.ts --with-user-token -- <slug>
 */
import { createRequire } from 'node:module'

const slug = process.argv.find((argument) => /^[a-z0-9-]+$/.test(argument) && argument !== 'with-user-token')
if (!slug) throw new Error('Provide the exact article slug to publish.')

const studioRequire = createRequire(new URL('../studio/package.json', import.meta.url))
const client = studioRequire('sanity/cli').getCliClient({ apiVersion: '2025-01-01' })
const publishedId = `article-${slug}`
const draftId = `drafts.${publishedId}`

const draft = await client.fetch(`*[_id == $draftId && _type == "article" && slug.current == $slug][0]`, {
  draftId,
  slug,
})
if (!draft) throw new Error(`Expected draft ${draftId} with slug ${slug} was not found. Nothing published.`)

const existingPublished = await client.fetch(`*[_id == $publishedId][0]._id`, { publishedId })
if (existingPublished) throw new Error(`Published document ${publishedId} already exists. Refusing to overwrite it.`)

const { _rev: _draftRevision, ...published } = draft
await client.transaction().create({ ...published, _id: publishedId }).delete(draftId).commit()
console.log(`Published ${publishedId} and removed only its corresponding draft ${draftId}.`)
