INSERT INTO vehicles (id, make, model, variant, slug, fuel_type, engine_cc, motor_power_kw, fuel_efficiency, energy_kwh_100km, omv, arf, coe_category, purchase_price, source, effective_from)
VALUES
  ('audi-a4',            'Audi',          'A4',             '2.0 TFSI S line',       'audi/a4',              'petrol', 1984, NULL, 6.6, NULL, 42000, 63000, 'B', 275000, 'indicative', '2026-10-01'),
  ('audi-q5',            'Audi',          'Q5',             '2.0 TFSI quattro',      'audi/q5',              'petrol', 1984, NULL, 7.9, NULL, 49000, 73500, 'B', 320000, 'indicative', '2026-10-01'),
  ('bmw-x3',             'BMW',           'X3',             'xDrive20i M Sport',     'bmw/x3',               'petrol', 1998, NULL, 7.6, NULL, 52000, 78000, 'B', 335000, 'indicative', '2026-10-01'),
  ('bmw-i4',             'BMW',           'i4',             'eDrive35',              'bmw/i4',               'ev',     NULL, 210,  NULL, 17.5, 55000, 82500, 'B', 338000, 'indicative', '2026-10-01'),
  ('lexus-nx',           'Lexus',         'NX',             '350h Executive',        'lexus/nx',             'hybrid', 2487, NULL, 6.1, NULL, 48000, 72000, 'B', 320000, 'indicative', '2026-10-01'),
  ('lexus-is',           'Lexus',         'IS',             '300h Luxury',           'lexus/is',             'hybrid', 2487, NULL, 5.9, NULL, 42000, 63000, 'B', 272000, 'indicative', '2026-10-01'),
  ('mazda-cx5',          'Mazda',         'CX-5',           '2.0 Luxury',            'mazda/cx-5',           'petrol', 1998, NULL, 7.1, NULL, 25000, 26500, 'A', 190000, 'indicative', '2026-10-01'),
  ('mazda-3',            'Mazda',         '3',              '1.5 Hatchback',         'mazda/3',              'petrol', 1496, NULL, 6.0, NULL, 20000, 20000, 'A', 162000, 'indicative', '2026-10-01'),
  ('toyota-camry',       'Toyota',        'Camry',          '2.5 Hybrid Elegance',   'toyota/camry',         'hybrid', 2487, NULL, 4.3, NULL, 30000, 36000, 'A', 220000, 'indicative', '2026-10-01'),
  ('toyota-rav4',        'Toyota',        'RAV4',           '2.5 Hybrid Dynamic',    'toyota/rav4',          'hybrid', 2487, NULL, 4.7, NULL, 32000, 40000, 'B', 235000, 'indicative', '2026-10-01'),
  ('honda-crv',          'Honda',         'CR-V',           '1.5 VTEC Turbo EL',     'honda/cr-v',           'petrol', 1498, NULL, 7.4, NULL, 28000, 32000, 'A', 215000, 'indicative', '2026-10-01'),
  ('hyundai-ioniq5',     'Hyundai',       'Ioniq 5',        'Long Range',            'hyundai/ioniq-5',      'ev',     NULL, 168,  NULL, 16.5, 36000, 46000, 'B', 215000, 'indicative', '2026-10-01'),
  ('kia-ev6',            'Kia',           'EV6',            'GT-Line RWD',           'kia/ev6',              'ev',     NULL, 168,  NULL, 16.5, 38000, 48500, 'B', 230000, 'indicative', '2026-10-01'),
  ('polestar-2',         'Polestar',      '2',              'Long Range SM',         'polestar/2',           'ev',     NULL, 170,  NULL, 17.0, 40000, 55000, 'B', 240000, 'indicative', '2026-10-01'),
  ('volkswagen-golf',    'Volkswagen',    'Golf',           '1.5 eTSI R-Line',       'volkswagen/golf',      'hybrid', 1498, NULL, 5.8, NULL, 25000, 26500, 'A', 195000, 'indicative', '2026-10-01'),
  ('mg4',                'MG',            '4',              'Luxury',                'mg/4',                 'ev',     NULL, 125,  NULL, 15.5, 24000, 24000, 'A', 165000, 'indicative', '2026-10-01'),
  ('nissan-note',        'Nissan',        'Note',           'e-Power Premium',       'nissan/note',          'hybrid', 1198, NULL, 3.8, NULL, 20000, 20000, 'A', 148000, 'indicative', '2026-10-01'),
  ('suzuki-swift',       'Suzuki',        'Swift',          '1.2 Hybrid',            'suzuki/swift',         'hybrid', 1197, NULL, 4.3, NULL, 15000, 15000, 'A', 118000, 'indicative', '2026-10-01'),
  ('porsche-macan',      'Porsche',       'Macan',          '2.0 PDK',               'porsche/macan',        'petrol', 1984, NULL, 8.9, NULL, 60000, 90000, 'B', 420000, 'indicative', '2026-10-01'),
  ('porsche-taycan',     'Porsche',       'Taycan',         '4S',                    'porsche/taycan',       'ev',     NULL, 320,  NULL, 22.0, 85000, 127500, 'B', 490000, 'indicative', '2026-10-01')
ON CONFLICT (id) DO NOTHING;
