import { calcLoan } from "./loan";
import { calcDepreciation, estimateResale } from "./depreciation";
import { roadTaxICE, roadTaxEV, roadTaxHybrid } from "./roadTax";
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
  const insuranceMonthly =
    s.insuranceAnnualOverride > 0 ? s.insuranceAnnualOverride / 12 : insurance.monthlyMid;

  let roadTaxAnnual = 0;
  if (s.fuelType === "ev") roadTaxAnnual = roadTaxEV(s.motorKw);
  else if (s.fuelType === "hybrid") roadTaxAnnual = roadTaxHybrid(s.engineCc);
  else roadTaxAnnual = roadTaxICE(s.engineCc);

  const maintMonthly =
    s.maintenanceCustom > 0 ? s.maintenanceCustom : MAINTENANCE_PRESETS[s.maintenanceTier];
  const tyre = calcTyres({
    annualKm: s.annualKm,
    setCost: s.tyreSetCost,
    intervalKm: s.tyreIntervalKm,
  });
  const erp = calcErp({ tripsPerWeek: s.erpTripsPerWeek, avgChargePerTrip: s.erpAvgCharge });

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
