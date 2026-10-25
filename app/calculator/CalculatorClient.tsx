"use client";

import { useMemo, useReducer, useState } from "react";
import { CalcState, DEFAULT_STATE } from "./state";
import { compute } from "@/lib/calculations/compute";
import { VEHICLES } from "@/lib/data/vehicles";
import { FUEL_PRICES } from "@/lib/data/fuelPrices";
import { sgd } from "@/lib/format";
import { Field, RadioGroup } from "@/components/Field";
import { ResultHero } from "@/components/ResultHero";
import { Breakdown } from "@/components/Breakdown";
import { LoanCompare } from "@/components/LoanCompare";
import { Assumptions } from "@/components/Assumptions";
import { CalcDetail } from "@/components/CalcDetail";
import { AdSlot } from "@/components/AdSlot";
import { calcAffordability } from "@/lib/calculations/affordability";

type Patch = Partial<CalcState>;
function reducer(state: CalcState, patch: Patch): CalcState {
  return { ...state, ...patch };
}

const STEPS = ["Vehicle", "Driving", "Parking", "Financing", "Running costs", "Results"] as const;

export function CalculatorClient() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [step, setStep] = useState(0);
  const result = useMemo(() => compute(state), [state]);
  const affordability = useMemo(
    () =>
      calcAffordability({
        monthlyTakeHome: state.takeHome,
        housingMonthly: state.housing,
        otherDebtMonthly: state.otherDebt,
        carMonthlyCost: result.monthly,
      }),
    [state, result.monthly]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,22rem]">
      <div className="space-y-6">
        <Stepper step={step} />

        {step === 0 && <StepCar s={state} on={dispatch} />}
        {step === 1 && <StepDriving s={state} on={dispatch} />}
        {step === 2 && <StepParking s={state} on={dispatch} />}
        {step === 3 && <StepFinancing s={state} on={dispatch} />}
        {step === 4 && <StepRunning s={state} on={dispatch} />}
        {step === 5 && (
          <StepResults s={state} on={dispatch} r={result} affordability={affordability} />
        )}

        <AdSlot type="in-content" />

        <div className="flex items-center justify-between">
          <button
            className="btn btn-ghost"
            onClick={() => setStep((n) => Math.max(0, n - 1))}
            disabled={step === 0}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep((n) => n + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => setStep(0)}>
              Edit inputs
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Live estimate
          </div>
          <div className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
            {sgd(result.monthly)}
          </div>
          <div className="text-xs text-ink-600">per month · updates as you edit</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-600">
            <Mini label="Instalment" value={sgd(result.breakdown.financing)} />
            <Mini label="Depreciation" value={sgd(result.breakdown.depreciation)} />
            <Mini label="Energy" value={sgd(result.breakdown.energy)} />
            <Mini label="Parking" value={sgd(result.breakdown.parking)} />
            <Mini label="Insurance" value={sgd(result.breakdown.insurance)} />
            <Mini label="Road tax" value={sgd(result.breakdown.roadTax)} />
          </div>
        </div>
        <AdSlot type="sidebar" />
      </aside>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-ink-400">{label}</div>
      <div className="font-medium text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs" aria-label="Progress">
      {STEPS.map((s, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                active ? "bg-ink-900 text-white" : done ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-600"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {i + 1}
            </span>
            <span className={`${active ? "text-ink-900" : "text-ink-400"} font-medium`}>{s}</span>
            {i < STEPS.length - 1 && <span className="text-ink-200">·</span>}
          </li>
        );
      })}
    </ol>
  );
}

/* -------- Steps -------- */

function Card({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-xs text-ink-600">{hint}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Num({
  value,
  onChange,
  min,
  suffix,
  prefix,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [raw, setRaw] = useState<string>(String(value ?? 0));
  const [focused, setFocused] = useState(false);
  // Keep the input in sync with external state when not focused.
  if (!focused && raw !== String(value) && Number(raw) !== value) {
    setRaw(String(value));
  }
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-ink-200 bg-white transition focus-within:border-ink-900 focus-within:ring-4 focus-within:ring-ink-900/5">
      {prefix && (
        <span className="flex items-center bg-ink-50 px-3 text-sm font-medium text-ink-500 select-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        className="w-full border-0 bg-transparent px-3.5 py-2.5 text-sm tabular-nums text-left outline-none focus:ring-0"
        value={raw}
        onFocus={(e) => {
          setFocused(true);
          e.currentTarget.select();
        }}
        onBlur={() => {
          setFocused(false);
          const n = parseFloat(raw);
          const final = Number.isFinite(n) ? n : 0;
          onChange(final);
          setRaw(String(final));
        }}
        onChange={(e) => {
          const next = e.target.value.replace(/[^0-9.\-]/g, "");
          setRaw(next);
          const n = parseFloat(next);
          if (Number.isFinite(n)) onChange(n);
        }}
        min={min}
      />
      {suffix && (
        <span className="flex items-center bg-ink-50 px-3 text-xs font-medium text-ink-500 select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function SgcmImport({ on }: { on: (p: Patch) => void }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [msg, setMsg] = useState("");
  const [detail, setDetail] = useState<any>(null);

  async function run() {
    if (!url) return;
    setState("loading");
    setMsg("");
    setDetail(null);
    try {
      const res = await fetch("/api/sgcarmart/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.ok && data.result) {
        const r = data.result;
        const patch: Patch = { vehicleId: undefined };
        patch.vehicleName =
          [r.make, r.model, r.variant].filter(Boolean).join(" ") || r.carModel || "SGCarMart listing";
        if (r.price) patch.purchasePrice = r.price;
        if (r.engineCc) patch.engineCc = r.engineCc;
        if (r.fuelType) patch.fuelType = r.fuelType;
        if (r.images?.[0]) patch.vehicleImage = r.images[0];
        on(patch);
        setState("ok");
        setMsg(`Imported ${patch.vehicleName}.`);
        setDetail(r);
      } else {
        setState("fail");
        setMsg(data.error || "Could not import this listing.");
      }
    } catch (e: any) {
      setState("fail");
      setMsg(e?.message || "Network error.");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pop-sky/40 via-white to-pop-mint/30 p-5 ring-1 ring-ink-100 sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-xl text-white">
          🚗
        </div>
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Import from SGCarMart</h2>
          <p className="mt-1 text-sm text-ink-600">
            Paste a listing URL — we read make, model, price, engine, fuel, mileage, COE and more.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <input
          type="url"
          className="input flex-1 bg-white"
          placeholder="https://www.sgcarmart.com/listing/…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={run}
          disabled={state === "loading" || !url}
        >
          {state === "loading" ? "Reading…" : "Import listing"}
        </button>
      </div>
      {msg && (
        <p
          className={`mt-3 text-sm ${state === "ok" ? "text-emerald-700" : "text-red-700"}`}
          role="status"
        >
          {state === "ok" ? "✓ " : "⚠ "}
          {msg}
        </p>
      )}
      {detail && (
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-600 sm:grid-cols-4">
          {detail.price ? <Mini label="Price" value={`$${detail.price.toLocaleString()}`} /> : null}
          {detail.engineCc ? <Mini label="Engine" value={`${detail.engineCc} cc`} /> : null}
          {detail.fuelType ? <Mini label="Fuel" value={detail.fuelType} /> : null}
          {detail.mileage && detail.mileage !== "N.A." ? <Mini label="Mileage" value={detail.mileage} /> : null}
          {detail.regDate ? <Mini label="Reg date" value={detail.regDate} /> : null}
          {detail.coeEnd ? <Mini label="COE end" value={detail.coeEnd} /> : null}
          {detail.depreciation && detail.depreciation !== "N.A." ? <Mini label="Depreciation" value={detail.depreciation} /> : null}
        </dl>
      )}
    </section>
  );
}

function HdbLookup({
  postal,
  onPostal,
  onRate,
}: {
  postal: string;
  onPostal: (p: string) => void;
  onRate: (rate: number, label: string) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [msg, setMsg] = useState("");

  async function run() {
    const p = postal.replace(/\D/g, "");
    if (p.length !== 6) {
      setState("fail");
      setMsg("Enter a 6-digit postal code.");
      return;
    }
    setState("loading");
    setMsg("");
    try {
      const r = await fetch(`/api/parking?postal=${p}`);
      const data = await r.json();
      if (data.ok && data.rate) {
        onRate(data.rate, data.carpark?.carpark_no ?? "HDB");
        setState("ok");
        setMsg(`${data.carpark?.carpark_no ?? "Carpark"} · ${data.note} · $${data.rate}/mo`);
      } else {
        setState("fail");
        setMsg(data.error || data.note || "Not found");
      }
    } catch (e: any) {
      setState("fail");
      setMsg(e?.message || "Network error");
    }
  }

  return (
    <div className="rounded-xl bg-ink-50 p-4">
      <div className="text-sm font-medium">Live HDB season parking lookup</div>
      <p className="mt-1 text-xs text-ink-600">
        Nearest HDB carpark via data.gov.sg + OneMap. Enter home postal code.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="input flex-1"
          placeholder="e.g. 310120"
          value={postal}
          onChange={(e) => onPostal(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        <button type="button" className="btn btn-outline" onClick={run} disabled={state === "loading"}>
          {state === "loading" ? "…" : "Look up"}
        </button>
      </div>
      {msg && (
        <p className={`mt-2 text-xs ${state === "ok" ? "text-emerald-700" : "text-red-700"}`}>{msg}</p>
      )}
    </div>
  );
}

function StepCar({ s, on }: { s: CalcState; on: (p: Patch) => void }) {
  return (
    <>
      <Card title="Car or motorcycle?" hint="Switch to motorcycle for bike-specific road tax, insurance and no ERP.">
        <div className="sm:col-span-2">
          <RadioGroup
            name="Vehicle kind"
            value={s.kind}
            onChange={(v) => on({ kind: v, fuelType: v === "bike" ? "petrol" : s.fuelType })}
            options={[
              { value: "car", label: "🚗 Car" },
              { value: "bike", label: "🏍 Motorcycle" },
            ]}
          />
        </div>
      </Card>
      {s.kind === "car" && <SgcmImport on={on} />}
      <Card title="Vehicle details" hint="Pre-filled from import or catalogue.">
        {s.vehicleImage && (
          <div className="sm:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.vehicleImage}
              alt=""
              className="h-40 w-full rounded-xl object-cover"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <Field label="Vehicle">
            <select
              className="input"
              value={s.vehicleId ?? ""}
              onChange={(e) => {
                const v = VEHICLES.find((x) => x.id === e.target.value) as any;
                if (!v) return;
                on({
                  vehicleId: v.id,
                  vehicleName: `${v.make} ${v.model} ${v.variant}`,
                  vehicleImage: v.hero_image || undefined,
                  purchasePrice: Number(v.purchase_price),
                  fuelType: v.fuel_type,
                  engineCc: Number(v.engine_cc ?? 0),
                  motorKw: Number(v.motor_power_kw ?? 0),
                  litresPer100km: Number(v.fuel_efficiency_l_100km ?? s.litresPer100km),
                  kwhPer100km: Number(v.energy_kwh_100km ?? s.kwhPer100km),
                });
              }}
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.variant} — {sgd(v.purchase_price)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Purchase price">
          <Num prefix="$" value={s.purchasePrice} onChange={(n) => on({ purchasePrice: n })} />
        </Field>
        <Field label="Fuel type">
          <RadioGroup
            name="Fuel type"
            value={s.fuelType}
            onChange={(v) => on({ fuelType: v })}
            options={
              s.kind === "bike"
                ? [
                    { value: "petrol", label: "Petrol" },
                    { value: "ev", label: "Electric" },
                  ]
                : [
                    { value: "petrol", label: "Petrol" },
                    { value: "diesel", label: "Diesel" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "ev", label: "EV" },
                  ]
            }
          />
        </Field>
        {s.fuelType !== "ev" ? (
          <>
            <Field label="Engine capacity">
              <Num suffix="cc" value={s.engineCc} onChange={(n) => on({ engineCc: n })} />
            </Field>
            <Field label="Fuel economy">
              <Num suffix="L/100km" value={s.litresPer100km} onChange={(n) => on({ litresPer100km: n })} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Motor power">
              <Num suffix="kW" value={s.motorKw} onChange={(n) => on({ motorKw: n })} />
            </Field>
            <Field label="Energy use">
              <Num suffix="kWh/100km" value={s.kwhPer100km} onChange={(n) => on({ kwhPer100km: n })} />
            </Field>
          </>
        )}
      </Card>
      <p className="text-xs text-ink-400">
        SGCarMart import is best-effort. If a field didn't populate, fill it in manually above.
      </p>
    </>
  );
}


function StepDriving({ s, on }: { s: CalcState; on: (p: Patch) => void }) {
  const monthlyKm = Math.round(s.annualKm / 12);
  return (
    <Card title="Tell us about your driving">
      <Field label="Your age">
        <Num value={s.age} onChange={(n) => on({ age: n })} />
      </Field>
      <Field label="Years holding licence">
        <Num value={s.yearsLicensed} onChange={(n) => on({ yearsLicensed: n })} />
      </Field>
      <Field label={`Mileage (${s.mileageUnit === "mo" ? "per month" : "per year"})`}>
        <div className="space-y-2">
          <Num
            suffix={s.mileageUnit === "mo" ? "km/mo" : "km/yr"}
            value={s.mileageUnit === "mo" ? monthlyKm : s.annualKm}
            onChange={(n) => on({ annualKm: s.mileageUnit === "mo" ? Math.round(n * 12) : n })}
          />
          <div className="flex items-center justify-between text-xs">
            <RadioGroup
              name="Mileage unit"
              value={s.mileageUnit}
              onChange={(v) => on({ mileageUnit: v })}
              options={[
                { value: "yr", label: "/ year" },
                { value: "mo", label: "/ month" },
              ]}
            />
            <span className="text-ink-400">
              = {s.mileageUnit === "mo" ? `${s.annualKm.toLocaleString()} km/yr` : `${monthlyKm.toLocaleString()} km/mo`}
            </span>
          </div>
        </div>
      </Field>
      <Field label="NCD">
        <select
          className="input"
          value={s.ncdPct}
          onChange={(e) => on({ ncdPct: parseFloat(e.target.value) })}
        >
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((p) => (
            <option key={p} value={p}>
              {Math.round(p * 100)}%
            </option>
          ))}
        </select>
      </Field>

      {s.fuelType !== "ev" ? (
        <>
          <Field label="Petrol grade">
            <RadioGroup
              name="Petrol grade"
              value={s.petrolGrade}
              onChange={(v) => on({ petrolGrade: v, pricePerLitre: FUEL_PRICES[v] })}
              options={[
                { value: "92", label: "92" },
                { value: "95", label: "95" },
                { value: "98", label: "98" },
                { value: "diesel", label: "Diesel" },
              ]}
            />
          </Field>
          <Field label="Pump price" hint={`Default from indicative pricing (${FUEL_PRICES.effective_date})`}>
            <Num prefix="$" suffix="/L" value={s.pricePerLitre} onChange={(n) => on({ pricePerLitre: n })} />
          </Field>
        </>
      ) : (
        <>
          <Field label="Home charging rate">
            <Num prefix="$" suffix="/kWh" value={s.homeKwhRate} onChange={(n) => on({ homeKwhRate: n })} />
          </Field>
          <Field label="Public charging rate">
            <Num prefix="$" suffix="/kWh" value={s.publicKwhRate} onChange={(n) => on({ publicKwhRate: n })} />
          </Field>
          <Field label="% charged at home">
            <Num
              suffix="%"
              value={Math.round(s.homeChargePct * 100)}
              onChange={(n) => on({ homeChargePct: Math.min(1, Math.max(0, n / 100)) })}
            />
          </Field>
        </>
      )}
    </Card>
  );
}

function StepParking({ s, on }: { s: CalcState; on: (p: Patch) => void }) {
  return (
    <Card title="Parking" hint="Season parking at home, parking at work, and anywhere else you regularly park.">
      <Field label="Home parking type">
        <RadioGroup
          name="Home parking type"
          value={s.parkingType}
          onChange={(v) => on({ parkingType: v })}
          options={[
            { value: "hdb", label: "HDB season" },
            { value: "condo", label: "Condo" },
            { value: "landed", label: "Landed" },
            { value: "street", label: "Street" },
            { value: "private", label: "Private" },
            { value: "other", label: "Other" },
          ]}
        />
      </Field>
      {s.parkingType === "hdb" && (
        <div className="sm:col-span-2">
          <HdbLookup
            postal={s.postalCode}
            onPostal={(p) => on({ postalCode: p })}
            onRate={(rate) => on({ homeParking: rate })}
          />
        </div>
      )}
      <Field label="Home parking">
        <Num prefix="$" suffix="/mo" value={s.homeParking} onChange={(n) => on({ homeParking: n })} />
      </Field>
      <Field label="Work parking">
        <Num prefix="$" suffix="/mo" value={s.workParking} onChange={(n) => on({ workParking: n })} />
      </Field>
      <Field label="Other parking">
        <Num prefix="$" suffix="/mo" value={s.otherParking} onChange={(n) => on({ otherParking: n })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="ERP usage" hint="Picks typical monthly ERP charges">
          <RadioGroup
            name="ERP preset"
            value={s.erpPreset}
            onChange={(v) => {
              const presets: Record<string, { tripsPerWeek: number; avgCharge: number }> = {
                none: { tripsPerWeek: 0, avgCharge: 0 },
                occasional: { tripsPerWeek: 3, avgCharge: 2 },
                cbd: { tripsPerWeek: 10, avgCharge: 3 },
                heavy: { tripsPerWeek: 14, avgCharge: 4 },
                custom: { tripsPerWeek: s.erpTripsPerWeek, avgCharge: s.erpAvgCharge },
              };
              const p = presets[v];
              on({ erpPreset: v, erpTripsPerWeek: p.tripsPerWeek, erpAvgCharge: p.avgCharge });
            }}
            options={[
              { value: "none", label: "None" },
              { value: "occasional", label: "Occasional" },
              { value: "cbd", label: "CBD commute" },
              { value: "heavy", label: "Heavy" },
              { value: "custom", label: "Custom" },
            ]}
          />
        </Field>
      </div>
      {s.erpPreset === "custom" && (
        <>
          <Field label="ERP trips / week">
            <Num value={s.erpTripsPerWeek} onChange={(n) => on({ erpTripsPerWeek: n })} />
          </Field>
          <Field label="Avg charge / trip">
            <Num prefix="$" value={s.erpAvgCharge} onChange={(n) => on({ erpAvgCharge: n })} />
          </Field>
        </>
      )}
    </Card>
  );
}

function StepFinancing({ s, on }: { s: CalcState; on: (p: Patch) => void }) {
  const quickButtons = [
    { label: "Full cash", pct: 1, tenure: 0 },
    { label: "Full loan", pct: 0.3, tenure: 7 },
    { label: "70% loan 7y", pct: 0.3, tenure: 7 },
    { label: "60% loan 5y", pct: 0.4, tenure: 5 },
  ];
  return (
    <Card title="Financing" hint="Singapore car loans use a flat interest rate. Effective rate ≈ 1.8× flat.">
      <div className="sm:col-span-2">
        <Field label="Quick scenarios">
          <div className="flex flex-wrap gap-2">
            {quickButtons.map((q) => (
              <button
                key={q.label}
                type="button"
                className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm hover:bg-ink-50"
                onClick={() => on({ downpaymentPct: q.pct, tenureYears: q.tenure || s.tenureYears })}
              >
                {q.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Downpayment">
        <RadioGroup
          name="Downpayment"
          value={String(s.downpaymentPct) as any}
          onChange={(v) => on({ downpaymentPct: parseFloat(v) })}
          options={[
            { value: "0.2", label: "20%" },
            { value: "0.3", label: "30%" },
            { value: "0.4", label: "40%" },
            { value: "0.5", label: "50%" },
            { value: "1", label: "Cash" },
          ]}
        />
      </Field>
      <Field label="Flat interest rate">
        <Num
          suffix="%"
          value={Math.round(s.flatRate * 10000) / 100}
          onChange={(n) => on({ flatRate: n / 100 })}
        />
      </Field>
      <Field label="Loan tenure">
        <select
          className="input"
          value={s.tenureYears}
          onChange={(e) => on({ tenureYears: parseInt(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((y) => (
            <option key={y} value={y}>
              {y} year{y > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Expected ownership period">
        <select
          className="input"
          value={s.ownershipYears}
          onChange={(e) => on({ ownershipYears: parseInt(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 7, 10].map((y) => (
            <option key={y} value={y}>
              {y} year{y > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Expected resale (0 = auto)">
        <Num prefix="$" value={s.expectedResale} onChange={(n) => on({ expectedResale: n })} />
      </Field>
    </Card>
  );
}

function StepRunning({ s, on }: { s: CalcState; on: (p: Patch) => void }) {
  return (
    <>
      <Card title="Insurance" hint="Indicative range only — not an insurance quote.">
        <Field label="Actual annual insurance (override)">
          <Num
            prefix="$"
            suffix="/yr"
            value={s.insuranceAnnualOverride}
            onChange={(n) => on({ insuranceAnnualOverride: n })}
          />
        </Field>
      </Card>
      <Card title="Maintenance & tyres">
        <Field label="Servicing tier">
          <RadioGroup
            name="Servicing tier"
            value={s.maintenanceTier}
            onChange={(v) => on({ maintenanceTier: v, maintenanceCustom: 0 })}
            options={[
              { value: "budget", label: "Budget ($80/mo)" },
              { value: "normal", label: "Normal ($120/mo)" },
              { value: "premium", label: "Premium ($180/mo)" },
            ]}
          />
        </Field>
        <Field label="Custom (overrides tier)">
          <Num prefix="$" suffix="/mo" value={s.maintenanceCustom} onChange={(n) => on({ maintenanceCustom: n })} />
        </Field>
        <Field label="Tyre set cost">
          <Num prefix="$" value={s.tyreSetCost} onChange={(n) => on({ tyreSetCost: n })} />
        </Field>
        <Field label="Tyre replacement interval">
          <Num suffix="km" value={s.tyreIntervalKm} onChange={(n) => on({ tyreIntervalKm: n })} />
        </Field>
      </Card>
      <Card title="Other expenses">
        <Field label="Misc monthly" hint="Car wash, coupons, accessories, roadside assistance, etc.">
          <Num prefix="$" suffix="/mo" value={s.miscMonthly} onChange={(n) => on({ miscMonthly: n })} />
        </Field>
      </Card>
    </>
  );
}

function StepResults({
  s,
  on,
  r,
  affordability,
}: {
  s: CalcState;
  on: (p: Patch) => void;
  r: ReturnType<typeof compute>;
  affordability: ReturnType<typeof calcAffordability>;
}) {
  return (
    <>
      <ResultHero monthly={r.monthly} instalment={r.breakdown.financing} />
      <Breakdown b={r.breakdown} />

      <section className="card p-5">
        <div className="text-sm font-medium text-ink-900">Affordability check</div>
        <p className="mt-1 text-xs text-ink-600">
          Budgeting estimate only. Not financial advice.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Monthly take-home">
            <input
              className="input tabular-nums"
              type="number"
              value={s.takeHome}
              onChange={(e) => on({ takeHome: parseFloat(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Housing / month">
            <input
              className="input tabular-nums"
              type="number"
              value={s.housing}
              onChange={(e) => on({ housing: parseFloat(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Other debt / month">
            <input
              className="input tabular-nums"
              type="number"
              value={s.otherDebt}
              onChange={(e) => on({ otherDebt: parseFloat(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`pill ${
              affordability.rating === "comfortable"
                ? "bg-emerald-100 text-emerald-800"
                : affordability.rating === "stretched"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {affordability.rating}
          </span>
          <div className="text-sm text-ink-600">
            Car is <b>{(affordability.carPctOfTakeHome * 100).toFixed(0)}%</b> of take-home;
            total fixed costs {(affordability.totalFixedPct * 100).toFixed(0)}%.
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-500">{affordability.message}</p>
      </section>

      <Assumptions
        items={[
          { label: "Vehicle", value: s.vehicleName },
          { label: "Purchase price", value: s.purchasePrice, sgd: true },
          { label: "Annual mileage", value: `${s.annualKm.toLocaleString()} km` },
          { label: "Downpayment", value: `${Math.round(s.downpaymentPct * 100)}%` },
          { label: "Flat rate", value: `${(s.flatRate * 100).toFixed(2)}%` },
          { label: "Loan tenure", value: `${s.tenureYears} years` },
          { label: "Ownership period", value: `${s.ownershipYears} years` },
          { label: "Fuel economy", value: s.fuelType === "ev" ? `${s.kwhPer100km} kWh/100km` : `${s.litresPer100km} L/100km` },
          { label: "Energy price", value: s.fuelType === "ev" ? `$${s.homeKwhRate}/kWh home` : `$${s.pricePerLitre}/L` },
          { label: "Parking total", value: s.homeParking + s.workParking + s.otherParking, sgd: true },
          { label: "Road tax (yr)", value: r.roadTaxAnnual, sgd: true },
        ]}
      />

      <LoanCompare
        purchasePrice={s.purchasePrice}
        downpaymentPct={s.downpaymentPct}
        tenureYears={s.tenureYears}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <CalcDetail title="depreciation">
          Purchase price {sgd(s.purchasePrice)} − expected resale ≈ {sgd(s.purchasePrice - r.depreciation.totalDepreciation)} over {s.ownershipYears} years = {sgd(r.depreciation.annualDepreciation)}/year.
        </CalcDetail>
        <CalcDetail title="energy">
          {s.annualKm.toLocaleString()} km × {s.fuelType === "ev" ? `${s.kwhPer100km} kWh/100km × $${s.homeKwhRate}/kWh (${Math.round(s.homeChargePct * 100)}% home)` : `${s.litresPer100km} L/100km × $${s.pricePerLitre}/L`} = {sgd(r.energyMonthly * 12)}/year.
        </CalcDetail>
        <CalcDetail title="road tax">
          {s.fuelType === "ev"
            ? `EV road tax from motor power ${s.motorKw} kW: ${sgd(r.roadTaxAnnual)}/year (indicative LTA formula).`
            : `ICE road tax from engine capacity ${s.engineCc} cc: ${sgd(r.roadTaxAnnual)}/year (indicative LTA formula).`}
        </CalcDetail>
        <CalcDetail title="insurance">
          Based on age {s.age}, {s.yearsLicensed}y licensed, NCD {Math.round(s.ncdPct * 100)}%, vehicle value {sgd(s.purchasePrice)}: range {sgd(r.insurance.low)}–{sgd(r.insurance.high)}/year. Enter your actual quote to override.
        </CalcDetail>
      </div>
    </>
  );
}
