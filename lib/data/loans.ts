// Indicative Singapore car loan rates. Flat rate per annum. These are
// placeholder values with effective_date — the production app should
// refresh them via a cron job polling each lender's published rates.

export interface LoanRate {
  lender: string;
  type: "bank" | "inhouse";
  flat_rate: number;
  max_tenure_years: number;
  effective_date: string;
  source: string;
  source_url: string;
  note?: string;
}

const D = "2026-10-27";
const SGCM = "https://www.sgcarmart.com/loan.php";

export const LOAN_RATES: LoanRate[] = [
  // Reference is the SGCarMart loan comparison page — the single aggregated
  // source Singapore buyers use to compare these rates.
  { lender: "DBS",                type: "bank",    flat_rate: 0.0248, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "OCBC",               type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "UOB",                type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "Maybank",            type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "Standard Chartered", type: "bank",    flat_rate: 0.0288, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "Citibank",           type: "bank",    flat_rate: 0.0298, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM },
  { lender: "Hong Leong Finance", type: "inhouse", flat_rate: 0.0248, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM, note: "Finance co." },
  { lender: "Sing Investments",   type: "inhouse", flat_rate: 0.0268, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM, note: "Finance co." },
  { lender: "Tokyo Century",      type: "inhouse", flat_rate: 0.0288, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM, note: "In-house" },
  { lender: "ORIX",               type: "inhouse", flat_rate: 0.0308, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM, note: "In-house" },
  { lender: "SMB Automobile",     type: "inhouse", flat_rate: 0.0328, max_tenure_years: 7, effective_date: D, source: "SGCarMart loan comparison", source_url: SGCM, note: "Dealer in-house" },
];
