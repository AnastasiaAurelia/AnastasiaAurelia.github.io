import { describe, expect, it } from 'vitest'
import { projects, getProjectBySlug } from '../projects'
import { TAGS } from '../tags'

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
})
