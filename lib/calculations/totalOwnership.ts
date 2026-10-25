import { CostBreakdown } from "./types";

export function monthlyTotal(b: CostBreakdown): number {
  return (
    b.financing +
    b.depreciation +
    b.energy +
    b.parking +
    b.insurance +
    b.roadTax +
    b.maintenance +
    b.tyres +
    b.erp +
    b.misc
  );
}

export function annualTotal(b: CostBreakdown): number {
  return monthlyTotal(b) * 12;
}

export function periodTotal(b: CostBreakdown, years: number): number {
  return monthlyTotal(b) * 12 * years;
}
