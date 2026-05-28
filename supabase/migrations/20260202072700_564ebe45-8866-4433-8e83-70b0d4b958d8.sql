-- First migration: Add new enum values only
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cd';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'educator';