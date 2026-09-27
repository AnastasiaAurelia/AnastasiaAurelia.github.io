import { LongFormArticle } from '@/components/long-form/long-form-article'
import { BindingLinkVisual } from '@/components/long-form/binding-link-visuals'
import { BINDING_LINK_ARTICLE_SUMMARY as SUMMARY, BINDING_LINK_SUBTITLE } from '@/content/static-articles'
import articleMarkdown from '@/content/articles/the-binding-link.md?raw'

export function TheBindingLinkPage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={BINDING_LINK_SUBTITLE}
      kicker="Business systems"
      markdown={articleMarkdown}
      renderVisual={(id) => <BindingLinkVisual id={id} />}
      bodyClassName="[&_table]:[overflow-wrap:normal] [&_th:first-child]:min-w-16"
    />
  )
}

export default TheBindingLinkPage
