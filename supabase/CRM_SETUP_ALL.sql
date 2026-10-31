-- ===== supabase/migrations/20261030090000_crm_core.sql =====
-- Core schema for Descomplica Crédito CRM.
-- Apply with Supabase migrations before enabling CRM data entry.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'seller' check (role in ('admin', 'seller')),
  created_at timestamptz not null default now()
);

create or replace function public.is_crm_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_crm_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'seller'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_crm on auth.users;
create trigger on_auth_user_created_crm
after insert on auth.users
for each row execute procedure public.handle_new_crm_user();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  full_name text not null,
  phone text not null,
  email text,
  city text,
  source text,
  objective text,
  estimated_value numeric(14,2),
  status text not null default 'novo'
    check (status in ('novo','contato_inicial','qualificado','simulacao','proposta','negociacao','ganho','perdido')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete restrict,
  activity_type text not null default 'nota'
    check (activity_type in ('nota','ligacao','whatsapp','reuniao','tarefa')),
  description text not null,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete restrict,
  product_type text not null,
  requested_amount numeric(14,2),
  details jsonb not null default '{}'::jsonb,
  status text not null default 'em_analise'
    check (status in ('em_analise','apresentada','aprovada','recusada','cancelada')),
  created_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null,
  company text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  name text not null,
  contact text,
  profile text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete restrict,
  file_name text not null,
  storage_path text not null,
  content_type text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.simulations enable row level security;
alter table public.partners enable row level security;
alter table public.investors enable row level security;
alter table public.client_documents enable row level security;

drop policy if exists "profile read own or admin" on public.profiles;
create policy "profile read own or admin" on public.profiles
for select to authenticated
using (user_id = auth.uid() or public.is_crm_admin());

-- Profile roles are intentionally not editable from the client.
drop policy if exists "leads read owner or admin" on public.leads;
create policy "leads read owner or admin" on public.leads
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "leads insert own" on public.leads;
create policy "leads insert own" on public.leads
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "leads update owner or admin" on public.leads;
create policy "leads update owner or admin" on public.leads
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "leads delete admin" on public.leads;
create policy "leads delete admin" on public.leads
for delete to authenticated using (public.is_crm_admin());

drop policy if exists "activities read owner or admin" on public.lead_activities;
create policy "activities read owner or admin" on public.lead_activities
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "activities insert own" on public.lead_activities;
create policy "activities insert own" on public.lead_activities
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "activities update owner or admin" on public.lead_activities;
create policy "activities update owner or admin" on public.lead_activities
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "activities delete admin" on public.lead_activities;
create policy "activities delete admin" on public.lead_activities
for delete to authenticated using (public.is_crm_admin());

drop policy if exists "simulations read owner or admin" on public.simulations;
create policy "simulations read owner or admin" on public.simulations
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "simulations insert own" on public.simulations;
create policy "simulations insert own" on public.simulations
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "simulations update owner or admin" on public.simulations;
create policy "simulations update owner or admin" on public.simulations
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "simulations delete admin" on public.simulations;
create policy "simulations delete admin" on public.simulations
for delete to authenticated using (public.is_crm_admin());

drop policy if exists "partners read owner or admin" on public.partners;
create policy "partners read owner or admin" on public.partners
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "partners insert own" on public.partners;
create policy "partners insert own" on public.partners
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "partners update owner or admin" on public.partners;
create policy "partners update owner or admin" on public.partners
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "partners delete admin" on public.partners;
create policy "partners delete admin" on public.partners
for delete to authenticated using (public.is_crm_admin());

drop policy if exists "investors read owner or admin" on public.investors;
create policy "investors read owner or admin" on public.investors
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "investors insert own" on public.investors;
create policy "investors insert own" on public.investors
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "investors update owner or admin" on public.investors;
create policy "investors update owner or admin" on public.investors
for update to authenticated using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "investors delete admin" on public.investors;
create policy "investors delete admin" on public.investors
for delete to authenticated using (public.is_crm_admin());

drop policy if exists "documents read owner or admin" on public.client_documents;
create policy "documents read owner or admin" on public.client_documents
for select to authenticated using (owner_id = auth.uid() or public.is_crm_admin());
drop policy if exists "documents insert own" on public.client_documents;
create policy "documents insert own" on public.client_documents
for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "documents delete owner or admin" on public.client_documents;
create policy "documents delete owner or admin" on public.client_documents
for delete to authenticated using (owner_id = auth.uid() or public.is_crm_admin());

-- After inviting the first trusted account in Supabase Auth, promote it manually:
-- update public.profiles set role = 'admin' where user_id = '<AUTH_USER_UUID>';
-- Do not expose service-role keys in browser code or public repositories.


-- ===== supabase/migrations/20261030090100_crm_relationship_rls.sql =====
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


-- ===== supabase/migrations/20261030200000_crm_customer_details_and_storage.sql =====
-- Additional customer profile fields and private document storage for Descomplica Crédito.
alter table public.leads
  add column if not exists cpf_cnpj text,
  add column if not exists birth_date date,
  add column if not exists address text,
  add column if not exists credit_profile text,
  add column if not exists credit_notes text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('client-documents', 'client-documents', false, 10485760,
  array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "CRM users read own client documents" on storage.objects;
create policy "CRM users read own client documents"
on storage.objects for select to authenticated
using (bucket_id = 'client-documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "CRM users upload own client documents" on storage.objects;
create policy "CRM users upload own client documents"
on storage.objects for insert to authenticated
with check (bucket_id = 'client-documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "CRM users delete own client documents" on storage.objects;
create policy "CRM users delete own client documents"
on storage.objects for delete to authenticated
using (bucket_id = 'client-documents' and (storage.foldername(name))[1] = auth.uid()::text);


-- ===== supabase/migrations/20261030201500_enforce_single_crm_admin.sql =====
-- Enforce the single-administrator account requested for this CRM.
create or replace function public.handle_new_crm_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) <> 'daienetiengoconsultora@gmail.com' then
    raise exception 'Cadastro desabilitado. Este CRM possui acesso exclusivo da administradora.';
  end if;

  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'admin'
  )
  on conflict (user_id) do update set role = 'admin';

  return new;
end;
$$;

update public.profiles p
set role = 'admin'
from auth.users u
where p.user_id = u.id
  and lower(coalesce(u.email, '')) = 'daienetiengoconsultora@gmail.com';


-- ===== supabase/migrations/20261030210000_crm_full_modules.sql =====
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


-- ===== supabase/migrations/20261030213000_crm_document_status_policy.sql =====
drop policy if exists "documents update owner or admin" on public.client_documents;
create policy "documents update owner or admin" on public.client_documents
for update to authenticated
using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());


-- ===== supabase/migrations/20261030220000_public_lead_capture.sql =====
-- Public website lead intake: safely records consented requests under the CRM administrator.
create or replace function public.receive_public_lead(
  p_name text,
  p_phone text,
  p_city text,
  p_objective text,
  p_estimated_value numeric default null,
  p_consent boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_lead_id uuid;
begin
  perform public.consume_public_submission_limit('public_lead');
  if p_consent is not true then
    raise exception 'Consent is required to submit this request.';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 or length(trim(coalesce(p_name, ''))) > 120 then
    raise exception 'Invalid name.';
  end if;
  if length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) < 10
     or length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) > 15 then
    raise exception 'Invalid phone number.';
  end if;
  if length(trim(coalesce(p_city, ''))) < 2 or length(trim(coalesce(p_city, ''))) > 100 then
    raise exception 'Invalid city.';
  end if;
  if length(trim(coalesce(p_objective, ''))) < 2 or length(trim(coalesce(p_objective, ''))) > 100 then
    raise exception 'Invalid objective.';
  end if;
  if p_estimated_value is not null and (p_estimated_value < 0 or p_estimated_value > 1000000000) then
    raise exception 'Invalid estimated value.';
  end if;

  select id into v_owner
  from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com'
  limit 1;

  if v_owner is null then
    raise exception 'CRM administrator account is not configured.';
  end if;

  insert into public.leads (owner_id, full_name, phone, city, objective, estimated_value, source, status)
  values (v_owner, trim(p_name), trim(p_phone), trim(p_city), trim(p_objective), p_estimated_value, 'Site', 'novo')
  returning id into v_lead_id;

  return v_lead_id;
end;
$$;

revoke all on function public.receive_public_lead(text,text,text,text,numeric,boolean) from public;
grant execute on function public.receive_public_lead(text,text,text,text,numeric,boolean) to anon, authenticated;


-- ===== supabase/migrations/20261030230000_crm_commission_schedule.sql =====
alter table public.leads
  add column if not exists commission_rate numeric(7,4) not null default 2,
  add column if not exists commission_installments integer not null default 13,
  add column if not exists commission_paid_amount numeric(14,2) not null default 0;


-- ===== supabase/migrations/20261030240000_public_credit_simulator.sql =====
-- Public credit simulator: capture the lead and its simulation in one transaction.
create or replace function public.receive_public_simulation_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_objective text,
  p_estimated_value numeric,
  p_product_type text,
  p_term_months integer,
  p_monthly_estimate numeric,
  p_consent boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_lead_id uuid;
begin
  perform public.consume_public_submission_limit('public_simulation');
  if p_consent is not true then raise exception 'Consent is required.'; end if;
  if length(trim(coalesce(p_name,''))) < 2 or length(trim(p_name)) > 80 then raise exception 'Invalid first name.'; end if;
  if length(trim(coalesce(p_email,''))) > 254 or trim(p_email) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then raise exception 'Invalid email.'; end if;
  if length(regexp_replace(coalesce(p_phone,''),'\D','','g')) not between 10 and 15 then raise exception 'Invalid phone.'; end if;
  if p_estimated_value is null or p_estimated_value < 1000 or p_estimated_value > 1000000000 then raise exception 'Invalid credit amount.'; end if;
  if p_product_type not in ('Consórcio','Financiamento') then raise exception 'Invalid product type.'; end if;
  if p_term_months not in (60,120,180,240) then raise exception 'Invalid term.'; end if;
  if p_monthly_estimate is null or p_monthly_estimate <= 0 then raise exception 'Invalid estimate.'; end if;
  if length(trim(coalesce(p_objective,''))) < 2 or length(trim(p_objective)) > 100 then raise exception 'Invalid objective.'; end if;

  select id into v_owner from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'CRM administrator account is not configured.'; end if;

  insert into public.leads(owner_id,full_name,phone,email,objective,estimated_value,source,status,notes)
  values(v_owner,trim(p_name),trim(p_phone),lower(trim(p_email)),trim(p_objective),p_estimated_value,'Simulador do site','novo',
    'Simulação pública: '||p_product_type||' · prazo '||p_term_months||' meses · parcela estimada R$ '||round(p_monthly_estimate,2))
  returning id into v_lead_id;

  insert into public.simulations(lead_id,owner_id,product_type,requested_amount,details,status)
  values(v_lead_id,v_owner,p_product_type,p_estimated_value,
    jsonb_build_object('objective',trim(p_objective),'term_months',p_term_months,'estimated_monthly_payment',round(p_monthly_estimate,2),
      'assumptions',case when p_product_type='Consórcio' then jsonb_build_object('administration_fee_total_percent',20)
      else jsonb_build_object('monthly_interest_percent',1.8,'down_payment',0) end),
    'em_analise');

  return v_lead_id;
end;
$$;

revoke all on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) from public;
grant execute on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) to anon, authenticated;


-- ===== supabase/migrations/20261030250000_public_intake_rate_limit.sql =====
create table if not exists public.public_submission_limits (
  bucket_key text primary key,
  request_count integer not null default 0 check (request_count >= 0),
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.public_submission_limits enable row level security;
revoke all on public.public_submission_limits from anon, authenticated;
create or replace function public.consume_public_submission_limit(p_scope text)
returns void language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_headers jsonb;
  v_ip text;
  v_bucket text;
  v_count integer;
begin
  if p_scope is null or p_scope not in ('public_lead', 'public_simulation') then
    raise exception 'Invalid submission scope.';
  end if;
  begin
    v_headers := coalesce(nullif(current_setting('request.headers', true), '')::jsonb, '{}'::jsonb);
  exception when others then
    v_headers := '{}'::jsonb;
  end;
  v_ip := split_part(coalesce(v_headers ->> 'x-forwarded-for', v_headers ->> 'x-real-ip', v_headers ->> 'cf-connecting-ip', ''), ',', 1);
  if nullif(trim(v_ip), '') is null then return; end if;
  v_bucket := p_scope || ':' || md5(trim(v_ip));
  insert into public.public_submission_limits(bucket_key, request_count, window_started_at, updated_at)
  values (v_bucket, 1, now(), now())
  on conflict (bucket_key) do update
    set request_count = case when public.public_submission_limits.window_started_at <= now() - interval '15 minutes' then 1 else public.public_submission_limits.request_count + 1 end,
        window_started_at = case when public.public_submission_limits.window_started_at <= now() - interval '15 minutes' then now() else public.public_submission_limits.window_started_at end,
        updated_at = now()
  returning request_count into v_count;
  if v_count > 5 then
    raise exception 'Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente.';
  end if;
end;
$$;
revoke all on function public.consume_public_submission_limit(text) from public, anon, authenticated;

alter function public.receive_public_lead(text,text,text,text,numeric,boolean)
  set search_path = pg_catalog, public, auth;
alter function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean)
  set search_path = pg_catalog, public, auth;
