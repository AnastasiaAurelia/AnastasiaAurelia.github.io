import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/seo'
import { SITE } from '@/content/site'

const publishedAt = '2026-09-22'

const sections = [
  ['01', 'What a semiconductor actually is'],
  ['02', 'What is physically inside a chip'],
  ['03', 'How digital logic becomes hardware'],
  ['04', 'How a chip is designed: RTL to GDS'],
  ['05', 'How a wafer is manufactured'],
  ['06', 'Packaging, testing, and binning'],
  ['07', 'Why modern chips need GAA, EUV, HBM, and chiplets'],
  ['08', 'How silicon becomes a real product'],
  ['09', 'How to read a hardware / ODM project at work'],
]

const resources = [
  { label: 'NPTEL — VLSI Design Flow: RTL to GDS', href: 'https://nptel.ac.in/courses/108106191' },
  { label: 'NPTEL — Fundamentals of Electronic Device Fabrication', href: 'https://nptel.ac.in/courses/113106062' },
  { label: 'MIT OpenCourseWare 6.012 — Microelectronic Devices and Circuits', href: 'https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/' },
  { label: 'TSMC — Logic Technology / A16', href: 'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_A16' },
  { label: 'Intel Foundry — Intel 18A', href: 'https://www.intel.com/content/www/us/en/foundry/process/18a.html' },
  { label: 'ASML — EUV lithography systems', href: 'https://www.asml.com/en/products/euv-lithography-systems' },
  { label: 'UCIe Consortium — Specifications', href: 'https://www.uciexpress.org/specifications' },
  { label: 'JEDEC — HBM / JESD235', href: 'https://www.jedec.org/standards-documents/technology-focus-areas/memory/jesd235' },
]

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-line py-6 sm:grid-cols-[3rem_1fr]">
      <div className="label-mono text-accent">{n}</div>
      <div>
        <h3 className="text-2xl leading-tight">{title}</h3>
        <div className="mt-3 space-y-3 text-ink-muted">{children}</div>
      </div>
    </div>
  )
}

function Term({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-line bg-surface p-5">
      <dt className="font-medium text-ink">{term}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{children}</dd>
    </div>
  )
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="my-7 rounded-sm border border-line bg-surface p-5 sm:p-6">
      <p className="label-mono text-accent">{title}</p>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </aside>
  )
}

export function SemiconductorSystemsGuidePage() {
  return (
    <>
      <Seo
        title="Semiconductors, End to End: A Step-by-Step Guide"
        description="A step-by-step guide to semiconductors, from transistor basics and digital logic through RTL-to-GDS, wafer fabrication, packaging, HBM, chiplets, and real product development."
        path="/articles/semiconductor-systems-guide"
        ogType="article"
        publishedTime={publishedAt}
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Semiconductors, End to End: A Step-by-Step Guide',
          description: 'A step-by-step guide from transistor basics through chip design, fabrication, packaging, and product integration.',
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
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Semiconductors, End to End: A Step-by-Step Guide</h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-ink-muted sm:text-3xl">
            Not a glossary. Not a wall of acronyms. This is the chain I use to understand how an idea becomes a chip, how the chip becomes a package, and how that package becomes a real product.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label-mono text-ink-faint">22 Sep 2026</p>
            <p className="label-mono text-ink-faint">Semiconductors · Hardware R&amp;D · Systems thinking</p>
          </div>
        </header>

        <section className="mt-12 max-w-3xl border-t border-line pt-10">
          <p className="text-lg leading-relaxed text-ink-muted">
            The easiest way to get lost in semiconductors is to learn each word separately. Transistor. SoC. RTL. EUV. HBM. Packaging. BSP. EVT. They sound unrelated until you place them on one chain.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            So this guide follows one question all the way through: <strong className="text-ink">what has to happen between “we want this electronic product” and “a customer can actually use it”?</strong>
          </p>
        </section>

        <nav className="mt-12 rounded-sm border border-line bg-surface p-6">
          <p className="label-mono text-accent">Read in this order</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {sections.map(([n, title]) => (
              <a key={n} href={`#part-${n}`} className="group grid grid-cols-[2.25rem_1fr] gap-3 text-sm text-ink-muted hover:text-ink">
                <span className="label-mono text-accent">{n}</span>
                <span className="group-hover:underline">{title}</span>
              </a>
            ))}
          </div>
        </nav>

        <section id="part-01" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 01</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">What a semiconductor actually is</h2>
          <p className="mt-5 text-ink-muted">Before talking about chips, start with the material. A semiconductor is useful because its electrical behavior can be controlled. Silicon is not simply “on” like a metal conductor or “off” like an insulator. Engineers can alter how easily charge moves through it, which makes controlled switching possible.</p>

          <Step n="01" title="Start with silicon">
            <p>Pure silicon is a crystalline material. On its own, it is not yet a useful digital switch. The important trick is that its electrical properties can be modified by adding tiny amounts of other atoms.</p>
          </Step>
          <Step n="02" title="Doping creates controllable regions">
            <p>Adding specific impurities creates regions that behave differently with respect to charge carriers. This gives engineers the building blocks for diodes and transistors.</p>
            <p>You do not need to memorize device physics immediately. The practical mental model is: <strong className="text-ink">doping helps engineers create regions whose electrical behavior can be deliberately controlled.</strong></p>
          </Step>
          <Step n="03" title="A transistor is an electrically controlled switch">
            <p>In digital logic, a transistor is usually used as a switch. One electrical signal controls whether another path conducts. Billions of these switches can be combined into logic gates, memory structures, and compute units.</p>
          </Step>

          <Note title="Mental model">
            <p>If a chip were a city, transistors would be the smallest controllable doors. Logic gates are small rooms made from those doors. Functional blocks are buildings. The chip is the city.</p>
          </Note>
        </section>

        <section id="part-02" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 02</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">What is physically inside a chip</h2>
          <p className="mt-5 text-ink-muted">“Chip” can mean several different things in conversation, so separate the layers.</p>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            <Term term="Wafer">A large circular slice of semiconductor material on which many copies of a design are manufactured at once.</Term>
            <Term term="Die">One individual piece cut from the wafer. The active circuitry lives on the die.</Term>
            <Term term="Package">The structure around the die that provides electrical connections, mechanical protection, and a thermal path.</Term>
            <Term term="Chip">Informal word that may refer to the die, the packaged device, or the product component depending on context.</Term>
          </dl>

          <Step n="01" title="Transistors form logic gates">
            <p>A few transistors can implement basic Boolean operations such as NOT, NAND, NOR, and other gates.</p>
          </Step>
          <Step n="02" title="Logic gates form sequential and combinational logic">
            <p>Gates become adders, multiplexers, comparators, flip-flops, counters, register files, and control logic.</p>
          </Step>
          <Step n="03" title="Those structures become functional blocks">
            <p>Examples include CPU cores, GPU blocks, NPUs, memory controllers, display engines, image signal processors, security blocks, and I/O controllers.</p>
          </Step>
          <Step n="04" title="Functional blocks together can form an SoC">
            <p>An SoC, or System-on-Chip, combines many system functions onto one silicon device. A phone SoC may contain CPUs, GPUs, AI accelerators, media engines, memory controllers, modem-related blocks, and many peripheral interfaces.</p>
          </Step>

          <Note title="Why this matters at work">
            <p>When someone says “the processor has a problem,” ask what layer they actually mean. CPU core? SoC? Package? Board-level power? Firmware? Driver? The word “processor” can hide several different failure domains.</p>
          </Note>
        </section>

        <section id="part-03" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 03</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">How digital logic becomes hardware</h2>
          <p className="mt-5 text-ink-muted">Digital design is not “just software.” It describes hardware that must eventually obey electrical and physical constraints.</p>

          <Step n="01" title="Logic starts as behavior">
            <p>An engineer first thinks in terms of behavior: when these inputs arrive, what outputs should the circuit produce?</p>
          </Step>
          <Step n="02" title="Boolean logic becomes gates">
            <p>That behavior can be represented using logic gates. Gates implement Boolean functions, but real gates have delay, capacitance, power consumption, and physical area.</p>
          </Step>
          <Step n="03" title="Clocked systems need timing discipline">
            <p>Many digital systems use a clock so state changes occur in coordinated steps. Data must arrive at registers within timing windows.</p>
            <p><strong className="text-ink">Setup time</strong> is how early data must be stable before a clock edge. <strong className="text-ink">Hold time</strong> is how long it must remain stable afterward.</p>
          </Step>
          <Step n="04" title="The critical path limits speed">
            <p>The slowest relevant path between sequential elements can determine the maximum safe clock frequency. Faster clock targets therefore make timing closure harder.</p>
          </Step>

          <Note title="Why physics comes back">
            <p>Digital logic looks like perfect 0s and 1s at the abstraction level. The silicon underneath still has resistance, capacitance, leakage, noise, heat, voltage limits, and propagation delay. Physical implementation is where those realities become impossible to ignore.</p>
          </Note>
        </section>

        <section id="part-04" className="mt-16 scroll-mt-24">
          <div className="max-w-3xl">
            <p className="label-mono text-accent">Part 04</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">How a chip is designed: RTL to GDS</h2>
            <p className="mt-5 text-ink-muted">This is the part people often compress into one arrow. It is easier to understand if you treat every stage as a transformation with a different question.</p>
          </div>

          <div className="mt-8 max-w-4xl">
            <Step n="01" title="Architecture: decide what the chip must contain">
              <p><strong className="text-ink">Question:</strong> What functions must this chip perform?</p>
              <p>Architects decide major blocks, performance targets, interfaces, memory hierarchy, accelerators, power domains, and trade-offs.</p>
              <p><strong className="text-ink">Output:</strong> an architecture and specification that design teams can implement.</p>
            </Step>
            <Step n="02" title="RTL: describe the hardware behavior">
              <p>RTL means Register Transfer Level. Engineers use hardware description languages such as Verilog, SystemVerilog, or VHDL to describe how data moves and how logic behaves across clock cycles.</p>
              <p><strong className="text-ink">Important:</strong> RTL is not yet a physical layout. It says what hardware should do, not where every transistor will sit.</p>
            </Step>
            <Step n="03" title="Verification: prove the logic behaves correctly">
              <p>Before turning the design into physical hardware, teams simulate and verify that it behaves according to specification.</p>
              <p>Typical failures here are functional bugs, protocol mistakes, corner cases, reset problems, and incorrect interactions between blocks.</p>
            </Step>
            <Step n="04" title="Synthesis: convert RTL into a gate-level netlist">
              <p>Synthesis maps RTL behavior into a network of standard cells and logical connections from a technology library.</p>
              <p><strong className="text-ink">Input:</strong> RTL + timing constraints + target technology library.</p>
              <p><strong className="text-ink">Output:</strong> gate-level netlist.</p>
            </Step>
            <Step n="05" title="Static timing analysis: ask whether signals arrive on time">
              <p>STA checks timing paths without simulating every possible input sequence. It evaluates whether setup and hold requirements are met across operating corners.</p>
              <p>If timing fails, engineers may change logic, constraints, cell choices, buffering, placement, or the clock target.</p>
            </Step>
            <Step n="06" title="Floorplanning: decide where the big blocks go">
              <p>Large macros, memories, I/O, power structures, and major functional regions are arranged before detailed placement.</p>
              <p>A bad floorplan can create routing congestion, long critical paths, power problems, and thermal concentration.</p>
            </Step>
            <Step n="07" title="Placement: give standard cells physical locations">
              <p>The synthesized standard cells now need actual coordinates on the die.</p>
            </Step>
            <Step n="08" title="CTS: build the clock distribution network">
              <p>Clock Tree Synthesis distributes the clock across the chip while controlling delay and skew. A clock that arrives too differently across the design can create timing failures.</p>
            </Step>
            <Step n="09" title="Routing: connect the placed cells with metal wires">
              <p>Routers create the physical interconnect between cells using the available metal layers and design rules.</p>
              <p>At advanced nodes, the wires themselves are a major part of performance and power.</p>
            </Step>
            <Step n="10" title="Extraction and signoff: check the physical design against reality">
              <p>Parasitic resistance and capacitance are extracted from the layout. Teams then re-check timing, power integrity, signal integrity, design-rule compliance, and layout-versus-schematic consistency.</p>
            </Step>
            <Step n="11" title="GDS and tape-out: hand manufacturing data to the foundry">
              <p>After signoff, the final layout database is prepared for fabrication. Tape-out is the milestone where the design is released to manufacturing.</p>
            </Step>
          </div>

          <Note title="The whole RTL-to-GDS chain in one sentence">
            <p>RTL describes behavior → synthesis creates gates → physical design places and connects those gates → signoff verifies the physical implementation → GDS becomes the manufacturing handoff.</p>
          </Note>
        </section>

        <section id="part-05" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 05</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">How a wafer is manufactured</h2>
          <p className="mt-5 text-ink-muted">The foundry does not “print a chip once.” It repeatedly modifies thin layers on a wafer until the transistor structures and interconnect stack exist.</p>

          <Step n="01" title="Start with a prepared silicon wafer">
            <p>The wafer provides the substrate on which devices will be built.</p>
          </Step>
          <Step n="02" title="Add or grow material layers">
            <p>Processes such as oxidation and deposition create insulating, conducting, or structural films.</p>
          </Step>
          <Step n="03" title="Coat the wafer with photoresist">
            <p>Photoresist is a light-sensitive material used during lithography to define patterns.</p>
          </Step>
          <Step n="04" title="Lithography transfers a pattern">
            <p>Light is projected through an optical system so selected regions of the resist are chemically changed. Advanced processes use EUV for some of the most difficult layers.</p>
          </Step>
          <Step n="05" title="Develop and etch the pattern">
            <p>After the resist is developed, etching selectively removes exposed material so the intended structure remains.</p>
          </Step>
          <Step n="06" title="Introduce dopants where needed">
            <p>Ion implantation or related processes change the electrical properties of selected silicon regions.</p>
          </Step>
          <Step n="07" title="Planarize with CMP">
            <p>Chemical Mechanical Planarization flattens the wafer surface so later layers can be fabricated accurately.</p>
          </Step>
          <Step n="08" title="Repeat many times">
            <p>Modern chips require many patterning, deposition, etch, implant, clean, and planarization steps. Transistor structures are built first, then many interconnect layers connect them.</p>
          </Step>

          <Note title="A useful distinction">
            <p><strong className="text-ink">Wafer fabrication</strong> is not the same thing as PCB assembly. A factory mounting packaged chips onto circuit boards is doing electronics manufacturing, not semiconductor wafer fabrication.</p>
          </Note>
        </section>

        <section id="part-06" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 06</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Packaging, testing, and binning</h2>
          <p className="mt-5 text-ink-muted">Finishing the wafer does not mean the product is ready. The die must be tested, separated, packaged, tested again, and graded.</p>

          <Step n="01" title="Wafer sort tests dies before dicing">
            <p>Probe equipment contacts structures on the wafer and runs electrical tests. This helps identify dies that are clearly defective before packaging cost is added.</p>
          </Step>
          <Step n="02" title="Dicing separates the wafer into individual dies">
            <p>The wafer is cut so each usable die can move into assembly.</p>
          </Step>
          <Step n="03" title="The die is attached and electrically connected">
            <p>Depending on the package, connections may use wire bonding, flip-chip bumps, advanced substrates, interposers, or other approaches.</p>
          </Step>
          <Step n="04" title="The package provides more than protection">
            <p>The package must route signals and power, remove heat, mechanically protect the die, and connect the silicon to the PCB.</p>
          </Step>
          <Step n="05" title="Final test checks the packaged device">
            <p>Devices are tested for functionality, performance, power, and other specifications after package assembly.</p>
          </Step>
          <Step n="06" title="Binning groups parts by achieved characteristics">
            <p>Not every manufactured die performs identically. Binning can separate devices by performance, power, or other validated characteristics.</p>
          </Step>

          <Note title="OSAT vs PCBA">
            <p>OSAT work concerns semiconductor assembly and test. PCBA concerns assembling electronic components onto a printed circuit board. They are adjacent in the product chain but they are not the same manufacturing layer.</p>
          </Note>
        </section>

        <section id="part-07" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 07</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Why modern chips need GAA, EUV, HBM, and chiplets</h2>
          <p className="mt-5 text-ink-muted">Modern semiconductor progress is no longer just “make every transistor smaller.” Several limits now interact: transistor electrostatics, lithography, wire delay, power delivery, memory bandwidth, package bandwidth, yield, and heat.</p>

          <Step n="01" title="FinFET improved gate control">
            <p>Instead of a planar channel, the gate wraps around multiple sides of a fin-shaped channel. This gives stronger electrostatic control as dimensions shrink.</p>
          </Step>
          <Step n="02" title="GAA wraps the gate around the channel even more completely">
            <p>Gate-All-Around structures such as nanosheets improve control further. This is one reason leading-edge process generations are moving beyond FinFET.</p>
          </Step>
          <Step n="03" title="EUV helps print very small features">
            <p>Extreme Ultraviolet lithography uses much shorter-wavelength light than older DUV approaches for selected advanced layers. High-NA EUV aims to push patterning capability further.</p>
          </Step>
          <Step n="04" title="Backside power separates power delivery from signal routing">
            <p>Traditional power and signal routing compete for resources on the same side of the wafer. Backside power approaches move part of the power delivery network to the back side, potentially reducing congestion and improving power delivery.</p>
          </Step>
          <Step n="05" title="HBM attacks the memory bandwidth bottleneck">
            <p>High Bandwidth Memory stacks DRAM dies and places memory close to compute through advanced packaging. This provides much more bandwidth than conventional off-package memory interfaces, which is especially useful for AI and HPC workloads.</p>
          </Step>
          <Step n="06" title="Chiplets split one giant die into multiple dies">
            <p>Instead of forcing every function onto one monolithic die, chiplet systems divide the design across multiple dies and connect them through advanced packaging.</p>
            <p>This can improve modularity, reuse, process-node optimization, and sometimes yield economics, but it creates new challenges in die-to-die communication, packaging, thermals, test, and system integration.</p>
          </Step>
          <Step n="07" title="UCIe standardizes one part of the chiplet interface problem">
            <p>UCIe defines an open die-to-die interconnect ecosystem intended to help interoperable chiplet architectures.</p>
          </Step>

          <Note title="Modern scaling in one line">
            <p>Performance now comes from coordinated progress across transistor design, lithography, power delivery, interconnect, memory, packaging, and architecture.</p>
          </Note>
        </section>

        <section id="part-08" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 08</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">How silicon becomes a real product</h2>
          <p className="mt-5 text-ink-muted">A working chip is only one ingredient. Most product teams operate above the silicon layer, integrating a platform into a board, firmware stack, enclosure, power system, connectivity stack, and manufacturable product.</p>

          <Step n="01" title="Select the SoC or chipset">
            <p>The choice depends on performance, power, connectivity, software support, cost, supply, certification needs, and vendor roadmap.</p>
          </Step>
          <Step n="02" title="Start from an EVK or reference design">
            <p>An evaluation kit proves the platform works in a known configuration. A reference design gives the product team a starting point for schematic, board layout, power, RF, and software integration.</p>
          </Step>
          <Step n="03" title="Design the custom board">
            <p>The team creates the schematic and PCB around the selected platform: power rails, clocks, memory, connectors, radios, sensors, display, storage, and other peripherals.</p>
          </Step>
          <Step n="04" title="Bring up the first hardware">
            <p>Bring-up means proving the board can power correctly, boot, communicate with memory and peripherals, and run the expected software stack.</p>
          </Step>
          <Step n="05" title="Integrate BSP, drivers, OS, and application software">
            <p>The BSP provides low-level support for the board. Drivers expose hardware devices. The OS and higher layers are then integrated on top.</p>
          </Step>
          <Step n="06" title="EVT asks whether the engineering concept works">
            <p>Engineering Validation Test focuses on whether the design fundamentally works. Teams find obvious electrical, mechanical, thermal, RF, firmware, and integration issues.</p>
          </Step>
          <Step n="07" title="DVT asks whether the design survives the real requirements">
            <p>Design Validation Test checks a more mature design against product requirements, environmental conditions, reliability targets, certification needs, and edge cases.</p>
          </Step>
          <Step n="08" title="PVT asks whether manufacturing can repeat it">
            <p>Production Validation Test is about production readiness. The question shifts from “can engineering make it work?” to “can manufacturing build this consistently?”</p>
          </Step>
          <Step n="09" title="Mass production begins only after the process is stable enough">
            <p>At MP, supply chain, manufacturing, quality, test, firmware release, traceability, and change control all matter.</p>
          </Step>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <Term term="BOM">The complete component list, including cost, approved alternatives, lifecycle state, and supply risk.</Term>
            <Term term="DFM">Design for Manufacturability: make the design easier and more reliable to build.</Term>
            <Term term="NPI">New Product Introduction: the controlled transition from engineering builds toward repeatable production.</Term>
            <Term term="ECO / ECN">Formal mechanisms for controlling engineering changes after a design has been released.</Term>
            <Term term="EOL">End-of-life risk when a component or platform is being discontinued.</Term>
            <Term term="Lead time / MOQ">How long supply takes and the minimum order quantity required by a supplier.</Term>
          </dl>
        </section>

        <section id="part-09" className="mt-16 max-w-3xl scroll-mt-24">
          <p className="label-mono text-accent">Part 09</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">How to read a hardware / ODM project at work</h2>
          <p className="mt-5 text-ink-muted">The fastest way to understand a company is to trace one finished product backward rather than trying to memorize the whole organization chart.</p>

          <Step n="01" title="Start from the product requirement">
            <p>Who is the user? What problem does the product solve? What are the performance, cost, certification, power, connectivity, and environmental constraints?</p>
          </Step>
          <Step n="02" title="Identify the platform boundary">
            <p>Which SoC or chipset is used? Which parts come from the silicon vendor? Which parts came from a reference design? Which parts are genuinely internal IP?</p>
          </Step>
          <Step n="03" title="Find the artifacts">
            <p>Ask for the system block diagram, schematic, PCB files, BOM, firmware tree, BSP, drivers, validation reports, issue logs, and manufacturing test documents.</p>
          </Step>
          <Step n="04" title="Map ownership">
            <p>Who owns the board? Firmware? RF? Mechanical? Thermal? Factory test? Supplier relationship? Certification? Field updates?</p>
          </Step>
          <Step n="05" title="Read the failures, not just the final design">
            <p>Bring-up logs and EVT/DVT issues often teach more than polished architecture slides. They reveal where the real integration boundaries are weak.</p>
          </Step>
          <Step n="06" title="Separate design capability from manufacturing capability">
            <p>A company can be strong at system integration without designing custom silicon. It can manufacture electronics without owning a wafer fab. It can assemble PCBs without being an OSAT.</p>
          </Step>
          <Step n="07" title="Look for recurring bottlenecks">
            <p>Common bottlenecks include thermal limits, RF tuning, unstable power, component shortages, BSP quality, driver support, certification delays, manufacturing yield, and change-control discipline.</p>
          </Step>

          <Note title="Questions worth asking in the first few weeks">
            <p>What is fully designed in-house?</p>
            <p>What comes from the chipset vendor?</p>
            <p>Which supplier owns the hardest dependency?</p>
            <p>Which product has the most painful bring-up history?</p>
            <p>What usually causes EVT or DVT failure?</p>
            <p>Which BOM components have no safe alternative?</p>
            <p>What can block mass production even when engineering says the product “works”?</p>
          </Note>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <p className="label-mono text-accent">Put the whole chain together</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">From requirement to deployed product</h2>
          <div className="mt-7 overflow-x-auto rounded-sm border border-line bg-surface p-5">
            <code className="block min-w-[54rem] whitespace-pre font-mono text-sm leading-7 text-ink-muted">{`product requirement
→ system architecture
→ choose / design silicon platform
→ RTL + verification
→ synthesis + timing
→ floorplan + placement + CTS + routing
→ signoff + GDS
→ wafer fabrication
→ wafer sort
→ dicing + package assembly
→ final test + binning
→ SoC / chipset goes onto board
→ schematic + PCB + BOM
→ bring-up + BSP + drivers
→ EVT
→ DVT
→ NPI / DFM
→ PVT
→ mass production
→ field deployment + support`}</code>
          </div>
          <p className="mt-5 max-w-3xl text-ink-muted">Not every company owns every stage. The skill is knowing where one team stops, where another begins, what artifact crosses the boundary, and what can fail at the handoff.</p>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <p className="label-mono text-accent">Primary learning sources</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Where to go deeper</h2>
          <p className="mt-4 max-w-3xl text-ink-muted">Courses and textbooks are better for durable fundamentals; vendor and standards sources are better for fast-moving topics such as leading-edge process technology, EUV, HBM, and chiplets.</p>
          <div className="mt-7 border-b border-line">
            {resources.map((resource) => (
              <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer" className="group grid gap-2 border-t border-line py-5 transition-colors hover:bg-surface sm:grid-cols-[1fr_auto] sm:items-center sm:px-2">
                <span className="font-medium text-ink">{resource.label}</span>
                <ExternalLink className="size-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-sm border border-line bg-surface p-6 sm:p-8">
          <p className="label-mono text-accent">Final takeaway</p>
          <h2 className="mt-3 text-3xl leading-tight">You do not need to become every engineer in the chain</h2>
          <div className="mt-5 space-y-4 text-ink-muted">
            <p>The goal is not to become a transistor physicist, physical-design engineer, package engineer, firmware engineer, RF engineer, and factory engineer at the same time.</p>
            <p>The useful skill for research, product, and innovation work is being able to follow the chain, understand what each layer owns, identify the input and output of each handoff, and know which question to ask next when something fails.</p>
          </div>
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
