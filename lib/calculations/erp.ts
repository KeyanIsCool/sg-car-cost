export interface ErpInput {
  tripsPerWeek: number;
  avgChargePerTrip: number;
}
export function calcErp(input: ErpInput) {
  const weekly = input.tripsPerWeek * input.avgChargePerTrip;
  const annual = weekly * 52;
  return { weekly, annual, monthly: annual / 12 };
}

export const ERP_PRESETS = {
  none: { tripsPerWeek: 0, avgChargePerTrip: 0 },
  occasional: { tripsPerWeek: 3, avgChargePerTrip: 2 },
  cbd: { tripsPerWeek: 10, avgChargePerTrip: 3 },
  heavy: { tripsPerWeek: 14, avgChargePerTrip: 4 },
} as const;
