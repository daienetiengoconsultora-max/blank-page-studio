-- Protect public lead intake from automated flooding and validate estimates server-side.
-- This migration is kept self-contained and contains no client-accessible rate-limit table.

create table if not exists public.public_lead_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count >= 1),
  updated_at timestamptz not null default now()
);
alter table public.public_lead_rate_limits enable row level security;
revoke all on table public.public_lead_rate_limits from public, anon, authenticated;

create or replace function public.check_public_lead_rate_limit(p_identity text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_count integer;
begin
  if length(coalesce(p_identity, '')) > 400 then
    raise exception 'Invalid request identity.';
  end if;
  v_hash := encode(digest(lower(trim(coalesce(p_identity,''))), 'sha256'), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(v_hash, 0));
  insert into public.public_lead_rate_limits(key_hash, window_started_at, request_count)
  values(v_hash, now(), 1)
  on conflict(key_hash) do update
    set window_started_at = case
          when public.public_lead_rate_limits.window_started_at < now() - interval '1 hour' then now()
          else public.public_lead_rate_limits.window_started_at end,
        request_count = case
          when public.public_lead_rate_limits.window_started_at < now() - interval '1 hour' then 1
          else public.public_lead_rate_limits.request_count + 1 end,
        updated_at = now()
  returning request_count into v_count;
  if v_count > 3 then
    raise exception 'Limite temporário de solicitações atingido. Tente novamente mais tarde.';
  end if;
end;
$$;
revoke all on function public.check_public_lead_rate_limit(text) from public, anon, authenticated;

create or replace function public.receive_public_simulation_lead(
  p_name text, p_email text, p_phone text, p_objective text,
  p_estimated_value numeric, p_product_type text, p_term_months integer,
  p_monthly_estimate numeric, p_consent boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_lead_id uuid;
  v_monthly numeric;
  v_rate numeric;
begin
  if p_consent is not true then raise exception 'Consentimento obrigatório.'; end if;
  if length(trim(coalesce(p_name,''))) not between 2 and 80 then raise exception 'Nome inválido.'; end if;
  if length(trim(coalesce(p_email,''))) > 254
     or trim(coalesce(p_email,'')) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
  then raise exception 'E-mail inválido.'; end if;
  if length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')) not between 10 and 15 then raise exception 'Telefone inválido.'; end if;
  if p_estimated_value is null or p_estimated_value < 1000 or p_estimated_value > 1000000000 then raise exception 'Valor inválido.'; end if;
  if p_product_type not in ('Consórcio','Financiamento') then raise exception 'Modalidade inválida.'; end if;
  if p_term_months not in (60,120,180,240) then raise exception 'Prazo inválido.'; end if;
  if length(trim(coalesce(p_objective,''))) not between 2 and 100 then raise exception 'Objetivo inválido.'; end if;

  perform public.check_public_lead_rate_limit(lower(trim(p_email)) || '|' || regexp_replace(coalesce(p_phone,''),'[^0-9]','','g'));

  if p_product_type = 'Consórcio' then
    v_monthly := p_estimated_value * 1.20 / p_term_months;
  else
    v_rate := 0.018;
    v_monthly := p_estimated_value * v_rate / (1 - power(1 + v_rate, -p_term_months));
  end if;
  if p_monthly_estimate is null or abs(p_monthly_estimate - v_monthly) > greatest(0.05, v_monthly * 0.001) then
    raise exception 'A estimativa enviada não confere. Atualize a página e tente novamente.';
  end if;

  select id into v_owner from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'Conta administradora do CRM não configurada.'; end if;

  insert into public.leads(owner_id,full_name,phone,email,objective,estimated_value,source,status,notes)
  values(v_owner,trim(p_name),trim(p_phone),lower(trim(p_email)),trim(p_objective),p_estimated_value,'Simulador do site','novo',
    'Simulação: '||p_product_type||' · prazo '||p_term_months||' meses · parcela estimada R$ '||round(v_monthly,2))
  returning id into v_lead_id;

  insert into public.simulations(lead_id,owner_id,product_type,requested_amount,details,status)
  values(v_lead_id,v_owner,p_product_type,p_estimated_value,
    jsonb_build_object('objective',trim(p_objective),'term_months',p_term_months,'estimated_monthly_payment',round(v_monthly,2),
      'assumptions',case when p_product_type='Consórcio' then jsonb_build_object('administration_fee_total_percent',20)
      else jsonb_build_object('monthly_interest_percent',1.8,'down_payment',0) end),
    'em_analise');
  return v_lead_id;
end;
$$;
revoke all on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) from public;
grant execute on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) to anon, authenticated;

create or replace function public.receive_public_lead(
  p_name text, p_phone text, p_city text, p_objective text,
  p_estimated_value numeric default null, p_consent boolean default false
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
  if p_consent is not true then raise exception 'Consentimento obrigatório.'; end if;
  if length(trim(coalesce(p_name,''))) not between 2 and 120 then raise exception 'Nome inválido.'; end if;
  if length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')) not between 10 and 15 then raise exception 'Telefone inválido.'; end if;
  if length(trim(coalesce(p_city,''))) not between 2 and 100 then raise exception 'Cidade inválida.'; end if;
  if length(trim(coalesce(p_objective,''))) not between 2 and 100 then raise exception 'Objetivo inválido.'; end if;
  if p_estimated_value is not null and (p_estimated_value < 0 or p_estimated_value > 1000000000) then raise exception 'Valor inválido.'; end if;

  perform public.check_public_lead_rate_limit(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g'));

  select id into v_owner from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'Conta administradora do CRM não configurada.'; end if;

  insert into public.leads(owner_id,full_name,phone,city,objective,estimated_value,source,status)
  values(v_owner,trim(p_name),trim(p_phone),trim(p_city),trim(p_objective),p_estimated_value,'Site','novo')
  returning id into v_lead_id;
  return v_lead_id;
end;
$$;
revoke all on function public.receive_public_lead(text,text,text,text,numeric,boolean) from public;
grant execute on function public.receive_public_lead(text,text,text,text,numeric,boolean) to anon, authenticated;

create index if not exists public_lead_rate_limits_updated_idx
  on public.public_lead_rate_limits(updated_at);
