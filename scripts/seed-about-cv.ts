/**
 * Idempotent, draft-first seed of the About/CV content described in
 * `Anastasia_Aurelia_2026_CV.docx` (cross-checked against the expanded
 * Harvard Template CV variant — see the plan for the discrepancy notes).
 *
 * Draft-first by design (Diana Step 15): every document this script writes
 * uses a `drafts.<id>` id. Experience documents are brand new — no
 * published sibling exists yet, so they're created directly as drafts.
 * `siteSettings` already exists published; this script never patches that
 * published document. It fetches it, merges the new About fields on top,
 * and writes the result to `drafts.siteSettings` only — the published
 * document is left exactly as it was until you review and publish
 * yourself in Studio.
 *
 * Idempotent by construction: re-running without --force leaves existing
 * drafts (created by an earlier run of this script) untouched and logs
 * a skip. Pass --force to overwrite those draft siblings — this still
 * never touches the published documents.
 *
 * No certification/credential documents are created. No `project` or
 * `article` document is created, modified, or deleted — the technical
 * work highlights only reference existing published article ids.
 *
 * Run:
 *   node --env-file=scripts/.env.migration scripts/seed-about-cv.ts
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
      '  node --env-file=scripts/.env.migration scripts/seed-about-cv.ts\n',
  )
  process.exit(1)
}

const force = process.argv.includes('--force')

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

let keyCounter = 0
function nextKey() {
  keyCounter += 1
  return `seed-${keyCounter}`
}

function withKeys<T extends Record<string, unknown>>(items: T[]): (T & { _key: string })[] {
  return items.map((item) => ({ ...item, _key: nextKey() }))
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

// ---------------------------------------------------------------------------
// Experience — none exist yet, created directly as draft.experience-* docs.
// ---------------------------------------------------------------------------

const experienceDocs = [
  {
    _id: 'experience-parkee',
    _type: 'experience',
    company: 'PARKEE',
    role: 'AI Product Manager',
    startDate: '2025-06',
    isCurrent: true,
    achievements: [
      'Built a multi-site LPR performance framework across 5 production locations; reviewed 100,000+ operational transactions using 30D/7D baselines, daily image evidence, and a 17-case anomaly taxonomy to route failures across CV, engineering, infrastructure, and operations.',
      'Designed bidirectional SDCARD–Agent event reconciliation using plate + ±10-minute time matching; reduced apparent Agent loss from 25.0% to 11.1%, improved traceability from 75.0% to 88.9%, and narrowed investigation from 18 suspected cases to 8 confirmed losses.',
      'Rebuilt WUZZLPR measurement around adoption, camera capture, Agent handoff, plate matching, check-in/check-out, and final entry–exit completion; automated reporting and anomaly analysis with SQL, Metabase, Python, and n8n.',
      'Architected Change Plate and WUZZ Transfer workflows across App, CMS, Cloud, Agent, LPR, membership, operations, and privacy; compared 3 implementation strategies and defined 20 release-gate QA scenarios covering synchronization, rollback, concurrency, and recovery.',
      'Audited LPR stability using confidence intervals, sample-size rules, and field geometry; identified a CI-validation defect affecting 29 candidate anomaly periods and separated camera, synchronization, trigger-geometry, and statistical failure layers.',
      'Led LPR camera reliability validation spanning field geometry, NTP/time synchronization, HTTP transport, firmware/SDK diagnostics, and capture quality; analyzed 1,087 CFX transactions and coordinated a 1,000-sample motorcycle CV collection program.',
    ],
    displayOrder: 0,
    visible: true,
    secondary: false,
  },
  {
    _id: 'experience-eproperty',
    _type: 'experience',
    company: 'EProperty',
    role: 'System Analyst & Product Designer',
    startDate: '2022-01',
    endDate: '2025-05',
    isCurrent: false,
    achievements: [
      'Designed and documented in-house systems, user workflows, and UX/UI prototypes across property management, sales, finance, and operations.',
      'Translated complex business requirements into process maps, product specifications, and testable engineering workflows.',
      'Supported product analytics, A/B testing, campaign analysis, and operational reporting for data-driven product and business decisions.',
    ],
    displayOrder: 1,
    visible: true,
    secondary: false,
  },
  {
    _id: 'experience-tarumanagara-research-assistant',
    _type: 'experience',
    company: 'Tarumanagara University',
    role: 'Research Assistant',
    startDate: '2021-07',
    endDate: '2022-12',
    isCurrent: false,
    achievements: [
      'Contributed to applied computing and technology research supporting peer-reviewed publications and international conference presentations.',
      'Supported research documentation, system analysis, data validation, and statistical analysis for university technology projects.',
    ],
    displayOrder: 2,
    visible: true,
    secondary: false,
  },
  {
    _id: 'experience-piano-instructor',
    _type: 'experience',
    company: 'Kawai Piano Gallery',
    role: 'Piano Instructor',
    startDate: '2024-05',
    isCurrent: true,
    displayOrder: 3,
    visible: true,
    secondary: true,
  },
]

// ---------------------------------------------------------------------------
// siteSettings About fields — merged over the existing published document
// and written to drafts.siteSettings only.
// ---------------------------------------------------------------------------

const aboutFields = {
  name: 'Anastasia Aurelia',
  positioning: 'AI Product Manager | Computer Vision, AI Systems & Data',
  location: 'Jakarta, Indonesia',
  contactEmail: 'Anastasia.tunas@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/anastasia-a-27335219b',
  aboutContent: [
    textBlock(
      'AI Product Manager focused on computer vision, AI systems, production analytics, and data quality. Hands-on experience diagnosing end-to-end LPR/CV failures, defining cross-system product behavior, building reproducible measurement frameworks, and automating analysis with SQL, Python, Metabase, n8n, and MCP. Quantitative foundation through MITx Statistics & Data Science, with experience translating ambiguous production issues into deterministic engineering, QA, and operational decisions.',
    ),
  ],
  keyImpact: withKeys([
    { _type: 'impactStat', value: '100,000+', label: 'Production transactions reviewed', sortOrder: 0 },
    { _type: 'impactStat', value: '5', label: 'Production LPR sites', sortOrder: 1 },
    { _type: 'impactStat', value: '17', label: 'Named anomaly classes', sortOrder: 2 },
    { _type: 'impactStat', value: '20', label: 'Release-gate QA scenarios', sortOrder: 3 },
  ]),
  technicalWork: withKeys([
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'Unified LPR Source of Truth & Validation Automation',
      cvSummary:
        'Defined a reproducible measurement contract across Metabase, operational audits, vendor references, and existing reporting logic, including the 07:00–06:59 operational window, denominator/exclusion rules, PM–PK business views, and single-gate debugging.',
      articleRef: { _type: 'reference', _ref: 'article-unified-lpr-source-of-truth' },
      sortOrder: 0,
    },
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'LPR Timing & Measurement Integrity',
      cvSummary:
        'Mapped raw database timestamps to physical lane events, validated LPR and Agent logs in SQL, and identified a sign/semantics error in a derived latency metric before it could be mistaken for user behavior or used in capture-success correlation.',
      articleRef: { _type: 'reference', _ref: 'article-lpr-timing-analysis' },
      sortOrder: 1,
    },
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'WUZZ Change Plate & Transfer System Architecture',
      cvSummary:
        'Turned a seemingly simple plate edit into a deterministic cross-system product contract spanning App, CMS, Cloud, Agent, LPR, membership, privacy, and operations; defined pending/block/recovery behavior for partial updates and active parking states.',
      articleRef: { _type: 'reference', _ref: 'article-wuzz-change-plate-transfer-system-design' },
      sortOrder: 2,
    },
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'LPR Camera Reliability & Integration',
      cvSummary:
        'Consolidated field geometry, capture quality, NTP synchronization, HTTP transport, firmware/SDK diagnostics, offline replay, and training-capture requirements into one reliability validation package; analyzed 1,087 CFX transactions.',
      // Points at the eventual published id. That article currently exists only as a
      // draft (drafts.article-lpr-camera-reliability-integration) — until it's
      // published, this reference resolves to nothing under the public/published
      // perspective and the frontend renders this entry as text-only, per spec.
      articleRef: { _type: 'reference', _ref: 'article-lpr-camera-reliability-integration' },
      sortOrder: 3,
    },
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'Motorcycle Computer Vision Data Program',
      cvSummary:
        'Defined and coordinated a 1,000-sample motorcycle collection and labeling workflow, including target-camera validation, manual classification evidence, location traceability, and a training-ready vendor handoff process.',
      articleRef: { _type: 'reference', _ref: 'article-motorcycle-cv-training' },
      sortOrder: 4,
    },
    {
      _type: 'technicalWorkHighlight',
      cvTitle: 'AI-Assisted LPR/WUZZ Operations Reporting Pipeline',
      cvSummary:
        'Designed structured evaluation rubrics and AI-assisted workflows for operational summaries, anomaly review, edge-case classification, automated error analysis, report review, and action routing using MCP, Python, n8n, and prompt workflows.',
      // No matching article exists — intentionally left without a reference.
      sortOrder: 5,
    },
  ]),
  education: withKeys([
    {
      _type: 'education',
      institution: 'MITx',
      program: 'MicroMasters Program in Statistics & Data Science',
      startDate: '2024-09',
      status: '2026',
      coursework: ['Probability', 'Statistical Modeling', 'Machine Learning', 'Data Analysis', 'Data Visualization'],
      sortOrder: 0,
    },
    {
      _type: 'education',
      institution: 'Harvard Online / HarvardX',
      program: 'CS50 Microcredentials',
      startDate: '2023-10',
      endDate: '2025-12',
      coursework: ['SQL', 'Python', 'R'],
      sortOrder: 1,
    },
    {
      _type: 'education',
      institution: 'Universitas Tarumanagara',
      program: 'Bachelor of Technology, Computer and Information Systems',
      location: 'Jakarta, Indonesia',
      startDate: '2018-08',
      endDate: '2022-01',
      honors: [
        'Publication presenter at TICATE and ICASTE',
        'Third runner-up, 2019 National University Debating Competition',
        'Most Outstanding Student',
      ],
      sortOrder: 2,
    },
  ]),
  publications: withKeys([
    {
      _type: 'publication',
      title: 'Designing mathematics, science, and reading competency dashboard using business intelligence algorithm',
      venue: 'AIP Conference Proceedings',
      year: '2023',
      sortOrder: 0,
    },
    {
      _type: 'publication',
      title:
        'Fisher-Yates shuffle algorithm application to develop a visualization assistance application for learning physics in high school',
      venue: 'AIP Conference Proceedings',
      year: '2023',
      sortOrder: 1,
    },
    {
      _type: 'publication',
      title:
        "Developing Website-Based Information System Applications to Map PT. XYZ's Properties Using Next.js Framework with Haversine Method",
      venue: 'IJASTE',
      year: '2023',
      sortOrder: 2,
    },
    {
      _type: 'publication',
      title: 'Designing a mobile-based application using Apriori algorithm: A business development strategy during pandemic COVID-19',
      venue: 'Atlantis Press',
      year: '2022',
      sortOrder: 3,
    },
  ]),
  skillGroups: withKeys([
    {
      _type: 'skillGroup',
      title: 'Product & Systems',
      skills: [
        'Technical Product Management',
        'PRDs',
        'System Architecture',
        'Integration Requirements',
        'QA Strategy',
        'Truth Tables',
        'State Machines',
        'Cross-System Workflows',
      ],
      sortOrder: 0,
    },
    {
      _type: 'skillGroup',
      title: 'AI & Computer Vision',
      skills: [
        'Computer Vision',
        'LPR/OCR Systems',
        'Model / Output Evaluation',
        'Dataset Design',
        'Annotation',
        'Error Analysis',
        'Edge-Case Taxonomy',
        'Machine Learning',
      ],
      sortOrder: 1,
    },
    {
      _type: 'skillGroup',
      title: 'Data & Experimentation',
      skills: [
        'SQL',
        'Python',
        'Metabase',
        'Statistical Modeling',
        'Confidence Intervals',
        'Anomaly Detection',
        'Data Reconciliation',
        'Metric Design',
        'A/B Testing',
      ],
      sortOrder: 2,
    },
    {
      _type: 'skillGroup',
      title: 'AI Automation',
      skills: ['n8n', 'MCP', 'Webhooks', 'Prompt Engineering', 'Structured Evaluation Prompts', 'Claude Code', 'OpenClaw'],
      sortOrder: 3,
    },
    {
      _type: 'skillGroup',
      title: 'Languages',
      skills: ['Indonesian — Native', 'English — Professional Working Proficiency'],
      sortOrder: 4,
    },
  ]),
}

async function seedExperienceDocs() {
  for (const doc of experienceDocs) {
    const draftId = `drafts.${doc._id}`
    const label = `experience "${doc._id}"`
    const existing: string | null = await client.fetch('*[_id == $id][0]._id', { id: draftId })

    if (existing && !force) {
      console.log(`· ${label} — draft already exists, left untouched (rerun with --force to overwrite)`)
      continue
    }

    await client.createOrReplace({ ...doc, _id: draftId } as never)
    console.log(`✓ ${label} — ${existing ? 'draft overwritten (--force)' : 'draft created'} (${draftId})`)
  }
}

async function seedSiteSettingsDraft() {
  const publishedId = 'siteSettings'
  const draftId = 'drafts.siteSettings'

  const existingDraft = await client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', { id: draftId })
  if (existingDraft && !force) {
    console.log(`· siteSettings — ${draftId} already exists, left untouched (rerun with --force to overwrite)`)
    return
  }

  const published = await client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', { id: publishedId })
  if (!published) {
    console.log(`! No published "${publishedId}" found — creating ${draftId} from About fields only.`)
  }

  const base = (existingDraft ?? published ?? {}) as Record<string, unknown>
  const merged = { ...base, ...aboutFields, _id: draftId, _type: 'siteSettings' }

  await client.createOrReplace(merged)
  console.log(
    `✓ siteSettings — ${existingDraft ? 'draft overwritten (--force)' : 'draft created'} (${draftId}); published "${publishedId}" left untouched.`,
  )
}

async function main() {
  console.log(`Seeding About/CV content into ${projectId}/${dataset} (drafts only)${force ? ' [--force]' : ''}...\n`)
  await seedExperienceDocs()
  await seedSiteSettingsDraft()
  console.log('\nDone. Review the drafts in Studio — nothing was published.')
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
