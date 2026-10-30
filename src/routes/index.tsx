import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, CarFront, CheckCircle2, House, Menu, MessageCircle, ShieldCheck, Sparkles, TrendingUp, WalletCards } from "lucide-react";

const whatsappNumber = "5527998737600";

const solutions = [
  {
    icon: WalletCards,
    title: "Consórcios",
    description: "Planeje a conquista de um veículo ou imóvel com uma modalidade de compra programada.",
  },
  {
    icon: CarFront,
    title: "Financiamento de veículos",
    description: "Compare possibilidades para encontrar uma condição compatível com seu planejamento.",
  },
  {
    icon: House,
    title: "Financiamento imobiliário",
    description: "Entenda etapas, condições e alternativas para tirar o projeto do papel.",
  },
  {
    icon: TrendingUp,
    title: "Investimentos",
    description: "Converse sobre objetivos e conheça alternativas adequadas ao seu perfil e momento.",
  },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A47B36]">{children}</p>;
}

export function Index() {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = [
      ["Objetivo", formData.get("goal")],
      ["Valor aproximado", formData.get("amount") || "Não informado"],
      ["Nome", formData.get("name")],
      ["WhatsApp", formData.get("phone")],
      ["Cidade", formData.get("city")],
    ];
    const message = [
      "Olá! Gostaria de solicitar uma simulação pelo site Descomplica Crédito.",
      "",
      ...fields.map(([label, value]) => `${label}: ${String(value)}`),
    ].join("\n");
    setWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#252321]">
      <header className="sticky top-0 z-40 border-b border-[#EAE3D9] bg-[#FCFAF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Descomplica Crédito, início">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#541D2B] text-[#E4C17A]">
              <Sparkles size={19} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-semibold tracking-tight text-[#541D2B]">Descomplica Crédito</span>
              <span className="block text-[9px] font-medium uppercase tracking-[0.22em] text-[#8C8176]">Caminhos para seus planos</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#5D5751] md:flex">
            <a className="transition hover:text-[#8A632A]" href="#inicio">Início</a>
            <a className="transition hover:text-[#8A632A]" href="#quem-sou">Quem sou</a>
            <a className="transition hover:text-[#8A632A]" href="#solucoes">Soluções</a>
            <a className="transition hover:text-[#8A632A]" href="#contato">Contato</a>
          </nav>
          <a href="#simulacao" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#B58A45] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#9C7335] sm:px-5 sm:text-sm">
            Fazer simulação <ArrowUpRight size={15} />
          </a>
        </div>
        <nav className="flex items-center justify-center gap-5 overflow-x-auto border-t border-[#EEE8E0] px-4 py-2 text-xs text-[#6C6259] md:hidden">
          <a href="#inicio">Início</a><a href="#quem-sou">Quem sou</a><a href="#solucoes">Soluções</a><a href="#contato">Contato</a>
        </nav>
      </header>

      <section id="inicio" className="relative isolate overflow-hidden bg-[#541D2B]">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#D7B66F]/20" />
        <div className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-[#D7B66F]/20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <SectionEyebrow>Crédito com clareza e planejamento</SectionEyebrow>
            <h1 className="text-4xl font-medium leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Seus planos merecem <span className="font-semibold text-[#E4C17A]">caminhos claros.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
              Conheça possibilidades para conquistar, financiar ou planejar. Atendimento próximo, explicações simples e decisões no seu ritmo.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#simulacao" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D3AD65] px-7 py-3.5 text-sm font-semibold text-[#3D2020] transition hover:bg-[#E2C17F]">
                Solicitar minha simulação <ArrowRight size={17} />
              </a>
              <a href="#solucoes" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                Conhecer soluções
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-white/65">
              <ShieldCheck size={17} className="text-[#E4C17A]" />
              <span>Informação transparente para você decidir com segurança.</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-[#D9B66F]/30 bg-[#6A2A39] p-7 shadow-2xl shadow-black/20 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E4C17A]">Um passo de cada vez</p>
              <h2 className="mt-5 text-3xl font-medium leading-tight text-white">O próximo capítulo começa com uma boa conversa.</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">Conte o que você deseja realizar. Vamos organizar as informações e apresentar os caminhos possíveis.</p>
              <a href="#simulacao" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#E4C17A] hover:text-white">
                Começar agora <ArrowDown size={16} />
              </a>
              <div className="mt-9 h-px bg-white/15" />
              <div className="mt-5 flex items-center justify-between text-xs text-white/55">
                <span>DESCOMPLICA CRÉDITO</span><span>01 / 04</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-[#EAE0D0] bg-white px-5 py-4 shadow-xl sm:block">
              <p className="text-xs text-[#81766B]">Atendimento</p>
              <p className="mt-1 text-sm font-semibold text-[#541D2B]">Humano e transparente</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#EAE3D9] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 lg:px-8">
          {[
            ["Clareza", "Explicações sem complicação"],
            ["Planejamento", "Opções alinhadas ao seu objetivo"],
            ["Acompanhamento", "Orientação em cada etapa"],
          ].map(([title, description]) => (
            <div key={title} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#B58A45]" size={19} />
              <div><p className="text-sm font-semibold text-[#541D2B]">{title}</p><p className="mt-1 text-xs text-[#81766B]">{description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="quem-sou" className="scroll-mt-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionEyebrow>Quem sou</SectionEyebrow>
            <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-tight text-[#541D2B] sm:text-4xl">Crédito não precisa ser complicado.</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-base leading-8 text-[#655D55]">
              Meu trabalho é ajudar você a entender as alternativas disponíveis para seus planos, com conversa clara, atenção às suas necessidades e respeito ao seu momento.
            </p>
            <p className="mt-4 text-base leading-8 text-[#655D55]">
              Cada pessoa tem uma realidade. Por isso, o primeiro passo é ouvir seu objetivo, organizar as informações e avaliar possibilidades sem prometer aprovação ou resultados que dependem de análise.
            </p>
          </div>
        </div>
      </section>

      <section id="solucoes" className="scroll-mt-28 bg-[#F3EEE7]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Soluções</SectionEyebrow>
            <h2 className="text-3xl font-medium tracking-tight text-[#541D2B] sm:text-4xl">Uma solução para cada objetivo.</h2>
            <p className="mt-4 text-sm leading-7 text-[#746A60]">Conheça as modalidades e converse para entender qual delas pode fazer sentido para você.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map(({ icon: Icon, title, description }) => (
              <article key={title} className="group rounded-2xl border border-[#E5DCCE] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C9A568] hover:shadow-lg hover:shadow-[#5B3B20]/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EFE5] text-[#9B7134]"><Icon size={23} strokeWidth={1.7} /></span>
                <h3 className="mt-6 text-lg font-semibold text-[#541D2B]">{title}</h3>
                <p className="mt-3 min-h-[84px] text-sm leading-6 text-[#766D64]">{description}</p>
                <a href="#simulacao" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9B7134]">Tenho interesse <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-6 text-[#81766B]">Condições, taxas, prazos, aprovação e disponibilidade dependem da instituição responsável e da análise de cada operação. Simulações são estimativas, não propostas ou garantias.</p>
        </div>
      </section>

      <section id="simulacao" className="scroll-mt-28 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="max-w-lg">
            <SectionEyebrow>Solicite sua simulação</SectionEyebrow>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-[#541D2B] sm:text-4xl">Vamos conversar sobre seu próximo passo?</h2>
            <p className="mt-5 text-sm leading-7 text-[#746A60]">Preencha os dados básicos. Ao enviar, você poderá abrir uma conversa no WhatsApp com as informações preenchidas.</p>
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#F8F4ED] p-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#A47B36]" size={19} />
              <p className="text-xs leading-6 text-[#746A60]">Seus dados não são gravados neste site. Eles serão compartilhados com você no WhatsApp somente quando você abrir e enviar a mensagem.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-[#EAE3D9] bg-[#FCFAF7] p-6 sm:p-9">
            {submitted && whatsappUrl ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F2E9] text-[#3C7B4A]"><CheckCircle2 size={27} /></span>
                <h3 className="mt-5 text-xl font-semibold text-[#541D2B]">Seus dados estão prontos!</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746A60]">Abra o WhatsApp para revisar e enviar sua solicitação. A conversa só será iniciada depois da sua confirmação.</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#541D2B] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6A2A39]"><MessageCircle size={17} /> Abrir WhatsApp</a>
                <button type="button" onClick={() => { setSubmitted(false); setWhatsappUrl(""); }} className="mt-4 block w-full text-xs font-medium text-[#8B7E70] hover:text-[#541D2B]">Voltar ao formulário</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="goal" className="mb-2 block text-sm font-medium text-[#4D433B]">Qual é o seu objetivo?</label>
                  <select id="goal" name="goal" required defaultValue="" className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm text-[#3B332D] outline-none transition focus:border-[#B58A45] focus:ring-2 focus:ring-[#B58A45]/15">
                    <option value="" disabled>Selecione uma opção</option><option>Imóvel</option><option>Veículo</option><option>Investir</option><option>Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="amount" className="mb-2 block text-sm font-medium text-[#4D433B]">Valor aproximado que precisa <span className="font-normal text-[#93877A]">(opcional)</span></label>
                  <input id="amount" name="amount" placeholder="Ex.: R$ 80.000" className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#B0A69B] focus:border-[#B58A45] focus:ring-2 focus:ring-[#B58A45]/15" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="name" className="mb-2 block text-sm font-medium text-[#4D433B]">Nome completo</label><input id="name" name="name" autoComplete="name" required minLength={3} placeholder="Seu nome" className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#B0A69B] focus:border-[#B58A45] focus:ring-2 focus:ring-[#B58A45]/15" /></div>
                  <div><label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#4D433B]">Telefone com WhatsApp</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={10} placeholder="(00) 00000-0000" className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#B0A69B] focus:border-[#B58A45] focus:ring-2 focus:ring-[#B58A45]/15" /></div>
                </div>
                <div><label htmlFor="city" className="mb-2 block text-sm font-medium text-[#4D433B]">Cidade</label><input id="city" name="city" autoComplete="address-level2" required placeholder="Sua cidade" className="w-full rounded-xl border border-[#DED5C9] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#B0A69B] focus:border-[#B58A45] focus:ring-2 focus:ring-[#B58A45]/15" /></div>
                <label className="flex items-start gap-3 text-xs leading-5 text-[#766D64]"><input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#541D2B]" />Autorizo o compartilhamento dessas informações comigo pelo WhatsApp para tratar desta solicitação. Li o aviso de privacidade acima.</label>
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#B58A45] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9C7335]">Preparar mensagem <ArrowRight size={17} /></button>
                <p className="text-center text-[11px] leading-5 text-[#9A8F83]">Não envie senhas, documentos ou dados bancários por este formulário.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-28 bg-[#541D2B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20 lg:px-8">
          <div className="max-w-xl">
            <SectionEyebrow>Contato</SectionEyebrow>
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">Seu próximo passo começa com uma conversa.</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">Fale pelo WhatsApp para tirar dúvidas ou solicitar uma simulação.</p>
          </div>
          <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site Descomplica Crédito e gostaria de conversar.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#D3AD65] px-7 py-3.5 text-sm font-semibold text-[#3D2020] transition hover:bg-[#E2C17F]"><MessageCircle size={18} /> Conversar no WhatsApp <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <footer className="bg-[#32131C] text-white/65">
        <div className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-base font-semibold tracking-tight text-white">Descomplica Crédito</p><p className="mt-2 text-xs">Informação clara para decisões conscientes.</p></div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs"><a href="#inicio" className="hover:text-white">Início</a><a href="#solucoes" className="hover:text-white">Soluções</a><a href="#simulacao" className="hover:text-white">Simulação</a><a href="#contato" className="hover:text-white">Contato</a></nav>
          </div>
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="max-w-3xl text-[11px] leading-5 text-white/45">As informações deste site são gerais e não representam aprovação de crédito, oferta vinculante ou garantia de contemplação, rentabilidade ou contratação. As condições dependem das regras e análises das instituições responsáveis.</p>
            <div className="mt-5 flex justify-end"><a href="/acesso-vendedor" className="text-[10px] text-white/35 transition hover:text-white/75">Acesso do Vendedor</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Index;
