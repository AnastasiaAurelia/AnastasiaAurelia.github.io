export function DataTable({ value }: { value: { caption?: string; headers: string[]; rows?: Array<{ _key?: string; cells?: string[] }> } }) {
  return <figure className="breakout-wide my-7">
    <div className="overflow-x-auto rounded-sm border border-line"><table className="w-full min-w-[42rem] border-collapse text-left text-sm">
      <thead className="bg-surface"><tr>{value.headers.map((header) => <th key={header} scope="col" className="border-b border-line-strong px-4 py-3 font-semibold">{header}</th>)}</tr></thead>
      <tbody>{value.rows?.map((row, rowIndex) => <tr key={row._key ?? rowIndex} className="border-b border-line last:border-0">{row.cells?.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row" className="px-4 py-3 align-top font-semibold">{cell}</th> : <td key={cellIndex} className="px-4 py-3 align-top text-ink-muted">{cell}</td>)}</tr>)}</tbody>
    </table></div>{value.caption ? <figcaption className="mt-2 text-sm text-ink-faint">{value.caption}</figcaption> : null}
  </figure>
}
