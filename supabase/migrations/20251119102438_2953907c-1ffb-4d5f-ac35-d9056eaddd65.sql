-- Create kit_items table for tracking airsoft gear
CREATE TABLE public.kit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  condition TEXT,
  purchase_date DATE,
  purchase_price NUMERIC,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kit_items ENABLE ROW LEVEL SECURITY;

-- Create policies for kit_items
CREATE POLICY "Users can view their own kit items"
ON public.kit_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own kit items"
ON public.kit_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kit items"
ON public.kit_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kit items"
ON public.kit_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create game_sessions table for tracking where players have played
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_name TEXT NOT NULL,
  site_location TEXT,
  game_date DATE NOT NULL,
  is_upcoming BOOLEAN NOT NULL DEFAULT false,
  booking_reference TEXT,
  cost NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for game_sessions
CREATE POLICY "Users can view their own game sessions"
ON public.game_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions"
ON public.game_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions"
ON public.game_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game sessions"
ON public.game_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for kit_items updated_at
CREATE TRIGGER update_kit_items_updated_at
BEFORE UPDATE ON public.kit_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for game_sessions updated_at
CREATE TRIGGER update_game_sessions_updated_at
BEFORE UPDATE ON public.game_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for kit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('kit-photos', 'kit-photos', true);

-- Create policies for kit-photos bucket
CREATE POLICY "Users can view kit photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'kit-photos');

CREATE POLICY "Users can upload their own kit photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'kit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own kit photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'kit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own kit photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'kit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);