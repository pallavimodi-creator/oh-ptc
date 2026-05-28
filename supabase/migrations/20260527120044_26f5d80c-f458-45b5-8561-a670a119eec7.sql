
-- 1) Restrict SELECT policies to authenticated only
DROP POLICY "Educators can view their centre submissions" ON public.book_submissions;
CREATE POLICY "Educators can view their centre submissions"
ON public.book_submissions FOR SELECT TO authenticated
USING ((centre_id = get_staff_centre(auth.uid())) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Educators can view their centre acknowledgments" ON public.session_acknowledgments;
CREATE POLICY "Educators can view their centre acknowledgments"
ON public.session_acknowledgments FOR SELECT TO authenticated
USING ((centre_id = get_staff_centre(auth.uid())) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Educators can view their centre completions" ON public.wa_task_completions;
CREATE POLICY "Educators can view their centre completions"
ON public.wa_task_completions FOR SELECT TO authenticated
USING (centre_id = get_staff_centre(auth.uid()));

-- 2) Storage: scope book-photos INSERT/UPDATE to the uploader's own folder
DROP POLICY "Authenticated users can upload book photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload book photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'book-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY "Users can update their own book photos" ON storage.objects;
CREATE POLICY "Users can update their own book photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'book-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Also allow users to delete their own book photos (none existed before)
CREATE POLICY "Users can delete their own book photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'book-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3) Explicit deny-equivalent: no INSERT/UPDATE/DELETE on user_roles for non-service callers.
-- Only the service role (which bypasses RLS) can mutate roles. We add restrictive policies
-- that block all client-side mutations even if a permissive policy is added later by mistake.
CREATE POLICY "Block client INSERT on user_roles"
ON public.user_roles AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block client UPDATE on user_roles"
ON public.user_roles AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (false);

CREATE POLICY "Block client DELETE on user_roles"
ON public.user_roles AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (false);
