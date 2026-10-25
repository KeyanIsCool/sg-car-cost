import Link from "next/link";
import { notFound } from "next/navigation";
import { listVehicles } from "@/lib/db";
import { compute } from "@/lib/calculations/compute";
import { DEFAULT_STATE } from "@/app/calculator/state";
import { sgd } from "@/lib/format";
import { Breakdown } from "@/components/Breakdown";
import { AdSlot } from "@/components/AdSlot";
import { CarArt, tintFor } from "@/components/CarArt";

interface Params {
  make: string;
  model: string;
}

export const revalidate = 600;

export async function generateStaticParams() {
  const rows = await listVehicles();
  return rows.map((v: any) => {
    const [make, model] = v.slug.split("/");
    return { make, model };
  });
}

export async function generateMetadata({ params }: { params: Params }) {
  const slug = `${params.make}/${params.model}`;
  const rows = await listVehicles();
  const v = rows.find((x: any) => x.slug === slug);
  if (!v) return { title: "Car not found" };
  return {
    title: `${v.make} ${v.model} ${v.variant} — cost of ownership in Singapore`,
    description: `Estimated monthly cost of owning a ${v.make} ${v.model} ${v.variant} in Singapore, including loan, depreciation, petrol, parking, insurance and road tax.`,
  };
}

export default async function VehiclePage({ params }: { params: Params }) {
  const slug = `${params.make}/${params.model}`;
  const rows = await listVehicles();
  const v = rows.find((x: any) => x.slug === slug);
  if (!v) notFound();

  const state = {
    ...DEFAULT_STATE,
    vehicleId: v.id,
    vehicleName: `${v.make} ${v.model} ${v.variant}`,
    purchasePrice: Number(v.purchase_price),
    fuelType: v.fuel_type,
    engineCc: Number(v.engine_cc ?? 0),
    motorKw: Number(v.motor_power_kw ?? 0),
    litresPer100km: Number(v.fuel_efficiency_l_100km ?? DEFAULT_STATE.litresPer100km),
    kwhPer100km: Number(v.energy_kwh_100km ?? DEFAULT_STATE.kwhPer100km),
  };
  const r = compute(state);

  return (
    <article className="space-y-8">
      <header>
        <div className="text-xs text-ink-400">{v.make}</div>
        <h1 className="text-3xl font-bold tracking-tight">
          {v.model} {v.variant} — cost of ownership in Singapore
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Indicative estimate using default driving profile. Personalise it for your situation.
        </p>
      </header>

      <section
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10"
        style={{
          background: `linear-gradient(135deg, ${tintFor(v.id)}18 0%, ${tintFor(v.id)}04 60%)`,
        }}
      >
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-ink-400">Estimated monthly ownership</div>
            <div className="num-xl mt-2 text-6xl font-bold sm:text-7xl">{sgd(r.monthly)}</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-600">
              <span className="chip">Price {sgd(Number(v.purchase_price))}</span>
              {v.omv && <span className="chip">OMV {sgd(Number(v.omv))}</span>}
              {v.arf && <span className="chip">ARF {sgd(Number(v.arf))}</span>}
              {v.coe_category && <span className="chip">COE {v.coe_category}</span>}
              <span className="chip">{v.fuel_type}</span>
            </div>
            <div className="mt-6">
              <Link href="/calculator" className="btn btn-accent glow-orange">Calculate my cost →</Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CarArt tint={tintFor(v.id)} className="h-40 w-full max-w-md float" />
          </div>
        </div>
      </section>

      <Breakdown b={r.breakdown} />

      <AdSlot type="in-content" />

      <section className="card p-5 text-sm text-ink-600">
        <h2 className="text-base font-semibold text-ink-900">About this estimate</h2>
        <p className="mt-2">
          The numbers above use default assumptions: 18,000 km/year, 40% downpayment, 2.78% flat
          loan over 7 years, 5-year ownership, mid-range insurance for a 35-year-old with 50% NCD,
          and typical SG parking and ERP. Change any of these in the calculator and the result updates.
        </p>
      </section>
    </article>
  );
}
