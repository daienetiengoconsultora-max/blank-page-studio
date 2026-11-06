-- Selfie do cliente na assinatura (prova de presença)
alter table public.contracts
  add column if not exists client_selfie_base64 text;

-- Atualiza assinatura do cliente exigindo selfie (base64 jpeg/png, limitada)
create or replace function public.sign_contract_as_client(
  p_token text,
  p_signer_name text,
  p_signer_doc text,
  p_accept boolean default false,
  p_ip text default null,
  p_selfie_base64 text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_c public.contracts%rowtype;
  v_selfie text;
begin
  if p_accept is not true then
    raise exception 'É necessário aceitar os termos do contrato.';
  end if;
  if length(trim(coalesce(p_signer_name, ''))) < 3 then
    raise exception 'Informe o nome completo de quem assina.';
  end if;
  if length(regexp_replace(coalesce(p_signer_doc, ''), '\D', '', 'g')) < 11 then
    raise exception 'Informe CPF ou CNPJ válido.';
  end if;
  if p_token is null or length(trim(p_token)) < 16 then
    raise exception 'Link inválido.';
  end if;

  v_selfie := trim(coalesce(p_selfie_base64, ''));
  if length(v_selfie) < 1000 then
    raise exception 'Tire uma foto do rosto para confirmar a assinatura.';
  end if;
  if length(v_selfie) > 900000 then
    raise exception 'A foto está muito grande. Tente novamente com menor qualidade.';
  end if;
  if position('data:image/' in v_selfie) <> 1 then
    raise exception 'Formato de foto inválido.';
  end if;

  select * into v_c from public.contracts where sign_token = trim(p_token) for update;
  if not found then
    raise exception 'Contrato não encontrado.';
  end if;
  if v_c.client_signed_at is not null then
    raise exception 'Este contrato já foi assinado pelo cliente.';
  end if;

  update public.contracts
  set client_signed_at = now(),
      client_signer_name = trim(p_signer_name),
      client_signer_doc = trim(p_signer_doc),
      client_sign_ip = left(coalesce(p_ip, ''), 64),
      client_selfie_base64 = v_selfie,
      status = case
        when company_signed_at is not null then 'assinado'
        else 'enviado'
      end,
      updated_at = now()
  where id = v_c.id
  returning * into v_c;

  insert into public.lead_activities (lead_id, owner_id, activity_type, description)
  values (
    v_c.lead_id,
    v_c.owner_id,
    'contrato',
    'Cliente assinou o contrato ' || v_c.number || ' com selfie (' || trim(p_signer_name) || ')'
  );

  if v_c.company_signed_at is not null then
    update public.leads
    set status = case when status in ('novo', 'diagnostico', 'proposta', 'em_atendimento', 'aguardando_cliente', 'contrato_enviado') then 'assinado' else status end,
        updated_at = now()
    where id = v_c.lead_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'client_signed_at', v_c.client_signed_at,
    'company_signed_at', v_c.company_signed_at,
    'status', v_c.status
  );
end;
$$;

revoke all on function public.sign_contract_as_client(text, text, text, boolean, text, text) from public;
grant execute on function public.sign_contract_as_client(text, text, text, boolean, text, text) to anon, authenticated;
