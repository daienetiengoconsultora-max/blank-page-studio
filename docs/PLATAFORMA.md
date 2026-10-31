# Escopo funcional — Daiene Descomplica Crédito

## Objetivo

Evoluir o projeto existente para uma plataforma comercial integrada, responsiva e persistente, sem transformar estimativas em promessas de crédito, contemplação ou rentabilidade.

## Referência consultada

- URL fornecida: https://consortium-sales-pla-7yhw.bolt.host/
- Título público identificado: “DTCred — Crédito Descomplicado | Consórcio e Financiamento”.
- Limitação: o conteúdo público retornou sem linhas HTML legíveis. A análise visual detalhada de telas e interações não foi possível. A implementação não deve alegar cópia fiel da referência.

## Mapa de módulos e estado encontrado no repositório

| Módulo solicitado | Estado identificado |
|---|---|
| Site comercial | Rota inicial existente |
| Cadastro/login | Login Supabase existente; fluxo de cadastro de equipe precisa ser validado |
| Painel administrativo | Rota /painel existente |
| CRM e funil | LeadsCrm existente, com clientes, etapas e atividades |
| Simuladores de consórcio | Simuladores existentes no CRM e Mapa da Rentabilidade |
| Simulador de financiamento | Há campos/funções de simulação no CRM; fórmulas e parâmetros precisam de revisão antes de uso comercial |
| Imóveis, veículos, máquinas, equipamentos e serviços | Tipos de produto precisam ser padronizados e testados ponta a ponta |
| Comparação de modalidades | Deve ser implementada como comparação informativa, com dados fornecidos e identificados por fonte/data |
| Propostas PDF | Estrutura de propostas existe; geração/armazenamento e download devem ser testados |
| WhatsApp | Link de contato pode funcionar; API oficial e mensagens automatizadas dependem de configuração externa |
| Agenda e tarefas | Atividades/retornos existentes; sincronização externa não confirmada |
| Comissões | Campos e totais no CRM; conciliação e regras de estorno ainda precisam de validação |
| Relatórios | Área existente; métricas precisam ser conferidas contra os dados persistidos |
| Produtos e conteúdo | Parceiros/administradoras existem; gestão editorial/publicação precisa ser validada |
| Equipes, permissões e quotas | Perfis admin/vendedor previstos; gestão de equipes e limites por plano não confirmados |

## Prioridade de implementação

### P0 — Base segura e operação essencial
- Consolidar autenticação e perfis admin/vendedor.
- Revisar RLS em todas as tabelas e impedir leitura/edição cruzada entre vendedores.
- Garantir que clientes, atividades, simulações e propostas salvem e recarreguem do Supabase.
- Corrigir validações de formulários, estados de carregamento e mensagens de erro.
- Testar responsividade e navegação no celular.

### P1 — Fluxo comercial integrado
- Associar cada simulação e proposta a um cliente e ao usuário responsável.
- Permitir avançar o lead no funil a partir de ações reais.
- Registrar histórico de contatos, tarefas e retornos.
- Gerar proposta em PDF com os parâmetros da simulação, identificação do responsável e aviso de que os valores são estimativas.
- Comparar modalidades lado a lado usando somente taxas e condições fornecidas por fonte autorizada, com data de atualização.

### P2 — Gestão e integrações
- Comissão por venda, parcelas previstas/recebidas e histórico de ajustes.
- Relatórios por período, produto, vendedor e etapa.
- Catálogo de produtos e conteúdo gerenciável.
- WhatsApp Business Platform, Google Calendar e demais integrações somente após configuração das contas, permissões e credenciais.

## Regras de cálculo e transparência

- Não inventar taxa de administração, fundo de reserva, seguro, juros, CET, lance ou prazo de contemplação.
- Campos sem fonte devem ser preenchidos manualmente por pessoa autorizada e identificados como informados, não como taxa oficial.
- Diferenciar claramente consórcio de financiamento; não comparar apenas parcelas sem mostrar prazo, custos, reajustes e condições relevantes.
- Não prometer contemplação, aprovação de crédito, valorização de bem ou retorno.
- Qualquer prazo de contemplação exibido deve ser tratado como cenário hipotético informado pelo usuário, nunca previsão garantida.

## Integrações e variáveis

### Supabase
Variáveis públicas do frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Segredos administrativos nunca devem usar prefixo `VITE_`. Guardar em Edge Functions/servidor e limitar permissões.

### WhatsApp
- Definir conta WhatsApp Business Platform, número, WABA, app Meta e webhook.
- Guardar tokens no ambiente seguro do servidor.
- Testar recebimento e envio com consentimento e templates aprovados quando aplicável.
- Enquanto não configurado, usar somente link wa.me para abrir conversa manual.

### Agenda
- Google Calendar requer OAuth, consentimento e configuração do projeto Google Cloud.
- Até a integração, agenda interna do CRM não deve ser descrita como sincronizada com Google.

### PDF
- Validar geração no navegador/servidor, nome de arquivo, conteúdo, armazenamento e acesso restrito.
- Não expor documentos de um cliente a outro usuário sem permissão.

### Administradoras e crédito
- Não presumir APIs ou acesso a tabelas comerciais.
- Importações precisam de autorização e documentação oficial da administradora.
- Sem API, utilizar apenas parâmetros inseridos por usuário autorizado e identificados como tal.

## Critérios de aceite

1. Usuário não autenticado não acessa painel nem dados do CRM.
2. Vendedor acessa somente os registros permitidos pelas políticas RLS.
3. Administrador consegue visualizar a operação conforme permissões definidas.
4. Cliente, tarefa, simulação e proposta continuam disponíveis após sair e entrar novamente.
5. Toda simulação salva está ligada a cliente e responsável.
6. Erros de banco aparecem de forma clara e não são mascarados como sucesso.
7. Proposta exportada corresponde aos dados salvos.
8. A interface funciona em larguras móveis e desktop.
9. Lint, testes e build passam antes da publicação.
10. Integrações externas só são marcadas como ativas após teste real ponta a ponta.

## Pendências que exigem configuração externa

- Aplicar/revisar migrações no Supabase de produção.
- Configurar SMTP e URLs de autenticação.
- Credenciais e aprovação da Meta para WhatsApp Business.
- OAuth e credenciais Google Calendar, se desejado.
- Gateway de pagamento, caso exista cobrança de planos.
- Credenciais/API oficial de administradoras, se houver autorização.
- Domínio e variáveis de produção no host.

Não adicionar chaves privadas, senhas ou tokens ao Git.
