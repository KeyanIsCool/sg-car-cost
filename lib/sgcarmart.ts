// SGCarmart used-listing scraper.
// Ported from the trinity-tiktok approach: the listing page embeds a Next.js
// RSC payload with the fields we need. A targeted regex pulls each
// \"key\":\"value\" fragment from the escaped-JSON blob — no DOM parser.
//
// When SGCarmart's edge refuses a direct fetch from Vercel IPs, requests
// route through a licensed scraping proxy (ScraperAPI) via SCRAPERAPI_KEY.

export interface ScrapedCar {
  aid: string;
  carModel: string;
  make?: string;
  model?: string;
  variant?: string;
  price: number;
  priceRaw: string;
  installment?: string;
  depreciation?: string;
  coeLeft?: string;
  coeEnd?: string;
  monthsLeft?: number;
  mileage?: string;
  owner?: string;
  regDate?: string;
  manufactured?: string | number;
  engineCc?: number;
  fuelType?: "petrol" | "diesel" | "hybrid" | "phev" | "ev";
  description?: string;
  images: string[];
  sourceUrl: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

function unescapeJsonString(s: string): string {
  try {
    return JSON.parse(`"${s.replace(/"/g, '\\"')}"`);
  } catch {
    return s;
  }
}

function pickJsonString(payload: string, key: string): string | undefined {
  const re = new RegExp(`\\\\"${key}\\\\":\\\\"((?:[^"\\\\]|\\\\.)*?)\\\\"`, "s");
  const m = re.exec(payload);
  if (!m) return undefined;
  return unescapeJsonString(m[1].replace(/\\\\/g, "\\").replace(/\\"/g, '"'));
}

function pickJsonNumber(payload: string, key: string): number | undefined {
  const re = new RegExp(`\\\\"${key}\\\\":(-?\\d+)`, "s");
  const m = re.exec(payload);
  return m ? parseInt(m[1], 10) : undefined;
}

function priceToNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function extractImages(html: string, aid: string): string[] {
  const bRe = new RegExp(`i\\.i-sgcm\\.com/cars_used/\\d{6}/${aid}_(\\d+)b\\.jpg`, "g");
  const smallRe = new RegExp(`i\\.i-sgcm\\.com/cars_used/\\d{6}/${aid}_(\\d+)\\.jpg`, "g");
  const withIdx: { idx: number; url: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = bRe.exec(html))) withIdx.push({ idx: parseInt(m[1], 10), url: `https://${m[0]}` });
  if (withIdx.length === 0) {
    while ((m = smallRe.exec(html))) {
      withIdx.push({ idx: parseInt(m[1], 10), url: `https://${m[0]}` });
    }
  }
  withIdx.sort((a, b) => a.idx - b.idx);
  const set = new Set<string>();
  for (const { url } of withIdx) set.add(url);
  return Array.from(set);
}

function pickDescByLabel(html: string, label: string): string | undefined {
  const re = new RegExp(
    `\\\\"text\\\\":\\\\"${label}\\\\"[^{}]{0,200}?\\\\"desc\\\\":\\\\"([^"\\\\]{1,80})\\\\"`,
    "s"
  );
  const m = re.exec(html);
  return m ? m[1] : undefined;
}

function extractDescription(html: string): string | undefined {
  const re = /\\"description\\":\\"((?:[^"\\]|\\.)*?)\\"/s;
  const m = re.exec(html);
  if (!m) return undefined;
  return unescapeJsonString(m[1].replace(/\\\\/g, "\\").replace(/\\"/g, '"'));
}

function parseFuel(s: string | undefined): ScrapedCar["fuelType"] {
  if (!s) return;
  const t = s.toLowerCase();
  // Order matters: a "Petrol-Electric (Hybrid)" string must classify as
  // hybrid, not as EV. Plug-in beats mild-hybrid beats pure electric.
  if (t.includes("plug") || t.includes("phev")) return "phev";
  if (t.includes("hybrid") || t.includes("mhev") || t.includes("petrol-electric")) {
    return "hybrid";
  }
  if (t.includes("diesel")) return "diesel";
  if (t.includes("petrol")) return "petrol";
  if (t.includes("electric") || /\bev\b|\bbev\b/.test(t)) return "ev";
  return;
}

/** Strip the double-$ artifact that SGCarMart's RSC payload introduces. */
function stripDoubleDollar(s: string | undefined): string | undefined {
  if (!s) return s;
  return s.replace(/^\$+/, "$").replace(/\$\$/g, "$");
}

function splitMakeModel(carModel: string): { make?: string; model?: string; variant?: string } {
  const parts = carModel.trim().split(/\s+/);
  if (parts.length === 0) return {};
  const KNOWN_TWO_WORD = /^(Mercedes[- ]Benz|Land Rover|Alfa Romeo|Aston Martin|Range Rover)/i;
  let make = parts[0];
  let rest = parts.slice(1);
  const two = carModel.match(KNOWN_TWO_WORD);
  if (two) {
    make = two[0];
    rest = carModel.slice(two[0].length).trim().split(/\s+/);
  }
  const model = rest[0];
  const variant = rest.slice(1).join(" ") || undefined;
  return { make, model, variant };
}

export interface CoeInfo {
  months: number;
  endDate: Date;
}
export function parseCoeLeft(coeLeft: string): CoeInfo | null {
  if (!coeLeft) return null;
  const y = /(\d+)\s*yr/.exec(coeLeft);
  const m = /(\d+)\s*mth/.exec(coeLeft);
  const d = /(\d+)\s*day/.exec(coeLeft);
  const years = y ? parseInt(y[1], 10) : 0;
  const months = m ? parseInt(m[1], 10) : 0;
  const days = d ? parseInt(d[1], 10) : 0;
  const totalMonths = years * 12 + months + (days >= 15 ? 1 : 0);
  const end = new Date();
  end.setFullYear(end.getFullYear() + years);
  end.setMonth(end.getMonth() + months);
  end.setDate(end.getDate() + days);
  return { months: totalMonths, endDate: end };
}

function formatCoeMMYYYY(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${mm}/${d.getFullYear()}`;
}

export async function scrapeSgcarmart(url: string): Promise<ScrapedCar> {
  const clean = url.trim();
  // Accept both /listing/<slug>-123456 and legacy /used_cars/info.php?ID=123456
  const aidMatch =
    /-(\d{6,})(?:\?|#|$)/.exec(clean) ||
    /[?&](?:ID|id)=(\d{6,})/.exec(clean);
  if (!aidMatch) throw new Error("Could not find listing id in URL");
  const aid = aidMatch[1];

  const apiKey = process.env.SCRAPERAPI_KEY;
  const fetchUrl = apiKey
    ? `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
        clean
      )}&country_code=sg`
    : clean;

  const res = await fetch(fetchUrl, {
    headers: {
      "User-Agent": UA,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-SG,en-GB;q=0.9,en;q=0.8",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const where = apiKey ? "ScraperAPI" : "SGCarMart direct";
    throw new Error(`${where} returned HTTP ${res.status}`);
  }
  const html = await res.text();

  const carModel =
    pickJsonString(html, "car_model") || pickJsonString(html, "model") || "";
  const priceRaw = pickJsonString(html, "price") || "";
  const price = priceToNumber(priceRaw);
  const installment = pickJsonString(html, "installment");
  const depreciation = pickJsonString(html, "depreciation");
  const coeLeft = pickJsonString(html, "coe_left");
  const mileage = pickJsonString(html, "mileage");
  const owner = pickJsonString(html, "owner");
  const regDate = pickDescByLabel(html, "Reg Date");
  const manufactured =
    pickDescByLabel(html, "Manufactured") || pickJsonNumber(html, "manufactured");
  const description = extractDescription(html);
  const images = extractImages(html, aid);

  const fuelLabel =
    pickDescByLabel(html, "Fuel Type") || pickJsonString(html, "fuel_type");
  const engineLabel =
    pickDescByLabel(html, "Engine Cap") ||
    pickDescByLabel(html, "Engine Capacity") ||
    pickJsonString(html, "engine_cap");
  const engineCc = engineLabel ? priceToNumber(engineLabel) : undefined;

  // Model text wins when it names a hybrid variant (Mild Hybrid, Plug-in).
  const fuelFromModel = parseFuel(carModel);

  const { make, model, variant } = splitMakeModel(carModel);

  const coe = coeLeft ? parseCoeLeft(coeLeft) : null;

  return {
    aid,
    carModel,
    make,
    model,
    variant,
    price,
    priceRaw,
    installment: stripDoubleDollar(installment),
    depreciation: stripDoubleDollar(depreciation),
    coeLeft,
    coeEnd: coe ? formatCoeMMYYYY(coe.endDate) : undefined,
    monthsLeft: coe?.months,
    mileage,
    owner,
    regDate,
    manufactured,
    engineCc,
    fuelType: fuelFromModel || parseFuel(fuelLabel),
    description,
    images,
    sourceUrl: clean,
  };
}
