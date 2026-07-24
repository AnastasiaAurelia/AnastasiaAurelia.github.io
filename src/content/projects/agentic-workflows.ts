import type { Project } from '../types.ts'

export const agenticWorkflows: Project = {
  slug: 'agentic-workflows',
  title: 'Agentic Workflows',
  tagline:
    'Applied work on agentic AI systems — workflows where an agent plans and executes multi-step tasks.',
  summary:
    'Case study on designing and shipping agentic workflows: systems where an AI agent handles multi-step tasks rather than a single prompt/response. Full narrative in progress.',
  featured: true,
  order: 3,
  tags: ['agentic-workflows', 'applied-ai', 'llm-tooling'],
  narrative: {
    overview:
      'Work on agentic workflows: systems that give an AI agent enough context, tools, and guardrails to plan and execute a multi-step task, rather than respond to a single prompt.',
  },
  evidence: [],
}
