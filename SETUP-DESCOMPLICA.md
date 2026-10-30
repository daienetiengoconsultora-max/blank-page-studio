# Configuração do Descomplica Crédito

## Site público
A página inicial inclui apresentação, Quem Sou, soluções, formulário de simulação e contato. O telefone comercial configurado é **(27) 99873-7600**.

O formulário abre o WhatsApp com os campos preenchidos para a pessoa revisar e enviar. Nesta versão, os dados não são gravados automaticamente no banco nem no CRM.

## Variáveis de ambiente
Configure no ambiente de hospedagem/preview, sem colocar valores reais no Git:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`

Use `.env.example` apenas como modelo. Arquivos `.env` e `.env.*` são ignorados pelo Git.

## Preparar o banco do CRM
As migrations em `supabase/migrations` definem as tabelas e as políticas de Row Level Security. Para aplicá-las com o Supabase CLI:

```bash
supabase link --project-ref ohfllwcqnhcfweerjtar
supabase db push
```

Confira o SQL e o projeto selecionado antes de confirmar qualquer alteração no banco.

## Criar o único acesso administrativo
1. No Supabase, abra Authentication > Settings e desative novos cadastros (Allow new users to sign up).
2. Em Authentication > Users, convide somente `daienetiengoconsultora@gmail.com`.
2. Depois que o usuário existir, copie o UUID dele.
3. No SQL Editor do projeto, execute, substituindo o marcador pelo UUID correto:

```sql
update public.profiles
set role = 'admin'
where user_id = '<UUID_DO_USUARIO_AUTORIZADO>';
```

Os usuários criados pelo Supabase Auth recebem o perfil padrão de vendedor. A promoção para administrador é manual. O frontend também restringe o login ao e-mail `daienetiengoconsultora@gmail.com`, mas a proteção real contra novas contas depende de desativar cadastros no Supabase e manter apenas esse usuário em Authentication > Users. Não compartilhe a senha.

## Estado e limites atuais
- A tela de login usa Supabase Auth e não oferece cadastro público.
- A página `/painel` continua bloqueando o CRM até que o banco e as políticas sejam aplicados e testados.
- O cadastro de leads, upload de documentos, agenda, relatórios e exportações ainda precisam de implementação e testes integrados antes de armazenar dados reais.
- Os documentos têm tabela de metadados prevista, mas o bucket privado e suas políticas de Storage ainda precisam ser configurados antes de habilitar upload.
- O repositório não contém confirmação de publicação/deploy. Um commit no GitHub não significa que o site já esteja no ar.
