export type FuelType = "petrol" | "diesel" | "hybrid" | "phev" | "ev";
export type PetrolGrade = "92" | "95" | "98" | "diesel";
export type COECategory = "A" | "B" | "C" | "D" | "E";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  slug: string;
  fuel_type: FuelType;
  engine_cc?: number;
  motor_power_kw?: number;
  fuel_efficiency_l_100km?: number;
  energy_kwh_100km?: number;
  omv?: number;
  arf?: number;
  coe_category?: COECategory;
  purchase_price: number;
  source?: string;
  source_url?: string;
  effective_from?: string;
}

export interface CostBreakdown {
  financing: number;
  depreciation: number;
  energy: number;
  parking: number;
  insurance: number;
  roadTax: number;
  maintenance: number;
  tyres: number;
  erp: number;
  misc: number;
}

export interface MonthlyAnnualTotal {
  monthly: number;
  annual: number;
  total: number;
}
