-- Add 'scheduler' and 'trainer' values to the app_role enum and create
-- the matching RLS policies so trainers can review onboarding submissions
-- (quiz attempts, quiz answers, book submissions) without admin privileges.
--
-- Run order:
--   1. Extend enum
--   2. Helper functions for is_trainer / is_scheduler (mirroring the
--      existing has_role pattern, scoped to those roles + admin)
--   3. Trainer policies on quiz_attempts, quiz_answers, quiz_unlock_logs,
--      book_submissions, staff_profiles (read) and centres (read)
--
-- Notes:
--   - Admins continue to have full access via the existing policies.
--   - Schedulers don't currently need DB writes (drafts live in localStorage),
--      so we only add the enum value for now. Future scheduler tables can
--      add their own policies referencing 'scheduler'::app_role.

-- 1. Extend the enum (idempotent, won't fail if already added)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'scheduler';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'trainer';

-- 2. Helper — true when the user is a trainer OR an admin.
CREATE OR REPLACE FUNCTION public.is_trainer_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('trainer'::app_role, 'admin'::app_role)
  );
$$;

-- 3a. quiz_attempts — trainers can view + update (approve, mark needs_rework,
--      unlock, reset). They cannot delete or insert (educators insert).
DROP POLICY IF EXISTS "Trainers can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Trainers can view all quiz attempts"
ON public.quiz_attempts FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can update quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Trainers can update quiz attempts"
ON public.quiz_attempts FOR UPDATE
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()))
WITH CHECK (public.is_trainer_or_admin(auth.uid()));

-- 3b. quiz_answers — trainers can view + update (approve/reject per-answer)
--      and delete (used by resetAttempt which clears prior answers).
DROP POLICY IF EXISTS "Trainers can view all quiz answers" ON public.quiz_answers;
CREATE POLICY "Trainers can view all quiz answers"
ON public.quiz_answers FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can update quiz answers" ON public.quiz_answers;
CREATE POLICY "Trainers can update quiz answers"
ON public.quiz_answers FOR UPDATE
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()))
WITH CHECK (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can delete quiz answers for reset" ON public.quiz_answers;
CREATE POLICY "Trainers can delete quiz answers for reset"
ON public.quiz_answers FOR DELETE
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

-- 3c. quiz_unlock_logs — trainers can write entries when they unlock/reset.
DROP POLICY IF EXISTS "Trainers can read quiz unlock logs" ON public.quiz_unlock_logs;
CREATE POLICY "Trainers can read quiz unlock logs"
ON public.quiz_unlock_logs FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can write quiz unlock logs" ON public.quiz_unlock_logs;
CREATE POLICY "Trainers can write quiz unlock logs"
ON public.quiz_unlock_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_trainer_or_admin(auth.uid()));

-- 3d. book_submissions — trainers can review (approve/reject) monthly
--      submissions and read all of them.
DROP POLICY IF EXISTS "Trainers can view all book submissions" ON public.book_submissions;
CREATE POLICY "Trainers can view all book submissions"
ON public.book_submissions FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can update book submissions" ON public.book_submissions;
CREATE POLICY "Trainers can update book submissions"
ON public.book_submissions FOR UPDATE
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()))
WITH CHECK (public.is_trainer_or_admin(auth.uid()));

-- 3e. staff_profiles + centres — trainers need read access to render names
--      next to each submission/attempt in the review UI.
DROP POLICY IF EXISTS "Trainers can view staff profiles" ON public.staff_profiles;
CREATE POLICY "Trainers can view staff profiles"
ON public.staff_profiles FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Trainers can view centres" ON public.centres;
CREATE POLICY "Trainers can view centres"
ON public.centres FOR SELECT
TO authenticated
USING (public.is_trainer_or_admin(auth.uid()));
