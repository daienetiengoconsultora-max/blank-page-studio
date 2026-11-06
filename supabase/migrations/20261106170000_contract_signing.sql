-- Assinatura eletrônica simples (página própria DTM)
alter table public.contracts
  add column if not exists sign_token text,
  add column if not exists client_signed_at timestamptz,
  add column if not exists client_signer_name text,
  add column if not exists client_signer_doc text,
  add column if not exists client_sign_ip text,
  add column if not exists company_signed_at timestamptz,
  add column if not exists company_signer_name text,
  add column if not exists company_sign_ip text;

create unique index if not exists contracts_sign_token_uidx
  on public.contracts (sign_token)
  where sign_token is not null;

-- Gera / reutiliza token de assinatura (somente autenticado/dono)
create or replace function public.generate_contract_sign_token(p_contract_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
  v_owner uuid;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;

  select owner_id, sign_token into v_owner, v_token
  from public.contracts
  where id = p_contract_id;

  if v_owner is null then
    raise exception 'Contrato não encontrado.';
  end if;
  if v_owner <> auth.uid() then
    raise exception 'Sem permissão.';
  end if;

  if v_token is null or length(v_token) < 16 then
    v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
    update public.contracts
    set sign_token = v_token,
        status = case when status = 'rascunho' then 'enviado' else status end,
        updated_at = now()
    where id = p_contract_id;
  end if;

  return v_token;
end;
$$;

revoke all on function public.generate_contract_sign_token(uuid) from public;
grant execute on function public.generate_contract_sign_token(uuid) to authenticated;

-- Leitura pública do contrato pelo token
create or replace function public.get_contract_for_signing(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_c public.contracts%rowtype;
  v_lead public.leads%rowtype;
  v_body text;
begin
  if p_token is null or length(trim(p_token)) < 16 then
    raise exception 'Link inválido.';
  end if;

  select * into v_c from public.contracts where sign_token = trim(p_token) limit 1;
  if not found then
    raise exception 'Contrato não encontrado.';
  end if;

  select * into v_lead from public.leads where id = v_c.lead_id limit 1;

  v_body := v_c.body;
  v_body := replace(v_body, '{nome}', coalesce(v_lead.full_name, ''));
  v_body := replace(v_body, '{tipo_documento}', case when v_lead.client_type = 'PJ' then 'CNPJ' else 'CPF' end);
  v_body := replace(v_body, '{documento}', coalesce(v_lead.cpf_cnpj, ''));
  v_body := replace(v_body, '{endereco}', coalesce(v_lead.address, ''));
  v_body := replace(v_body, '{telefone}', coalesce(v_lead.phone, ''));
  v_body := replace(v_body, '{email}', coalesce(v_lead.email, ''));
  v_body := replace(v_body, '{valor}', to_char(v_c.amount, 'FM999G999G990D00'));
  v_body := replace(v_body, '{numero}', coalesce(v_c.number, ''));
  v_body := replace(v_body, '{data}', to_char(v_c.contract_date::date, 'DD/MM/YYYY'));

  return jsonb_build_object(
    'id', v_c.id,
    'number', v_c.number,
    'amount', v_c.amount,
    'contract_date', v_c.contract_date,
    'status', v_c.status,
    'body', v_body,
    'client_name', coalesce(v_lead.full_name, ''),
    'client_type', coalesce(v_lead.client_type, 'PF'),
    'client_signed_at', v_c.client_signed_at,
    'client_signer_name', v_c.client_signer_name,
    'company_signed_at', v_c.company_signed_at,
    'company_signer_name', v_c.company_signer_name
  );
end;
$$;

revoke all on function public.get_contract_for_signing(text) from public;
grant execute on function public.get_contract_for_signing(text) to anon, authenticated;

-- Assinatura do cliente (pública via token)
create or replace function public.sign_contract_as_client(
  p_token text,
  p_signer_name text,
  p_signer_doc text,
  p_accept boolean default false,
  p_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_c public.contracts%rowtype;
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
    'Cliente assinou o contrato ' || v_c.number || ' (' || trim(p_signer_name) || ')'
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

revoke all on function public.sign_contract_as_client(text, text, text, boolean, text) from public;
grant execute on function public.sign_contract_as_client(text, text, text, boolean, text) to anon, authenticated;

-- Assinatura da empresa (somente autenticado/dono)
create or replace function public.sign_contract_as_company(
  p_contract_id uuid,
  p_signer_name text default 'DTM Consultoria e Regularização de Crédito'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_c public.contracts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;
  if length(trim(coalesce(p_signer_name, ''))) < 3 then
    raise exception 'Informe o nome do signatário da empresa.';
  end if;

  select * into v_c from public.contracts where id = p_contract_id for update;
  if not found then
    raise exception 'Contrato não encontrado.';
  end if;
  if v_c.owner_id <> auth.uid() then
    raise exception 'Sem permissão.';
  end if;
  if v_c.company_signed_at is not null then
    raise exception 'A empresa já assinou este contrato.';
  end if;

  update public.contracts
  set company_signed_at = now(),
      company_signer_name = trim(p_signer_name),
      company_sign_ip = 'crm',
      status = case
        when client_signed_at is not null then 'assinado'
        else status
      end,
      updated_at = now()
  where id = v_c.id
  returning * into v_c;

  insert into public.lead_activities (lead_id, owner_id, activity_type, description)
  values (
    v_c.lead_id,
    v_c.owner_id,
    'contrato',
    'DTM assinou o contrato ' || v_c.number || ' (' || trim(p_signer_name) || ')'
  );

  if v_c.client_signed_at is not null then
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

revoke all on function public.sign_contract_as_company(uuid, text) from public;
grant execute on function public.sign_contract_as_company(uuid, text) to authenticated;
