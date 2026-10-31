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
