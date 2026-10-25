"use client";
import { sgd } from "@/lib/format";

export function ResultHero({
  monthly,
  instalment,
}: {
  monthly: number;
  instalment: number;
}) {
  const diff = monthly - instalment;
  const annual = monthly * 12;
  const threeYear = annual * 3;
  return (
    <section className="card p-6 sm:p-8">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
        Your estimated cost of ownership
      </div>
      <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className="text-5xl font-bold tracking-tight sm:text-6xl">
          {sgd(monthly)}
          <span className="ml-1 text-base font-medium text-ink-400">/ month</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-600">
        <span className="chip tabular-nums">{sgd(annual)} / year</span>
        <span className="chip tabular-nums">{sgd(threeYear)} over 3 years</span>
        <span className="chip tabular-nums">{sgd(monthly / 30)} / day</span>
      </div>
      {instalment > 0 && (
        <div className="mt-6 grid gap-3 rounded-xl bg-ink-50 p-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-ink-400">Loan instalment</div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{sgd(instalment)}</div>
          </div>
          <div>
            <div className="text-xs text-ink-400">Real monthly cost</div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{sgd(monthly)}</div>
          </div>
          <div>
            <div className="text-xs text-ink-400">Difference</div>
            <div className="mt-1 text-xl font-semibold tabular-nums text-brand-600">
              +{sgd(diff)}
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Your instalment is only one part of owning a car.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
