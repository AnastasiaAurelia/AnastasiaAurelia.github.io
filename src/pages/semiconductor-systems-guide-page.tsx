import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'
import { SITE } from '@/content/site'

const publishedAt = '2026-09-22'

const learningModules = [
  { number: '00', title: 'Big picture', description: 'The full chain from product need and system architecture through IC design, wafer fabrication, packaging, test, and final electronics integration.' },
  { number: '02', title: 'Inside a chip', description: 'Die, package, transistor, gate, register, CPU/GPU/NPU, clocking, routing, and the physical hierarchy that turns logic into hardware.' },
  { number: '03', title: 'Digital logic & CMOS', description: 'CMOS switching, timing, setup/hold intuition, critical paths, fanout, capacitance, dynamic power, and why digital logic still depends on analog physics.' },
  { number: '04', title: 'RTL to GDS', description: 'RTL, verification, synthesis, technology mapping, STA, floorplanning, placement, CTS, routing, extraction, signoff, GDS, and tape-out.' },
  { number: '05', title: 'Fabrication', description: 'Lithography, deposition, etch, doping, oxidation, CMP, contacts, vias, metal layers, yield, process control, and wafer test.' },
  { number: '06', title: 'Packaging & testing', description: 'Wafer sort, dicing, die attach, wire bond versus flip-chip, package substrates, thermal paths, final test, binning, and the path to a PCB.' },
  { number: '07', title: 'Modern semiconductor technology', description: 'FinFET to GAA, EUV and High-NA, backside power, interconnect limits, HBM, chiplets, UCIe, 2.5D/3D integration, and heterogeneous systems.' },
  { number: '08', title: 'Product & ODM onboarding', description: 'SoC selection, reference designs, BSP/SDK/drivers, PCB/PCBA, RF, power, thermal, BOM, EVT/DVT/PVT, NPI, DFM, lifecycle, and supplier ownership.' },
]

const practicalVocabulary = [
  ['SoC', 'A system-on-chip combining compute and peripheral functions on one silicon platform.'],
  ['Reference design', 'A vendor-provided hardware/software starting point used to reduce integration risk and development time.'],
  ['EVK / dev kit', 'A board and software package for evaluating a chipset before custom hardware is ready.'],
  ['BSP', 'Board Support Package: low-level software that connects an operating system to a specific board/platform.'],
  ['SDK', 'Software Development Kit: libraries, APIs, tools, samples, and documentation for building on a platform.'],
  ['Driver', 'Software that controls or exposes a hardware device to the operating system or application layer.'],
  ['PCB / PCBA', 'The bare printed circuit board versus the assembled board populated with components.'],
  ['SMT', 'Surface-mount assembly used to place and solder components onto a PCB.'],
  ['BOM', 'Bill of materials: the component list plus cost, approved alternatives, lifecycle, and supply risk.'],
  ['NPI', 'New Product Introduction: moving a design from engineering validation toward repeatable production.'],
  ['DFM', 'Design for Manufacturability: shaping a design so it can be built reliably and economically.'],
  ['ECO / ECN', 'Engineering change mechanisms for controlling changes to released designs and documentation.'],
  ['EVT / DVT / PVT', 'Common hardware validation gates; exact definitions vary by company and should be confirmed internally.'],
  ['MP', 'Mass production: the steady-state production phase after production validation.'],
  ['EOL', 'End of life: when a component or platform is being discontinued, creating redesign and supply risk.'],
]

const foundationalResources = [
  { label: 'NPTEL — VLSI Design Flow: RTL to GDS', detail: 'IIIT Delhi · synthesis, STA, constraints, DFT, physical design, CTS, routing, signoff', href: 'https://nptel.ac.in/courses/108106191' },
  { label: 'NPTEL — Fundamentals of Electronic Device Fabrication', detail: 'IIT Madras · oxidation, doping, lithography, etch, deposition, CMP, yield, packaging', href: 'https://nptel.ac.in/courses/113106062' },
  { label: 'MIT OpenCourseWare 6.012 — Microelectronic Devices and Circuits', detail: 'Device physics, junctions, MOS structures, MOSFETs, models, and circuit behavior', href: 'https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/' },
]

const books = [
  'CMOS VLSI Design: A Circuits and Systems Perspective, 5th ed. — Neil H. E. Weste & David Money Harris',
  'Digital Integrated Circuits: A Design Perspective — Jan M. Rabaey, Anantha Chandrakasan & Borivoje Nikolić',
  'Semiconductor Manufacturing Handbook, 2nd ed. — Hwaiyu Geng',
  'Microchip Fabrication, 6th ed. — Peter Van Zant',
]

const currentPrimarySources = [
  { label: 'TSMC — Logic Technology / A16', detail: 'Nanosheet transistors and backside power rail context', href: 'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_A16' },
  { label: 'Intel Foundry — Intel 18A', detail: 'RibbonFET gate-all-around and PowerVia backside power delivery', href: 'https://www.intel.com/content/www/us/en/foundry/process/18a.html' },
  { label: 'Intel Foundry — Advanced Packaging', detail: 'EMIB, Foveros, multi-die integration, and advanced package architecture', href: 'https://www.intel.com/content/www/us/en/foundry/packaging.html' },
  { label: 'ASML — EUV lithography systems', detail: 'EUV platform history and the transition toward High-NA EUV', href: 'https://www.asml.com/en/products/euv-lithography-systems' },
  { label: 'imec — Nano-scale transistors', detail: 'Research context for advanced transistor architectures and nanosheet/GAA scaling', href: 'https://www.imec-int.com/en/technology-platforms/nano-scale-transistors' },
  { label: 'UCIe Consortium — Specifications', detail: 'Open die-to-die interconnect standards for chiplet and package ecosystems', href: 'https://www.uciexpress.org/specifications' },
  { label: 'JEDEC — HBM / JESD235 resources', detail: 'Standards context for High Bandwidth Memory', href: 'https://www.jedec.org/standards-documents/technology-focus-areas/memory/jesd235' },
  { label: 'Micron — High Bandwidth Memory', detail: 'Current product and architecture context for stacked high-bandwidth memory', href: 'https://www.micron.com/products/memory/hbm' },
]

const companyContext = [
  { label: 'TSM Technologies — Our Story', href: 'https://www.tsmid.com/our-story' },
  { label: 'TSM Technologies — What We Do', href: 'https://www.tsmid.com/what-we-do' },
  { label: 'TSM Technologies — Why Us', href: 'https://www.tsmid.com/why-us' },
]

function ResourceLink({ label, detail, href }: { label: string; detail?: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group grid gap-2 border-t border-line py-5 transition-colors hover:bg-surface sm:grid-cols-[1fr_auto] sm:items-center sm:px-2">
      <span>
        <span className="block font-medium text-ink">{label}</span>
        {detail ? <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{detail}</span> : null}
      </span>
      <ExternalLink className="size-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  )
}

export function SemiconductorSystemsGuidePage() {
  const pipeline = [
    'product need',
    '  → system architecture',
    '  → SoC / IC architecture',
    '  → RTL + verification',
    '  → synthesis + timing',
    '  → floorplan + placement + CTS + routing',
    '  → signoff + GDS',
    '  → wafer fabrication',
    '  → wafer test',
    '  → dicing + package assembly',
    '  → final test / binning',
    '  → PCB + firmware / OS integration',
    '  → EVT / DVT / NPI / PVT',
    '  → mass production',
    '  → deployment + support',
  ].join('\\n')

  return (
    <>
      <Seo
        title="Semiconductors, End to End: A Practical Systems Map"
        description="A source-grounded map from CMOS and RTL-to-GDS through fabrication, packaging, chiplets, HBM, and the product vocabulary that matters in hardware R&D."
        path="/articles/semiconductor-systems-guide"
        ogType="article"
        publishedTime={publishedAt}
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Semiconductors, End to End: A Practical Systems Map',
          description: 'A source-grounded map from CMOS and RTL-to-GDS through fabrication, packaging, chiplets, HBM, and the product vocabulary that matters in hardware R&D.',
          datePublished: publishedAt,
          author: { '@type': 'Person', name: SITE.name },
        }]}
      />

      <article className="container-editorial section-y-tight pt-14">
        <div className="mb-8">
          <Link to="/articles" className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Methods
          </Link>
        </div>

        <header className="max-w-3xl">
          <p className="label-mono text-accent">Research · Semiconductor systems</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Semiconductors, End to End: A Practical Systems Map</h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">
            The map I built to go from “I know what a chip is” to being able to follow a real hardware, semiconductor, and product-development conversation.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label-mono text-ink-faint">22 Sep 2026</p>
            <p className="label-mono text-ink-faint">Semiconductors · Hardware R&amp;D · Systems thinking</p>
          </div>
        </header>

        <section className="mt-12 max-w-3xl border-t border-line pt-10">
          <p className="label-mono text-accent">Why I built this</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">“Semiconductor” is not one topic</h2>
          <div className="mt-5 space-y-4 text-ink-muted">
            <p>It spans device physics, digital logic, chip design, manufacturing, packaging, memory, boards, firmware, supply constraints, and the product decisions that connect all of them. Learning those pieces separately made it easy to memorize terms without knowing where they belonged.</p>
            <p>I built a source-grounded knowledge map instead: one chain that starts with a product requirement and ends with a tested electronic system. Stable fundamentals come from courses and textbooks; fast-moving topics such as GAA, High-NA EUV, backside power, chiplets, UCIe, and HBM are kept separate and tied to current primary sources.</p>
          </div>
        </section>

        <section className="mt-14">
          <p className="label-mono text-accent">The mental model</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">One chain, from idea to deployed hardware</h2>
          <div className="mt-7 overflow-x-auto rounded-sm border border-line bg-surface p-5">
            <code className="block min-w-[48rem] whitespace-pre font-mono text-sm leading-7 text-ink-muted">{pipeline}</code>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">The exact ownership changes by company and product. The point of the chain is not to claim that one team does everything; it is to make the handoffs and dependencies visible.</p>
        </section>

        <section className="mt-14">
          <p className="label-mono text-accent">Knowledge map</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Eight modules, each answering a different question</h2>
          <div className="mt-7 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {learningModules.map((module) => (
              <div key={module.number} className="bg-paper p-6">
                <p className="label-mono text-accent">{module.number}</p>
                <h3 className="mt-3 text-2xl">{module.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{module.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <p className="label-mono text-accent">What changed in modern semiconductors</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Scaling is now a systems problem</h2>
          <p className="mt-5 text-ink-muted">“Smaller transistor = better chip” is still useful, but incomplete. Modern progress increasingly comes from coordinated improvements across several layers.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              ['Transistor architecture', 'Planar → FinFET → GAA / nanosheet for stronger electrostatic control.'],
              ['Lithography', 'DUV, EUV, and High-NA EUV for increasingly difficult patterning.'],
              ['Interconnect & power', 'Wire delay, routing congestion, IR drop, and backside power delivery.'],
              ['Memory', 'Bandwidth and data movement, including HBM for data-intensive compute.'],
              ['Packaging', '2.5D, 3D, interposers, bridges, hybrid bonding, and thermal constraints.'],
              ['System architecture', 'Chiplets, UCIe, heterogeneous integration, and workload-specific trade-offs.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-sm border border-line bg-surface p-5">
                <h3 className="text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="label-mono text-accent">Product fluency</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">The vocabulary I would learn before the transistor equations</h2>
          <dl className="mt-7 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {practicalVocabulary.map(([term, meaning]) => (
              <div key={term} className="bg-paper p-5">
                <dt className="font-medium text-ink">{term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{meaning}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">Acronyms are contextual. For example, DFT in semiconductor engineering commonly means Design for Test; elsewhere a team may use different shorthand. Internal definitions beat assumptions.</p>
        </section>

        <section className="mt-14 max-w-3xl">
          <p className="label-mono text-accent">How I would onboard into a hardware / ODM environment</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Trace one finished product backward</h2>
          <p className="mt-5 text-ink-muted">The fastest way to understand a real organization is not another month of abstract reading. I would ask for one completed product and trace the artifacts and ownership end to end.</p>
          <ol className="mt-6 space-y-3 text-ink-muted">
            {[
              'Start with the product requirement and target user.',
              'Identify the chipset / SoC and what came from a vendor reference design.',
              'Find the system block diagram, schematic, PCB, BOM, and approved alternatives.',
              'Trace firmware, BSP, drivers, operating-system customization, and update ownership.',
              'Review bring-up issues and the EVT / DVT findings that forced redesigns.',
              'Follow NPI, DFM, pilot builds, PVT, certification, and production test.',
              'Separate what was designed internally from what was supplied or manufactured by partners.',
              'Record the recurring bottlenecks: thermal, RF, power, supply, software support, cost, test, or yield.',
            ].map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="label-mono pt-1 text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <p className="label-mono text-accent">Resource library</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">The source stack behind the map</h2>
          <p className="mt-4 max-w-3xl text-ink-muted">I keep fundamentals and current industry state separate. Courses and books anchor the durable concepts; vendor, research, and standards bodies anchor claims that can change by process generation.</p>

          <div className="mt-9 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl">Free foundational courses</h3>
              <div className="mt-4 border-b border-line">
                {foundationalResources.map((resource) => <ResourceLink key={resource.href} {...resource} />)}
              </div>
            </div>
            <div>
              <h3 className="text-2xl">Books in the reference stack</h3>
              <div className="mt-4 border-b border-line">
                {books.map((book) => <div key={book} className="border-t border-line py-5"><p className="text-sm leading-relaxed text-ink-muted">{book}</p></div>)}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl">Current primary / standards sources</h3>
            <div className="mt-4 border-b border-line">
              {currentPrimarySources.map((resource) => <ResourceLink key={resource.href} {...resource} />)}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl">Company-context sources used for the onboarding layer</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">These are used only for public company context. They do not establish chip-design, wafer-fabrication, or semiconductor-packaging capability unless a source says so directly.</p>
            <div className="mt-4 border-b border-line">
              {companyContext.map((resource) => <ResourceLink key={resource.href} {...resource} />)}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-sm border border-line bg-surface p-6 sm:p-8">
          <p className="label-mono text-accent">Source discipline</p>
          <h2 className="mt-3 text-3xl leading-tight">What I deliberately do not collapse together</h2>
          <div className="mt-6 grid gap-4 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
            <p><strong className="text-ink">Electronics manufacturing ≠ wafer fabrication.</strong> Building a finished electronic product does not imply owning a semiconductor fab.</p>
            <p><strong className="text-ink">PCB assembly ≠ OSAT.</strong> Board assembly and semiconductor package assembly are different manufacturing layers.</p>
            <p><strong className="text-ink">Using a Qualcomm platform ≠ designing a processor.</strong> System integration is a real capability without being custom silicon design.</p>
            <p><strong className="text-ink">A roadmap ≠ shipping reality.</strong> Time-sensitive claims are kept tied to dated, primary sources.</p>
            <p><strong className="text-ink">A node name ≠ one literal transistor dimension.</strong> Modern node labels represent technology generations and process families.</p>
            <p><strong className="text-ink">No public evidence ≠ confirmed absence.</strong> Unknown ownership stays unknown until internal evidence resolves it.</p>
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <p className="label-mono text-accent">The takeaway</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Learn the interfaces between layers</h2>
          <p className="mt-5 text-ink-muted">I do not need to be the transistor physicist, physical-design engineer, firmware engineer, RF engineer, and manufacturing engineer at the same time. For research and product work, the leverage comes from knowing what each layer owns, what it depends on, what can fail at the boundary, and which question to ask next.</p>
        </section>

        <div className="mt-14 border-t border-line pt-8">
          <Link to="/articles" className="label-mono inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Methods
          </Link>
        </div>
      </article>
    </>
  )
}
