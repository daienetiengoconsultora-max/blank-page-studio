# Escopo atual — DTM Consultoria Financeira

## Identidade
- Marca pública: **DTM CONSULTORIA FINANCEIRA**.
- Site público voltado a serviços de orientação e diagnóstico financeiro.
- Não utilizar nomes pessoais na identidade, metadados ou comunicação pública.
- Não divulgar consórcio, administradoras ou taxas de consórcio no site público.

## Serviços públicos
- Limpa Nome: análise de registros e orientação sobre caminhos legais de regularização.
- Score de Crédito: leitura de fatores que influenciam a pontuação.
- Rating Bancário: orientação sobre perfil e relacionamento com instituições.
- Bacen / SCR: interpretação de informações do Sistema de Informações de Créditos.
- CCF: orientação sobre registros e regularização.
- Cadin: orientação sobre pendências em cadastros públicos.
- Diagnóstico Financeiro: análise individualizada e explicação dos próximos passos.

## Site
- Página inicial e formulário de diagnóstico.
- Páginas de serviços e conteúdo editorial/blog.
- Páginas institucionais, termos e privacidade.
- SEO, sitemap e robots.
- Layout responsivo e identidade visual configurada no projeto.

## Áreas internas que devem ser preservadas
- CRM e painel restrito.
- Autenticação e recuperação de senha Supabase.
- Perfis, permissões e políticas RLS.
- Clientes, leads, atividades, documentos e registros persistidos.
- Migrations existentes e funções RPC.
- Integrações e rotinas de backend já conectadas.

Não remover módulos internos nem alterar a estrutura do banco como parte da limpeza do site público. Funcionalidades internas antigas devem ser avaliadas separadamente antes de qualquer desativação.

## Segurança e transparência
- Não expor segredos no frontend ou no Git.
- Não enfraquecer autenticação nem políticas RLS.
- Não prometer exclusão de dívidas, aumento de score, aprovação de crédito ou resultado judicial.
- Diferenciar orientação de crédito de decisões tomadas pelos birôs e instituições financeiras.
- Coletar dados pessoais somente com finalidade informada e consentimento adequado.

## Critérios de manutenção
1. Lint, testes e build devem passar.
2. Rotas públicas e restritas devem ser testadas.
3. Formulário deve continuar enviando dados ao Supabase.
4. CRM e autenticação devem continuar funcionando.
5. Nenhuma migration aplicada deve ser apagada ou reescrita.
6. Publicação só deve ser considerada concluída após verificação do endereço publicado.
