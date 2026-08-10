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

const requestedSlug = process.argv.find((argument) => argument === 'lpr-timing-analysis' || argument === 'sdcard-agent-cross-validation' || argument === 'multi-site-lpr-performance-diagnostics' || argument === 'unified-lpr-source-of-truth' || argument === 'lpr-accuracy-stability-research' || argument === 'wuzzlpr-performance-intelligence' || argument === 'motorcycle-cv-training') ?? 'lpr-timing-analysis'
const slug = requestedSlug
const documentId = `article-${slug}`
const draftId = `drafts.${documentId}`
const selected = slug === 'motorcycle-cv-training' ? project8Document : slug === 'wuzzlpr-performance-intelligence' ? project4Document : slug === 'lpr-accuracy-stability-research' ? project6Document : slug === 'unified-lpr-source-of-truth' ? project57Document : slug === 'multi-site-lpr-performance-diagnostics' ? project3Document : slug === 'sdcard-agent-cross-validation' ? project2Document : lprDocument
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
