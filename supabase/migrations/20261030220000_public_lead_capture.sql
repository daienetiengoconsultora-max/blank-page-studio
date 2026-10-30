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
