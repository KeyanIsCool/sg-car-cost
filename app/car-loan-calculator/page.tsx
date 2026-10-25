import { LoanCompare } from "@/components/LoanCompare";
import Link from "next/link";

export const metadata = {
  title: "Singapore Car Loan Calculator",
  description:
    "Compare Singapore car loan monthly instalments across lenders. Flat rate vs effective rate explained.",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Singapore car loan calculator</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-600">
          Compare monthly instalments across major lenders using an indicative flat interest rate.
          Flat rate ≠ effective rate — the effective rate (APR) is roughly ~1.8× the flat rate for typical tenures.
        </p>
      </header>
      <LoanCompare purchasePrice={180000} downpaymentPct={0.3} tenureYears={5} />
      <div>
        <Link className="btn btn-primary" href="/calculator">
          Full cost of ownership →
        </Link>
      </div>
    </div>
  );
}
