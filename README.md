# Portfolio — Anastasia Aurelia

A static, content-driven portfolio positioned around AI product management
across computer vision, applied AI, and agentic workflows. Built as an
**evidence system**, not a blog: each project aggregates whatever proof of
work exists for it — case study, repository, live product, documents,
media — behind one URL, instead of scattering them as unrelated posts.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, and
`react-helmet-async` for per-route SEO metadata. No backend, no database,
no CMS — see [Content model](#content-model) for why, and the migration
path if that changes.

## Adding a project

Adding a project should never require a new page or layout. It means:

1. Create `src/content/projects/<slug>.ts` exporting an object that
   satisfies the `Project` type in `src/content/types.ts`.
2. Add it to the array in `src/content/projects/index.ts`.
3. If it needs a tag that doesn't exist yet, add it to
   `src/content/tags.ts` first (tags are a closed, typed registry —
   not free text — so labels can't drift across projects).

`/work/:slug` resolves against that array automatically. Every narrative
field (`problem`, `ownership`, `decisions`, …) is optional — omit what
hasn't been written yet rather than guessing at it. The detail page
collects whichever fields are missing into one "not yet documented"
notice instead of showing an empty section per field.

## Content model

`src/content/types.ts` is the contract. A `Project` is:

- Card-level fields (`title`, `tagline`, `summary`, `tags`, `featured`) —
  always present, used on the homepage and `/work` index.
- A `narrative` object — the project's own case study, entirely optional
  field-by-field.
- An `evidence` array — supplementary external artifacts (repo, live
  product, doc, video, article), each typed by `EvidenceType`.

## Future CMS migration

If content volume grows past what's comfortable as code,
`src/content/projects/index.ts` is the seam: replace the static array
with a fetch against a headless CMS or Supabase table that resolves to
`Project[]`. Nothing in `src/components` or `src/pages` needs to change,
because they only ever consume the `Project` type, never the array's
origin.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck, build, generate `dist/sitemap.xml` |
| `npm run typecheck` | `tsc -b`, no emit |
| `npm run lint` | `oxlint` |
| `npm test` | Vitest (content integrity + routing smoke tests) |
| `npm run preview` | Preview the production build |

## SEO notes

This ships as a client-rendered SPA (matching Lovable's default
project shape) rather than statically prerendered/SSR'd. Per-route
`<title>`/description/OG/JSON-LD are set via `react-helmet-async`,
which Google's crawler picks up fine; social-preview crawlers that
don't execute JavaScript (some Slack/LinkedIn unfurlers) may not.
If that becomes a problem, prerendering each route to static HTML at
build time is the natural next step and doesn't require touching the
content model or components.

`src/content/site.ts`'s `url` field is a placeholder — set it to the
real production domain before launch; it feeds canonical URLs, Open
Graph tags, and the generated sitemap.
