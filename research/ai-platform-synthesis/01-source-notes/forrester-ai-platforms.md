# Source notes — Forrester, "The AI Platforms Landscape, Q1 2026"

Authors: Mike Gualtieri, Rowan Curran, +3 contributors. Type: Landscape
Report (40-vendor market overview), Q1 2026. Audience: technology and
business leaders selecting an AI platform vendor. Access: full prose text
retrieved directly (see 00-access-log.md).

Key: FP = Forrester AI Platforms report.

---

CLAIM: An AI platform is defined as software giving enterprise AI
practitioners integrated capabilities across the full AI development
lifecycle — from data management to inferencing — to build composable
application components, AI agents, and/or complete applications, using any
AI technology (foundation models, predictive models, agent frameworks).
SOURCE: FP, "Market Definition" (verbatim term/definition block).
EVIDENCE: Direct quotation of Forrester's own definition.
CONTEXT: This is the report's load-bearing definition; everything else in
the report is organized against it.
WHY IT MATTERS: It fixes "AI platform" as lifecycle-spanning infrastructure,
not a single model, not a single agent framework, and not a point tool. It
explicitly folds three technology families (foundation models, predictive/ML
models, agent frameworks) into one category, which is itself a claim: these
were separate markets a few years ago.
RELATIONSHIP TO OTHER SOURCES: Complements the Agentic AI report's
component-level breakdown — FP defines the outer boundary of "platform";
the Agentic report defines the inner architecture of one class of
application built on top of it.
CONFIDENCE: High (direct primary quotation).
ARTICLE USE: Anchors the "what an AI platform actually has to do" section
and the composability argument (§8 in the task brief's numbering).

---

CLAIM: Building AI applications spans two parallel model-development tracks
that converge into applications: a predictive/ML track (data ingestion →
ML model training with feature stores/CV-HP tuning → model evaluation
(APIs/runtimes, A/B tests, canaries) → deployment (APIs/runtimes, GPU
management) → ModelOps (drift/quality, cost/latency, observability)) and a
foundation-model track (data processing → FM training (LLMs, diffusion) →
model tuning/alignment (context engineering, fine-tuning/adapters,
distillation/quantization) → deployment → ModelOps). Both tracks feed "AI
and agentic applications," which include planning/process design, RAG and
tool use, UI creation, memory/state; agent testing/evaluation (human-in-the-
loop, LLM-as-judge); and agentic app monitoring (telemetry/safety, policy
gates, risk monitoring, observability). All of this rests on an "enterprise
semantic layer" (ontology, data models, knowledge graphs, lineage,
governance, feature store), and the entire system is wrapped in a security/
threat/governance framework.
SOURCE: FP, Figure 1 caption (accessibility alt-text; the figure's
underlying image was not visually inspected, but its full descriptive
alt-text was retrieved as DOM text).
EVIDENCE: Verbatim figure alt-text, which Forrester writes as a complete
prose description of the diagram for accessibility — functionally
equivalent to reading the diagram's labels.
CONTEXT: This is FP's single most architecturally dense claim — effectively
Forrester's own reference architecture for "how an AI platform is built."
WHY IT MATTERS: It is evidence for a layered model: two model-building
tracks → shared ModelOps discipline → agentic application layer → wrapped
in semantic/governance/security layers. This maps closely to the "old
center of gravity vs. new center of gravity" distinction the brief asks me
to test — and it is Forrester's own structure, not an invented one.
RELATIONSHIP TO OTHER SOURCES: The Agentic report's "eight components"
(runtime, reasoning, memory, tools, guardrails, security, testing,
orchestration) is a *decomposition of the "AI and agentic applications" box*
in this diagram — same layer, different report, different grain.
CONFIDENCE: High for the elements named (direct alt-text), but this is a
description of a proprietary graphic, not the graphic itself, and is
paraphrased/restructured in the article rather than reproduced as a figure.
ARTICLE USE: Primary evidence for the reference-architecture section
(explicitly labeled "author synthesis... informed by Forrester's platform
diagram"), and for the "data becomes context" and "control plane" framing.

---

CLAIM: The AI platforms market is undergoing significant flux: incumbents
that have built AI platforms and their data-science precursors for a decade
are being challenged by (a) new entrants from adjacent markets and (b)
RAG-focused startups using retrieval as a primary selling point.
SOURCE: FP, "Market Maturity."
EVIDENCE: Direct paraphrase of prose claim.
WHY IT MATTERS: Establishes that "AI platform" is not a stable, settled
category — its boundary is actively being renegotiated by market entry from
multiple directions (DPA, API management, search/retrieval, customer
service — see next claim), which is itself evidence for the composability
argument: no single vendor category owns the full stack yet.
CONFIDENCE: High (direct paraphrase).
ARTICLE USE: §12 (market/framework-lens discussion), §8 (composability).

---

CLAIM: Vendors from markets as diverse as digital process automation (DPA),
API management, search and retrieval, and customer service/support are all
attempting to build AI platforms. AI application delivery — not model
building — has become the focus of value delivery for customers, a trend
that has accelerated with agentic AI.
SOURCE: FP, "Market Dynamics."
EVIDENCE: Direct paraphrase.
WHY IT MATTERS: This is the sharpest single Forrester claim for the
article's core thesis: the center of value has moved from
model-training/model-serving toward application/agent delivery. It is a
market-structure observation (who is entering the category), not just a
technology observation, which strengthens it as evidence rather than
speculation.
RELATIONSHIP TO OTHER SOURCES: Directly consonant with the Agentic report's
framing that agentic architecture, not model choice, is now the primary
design surface.
CONFIDENCE: High (direct paraphrase of an explicit Forrester claim, and
consistent with FP's own prior-report citation ["In our previous
evaluation... AI application delivery was becoming the focus"]).
ARTICLE USE: Central evidence for "The Model Is No Longer the System"
section; explicitly the strongest single quotable finding from FP.

---

CLAIM: FP defines three core use cases for AI platforms — agentic AI,
generative AI, predictive AI — and seven extended use cases: customer
intelligence, decision intelligence and automation, horizontal AI
application accelerators, industry AI application accelerators,
observability, personal productivity assistants, and process intelligence
and automation.
SOURCE: FP, "Top Use Cases" (Figures 4–5 captions).
EVIDENCE: Direct figure caption text.
WHY IT MATTERS: Forrester treats "observability" as an addressable *use
case* a vendor can specialize in, not only a cross-cutting capability every
platform needs — a genuinely interesting tension worth flagging (a
capability that is simultaneously infrastructure and product category).
CONFIDENCE: High (direct caption text).
ARTICLE USE: Assurance/observability section; noted as a productive tension
rather than smoothed over.

---

CLAIM: Across 14 platform functionalities, different core use cases lean on
different functionality clusters: customer intelligence relies heavily on
data processing and predictive-model training; decision intelligence and
automation requires agentic-flow development tools and FM tuning/alignment
for precision; horizontal/industry AI applications require both
assistant-style and agentic development tooling with domain-specific
context; observability (as both a standalone use case and a foundational
capability) requires data management, governance, and security/threat
analysis tooling.
SOURCE: FP, "Functionality By Use Case."
EVIDENCE: Direct paraphrase of prose (Figures 6–7 are functionality-matrix
tables whose cell-level data was not accessible; only this summarizing
prose was used).
WHY IT MATTERS: Undercuts any claim that "one AI platform capability set
fits all use cases" — Forrester explicitly ties functionality requirements
to use case, which supports the article's tradeoffs section (general-purpose
vs. domain platform).
CONFIDENCE: Medium-high: the prose summary is solid; the underlying matrix
cells are not verified and are not cited at that granularity.
ARTICLE USE: Tradeoffs section (general-purpose vs. domain-specific
platform).

---

CLAIM: Forrester sizes vendors by category revenue: large ($250M+), medium
($100–250M), small ($10–100M), and evaluated 40 vendors on geographic focus,
industry focus, and deployment model.
SOURCE: FP, "Notable Vendors."
EVIDENCE: Direct paraphrase.
WHY IT MATTERS: Minor — market-sizing methodology, useful only as evidence
that "AI platform" spans a genuinely broad vendor population rather than a
handful of hyperscaler suites.
CONFIDENCE: High.
ARTICLE USE: Background only; not a standalone section.

---

SOURCE-ACCESS NOTE: Several enumerated sub-bullets under "Business Value,"
"Market Maturity," and "Market Dynamics" rendered as empty accessibility
nodes (see 00-access-log.md) and their specific bullet text could not be
recovered. No claim in this file or the article is attributed to those
unrecovered bullets.
