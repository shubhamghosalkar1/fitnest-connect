
-- Clients table for trainers to manage their clients
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  age text,
  gender text,
  goals text,
  notes text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Trainer can manage their own clients (match by email from auth to trainers table)
CREATE OR REPLACE FUNCTION public.get_trainer_id_by_email()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.trainers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()) LIMIT 1
$$;

CREATE POLICY "Trainers can manage own clients" ON public.clients
  FOR ALL TO authenticated
  USING (trainer_id = get_trainer_id_by_email())
  WITH CHECK (trainer_id = get_trainer_id_by_email());

-- Client progress tracking
CREATE TABLE public.client_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric,
  body_fat numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  arms numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage client progress" ON public.client_progress
  FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE trainer_id = get_trainer_id_by_email()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE trainer_id = get_trainer_id_by_email()));

-- Session logs
CREATE TABLE public.session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  session_type text NOT NULL DEFAULT 'Training',
  duration text,
  notes text,
  exercises text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage session logs" ON public.session_logs
  FOR ALL TO authenticated
  USING (trainer_id = get_trainer_id_by_email())
  WITH CHECK (trainer_id = get_trainer_id_by_email());

-- Workout plans
CREATE TABLE public.workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  frequency text,
  duration_weeks text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage workout plans" ON public.workout_plans
  FOR ALL TO authenticated
  USING (trainer_id = get_trainer_id_by_email())
  WITH CHECK (trainer_id = get_trainer_id_by_email());
