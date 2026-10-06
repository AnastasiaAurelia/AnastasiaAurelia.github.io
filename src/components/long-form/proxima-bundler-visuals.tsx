interface Shot {
  src: string
  label: string
  time: string
  caption: string
  alt: string
}

const SHOTS: Record<string, Shot> = {
  dashboard: {
    src: '/images/articles/proxima/01-dashboard.jpg',
    label: 'Figure 1 · Proxima dashboard',
    time: '00:49',
    caption: 'The starting dashboard. The recording presents Proxima as a control surface for launches, funders, rewards, and multi-chain activity.',
    alt: 'Proxima dashboard showing account metrics, launch count, rewards, funder balance, and a Create Launch button.',
  },
  'token-config': {
    src: '/images/articles/proxima/02-token-config.jpg',
    label: 'Figure 2 · Token configuration',
    time: '01:58',
    caption: 'The basic metadata step: token name, ticker, description, image, and optional links. This part defines identity; it does not yet explain the multi-wallet execution.',
    alt: 'Proxima token configuration form with name, symbol, description, image, and social-link fields.',
  },
  'mode-selector': {
    src: '/images/articles/proxima/03-mode-selector.jpg',
    label: 'Figure 3 · Launch mode selector',
    time: '02:26',
    caption: 'Block-0 and Organic appear as execution modes. The important difference is transaction timing: concentrated at launch versus spread over later blocks.',
    alt: 'Proxima launch settings screen showing Block-0 Mode and Organic Mode options.',
  },
  'block-zero-settings': {
    src: '/images/articles/proxima/04-block-zero-settings.jpg',
    label: 'Figure 4 · Block-0 parameters',
    time: '02:52',
    caption: 'The interface exposes developer allocation, holder count, and acquisition settings. These values describe one coordinated plan even when the resulting holdings appear under several addresses.',
    alt: 'Proxima Block-0 configuration with developer buy, holder-wallet count, and buy settings.',
  },
  funder: {
    src: '/images/articles/proxima/05-funder.jpg',
    label: 'Figure 5 · Funder and wallet distribution',
    time: '03:50',
    caption: 'The funder is the capital source. The table below it shows participating wallets that receive SOL before they can transact.',
    alt: 'Proxima funding screen listing a funder address and several participating wallets with balances.',
  },
  'live-launch': {
    src: '/images/articles/proxima/06-live-launch.jpg',
    label: 'Figure 6 · Live market after launch',
    time: '05:15',
    caption: 'After launch, the dashboard combines public market information with the operator’s controlled-wallet positions. One screen is therefore showing both market state and private coordination state.',
    alt: 'Proxima live token market view with price chart, wallet positions, balances, and trading controls.',
  },
  'wallet-control': {
    src: '/images/articles/proxima/07-wallet-control.jpg',
    label: 'Figure 7 · Coordinated wallet controls',
    time: '06:18',
    caption: 'The wallet table makes the orchestration layer visible: multiple addresses can be selected and managed from one operator interface.',
    alt: 'Proxima wallet-management table showing multiple controlled wallets and buy or sell controls.',
  },
  'organic-mode': {
    src: '/images/articles/proxima/08-organic-mode.jpg',
    label: 'Figure 8 · Organic Mode',
    time: '07:56',
    caption: 'Organic Mode changes how buys are scheduled across blocks. The recording says this creates a less concentrated execution pattern but introduces price and front-running risk.',
    alt: 'Proxima Organic Mode settings screen with holder and timing controls.',
  },
  'organic-funded': {
    src: '/images/articles/proxima/09-organic-funded.jpg',
    label: 'Figure 9 · Organic-mode wallets funded',
    time: '08:55',
    caption: 'Even though execution is spread over time, the wallets are still prepared and funded through one launch workflow. Temporal dispersion does not by itself imply independent ownership.',
    alt: 'Proxima Organic Mode funding screen showing several funded wallets before launch.',
  },
}

function Screenshot({ shot }: { shot: Shot }) {
  return (
    <figure className="article-figure my-12">
      <figcaption className="mb-4">
        <span className="label-mono text-accent">{shot.label}</span>
        <span className="mt-2 block font-serif text-lg leading-snug text-ink">{shot.caption}</span>
      </figcaption>
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        className="w-full rounded-sm border border-line"
      />
      <p className="mt-3 text-sm text-ink-faint">Source frame · {shot.time} in the supplied recording</p>
    </figure>
  )
}

export function ProximaBundlerVisual({ id }: { id: string }) {
  const shot = SHOTS[id]
  return shot ? <Screenshot shot={shot} /> : null
}
