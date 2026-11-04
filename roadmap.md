# Plano de manutenção — DTM Consultoria Financeira

## Prioridade 0 — preservar e estabilizar
- [ ] Executar lint, testes e build e registrar resultados.
- [ ] Validar formulário público e RPC `receive_public_lead`.
- [ ] Validar login, recuperação de senha e proteção do painel.
- [ ] Revisar navegação e responsividade em celular.
- [ ] Conferir domínio canônico, sitemap e metadados SEO.

## Prioridade 1 — site público
- [ ] Confirmar identidade pública DTM CONSULTORIA FINANCEIRA em todas as páginas.
- [ ] Remover referências antigas de consórcio e nomes pessoais da comunicação pública.
- [ ] Revisar conteúdo dos serviços, blog, termos e política de privacidade.
- [ ] Conferir links, botões, acessibilidade e mensagens de formulário.

## Prioridade 2 — CRM e integrações
- [ ] Testar persistência dos registros no Supabase.
- [ ] Validar permissões e políticas RLS sem enfraquecê-las.
- [ ] Conferir integrações existentes sem expor credenciais.
- [ ] Avaliar módulos internos legados separadamente, sem removê-los sem autorização.

## Regras de limpeza
- Não apagar migrations, tabelas, dados, políticas, autenticação ou integrações.
- Não apagar componentes do CRM apenas por conterem lógica legada.
- Não remover assets até confirmar que não são usados.
- Não publicar sem lint, testes, build e validação do site ao vivo.
