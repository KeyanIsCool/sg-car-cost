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

export const LOAN_RATES: LoanRate[] = [
  // Banks — reference link is each lender's own published car loan page.
  { lender: "DBS",                type: "bank",    flat_rate: 0.0248, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.dbs.com.sg/personal/loans/car-loans/car-loan.page" },
  { lender: "OCBC",               type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.ocbc.com/personal-banking/loans/car-loan" },
  { lender: "UOB",                type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.uob.com.sg/personal/loans/vehicle-loans/car-loan.page" },
  { lender: "Maybank",            type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.maybank2u.com.sg/en/personal/loans/car-loans.page" },
  { lender: "Standard Chartered", type: "bank",    flat_rate: 0.0288, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.sc.com/sg/loans/car/" },
  { lender: "Citibank",           type: "bank",    flat_rate: 0.0298, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.citibank.com.sg/global_docs/loans/car-loan.htm" },
  // Finance houses
  { lender: "Hong Leong Finance", type: "inhouse", flat_rate: 0.0248, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.hlf.com.sg/personal-banking/loan/vehicle-loan/", note: "Finance co." },
  { lender: "Sing Investments",   type: "inhouse", flat_rate: 0.0268, max_tenure_years: 7, effective_date: D, source: "Indicative — lender's published rate",   source_url: "https://www.sif.com.sg/personal-banking/loans/vehicle-loan/", note: "Finance co." },
  { lender: "Tokyo Century",      type: "inhouse", flat_rate: 0.0288, max_tenure_years: 7, effective_date: D, source: "Indicative — in-house finance",           source_url: "https://www.tokyocentury.com.sg/en/auto_loan/", note: "In-house" },
  { lender: "ORIX",               type: "inhouse", flat_rate: 0.0308, max_tenure_years: 7, effective_date: D, source: "Indicative — in-house finance",           source_url: "https://www.orix.com.sg/orix-leasing-singapore-ltd/", note: "In-house" },
  { lender: "SMB Automobile",     type: "inhouse", flat_rate: 0.0328, max_tenure_years: 7, effective_date: D, source: "Indicative — dealer in-house finance",    source_url: "https://www.sgcarmart.com/loan.php", note: "Dealer in-house" },
];
