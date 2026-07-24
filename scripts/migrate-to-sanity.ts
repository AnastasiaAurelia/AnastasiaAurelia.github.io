/**
 * One-time (repeatable) migration of the portfolio's original hard-coded
 * content — `src/content/**` — into Sanity. Seeds `siteSettings` and the
 * three initial projects with the exact same slugs the live routes
 * already use, so `/work/<slug>` keeps resolving after the switch.
 *
 * Idempotent by construction: every document uses a deterministic `_id`
 * and is written with `createIfNotExists`, which is a documented no-op
 * if that ID is already present — safe to re-run, and it will never
 * silently overwrite content someone has since edited in Studio. Pass
 * `--force` to explicitly opt into overwriting instead (`createOrReplace`).
 *
 * The write token is read from `process.env.SANITY_WRITE_TOKEN` only —
 * never hard-coded, never logged. Run it with:
 *
 *   node --env-file=scripts/.env.migration scripts/migrate-to-sanity.ts
 *
 * See `scripts/.env.migration.example` for what that file needs and how
 * to obtain a token; `scripts/.env.migration` itself is gitignored.
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
      '  node --env-file=scripts/.env.migration scripts/migrate-to-sanity.ts\n',
  )
  process.exit(1)
}

const force = process.argv.includes('--force')

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

let key = 0
function nextKey() {
  key += 1
  return `migrated-${key}`
}

function textBlock(text: string) {
  return {
    _type: 'block',
    _key: nextKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
  }
}

function sectionMarker(title: string, identifier: string) {
  return { _type: 'projectSection', _key: nextKey(), title, identifier }
}

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  homepageHeadline: 'Computer Vision, Applied AI & Agentic Workflows',
  homepageSupportingCopy:
    'Product leadership across computer vision, applied AI, and agentic systems — from problem framing to production reliability.',
  credibilityPoints: [],
  aboutContent: [],
  capabilityGroups: [
    {
      _type: 'capabilityGroup',
      _key: nextKey(),
      title: 'Computer Vision Products',
      description:
        'Turning perception models into products that hold up outside the lab — detection and recognition systems, and the reliability work around them.',
    },
    {
      _type: 'capabilityGroup',
      _key: nextKey(),
      title: 'Research Intelligence',
      description:
        'Structuring technical research into product direction — the layer between raw findings and a defensible roadmap decision.',
    },
    {
      _type: 'capabilityGroup',
      _key: nextKey(),
      title: 'Agentic Workflows',
      description:
        'Scoping multi-step, tool-using AI systems: what an agent should own outright, and where a human deliberately stays in the loop.',
    },
    {
      _type: 'capabilityGroup',
      _key: nextKey(),
      title: 'Product Reliability',
      description:
        'Treating reliability as a product requirement to design for, not an operational afterthought discovered after launch.',
    },
    {
      _type: 'capabilityGroup',
      _key: nextKey(),
      title: 'Technical Product Operations',
      description:
        'The cross-functional mechanics of shipping applied-AI product — sequencing work and translating between research, engineering, and the business.',
    },
  ],
  contactEmail: 'your-email@gmail.com',
}

const projects = [
  {
    _id: 'project-computer-vision-lpr',
    _type: 'project',
    title: 'Computer Vision and LPR Reliability',
    slug: { _type: 'slug', current: 'computer-vision-lpr' },
    shortSummary:
      'Case study on hardening a license-plate-recognition computer vision pipeline for reliability under real-world conditions. Full narrative in progress.',
    projectType: 'Computer Vision',
    tags: ['Computer Vision', 'License Plate Recognition', 'Reliability Engineering'],
    featured: true,
    displayOrder: 0,
    content: [
      sectionMarker('Overview', 'overview'),
      textBlock(
        'A computer vision system built around license plate recognition (LPR), scoped specifically around reliability — i.e. making recognition hold up outside of clean, controlled conditions.',
      ),
    ],
  },
  {
    _id: 'project-researchlens',
    _type: 'project',
    title: 'ResearchLens',
    slug: { _type: 'slug', current: 'researchlens' },
    shortSummary:
      'ResearchLens is one of the three flagship projects for this portfolio. Case-study content — problem, ownership, decisions, evidence — has not been added yet.',
    projectType: 'Applied AI',
    tags: ['Applied AI'],
    featured: true,
    displayOrder: 1,
    content: [],
  },
  {
    _id: 'project-agentic-workflows',
    _type: 'project',
    title: 'Agentic Workflows',
    slug: { _type: 'slug', current: 'agentic-workflows' },
    shortSummary:
      'Case study on designing and shipping agentic workflows: systems where an AI agent handles multi-step tasks rather than a single prompt/response. Full narrative in progress.',
    projectType: 'Agentic Workflow',
    tags: ['Agentic Workflows', 'Applied AI', 'LLM Tooling'],
    featured: true,
    displayOrder: 2,
    content: [
      sectionMarker('Overview', 'overview'),
      textBlock(
        'Work on agentic workflows: systems that give an AI agent enough context, tools, and guardrails to plan and execute a multi-step task, rather than respond to a single prompt.',
      ),
    ],
  },
]

async function migrateDocument(doc: Record<string, unknown>) {
  const label = `${doc._type} "${doc._id}"`
  const existingId: string | null = await client.fetch('*[_id == $id][0]._id', { id: doc._id })

  if (force) {
    await client.createOrReplace(doc as never)
    console.log(`✓ ${label} — ${existingId ? 'overwritten (--force)' : 'created'}`)
    return
  }

  if (existingId) {
    console.log(`· ${label} — already exists, left untouched (rerun with --force to overwrite)`)
    return
  }

  await client.createIfNotExists(doc as never)
  console.log(`✓ ${label} — created`)
}

async function main() {
  console.log(`Migrating into project ${projectId}/${dataset}${force ? ' (force mode)' : ''}...\n`)
  console.log('No images were part of the original hard-coded content — coverImage/gallery are not seeded.')
  console.log('No experience entries existed in the original content — none are seeded; add these in Studio.\n')

  await migrateDocument(siteSettings)
  for (const project of projects) {
    await migrateDocument(project)
  }

  console.log('\nDone. Verify in Studio, then publish each document — drafts are invisible to the public site.')
}

main().catch((error: unknown) => {
  console.error('Migration failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
