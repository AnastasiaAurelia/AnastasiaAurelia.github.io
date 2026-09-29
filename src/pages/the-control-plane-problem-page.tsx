import { LongFormArticle } from '@/components/long-form/long-form-article'
import { ControlPlaneVisual } from '@/components/long-form/control-plane-visuals'
import { CONTROL_PLANE_ARTICLE_SUMMARY as SUMMARY, CONTROL_PLANE_SUBTITLE } from '@/content/static-articles'
import articleMarkdown from '@/content/articles/the-control-plane-problem.md?raw'

export function TheControlPlaneProblemPage() {
  return (
    <LongFormArticle
      summary={SUMMARY}
      subtitle={CONTROL_PLANE_SUBTITLE}
      kicker="AI systems"
      markdown={articleMarkdown}
      renderVisual={(id) => <ControlPlaneVisual id={id} />}
      bodyClassName="[&_table]:[overflow-wrap:normal] [&_th:first-child]:min-w-16"
    />
  )
}

export default TheControlPlaneProblemPage
