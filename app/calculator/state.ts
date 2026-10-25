import { FuelType, PetrolGrade } from "@/lib/calculations/types";
import { MaintenanceTier } from "@/lib/calculations/maintenance";

export type ParkingType = "hdb" | "condo" | "landed" | "street" | "private" | "other";
export type ErpPreset = "none" | "occasional" | "cbd" | "heavy" | "custom";
export type VehicleKind = "car" | "bike";
export type MileageUnit = "yr" | "mo";

export interface CalcState {
  kind: VehicleKind;
  vehicleId?: string;
  vehicleName: string;
  vehicleImage?: string;
  purchasePrice: number;
  fuelType: FuelType;
  engineCc: number;
  motorKw: number;
  litresPer100km: number;
  kwhPer100km: number;

  // Driver
  age: number;
  yearsLicensed: number;
  ncdPct: number;

  // Usage
  annualKm: number;
  mileageUnit: MileageUnit;

  // Home carpark lookup (HDB)
  postalCode: string;

  // Energy
  petrolGrade: PetrolGrade;
  pricePerLitre: number;
  homeKwhRate: number;
  publicKwhRate: number;
  homeChargePct: number;

  // Parking
  parkingType: ParkingType;
  homeParking: number;
  workParking: number;
  otherParking: number;

  // ERP
  erpPreset: ErpPreset;
  erpTripsPerWeek: number;
  erpAvgCharge: number;

  // Financing
  downpaymentPct: number;
  flatRate: number;
  tenureYears: number;

  // Ownership
  ownershipYears: number;
  expectedResale: number; // 0 => auto-estimate

  // Maintenance
  maintenanceTier: MaintenanceTier;
  maintenanceCustom: number; // monthly, 0 => use tier

  // Tyres
  tyreSetCost: number;
  tyreIntervalKm: number;

  // Insurance override
  insuranceAnnualOverride: number; // 0 => estimate

  // Misc
  miscMonthly: number;

  // Affordability
  takeHome: number;
  housing: number;
  otherDebt: number;
}

export const DEFAULT_STATE: CalcState = {
  kind: "car",
  vehicleId: "bmw-320i-m-sport",
  vehicleName: "BMW 320i M Sport (demo)",
  purchasePrice: 310000,
  fuelType: "petrol",
  engineCc: 1998,
  motorKw: 0,
  litresPer100km: 6.5,
  kwhPer100km: 15,
  age: 35,
  yearsLicensed: 10,
  ncdPct: 0.5,
  annualKm: 18000,
  mileageUnit: "yr",
  postalCode: "",
  petrolGrade: "95",
  pricePerLitre: 2.8,
  homeKwhRate: 0.3,
  publicKwhRate: 0.55,
  homeChargePct: 0.8,
  parkingType: "hdb",
  homeParking: 110,
  workParking: 160,
  otherParking: 40,
  erpPreset: "occasional",
  erpTripsPerWeek: 3,
  erpAvgCharge: 2,
  downpaymentPct: 0.4,
  flatRate: 0.0278,
  tenureYears: 7,
  ownershipYears: 5,
  expectedResale: 0,
  maintenanceTier: "normal",
  maintenanceCustom: 0,
  tyreSetCost: 1000,
  tyreIntervalKm: 50000,
  insuranceAnnualOverride: 0,
  miscMonthly: 50,
  takeHome: 7000,
  housing: 2000,
  otherDebt: 300,
};
