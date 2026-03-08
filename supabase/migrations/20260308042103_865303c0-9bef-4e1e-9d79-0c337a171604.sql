
-- Fix: restrict open INSERT policies to anonymous/unauthenticated too but require non-empty data
-- Drop the overly permissive policies
DROP POLICY "Anyone can register a gym" ON public.gyms;
DROP POLICY "Anyone can register as trainer" ON public.trainers;

-- Re-create with basic validation (non-empty name/email)
CREATE POLICY "Anyone can register a gym" ON public.gyms
  FOR INSERT WITH CHECK (
    gym_name IS NOT NULL AND gym_name != '' AND
    email IS NOT NULL AND email != ''
  );

CREATE POLICY "Anyone can register as trainer" ON public.trainers
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND name != '' AND
    email IS NOT NULL AND email != ''
  );
