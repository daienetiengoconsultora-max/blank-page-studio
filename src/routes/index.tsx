import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

const WHATSAPP = "5527998737600";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Consórcio e Financiamento de Imóveis e Veículos | Descomplica Crédito" },
    { name: "description", content: "Compare possibilidades de consórcio imobiliário, consórcio de veículos e financiamento de imóveis e carros. Atendimento consultivo e simulação pelo WhatsApp." },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { name: "keywords", content: "consórcio imobiliário, consórcio de imóveis, consórcio de carros, consórcio de veículos, financiamento imobiliário, financiamento de veículos, simulação de consórcio, simulação de financiamento, carta de crédito" },
    { name: "author", content: "Descomplica Crédito" },
    { name: "theme-color", content: "#541D2B" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Descomplica Crédito" },
    { property: "og:title", content: "Consórcio e Financiamento de Imóveis e Veículos | Descomplica Crédito" },
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
    if(!consent||submitting||!Number.isFinite(amountNumber)||amountNumber<1000)return;
    setSubmitting(true);setSubmitMessage("");setResult(null);
    const {data,error}=await supabase.rpc("receive_public_simulation_lead",{
      p_name:name.trim(),p_email:email.trim(),p_phone:phone.trim(),
      p_objective:objective,p_estimated_value:amountNumber,p_product_type:productType,
      p_term_months:months,p_monthly_estimate:monthlyEstimate,p_consent:consent
    });
    setSubmitting(false);
    if(error||!data){setSubmitMessage("Não foi possível registrar seus dados agora. Tente novamente em instantes.");return;}
    setResult({monthly:monthlyEstimate,total:totalEstimate});
    setSubmitMessage("Simulação gerada! Seus dados e esta simulação foram registrados para nossa equipe.");
  }
  const solutions = [
    ["01", "Consórcios", "Planejamento para aquisição de imóveis, veículos e outros bens, conforme as regras do grupo."],
    ["02", "Financiamento de veículos", "Alternativas para aquisição de carro ou outro veículo, sujeitas à análise."],
    ["03", "Financiamento imobiliário", "Possibilidades para conquistar seu imóvel e organizar essa etapa."],
    ["04", "Investimentos", "Converse sobre seus objetivos e conheça alternativas para seu planejamento."],
  ];

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#292522]">
      <header className="sticky top-0 z-20 bg-[#541D2B] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a href="#inicio" className="text-lg font-semibold">Descomplica <span className="text-[#D9BC83]">Crédito</span></a>
          <nav className="hidden gap-6 text-sm text-white/85 md:flex">
            <a href="#inicio">Início</a><a href="#quem-sou">Quem sou</a><a href="#solucoes">Consórcio e financiamento</a><a href="#duvidas">Dúvidas</a><a href="#simulacao">Simulação</a><a href="#contato">Contato</a>
          </nav>
          <a href="#simulacao" className="rounded-full bg-[#C5A267] px-4 py-2 text-sm font-semibold text-[#32131C]">Fazer simulação</a>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-[#541D2B] px-5 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#D9BC83]/20" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D9BC83]">Crédito com clareza e planejamento</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-tight sm:text-6xl">Consórcio e financiamento para realizar seus planos.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Pesquise alternativas de consórcio imobiliário, consórcio de veículos, financiamento de imóveis e financiamento de carros. Compare possibilidades com orientação clara e uma simulação alinhada ao seu objetivo.</p>
          <a href="#simulacao" className="mt-9 inline-block rounded-full bg-[#C5A267] px-7 py-3.5 text-sm font-semibold text-[#32131C]">Solicitar uma simulação</a>
          <p className="mt-10 text-xs text-white/50">Atendimento consultivo • Transparência • Condições sujeitas à análise</p>
        </div>
      </section>

      <section id="quem-sou" className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:grid-cols-2 md:items-center">
        <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B36]">Quem sou</p><h2 className="mt-4 text-3xl font-semibold leading-tight text-[#541D2B] sm:text-4xl">Mais clareza para escolher. Mais segurança para planejar.</h2><div className="mt-6 h-1 w-16 rounded bg-[#C5A267]" /></div>
        <div className="space-y-4 text-base leading-8 text-[#6D655D]">
          <p>Meu trabalho é ajudar você a entender alternativas para seus planos, com atendimento próximo, explicações objetivas e respeito ao seu momento financeiro.</p>
          <p>Cada pessoa tem uma realidade e um objetivo. Por isso, começamos entendendo o que você procura e avaliamos possibilidades adequadas ao seu perfil.</p>
          <a href="#contato" className="inline-block font-semibold text-[#7A3445]">Vamos conversar →</a>
        </div>
      </section>

      <section id="solucoes" className="bg-[#F1ECE5] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B36]">Soluções</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#541D2B] sm:text-4xl">Encontre a solução de crédito adequada ao seu objetivo</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#756C63]">Se você está pesquisando consórcio ou financiamento, conheça as diferenças entre as modalidades, avalie custos e prazos e peça uma simulação antes de decidir.</p>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-[#E6DED3] bg-[#FCFAF7] p-6 transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-semibold tracking-widest text-[#B18B4C]">{number}</span><h3 className="mt-5 text-xl font-semibold text-[#541D2B]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#766D64]">{description}</p><a href="#simulacao" className="mt-6 inline-block text-sm font-semibold text-[#7A3445]">Tenho interesse →</a></article>)}
          </div>
        </div>
      </section>

      <section id="simulacao" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B36]">Solicite sua simulação</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#541D2B] sm:text-4xl">Conte um pouco sobre o que deseja realizar.</h2>
          <p className="mt-5 leading-8 text-[#756C63]">Escolha entre consórcio e financiamento, informe o crédito desejado e veja uma estimativa. Seus dados entram no CRM antes da exibição do resultado.</p>
          <div className="mt-8 rounded-2xl bg-[#F1ECE5] p-6"><p className="text-sm font-semibold text-[#541D2B]">Fale diretamente comigo</p><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg font-semibold text-[#8A6330]">(27) 99873-7600</a><p className="mt-2 text-xs leading-5 text-[#82776C]">Após a simulação, você poderá falar com a equipe pelo WhatsApp.</p></div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-[#E8E0D6] bg-white p-6 shadow-[0_18px_60px_rgba(50,19,28,0.07)] sm:p-9">
          <h3 className="text-xl font-semibold text-[#541D2B]">Seus dados</h3><p className="mt-2 text-sm text-[#82776C]">Preencha os campos obrigatórios.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="name" className="mb-2 block text-sm font-medium">Primeiro nome *</label><input id="name" required value={name} onChange={e=>setName(e.target.value)} autoComplete="given-name" placeholder="Seu primeiro nome" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail *</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="voce@email.com" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div className="sm:col-span-2"><label htmlFor="phone" className="mb-2 block text-sm font-medium">Telefone / WhatsApp *</label><input id="phone" required value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="objective" className="mb-2 block text-sm font-medium">Para que será o crédito? *</label><select id="objective" required value={objective} onChange={e=>setObjective(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option>Imóvel</option><option>Veículo</option><option>Construção ou reforma</option><option>Investimento</option><option>Outro objetivo</option></select></div>
            <div><label htmlFor="productType" className="mb-2 block text-sm font-medium">Modalidade *</label><select id="productType" required value={productType} onChange={e=>setProductType(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option>Consórcio</option><option>Financiamento</option></select></div>
            <div><label htmlFor="amount" className="mb-2 block text-sm font-medium">Valor do crédito (R$) *</label><input id="amount" required type="number" min="1000" step="100" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex.: 150000" className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm" /></div>
            <div><label htmlFor="term" className="mb-2 block text-sm font-medium">Prazo desejado *</label><select id="term" required value={term} onChange={e=>setTerm(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm"><option value="60">60 meses</option><option value="120">120 meses</option><option value="180">180 meses</option><option value="240">240 meses</option></select></div>
          </div>
          <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-[#766D64]"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 accent-[#541D2B]" /><span>Autorizo o uso dos meus dados para registrar esta simulação e receber contato sobre ela.</span></label>
          <button type="submit" disabled={submitting} className="mt-7 w-full rounded-full bg-[#541D2B] px-6 py-4 text-sm font-semibold text-white hover:bg-[#6A2A39] disabled:opacity-60">{submitting ? "Registrando e calculando..." : "Ver minha simulação"}</button>{submitMessage&&<p role="status" className="mt-3 rounded-xl bg-[#F1ECE5] p-3 text-xs leading-5 text-[#6D655D]">{submitMessage}</p>}
          {result&&<div className="mt-5 rounded-2xl border border-[#D9BC83] bg-[#FCFAF7] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#8A6330]">Sua estimativa inicial</p><p className="mt-2 text-sm text-[#766D64]">{productType} para {objective.toLowerCase()} · {months} meses</p><p className="mt-2 text-xs text-[#766D64]">Parcela mensal estimada</p><p className="text-3xl font-semibold text-[#541D2B]">{money(result.monthly)}</p><p className="mt-2 text-xs text-[#766D64]">Total estimado: {money(result.total)}</p><p className="mt-3 text-xs leading-5 text-[#766D64]">{productType==="Consórcio"?"Hipótese de taxa administrativa total de 20%, sem reajustes, fundo de reserva, seguros ou regras específicas de grupo. Não há garantia de contemplação.":"Hipótese de juros de 1,8% ao mês, sem entrada, tarifas, seguros ou CET oficial. A taxa real depende da instituição e da análise."}</p><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-[#C5A267] px-5 py-3 text-sm font-semibold text-[#32131C]">Conversar sobre minha simulação</a></div>}
          <p className="mt-4 text-center text-xs leading-5 text-[#9A8F83]">Estimativa educativa, não é proposta, aprovação de crédito ou garantia de contemplação. Valores reais dependem da instituição, do contrato e da análise.</p>
        </form>
      </section>


      <section id="duvidas" className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B36]">Perguntas frequentes</p>
        <h2 className="mt-4 text-3xl font-semibold text-[#541D2B] sm:text-4xl">Dúvidas sobre consórcio e financiamento</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#541D2B]">Qual é a diferença entre consórcio e financiamento?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">No consórcio, pessoas participam de um grupo e a carta de crédito é disponibilizada por contemplação, conforme sorteios ou lances e as regras do contrato. No financiamento, a instituição analisa o crédito e, se aprovado, libera o valor com pagamento de parcelas e encargos.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#541D2B]">Como funciona o consórcio imobiliário?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Você escolhe o valor da carta e o prazo disponíveis em um grupo. A contemplação ocorre por sorteio ou lance, conforme contrato. Não há garantia de contemplação em uma data específica.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#541D2B]">É possível simular financiamento de veículos?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Sim. A simulação pode considerar valor do veículo, entrada, prazo e taxa estimada. A proposta final depende da análise de crédito e das condições oferecidas pela instituição financeira.</p></article>
          <article className="rounded-2xl border border-[#E6DED3] bg-white p-6"><h3 className="text-lg font-semibold text-[#541D2B]">Quais informações preciso para pedir uma simulação?</h3><p className="mt-3 text-sm leading-7 text-[#766D64]">Informe seu objetivo, valor aproximado, cidade e um contato. A equipe poderá entender sua necessidade e orientar os próximos passos, sem compromisso de aprovação.</p></article>
        </div>
      </section>

      <section id="contato" className="bg-[#32131C] px-5 py-16 text-white"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D9BC83]">Contato</p><h2 className="mt-3 text-3xl font-semibold">Vamos conversar sobre seus planos?</h2><p className="mt-3 text-sm text-white/65">Atendimento pelo WhatsApp.</p></div><a href="https://wa.me/5527998737600" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#C5A267] px-7 py-3.5 text-sm font-semibold text-[#32131C]">(27) 99873-7600</a></div></section>

      <footer className="bg-[#241017] px-5 py-8 text-xs text-white/55"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row"><div><p className="font-semibold text-white">Descomplica Crédito</p><p className="mt-2 max-w-xl leading-6">As condições dependem da instituição responsável, das regras do produto e da análise de cada operação. Este site não garante aprovação de crédito ou contemplação.</p><p className="mt-2">© {new Date().getFullYear()} Descomplica Crédito. Todos os direitos reservados.</p></div><a href="/acesso-vendedor" className="self-start text-white/40 hover:text-white/80">Acesso do Vendedor</a></div></footer>
    </main>
  );
}
