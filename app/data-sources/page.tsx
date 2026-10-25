export const metadata = { title: "Data sources" };

export default function Page() {
  return (
    <article className="space-y-4 text-sm text-ink-600">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900">Data sources</h1>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink-400">
          <tr>
            <th className="py-2">Dataset</th>
            <th className="py-2">Source</th>
            <th className="py-2">Last updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          <tr>
            <td className="py-3">Vehicle catalogue</td>
            <td className="py-3">Indicative seed values</td>
            <td className="py-3">2026-10-01</td>
          </tr>
          <tr>
            <td className="py-3">Road tax rules</td>
            <td className="py-3">LTA OneMotoring (indicative)</td>
            <td className="py-3">2024-01-01</td>
          </tr>
          <tr>
            <td className="py-3">Loan rates</td>
            <td className="py-3">Indicative, not current market quotes</td>
            <td className="py-3">2026-10-01</td>
          </tr>
          <tr>
            <td className="py-3">Petrol prices</td>
            <td className="py-3">Indicative seed values</td>
            <td className="py-3">2026-10-01</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-ink-500">
        SGCarMart URL import is not implemented — the site's terms do not permit automated extraction.
        Enter listing details manually.
      </p>
    </article>
  );
}
