-- Create storage bucket for session images
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-images', 'session-images', true);

-- Allow anyone to view session images (public bucket)
CREATE POLICY "Session images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'session-images');

-- Allow admins to upload session images
CREATE POLICY "Admins can upload session images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'session-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete session images
CREATE POLICY "Admins can delete session images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'session-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create table to store session image references
CREATE TABLE public.session_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL,
  activity_key TEXT NOT NULL, -- 'freeplay', 'activity1', 'activity2', 'activity3', 'activity4'
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_images ENABLE ROW LEVEL SECURITY;

-- Everyone can view session images
CREATE POLICY "Session images viewable by all authenticated users"
ON public.session_images FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage session images
CREATE POLICY "Admins can manage session images"
ON public.session_images FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);