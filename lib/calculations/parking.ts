export interface ParkingInput {
  homeMonthly: number;
  workMonthly: number;
  otherMonthly: number;
}
export function calcParking(p: ParkingInput) {
  const monthly = p.homeMonthly + p.workMonthly + p.otherMonthly;
  return { monthly, annual: monthly * 12 };
}

/** Compute monthly work parking from daily rate × workdays. */
export function workParkingFromDaily(dailyRate: number, daysPerMonth: number) {
  return dailyRate * daysPerMonth;
}
