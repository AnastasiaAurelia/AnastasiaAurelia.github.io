import { LongFormArticle } from '@/components/long-form/long-form-article'
import { ProximaBundlerVisual } from '@/components/long-form/proxima-bundler-visuals'
import { PROXIMA_BUNDLER_ARTICLE_SUMMARY as SUMMARY, PROXIMA_BUNDLER_SUBTITLE } from '@/content/static-articles'
import articleMarkdown from '@/content/articles/proxima-bundler-explained.md?raw'

export function ProximaBundlerExplainedPage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={PROXIMA_BUNDLER_SUBTITLE}
      kicker="Web3 systems"
      markdown={articleMarkdown}
      renderVisual={(id) => <ProximaBundlerVisual id={id} />}
      bodyClassName="[&_table]:[overflow-wrap:normal]"
    />
  )
}

export default ProximaBundlerExplainedPage
