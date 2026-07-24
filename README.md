# Portfolio — Anastasia Aurelia

A content-driven portfolio positioned around AI product management across
computer vision, applied AI, and agentic workflows. Built as an **evidence
system**, not a blog: each project aggregates whatever proof of work exists
for it — case study, repository, live product — behind one URL, instead of
scattering them as unrelated posts.

## Architecture overview

- **GitHub** stores the application code (this repo) — the frontend and
  the Sanity Studio configuration. It has no portfolio content in it.
- **Sanity** (project `l3uxv1lk`, dataset `production`) stores the actual
  portfolio content — projects, experience, site settings.
- **Sanity Studio** (`/studio`) is the editing interface. It's a separate
  app from the portfolio itself; deploying/running it doesn't touch the
  frontend, and vice versa.
- **The public frontend** (`/`, this repo's root) is a Vite + React 19 +
  TypeScript SPA. It reads only **published** Sanity content over the
  public, tokenless CDN API — it can never see a draft, and it never
  needs write credentials.

```
src/content/**        old hard-coded content (kept, not deleted — see below)
src/lib/sanity/**      client, image builder, GROQ queries, fetch fns, types
src/hooks/use-*.ts     data hooks wrapping the fetch functions (loading/error/success)
src/components/portable-text/**   renders Sanity's Portable Text (rich case-study content)
studio/**              Sanity Studio: schemas, desk structure, config
scripts/migrate-to-sanity.ts      one-time (repeatable) content migration
```

### On `src/content/**`

This directory holds the portfolio's original hard-coded content and is
**no longer imported by any page** — every page now reads from Sanity.
It's kept, unmodified, as the reference the migration script was built
from, per the "don't remove the old content until migration is verified"
sequencing this integration was built under. Once you've run the
migration, confirmed the site reads correctly from Sanity, and are
comfortable Sanity is the sole source of truth, delete `src/content/**`
and its tests (`src/content/__tests__/`) — nothing else depends on them.

## Environment variables

Two separate `.env` files, because the frontend and Studio are two apps:

**Frontend** — copy `.env.example` → `.env.local` (gitignored):
```
VITE_SANITY_PROJECT_ID=l3uxv1lk
VITE_SANITY_DATASET=production
```

**Studio** — copy `studio/.env.example` → `studio/.env` (gitignored):
```
SANITY_STUDIO_PROJECT_ID=l3uxv1lk
SANITY_STUDIO_DATASET=production
```

Project ID and dataset name are public identifiers, not secrets — but
both real `.env` files stay local/gitignored anyway, for one consistent
rule across the repo rather than a special case for "this one's fine to
commit."

**Never commit, log, or hard-code a write token anywhere in this repo.**
The frontend and Studio dev/build never need one — only the migration
script does, and it reads it from a separate gitignored file (below).

## Local setup

```bash
npm install                      # frontend deps
npm run dev                      # frontend at http://localhost:5173

cd studio && npm install         # Studio deps
npm run dev                      # Studio at http://localhost:3333
```

The Studio requires logging in the first time you open it in a browser
(Google/GitHub/email — pick whichever your Sanity account uses). That's
a separate login from the CLI's own `sanity login`, used below for
deploy/migration.

## Content-editing workflow

1. Open Studio (locally at `localhost:3333`, or the deployed URL once
   you've run `npm run deploy` inside `studio/` — see below).
2. Edit **Site Settings** (a fixed singleton — there's no "create new"
   for it), a **Project**, or an **Experience** entry.
3. Sanity's native draft/publish workflow applies throughout: edits
   autosave as a draft and are invisible to the public site until you
   press **Publish**. **Unpublish** reverts a document to draft-only.
   Document history is available via the Studio's history pane.
4. Refresh the live frontend — published changes appear immediately (the
   CDN cache is short-lived); nothing in the frontend code needs to change.

## Content migration

The three original hard-coded projects (Computer Vision and LPR
Reliability, ResearchLens, Agentic Workflows) plus the original homepage
copy are captured in `scripts/migrate-to-sanity.ts`, ready to run:

```bash
# 1. Create a token (Editor permission is enough) at:
#    https://www.sanity.io/manage/project/l3uxv1lk/api#tokens
# 2. Copy scripts/.env.migration.example -> scripts/.env.migration
#    and paste the token in (gitignored — never commit this file)
# 3. Run it:
node --env-file=scripts/.env.migration scripts/migrate-to-sanity.ts
```

It's idempotent — deterministic document IDs, and every write uses
`createIfNotExists`, so re-running it is a safe no-op against anything
already there. Pass `--force` to explicitly overwrite instead. **Every
migrated document lands as a draft** — open Studio and publish each one
before it'll appear on the live site.

**Status: prepared, not yet run** — this environment has no authenticated
Sanity session, so the script above hasn't been executed against the
real project. Run the three commands above once to complete it.

## CORS

Sanity's API only accepts browser requests from origins you've explicitly
allowed. Add the local dev origin now, and the production origin once you
have one (no deployment config exists in this repo yet, so it isn't
knowable automatically — add whatever domain you deploy the frontend to).

```bash
cd studio
npx sanity login                                  # one-time, opens a browser
npx sanity cors add http://localhost:5173 --credentials false
npx sanity cors add https://<your-production-domain> --credentials false
```

`--credentials false` because the frontend never sends auth (it's a
public, tokenless CDN read) — there's no reason to widen the origin's
permissions beyond that.

**Status: not yet configured** — confirmed while building this: the
local frontend currently gets a CORS-blocked network error against the
live project (verified directly, not assumed). The site handles that
gracefully (a clean error message, no crash), but nothing will actually
load until the commands above are run once, by you, since they require
an authenticated session this environment doesn't have.

## Studio deployment

```bash
cd studio
npx sanity login        # if you haven't already for the CORS step above
npm run deploy           # prompts for a studio hostname the first time
```

**Status: not yet deployed** — same authentication gap as CORS/migration.
The Studio has been verified to build, typecheck, and correctly resolve
project `l3uxv1lk` (confirmed live, over a real API call — see
Verification below); only the interactive login + hostname choice is
outstanding.

## Commands

| Command | Where | Does |
|---|---|---|
| `npm run dev` | root | Frontend dev server |
| `npm run build` | root | Typecheck, build, generate `dist/sitemap.xml` |
| `npm run typecheck` | root | `tsc -b` (covers `src/` and `scripts/`) |
| `npm run lint` | root | `oxlint` |
| `npm test` | root | Vitest (content integrity, chapter-splitting, routing) |
| `npm run dev` | `studio/` | Studio dev server |
| `npm run build` | `studio/` | Studio production build |
| `npm run typecheck` | `studio/` | `tsc --noEmit` over schemas/config |
| `npm run deploy` | `studio/` | Deploy Studio to Sanity's hosting |
| `node --env-file=scripts/.env.migration scripts/migrate-to-sanity.ts` | root | Run the content migration |

## Content model

See `studio/schemaTypes/` for the authoritative schema. In short:

- **`project`** — title, slug, shortSummary, projectType, coverImage,
  tags, featured, displayOrder, a Portable Text `content` field for the
  full case study, gallery, externalUrl/githubUrl, SEO overrides.
  `content` uses a `projectSection` marker block to delimit chapters
  (Overview, Problem, My ownership, …) inline, plus custom blocks for
  metric highlights, decision callouts, and architecture diagrams —
  Portable Text models this more cleanly than one column per narrative
  beat would.
- **`experience`** — company, role, date range, achievements, ordering,
  visibility.
- **`siteSettings`** — a singleton: homepage headline/copy, credibility
  points, about content, capability groups, contact/social links, default
  SEO.

`src/lib/sanity/types.ts` mirrors these shapes on the frontend side, and
`src/lib/sanity/split-project-content.ts` is the seam that turns a
project's flat Portable Text array into the numbered chapters + sticky
chapter nav the detail page renders — the same visual system as before
the CMS integration, just driven by flexible content instead of fixed
fields.

## SEO notes

Client-rendered SPA — per-route `<title>`/description/OG/JSON-LD are set
via `react-helmet-async`, sourced from `siteSettings` and per-project
`seoTitle`/`seoDescription` where set. Google's crawler executes JS fine;
some non-JS social unfurlers may not. Prerendering to static HTML is the
natural next step if that becomes a real problem — it wouldn't require
touching the Sanity integration.

## Security notes

- Public frontend reads use `perspective: 'published'` and no token
  (`src/lib/sanity/client.ts`) — drafts are structurally invisible to it,
  not just filtered by convention.
- The only place a write token is ever read is the migration script, from
  a gitignored local file (`scripts/.env.migration`), never from a
  `VITE_`-prefixed variable (which would ship it into the browser bundle)
  and never printed to a log.
- Error messages shown in the UI never include the raw error (which can
  contain a full request URL) — that's logged to the console instead,
  once, centrally, in `src/hooks/use-async.ts`.
