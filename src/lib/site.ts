// Endereço publicado confirmado na Lovable; troque quando houver domínio próprio confirmado.
export const SITE_URL = "https://descomplicacreditoo.lovable.app";
export const BRAND = "DTM CONSULTORIA FINANCEIRA";
export const WHATSAPP_NUMBER = "5527998737600";
export const WHATSAPP_DISPLAY = "(27) 99873-7600";
export const whatsappLink = (text = "Olá! Quero fazer meu diagnóstico financeiro.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

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
};

export const SERVICES: Service[] = [
  {
    slug: "limpa-nome",
    name: "Limpa Nome",
    short:
      "Orientação para identificar, negociar e regularizar dívidas que deixam o CPF ou CNPJ negativado.",
    body: [
      "Levantamos em quais cadastros de inadimplência o seu nome aparece, quais são os credores e os valores informados.",
      "Com esse panorama, orientamos sobre caminhos possíveis: negociação direta, acordos, verificação de prazos e contestação de registros indevidos quando houver base legal.",
      "Cada caso é analisado individualmente. Não há garantia de exclusão de dívidas — dívidas legítimas precisam ser negociadas ou pagas.",
    ],
    steps: [
      "Consulta dos registros",
      "Análise de credores e prazos",
      "Plano de regularização",
      "Acompanhamento",
    ],
  },
  {
    slug: "score-de-credito",
    name: "Score de Crédito",
    short:
      "Entenda o que influencia sua pontuação e quais hábitos podem ajudar a melhorá-la com o tempo.",
    body: [
      "O score é calculado pelos birôs de crédito com base no histórico de pagamentos, dívidas em aberto, Cadastro Positivo e uso do crédito.",
      "Analisamos seu cenário e orientamos sobre atitudes que costumam pesar positivamente, como pagar contas em dia e manter dados atualizados.",
      "Ninguém pode garantir aumento de score: a pontuação é definida pelos birôs, e a evolução depende do seu comportamento financeiro.",
    ],
    steps: ["Leitura do relatório", "Pontos de atenção", "Plano de hábitos", "Revisão periódica"],
  },
  {
    slug: "rating-bancario",
    name: "Rating Bancário",
    short: "Saiba como os bancos avaliam seu risco interno e como se preparar para pedir crédito.",
    body: [
      "Cada banco possui sua própria classificação de risco (rating), baseada no relacionamento, movimentação, endividamento e informações do SCR.",
      "Ajudamos a organizar documentos, entender o seu perfil e preparar o relacionamento com as instituições antes de uma solicitação de crédito.",
      "A decisão de crédito é sempre da instituição financeira.",
    ],
    steps: [
      "Diagnóstico do perfil",
      "Organização financeira",
      "Preparação documental",
      "Orientação de relacionamento",
    ],
  },
  {
    slug: "bacen-scr",
    name: "Bacen / SCR",
    short: "Interpretação do seu relatório no Sistema de Informações de Crédito do Banco Central.",
    body: [
      "O SCR (Registrato) reúne as operações de crédito informadas pelas instituições ao Banco Central, incluindo valores vencidos e prejuízos.",
      "Ajudamos você a emitir e interpretar o relatório, identificar informações divergentes e orientar o pedido de correção junto à instituição responsável.",
      "Informações corretas permanecem no sistema pelo prazo regulamentar.",
    ],
    steps: [
      "Emissão do Registrato",
      "Leitura das operações",
      "Identificação de divergências",
      "Orientação de correção",
    ],
  },
  {
    slug: "ccf",
    name: "CCF",
    short: "Orientação sobre o Cadastro de Emitentes de Cheques sem Fundos e como regularizar.",
    body: [
      "O CCF registra pessoas e empresas que emitiram cheques devolvidos por falta de fundos, entre outros motivos.",
      "Orientamos sobre como identificar os cheques registrados, quitar com o beneficiário e solicitar a exclusão ao banco com o comprovante adequado.",
    ],
    steps: [
      "Consulta do registro",
      "Localização dos cheques",
      "Quitação e comprovação",
      "Pedido de exclusão ao banco",
    ],
  },
  {
    slug: "cadin",
    name: "Cadin",
    short: "Regularização de pendências com órgãos e entidades públicas federais.",
    body: [
      "O Cadin reúne pendências com órgãos públicos federais, como tributos e débitos com autarquias.",
      "Ajudamos a identificar qual órgão gerou o registro e orientamos sobre parcelamentos, quitação ou contestação pelos canais oficiais.",
    ],
    steps: [
      "Identificação do órgão",
      "Levantamento do débito",
      "Opções de regularização",
      "Acompanhamento da baixa",
    ],
  },
  {
    slug: "diagnostico-financeiro",
    name: "Diagnóstico Financeiro",
    short:
      "Uma visão completa da sua situação de crédito para decidir o próximo passo com segurança.",
    body: [
      "Reunimos as informações de cadastros de inadimplência, SCR, score e endividamento em um único panorama.",
      "A partir dele, você recebe uma orientação clara sobre prioridades e caminhos possíveis, com linguagem simples e sem promessas de resultado.",
    ],
    steps: [
      "Coleta de informações",
      "Consulta aos cadastros",
      "Relatório explicado",
      "Recomendação de próximos passos",
    ],
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
    a: "Não. Nenhuma empresa séria pode garantir exclusão de dívidas, aumento de score ou aprovação de crédito. Orientamos os caminhos legais e acompanhamos o processo.",
  },
  {
    q: "Como funciona o diagnóstico?",
    a: "Você preenche o formulário, nossa equipe entra em contato pelo WhatsApp, coleta as informações necessárias e apresenta um panorama da sua situação com os próximos passos.",
  },
  {
    q: "Atendem CPF e CNPJ?",
    a: "Sim. Atendemos pessoas físicas e empresas, considerando as particularidades de cada cadastro.",
  },
  {
    q: "Quanto custa?",
    a: "O diagnóstico financeiro custa R$ 29,99. O valor de qualquer serviço adicional é informado após a análise individual, antes de qualquer contratação.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Não há prazo garantido. Qualquer prazo informado é uma estimativa que depende da análise do advogado parceiro e do andamento no Poder Judiciário. Não prometemos suspensão, liminar ou aprovação de crédito.",
  },
  {
    q: "A DTM é um escritório de advocacia?",
    a: "Não. A DTM DESCOMPLICA CRÉDITO presta consultoria e orientação financeira. Quando há medida judicial, ela é conduzida por advogado(a) parceiro(a).",
  },
  {
    q: "Meus dados ficam protegidos?",
    a: "Sim. Usamos seus dados apenas para retornar o contato e conduzir o atendimento, conforme a nossa Política de Privacidade e a LGPD.",
  },
];
