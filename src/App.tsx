import { Route, Routes } from 'react-router-dom'
import { SiteShell } from '@/components/layout/site-shell'
import { HomePage } from '@/pages/home-page'
import { WorkIndexPage } from '@/pages/work-index-page'
import { ProjectDetailPage } from '@/pages/project-detail-page'
import { WritingIndexPage } from '@/pages/writing-index-page'
import { ArticleDetailPage } from '@/pages/article-detail-page'
import { AboutPage } from '@/pages/about-page'
import { NotFoundPage } from '@/pages/not-found-page'

function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkIndexPage />} />
        <Route path="work/:slug" element={<ProjectDetailPage />} />
        <Route path="articles" element={<WritingIndexPage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
