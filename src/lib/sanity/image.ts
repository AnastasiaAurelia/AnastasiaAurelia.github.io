import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

const builder = createImageUrlBuilder(sanityClient)

/** Base builder for a Sanity image reference — chain `.width()`, `.height()`, etc. at the call site. */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}
