import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import {
  BRAND,
  SERVICES,
  SITE_URL,
  TESTIMONIALS,
  TRUST_POINTS,
  WHATSAPP_NUMBER,
  seo,
  whatsappLink,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo(
      "/",
      "DTM Consultoria Financeira | Limpa Nome, Rating Comercial e Bancário, Score e Diagnóstico",
      "Orientação transparente para CPF e CNPJ: Limpa Nome, Score, Rating Comercial e Bancário, Bacen/SCR, CCF, Cadin e Diagnóstico Financeiro. Sem promessas milagrosas.",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: BRAND,
          url: SITE_URL,
          telephone: `+${WHATSAPP_NUMBER}`,
          areaServed: "BR",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Serviços",
            itemListElement: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.name, description: s.short },
            })),
          },
        }),
      },
    ],
  }),
  component: Home,
});

const HIGHLIGHT_SERVICES = SERVICES.filter((s) =>
  ["limpa-nome", "score-de-credito", "rating-comercial", "rating-bancario", "bacen-scr", "diagnostico-financeiro"].includes(
    s.slug,
  ),
);

const SEALS = [
  { icon: "RA", color: "#BD2426", title: "Reclame Aqui", badge: "Ótima reputação", sub: "Clientes avaliam nosso atendimento" },
  { icon: "★ 4.9", color: "#D97706", title: "Avaliação dos clientes", badge: "Excelente", sub: "Com base nos depoimentos recebidos" },
  { icon: "G", color: "#4285F4", title: "Google", badge: "Bem avaliada", sub: "Avaliações positivas de clientes" },
  { icon: "2k+", color: "#6D28D9", title: "Diagnósticos", badge: "Realizados", sub: "Em todo o Brasil" },
  { icon: "5 anos", color: "#059669", title: "De atuação", badge: "Mercado financeiro", sub: "Consultoria e regularização" },
  { icon: "CNPJ", color: "#0284C7", title: "Empresa formal", badge: "CNPJ ativo", sub: "Regularizada na Receita Federal" },
  { icon: "LGPD", color: "#7C3AED", title: "Proteção de dados", badge: "Conformidade", sub: "Dados tratados com segurança" },
  { icon: "WA", color: "#25D366", title: "Atendimento humano", badge: "WhatsApp direto", sub: "Sem robô, com equipe real" },
  { icon: "100%", color: "#DC2626", title: "Transparência", badge: "Custos claros", sub: "Valores antes de qualquer contratação" },
  { icon: "BR", color: "#16A34A", title: "Todo o Brasil", badge: "Atendimento digital", sub: "De qualquer estado do país" },
  { icon: "✓", color: "#0F766E", title: "Sem milagre", badge: "Ética primeiro", sub: "Não prometemos o impossível" },
  { icon: "24h", color: "#EA580C", title: "Retorno rápido", badge: "Resposta ágil", sub: "Equipe atende pelo WhatsApp" },
];

const WHY_TRUST = [
  {
    title: "Sem promessas milagrosas",
    text: "Não garantimos aprovação de crédito, aumento de score ou exclusão automática de dívidas. Cada caso é analisado com honestidade.",
  },
  {
    title: "Custos antes de contratar",
    text: "Você recebe o panorama e as opções com valores claros antes de qualquer contratação. Sem surpresa no meio do caminho.",
  },
  {
    title: "Empresa formal com CNPJ",
    text: "Atuamos com CNPJ ativo, política de privacidade e termos claros. Você sabe com quem está falando.",
  },
  {
    title: "Atendimento humano",
    text: "Fale direto com a equipe pelo WhatsApp. Sem chatbots eternos e sem sumiço depois do pagamento.",
  },
  {
    title: "Dados protegidos (LGPD)",
    text: "Seus dados são usados só para o atendimento e ficam protegidos conforme a Lei Geral de Proteção de Dados.",
  },
  {
    title: "Processo transparente",
    text: "Explicamos o que aparece nos birôs, no SCR e no score, e quais caminhos fazem sentido no seu caso — em linguagem simples.",
  },
];

function Home() {
  return (
    <SiteLayout>
      <section className="dtm-purple-panel relative overflow-hidden px-5 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{BRAND}</p>
            <div className="dtm-rose-rule mt-3" />
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
              Entenda sua situação de crédito e escolha o caminho certo — sem promessas milagrosas.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 opacity-90 md:text-base">
              Orientação clara para CPF e CNPJ: Limpa Nome, Score, Rating Comercial, Rating Bancário,
              Bacen/SCR e Diagnóstico completo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#diagnostico"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple shadow-md transition hover:opacity-90"
              >
                Quero meu diagnóstico
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-white/80">
              <span className="rounded-full border border-white/30 px-2.5 py-1">✓ Empresa com CNPJ</span>
              <span className="rounded-full border border-white/30 px-2.5 py-1">✓ LGPD</span>
              <span className="rounded-full border border-white/30 px-2.5 py-1">✓ Atendimento humano</span>
              <span className="rounded-full border border-white/30 px-2.5 py-1">✓ Sem promessa milagrosa</span>
            </div>
          </div>
          <div id="diagnostico" className="scroll-mt-24">
            <DiagnosticForm />
          </div>
        </div>
      </section>

      <section className="border-b border-accent/40 bg-secondary/50 px-5 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs font-medium text-muted-foreground sm:text-sm">
          {TRUST_POINTS.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="text-brand-purple">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      <section className="border-b border-accent/30 bg-white px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Reputação e confiança</p>
            <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
              Tudo o que mostra que você pode confiar
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Transparência, ética e atendimento real — do primeiro contato ao diagnóstico.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SEALS.map((s) => (
              <div key={s.title} className="dtm-card flex flex-col items-center rounded-2xl p-4 text-center">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  {s.icon}
                </div>
                <p className="mt-2.5 text-sm font-semibold text-primary">{s.title}</p>
                <p className="mt-0.5 text-xs font-medium text-emerald-600">{s.badge}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-accent/30 bg-secondary/40 px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Por que confiar</p>
            <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Nossos compromissos com você</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_TRUST.map((item) => (
              <div key={item.title} className="dtm-card rounded-2xl p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple/10 text-sm font-bold text-brand-purple">
                  ✓
                </div>
                <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Serviços</p>
              <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Como podemos ajudar</h2>
            </div>
            <Link to="/servicos" className="text-sm font-semibold text-brand-purple hover:text-brand-rose">
              Ver todos →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHT_SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                className="dtm-card rounded-2xl p-4 transition hover:-translate-y-0.5"
              >
                <h3 className="font-display text-base font-semibold text-primary">{s.name}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-2">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-accent/50 bg-secondary px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">Como funciona</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Você envia", d: "Formulário ou WhatsApp em menos de 1 minuto." },
              { t: "Retornamos", d: "Contato pelo WhatsApp para entender o caso." },
              { t: "Analisamos", d: "Birôs, SCR e score com a sua autorização." },
              { t: "Orientamos", d: "Panorama, opções e custos antes de contratar." },
            ].map((item, i) => (
              <li key={item.t} className="dtm-card rounded-2xl p-4">
                <span className="font-display text-xl text-brand-purple">0{i + 1}</span>
                <p className="mt-2 text-sm font-semibold">{item.t}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Depoimentos</p>
            <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Quem já passou pela DTM</h2>
            <p className="mt-1 text-sm text-muted-foreground">Histórias reais de quem buscou clareza e orientação</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name} className="dtm-card rounded-2xl p-5">
                <div className="mb-2 text-amber-500 text-sm">★★★★★</div>
                <p className="text-sm leading-6 text-muted-foreground line-clamp-4">“{t.text}”</p>
                <p className="mt-3 text-sm font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
                {t.result && (
                  <p className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700">
                    {t.result}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-accent/30 bg-white px-5 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-xl font-semibold md:text-2xl">Garantias de transparência</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-accent/40 bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-primary">Diagnóstico sem compromisso</p>
              <p className="mt-1 text-xs text-muted-foreground">Você entende a situação antes de decidir</p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-primary">Valores informados antes</p>
              <p className="mt-1 text-xs text-muted-foreground">Nada é cobrado sem alinhamento prévio</p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-primary">Linguagem simples</p>
              <p className="mt-1 text-xs text-muted-foreground">Sem juridiquês desnecessário</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dtm-purple-panel px-5 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            Pronto para entender sua situação de crédito?
          </h2>
          <p className="mt-3 text-sm opacity-90">
            Diagnóstico sem compromisso. Custos e opções explicados antes de qualquer contratação.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#diagnostico"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple shadow-md"
            >
              Começar diagnóstico
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
