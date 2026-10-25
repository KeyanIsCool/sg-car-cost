import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "SG Car Cost — your real monthly cost of owning a car in Singapore",
    template: "%s · SG Car Cost",
  },
  description:
    "Calculate the real monthly cost of owning a car in Singapore — not just the instalment. Includes depreciation, petrol, parking, insurance, road tax, servicing and ERP.",
  openGraph: {
    title: "SG Car Cost",
    description: "Your real monthly cost of owning a car in Singapore — all-in, not just the instalment.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-pop-orange to-pop-pink text-xs font-bold text-white">
                SG
              </span>
              <span className="text-[15px] font-semibold tracking-tight">Car Cost</span>
            </Link>
            <nav aria-label="Primary" className="hidden gap-6 text-sm text-ink-600 sm:flex">
              <Link href="/calculator" className="hover:text-ink-900">Calculator</Link>
              <Link href="/cars" className="hover:text-ink-900">Cars</Link>
              <Link href="/car-loan-calculator" className="hover:text-ink-900">Loans</Link>
              <Link href="/petrol" className="hover:text-ink-900">Petrol</Link>
              <Link href="/ev-charging" className="hover:text-ink-900">EV</Link>
              <Link href="/road-tax-calculator" className="hover:text-ink-900">Road tax</Link>
            </nav>
            <Link href="/calculator" className="btn btn-primary">
              Calculate →
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">{children}</main>
        <footer className="mt-24 border-t border-ink-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-ink-600 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold text-ink-900">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pop-orange to-pop-pink text-[10px] font-bold text-white">
                  SG
                </span>
                Car Cost
              </div>
              <p className="mt-2 max-w-sm text-xs">
                All calculations are estimates based on the assumptions you provide. Not financial, tax or insurance advice.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:flex sm:flex-wrap sm:gap-4">
              <Link href="/methodology">Methodology</Link>
              <Link href="/data-sources">Data sources</Link>
              <Link href="/petrol">Petrol prices</Link>
              <Link href="/ev-charging">EV charging</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
