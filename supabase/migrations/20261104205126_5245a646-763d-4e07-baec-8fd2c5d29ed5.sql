
create or replace function public.is_dtm_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_crm_admin()
     and lower(coalesce(auth.jwt() ->> 'email','')) = 'daienetiengoconsultora@gmail.com';
$$;
revoke all on function public.is_dtm_owner() from public, anon;
grant execute on function public.is_dtm_owner() to authenticated;

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check check (status = any (array[
 'novo','em_atendimento','contrato_enviado','assinado','em_processo','concluido','nao_fechou',
 'contato_inicial','qualificado','simulacao','proposta','negociacao','ganho','perdido']));
alter table public.lead_activities drop constraint if exists lead_activities_activity_type_check;
alter table public.lead_activities add constraint lead_activities_activity_type_check check (activity_type = any (array[
 'nota','ligacao','whatsapp','reuniao','tarefa','mensagem','sistema']));

create sequence if not exists public.contract_number_seq start 1;
grant usage on sequence public.contract_number_seq to authenticated;

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null default auth.uid(),
  number text not null default ('DTM-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.contract_number_seq')::text,4,'0')),
  contract_date date not null default current_date,
  client_type text not null default 'PF' check (client_type in ('PF','PJ')),
  amount numeric(12,2) not null,
  status text not null default 'rascunho' check (status in ('rascunho','enviado','assinado','arquivado')),
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  name text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.legal_processes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null default auth.uid(),
  documents_received_at date,
  sent_to_lawyer_at date,
  status text not null default 'aguardando' check (status in ('aguardando','suspensao_iniciada','vigencia_suspensao','concluido')),
  expected_date date,
  process_number text,
  lawyer_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  key text not null unique,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.message_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  owner_id uuid not null default auth.uid(),
  template_key text,
  body text not null,
  status text not null default 'copiada' check (status in ('copiada','enviada','respondida')),
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.contracts, public.contract_templates, public.legal_processes, public.message_templates, public.message_logs to authenticated;
grant all on public.contracts, public.contract_templates, public.legal_processes, public.message_templates, public.message_logs to service_role;

alter table public.contracts enable row level security;
alter table public.contract_templates enable row level security;
alter table public.legal_processes enable row level security;
alter table public.message_templates enable row level security;
alter table public.message_logs enable row level security;

create policy "dtm owner all contracts" on public.contracts for all to authenticated using (public.is_dtm_owner()) with check (public.is_dtm_owner());
create policy "dtm owner all contract templates" on public.contract_templates for all to authenticated using (public.is_dtm_owner()) with check (public.is_dtm_owner());
create policy "dtm owner all processes" on public.legal_processes for all to authenticated using (public.is_dtm_owner()) with check (public.is_dtm_owner());
create policy "dtm owner all message templates" on public.message_templates for all to authenticated using (public.is_dtm_owner()) with check (public.is_dtm_owner());
create policy "dtm owner all message logs" on public.message_logs for all to authenticated using (public.is_dtm_owner()) with check (public.is_dtm_owner());

create trigger contracts_updated before update on public.contracts for each row execute function public.set_updated_at();
create trigger contract_templates_updated before update on public.contract_templates for each row execute function public.set_updated_at();
create trigger legal_processes_updated before update on public.legal_processes for each row execute function public.set_updated_at();
create trigger message_templates_updated before update on public.message_templates for each row execute function public.set_updated_at();

create or replace function public.receive_contact_lead(p_name text, p_phone text, p_email text, p_client_type text, p_message text, p_consent boolean default false)
returns uuid language plpgsql security definer set search_path = public, auth, extensions as $$
declare v_owner uuid; v_id uuid;
begin
  perform public.consume_public_submission_limit('contact-form');
  if p_consent is not true then raise exception 'Consent is required.'; end if;
  if length(trim(coalesce(p_name,''))) < 2 or length(trim(p_name)) > 120 then raise exception 'Invalid name.'; end if;
  if length(regexp_replace(coalesce(p_phone,''),'\D','','g')) not between 10 and 15 then raise exception 'Invalid phone.'; end if;
  if p_email is not null and trim(p_email) <> '' and (length(p_email) > 254 or trim(p_email) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$') then raise exception 'Invalid email.'; end if;
  if p_client_type not in ('PF','PJ') then raise exception 'Invalid type.'; end if;
  if length(coalesce(p_message,'')) > 1500 then raise exception 'Message too long.'; end if;
  select id into v_owner from auth.users where lower(email) = 'daienetiengoconsultora@gmail.com' limit 1;
  if v_owner is null then raise exception 'CRM administrator account is not configured.'; end if;
  insert into public.leads(owner_id, full_name, phone, email, client_type, objective, notes, source, status)
  values (v_owner, trim(p_name), trim(p_phone), nullif(lower(trim(coalesce(p_email,''))),''), p_client_type,
          'Contato pelo site', nullif(trim(coalesce(p_message,'')),''), 'Site - Fale Conosco', 'novo')
  returning id into v_id;
  return v_id;
end; $$;
revoke all on function public.receive_contact_lead(text,text,text,text,text,boolean) from public;
grant execute on function public.receive_contact_lead(text,text,text,text,text,boolean) to anon, authenticated;

insert into public.message_templates(key,title,body) values
 ('boas_vindas','Boas-vindas','Olá, {nome}! Aqui é da DTM CONSULTORIA FINANCEIRA. Recebemos seu contato e vamos analisar sua situação com atenção. Em breve explicamos os próximos passos.'),
 ('documentos','Solicitação de documentos','Olá, {nome}! Para darmos andamento à análise, pedimos o envio dos documentos combinados (documento com foto, comprovante de residência e demais itens informados). Pode enviar por aqui mesmo.'),
 ('recebimento','Confirmação de recebimento','Olá, {nome}! Confirmamos o recebimento dos seus documentos. Vamos conferir tudo e retornamos com a atualização.'),
 ('encaminhamento','Encaminhamento ao advogado','Olá, {nome}! Sua documentação foi encaminhada ao advogado parceiro para análise. Os prazos dependem da análise jurídica e do Poder Judiciário, sem garantia de resultado.'),
 ('atualizacao','Atualização do processo','Olá, {nome}! Passando para atualizar: {status}. Qualquer novidade avisamos por aqui.'),
 ('vencimento','Aviso de vencimento','Olá, {nome}! Lembrete: a data prevista cadastrada no seu acompanhamento é {data}. Essa data é uma estimativa e pode mudar conforme o andamento do processo.'),
 ('follow_up','Follow-up','Olá, {nome}! Tudo bem? Estamos à disposição caso queira retomar a conversa sobre a sua situação financeira.')
on conflict (key) do nothing;

insert into public.contract_templates(owner_id,name,body)
select (select id from auth.users where lower(email)='daienetiengoconsultora@gmail.com' limit 1), 'Contrato padrão (rascunho)',
'MINUTA — SUJEITA À REVISÃO DO ADVOGADO PARCEIRO

CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA FINANCEIRA Nº {numero}

CONTRATADA: DTM CONSULTORIA FINANCEIRA.

CONTRATANTE: {nome}, inscrito(a) no {tipo_documento} sob nº {documento}, residente/sediado(a) em {endereco}, telefone {telefone}, e-mail {email}.

1. OBJETO: prestação de serviços de consultoria e orientação financeira, conforme combinado entre as partes. A CONTRATADA não é escritório de advocacia; eventuais medidas judiciais são conduzidas por advogado(a) parceiro(a).

2. HONORÁRIOS: R$ {valor}, pagos à vista ou no cartão de crédito, com eventuais juros da máquina por conta do CONTRATANTE. [Definir com o advogado se custas processuais estão ou não incluídas.]

3. PRAZOS E RESULTADOS: quaisquer prazos informados são estimativas condicionadas à análise do advogado e do Poder Judiciário. Não há garantia de resultado, concessão de liminar ou aprovação de crédito.

4. [Demais cláusulas a serem definidas e validadas pelo advogado parceiro.]

Local e data: ____________________, {data}.

_____________________________          _____________________________
CONTRATANTE                                         DTM CONSULTORIA FINANCEIRA'
where not exists (select 1 from public.contract_templates);
