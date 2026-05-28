-- Create book_submissions table for tracking teacher book confirmations
CREATE TABLE public.book_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  centre_id UUID NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('photo', 'custom_books')),
  photo_url TEXT,
  custom_books JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_by UUID NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  month TEXT NOT NULL DEFAULT 'february_2026',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(centre_id, month)
);

-- Enable RLS
ALTER TABLE public.book_submissions ENABLE ROW LEVEL SECURITY;

-- Educators can view their centre's submissions
CREATE POLICY "Educators can view their centre submissions"
ON public.book_submissions
FOR SELECT
USING (centre_id = get_staff_centre(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Educators can create submissions for their centre
CREATE POLICY "Educators can create submissions for their centre"
ON public.book_submissions
FOR INSERT
WITH CHECK (centre_id = get_staff_centre(auth.uid()) AND submitted_by = auth.uid());

-- Educators can update their own pending submissions
CREATE POLICY "Educators can update their pending submissions"
ON public.book_submissions
FOR UPDATE
USING (centre_id = get_staff_centre(auth.uid()) AND status = 'pending')
WITH CHECK (centre_id = get_staff_centre(auth.uid()));

-- Admins can manage all submissions
CREATE POLICY "Admins can manage all submissions"
ON public.book_submissions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for book photos
INSERT INTO storage.buckets (id, name, public) VALUES ('book-photos', 'book-photos', true);

-- Storage policies for book photos
CREATE POLICY "Anyone can view book photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-photos');

CREATE POLICY "Authenticated users can upload book photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own book photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'book-photos' AND auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_book_submissions_updated_at
BEFORE UPDATE ON public.book_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();