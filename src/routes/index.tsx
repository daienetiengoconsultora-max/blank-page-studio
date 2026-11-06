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
          <h2 className="font-display text-2xl font-semibold md:text-3xl">Quem já passou pela DTM</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name} className="dtm-card rounded-2xl p-5">
                <p className="text-sm leading-6 text-muted-foreground line-clamp-4">“{t.text}”</p>
                <p className="mt-3 text-sm font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            ))}
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
