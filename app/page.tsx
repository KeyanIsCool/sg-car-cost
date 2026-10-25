import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { listVehicles } from "@/lib/db";
import { sgd } from "@/lib/format";
import { Reveal, CountUp } from "@/components/Motion";
import { CarArt, tintFor } from "@/components/CarArt";

export const revalidate = 300;

const COST_CARDS = [
  { label: "Petrol", v: 273, color: "bg-pop-orange/10 text-pop-orange" },
  { label: "Parking", v: 290, color: "bg-pop-sky text-brand-700" },
  { label: "Insurance", v: 150, color: "bg-pop-mint text-emerald-700" },
  { label: "Road tax", v: 90, color: "bg-pop-yellow/40 text-amber-800" },
  { label: "Depreciation", v: 650, color: "bg-pop-plum/15 text-pop-plum" },
];

export default async function Home() {
  const vehicles = await listVehicles();
  const featured = vehicles.slice(0, 8);

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="hero-grid relative overflow-hidden rounded-[2rem] bg-white px-6 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-14">
        <div className="relative z-10 grid items-end gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal>
              <span className="chip chip-accent">🇸🇬 For Singapore drivers</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="display mt-5 text-5xl font-bold leading-[0.95] sm:text-7xl">
                What does your car{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-br from-pop-orange via-pop-pink to-pop-plum bg-clip-text text-transparent">
                    really
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path d="M2,8 C40,2 100,2 198,7" stroke="url(#u)" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="u" x1="0" x2="1">
                        <stop offset="0%" stopColor="#ff5e3a" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                cost?
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-base text-ink-600 sm:text-lg">
                Your instalment is just the start. We fold in depreciation, petrol, parking, insurance, road tax, servicing, tyres and ERP — and show the one number that actually matters.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/calculator" className="btn btn-accent glow-orange">
                  Calculate my car cost
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/cars" className="btn btn-outline">
                  Browse cars
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
                <li>⚡ Reads SGCarMart listings</li>
                <li className="hidden sm:inline" aria-hidden>·</li>
                <li>🏦 Compares 11 lenders</li>
                <li className="hidden sm:inline" aria-hidden>·</li>
                <li>🅿️ Live HDB parking rates</li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl bg-ink-900 p-7 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                    All-in monthly
                  </span>
                  <span className="rounded-full bg-pop-orange/90 px-2.5 py-1 text-[11px] font-semibold">
                    +$864 hidden
                  </span>
                </div>
                <div className="mt-4 text-xs text-white/60">Your instalment is $1,320. The real number is:</div>
                <div className="num-xl mt-2 text-6xl font-bold leading-none sm:text-7xl">
                  <CountUp value={2184} prefix="$" />
                </div>
                <div className="mt-2 text-sm text-white/70">per month, all-in</div>
                <div className="mt-6 h-px bg-white/10" />
                <div className="mt-5 flex items-center gap-3">
                  <CarArt tint="#ff5e3a" className="h-10 w-20 shrink-0" />
                  <div className="text-xs text-white/70">
                    Based on an indicative BMW 320i scenario. Your result will differ.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COST STRIP */}
      <section>
        <Reveal>
          <h2 className="display text-3xl font-bold sm:text-4xl">More than just your instalment.</h2>
          <p className="mt-2 text-sm text-ink-600">The hidden costs that quietly stack up every month.</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {COST_CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <div className={`rounded-2xl ${c.color} px-4 py-5`}>
                <div className="text-xs opacity-80">{c.label}</div>
                <div className="mt-1 num-xl text-2xl font-bold">
                  <CountUp value={c.v} prefix="$" />
                  <span className="text-xs font-normal opacity-70"> /mo</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      <section>
        <div className="flex items-end justify-between">
          <Reveal>
            <h2 className="display text-3xl font-bold sm:text-4xl">Cars people are costing out</h2>
            <p className="mt-2 text-base text-ink-600">
              {vehicles.length} models in Neon · prices indicative, personalise in the calculator.
            </p>
          </Reveal>
          <Link href="/cars" className="text-sm font-medium text-brand-600 hover:underline">
            See all {vehicles.length} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.04}>
              <Link
                href={`/cars/${v.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${tintFor(v.id)}22 0%, ${tintFor(v.id)}08 100%)`,
                  }}
                >
                  {(v as any).hero_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(v as any).hero_image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CarArt tint={tintFor(v.id)} className="h-28 w-56 transition group-hover:scale-110" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-700 backdrop-blur">
                    {v.fuel_type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-wider text-ink-400">{v.make}</div>
                  <div className="mt-1 text-base font-semibold leading-tight">
                    {v.model}
                    <span className="font-normal text-ink-600"> {v.variant}</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="num-xl text-xl font-bold">{sgd(Number(v.purchase_price))}</div>
                    <span className="text-xs text-brand-600 opacity-0 transition group-hover:opacity-100">
                      View cost →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <AdSlot type="leaderboard" />

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-white sm:px-10">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pop-orange/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
        <Reveal>
          <h2 className="display text-3xl font-bold sm:text-4xl">Two minutes. Zero spreadsheets.</h2>
        </Reveal>
        <div className="relative mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { n: "01", t: "Pick a car", d: "Paste a SGCarMart link — we read make, model, price, engine, COE and more. Or pick from the catalogue." },
            { n: "02", t: "Tell us about you", d: "Age, licence, mileage, parking, ERP, loan. The sidebar updates with every input." },
            { n: "03", t: "See the real cost", d: "Monthly, annual, and across your ownership period — with a transparent breakdown and affordability check." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
                <div className="num-xl text-5xl font-bold text-white/30">{s.n}</div>
                <div className="mt-3 text-lg font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-white/70">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section>
        <Reveal>
          <h2 className="display text-3xl font-bold sm:text-4xl">Standalone tools</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/car-loan-calculator", label: "Car loan", v: "11 lenders · banks & finance houses", live: false },
            { href: "/road-tax-calculator", label: "Road tax", v: "ICE, EV, bikes", live: false },
            { href: "/petrol", label: "Petrol prices", v: "Shell · Esso · Caltex · SPC · Sinopec", live: false },
            { href: "/ev-charging", label: "EV charging", v: "SP · Shell · BlueSG · Charge+", live: false },
          ].map((t, i) => (
            <Reveal key={t.href} delay={i * 0.05}>
              <Link
                href={t.href}
                className="card group block p-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-xs font-medium text-ink-400">
                  {t.live ? "Live data" : "Indicative — editable"}
                </div>
                <div className="mt-1 text-lg font-semibold">{t.label}</div>
                <div className="mt-2 text-sm text-ink-600">{t.v}</div>
                <div className="mt-6 text-sm font-medium text-brand-600">Open →</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
