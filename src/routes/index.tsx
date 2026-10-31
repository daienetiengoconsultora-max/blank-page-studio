import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Daiene Descomplica Crédito | Consórcios e Financiamentos" },
    { name: "description", content: "Compare possibilidades de consórcio imobiliário, consórcio de veículos e financiamento de imóveis e carros. Atendimento consultivo e simulação pelo WhatsApp." },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { name: "keywords", content: "consórcio imobiliário, consórcio de imóveis, consórcio de carros, consórcio de veículos, financiamento imobiliário, financiamento de veículos, simulação de consórcio, simulação de financiamento, carta de crédito" },
    { name: "author", content: "Daiene Descomplica Crédito" },
    { name: "theme-color", content: "#171310" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Daiene Descomplica Crédito" },
    { property: "og:title", content: "Daiene Descomplica Crédito | Consórcios e Financiamentos" },
    { property: "og:description", content: "Entenda opções de consórcio e financiamento para seus planos. Solicite uma simulação e converse pelo WhatsApp." },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Index,
});

function Index() {
  const [objective,setObjective]=useState("Imóvel");
  const [productType,setProductType]=useState("Consórcio");
  const [amount,setAmount]=useState("");
  const [term,setTerm]=useState("180");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [consent,setConsent]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [submitMessage,setSubmitMessage]=useState("");
  const [result,setResult]=useState<{monthly:number;total:number}|null>(null);
  const amountNumber=Number(amount);
  const months=Number(term);
  const adminFee=20;
  const monthlyRate=1.8;
  const monthlyEstimate=productType==="Consórcio"
    ? amountNumber*(1+adminFee/100)/months
    : amountNumber*(monthlyRate/100)/(1-Math.pow(1+monthlyRate/100,-months));
  const totalEstimate=monthlyEstimate*months;
  const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!consent||submitting)return;
    if(!Number.isFinite(amountNumber)||amountNumber<1000||amountNumber>1000000000){
      setSubmitMessage("Informe um valor entre R$ 1.000 e R$ 1 bilhão.");
      return;
    }
    if(!Number.isFinite(months)||![60,120,180,240].includes(months)){
      setSubmitMessage("Selecione um prazo válido.");
      return;
    }
    if(!Number.isFinite(monthlyEstimate)||monthlyEstimate<=0){
      setSubmitMessage("Não foi possível calcular esta estimativa. Confira os dados.");
      return;
    }
    setSubmitting(true);setSubmitMessage("");setResult(null);
    try {
      const {data,error}=await supabase.rpc("receive_public_simulation_lead",{
        p_name:name.trim(),p_email:email.trim(),p_phone:phone.trim(),
        p_objective:objective,p_estimated_value:amountNumber,p_product_type:productType,
        p_term_months:months,p_monthly_estimate:monthlyEstimate,p_consent:consent
      });
      if(error||!data){
        setSubmitMessage("Não foi possível registrar seus dados agora. Tente novamente mais tarde.");
        return;
      }
      setResult({monthly:monthlyEstimate,total:totalEstimate});
      setSubmitMessage("Simulação gerada! Seus dados e esta simulação foram registrados para nossa equipe.");
    } catch {
      setSubmitMessage("Falha de conexão ao enviar. Seus dados não foram confirmados. Tente novamente mais tarde.");
    } finally {
      setSubmitting(false);
    }
  }
  const solutions = [
    ["01", "Consórcios", "Planejamento para aquisição de imóveis, veículos e outros bens, conforme as regras do grupo."],
    ["02", "Financiamento de veículos", "Alternativas para aquisição de carro ou outro veículo, sujeitas à análise."],
    ["03", "Financiamento imobiliário", "Possibilidades para conquistar seu imóvel e organizar essa etapa."],
    ["04", "Investimentos", "Converse sobre seus objetivos e conheça alternativas para seu planejamento."],
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EB] text-[#292522]">
      <header className="sticky top-0 z-20 border-b border-[#7A2638]/55 bg-[#100D0B]/95 text-white shadow-[0_8px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#inicio" aria-label="Daiene Descomplica Crédito, início" className="flex shrink-0 items-center">
            <img src="/daiene-logo.svg" alt="Daiene Descomplica Crédito" className="h-14 w-auto max-w-[250px] object-contain sm:h-16" />
          </a>
          <nav className="hidden gap-6 text-sm text-white/85 md:flex">
            <a href="#inicio">Início</a><a href="#quem-sou">Quem sou</a><a href="#administradoras">Administradoras</a><a href="#solucoes">Soluções</a><a href="#como-escolher">Como escolher</a><a href="#duvidas">Dúvidas</a><a href="#simulacao">Simulação</a><a href="#contato">Contato</a>
          </nav>
          <a href="#simulacao" className="rounded-full bg-gradient-to-r from-[#7A2638] to-[#541D2B] px-4 py-2 text-sm font-semibold text-white shadow-[0_5px_18px_rgba(122,38,56,0.28)]">Fazer simulação</a>
        </div>
      </header>

      <section id="inicio" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_82%_35%,rgba(214,179,106,0.2),transparent_35%),linear-gradient(120deg,#080706_0%,#17100C_55%,#32131C_100%)] px-5 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full border border-[#D6B36A]/25" />
        <div className="pointer-events-none absolute right-8 top-12 h-[26rem] w-[26rem] rounded-full border border-[#D6B36A]/15" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 flex items-center gap-4"><span className="h-px w-12 bg-[#D6B36A]"/><p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#E7CC91]">Crédito com clareza e planejamento</p></div>
            <h1 className="max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-6xl">Daiene Descomplica Crédito</h1>
            <p className="mt-5 max-w-2xl text-2xl leading-snug text-white/90 sm:text-3xl">Consórcio e financiamento de forma <span className="font-semibold text-[#E7CC91]">simples, segura e descomplicada.</span></p>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">Encontre caminhos para realizar seus planos com atendimento consultivo, orientação clara e transparência em cada etapa.</p>
            <a href="#simulacao" className="mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F5D995] via-[#D6B36A] to-[#A87832] px-7 py-4 text-sm font-bold text-[#17100C] shadow-[0_8px_30px_rgba(214,179,106,0.25)] transition hover:-translate-y-0.5">Simular agora <span aria-hidden="true">→</span></a>
            <p className="mt-8 text-xs tracking-[0.12em] text-white/55">ATENDIMENTO CONSULTIVO <span className="px-2 text-[#D6B36A]">•</span> TRANSPARÊNCIA <span className="px-2 text-[#D6B36A]">•</span> CONDIÇÕES SUJEITAS À ANÁLISE</p>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-5 rounded-[2.5rem] bg-[#D6B36A]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#D6B36A]/45 bg-gradient-to-br from-[#2A1B12] via-[#130F0C] to-[#080706] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.5)] sm:p-8">
              <div className="flex items-center justify-between border-b border-[#D6B36A]/25 pb-5"><span className="text-xs uppercase tracking-[0.25em] text-[#E7CC91]">Realize seus planos</span><span className="font-serif text-2xl text-[#D6B36A]">D.</span></div>
              <svg viewBox="0 0 520 300" role="img" aria-label="Ilustração dourada de uma casa e um veículo, representando consórcio imobiliário e de veículos" className="my-5 w-full">
                <defs><linearGradient id="heroGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B7"/><stop offset=".55" stopColor="#D6B36A"/><stop offset="1" stopColor="#8F5D25"/></linearGradient></defs>
                <path d="M40 180 190 55l150 125" fill="none" stroke="url(#heroGold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M78 164v92h226v-92M160 256v-70h66v70M105 190h34v34h-34zM244 190h34v34h-34z" fill="none" stroke="url(#heroGold)" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M280 230h180l-18-52q-7-18-27-18h-91q-18 0-27 17l-17 53z" fill="#17110C" stroke="url(#heroGold)" strokeWidth="5" strokeLinejoin="round"/>
                <path d="m319 177 16-25h75l20 25" fill="none" stroke="url(#heroGold)" strokeWidth="5" strokeLinejoin="round"/>
                <circle cx="326" cy="233" r="17" fill="#090807" stroke="url(#heroGold)" strokeWidth="6"/><circle cx="425" cy="233" r="17" fill="#090807" stroke="url(#heroGold)" strokeWidth="6"/>
                <path d="M30 278h460" stroke="#D6B36A" strokeOpacity=".45" strokeWidth="2"/>
              </svg>
              <div className="grid grid-cols-3 gap-3 border-t border-[#D6B36A]/25 pt-5 text-center">
                <div><p className="text-lg text-[#E7CC91]">Imóveis</p><p className="mt-1 text-[10px] text-white/55">Consórcio e crédito</p></div>
                <div><p className="text-lg text-[#E7CC91]">Veículos</p><p className="mt-1 text-[10px] text-white/55">Carros e motos</p></div>
                <div><p className="text-lg text-[#E7CC91]">Planos</p><p className="mt-1 text-[10px] text-white/55">Sob medida</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quem-sou" className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:grid-cols-2 md:items-center">
        <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77D36]">Quem sou</p><h2 className="mt-4 text-3xl font-semibold leading-tight text-[#171310] sm:text-4xl">Mais clareza para escolher. Mais segurança para planejar.</h2><div className="mt-6 h-1 w-16 rounded bg-[#D6B36A]" /></div>
        <div className="space-y-4 text-base leading-8 text-[#6D655D]">
          <p>Meu trabalho é ajudar você a entender alternativas para seus planos, com atendimento próximo, explicações objetivas e respeito ao seu momento financeiro.</p>
          <p>Cada pessoa tem uma realidade e um objetivo. Por isso, começamos entendendo o que você procura e avaliamos possibilidades adequadas ao seu perfil.</p>
          <a href="#contato" className="inline-block font-semibold text-[#8B672F]">Vamos conversar →</a>
        </div>
      </section>

      <section id="administradoras" className="border-y border-[#E8DECE] bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A77D36]">Administradoras de consórcio</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#171310] sm:text-4xl">Marcas com as quais trabalhamos</h2>
            <p className="mt-4 text-sm leading-7 text-[#756C63]">Conheça algumas das administradoras disponíveis para consulta de planos e condições, conforme produto, grupo e análise.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div aria-label="Logo Embracon" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://www.embracon.com.br/img/embracon-logo2.svg" alt="Embracon" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
            <div aria-label="Logo Banco do Brasil" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://www2.bb.com.br/aapf/imagens/logo-login.svg" alt="Banco do Brasil" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
            <div aria-label="Logo CNP" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://www.embracon.com.br/img/marcas/cnp-logo.svg" alt="CNP" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
            <div aria-label="Logo Rodobens" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://rodobens.com.br/blog/seguros/assets/svg/logo-rodobens-primary.svg" alt="Rodobens" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
            <div aria-label="Logo Consórcio Magalu" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Magalu_-_novo_logo.png" alt="Magalu Consórcios" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
            <div aria-label="Logo Itaú" className="flex min-h-28 items-center justify-center rounded-2xl border border-[#E9E1D6] bg-white p-5"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Ita%C3%BA_Unibanco_logo_2023.svg" alt="Itaú" loading="lazy" className="max-h-14 max-w-full object-contain" /></div>
          </div>
          <p className="mt-7 text-center text-[11px] leading-5 text-[#8B8176]">As marcas pertencem às respectivas empresas. Daiene Descomplica Crédito é uma operação independente de atendimento e orientação; disponibilidade, taxas e condições devem ser confirmadas na proposta de cada administradora.</p>
        </div>
      </section>

      <section id="solucoes" className="bg-gradient-to-b from-[#F7F3EB] to-[#EDE5D8] px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77D36]">Soluções</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#171310] sm:text-4xl">Encontre a solução de crédito adequada ao seu objetivo</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#756C63]">Se você está pesquisando consórcio ou financiamento, conheça as diferenças entre as modalidades, avalie custos e prazos e peça uma simulação antes de decidir.</p>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-[#E6DED3] bg-[#F7F3EB] p-6 transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-semibold tracking-widest text-[#B18B4C]">{number}</span><h3 className="mt-5 text-xl font-semibold text-[#171310]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#766D64]">{description}</p><a href="#simulacao" className="mt-6 inline-block text-sm font-semibold text-[#8B672F]">Tenho interesse →</a></article>)}
          </div>
        </div>
      </section>

      <section id="como-escolher" className="bg-[#100D0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D6B36A]">Orientação antes de decidir</p>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl text-white sm:text-4xl">Consórcio ou financiamento: entenda o que muda.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">A melhor alternativa depende do prazo, da urgência, do orçamento e das condições disponíveis. Não existe uma resposta igual para todo mundo.</p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-[#D6B36A]/25 bg-white/[0.04] p-6"><h3 className="font-serif text-2xl text-[#E7CC91]">Consórcio</h3><p className="mt-3 text-sm leading-7 text-white/70">É uma modalidade de autofinanciamento em grupo. A contemplação acontece por sorteio ou lance, conforme contrato e regras do grupo. Não há garantia de contemplação em data determinada.</p><ul className="mt-4 space-y-2 text-sm text-white/65"><li>• Planejamento de médio ou longo prazo</li><li>• Taxa de administração e possíveis encargos</li><li>• Crédito sujeito à atualização e regras contratuais</li></ul></article>
            <article className="rounded-2xl border border-[#D6B36A]/25 bg-white/[0.04] p-6"><h3 className="font-serif text-2xl text-[#E7CC91]">Financiamento</h3><p className="mt-3 text-sm leading-7 text-white/70">É uma operação de crédito com análise da instituição financeira. Quando aprovado e contratado, permite adquirir o bem conforme as condições, entrada, taxas e prazos do contrato.</p><ul className="mt-4 space-y-2 text-sm text-white/65"><li>• Pode atender quem precisa adquirir o bem antes</li><li>• Juros, tarifas, seguros e tributos podem compor o custo</li><li>• Aprovação depende da análise de crédito</li></ul></article>
          </div>
          <p className="mt-6 text-xs leading-6 text-white/45">As informações são educativas. Taxas, custos, prazos, disponibilidade e aprovação dependem da instituição, do produto e da análise individual.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77D36]">Como funciona</p><h2 className="mt-4 text-3xl font-semibold text-[#171310]">Uma conversa clara, do primeiro passo à proposta.</h2><p className="mt-4 text-sm leading-7 text-[#756C63]">Você entende as possibilidades antes de tomar uma decisão. Sem promessa de aprovação ou contemplação.</p></div>
          <ol className="space-y-5">{[["01","Entendemos seu objetivo","Imóvel, veículo, valor aproximado e prazo desejado."],["02","Organizamos as possibilidades","Explicamos diferenças, custos envolvidos e pontos de atenção."],["03","Preparamos uma estimativa","Os números iniciais ajudam no planejamento e não substituem a proposta oficial."],["04","Você decide com informação","A contratação só avança após conhecer e aceitar as condições formais."]].map(([n,t,d])=><li key={n} className="flex gap-4 border-b border-[#E8E0D5] pb-5"><span className="font-serif text-2xl text-[#A77D36]">{n}</span><div><h3 className="font-semibold text-[#292522]">{t}</h3><p className="mt-1 text-sm leading-6 text-[#766D64]">{d}</p></div></li>)}</ol>
        </div>
      </section>

      <section id="simulacao" className="mx-auto grid max-w-6xl gap-10 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77D36]">Solicite sua simulação</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#171310] sm:text-4xl">Conte um pouco sobre o que deseja realizar.</h2>
          <p className="mt-5 leading-8 text-[#756C63]">Informe seu objetivo e o valor desejado para receber uma estimativa inicial. Os cálculos usam hipóteses simplificadas e não substituem uma proposta da instituição.</p>
          <div className="mt-8 rounded-2xl bg-[#EDE5D8] p-6"><p className="text-sm font-semibold text-[#171310]">Fale diretamente comigo</p><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg font-semibold text-[#9B7435]">Conversar pelo WhatsApp</a><p className="mt-2 text-xs leading-5 text-[#82776C]">Após a simulação, você poderá falar com a equipe pelo WhatsApp.</p></div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-[#D6B36A]/35 bg-white p-6 shadow-[0_24px_70px_rgba(30,20,10,0.13)] sm:p-9">
          <h3 className="text-xl font-semibold text-[#171310]">Seus dados</h3><p className="mt-2 text-sm text-[#82776C]">Preencha os campos obrigatórios.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="name" className="mb-2 block text-sm font-medium">Primeiro nome *</label><input id="name" required value={name} onChange={e=>setName(e.target.value)} autoComplete="given-name" placeholder="Seu primeiro nome" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail *</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="voce@email.com" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div className="sm:col-span-2"><label htmlFor="phone" className="mb-2 block text-sm font-medium">Telefone / WhatsApp *</label><input id="phone" required value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="objective" className="mb-2 block text-sm font-medium">Para que será o crédito? *</label><select id="objective" required value={objective} onChange={e=>setObjective(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option>Imóvel</option><option>Veículo</option><option>Construção ou reforma</option><option>Investimento</option><option>Outro objetivo</option></select></div>
            <div><label htmlFor="productType" className="mb-2 block text-sm font-medium">Modalidade *</label><select id="productType" required value={productType} onChange={e=>setProductType(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option>Consórcio</option><option>Financiamento</option></select></div>
            <div><label htmlFor="amount" className="mb-2 block text-sm font-medium">Valor do crédito (R$) *</label><input id="amount" required type="number" min="1000" step="100" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex.: 150000" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="term" className="mb-2 block text-sm font-medium">Prazo desejado *</label><select id="term" required value={term} onChange={e=>setTerm(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option value="60">60 meses</option><option value="120">120 meses</option><option value="180">180 meses</option><option value="240">240 meses</option></select></div>
          </div>
          <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-[#766D64]"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 accent-[#171310]" /><span>Autorizo o uso dos meus dados para registrar esta solicitação e receber contato sobre ela. Consulte nossa equipe para informações sobre privacidade e tratamento dos dados.</span></label>
          <button type="submit" disabled={submitting} className="mt-7 w-full rounded-full bg-[#171310] px-6 py-4 text-sm font-semibold text-white hover:bg-[#6A2A39] disabled:opacity-60">{submitting ? "Registrando e calculando..." : "Ver minha simulação"}</button>{submitMessage&&<p role="status" className="mt-3 rounded-xl bg-[#EDE5D8] p-3 text-xs leading-5 text-[#6D655D]">{submitMessage}</p>}
          {result&&<div className="mt-5 rounded-2xl border border-[#E7CC91] bg-[#F7F3EB] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#9B7435]">Sua estimativa inicial</p><p className="mt-2 text-sm text-[#766D64]">{productType} para {objective.toLowerCase()} · {months} meses</p><p className="mt-2 text-xs text-[#766D64]">Parcela mensal estimada</p><p className="text-3xl font-semibold text-[#171310]">{money(result.monthly)}</p><p className="mt-2 text-xs text-[#766D64]">Total estimado: {money(result.total)}</p><p className="mt-3 text-xs leading-5 text-[#766D64]">{productType==="Consórcio"?"Hipótese de taxa administrativa total de 20%, sem reajustes, fundo de reserva, seguros ou regras específicas de grupo. Não há garantia de contemplação.":"Hipótese de juros de 1,8% ao mês, sem entrada, tarifas, seguros ou CET oficial. A taxa real depende da instituição e da análise."}</p><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-[#D6B36A] px-5 py-3 text-sm font-semibold text-[#100D0B]">Conversar sobre minha simulação</a></div>}
          <p className="mt-4 text-center text-xs leading-5 text-[#9A8F83]">Estimativa educativa, não é proposta, aprovação de crédito ou garantia de contemplação. Valores reais dependem da instituição, do contrato e da análise.</p>
        </form>
      </section>


      <section id="duvidas" className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77D36]">Perguntas frequentes</p>
        <h2 className="mt-4 text-3xl font-semibold text-[#171310] sm:text-4xl">Dúvidas sobre consórcio e financiamento</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#171310]">Qual é a diferença entre consórcio e financiamento?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">No consórcio, pessoas participam de um grupo e a carta de crédito é disponibilizada por contemplação, conforme sorteios ou lances e as regras do contrato. No financiamento, a instituição analisa o crédito e, se aprovado, libera o valor com pagamento de parcelas e encargos.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#171310]">Como funciona o consórcio imobiliário?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Você escolhe o valor da carta e o prazo disponíveis em um grupo. A contemplação ocorre por sorteio ou lance, conforme contrato. Não há garantia de contemplação em uma data específica.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#171310]">É possível simular financiamento de veículos?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Sim. A simulação pode considerar valor do veículo, entrada, prazo e taxa estimada. A proposta final depende da análise de crédito e das condições oferecidas pela instituição financeira.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#171310]">Quais informações preciso para pedir uma simulação?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Informe seu objetivo, valor aproximado, cidade e um contato. A equipe poderá entender sua necessidade e orientar os próximos passos, sem compromisso de aprovação.</p></article>
        </div>
      </section>

      <section id="contato" className="border-t border-[#D6B36A]/25 bg-[radial-gradient(ellipse_at_80%_50%,rgba(184,137,61,0.18),transparent_45%),#100D0B] px-5 py-20 text-white"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E7CC91]">Contato</p><h2 className="mt-3 text-3xl font-semibold">Vamos conversar sobre seus planos?</h2><p className="mt-3 text-sm text-white/65">Atendimento pelo WhatsApp.</p></div><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#D6B36A] px-7 py-3.5 text-sm font-semibold text-[#100D0B]">Abrir WhatsApp</a></div></section>

      <footer className="bg-[#090807] px-5 py-9 text-xs text-white/55"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 sm:flex-row"><div className="max-w-2xl"><img src="/daiene-logo.svg" alt="Daiene Descomplica Crédito" className="h-16 w-auto max-w-[260px] object-contain object-left" /><p className="mt-4 leading-6 text-[#F2D9A5]">Atendimento em todo o Brasil</p><p className="mt-1 leading-6">Rua Pedro Palácios, 60 · Vitória - ES</p><p className="mt-1 leading-6">Consultoria independente · Atendimento em todo o Brasil</p><p className="mt-3 max-w-xl leading-6">As condições dependem da instituição responsável, das regras do produto e da análise de cada operação. Este site não garante aprovação de crédito ou contemplação.</p><p className="mt-3">© {new Date().getFullYear()} Daiene Descomplica Crédito. Todos os direitos reservados.</p></div><div className="flex flex-col items-start gap-4"><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#D6B36A]/55 bg-[#17110D] px-5 py-3 font-semibold text-[#F2D9A5] transition hover:bg-[#2B1C12]"><span aria-hidden="true">◉</span> WhatsApp</a><a href="/acesso-vendedor" className="text-white/40 hover:text-white/80">Acesso do Vendedor</a></div></div></footer>
      <a href="https://wa.me/5527998737600?text=Ol%C3%A1%2C%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20cr%C3%A9dito." target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[#E7CC91]/70 bg-[#176B45] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.32)] transition hover:-translate-y-1 hover:bg-[#125638]"><span className="text-xl" aria-hidden="true">◉</span><span className="hidden sm:inline">WhatsApp · (27) 99873-7600</span><span className="sm:hidden">WhatsApp</span></a>
    </main>
  );
}
