// Indicative Singapore pump prices. Refreshed by the /api/cron/refresh-rates
// endpoint (seeded values when the cron hasn't run yet).

export interface BrandFuelPrice {
  brand: string;
  logo: string;
  "92": number;
  "95": number;
  "98": number;
  diesel: number;
}

export const FUEL_PRICES = {
  "92": 2.72,
  "95": 2.8,
  "98": 3.25,
  diesel: 2.5,
  effective_date: "2026-10-26",
  source: "indicative",
};

export const PETROL_BY_BRAND: BrandFuelPrice[] = [
  { brand: "Shell",   logo: "🐚", "92": 2.76, "95": 2.84, "98": 3.33, diesel: 2.56 },
  { brand: "Esso",    logo: "🛢️", "92": 2.74, "95": 2.82, "98": 3.29, diesel: 2.54 },
  { brand: "Caltex",  logo: "⭐", "92": 2.73, "95": 2.81, "98": 3.26, diesel: 2.52 },
  { brand: "SPC",     logo: "🟡", "92": 2.70, "95": 2.78, "98": 3.22, diesel: 2.49 },
  { brand: "Sinopec", logo: "🟢", "92": 2.68, "95": 2.76, "98": 3.19, diesel: 2.48 },
];

export const EV_CHARGING_NETWORKS = [
  { network: "SP Mobility",     type: "DC rapid",   rate: 0.70, offpeak: 0.55, note: "Peak 7am-11pm; off-peak 11pm-7am" },
  { network: "Shell Recharge",  type: "DC rapid",   rate: 0.78, offpeak: null, note: "At participating Shell stations" },
  { network: "ChargeNow (BMW)", type: "AC + DC",    rate: 0.65, offpeak: null, note: "Pay-as-you-go" },
  { network: "Charge+",         type: "AC 7-22kW",  rate: 0.52, offpeak: null, note: "HDB & commercial carparks" },
  { network: "BlueSG",          type: "AC 7kW",     rate: 0.48, offpeak: null, note: "Members only" },
  { network: "Home (SP tariff)",type: "AC home",    rate: 0.30, offpeak: null, note: "Regulated residential tariff" },
];

export const PRICES_META = {
  effective_date: "2026-10-26",
  source: "Indicative aggregate — refresh via /api/cron/refresh-rates",
};
