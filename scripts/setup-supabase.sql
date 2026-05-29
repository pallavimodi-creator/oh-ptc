-- Toddler Club: Supabase setup script
-- Combines all migrations + seeds the 10 centres.
-- Paste into Supabase SQL Editor, click 'Run'.


-- =============================================================
-- 20260128055459_0a40fdf1-9177-41fa-9e7b-2fb13ed53d33.sql
-- =============================================================
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'centre', 'scheduler', 'trainer');

-- Create centres table
CREATE TABLE public.centres (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    timings TEXT DEFAULT 'To be updated',
    slots TEXT DEFAULT 'To be updated',
    capacity TEXT DEFAULT 'To be updated',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    centre_id UUID REFERENCES public.centres(id) ON DELETE CASCADE,
    UNIQUE (user_id, role)
);

-- Create onboarding_completion table
CREATE TABLE public.onboarding_completion (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    centre_id UUID REFERENCES public.centres(id) ON DELETE CASCADE NOT NULL,
    section_key TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES auth.users(id),
    month TEXT NOT NULL DEFAULT 'february_2026',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (centre_id, section_key, month)
);

-- Enable RLS
ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_completion ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get user's centre
CREATE OR REPLACE FUNCTION public.get_user_centre(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT centre_id
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Centres policies - everyone authenticated can view
CREATE POLICY "Authenticated users can view centres"
ON public.centres FOR SELECT
TO authenticated
USING (true);

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Onboarding completion policies
CREATE POLICY "Centre users can view their onboarding"
ON public.onboarding_completion FOR SELECT
TO authenticated
USING (
    centre_id = public.get_user_centre(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Centre users can update their onboarding"
ON public.onboarding_completion FOR UPDATE
TO authenticated
USING (centre_id = public.get_user_centre(auth.uid()))
WITH CHECK (centre_id = public.get_user_centre(auth.uid()));

CREATE POLICY "Centre users can insert their onboarding"
ON public.onboarding_completion FOR INSERT
TO authenticated
WITH CHECK (centre_id = public.get_user_centre(auth.uid()));

CREATE POLICY "Admins can manage all onboarding"
ON public.onboarding_completion FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert the 10 centres
INSERT INTO public.centres (name) VALUES
('Indiranagar'),
('Sahakar Nagar'),
('Whitefield'),
('HSR'),
('Jayanagar'),
('JP Nagar'),
('Haralur'),
('Sarjapur'),
('HRBR'),
('Sadashivnagar');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_onboarding_completion_updated_at
BEFORE UPDATE ON public.onboarding_completion
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- =============================================================
-- 20260128071724_087b5a7d-b80f-419e-b242-a847f9db2042.sql
-- =============================================================
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
-- =============================================================
-- 20260128084937_4c367b21-717b-4baf-a2be-1d8dfbb7c0a8.sql
-- =============================================================
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
-- =============================================================
-- 20260202072700_564ebe45-8866-4433-8e83-70b0d4b958d8.sql
-- =============================================================
-- First migration: Add new enum values only
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cd';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'educator';
-- =============================================================
-- 20260202073031_cf2118ab-4d43-43f0-b1d9-d0a6798add11.sql
-- =============================================================
-- Create staff_profiles table
CREATE TABLE public.staff_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'educator',
    centre_id UUID REFERENCES public.centres(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on staff_profiles
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

-- Staff profiles policies
CREATE POLICY "Users can view their own profile"
ON public.staff_profiles FOR SELECT
USING (id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all profiles"
ON public.staff_profiles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "CDs can view profiles in their centre"
ON public.staff_profiles FOR SELECT
USING (
    has_role(auth.uid(), 'cd'::app_role) 
    AND centre_id = get_user_centre(auth.uid())
);

-- Create trigger for updated_at on staff_profiles
CREATE TRIGGER update_staff_profiles_updated_at
BEFORE UPDATE ON public.staff_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create wa_task_definitions table
CREATE TABLE public.wa_task_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_code TEXT UNIQUE NOT NULL,
    task_name TEXT NOT NULL,
    description TEXT NOT NULL,
    due_rule TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wa_task_definitions
ALTER TABLE public.wa_task_definitions ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read task definitions
CREATE POLICY "Authenticated users can view task definitions"
ON public.wa_task_definitions FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage task definitions
CREATE POLICY "Admins can manage task definitions"
ON public.wa_task_definitions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed task definitions
INSERT INTO public.wa_task_definitions (task_code, task_name, description, due_rule) VALUES
('PREVIEW', 'Session Preview', 'Share 1 preparation photo + 1-line caption (1 hour before session)', 'Daily'),
('CLUB_MOMENT', 'Club Moment of the Day', 'Share group picture and tag ''Club Moment of the Day'' at 1 PM', 'Daily 1:00 PM'),
('WEEKLY_PLAN', 'Weekly Plan + Poll', 'Share 3–4 weekly photos + captions + poll', 'Friday 1:00 PM');

-- Create wa_task_completions table
CREATE TABLE public.wa_task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    centre_id UUID NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
    task_code TEXT NOT NULL,
    completed_by_user_id UUID NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    primary_teacher_name TEXT NOT NULL,
    optional_note TEXT,
    optional_proof_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(date, centre_id, task_code)
);

-- Enable RLS on wa_task_completions
ALTER TABLE public.wa_task_completions ENABLE ROW LEVEL SECURITY;

-- Function to get staff centre
CREATE OR REPLACE FUNCTION public.get_staff_centre(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT centre_id
  FROM public.staff_profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Function to check staff role
CREATE OR REPLACE FUNCTION public.has_staff_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.staff_profiles
    WHERE id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Educators can view completions for their centre
CREATE POLICY "Educators can view their centre completions"
ON public.wa_task_completions FOR SELECT
USING (centre_id = get_staff_centre(auth.uid()));

-- Educators can insert completions for their centre
CREATE POLICY "Educators can create completions for their centre"
ON public.wa_task_completions FOR INSERT
WITH CHECK (
    centre_id = get_staff_centre(auth.uid())
    AND completed_by_user_id = auth.uid()
);

-- Admins can view and manage all completions
CREATE POLICY "Admins can manage all completions"
ON public.wa_task_completions FOR ALL
USING (has_staff_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_staff_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
-- =============================================================
-- 20260202091455_a6e2c982-354e-423f-9bc3-502dd6abbb8a.sql
-- =============================================================
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
-- =============================================================
-- 20260202100411_7cb72597-b04d-40e6-865b-611c8725d3f5.sql
-- =============================================================
-- Create session acknowledgments table for per-centre session confirmations
CREATE TABLE public.session_acknowledgments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL, -- matches session id from FEBRUARY_2026_SESSIONS
    centre_id UUID NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT true,
    alternative_activity TEXT, -- required if is_confirmed = false
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(session_id, centre_id) -- one acknowledgment per session per centre
);

-- Enable RLS
ALTER TABLE public.session_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Educators can view their centre's acknowledgments
CREATE POLICY "Educators can view their centre acknowledgments"
ON public.session_acknowledgments
FOR SELECT
USING (centre_id = get_staff_centre(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Educators can create acknowledgments for their centre
CREATE POLICY "Educators can create acknowledgments for their centre"
ON public.session_acknowledgments
FOR INSERT
WITH CHECK (centre_id = get_staff_centre(auth.uid()) AND submitted_by = auth.uid());

-- Educators can update their pending acknowledgments
CREATE POLICY "Educators can update pending acknowledgments"
ON public.session_acknowledgments
FOR UPDATE
USING (centre_id = get_staff_centre(auth.uid()) AND status = 'pending')
WITH CHECK (centre_id = get_staff_centre(auth.uid()));

-- Admins can manage all acknowledgments
CREATE POLICY "Admins can manage all acknowledgments"
ON public.session_acknowledgments
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_session_acknowledgments_updated_at
BEFORE UPDATE ON public.session_acknowledgments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- =============================================================
-- 20260208074549_4c242ab9-8fc1-4680-996e-64a3b427a622.sql
-- =============================================================

-- Quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id UUID NOT NULL,
  quiz_key TEXT NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  timer_expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  locked_reason TEXT,
  mcq_score INTEGER DEFAULT 0,
  mcq_total INTEGER DEFAULT 0,
  admin_status TEXT NOT NULL DEFAULT 'not_reviewed',
  overall_status TEXT NOT NULL DEFAULT 'in_progress',
  centre_id UUID NOT NULL REFERENCES public.centres(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all quiz attempts"
ON public.quiz_attempts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Educators can view their own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (educator_id = auth.uid());

CREATE POLICY "Educators can create their own quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (educator_id = auth.uid() AND centre_id = get_staff_centre(auth.uid()));

CREATE POLICY "Educators can update their own attempts"
ON public.quiz_attempts FOR UPDATE
USING (educator_id = auth.uid());

-- Quiz answers table
CREATE TABLE public.quiz_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer_text TEXT,
  is_mcq BOOLEAN NOT NULL DEFAULT false,
  is_correct BOOLEAN,
  admin_approved BOOLEAN,
  admin_comment TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all quiz answers"
ON public.quiz_answers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Educators can view their quiz answers"
ON public.quiz_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = quiz_answers.attempt_id AND educator_id = auth.uid()
  )
);

CREATE POLICY "Educators can create their quiz answers"
ON public.quiz_answers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = quiz_answers.attempt_id AND educator_id = auth.uid()
  )
);

CREATE POLICY "Educators can update their quiz answers"
ON public.quiz_answers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = quiz_answers.attempt_id AND educator_id = auth.uid()
  )
);

-- Quiz unlock logs table
CREATE TABLE public.quiz_unlock_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  unlocked_by UUID NOT NULL,
  action TEXT NOT NULL DEFAULT 'unlock_resume',
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_unlock_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage unlock logs"
ON public.quiz_unlock_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Educators can view their unlock logs"
ON public.quiz_unlock_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = quiz_unlock_logs.attempt_id AND educator_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_quiz_attempts_updated_at
BEFORE UPDATE ON public.quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_answers_updated_at
BEFORE UPDATE ON public.quiz_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_quiz_attempts_educator ON public.quiz_attempts(educator_id, quiz_key);
CREATE INDEX idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);

-- =============================================================
-- 20260208091018_fae628bf-1bf2-4403-8e34-4d5d5ba8f856.sql
-- =============================================================
-- Add taker identity columns to quiz_attempts for admin identification
ALTER TABLE public.quiz_attempts
ADD COLUMN taker_name text,
ADD COLUMN taker_email text;
-- =============================================================
-- 20260211045237_5a4feabd-dead-4f5b-8407-473116818e2f.sql
-- =============================================================
ALTER TABLE public.quiz_attempts ADD COLUMN onboarding_rating smallint NULL CHECK (onboarding_rating >= 1 AND onboarding_rating <= 5);
-- =============================================================
-- 20260527120044_26f5d80c-f458-45b5-8561-a670a119eec7.sql
-- =============================================================

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

-- =============================================================
-- 20260528120000_add_scheduler_and_trainer_roles.sql
-- =============================================================
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

-- =============================================================
-- SEED: insert the 10 centre rows
-- =============================================================
INSERT INTO public.centres (name) VALUES
  ('Haralur'),
  ('HRBR'),
  ('HSR'),
  ('Indiranagar'),
  ('Jayanagar'),
  ('JP Nagar'),
  ('Sadashivnagar'),
  ('Sahakar Nagar'),
  ('Sarjapur'),
  ('Whitefield')
ON CONFLICT (name) DO NOTHING;
