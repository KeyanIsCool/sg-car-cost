import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily refresh endpoint — scheduled by vercel.json's `crons` block.
 * Each refresher is a safe no-op by default. Wire a real source (SG open-data,
 * ScraperAPI, SP Mobility API, each lender's rate page) and push the parsed
 * values into Neon so the catalogue, loan table and petrol page auto-update.
 */

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Petrol prices — TODO: fetch from a stable source (e.g. SG open-data
  //    or shell/esso/caltex official pump-price pages) and UPSERT into
  //    the fuel_prices table.
  results.petrol = "skipped — wire source";

  // 2. Loan rates — TODO: scrape SGCarMart's loan rate comparison page
  //    (same sin1 route the listing scraper uses) and UPSERT into loan_rates.
  results.loans = "skipped — wire source";

  // 3. Vehicles — TODO: pull newly-listed models from SGCarMart's new-cars
  //    catalogue and INSERT new slugs into vehicles.
  results.vehicles = "skipped — wire source";

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    results,
  });
}
