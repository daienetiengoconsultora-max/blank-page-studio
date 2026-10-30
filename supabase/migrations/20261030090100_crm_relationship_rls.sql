-- Tighten child-record access: a user must also have access to the parent lead.
drop policy if exists "activities read owner or admin" on public.lead_activities;
create policy "activities read owner or admin" on public.lead_activities
for select to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = lead_activities.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "activities insert own" on public.lead_activities;
create policy "activities insert own" on public.lead_activities
for insert to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.leads l
    where l.id = lead_activities.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "activities update owner or admin" on public.lead_activities;
create policy "activities update owner or admin" on public.lead_activities
for update to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = lead_activities.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
)
with check (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = lead_activities.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "simulations read owner or admin" on public.simulations;
create policy "simulations read owner or admin" on public.simulations
for select to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = simulations.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "simulations insert own" on public.simulations;
create policy "simulations insert own" on public.simulations
for insert to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.leads l
    where l.id = simulations.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "simulations update owner or admin" on public.simulations;
create policy "simulations update owner or admin" on public.simulations
for update to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = simulations.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
)
with check (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = simulations.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "documents read owner or admin" on public.client_documents;
create policy "documents read owner or admin" on public.client_documents
for select to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = client_documents.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "documents insert own" on public.client_documents;
create policy "documents insert own" on public.client_documents
for insert to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.leads l
    where l.id = client_documents.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

drop policy if exists "documents delete owner or admin" on public.client_documents;
create policy "documents delete owner or admin" on public.client_documents
for delete to authenticated
using (
  (owner_id = auth.uid() or public.is_crm_admin())
  and exists (
    select 1 from public.leads l
    where l.id = client_documents.lead_id
      and (l.owner_id = auth.uid() or public.is_crm_admin())
  )
);

create index if not exists leads_owner_status_idx on public.leads(owner_id, status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists lead_activities_lead_created_idx on public.lead_activities(lead_id, created_at desc);
create index if not exists simulations_lead_created_idx on public.simulations(lead_id, created_at desc);
