import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

export const hasDb = !!process.env.DATABASE_URL;

export const sql = hasDb
  ? neon(process.env.DATABASE_URL as string)
  : (async () => {
      throw new Error("DATABASE_URL not set — using seed data instead");
    });

/** Fetch all vehicles from DB, or fall back to the TS seed when DB is absent. */
export async function listVehicles() {
  if (!hasDb) {
    const { VEHICLES } = await import("./data/vehicles");
    return VEHICLES;
  }
  const rows = (await (sql as any)`
    select id, make, model, variant, slug, fuel_type, engine_cc,
           motor_power_kw, fuel_efficiency as fuel_efficiency_l_100km,
           energy_kwh_100km, omv, arf, coe_category, purchase_price,
           source, effective_from
    from vehicles order by make, model
  `) as any[];
  return rows;
}

export async function listLoanRates() {
  if (!hasDb) {
    const { LOAN_RATES } = await import("./data/loans");
    return LOAN_RATES;
  }
  const rows = (await (sql as any)`
    select lender, flat_rate, max_tenure_years, effective_date, source
    from loan_rates order by flat_rate asc
  `) as any[];
  return rows;
}
