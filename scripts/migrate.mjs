import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local loader so we don't need dotenv as a dep.
function loadEnv() {
  try {
    const txt = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
    for (const line of txt.split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx < 0) continue;
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {}
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const dbDir = join(__dirname, "..", "db");
const files = ["schema.sql", "seed.sql"];

const client = new Client(url);
await client.connect();
console.log("Connected to Neon.");

for (const f of files) {
  const sql = readFileSync(join(dbDir, f), "utf8");
  console.log(`\n→ Executing ${f} (${sql.length} chars)…`);
  try {
    await client.query(sql);
    console.log(`✓ ${f} done`);
  } catch (e) {
    console.error(`✗ ${f} failed:`, e.message);
    await client.end();
    process.exit(1);
  }
}

const { rows } = await client.query(
  "select count(*)::int as vehicles from vehicles"
);
console.log(`\n✓ Verified: ${rows[0].vehicles} vehicles in Neon.`);

await client.end();
