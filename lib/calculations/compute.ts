import { calcLoan } from "./loan";
import { calcDepreciation, estimateResale } from "./depreciation";
import { roadTaxICE, roadTaxEV, roadTaxHybrid, roadTaxBike } from "./roadTax";
import { calcFuel, calcEV } from "./fuel";
import { calcParking } from "./parking";
import { estimateInsurance } from "./insurance";
import { calcTyres, MAINTENANCE_PRESETS } from "./maintenance";
import { calcErp } from "./erp";
import { monthlyTotal } from "./totalOwnership";
import { CalcState } from "@/app/calculator/state";
import { CostBreakdown } from "./types";

export interface ComputeResult {
  breakdown: CostBreakdown;
  monthly: number;
  loan: ReturnType<typeof calcLoan>;
  depreciation: ReturnType<typeof calcDepreciation>;
  insurance: ReturnType<typeof estimateInsurance>;
  energyMonthly: number;
  parkingMonthly: number;
  roadTaxAnnual: number;
  tyreAnnual: number;
  erpMonthly: number;
}

export function compute(s: CalcState): ComputeResult {
  const loan = calcLoan({
    purchasePrice: s.purchasePrice,
    downpaymentPct: s.downpaymentPct,
    flatRate: s.flatRate,
    tenureYears: s.tenureYears,
  });

  const resale =
    s.expectedResale > 0
      ? s.expectedResale
      : estimateResale({
          purchasePrice: s.purchasePrice,
          ownershipYears: s.ownershipYears,
          totalCoeYears: 10,
          parfRebate: 0,
        });

  const dep = calcDepreciation({
    purchasePrice: s.purchasePrice,
    expectedResale: resale,
    ownershipYears: s.ownershipYears,
  });

  let energyMonthly = 0;
  if (s.fuelType === "ev") {
    energyMonthly = calcEV({
      annualKm: s.annualKm,
      kwhPer100km: s.kwhPer100km,
      homeRate: s.homeKwhRate,
      publicRate: s.publicKwhRate,
      homePct: s.homeChargePct,
    }).monthlyCost;
  } else if (s.fuelType === "phev") {
    // Blend: assume ~55% kms on EV mode, 45% on petrol combined cycle.
    const ev = calcEV({
      annualKm: s.annualKm * 0.55,
      kwhPer100km: s.kwhPer100km,
      homeRate: s.homeKwhRate,
      publicRate: s.publicKwhRate,
      homePct: s.homeChargePct,
    });
    const petrol = calcFuel({
      annualKm: s.annualKm * 0.45,
      litresPer100km: s.litresPer100km,
      pricePerLitre: s.pricePerLitre,
    });
    energyMonthly = ev.monthlyCost + petrol.monthlyCost;
  } else {
    energyMonthly = calcFuel({
      annualKm: s.annualKm,
      litresPer100km: s.litresPer100km,
      pricePerLitre: s.pricePerLitre,
    }).monthlyCost;
  }

  const parking = calcParking({
    homeMonthly: s.homeParking,
    workMonthly: s.workParking,
    otherMonthly: s.otherParking,
  });

  const insurance = estimateInsurance({
    age: s.age,
    yearsLicensed: s.yearsLicensed,
    ncdPct: s.ncdPct,
    vehicleValue: s.purchasePrice,
  });
  // Bikes get a much lower insurance base; override everything with ~0.4x of car.
  const bikeFactor = s.kind === "bike" ? 0.4 : 1;
  const insuranceMonthly =
    s.insuranceAnnualOverride > 0
      ? s.insuranceAnnualOverride / 12
      : insurance.monthlyMid * bikeFactor;

  let roadTaxAnnual = 0;
  if (s.kind === "bike") roadTaxAnnual = roadTaxBike(s.engineCc);
  else if (s.fuelType === "ev") roadTaxAnnual = roadTaxEV(s.motorKw);
  else if (s.fuelType === "hybrid" || s.fuelType === "phev") {
    roadTaxAnnual = roadTaxHybrid(s.engineCc);
  } else roadTaxAnnual = roadTaxICE(s.engineCc);

  const maintMonthly =
    s.maintenanceCustom > 0 ? s.maintenanceCustom : MAINTENANCE_PRESETS[s.maintenanceTier];
  const tyre = calcTyres({
    annualKm: s.annualKm,
    setCost: s.tyreSetCost,
    intervalKm: s.tyreIntervalKm,
  });
  const erp = s.kind === "bike"
    ? { monthly: 0, weekly: 0, annual: 0 }
    : calcErp({ tripsPerWeek: s.erpTripsPerWeek, avgChargePerTrip: s.erpAvgCharge });

  const breakdown: CostBreakdown = {
    financing: loan.monthlyInstalment,
    depreciation: dep.monthlyDepreciation,
    energy: energyMonthly,
    parking: parking.monthly,
    insurance: insuranceMonthly,
    roadTax: roadTaxAnnual / 12,
    maintenance: maintMonthly,
    tyres: tyre.monthly,
    erp: erp.monthly,
    misc: s.miscMonthly,
  };

  return {
    breakdown,
    monthly: monthlyTotal(breakdown),
    loan,
    depreciation: dep,
    insurance,
    energyMonthly,
    parkingMonthly: parking.monthly,
    roadTaxAnnual,
    tyreAnnual: tyre.annual,
    erpMonthly: erp.monthly,
  };
}
