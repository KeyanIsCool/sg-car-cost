"use client";
import { sgd } from "@/lib/format";

export function Assumptions({ items }: { items: { label: string; value: string | number; sgd?: boolean }[] }) {
  return (
    <div className="card p-5">
      <div className="mb-3 text-sm font-medium text-ink-600">Your assumptions</div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2">
            <dt className="text-xs text-ink-600">{it.label}</dt>
            <dd className="text-sm font-medium tabular-nums">
              {typeof it.value === "number" && it.sgd ? sgd(it.value) : it.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-ink-400">
        Edit any assumption in the calculator to see the result update instantly.
      </p>
    </div>
  );
}
