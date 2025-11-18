-- Create diagnostic_conversations table
CREATE TABLE public.diagnostic_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gun_id UUID REFERENCES public.guns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  conversation JSONB NOT NULL,
  operator_name TEXT NOT NULL DEFAULT 'The Armourer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diagnostic_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own diagnostics"
ON public.diagnostic_conversations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnostics"
ON public.diagnostic_conversations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostics"
ON public.diagnostic_conversations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostics"
ON public.diagnostic_conversations
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_diagnostic_conversations_updated_at
BEFORE UPDATE ON public.diagnostic_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();