import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Singapore Car Ownership Calculator — your real monthly cost",
    template: "%s · SG Car Cost",
  },
  description:
    "Calculate the real monthly cost of owning a car in Singapore — not just the instalment. Includes depreciation, petrol, parking, insurance, road tax, servicing and ERP.",
  openGraph: {
    title: "Singapore Car Ownership Calculator",
    description:
      "Your real monthly cost of owning a car in Singapore — all-in, not just the instalment.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-50">
        <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded-md bg-ink-900" aria-hidden />
              <span className="text-sm font-semibold tracking-tight">SG Car Cost</span>
            </Link>
            <nav aria-label="Primary" className="hidden gap-5 text-sm text-ink-600 sm:flex">
              <Link href="/calculator">Calculator</Link>
              <Link href="/cars">Cars</Link>
              <Link href="/car-loan-calculator">Loan</Link>
              <Link href="/road-tax-calculator">Road tax</Link>
              <Link href="/methodology">Methodology</Link>
            </nav>
            <Link href="/calculator" className="btn btn-primary">
              Calculate →
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
        <footer className="mt-16 border-t border-ink-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-ink-600 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="font-semibold text-ink-900">SG Car Cost</div>
              <p className="mt-1 max-w-sm text-xs">
                All calculations are estimates based on the assumptions you provide. Not financial, tax or insurance advice.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/methodology">Methodology</Link>
              <Link href="/data-sources">Data sources</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
