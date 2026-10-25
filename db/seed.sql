-- Seed indicative data. Safe to re-run (ON CONFLICT ... DO NOTHING).

INSERT INTO vehicles (id, make, model, variant, slug, fuel_type, engine_cc, motor_power_kw, fuel_efficiency, energy_kwh_100km, omv, arf, coe_category, purchase_price, source, effective_from)
VALUES
  ('bmw-320i-m-sport',    'BMW',           '3 Series',       '320i M Sport',       'bmw/320i-m-sport',       'petrol', 1998, NULL, 6.5, NULL, 48000, 72000, 'B', 310000, 'indicative', '2026-01-01'),
  ('mercedes-c180',       'Mercedes-Benz', 'C-Class',        'C180 Avantgarde',    'mercedes-benz/c180',     'petrol', 1496, NULL, 6.7, NULL, 47000, 70000, 'B', 305000, 'indicative', '2026-01-01'),
  ('toyota-corolla-altis','Toyota',        'Corolla Altis',  '1.6 Elegance',       'toyota/corolla-altis',   'petrol', 1598, NULL, 5.8, NULL, 20000, 20000, 'A', 165000, 'indicative', '2026-01-01'),
  ('honda-civic',         'Honda',         'Civic',          '1.5 VTEC Turbo',     'honda/civic',            'petrol', 1498, NULL, 6.2, NULL, 22000, 23500, 'A', 175000, 'indicative', '2026-01-01'),
  ('tesla-model-3',       'Tesla',         'Model 3',        'RWD',                'tesla/model-3',          'ev',     NULL, 208,  NULL, 14.9, 42000, 59500, 'B', 220000, 'indicative', '2026-01-01'),
  ('byd-atto-3',          'BYD',           'Atto 3',         'Extended Range',     'byd/atto-3',             'ev',     NULL, 150,  NULL, 16.0, 28000, 34000, 'A', 170000, 'indicative', '2026-01-01'),
  ('toyota-prius',        'Toyota',        'Prius',          'Hybrid',             'toyota/prius',           'hybrid', 1797, NULL, 3.4, NULL, 30000, 36000, 'A', 190000, 'indicative', '2026-01-01'),
  ('volvo-xc40',          'Volvo',         'XC40',           'B4 Mild Hybrid',     'volvo/xc40',             'hybrid', 1969, NULL, 7.6, NULL, 40000, 58000, 'B', 265000, 'indicative', '2026-01-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loan_rates (lender, flat_rate, max_tenure_years, effective_date, source) VALUES
  ('DBS',                0.0248, 7, '2026-10-01', 'indicative'),
  ('OCBC',               0.0278, 7, '2026-10-01', 'indicative'),
  ('UOB',                0.0278, 7, '2026-10-01', 'indicative'),
  ('Maybank',            0.0278, 7, '2026-10-01', 'indicative'),
  ('Hong Leong Finance', 0.0248, 7, '2026-10-01', 'indicative'),
  ('Tokyo Century',      0.0288, 7, '2026-10-01', 'indicative')
ON CONFLICT DO NOTHING;

INSERT INTO fuel_prices (grade, price_per_litre, effective_date, source) VALUES
  ('92',      2.72, '2026-10-01', 'indicative'),
  ('95',      2.80, '2026-10-01', 'indicative'),
  ('98',      3.25, '2026-10-01', 'indicative'),
  ('diesel',  2.50, '2026-10-01', 'indicative')
ON CONFLICT (grade) DO UPDATE SET
  price_per_litre = EXCLUDED.price_per_litre,
  effective_date  = EXCLUDED.effective_date,
  source          = EXCLUDED.source;
