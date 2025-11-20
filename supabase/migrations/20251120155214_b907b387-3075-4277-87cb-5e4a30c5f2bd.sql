-- Create planned_loadouts table for dream builds
CREATE TABLE public.planned_loadouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  total_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create planned_loadout_items table for individual components
CREATE TABLE public.planned_loadout_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loadout_id UUID NOT NULL REFERENCES public.planned_loadouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  photo_url TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  retailer_name TEXT NOT NULL,
  purchase_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.planned_loadouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_loadout_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for planned_loadouts
CREATE POLICY "Users can view their own planned loadouts"
  ON public.planned_loadouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own planned loadouts"
  ON public.planned_loadouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned loadouts"
  ON public.planned_loadouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned loadouts"
  ON public.planned_loadouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for planned_loadout_items
CREATE POLICY "Users can view items in their own loadouts"
  ON public.planned_loadout_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.planned_loadouts
    WHERE planned_loadouts.id = planned_loadout_items.loadout_id
    AND planned_loadouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create items in their own loadouts"
  ON public.planned_loadout_items
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.planned_loadouts
    WHERE planned_loadouts.id = planned_loadout_items.loadout_id
    AND planned_loadouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items in their own loadouts"
  ON public.planned_loadout_items
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.planned_loadouts
    WHERE planned_loadouts.id = planned_loadout_items.loadout_id
    AND planned_loadouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their own loadouts"
  ON public.planned_loadout_items
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.planned_loadouts
    WHERE planned_loadouts.id = planned_loadout_items.loadout_id
    AND planned_loadouts.user_id = auth.uid()
  ));

-- Trigger to update total_cost when items change
CREATE OR REPLACE FUNCTION public.update_loadout_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.planned_loadouts
  SET total_cost = (
    SELECT COALESCE(SUM(price), 0)
    FROM public.planned_loadout_items
    WHERE loadout_id = COALESCE(NEW.loadout_id, OLD.loadout_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.loadout_id, OLD.loadout_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic cost calculation
CREATE TRIGGER update_loadout_cost_on_insert
  AFTER INSERT ON public.planned_loadout_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_loadout_total_cost();

CREATE TRIGGER update_loadout_cost_on_update
  AFTER UPDATE ON public.planned_loadout_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_loadout_total_cost();

CREATE TRIGGER update_loadout_cost_on_delete
  AFTER DELETE ON public.planned_loadout_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_loadout_total_cost();