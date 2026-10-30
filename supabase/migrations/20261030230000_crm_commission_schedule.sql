alter table public.leads
  add column if not exists commission_rate numeric(7,4) not null default 2,
  add column if not exists commission_installments integer not null default 13,
  add column if not exists commission_paid_amount numeric(14,2) not null default 0;
