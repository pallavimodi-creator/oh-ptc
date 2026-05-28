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