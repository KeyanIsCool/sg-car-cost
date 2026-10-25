export interface AffordabilityInput {
  monthlyTakeHome: number;
  housingMonthly: number;
  otherDebtMonthly: number;
  carMonthlyCost: number;
}
export interface AffordabilityResult {
  carPctOfTakeHome: number;
  totalFixedPct: number;
  rating: "comfortable" | "stretched" | "risky";
  message: string;
}
export function calcAffordability(i: AffordabilityInput): AffordabilityResult {
  const take = Math.max(1, i.monthlyTakeHome);
  const carPct = i.carMonthlyCost / take;
  const totalPct = (i.housingMonthly + i.otherDebtMonthly + i.carMonthlyCost) / take;
  let rating: AffordabilityResult["rating"];
  if (carPct <= 0.15 && totalPct <= 0.55) rating = "comfortable";
  else if (carPct <= 0.25 && totalPct <= 0.7) rating = "stretched";
  else rating = "risky";
  const message =
    rating === "comfortable"
      ? "This fits comfortably within common budgeting guidelines."
      : rating === "stretched"
      ? "This is on the higher side of what budgeting guidelines suggest."
      : "This exceeds common budgeting guidelines for discretionary spending.";
  return { carPctOfTakeHome: carPct, totalFixedPct: totalPct, rating, message };
}
