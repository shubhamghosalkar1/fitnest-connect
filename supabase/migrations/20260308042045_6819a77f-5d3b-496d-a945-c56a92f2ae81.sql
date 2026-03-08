
-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read roles
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create gyms table
CREATE TABLE public.gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  gym_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  full_address TEXT NOT NULL,
  opening_time TEXT NOT NULL,
  closing_time TEXT NOT NULL,
  working_days TEXT[] NOT NULL DEFAULT '{}',
  equipment_list TEXT,
  membership_monthly TEXT,
  membership_quarterly TEXT,
  membership_yearly TEXT,
  current_offers TEXT,
  trainer_count TEXT,
  facilities TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  social_media TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- Public can read approved gyms
CREATE POLICY "Anyone can view approved gyms" ON public.gyms
  FOR SELECT USING (status = 'approved');

-- Anyone can insert (registration)
CREATE POLICY "Anyone can register a gym" ON public.gyms
  FOR INSERT WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins can manage gyms" ON public.gyms
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trainers table for persistent storage
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  gender TEXT,
  date_of_birth TEXT,
  years_experience TEXT,
  specialties TEXT[] DEFAULT '{}',
  training_style TEXT,
  bio TEXT,
  client_types TEXT,
  max_clients TEXT,
  languages TEXT,
  social_media TEXT,
  cert_name TEXT,
  cert_issuer TEXT,
  cert_file TEXT,
  gov_id_type TEXT,
  gov_id_file TEXT,
  cpr_certified TEXT,
  session_rate TEXT,
  package_rate TEXT,
  session_duration TEXT,
  available_days TEXT[] DEFAULT '{}',
  travel_willing TEXT,
  online_training TEXT,
  cert_status TEXT NOT NULL DEFAULT 'pending',
  id_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Public can view verified trainers
CREATE POLICY "Anyone can view verified trainers" ON public.trainers
  FOR SELECT USING (cert_status = 'verified' AND id_status = 'verified');

-- Anyone can register as trainer
CREATE POLICY "Anyone can register as trainer" ON public.trainers
  FOR INSERT WITH CHECK (true);

-- Admins can manage trainers
CREATE POLICY "Admins can manage all trainers" ON public.trainers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
