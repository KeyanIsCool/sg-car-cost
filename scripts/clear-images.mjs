import { readFileSync } from "node:fs";
import { Client } from "@neondatabase/serverless";

const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
for (const line of txt.split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i < 0 || line.startsWith("#")) continue;
  const k = line.slice(0, i).trim();
  let v = line.slice(i + 1).trim();
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  if (!process.env[k]) process.env[k] = v;
}

const c = new Client(process.env.DATABASE_URL);
await c.connect();
await c.query("update vehicles set hero_image = null");
console.log("Cleared hero_image for all vehicles — SVG CarArt will render.");
await c.end();
