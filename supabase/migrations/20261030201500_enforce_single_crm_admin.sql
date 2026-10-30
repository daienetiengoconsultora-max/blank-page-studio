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
