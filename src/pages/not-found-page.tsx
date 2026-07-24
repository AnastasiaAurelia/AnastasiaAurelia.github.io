import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist." path="/404" />
      <section className="mx-auto flex max-w-2xl flex-col items-start px-6 py-24">
        <p className="text-sm text-ink-faint">404</p>
        <h1 className="mt-2 text-3xl">Page not found</h1>
        <p className="mt-3 text-ink-muted">
          The page you're looking for doesn't exist, or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/85"
        >
          Back home
        </Link>
      </section>
    </>
  )
}
