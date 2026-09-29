# Source notes — Forrester, "The Architect's Guide To Agentic AI"

Subtitle: "Co-Inventing The Next Era Of Software." Lead author: Rowan Curran,
+10 contributors (named: Charles Betz, Devin Dickerson, Leslie Joseph, Diego
Lo Giudice, Ken Parmelee). Type: Best Practice Report. Audience: enterprise
architects and AI practitioners. Access: full prose text retrieved directly
for most sections (see 00-access-log.md for the specific gap).

Key: FA = Forrester Agentic AI report.

---

CLAIM: Architecting agentic AI for the enterprise is hard because teams must
move fast while designing for scale, governance, security, and flexibility.
Successful architectures are modular, deliberate, and adaptable — explicitly
*not* a single monolithic ideal-state architecture. Core disciplines
(runtime design, memory, tool use, guardrails, access control, testing,
governance) must be developed together, not in isolation.
SOURCE: FA, "Summary."
EVIDENCE: Direct paraphrase.
WHY IT MATTERS: This is Forrester's explicit rejection of a single canonical
"the AI platform" blueprint — directly relevant to the composability
question in the brief. It also states the article's Phase-6 caution
directly: components addressed in isolation "leaves critical failure modes
exposed" (see next claim) — i.e., partial architecture is a named risk, not
just a modeling convenience.
CONFIDENCE: High (direct paraphrase of the report's own summary).
ARTICLE USE: Framing for the "composable, not monolithic" thread and the
failure-modes section.

---

CLAIM: Core engineering and governance practices for agentic AI remain
immature despite rapid adoption. Identity and access management (IAM) is
one of the least mature areas, because an AI agent is a new *identity type*
that traditional IAM was not built to authenticate, authorize, or govern.
Testing practices are similarly unsettled, which compounds the security
problem, because agentic systems fail in emergent, runtime-driven ways that
do not resemble traditional software defects. Over-indexing on one control
layer alone (prompts, orchestration, or rules-based controls) leaves
critical failure modes exposed.
SOURCE: FA, "Agentic AI Architectures Emerge From The Top Down And Bottom
Up," first sub-bullet.
EVIDENCE: Direct paraphrase, close to verbatim on the IAM point.
WHY IT MATTERS: This is the single strongest sourced claim for "agent ≠
identity-compatible actor by default," i.e., for treating identity/IAM as
a first-class, currently-broken part of the control plane rather than an
afterthought. It also directly supports "testing/evaluation is
architecture-wide, not bolted on" — Forrester says testing failure modes
in agentic systems are *emergent and runtime-driven*, unlike conventional
software bugs.
CONFIDENCE: High (direct paraphrase/near-verbatim).
ARTICLE USE: Control-plane section (identity subsection); failure-modes
section (over-indexing on one control layer).

---

CLAIM: "Agentic sprawl" is a defining challenge: per Forrester's Q4 2025 AI
Pulse Survey, 60% of enterprise genAI decision-makers identify agentic
sprawl as a challenge. Sprawl often starts as shadow adoption, then
accelerates because agentic AI is not one system — teams independently add
agents, tools, prompts, and model endpoints, multiplying governance and
monitoring overhead, while ROI pressure does not pause. Enterprises need
baseline plans for cataloging agents, constraining tool surfaces, and
enforcing evaluation/access controls *before* the long tail of agents
emerges.
SOURCE: FA, same section, second sub-bullet.
EVIDENCE: Direct paraphrase with one verifiable statistic (60%, Forrester
Q4 2025 AI Pulse Survey).
WHY IT MATTERS: This is the report's empirical anchor and its strongest
argument for the control plane mattering *more*, not less, as autonomy
scales (Phase 7 of the brief). It also directly supports Failure Mode #6
("dozens of agents where deterministic software would be better") and #10
(lifecycle management) — sprawl is presented as a lifecycle-governance
failure, not a technology failure.
CONFIDENCE: High for the paraphrase; the 60% figure is Forrester's own
survey statistic, reported as such (not independently re-verified by me —
flagged in the article as a Forrester-reported figure).
ARTICLE USE: Central evidence for the control-plane-matters-more section
and for Failure Mode discussion of sprawl/lifecycle.

---

CLAIM: Agentic AI applications decompose into eight architectural component
categories: runtime, reasoning, memory, tool discovery and calling,
guardrails and constraints, security and access control, testing and
evaluation, and orchestration.
SOURCE: FA, "The Eight Components Of Agentic Application Architecture,"
lead paragraph.
EVIDENCE: Direct/near-verbatim list.
WHY IT MATTERS: This is the report's core decomposition and the direct
primary-source basis for the "Anatomy of an Agent" section of the article.
It is used as the spine of that section (not renamed, not reinvented),
with the article's own architecture layers (Phase 5 of the brief) built
*around* it rather than replacing it.
CONFIDENCE: High (direct list from primary text).
ARTICLE USE: Structural backbone of the Anatomy-of-an-Agent section;
explicitly cited as Forrester's own component list.

---

CLAIM (runtime): Agentic runtimes must be treated as first-class
distributed systems, not lightweight extensions of application logic,
because they call foundation models and are distributed both
computationally and geographically. A single agent typically executes
across multiple runtimes — model endpoints, orchestration services, policy
services, tool execution environments, memory stores — often spanning
regions and trust boundaries. Production SLAs must account for *degraded*
model behavior, not just binary uptime/downtime, because partial capability
loss is more common than total failure (interview-sourced practitioner
observation).
SOURCE: FA, "Strong Agentic Runtimes Form The Foundation..."
EVIDENCE: Direct paraphrase, including the practitioner-interview detail
about degraded-mode SLAs.
WHY IT MATTERS: Concrete evidence for "an agent is not one process," and
for treating reliability engineering for agents as fundamentally different
from binary-uptime software reliability.
CONFIDENCE: High.
ARTICLE USE: Anatomy-of-an-agent (runtime); reliability/latency tradeoffs.

---

CLAIM (reasoning): Reasoning in agentic AI is built around a foundation
model's behavior but is not driven by the model alone — it emerges from the
interaction between the model, the execution logic that manages the agent
loop, the structure of the context provided to the model, and the
constraints imposed during execution. Accurate reasoning depends on a
continuous feedback loop over reasoning outcomes, not just runtime
execution.
SOURCE: FA, "Reasoning Components Build On Foundation Models But Don't
Drive Reasoning On Their Own."
EVIDENCE: Direct paraphrase.
WHY IT MATTERS: This is the report's own statement of "model ≠ agent" —
reasoning is a property of the *system* (model + loop + context +
constraints + feedback), not the model in isolation. Directly supports the
"model-centric vs. system-centric" distinction (Phase 18/11 of the brief).
CONFIDENCE: High.
ARTICLE USE: Core evidence for "The Model Is No Longer the System" and for
the model-vs-system evaluation table.

---

CLAIM (memory): Memory architecture is core to maintaining context but
approaches are still being honed; memory is often discussed as existing in
two, three, or four layers. In the four-layer view: (1) context memory —
the immediate layer loaded into the model that shapes output; (2)
session/short-term memory — current conversation history and accessed data
supporting continuous workflows; (3) personal long-term memory — knowledge
of what a specific user/process has done historically; (4) institutional
long-term memory — how this user/process links to the rest of the
enterprise, enabling precise workflow execution.
SOURCE: FA, "Memory Is An Essential Component..."
EVIDENCE: Direct/near-verbatim four-layer breakdown.
WHY IT MATTERS: Directly and explicitly supports "memory ≠ context window"
(Phase 11) — this is Forrester's own layered memory model, not an invented
distinction, and it cleanly separates immediate context assembly from
durable enterprise-linked memory.
CONFIDENCE: High (direct list).
ARTICLE USE: Anatomy-of-an-agent (memory); "memory vs. context window"
distinction.

---

CLAIM (tools): Discovering the right tool for a job is necessary but not
sufficient for scalable outcomes — agents execute efficiently only when
tool behavior is consistent and unambiguous, enabling intent-level
execution without added reasoning overhead. Many downstream success/failure
outcomes are dictated by tool-layer design choices.
SOURCE: FA, "The Discovery And Proper Use Of Tools..."
EVIDENCE: Direct paraphrase.
WHY IT MATTERS: Supports "tool access ≠ tool authorization" and "tools turn
intelligence into action" — ambiguous tool behavior is named as a primary
failure vector independent of model quality.
CONFIDENCE: High.
ARTICLE USE: Tools/action layer section.

---

CLAIM (guardrails): Guardrails operate across three different mechanisms —
traditional business controls (code/rules), data-science explainability,
and foundation-model prompting — and across multiple functional levels,
from individual agent behavior to organizational policy enforcement, and
drive performance/evaluation trade-off decisions. Cultural factors affect
guardrail decisions (quoted: Capgemini — "there's a cultural element to
whether people want an agent to be able to take control").
SOURCE: FA, "Guardrails Control Agentic Behavior: Code, Foundation Models,
And Business Rules."
EVIDENCE: Direct paraphrase plus one attributed quotation (Capgemini, via
Forrester interview).
WHY IT MATTERS: Names three *different kinds* of guardrail mechanism
(deterministic code, model-level explainability, prompt-level constraint) —
useful evidence that "guardrails" is not a single technique, and that
autonomy limits are partly organizational/cultural, not purely technical.
CONFIDENCE: High for the paraphrase; the quotation is Forrester's reported
interview quote, used and attributed as such.
ARTICLE USE: Control-plane section (guardrails); "more autonomy needs more
control" argument (cultural angle).

---

CLAIM (security): Agentic systems introduce new attack surfaces (data
poisoning, prompt injection — quoted: Atlassian's Brendan Haire, "Prompt
injection is an important threat we're focused on mitigating"). The larger
challenge is that agentic systems redefine the trust boundary, pushing
enterprises to strengthen identity, permissions, auditability, and
explainability controls. One of the biggest threats is identities and
delegation paths that traditional IAM was not designed to handle — because
agents act with intent, more autonomy, and on behalf of users, across
systems the agent itself cannot directly access. Forrester's proposed
response is the AEGIS security model, built on three principles: least
agency, high explainability, and adaptable risk assessment/posturing.
SOURCE: FA, "Agentic Security Requires Responding To New Surface Of
Attacks And Threats."
EVIDENCE: Direct paraphrase plus one attributed quotation (Atlassian, via
Forrester interview) and the named AEGIS framework with its three stated
principles.
WHY IT MATTERS: AEGIS (named Forrester framework) is the report's own
proposed control model; the article should name it once, attribute it, and
not silently absorb "least agency" or "explainability" as if they were the
article's own invented terms. "Agents act... on behalf of users across
systems they can't directly access" is a precise statement of the
delegation problem that traditional IAM/OAuth-style models do not solve
cleanly.
CONFIDENCE: High (direct paraphrase + named framework + two attributed
quotes).
ARTICLE USE: Control-plane section (security/identity); explicitly names
and attributes AEGIS once.

---

CLAIM (testing/evaluation): Testing and evaluation are inseparable in
agentic AI and are an architecture-wide concern, not a phase-gate step.
SOURCE: FA, heading "Testing And Evaluation Are Inseparable In Agentic AI
And Are An Architecturewide Concern." (The body paragraph and bullet list
under this heading rendered as empty accessibility nodes and were not
recoverable as text — see 00-access-log.md.)
EVIDENCE: Heading text only; the elaborating prose is an access gap.
WHY IT MATTERS: Still usable as a claim (the heading itself is a strong,
explicit editorial claim), but the article must not invent supporting
detail Forrester did not supply for this specific paragraph. Supporting
detail on evaluation instead draws on the FP report and on the "testing
practices are... unsettled... emergent, runtime driven" claim from the
earlier section of this same report (already logged above), which *is*
fully retrieved.
CONFIDENCE: Medium — heading confirmed, body content gap disclosed.
ARTICLE USE: Section header framing only ("testing and evaluation are
architecture-wide, not a gate") with supporting detail drawn from
elsewhere in this same report.

---

CLAIM (orchestration): The heading "Agentic Orchestration Stitches
Together The Whole Package" is present, but its body paragraph and bullets
also rendered as empty nodes (same access gap).
SOURCE: FA, heading only.
EVIDENCE: Heading text only.
CONFIDENCE: Medium — heading confirmed, body content gap disclosed.
ARTICLE USE: The article's orchestration section instead leans on the
architectural-pattern claims below (single agent / sequential / orchestrator
patterns), which fully rendered and already make Forrester's orchestration
argument concretely.

---

CLAIM (architectural patterns): There is no one-size-fits-all architecture
for agentic AI — different use cases, workflows, performance, compliance,
and explainability requirements dictate different choices in how agentic
decisions are distributed, reasoned over, and executed. Forrester names
(at least) three patterns with full detail retrieved:
(1) Single agent architecture — for targeted agentic products/workflows
(heading retrieved; body paragraph not fully retrieved — partial gap).
(2) Sequential multiagent architecture — for linear task flows: work is
decomposed into agents with discrete task boundaries; each agent has its
own lightweight runtime and narrowly scoped reasoning; memory handoffs are
explicit (transient scratchpads/structured outputs, not shared long-term
memory); tool calling is more deterministic (agents invoke task-aligned
tools); guardrails apply per step (input validation before handoff, output
checks after execution), reducing blast radius; access control is easier to
reason about (narrowly-scoped, task-aligned permissions per agent); teams
can unit-test agents independently and trace decisions on a linear path.
Trade-off: rigidity — linear flows struggle with dynamic replanning or
parallelism.
(3) Multiagent architecture with an orchestrator (assign/distribute/
assemble) — coordination is externalized to an explicit orchestrator agent
that decomposes, orders, retries, and recovers, while task execution stays
atomic. Runtime is more distributed: the orchestrator manages state/
execution flow while task agents execute independently across model
endpoints and tools. Memory is deliberately split — the orchestrator holds
global state, task agents receive only task-relevant context. Tool
discovery is centralized through registries, letting the orchestrator
constrain what agents can invoke at runtime. Guardrails shift from
prompt-level constraints to execution-level controls (policy checks,
retries, degraded-mode behavior) — and interviewees emphasized these
controls are not free and should be factored into SLA costs. Access control
reflects role-based agent identities rather than direct user-permission
inheritance. Testing and monitoring mature significantly in this pattern:
orchestrators enable trajectory analysis, step-level observability, and
targeted remediation when an agent fails mid-workflow.
A fourth pattern (cross-agent collaboration, "To Allow Cross-Agent
Collaboration, Use A Multiagent Architecture With An Orchestrator") is
named in a heading but its distinguishing body text did not render (gap).
SOURCE: FA, "Choose the Right Architectural Pattern For Each Agentic
System."
EVIDENCE: Direct/near-verbatim for patterns 1(partial)/2/3; heading-only for
pattern 4.
WHY IT MATTERS: This is the single richest piece of primary evidence in the
whole corpus for the article's "workflow vs. agent," "orchestration vs.
autonomy," and "architecture tradeoffs" sections. It gives a genuine
decision framework (task linearity, parallelism need, compliance/
explainability needs) rather than a marketing taxonomy, and it explicitly
ties each pattern to concrete consequences for memory, guardrails, access
control, and testability — i.e., architecture choice determines control-
plane shape, which is exactly the brief's Phase 7 thesis.
CONFIDENCE: High for patterns 2 and 3 (near-verbatim); medium for pattern 1
(heading + one line only); pattern 4 is a disclosed gap and is described in
the article only as "named but not elaborated by this source," never given
invented detail.
ARTICLE USE: Backbone of the "architecture tradeoffs" section and the
reference architecture; single most load-bearing source note in the corpus.

---

SOURCE-ACCESS NOTE: This report's "Testing And Evaluation," "Agentic
Orchestration," and the fourth architectural pattern's supporting prose did
not render as extractable text (see 00-access-log.md). No invented detail
fills those gaps anywhere in the article; each corresponding article
section instead draws on fully-retrieved material from elsewhere in this
report or from FP.
