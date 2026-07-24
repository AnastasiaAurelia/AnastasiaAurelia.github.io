import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'
import { CaseIcon } from '@sanity/icons/Case'
import { UsersIcon } from '@sanity/icons/Users'
import { DocumentIcon } from '@sanity/icons/Document'

/**
 * Custom navigation: Site Settings is a fixed link straight to its one
 * document (no list, no "create new" — see the singleton filter in
 * `sanity.config.ts`), Projects and Experience are ordered lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Projects')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Articles')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('article')
            .title('Articles')
            .defaultOrdering([
              { field: 'featured', direction: 'desc' },
              { field: 'publishedAt', direction: 'desc' },
            ]),
        ),
      S.listItem()
        .title('Experience')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('experience')
            .title('Experience')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }]),
        ),
    ])
