# Roadmap

## Em andamento
- [ ] Substituir módulo Parceiros por "Tabela de Taxas e Administradoras" (3 abas: financiamento imobiliário, veículos, administradoras de consórcio) com dados reais do Banco Central
  - [x] Pesquisar fontes públicas (API Olinda/BCB de taxas por instituição — OK, dados reais de Set-2026)
  - [ ] Buscar taxas de veículos (modalidade "Aquisição de veículos - Prefixado", endpoint diário)
  - [ ] Buscar lista de administradoras de consórcio autorizadas pelo BCB
  - [ ] Criar tabelas no Supabase (taxas + administradoras + histórico de atualizações) com RLS e dados iniciais
  - [ ] Criar componente da nova aba (busca, filtro, ordenação por menor taxa, data de atualização, botão atualizar)
  - [ ] Remover aba/cadastro manual de Parceiros do CRM (manter tabela `partners` no banco, sem apagar dados)
  - [ ] Integrar taxas de referência aos simuladores (selecionar instituição preenche taxa; manter taxa manual)
  - [ ] Testar build, filtros e simuladores

## Na sequência
- [ ] SEO do site para ser encontrado por quem busca consórcio e financiamento (títulos, descrições, palavras-chave, dados estruturados, sitemap, robots, conteúdo)
