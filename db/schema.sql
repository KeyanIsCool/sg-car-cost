-- Singapore Car Ownership Calculator schema (Neon-compatible Postgres)
-- Run with:  psql $DATABASE_URL -f db/schema.sql

CREATE TABLE IF NOT EXISTS vehicles (
  id              text PRIMARY KEY,
  make            text NOT NULL,
  model           text NOT NULL,
  variant         text,
  slug            text UNIQUE NOT NULL,
  body_type       text,
  fuel_type       text NOT NULL,
  engine_cc       integer,
  motor_power_kw  integer,
  fuel_efficiency numeric,
  battery_kwh     numeric,
  energy_kwh_100km numeric,
  omv             numeric,
  arf             numeric,
  coe_category    text,
  parf_eligible   boolean,
  parf_rebate     numeric,
  purchase_price  numeric NOT NULL,
  source          text,
  source_url      text,
  effective_from  date,
  effective_to    date,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vehicles_make_idx ON vehicles (make);
CREATE INDEX IF NOT EXISTS vehicles_fuel_idx ON vehicles (fuel_type);

CREATE TABLE IF NOT EXISTS loan_rates (
  id              serial PRIMARY KEY,
  lender          text NOT NULL,
  vehicle_type    text,
  flat_rate       numeric NOT NULL,
  max_tenure_years integer NOT NULL,
  effective_date  date NOT NULL,
  expiry_date     date,
  source          text,
  source_url      text
);

CREATE TABLE IF NOT EXISTS fuel_prices (
  grade           text PRIMARY KEY,
  price_per_litre numeric NOT NULL,
  effective_date  date NOT NULL,
  source          text,
  source_url      text
);

CREATE TABLE IF NOT EXISTS road_tax_rules (
  id              serial PRIMARY KEY,
  vehicle_type    text NOT NULL,
  formula_version text NOT NULL,
  effective_from  date NOT NULL,
  effective_to    date,
  source          text,
  source_url      text,
  rule_json       jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_locations (
  id              serial PRIMARY KEY,
  carpark_id      text UNIQUE,
  name            text NOT NULL,
  address         text,
  postal_code     text,
  latitude        numeric,
  longitude       numeric,
  parking_type    text,
  season_rate     numeric,
  effective_date  date,
  source          text,
  source_url      text
);
CREATE INDEX IF NOT EXISTS parking_postal_idx ON parking_locations (postal_code);

CREATE TABLE IF NOT EXISTS erp_rates (
  id              serial PRIMARY KEY,
  gantry          text NOT NULL,
  time_slot       text NOT NULL,
  rate            numeric NOT NULL,
  effective_from  date NOT NULL,
  effective_to    date,
  source          text
);

CREATE TABLE IF NOT EXISTS data_sources (
  id              serial PRIMARY KEY,
  name            text UNIQUE NOT NULL,
  description     text,
  last_updated    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calculator_sessions (
  id              text PRIMARY KEY,
  state_json      jsonb NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
