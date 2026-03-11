CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  type text NOT NULL DEFAULT 'Client',
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT TO public
  WITH CHECK (name IS NOT NULL AND name <> '' AND email IS NOT NULL AND email <> '');

CREATE POLICY "Admins can manage messages" ON public.contact_messages
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));