"use client";
import { CostBreakdown } from "@/lib/calculations/types";
import { monthlyTotal } from "@/lib/calculations/totalOwnership";
import { sgd } from "@/lib/format";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const LABELS: Record<keyof CostBreakdown, string> = {
  financing: "Financing",
  depreciation: "Depreciation",
  energy: "Petrol / Energy",
  parking: "Parking",
  insurance: "Insurance",
  roadTax: "Road tax",
  maintenance: "Maintenance",
  tyres: "Tyres",
  erp: "ERP",
  misc: "Other",
};

const COLORS = [
  "#0e1116", "#1e68e0", "#2b7fff", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#06b6d4", "#f472b6", "#64748b",
];

export function Breakdown({ b }: { b: CostBreakdown }) {
  const total = monthlyTotal(b);
  const entries = (Object.keys(LABELS) as (keyof CostBreakdown)[])
    .map((k) => ({ key: k, name: LABELS[k], value: Math.max(0, b[k]) }))
    .filter((e) => e.value > 0.01);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="card p-5 md:col-span-3">
        <div className="mb-3 text-sm font-medium text-ink-600">Monthly breakdown</div>
        <ul className="divide-y divide-ink-100">
          {entries.map((e, i) => {
            const pct = total > 0 ? (e.value / total) * 100 : 0;
            return (
              <li key={e.key} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden
                  />
                  <span className="text-sm text-ink-900">{e.name}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-ink-400">{pct.toFixed(0)}%</span>
                  <span className="tabular-nums text-sm font-semibold">{sgd(e.value)}</span>
                </div>
              </li>
            );
          })}
          <li className="flex items-center justify-between pt-3">
            <span className="text-sm font-semibold">Total</span>
            <span className="tabular-nums text-base font-bold">{sgd(total)}</span>
          </li>
        </ul>
      </div>
      <div className="card p-5 md:col-span-2">
        <div className="mb-3 text-sm font-medium text-ink-600">Share of cost</div>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={entries} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={1}>
                {entries.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => sgd(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
