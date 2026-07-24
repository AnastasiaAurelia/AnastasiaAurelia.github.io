import { ArrowUpRight } from 'lucide-react'
import { SectionKicker } from '@/components/editorial/section-kicker'
import { useReveal } from '@/hooks/use-reveal'

interface ContactSectionProps {
  email: string
  linkedinUrl?: string
  githubUrl?: string
  resumeUrl?: string
}

/** A decisive editorial ending, not a generic footer form. */
export function ContactSection({ email, linkedinUrl, githubUrl, resumeUrl }: ContactSectionProps) {
  const { ref, visible } = useReveal<HTMLElement>()
  const secondaryLinks = [
    linkedinUrl ? { label: 'LinkedIn', url: linkedinUrl } : null,
    githubUrl ? { label: 'GitHub', url: githubUrl } : null,
    resumeUrl ? { label: 'Résumé', url: resumeUrl } : null,
  ].filter((link): link is { label: string; url: string } => link !== null)

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="reveal container-editorial section-y border-t border-line"
    >
      <SectionKicker index="06" title="Contact" />
      <p className="max-w-2xl font-serif text-3xl leading-snug sm:text-4xl">
        Reviewing candidates for a product role in computer vision or applied AI? Start here.
      </p>
      <a
        href={`mailto:${email}`}
        className="group mt-8 inline-flex items-baseline gap-3 border-b border-line-strong pb-2 text-2xl transition-colors hover:border-ink sm:text-3xl"
      >
        {email}
        <ArrowUpRight
          className="size-6 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden="true"
        />
      </a>
      {secondaryLinks.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {secondaryLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono text-ink-faint transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  )
}
