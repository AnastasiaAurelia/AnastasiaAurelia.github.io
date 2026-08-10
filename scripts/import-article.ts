/** Import a portfolio article as an idempotent Sanity draft.
 * Run: node --env-file=scripts/.env.migration scripts/import-article.ts <slug>
 */
import { createClient } from '@sanity/client'
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const studioRequire = createRequire(new URL('../studio/package.json', import.meta.url))
const client = token && projectId && dataset
  ? createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })
  : studioRequire('sanity/cli').getCliClient({ apiVersion: '2025-01-01' })
let sequence = 0
const key = () => `lpr-${++sequence}`
const block = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal', listItem?: 'bullet' | 'number') => ({ _type: 'block', _key: key(), style, ...(listItem ? { listItem, level: 1 } : {}), markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const bullets = (...items: string[]) => items.map((item) => block(item, 'normal', 'bullet'))
const table = (headers: string[], rows: string[][], caption?: string) => ({ _type: 'dataTable', _key: key(), headers, rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })), ...(caption ? { caption } : {}) })
const callout = (title: string, body: string, tone: 'info' | 'warning' | 'success' = 'info') => ({ _type: 'callout', _key: key(), title, body, tone })
const math = (latex: string, databaseDefinition: string) => ({ _type: 'math', _key: key(), latex, display: true, databaseDefinition })
const diagram = (title: string, variant: 'pipeline' | 'timeline', steps: Array<[string, string?]>, relationships?: string[], warning?: string, caption?: string) => ({ _type: 'processDiagram', _key: key(), title, variant, steps: steps.map(([label, field]) => ({ _type: 'processStep', _key: key(), label, ...(field ? { field } : {}) })), relationships, warning, caption })

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

const requestedSlug = process.argv.find((argument) => argument === 'lpr-timing-analysis' || argument === 'sdcard-agent-cross-validation' || argument === 'multi-site-lpr-performance-diagnostics') ?? 'lpr-timing-analysis'
const slug = requestedSlug
const documentId = `article-${slug}`
const draftId = `drafts.${documentId}`
const selected = slug === 'multi-site-lpr-performance-diagnostics' ? project3Document : slug === 'sdcard-agent-cross-validation' ? project2Document : lprDocument
const document = { ...selected, _id: draftId, slug: { _type: 'slug', current: slug } }

async function main() {
  const conflict = await client.fetch(`{ "draft": *[_id == $draft][0]._id, "published": *[_id == $published][0]._id }`, { draft: draftId, published: documentId }) as { draft?: string; published?: string }
  const other = await client.fetch(`*[_type == "article" && slug.current == $slug && !(_id in [$draft, $published])][0]._id`, { slug, draft: draftId, published: documentId }) as string | null
  if (other) throw new Error(`Slug conflict: ${slug} is already used by ${other}. No changes made.`)
  if (conflict.published) throw new Error(`Published article ${documentId} already exists. Refusing to overwrite it; no changes made.`)
  if (conflict.draft) { await client.createOrReplace(document as never); console.log(`Updated existing draft ${draftId}.`) }
  else { await client.create(document as never); console.log(`Created draft ${draftId}.`) }
  const previewDirectory = new URL('../.sanity-drafts/', import.meta.url)
  mkdirSync(previewDirectory, { recursive: true })
  writeFileSync(new URL(`${slug}.json`, previewDirectory), JSON.stringify({ ...document, _id: draftId, slug }, null, 2))
  console.log(`Slug: ${slug}. Publication state: DRAFT. No published document was changed.`)
  console.log(`Local website preview: /articles/${slug}?preview=local (development server only).`)
}
main().catch((error: unknown) => { console.error(`Import failed: ${error instanceof Error ? error.message : error}`); process.exit(1) })
