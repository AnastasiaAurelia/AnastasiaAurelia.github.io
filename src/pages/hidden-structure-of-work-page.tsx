import { LongFormArticle } from '@/components/long-form/long-form-article'
import { HiddenStructureVisual } from '@/components/long-form/hidden-structure-visuals'
import {
  HIDDEN_STRUCTURE_ARTICLE_SUMMARY as SUMMARY,
  HIDDEN_STRUCTURE_SUBTITLE,
} from '@/content/static-articles'
import articleMarkdown from '@/content/articles/hidden-structure-of-work.md?raw'

export function HiddenStructureOfWorkPage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={HIDDEN_STRUCTURE_SUBTITLE}
      kicker="Organizations and power"
      markdown={articleMarkdown}
      renderVisual={(id) => <HiddenStructureVisual id={id} />}
    />
  )
}

export default HiddenStructureOfWorkPage
