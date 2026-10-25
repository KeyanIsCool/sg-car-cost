import { describe, it, expect } from "vitest";
import { calcLoan } from "../lib/calculations/loan";
import { calcDepreciation } from "../lib/calculations/depreciation";
import { roadTaxICE, roadTaxEV } from "../lib/calculations/roadTax";
import { calcFuel, calcEV } from "../lib/calculations/fuel";
import { calcTyres } from "../lib/calculations/maintenance";
import { calcErp } from "../lib/calculations/erp";
import { estimateInsurance } from "../lib/calculations/insurance";
import { calcAffordability } from "../lib/calculations/affordability";

describe("loan", () => {
  it("flat-rate instalment", () => {
    const r = calcLoan({ purchasePrice: 180000, downpaymentPct: 0.3, flatRate: 0.0278, tenureYears: 5 });
    expect(r.loanAmount).toBeCloseTo(126000, 2);
    expect(r.totalInterest).toBeCloseTo(126000 * 0.0278 * 5, 2);
    expect(r.monthlyInstalment).toBeGreaterThan(2000);
  });
  it("zero loan", () => {
    const r = calcLoan({ purchasePrice: 100000, downpaymentPct: 1, flatRate: 0.03, tenureYears: 5 });
    expect(r.loanAmount).toBe(0);
    expect(r.monthlyInstalment).toBe(0);
  });
});

describe("depreciation", () => {
  it("basic", () => {
    const r = calcDepreciation({ purchasePrice: 180000, expectedResale: 60000, ownershipYears: 5 });
    expect(r.totalDepreciation).toBe(120000);
    expect(r.annualDepreciation).toBe(24000);
    expect(r.monthlyDepreciation).toBe(2000);
  });
});

describe("road tax", () => {
  it("1600cc ICE", () => {
    expect(roadTaxICE(1600)).toBeGreaterThan(500);
    expect(roadTaxICE(1600)).toBeLessThan(900);
  });
  it("EV 150kW", () => {
    expect(roadTaxEV(150)).toBeGreaterThan(1500);
  });
  it("zero cc", () => {
    expect(roadTaxICE(0)).toBe(0);
  });
});

describe("fuel", () => {
  it("18000km @ 6.5L/100km @ $2.80/L", () => {
    const r = calcFuel({ annualKm: 18000, litresPer100km: 6.5, pricePerLitre: 2.8 });
    expect(r.annualLitres).toBe(1170);
    expect(r.annualCost).toBeCloseTo(3276, 2);
    expect(r.monthlyCost).toBeCloseTo(273, 0);
  });
});

describe("ev", () => {
  it("80% home charging", () => {
    const r = calcEV({ annualKm: 18000, kwhPer100km: 17, homeRate: 0.3, publicRate: 0.55, homePct: 0.8 });
    expect(r.annualKwh).toBe(3060);
    expect(r.annualCost).toBeGreaterThan(900);
  });
});

describe("tyres", () => {
  it("replacement cadence", () => {
    const r = calcTyres({ annualKm: 18000, setCost: 1000, intervalKm: 50000 });
    expect(r.annual).toBeCloseTo(360);
  });
});

describe("erp", () => {
  it("preset-like", () => {
    const r = calcErp({ tripsPerWeek: 10, avgChargePerTrip: 3 });
    expect(r.weekly).toBe(30);
    expect(r.annual).toBe(1560);
  });
});

describe("insurance", () => {
  it("young driver pays more", () => {
    const young = estimateInsurance({ age: 23, yearsLicensed: 2, ncdPct: 0, vehicleValue: 180000 });
    const older = estimateInsurance({ age: 40, yearsLicensed: 15, ncdPct: 0.5, vehicleValue: 180000 });
    expect(young.mid).toBeGreaterThan(older.mid);
  });
});

describe("affordability", () => {
  it("rates stretched budget", () => {
    const r = calcAffordability({
      monthlyTakeHome: 7000,
      housingMonthly: 2000,
      otherDebtMonthly: 300,
      carMonthlyCost: 2200,
    });
    expect(r.carPctOfTakeHome).toBeCloseTo(2200 / 7000, 3);
    expect(["comfortable", "stretched", "risky"]).toContain(r.rating);
  });
});
