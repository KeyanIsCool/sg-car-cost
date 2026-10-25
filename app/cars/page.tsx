import Link from "next/link";
import { VEHICLES } from "@/lib/data/vehicles";
import { sgd } from "@/lib/format";

export const metadata = { title: "Cars" };

export default function CarsIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Cars</h1>
      <p className="text-sm text-ink-600">
        Indicative seed catalogue. Click any car to see cost-of-ownership details.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VEHICLES.map((v) => (
          <Link key={v.id} href={`/cars/${v.slug}`} className="card p-5 hover:shadow-md">
            <div className="text-xs text-ink-400">{v.make}</div>
            <div className="text-base font-semibold">
              {v.model} <span className="font-normal text-ink-600">{v.variant}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-600">
              <span className="chip">{v.fuel_type}</span>
              {v.coe_category && <span className="chip">COE {v.coe_category}</span>}
            </div>
            <div className="mt-3 text-sm font-medium tabular-nums">{sgd(v.purchase_price)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
