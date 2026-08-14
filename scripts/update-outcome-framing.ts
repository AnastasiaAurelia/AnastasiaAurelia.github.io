/**
 * Publish the outcome-led homepage framing without replacing unrelated Sanity fields.
 * Each patch is revision-guarded so a concurrent Studio edit aborts the transaction.
 *
 * Run:
 *   node --env-file=studio/.env --env-file=scripts/.env.migration scripts/update-outcome-framing.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error('Sanity project, dataset, and write token are required.')
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

const capabilityGroups = [
  {
    _type: 'capabilityGroup',
    _key: 'outcome-1',
    title: 'Turn ambiguity into action',
    description: 'I turn vague, messy problems into clear priorities, owners, decisions, and next steps.',
  },
  {
    _type: 'capabilityGroup',
    _key: 'outcome-2',
    title: 'Ship fast, without last-minute chaos',
    description: 'I keep work moving, surface blockers early, and push toward delivery without turning every deadline into an emergency.',
  },
  {
    _type: 'capabilityGroup',
    _key: 'outcome-3',
    title: 'Build systems people don’t have to babysit',
    description: 'I make AI systems reliable enough that teams spend less time manually checking, escalating, and fixing the same failures.',
  },
  {
    _type: 'capabilityGroup',
    _key: 'outcome-4',
    title: 'Get different teams moving in the same direction',
    description: 'I translate across engineering, QA, operations, vendors, and business so work does not stall between teams.',
  },
  {
    _type: 'capabilityGroup',
    _key: 'outcome-5',
    title: 'Remove repetitive work from people’s day',
    description: 'I use automation and AI to take repetitive technical work off people’s plates, so humans can spend their time on judgment and decisions.',
  },
]

const projectSummaries: Record<string, string> = {
  'project-computer-vision-lpr': 'Made recognition reliable enough that operations spent less time chasing recurring failures, backed by a measurable loop across field evidence, infrastructure, transaction state, and model behavior.',
  'project-researchlens': 'Cut through research noise so people can compare evidence and make decisions without blindly trusting one model’s answer.',
  'project-agentic-workflows': 'Turn repetitive coding work into bounded, reviewable progress without asking people to trust an agent’s own completion verdict.',
  '927618e1-3eeb-40f2-b13f-4ddb510ec4e9': 'Replace one model’s market answer with fresh, ticker-isolated evidence people can inspect, reproduce, and challenge.',
  'project-lp-wallet-ranking-research': 'Reject attractive historical rankings when current behavior and risk evidence do not hold up, so a confident score does not become a false decision.',
}

const ids = ['siteSettings', ...Object.keys(projectSummaries)]
const documents = await client.fetch<Array<{ _id: string; _rev: string }>>(
  '*[_id in $ids]{_id,_rev}',
  { ids },
)
const revisions = new Map(documents.map((document) => [document._id, document._rev]))
const missing = ids.filter((id) => !revisions.has(id))
if (missing.length > 0) throw new Error(`Expected published documents were not found: ${missing.join(', ')}`)

let transaction = client.transaction().patch('siteSettings', (patch) =>
  patch.ifRevisionId(revisions.get('siteSettings')!).set({
    homepageHeadline: 'I turn messy AI work into clear, reliable systems teams can ship on time.',
    homepageSupportingCopy: 'Less ambiguity, less manual checking, fewer late-night firefights — across computer vision, research intelligence, and agentic workflows.',
    capabilityGroups,
  }),
)

for (const [id, shortSummary] of Object.entries(projectSummaries)) {
  transaction = transaction.patch(id, (patch) =>
    patch.ifRevisionId(revisions.get(id)!).set({ shortSummary }),
  )
}

await transaction.commit()
console.log('Published outcome-led homepage framing and five featured-project summaries.')
