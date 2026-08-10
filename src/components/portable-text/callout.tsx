export function Callout({ value }: { value: { title: string; body: string; tone?: string } }) {
  return <aside className={`my-6 border-l-2 p-5 ${value.tone === 'warning' ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface'}`}>
    <p className="label-mono text-accent">{value.title}</p><p className="mt-3 text-ink">{value.body}</p>
  </aside>
}
