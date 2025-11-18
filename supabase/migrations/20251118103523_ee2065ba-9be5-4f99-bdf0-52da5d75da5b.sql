-- Create operators table
CREATE TABLE public.operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  personality_description text,
  default_avatar text,
  accent_color text NOT NULL,
  primary_module text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Add active_operator_id to profiles
ALTER TABLE public.profiles
ADD COLUMN active_operator_id uuid REFERENCES public.operators(id);

-- Enable RLS on operators table
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;

-- Operators are viewable by everyone
CREATE POLICY "Operators are viewable by everyone"
ON public.operators
FOR SELECT
USING (true);

-- Insert The Marshal
INSERT INTO public.operators (name, role, personality_description, default_avatar, accent_color, primary_module)
VALUES (
  'The Marshal',
  'Tactical Leader & Mentor',
  'Calm, tactical, authoritative. Speaks in short, direct sentences. Your guide across the battlefield.',
  '🛡️',
  'hsl(210, 100%, 56%)',
  'Onboarding'
);

-- Insert The Armourer
INSERT INTO public.operators (name, role, personality_description, default_avatar, accent_color, primary_module)
VALUES (
  'The Armourer',
  'Tech & Tuning Specialist',
  'Smart, precise, slightly humorous. Expert in diagnostics, upgrades, and maintenance. Keeps your gear running smooth.',
  '🔧',
  'hsl(30, 100%, 50%)',
  'Diagnostics'
);

-- Insert future operator placeholders
INSERT INTO public.operators (name, role, personality_description, default_avatar, accent_color, primary_module)
VALUES 
  ('RAVEN-1', 'Sniper/DMR Specialist', 'Coming soon', '🎯', 'hsl(0, 0%, 50%)', 'Future'),
  ('Ghostline', 'CQB Expert', 'Coming soon', '👻', 'hsl(0, 0%, 50%)', 'Future'),
  ('AX-7', 'Futuristic AI', 'Coming soon', '🤖', 'hsl(0, 0%, 50%)', 'Future');