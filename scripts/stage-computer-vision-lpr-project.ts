/** Stage the existing Computer Vision & LPR project as an unpublished draft revision.
 * Run with:
 *   node --env-file=studio/.env --env-file=scripts/.env.migration scripts/stage-computer-vision-lpr-project.ts
 */
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { basename, resolve } from 'node:path'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_WRITE_TOKEN
if (!projectId || !dataset || !token) throw new Error('Sanity project, dataset, and write token are required.')

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false, perspective: 'raw' })
const publishedId = 'project-computer-vision-lpr'
const draftId = `drafts.${publishedId}`
let sequence = 0
const key = () => `cv-lpr-${++sequence}`
const block = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal', listItem?: 'bullet' | 'number') => ({ _type: 'block', _key: key(), style, ...(listItem ? { listItem, level: 1 } : {}), markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const bullets = (...items: string[]) => items.map((item) => block(item, 'normal', 'bullet'))
const section = (title: string, identifier: string) => ({ _type: 'projectSection', _key: key(), title, identifier })
const metric = (label: string, value: string, context: string) => ({ _type: 'metricHighlight', _key: key(), label, value, context })
const callout = (title: string, body: string, tone: 'info' | 'warning' | 'success' = 'info') => ({ _type: 'callout', _key: key(), title, body, tone })
const decision = (decisionText: string, reasoning: string, consequence?: string) => ({ _type: 'decisionCallout', _key: key(), decision: decisionText, reasoning, ...(consequence ? { consequence } : {}) })
const math = (latex: string, databaseDefinition: string) => ({ _type: 'math', _key: key(), latex, display: true, databaseDefinition })
const table = (headers: string[], rows: string[][], caption?: string) => ({ _type: 'dataTable', _key: key(), headers, rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })), ...(caption ? { caption } : {}) })
const diagram = (title: string, variant: 'pipeline' | 'timeline', steps: Array<[string, string?]>, relationships?: string[], warning?: string, caption?: string) => ({ _type: 'processDiagram', _key: key(), title, variant, steps: steps.map(([label, field]) => ({ _type: 'processStep', _key: key(), label, ...(field ? { field } : {}) })), ...(relationships ? { relationships } : {}), ...(warning ? { warning } : {}), ...(caption ? { caption } : {}) })
const imageDiagram = (assetRef: string, alt: string, caption: string, explanation?: string) => ({ _type: 'architectureDiagram', _key: key(), image: { _type: 'image', asset: { _type: 'reference', _ref: assetRef } }, alt, caption, ...(explanation ? { explanation } : {}) })

const assetSources = {
  planes: 'public/assets/cv-lpr/two-plane-reliability-system.png',
  sites: 'public/assets/cv-lpr/five-site-30d-7d.png',
  geometry: 'public/assets/cv-lpr/field-geometry-source-crop.png',
  resolution: 'public/assets/cv-lpr/resolution-evidence.png',
  biasVariance: 'public/assets/cv-lpr/bias-variance.png',
} as const

async function uploadOrReuse(path: string) {
  const absolutePath = resolve(path)
  const filename = basename(path)
  const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename })
  if (existing) return existing
  const asset = await client.assets.upload('image', createReadStream(absolutePath), { filename })
  return asset._id
}

const refs = Object.fromEntries(await Promise.all(Object.entries(assetSources).map(async ([name, path]) => [name, await uploadOrReuse(path)]))) as Record<keyof typeof assetSources, string>

const content = [
  section('Operating computer vision outside the demo', 'overview'),
  block('I worked across the management layer and the technical layer of a real-world license-plate-recognition product. The management problem was deciding where to act. The technical problem was locating the exact layer where a recognition event stopped surviving the transaction.'),
  block('That distinction changed the work. A low site percentage could point to OCR, but it could also come from a trigger, camera geometry, transport, cache timing, an Agent handoff, a gate bottleneck, a denominator mismatch, or ordinary lane behavior. The camera was one component in a longer reliability chain.'),
  metric('Sites in the diagnostic program', '5', 'Project 3 historical cross-site analysis: CFX, Matraman, JRP, Menteng Central, and Gading Riverview.'),
  metric('Recurring anomaly classes', '17', 'Verified taxonomy spanning operations, environment, camera/OCR, triggers, data timing, and transaction state.'),
  metric('Motorcycle samples organized', '1,000', 'Documented field-collection and handoff program; not a claim of production model uplift.'),
  metric('Transaction lens', 'Full cycle', 'Entry and exit are paired at ticket level; a healthy camera or gate alone does not guarantee journey success.'),

  section('The system I was actually operating', 'system'),
  imageDiagram(refs.planes, 'Two connected planes: a management and product control plane above a technical LPR reliability chain from vehicle to transaction.', 'The umbrella architecture: management sees the outcome; engineering needs the layer.', 'The control plane converts an SLO into measurement, incident ownership, intervention and validation. The technical plane traces the recognition event from the lane through full-cycle success and back into the evidence loop.'),
  block('The outside plane starts with the business outcome: did the intended journey work? It defines the measurement contract, monitors sites and gates, classifies incidents, assigns owners and validates the result after action.'),
  block('The inside plane follows the event itself: vehicle path, trigger, geometry, capture, OCR, local evidence, network transport, Agent state, check-in, check-out and the final paired transaction. The two planes meet when a KPI deviation becomes a traceable failure layer.'),
  callout('Core operating principle', 'Management sees where the outcome moved. Engineering needs enough evidence to say which layer moved it.', 'success'),

  section('The program in three loops', 'program-loops'),
  diagram('Measure, diagnose, improve', 'pipeline', [
    ['Measure', 'metric contract · 30D / 7D / daily · full-cycle KPI'],
    ['Diagnose', 'reconciliation · timestamps · taxonomy · images · confidence'],
    ['Improve', 'owner routing · infrastructure · camera · SOP · training evidence'],
    ['Measure again', 'validate the intervention on the same contract'],
  ], ['The loops share one evidence trail', 'A fix is incomplete until the metric is recalculated'], undefined, 'The source projects become one operating cycle rather than a list of separate deliverables.'),
  block('Measure established the population and the official result. Diagnose moved from site to gate to transaction to image. Improve routed the intervention to the owner who could change that layer, then returned the same journey to measurement.'),

  section('Management view — where should we act?', 'management-view'),
  block('The 30-day view represented the sustained operating baseline; the 7-day view showed recent movement. The chart below is a historical diagnostic snapshot, not a current production dashboard.'),
  imageDiagram(refs.sites, 'Grouped bars comparing historical 30-day and 7-day Entry-Exit performance across five sites.', 'Historical five-site Entry-Exit snapshot: 30D baseline versus 7D movement.', 'CFX: 87.25% / 79.06%; Matraman: 93.10% / 97.02%; JRP: 97.32% / 95.72%; Menteng Central: 96.51% / 96.94%; Gading Riverview: 89.51% / 87.62%.'),
  block('The chart made prioritization possible, but it did not diagnose the failure. CFX deteriorated materially in the recent window. Matraman improved. JRP remained the strongest baseline while still exposing one unstable exit. Those signals told management where to investigate next.'),
  decision('Route the incident by failure domain, not by the phrase “LPR accuracy issue.”', 'The same top-line symptom can belong to data/software, physical infrastructure, operations, or camera/OCR. Ownership begins only after the evidence identifies the layer.', 'This requires more diagnostic work before escalation, but it avoids sending every problem to the CV vendor.'),
  table(['Observed evidence', 'Primary investigation'], [
    ['SD-card capture exists; Agent record missing', 'Synchronization, transport, insert timing, or TTL state'],
    ['No usable camera image', 'Trigger, camera availability, geometry, exposure, or obstruction'],
    ['Image is clear; plate text is wrong', 'OCR / model error archive and vendor or retraining review'],
    ['Site average falls; one gate collapses', 'Repair the limiting gate rather than tuning the whole site'],
    ['Percentage is high but sample is weak', 'Collect evidence before escalating a structural incident'],
  ], '“LPR accuracy” is an observation. The evidence determines the owner.'),

  section('Technical view — where can the journey break?', 'technical-view'),
  diagram('The transaction reliability chain', 'pipeline', [
    ['Vehicle', 'path and plate visibility'], ['Trigger', 'loop / video timing'], ['Capture', 'geometry and exposure'], ['OCR', 'detection and recognition'], ['Transport', 'HTTP / SDK / replay'], ['Agent / TTL', 'state and timing'], ['Check-in'], ['Check-out'], ['Full-cycle success'],
  ], ['SD-card evidence preserves camera-side truth', 'Failed events feed monitoring and training evidence'], undefined, 'A correct OCR output is necessary, not sufficient.'),
  block('One incident made the boundary concrete. The loop event and OCR capture occurred normally. The plate remained cached for 30 seconds. The user tapped after the cache expired, so the downstream transaction received a null plate even though recognition had succeeded.'),
  diagram('OCR succeeded; the transaction failed later', 'timeline', [
    ['00:29:59', 'loop detects vehicle'], ['00:30:00', 'OCR captures plate'], ['00:30:30', 'TTL expires'], ['00:30:42', 'user tap creates transaction'], ['Result', 'Agent receives plate = NULL'],
  ], ['Failure layer: cache / transaction timing, not OCR'], undefined, 'Source timestamps retained; the plate identifier is intentionally omitted.'),
  callout('Incident lesson', 'Improving OCR would not have fixed this event. The next questions belonged to TTL policy, user timing, queue conditions and Agent state.', 'warning'),

  section('The number had to be trustworthy first', 'metric-contract'),
  block('Different operational and reporting systems could each produce internally valid accuracy numbers while describing different populations. The disagreement came from time windows, joins, exclusions, event semantics and whether the unit was a gate event or a paired journey.'),
  math('\\text{Effective Accuracy}=\\frac{\\text{successful eligible transactions}}{\\text{eligible transactions}-\\text{unique excluded anomaly transactions}}', 'The exclusion is transaction-level and de-duplicated. Raw and effective accuracy answer different questions; neither replaces the other.'),
  table(['Contract choice', 'Why it matters'], [
    ['One official denominator', 'Prevents two teams from reporting different populations under the same KPI name'],
    ['Event-side timestamps', 'Keeps the date attached to the event being measured'],
    ['Distinct ticket grain', 'Represents the user journey rather than duplicated log rows'],
    ['Entry and exit paired by ticket', 'Measures full-cycle success instead of averaging two gates'],
    ['Diagnostic views remain separate', 'Gate, image, Agent and vendor evidence explain the official KPI without replacing it'],
  ], 'One official denominator, many diagnostic lenses.'),
  decision('Align the sources before improving the dashboard.', 'A cleaner visualization cannot repair inconsistent joins or denominator rules. The metric contract had to come before automation.', 'The contract makes changes more deliberate because every exclusion and population rule becomes reviewable.'),

  section('Cross-system reconciliation', 'reconciliation'),
  block('A row marked “not captured” in one system was not automatically a missing event. I compared camera-side and Agent-side evidence using a candidate event identity: the same plate within a reasonable time window, searched in both directions.'),
  diagram('From apparent misses to confirmed Agent losses', 'pipeline', [
    ['18', 'initial suspected missing Agent events'], ['10', 'recovered through cross-system reconciliation'], ['8', 'confirmed Loss_Agent cases'],
  ], ['Apparent miss rate: 18 / 72 = 25.0%', 'Confirmed loss rate: 8 / 72 = 11.1%', 'Reconciled traceability: 64 / 72 = 88.9%'], undefined, 'The purpose was to remove false escalations before engineering began debugging—not to make the metric look better.'),
  block('The project rule used a ±10-minute tolerance. The public case study keeps the matching principle and the audited counts while withholding the spreadsheet implementation and all row-level identifiers.'),
  callout('What changed', 'The investigation queue narrowed from 18 apparent misses to 8 defensible Agent losses. Ten events had supporting evidence elsewhere in the logs.', 'success'),

  section('Field failure taxonomy', 'taxonomy'),
  block('Seventeen recurring cases were normalized into a finite taxonomy. The public view groups them into four domains so the failure language stays readable while ownership remains explicit.'),
  diagram('Four failure domains', 'pipeline', [
    ['Camera / model', 'OCR misread · recognition-zone miss · lighting / image conditions'],
    ['Infrastructure', 'loop sensor · cable / trigger · barrier obstruction'],
    ['System / data', 'TTL · late insert · Agent / SD-card mismatch · event timing'],
    ['Operations / environment', 'vehicle path · motorcycle in car lane · damaged plate · manual handling'],
  ], ['17 verified cases sit inside these four public-facing groups'], undefined, 'Representative groupings preserve the source taxonomy without turning the page into a 17-row wall.'),
  block('I intentionally excluded the original case screenshots from this section. They contain license plates, parking-slip identifiers, timestamps, private links or operator interfaces. The taxonomy and ownership logic carry the engineering value without publishing that operational data.'),

  section('Statistics — when is an anomaly real?', 'statistics'),
  block('An alarming percentage is not enough. The alert also needs enough observations to estimate the rate with the requested precision.'),
  math('MOE=1.96\\sqrt{\\frac{p(1-p)}{n}}', 'p = observed anomaly rate; n = transactions in the bucket; MOE = normal-approximation 95% margin of error.'),
  diagram('The confidence-width audit', 'pipeline', [
    ['29', 'candidate hourly spikes'], ['CI precision gate', '95% width must satisfy the intended 15 percentage-point rule'], ['0', 'confirmed under that precision rule'],
  ], ['Observed bucket sizes ranged from 20 to 52'], 'This does not mean there were no operational problems.', 'The hourly buckets were underpowered for the requested confidence width. The fix was more evidence or a wider aggregation window—not a weaker rule.'),
  block('The workbook stored CI width as a proportion but compared it with 15 instead of 0.15. That unit mismatch made the precision gate effectively permissive. Correcting it changed the classification of all 29 candidates.'),
  decision('Keep the candidate signal; withhold the structural alert.', 'A rate can be worth watching before its confidence interval is narrow enough for escalation. Separating observation from confirmation keeps the monitoring useful without overstating certainty.', 'Some decisions take longer because adjacent hours or rolling windows must accumulate enough evidence.'),

  section('Field geometry and camera reliability', 'camera-reliability'),
  block('Model performance begins before inference. The field study compared a fixed vendor reference with the actual vehicle path and camera placement. The useful conclusion was not a universal angle; it was that geometry must be measured per lane and validated against capture evidence.'),
  imageDiagram(refs.geometry, 'An anonymized crop of the source field-geometry sketch showing measured lane, coil and camera triangles.', 'Source field-geometry sketch, cropped to remove surrounding operational material.', 'The source compared a 4.0–4.5 m / 25° reference with a site-specific measurement. Those values are historical observations, not a new universal configuration.'),
  ...bullets(
    'Resolution cannot rescue a plate that never enters the recognition region.',
    'Geometry cannot rescue a trigger that fires at the wrong vehicle position.',
    'A correct capture can still fail during network transport or downstream state handling.',
    'Local storage and replay turn network loss into a recoverable queue instead of missing evidence.',
  ),
  block('The camera integration work therefore covered more than OCR parameters: trigger behavior, local SD-card evidence, time synchronization, HTTP recognition events, SDK diagnostics, retry/replay, and the physical outputs that act on the result. Exact vendor configuration and private endpoints are intentionally omitted.'),

  section('Image quality and training evidence', 'image-quality'),
  imageDiagram(refs.resolution, 'Comparison between 960 by 540 and 1920 by 1080 training frames, showing 518,400 versus 2,073,600 pixels.', 'The documented acquisition target carries approximately four times the pixel count of a 960×540 frame.', 'This is an input-contract comparison, not a claim that resolution alone guarantees OCR improvement.'),
  block('The supplied training archive included 540p-class material while the documented target was 1920×1080. The goal was not to advertise “more megapixels.” It was to make blur, character shape, crop quality and failure review comparable across the collection.'),
  decision('Treat image acquisition as a contract.', 'If lighting, exposure, gain, overlay behavior, camera identity and final dimensions vary silently, model debugging becomes mixed with data-collection noise.', 'The stricter contract rejects more field captures, so recollection must be planned rather than assumed.'),

  section('From field data to model improvement', 'model-improvement'),
  block('The documented operational work organized CV work by feature and location, attached manual classification evidence, confirmed the target camera, collected 1,000 motorcycle samples and prepared a model-improvement handoff. The training design below is a controlled portfolio reconstruction informed by Andrew Ng’s CS229 theory—not a confidential production result.'),
  diagram('Leakage-aware training feedback loop', 'pipeline', [
    ['Field captures', 'real failure modes'], ['Annotation', 'motorcycle / background + provenance'], ['Independent split', 'group by parent vehicle / capture event'], ['Training'], ['Validation', 'unseen evidence'], ['Error analysis'], ['Targeted recollection'],
  ], ['Crops from one capture event stay in one split', 'Threshold and model selection use validation evidence'], undefined, 'The loop converts recurring field errors into a more useful next collection.'),
  math('p(y=1\\mid x)=\\sigma(\\theta^T x)', 'Conceptual binary motorcycle-versus-background classifier used only to explain supervised-learning framing.'),
  imageDiagram(refs.biasVariance, 'Conceptual bias-variance panels showing underfit, balanced validation-selected, and overfit models.', 'Bias and variance are model-selection questions, not production KPI claims.', 'Andrew Ng’s model-selection principle is the theoretical source: training error alone cannot choose a model; evaluate generalization on held-out evidence or an appropriate cross-validation design.'),
  callout('Controlled portfolio reconstruction', 'No reconstructed accuracy, loss or threshold result is presented as a production metric. The public claim is about dataset design, leakage control, model-selection discipline and error-driven recollection.', 'warning'),

  section('The feedback loop', 'feedback-loop'),
  diagram('Reliability improvement loop', 'pipeline', [
    ['Measure'], ['Detect deviation'], ['Locate failure layer'], ['Assign owner'], ['Fix / collect / retrain'], ['Validate'], ['Measure again'],
  ], [
    'SD Card present + Agent missing → synchronization / transport',
    'Bad image → geometry / trigger / exposure',
    'Repeated character confusion → retraining evidence',
    'Weak hourly sample → collect before escalation',
    'One limiting gate → fix the bottleneck',
  ], undefined, 'Management priorities and technical evidence return to the same metric contract.'),
  block('The work became useful when every observation had a next diagnostic step and every intervention returned to measurement. The loop is the product: not a dashboard, not a camera setting, and not a model in isolation.'),

  section('What I owned', 'ownership'),
  table(['Management / product control plane', 'Technical / analytical plane'], [
    ['Define accuracy, SLO and monitoring views', 'SQL, timestamp semantics and denominator design'],
    ['Prioritize sites and limiting gates', 'Cross-source and event reconciliation'],
    ['Classify incidents and assign owners', 'Gate-level, image-level and timing diagnostics'],
    ['Coordinate engineering, vendor and operations follow-up', 'Confidence intervals and measurement validation'],
    ['Convert investigations into acceptance rules', 'Camera geometry, trigger and transport analysis'],
    ['Automate recurring monitoring and preserve evidence', 'Dataset structure, leakage control and ML evaluation design'],
  ], 'Ownership supported by the merged project evidence; no revenue, adoption or production-model uplift is inferred.'),

  section('Outcome', 'outcome'),
  block('The final system did not reduce Computer Vision reliability to one OCR score. It connected one official KPI to the gates, events, images, system states and operational conditions underneath it. A decline could be classified, routed and remeasured instead of being passed around as an unexplained “accuracy issue.”'),
  block('That is what operating computer vision outside the demo meant in this program: preserve the business outcome at the top, preserve the evidence at the bottom, and make the path between them explicit enough that the next action belongs to the right layer.'),
  callout('Public claim boundary', 'This case study does not claim revenue impact, support savings, universal camera settings, guaranteed OCR uplift, autonomous remediation, or final motorcycle production accuracy.', 'warning'),
]

const published = await client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', { id: publishedId })
const existingDraft = await client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', { id: draftId })
if (!published || published._type !== 'project' || (published as { slug?: { current?: string } }).slug?.current !== 'computer-vision-lpr') throw new Error('Expected published Computer Vision project was not found. No draft written.')
if (existingDraft) throw new Error(`Draft ${draftId} already exists. Refusing to overwrite concurrent Studio work.`)
const base = Object.fromEntries(Object.entries(published).filter(([field]) => !['_id', '_rev', '_createdAt', '_updatedAt'].includes(field)))
const draft = {
  ...base,
  _id: draftId,
  title: 'Computer Vision & LPR Reliability',
  shortSummary: 'Operating computer vision outside the demo: one reliability program connecting product measurement, field evidence, camera infrastructure, transaction state, and model-improvement inputs.',
  tags: ['Computer Vision', 'License Plate Recognition', 'Reliability Engineering', 'Product Analytics', 'Data Quality', 'ML Evaluation'],
  content,
  seoTitle: 'Computer Vision & LPR Reliability | Anastasia Aurelia',
  seoDescription: 'A full-stack LPR reliability case study connecting management metrics to triggers, cameras, OCR, transport, transaction timing, field diagnosis, and ML data.',
}
await client.create(draft as never)
console.log(`Created unpublished draft ${draftId}. Published ${publishedId} was not changed.`)
console.log(`Uploaded/reused ${Object.keys(refs).length} project image assets through Sanity.`)
