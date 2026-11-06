import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import { BRAND, SERVICES, SITE_URL, WHATSAPP_NUMBER, seo } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo(
      "/",
      "DTM Consultoria Financeira | Orientação e Regularização de Crédito",
      "Conheça os serviços da DTM para CPF e CNPJ: Limpa Nome, Score, Rating Bancário, Bacen/SCR, CCF e Cadin. Informação clara e atendimento individual.",
    ),
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialService",
        name: BRAND,
        url: SITE_URL,
        telephone: `+${WHATSAPP_NUMBER}`,
        areaServed: "BR",
      }),
    }],
  }),
  component: Home,
});

const HOME_SERVICES = SERVICES.filter((s) =>
  ["limpa-nome", "score-de-credito", "rating-bancario", "bacen-scr", "ccf", "cadin"].includes(s.slug),
);

function Home() {
  return (
    <SiteLayout>
      <section className="dtm-purple-panel px-5 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">{BRAND}</p>
            <div className="dtm-rose-rule mt-3" />
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              Clareza para entender sua situação de crédito.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 opacity-90 md:text-base">
              Orientação para pessoas e empresas que desejam compreender seus registros,
              organizar informações e conhecer os caminhos possíveis para CPF ou CNPJ.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#diagnostico" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple shadow-md">
                Solicitar atendimento
              </a>
            </div>
            <p className="mt-5 text-xs text-white/75">Atendimento digital • Todo o Brasil • Análise individual</p>
          </div>
          <div id="diagnostico" className="scroll-mt-28">
            <DiagnosticForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">Nossos serviços</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
            Encontre a orientação que procura
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Cada assunto tem sua própria página, com explicações e orientações específicas.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_SERVICES.map((service) => (
            <Link
              key={service.slug}
              to="/servicos/$slug"
              params={{ slug: service.slug }}
              className="dtm-card rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <h3 className="font-display text-lg font-semibold text-primary">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.short}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-purple">Conhecer serviço →</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/servicos" className="inline-flex rounded-full border border-brand-purple px-6 py-3 text-sm font-semibold text-brand-purple hover:bg-brand-purple hover:text-white">
            Ver todos os serviços
          </Link>
        </div>
      </section>

      <section className="bg-brand-cream px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Sobre a DTM</h2>
            <p className="mt-2 text-sm leading-6 text-brand-ink">
              Consultoria em regularização de dados de crédito, com atendimento humano e informações apresentadas de forma clara.
            </p>
            <Link to="/sobre" className="mt-3 inline-block text-sm font-semibold text-brand-purple">Conheça a empresa →</Link>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Conteúdo e orientação</h2>
            <p className="mt-2 text-sm leading-6 text-brand-ink">
              Acesse artigos sobre crédito, score, registros e organização financeira.
            </p>
            <Link to="/blog" className="mt-3 inline-block text-sm font-semibold text-brand-purple">Acessar o blog →</Link>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Fale conosco</h2>
            <p className="mt-2 text-sm leading-6 text-brand-ink">
              Envie sua solicitação pelo formulário ou converse com nossa equipe pelo WhatsApp.
            </p>
            <Link to="/contato" className="mt-3 inline-block text-sm font-semibold text-brand-purple">Ir para contato →</Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-accent/40 bg-card p-7 text-center md:p-10">
          <h2 className="font-display text-2xl font-semibold text-primary">Informação clara para decidir com segurança</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A DTM presta orientação e consultoria. A análise é individual, e decisões sobre registros ou concessão de crédito cabem às instituições e órgãos responsáveis.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
