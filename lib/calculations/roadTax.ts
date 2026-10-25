/**
 * Singapore road tax (indicative). Based on LTA's published 6-monthly tables,
 * annualised. Values here are a reasonable approximation for the calculator;
 * every rule carries an effective_from and source so it can be updated.
 *
 * Source: LTA / OneMotoring published road tax tables.
 * NOTE: These numbers must be verified against LTA before claiming to be current.
 */

export interface RoadTaxRule {
  effective_from: string;
  source: string;
  source_url: string;
}

export const ROAD_TAX_RULES: RoadTaxRule = {
  effective_from: "2024-01-01",
  source: "LTA OneMotoring (indicative)",
  source_url: "https://onemotoring.lta.gov.sg/",
};

/** Petrol/diesel ICE annual road tax from engine capacity (cc). */
export function roadTaxICE(cc: number): number {
  if (cc <= 0) return 0;
  // Piecewise formula (annual), simplified from LTA 6-monthly tables.
  let sixMonthly: number;
  if (cc <= 600) sixMonthly = 200 * 0.782;
  else if (cc <= 1000) sixMonthly = (200 + 0.125 * (cc - 600)) * 0.782;
  else if (cc <= 1600) sixMonthly = (250 + 0.375 * (cc - 1000)) * 0.782;
  else if (cc <= 3000) sixMonthly = (475 + 0.75 * (cc - 1600)) * 0.782;
  else sixMonthly = (1525 + 1.0 * (cc - 3000)) * 0.782;
  return Math.round(sixMonthly * 2);
}

/** EV annual road tax based on motor power rating (kW). */
export function roadTaxEV(kw: number): number {
  if (kw <= 0) return 0;
  let sixMonthly: number;
  if (kw <= 7.5) sixMonthly = 200 * 0.782;
  else if (kw <= 32.5) sixMonthly = (200 + 2 * (kw - 7.5)) * 0.782;
  else if (kw <= 70) sixMonthly = (250 + 6 * (kw - 32.5)) * 0.782;
  else if (kw <= 157.5) sixMonthly = (475 + 12 * (kw - 70)) * 0.782;
  else sixMonthly = (1525 + 16 * (kw - 157.5)) * 0.782;
  // Additional flat EV road tax component (indicative)
  const additional = 190;
  return Math.round(sixMonthly * 2 + additional);
}

export function roadTaxHybrid(cc: number): number {
  // Treat as ICE based on engine cc for simplicity; LTA uses the higher of
  // engine cc and motor power basis for petrol-electric hybrids.
  return roadTaxICE(cc);
}
