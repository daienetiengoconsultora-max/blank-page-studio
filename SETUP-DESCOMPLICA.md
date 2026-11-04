# Configuração — DTM Consultoria Financeira

Este documento registra as orientações técnicas do projeto atual. O nome público oficial é **DTM CONSULTORIA FINANCEIRA**.

## Site público
O site apresenta os serviços de Limpa Nome, Score de Crédito, Rating Bancário, Bacen/SCR, CCF, Cadin e Diagnóstico Financeiro, além de páginas institucionais, blog e formulário de contato.

O formulário público utiliza a integração Supabase existente para registrar solicitações por meio da função RPC `receive_public_lead`. Não substituir essa integração por um formulário que apenas abre o WhatsApp.

## Variáveis de ambiente
Configure no ambiente de hospedagem/preview, sem incluir valores reais no Git:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`

Use `.env.example` apenas como modelo. Não ler, imprimir, copiar ou versionar segredos do arquivo `.env`.

## Supabase e CRM
O projeto possui autenticação, CRM, painel restrito, políticas de Row Level Security e migrations. Preservar as estruturas e integrações existentes. Não executar `db push`, migrations, exclusões de tabelas, alterações de RLS ou operações em dados reais durante uma limpeza documental.

Antes de qualquer manutenção no banco, conferir o projeto Supabase selecionado, revisar o SQL e obter autorização expressa.

## Verificações antes da publicação
```bash
bun run lint
bun run test
bun run build
```

Validar também o fluxo do formulário, autenticação, recuperação de senha, acesso restrito ao painel e responsividade. Um commit no GitHub não confirma que o deploy foi concluído.
