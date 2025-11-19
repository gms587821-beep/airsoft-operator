-- Create enum for maintenance types
CREATE TYPE maintenance_type AS ENUM ('cleaning', 'part_replacement', 'inspection', 'lubrication', 'repair', 'upgrade', 'other');

-- Create gun_maintenance table
CREATE TABLE public.gun_maintenance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gun_id UUID NOT NULL REFERENCES public.guns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  maintenance_type maintenance_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  parts_replaced TEXT[],
  cost NUMERIC,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gun_maintenance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own maintenance logs"
ON public.gun_maintenance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own maintenance logs"
ON public.gun_maintenance
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance logs"
ON public.gun_maintenance
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance logs"
ON public.gun_maintenance
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gun_maintenance_updated_at
BEFORE UPDATE ON public.gun_maintenance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();