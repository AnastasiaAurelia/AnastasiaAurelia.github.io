# Claim matrix — AI platform architecture synthesis

Two-source corpus (Gartner inaccessible; see 00-access-log.md). Columns:
FP = Forrester AI Platforms Q1 2026; FA = Forrester Architect's Guide to
Agentic AI. "—" means the report does not address the category with
retrievable text. Full detail lives in 01-source-notes/. This file
compresses the ~50-category brief taxonomy into the categories that
actually carry evidence, grouping empties.

| Category | FP | FA | Relationship |
|---|---|---|---|
| Platform definition | Defines AI platform as lifecycle-spanning software (data→inference) building composable components/agents/apps on any model type | Assumes the platform substrate; focuses one layer up | Complementary — FP=outer boundary, FA=inner architecture of the agentic layer |
| Architecture (whole-system) | Figure-1 alt-text: two model tracks → ModelOps → agentic apps → semantic layer + governance/security wrapper | Eight components of agentic *application* architecture (runtime, reasoning, memory, tools, guardrails, security, testing, orchestration) | FA's eight components sit inside FP's "AI and agentic applications" box — different grain, same object, no contradiction |
| Model vs. system | Value delivery has shifted to "AI application delivery," accelerated by agentic AI | Reasoning "emerges from the interaction between the model, the execution... structure of context... and constraints," not the model alone | Convergent — both explicitly demote the model from "the product" to "one input" |
| Orchestration / patterns | — (not addressed at this grain) | Three fully-detailed patterns (single agent; sequential; orchestrator-based) tied to concrete memory/guardrail/access/testing consequences | FA is the sole source; used as the backbone of the tradeoffs section |
| Memory | Names "memory and state" as an agentic-app component (figure alt-text) | Four-layer memory model (context/session/personal-long-term/institutional-long-term), explicitly distinct from a model's context window | FA is far more granular; FP only names the category |
| Tools / action | Names "RAG and tool use" as an agentic-app component | Tool discovery insufficient without consistent/unambiguous tool *behavior*; downstream success hinges on tool-layer design | Convergent naming, FA supplies the mechanism |
| Governance / control plane | Names an "enterprise semantic layer" (ontology, lineage, governance, feature store) and a wrapping security/threat/governance framework | Names IAM as the least-mature control area (new identity type); AEGIS model (least agency, high explainability, adaptable risk posture); guardrails span code/model/business-rule mechanisms | Convergent — both wrap the stack in governance/security; FA is far more specific about *why* it's hard (agent-as-identity, delegation paths) |
| Evaluation / observability | "Observability" named as both a use case *and* a required functionality for other use cases | Testing/evaluation framed as "architecture-wide," inseparable from other components; agentic failures are emergent/runtime-driven, unlike classic software bugs | Convergent tension: observability is simultaneously a sellable product category (FP) and a cross-cutting necessity (FA) — worth surfacing, not smoothing over |
| Market structure / composability | Vendors from DPA, API management, search/retrieval, and customer-service markets are all building "AI platforms"; RAG-focused startups also entering | Best practice explicitly rejects one monolithic ideal-state architecture in favor of modular, deliberate, adaptable design | Convergent — market fragmentation (FP) and architectural modularity (FA) are two sides of the same "no single platform owns the whole stack" claim |
| Autonomy vs. control | — | "Agentic sprawl" (60% of decision-makers cite it as a challenge, Forrester Q4 2025 AI Pulse survey); sprawl compounds because teams add agents/tools/prompts/endpoints independently, multiplying governance overhead | FA is the sole, but strong, empirical anchor for "more autonomy without more control produces sprawl, not scale" |
| Security | — (not addressed at this grain) | New attack surfaces (prompt injection, data poisoning); trust boundary redefinition; delegation paths traditional IAM can't handle | FA sole source; used directly, attributed |
| Failure modes (general) | Buyer confusion is named as the market's top challenge (Figure-2 alt-text) | Over-indexing on one control layer (prompts, orchestration, or rules alone) "leaves critical failure modes exposed" | Convergent — both name partial/uneven adoption of the stack as a named risk, not a hypothetical |

## Apparent tension worth stating explicitly (not smoothing over)

Forrester's own market report (FP) treats "AI platform" as a single
purchasable category with 40 named vendors, size tiers, and a functionality
checklist — a *product* framing. Forrester's own architecture report (FA)
insists there is no single ideal-state architecture and that best practices
for the core disciplines are still immature. Read together, these are not
contradictory, but they do puncture a common enterprise mistake the article
should name directly: buying a platform that scores well against FP's
functionality checklist does not discharge the architecture-design work FA
describes as still largely unsolved. A procurement answer is not an
architecture answer. This tension is genuinely emergent from comparing the
two documents — neither report states it this way on its own — and is
flagged in the article as author synthesis.

## What is genuinely new only when the two reports are read together

1. FP's "AI application delivery is the focus of value" plus FA's "reasoning
   emerges from execution + context + constraints, not the model" together
   yield a stronger claim than either alone: the market *and* the
   architecture have both re-centered away from the model, independently,
   for different reasons (market: buyer behavior; architecture: technical
   reality of how reasoning actually works). Two independent signals
   converging on the same relocation of "the system" is the article's
   central synthesis claim.
2. FP's semantic/governance wrapper (named as infrastructure) plus FA's
   AEGIS/IAM argument (named as immature) together show that the control
   plane is simultaneously treated as a *solved, sellable layer* by the
   market (FP lists governance/semantic-layer tooling as an existing
   platform component) and as a *largely unsolved discipline* by architects
   (FA: "identity and access management is one of the least mature areas").
   That gap — sold as available, not actually mature — is exactly the kind
   of "what organizations are likely to get wrong" material the brief asks
   for, and it is derived, not stated by either source alone.
3. FA's pattern table (memory handoffs, guardrail placement, access-control
   granularity, and testability all change *together* when you pick an
   orchestration pattern) is direct evidence against treating "add an
   orchestrator" as a drop-in upgrade — it changes the control plane's shape,
   not just the execution plane's. This becomes the article's control-
   plane/execution-plane distinction (Phase 7 of the brief), grounded in FA
   rather than invented.
