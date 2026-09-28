# Source access log

Date: 2026-09-28. Method: Hermes browser tool (rendered DOM snapshot).

## 1. Gartner — https://www.gartner.com/doc/reprints?id=1-2NH56LHZ&ct=260602&st=sb

STATUS: BLOCKED. Every navigation attempt (4 tries, different moments) returned
a Cloudflare interstitial ("Just a moment...", bot-detection challenge,
`Ray ID` only — no report content in the DOM). No archive.org snapshot exists
for this URL (personalized/licensed Gartner reprint links are recipient-scoped
and are not crawled/archived). `web_search` for the reprint id ("1-2NH56LHZ")
returned unrelated third-party reprints of *different* Gartner documents,
which were not used.

Per governance (do not bypass access controls; do not fabricate content;
document the gap; continue with legitimately accessible evidence): Gartner is
treated as an **inaccessible primary source** for this article. No claim in
the article is attributed to "Gartner" as if its content were read. Where the
article needs to describe the Gartner-branded frame that a reader would
recognize (Magic Quadrant / Critical Capabilities style vendor evaluation,
composable "TRiSM"-style governance framing), it is described in general,
widely-published terms about Gartner's public research categories, explicitly
marked as background knowledge, not as a citation to this specific document,
and never given a page/section-level citation key. The claim matrix and
article treat this corpus as **two primary sources** (Forrester AI Platforms
Q1 2026, Forrester Architect's Guide to Agentic AI), not three.

## 2. Forrester — The AI Platforms Landscape, Q1 2026

STATUS: ACCESSIBLE. Full reprint page rendered via browser (no login wall on
the reprint page itself). Authors: Mike Gualtieri, Rowan Curran, and three
contributors. Report type: Landscape Report. Full text of every prose
section was retrieved (Summary, Market Definition, Business Value, Market
Maturity, Market Dynamics, Notable Vendors, Top Use Cases, Functionality By
Use Case, Vendor Focus). The report's value lies mostly in prose framing;
its numbered figures (vendor list, functionality matrices, market-dynamics
grid) are described only through their alt-text captions — the underlying
spreadsheet data was not accessible and is not reproduced or guessed at.
Bulleted sub-lists under several headings (Business Value, Market Maturity,
Market Dynamics) rendered as empty `listitem` nodes in the accessibility
snapshot (the visual bullet glyphs are likely CSS-drawn, not DOM text) — this
is a **partial-extraction gap**: some enumerated bullet points under those
three headings were not recoverable as text. The narrative claims from the
surrounding prose are unaffected and are the ones used in the article.

## 3. Forrester — The Architect's Guide to Agentic AI

STATUS: ACCESSIBLE. Full reprint page rendered via browser. Lead author:
Rowan Curran, with ten contributors (five named additional contributors:
Charles Betz, Devin Dickerson, Leslie Joseph, Diego Lo Giudice, Ken Parmelee).
Report type: Best Practice Report. Full prose text retrieved for: Summary,
"Agentic AI Architectures Emerge From The Top Down And Bottom Up," all eight
components of agentic application architecture (runtime, reasoning, memory,
tool discovery/calling, guardrails, security, testing/evaluation,
orchestration), and three of the four architectural patterns (single agent;
sequential multiagent; multiagent with orchestrator for assign/distribute/
assemble). The same empty-bullet accessibility-snapshot gap noted above
affects a handful of sub-bullets (e.g., under Tool Discovery, Testing And
Evaluation, and Orchestration headings, and the fourth "cross-agent
collaboration" pattern, whose paragraph text did not render). Those specific
unlisted bullets are not cited; the article uses only the prose that
rendered as text and is marked above as retrieved.

## Net corpus used for synthesis

Two full primary sources (Forrester AI Platforms Q1 2026; Forrester
Architect's Guide to Agentic AI), each read directly, not as a paraphrase of
a paraphrase. Gartner is a documented, disclosed source-access gap. The
article never claims a Gartner position it did not itself read.
