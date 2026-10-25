import { PETROL_BY_BRAND, PRICES_META } from "@/lib/data/fuelPrices";

export const metadata = {
  title: "Petrol prices in Singapore — Shell, Esso, Caltex, SPC, Sinopec",
  description: "Live indicative Singapore pump prices by brand and grade.",
};

export default function PetrolPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="chip chip-accent">⛽ Indicative · last reviewed {PRICES_META.effective_date}</span>
        <h1 className="display mt-4 text-4xl font-bold sm:text-6xl">Petrol prices</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-600">
          Pump prices by brand and grade — <b>indicative only</b>. Live scraping of oil-company sites is scheduled daily but not yet wired to real sources. Expect ~15–20% off with major bank/app promos.
        </p>
      </header>

      <section className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-5 py-3 text-left">Brand</th>
              <th className="px-5 py-3 text-right">92</th>
              <th className="px-5 py-3 text-right">95</th>
              <th className="px-5 py-3 text-right">98</th>
              <th className="px-5 py-3 text-right">Diesel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {PETROL_BY_BRAND.map((p) => (
              <tr key={p.brand} className="hover:bg-ink-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>{p.logo}</span>
                    <span className="font-medium">{p.brand}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right num-xl font-semibold">${p["92"].toFixed(2)}</td>
                <td className="px-5 py-4 text-right num-xl font-semibold">${p["95"].toFixed(2)}</td>
                <td className="px-5 py-4 text-right num-xl font-semibold">${p["98"].toFixed(2)}</td>
                <td className="px-5 py-4 text-right num-xl font-semibold">${p.diesel.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-pop-orange/10 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-pop-orange">Cheapest 95</div>
          <div className="num-xl mt-1 text-3xl font-bold">
            ${Math.min(...PETROL_BY_BRAND.map((p) => p["95"])).toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-ink-600">
            {PETROL_BY_BRAND.find((p) => p["95"] === Math.min(...PETROL_BY_BRAND.map((x) => x["95"])))?.brand}
          </div>
        </div>
        <div className="rounded-2xl bg-pop-sky p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-brand-700">Average 95</div>
          <div className="num-xl mt-1 text-3xl font-bold">
            ${(PETROL_BY_BRAND.reduce((s, p) => s + p["95"], 0) / PETROL_BY_BRAND.length).toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-ink-600">Across {PETROL_BY_BRAND.length} brands</div>
        </div>
        <div className="rounded-2xl bg-pop-yellow/40 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-amber-800">After 20% card discount</div>
          <div className="num-xl mt-1 text-3xl font-bold">
            ${(Math.min(...PETROL_BY_BRAND.map((p) => p["95"])) * 0.8).toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-ink-600">Typical with major bank cards</div>
        </div>
      </section>
      <p className="text-xs text-ink-400">{PRICES_META.source}</p>
    </div>
  );
}
