# DTM Consultoria Financeira

Site institucional público e CRM interno privado da **DTM CONSULTORIA FINANCEIRA**.

## Stack
- React + TypeScript
- TanStack Start / Router
- Vite e Tailwind CSS
- Supabase (Auth, banco de dados e Storage)
- Vitest e ESLint

## Áreas do projeto
- Site público: página inicial, serviços, como funciona, valores, FAQ, contato, blog, privacidade e termos.
- Área restrita: `/acesso` para autenticação e `/crm` para o painel interno.
- CRM: módulos de leads/clientes, contratos, processos, mensagens e relatórios.
- Banco: migrations versionadas em `supabase/migrations`.

## Segurança e privacidade
- A conta autorizada do CRM é validada na autenticação e também pelas políticas RLS do Supabase. A proteção do banco é obrigatória; a proteção de rota no navegador, sozinha, não é suficiente.
- Visitantes podem enviar contatos somente pela RPC pública validada e limitada por taxa. Não conceder acesso anônimo direto às tabelas privadas do CRM.
- Não versionar arquivos de ambiente, tokens, senhas ou chaves privadas. Use `.env.example` como modelo e configure variáveis no ambiente de hospedagem/Lovable.
- Se alguma chave privada tiver sido publicada anteriormente, revogue-a e gere uma nova no serviço correspondente. Remover um arquivo em um commit novo não apaga versões antigas do histórico Git.
- Não colocar CPF, documentos ou dados reais de clientes em código, testes ou exemplos.

## Regras de manutenção
1. Marca pública: **DTM CONSULTORIA FINANCEIRA**.
2. Não inserir nomes pessoais na identidade pública.
3. Não inserir consórcio, administradoras ou taxas de consórcio no site público.
4. Preservar dados, políticas RLS, migrations, RPCs e integrações existentes do Supabase.
5. Não apagar nem reescrever migrations já aplicadas.
6. Não prometer exclusão de dívidas, aumento de score, concessão de liminar ou aprovação de crédito.
7. Textos jurídicos e minutas de contrato são rascunhos e precisam de validação do advogado parceiro antes do uso.
8. Executar lint, testes e build antes de publicar.
9. Um commit no GitHub não comprova que o deploy foi concluído; confirmar o resultado no ambiente publicado.

## Comandos
```bash
bun install
bun run lint
bun run test
bun run build
```

## Configuração
Copie `.env.example` para um arquivo local `.env` e preencha as variáveis necessárias. O arquivo `.env` deve permanecer fora do Git.
