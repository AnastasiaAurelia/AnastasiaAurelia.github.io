import { defineCliConfig } from 'sanity/cli'

/**
 * The Sanity CLI auto-loads `.env`/`.env.local` in this directory and
 * reads any `SANITY_STUDIO_*` variable, so these are never hard-coded —
 * see `.env.example` for the variables a local `.env` must define.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
})
