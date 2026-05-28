-- Add taker identity columns to quiz_attempts for admin identification
ALTER TABLE public.quiz_attempts
ADD COLUMN taker_name text,
ADD COLUMN taker_email text;