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
const block = (text: string, style: 'normal' | 'h2' | 'h3' | 'eyebrow' = 'normal', listItem?: 'bullet' | 'number') => ({ _type: 'block', _key: key(), style, ...(listItem ? { listItem, level: 1 } : {}), markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] })
const bullets = (...items: string[]) => items.map((item) => block(item, 'normal', 'bullet'))
const section = (title: string, identifier: string) => ({ _type: 'projectSection', _key: key(), title, identifier })
const metric = (label: string, value: string, context: string) => ({ _type: 'metricHighlight', _key: key(), label, value, context })
const callout = (title: string, body: string, tone: 'info' | 'warning' | 'success' = 'info') => ({ _type: 'callout', _key: key(), title, body, tone })
const decision = (decisionText: string, reasoning: string, consequence?: string) => ({ _type: 'decisionCallout', _key: key(), decision: decisionText, reasoning, ...(consequence ? { consequence } : {}) })
const math = (latex: string, databaseDefinition: string) => ({ _type: 'math', _key: key(), latex, display: true, databaseDefinition })
const table = (headers: string[], rows: string[][], caption?: string) => ({ _type: 'dataTable', _key: key(), headers, rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })), ...(caption ? { caption } : {}) })
const diagram = (title: string, variant: 'pipeline' | 'timeline', steps: Array<[string, string?]>, relationships?: string[], warning?: string, caption?: string) => ({ _type: 'processDiagram', _key: key(), title, variant, steps: steps.map(([label, field]) => ({ _type: 'processStep', _key: key(), label, ...(field ? { field } : {}) })), ...(relationships ? { relationships } : {}), ...(warning ? { warning } : {}), ...(caption ? { caption } : {}) })
const imageDiagram = (assetRef: string, alt: string, caption: string, explanation?: string) => ({ _type: 'architectureDiagram', _key: key(), image: { _type: 'image', asset: { _type: 'reference', _ref: assetRef } }, alt, caption, ...(explanation ? { explanation } : {}) })
const gallery = (images: Array<{ assetRef: string; alt: string; caption: string; label: string }>) => ({
  _type: 'imageGallery',
  _key: key(),
  images: images.map(({ assetRef, ...image }) => ({
    _type: 'galleryImage',
    _key: key(),
    asset: { _type: 'reference', _ref: assetRef },
    ...image,
  })),
})

const assetSources = {
  planes: 'public/assets/cv-lpr/two-plane-reliability-system.png',
  sites: 'public/assets/cv-lpr/five-site-30d-7d.png',
  geometry: 'public/assets/cv-lpr/field-geometry-source-crop.png',
  resolution: 'public/assets/cv-lpr/resolution-evidence.png',
  biasVariance: 'public/assets/cv-lpr/bias-variance.png',
  fieldMeasurement: 'public/assets/cv-lpr/calibration/field-string-measurement.jpg',
  measurementTriangle: 'public/assets/cv-lpr/calibration/measurement-triangle-geometry.jpg',
  coilCameraFocus: 'public/assets/cv-lpr/calibration/coil-camera-focus-relationship.jpg',
  inclinometerCheck: 'public/assets/cv-lpr/calibration/inclinometer-field-check.jpg',
  cnn02: '/home/anas/Downloads/CNN/2.jpeg',
  cnn03: '/home/anas/Downloads/CNN/3.jpeg',
  cnn04: '/home/anas/Downloads/CNN/4.jpeg',
  cnn05: '/home/anas/Downloads/CNN/5.jpeg',
  cnn06: '/home/anas/Downloads/CNN/6.jpeg',
  cnn07: '/home/anas/Downloads/CNN/7.jpeg',
  cnn08: '/home/anas/Downloads/CNN/8.jpeg',
} as const

async function uploadOrReuse(path: string, filename = basename(path)) {
  const absolutePath = resolve(path)
  const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename })
  if (existing) return existing
  const asset = await client.assets.upload('image', createReadStream(absolutePath), { filename })
  return asset._id
}

const refs = Object.fromEntries(await Promise.all(Object.entries(assetSources).map(async ([name, path]) => [name, await uploadOrReuse(path, name.startsWith('cnn') ? `cnn-hand-calculation-${name.slice(3)}.jpeg` : basename(path))]))) as Record<keyof typeof assetSources, string>

const content = [
  section('Making recognition failures easier to resolve', 'overview'),
  block('Recognition failures created repeated investigation and operational uncertainty. I owned the reliability measurement, investigation structure, vendor and engineering coordination, and product-side follow-through needed to turn those failures into traceable work.'),
  block('I created a measurable reliability loop connecting production metrics, field evidence, camera infrastructure, transaction state, and model behavior. Production performance became measurable and consistently high, operations spent less time repeatedly investigating the same problems, and engineering received clearer evidence when failures occurred.'),
  block('The work still crossed both the management layer and the technical layer of a real-world license-plate-recognition product. The management problem was deciding where to act. The technical problem was locating the exact layer where a recognition event stopped surviving the transaction.'),
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

  block('From geometry to a repeatable field calibration', 'h3'),
  block('The principle above — measure per lane, validate against capture evidence — came from a specific field calibration method. The workbook and field documentation behind this project show what that measurement actually looked like: the real triangle, the formula behind it, and the range of installed values across five live gates.'),
  table(['Lane', 'Installed height', 'Mechanical tilt α', 'Road slope θ', 'Effective angle φ'], [
    ['Vendor baseline (flat reference)', '150 cm', '25.00°', '0° (flat)', '25.00°'],
    ['Gate 1 — incline', '160 cm', '28.75°', '5.92°', '22.83°'],
    ['Gate 2 — incline', '178 cm', '25.30°', '2.81°', '22.49°'],
    ['Gate 3 — decline', '175 cm', '25.25°', '5.01°', '30.26°'],
    ['Gate 4 — incline', '160 cm', '18.45°', '1.96°', '20.41°'],
    ['Gate 5 — decline', '165 cm', '17.30°', '4.62°', '21.92°'],
  ], 'Installed camera height at every live gate sat between 160 cm and 178 cm — above the 150 cm flat-reference baseline, and never identical to it, because every lane carries its own road slope.'),
  block('α is the bracket’s mechanical tilt: the angle the camera housing is physically bolted at. θ is that lane’s own road slope, measured separately from the camera. φ is what the camera actually sees relative to the road surface once the slope is accounted for — the number that drives everything downstream of it.'),
  math('\\varphi = \\alpha - \\theta', 'φ = effective camera angle relative to the road surface. α = the mechanical tilt angle the bracket is physically set to. θ = the measured road slope at that lane, subtracted on an incline and added back on a decline. The same mechanical angle reads a different effective angle on a sloped lane than on a flat one.'),
  math('X = \\frac{h}{\\tan(\\varphi)}', 'X = horizontal distance from the camera to the target point on the ground. h = camera height above ground. φ = the effective angle above. This height-over-tangent relationship is what the source workbook uses to turn a measured height and angle into a horizontal distance — and, run in reverse, to turn a target distance back into a required height.'),
  imageDiagram(refs.fieldMeasurement, 'Two field technicians running a string from the camera mounting pole across the pavement, with a tape measure recording the distance, at a covered vehicle gate.', 'Establishing the sightline by hand: a string pulled from the camera mount to the coil position, before any angle or distance is read off it.', 'This is the physical action behind every row in the table above — φ and X are not read off a drawing; they are pulled taut on site and then measured.'),
  imageDiagram(refs.measurementTriangle, 'Annotated field photo showing a triangle formed by two points on the camera pole (A, B) and the coil edge (C), with the interior angles marked for measurement.', 'The same string, formalized as a triangle: A and B mark the camera side, C marks “ujung coil” — the coil edge where the front wheel first lands.', 'The workbook’s α, θ, and φ are the angles of this triangle; X is its horizontal side. Measuring the triangle in the field is what makes the formula usable instead of theoretical.'),
  block('“Coil” here means the induction loop set into the pavement that triggers the camera. Two coil reference points appear depending on the step, and the source material keeps them distinct: “ujung coil” — the coil edge, where the front wheel first contacts it — is what the string is pulled to when aiming the camera; “tengah coil” — the coil centre — is the reference used when checking where the plate should sit inside the recognition frame. Related points, not interchangeable ones.'),
  imageDiagram(refs.coilCameraFocus, 'Top: a labelled field photo showing the camera focus point aimed down toward the coil centre. Bottom: the corresponding live capture, with the same two points marked, showing a vehicle correctly framed with its plate inside the recognition box.', '“titik fokus kamera” (camera focus point) aimed at “tengah coil” (coil centre): when that alignment holds, the plate lands inside the recognition box at capture time.', 'This is the payoff of the geometry above — not a cleaner drawing, but a plate positioned where the model can actually read it.'),
  decision('Use a camera height near 180 cm, paired with the matching coil distance, as a quick-calibration starting point — then refine from live capture evidence.', 'Directly measured installed heights across five live gates sat between 160 cm and 178 cm, all above the 150 cm flat-reference baseline, and all required their own road-slope correction. A height near the top of that band gave field crews a fast, defensible starting geometry at a new site instead of re-deriving the triangle from zero, refined once real captures came back.', 'This is a field-derived working heuristic from the documented setup, not a universal LPR specification. It still needs the same θ correction and live-capture validation as every lane in the table above before it is treated as final for that site.'),
  block('A unit note, stated plainly: the source documents record installed height in centimetres — “150 cm” and “160 cm” appear directly in the field notes — and no document in the source material contains the literal figure “180.” The highest individually measured gate in the workbook is 178 cm. Read against that centimetre convention, treating the reported “around 180” as 180 cm is the most defensible interpretation available, sitting just above the highest directly documented installation. It is presented here as exactly that: a rounded field figure, not a value pulled from a spreadsheet cell.'),
  block('Applying the same height-over-tangent relationship to a 180 cm height at the baseline 25° angle gives a computed horizontal camera-to-coil distance of approximately 3.9 m. That figure is not independently measured in the source material — it is derived from the documented formula — but it lands between the SOP’s two reference installation distances below. That is the “appropriate distance from the coil” the height figure is meant to pair with.'),
  table(['Coil configuration', 'Reference installation distance', 'Loop orientation'], [
    ['Single gate (single loop)', '3.5 m, coil to camera', 'Vertical'],
    ['Combo gate (double loop)', '4.0 m, coil to camera', 'Horizontal'],
  ], 'Distances are measured from the coil’s ground position to the camera — the SOP’s own reference figures for initial setup, not a value derived from the height formula.'),
  block('Field crews validate a starting geometry with a quick field check rather than re-measuring the whole triangle: zero a digital inclinometer on a level surface, then read the camera’s mechanical tilt directly off it.'),
  imageDiagram(refs.inclinometerCheck, 'A digital angle finder placed on top of a camera housing, its bubble level centred and its display reading 11.7 degrees.', 'A digital inclinometer, zeroed on a level surface and then read directly off the camera housing — a fast way to confirm α without re-deriving the triangle.', 'This is a spot-check, not a substitute for the full string-and-triangle measurement. It confirms the bracket has not drifted since the last full calibration.'),
  block('When a spot-check or a live capture disagrees with the starting geometry, the same baseline relationship tells the crew which direction to move the bracket. The workbook compares the installed height against the height that lane’s own slope-corrected geometry would require, and outputs a direct instruction.'),
  table(['Lane', 'Installed height', 'Slope-corrected target height', 'Adjustment'], [
    ['Gate 1 — incline', '160 cm', '199 cm', 'Raise bracket ≈ 39 cm'],
    ['Gate 2 — incline', '178 cm', '198 cm', 'Raise bracket ≈ 20 cm'],
    ['Gate 3 — decline', '175 cm', '199 cm', 'Raise bracket ≈ 24 cm'],
  ], 'The comparison is always against that lane’s own slope-corrected geometry, not the flat baseline directly — a sloped lane is expected to need a different height than a level one.'),
  callout('A documented limitation, not a hidden one', 'The same workbook also tried deriving the required height through the Law of Sines instead of the simpler height-over-tangent relationship, and recorded at least one case where that approach returned a non-physical result. The simpler relationship was kept as the working method; the alternative was flagged as unreliable outside its valid range rather than presented as equally trustworthy.', 'warning'),
  block('None of this replaces the recognition-region and capture-quality checks described above. It gives them a starting point: a lane that starts from a measured, slope-corrected geometry needs less blind adjustment before the first real capture is worth reviewing.'),

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

  section('I worked through the CNN dimensions by hand.', 'cnn-hand-calculation'),
  block('ML FOUNDATIONS / HAND CALCULATION', 'eyebrow'),
  block('I followed the tensor through convolution, pooling, flattening, and fully connected layers, checking output dimensions, activations, and parameter counts at each stage. These handwritten calculations are evidence of understanding the mechanics behind the model—not a specification of the production LPR architecture.'),
  block('I worked through the network in order—from the input tensor, through convolution and pooling, into flattening and fully connected layers—checking the dimensions and parameter count at each stage.'),
  block('Part A — Following one CNN end to end', 'h3'),
  block('28×28×1 → Conv1 → Pool1 → Conv2 → Pool2 → Flatten 256 → FC 120 → FC 84 → Output 10'),
  gallery([
    { assetRef: refs.cnn02, label: '02 / INPUT → CONV1 → POOL1', alt: 'Handwritten CNN calculation page 2, starting with a 28 by 28 by 1 input and working through Conv1, ReLU1, and Pool1 dimensions, parameters, and activations.', caption: 'Starting from 28×28×1: Conv1 dimensions, filters, parameters, activations, ReLU, and the first pooling reduction.' },
    { assetRef: refs.cnn03, label: '03 / CONV2 → POOL2 → FLATTEN', alt: 'Handwritten CNN calculation page 3, continuing from the pooled feature maps through Conv2, ReLU2, Pool2, and flattening to 256 features.', caption: 'Continuing the same network: Conv2 inherits the previous feature-map depth, then reduces through Pool2 and flattens to 256 features.' },
    { assetRef: refs.cnn04, label: '04 / FULLY CONNECTED LAYERS', alt: 'Handwritten CNN calculation page 4, carrying 256 flattened features through fully connected layers of 120, 84, and 10 units with parameter counts.', caption: 'Continuing from the 256-feature vector into 120 → 84 → 10 fully connected layers, with dense parameter counts calculated explicitly.' },
    { assetRef: refs.cnn05, label: '05 / COMPLETE NETWORK CHECK', alt: 'Handwritten CNN calculation page 5, reconciling the complete network layer by layer with shapes, activation counts, and parameter totals.', caption: 'A consolidated layer-by-layer check of the same CNN: shapes, activations, parameters, and the complete network total.' },
  ]),
  block('Part B — Scaling the same reasoning', 'h3'),
  block('The notes then move from the small complete example into larger feature representations, character-level outputs, deeper convolutional stages, and larger dense layers. The bookkeeping stays the same as the architecture grows.'),
  math('(K_h\\times K_w\\times C_{in}+1)\\times C_{out}', 'Convolution parameters: kernel height × kernel width × input channels, plus one bias, multiplied by the number of output filters. Activation count: H × W × C.'),
  gallery([
    { assetRef: refs.cnn06, label: '06 / CLASSIFIER OUTPUT SIZING', alt: 'Handwritten CNN calculation page 6, reasoning from a larger feature representation into character-level classes and multi-character output sizing.', caption: 'Extending the calculation from feature representation into character-level classifier and output sizing.' },
    { assetRef: refs.cnn07, label: '07 / DEEPER CNN', alt: 'Handwritten CNN calculation page 7, applying convolution parameter and activation formulas across deeper convolutional and dense layers.', caption: 'Applying the general convolution and activation formulas across a deeper CNN, including larger convolutional and dense stages.' },
  ]),
  block('Part C — Architecture summary', 'h3'),
  block('A second architecture summary applies the same bookkeeping to a deeper CNN: shape changes, activation functions, parameter growth, pooling, flattening, and dense outputs.'),
  gallery([
    { assetRef: refs.cnn08, label: '08 / SECOND ARCHITECTURE SUMMARY', alt: 'Handwritten CNN calculation page 8, a second layer-by-layer architecture table covering convolution, ReLU, pooling, flattening, dense layers, parameter growth, and classification output.', caption: 'A second layer-by-layer architecture summary combining output shapes, activations, pooling, parameter growth, flattening, and dense classification stages.' },
  ]),

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
// This script deterministically regenerates the full draft content from the published document plus the
// scripted additions above — it holds no external diff/merge state. Re-running it is therefore safe and
// expected during content QA; createOrReplace overwrites only a draft this same script produced. It still
// will not touch the published document, and a draft edited by hand in Studio should not be run through
// this script without reconciling those edits first.
const base = Object.fromEntries(Object.entries(published).filter(([field]) => !['_id', '_rev', '_createdAt', '_updatedAt'].includes(field)))
const draft = {
  ...base,
  _id: draftId,
  title: 'Computer Vision & LPR Reliability',
  shortSummary: 'Made recognition reliable enough that operations spent less time chasing recurring failures, backed by a measurable loop across field evidence, infrastructure, transaction state, and model behavior.',
  tags: ['Computer Vision', 'License Plate Recognition', 'Reliability Engineering', 'Product Analytics', 'Data Quality', 'ML Evaluation'],
  content,
  seoTitle: 'Computer Vision & LPR Reliability | Anastasia Aurelia',
  seoDescription: 'A full-stack LPR reliability case study connecting management metrics to triggers, cameras, OCR, transport, transaction timing, field diagnosis, and ML data.',
}
await client.createOrReplace(draft as never)
console.log(existingDraft ? `Replaced existing draft ${draftId} (script-generated regeneration).` : `Created unpublished draft ${draftId}.`)
console.log(`Published ${publishedId} was not changed.`)
console.log(`Uploaded/reused ${Object.keys(refs).length} project image assets through Sanity.`)
