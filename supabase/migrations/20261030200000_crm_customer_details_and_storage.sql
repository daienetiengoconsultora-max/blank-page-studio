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
