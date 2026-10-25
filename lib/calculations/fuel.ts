export interface FuelInput {
  annualKm: number;
  litresPer100km: number;
  pricePerLitre: number;
}
export function calcFuel(input: FuelInput) {
  const annualLitres = (input.annualKm / 100) * input.litresPer100km;
  const annualCost = annualLitres * input.pricePerLitre;
  return {
    annualLitres,
    annualCost,
    monthlyCost: annualCost / 12,
    costPerKm: input.annualKm > 0 ? annualCost / input.annualKm : 0,
  };
}

export interface EVInput {
  annualKm: number;
  kwhPer100km: number;
  homeRate: number; // $/kWh
  publicRate: number; // $/kWh
  homePct: number; // 0..1
}
export function calcEV(input: EVInput) {
  const annualKwh = (input.annualKm / 100) * input.kwhPer100km;
  const homeKwh = annualKwh * input.homePct;
  const publicKwh = annualKwh * (1 - input.homePct);
  const homeCost = homeKwh * input.homeRate;
  const publicCost = publicKwh * input.publicRate;
  const annualCost = homeCost + publicCost;
  return {
    annualKwh,
    homeCost,
    publicCost,
    annualCost,
    monthlyCost: annualCost / 12,
    costPerKm: input.annualKm > 0 ? annualCost / input.annualKm : 0,
  };
}
