import Link from "next/link";
import { listVehicles } from "@/lib/db";
import { sgd } from "@/lib/format";
import { CarArt, tintFor } from "@/components/CarArt";
import { Reveal } from "@/components/Motion";

export const metadata = { title: "Cars" };
export const revalidate = 300;

export default async function CarsIndex() {
  const vehicles = await listVehicles();
  const makes = Array.from(new Set(vehicles.map((v: any) => v.make))).sort();
  const grouped = Object.fromEntries(
    makes.map((m) => [m, vehicles.filter((v: any) => v.make === m)])
  );

  return (
    <div className="space-y-12">
      <header>
        <span className="chip chip-accent">🚗 {vehicles.length} models · live from Neon</span>
        <h1 className="display mt-4 text-4xl font-bold sm:text-5xl">Cars</h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Click any car to see its all-in monthly cost of ownership in Singapore.
        </p>
      </header>

      <nav aria-label="Jump to make" className="flex flex-wrap gap-2">
        {makes.map((m) => (
          <a
            key={m}
            href={`#${m.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-600 hover:bg-ink-50"
          >
            {m}
          </a>
        ))}
      </nav>

      {makes.map((m) => (
        <section key={m} id={m.toLowerCase().replace(/\s+/g, "-")}>
          <h2 className="display mb-4 text-2xl font-bold">{m}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[m].map((v: any, i: number) => (
              <Reveal key={v.id} delay={i * 0.03}>
                <Link
                  href={`/cars/${v.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="relative aspect-[16/10]"
                    style={{
                      background: `linear-gradient(135deg, ${tintFor(v.id)}22 0%, ${tintFor(v.id)}08 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CarArt tint={tintFor(v.id)} className="h-24 w-48 transition group-hover:scale-110" />
                    </div>
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-700 backdrop-blur">
                        {v.fuel_type}
                      </span>
                      {v.coe_category && (
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-700 backdrop-blur">
                          COE {v.coe_category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-base font-semibold leading-tight">
                      {v.model}
                      <span className="font-normal text-ink-600"> {v.variant}</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div className="num-xl text-xl font-bold">{sgd(Number(v.purchase_price))}</div>
                      <span className="text-xs text-brand-600 opacity-0 transition group-hover:opacity-100">
                        See cost →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
