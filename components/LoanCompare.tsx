"use client";
import { LOAN_RATES as FALLBACK } from "@/lib/data/loans";
import { calcLoan } from "@/lib/calculations/loan";
const LOAN_RATES = FALLBACK;
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
  });
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-sm font-medium text-ink-900">Compare car loans</div>
          <div className="text-xs text-ink-400">
            Indicative rates for illustration. Last updated {LOAN_RATES[0].effective_date}.
          </div>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-5 py-2 text-left">Lender</th>
            <th className="px-5 py-2 text-right">Flat rate</th>
            <th className="px-5 py-2 text-right">Monthly</th>
            <th className="px-5 py-2 text-right">Total interest</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((r) => (
            <tr key={r.lender}>
              <td className="px-5 py-3">{r.lender}</td>
              <td className="px-5 py-3 text-right tabular-nums">{(r.flat_rate * 100).toFixed(2)}%</td>
              <td className="px-5 py-3 text-right tabular-nums font-medium">{sgd(r.monthlyInstalment)}</td>
              <td className="px-5 py-3 text-right tabular-nums text-ink-600">{sgd(r.totalInterest)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
