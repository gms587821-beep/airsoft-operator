-- Add new fields to sites table to accommodate CSV data
ALTER TABLE public.sites
ADD COLUMN IF NOT EXISTS county TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS opening_hours TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT;

COMMENT ON COLUMN public.sites.county IS 'County/district within region';
COMMENT ON COLUMN public.sites.phone IS 'Contact phone number';
COMMENT ON COLUMN public.sites.opening_hours IS 'Opening hours information';
COMMENT ON COLUMN public.sites.source_url IS 'Source URL where data was obtained';