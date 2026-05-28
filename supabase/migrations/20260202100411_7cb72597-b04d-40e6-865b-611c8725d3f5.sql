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