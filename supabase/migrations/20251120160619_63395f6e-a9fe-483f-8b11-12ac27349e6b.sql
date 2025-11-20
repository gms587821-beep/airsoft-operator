-- Create product catalog table
CREATE TABLE public.product_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product suppliers table (links products to suppliers with pricing)
CREATE TABLE public.product_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.product_catalog(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  purchase_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_suppliers ENABLE ROW LEVEL SECURITY;

-- Catalog is viewable by everyone (public product database)
CREATE POLICY "Product catalog is viewable by everyone"
  ON public.product_catalog
  FOR SELECT
  USING (true);

CREATE POLICY "Product suppliers are viewable by everyone"
  ON public.product_suppliers
  FOR SELECT
  USING (true);

-- Insert seed data for popular airsoft items
INSERT INTO public.product_catalog (name, category, photo_url, description) VALUES
-- Primary Guns
('G&G CM16 Raider', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Popular M4 platform AEG, great for beginners'),
('Tokyo Marui AK47', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Classic AK platform, reliable and durable'),
('Specna Arms SA-E05 EDGE', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'High-end M4 with MOSFET and tight bore barrel'),
('Krytac Trident MK2 CRB', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Premium M4 platform with excellent internals'),
('VFC Avalon Calibur', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Top-tier M4 with VFC legendary quality'),
('ICS CXP-MARS', 'Primary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Split gearbox design for easy maintenance'),

-- Secondary Guns
('Tokyo Marui Hi-Capa 5.1', 'Secondary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Industry standard GBB pistol'),
('ASG CZ P-09', 'Secondary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'CO2 powered reliable sidearm'),
('WE Glock 17 Gen 4', 'Secondary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Affordable Glock platform GBB'),
('Elite Force 1911 TAC', 'Secondary Gun', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'CO2 powered 1911 platform'),

-- Sights/Optics
('Vortex Crossfire Red Dot', 'Sight/Optic', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Reliable red dot sight'),
('EOTech 552 Replica', 'Sight/Optic', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Holographic sight replica'),
('Bushnell TRS-25', 'Sight/Optic', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Budget-friendly red dot'),
('ACOG 4x32 Replica', 'Sight/Optic', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Magnified optic for range'),

-- Vests/Plate Carriers
('Viper VX Buckle Up Plate Carrier', 'Vest/Plate Carrier', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Adjustable plate carrier with MOLLE'),
('8Fields Buckle Up Assault Vest', 'Vest/Plate Carrier', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Budget chest rig option'),
('Warrior Assault DCS', 'Vest/Plate Carrier', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'High-end modular plate carrier'),

-- Batteries
('Nuprol 1600mAh 7.4V LiPo', 'Battery', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Standard stick battery for buffer tubes'),
('Nuprol 2000mAh 11.1V LiPo', 'Battery', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'High-performance 11.1V battery'),
('Titan 3000mAh 7.4V LiPo', 'Battery', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'High-capacity nunchuck battery'),

-- Magazines
('G&G 120rd Mid-Cap Magazine', 'Magazine', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Standard M4 mid-cap magazine'),
('PTS EPM 150rd Mid-Cap', 'Magazine', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Premium polymer mid-cap magazine'),
('AK Cyma 150rd Mid-Cap', 'Magazine', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400', 'Standard AK mid-cap magazine');

-- Insert supplier pricing data
INSERT INTO public.product_suppliers (product_id, supplier_name, price, purchase_link)
SELECT 
  id,
  'Patrol Base',
  CASE 
    WHEN category = 'Primary Gun' THEN 250.00
    WHEN category = 'Secondary Gun' THEN 120.00
    WHEN category = 'Sight/Optic' THEN 45.00
    WHEN category = 'Vest/Plate Carrier' THEN 80.00
    WHEN category = 'Battery' THEN 25.00
    WHEN category = 'Magazine' THEN 15.00
    ELSE 50.00
  END,
  'https://www.patrolbase.co.uk'
FROM public.product_catalog;

INSERT INTO public.product_suppliers (product_id, supplier_name, price, purchase_link)
SELECT 
  id,
  'BZ Paintball',
  CASE 
    WHEN category = 'Primary Gun' THEN 245.00
    WHEN category = 'Secondary Gun' THEN 115.00
    WHEN category = 'Sight/Optic' THEN 42.00
    WHEN category = 'Vest/Plate Carrier' THEN 75.00
    WHEN category = 'Battery' THEN 23.00
    WHEN category = 'Magazine' THEN 14.00
    ELSE 48.00
  END,
  'https://www.bzpaintball.co.uk'
FROM public.product_catalog;