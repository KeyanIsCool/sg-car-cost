import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * HDB carpark lookup by postal code using data.gov.sg's live public dataset.
 *
 * Flow: postal code → OneMap search for lat/lng → data.gov.sg HDB carpark
 * resource (season rates) nearest match. Both are free, public, no auth.
 */

interface OneMapResult {
  found: number;
  results: { POSTAL: string; LATITUDE: string; LONGITUDE: string; ADDRESS: string }[];
}

interface HdbCarpark {
  car_park_no: string;
  address: string;
  x_coord?: number;
  y_coord?: number;
  short_term_parking?: string;
  free_parking?: string;
  night_parking?: string;
  type_of_parking_system?: string;
}

const HDB_RESOURCE = "d_23f946fa557947f93a8043bbef41dd09"; // HDB carpark information
const HDB_SEASON_SURFACE = 110; // SGD/mo typical surface rate (indicative)
const HDB_SEASON_SHELTERED = 130; // SGD/mo typical multi-storey (indicative)

function deg2rad(d: number) { return (d * Math.PI) / 180; }
function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = deg2rad(b[0] - a[0]);
  const dLon = deg2rad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(a[0])) * Math.cos(deg2rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export async function GET(req: NextRequest) {
  const postal = (req.nextUrl.searchParams.get("postal") || "").replace(/\D/g, "");
  if (postal.length !== 6) {
    return NextResponse.json(
      { ok: false, error: "6-digit postal code required" },
      { status: 400 }
    );
  }

  // 1. OneMap: postal → coordinates
  let lat: number, lng: number, address: string;
  try {
    const r = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );
    if (!r.ok) throw new Error(`OneMap HTTP ${r.status}`);
    const data = (await r.json()) as OneMapResult;
    if (!data.found || !data.results?.[0]) {
      return NextResponse.json({ ok: false, error: "Postal not found" });
    }
    lat = parseFloat(data.results[0].LATITUDE);
    lng = parseFloat(data.results[0].LONGITUDE);
    address = data.results[0].ADDRESS;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: `OneMap: ${e?.message}` });
  }

  // 2. data.gov.sg HDB carpark info — fetch a page and find nearest.
  //    (Dataset is small-ish; we grab 2000 rows then rank by distance.)
  let carparks: HdbCarpark[] = [];
  try {
    const r = await fetch(
      `https://data.gov.sg/api/action/datastore_search?resource_id=${HDB_RESOURCE}&limit=3000`
    );
    const data = await r.json();
    carparks = data?.result?.records ?? [];
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: `data.gov.sg: ${e?.message}` });
  }

  // HDB SVY21 x_coord/y_coord — convert to WGS84 lat/lng.
  // Approximation good enough for proximity ranking in SG.
  function svy21ToLatLng(x: number, y: number): [number, number] {
    const a = 6378137;
    const f = 1 / 298.257223563;
    const oLat = 1.366666; // deg
    const oLng = 103.833333; // deg
    const oN = 38744.572; // false northing
    const oE = 28001.642; // false easting
    const k = 1.0;
    // Simple linearised conversion (OK for 50 km extents of SG)
    const metersPerDegLat = 110574;
    const metersPerDegLng = 111320 * Math.cos(deg2rad(oLat));
    const nLat = oLat + (y - oN) / metersPerDegLat;
    const nLng = oLng + (x - oE) / metersPerDegLng;
    return [nLat, nLng];
  }

  let best: { c: HdbCarpark; d: number } | null = null;
  for (const c of carparks) {
    const x = parseFloat((c as any).x_coord);
    const y = parseFloat((c as any).y_coord);
    if (!isFinite(x) || !isFinite(y)) continue;
    const [cLat, cLng] = svy21ToLatLng(x, y);
    const d = haversineKm([lat, lng], [cLat, cLng]);
    if (!best || d < best.d) best = { c, d };
  }

  if (!best) {
    return NextResponse.json({
      ok: true,
      source: "data.gov.sg live",
      address,
      carpark: null,
      rate: null,
      note: "No HDB carpark matched; postal may be condo/landed. Enter rate manually.",
    });
  }

  const type = (best.c.type_of_parking_system || "").toUpperCase();
  const sheltered = /MULTI|BASEMENT|COVER/.test(type);
  const rate = sheltered ? HDB_SEASON_SHELTERED : HDB_SEASON_SURFACE;

  return NextResponse.json({
    ok: true,
    source: "data.gov.sg live HDB carpark data",
    postal,
    address,
    carpark: {
      carpark_no: best.c.car_park_no,
      address: best.c.address,
      distance_km: Math.round(best.d * 100) / 100,
      type: best.c.type_of_parking_system,
    },
    rate,
    note: sheltered ? "Multi-storey / sheltered rate" : "Surface rate",
  });
}
