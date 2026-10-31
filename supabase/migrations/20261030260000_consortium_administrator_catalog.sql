-- Consortium administrator catalog and editable commercial parameters.
alter table public.partners
  add column if not exists category text,
  add column if not exists administration_fee numeric(8,4),
  add column if not exists reserve_fund numeric(8,4),
  add column if not exists term_months integer,
  add column if not exists contact_person text,
  add column if not exists website text;

create index if not exists partners_owner_category_idx
  on public.partners(owner_id, category);

insert into public.partners(owner_id,name,company,category,website,notes)
select u.id, v.name, v.name, 'Administradora', v.website,
       'Cadastro inicial. Preencher taxas e prazos somente com tabela comercial oficial vigente.'
from auth.users u
cross join (values
 ('Embracon','https://www.embracon.com.br/'),
 ('Banco do Brasil','https://www.bb.com.br/'),
 ('CNP','https://www.cnp.com.br/'),
 ('Rodobens','https://www.rodobens.com.br/'),
 ('Magalu Consórcios','https://consorciomagalu.com.br/'),
 ('Itaú','https://www.itau.com.br/')
) as v(name,website)
where lower(u.email)='daienetiengoconsultora@gmail.com'
  and not exists (
    select 1 from public.partners p
    where p.owner_id=u.id and p.category='Administradora' and lower(p.name)=lower(v.name)
  );
