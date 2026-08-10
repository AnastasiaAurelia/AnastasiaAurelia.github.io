export function DataTable({ value }: { value: { caption?: string; headers: string[]; rows?: Array<{ _key?: string; cells?: string[] }> } }) {
  const minimumWidth = Math.max(42, value.headers.length * 12)

  return <figure className="breakout-wide my-7">
    <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-sm border border-line" role="region" aria-label={value.caption ?? 'Scrollable data table'} tabIndex={0}><table className="w-full table-auto border-collapse text-left text-sm" style={{ minWidth: `${minimumWidth}rem` }}>
      <thead className="bg-surface"><tr>{value.headers.map((header) => <th key={header} scope="col" className="min-w-48 break-words border-b border-line-strong px-4 py-3 font-semibold [word-break:normal]">{header}</th>)}</tr></thead>
      <tbody>{value.rows?.map((row, rowIndex) => <tr key={row._key ?? rowIndex} className="border-b border-line last:border-0">{row.cells?.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row" className="min-w-48 break-words px-4 py-3 align-top font-semibold [word-break:normal]">{cell}</th> : <td key={cellIndex} className="min-w-48 break-words px-4 py-3 align-top text-ink-muted [word-break:normal]">{cell}</td>)}</tr>)}</tbody>
    </table></div>{value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}
