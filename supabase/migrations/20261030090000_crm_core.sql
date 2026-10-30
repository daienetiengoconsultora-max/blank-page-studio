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
