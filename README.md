# DTM Consultoria Financeira

Repositório do site institucional da **DTM CONSULTORIA FINANCEIRA** e das áreas internas já existentes.

## Escopo público atual
- Limpa Nome: orientação para análise e regularização de registros.
- Score de Crédito.
- Rating Bancário.
- Bacen / SCR.
- CCF.
- Cadin.
- Diagnóstico Financeiro.
- Blog, páginas institucionais e formulário de contato/diagnóstico.

## Áreas internas preservadas
O projeto também contém CRM, painel restrito, autenticação Supabase e módulos internos. Não remover, recriar ou alterar essas partes durante ajustes do site público sem autorização expressa.

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
4. Preservar CRM, painel, autenticação, dados, políticas RLS, migrations e integrações.
5. Não apagar migrations já aplicadas nem alterar dados do Supabase como parte de limpeza de arquivos.
6. Não prometer exclusão de dívidas, aumento de score ou aprovação de crédito.
7. Executar lint, testes e build antes de publicar.
8. Commit no GitHub não significa publicação concluída; confirmar o deploy separadamente.
