# Plano de manutenção — DTM Consultoria Financeira

## Prioridade 0 — preservar e estabilizar
- [ ] Executar lint, testes e build e registrar resultados.
- [ ] Validar formulário público e RPC `receive_public_lead`.
- [ ] Revisar navegação e responsividade em celular.
- [ ] Conferir domínio canônico, sitemap e metadados SEO.

## Prioridade 1 — site público
- [x] Confirmar identidade pública DTM CONSULTORIA FINANCEIRA em todas as páginas.
- [x] Remover referências antigas de consórcio e nomes pessoais da comunicação pública.
- [ ] Revisar conteúdo dos serviços, blog, termos e política de privacidade.
- [ ] Conferir links, botões, acessibilidade e mensagens de formulário.

## Prioridade 2 — novo CRM (futuro)
- [x] CRM antigo removido do código do site (painel, acesso do vendedor, taxas, mapa).
- [ ] Construir o novo CRM separadamente.
- [ ] Testar persistência dos registros no Supabase.
- [ ] Validar permissões e políticas RLS sem enfraquecê-las.
- [ ] Conferir integrações existentes sem expor credenciais.

## Regras de limpeza
- Não apagar migrations, tabelas, dados, políticas, autenticação ou integrações.
- Não remover assets até confirmar que não são usados.
- Não publicar sem lint, testes, build e validação do site ao vivo.
