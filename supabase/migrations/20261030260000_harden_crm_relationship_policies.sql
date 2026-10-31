-- Additional CRM relationship checks: child records must always belong to an accessible parent.
-- This migration is intentionally additive and does not delete customer data.

drop policy if exists "proposals update owner or admin" on public.lead_proposals;
create policy "proposals update owner or admin" on public.lead_proposals
for update to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = lead_proposals.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
)
with check (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = lead_proposals.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "investor simulations update owner or admin" on public.investor_simulations;
create policy "investor simulations update owner or admin" on public.investor_simulations
for update to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.investors i
    where i.id = investor_simulations.investor_id
      and (i.owner_id = auth.uid() or public.is_crm_admin())
  )
)
with check (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.investors i
    where i.id = investor_simulations.investor_id
      and (i.owner_id = auth.uid() or public.is_crm_admin())
  )
);

-- Ensure CRM tables are not accidentally exposed to anonymous/public roles.
revoke all on table public.profiles, public.leads, public.lead_activities,
  public.simulations, public.partners, public.investors, public.client_documents,
  public.lead_proposals, public.investor_simulations
from anon, public;

grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table public.leads,
  public.lead_activities, public.simulations, public.partners, public.investors,
  public.client_documents, public.lead_proposals, public.investor_simulations
to authenticated;

-- The public intake functions remain callable only through their explicit grants.
revoke all on function public.check_public_lead_rate_limit(text) from public, anon, authenticated;
