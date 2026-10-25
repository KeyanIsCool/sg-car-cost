import { MetadataRoute } from "next";
import { VEHICLES } from "@/lib/data/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sgcarcost.example";
  const now = new Date();
  const staticPaths = [
    "",
    "/calculator",
    "/cars",
    "/car-loan-calculator",
    "/road-tax-calculator",
    "/methodology",
    "/data-sources",
    "/privacy",
    "/terms",
    "/contact",
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now })),
    ...VEHICLES.map((v) => ({ url: `${base}/cars/${v.slug}`, lastModified: now })),
  ];
}
