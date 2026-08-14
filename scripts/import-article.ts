/** Import a portfolio article as an idempotent Sanity draft.
 * Run: node --env-file=scripts/.env.migration scripts/import-article.ts <slug> [--revision]
 * --revision reads the published sibling as the base and writes only drafts.*.
 */
import { createClient } from '@sanity/client'
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const studioRequire = createRequire(new URL('../studio/package.json', import.meta.url))
const client = token && projectId && dataset
  ? createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })
  : (() => {
      const originalDirectory = process.cwd()
      try {
        process.chdir(fileURLToPath(new URL('../studio/', import.meta.url)))
        return studioRequire('sanity/cli').getCliClient({ apiVersion: '2025-01-01' })
      } finally {
        process.chdir(originalDirectory)
      }
    })()
let sequence = 0
const key = () => `lpr-${++sequence}`
const block = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal', listItem?: 'bullet' | 'number') => ({ _type: 'block', _key: key(), style, ...(listItem ? { listItem, level: 1 } : {}), markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const bullets = (...items: string[]) => items.map((item) => block(item, 'normal', 'bullet'))
const table = (headers: string[], rows: string[][], caption?: string) => ({ _type: 'dataTable', _key: key(), headers, rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })), ...(caption ? { caption } : {}) })
const callout = (title: string, body: string, tone: 'info' | 'warning' | 'success' = 'info') => ({ _type: 'callout', _key: key(), title, body, tone })
const math = (latex: string, databaseDefinition: string) => ({ _type: 'math', _key: key(), latex, display: true, databaseDefinition })
const diagram = (title: string, variant: 'pipeline' | 'timeline', steps: Array<[string, string?]>, relationships?: string[], warning?: string, caption?: string) => ({ _type: 'processDiagram', _key: key(), title, variant, steps: steps.map(([label, field]) => ({ _type: 'processStep', _key: key(), label, ...(field ? { field } : {}) })), relationships, warning, caption })
const linkedBlock = (before: string, label: string, href: string, after = '') => {
  const markKey = key()
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [{ _type: 'link', _key: markKey, linkType: 'external', href, newTab: true }], children: [{ _type: 'span', _key: key(), text: before, marks: [] }, { _type: 'span', _key: key(), text: label, marks: [markKey] }, { _type: 'span', _key: key(), text: after, marks: [] }] }
}
const articleImage = (assetRef: string, alt: string, caption: string, layout: 'normal' | 'wide' | 'full' = 'wide', source = 'ResearchLens public application', sourceUrl = source === 'ResearchLens public application' ? 'https://app.researchlens.xyz' : undefined) => ({ _type: 'articleImage', _key: key(), asset: { _type: 'reference', _ref: assetRef }, alt, caption, source, ...(sourceUrl ? { sourceUrl } : {}), layout })
type SwimlaneState = 'process' | 'decision' | 'pending' | 'blocked' | 'success'
type SwimlaneNodeSource = [label: string, detail?: string, state?: SwimlaneState, transitions?: string[]]
const swimlane = (title: string, summary: string, lanes: Array<[string, SwimlaneNodeSource[]]>, caption?: string) => ({
  _type: 'swimlaneDiagram', _key: key(), title, summary,
  lanes: lanes.map(([name, nodes]) => ({ _type: 'swimlane', _key: key(), name, nodes: nodes.map(([label, detail, state = 'process', transitions]) => ({ _type: 'swimlaneNode', _key: key(), label, ...(detail ? { detail } : {}), state, ...(transitions ? { transitions } : {}) })) })),
  ...(caption ? { caption } : {}),
})

const lprBody = [
  callout('Outcome', 'I turned an unreliable timing metric into a defensible event model and analysis pipeline. The key result was not a pretty bell curve; it was catching a sign/semantics error before it could be mistaken for user behavior.', 'success'),
  block('The original ask', 'h2'),
  block('Measure how long users take to tap after loop detection, then find the interval with the highest LPR capture success. The working hypothesis was that very fast or very slow taps could correlate with failure.'),
  block('The investigation changed once the stored LPR delta came back negative. Before correlating speed with success, I had to prove that every timestamp meant what we thought it meant.'),
  block('The value of the work', 'h2'),
  block('A query and a chart were only the visible outputs. The useful part was separating what I built, how I reasoned about the system, and what the team could safely decide afterward.'),
  table(['Level', 'What happened', 'Why it mattered'], [
    ['Deliverables', 'Event dictionary, corrected delta definitions, raw-timestamp SQL checks, gate/hour/date analysis plan.', 'A repeatable way to inspect LPR timing without relying on a derived field.'],
    ['Ideas', 'Treat observability as a prerequisite for behavioral analysis. Separate user latency from system latency before looking for correlation.', 'Prevents a broken metric from becoming a false product conclusion.'],
    ['Outcome', 'The negative delta was traced to event-order / subtraction semantics, and the analysis was rebuilt around validated raw timestamps.', 'The team gets a trustworthy measurement contract for future capture-success analysis.'],
  ]),
  block('Research question', 'h3'), block('How does the elapsed time between vehicle detection and user tap relate to LPR capture success, after invalid timestamp records are removed?'),
  block('Why the original analysis was fragile', 'h3'),
  ...bullets('The plan assumed the timing fields were already semantically correct.', 'A bell curve was proposed too early. Tap speed does not need to be normally distributed, so the final method uses the empirical distribution first.', 'Capture success can vary by gate, hour, hardware and traffic conditions. A global average can hide a gate-specific failure.'),
  diagram('Analysis validity pipeline', 'pipeline', [['Raw timestamps'], ['Event-order validation'], ['Delta calculation'], ['Success-rate analysis']], undefined, 'If the event order is wrong, stop here. Do not fit the curve.', 'The analysis only proceeds after event-order validation.'),
  block('Reconstructing the event model', 'h2'),
  block('The first task was to stop treating the database columns as self-explanatory. I mapped each timestamp back to a physical event in the lane.'),
  diagram('Physical event timeline', 'timeline', [['Loop detects vehicle', 'loop_detect_timestamp'], ['LPR captures plate', 'capture_lpr_timestamp'], ['User taps / scans', 'start_transaction_timestamp']], ['loop_to_capture = capture − loop', 'tap_speed = tap − loop', 'lpr_to_tap = tap − capture'], undefined, 'Final event semantics used in the analysis.'),
  table(['Field', 'Physical event', 'Final definition', 'Use'], [
    ['loop_detect_timestamp', 'Vehicle reaches the loop / trigger', 'Start of user tap window', 'Tap-speed denominator'],
    ['capture_lpr_timestamp', 'LPR records the plate', 'System capture event', 'System latency / event order'],
    ['start_transaction_timestamp', 'Card tap or ticket scan', 'End of user tap window', 'Tap event'],
    ['capture_status', 'SDK and Agent record match by time + plate', 'success / fail', 'Outcome variable'],
  ]),
  block('The three deltas', 'h3'),
  math('\\text{tap\\_speed}=t_{\\text{tap}}-t_{\\text{loop}}', 'tap_speed = start_transaction_timestamp - loop_detect_timestamp; t_tap = start_transaction_timestamp; t_loop = loop_detect_timestamp'),
  math('\\text{lpr\\_to\\_tap}=t_{\\text{tap}}-t_{\\text{capture}}', 'lpr_to_tap = start_transaction_timestamp - capture_lpr_timestamp; t_tap = start_transaction_timestamp; t_capture = capture_lpr_timestamp'),
  math('\\text{loop\\_to\\_capture}=t_{\\text{capture}}-t_{\\text{loop}}', 'loop_to_capture = capture_lpr_timestamp - loop_detect_timestamp; t_capture = capture_lpr_timestamp; t_loop = loop_detect_timestamp'),
  callout('Integrity rule', 'For a normal transaction, loop detection should precede LPR capture, and LPR capture should usually precede the user tap. Any record that violates the expected physical order is investigated before it enters the success-rate analysis.', 'warning'),
  block('The negative delta was the clue', 'h2'),
  block('Two sampled transactions showed the same pattern: the LPR capture happened several seconds before the card tap, yet the derived LPR delta was negative.'),
  table(['Sample', 'Plate', 'LPR capture', 'User tap', 'Stored delta'], [['1', 'B2808UUI', '11:27:26', '11:27:30', '-4.101 s'], ['2', 'H1988NM', '11:26:16', '11:26:20', '-3.824 s']]),
  block('Root cause', 'h3'),
  block('The negative values were not evidence that the LPR system travelled backward in time. The subtraction direction was inconsistent with the business meaning of the metric. Computing capture_lpr_timestamp - start_transaction_timestamp is expected to be negative when capture happens before the tap. The desired business metric instead requires start_transaction_timestamp - capture_lpr_timestamp.'),
  { _type: 'code', _key: key(), language: 'sql', filename: 'Validate one parking slip from raw timestamps', code: `SELECT\n  extract(epoch from (\n    capture_lpr_timestamp - loop_detect_timestamp\n  )) AS loop_to_capture_s,\n\n  extract(epoch from (\n    start_transaction_timestamp - capture_lpr_timestamp\n  )) AS lpr_to_tap_s,\n\n  extract(epoch from (\n    start_transaction_timestamp - loop_detect_timestamp\n  )) AS tap_speed_s\n\nFROM parking_slip_logs\n\nWHERE id = :parking_slip_id;` },
  block('What I validated directly', 'h3'),
  ...bullets('Raw source timestamps instead of trusting a precomputed delta.', 'Seconds and milliseconds for the same transaction to catch precision issues.', 'NULL behavior.', 'Negative values before aggregation.', 'Timestamp types.', 'Event ordering assumptions.'),
  block('Final analytical method', 'h2'), block('Once the event semantics were stable, the original tap-speed question became safe to answer. The method validates first, avoids assuming a normal distribution, and separates system timing from user timing.'),
  ...[
    ['01 — Build the event table', 'One row per parking slip with plate, gate, date/hour, three raw timestamps and capture_status.'],
    ['02 — Apply validity gates', 'Remove NULLs, impossible ordering and records that cannot be matched reliably between LPR and Agent.'],
    ['03 — Compute independent deltas', 'Calculate tap_speed, loop_to_capture and lpr_to_tap separately from validated raw timestamps.'],
    ['04 — Inspect the empirical distribution', 'Use a histogram or ECDF before fitting any bell curve. Outlier thresholds come from observed data, not an illustrative diagram.'],
    ['05 — Estimate capture success by speed band', 'Bucket tap_speed—for example into 0.5- or 1-second bins—then compute success rate and sample size for each band. These bin sizes are examples, not universal thresholds.'],
    ['06 — Stratify before concluding', 'Compare by gate, hour and date so one healthy gate does not mask another gate’s failure.'],
    ['07 — Only then define an operating window', 'Choose a candidate tap window only where success is sufficiently high and sample size is sufficient. This is a product and operations threshold, not a universal law.'],
  ].flatMap(([heading, text]) => [block(heading, 'h3'), block(text)]),
  block('What changed after the investigation', 'h2'),
  block('The project started as a request for a tap-speed chart. It ended with a better asset: a measurement contract the team can reuse whenever capture timing is questioned.'),
  table(['Before', 'After', 'Decision value'], [
    ['A negative derived delta was treated as suspicious data.', 'The sign is explained by event order and the subtraction direction.', 'Avoid false timestamp-anomaly conclusions.'],
    ['User tap speed and LPR timing were mixed together.', 'User latency and system latency are separate metrics.', 'A failure can be traced to the lane, the LPR pipeline, or user timing.'],
    ['The analysis assumed a bell-shaped distribution.', 'The empirical distribution is inspected first.', 'Thresholds are based on observed behavior rather than a visual assumption.'],
    ['One global success curve could hide local failures.', 'Results are stratified by gate, hour and date.', 'Operational action can target the gate that is actually failing.'],
  ]),
  block('Completed outcome', 'h3'), callout('The thing the team gets', 'A trustworthy way to answer timing questions without confusing a calculation bug with a product problem. The investigation established event definitions, corrected delta direction, validation gates, independent timing metrics, and a defensible analysis sequence.', 'success'),
  block('Engineering and operations recommendations', 'h3'),
  ...bullets('Do not use the original negative delta as a failure signal by itself. Fix metric semantics first.', 'Keep raw event timestamps available. Derived columns should be reproducible from source events.', 'Monitor tap_speed, loop_to_capture and lpr_to_tap separately by gate.', 'Set capture-success thresholds only after enough valid transactions exist in each speed band.'),
  block('The project in one page', 'h2'),
  ...[['Problem', 'Determine whether fast or slow user taps were associated with failed LPR captures.'], ['Constraint', 'The timing metric itself was not trustworthy because sampled transactions produced negative derived deltas even though raw timestamps showed physically sensible sequencing.'], ['Investigation', 'Map timestamps to physical events, inspect raw LPR and Agent logs, validate timestamp pairs in SQL, and separate user timing from system timing.'], ['Finding', 'The negative value was explained by subtraction direction relative to event order.'], ['Final design', 'Validated raw timestamps → independent deltas → empirical distribution → capture success by speed band → gate/hour/date stratification → candidate operating window only after validity checks.'], ['Outcome', 'A defensible measurement pipeline instead of a chart built on an ambiguous metric.']].flatMap(([heading, text]) => [block(heading, 'h3'), block(text)]),
  callout('Portfolio note — evidence limitation', 'The original working material did not contain a production-wide final sweet-spot percentage. This case study completes the investigation using the evidence that actually exists. The methodology may be extended, but no capture-rate result is fabricated.', 'warning'),
]

const lprDocument = { _type: 'article', title: 'The chart was easy. Proving the timestamps was the real project.', excerpt: 'A production analytics investigation into LPR tap speed, event semantics, and why measurement integrity must be established before correlation.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Computer Vision', 'LPR', 'Data Validation', 'Product Analytics', 'SQL', 'Observability', 'Event Semantics', 'Measurement'], category: 'Computer Vision / Data Validation', featured: false, role: 'Product Manager - LPR / Computer Vision', projectType: 'Production Analytics / Incident Investigation', system: 'Parking LPR + Agent Logs', coreQuestion: 'Does tap speed affect capture success?', evidence: 'Raw timestamps, SDK / Agent logs, SQL', status: 'Completed as measurement-validation study', seoTitle: 'LPR Timing Analysis: Measurement Before Correlation', seoDescription: 'An LPR timing investigation into event semantics, data validation, SQL, and why measurement integrity must precede correlation.', body: lprBody }

const intersectionFormula = `=IF(
  AND(X117="", Y117=""),
  "",
  IF(
    AND(
      X117<>"",
      Y117<>"",
      SUMPRODUCT(
        ($Y$2:$Y=X117) *
        ($S$2:$S<>"") *
        (ABS($S$2:$S-P117)<=10/1440)
      )>0,
      SUMPRODUCT(
        ($X$2:$X=Y117) *
        ($P$2:$P<>"") *
        (ABS($P$2:$P-S117)<=10/1440)
      )>0
    ),
    "VALID DI SDCARD & AGENT",
    IF(
      AND(
        X117<>"",
        SUMPRODUCT(
          ($Y$2:$Y=X117) *
          ($S$2:$S<>"") *
          (ABS($S$2:$S-P117)<=10/1440)
        )>0
      ),
      "VALID DI SDCARD",
      IF(
        AND(
          Y117<>"",
          SUMPRODUCT(
            ($X$2:$X=Y117) *
            ($P$2:$P<>"") *
            (ABS($P$2:$P-S117)<=10/1440)
          )>0
        ),
        "VALID DI AGENT",
        "MISMATCH"
      )
    )
  )
)`
const lossAgentFormula = `=IF(
  X127="",
  "",
  IF(
    OR(
      SUMPRODUCT(
        ($Y$2:$Y=X127) *
        (ABS($S$2:$S-P127)<=10/1440)
      )>0,
      SUMPRODUCT(
        ($X$2:$X=Y127) *
        (ABS($P$2:$P-S127)<=10/1440)
      )>0
    ),
    "",
    "Loss_Agent"
  )
)`
const parkingOnlyFormula = `=IF(
  AND(
    AP127="PARKEE",
    AR127="Loss_Agent"
  ),
  "FLAG",
  ""
)`
const lossSdcardFormula = `=IF(
  S106="",
  "",
  IF(
    SUMPRODUCT(
      ($AP$2:$AP="PARKEE") *
      (ABS($P$2:$P-S106)*1440<=10)
    )>0,
    "VALID",
    "TDK ADA DI SDCARD"
  )
)`

const project2Body = [
  callout('Outcome', 'A row-level gap is not automatically a missing event. The matrix established whether the same parking event existed elsewhere in the other log before classifying it as loss.', 'success'),
  block('The problem', 'h2'),
  block('SDCARD and Agent observed the same parking flow from separate data sources. The task was not simply to check whether a plate existed. It was to determine whether two records represented the same physical event within an acceptable time window.'),
  block('Why a simple lookup is not enough', 'h2'),
  block('The same event does not have to land on the same row. Timestamps can differ, a plate can appear more than once, and a record can exist only on one side. An exact row lookup would turn those conditions into false failures.'),
  table(['Naive question', 'Useful question'], [['Is the Agent cell empty on this row?', 'Can the same plate be found in the other system within ±10 minutes, in either direction?']]),
  block('The matching contract', 'h2'),
  block('A candidate match requires the same plate and an absolute timestamp difference no greater than ten minutes. In spreadsheet time, the tolerance is 10/1440 because one day contains 1,440 minutes.'),
  math('|\\Delta t| \\leq 10\\text{ minutes}', 'Δt = t_Agent - t_SDCARD; candidate match = same plate AND absolute timestamp difference ≤ 10 minutes'),
  diagram('Bidirectional SDCARD and Agent reconciliation', 'pipeline', [['SDCARD log', 'plate + timestamp'], ['Matching window', 'same plate; |Δt| ≤ 10 minutes'], ['Agent log', 'plate + timestamp']], ['SDCARD → Agent', 'Agent → SDCARD', 'Outputs: VALID DI SDCARD & AGENT · VALID DI SDCARD · VALID DI AGENT · MISMATCH'], undefined, 'Both directional searches use plate identity and the configured ±10-minute window.'),
  block('Field mapping', 'h3'),
  table(['Reference', 'Meaning'], [['X', 'SDCARD plate'], ['Y', 'Agent plate'], ['P', 'SDCARD timestamp'], ['S', 'Agent timestamp'], ['10/1440', '10-minute spreadsheet-time tolerance']]),
  block('Goal 1 — intersection and two-way validation', 'h2'),
  block('INTERSECTION_2ARAH checks whether the same plate appears in both logs within the configured tolerance. One SUMPRODUCT searches SDCARD → Agent; the other independently searches Agent → SDCARD.'),
  table(['Output', 'Meaning'], [
    ['VALID DI SDCARD & AGENT', 'The plate/event can be validated in both systems within the tolerance window.'],
    ['VALID DI SDCARD', 'The SDCARD-side condition can be validated according to the formula logic.'],
    ['VALID DI AGENT', 'The Agent-side condition can be validated according to the formula logic.'],
    ['MISMATCH', 'No acceptable match was found in either direction.'],
  ]),
  { _type: 'code', _key: key(), language: 'excel', filename: 'INTERSECTION_2ARAH', code: intersectionFormula },
  block('Why bidirectional validation matters', 'h3'),
  block('Checking only SDCARD → Agent answers whether an SDCARD record has Agent evidence. It does not independently answer whether an Agent record has SDCARD evidence. The second SUMPRODUCT performs that reverse-direction check.'),
  block('Goal 2 — LOSS_AGENT detection', 'h2'),
  block('LOSS_AGENT identifies an SDCARD vehicle event for which no acceptable Agent-side match can be established within ±10 minutes. When a qualifying match exists, the formula returns blank; otherwise it returns Loss_Agent.'),
  { _type: 'code', _key: key(), language: 'excel', filename: 'LOSS_AGENT', code: lossAgentFormula },
  block('Goal 3 — PARKEE-specific loss filtering', 'h2'),
  block('FLAG_PARKING_ONLY narrows the operational filter to records whose vehicle type is PARKEE and whose prior result is Loss_Agent. AP is vehicle type; AR is the loss result.'),
  { _type: 'code', _key: key(), language: 'excel', filename: 'FLAG_PARKING_ONLY', code: parkingOnlyFormula },
  block('Goal 4 — LOSS_SDCARD detection', 'h2'),
  block('LOSS_SDCARD checks the reverse missing side: whether an Agent-side detection lacks a corresponding SDCARD record within the tolerance. This source formula is restricted to PARKEE and returns VALID or TDK ADA DI SDCARD.'),
  { _type: 'code', _key: key(), language: 'excel', filename: 'LOSS_SDCARD', code: lossSdcardFormula },
  diagram('Conceptual reconciliation model', 'pipeline', [['Event', 'plate + timestamp'], ['Found in both?', 'bidirectional window check'], ['Classify result', 'matched or determine missing side']], ['YES → VALID DI SDCARD & AGENT', 'SDCARD exists; Agent missing → Loss_Agent', 'Agent exists; SDCARD missing → TDK ADA DI SDCARD'], undefined, 'Conceptual decision model; the formulas above remain the authoritative spreadsheet implementation.'),
  block('Four validation layers', 'h2'),
  table(['Layer', 'Question', 'Formula'], [
    ['1 — Intersection', 'Did both systems observe the event?', 'INTERSECTION_2ARAH'],
    ['2 — Agent loss detection', 'Did SDCARD observe an event that Agent did not?', 'LOSS_AGENT'],
    ['3 — Vehicle-specific filtering', 'Is the identified loss relevant to PARKEE transactions?', 'FLAG_PARKING_ONLY'],
    ['4 — SDCARD loss detection', 'Did Agent observe an event that SDCARD did not?', 'LOSS_SDCARD'],
  ]),
  block('What the matrix produced', 'h2'),
  block('The matrix classifies records into reconciliation evidence, discrepancy states, missing-side identification, and PARKEE-specific loss flags. It does not repair missing records or prove why a discrepancy occurred.'),
  block('Why this is more than a spreadsheet', 'h2'),
  block('The spreadsheet is a lightweight reconciliation and validation layer. It defines what constitutes a match, how much timestamp drift is tolerated, how each direction is checked, how mismatches are categorized, and how the missing side is isolated. It does not remediate missing records or constitute a production reconciliation service.'),
  block('What the formulas prove—and what they do not', 'h2'),
  ...bullets('They provide reconciliation evidence and discrepancy classification under the configured plate/time rules.', 'They identify which side lacks a qualifying corresponding record.', 'They do not establish the downstream root cause of a discrepancy by themselves.', 'They do not measure false-match or false-nonmatch rates.'),
  callout('Limitations', 'The source documents spreadsheet logic and a reviewed workbook slice, not a production service. ±10 minutes is the configured tolerance for this analysis. No measured false-match rate or production-wide reconciliation accuracy is provided. The formulas detect discrepancies but do not establish downstream root cause by themselves.', 'warning'),
  callout('Privacy note', 'The source spreadsheet screenshot contains operational records. This article intentionally uses native diagrams, abstract field mappings, and formula references instead of reproducing vehicle plates, transaction identifiers, or raw event timestamps.', 'info'),
]

const project2Document = { _type: 'article', title: "The spreadsheet wasn't the project. Making two systems agree was.", excerpt: 'A bidirectional reconciliation matrix for validating SDCARD and Agent parking events using plate matching, timestamp tolerance, and missing-record detection.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Data Validation', 'Data Reconciliation', 'SDCARD', 'Agent', 'Excel', 'Operational Analytics', 'Observability', 'Data Quality', 'Systems Analysis'], category: 'Data Validation / Systems Reconciliation', featured: false, projectType: 'Cross-System Data Validation / Operational Analysis', system: 'SDCARD + Agent Logs', coreQuestion: 'Did both systems observe the same parking event?', evidence: 'Spreadsheet formulas, cached classification outputs, SDCARD and Agent logs', status: 'Completed', seoTitle: 'SDCARD vs Agent Cross-Validation | Anastasia Aurelia', seoDescription: 'A technical case study on bidirectional reconciliation between SDCARD and Agent logs using plate identity, timestamp tolerance, and missing-event detection.', body: project2Body }

const project3Body = [
  callout('The real problem', 'The problem was not measuring recognition. It was explaining why a transaction failed after recognition had already succeeded.', 'info'),
  block('Outcome and value', 'h2'),
  block('The visible output was an 87-page evidence pack. The higher-value outcome was a reusable diagnostic model that combines sustained baselines, recent movement, gate bottlenecks, anomaly ownership, and image-level evidence.'),
  table(['Level', 'What was built or changed', 'Why it mattered'], [
    ['Deliverables', '30D + 7D site baselines, daily incident evidence, effective-accuracy views, 17-case anomaly taxonomy, gate-level diagnosis', 'The tangible analysis'],
    ['Ideas', 'Treat LPR as a multi-stage transaction; separate baseline from recency; separate actual from effective potential; use the weakest gate as an end-to-end constraint', 'The reasoning system'],
    ['Outcomes', 'Route a low score to software/data, infrastructure, operations, or the OCR vendor with evidence and a verification loop', 'The operating decision'],
  ]),
  table(['Role', 'Scope', 'Sites', 'Target'], [['Product / Data Analysis', 'Performance model, anomaly taxonomy, evidence framework, root-cause routing', 'CFX, Matraman, JRP, Menteng Central, Gading Riverview', '99.9% SLO']]),
  block('One percentage was hiding five different systems', 'h2'),
  block('The review uses 30D as the sustained baseline, 7D as the recent trend signal, and daily accuracy plus evidence as incident proof. Together they avoid short-window overreaction and long-window complacency.'),
  table(['Site', '30D Entry-Exit', '7D Entry-Exit', 'Signal', 'Primary constraint'], [
    ['CFX', '87.25%', '79.06%', 'Recent deterioration', 'PK1 Exit + timing/data'],
    ['Matraman', '93.10%', '97.02%', 'Recent improvement', 'Truck routing + manual flow'],
    ['JRP', '97.32%', '95.72%', 'Mild deterioration', 'PK Exit instability'],
    ['Menteng Central', '96.51%', '96.94%', 'Stable / slightly improved', 'Exit-side limitation'],
    ['Gading Riverview', '89.51%', '87.62%', 'Persistent underperformance', 'PM2 loop / infrastructure failure'],
  ], 'Cross-site 30D baseline versus 7D movement. Target SLO: 99.9%.'),
  block('Measure the transaction, not just the image', 'h2'),
  block('A plate can be visible and correctly recognized while the final transaction fails because of trigger timing, cache or TTL behavior, Agent handoff, lane operation, or check-in/check-out pairing.'),
  diagram('Multi-stage parking journey', 'pipeline', [['Vehicle'], ['Loop / trigger'], ['Image capture'], ['OCR'], ['Agent + TTL'], ['Check-in'], ['Check-out'], ['Entry-Exit pair']], undefined, undefined, 'The diagnostic model assigns a failure to the earliest stage where the journey becomes invalid.'),
  table(['Lens', 'Question', 'Evidence'], [['Baseline', 'Is this a sustained site problem?', '30D site and gate accuracy'], ['Trend', 'Is the site improving or degrading now?', '7D vs 30D movement'], ['Incident', 'What exactly failed on this transaction?', 'Daily ACC, timestamps, camera image, parking-slip evidence'], ['Root cause', 'Who should act?', '17-case taxonomy + gate context + owner mapping']]),
  callout('Diagnostic insight', 'The same low score can require four different responses: debug code, repair hardware, change an SOP, or review OCR.', 'success'),
  block('Accuracy had to answer three different questions', 'h2'),
  math('\\text{Raw Gate Accuracy}=\\frac{\\text{Successful Gate Events}}{\\text{Eligible Gate Events}}', 'Decision use: what users are experiencing now.'),
  math('\\text{Effective Gate Accuracy}=\\frac{\\text{Successful Events}}{\\text{Eligible Events}-\\text{Agreed Exclusions}}', 'Decision use: performance after agreed non-controllable conditions outside the target system boundary are removed.'),
  math('\\text{Entry{-}Exit Success}=\\frac{\\text{Successful Paired Tickets}}{\\text{Eligible Paired Tickets}}', 'Decision use: whether the full transaction succeeds end to end. Counting is performed at transaction/ticket level.'),
  callout('Metric boundary', 'The denominator is part of the product definition. If it is wrong, the calculated accuracy can be mathematically correct and operationally misleading.', 'warning'),
  block('End-to-end performance cannot outrun its bottleneck', 'h2'),
  block('The bottleneck is a diagnostic mental model, not an exact min-function law: a weak critical stage constrains the journey, which can fall lower still when timing or pairing fails downstream.'),
  table(['Site', 'Weak / limiting gate', 'Effective view', '30D Entry-Exit', 'Interpretation'], [
    ['CFX', 'PK1 Exit', '96.02% (1061/1105)', '87.25%', 'Gate weakness + downstream timing/pairing'],
    ['Matraman', 'Exit', '97.66% (542/555)', '93.10%', 'Operational routing distorts the journey'],
    ['JRP', 'PK Exit', '99.31% (1720/1732)', '97.32%', 'Best benchmark, but exit instability still caps it'],
    ['Menteng', 'Exit', '97.51% (509/522)', '96.51%', 'Exit remains structural limiter'],
    ['Gading', 'PM2 Entry', '99.25% effective potential', '89.51%', 'Infrastructure failure breaks actual operation despite high potential'],
  ]),
  block('Failures needed names before they could have owners', 'h2'),
  table(['#', 'Anomaly case', 'Primary ownership'], [
    ['1', 'Member vehicle registration mismatch', 'Ops / policy'], ['2', 'Plate missing', 'External / out of scope'], ['3', 'Irregular approach path', 'Site / ops'], ['4', 'Skipped coil trigger', 'Infrastructure'], ['5', 'Close-queue proximity', 'Site / ops'], ['6', 'OCR misread on clear image', 'CV vendor'], ['7', 'Plate obstructed by barrier', 'Site / hardware'], ['8', 'Wuzz trigger before LPR capture', 'System timing'], ['9', 'Motorcycle through car gate', 'Ops / site'], ['10', 'Insufficient lighting', 'Site environment'], ['11', 'Cancelled parking slip', 'Ops / transaction'], ['12', 'Rainy condition', 'Environment'], ['13', 'Damaged license plate', 'External'], ['14', 'Loop sensor inactive / jumpered', 'Infrastructure'], ['15', 'Plate data after transaction completion', 'Agent / TTL timing'], ['16', 'Plate not detected from captured image', 'CV / recognition zone'], ['17', 'Plate reuse after TTL expiry / missing feedback', 'Agent / TTL timing'],
  ]),
  block('CFX — strong entry gates, weak exit pipeline', 'h2'),
  block('CFX recorded 87.25% 30D Entry-Exit, 79.06% over 7D, and 93.27% PK1 30D actual. PM1 and PM2 were relatively strong, while PK1 Exit degraded. Mostly-above-96% individual gate readings could still coexist with lower Entry-Exit results, pointing toward downstream timing and pairing.'),
  table(['Signal', 'Evidence', 'Diagnosis'], [['PK1 anomaly mix', 'Data Missing Agent 11/50; Wuzz Trigger Before LPR 9/50; OCR Misread 6/50', 'Primary issue is software/data timing at exit'], ['Daily pattern', '7 May 93.45%; 6 May 90.93%; 5 May 90.59%', 'Full-cycle loss persists despite strong entry'], ['Action', 'Trace Agent arrival + trigger ordering at PK1 before vendor escalation', 'Fix the bottleneck, not the whole camera fleet']]),
  block('JRP — the benchmark still had a single-gate failure mode', 'h2'),
  block('JRP led the 30D baseline at 97.32%, but its 7D result fell to 95.72% when PK Exit collapsed on 5–6 May while PK2 Exit stayed near 99%. Its PK effective view was 99.31%.'),
  table(['Date', 'PK Exit', 'PK2 Exit', 'Entry-Exit'], [['7 May', '99.11%', '99.49%', '98.63%'], ['6 May', '83.36%', '99.17%', '88.89%'], ['5 May', '77.80%', '99.36%', '84.73%']]),
  block('Data Missing Agent led the PK Exit anomaly mix at 46.7%, followed by Late Insert Data at 20.0%; OCR misread appeared at smaller volume. The decision was Agent/timing trace first, OCR/vendor review second.'),
  block('Gading Riverview — 99% potential, near-zero actual PM2 performance', 'h2'),
  block('PM2 Entry showed 99.25% effective potential, yet actual 30D accuracy was 33.04% and its 7D average was 0.08%. Effective recognition potential and actual operation were measuring different system boundaries.'),
  table(['Evidence', 'Count', 'Share', 'Meaning'], [['Loop Sensor Inactive / Jumpered', '224 of 289', '77.5%', 'Primary failure is physical trigger infrastructure, not OCR quality'], ['Wuzz Trigger Before LPR Capture', '65 of 289', '22.5%', 'Timing is a secondary contributor']]),
  callout('Root-cause decision', 'Repair PM2 trigger infrastructure first. OCR tuning is not the highest-leverage first intervention.', 'success'),
  block('Matraman and Menteng — same symptom, different fix', 'h2'),
  table(['Dimension', 'Matraman', 'Menteng Central'], [['30D Entry-Exit', '93.10%', '96.51%'], ['7D Entry-Exit', '97.02%', '96.94%'], ['Primary diagnosis', 'Operational flow distortion: trucks use exit lane and are handled manually', 'Software/data issues: Data Missing Agent, Agent + SD card, Late Insert Data'], ['Physical context', 'Truck routing / manual handling', 'Curvilinear / uphill exit may contribute'], ['First action', 'Fix route / SOP and isolate manual transactions', 'Trace Agent data path and exit timing before OCR changes']]),
  block('Every anomaly had to survive contact with the evidence', 'h2'),
  block('Classification was backed by transaction, gate context, timestamp, and image evidence. Raw operational images are intentionally omitted here because they contain identifiable plates and internal records.'),
  table(['Evidence pattern', 'Classification value'], [['Broken loop / trigger infrastructure', 'Separates physical gate failure from OCR quality'], ['Barrier obstruction / skipped trigger', 'Separates geometry and loop behavior from recognition'], ['Late plate / TTL / plate reuse', 'Separates cache and transaction timing from capture quality']]),
  block('Analysis ends only when ownership is explicit', 'h2'),
  table(['Failure signature', 'Primary owner', 'First action', 'Verification'], [['Data Missing / Late Insert / TTL sequence', 'Agent / engineering', 'Trace event ordering, cache lifetime, insert timing', 'Re-run affected tickets and compare daily ACC'], ['Loop / coil / cable / barrier / camera position', 'Support + site + vendor', 'Repair or recalibrate physical trigger / camera path', 'Post-maintenance gate trend + image evidence'], ['Truck route / motorcycle / queue / manual cancellation', 'BizOps / site operations', 'Change SOP, signage or lane handling', 'Observe classified anomaly rate after SOP'], ['Clear image but OCR misread', 'CV vendor', 'Escalate labeled image set for model / recognition review', 'Re-test same plate patterns against benchmark']]),
  diagram('Performance diagnostic operating loop', 'pipeline', [['Detect drop'], ['Locate gate'], ['Classify anomaly'], ['Assign owner'], ['Fix / mitigate'], ['Re-measure']], undefined, undefined, 'Detect → diagnose → assign → intervene → verify. This is an operating decision framework, not an automated service.'),
  block('The useful outcome was a decision system, not a prettier report', 'h2'),
  table(['5 live sites', '17 named anomaly cases', '99.9% target SLO'], [['Cross-site baseline and diagnosis', 'Reusable evidence and ownership vocabulary', 'The documented target—not a claimed achieved result']]),
  ...bullets('JRP is the current benchmark at 97.32% 30D Entry-Exit while showing how one unstable exit can pull the journey down.', 'Gading is an infrastructure-first problem: PM2 actual performance collapses while effective potential remains high.', 'CFX shows that strong gate readings do not guarantee strong Entry-Exit performance when Agent timing and pairing fail downstream.', 'Matraman and Menteng show that similar top-line results can require operational versus software/data interventions.'),
  callout('Final leverage point', 'Stop asking “How accurate is the camera?” Start asking “Where did the journey become invalid?”', 'success'),
  block('The completed reusable operating specification', 'h2'),
  table(['Contract', 'Definition of done'], [['Metric contract', '30D, 7D, daily, effective, and Entry-Exit metrics have explicit denominators and transaction-level counting rules'], ['Anomaly contract', 'All 17 cases have a description, primary ownership, and include/exclude decision'], ['Evidence contract', 'Every investigated incident can be traced to timestamp, gate, image, and transaction record'], ['Escalation contract', 'Software/data, infrastructure, operations, and vendor issues have distinct first actions'], ['Benchmark contract', 'JRP is the reference operating site; degraded sites are compared against its failure pattern, not only its score'], ['Verification contract', 'Every fix is followed by gate trend + incident evidence']]),
  callout('Evidence and privacy limitation', 'The numerical claims are limited to the documented analysis. No post-fix improvement is claimed. Source screenshots are excluded because they contain identifiable vehicles and internal operational records.', 'warning'),
]

const project3Document = { _type: 'article', title: 'The camera can be 99% accurate and the journey can still fail.', excerpt: 'A five-site LPR diagnostic framework that separates OCR quality from trigger timing, infrastructure, transaction-state, and operational failures to route accuracy drops to the right owner.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Computer Vision', 'LPR', 'Performance Diagnostics', 'Root Cause Analysis', 'Observability', 'Data Analysis', 'Operational Analytics', 'System Reliability', 'OCR', 'Incident Analysis'], category: 'Computer Vision / Performance Diagnostics', featured: false, role: 'Product / Data Analysis', projectType: 'Performance Diagnostics / Root-Cause Analysis', system: 'Multi-Site Parking LPR', coreQuestion: 'Where did the journey become invalid?', evidence: '30D, 7D, daily, gate, anomaly, transaction, and image evidence', status: 'Completed', seoTitle: 'Multi-Site LPR Performance Diagnostics | Anastasia Aurelia', seoDescription: 'A five-site LPR performance diagnostic case study separating OCR quality from timing, infrastructure, transaction-state and operational failures.', body: project3Body }

const project57Body = [
  callout('The hard part', 'The hard part was not building another dashboard. It was making Ops, Data, Parkee, and the vendor mean the same thing when they said “accuracy.”', 'info'),
  block('The spreadsheets were deliverables. Agreement was the outcome.', 'h2'),
  table(['Level', 'What existed at the end', 'Outcome'], [['Deliverables', 'PM-PK baseline, single-gate debug logic, cutoff rules, validation matrix, bar-chart metrics, filter contract', 'A repeatable reporting package'], ['Ideas', 'Separate business measurement from engineering debugging; define one operational day; make exclusions explicit; distinguish recognition accuracy from statistical stability', 'A shared definition'], ['Outcome', 'A disputed KPI becomes traceable to included rows, exclusions, and the gate to investigate', 'A defensible operating decision']]),
  callout('The real product', 'One question, one definition, one reproducible answer.', 'success'),
  block('The same site could produce several defensible numbers', 'h2'),
  table(['Source / view', 'Useful for', 'Failure mode if treated as universal truth'], [['Chisel', 'Existing operational reference', 'Can disagree when filters or date semantics differ'], ['Metabase', 'Downloadable, queryable reporting', 'A correct query can use the wrong cutoff or denominator'], ['Ops manual audit', 'What happened on site', 'Operational context is expensive to repeat manually'], ['Excel matrix', 'Transparent validation and debugging', 'Can drift into custom formulas, partial samples, or statistical filters'], ['Vendor / API output', 'Capture evidence and vendor alignment', 'Does not automatically encode Parkee business exclusions']]),
  diagram('Competing sources converge on a metric contract', 'pipeline', [['Chisel · Metabase · Ops audit · Excel · Vendor/API'], ['Metric contract'], ['Official operational number']], ['Diagnostic lenses remain available without becoming separate official KPIs'], undefined, 'The sources are witnesses with different strengths, not technically identical systems.'),
  block('Define the operational day before calculating anything', 'h2'),
  table(['Rule', 'Operational behavior', 'Reason'], [['Time window', '07:00–06:59', 'Matches field / Ops audit day'], ['Transaction state', 'DONE only', 'Incomplete transactions are removed, not treated as recognition failures'], ['Identical CI / CO timestamps', 'Exclude', 'Invalid transaction shape'], ['CancelParkingSlip from operator handling', 'Exclude from A0', 'Manual intervention should not redefine automated performance'], ['Motor patrol transactions', 'Exclude from customer KPI', 'Preserve customer-experience denominator'], ['PM-PK main view', 'Capture / entry-exit business view', 'Official performance lens'], ['Single-gate view', 'Debugging only', 'Locate gate, trigger, camera, or infrastructure without redefining the KPI']]),
  callout('Business KPI versus debug view', 'Management gets one official PM-PK performance view. Engineering gets gate-level diagnostics; that debug view must not silently become a second business KPI.', 'warning'),
  block('One official denominator, many diagnostic lenses', 'h2'),
  table(['View', 'Population', 'Status', 'Use'], [['A0 — Operational', '07:00–06:59; DONE; valid timestamps; customer transactions; agreed manual exclusions', 'Official', 'Ops / management reference'], ['A1 — Full raw', 'Everything included', 'Diagnostic', 'Volume and anomaly observation'], ['A2 — Customer experience', 'Customer rows; motor patrol removed', 'Diagnostic', 'Customer-impact analysis'], ['A3 — Engineering accuracy', 'Bias removed; recognition-valid population', 'Optional engineering view', 'Model / engine improvement'], ['A4 — Automation performance', 'Manual Ops removed', 'Optional automation view', 'Automation-only measurement'], ['A5 — Bias analysis', 'Bias-only filter', 'Diagnostic filter', 'Root-cause and camera / infrastructure review'], ['A6 — Manual intervention', 'Manual handled cases', 'Not promoted as KPI', 'Training / Ops dependency analysis']]),
  diagram('One contract, many views', 'pipeline', [['Data contract'], ['A0 official operational'], ['A1 raw · A2 customer · A3 engineering · A4 automation · A5/A6 diagnostics']], undefined, 'Only A0 is the official operational KPI; the others are analytical lenses.'),
  block('The existing spreadsheet logic became an explicit data contract', 'h2'),
  table(['Rule', 'Database-ready interpretation'], [['System classification', 'PM1-MOBIL or PM2-LOADING on either side → PARKEE; otherwise ALFABETA under the documented rule'], ['Entry outlier', 'entryVehiclePlateNumber is empty'], ['Exit outlier', 'exitVehiclePlateNumber is empty'], ['Mismatch outlier', 'Entry and exit plates are present but do not match'], ['Entry accuracy count', 'Selected-system rows with non-empty entry plate'], ['Exit accuracy count', 'Selected-system rows with non-empty exit plate'], ['Full-cycle count', 'Selected-system rows satisfying both required entry and exit success conditions'], ['Filters', 'Date range, system/vendor, vehicle type, outlier type, accuracy-only, outlier-only']]),
  { _type: 'code', _key: key(), language: 'text', filename: 'Conceptual system-classification pseudocode', code: 'IF gate_name contains PM1-MOBIL or PM2-LOADING\nTHEN system = PARKEE\nELSE system = ALFABETA' },
  block('A source of truth still needs witnesses', 'h2'),
  table(['Validation leg', 'What must agree', 'What a mismatch means'], [['Metabase vs Chisel', 'Event totals and metric output under the same definition', 'Source, join, date, or filter semantics differ'], ['Metabase vs Ops audit', '07:00–06:59 slice and field exclusions', 'Dashboard does not describe the audited operational day'], ['Parkee vs Alfabeta', 'Same filter and definition for shared comparisons', 'Similar labels answer different questions'], ['Sanity checks', 'RIGHT + WRONG = total; subtotals reconcile', 'Counting or exclusion defect exists before interpretation']]),
  diagram('Source-of-truth validation loop', 'pipeline', [['Metric contract'], ['Metabase ↔ Chisel ↔ Ops audit ↔ Vendor/API'], ['Counting sanity checks'], ['Reconcile'], ['Official result']], undefined, 'A dashboard may be wrong during validation; the dangerous state is looking final before its denominator is explainable.'),
  block('A statistical outlier is not automatically an OCR failure', 'h2'),
  block('Direct API/manual checks matched system output while IQR and standard-deviation filters lowered the matrix because some valid transactions were distributional outliers. Recognition asks whether the read was correct; stability asks whether the distribution behaves normally.'),
  table(['Date', 'LPR summary', 'Matrix', 'Interpretation'], [['4 Aug', '64.33%', '63.88%', 'Near agreement'], ['5 Aug', '73.61%', '73.61%', 'Agreement'], ['6 Aug', '71.90%', '64.00%', 'Stability filter diverges'], ['7 Aug', '71.70%', '66.00%', 'Stability filter diverges'], ['8 Aug', '68.90%', '62.00%', 'Stability filter diverges'], ['9 Aug', '73.20%', '63.00%', 'Stability filter diverges'], ['10 Aug', '79.00%', '73.20%', 'Stability filter diverges']], 'CFX validation sample, 4–10 Aug 2025.'),
  block('The double-gate baseline closes mathematically', 'h2'),
  table(['Metric', 'Result'], [['Total events', '4,593'], ['RIGHT / matched', '4,473 (97.39%)'], ['WRONG / mismatched', '120 (2.61%)'], ['Sanity check', '100.00%'], ['Bias marker', 'approximately 0.065% (3 / 4,593)']]),
  math('\\text{RIGHT}+\\text{WRONG}=\\text{TOTAL}', '4,473 + 120 = 4,593'),
  math('97.39\\%+2.61\\%=100.00\\%', 'This proves closure under the selected baseline definition; it is not a universal production KPI.'),
  block('The spreadsheet became a repeatable daily validation loop', 'h2'),
  block('The automated workbook contains 10 daily CFX slices from 11–21 Aug 2025: 5,141 total transactions and 2,959 PARKEE-car rows.'),
  table(['Weighted PARKEE-car metric', '10-slice result'], [['Entry', '94.25%'], ['Exit', '83.03%'], ['Entry + Exit', '74.72%']]),
  diagram('Automated daily validation workflow', 'pipeline', [['Operational contract'], ['Database/query rules'], ['Daily slice'], ['System classification'], ['Entry / exit / full-cycle counts'], ['Validation matrix'], ['Chart'], ['Reconciliation']], undefined, 'Automation preserves the diagnostic structure and makes it repeatable.'),
  block('Different physical flows should not be forced into one vendor leaderboard', 'h2'),
  table(['Population', 'Rows', 'Context'], [['PARKEE cars', '2,959', 'Car lanes; PM1-MOBIL / PM2-LOADING logic; entry, exit, and full-cycle separately'], ['ALFABETA motorcycles', '2,182', 'Motorcycle lanes and a different operational path; do not merge into the car denominator']]),
  block('The metric describes recognition technology plus physical lane topology and vehicle flow. These mixed populations do not support a better-versus-worse vendor ranking.'),
  block('When the KPI drops, move to the gate and the image', 'h2'),
  block('Single-gate data is intentionally a diagnostic view: camera angle, bounding box, lane behavior, trigger timing, infrastructure, or a genuine OCR miss. The source example showed a clear frame with recognition geometry suspected low and leftward—a setup question, not automatic proof of weak OCR. The identifiable screenshot is omitted.'),
  block('Not every outlier belongs to engineering', 'h2'),
  block('Defaced plates and non-standard vehicle behavior belong to a different failure domain than camera positioning, trigger defects, or infrastructure defects. The contract preserves whether the issue is data, setup, infrastructure, or behavior.'),
  block('What the finished system changes', 'h2'),
  table(['Before', 'After'], [['Why is Metabase different from Chisel?', 'Compare exact source, cutoff, state, and exclusion contract'], ['Every team recreates a different Excel answer', 'A0 is official; other views remain diagnostics'], ['A low percentage becomes an OCR escalation', 'Single-gate drill-down tests camera, trigger, infrastructure, lane behavior, and data logic'], ['Statistical outliers reduce accuracy', 'Recognition accuracy and operational stability remain separate'], ['Manual spreadsheet arithmetic', 'Database-ready rules reproduce counts and drive filters/charts'], ['One blended population', 'System, vehicle type, and gate topology remain visible in the denominator']]),
  callout('Final outcome', 'The strongest part is not the chart value. It is the ability to defend which rows counted, which did not, why, and where to investigate when the result moves.', 'success'),
  callout('Claim boundary', 'Completed: source-of-truth contract, validation logic, automated workbook flow, and database-ready metric specification. Not claimed: analyst-hours reduction, production adoption percentage, or management rollout date.', 'warning'),
]

const project57Document = { _type: 'article', title: 'From competing spreadsheets to one LPR number everyone could defend.', excerpt: 'A unified LPR measurement contract that reconciles operational cutoff logic, business KPIs, gate-level diagnostics, database rules, and cross-source validation into one reproducible source of truth.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['LPR', 'Data Quality', 'Data Contracts', 'Source of Truth', 'Product Analytics', 'Validation', 'Observability', 'Metabase', 'Data Reconciliation', 'Operational Analytics', 'Measurement Systems', 'Automation'], category: 'Data Quality / Measurement Systems', featured: false, role: 'Product / Data Analysis', projectType: 'Data Contract / Validation Automation', system: 'Multi-Source Parking LPR Analytics', coreQuestion: 'What exact population is this number describing?', evidence: 'Chisel, Metabase, Ops audit, Excel validation, vendor/API evidence', status: 'Completed', seoTitle: 'Unified LPR Source of Truth | Anastasia Aurelia', seoDescription: 'A technical case study on building one reproducible LPR data contract across Metabase, operational audits, spreadsheets, vendor evidence, and database-ready validation logic.', body: project57Body }

const project6Body = [
  callout('Outcome', 'The useful output was not another accuracy score. It was a stability framework separating camera capture, system synchronization, site geometry, and statistical uncertainty.', 'success'),
  block('What this work changed', 'h2'),
  table(['Question', 'Evidence', 'Decision domain'], [['Did the camera capture it?', 'SD Card record', 'Camera / geometry'], ['Did the downstream system receive it?', 'Agent record', 'Synchronization / timing'], ['Was the physical setup stable?', 'Tilt, coil distance, bounding box', 'Site calibration'], ['Is the anomaly statistically credible?', '95% confidence interval + sample size', 'Alert or keep collecting evidence']]),
  callout('Portfolio framing', 'Deliverable: research report. Idea: separate the layers. Outcome: stop fixing the wrong thing.', 'info'),
  block('First, split camera truth from system truth', 'h2'),
  table(['SD Card', 'Agent', 'Interpretation', 'Owner / next action'], [['Present', 'Present', 'End-to-end evidence exists', 'No incident / validate plate'], ['Present', 'Missing', 'Camera worked; downstream handoff failed', 'Agent / data pipeline'], ['Missing', 'Present', 'System-side record without SD proof', 'Reconcile timing / source'], ['Missing', 'Missing', 'No evidence in either source', 'Trigger / camera / lane']]),
  block('Events are reconciled by plate within a ±10-minute window. This documented tolerance bridges logging delay while reducing the risk that a later re-entry is paired to the wrong event; it is not claimed as universally optimal.'),
  callout('System principle', 'A failure label should identify the layer that failed, not the dashboard where it appeared.', 'info'),
  block('The vendor SOP was a starting point, not a law', 'h2'),
  table(['Parameter', 'Vendor reference', 'CFX field measurement', 'Interpretation'], [['Coil-to-camera distance', '4.0–4.5 m', '6.027 m', 'Site geometry shifts capture timing'], ['Camera tilt', '25°', '11.7°', 'One universal angle is too rigid'], ['Camera height', '1.5 m', 'Site dependent', 'Interpret with the actual lane path']]),
  block('The goal is a site-specific stability envelope: measure vehicle path, coil position, and camera aim, then validate the configuration against capture outcomes. The 11.7° field measurement is not a universal sweet spot.'),
  block('Coil and video triggers solve different timing problems', 'h2'),
  table(['Mode', 'Capture', 'Stabilization', 'Main failure'], [['Coil trigger', 'Single capture around physical trigger moment', 'Smaller active coil area; wider bounding box', 'Loop too far away → plate reaches wrong position'], ['Video trigger', 'Multiple frames as vehicle enters visual region', 'Narrower bounding box; capture at plate position', 'Vehicle turns into box before plate is aligned']]),
  callout('Testable large-vehicle adjustment', 'Move the bounding box slightly backward or test approximately 700 ms after the coil trigger when the vehicle body arrives before the plate is framed. This is not a universal default.', 'warning'),
  block('A rate is not an alert until the estimate is precise enough', 'h2'),
  table(['Gate', 'Rule'], [['Magnitude', 'Observed anomaly rate ≥ 10%'], ['Volume', 'n ≥ 20 transactions'], ['Precision', '95% CI width ≤ 15 percentage points']]),
  math('SE(\\hat p)=\\sqrt{\\frac{p(1-p)}{n}}', 'Workbook normal approximation for observed proportion p and sample size n.'),
  math('MOE=1.96\\sqrt{\\frac{p(1-p)}{n}}', 'The workbook clips the resulting lower and upper bounds to 0%–100%.'),
  math('CI_{95\\%}=[p-MOE,\\ p+MOE]', 'Conceptual interval before clipping.'),
  math('W=U-L\\quad\\text{and}\\quad W\\leq0.15', 'Precision gate on the 0–1 proportion scale.'),
  { _type: 'code', _key: key(), language: 'text', filename: 'Intended decision logic', code: 'CONFIRMED_SPIKE =\n  (rate >= 0.10)\n  AND (n >= 20)\n  AND (CI_width <= 0.15)' },
  block('The workbook said 29 spikes. The intended CI rule confirmed none.', 'h2'),
  block('The workbook stores CI width as a proportion: 0.207 means 20.7%. But the SPIKE condition compared the width with 15 instead of 0.15, turning the intended 15% precision threshold into an effective 1500% gate.'),
  table(['Candidate label', 'Count'], [['Entry-exit mismatch', '3'], ['Entry empty', '6'], ['Exit empty', '20'], ['Total', '29']]),
  diagram('Alert interpretation before and after unit correction', 'pipeline', [['Before: 29 candidate rows'], ['Apply CI precision as 0.15, not 15'], ['After: 0 confirmed structural spikes']], ['Candidate observations remain signals; their classification changes because the stated precision requirement is enforced'], undefined, 'Calculated 95% CI widths range approximately 20.7%–39.9%, all above the 15% gate.'),
  callout('Measurement-integrity result', 'The hourly alert was underpowered; the system was not proven unstable. None of the 29 candidates should be called a confirmed structural spike under the intended rule.', 'warning'),
  block('The fix is more evidence, not a looser confidence rule', 'h2'),
  block('Candidate hourly buckets contained 20–52 observations—enough to calculate a rate, often not enough to meet the requested interval width.'),
  table(['Observed anomaly rate', 'Approximate n needed for ≤15% CI width'], [['10%', '62'], ['15%', '88'], ['20%', '110'], ['30%', '144'], ['40%', '164'], ['50%', '171']]),
  block('Keep hourly rates for observability. Escalate only when the precision gate passes. When hourly volume is insufficient, pool adjacent hours or use a rolling window rather than weakening the confidence rule.'),
  block('Not every failure belongs in the same denominator', 'h2'),
  table(['Observed condition', 'Why it breaks LPR', 'Treatment'], [['Irregular approach / turning', 'Plate arrives outside expected geometry', 'Operational / geometry outlier'], ['Damaged or missing plate', 'No stable visual target', 'Exclude from model-quality claim'], ['Large vehicle body reaches box first', 'Wrong region is captured', 'Adjust box / test short delay'], ['SD Card present / Agent missing', 'Capture succeeded; handoff did not', 'Data-pipeline incident']]),
  callout('Three separate views', 'Recognition accuracy, system synchronization, and operational stability remain separate rather than being forced into one percentage.', 'info'),
  block('What happens when an alert fires', 'h2'),
  table(['Step', 'Check', 'If true', 'If false'], [['1', 'SD Card capture exists?', 'Go to Agent reconciliation', 'Inspect trigger / camera / lane'], ['2', 'Agent counterpart inside ±10 min?', 'Validate plate / transaction', 'Data-pipeline or timing issue'], ['3', 'Rate ≥ 10%?', 'Check n and CI width', 'Observe; no escalation'], ['4', 'n sufficient and CI width ≤15%?', 'Confirmed structural spike', 'Pool more observations'], ['5', 'Spike repeats after geometry check?', 'Escalate owner with evidence', 'Treat as site-specific transient']]),
  diagram('Layered alert decision path', 'pipeline', [['Capture evidence'], ['Agent reconciliation'], ['Magnitude gate'], ['Volume + CI precision'], ['Geometry repeat check'], ['Owner escalation']], ['Owners: camera/vendor · Agent/data pipeline · site infrastructure · operations'], undefined, 'One alert. Four possible layers. One evidence trail.'),
  block('What this work changed', 'h2'),
  table(['Level', 'Result'], [['Deliverable', 'Cross-system reconciliation, geometry study, CI workbook, decision rules'], ['Idea', 'A low accuracy number is meaningless until the failure layer is identified'], ['Outcome', 'Choose whether to tune the camera, fix the pipeline, change lane setup, or collect more evidence']]),
  block('Claims I can defend', 'h2'),
  table(['Can defend', 'Do not claim'], [['Built a layered LPR stability methodology', 'A universal 11.7° camera sweet spot'], ['Used ±10-minute SD Card–Agent reconciliation', 'A production-wide reduction in incidents'], ['Measured CFX geometry against vendor SOP', 'Video trigger is always superior'], ['Audited CI logic and found a unit mismatch', 'All 29 candidates were real failures'], ['Showed hourly buckets were underpowered for the intended width', 'ROI, revenue impact, or support-hour savings']]),
  block('Next engineering phase', 'h2'),
  ...bullets('Automate the corrected CI gate in the dashboard.', 'Use rolling windows when hourly volume is low.', 'Log camera and coil adjustments as experiments.', 'Collect before/after capture evidence.'),
  callout('Final outcome', 'The system does not merely report accuracy. It explains when the number is trustworthy, whether more evidence is needed, and which physical or software layer should be investigated next.', 'success'),
  callout('Privacy and claim boundary', 'No raw operational screenshots are reproduced. No production incident reduction, ROI, universal geometry, universal trigger superiority, or post-fix uplift is claimed.', 'warning'),
]

const project6Document = { _type: 'article', title: 'A 10% anomaly rate can be noise. I built a way to tell.', excerpt: 'A field-calibrated LPR stability framework combining cross-system reconciliation, camera geometry, trigger mechanics, and confidence-interval rules to distinguish structural failures from statistical noise.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Computer Vision', 'LPR', 'Statistics', 'Confidence Intervals', 'System Reliability', 'Data Validation', 'Observability', 'Anomaly Detection', 'Root Cause Analysis', 'Experimental Design', 'Camera Calibration', 'System Synchronization'], category: 'Computer Vision / Statistical Validation', featured: false, role: 'Product / Data Analysis', projectType: 'System Stability Research / Statistical Validation', system: 'Parking LPR / SD Card + Agent', coreQuestion: 'Is the observed anomaly statistically credible?', evidence: 'SD Card, Agent, field geometry, trigger mechanics, and 95% CI workbook', status: 'Completed', seoTitle: 'LPR Accuracy & Stability Research | Anastasia Aurelia', seoDescription: 'A technical case study on separating LPR capture failures, system synchronization, camera geometry, and statistical uncertainty using confidence-interval alert validation.', body: project6Body }

const project4Body = [
  callout('A camera can read the plate correctly and the transaction can still fail.', 'That changed how the product was measured.', 'info'),
  block('The work was not the dashboard', 'h2'),
  block('The visible deliverables were SQL queries, Metabase logic, n8n workflows, anomaly rules and executive reports. Those were necessary, but they were not the value of the project.'),
  table(['Level', 'What was built / changed', 'Why it mattered'], [
    ['Deliverables', 'v4 transaction queries, weekday 7D/30D reporting, golden-path logic, anomaly exclusion, multi-site report.', 'The tangible work.'],
    ['Ideas', 'Separate adoption from gate quality; measure full-cycle transactions at ticket level; distinguish raw from effective accuracy; route failures by root cause.', 'The measurement model.'],
    ['Outcomes', 'A number the team could trust, a reason for each drop, and an owner for the next action.', 'The operating system for improvement.'],
  ]),
  block('That distinction mattered because a low LPR number did not always mean the camera was bad. In several incidents, the camera had already done its job.'),
  callout('The real product outcome', 'Turn "accuracy dropped" into "this gate failed for this reason, and this team should act next."', 'success'),
  block('One percentage was collapsing different problems into the same bucket', 'h2'),
  block('Three incidents made the problem obvious.'),
  table(['Observed symptom', 'What the first metric suggested', 'What the evidence showed'], [
    ['Agent returned plate = NULL', 'LPR missed the vehicle', 'Engine read the plate at 00:30:00; card tap happened at 00:30:42; a 30-second TTL had expired before the transaction completed.'],
    ['JRP PM_COMBO reported extremely low accuracy', 'Camera capture failure', 'Manual validation found capture records existed; the mismatch pointed toward pipeline / join / reporting logic.'],
    ['PM_COMBO and PM_2_COMBO dropped sharply', 'OCR quality regression', 'Tracing found a coil trigger connectivity failure; video trigger was used as a temporary workaround.'],
  ]),
  block('These are different failure domains. Treating them as one "OCR accuracy" issue creates the wrong engineering work, the wrong escalation, and sometimes the wrong vendor conversation.'),
  table(['Failure domain', 'Example from above', 'Primary owner'], [
    ['OCR / capture', 'Engine correctly reads a plate', 'Computer vision'],
    ['Timing / handoff', 'TTL expiry before card tap', 'Agent / timing'],
    ['Infrastructure', 'Coil trigger connectivity failure', 'Support / vendor / site'],
    ['Data / reporting', 'Capture existed but the report disagreed', 'Engineering / data'],
  ], 'A conceptual grouping of the three incidents above by where the failure actually lived, not by how it first looked.'),
  block('I modeled WUZZLPR as a chain, not a camera', 'h2'),
  table(['Stage', 'Question', 'Failure signal'], [
    ['1. Adoption', 'Was the eligible member enabled for WUZZLPR?', 'Low activation / low use'],
    ['2. LPR eligible', 'Was this transaction supposed to use LPR?', 'Wrong denominator if mixed with non-LPR traffic'],
    ['3. Capture', 'Did the camera / engine capture a plate?', 'Missing capture / trigger failure'],
    ['4. Agent handoff', 'Was the capture still valid when Agent consumed it?', 'TTL expiry, late insert, NULL handoff'],
    ['5. Match', 'Did the captured plate match the transaction plate?', 'OCR / mapping mismatch'],
    ['6. Golden path', 'Did CI or CO satisfy all success conditions?', 'Side-level transaction failure'],
    ['7. Full cycle', 'Did the same ticket succeed at both CI and CO?', 'Entry-exit pair failure'],
  ]),
  diagram('WUZZLPR transaction chain', 'pipeline', [['Adoption'], ['LPR eligibility'], ['Capture'], ['Agent handoff'], ['Plate match'], ['Golden path'], ['Full-cycle pair']], undefined, undefined, 'A correct OCR result is necessary but not sufficient for transaction success.'),
  block('The key design choice was to keep adoption and gate quality separate. A site can have excellent gate-level LPR performance and poor adoption, or strong adoption and a broken gate. Combining them makes both metrics harder to act on.'),
  block('Before improving the metric, I had to make the sources agree', 'h2'),
  block('The reporting stack had multiple versions of CI/CO views and differences between Data 119 and Data 228. That creates a quiet but serious failure mode: two correct-looking dashboards can disagree because they are counting different events.'),
  table(['Rule', 'Final analytical choice'], [
    ['Source version', 'Align transaction reporting to the v4 CI/CO views.'],
    ['Primary grain', 'Distinct ticket_number for ticket-level experience metrics.'],
    ['CI / CO dates', 'Use the event-side timestamp and an explicit operational date window.'],
    ['Join', 'Pair CI and CO on the same ticket_number for full-cycle analysis.'],
    ['Eligibility', 'Keep toggle_lpr / LPR eligibility visible in the denominator.'],
    ['Quality fields', 'Preserve accuracy_lpr, success_lpr, issue, support_check, and capture evidence.'],
  ]),
  callout('Data foundation', 'A better dashboard on top of inconsistent denominators is still a bad measurement system.', 'warning'),
  block('Raw accuracy and effective accuracy answer different questions', 'h2'),
  block('A 17-rule anomaly framework grouped failures into three operational lanes. The source does not enumerate every rule in one place, so this article keeps the verified categories and examples rather than inventing labels.'),
  table(['Lane', 'Verified examples', 'Owner / action'], [
    ['System / data pipeline', 'Data Missing Agent, Late Insert Data, Agent + SD-card loss, WUZZ trigger timing, join / query discrepancy.', 'Engineering / data'],
    ['Hardware / infrastructure', 'Loop sensor, camera position, cable / connectivity, trigger reliability.', 'Support / vendor / site'],
    ['Operational / behavior', 'Truck through exit lane, motorcycle through car gate, member vehicle mismatch, close-queue proximity, manual cancellation, delayed tap.', 'BizOps / site operations'],
  ]),
  math('\\text{Raw Accuracy} = \\frac{\\text{Successful Transactions}}{\\text{Total Eligible Transactions}}', 'Raw accuracy = success / total.'),
  math('\\text{Effective Accuracy} = \\frac{\\text{Successful Transactions}}{\\text{Total Eligible Transactions} - \\text{Unique Excluded Anomaly Transactions}}', 'Effective accuracy = success / (total − unique excluded anomaly transactions). The exclusion is transaction-level and de-duplicated: a transaction carrying multiple anomaly labels is excluded once, not once per label.'),
  callout('Raw vs. effective', 'Effective accuracy does not hide failures. It tells management which failures belong to the LPR system and which belong somewhere else. It is not universally "better" than raw accuracy — the two answer different questions.', 'info'),
  block('Case: the camera read the plate. The transaction still returned NULL', 'h2'),
  block('At JRP, the engine captured a plate for an example vehicle (referred to here as PLATE_A) at 00:30:00. The user tapped the card at 00:30:42. Agent was configured with a 30-second plate-recognition TTL, and the cached plate expired at approximately 00:30:30.'),
  diagram('TTL expiry timeline (PLATE_A, sanitized example)', 'timeline', [['00:29:59 — Loop detected', 'Transaction context begins'], ['00:30:00 — Engine LPR captures plate', 'OCR / capture succeeds'], ['00:30:30 — TTL expires', 'Cached plate is no longer valid'], ['00:30:42 — Card tap / transaction created', 'Agent receives plate = NULL']], undefined, undefined, 'TTL: 30 seconds. Timestamps and TTL behavior preserved exactly from the source; the plate is sanitized.'),
  block('The right action was not "improve OCR." The next question was whether the TTL should change, whether gate behavior was causing delayed taps, and whether latency or queue conditions were contributing.'),
  callout('Anomaly-model template', 'This incident became the template for the anomaly model: classify the failure at the stage where it actually happened.', 'success'),
  block('Case: a 6% report that did not match the camera evidence', 'h2'),
  block('For a PM Combo slice on 21 June, the reported accuracy implied a large number of uncaptured transactions. Manual and transaction-specific validation told a different story.'),
  table(['Evidence', 'Finding'], [
    ['Transactions checked', 'About 245'],
    ['Expected misses if the report were correct', 'About 14–15'],
    ['Initially suspicious after manual checking', '2'],
    ['Confirmed uncaptured after deeper validation', '1'],
    ['Camera-side capture records for the same date', 'About 237'],
  ], 'Values as reported in the source; approximate figures are kept approximate, not rounded to exact numbers.'),
  block('The evidence shifted the investigation away from the camera and toward the reporting chain: source query, Agent pull, transaction-to-capture mapping, Metabase calculation, or a missing join key.'),
  callout('What this case proves', 'This is the kind of error a single accuracy KPI cannot explain: the product can look broken because the measurement pipeline is broken.', 'warning'),
  block('Gate accuracy is not end-to-end success', 'h2'),
  block('The shortcut of averaging gate percentages was replaced with a transaction-level rule. A full-cycle WUZZLPR success requires both sides of the same ticket to satisfy the golden-path conditions.'),
  table(['Check-in', 'Check-out', 'Full-cycle result'], [
    ['Fail', 'Fail', 'Failed pair'],
    ['Fail', 'Success', 'Failed pair'],
    ['Success', 'Fail', 'Failed pair'],
    ['Success', 'Success + correctly matched', 'Successful pair'],
  ]),
  block('Golden-path rows require LPR method, MATCH accuracy, SUCCESS status, issue = LPR Success, toggle_lpr = TRUE, and support_check = Not Issue. CI and CO are joined by ticket_number.'),
  { _type: 'code', _key: key(), language: 'text', filename: 'Full-cycle success condition (conceptual)', code: 'FullCycleSuccess(ticket) =\n  CI_success(ticket)\n  AND CO_success(ticket)\n  AND correct_match(ticket)' },
  block('This also creates a logical ceiling: end-to-end performance cannot exceed the weaker side of the journey. Improving an already-strong entry gate does little if the exit gate is the limiting component.'),
  callout('What the metric measures now', 'One vehicle, one ticket, one complete trip — what the user actually experiences, not an average of two gates.', 'success'),
  block('The analysis moved from manual checking to a daily operating loop', 'h2'),
  block('The reporting flow was standardized around weekday baselines for executive monitoring. Saturday and Sunday are removed from both the numerator and the denominator for the 7D and 30D views, because weekend traffic can distort the normal operating baseline.'),
  table(['Automation layer', 'What it does'], [
    ['BigQuery / v4 views', 'Produces consistent CI/CO and gate-level transaction data.'],
    ['Weekday filter', 'Recalculates 7D and 30D using Monday–Friday only.'],
    ['Mean / median stability check', 'Flags unstable gates and outlier periods instead of trusting the average alone.'],
    ['n8n summary', 'Builds a concise executive message from the latest metrics.'],
    ['WAHA / WhatsApp', 'Delivers the report to the operating group.'],
    ['Action routing', 'Sends pipeline, infrastructure and operational failures to different owners.'],
  ]),
  diagram('Automation flow', 'pipeline', [['BigQuery / v4 views'], ['Weekday filter'], ['7D / 30D metrics'], ['Mean / median stability'], ['Anomaly check'], ['n8n summary'], ['WhatsApp delivery'], ['Owner action']], undefined, undefined, 'Not every step is autonomous end-to-end; the source documents the pipeline and the validation milestone below, not a fully unattended system.'),
  block('By 7 August, fresh BigQuery data was validated across all five sites and marked 5/5 present, PASSED. The automated report was being delivered into the team channel.'),
  block('The site average tells you where to look. The gate tells you what to fix', 'h2'),
  block('Snapshot dated 7 August 2026. Target: 99.9% SLO.'),
  table(['Site', '30D', '7D'], [
    ['CFX', '89.98%', '87.80%'],
    ['Gramedia Matraman', '93.70%', '93.62%'],
    ['JRP', '94.42%', '87.67%'],
    ['Menteng Central', '94.86%', '97.90%'],
    ['Gading Riverview', '99.34%', '99.07%'],
  ], 'Gading Riverview is closest to the 99.9% target. JRP looks materially worse on the 7-day window than its 30-day baseline — a signal that gate-level drill-down, not a single average, is what explains it.'),
  table(['Gate', '7D accuracy'], [
    ['JRP PM_COMBO', '19.54%'],
    ['JRP PM_2_COMBO', '99.73%'],
  ], 'A site average cannot tell these two operating realities apart. This is why gate-level drill-down is necessary — and why PM_COMBO should not be assumed to be an OCR problem before it is investigated.'),
  block('The report ends with an action, not a percentage', 'h2'),
  table(['Site', '30D', '7D', 'Signal', 'Next action'], [
    ['CFX', '89.98%', '87.80%', 'Degrading', 'Investigate exit / Agent data and trigger-timing failures. Do not treat every miss as OCR.'],
    ['Gramedia Matraman', '93.70%', '93.62%', 'Degrading / broadly stable', 'Keep monitoring trigger and operational flow; historical 0% event showed service / trigger sensitivity.'],
    ['JRP', '94.42%', '87.67%', 'Degrading', 'P0 drill-down on PM_COMBO; separate trigger / pipeline failure from otherwise strong gates.'],
    ['Menteng Central', '94.86%', '97.90%', 'Improving', 'Exit remains the limiting side; preserve the improving trend and inspect site geometry if it drops.'],
    ['Gading Riverview', '99.34%', '99.07%', 'Near target', 'Use as the current high-accuracy reference in this monitoring window; retain infrastructure anomaly labels for future regressions.'],
  ]),
  block('The project intentionally separates the latest monitoring snapshot from historical root-cause incidents. A site can recover after a repair or configuration change; the taxonomy still matters because the same symptom may return for a different reason.'),
  block('What was complete when this became an operating system', 'h2'),
  table(['Capability', 'Completed state'], [
    ['Data consistency', 'v4 source aligned; CI/CO fields and ticket-level grain defined.'],
    ['Golden path', 'CI, CO and full-cycle logic defined at transaction level.'],
    ['Anomaly handling', '17-rule framework connected to controllable / non-controllable classification and effective-accuracy denominator logic.'],
    ['Reporting', '30D, 7D, last-week and H-1/H-2/H-3 views available by site and gate.'],
    ['Baseline quality', 'Weekday-only mode specified and automated for executive reporting.'],
    ['Diagnostics', 'Root causes routed into data/software, infrastructure and operational lanes.'],
    ['Automation', 'Fresh BigQuery validation passed 5/5 sites; WhatsApp report flow operational.'],
  ]),
  block('The project did not "solve" every physical gate issue. That was never the credible definition of done. The completed outcome was a system that made those issues measurable, comparable, diagnosable and assignable, instead of hiding them behind one accuracy percentage.'),
  callout('Deliverable, idea, outcome', 'Deliverable: reports and automation. Idea: measure the whole transaction. Outcome: the team knows what failed, why it failed, and who should move next.', 'success'),
  callout('Adoption limitation', 'Adoption remains a separate layer in the architecture. The source package documents the tracking requirement and denominator design, but does not contain a final adoption-rate extract, so no adoption percentage is invented here.', 'warning'),
]

const project4Document = { _type: 'article', title: 'From one accuracy score to a system that tells you what to fix.', excerpt: 'An end-to-end performance intelligence system for WUZZLPR that connects transaction-level accuracy, anomaly classification, golden-path logic, automated reporting and root-cause ownership across five live parking sites.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['WUZZLPR', 'Computer Vision', 'Product Analytics', 'Performance Intelligence', 'Operational Analytics', 'Automation', 'BigQuery', 'Metabase', 'n8n', 'Root Cause Analysis', 'Observability', 'Data Quality', 'LPR'], category: 'Data Quality / Measurement Systems', featured: false, role: 'Product / Data Analysis', projectType: 'Performance Intelligence / Reporting Automation', system: 'WUZZLPR Multi-Site Parking Platform', coreQuestion: 'What is actually failing in the WUZZLPR transaction chain, and who should fix it?', evidence: 'v4 BigQuery transaction views, gate-level accuracy, anomaly classification, TTL/timing evidence', status: 'Completed', seoTitle: 'WUZZLPR Performance Intelligence | Anastasia Aurelia', seoDescription: 'A technical case study on building an end-to-end WUZZLPR measurement, diagnostic and reporting system across five live parking sites.', body: project4Body }

const project8Body = [
  callout('Outcome', 'I turned a 1,000-image motorcycle collection task into a training-ready computer-vision experiment with data governance, manual labels, leakage-safe splitting, a regularized classifier, threshold tuning, and statistical reasoning about evaluation size.', 'success'),
  callout('Evidence boundary', 'The field-collection responsibilities are source-backed. The supervised-learning design and all training results are a controlled portfolio / FYP reconstruction—not confidential production KPIs, deployment results, vendor benchmarks, or measured production uplift.', 'warning'),
  block('Motorcycle Computer Vision Training: From Field Collection to a Data-Centric Learning System', 'h2'),
  block('The original job looked operational: collect and package 1,000 motorcycle images. The completed system asks a harder question: how do we make those samples actually useful for learning and generalization?'),
  table(['Source-backed operational work', 'Controlled portfolio / FYP extension'], [['Target of 1,000 motorcycle samples', 'Supervised-learning formulation'], ['Manual image classification references', 'Train / dev / test design'], ['Camera and gate dependency validation', 'Logistic classifier on pretrained features'], ['Feature and location tracking', 'L2 regularization and cross-validation'], ['Collect after the correct camera is active', 'Threshold tuning and controlled metrics'], ['Model-improvement handoff', 'Learning theory and error-driven recollection']]),
  block('The difficult part starts before model.fit().', 'h2'),
  table(['Responsibility', 'Source-backed practice', 'Why it matters for ML'], [['Collection control', 'Collect only after the target motorcycle camera is confirmed active; retain gate, location, and camera context', 'Prevents mixed-source samples'], ['Label provenance', 'Attach manual classification evidence to the correct CV feature, location, and failure case', 'A mislabeled image changes the learning target y'], ['Trackable work structure', 'Keep every sample traceable to why it was collected', 'Makes failures reproducible'], ['1,000-sample handoff', 'Package the field collection for model-improvement work', 'Preserves a usable training input']]),
  ...bullets('Near-duplicate frames across train and evaluation create leakage.', 'A model cannot learn edge cases the collection process systematically misses.', 'The handoff must preserve source, gate, location, and reason for inclusion.'),
  block('Turn images into training examples.', 'h2'),
  math('x^{(i)}', 'Image crop or learned visual embedding.'),
  math('y^{(i)}\\in\\{0,1\\},\\quad 0=\\text{background},\\quad 1=\\text{motorcycle}', 'Binary supervised-learning target.'),
  math('m=\\text{number of training examples}', 'Training-set size in the objective below.'),
  block('Rather than train a large vision network from scratch on only 1,000 field images, the controlled experiment uses an unnamed pretrained visual backbone as the feature map φ(x), then trains a smaller classifier on those features. This reduces trainable parameters and addresses small-data bias–variance risk; the source does not identify a deployed backbone.'),
  math('z^{(i)}=\\theta^\\top\\phi(x^{(i)})', 'Linear objectness score on pretrained visual features.'),
  math('p^{(i)}=\\sigma(z^{(i)})=\\frac{1}{1+e^{-z^{(i)}}}', 'Model motorcycle score; threshold 0.5 is only an initial operating point.'),
  table(['Example', 'Prediction', 'Loss contribution'], [['Positive motorcycle crop', 'p = 0.82', '−ln(0.82) ≈ 0.198'], ['Background crop', 'p = 0.12', '−ln(1−0.12) = −ln(0.88) ≈ 0.128']]),
  block('Confident correct predictions contribute little loss; confident incorrect predictions contribute strongly.'),
  block('Split by parent image, not by crop.', 'h2'),
  diagram('1,000-image split by independent parent capture event', 'pipeline', [['Train · 700 · 70%'], ['Dev · 150 · 15%'], ['Test · 150 · 15%']], ['Timestamp-near frames from one vehicle passage stay in the same split'], 'The unit of independence is the parent capture event—not the crop.', 'The controlled split protects evaluation from near-duplicate leakage.'),
  table(['Split', 'Parent images', 'Positive regions', 'Background candidates', 'Use'], [['Train', '700', '700', '2,100', 'Balanced negative sampling per epoch'], ['Dev', '150', '150', '450', '600 candidate regions total'], ['Test', '150', '150', '450', '600 candidate regions total; untouched during selection']]),
  block('If crops from one parent frame appear in both training and evaluation, validation scores can be artificially inflated. Parent event IDs—not crop IDs—control the split.'),
  block('Why accuracy alone fails', 'h3'),
  math('\\frac{450}{600}=75\\%', 'A useless background-only classifier is already 75% accurate on the 150-positive / 450-background evaluation mix.'),
  block('Precision, recall, F1, specificity, and the confusion matrix therefore remain visible alongside accuracy.'),
  block('The model learns two things: what the object is and where it is.', 'h2'),
  math('J(\\theta)=-\\frac{1}{m}\\sum_{i=1}^{m}\\left[y^{(i)}\\log p^{(i)}+(1-y^{(i)})\\log(1-p^{(i)})\\right]+\\frac{\\lambda}{2m}\\lVert\\theta\\rVert_2^2', 'Binary cross-entropy plus an L2 weight penalty.'),
  block('Low regularization risks memorization and high variance; high regularization risks underfitting and high bias.'),
  math('\\nabla_\\theta J=\\frac{1}{m}\\sum_{i=1}^{m}(p^{(i)}-y^{(i)})\\phi(x^{(i)})+\\frac{\\lambda}{m}\\theta', 'Classifier gradient with the source-consistent sign and regularization scaling.'),
  math('J_{\\text{box}}(w)=\\frac{1}{2m}\\sum_{i=1}^{m}\\left\\lVert w^\\top\\phi(x^{(i)})-t^{(i)}\\right\\rVert_2^2', 'Least-squares box-offset head; t^(i) is the manually labeled target offset.'),
  callout('Two supervision questions', 'Classification asks “motorcycle or background?” Bounding-box regression asks “where should the box move?” The same curated annotation can supervise both.', 'info'),
  block('The best training score is usually the wrong selection rule.', 'h2'),
  table(['Stage', 'Independent parent images', 'Rule'], [['Development pool', '850', 'Available for model selection'], ['Five-fold CV training', 'approximately 680 per fold', 'Fit candidate λ'], ['Five-fold CV validation', 'approximately 170 per fold', 'Average held-out error'], ['Retrain', '850', 'Use all development images after selecting λ'], ['Final test', '150', 'Evaluate once; never use for model or threshold decisions']]),
  callout('Illustrative selection', 'λ = 10⁻² is the lowest cross-validation-error choice in the controlled reconstruction. It is not a production-tuned or deployed value.', 'warning'),
  table(['Regularization regime', 'Training behavior', 'Generalization risk'], [['Low λ', 'Very low training error; larger train/dev gap', 'High variance / memorization'], ['Illustrative λ = 10⁻²', 'Lowest reconstructed CV error', 'Controlled selection only'], ['High λ', 'Constrained weights; rising training error', 'High bias / underfitting']]),
  block('The learning curve says whether collecting more images is still worth it.', 'h2'),
  table(['As training size grows', 'Controlled curve interpretation'], [['Training error', 'Rises slightly because memorization becomes harder'], ['Development error', 'Falls as representative evidence increases'], ['At 700 parent images', 'Development error has not flattened in the reconstruction'], ['Decision', 'Additional targeted data may still help']]),
  block('Do not collect another random 1,000 images. Target oblique approaches, occlusion, night lighting, dense queueing, large motorcycles, and plates or vehicle bodies partly outside the box.'),
  block('0.5 is a default, not a law.', 'h2'),
  block('Parking-gate false negatives and false positives can have different operational costs. Threshold is therefore a product operating choice, not just a mathematical default.'),
  table(['Controlled dev operating point', 'Value'], [['Threshold', '0.5'], ['Precision', '92.1%'], ['Recall', '93.3%'], ['F1', '92.7%']]),
  callout('Reconstruction label', 'These are reconstructed development metrics, not production KPIs. Move the threshold down when recall matters more; move it up when false-positive handling is more expensive.', 'warning'),
  block('Evaluate once on data the model never used for decisions.', 'h2'),
  table(['Actual class', 'Predicted background', 'Predicted motorcycle', 'Total'], [['Background', '438 (TN)', '12 (FP)', '450'], ['Motorcycle', '10 (FN)', '140 (TP)', '150'], ['Total', '448', '152', '600 candidate regions']]),
  callout('CONTROLLED PORTFOLIO RECONSTRUCTION', 'NOT A PRODUCTION KPI. The 600 candidate-region results below are an illustrative controlled evaluation; the independent learning-theory count remains 150 parent images.', 'warning'),
  math('\\text{Accuracy}=\\frac{140+438}{600}=96.33\\%', 'Controlled test accuracy.'),
  math('\\text{Precision}=\\frac{140}{140+12}=92.11\\%', 'Controlled test precision.'),
  math('\\text{Recall}=\\frac{140}{140+10}=93.33\\%', 'Controlled test recall.'),
  math('F_1=\\frac{2PR}{P+R}=92.72\\%', 'Controlled test F1 score.'),
  math('\\text{Specificity}=\\frac{438}{438+12}=97.33\\%', 'Controlled test specificity.'),
  table(['Controlled evaluation', 'Generic baseline', 'Curated + regularized', 'Change'], [['Candidate-region mistakes', '53', '22', '58.5% fewer'], ['False negatives', '26', '10', '16 fewer'], ['False positives', '27', '12', '15 fewer']]),
  callout('Result boundary', '58.5% is a controlled evaluation error reduction. It is not a production improvement or a claim about real-world motorcycle performance.', 'warning'),
  block('A good-looking test score can still be statistically weak.', 'h2'),
  block('The final test contains 150 independent parent capture events. Multiple candidate crops from one parent are correlated, so using m = 600 would exaggerate certainty.'),
  math('P(|\\hat{\\epsilon}-\\epsilon|>\\gamma)\\leq 2e^{-2\\gamma^2m}', 'Hoeffding inequality for independent parent events.'),
  math('\\gamma=\\sqrt{\\frac{\\ln(2/\\delta)}{2m}}', 'Solve the conservative error bound for γ.'),
  math('\\gamma=\\sqrt{\\frac{\\ln(2/0.05)}{2(150)}}\\approx0.1109', 'At 95% confidence with 150 independent parents: approximately ±11.1 percentage points.'),
  math('m\\geq\\frac{\\ln(2/\\delta)}{2\\gamma^2}=\\frac{\\ln(40)}{2(0.05)^2}\\approx738', 'Approximately 738 independent evaluation parent images for a ±5-point bound at 95% confidence.'),
  block('The bound is conservative: 150 independent parents are useful for directional validation, but not for claiming an extremely tight production accuracy estimate.'),
  block('The next dataset should be designed by the mistakes.', 'h2'),
  table(['False-negative slices', 'False-positive slices'], [['Motorcycle partly outside frame', 'Human / vehicle fragments'], ['Oblique approach', 'Reflections and signage'], ['Barrier or vehicle occlusion', 'Dense background texture'], ['Night blur / glare', 'Adjacent-lane objects'], ['Small or distant motorcycle', 'Motorcycle-shaped hard negatives']]),
  ...bullets('Sample failure modes intentionally; do not collect another random 1,000 frames.', 'Keep minimum examples per condition.', 'Track parent event IDs and prevent duplicate leakage.', 'Manually review low-confidence and disagreement cases.', 'Slice development error by lighting, angle, occlusion, and gate.'),
  diagram('Data-centric collection loop', 'pipeline', [['Collect'], ['Label'], ['Train'], ['Slice errors'], ['Collect missing slice'], ['Retrain']], ['Each collection request maps to a measured failure mode'], undefined, 'The dataset becomes an active part of model design, not a zip file sent once to a vendor.'),
  block('The finished workflow', 'h2'),
  table(['Stage', 'Artifact', 'Why it exists'], [['1. Gate verification', 'Active target camera', 'Prevents mixed-source collection'], ['2. Field collection', '1,000 parent images', 'Captures real motorcycle geometry'], ['3. Manual annotation', 'Boxes + quality tags', 'Creates supervised labels'], ['4. Leakage-safe split', '700 / 150 / 150', 'Protects generalization measurement'], ['5. Train + regularize', 'Classifier + box head', 'Balances fit and variance'], ['6. CV + threshold', 'Selected λ + threshold', 'Makes model choice evidence-based'], ['7. Error-driven recollection', 'Next targeted slice', 'Turns failures into the next data request']]),
  diagram('End-to-end motorcycle ML workflow', 'pipeline', [['Camera verified'], ['Collect'], ['Annotate'], ['Split'], ['Train'], ['Cross-validate'], ['Tune threshold'], ['Test once'], ['Slice errors'], ['Target next collection']], ['Source-backed collection feeds the controlled portfolio reconstruction'], undefined, 'Every sample has a reason to exist, every decision uses held-out evidence, and every new request targets a measurable error mode.'),
  block('Deliverables are the least interesting layer.', 'h2'),
  table(['Deliverables', 'Ideas', 'Outcome'], [['1,000-image package; manual references; annotation schema; notebook design; graphs; error matrix', 'Split by parent event; regularize; tune threshold to product cost; size evaluation; let errors choose the next data', 'A motorcycle CV loop that improves detection without confusing more data with better data']]),
  block('Claims I can defend', 'h2'),
  table(['Can defend', 'Do not claim'], [['The source work targeted 1,000 motorcycle samples after the target camera was active', 'That 1,000 images are universally sufficient'], ['Manual evidence was attached to relevant CV feature / location work', 'That raw operational images or ticket details are public'], ['The FYP uses standard supervised learning, logistic regression, regularization, CV, bias / variance, and learning theory', 'That a specific pretrained backbone was deployed'], ['Controlled reconstructed evaluation produced the documented metrics', 'That 96.33% is deployed production accuracy'], ['Controlled error count fell from 53 to 22', 'That 58.5% is production uplift']]),
  callout('Final outcome', 'More data is not automatically better data. The collection must preserve correct labels, independent evaluation, representative failure modes, product operating costs, and generalization.', 'success'),
  callout('Privacy and claim boundary', 'No operational images, plate numbers, internal CV-ticket details, private links, or sensitive location metadata are reproduced. All training metrics remain explicitly labeled as controlled portfolio reconstruction.', 'warning'),
]

const project8Document = { _type: 'article', title: '1,000 images are not a dataset until the labels, split, and loss function agree.', excerpt: 'A data-centric motorcycle computer-vision training case study connecting field collection, label governance, leakage-safe evaluation, regularized learning, threshold tuning and error-driven recollection.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Computer Vision', 'Machine Learning', 'Dataset Design', 'Data-Centric AI', 'Motorcycle Detection', 'Supervised Learning', 'Logistic Regression', 'Regularization', 'Cross Validation', 'Bias Variance', 'Learning Curves', 'Threshold Tuning', 'Hoeffding Inequality', 'Error Analysis'], category: 'Computer Vision / Machine Learning', featured: false, role: 'Product / Data / ML Analysis', projectType: 'Dataset Design / Supervised Learning', system: 'Motorcycle Computer Vision', coreQuestion: 'Can 1,000 carefully curated field images produce measurable classifier improvement, and can we quantify whether that improvement is likely to generalize?', evidence: 'Source-backed field collection and label provenance + controlled portfolio / FYP reconstruction', status: 'Completed Portfolio Reconstruction', seoTitle: 'Motorcycle Computer Vision Training | Anastasia Aurelia', seoDescription: 'Turning 1,000 field motorcycle images into a data-centric CV training workflow with leakage-safe splits, regularization, threshold tuning, and learning theory.', body: project8Body }

const project9Body = [
  callout('Portfolio thesis', 'The feature looked like a single field edit. The real work was defining when a cross-system identity or ownership mutation is safe enough to call complete.', 'success'),
  table(['Evidence', 'Result'], [['Separate product flows', '2'], ['Implementation strategies', '3'], ['Release-gate QA scenarios', '20 minimum'], ['Change-plate tickets', 'approximately 53, Jan–Jun']]),
  callout('Claim boundary', 'The completed artifact is product architecture, an implementation-decision package, and a release contract. This case study does not claim a production rollout, measured production success rate, adoption, ticket reduction, cost savings, or resolved finance rules.', 'warning'),
  block('What I actually built', 'h2'),
  block('A completed product-definition package, not just a set of screens.'),
  table(['Layer', 'Completed definition'], [['Deliverable', 'Consolidated PRD v2.0, Hi-Fi walkthrough, two current swimlanes, three implementation strategies, deterministic truth-table rules, manual SOP, and a 20-scenario release gate'], ['Idea', 'Treat plate and ownership changes as state transitions across multiple systems; one database write cannot establish completion'], ['Outcome', 'One contract for what is allowed, blocked, pending, recoverable, and required before the UI shows success'], ['Scope boundary', 'Flow A changes plate; Flow B1 changes ownership; Share My WUZZ changes access; claims and disputes remain manual']]),
  block('Low volume, high blast radius.', 'h2'),
  block('Approximately 53 Change Plate tickets were recorded from January through June—roughly 8.8 per month. This was not a high-volume support case. The business case was failure severity.'),
  ...bullets('A partial update can make App or CMS show the new plate while Agent, ticket, parking slip, or checkout still refers to the old one.', 'A member can lose gate access if success appears before every membership location is updated.', 'A transfer can leak old history or preserve sender and shared-user access when ownership boundaries are unclear.'),
  diagram('Cross-system mutation surface', 'pipeline', [['User / vehicle'], ['PARKEE App'], ['Cloud request orchestration'], ['CMS / Admin'], ['Agent / membership'], ['Gate / LPR'], ['Ticket / slip / report']], ['CS and Location Ops own recovery and SOP', 'Decision, location sync, entry/exit, and reporting are separate surfaces'], undefined, 'Conceptual product surface—not an exact backend infrastructure diagram.'),
  block('One feature request became four different problems.', 'h2'),
  table(['Path', 'What changes', 'Authorization', 'Default handling'], [['Flow A · Change Plate', 'Plate only; same owner, vehicle, WUZZ, and sticker', 'Current owner + CMS review', 'Self-service candidate; members require Agent/location closure'], ['Flow B1 · Transfer WUZZ', 'WUZZ ownership moves to another Parkee account', 'Sender initiates; recipient accepts', 'No CMS approval by default on happy path; audit/support visibility remains'], ['Share My WUZZ', 'Access only; ownership stays unchanged', 'Owner grants access', 'Never substitute sharing for transfer'], ['Manual / claim', 'Ownership uncertain or sender unavailable', 'CS / Legal / evidence', 'Lost phone, dispute, unreachable owner, or unclear documentation stops the happy path']]),
  block('Closure invariants', 'h2'),
  { _type: 'code', _key: key(), language: 'text', filename: 'Flow A consistency invariant', code: 'FOR EVERY required system and membership location s:\n  plate_s = P_new\n\nAND:\n  WUZZ_after = WUZZ_before\n  sticker_after = sticker_before\n  owner_after = owner_before\n\nIF any required Agent/location update fails:\n  request != SUCCESS\n  request = PENDING | RECOVERY | ROLLBACK' },
  callout('Non-negotiable closure rule', 'CMS success alone is not success. Every required system and active membership location must agree before Flow A can close.', 'warning'),
  { _type: 'code', _key: key(), language: 'text', filename: 'Flow B1 ownership invariant', code: 'BEFORE recipient acceptance:\n  owner = sender\n\nAFTER effective transfer timestamp:\n  owner = recipient\n  pre-transfer history stays with sender\n  sender-created Share My WUZZ grants are revoked' },
  block('Change Plate Number: same identity, new plate.', 'h2'),
  block('Flow A is a controlled mutation with pre-checks, request state, CMS review, Agent synchronization, membership fan-out, and post-change validation. WUZZ identity, owner, vehicle context, and sticker remain unchanged.'),
  table(['Flow A rule', 'Decision'], [['Ongoing parking / active ticket', 'HARD BLOCKER'], ['Membership = CASUAL', 'Follow the confirmed casual branch'], ['Membership = MEMBER', 'Require every active Agent/location acknowledgement'], ['Membership = UNKNOWN', 'WAITING FOR VERIFICATION or BLOCK; never silently default to CASUAL'], ['Competing request', 'Block until request precedence is resolved'], ['Partial location update', 'Keep pending; retry, recover, or rollback']]),
  callout('Old-plate effective-reference rule', 'The old plate remains effective until finalization. Cancel restores the original state.', 'info'),
  block('The UI is the easy part.', 'h2'),
  block('The Hi-Fi contract exposes that a mutation may take time to propagate. STNK and OCR support evidence review, but OCR mismatch, blur, or uncertainty routes to manual review or re-upload. OCR does not automatically approve ownership or membership.'),
  diagram('Flow A product states', 'pipeline', [['Original state'], ['Upload / review evidence'], ['Submit request'], ['Pending approval'], ['Synchronizing required systems'], ['Validated or recovery']], ['Cancel returns to original state', 'Old plate remains effective until validated'], 'Do not show success while required acknowledgements are missing.', 'A web-native reconstruction of the useful UI states; internal screenshots are omitted.'),
  block('The first end-to-end test broke the mental model.', 'h2'),
  table(['Observed surface', 'Plate state in the discussed QA case'], [['App', 'New plate'], ['Entrance', 'New plate'], ['Parking slip / ticket', 'Old plate'], ['Checkout', 'Old plate']]),
  callout('Discovery', 'The problem was no longer “edit a field.” It became “define the source of truth and update ordering.”', 'warning'),
  table(['Failure mode', 'Why it matters', 'Product rule'], [['New plate in App, old plate in Agent membership', 'Repeated verification / member identity mismatch', 'Keep pending until all required locations sync'], ['User still inside a location', 'Ticket may snapshot the old plate', 'Hard block until active parking ends'], ['Agent update partially fails', 'Some locations accept B while another expects A', 'Retry, recover, or rollback; never emit false success'], ['No CRO / no remote recovery', 'Mismatch can trap the user at the gate', 'Block unless a tested recovery path exists']]),
  diagram('Portfolio reconstruction of distributed Flow A state logic', 'pipeline', [['REQUEST CREATED'], ['PRECHECK'], ['WAITING FOR APPROVAL'], ['CMS DECISION'], ['MEMBERSHIP RESOLUTION'], ['FAN-OUT / APPLY'], ['POST-CHANGE VALIDATION'], ['SUCCESS or PENDING / RECOVERY']], ['Any hard blocker → BLOCKED', 'UNKNOWN membership → WAITING FOR VERIFICATION', 'Any missing acknowledgement → KEEP PENDING'], 'These are conceptual states implied by the PRD and QA findings—not claimed backend enum names.', 'Success exists only after all required systems agree.'),
  block('Architecture decision', 'h2'),
  block('Three implementations. Three places to put the complexity: engineering once, CS and Location Ops on every request, or a narrower product scope that excludes member self-service.'),
  block('Option 1 — Full System Sync', 'h2'),
  block('Engineering owns the hardest implementation so casual and member users can complete the same self-service journey, including automatic synchronization across every active membership location.'),
  swimlane('Option 1 — Full System Sync', 'Engineering-heavy · Full member coverage · Automatic WUZZ ↔ Agent synchronization', [
    ['User', [
      ['Start and open Change Plate Number', 'Open WUZZ detail.', 'process', ['Input new plate and required documents']],
      ['Input evidence and consent', 'Review impact and terms, then submit the request.', 'process', ['App / Cloud validation']],
      ['Receive outcome', 'Success notification is sent only after the chosen completion criteria pass.', 'success'],
    ]],
    ['PARKEE App / Cloud', [
      ['Validate WUZZ, new plate, and activity', undefined, 'process', ['Duplicate plate? YES → Out of scope', 'Duplicate plate? NO → Active parking decision']],
      ['New plate registered to another WUZZ?', undefined, 'decision', ['YES → Out of scope', 'NO → Check ongoing parking / active ticket']],
      ['Ongoing parking / active ticket?', undefined, 'decision', ['YES → Block: finish parking activity first', 'NO → Reliable membership lookup']],
      ['Resolve membership from a reliable source', 'UNKNOWN cannot silently become CASUAL.', 'decision', ['CASUAL → Standard request', 'MEMBER → Retrieve all active membership locations', 'UNKNOWN → Pending verification or block']],
    ]],
    ['CMS / Admin', [
      ['Create review request', 'Casual: standard Change Plate request. Member: attach every active membership location.', 'process', ['Admin approval decision']],
      ['Approved?', undefined, 'decision', ['NO → Denied; keep/revert old plate and notify user', 'YES → Coordinated update']],
      ['Denied', 'Keep or restore the old plate and notify the user.', 'blocked'],
    ]],
    ['Agent / Location', [
      ['Start coordinated update', 'Update the WUZZ plate and fan out the member update to ALL active locations. Casual requests require no Agent update.', 'process', ['Agent updates Location A / B / C / …']],
      ['Return per-location result', 'Each required location returns success or failure.', 'process', ['Are ALL required locations synced?']],
      ['All required locations synced?', undefined, 'decision', ['NO → Keep pending; retry / recover / rollback; notify CS if needed', 'YES → Final gate validation']],
      ['Keep pending', 'Retry, recovery, or rollback. AGENT UPDATE FAILED ≠ SUCCESS.', 'pending'],
    ]],
    ['Gate / Validation', [
      ['Validate final state', 'App/CMS = new plate\nWUZZ number unchanged\nAgent = new plate for members\nEntry, exit, ticket, slip, and report valid\nAudit old → new', 'process', ['Final state valid?']],
      ['Final state valid?', undefined, 'decision', ['NO → Keep pending; recovery / rollback', 'YES → Success and notify user']],
      ['Keep pending / recover', 'Do not close while any required state is unconfirmed.', 'pending'],
      ['Success', 'Notify user: Change Plate completed.', 'success'],
    ]],
  ], 'Desktop groups the full graph by owner; mobile stacks the same lanes and preserves every labeled transition.'),
  table(['Option 1 lens', 'Assessment'], [['Implementation character', 'Engineering-heavy; full member coverage'], ['Who pays complexity?', 'Engineering, once'], ['Casual', 'Supported self-service'], ['Member', 'Supported self-service'], ['Multi-location', 'System-managed'], ['CS effort', 'Low'], ['Ops effort', 'Low'], ['Scalability', 'High'], ['Main value', 'Best UX + scalable'], ['Main cost', 'Highest engineering effort']]),
  callout('Option 1 dependencies', 'Reliable membership lookup; Agent update API/integration; per-location status callbacks; retry, rollback, and partial-failure handling; cross-system QA.', 'info'),
  block('Option 2 — Assisted Change Plate', 'h2'),
  block('The App remains the intake channel, while CS verifies membership and Location Ops performs each Agent or Backoffice update. Engineering effort is lower than Option 1, but operational work repeats for every member request.'),
  swimlane('Option 2 — Assisted Change Plate', 'CS/Ops-heavy · Full member coverage through a manual SOP · App as intake channel', [
    ['User', [
      ['Open Change Plate and enter evidence', 'Input new plate and documents.', 'process', ['App validation']],
      ['Member or verification warning', 'Confirm every membership location and accept the disclaimer / terms.', 'decision', ['Declare Location A / B / C', 'Submit request']],
      ['Submit request', undefined, 'process', ['Request status: waiting for review']],
    ]],
    ['PARKEE App / Cloud', [
      ['Validate plate and activity', undefined, 'process', ['Ongoing parking / active ticket?']],
      ['Ongoing parking / active ticket?', undefined, 'decision', ['YES → Block: finish parking activity first', 'NO → Check membership information']],
      ['Membership status?', 'UNKNOWN must wait for verification.', 'decision', ['CASUAL → Normal request path', 'MEMBER / UNKNOWN → Waiting for review + Request ID']],
      ['Waiting for review', 'Expose a traceable Request ID to the user and operations.', 'pending', ['CS verification']],
    ]],
    ['CS / CMS', [
      ['Verify request and identity', 'Check old/new plate, documents, and WUZZ using the Request ID.', 'process', ['Verify membership status and ALL locations']],
      ['Confirm every membership location', 'Supporting lookup: user declaration, Metabase, Agent/Backoffice, or direct confirmation.', 'decision', ['NOT confirmed → Keep pending; contact user; DO NOT APPROVE', 'Confirmed → Create one task per location']],
      ['Create per-location tasks', 'Location A / B / C / …; notify the relevant Location Ops.', 'process', ['Manual Agent / Backoffice update']],
      ['Approve and record audit', 'After location confirmation: update WUZZ old → new and retain Request ID.', 'process', ['Final validation']],
    ]],
    ['Location Ops / Agent', [
      ['Open Agent / Backoffice', undefined, 'process', ['Update each membership plate']],
      ['Update old plate → new plate', 'Repeat for every required location.', 'process', ['Report result per location']],
      ['Confirm per-location status', 'Example: A updated; B updated; C pending.', 'process', ['Are ALL required locations confirmed?']],
      ['All required locations confirmed?', undefined, 'decision', ['NO → Keep pending; CS follows up with Ops', 'YES → CMS approval and final validation']],
    ]],
    ['Validation / Recovery', [
      ['Validate final state', 'App/CMS = new plate\nEvery Agent location = new plate\nNo old active membership plate remains\nEntry, exit, ticket behavior valid', 'process', ['Completion criteria satisfied?']],
      ['Wrong or incomplete location list', 'CS finds mismatch → DO NOT APPROVE; contact user and update the location list.', 'blocked', ['Return to verification using Request ID']],
      ['Undiscovered location after completion', 'Treat as a gate/member issue; CS/Ops recover using the Request ID.', 'pending'],
      ['Keep pending or succeed', 'NO → pending and follow-up. YES → notify user and close request.', 'decision', ['Confirmed → Success', 'Unconfirmed → Keep pending']],
    ]],
  ], 'The Request ID joins intake, verification, per-location work, follow-up, validation, and recovery.'),
  table(['Option 2 lens', 'Assessment'], [['Implementation character', 'CS/Ops-heavy; manual SOP'], ['Who pays complexity?', 'CS + Location Ops, for every request'], ['Casual', 'Supported'], ['Member', 'Covered through an assisted request'], ['Multi-location', 'Handled manually'], ['CS effort', 'High'], ['Ops effort', 'High'], ['Scalability', 'Low'], ['Main value', 'Lower engineering effort + full member coverage'], ['Main cost', 'Operational load + residual human error']]),
  callout('Option 2 dependencies', 'User/location verification; SOP, PIC, and escalation; manual Agent/Backoffice update; tracking for every required location; Request ID–based recovery.', 'info'),
  block('Option 3 — Casual-Only Self Service', 'h2'),
  block('This is deliberate scope reduction: only confirmed casual users self-serve. Members and unknown membership states follow the existing CS process until reliable detection proves the request is safely casual.'),
  swimlane('Option 3 — Casual-Only Self Service', 'Minimum scope · Confirmed casual users self-serve · Members and unknown states route to Customer Service', [
    ['User', [
      ['Start and open Change Plate Number', undefined, 'process', ['Input new plate and required documents']],
      ['Continue with evidence', 'Submit the new plate and required documents.', 'process', ['App validation']],
    ]],
    ['PARKEE App / Cloud', [
      ['Validate new plate and activity', 'Duplicate/invalid plate cannot proceed.', 'process', ['Ongoing parking / active ticket?']],
      ['Ongoing parking / active ticket?', undefined, 'decision', ['YES → Block: finish parking activity first', 'NO → Check membership']],
      ['Membership status?', 'Reliable detection is a release dependency.', 'decision', ['CASUAL → Continue self-service', 'MEMBER → Do not create self-service request', 'UNKNOWN → Verification / CS; never treat as casual']],
    ]],
    ['CMS / Customer Service', [
      ['Confirmed casual request', 'Submit Change Plate request; status = waiting for approval.', 'process', ['CMS reviews plate and documents']],
      ['Approved?', undefined, 'decision', ['NO → Denied; keep old plate and notify reason', 'YES → Update WUZZ / CMS']],
      ['Member or unknown', 'Show a CS explanation and Contact Customer Service CTA.', 'blocked', ['Existing manual CS/Ops membership flow outside self-service']],
    ]],
    ['Agent / Location Ops', [
      ['Update WUZZ / CMS', 'Old plate → new plate; WUZZ number unchanged.', 'process', ['Confirmed casual requires no Agent synchronization']],
      ['No Agent synchronization', 'Safe only because scope is confirmed casual.', 'success', ['Validation']],
      ['Member handling stays manual', 'Existing CS/Ops membership process remains outside self-service scope.', 'pending'],
    ]],
    ['Validation', [
      ['Success for confirmed casual', 'Notify user: Change Plate completed.', 'success'],
      ['Denied', 'Keep old plate and notify the reason.', 'blocked'],
      ['Scope boundary', 'Member pain is not solved by this release; reliable member detection remains a dependency.', 'pending'],
    ]],
  ], 'Unknown membership never defaults to casual; it routes to verification or Customer Service.'),
  table(['Option 3 lens', 'Assessment'], [['Implementation character', 'Smallest / narrowest product scope'], ['Who pays complexity?', 'Product scope and excluded user coverage'], ['Casual', 'Supported self-service'], ['Member', 'Not self-service'], ['Multi-location', 'Outside self-service scope'], ['CS effort', 'Existing flow'], ['Ops effort', 'Existing flow'], ['Scalability', 'Medium'], ['Main value', 'Fastest + safest implementation'], ['Main cost', 'Member pain remains']]),
  callout('Option 3 dependencies', 'Reliable member detection; UNKNOWN routes to verification; downstream QA for the casual path; an existing CS path for members.', 'info'),
  block('Implementation strategy comparison', 'h2'),
  table(['Dimension', 'Option 1 · Full System Sync', 'Option 2 · Assisted Change Plate', 'Option 3 · Casual-Only Self Service'], [
    ['Implementation character', 'Engineering-heavy; full member coverage', 'CS/Ops-heavy; full member coverage with SOP', 'Minimum scope; members routed to CS'],
    ['Who pays complexity?', 'Engineering', 'CS + Location Ops', 'Product scope / user coverage'],
    ['Casual', 'Supported self-service', 'Supported', 'Supported self-service'],
    ['Member', 'Supported self-service', 'Supported assisted request', 'Not self-service'],
    ['Multi-location', 'System-managed', 'CS/Ops-managed manually', 'Outside self-service scope'],
    ['CS effort', 'Low', 'High', 'Existing flow'],
    ['Ops effort', 'Low', 'High', 'Existing flow'],
    ['Scalability', 'High', 'Low', 'Medium'],
    ['Main value', 'Best UX + scalable', 'Lower engineering effort + full member coverage', 'Fastest + safest implementation'],
    ['Main cost', 'Highest engineering effort', 'Operational load + residual human error', 'Member pain remains'],
  ], 'Qualitative decision framing: engineering effort vs operational effort vs user coverage.'),
  block('Decision guide', 'h2'),
  ...bullets('Need scalable member self-service and willing to invest in Cloud + Agent integration → Option 1.', 'Need member coverage now with lower engineering effort and willing to absorb CS/Ops workload → Option 2.', 'Priority is the fastest / safest release and member synchronization risk is not yet proven safe → Option 3.'),
  callout('Non-negotiable success rule', 'SUCCESS ≠ CMS PLATE UPDATED. Success means the completion criteria for the chosen architecture are satisfied. For any member flow, if required Agent/location updates are not synced and confirmed, KEEP PENDING or RECOVER. Do not mark SUCCESS.', 'warning'),
  block('Recommended end state — Full System Sync', 'h2'),
  block('Full System Sync remains the strongest end state when member self-service, multi-location membership, reliable Agent integration, and long-term scalability matter. Option 1 moves complexity to engineering once; Option 2 moves it to CS/Ops for every request; Option 3 avoids it by excluding member self-service. This does not make Option 1 the automatic short-term release: Option 2 remains an assisted fallback, and Option 3 is a valid scope-reduction strategy.'),
  table(['Stage', 'Required evidence before moving on'], [['Pre-check', 'WUZZ active; target plate valid; no competing request; no ongoing parking; membership resolved'], ['Apply', 'Old → new plate applied in agreed sequence; owner and WUZZ identity preserved'], ['Member fan-out', 'Every active membership location receives the update and returns success or failure'], ['Validation', 'App/CMS, Agent, entrance/exit, LPR, ticket, parking slip, and report agree'], ['Close', 'All required acknowledgements exist'], ['Partial failure', 'Request remains pending']]),
  callout('Distributed-systems lesson', 'The safest product copy is not “Plate updated.” It is closer to “All systems required for your access have been validated.” The UI must reflect transaction state, not one database write.', 'success'),
  block('Transfer WUZZ: ownership, not plate editing.', 'h2'),
  block('The sender initiates Flow B1. The recipient decides whether ownership actually moves. CMS can support audit and support search, but happy-path ownership must not move silently.'),
  diagram('Transfer consent and effective ownership', 'timeline', [['Sender owns WUZZ'], ['Sender initiates'], ['Recipient reviews'], ['Reject → sender remains owner'], ['Accept → effective transfer timestamp'], ['Owner becomes recipient'], ['History boundary applied'], ['Old sharing grants revoked']], ['Recipient acceptance is mandatory', 'Rejection preserves sender ownership'], undefined, 'Ownership changes only after affirmative recipient consent.'),
  block('Consent has to survive the whole journey.', 'h2'),
  table(['Boundary', 'Required behavior'], [['Privacy', 'Recipient history begins after the effective transfer timestamp'], ['Historical transactions', 'Remain with sender'], ['Reimbursement data / prior activity', 'Remain with sender'], ['Share My WUZZ', 'Every sender-created grant is revoked upon transfer'], ['Shared users', 'Are notified'], ['Recipient access', 'Does not inherit sender-created sharing grants']]),
  block('A safe self-service flow still needs an operational recovery model.', 'h2'),
  table(['SOP phase', 'Required action'], [['1–2 · Intake / pre-check', 'Capture Request ID, user, WUZZ, old/new plate, and STNK; verify no active parking, active ticket, or competing request'], ['3–4 · Membership / tasks', 'Resolve CASUAL / MEMBER / UNKNOWN; identify every location; create one traceable task per location'], ['5–7 · Coordinated update', 'Use QA-approved sequence; update Agent via API / Backoffice; apply CMS change in the same window'], ['8 · Validate', 'Check App/CMS, Agent, entrance, exit, ticket, parking slip, and report'], ['9–10 · Inform / close', 'Give user request state + Request ID; close only after old membership plate is inactive and every location confirms']]),
  callout('Request ID is the join key', 'It connects user, CMS, CS, location operations, retries, incident notes, and audit evidence. Without it, “manual fallback” becomes an untraceable side process.', 'info'),
  block('The truth table became the engineering contract.', 'h2'),
  block('The release gate contains 20 minimum scenarios across the following coverage.'),
  table(['Scenario coverage', 'Minimum scenarios represented'], [['Casual + member ordering', '2'], ['Multi-location synchronization', '3'], ['Ongoing parking / user inside / no-CRO recovery', '3'], ['Deny / cancel / expiry', '3'], ['Agent partial failure', '1'], ['OCR mismatch / duplicate plates / concurrent requests', '3'], ['Transfer happy path / rejection', '2'], ['Privacy/history / share revocation', '3'], ['Total', '20 minimum']], 'Coverage grouping from the source release gate; counts describe scenario allocation, not production volume.'),
  table(['Truth-table gap', 'Decision / next step'], [['PM WUZZ → PK LPR after Change Plate: which identity is compared?', 'Reproduce with Agent / QA; document whether source is ticket, membership, or live LPR'], ['Parking slip / report shows old plate', 'Trace source of truth; keep pending until reconciliation is possible'], ['WUZZ temporarily unavailable while membership is needed', 'Define exact lock scope; never block apartment / office access without recovery'], ['Transfer fee / location settlement unresolved', 'Block closure until BizOps / Finance rule is complete']]),
  block('Release states', 'h3'),
  table(['Dependency state', 'Release state'], [['PROVEN', 'PROCEED'], ['SAFE WORKAROUND + OWNER + SLA + MONITORING + RECOVERY', 'ACCEPT WITH SOP'], ['UNKNOWN', 'WAITING FOR VERIFICATION'], ['PARTIAL', 'KEEP PENDING'], ['ACCESS / PRIVACY / OWNERSHIP RISK WITHOUT RECOVERY', 'BLOCK']]),
  callout('Release rule', 'Do not invent an SLA value. “Accept with SOP” is valid only when a safe workaround, explicit owner, SLA, monitoring, and recovery are actually defined.', 'warning'),
  block('This became a coordination project, not a design handoff.', 'h2'),
  table(['Workstream', 'Primary contribution'], [['Product / PM', 'Scope split, precedence rules, success criteria, risk taxonomy, PRD consolidation'], ['Design', 'Mobile / CMS states, warnings, pending / cancel / deny / accept paths'], ['Agent / QA', 'Membership linking, PM/PK behavior, LPR verification, ticket / slip / report risk'], ['Backend / Cloud', 'Request orchestration, validation, audit, Agent integration, rollback requirements'], ['CS / BizOps / Location Ops', 'Existing handling, manual SOP, multi-location coordination, fees, recovery'], ['Legal / Privacy', 'Consent, history boundary, ownership period, share revocation']]),
  callout('Ownership question', 'Stop asking “Who owns the screen?” Start asking “Who owns the state transition when one system disagrees?”', 'info'),
  diagram('Execution timeline', 'timeline', [['18 Jun', 'Low-fi + swimlane'], ['3 Jul', 'Final design + prototype'], ['7 Jul', 'Backend validation / Hi-Fi'], ['15 Jul', 'Agent + BizOps/CS validation'], ['20 Jul', 'Agent risk assessment'], ['21 Jul', 'Risk-detail consolidation'], ['24 Jul', 'Truth table + validation map'], ['1 Aug', 'PRD v2.0 consolidated']], undefined, undefined, 'The work moved from UI flow to cross-system release contract.'),
  block('The useful artifact was the closure criterion.', 'h2'),
  table(['Outcome evidence', 'Result'], [['Product flows separated', '2'], ['Implementation strategies compared', '3'], ['QA scenarios in release gate', '20'], ['Non-negotiable success rule', '1: all required systems agree before success']]),
  block('The project started as self-service Change Plate. It ended with explicit boundaries for identity change, ownership transfer, membership fan-out, privacy, concurrency, rollback, and operational recovery.'),
  block('Claims I can defend', 'h2'),
  table(['Can defend', 'Do not claim'], [['Consolidated conflicting legacy artifacts into decision precedence and two product flows', 'Production rollout'], ['Surfaced the CMS–Agent mismatch and converted it into blocking, pending, synchronization, and recovery rules', 'Measured production success rate or failure reduction'], ['Compared three implementation strategies and recommended Full System Sync', 'Engineering SLA not stated in the source'], ['Defined 20 release-gate QA scenarios plus manual SOP, privacy, and audit requirements', 'Adoption, revenue, ticket reduction, support-hour reduction, or cost savings'], ['Explained why “CMS updated” is insufficient success evidence for a member request', 'That every business or finance issue is resolved']]),
  callout('Portfolio value', 'I did not just design a plate-edit flow. I turned an ambiguous cross-system mutation into a deterministic product contract that engineering, QA, and operations could implement and test.', 'success'),
  callout('Final design principle', 'Do not hide uncertainty with a green success state. If the system cannot prove safe completion, keep the request pending, route it to recovery, or block it.', 'warning'),
  callout('Privacy and evidence boundary', 'No real customer data, phone numbers, account identifiers, plate numbers, internal URLs, credentials, financial details, or identifiable internal screenshots are reproduced.', 'warning'),
]

const project10Body = [
  callout('Portfolio thesis', 'The camera was one node in a larger timing, transport, storage, control, and data-quality pipeline. A correct recognition becomes operationally useful only when the evidence remains observable and recoverable through the physical lane.', 'success'),
  table(['Evidence', 'Source-supported value'], [['Analyzed CFX transactions', '1,087'], ['Training capture target', '1920×1080'], ['Recommended HTTP protocol in this project', 'Mode 5'], ['Source artifacts consolidated', '18']], 'PROJECT 10 EVIDENCE STRIP'),
  block('LPR Camera Reliability & Integration: Building an End-to-End Computer Vision Infrastructure Contract', 'h2'),
  block('A technical validation system connecting capture quality, installation geometry, time synchronization, HTTP transport, offline recovery, SDK diagnostics, firmware control, training data, and multi-day field stability.'),
  block('The camera was not the project. The reliability chain was.', 'h2'),
  block('The deliverable became an operating model connecting field geometry, device configuration, capture quality, network behavior, timestamps, APIs, local storage, peripherals, model data, and field stability.'),
  table(['What I consolidated', 'What the project produced'], [
    ['Installation geometry, recognition-area rules, image-quality SOP, and the 1080p requirement', 'One architecture map and a capture-quality acceptance contract'],
    ['HTTP Mode 5 payloads, heartbeat, retry, offline replay, NTP, and device timestamp behavior', 'A failure-state model and recovery release checks'],
    ['SDK callbacks, logs, frames, configuration, upgrade, and time-sync APIs', 'A programmable diagnostic and maintenance surface'],
    ['GPIO, RS485, gate, LED, speaker, firmware, and Indonesian algorithm versions', 'A versioned upgrade procedure and physical-output contract'],
    ['Vehicle taxonomy, sanitized OCR error evidence, and CFX entry/exit/end-to-end stability', 'A labeled error model, weighted baseline, and engineering release checklist'],
  ]),
  callout('The core shift', 'From “configure a camera” to “prove that recognition remains correct from the lens to the gate decision and downstream evidence.”', 'info'),
  block('I mapped the whole lane before touching parameters.', 'h2'),
  diagram('End-to-end camera reliability architecture', 'pipeline', [['Vehicle / lane', 'trigger + plate'], ['ECV87 LPR camera', 'recognition + capture'], ['HTTP server', 'Mode 5 POST + response'], ['Lane peripherals', 'gate + LED + speaker']], ['NTP / time → camera timestamps', 'Network loss → MicroSD offline queue → reconnect replay', 'HTTP server ↔ SDK diagnostics: callbacks, logs, configuration, upgrade'], undefined, 'A web-native system map reconstructed from the supplied Mode 5, ECV87, SDK, and peripheral documentation.'),
  table(['Component', 'Reliability responsibility'], [['Camera', 'Recognition, trigger, image capture, and device identity'], ['HTTP server', 'Recognition, heartbeat, and IO POSTs plus response instructions'], ['MicroSD', 'Offline persistence and replay after reconnection'], ['NTP', 'Timestamp integrity and log correlation'], ['GPIO / RS485', 'Physical gate, display, LED, and voice output'], ['SDK', 'Callbacks, logs, frames, configuration, upgrades, reboot, and time synchronization']]),
  block('HTTP POST was not just telemetry. It was the lane control loop.', 'h2'),
  block('Mode 5 sends recognition evidence upstream. A valid server response can drive physical behavior downstream: vehicle → camera → HTTP server → gate, display, and speaker.'),
  table(['Contract surface', 'Documented content'], [
    ['Recognition identity', 'plate_num, plate_color, plate validity, confidence on the documented 0–28 scale'],
    ['Vehicle context', 'Brand, color, vehicle_type'],
    ['Event context', 'start_time, parking-lot ID, camera ID/IP, entrance/exit type'],
    ['Trigger', 'Video, loop/hardware, or software'],
    ['Evidence', 'Panorama image and close-up plate image'],
    ['Server response', 'HTTP 200 + JSON'],
    ['Physical action', 'GPIO boom gate; RS485 LED/display; combined gate + LED + voice response'],
  ]),
  callout('Scale warning', 'The documented confidence range is 0–28. It is not a percentage and is not presented as one.', 'warning'),
  block('Network loss should create a queue, not missing evidence.', 'h2'),
  diagram('Mode 5 recovery state', 'pipeline', [['ONLINE'], ['POST FAILED'], ['QUEUE ON SD'], ['RECONNECTED'], ['RESUME UPLOAD'], ['SERVER ACKNOWLEDGES'], ['NORMAL ONLINE FLOW']], ['Heartbeat failure can move the camera into HTTP offline state', 'MicroSD must be present for resume upload', 'Release evidence requires disconnect, reconnect, and replay testing'], 'Replay is a supported recovery behavior, not an untested guarantee that every recognition will recover.'),
  table(['Recovery control', 'Project contract'], [['MicroSD support', 'Device supports ≤32 GB'], ['Operating format', 'FAT32 requirement for this validation'], ['Heartbeat', 'Online liveness signal; server response behavior must be verified'], ['Offline behavior', 'Recognition data can be stored locally when HTTP is unavailable'], ['Replay', 'Resume upload after reconnect; verify server acknowledgement'], ['Release test', 'Storage + heartbeat + disconnect + reconnect + replay']]),
  block('Time was part of correctness, not a cosmetic device setting.', 'h2'),
  block('Recognition payloads and SDK callbacks carry timestamps. If camera, server, and logs disagree, event pairing and incident analysis become unreliable.'),
  table(['Observed NTP setting', 'Value'], [['Server', 'asia.pool.ntp.org'], ['Port', '123'], ['Sync period', '60 s'], ['Configured sync difference', '10 s'], ['UI timezone', 'UTC+08:00'], ['Successful RTC sync evidence', '17:45:07']]),
  callout('Separate failure domains', 'The logs show NTP system-time synchronization starting and RTC synchronization completing. A warning about an unexpected NTP source IP is distinct, while WebSocket HTTP 403 entries belong to a separate authentication/channel issue—not proof that NTP failed. SDK time synchronization uses UTC; UI timezone remains a display/configuration concern.', 'warning'),
  block('The training archive failed a simple input contract: resolution.', 'h2'),
  block('PM2 / PK2 Combo training images were still below the required final target of 1920×1080.'),
  table(['Frame class', 'Pixels', 'Relative to 1080p', 'Use'], [['960×540', '518,400', '25.0%', 'Below target — recollect'], ['960×544 observed', '522,240', '25.2%', 'Below target — recollect'], ['1280×720 observed', '921,600', '44.4%', 'Below target — recollect'], ['1920×1080', '2,073,600', '100%', 'Required training capture']]),
  math('1920\\times1080=2{,}073{,}600', 'Full-HD training target pixel count.'),
  math('960\\times540=518{,}400', 'Observed 540p-class comparison pixel count.'),
  math('\\frac{2{,}073{,}600}{518{,}400}=4.0', '1080p contains 4× the pixels of 960×540.'),
  callout('What 4× means—and does not mean', 'More spatial evidence is available for character shape, blur analysis, crop review, and training inspection. Four times the pixels does not mean four times the OCR accuracy.', 'warning'),
  block('I converted “take better images” into repeatable camera settings.', 'h2'),
  table(['Capture control', 'Required setting'], [['Fill light brightness', '12'], ['Exposure maximum', '4000'], ['Analogue gain', '1'], ['Digital gain', '1'], ['Picture resolution', '1080P'], ['Mark Area', 'Disabled']]),
  callout('Capture acceptance rule', 'A training image is accepted only when both the capture settings and the final pixel dimensions satisfy the contract. Model debugging should not be polluted by uncontrolled acquisition variation.', 'info'),
  block('Resolution cannot rescue bad viewing geometry.', 'h2'),
  table(['Vendor geometry reference', 'Guidance'], [['Installation height', '1.5 m'], ['Pitch reference', '25°'], ['Video-trigger recognition distance', '3.5–4.5 m'], ['Wide-lane mitigation threshold', '>4.0 m'], ['Too far', '>5 m can create occlusion or following-vehicle issues'], ['Too close', '<3 m can distort the plate'], ['Placement', 'Install in front of the barrier where possible; avoid boom-arm obstruction'], ['Wide / multidirectional lane', 'Use cones, bollards, or auxiliary/master-slave camera arrangements']]),
  callout('Geometry boundary', 'These numbers are vendor geometry guidance, not universal laws. Every site still requires field validation.', 'warning'),
  block('Recognition area became a measurable condition, not an eyeballed box.', 'h2'),
  table(['Optical acceptance check', 'Condition'], [['Recognition-area height', 'Approximately 1/2–2/3 of the preview window'], ['Coil trigger', 'Recognition region covers the coil loop'], ['Recommended plate width', '90–150 pixels; vendor client flags results outside this range'], ['Direction', 'Reject irrelevant front/rear traffic when required']]),
  block('The camera could be treated as a programmable component, not a black box.', 'h2'),
  table(['SDK surface', 'Supported integration work'], [['Process lifecycle', 'Initialize and release SDK once per process'], ['Discovery', 'Search, connect, and query device status'], ['Recognition', 'Register callbacks and retrieve recognition logs'], ['Frame diagnostics', 'Decoded frames with timestamp, width, and height'], ['Media', 'Start/stop video, record, and capture frames'], ['Peripherals', 'Gate I/O and RS485'], ['Configuration', 'Read/write device config and algorithm parameters'], ['Maintenance', 'Firmware upgrade, reboot, and device-time synchronization']]),
  callout('SDK package inventory', 'The supplied distribution contains 1,371 RAR entries across DLLs, headers, import libraries, documentation, demos, and multiple languages. No proprietary package files or binaries are reproduced here.', 'info'),
  block('A recognition decision only matters if the lane hardware executes it correctly.', 'h2'),
  diagram('Physical control chain', 'pipeline', [['Server decision'], ['HTTP response'], ['GPIO / RS485'], ['Gate / display / voice']], ['OCR evidence must match the decision', 'Physical action must be observed', 'Operator-visible feedback must be verified']),
  { _type: 'code', _key: key(), language: 'text', filename: 'LCD application packet', code: 'DA | VR | PN | CMD | DL | DATA | CRC' },
  table(['Packet field / behavior', 'Contract'], [['CRC16', 'Protects packet integrity; checksum covers DA through DATA'], ['Commands', 'Time synchronization, brightness, volume, relay/gate, voice, text, and QR'], ['HTTP + RS485', 'Server can return RS485 bypass data in the same JSON response that opens GPIO gate output'], ['Acceptance', 'Verify OCR result + physical action + operator-visible feedback']]),
  block('Firmware and algorithm versions were recorded before and after upgrade.', 'h2'),
  diagram('Controlled upgrade sequence', 'pipeline', [['Maintenance'], ['Browse package'], ['Upgrade'], ['Camera restart'], ['Verify application, logic, and LP algorithm versions']]),
  table(['Version control', 'Recorded value'], [['Algorithm base', '20230207153739 Indonesian version'], ['Release change', 'Added support for license plates starting with CD'], ['VDC after upgrade', '2.0.55647.ALG_VBCR_VDA.230523T'], ['VLPR after upgrade', '2.3.167570.ALG_VLPR_INNIA_VDC_ALPHA_CNN.241008'], ['Upgrade payload', 'update.bin']]),
  callout('Version evidence, not uplift evidence', 'These identifiers make behavior comparable across builds. The source does not establish an accuracy improvement caused by the firmware upgrade.', 'warning'),
  block('Training data needed a vehicle taxonomy, not just a folder of pictures.', 'h2'),
  table(['Class', 'Label'], [['0', 'UNKNOWN'], ['1', 'NORMAL_CAR'], ['2', 'MINIBUS'], ['3', 'BUS'], ['4', 'MEDIUMBUS'], ['5', 'PICK_UP_TRUCK'], ['6', 'SUV'], ['7', 'MPV'], ['8', 'PICKUPTRUCK'], ['9', 'MEDIUMTRUCK'], ['10', 'HEAVYTRUCK'], ['11', 'TRICYCLE']]),
  block('The supplied workbook contains 22 visual examples and records algorithm note 2.0.CNN.ALG_HIGHVEHICLECLS.241211: an independent vehicle-detection model using RGB test images, with separate entrance/exit and high-pole guidance. Raw identifiable images are omitted.'),
  block('OCR errors became labeled model evidence instead of screenshots in chat.', 'h2'),
  table(['Sanitized error class', 'Review meaning'], [['W → H', 'Character-shape confusion'], ['O → B / Q / H', 'Rounded-character confusion'], ['U ↔ V-like', 'Shape ambiguity'], ['Truncation', 'Incomplete crop or recognition'], ['Close-queue contamination', 'Nearby vehicle or queue context affects evidence']]),
  callout('Retraining gate', 'Do not classify every mismatch as OCR failure. Check image quality, trigger timing, nearby vehicles, close queue, crop quality, and environmental cause before assigning a sanitized sample to model-retraining evidence.', 'warning'),
  block('CFX stability showed that entry was not the dominant problem.', 'h2'),
  table(['Window', 'Analyzed N', 'Entry', 'Exit', 'Both correct'], [['Aug 4–5', '299', '91.30%', '66.89%', '64%'], ['Aug 5–6', '288', '92.71%', '75.69%', '74%'], ['Aug 6–7', '139', '93.14%', '67.15%', '64%'], ['Aug 7–8', '152', '92.11%', '69.08%', '66%'], ['Aug 8–9', '97', '95.34%', '65.28%', '62%'], ['Aug 9–10', '32', '87.50%', '71.88%', '63%'], ['Aug 10–11', '80', '95.00%', '82.50%', '79%']], 'Seven documented CFX windows; percentages are not equally averaged.'),
  block('The weighted baseline made the bottleneck explicit.', 'h2'),
  math('\\text{Entry Accuracy}=\\frac{1005}{1087}=92.46\\%', '1,005 correct entry results across 1,087 analyzed transactions.'),
  math('\\text{Exit Accuracy}=\\frac{768}{1087}=70.65\\%', '768 correct exit results across the same analyzed denominator.'),
  math('\\text{End-to-End}=\\frac{735}{1087}=67.62\\%', '735 transactions with both entry and exit correct.'),
  math('92.46-67.62=24.84\\text{ percentage points}', 'Entry-to-end-to-end gap in the documented CFX sample.'),
  math('70.65-67.62=3.03\\text{ percentage points}', 'Exit-to-end-to-end gap in the documented CFX sample.'),
  callout('CFX interpretation', 'End-to-end performance in this sample is constrained much more by exit than entry. Improving entry OCR alone cannot close the 24.84-point entry-to-end-to-end gap while exit remains around 70.65%. This conclusion is limited to the documented CFX sample.', 'warning'),
  block('I turned vendor documentation into an engineering acceptance matrix.', 'h2'),
  table(['Layer', 'Acceptance condition', 'Evidence'], [['Capture', '1920×1080 final image; no Mark Area overlay; SOP settings recorded', 'Image dimensions + configuration screenshots'], ['Optics', 'Useful plate pixel scale; region aligned to lane/trigger area', 'Preview / annotated sample'], ['Time', 'NTP enabled; successful sync; timezone/UTC interpretation documented', 'Settings + sync logs'], ['Storage', 'MicroSD installed; ≤32 GB / FAT32 operating requirement met', 'Device/storage check'], ['HTTP', 'Mode 5 receives recognition + heartbeat and returns HTTP 200 / JSON', 'Server logs / packet capture'], ['Recovery', 'Network-loss queue and reconnect replay verified', 'Disconnect/reconnect test'], ['Peripherals', 'Gate GPIO + RS485 display/voice path verified', 'Physical test / logs'], ['SDK', 'Recognition callbacks/logs and frame dimensions validated', 'SDK diagnostics'], ['Firmware', 'Pre/post versions recorded and verified after reboot', 'Device Info evidence'], ['Training data', 'Expected-vs-predicted labels; no sub-1080p final samples', 'Dataset audit'], ['Stability', 'Entry, exit, and both-correct measured across multiple days', 'Daily stability report']]),
  diagram('Release evidence chain', 'pipeline', [['Capture'], ['Optics'], ['Time'], ['Storage'], ['HTTP'], ['Recovery'], ['Peripherals'], ['SDK'], ['Firmware'], ['Training Data'], ['Field Stability'], ['READY FOR VALIDATION']], undefined, 'READY means the evidence contract is satisfied—not that production uplift has already been achieved.'),
  block('The output was a completed technical validation package, not a fake production claim.', 'h2'),
  table(['Completed asset', 'Result'], [['Architecture', 'One map spanning trigger, camera, time, HTTP, storage, SDK, and peripherals'], ['Capture standard', 'Repeatable SOP + explicit 1920×1080 requirement'], ['Observability', 'NTP logs, recognition callbacks, result logs, and frame dimensions'], ['Protocol integration', 'Mode 5 recognition, heartbeat, IO data, GPIO, and RS485'], ['Version governance', 'Upgrade workflow + Indonesian algorithm build evidence'], ['Dataset governance', 'Vehicle taxonomy + sanitized OCR-error categories'], ['Field measurement', 'Seven CFX windows + weighted entry/exit/end-to-end baseline'], ['Release discipline', 'Acceptance matrix preventing “camera works” from resting on UI or OCR evidence alone']]),
  callout('Claim boundary', 'This project establishes a technical validation architecture, capture standard, recovery model, SDK/protocol surface, version evidence, data-quality contract, field baseline, and release checklist. It does not establish post-rollout production uplift. Impact requires a controlled before/after measurement under the final camera build and final 1080p training dataset.', 'warning'),
  block('Claims I can defend', 'h2'),
  table(['Can defend', 'Do not claim'], [['Consolidated 18 source artifacts into one camera-reliability architecture', 'Measured post-rollout production uplift'], ['Defined 1920×1080 as this package’s training capture requirement', 'That 1080p guarantees higher OCR accuracy'], ['Mapped Mode 5 recognition transport and server-driven physical behavior', 'That Mode 5 guarantees zero data loss'], ['Defined storage, heartbeat, disconnect, reconnect, and replay checks', 'A replay success rate not documented in the source'], ['Separated NTP evidence from WebSocket/auth errors', 'That correlated logs share the same failure domain'], ['Mapped SDK diagnostics, recognition, configuration, upgrade, and time sync', 'Distribution of proprietary SDK binaries'], ['Recorded firmware/algorithm version evidence', 'Firmware-caused performance improvement'], ['Calculated 1,087-transaction CFX weighted results: entry 92.46%, exit 70.65%, end-to-end 67.62%', 'That the CFX baseline represents every production site'], ['Created an acceptance matrix from capture through physical output', 'Deployment completion outside the documented validation package']]),
  callout('Privacy and source boundary', 'No real plate strings, raw OCR filenames, identifiable archive images, internal camera IPs, credentials, private URLs, customer identifiers, device secrets, firmware contents, or vendor binaries are reproduced.', 'warning'),
]

const project10Document = { _type: 'article', title: 'A camera upgrade was actually an end-to-end reliability program.', excerpt: 'An end-to-end LPR camera reliability case study connecting acquisition quality, geometry, NTP, Mode 5, offline replay, SDK diagnostics, firmware, training data and field validation.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Computer Vision', 'LPR', 'Camera Integration', 'Systems Integration', 'Reliability Engineering', 'Edge Computing', 'HTTP', 'NTP', 'SDK', 'Firmware', 'Computer Vision Infrastructure', 'Observability', 'Data Quality', 'Training Data', 'GPIO', 'RS485', 'Failure Recovery'], category: 'Computer Vision / Infrastructure', featured: false, role: 'Product / Technical Analysis', projectType: 'Computer Vision Infrastructure / Integration Validation', system: 'ECV87 LPR Camera + HTTP + SDK + Gate Peripherals', coreQuestion: 'Can an LPR recognition event remain correct, observable and recoverable from capture through physical lane execution?', evidence: 'Camera integration, capture contract, transport/recovery, firmware, SDK, training-data quality and field stability', status: 'Completed Technical Validation Package', seoTitle: 'LPR Camera Reliability & Integration | Anastasia Aurelia', seoDescription: 'An LPR reliability case study spanning capture, geometry, NTP, HTTP, offline recovery, SDK diagnostics, firmware and field validation.', body: project10Body }

const researchLensBody = [
  block('I started ResearchLens because reading lists were easy to accumulate and hard to act on. Search could return twenty plausible papers in seconds. It could not tell me which result described an experiment rather than a survey, whether the implementation evidence was concrete, or what was missing before I committed a week to reproduction.'),
  block('That changed the product. I originally treated discovery as the main problem. The harder problem turned out to be interrogating the evidence around each paper without quietly inventing certainty that the source material did not contain.'),
  callout('The design question', 'How can a topic become a research map that preserves provenance, exposes missing evidence, and makes an honest recommendation—without turning a probabilistic summary into an authority?', 'info'),

  block('The problem changed after I started building it', 'h2'),
  block('The first working version was deliberately small: a Python command searched arXiv metadata, ranked candidates by query-term overlap, extracted a few fields from titles and abstracts, scored reproducibility, and wrote a Markdown report. There was no frontend, database, embedding model, or LLM call. That constraint was useful. It forced me to prove that the decision workflow itself had value before decorating it.'),
  block('The output quickly exposed the difference between relevance and usefulness. A paper can match a query perfectly and still be a poor reproduction target. A workshop announcement can contain the right vocabulary. A survey can be excellent background reading. Neither automatically gives a reader a method, dataset, evaluation path, and implementation evidence they can test.'),
  block('One real run made the flaw concrete: a broad computer-vision query elevated a historical essay and a workshop paper. The ranking had done what it was asked to do. The product had asked the wrong question. I kept relevance ranking, but stopped treating its first result as a recommendation.'),

  block('What ResearchLens actually does', 'h2'),
  block('The current system turns a topic into two related outputs: a readable Markdown research report and a structured set of paper records that the interface can sort and filter. Both are produced from the same run. The report explains the landscape; the records let the reader inspect the evidence behind individual candidates.'),
  diagram('From topic to research decision', 'pipeline', [['Topic query'], ['Provider discovery'], ['Normalize + merge'], ['Rank relevance'], ['Extract evidence'], ['Score reproducibility'], ['Report + paper records']], ['Source provenance survives deduplication', 'Unknown evidence remains unknown', 'Recommendations require a quality gate'], undefined, 'A simplified view of the implemented pipeline. Provider and scoring internals are intentionally omitted.'),
  table(['Stage', 'Responsibility', 'Output boundary'], [
    ['Discovery', 'Ask independent academic sources for candidates and tolerate partial provider failure.', 'Provider responses'],
    ['Normalization', 'Convert heterogeneous metadata into one additive paper shape.', 'Canonical paper records'],
    ['Merge', 'Deduplicate conservatively while preserving every contributing source and identifier.', 'Provenance-aware candidates'],
    ['Analysis', 'Rank, extract fields, classify paper type, and score reproducibility evidence.', 'Structured evidence'],
    ['Presentation', 'Generate deterministic Markdown and a separate machine-readable paper result set.', 'Report + interactive cards'],
  ]),
  articleImage('image-f5e950e1b83a09db1fb498ac9501bb8af0ab4f82-1440x1100-png', 'ResearchLens public query page with a topic field, result count, suggested topics, and run button.', 'The public query surface keeps the input small: a topic and the number of candidates to inspect.'),

  block('The architecture follows the workflow', 'h2'),
  block('The core pipeline remains a set of plain Python modules. Discovery, ranking, extraction, scoring, and report assembly can run from the command line. The HTTP service is intentionally a wrapper around those modules rather than a second implementation. When scoring behavior changes in the core, the API inherits the change instead of drifting into a parallel product.'),
  block('The frontend has a similarly narrow contract. It starts a run, fetches the generated Markdown, then asks separately for structured paper results. If structured results are unavailable—for example, for an older report—the report still renders. This was a small but important boundary: an enhancement to the result browser should not invalidate the primary research artifact.'),
  diagram('Major runtime boundaries', 'pipeline', [['Web client', 'query + filters'], ['Thin API', 'run + read artifacts'], ['Core pipeline', 'search → report'], ['Persisted artifacts', 'Markdown + JSON']], ['The CLI remains independently usable', 'The API does not duplicate analysis logic', 'Presentation failure does not erase a completed report'], undefined, 'The diagram shows responsibilities, not production topology or private deployment details.'),

  block('Decision 1 — normalize sources before analysis', 'h2'),
  block('Adding a second paper source could have leaked provider conditionals through every later stage. Instead, I put provider-specific retrieval behind adapters and normalized results at the discovery boundary. arXiv, OpenReview, and Semantic Scholar can disagree about fields, identifiers, or availability; ranking and scoring receive one stable shape.'),
  block('Deduplication is conservative. Records merge only on strong identifiers, normalized links, or exact-normalized titles. I preferred an occasional duplicate over collapsing two different papers because their titles looked vaguely similar. When records do merge, the system retains the ordered source list and provider-specific identifiers. The first source remains available for backward compatibility, but it no longer erases the others.'),
  callout('Why the boundary matters', 'A provider can be added, removed, or temporarily fail without teaching the rest of the application how that provider works. Provenance remains part of the evidence instead of becoming an implementation detail.', 'success'),

  block('Decision 2 — make uncertainty visible', 'h2'),
  block('The extractor works from metadata and abstracts. It looks for defensible signals for the problem, method, dataset, metric, result, contribution, difficulty, and paper type. If it cannot find a field confidently, it writes “unknown.” That is less impressive than filling every box, but it is far more useful than laundering a guess into structured data.'),
  block('Reproducibility is evaluated across six evidence areas: code availability, dataset clarity, compute requirement, method clarity, evaluation clarity, and practical reproduction value. Each area carries both a rating and a reason. The aggregate score is only a compact view; the missing-evidence list is the part that tells a reader what to verify next.'),
  table(['Evidence area', 'Question asked'], [
    ['Code', 'Is there concrete implementation evidence, a weaker availability claim, or no signal?'],
    ['Dataset', 'Can the experimental data be identified from the available metadata?'],
    ['Compute', 'Does the abstract expose accessible or demanding compute requirements?'],
    ['Method', 'Is the proposed approach described explicitly?'],
    ['Evaluation', 'Are both metric and result visible, only one, or neither?'],
    ['Reproduction value', 'Do difficulty and available assets make this a plausible build target?'],
  ]),
  callout('Deliberate limitation', 'The score estimates evidence availability; it does not verify that code runs, results reproduce, or claims are true. ResearchLens says what it observed and what remains missing.', 'warning'),

  block('Decision 3 — separate retrieval from recommendation', 'h2'),
  block('Relevance ranking and recommendation answer different questions. The ranking baseline uses query overlap across title, abstract, and metadata. It is transparent and cheap, but it cannot decide whether a result is the right kind of artifact to reproduce.'),
  block('I added paper-type detection and a recommendation threshold after seeing non-research material rise to the top of broad searches. Surveys, workshops, tutorials, position papers, and similar material can stay in the retrieved landscape, but they cannot become reproduction recommendations merely because their vocabulary matches. If no candidate clears the gate, the report says that no strong candidate was found. It does not crown the least weak option.'),
  block('That distinction also had to propagate through the whole report. It was not enough to fix the “recommended paper” heading while extension ideas and next steps still pointed at a low-confidence candidate. The threshold now has one source of truth, and every recommendation-bearing section follows it.'),

  block('Decision 4 — fail soft where the evidence is additive', 'h2'),
  block('Academic services fail independently. A rate limit or malformed response from one provider should not discard useful candidates already returned by another. Provider orchestration therefore continues with successful sources and reports failures as partial evidence, while the pipeline itself still stops when a required stage cannot produce its contract.'),
  block('The public run boundary adds bounded inputs, a finite request wait, concurrency control, and clear failure states. The browser also uses timeouts so a stalled upstream request does not leave the interface spinning indefinitely. These controls do not make external services reliable. They make failure legible and keep one failure from contaminating unrelated work.'),

  block('Where the AI actually belongs', 'h2'),
  block('The current production path does not call an LLM. Search, normalization, ranking, extraction, scoring, and report generation are deterministic or heuristic. That was a product decision, not an omission I tried to hide. At this stage, provenance and predictable failure behavior mattered more than fluent prose.'),
  block('A future model-assisted extractor could help with nuanced methods or evidence buried beyond an abstract. If I add one, it should remain optional, labeled, and subordinate to source evidence. Provider retrieval, identifiers, validation, recommendation gates, and artifact generation should stay system-driven. A model may propose an interpretation; it should not silently become the record of truth.'),
  block('I also deliberately did not automate paper execution. ResearchLens does not download arbitrary repositories and run them, and it does not treat a code link as proof of reproducibility. That boundary avoids turning a research-triage tool into an unreviewed execution environment.'),

  block('The interface became a second view of the same evidence', 'h2'),
  block('The first useful artifact was Markdown because it was inspectable, portable, and easy to diff. The later interface did not replace it. It added structured paper cards with provider provenance, publication date, citation metadata when available, relevance position, and the reproducibility result. Readers can sort and apply an explicit date filter without changing the underlying report.'),
  articleImage('image-41321c9c058148654aaab64f07d64dbfc5db36ce-1440x1100-png', 'ResearchLens sample results showing sortable paper cards, source badges, dates, citations, reproducibility ratings, and a report preview.', 'Structured cards and the Markdown report are separate views generated by the same pipeline run.'),
  block('The separation solved a practical evolution problem. Reports generated before structured results existed can still be read. New runs can support richer browsing without changing the report format into a frontend-only data structure.'),
  linkedBlock('ResearchLens is live at ', 'app.researchlens.xyz', '. The public application exposes the research workflow while the implementation details that would turn this article into a replication guide remain intentionally out of scope.'),

  block('What changed from the first version', 'h2'),
  table(['Initial assumption', 'Problem discovered', 'Design change'], [
    ['Paper discovery was the product.', 'Relevant results were not necessarily actionable research candidates.', 'Reproducibility evidence and recommendation honesty became first-class.'],
    ['One source was enough to prove the workflow.', 'Source coverage and provider outages shaped the resulting landscape.', 'Provider adapters, normalization, fail-soft orchestration, and provenance-preserving merge.'],
    ['The top relevance result could lead the report.', 'Surveys and workshops could rank highly without being reproducible contributions.', 'Paper-type detection, score caps, and a shared recommendation threshold.'],
    ['A Markdown report was the final interface.', 'Readers also needed to compare candidates without parsing prose.', 'A parallel structured artifact and interactive filtering layer.'],
    ['A local API call would behave like production.', 'Network waits and public traffic create different failure modes.', 'Input bounds, timeouts, concurrency limits, and explicit error states.'],
  ]),

  block('What I learned building it', 'h2'),
  block('The most important lesson was that research tooling needs an evidence model before it needs better generation. Retrieval can find a title. A fluent model can summarize an abstract. Neither tells the reader which facts were observed, which were inferred, which are absent, and which decision should be withheld.'),
  block('ResearchLens became useful when I treated “I do not know” as data. Unknown fields lower confidence. Missing evidence appears in the result. Weak candidates do not receive ceremonial recommendations. A provider failure reduces coverage without pretending the whole run was complete.'),
  block('Finding the paper was the easy part. The engineering work was preserving enough structure and provenance that the next question—“is this worth trusting, reading, or reproducing?”—could be answered honestly.'),
  callout('Scope of the current system', 'ResearchLens supports research discovery and reproducibility triage from academic metadata and abstracts. It does not verify experimental claims, reproduce papers, parse full PDFs, or use an LLM in the current analysis path.', 'warning'),
]

const researchLensDocument = { _type: 'article', title: 'Finding the paper was the easy part.', excerpt: 'How ResearchLens evolved from a paper-search CLI into a provenance-aware workflow for ranking research, exposing missing evidence, and making conservative reproducibility recommendations.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['ResearchLens', 'Applied AI', 'Research Engineering', 'Information Retrieval', 'Reproducibility', 'Python', 'FastAPI', 'React', 'Data Provenance', 'Product Engineering'], category: 'Applied AI', featured: false, role: 'Product Designer / Full-Stack Engineer', projectType: 'Research Workflow / Applied AI Product', system: 'Python pipeline + FastAPI + React web application', coreQuestion: 'How did paper discovery become a system for interrogating research evidence?', evidence: 'Source code, tests, decision log, git history, generated reports, and public application', status: 'Live product; actively evolving', seoTitle: 'ResearchLens: From Paper Search to Research Workflow', seoDescription: 'How I built ResearchLens: a provenance-aware paper workflow for ranking research, exposing missing evidence, and assessing reproducibility.', body: researchLensBody }

const tradingResearchLabBody = [
  callout('Research only', 'Trading Research Lab produces auditable market-research artifacts. It does not place orders, connect a wallet, or turn a report into an execution instruction.', 'warning'),
  block('I stopped treating market research as one model’s answer.', 'h2'),
  block('The first version of this project had a familiar shape: collect market data, run several analytical tools, and combine their outputs into a daily view. The hard part appeared after the tools worked. They disagreed. They used different ticker formats, different time horizons, and different notions of confidence. Some returned useful context without a directional signal. Others failed for one asset while succeeding for the rest.'),
  block('A fluent summary could hide all of that. It could make stale data sound current, present missing evidence as neutral evidence, or let a macro indicator masquerade as a vote on a specific asset. The problem was no longer “How do I ask more models?” It was “What evidence is allowed to influence the conclusion, and can I prove why?”'),
  block('That question changed Trading Research Lab—called Research OS inside the repository—from a collection of forecasting experiments into a layered evidence system.'),

  block('The system I ended up building', 'h2'),
  block('Research OS separates collection, normalization, eligibility, aggregation, and rendering. Each runner is responsible for one layer. Some layers calculate technical or forecasting signals. Others describe derivatives, macro conditions, market structure, protocol fundamentals, social activity, or on-chain context. Their outputs do not go directly into prose.'),
  diagram('From heterogeneous evidence to a research brief', 'pipeline', [
    ['Asset registry', 'canonical ticker and source role'],
    ['Layer runners', 'market data, models, quantitative and contextual evidence'],
    ['Raw artifacts', 'source-shaped outputs with explicit status'],
    ['Normalization', 'common signal and metadata contract'],
    ['Eligibility checks', 'identity, freshness, status and source role'],
    ['Aggregation', 'eligible directional evidence only'],
    ['Deterministic report', 'conclusion, exclusions and blind spots'],
  ], ['Context-only evidence remains readable but bypasses the directional tally', 'Execution systems stay outside the research path'], undefined, 'A simplified view of the implemented pipeline; provider-specific requests and internal schemas are intentionally omitted.'),
  block('The common contract is deliberately small. Directional layers can express bullish, bearish, neutral, or unknown. Unknown is excluded rather than converted into zero. Every artifact also carries enough state for the system to explain whether it is available, partial, stale, failed, unsupported, or intentionally non-directional.'),
  block('This is not a claim that heterogeneous models suddenly become statistically comparable. They do not. The final tally is a bounded research summary, not a calibrated probability and not a trading instruction.'),

  block('Decision 1 — normalize identity before normalizing opinions', 'h2'),
  block('Ticker identity looked like plumbing until it became a correctness problem. The same asset can arrive as a bare symbol, a USD pair, an exchange pair, or a provider-specific instrument. A “latest” file can also be perfectly fresh and still belong to the wrong asset. If that artifact enters a report, the error is more dangerous than a clean failure because the numbers look plausible.'),
  block('I introduced a canonical asset registry and moved provider selection behind source-routing boundaries. Ticker aliases are resolved to one internal identity before an artifact can be selected. Ticker-specific files are preferred, and the renderer checks the requested identity against the artifact identity rather than trusting a generic filename.'),
  diagram('Ticker isolation is a gate, not a filename convention', 'pipeline', [
    ['User ticker', 'alias or provider format'],
    ['Canonicalization', 'one Research OS identity'],
    ['Source routing', 'ticker-appropriate data path'],
    ['Artifact resolution', 'ticker-specific candidate first'],
    ['Identity check', 'requested ticker must match artifact'],
    ['Eligible layer state', 'only then can freshness be evaluated'],
  ], undefined, 'A fresh artifact for another ticker must fail the identity gate.', 'This boundary was strengthened repeatedly in the git history as more providers and asset classes were added.'),
  block('The consequence is visible in the tests. They cover canonical aliases, ticker-specific negative cases, stale generic artifacts, and model inputs that must not be borrowed across assets. An absent artifact produces an explicit unavailable state. It does not quietly fall back to another ticker’s result.'),

  block('Decision 2 — freshness comes before confidence', 'h2'),
  block('Model confidence is easy to overvalue because it arrives as a number. But confidence in an old forecast does not make the underlying market state current. I therefore made freshness a precondition for influence, not a footnote added after scoring.'),
  block('Each layer has a time expectation appropriate to its data. The system computes age from the artifact’s own timestamps, applies a layer policy, and records the resulting freshness state. A limited warning window can keep certain daily evidence visible while clearly labeling its age; beyond the exclusion boundary, it cannot contribute to the conclusion.'),
  diagram('Evidence eligibility', 'pipeline', [
    ['Artifact exists?', 'missing is not neutral'],
    ['Ticker matches?', 'prevent cross-asset contamination'],
    ['Status usable?', 'failed and unsupported remain explicit'],
    ['Fresh enough?', 'policy depends on the layer'],
    ['Directional role?', 'context is not consensus'],
    ['Included in conclusion', 'an explicit final state'],
  ], undefined, 'Confidence is interpreted only after these gates pass.', 'This diagram is explanatory notation for the implemented checks, not the production schema or a universal market model.'),
  block('This ordering also improved failure language. “Unknown” can mean a layer is not configured, a provider failed, an asset is unsupported, or the layer is context-only by design. Those are operationally different facts. Preserving the state lets the report say what is missing and why, instead of flattening every absence into the same harmless-looking value.'),

  block('Decision 3 — context is evidence, not automatically consensus', 'h2'),
  block('Several valuable inputs should never cast a directional vote. Macro conditions can describe the environment. An order book can describe local liquidity and imbalance. Protocol fundamentals can describe activity and valuation context. A liquidation map in this system is explicitly a proxy. None of those facts, by itself, is a universal bullish or bearish decision for every horizon.'),
  block('I encoded that distinction in the data path. Context-only layers carry an unknown directional signal and an explicit exclusion reason. Validators reject artifacts that mark protected context layers as included in the conclusion, and report validation checks the rendered conclusion for language that accidentally turns those layers into votes.'),
  ...bullets(
    'Directional and eligible evidence may add one bounded vote; model confidence values are never presented as additive probabilities.',
    'Context-only evidence may describe the environment and possible risks; it cannot change the directional tally.',
    'Unknown, failed, or stale evidence remains visible with its reason; absence is never treated as a neutral vote.',
    'Locked execution is reported as unavailable; the research system cannot suggest or place an order.',
  ),
  block('For the eligible directional set, the daily aggregator uses a simple signed tally: bullish contributes +1, bearish −1, and neutral 0; unknown is excluded. That simplicity is intentional. It makes the result inspectable, while the report keeps the vote breakdown and disagreements visible. The renderer is more conservative still: it warns when votes span different horizons or source classes rather than presenting the lean as a unified probability.'),

  block('Decision 4 — render last, and render deterministically', 'h2'),
  block('I originally thought the narrative layer would be the interesting part. In practice, prose was the last thing I wanted to trust. The current ticker brief is generated deterministically from validated layer states. Its sections, labels, exclusion reasons, and conclusion are derived from structured evidence rather than from a model improvising a coherent story.'),
  diagram('The report is a projection of state', 'pipeline', [
    ['Validated layer states'],
    ['Vote set + exclusion set'],
    ['Consistency invariants'],
    ['Deterministic section renderer'],
    ['Markdown research artifact'],
    ['Post-render validation'],
  ], ['The report shows freshness, disagreement, missing data and the next research step'], 'A failed consistency check blocks a trustworthy brief.', 'The output can be inspected, diffed, and regenerated from the same state.'),
  block('That decision made tests part of the product design. There are checks for context layers entering a vote, ticker mismatches, stale evidence, contradictory report language, freshness wording, incomplete artifacts, and conclusion integrity. A report can fail validation even when every upstream script completed successfully.'),
  block('The result is less theatrical than asking a model to write an investment memo. It is also easier to audit. If a conclusion changes, I can trace whether the input changed, the eligibility state changed, or the deterministic aggregation changed.'),

  block('Decision 5 — make asset onboarding a state transition', 'h2'),
  block('Adding a symbol to a configuration file is not enough to make it research-ready. A ticker can be discoverable but unsupported by the required sources, valid for spot data but not derivatives, or suitable only as market context. I separated discovery from admission with candidate, validation, promotion, rejection, and disabled states.'),
  diagram('Asset lifecycle', 'timeline', [
    ['Candidate', 'discovered, not trusted'],
    ['Validated', 'source reachability and quality checked'],
    ['Promoted', 'explicitly admitted to the active registry'],
    ['Active research', 'ticker-specific layers and reports'],
    ['Disabled or rejected', 'state and reason retained'],
  ], ['An ad-hoc probe does not promote an asset or alter daily consensus'], undefined, 'Asset state determines what the system is allowed to claim.'),
  block('The command router reinforces that boundary. Mutating actions require an explicit command, while dry-run and status paths are available for inspection. An unknown ticker can be probed in a separate, read-only path without entering the official asset list or the daily consensus. This prevents curiosity from silently becoming production state.'),

  block('What an agent runtime could add—and what it should not own', 'h2'),
  block('The repository includes agent-facing contracts and a read-only research persona, but it does not contain a production OpenClaw integration. The useful comparison is architectural, not a deployment claim.'),
  block('OpenClaw’s current documentation describes a long-lived Gateway that owns message routing and delivery, with agents scoped by their own workspaces, state directories, and session histories. Tools are governed separately from skills, and stronger isolation requires sandboxing because a workspace alone is only a working-directory boundary. Those ideas fit the operating surface around Research OS: route a ticker request, give a research agent narrowly permitted read tools, and return the already validated artifact.'),
  linkedBlock('The conceptual mapping is grounded in OpenClaw’s official ', 'agent runtime documentation', 'https://docs.openclaw.ai/concepts/agent', ', which separates the runtime, workspace, sessions, tools, and skills.'),
  linkedBlock('Its ', 'multi-agent routing documentation', 'https://docs.openclaw.ai/concepts/multi-agent', ' describes deterministic bindings and per-agent workspaces and state.'),
  linkedBlock('The ', 'Gateway architecture documentation', 'https://docs.openclaw.ai/architecture', ' describes the message and control-plane boundary.'),
  callout('Conceptual boundary', 'A future OpenClaw layer could route requests and present reports. It should not recalculate eligibility, rewrite source state, or acquire execution authority. Research OS remains the source of research truth.', 'info'),
  block('That distinction matters because an agent is good at interaction and orchestration; it is not a substitute for evidence contracts. The safest design would let the agent ask for a ticker brief, read the validated result, explain exclusions, and stop. Mutating the asset registry would remain an explicit operator action. Execution would remain isolated and locked.'),

  block('How the project changed while I built it', 'h2'),
  table(['Initial assumption', 'Problem discovered', 'Design change'], [
    ['More analytical tools would create a better answer.', 'Outputs differed in identity, horizon, availability and meaning.', 'Normalize artifacts and model their state before aggregation.'],
    ['Every useful input could participate in consensus.', 'Macro, fundamentals and microstructure are informative without being directional votes.', 'Context-only became an explicit evidence role enforced by validators.'],
    ['A latest artifact was safe to reuse.', 'Fresh data for the wrong ticker is still wrong.', 'Canonical ticker resolution and ticker-specific artifacts became hard gates.'],
    ['Confidence could summarize reliability.', 'A confident forecast can still be stale or unsupported.', 'Freshness and eligibility now precede confidence.'],
    ['A generated narrative could unify the system.', 'Prose can conceal disagreement and missing inputs.', 'Deterministic reports expose vote balance, exclusions and blind spots.'],
    ['Adding a ticker was configuration work.', 'Provider coverage and asset role must be proved.', 'Candidate validation and explicit promotion became a lifecycle.'],
  ]),
  block('The git history reflects that progression. Early work assembled the daily pipeline. Later changes repeatedly tightened ticker canonicalization, ticker-specific artifacts, freshness grace and exclusion behavior, context-only adapters, pre-render orchestration, deterministic validation, and finally cross-section consistency invariants. The architecture became stricter as the number of sources grew.'),

  block('What I deliberately did not automate', 'h2'),
  block('Research OS does not place trades. An execution engine appears in the tool registry only as locked, without a runner or credentials. Read-only context adapters are guarded from mutating methods. The reports end with research-only conclusions and next research steps, not entries, exits, position sizes, or wallet actions.'),
  block('I also did not make every unavailable source look complete. Optional layers can fail independently. The report retains useful evidence from the rest of the system while naming the gap. Required invariants, however, fail closed: wrong-ticker evidence, forbidden context votes, or inconsistent conclusion language are not partial success.'),

  block('What I learned building it', 'h2'),
  block('The most useful market-research system is not the one with the most confident narrator. It is the one that can answer a quieter set of questions: Which asset does this artifact describe? How old is it? What role is this source allowed to play? What failed? What was excluded? Can the conclusion be regenerated from the evidence?'),
  block('I started with models and ended up designing boundaries. Normalization keeps providers from leaking into the rest of the system. Eligibility keeps stale or mismatched evidence out of the decision. Context roles keep interesting observations from becoming accidental votes. Deterministic rendering keeps the report subordinate to state. The execution lock keeps research from becoming action.'),
  block('The final lesson was simple: disagreement was not the bug. Hidden disagreement was. Once the system could preserve disagreement, absence, freshness, and provenance as first-class state, the report stopped pretending to be one model’s answer and became something I could actually interrogate.'),
  callout('Current scope', 'Trading Research Lab is a personal, research-only system for layered market evidence and auditable ticker briefs. The repository supports no claims about returns, predictive accuracy, users, revenue, or live trading performance.', 'warning'),
]

const tradingResearchLabDocument = { _type: 'article', title: 'I stopped treating market research as one model’s answer.', excerpt: 'How I turned a collection of market-data and forecasting tools into a layered evidence system with explicit freshness, eligibility, ticker isolation, and deterministic reports.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Trading Research Lab', 'Research Systems', 'Quantitative Research', 'Time-Series Forecasting', 'Data Pipelines', 'Multi-Agent Systems', 'Python', 'Data Provenance', 'System Reliability'], category: 'Applied AI', featured: false, role: 'System Designer / Research Engineer', projectType: 'Market Research System / Applied AI', system: 'Python research pipeline + deterministic reporting', coreQuestion: 'How can heterogeneous market evidence become an auditable research conclusion without hiding uncertainty?', evidence: 'Source code, tests, architecture contracts, configuration structure, git history, and generated-artifact pipeline', status: 'Research-only system; actively evolving', seoTitle: 'Trading Research Lab: Evidence Before Narrative', seoDescription: 'How I built a layered market-research system with ticker isolation, freshness gates, explicit evidence roles, and deterministic reports.', body: tradingResearchLabBody }

const project9Document = { _type: 'article', title: 'A plate-number edit was actually a distributed transaction.', excerpt: 'A product-systems case study turning Change Plate and Transfer WUZZ into deterministic cross-system state transitions with membership sync, consent, privacy, rollback, recovery and release gates.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Product Architecture', 'Systems Design', 'Distributed Systems', 'Product Management', 'State Machines', 'WUZZ', 'LPR', 'Membership', 'Workflow Design', 'Data Consistency', 'Privacy', 'QA', 'Risk Management', 'Operational Design', 'System Integration'], category: 'Product Systems / Systems Design', featured: false, role: 'Product Manager', projectType: 'Product Architecture / Cross-System Workflow Design', system: 'WUZZ / App + CMS + Cloud + Agent + LPR + Membership', coreQuestion: 'When is a distributed identity or ownership mutation safe enough to expose as success?', evidence: 'Product architecture, risk discovery, cross-system validation, PRD consolidation, and release contract', status: 'Completed Product Definition', seoTitle: 'WUZZ Change Plate & Transfer System Design | Anastasia Aurelia', seoDescription: 'A product architecture case study on safe plate and WUZZ ownership mutations across App, CMS, Cloud, Agent, LPR, membership, operations, and privacy.', body: project9Body }

const dianaNightshiftBody = [
  block('The moment that changed this project wasn’t a clever prompt or a bigger model. It was noticing that every time I asked an agent to confirm its own work was finished, I was asking the one party in the loop with the least standing to say no.'),
  block('This is the story of two systems built on top of that realization: Diana, an operating protocol that gives a coding agent explicit rules to work by instead of an open-ended goal, and Nightshift, a deterministic controller that takes the question of whether a task is actually done away from the model entirely. They solve different halves of the same problem, and the second one only exists because the first one wasn’t enough on its own.'),

  block('Coding agents don’t usually fail because they can’t write code', 'h2'),
  block('Most of the failures I ran into were not about capability. A modern coding agent can write correct code, most of the time, for a well-scoped task. The failures were about scope and self-assessment: a fix that touched a dozen files when three would do, an assumption about how a function worked that turned out to be wrong, a change shipped without the test that would have caught the regression, a session that reported “done” when what actually happened was closer to “I ran out of things to try.”'),
  block('None of that is a knock on the model. It’s a description of what happens when you hand an open-ended goal to something optimized to produce a plausible continuation, then trust its own account of whether that continuation was correct. The model has no privileged access to ground truth about its own work — it has roughly the same evidence a human reviewer would have, minus the habit of actually going to check it.'),

  block('Diana: put discipline around the model', 'h2'),
  block('Diana is a small, portable operating base I install into a project that needs disciplined agentic work. It isn’t a framework, and it deliberately isn’t trying to become one — its own stated philosophy rules out dashboards, agent marketplaces, router services, and generic plugin systems. It’s closer to a checklist with teeth: an operating-rules file, a handful of skills, a few slash commands, and a hook, all aimed at getting a coding agent to behave like a careful engineer instead of an eager one.'),
  diagram('Diana’s core loop', 'pipeline', [
    ['Task'],
    ['Inspect'],
    ['Plan'],
    ['Implement'],
    ['Test'],
    ['Review'],
    ['Ship'],
  ], undefined, undefined, 'Every non-trivial change moves through this shape before it counts as finished.'),
  block('The rules themselves are simple to state and easy to skip if nothing pushes back: read the actual code before proposing a fix, make the smallest change that satisfies the task, run the tests that already exist before claiming something works, review your own diff before calling it done. Diana wraps that into a research-first discipline, a minimal-change bias, and explicit plan/fix/review/ship stages, plus a hook that intercepts a short list of genuinely dangerous shell patterns before they run.'),
  callout('A rule I didn’t expect to outgrow its original problem', 'Diana’s loop registry states this as non-negotiable for any recurring automated task: “A loop that certifies its own work is the single biggest way this goes wrong.” I wrote that about a narrower problem — repeating loops, specifically — and only later noticed it was quietly true of every single-shot task too.', 'info'),

  block('Prompting solved only half of the problem', 'h2'),
  block('Diana genuinely helped. Sessions that followed the operating rules produced smaller, better-reasoned changes than sessions that didn’t. But every one of those rules — a kill switch, a required separation between the step that makes a change and the step that checks it, a budget cap — was enforced by a Claude session reading a markdown file and choosing to comply. There was no code anywhere that parsed a state file and refused to proceed on its own. That’s a reasonable trade for a supervised, interactive session, where I’m reading every message and would notice a skipped step. It stops being a reasonable trade the moment nobody’s watching.'),
  block('The gap wasn’t “the model doesn’t follow instructions well enough.” It followed them fine, most of the time. The gap was structural: the same session doing the work was also the session I was trusting to tell me whether the work was good. Prompt discipline can shape how a model approaches a task. It can’t put a hard floor under whether the model’s own verdict about that task is trustworthy, because the verdict comes out of the same process as the work.'),

  block('I stopped asking the model whether it was done', 'h2'),
  diagram('From operating rules to a deterministic controller', 'timeline', [
    ['Diana v0.1', 'reusable operating base'],
    ['Diana v0.2', 'loop policy, kill switch, budget'],
    ['Nightshift research brief', 'MVP scope decided'],
    ['Deterministic queue + claim + retry + acceptance'],
    ['First supervised Claude run', 'false-success bug found'],
    ['Completion invariant fix', '187/187 tests'],
    ['One-command smoke procedure', 'run against the real VPS'],
  ], undefined, undefined, 'Milestones from this project’s own git history, not a projected roadmap.'),
  block('Nightshift is the answer to that gap, and it’s a narrower thing than the name might suggest. It is not an autonomous agent that works overnight while I sleep — that’s explicitly not what’s built or approved yet, and I’d rather be precise about that than let the name do marketing work it hasn’t earned. What Nightshift actually is: a deterministic runtime that claims one bounded task, launches exactly one fresh model process against it, and decides — independently of anything that process reports about itself — whether the task is actually finished.'),
  block('The reframe that mattered wasn’t “how do I make the model more autonomous.” It was “how much of this decision can I take away from the model without taking away its ability to do the work.” The model still reads the task and writes the change. It just doesn’t get a vote on whether that change counts.'),

  block('Put the state machine outside the model', 'h2'),
  block('Every task Nightshift runs moves through the same shape:'),
  diagram('Bounded task lifecycle', 'pipeline', [
    ['Bounded task'],
    ['Preflight & claim'],
    ['Fresh model process'],
    ['Execute'],
    ['Independent acceptance'],
    ['State transition & evidence'],
    ['Stop'],
  ], undefined, undefined, 'The model owns one box in the middle of this. The controller owns everything on either side of it.'),
  block('Claiming a task is a two-part operation. A short-lived, non-blocking OS-level file lock guarantees that if two claim attempts race, exactly one wins and the other is told immediately, rather than left waiting. The claim itself — which process, at what time — is then written durably into the queue, so ownership and liveness can be checked long after that lock is released. The model process launched against it is always fresh: no resumed conversation, no context carried over from a previous attempt on the same task. It works inside a bounded working directory and exits.'),
  swimlane('Task state machine', 'Simplified for publication — real state names, simplified transitions.', [
    ['Normal path', [
      ['pending', 'Waiting in the queue for a claim.', 'pending', ['claimed']],
      ['claimed', 'Locked by one process; a fresh model session runs inside the bounded working directory.', 'process', ['done']],
      ['done', 'Terminal. Reached only when the executor succeeded and acceptance passed together.', 'success'],
    ]],
    ['Failure & recovery path', [
      ['execution or acceptance fails', 'The process didn’t exit cleanly, timed out, or acceptance rejected the result — or a claim was abandoned and later found stale.', 'decision', ['retry allowed?']],
      ['retry allowed?', 'Checked against that task’s own retry ceiling.', 'decision', ['pending (requeued)', 'failed']],
      ['pending (requeued)', 'Goes back into the queue for another attempt.', 'pending'],
      ['failed', 'Terminal. No further claims or retries.', 'blocked'],
    ]],
  ], 'An abandoned claim is only ever recovered once its process is confirmed dead and it has sat past a staleness threshold — a live or recently-dead claim is left alone.'),
  block('That branch is bounded by a simple rule: a task can be retried only while its attempt count sits under its own configured ceiling.'),
  math('0 \\leq \\text{attempts} \\leq A_{max}', 'attempts = how many times this specific task has already been claimed and attempted. A_max = a retry ceiling set per task, not one global constant. Reached, the task fails permanently instead of retrying again.'),
  block('Execution itself is bounded the same way, but on the clock instead of the counter — enforced externally, at the process level, not as a limit the model observes or agrees to.'),
  math('T_{run} \\leq T_{max}', 'T_run = wall-clock time since the task was claimed. T_max = a per-task execution timeout. On expiry the controller signals the whole process group, not just the top-level process, so anything the model itself spawned is reaped too.'),

  block('What the model owns — and what it doesn’t', 'h2'),
  block('This is the boundary the whole design turns on, and it’s worth stating plainly, since it’s easy to blur once you start describing the pieces one at a time:'),
  table(['Layer', 'Owns'], [
    ['Model', 'Reasoning about the one bounded task it was given; making the change inside its own working directory.'],
    ['Controller', 'Canonical task state; claim ownership; attempt count; retry ceiling; execution timeout; policy checks; the acceptance result; the completion transition; durable evidence.'],
    ['Human', 'Approving a task before it runs; sensitive credentials; production deployment; every push and merge decision; deciding what happens when deterministic progress stalls on its own.'],
  ]),
  block('The Controller row is the one that used to not exist as code at all in Diana — it existed as instructions a model was supposed to follow. Nightshift is what happens when every item on that row moves into a runtime that doesn’t get tired, doesn’t rationalize, and has no stake in looking finished.'),

  block('A task is not complete because the model says “done”', 'h2'),
  block('Completion is not inferred from the model’s final message, and it’s not inferred from a single passing check either. A task reaches its terminal done state only when two independent things agree: the model process itself actually succeeded — completed normally, with a clean exit — and a separate acceptance command, run afterward against the working directory, passes.'),
  math('\\text{DONE} = \\text{executor\\_pass} \\land \\text{acceptance\\_pass} \\land \\text{valid\\_transition}', 'executor_pass = the model process exited cleanly, not merely “exited.” acceptance_pass = an independent check of the resulting files passed. valid_transition = the task was actually claimed by whoever is attempting to complete it, and isn’t already terminal. All three, never any one alone.'),
  block('Acceptance runs against whatever the model actually left on disk, using a check the model didn’t write and, in the version I tested most carefully, had no way to reach or tamper with.'),

  block('The failure that changed the controller', 'h2'),
  block('The clearest reason this separation matters isn’t hypothetical — it’s the first real thing that went wrong when I ran this against a live Claude session instead of a mocked one. That first supervised run’s authentication had actually failed; the process exited with a real error. But the acceptance command I’d written for that first version was a generic “discover and run any tests in this directory” command, and an empty directory with no tests in it still exits 0. Zero tests found reads, by exit code alone, exactly like every test passed. The task was marked done. It hadn’t done anything.'),
  block('I’d built independent acceptance and then, without meaning to, let a single passing signal override everything else — including the fact that the model process itself had failed. The fix was a completion invariant: a passing acceptance result is only ever allowed to drive a done transition when the executor process also genuinely succeeded. A failed, timed-out, or authentication-failed process now forces the task to fail regardless of what acceptance decided on its own. Acceptance still runs either way, for evidence — it just stopped being sufficient by itself. I also replaced the acceptance command with one that requires a minimum number of tests to actually be discovered, not merely attempted, so an empty suite can’t pass by omission again.'),
  callout('What the bug actually revealed', 'I’d built the whole architecture specifically to avoid trusting a single self-reported signal, then done exactly that one layer down — trusting an independent-looking signal without first checking that the thing it was independently verifying had actually run at all.', 'warning'),

  block('What I actually validated', 'h2'),
  table(['Check', 'Result'], [
    ['Full Nightshift test suite', '187 of 187 tests passing'],
    ['Two concurrent claim attempts on the same task', 'Exactly one succeeds; the other is rejected immediately, not left waiting'],
    ['A claim held by a dead process, past the recovery threshold', 'Recoverable — a live or recently-dead claim is left untouched'],
    ['Completion invariant under executor failure + passing acceptance', 'Forces failure, not completion — covered by regression tests added after the incident above'],
    ['One supervised end-to-end run against a real Claude session', 'Exposed the false-success bug described above'],
    ['A corrected, one-command supervised run against the real VPS', 'Caught and fixed a separate environment-isolation bug that only appeared outside the test suite'],
  ]),
  block('That last row matters as much as the numbers above it. A test suite proves the logic is internally consistent. It doesn’t prove the logic survives contact with a real filesystem, a real permission model, and a real authenticated session — and it didn’t, the first two times I actually ran it for real. Both real-world failures were caught by running the real thing and looking at what happened, not because the design had anticipated them in advance.'),

  block('Why Nightshift still stops', 'h2'),
  block('There is no scheduler in this codebase. No cron entry, no systemd timer, no daemon mode, no loop that claims a second task once the first one finishes. The run-one cycle does exactly what its name says: claim at most one task, run it, write a report, stop. That’s a deliberate, current-state limitation, not a detail I’m eliding — unattended scheduling is explicitly not approved yet, pending a check I haven’t done: whether the same authentication that works from an interactive terminal actually survives being launched by a scheduler in a stripped-down environment, hours later, with nobody there to notice if it doesn’t.'),
  block('The same restraint applies to everything downstream of a task finishing. There is no git push in the model’s reachable command set, no deployment path, no package installation it can trigger — each one is either denied outright by the controller’s own policy layer or was never wired in to begin with. Those stay human actions on purpose. A controller that can’t be fooled about whether a task passed is a different property from a controller I’d trust to decide, unsupervised, that a change is safe to ship.'),
  linkedBlock('The name is honest about a direction, not a current claim: the eventual goal is work that can survive beyond an interactive terminal session while staying bounded and inspectable the whole way through. I tested the isolation boundary specifically by checking that a real production tree next to it — ', 'ResearchLens', 'https://anastasiaaurelia.github.io/articles/researchlens-from-search-to-research-workflow', ', another project I actually maintain — was untouched before and after a cycle. Getting further than that is gated on the scheduler-authentication question above, not on anything this article’s numbers already prove.'),

  block('What I learned', 'h2'),
  block('Diana taught me that a coding agent behaves better with explicit operating constraints than with an open-ended goal. Nightshift taught me something I didn’t expect going in: the more interesting question was never how autonomous I could make the model. It was how much authority I could remove from it — over its own state, its own retries, its own verdict — without removing its ability to do useful work at all. Everything that actually got safer in this project came from subtraction, not from making the model smarter.'),
]

const dianaNightshiftDocument = { _type: 'article', title: 'I stopped asking the model whether it was done.', excerpt: 'Diana put an operating discipline around a coding agent. Nightshift moved the verdict on whether a task was done outside the model entirely — and one real failure is why that had to be a controller, not a better prompt.', publishedAt: '2026-08-10T00:00:00.000Z', tags: ['Agent Orchestration', 'Coding Agents', 'Deterministic Systems', 'State Machines', 'Claude Code', 'Python', 'Execution Discipline', 'Verification', 'Systems Design', 'Autonomy Boundaries'], category: 'Agentic Workflows', featured: false, role: 'Systems Designer / Engineer', projectType: 'Agent Control / Execution Discipline System', system: 'Diana operating protocol + Nightshift deterministic controller (Python)', coreQuestion: 'How much authority can be removed from a coding agent without removing its ability to do useful work?', evidence: 'Source code, full test suite (187/187 passing), git history, a research brief, and one supervised real-Claude smoke cycle', status: 'Diana: in active use. Nightshift: MVP implemented and unit-tested; unattended scheduling not yet approved.', seoTitle: 'I Stopped Asking the Model Whether It Was Done | Anastasia Aurelia', seoDescription: 'Why I moved task completion out of the model: Diana’s operating discipline, prompt-level control’s limits, and Nightshift’s deterministic completion invariant.', body: dianaNightshiftBody }

const operationsReportingBody = [
  callout('What I built', 'A multi-site reporting engine that combines system-exported LPR accuracy with operator-reviewed anomaly evidence, then produces one consistent daily operations brief. The calculations are deterministic; interpretation and action remain reviewable human decisions.', 'success'),

  block('The report was not the hard part', 'h2'),
  block('The visible deliverable was a morning note: recent accuracy by gate, longer-window context, an SLO verdict, anomalies, causes, actions and a small statistical check. The harder problem was deciding which parts of that note were facts, which were classifications, and which were judgments.'),
  block('A reporting workflow can look automated while quietly moving ambiguity around. A percentage copied from one sheet, a root cause inferred from another system, and a paragraph rewritten into confident language may read cleanly without being trustworthy. I designed this pipeline around a stricter idea: calculate first, attach evidence second, and only then assemble a narrative.'),
  block('That distinction also sets a boundary for any interpretive layer built on top of this system later, human or automated: it can draft or review a summary, but it does not get to redefine a KPI, invent an anomaly count, or decide whether the service objective was met. The verifiable core stays deterministic regardless of what eventually writes the narrative around it.'),

  block('The manual workflow I was replacing', 'h2'),
  block('Every morning began with two different kinds of evidence. The reporting system exported accuracy rows for several sites and gates. An operator separately reviewed exceptions and recorded what happened, why it happened, what had improved, what action was taken, and whether a known intervention needed before-versus-after analysis.'),
  block('Without a shared assembly step, the work was repetitive and easy to distort. The same proportions had to be copied into several time windows. Gate totals could disagree with the anomaly total. A daily percentage could be described as healthy without its sample count. A configuration change could be celebrated after one good day even though the available evidence was still thin.'),
  table(['Input', 'What it can establish', 'What it cannot establish alone'], [
    ['System accuracy export', 'Location, reporting window, gate-level and end-to-end success proportions.', 'Why a miss happened or what should be done next.'],
    ['Operator anomaly workbook', 'Reviewed classes, counts by gate, causes, improvements, actions and dated changes.', 'Whether the calculated KPI or statistical comparison is correct.'],
    ['Reporting engine', 'Consistent calculations, thresholds, formatting and evidence placement.', 'Whether a field observation is true or an operational action is appropriate.'],
  ], 'The pipeline keeps machine evidence, reviewed context and computed output as distinct responsibilities.'),

  block('The workflow I ended up with', 'h2'),
  diagram('From evidence to an operations brief', 'pipeline', [
    ['Accuracy export', 'Daily and aggregate success proportions'],
    ['Operator review', 'Anomaly counts, causes, actions and dated changes'],
    ['Input normalization', 'Locations, gates, periods and optional sections'],
    ['Deterministic evaluation', 'Pooling, thresholds, uncertainty and change comparison'],
    ['Report assembly', 'One ordered block per monitored site'],
    ['Human review and routing', 'Confirm findings, ownership and next action'],
  ], ['Numbers remain traceable to the export.', 'Narrative fields remain traceable to operator review.', 'Any later interpretive or drafting pass sits after structured evidence, never inside metric computation.'], undefined, 'The implementation accepts a current spreadsheet template and a legacy structured anomaly format, but both converge on the same internal reporting shape.'),
  block('The pipeline processes each configured location independently. It selects the location’s rows, orders daily and aggregate windows, resolves the gate fields expected for that site, and produces a stable report section. A missing location does not corrupt the others: the generator warns and continues with the evidence that is available.'),
  block('The operator workbook is not a free-form scratchpad. It is divided into repeated location and section markers. Anomaly rows carry a class and per-gate counts; text sections carry causes, improvements and actions; change rows carry a gate, a date and a description. That structure is what lets the report generator preserve human context without pretending it calculated that context itself.'),
  articleImage(
    'image-54e042c91d6f19a8e86905dbac0439e92173aa2a-622x1082-png',
    'Redacted LPR accuracy report with an executive summary, multi-window location status, recent daily results, and gate-level accuracy tables.',
    'Redacted operations-report output showing multi-window location status and gate-level accuracy breakdowns assembled into the daily brief.',
    'normal',
    'Internal operations report (identifiers redacted)',
  ),

  block('Decision 1: preserve the denominator', 'h2'),
  block('The source export contains both a percentage and its success proportion. I kept both. “98.7%” sounds precise, but 74 successes out of 75 observations and 7,400 out of 7,500 do not support the same confidence. The daily report therefore presents the percentage next to the underlying success and total counts.'),
  block('The same rule matters when combining days. The engine does not average daily percentages, because that would give a quiet day the same weight as a busy day. It pools the successful observations and total observations first, then calculates one baseline accuracy.'),
  math('\\hat{p}=\\frac{\\sum_{d=1}^{D} s_d}{\\sum_{d=1}^{D} n_d}', 'For each included day d, s_d is the number of successful observations and n_d is the number observed. The pooled estimate p-hat is computed from combined counts, not from the arithmetic mean of daily percentages.'),
  block('For the short baseline, the implementation uses up to the three most recent daily records available for a gate. It also calculates a binomial standard error and a 95% margin-of-error approximation. These values are context, not a claim that three days prove a permanent improvement.'),
  math('SE(\\hat{p})=\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}},\\qquad MoE_{95}\\approx1.96\\,SE(\\hat{p})', 'p-hat is pooled accuracy and n is the pooled number of observations. The margin is an approximate uncertainty indicator used to keep small samples visible.'),

  block('Decision 2: make evaluation a rubric, not prose', 'h2'),
  block('I encoded two related but different evaluations. The first is an operational color band used for scanning: green at or above 98%, yellow from 95% to below 98%, and red below 95%. The second compares the most recent end-to-end result with a 99.9% service-level objective and reports the numeric gap.'),
  table(['Evaluation layer', 'Rule in the verified implementation', 'Purpose'], [
    ['Daily scan band', 'Green ≥ 98%; yellow ≥ 95% and < 98%; red < 95%.', 'Make a long multi-gate note scannable.'],
    ['SLO verdict', 'Most recent end-to-end accuracy compared with a 99.9% target.', 'State whether the current result meets the operating objective and show the gap.'],
    ['Time-window context', 'Recent daily rows alongside 7-day, previous-week and 30-day aggregates.', 'Separate a single-day movement from a persistent pattern.'],
    ['Change evaluation', 'Up to three daily rows before and after a dated intervention.', 'Create a bounded first look at direction, sample size and uncertainty.'],
  ]),
  block('This is one of the most important design choices in the system. A language model can rephrase “below target,” but it should not decide what the target was after reading the result. The threshold, comparison window and arithmetic live in code so the same evidence receives the same verdict every time.'),

  block('Decision 3: treat anomalies as reviewed evidence', 'h2'),
  block('The anomaly side of the workflow covers failure modes that a top-line accuracy number cannot explain: registration mismatch, OCR misread, trigger ordering, missing device or agent data, late inserts and other operational exceptions. Counts are entered per gate, summed into each class, and then rolled into a location total.'),
  block('The important separation is between classification and aggregation. A person investigates enough evidence to choose the anomaly class; the workbook and generator handle the repeated arithmetic and presentation. Unknown or ambiguous observations are not forced into a confident machine-generated cause.'),
  block('The report then places four forms of context next to the numbers: why the issue happened, what improved, what action was taken, and what changed. These fields answer different questions. A cause is not an action. An action is not evidence that the result improved. Keeping them separate makes the final brief useful for follow-up instead of just readable.'),
  callout('Human-in-the-loop boundary', 'The pipeline automates normalization, arithmetic, thresholds, ordering and report formatting. A human still validates anomaly classes, writes causal context, confirms actions, and decides whether the available evidence is strong enough to route an intervention.', 'info'),

  block('Decision 4: evaluate changes without pretending they are experiments', 'h2'),
  block('When an operator records a dated gate change, the report switches from the ordinary pooled baseline to a compact change analysis for that gate. It separates records on either side of the date, pools their counts, displays sample sizes and uncertainty, and reports the direction of the difference.'),
  block('That is useful operational evidence, but it is not causal proof. The windows are short. Traffic mix, weather, camera conditions and unrelated configuration changes may differ across days. The report therefore calls the result a comparison, not an A/B test, and exposes enough denominator information for a reviewer to decide whether continued monitoring is required.'),
  math('\\Delta=100\\,(\\hat{p}_{after}-\\hat{p}_{before})\\ \\text{percentage points}', 'p-hat-after and p-hat-before are pooled success proportions from the available post-change and pre-change daily rows. The implementation reports direction and magnitude without assigning causality.'),

  block('What stays deterministic — and what stays a human call', 'h2'),
  table(['Layer', 'Deterministic or judgment-based?', 'Why'], [
    ['Parsing and normalization', 'Deterministic', 'A gate, date, count or reporting window should not change between runs.'],
    ['Metric pooling and uncertainty', 'Deterministic', 'The same observations must produce the same result.'],
    ['Threshold and SLO evaluation', 'Deterministic', 'Operational policy belongs in an explicit rule.'],
    ['Anomaly classification', 'Human-reviewed judgment', 'The evidence may span images, device state and field context.'],
    ['Cause and action narrative', 'Human-owned', 'Language can be compressed, but responsibility and factual confirmation cannot be delegated.'],
    ['Escalation and ownership', 'Human operational decision', 'A generated sentence cannot assign accountability or approve a production change.'],
  ]),
  block('This boundary is less glamorous than an end-to-end autonomous report generator, and much safer. Structured evidence is assembled before any narrative pass, so any later summary — written by a person, a template or eventually a model — can be checked against the counts, windows and reviewed fields already present. The deterministic report does not depend on that later step at all.'),
  callout('Evidence limitation', 'The preserved project snapshot verifies the deterministic Python-and-spreadsheet reporting engine covered in this case study. It does not contain the MCP, n8n or prompt workflows referenced in the portfolio’s short About summary — a broader, separately-documented part of this role — so this article makes no claim about their topology, prompts or execution behavior.', 'warning'),

  block('Failure modes I designed around', 'h2'),
  table(['Failure mode', 'Current behavior or design response', 'Residual risk'], [
    ['A configured location is absent from the export', 'Warn and continue with other locations.', 'The warning still has to be noticed before distribution.'],
    ['A period row is missing', 'Omit that period rather than fabricate a value.', 'The reviewer must decide whether the report is complete enough to send.'],
    ['A success proportion is malformed or empty', 'Exclude it from pooled calculations.', 'Silent exclusion can reduce the effective sample; explicit validation would improve this.'],
    ['An anomaly count is non-numeric', 'Ignore the invalid cell during parsing.', 'The input workbook should surface this more aggressively.'],
    ['A change date cannot be parsed', 'Skip the change comparison.', 'The report needs a stronger visible warning for rejected change input.'],
    ['A change is too recent', 'Show that post-change evidence is not yet available.', 'Operations must keep monitoring instead of treating absence as success.'],
    ['No anomaly workbook is supplied', 'Generate the metric portion without narrative context.', 'A numerically correct report can still be operationally incomplete.'],
  ]),
  block('The failure table also shows where I would take the system next. The generator is tolerant, which is useful for a morning workflow, but some invalid inputs are skipped rather than promoted into a formal validation report. A productionized version should emit a machine-readable run summary, distinguish warnings from blockers, and make completeness visible before a report can be routed.'),

  block('What the automation actually changed', 'h2'),
  block('The pipeline did not remove the operator. It removed the parts of the operator’s work that should never have depended on memory: finding the right fields for each gate, ordering reporting windows, recomputing totals, applying the same bands, preserving denominators, and laying out the same sections every morning.'),
  block('That changed the review question. Instead of asking “Did I copy every number and format every section correctly?”, the operator can ask “Is this anomaly classification defensible? Does this action have an owner? Is this movement large enough, and supported by enough observations, to investigate?” Automation made judgment more visible by taking clerical consistency out of its way.'),

  block('What I learned', 'h2'),
  block('I started with a report-generation problem and ended up designing an evidence boundary. The reliable part of the system is not its prose. It is the contract between exported measurements, reviewed operational context and explicit evaluation rules.'),
  block('The most useful lesson was that any interpretive layer becomes safer once the workflow can survive without it. Once the counts, thresholds, uncertainty and change comparisons are deterministic, a reviewer — or eventually a model — can help communicate the result. Neither one gets to quietly become the source of truth. In operational reporting, that separation is what turns automation from a faster way to write into a better way to decide.'),
]

const operationsReportingDocument = {
  _type: 'article',
  title: 'The reliable part of a report was never the prose.',
  excerpt: 'How I separated deterministic LPR metrics, reviewed anomaly evidence, and statistical change checks into one auditable, judgment-preserving daily operations workflow.',
  publishedAt: '2026-08-10T00:00:00.000Z',
  tags: ['LPR', 'Computer Vision Operations', 'Reporting Automation', 'Data Quality', 'Human in the Loop', 'Python', 'Operational Analytics', 'Measurement Systems'],
  category: 'Data Quality / Measurement Systems',
  featured: false,
  role: 'Product Operations / Systems Engineer',
  projectType: 'Operational Reporting and Decision Support',
  system: 'Python reporting engine + structured spreadsheet review workflow',
  coreQuestion: 'How do you automate an operations report without automating away the evidence and judgment behind it?',
  evidence: 'Executable reporting source, input templates, legacy structured input, sample system export and generated-output logic',
  status: 'Operational workflow implemented; deterministic reporting core verified from the preserved project snapshot',
  seoTitle: 'LPR/WUZZ Operations Reporting & Anomaly Analysis | Anastasia Aurelia',
  seoDescription: 'A case study in separating deterministic LPR metrics, human-reviewed anomalies, and statistical change analysis into one auditable report.',
  body: operationsReportingBody,
}

const requestedSlug = process.argv.find((argument) => argument === 'lpr-timing-analysis' || argument === 'sdcard-agent-cross-validation' || argument === 'multi-site-lpr-performance-diagnostics' || argument === 'unified-lpr-source-of-truth' || argument === 'lpr-accuracy-stability-research' || argument === 'wuzzlpr-performance-intelligence' || argument === 'motorcycle-cv-training' || argument === 'wuzz-change-plate-transfer-system-design' || argument === 'lpr-camera-reliability-integration' || argument === 'researchlens-from-search-to-research-workflow' || argument === 'trading-research-lab-evidence-before-narrative' || argument === 'diana-nightshift-deterministic-control' || argument === 'lpr-wuzz-operations-reporting-pipeline') ?? 'lpr-timing-analysis'
const slug = requestedSlug
const documentId = `article-${slug}`
const draftId = `drafts.${documentId}`
const selected = slug === 'lpr-wuzz-operations-reporting-pipeline' ? operationsReportingDocument : slug === 'diana-nightshift-deterministic-control' ? dianaNightshiftDocument : slug === 'trading-research-lab-evidence-before-narrative' ? tradingResearchLabDocument : slug === 'researchlens-from-search-to-research-workflow' ? researchLensDocument : slug === 'lpr-camera-reliability-integration' ? project10Document : slug === 'wuzz-change-plate-transfer-system-design' ? project9Document : slug === 'motorcycle-cv-training' ? project8Document : slug === 'wuzzlpr-performance-intelligence' ? project4Document : slug === 'lpr-accuracy-stability-research' ? project6Document : slug === 'unified-lpr-source-of-truth' ? project57Document : slug === 'multi-site-lpr-performance-diagnostics' ? project3Document : slug === 'sdcard-agent-cross-validation' ? project2Document : lprDocument
const revisionMode = process.argv.includes('--revision')

async function main() {
  const conflict = await client.fetch(`{ "draft": *[_id == $draft][0]._id, "published": *[_id == $published][0] }`, { draft: draftId, published: documentId }) as { draft?: string; published?: Record<string, unknown> }
  const other = await client.fetch(`*[_type == "article" && slug.current == $slug && !(_id in [$draft, $published])][0]._id`, { slug, draft: draftId, published: documentId }) as string | null
  if (other) throw new Error(`Slug conflict: ${slug} is already used by ${other}. No changes made.`)
  if (conflict.published && !revisionMode) throw new Error(`Published article ${documentId} already exists. Re-run with --revision to create its drafts.* sibling; no changes made.`)
  if (revisionMode && !conflict.published) throw new Error(`Cannot create revision: published article ${documentId} does not exist. No changes made.`)
  const publishedBase = conflict.published ? Object.fromEntries(Object.entries(conflict.published).filter(([field]) => !['_rev', '_createdAt', '_updatedAt'].includes(field))) : {}
  const document = { ...publishedBase, ...selected, _id: draftId, slug: { _type: 'slug', current: slug } }
  const previewDirectory = new URL('../.sanity-drafts/', import.meta.url)
  mkdirSync(previewDirectory, { recursive: true })
  writeFileSync(new URL(`${slug}.json`, previewDirectory), JSON.stringify({ ...document, _id: draftId, slug }, null, 2))
  console.log(`Prepared local revision preview for ${draftId}.`)
  if (conflict.draft) { await client.createOrReplace(document as never); console.log(`Updated existing draft ${draftId}.`) }
  else { await client.create(document as never); console.log(`Created draft ${draftId}.`) }
  if (slug === 'trading-research-lab-evidence-before-narrative') {
    const projectId = '927618e1-3eeb-40f2-b13f-4ddb510ec4e9'
    const projectDraftId = `drafts.${projectId}`
    const projectState = await client.fetch(
      `{ "draft": *[_id == $draft][0]{_id,_rev,_type}, "published": *[_id == $published][0]._id }`,
      { draft: projectDraftId, published: projectId },
    ) as { draft?: { _id: string; _rev: string; _type: string }; published?: string }
    if (!projectState.draft || projectState.draft._type !== 'project') throw new Error(`Expected existing Trading Research Lab project draft ${projectDraftId}; no project update was made.`)
    if (projectState.published) throw new Error(`Trading Research Lab already has a published sibling ${projectId}; refusing to change its publication state.`)
    await client
      .patch(projectDraftId)
      .ifRevisionId(projectState.draft._rev)
      .set({
        title: 'Trading Research Lab',
        slug: { _type: 'slug', current: 'trading-research-lab' },
        shortSummary: 'A research-only system that turns heterogeneous market data, forecasts, and context into ticker-isolated, freshness-aware, auditable research briefs.',
        projectType: 'Research Intelligence',
        tags: ['Quantitative Research', 'Research Systems', 'Time-Series Forecasting', 'Data Pipelines'],
        featured: true,
        displayOrder: 3,
        githubUrl: 'https://github.com/AnastasiaAurelia/trading-research-lab',
        caseStudyArticle: { _type: 'reference', _ref: documentId, _weak: true },
        seoTitle: 'Trading Research Lab | Anastasia Aurelia',
        seoDescription: 'A layered market-research system with ticker isolation, freshness gates, explicit evidence roles, and deterministic reports.',
      })
      .commit()
    console.log(`Updated existing project draft ${projectDraftId}; featured=true, displayOrder=3. No project was published.`)
  }
  if (slug === 'lpr-wuzz-operations-reporting-pipeline') {
    const publishedSettings = await client.fetch(
      `*[_id == "siteSettings"][0]`,
    ) as Record<string, unknown> | null
    const existingSettingsDraft = await client.fetch(
      `*[_id == "drafts.siteSettings"][0]`,
    ) as Record<string, unknown> | null
    if (!publishedSettings && !existingSettingsDraft) throw new Error('No siteSettings document exists; About link was not staged.')
    if (!existingSettingsDraft && publishedSettings) {
      const base = Object.fromEntries(
        Object.entries(publishedSettings).filter(([field]) => !['_rev', '_createdAt', '_updatedAt'].includes(field)),
      )
      await client.create({ ...base, _id: 'drafts.siteSettings' } as never)
    }
    const settingsDraft = await client.fetch(
      `*[_id == "drafts.siteSettings"][0]{_rev,"item":technicalWork[cvTitle == $oldTitle || cvTitle == $newTitle][0]{_key,cvTitle,cvSummary,sortOrder}}`,
      { oldTitle: 'AI-Assisted LPR/WUZZ Operations Reporting Pipeline', newTitle: 'LPR/WUZZ Operations Reporting Pipeline' },
    ) as { _rev?: string; item?: { _key?: string } } | null
    if (!settingsDraft?._rev || !settingsDraft.item?._key) throw new Error('The existing About technical-work item was not found; no About fields were changed.')
    await client
      .patch('drafts.siteSettings')
      .ifRevisionId(settingsDraft._rev)
      .set({
        [`technicalWork[_key=="${settingsDraft.item._key}"].articleRef`]: { _type: 'reference', _ref: documentId, _weak: true },
        [`technicalWork[_key=="${settingsDraft.item._key}"].cvTitle`]: 'LPR/WUZZ Operations Reporting Pipeline',
      })
      .commit()
    console.log('Linked the existing About technical-work item in drafts.siteSettings and dropped the unevidenced "AI-Assisted" prefix from its label. Summary, order and published sibling were untouched.')
  }
  console.log(`Slug: ${slug}. Publication state: DRAFT. No published document was changed.`)
  console.log(`Local website preview: /articles/${slug}?preview=local (development server only).`)
}
main().catch((error: unknown) => { console.error(`Import failed: ${error instanceof Error ? error.message : error}`); process.exit(1) })
