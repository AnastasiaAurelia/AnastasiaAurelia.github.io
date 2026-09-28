# Article architecture — final

Title: **The Control Plane Problem**
Subtitle: **What Gartner and Forrester's platform frameworks reveal about
where enterprise AI actually breaks**
Slug: `the-control-plane-problem`

Governing thesis (tested against claim-matrix.md, not assumed): enterprise
AI platforms are re-centering from a model-delivery system (data → training
→ model → endpoint → application) to an execution system (event → agent/
workflow → orchestration → models+context → tools/systems → action), and
the two Forrester reports show this from two independent directions — a
market-structure signal (FP) and an architecture signal (FA) — that converge
on the same relocation. The second-order finding, visible only by comparing
both reports, is that the control plane (identity, policy, evaluation,
observability) is sold as a mature, available layer but described by
architects as one of the least mature disciplines in the stack — a gap that
explains most of the failure modes enterprises hit.

Sections (## Chapter N. Title, matching parse-article-markdown.ts):

0. Untitled framing intro (no chapter number) — the shift in one sentence.
1. Ch 1. The Model Is No Longer the System — FP's value-delivery-shift claim
   + FA's reasoning-emerges-from-execution claim, read together.
2. Ch 2. What an AI Platform Actually Has To Do — FP's definition +
   lifecycle figure, restated as a capability model, not a vendor checklist.
3. Ch 3. Two Reports, Two Lenses — Gartner disclosed gap; FP vs FA as
   market-structure lens vs. architecture lens; where they converge/diverge.
4. Ch 4. Anatomy of an Agent — FA's eight components, explained with the
   model≠agent, agent≠workflow distinctions.
5. Ch 5. Orchestration Is a Control-Plane Decision, Not a Convenience —
   FA's three architecture patterns, tradeoff table, and the "adding an
   orchestrator changes memory/guardrails/access/testability together"
   argument.
6. Ch 6. The Control Plane Problem — the claim-matrix's central synthesis:
   sold as mature, run as immature (IAM/AEGIS, sprawl statistic).
7. Ch 7. Evaluation and Observability, From Model to System — model-centric
   vs system-centric evaluation table; FP's use-case/capability tension.
8. Ch 8. Composability, Build vs. Buy, and Other Real Tradeoffs — tradeoff
   tables grounded in FP market-fragmentation + FA pattern consequences.
9. Ch 9. Where Enterprises Get This Wrong — failure modes, each tied to a
   specific claim above, not invented independently.
10. Ch 10. A Reference Architecture — explicitly labeled author synthesis,
    built from FP's lifecycle diagram + FA's eight components + the
    control-plane argument.
11. Ch 11. What This Means, Role by Role — practical implications.
12. References — full citation list with access-status notes.

Evidence labels used: [EMPIRICAL] (FP/FA reported facts, e.g. the 60%
sprawl statistic, FP's market definition), [PRACTITIONER] (interview quotes
inside FA — Capgemini, Atlassian), [SYNTHESIS] (the control-plane-problem
thesis, the reference architecture, all tradeoff tables not lifted directly
from a source), [CONCEPTUAL] (named source frameworks used once and
attributed — AEGIS), [FORMAL MODEL] not used (no quantitative model in this
corpus).

Citation keys (extend parse-article-markdown.ts CITE_PATTERN):
`FP` → Forrester, The AI Platforms Landscape, Q1 2026.
`FA` → Forrester, The Architect's Guide To Agentic AI.
No Gartner key is created — the disclosed gap means no page/section-level
Gartner citation exists anywhere in the article.
