drop policy if exists "documents update owner or admin" on public.client_documents;
create policy "documents update owner or admin" on public.client_documents
for update to authenticated
using (owner_id = auth.uid() or public.is_crm_admin())
with check (owner_id = auth.uid() or public.is_crm_admin());
