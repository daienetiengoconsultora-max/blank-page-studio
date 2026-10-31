# Daiene Descomplica Crédito

Plataforma web responsiva para apresentação comercial, relacionamento com clientes e organização de operações de crédito e consórcio.

## Stack identificada

- React + TypeScript + Vite / TanStack Router
- Supabase Auth para autenticação
- Supabase Database para persistência
- Políticas RLS e funções SQL para controle de acesso
- Interface adaptável a celular e desktop

## Áreas já identificadas no código

- Site comercial na rota inicial
- Login e recuperação de senha do vendedor
- Painel administrativo
- CRM com cadastro de clientes, etapas do funil, atividades e retornos
- Simuladores e histórico de simulações
- Mapa da Rentabilidade
- Propostas, documentos, parceiros, investidores e relatórios no CRM

## Referência visual e funcional

A referência informada foi [DTCred — Crédito Descomplicado](https://consortium-sales-pla-7yhw.bolt.host/). O conteúdo público foi consultado, mas a ferramenta de leitura não disponibilizou o HTML nem as telas internas. Portanto, não afirmamos ter reproduzido elementos que não puderam ser inspecionados. A evolução deve seguir os padrões gerais solicitados: interface comercial limpa, navegação objetiva, cards de indicadores, funil visual, simuladores e foco em uso móvel.

## Direção visual

- Vermelho-escuro/bordô como cor principal
- Preto para contraste e hierarquia
- Branco para superfícies e leitura
- Dourado em detalhes, indicadores e chamadas de ação
- Layout responsivo, com formulários curtos e botões com estados de carregamento/erro/sucesso

## Configuração

Copie `.env.example` para `.env.local` e preencha as variáveis do Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Nunca coloque `service_role`, senha de banco, token privado ou segredo de gateway em variáveis expostas ao navegador. Segredos devem ficar em Supabase Edge Functions ou no ambiente seguro do servidor.

## Desenvolvimento e validação

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Integrações externas

Integrações reais com WhatsApp Business Platform, Google Calendar, assinatura digital, gateway de pagamento ou APIs de administradoras exigem credenciais, aprovação e configuração próprias. Não há credenciais inventadas nem taxas/condições de crédito presumidas. Até a configuração e teste dessas integrações, os respectivos pontos devem ser tratados como links/fluxos assistidos, não como integrações concluídas.

## Segurança e publicação

Antes de inserir dados reais:
1. Aplicar e revisar todas as migrações SQL no projeto Supabase correto.
2. Confirmar RLS em todas as tabelas e testar com contas de perfis diferentes.
3. Configurar URLs de redirecionamento e SMTP de recuperação de senha no Supabase.
4. Configurar domínios, variáveis de ambiente e políticas de segurança no provedor de hospedagem.
5. Executar lint, testes e build; depois validar login, permissões e gravação no ambiente publicado.

O detalhamento de escopo, integrações pendentes e critérios de aceite está em [docs/PLATAFORMA.md](docs/PLATAFORMA.md).
