# DTM Consultoria Financeira

Repositório do site institucional público da **DTM CONSULTORIA FINANCEIRA**. O CRM/painel interno antigo foi removido do código e será reconstruído em trabalho futuro.

## Escopo público atual
- Limpa Nome: orientação para análise e regularização de registros.
- Score de Crédito.
- Rating Bancário.
- Bacen / SCR.
- CCF.
- Cadin.
- Diagnóstico Financeiro.
- Blog, páginas institucionais e formulário de contato/diagnóstico.

## Supabase
O site usa o Supabase apenas para o formulário público de diagnóstico, que envia os dados pela função RPC `receive_public_lead`. As tabelas, políticas RLS, usuários e migrations existentes no banco (inclusive as do CRM antigo) foram preservados como histórico de implantação e não devem ser apagados.

## CRM futuro
Não há rotas internas (/painel, /acesso-vendedor) nesta versão. O novo CRM será construído separadamente.

## Stack
- React + TypeScript
- TanStack Start / Router
- Vite
- Tailwind CSS
- Supabase (Auth e banco)
- Vitest e ESLint

## Comandos
```bash
bun install
bun run lint
bun run test
bun run build
```

## Configuração
Use `.env.example` como referência. Nunca versionar valores reais de ambiente, tokens, senhas ou chaves privadas. O arquivo `.env` não deve ser lido, copiado ou publicado.

## Regras de manutenção
1. Marca pública: **DTM CONSULTORIA FINANCEIRA**.
2. Não inserir nomes pessoais na identidade pública.
3. Não inserir consórcio, administradoras ou taxas de consórcio no site público.
4. Preservar dados, políticas RLS, migrations, a RPC do formulário e integrações do Supabase.
5. Não apagar migrations já aplicadas nem alterar dados do Supabase como parte de limpeza de arquivos.
6. Não prometer exclusão de dívidas, aumento de score ou aprovação de crédito.
7. Executar lint, testes e build antes de publicar.
8. Commit no GitHub não significa publicação concluída; confirmar o deploy separadamente.
