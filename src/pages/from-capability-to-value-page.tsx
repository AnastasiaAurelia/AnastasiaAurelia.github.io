import { LongFormArticle } from '@/components/long-form/long-form-article'
import { CapabilityValueVisual } from '@/components/long-form/capability-value-visuals'
import {
  CAPABILITY_VALUE_ARTICLE_SUMMARY as SUMMARY,
  CAPABILITY_VALUE_SUBTITLE,
} from '@/content/static-articles'
import articleMarkdown from '@/content/articles/from-capability-to-value.md?raw'

export function FromCapabilityToValuePage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={CAPABILITY_VALUE_SUBTITLE}
      kicker="AI systems"
      markdown={articleMarkdown}
      renderVisual={(id) => <CapabilityValueVisual id={id} />}
      bodyClassName="[overflow-wrap:anywhere] [&_table]:[overflow-wrap:normal] [&_th:first-child]:min-w-16"
    />
  )
}

export default FromCapabilityToValuePage
