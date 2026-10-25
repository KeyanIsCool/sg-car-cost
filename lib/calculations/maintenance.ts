export type MaintenanceTier = "budget" | "normal" | "premium";

export const MAINTENANCE_PRESETS: Record<MaintenanceTier, number> = {
  budget: 80,
  normal: 120,
  premium: 180,
};

export interface TyreInput {
  annualKm: number;
  setCost: number; // full set replacement
  intervalKm: number; // typical replacement every X km
}
export function calcTyres(input: TyreInput) {
  const sets = input.intervalKm > 0 ? input.annualKm / input.intervalKm : 0;
  const annual = sets * input.setCost;
  return { annual, monthly: annual / 12 };
}
