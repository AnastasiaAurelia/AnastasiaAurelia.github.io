/**
 * Seeds exactly one draft test article — "Writing System Test — Do Not
 * Publish" — to manually verify the flexible article body end-to-end in
 * Studio: heading, paragraph, inline image, paragraph, metric highlight,
 * another inline image, decision callout, final paragraph, in that
 * order, with two different image layouts.
 *
 * It is written with the literal `drafts.` id prefix Sanity uses for
 * unpublished documents. That's not a convention this script has to
 * remember to respect — a document at a `drafts.` id is structurally
 * invisible to any client reading with `perspective: 'published'`
 * (which is all the public frontend ever uses), the same guarantee
 * every other public/draft boundary in this project relies on. It will
 * never appear on the live site unless a human opens it in Studio and
 * explicitly clicks Publish.
 *
 * Two small SVGs are generated on the fly and uploaded as the test
 * images — synthetic, not real content, purely to exercise the image
 * pipeline (upload, both layouts, alt text, captions).
 *
 * Run with:
 *   node --env-file=scripts/.env.migration scripts/seed-test-article.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'l3uxv1lk'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN.\n' +
      'Create one at https://www.sanity.io/manage/project/' +
      projectId +
      '/api#tokens (Editor permission is enough), put it in scripts/.env.migration ' +
      '(gitignored — see scripts/.env.migration.example), then run:\n\n' +
      '  node --env-file=scripts/.env.migration scripts/seed-test-article.ts\n',
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

const DOC_ID = 'drafts.article-writing-system-test'

let key = 0
function nextKey() {
  key += 1
  return `test-${key}`
}

function textBlock(text: string, style: 'normal' | 'h2' = 'normal') {
  return {
    _type: 'block',
    _key: nextKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
  }
}

function testSvg(label: string, fill: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <rect width="800" height="450" fill="${fill}"/>
    <text x="400" y="230" font-family="sans-serif" font-size="32" fill="#ffffff" text-anchor="middle">${label}</text>
  </svg>`
  return Buffer.from(svg)
}

async function uploadTestImage(label: string, fill: string, filename: string) {
  const asset = await client.assets.upload('image', testSvg(label, fill), {
    filename,
    contentType: 'image/svg+xml',
  })
  return { _type: 'reference' as const, _ref: asset._id }
}

async function main() {
  console.log(`Seeding draft test article into ${projectId}/${dataset} (id: ${DOC_ID})...\n`)

  const existingId: string | null = await client.fetch('*[_id == $id][0]._id', { id: DOC_ID })
  if (existingId) {
    console.log('Draft test article already exists — left untouched. Delete it in Studio first to reseed.')
    return
  }

  console.log('Uploading two synthetic test images...')
  const imageOneAsset = await uploadTestImage('Test Image One', '#7a3418', 'test-image-one.svg')
  const imageTwoAsset = await uploadTestImage('Test Image Two', '#3a5a7a', 'test-image-two.svg')

  const body = [
    textBlock('Testing the Writing Pipeline', 'h2'), // 1. Heading
    textBlock(
      'This paragraph exists only to verify that the flexible article body renders in the correct order end to end.',
    ), // 2. Paragraph
    {
      _type: 'articleImage',
      _key: nextKey(),
      asset: imageOneAsset,
      alt: 'Synthetic test image, solid rust background, labeled Test Image One',
      caption: 'Inline image #1 — normal layout',
      layout: 'normal',
    }, // 3. Inline image
    textBlock(
      'A second paragraph, after the first image, to confirm text can resume normally following an inline image block.',
    ), // 4. Paragraph
    {
      _type: 'metricHighlight',
      _key: nextKey(),
      label: 'Test metric',
      value: '42',
      context: 'Synthetic value — exists only to verify metric-highlight rendering, not a real result.',
    }, // 5. Metric highlight
    {
      _type: 'articleImage',
      _key: nextKey(),
      asset: imageTwoAsset,
      alt: 'Synthetic test image, solid blue background, labeled Test Image Two',
      caption: 'Inline image #2 — wide layout',
      layout: 'wide',
    }, // 6. Another inline image (different layout, for coverage)
    {
      _type: 'decisionCallout',
      _key: nextKey(),
      decision: 'Use a draft-only seed script rather than a published sample article',
      reasoning:
        'The brief explicitly asks not to invent a public article; a draft exercises the same rendering path without publishing fabricated content.',
      consequence: 'This document must be manually deleted or published deliberately — it will not do either on its own.',
    }, // 7. Decision callout
    textBlock('Final paragraph. If everything above rendered in this exact order, the pipeline is verified.'), // 8. Final paragraph
  ]

  const doc = {
    _id: DOC_ID,
    _type: 'article',
    title: 'Writing System Test — Do Not Publish',
    slug: { _type: 'slug', current: 'writing-system-test' },
    excerpt: 'Internal verification article for the flexible Writing body. Not for publication.',
    publishedAt: new Date().toISOString(),
    tags: ['test'],
    category: 'Other',
    featured: false,
    body,
  }

  await client.createIfNotExists(doc as never)
  console.log('\n✓ Draft created. Open Studio → Articles → "Writing System Test — Do Not Publish" to inspect it.')
  console.log('It is a draft (id starts with "drafts.") and will not appear on the public site unless published.')
}

main().catch((error: unknown) => {
  console.error('Seeding failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
