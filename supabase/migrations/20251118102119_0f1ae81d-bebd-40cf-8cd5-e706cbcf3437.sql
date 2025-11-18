-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name text,
  member_since timestamp with time zone DEFAULT now(),
  games_played integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', 'Operator_' || substr(new.id::text, 1, 8))
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create loadouts table
CREATE TABLE public.loadouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  primary_gun_id uuid,
  secondary_gun_id uuid,
  gear_items text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on loadouts
ALTER TABLE public.loadouts ENABLE ROW LEVEL SECURITY;

-- Loadouts policies
CREATE POLICY "Users can view their own loadouts"
  ON public.loadouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loadouts"
  ON public.loadouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loadouts"
  ON public.loadouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loadouts"
  ON public.loadouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create guns table (gear registry)
CREATE TABLE public.guns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  gun_type text NOT NULL,
  brand text,
  model text,
  serial_number text,
  fps integer,
  joules numeric(5,2),
  purchase_date date,
  purchase_price numeric(10,2),
  condition text,
  notes text,
  upgrades text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on guns
ALTER TABLE public.guns ENABLE ROW LEVEL SECURITY;

-- Guns policies
CREATE POLICY "Users can view their own guns"
  ON public.guns
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guns"
  ON public.guns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guns"
  ON public.guns
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guns"
  ON public.guns
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loadouts_updated_at
  BEFORE UPDATE ON public.loadouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guns_updated_at
  BEFORE UPDATE ON public.guns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();