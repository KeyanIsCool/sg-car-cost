ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS hero_image text;

-- Seed hero image URLs for the catalogue (manufacturer press / Unsplash fallback).
-- These are large well-known public images; replace with your own CDN later.
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80' WHERE id = 'bmw-320i-m-sport';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80' WHERE id = 'bmw-x3';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1655410541052-5c3b26f9640d?w=800&q=80' WHERE id = 'bmw-i4';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1618843479631-f7e7f1f03a0f?w=800&q=80' WHERE id = 'mercedes-c180';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' WHERE id = 'toyota-corolla-altis';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'honda-civic';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'tesla-model-3';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80' WHERE id = 'byd-atto-3';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?w=800&q=80' WHERE id = 'toyota-prius';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1612911912304-9f2bbd0f6b63?w=800&q=80' WHERE id = 'volvo-xc40';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'audi-a4';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'audi-q5';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'lexus-nx';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'lexus-is';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'mazda-cx5';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' WHERE id = 'mazda-3';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?w=800&q=80' WHERE id = 'toyota-camry';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?w=800&q=80' WHERE id = 'toyota-rav4';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'honda-crv';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'hyundai-ioniq5';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'kia-ev6';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'polestar-2';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' WHERE id = 'volkswagen-golf';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'mg4';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' WHERE id = 'nissan-note';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' WHERE id = 'suzuki-swift';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80' WHERE id = 'porsche-macan';
UPDATE vehicles SET hero_image = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80' WHERE id = 'porsche-taycan';
