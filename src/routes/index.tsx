import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import { BRAND, POSTS, SERVICES, SITE_URL, WHATSAPP_NUMBER, seo } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo(
      "/",
      "DTM Assessoria e Consultoria em Regularização de Dados de Crédito | Limpamos o seu CPF ou CNPJ para você ter um fôlego financeiro e tentar voltar ao mercado de crédito.",
      "Orientação transparente para CPF e CNPJ: Limpa Nome, Score, Rating Comercial e Bancário, Bacen/SCR, CCF, Cadin e Diagnóstico Financeiro.",
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

function Home() {
  return (
    <SiteLayout>
      <section className="dtm-purple-panel relative overflow-hidden px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{BRAND}</p>
            <div className="dtm-rose-rule mt-4" />
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              Limpamos o seu CPF ou CNPJ para você ter um fôlego financeiro e tentar voltar ao mercado de crédito.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 opacity-90">
              Orientação clara e honesta para entender sua situação de crédito e escolher o melhor
              caminho — para CPF e CNPJ.
            </p>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>✓ Análise de CPF/CNPJ, birôs de crédito e SCR</li>
              <li>✓ Orientação clara e atendimento humano</li>
              <li>✓ Cada caso passa por análise individual</li>
            </ul>
          </div>
          <div id="diagnostico" className="scroll-mt-24">
            <DiagnosticForm />
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Serviços</p>
          <h2 className="dtm-section-heading mt-2 inline-block font-display text-3xl font-semibold md:text-4xl">
            Como podemos ajudar
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                className="dtm-card group rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-accent transition-all group-hover:w-16 group-hover:bg-brand-purple" />
                <h3 className="font-display text-xl font-semibold text-primary">{s.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.short}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-purple transition-colors group-hover:text-brand-rose">
                  Saiba mais →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-accent/50 bg-secondary px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="dtm-section-heading inline-block font-display text-3xl font-semibold md:text-4xl">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              "Você envia sua mensagem",
              "Retornamos pelo WhatsApp",
              "Analisamos sua situação",
              "Orientação e próximos passos",
            ].map((t, i) => (
              <li key={t} className="dtm-card rounded-3xl p-6">
                <span className="font-display text-3xl text-brand-purple">0{i + 1}</span>
                <div className="dtm-rose-rule mt-3" />
                <p className="mt-3 text-sm font-semibold">{t}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/como-funciona"
            className="mt-8 inline-block text-sm font-semibold text-brand-purple transition-colors hover:text-brand-rose"
          >
            Ver detalhes →
          </Link>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="dtm-section-heading inline-block font-display text-3xl font-semibold md:text-4xl">
            Depoimentos
          </h2>
          <div className="dtm-card mt-8 rounded-3xl p-8 text-sm leading-7 text-muted-foreground">
            Em breve, relatos de clientes reais, publicados somente com autorização.
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-semibold text-wine md:text-4xl">Blog DTM</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {POSTS.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="dtm-card rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple">
                  {p.category}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
