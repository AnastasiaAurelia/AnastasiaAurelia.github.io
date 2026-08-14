const lprWorkbookEvidence = [
  {
    title: 'WUZZ LPR Pattern Analysis',
    description:
      'Analysis of recurring LPR recognition patterns and operational behavior used to investigate performance characteristics.',
    url: 'https://docs.google.com/spreadsheets/d/1VdWHqvsYxd0WHEqTYMTXcP2RjoU6x5U3/edit?usp=drive_link&ouid=110581609392361657746&rtpof=true&sd=true',
  },
  {
    title: 'SD Card × Agent Intersection Analysis',
    description:
      'Cross-system analysis used to investigate intersections between SD-card LPR observations and Agent-side records.',
    url: 'https://docs.google.com/spreadsheets/d/1z76EPVFIhtbqg15PH3uc1ail3UWBClda/edit?usp=drive_link&ouid=110581609392361657746&rtpof=true&sd=true',
  },
  {
    title: 'Interquartile Range & Z-Score Analysis',
    description:
      'Statistical outlier analysis using interquartile-range and Z-score methods to distinguish abnormal observations from normal LPR performance variation.',
    url: 'https://docs.google.com/spreadsheets/d/1vo0y72yLg9YnQeSKcDo89EOx5d-koAFm/edit?usp=drive_link&ouid=110581609392361657746&rtpof=true&sd=true',
  },
  {
    title: 'Confidence Interval & Outlier Analysis',
    description:
      'Confidence-interval analysis used to evaluate observed LPR performance while examining the effect of anomalous observations.',
    url: 'https://docs.google.com/spreadsheets/d/1V6Q8xnGbXa3_uDibtqxPRNwSWkCHNJsl/edit?usp=drive_link&ouid=110581609392361657746&rtpof=true&sd=true',
  },
  {
    title: 'Camera Calibration — Trigonometry',
    description:
      'Geometric and trigonometric calculations used to reason about camera positioning and calibration for LPR capture conditions.',
    url: 'https://docs.google.com/spreadsheets/d/1t70NGkfs_jlKQnuyEf-96bYZu3PSyEQn/edit?usp=drive_link&ouid=110581609392361657746&rtpof=true&sd=true',
  },
] as const

export function LprEvidenceSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg">Leadership recognition</h3>
        <div className="rounded-sm border border-line bg-paper p-3 sm:p-4">
          <a
            href="/evidence/wilson-cto-evidence-final.png"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-sm border border-line bg-surface"
            aria-label="Open the PARKEE CTO recognition image in a new tab"
          >
            <img
              src="/evidence/wilson-cto-evidence-final.png"
              alt="Redacted PARKEE CTO message recognizing the LPR team and the work leading to consistent performance"
              className="block h-auto w-full object-contain"
              loading="lazy"
            />
          </a>
          <p className="mt-4 text-sm text-ink-muted">
            <strong className="font-medium text-ink">Redacted internal recognition from PARKEE CTO</strong>
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            PARKEE&apos;s CTO acknowledged the LPR team&apos;s performance, including my contribution, after the system
            maintained approximately <strong className="font-medium text-ink">97.7%</strong> accuracy over the preceding
            week and reached <strong className="font-medium text-ink">100%</strong> accuracy across 353 vehicles on the
            referenced day.
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            Identifying information and unrelated internal conversations have been redacted for privacy.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg">Metric methodology &amp; calculations</h3>
        <p className="text-sm font-medium text-ink">LPR Performance — Statistical &amp; Engineering Evidence</p>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          Selected sanitized analytical work used while investigating, measuring, and improving the LPR system. These
          workbooks expose calculation logic and engineering methodology without publishing the underlying production
          database.
        </p>

        <ul className="grid gap-3 md:grid-cols-2">
          {lprWorkbookEvidence.map((item) => (
            <li key={item.title}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between rounded-sm border border-line bg-paper p-4 transition-colors hover:bg-surface"
              >
                <div>
                  <p className="label-mono text-ink-faint">Workbook</p>
                  <p className="mt-3 text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  View workbook ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 border-t border-line pt-6">
        <h3 className="text-lg">Data availability</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          The underlying production metrics were monitored through PARKEE&apos;s internal Metabase dashboards.
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          Because these dashboards contain proprietary operational and potentially sensitive company data, the original
          dashboards and raw datasets are <strong className="font-medium text-ink">not publicly accessible</strong>.
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          The evidence published here is therefore limited to sanitized analytical work, derived metrics, statistical
          methodology, and materials that can be shared without exposing PARKEE&apos;s internal production data.
        </p>
      </div>
    </div>
  )
}
