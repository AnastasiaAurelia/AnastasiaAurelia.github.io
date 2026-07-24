import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist." path="/404" />
      <section className="container-editorial flex flex-col items-start section-y">
        <p className="label-mono text-accent">404</p>
        <h1 className="mt-3 text-3xl">Page not found</h1>
        <p className="mt-3 max-w-md text-ink-muted">
          The page you're looking for doesn't exist, or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
        >
          Back home
        </Link>
      </section>
    </>
  )
}
