# Assistente IA do CRM

A interface do CRM chama a Edge Function `crm-ai-assistant`. A função valida a sessão do usuário no Supabase antes de chamar o provedor de IA.

## Configuração necessária

1. Publique a função `supabase/functions/crm-ai-assistant/index.ts` no projeto Supabase `ohfllwcqnhcfweerjtar`.
2. Cadastre o segredo `OPENAI_API_KEY` nos Secrets das Edge Functions do Supabase. A chave deve ser criada e mantida pela titular da conta OpenAI. Nunca coloque essa chave no código do navegador ou no repositório.
3. Confirme que a função está publicada com verificação JWT habilitada (padrão do Supabase).
4. Abra o CRM, entre em qualquer aba e teste a Assistente IA.

## O que a IA recebe

A interface envia somente o nome da aba atual, indicadores agregados do funil, contagens por etapa, valores e premissas da simulação aberta e taxas cadastradas das administradoras. Não envia nomes, telefones, e-mails, CPF/CNPJ ou documentos de clientes.

## Segurança e limites

A IA oferece apoio comercial e explicações de cálculo. Não substitui tabelas oficiais, contratos, análise jurídica ou aprovação de crédito. Taxas nunca devem ser inventadas e contemplação/aprovação não podem ser prometidas.
