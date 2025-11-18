-- Create storage bucket for gun photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gun-photos', 'gun-photos', true);

-- Create RLS policies for gun photos
CREATE POLICY "Users can view all gun photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gun-photos');

CREATE POLICY "Users can upload their own gun photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gun-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own gun photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gun-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own gun photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gun-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add photo_url column to guns table
ALTER TABLE guns ADD COLUMN IF NOT EXISTS photo_url text;