-- Security hardening for public lead intake and simulator endpoints.
-- Limits anonymous submissions per source IP and endpoint without storing raw IP addresses.
create table if not exists public.public_submission_limits (
  bucket_key text primary key,
  request_count integer not null default 0 check (request_count >= 0),
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.public_submission_limits enable row level security;
revoke all on public.public_submission_limits from anon, authenticated;

create or replace function public.consume_public_submission_limit(p_scope text)
returns void
language plpgsql
security definer
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

  v_ip := split_part(coalesce(v_headers ->> 'x-forwarded-for', v_headers ->> 'x-real-ip', 'unknown'), ',', 1);
  v_bucket := p_scope || ':' || md5(coalesce(nullif(trim(v_ip), ''), 'unknown'));

  insert into public.public_submission_limits(bucket_key, request_count, window_started_at, updated_at)
  values (v_bucket, 1, now(), now())
  on conflict (bucket_key) do update
    set request_count = case
          when public.public_submission_limits.window_started_at <= now() - interval '15 minutes' then 1
          else public.public_submission_limits.request_count + 1
        end,
        window_started_at = case
          when public.public_submission_limits.window_started_at <= now() - interval '15 minutes' then now()
          else public.public_submission_limits.window_started_at
        end,
        updated_at = now()
  returning request_count into v_count;

  if v_count > 5 then
    raise exception 'Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente.';
  end if;
end;
$$;

revoke all on function public.consume_public_submission_limit(text) from public, anon, authenticated;

-- Restrict direct execution of security-definer intake functions to the intended API roles.
revoke all on function public.receive_public_lead(text,text,text,text,numeric,boolean) from public;
grant execute on function public.receive_public_lead(text,text,text,text,numeric,boolean) to anon, authenticated;
revoke all on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) from public;
grant execute on function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean) to anon, authenticated;

alter function public.receive_public_lead(text,text,text,text,numeric,boolean)
  set search_path = pg_catalog, public, auth;
alter function public.receive_public_simulation_lead(text,text,text,text,numeric,text,integer,numeric,boolean)
  set search_path = pg_catalog, public, auth;
