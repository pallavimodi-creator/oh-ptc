-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'centre');

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