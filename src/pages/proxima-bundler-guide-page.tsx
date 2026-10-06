import { LongFormArticle } from '@/components/long-form/long-form-article'
import { ProximaBundlerVisual } from '@/components/long-form/proxima-bundler-visuals'
import { PROXIMA_BUNDLER_ARTICLE_SUMMARY as SUMMARY, PROXIMA_BUNDLER_SUBTITLE } from '@/content/static-articles'
import articleMarkdown from '@/content/articles/proxima-bundler-guide.md?raw'

export function ProximaBundlerGuidePage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={PROXIMA_BUNDLER_SUBTITLE}
      kicker="On-chain execution"
      markdown={articleMarkdown}
      renderVisual={(id) => <ProximaBundlerVisual id={id} />}
    />
  )
}

export default ProximaBundlerGuidePage
