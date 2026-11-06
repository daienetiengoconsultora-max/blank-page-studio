// Endereço publicado confirmado na Lovable; troque quando houver domínio próprio confirmado.
export const SITE_URL = "https://limpanome-dtm.lovable.app";
export const BRAND = "DTM Consultoria e Regularização de Crédito";
export const BRAND_SHORT = "DTM CONSULTORIA FINANCEIRA";
export const WHATSAPP_NUMBER = "5527998737600";
export const WHATSAPP_DISPLAY = "(27) 99873-7600";
export const whatsappLink = (text = "Olá! Quero fazer meu diagnóstico financeiro.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const COMPANY = {
  legalName: "DTM Consultoria e Regularização de Crédito",
  cnpj: "69.554.451/0001-77",
  address: "Rua Pedro Palácios",
  years: 5,
  diagnoses: "mais de 2.000",
};

export function seo(path: string, title: string, description: string, type = "website") {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export type Service = {
  slug: string;
  name: string;
  short: string;
  body: string[];
  steps: string[];
  forWho?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "limpa-nome",
    name: "Limpa Nome",
    short:
      "Orientação para identificar, negociar e regularizar dívidas que deixam o CPF ou CNPJ negativado.",
    body: [
      "O primeiro passo é saber exatamente onde o seu nome aparece: Serasa, SPC, Boa Vista, cartórios e outros cadastros. Muita gente negocia a dívida errada primeiro.",
      "Levantamos credores, valores informados, datas e possíveis inconsistências. Com esse panorama, orientamos os caminhos reais: negociação direta, acordos, verificação de prazos e contestação de registros indevidos quando houver base.",
      "Cada caso é analisado individualmente. Dívidas legítimas precisam ser negociadas ou pagas — não existe atalho legal que apague o que é devido. Nosso trabalho é organizar o caminho com clareza e segurança.",
    ],
    steps: [
      "Consulta dos registros nos principais birôs",
      "Análise de credores, valores e prazos",
      "Plano de regularização priorizado",
      "Acompanhamento e orientação",
    ],
    forWho: "Pessoas físicas e empresas com restrições em birôs de crédito",
  },
  {
    slug: "score-de-credito",
    name: "Score de Crédito",
    short:
      "Entenda o que realmente influencia sua pontuação e quais hábitos costumam ajudar a melhorá-la com o tempo.",
    body: [
      "O score é calculado pelos birôs (Serasa, SPC, Boa Vista) com base em histórico de pagamentos, dívidas em aberto, Cadastro Positivo e uso do crédito. Cada um tem seu modelo.",
      "Analisamos o seu cenário atual e orientamos sobre atitudes que pesam positivamente: pagar contas em dia, manter dados atualizados, usar o Cadastro Positivo e evitar excesso de consultas em pouco tempo.",
      "Ninguém pode garantir aumento de score. A pontuação é definida pelos birôs e a evolução depende do seu comportamento financeiro ao longo do tempo.",
    ],
    steps: ["Leitura do relatório atual", "Pontos de atenção identificados", "Plano de hábitos recomendados", "Revisão periódica"],
    forWho: "Quem quer entender e melhorar a pontuação de forma realista",
  },
  {
    slug: "rating-comercial",
    name: "Rating Comercial",
    short: "Orientação para compreender avaliações comerciais e informações cadastrais usadas em relações entre empresas.",
    body: [
      "O rating comercial reúne critérios de risco e histórico de relacionamento utilizados por fornecedores, parceiros e empresas na hora de conceder prazo, crédito ou fechar negócio.",
      "É diferente do score de pessoa física. Aqui entram dados cadastrais, histórico de pagamentos empresariais, protestos, restrições e a forma como a empresa se apresenta no mercado.",
      "Ajudamos a interpretar as informações disponíveis, identificar divergências cadastrais e organizar os dados para uma avaliação mais clara. Cada empresa usa critérios próprios — a DTM não controla a classificação de terceiros nem garante aprovação comercial.",
    ],
    steps: ["Levantamento cadastral completo", "Análise das informações disponíveis", "Identificação de divergências", "Orientação de próximos passos"],
    forWho: "Empresas, MEI e autônomos que precisam de credibilidade comercial",
  },
  {
    slug: "rating-bancario",
    name: "Rating Bancário",
    short: "Saiba como os bancos avaliam seu risco interno e como se preparar para pedir crédito.",
    body: [
      "O rating bancário é a classificação de risco que cada banco atribui internamente ao cliente. Ele considera relacionamento, movimentação da conta, endividamento, histórico e informações do SCR (Bacen).",
      "Não é o mesmo que o score dos birôs. Mesmo com score alto, um rating baixo em um banco específico pode travar aprovação de cartão, empréstimo ou financiamento.",
      "Ajudamos a organizar documentos, entender o perfil e preparar o relacionamento com as instituições antes de uma solicitação. A decisão final de crédito é sempre da instituição financeira.",
    ],
    steps: [
      "Diagnóstico do perfil atual",
      "Organização financeira e documental",
      "Preparação para o relacionamento bancário",
      "Orientação de próximos passos",
    ],
    forWho: "Pessoas e empresas que precisam de crédito bancário e não conseguem aprovação",
  },
  {
    slug: "bacen-scr",
    name: "Bacen / SCR",
    short: "Interpretação do seu relatório no Sistema de Informações de Crédito do Banco Central.",
    body: [
      "O SCR (acessado pelo Registrato) reúne as operações de crédito informadas pelas instituições ao Banco Central: valores a vencer, vencidos e prejuízos.",
      "Muita gente só olha o score e não vê o que o banco realmente enxerga no SCR. Informações desatualizadas ou erradas podem prejudicar análises de crédito.",
      "Ajudamos a emitir e interpretar o relatório, identificar divergências e orientar o pedido de correção junto à instituição responsável. Informações corretas permanecem no sistema pelo prazo regulamentar.",
    ],
    steps: [
      "Emissão do Registrato",
      "Leitura das operações",
      "Identificação de divergências",
      "Orientação de correção",
    ],
    forWho: "Quem quer entender o que os bancos veem sobre suas operações de crédito",
  },
  {
    slug: "ccf",
    name: "CCF",
    short: "Orientação sobre o Cadastro de Emitentes de Cheques sem Fundos e como regularizar.",
    body: [
      "O CCF registra pessoas e empresas que emitiram cheques devolvidos por falta de fundos, entre outros motivos. Esse registro atrapalha a emissão de novos cheques e pode pesar em análises.",
      "Orientamos sobre como identificar os cheques registrados, quitar com o beneficiário e solicitar a exclusão ao banco com o comprovante adequado.",
    ],
    steps: [
      "Consulta do registro",
      "Localização dos cheques",
      "Quitação e comprovação",
      "Pedido de exclusão ao banco",
    ],
    forWho: "Quem tem cheques devolvidos e precisa regularizar o CCF",
  },
  {
    slug: "cadin",
    name: "Cadin",
    short: "Regularização de pendências com órgãos e entidades públicas federais.",
    body: [
      "O Cadin reúne pendências com órgãos públicos federais (tributos, autarquias e outros). Estar no Cadin pode bloquear crédito em bancos públicos e alguns benefícios.",
      "Ajudamos a identificar qual órgão gerou o registro e orientamos sobre parcelamentos, quitação ou contestação pelos canais oficiais.",
    ],
    steps: [
      "Identificação do órgão",
      "Levantamento do débito",
      "Opções de regularização",
      "Acompanhamento da baixa",
    ],
    forWho: "Pessoas e empresas com restrições junto à administração pública federal",
  },
  {
    slug: "diagnostico-financeiro",
    name: "Diagnóstico Financeiro",
    short:
      "Uma visão completa da sua situação de crédito para decidir o próximo passo com segurança.",
    body: [
      "Reunimos as informações de cadastros de inadimplência, SCR, score e endividamento em um único panorama. Muita gente tenta resolver a dívida errada primeiro.",
      "Você recebe um panorama claro: o que aparece nos birôs, o que pesa no SCR, como está o score e quais caminhos fazem mais sentido no seu caso. Tudo explicado em linguagem simples.",
      "Custos e opções de continuidade são apresentados antes de qualquer contratação. Você decide se deseja seguir.",
    ],
    steps: [
      "Coleta de informações",
      "Consulta aos cadastros",
      "Relatório explicado",
      "Recomendação de próximos passos",
    ],
    forWho: "Quem quer clareza antes de qualquer decisão ou contratação",
  },
];

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string[];
};

export const POSTS: Post[] = [
  {
    slug: "como-funciona-o-limpa-nome",
    title: "Limpa Nome: o que é possível fazer para regularizar seu CPF",
    category: "Limpa Nome",
    date: "2026-11-03",
    excerpt: "Entenda os caminhos reais para sair da negativação e evite promessas milagrosas.",
    content: [
      "Ter o nome negativado dificulta financiamentos, cartões e até aluguel. O primeiro passo é saber exatamente quais dívidas estão registradas, em quais cadastros e por quais credores.",
      "Dívidas legítimas são retiradas após pagamento ou acordo. Registros indevidos, com dados errados ou prazos vencidos, podem ser contestados pelos canais adequados.",
      "Desconfie de quem promete 'limpar o nome' sem pagar nada: o caminho seguro é informação, negociação e acompanhamento.",
    ],
  },
  {
    slug: "o-que-influencia-o-score",
    title: "Score de crédito: o que realmente influencia sua pontuação",
    category: "Score",
    date: "2026-11-03",
    excerpt:
      "Pagamentos em dia, Cadastro Positivo e dívidas em aberto: veja o que pesa no cálculo.",
    content: [
      "O score é uma estimativa da probabilidade de pagamento calculada pelos birôs de crédito. Cada birô usa seu próprio modelo.",
      "Pagar contas em dia, manter dados atualizados, participar do Cadastro Positivo e evitar muitas consultas em pouco tempo são fatores que costumam ajudar.",
      "A evolução leva tempo e depende do seu histórico. Nenhuma empresa pode garantir aumento de pontuação.",
    ],
  },
  {
    slug: "rating-bancario-explicado",
    title: "Rating bancário: como os bancos enxergam o seu risco",
    category: "Rating Bancário",
    date: "2026-11-03",
    excerpt: "Além do score, os bancos usam uma classificação interna. Saiba como ela funciona.",
    content: [
      "O rating é a nota de risco que cada instituição atribui ao cliente. Ela considera relacionamento, renda, endividamento e as informações do SCR.",
      "Organizar a vida financeira e concentrar a movimentação podem contribuir para um perfil mais favorável ao longo do tempo.",
      "Muita gente limpa o nome nos birôs e continua sem aprovação porque o rating interno do banco continua baixo. Entender essa diferença muda a estratégia.",
    ],
  },
  {
    slug: "cpf-e-cnpj-negativados",
    title: "CPF e CNPJ negativados: diferenças e cuidados",
    category: "CPF e CNPJ",
    date: "2026-11-03",
    excerpt: "Pendências da empresa e do sócio são tratadas de formas diferentes.",
    content: [
      "Dívidas do CNPJ ficam registradas em nome da empresa, mas podem afetar o sócio quando há aval, garantia pessoal ou responsabilidade definida em contrato.",
      "Por isso o diagnóstico deve olhar os dois cadastros, CPF e CNPJ, antes de definir prioridades.",
    ],
  },
  {
    slug: "o-que-e-o-scr-do-bacen",
    title: "Bacen/SCR: como consultar e interpretar o Registrato",
    category: "Bacen/SCR",
    date: "2026-11-03",
    excerpt: "O relatório gratuito do Banco Central mostra todas as suas operações de crédito.",
    content: [
      "O Registrato é o serviço gratuito do Banco Central que permite consultar o SCR, com empréstimos, financiamentos, valores a vencer, vencidos e prejuízo.",
      "Se houver informação incorreta, a correção deve ser solicitada à instituição que fez o registro.",
    ],
  },
  {
    slug: "ccf-cheque-sem-fundo",
    title: "CCF: como sair do cadastro de cheques sem fundos",
    category: "CCF",
    date: "2026-11-03",
    excerpt: "Passo a passo para regularizar cheques devolvidos.",
    content: [
      "Para excluir o registro, é preciso quitar o valor com o beneficiário e apresentar ao banco o cheque original ou declaração de quitação, conforme as regras da instituição.",
      "O banco pode cobrar tarifa pela exclusão, de acordo com sua tabela de serviços.",
    ],
  },
  {
    slug: "cadin-o-que-e",
    title: "Cadin: o que é e como regularizar pendências federais",
    category: "Cadin",
    date: "2026-11-03",
    excerpt: "Débitos com órgãos federais podem bloquear crédito em bancos públicos.",
    content: [
      "O Cadin informa pendências com a administração pública federal. A inclusão é feita pelo órgão credor após notificação.",
      "A regularização acontece por pagamento, parcelamento ou suspensão do débito junto ao órgão responsável.",
    ],
  },
  {
    slug: "por-que-fazer-um-diagnostico-financeiro",
    title: "Diagnóstico financeiro: por onde começar a reorganizar seu crédito",
    category: "Diagnóstico Financeiro",
    date: "2026-11-03",
    excerpt: "Antes de negociar, entenda o cenário completo.",
    content: [
      "Muitas pessoas negociam a dívida errada primeiro. Um diagnóstico reúne cadastros, SCR, score e orçamento para mostrar o que priorizar.",
      "Com o panorama em mãos, as decisões ficam mais seguras e realistas.",
    ],
  },
];

export const FAQ = [
  {
    q: "Vocês garantem a limpeza do nome?",
    a: "Não. Nenhuma empresa séria pode garantir exclusão de dívidas, aumento de score ou aprovação de crédito. Orientamos os caminhos legais e acompanhamos o processo com transparência.",
  },
  {
    q: "O que eu recebo no Diagnóstico Financeiro?",
    a: "Você recebe um panorama claro da sua situação: o que aparece nos birôs de crédito, como está o SCR (Bacen), o score e quais caminhos fazem mais sentido no seu caso. Tudo explicado em linguagem simples, com prioridades e próximos passos. Custos de eventuais serviços adicionais são apresentados antes de qualquer contratação.",
  },
  {
    q: "Como funciona o diagnóstico?",
    a: "Você preenche o formulário (leva menos de 1 minuto) ou manda mensagem no WhatsApp. Nossa equipe retorna, coleta as informações necessárias e apresenta o panorama da sua situação com os próximos passos.",
  },
  {
    q: "Atendem CPF e CNPJ?",
    a: "Sim. Atendemos pessoas físicas e empresas (incluindo MEI e autônomos). Muitas vezes é preciso olhar os dois cadastros juntos.",
  },
  {
    q: "Quais formas de pagamento?",
    a: "As formas de pagamento disponíveis (como Pix e cartão) são informadas durante o atendimento, antes da contratação.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Não há prazo garantido. Qualquer prazo informado é uma estimativa que depende da análise do caso e do andamento. Não prometemos suspensão, liminar ou aprovação de crédito.",
  },
  {
    q: "A DTM é um escritório de advocacia?",
    a: "Não. A DTM presta consultoria e orientação financeira. Quando há medida judicial, ela é conduzida por advogado(a) parceiro(a) devidamente habilitado.",
  },
  {
    q: "Meus dados ficam protegidos?",
    a: "Sim. Usamos seus dados apenas para retornar o contato e conduzir o atendimento, conforme a nossa Política de Privacidade e a LGPD.",
  },
  {
    q: "Qual a diferença entre score e rating bancário?",
    a: "O score é calculado pelos birôs de crédito (Serasa, SPC, Boa Vista) e é público para o consumidor. O rating bancário é a classificação interna de cada banco, baseada em relacionamento, SCR e outros critérios. Um pode estar bom e o outro não.",
  },
  {
    q: "Vocês atendem todo o Brasil?",
    a: "Sim. O atendimento é 100% digital pelo WhatsApp, para qualquer lugar do Brasil.",
  },
];

export const TRUST_POINTS = [
  "Mais de 2.000 diagnósticos realizados",
  "5 anos de atuação",
  "Sem promessas milagrosas",
  "Custos claros antes de contratar",
  "Atendimento humano pelo WhatsApp",
];

export const TESTIMONIALS = [
  {
    name: "Maria Antônia",
    location: "Rio Grande do Sul",
    text: "Eu estava com o nome sujo e sem saber por onde começar. O diagnóstico da DTM me mostrou exatamente o que pesava mais e quais passos faziam sentido. Consegui organizar as negociações com clareza e hoje já vejo diferença no meu score. Atendimento humano e sem enrolação.",
    result: "Organização das dívidas e evolução no score após o plano orientado",
  },
  {
    name: "Carlos Eduardo",
    location: "Espírito Santo",
    text: "Minha empresa estava com restrição e isso atrapalhava prazo com fornecedor. Eles olharam o CNPJ e o meu CPF juntos, explicaram o rating comercial e o que dava para resolver primeiro. Foi o primeiro atendimento em que eu realmente entendi o cenário.",
    result: "Clareza sobre CNPJ + caminho priorizado para regularização",
  },
  {
    name: "Juliana M.",
    location: "São Paulo",
    text: "Já tinha tentado sozinha e só me confundia mais. No diagnóstico eles separaram o que era negativação, o que era SCR e o que era score. Saí com um plano simples e realista. Recomendo para quem está cansado de promessa vazia.",
    result: "Panorama completo e plano realista de próximos passos",
  },
];

export const DIAGNOSTIC_DELIVERABLES = [
  "Leitura dos principais birôs de crédito",
  "Análise do SCR (Bacen)",
  "Situação do score e pontos de atenção",
  "Prioridades claras do que resolver primeiro",
  "Orientação dos caminhos possíveis no seu caso",
  "Explicação em linguagem simples, sem enrolação",
];
