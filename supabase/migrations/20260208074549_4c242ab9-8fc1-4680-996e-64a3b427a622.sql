
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
