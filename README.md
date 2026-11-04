# DTM Consultoria Financeira

Repositório do site institucional público da **DTM CONSULTORIA FINANCEIRA**. O CRM/painel interno antigo foi removido do código e será reconstruído em trabalho futuro.

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


## Estrutura

- Site público da DTM CONSULTORIA FINANCEIRA (rotas públicas em `src/routes`).
- CRM interno privado em `/crm` (rotas em `src/routes/_authenticated`), acessível somente pela conta autorizada. O acesso é garantido no banco por RLS (`is_dtm_owner()`), não só na interface.
- Cadastro público desativado (trigger `handle_new_crm_user`).
- Contrato e textos jurídicos são minutas sujeitas à revisão do advogado parceiro.
