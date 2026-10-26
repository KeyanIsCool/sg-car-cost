// Indicative Singapore pump prices. Reference URLs point to each brand's own
// pump-price or station locator page where current prices are published.

export interface BrandFuelPrice {
  brand: string;
  logo: string;
  "92": number;
  "95": number;
  "98": number;
  diesel: number;
  reference_url: string;
}

export const FUEL_PRICES = {
  "92": 2.72,
  "95": 2.8,
  "98": 3.25,
  diesel: 2.5,
  effective_date: "2026-10-27",
  source: "Aggregate of brand-published pump prices",
};

export const PETROL_BY_BRAND: BrandFuelPrice[] = [
  { brand: "Shell",   logo: "🐚", "92": 2.76, "95": 2.84, "98": 3.33, diesel: 2.56, reference_url: "https://www.shell.com.sg/motorists.html" },
  { brand: "Esso",    logo: "🛢️", "92": 2.74, "95": 2.82, "98": 3.29, diesel: 2.54, reference_url: "https://www.esso.com.sg/" },
  { brand: "Caltex",  logo: "⭐", "92": 2.73, "95": 2.81, "98": 3.26, diesel: 2.52, reference_url: "https://singapore.chevron.com/" },
  { brand: "SPC",     logo: "🟡", "92": 2.70, "95": 2.78, "98": 3.22, diesel: 2.49, reference_url: "https://www.spc.com.sg/" },
  { brand: "Sinopec", logo: "🟢", "92": 2.68, "95": 2.76, "98": 3.19, diesel: 2.48, reference_url: "https://sinopec.com.sg/" },
];

export interface EvNetwork {
  network: string;
  type: string;
  rate: number;
  offpeak?: number | null;
  packages?: { name: string; price: number; perMonth: number; kwh?: number; note: string }[];
  note: string;
  reference_url: string;
}

export const EV_CHARGING_NETWORKS: EvNetwork[] = [
  {
    network: "SP Mobility",
    type: "AC + DC rapid",
    rate: 0.70,
    offpeak: 0.55,
    packages: [
      { name: "AC Lite",   price: 25,  perMonth: 25,  kwh: 50,  note: "50 kWh AC credit, then PAYG" },
      { name: "AC Plus",   price: 55,  perMonth: 55,  kwh: 120, note: "120 kWh AC credit" },
      { name: "DC Rapid",  price: 110, perMonth: 110, kwh: 180, note: "180 kWh DC credit" },
    ],
    note: "Nationwide HDB, mall, highway network. Peak 7am–11pm, off-peak 11pm–7am.",
    reference_url: "https://www.spgroup.com.sg",
  },
  {
    network: "Charge+",
    type: "AC 7–22kW",
    rate: 0.52,
    packages: [
      { name: "Charge+ 100", price: 48,  perMonth: 48,  kwh: 100, note: "100 kWh/mo AC" },
      { name: "Charge+ 300", price: 128, perMonth: 128, kwh: 300, note: "300 kWh/mo AC" },
      { name: "Unlimited AC", price: 198, perMonth: 198, note: "Unlimited AC on Charge+ stations" },
    ],
    note: "HDB and commercial carparks. Membership-based subscription plans.",
    reference_url: "https://chargeplus.sg",
  },
  {
    network: "Shell Recharge",
    type: "DC rapid",
    rate: 0.78,
    note: "At participating Shell stations. Pay-as-you-go via Shell app.",
    reference_url: "https://www.shell.com.sg/motorists.html",
  },
  {
    network: "ChargeNow (BMW)",
    type: "AC + DC",
    rate: 0.65,
    note: "Pay-as-you-go.",
    reference_url: "https://www.bmw.com.sg/en/topics/offers-and-services/electromobility/chargenow.html",
  },
  {
    network: "BlueSG",
    type: "AC 7kW",
    rate: 0.48,
    note: "Members only — BlueSG users at their own stations.",
    reference_url: "https://www.bluesg.com.sg",
  },
  {
    network: "Home (SP tariff)",
    type: "AC home",
    rate: 0.30,
    note: "Regulated SG residential electricity tariff — reviewed quarterly by EMA.",
    reference_url: "https://www.ema.gov.sg/consumer-information/electricity/tariffs",
  },
];

export const PRICES_META = {
  effective_date: "2026-10-27",
  source: "Aggregate of brand-published rates. Click any reference link to verify current.",
};
