import { describe, expect, it } from 'vitest'
import { projects, getProjectBySlug, getEvidenceTypeCounts } from '../projects'
import { TAGS } from '../tags'
import { SITE } from '../site'

describe('project content integrity', () => {
  it('ships at least the three initial projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3)
  })

  it('has unique, URL-safe slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('has non-empty title, tagline, and summary for every project', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0)
      expect(project.tagline.trim().length).toBeGreaterThan(0)
      expect(project.summary.trim().length).toBeGreaterThan(0)
    }
  })

  it('only references tags that exist in the canonical registry', () => {
    const validTags = new Set(Object.keys(TAGS))
    for (const project of projects) {
      for (const tag of project.tags) {
        expect(validTags.has(tag)).toBe(true)
      }
    }
  })

  it('gives every evidence entry a real URL and non-empty label', () => {
    for (const project of projects) {
      for (const evidence of project.evidence) {
        expect(evidence.label.trim().length).toBeGreaterThan(0)
        expect(() => new URL(evidence.url)).not.toThrow()
      }
    }
  })

  it('resolves projects by slug and returns undefined for unknown slugs', () => {
    const [first] = projects
    expect(getProjectBySlug(first.slug)?.slug).toBe(first.slug)
    expect(getProjectBySlug('this-slug-does-not-exist')).toBeUndefined()
  })

  it('tallies evidence-type counts that agree with the raw project data', () => {
    const counts = getEvidenceTypeCounts()

    // Every project's own detail page counts as one case study.
    expect(counts['case-study']).toBe(projects.length)

    // Every other type is a straight tally of what's actually linked —
    // never inflated with placeholder or invented entries.
    const expectedRepository = projects.reduce(
      (sum, project) => sum + project.evidence.filter((e) => e.type === 'repository').length,
      0,
    )
    expect(counts.repository).toBe(expectedRepository)
    expect(Object.values(counts).every((count) => count >= 0)).toBe(true)
  })
})

describe('site content guards', () => {
  it('never publishes a real personal email without explicit approval', () => {
    // Regression guard: the brief requires a neutral placeholder here
    // until a real address is explicitly supplied — this is a tripwire
    // against silently reintroducing an account-derived address.
    expect(SITE.email).toBe('your-email@gmail.com')
  })
})
