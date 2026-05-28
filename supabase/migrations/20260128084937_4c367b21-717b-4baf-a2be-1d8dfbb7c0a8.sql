-- Create storage bucket for calendar type images
INSERT INTO storage.buckets (id, name, public)
VALUES ('calendar-images', 'calendar-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Calendar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'calendar-images');

-- Allow admins to upload/update/delete
CREATE POLICY "Admins can manage calendar images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'calendar-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'calendar-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);