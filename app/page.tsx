import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { VEHICLES } from "@/lib/data/vehicles";
import { sgd } from "@/lib/format";

const CARDS = [
  { label: "Petrol", v: "$273/mo" },
  { label: "Parking", v: "$290/mo" },
  { label: "Insurance", v: "$150/mo" },
  { label: "Road tax", v: "$90/mo" },
  { label: "Depreciation", v: "$650/mo" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-end gap-10 lg:grid-cols-2">
        <div>
          <span className="chip">Singapore</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            What does your car <span className="text-brand-600">really</span> cost?
          </h1>
          <p className="mt-4 max-w-xl text-ink-600">
            Calculate your true monthly cost of owning a car in Singapore. Not just the instalment — depreciation, petrol, parking, insurance, road tax, servicing, tyres and ERP, all together.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/calculator" className="btn btn-primary">
              Calculate my car cost →
            </Link>
            <Link href="/cars" className="btn btn-outline">
              Browse cars
            </Link>
          </div>
        </div>
        <div className="card p-6 sm:p-8">
          <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Your car doesn't cost $1,320/month.
          </div>
          <div className="mt-2 text-sm text-ink-600">It costs:</div>
          <div className="mt-1 text-5xl font-bold tracking-tight sm:text-6xl">$2,184<span className="text-base font-medium text-ink-400"> / month</span></div>
          <p className="mt-3 text-xs text-ink-400">
            Based on an indicative mid-range BMW 320i scenario. Your result will differ.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">More than just your instalment.</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CARDS.map((c) => (
            <div key={c.label} className="card p-4">
              <div className="text-xs text-ink-400">{c.label}</div>
              <div className="mt-1 text-lg font-semibold tabular-nums">{c.v}</div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot type="leaderboard" />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Popular cars</h2>
          <Link href="/cars" className="text-sm text-brand-600">
            All cars →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VEHICLES.slice(0, 8).map((v) => (
            <Link key={v.id} href={`/cars/${v.slug}`} className="card p-4 hover:shadow-md">
              <div className="text-xs text-ink-400">{v.make}</div>
              <div className="text-sm font-semibold">{v.model} {v.variant}</div>
              <div className="mt-2 text-xs text-ink-600">{sgd(v.purchase_price)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          <li>
            <div className="text-xs text-ink-400">1</div>
            <div className="text-sm font-medium">Pick a car</div>
            <p className="mt-1 text-xs text-ink-600">
              Choose from the catalogue or enter price and specs manually.
            </p>
          </li>
          <li>
            <div className="text-xs text-ink-400">2</div>
            <div className="text-sm font-medium">Tell us about you</div>
            <p className="mt-1 text-xs text-ink-600">
              Age, driving history, mileage, parking and ERP usage.
            </p>
          </li>
          <li>
            <div className="text-xs text-ink-400">3</div>
            <div className="text-sm font-medium">See the real cost</div>
            <p className="mt-1 text-xs text-ink-600">
              Monthly, annual and total cost with a transparent breakdown.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
