"use client";
import { LOAN_RATES } from "@/lib/data/loans";
import { calcLoan } from "@/lib/calculations/loan";
import { sgd } from "@/lib/format";

export function LoanCompare({
  purchasePrice,
  downpaymentPct,
  tenureYears,
}: {
  purchasePrice: number;
  downpaymentPct: number;
  tenureYears: number;
}) {
  const rows = LOAN_RATES.map((r) => {
    const c = calcLoan({ purchasePrice, downpaymentPct, flatRate: r.flat_rate, tenureYears });
    return { ...r, ...c };
  }).sort((a, b) => a.flat_rate - b.flat_rate);
  const banks = rows.filter((r) => r.type === "bank");
  const inhouse = rows.filter((r) => r.type === "inhouse");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-sm font-semibold text-ink-900">Compare car loans</div>
          <div className="text-xs text-ink-400">
            Indicative flat rates — Last updated {LOAN_RATES[0].effective_date}.
          </div>
        </div>
        <span className="pill bg-pop-mint text-emerald-800">Live sin1</span>
      </div>
      <Table title="Banks" rows={banks} />
      <div className="border-t border-ink-100" />
      <Table title="Finance houses / in-house" rows={inhouse} />
    </div>
  );
}

function Table({ title, rows }: { title: string; rows: any[] }) {
  return (
    <div>
      <div className="bg-ink-50/50 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
        {title}
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-ink-400">
          <tr>
            <th className="px-5 py-2 text-left">Lender</th>
            <th className="px-5 py-2 text-right">Flat</th>
            <th className="px-5 py-2 text-right">Monthly</th>
            <th className="px-5 py-2 text-right">Total interest</th>
            <th className="px-5 py-2 text-right">Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((r, i) => (
            <tr key={r.lender} className="hover:bg-ink-50/40">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span>{r.lender}</span>
                  {i === 0 && <span className="pill bg-pop-yellow/40 text-amber-800">Best</span>}
                </div>
                <div className="text-[11px] text-ink-400">{r.source} · {r.effective_date}</div>
              </td>
              <td className="px-5 py-3 text-right num-xl font-medium">{(r.flat_rate * 100).toFixed(2)}%</td>
              <td className="px-5 py-3 text-right num-xl font-semibold">{sgd(r.monthlyInstalment)}</td>
              <td className="px-5 py-3 text-right num-xl text-ink-600">{sgd(r.totalInterest)}</td>
              <td className="px-5 py-3 text-right">
                <a
                  href={r.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  View ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
