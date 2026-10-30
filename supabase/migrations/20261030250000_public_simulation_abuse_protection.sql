-- Protect the public website simulator from automated flooding.
-- The RPC remains public by design, but requests are limited per source IP.
create table if not exists public.public_submission_limits (
  bucket_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.public_submission_limits enable row level security;
revoke all on table public.public_submission_limits from public, anon, authenticated;

create or replace function public.consume_public_submission_limit(p_scope text)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_headers jsonb;
  v_ip text;
  v_key text;
  v_count integer;
begin
  v_headers := coalesce(nullif(current_setting('request.headers', true), '')::jsonb, '{}'::jsonb);
  v_ip := split_part(coalesce(v_headers ->> 'x-forwarded-for', v_headers ->> 'x-real-ip', 'unknown'), ',', 1);
  v_key := encode(digest(coalesce(p_scope, 'site') || ':' || trim(v_ip), 'sha256'), 'hex');

  insert into public.public_submission_limits(bucket_key, window_started_at, request_count, updated_at)
  values (v_key, now(), 1, now())
  on conflict (bucket_key) do update
    set window_started_at = case
          when public.public_submission_limits.window_started_at < now() - interval '15 minutes' then now()
          else public.public_submission_limits.window_started_at
        end,
        request_count = case
          when public.public_submission_limits.window_started_at < now() - interval '15 minutes' then 1
          else public.public_submission_limits.request_count + 1
        end,
        updated_at = now()
  returning request_count into v_count;

  if v_count > 5 then
    raise exception 'Muitas tentativas. Aguarde 15 minutos antes de enviar novamente.';
  end if;
end;
$$;

revoke all on function public.consume_public_submission_limit(text) from public, anon, authenticated;

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
set search_path = public, auth, extensions
as $$
declare
  v_owner uuid;
  v_lead_id uuid;
  v_monthly_estimate numeric(14,2);
begin
  perform public.consume_public_submission_limit('credit-simulator');

  if p_consent is not true then raise exception 'Consent is required.'; end if;
  if length(trim(coalesce(p_name,''))) < 2 or length(trim(p_name)) > 80 then raise exception 'Invalid first name.'; end if;
  if length(trim(coalesce(p_email,''))) > 254 or trim(p_email) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$' then raise exception 'Invalid email.'; end if;
  if length(regexp_replace(coalesce(p_phone,''),'\\D','','g')) not between 10 and 15 then raise exception 'Invalid phone.'; end if;
  if p_estimated_value is null or p_estimated_value < 1000 or p_estimated_value > 1000000000 then raise exception 'Invalid credit amount.'; end if;
  if p_product_type not in ('Consórcio','Financiamento') then raise exception 'Invalid product type.'; end if;
  if p_term_months not in (60,120,180,240) then raise exception 'Invalid term.'; end if;
  if length(trim(coalesce(p_objective,''))) < 2 or length(trim(p_objective)) > 100 then raise exception 'Invalid objective.'; end if;

  -- Recalculate on the server; never trust a monthly amount supplied by the browser.
  if p_product_type = 'Consórcio' then
    v_monthly_estimate := round(p_estimated_value * 1.20 / p_term_months, 2);
  else
    v_monthly_estimate := round(
      p_estimated_value * 0.018 / (1 - power(1.018::numeric, -p_term_months)), 2
    );
  end if;

  select id into v_owner from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'CRM administrator account is not configured.'; end if;

  insert into public.leads(owner_id,full_name,phone,email,objective,estimated_value,source,status,notes)
  values(v_owner,trim(p_name),trim(p_phone),lower(trim(p_email)),trim(p_objective),p_estimated_value,'Simulador do site','novo',
    'Simulação pública: '||p_product_type||' · prazo '||p_term_months||' meses · parcela estimada R$ '||v_monthly_estimate)
  returning id into v_lead_id;

  insert into public.simulations(lead_id,owner_id,product_type,requested_amount,details,status)
  values(v_lead_id,v_owner,p_product_type,p_estimated_value,
    jsonb_build_object('objective',trim(p_objective),'term_months',p_term_months,'estimated_monthly_payment',v_monthly_estimate,
      'assumptions',case when p_product_type='Consórcio' then jsonb_build_object('administration_fee_total_percent',20)
      else jsonb_build_object('monthly_interest_percent',1.8,'down_payment',0) end),
    'em_analise');

  return v_lead_id;
end;
$$;

revoke all on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) from public;
grant execute on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) to anon, authenticated;


-- Also protect the legacy public lead-capture RPC if it is still enabled.
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
set search_path = public, auth, extensions
as $$
declare
  v_owner uuid;
  v_lead_id uuid;
begin
  perform public.consume_public_submission_limit('legacy-lead-capture');
  if p_consent is not true then raise exception 'Consent is required to submit this request.'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 or length(trim(p_name)) > 120 then raise exception 'Invalid name.'; end if;
  if length(regexp_replace(coalesce(p_phone, ''), '\\D', '', 'g')) not between 10 and 15 then raise exception 'Invalid phone number.'; end if;
  if length(trim(coalesce(p_city, ''))) < 2 or length(trim(p_city)) > 100 then raise exception 'Invalid city.'; end if;
  if length(trim(coalesce(p_objective, ''))) < 2 or length(trim(p_objective)) > 100 then raise exception 'Invalid objective.'; end if;
  if p_estimated_value is not null and (p_estimated_value < 0 or p_estimated_value > 1000000000) then raise exception 'Invalid estimated value.'; end if;

  select id into v_owner from auth.users
  where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'CRM administrator account is not configured.'; end if;

  insert into public.leads(owner_id,full_name,phone,city,objective,estimated_value,source,status)
  values(v_owner,trim(p_name),trim(p_phone),trim(p_city),trim(p_objective),p_estimated_value,'Site','novo')
  returning id into v_lead_id;
  return v_lead_id;
end;
$$;

revoke all on function public.receive_public_lead(text,text,text,text,numeric,boolean) from public;
grant execute on function public.receive_public_lead(text,text,text,text,numeric,boolean) to anon, authenticated;
