CREATE TABLE public.rate_references (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  institution text NOT NULL,
  modality text NOT NULL,
  monthly_rate numeric NOT NULL,
  annual_rate numeric NOT NULL,
  reference_period text NOT NULL,
  source text NOT NULL,
  source_url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_references TO authenticated;
GRANT ALL ON public.rate_references TO service_role;
ALTER TABLE public.rate_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rates read authenticated" ON public.rate_references FOR SELECT TO authenticated USING (true);
CREATE POLICY "rates insert admin" ON public.rate_references FOR INSERT TO authenticated WITH CHECK (public.is_crm_admin());
CREATE POLICY "rates update admin" ON public.rate_references FOR UPDATE TO authenticated USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());
CREATE POLICY "rates delete admin" ON public.rate_references FOR DELETE TO authenticated USING (public.is_crm_admin());
CREATE TRIGGER update_rate_references_updated_at BEFORE UPDATE ON public.rate_references FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.consortium_administrators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  cnpj8 text,
  city text,
  state text,
  website text,
  segment text,
  admin_fee numeric,
  reserve_fund numeric,
  term_months integer,
  reference_period text NOT NULL,
  source text NOT NULL,
  source_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consortium_administrators TO authenticated;
GRANT ALL ON public.consortium_administrators TO service_role;
ALTER TABLE public.consortium_administrators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "administrators read authenticated" ON public.consortium_administrators FOR SELECT TO authenticated USING (true);
CREATE POLICY "administrators insert admin" ON public.consortium_administrators FOR INSERT TO authenticated WITH CHECK (public.is_crm_admin());
CREATE POLICY "administrators update admin" ON public.consortium_administrators FOR UPDATE TO authenticated USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());
CREATE POLICY "administrators delete admin" ON public.consortium_administrators FOR DELETE TO authenticated USING (public.is_crm_admin());
CREATE TRIGGER update_consortium_administrators_updated_at BEFORE UPDATE ON public.consortium_administrators FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.rate_update_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  details text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.rate_update_log TO authenticated;
GRANT ALL ON public.rate_update_log TO service_role;
ALTER TABLE public.rate_update_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rate log read authenticated" ON public.rate_update_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "rate log insert admin" ON public.rate_update_log FOR INSERT TO authenticated WITH CHECK (public.is_crm_admin());