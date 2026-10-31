DROP POLICY IF EXISTS "rates read authenticated" ON public.rate_references;
CREATE POLICY "rates read admin" ON public.rate_references FOR SELECT TO authenticated USING (public.is_crm_admin());
DROP POLICY IF EXISTS "administrators read authenticated" ON public.consortium_administrators;
CREATE POLICY "administrators read admin" ON public.consortium_administrators FOR SELECT TO authenticated USING (public.is_crm_admin());
DROP POLICY IF EXISTS "rate log read authenticated" ON public.rate_update_log;
CREATE POLICY "rate log read admin" ON public.rate_update_log FOR SELECT TO authenticated USING (public.is_crm_admin());