import { EV_CHARGING_NETWORKS, PRICES_META } from "@/lib/data/fuelPrices";

export const metadata = {
  title: "EV charging rates in Singapore — SP, Shell, Charge+, BlueSG",
  description:
    "Live indicative Singapore EV charging rates across SP Mobility, Shell Recharge, ChargeNow, Charge+ and BlueSG.",
};

export default function EvPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="chip chip-accent">⚡ Indicative · last reviewed {PRICES_META.effective_date}</span>
        <h1 className="display mt-4 text-4xl font-bold sm:text-6xl">EV charging rates</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-600">
          Per-kWh rates across SG charging networks — <b>indicative only</b>. Home charging on your SP tariff is cheapest; DC rapid at highway/mall sites is most expensive.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EV_CHARGING_NETWORKS.map((n) => (
          <div
            key={n.network}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{
                background:
                  n.rate < 0.5
                    ? "linear-gradient(90deg,#10b981,#a9f0d1)"
                    : n.rate < 0.65
                    ? "linear-gradient(90deg,#2b7fff,#cfe8ff)"
                    : "linear-gradient(90deg,#ff5e3a,#ff2d55)",
              }}
              aria-hidden
            />
            <div className="text-xs uppercase tracking-wider text-ink-400">{n.type}</div>
            <div className="mt-1 text-lg font-semibold">{n.network}</div>
            <div className="num-xl mt-5 text-4xl font-bold">
              ${n.rate.toFixed(2)}
              <span className="text-sm font-normal text-ink-400"> /kWh</span>
            </div>
            {n.offpeak && (
              <div className="mt-1 text-xs text-emerald-600">
                Off-peak: ${n.offpeak.toFixed(2)}/kWh
              </div>
            )}
            <p className="mt-4 text-sm text-ink-600">{n.note}</p>
            {n.packages && n.packages.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Subscription packages
                </div>
                {n.packages.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2 text-xs"
                  >
                    <div>
                      <div className="font-medium text-ink-900">{p.name}</div>
                      <div className="text-ink-500">{p.note}</div>
                    </div>
                    <div className="text-right">
                      <div className="num-xl font-semibold">${p.perMonth}</div>
                      <div className="text-[10px] text-ink-400">/ mo</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <a
              href={n.reference_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-4 inline-block text-xs font-medium text-brand-600 hover:underline"
            >
              Verify current rates ↗
            </a>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="display text-xl font-semibold">Rough cost for 18,000 km / year</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Home only", rate: 0.3 },
            { label: "Mixed (80/20)", rate: 0.3 * 0.8 + 0.65 * 0.2 },
            { label: "Public only", rate: 0.65 },
          ].map((s) => {
            const annual = (18000 / 100) * 16 * s.rate;
            return (
              <div key={s.label} className="rounded-2xl bg-ink-50 p-5">
                <div className="text-xs text-ink-400">{s.label}</div>
                <div className="num-xl mt-1 text-2xl font-bold">${Math.round(annual).toLocaleString()}</div>
                <div className="mt-1 text-xs text-ink-600">~${Math.round(annual / 12)}/month</div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-ink-500">Assumes a typical EV using 16 kWh/100km.</p>
      </section>
    </div>
  );
}
