-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('standard', 'premium');

-- Add subscription fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN subscription_tier public.subscription_tier NOT NULL DEFAULT 'standard',
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_subscription_id text,
ADD COLUMN subscription_status text DEFAULT 'active',
ADD COLUMN subscription_ends_at timestamp with time zone;

-- Create index for Stripe lookups
CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_subscription_id ON public.profiles(stripe_subscription_id);