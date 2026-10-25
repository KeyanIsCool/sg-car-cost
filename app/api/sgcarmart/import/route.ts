import { NextRequest, NextResponse } from "next/server";
import { scrapeSgcarmart } from "@/lib/sgcarmart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (!/(^|\.)sgcarmart\.com$/i.test(u.hostname)) {
    return NextResponse.json(
      { ok: false, error: "Only sgcarmart.com URLs are supported" },
      { status: 400 }
    );
  }

  try {
    const car = await scrapeSgcarmart(u.toString());
    return NextResponse.json({
      ok: true,
      result: {
        make: car.make,
        model: car.model,
        variant: car.variant,
        carModel: car.carModel,
        price: car.price,
        engineCc: car.engineCc,
        fuelType: car.fuelType,
        mileage: car.mileage,
        regDate: car.regDate,
        coeEnd: car.coeEnd,
        monthsLeft: car.monthsLeft,
        depreciation: car.depreciation,
        images: car.images.slice(0, 1),
        listingUrl: car.sourceUrl,
      },
    });
  } catch (e: any) {
    const msg = e?.message || "Scrape failed";
    const needsKey = /HTTP 403|HTTP 429|SGCarMart direct/i.test(msg) && !process.env.SCRAPERAPI_KEY;
    return NextResponse.json({
      ok: false,
      error: needsKey
        ? "SGCarMart is blocking the direct fetch. Set SCRAPERAPI_KEY on this Vercel project to route through a scraping proxy."
        : msg,
    });
  }
}
