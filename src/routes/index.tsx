import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import { BRAND, POSTS, SERVICES, SITE_URL, WHATSAPP_NUMBER, seo } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo("/", "DTM Descomplica Crédito | Limpa Nome, Score e Diagnóstico Financeiro", "Regularize seu nome com orientação transparente: Limpa Nome, Score, Rating Bancário, Bacen/SCR, CCF e Cadin. Faça seu diagnóstico gratuito pelo WhatsApp."),
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "FinancialService", name: BRAND, url: SITE_URL,
        telephone: `+${WHATSAPP_NUMBER}`, areaServed: "BR",
        hasOfferCatalog: { "@type": "OfferCatalog", name: "Serviços", itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.short } })) },
      }),
    }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <section className="bg-brand px-5 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">{BRAND}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">Quer regularizar seu nome? Faça seu diagnóstico!</h1>
            <p className="mt-5 max-w-lg text-base leading-7 opacity-90">Orientação clara e honesta para entender sua situação de crédito e escolher o melhor caminho — para CPF e CNPJ.</p>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>✓ Análise de cadastros, SCR e score</li>
              <li>✓ Explicação sem letras miúdas</li>
              <li>✓ Sem promessas de resultado garantido</li>
            </ul>
          </div>
          <div id="diagnostico" className="scroll-mt-24"><DiagnosticForm /></div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Serviços</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-wine md:text-4xl">Como podemos ajudar</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link key={s.slug} to="/servicos/$slug" params={{ slug: s.slug }} className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-elegant">
                <h3 className="font-display text-xl font-semibold text-wine">{s.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.short}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">Saiba mais →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-semibold text-wine md:text-4xl">Como funciona</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {["Você envia o formulário", "Entramos em contato pelo WhatsApp", "Analisamos sua situação", "Você recebe a orientação"].map((t, i) => (
              <li key={t} className="rounded-3xl bg-card p-6"><span className="font-display text-3xl text-primary">0{i + 1}</span><p className="mt-3 text-sm font-semibold">{t}</p></li>
            ))}
          </ol>
          <Link to="/como-funciona" className="mt-8 inline-block text-sm font-semibold text-primary">Ver detalhes →</Link>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-semibold text-wine md:text-4xl">Blog DTM</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {POSTS.slice(0, 3).map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="rounded-3xl border border-border p-6 hover:shadow-elegant">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
