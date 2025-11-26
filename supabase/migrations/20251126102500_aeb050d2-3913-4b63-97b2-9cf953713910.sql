-- Add primary_role to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_role TEXT;

-- Add comment
COMMENT ON COLUMN public.profiles.primary_role IS 'User''s preferred play style: cqb, dmr, support, rifleman, sniper';