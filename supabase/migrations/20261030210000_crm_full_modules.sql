-- CRM expansion: proposals, commissions, investor simulations, partner terms and document workflow.
alter table public.leads
  add column if not exists commission_value numeric(14,2),
  add column if not exists closed_at timestamptz,
  add column if not exists last_contact_at timestamptz;

alter table public.partners
  add column if not exists category text,
  add column if not exists administration_fee numeric(8,4),
  add column if not exists reserve_fund numeric(8,4),
  add column if not exists term_months integer,
  add column if not exists contact_person text,
  add column if not exists website text;

alter table public.investors
  add column if not exists objective text,
  add column if not exists investment_amount numeric(14,2),
  add column if not exists risk_profile text,
  add column if not exists expected_return numeric(8,4),
  add column if not exists investment_horizon text;

alter table public.client_documents
  add column if not exists category text not null default 'outros',
  add column if not exists status text not null default 'pendente'
    check (status in ('pendente','enviado','aprovado','concluido','reprovado')),
  add column if not exists notes text;

create table if not exists public.lead_proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete restrict,
  title text not null,
  product_type text not null,
  amount numeric(14,2),
  monthly_payment numeric(14,2),
  status text not null default 'rascunho'
    check (status in ('rascunho','enviada','aceita','recusada','expirada')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lead_proposals enable row level security;
drop policy if exists "proposals read owner or admin" on public.lead_proposals;
create policy "proposals read owner or admin" on public.lead_proposals
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "proposals insert own" on public.lead_proposals;
create policy "proposals insert own" on public.lead_proposals
for insert to authenticated with check (
 owner_id = auth.uid() and exists (
  select 1 from public.leads l where l.id = lead_id and (l.owner_id = auth.uid() or public.is_crm_admin())
 )
);
drop policy if exists "proposals update owner or admin" on public.lead_proposals;
create policy "proposals update owner or admin" on public.lead_proposals
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "proposals delete admin" on public.lead_proposals;
create policy "proposals delete admin" on public.lead_proposals
for delete to authenticated using (public.is_crm_admin());

create table if not exists public.investor_simulations (
 id uuid primary key default gen_random_uuid(),
 investor_id uuid not null references public.investors(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete restrict,
 title text not null,
 principal numeric(14,2) not null,
 annual_rate numeric(8,4) not null,
 months integer not null,
 estimated_value numeric(14,2) not null,
 created_at timestamptz not null default now()
);
alter table public.investor_simulations enable row level security;
drop policy if exists "investor simulations read owner or admin" on public.investor_simulations;
create policy "investor simulations read owner or admin" on public.investor_simulations
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "investor simulations insert own" on public.investor_simulations;
create policy "investor simulations insert own" on public.investor_simulations
for insert to authenticated with check (
 owner_id = auth.uid() and exists (
  select 1 from public.investors i where i.id = investor_id and (i.owner_id = auth.uid() or public.is_crm_admin())
 )
);
drop policy if exists "investor simulations delete admin" on public.investor_simulations;
create policy "investor simulations delete admin" on public.investor_simulations
for delete to authenticated using (public.is_crm_admin());

create index if not exists leads_status_created_idx on public.leads(status, created_at desc);
create index if not exists leads_source_idx on public.leads(source);
create index if not exists activities_due_idx on public.lead_activities(due_at);
create index if not exists proposals_lead_created_idx on public.lead_proposals(lead_id, created_at desc);
create index if not exists documents_lead_status_idx on public.client_documents(lead_id, status);
