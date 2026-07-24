import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure/structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Copy .env.example to .env and fill in the values.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',

  projectId,
  dataset,

  plugins: [structureTool({ structure }), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singleton enforcement: `siteSettings` is reachable only through
    // the fixed link in `structure.ts`, and even there, "duplicate"
    // is removed so a second document can't be created from within
    // the document pane itself.
    actions: (input, context) =>
      context.schemaType === 'siteSettings' ? input.filter((action) => action.action !== 'duplicate') : input,
  },
})
