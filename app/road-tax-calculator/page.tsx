"use client";
import { useState } from "react";
import { roadTaxICE, roadTaxEV, ROAD_TAX_RULES } from "@/lib/calculations/roadTax";
import { sgd } from "@/lib/format";
import { Field, RadioGroup } from "@/components/Field";

export default function Page() {
  const [kind, setKind] = useState<"ice" | "ev">("ice");
  const [cc, setCc] = useState(1998);
  const [kw, setKw] = useState(150);
  const annual = kind === "ice" ? roadTaxICE(cc) : roadTaxEV(kw);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Singapore road tax calculator</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-600">
          Indicative calculation using LTA's published 6-monthly tables. Not an official LTA quote.
        </p>
      </header>
      <section className="card p-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Vehicle type">
            <RadioGroup
              name="type"
              value={kind}
              onChange={(v) => setKind(v)}
              options={[
                { value: "ice", label: "Petrol / Diesel / Hybrid" },
                { value: "ev", label: "Electric" },
              ]}
            />
          </Field>
        </div>
        {kind === "ice" ? (
          <Field label="Engine capacity (cc)">
            <input
              className="input tabular-nums"
              type="number"
              value={cc}
              onChange={(e) => setCc(parseFloat(e.target.value) || 0)}
            />
          </Field>
        ) : (
          <Field label="Motor power (kW)">
            <input
              className="input tabular-nums"
              type="number"
              value={kw}
              onChange={(e) => setKw(parseFloat(e.target.value) || 0)}
            />
          </Field>
        )}
        <div className="sm:col-span-2 flex items-center justify-between rounded-xl bg-ink-50 p-4">
          <div>
            <div className="text-xs text-ink-400">Estimated annual road tax</div>
            <div className="mt-1 text-3xl font-bold tabular-nums">{sgd(annual)}</div>
          </div>
          <div className="text-right text-xs text-ink-500">
            Rules effective {ROAD_TAX_RULES.effective_from}
            <br />
            Source: {ROAD_TAX_RULES.source}
          </div>
        </div>
      </section>
    </div>
  );
}
