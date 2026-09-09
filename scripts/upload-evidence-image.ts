/**
 * Upload an evidence image to Sanity and output its asset reference ID.
 *
 * Usage:
 *   node --env-file=studio/.env scripts/upload-evidence-image.ts ./input/evidence.png
 */
import { createClient } from '@sanity/client'
import { createRequire } from 'node:module'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'

const imagePath = process.argv[2]

if (!imagePath) {
  throw new Error('Image path is required as the first argument.')
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const studioRequire = createRequire(new URL('../studio/package.json', import.meta.url))
const client = token && projectId && dataset
  ? createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false, perspective: 'raw' })
  : (() => {
      const originalDirectory = process.cwd()
      try {
        process.chdir(fileURLToPath(new URL('../studio/', import.meta.url)))
        return studioRequire('sanity/cli').getCliClient({ apiVersion: '2025-01-01' })
      } finally {
        process.chdir(originalDirectory)
      }
    })()

async function uploadImage() {
  const fullPath = resolve(imagePath)
  console.log(`Uploading image from: ${fullPath}`)

  try {
    const imageBuffer = readFileSync(fullPath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: fullPath.split('/').pop(),
    })

    console.log(`✓ Image uploaded successfully.`)
    console.log(`Asset ID: ${asset._id}`)
    console.log(`Use this reference in articleImage(): '${asset._id}'`)
  } catch (error) {
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

uploadImage()
