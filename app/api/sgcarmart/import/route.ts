import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Best-effort server-side extractor for a user-supplied SGCarMart listing URL.
 * - User-initiated (triggered by the user pasting the link they are viewing).
 * - Single fetch, standard HTTP, no CAPTCHA or auth bypass.
 * - If SGCarMart's response doesn't expose the fields, the client falls back
 *   to manual entry.
 */

interface Extracted {
  make?: string;
  model?: string;
  variant?: string;
  price?: number;
  regDate?: string;
  coeExpiry?: string;
  omv?: number;
  arf?: number;
  engineCc?: number;
  fuelType?: "petrol" | "diesel" | "hybrid" | "ev";
  mileage?: number;
  roadTax?: number;
  depreciation?: number;
  listingUrl: string;
}

function toNum(s: string | undefined): number | undefined {
  if (!s) return;
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function pick(re: RegExp, html: string): string | undefined {
  const m = html.match(re);
  return m ? m[1].trim() : undefined;
}

function parseFuel(s: string | undefined): Extracted["fuelType"] {
  if (!s) return;
  const t = s.toLowerCase();
  if (t.includes("electric")) return "ev";
  if (t.includes("hybrid")) return "hybrid";
  if (t.includes("diesel")) return "diesel";
  if (t.includes("petrol")) return "petrol";
  return;
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url || typeof url !== "string") {
    return NextResponse.json({ ok: false, error: "URL required" }, { status: 400 });
  }

  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
  }
  if (!/sgcarmart\.com$/i.test(u.hostname) && !/\.sgcarmart\.com$/i.test(u.hostname)) {
    return NextResponse.json(
      { ok: false, error: "Only sgcarmart.com URLs are supported" },
      { status: 400 }
    );
  }

  let html: string;
  try {
    const res = await fetch(u.toString(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-SG,en;q=0.9",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Listing returned HTTP ${res.status}. Enter details manually.`,
        },
        { status: 200 }
      );
    }
    html = await res.text();
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `Fetch failed: ${e?.message ?? "unknown"}` },
      { status: 200 }
    );
  }

  // Strip tags and collapse whitespace into a searchable blob.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

  // Title / h1 usually carries "Year Make Model Variant"
  const title =
    pick(/<title>([^<]{3,200})<\/title>/i, html) ||
    pick(/<h1[^>]*>([^<]{3,200})<\/h1>/i, html) ||
    "";
  const titleCleaned = title.replace(/\s*\|\s*sgcarmart.*/i, "").trim();

  // Price: look for "$XXX,XXX" near "Price"
  const priceStr =
    pick(/Price[^$]{0,30}\$\s*([\d,]+)/i, text) ||
    pick(/\$\s*([\d]{2,3}(?:,\d{3}){1,2})\b/, text);

  const regYear = pick(/Reg[^0-9]{0,30}(\d{1,2}\s+[A-Za-z]{3}\s+\d{4}|\d{4})/i, text);
  const coeExpiry = pick(/COE Expiry[^0-9]{0,30}(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/i, text);
  const omv = pick(/OMV[^$]{0,20}\$\s*([\d,]+)/i, text);
  const arf = pick(/ARF[^$]{0,20}\$\s*([\d,]+)/i, text);
  const engineCc = pick(/Engine Cap[^0-9]{0,30}([\d,]+)\s*cc/i, text);
  const fuel = pick(/Fuel\s*Type[^A-Za-z]{0,15}([A-Za-z\-\s]{3,30})/i, text);
  const mileage = pick(/Mileage[^0-9]{0,20}([\d,]+)\s*km/i, text);
  const roadTax = pick(/Road\s*Tax[^$]{0,20}\$\s*([\d,]+)/i, text);
  const depreciation = pick(/Depre?ciation[^$]{0,20}\$\s*([\d,]+)/i, text);

  // Try to break "Year Make Model …" from the title.
  let make: string | undefined;
  let model: string | undefined;
  let variant: string | undefined;
  if (titleCleaned) {
    const m = titleCleaned.match(
      /^(?:\d{4}\s+)?([A-Za-z\-]+(?:\s[A-Za-z\-]+)?)\s+(.+?)(?:\s+for sale.*)?$/i
    );
    if (m) {
      make = m[1];
      const rest = m[2];
      const parts = rest.split(/\s+/);
      model = parts.slice(0, 2).join(" ");
      variant = parts.slice(2).join(" ") || undefined;
    }
  }

  const result: Extracted = {
    listingUrl: u.toString(),
    make,
    model,
    variant,
    price: toNum(priceStr),
    regDate: regYear,
    coeExpiry,
    omv: toNum(omv),
    arf: toNum(arf),
    engineCc: toNum(engineCc),
    fuelType: parseFuel(fuel),
    mileage: toNum(mileage),
    roadTax: toNum(roadTax),
    depreciation: toNum(depreciation),
  };

  const filled = Object.values(result).filter((v) => v !== undefined && v !== "").length - 1;
  if (filled < 2) {
    return NextResponse.json({
      ok: false,
      error:
        "We couldn't automatically read this listing. You can enter the car details manually.",
      result,
    });
  }

  return NextResponse.json({ ok: true, result });
}
