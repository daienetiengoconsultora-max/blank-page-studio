GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads, public.lead_activities, public.simulations, public.partners, public.investors TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.client_documents TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.leads, public.lead_activities, public.simulations, public.partners, public.investors, public.client_documents, public.profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.is_crm_admin() TO authenticated;