-- =====================================================
-- PHASE 1.5: MARKETPLACE & SITES DATABASE SCHEMA
-- =====================================================

-- =====================================================
-- 1. PRODUCTS TABLE (Curated/Affiliate Items)
-- =====================================================
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  role TEXT,
  brand TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GBP',
  image_url TEXT,
  is_affiliate BOOLEAN NOT NULL DEFAULT false,
  affiliate_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (true);

-- =====================================================
-- 2. MARKETPLACE_LISTINGS TABLE (User-to-User Sales)
-- =====================================================
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GBP',
  image_url TEXT,
  location TEXT,
  seller_user_id UUID NOT NULL,
  linked_gun_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings
CREATE POLICY "Active listings are viewable by everyone"
  ON public.marketplace_listings
  FOR SELECT
  USING (is_active = true OR seller_user_id = auth.uid());

-- Users can create their own listings
CREATE POLICY "Users can create their own listings"
  ON public.marketplace_listings
  FOR INSERT
  WITH CHECK (auth.uid() = seller_user_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
  ON public.marketplace_listings
  FOR UPDATE
  USING (auth.uid() = seller_user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
  ON public.marketplace_listings
  FOR DELETE
  USING (auth.uid() = seller_user_id);

-- =====================================================
-- 3. SITES TABLE (Airsoft Site Directory)
-- =====================================================
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  field_type TEXT NOT NULL,
  thumbnail_url TEXT,
  website_url TEXT,
  booking_url TEXT,
  chrono_rules TEXT,
  description TEXT,
  is_user_created BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Sites are viewable by everyone
CREATE POLICY "Sites are viewable by everyone"
  ON public.sites
  FOR SELECT
  USING (true);

-- Users can create sites
CREATE POLICY "Users can create sites"
  ON public.sites
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own created sites
CREATE POLICY "Users can update their own sites"
  ON public.sites
  FOR UPDATE
  USING (created_by = auth.uid());

-- =====================================================
-- 4. SITE_RATINGS TABLE
-- =====================================================
CREATE TABLE public.site_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  user_id UUID NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  safety_rating INTEGER NOT NULL CHECK (safety_rating >= 1 AND safety_rating <= 5),
  marshal_rating INTEGER NOT NULL CHECK (marshal_rating >= 1 AND marshal_rating <= 5),
  gameplay_rating INTEGER NOT NULL CHECK (gameplay_rating >= 1 AND gameplay_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, user_id)
);

-- Enable RLS
ALTER TABLE public.site_ratings ENABLE ROW LEVEL SECURITY;

-- Ratings are viewable by everyone
CREATE POLICY "Ratings are viewable by everyone"
  ON public.site_ratings
  FOR SELECT
  USING (true);

-- Users can create their own ratings
CREATE POLICY "Users can create their own ratings"
  ON public.site_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON public.site_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON public.site_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. SITE_FAVOURITES TABLE
-- =====================================================
CREATE TABLE public.site_favourites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, user_id)
);

-- Enable RLS
ALTER TABLE public.site_favourites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favourites
CREATE POLICY "Users can view their own favourites"
  ON public.site_favourites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favourites
CREATE POLICY "Users can create their own favourites"
  ON public.site_favourites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favourites
CREATE POLICY "Users can delete their own favourites"
  ON public.site_favourites
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. UPDATE GAME_SESSIONS TO LINK TO SITES
-- =====================================================
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS site_id UUID;

-- =====================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();