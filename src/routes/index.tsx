import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import { BRAND, POSTS, SERVICES, SITE_URL, TESTIMONIALS, TRUST_POINTS, WHATSAPP_NUMBER, seo, whatsappLink } from "@/lib/site";

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

function Home() {
  return (
    <SiteLayout>
      <section className="dtm-purple-panel relative overflow-hidden px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{BRAND}</p>
            <div className="dtm-rose-rule mt-4" />
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              Entenda sua situação de crédito e escolha o caminho certo — sem promessas milagrosas.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 opacity-90">
              Orientação clara e honesta para CPF e CNPJ: Limpa Nome, Score, Rating Comercial, Rating Bancário, Bacen/SCR e Diagnóstico completo.
            </p>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>✓ Análise de CPF/CNPJ, birôs de crédito e SCR</li>
              <li>✓ Diferença entre score e rating bancário explicada</li>
              <li>✓ Cada caso passa por análise individual</li>
              <li>✓ Custos e opções informados antes de qualquer contratação</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
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

      <section className="border-b border-accent/40 bg-secondary/50 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-medium text-muted-foreground">
          {TRUST_POINTS.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="text-brand-purple">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Serviços</p>
          <h2 className="dtm-section-heading mt-2 inline-block font-display text-3xl font-semibold md:text-4xl">
            Como podemos ajudar
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Atendemos pessoa física e jurídica. O diferencial está em olhar o cenário completo — score, rating comercial, rating bancário e SCR — e não só a negativação.
          </p>
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
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Processo simples, transparente e sem compromisso inicial.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              { t: "Você envia sua mensagem", d: "Formulário rápido ou WhatsApp. Menos de 1 minuto." },
              { t: "Retornamos pelo WhatsApp", d: "Nossa equipe entra em contato para entender o caso." },
              { t: "Analisamos sua situação", d: "Com autorização, olhamos birôs, SCR e score." },
              { t: "Orientação clara", d: "Panorama + opções + custos antes de qualquer contratação." },
            ].map((item, i) => (
              <li key={item.t} className="dtm-card rounded-3xl p-6">
                <span className="font-display text-3xl text-brand-purple">0{i + 1}</span>
                <div className="dtm-rose-rule mt-3" />
                <p className="mt-3 text-sm font-semibold">{item.t}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.d}</p>
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
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Para empresas</p>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                Rating Comercial e CNPJ também importam
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Fornecedores, parceiros e bancos olham o histórico da empresa. Um CNPJ com restrição ou rating comercial baixo trava prazo, capital de giro e relacionamento comercial.
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                Atendemos MEI, autônomos e empresas de todos os portes. O diagnóstico olha CPF e CNPJ juntos quando necessário.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/servicos/$slug"
                  params={{ slug: "rating-comercial" }}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Rating Comercial
                </Link>
                <Link
                  to="/servicos/$slug"
n                  params={{ slug: "rating-bancario" }}
                  className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary"
                >
                  Rating Bancário
                </Link>
              </div>
            </div>
            <div className="dtm-card rounded-3xl p-8">
              <h3 className="font-display text-xl font-semibold text-primary">O que costuma travar o crédito</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>• Nome limpo nos birôs, mas rating bancário baixo</li>
                <li>• SCR com operações desatualizadas ou em prejuízo</li>
                <li>• CNPJ com restrição afetando o sócio (e vice-versa)</li>
                <li>• Cadastro comercial desatualizado ou inconsistente</li>
                <li>• Falta de priorização: negociar a dívida errada primeiro</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-accent/50 bg-secondary px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="dtm-section-heading inline-block font-display text-3xl font-semibold md:text-4xl">
            Por que a DTM
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Transparência real",
                d: "Não prometemos exclusão de dívida, aumento garantido de score nem aprovação de crédito. Você recebe o que é possível fazer, com clareza.",
              },
              {
                t: "Visão completa",
                d: "Olhamos birôs, score, rating comercial, rating bancário e SCR. O problema quase nunca é só a negativação.",
              },
              {
                t: "Atendimento humano",
                d: "Retorno pelo WhatsApp, análise individual e explicação dos custos antes de qualquer contratação.",
              },
            ].map((item) => (
              <div key={item.t} className="dtm-card rounded-3xl p-6">
                <h3 className="font-display text-lg font-semibold text-primary">{item.t}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="dtm-section-heading inline-block font-display text-3xl font-semibold md:text-4xl">
            Depoimentos
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-1">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="dtm-card rounded-3xl p-8">
                <p className="text-sm leading-7 text-muted-foreground">“{t.text}”</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                  <p className="text-xs font-medium text-brand-purple">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-semibold text-wine md:text-4xl">Blog DTM</h2>
          <p className="mt-2 text-muted-foreground">Conteúdo direto sobre crédito, sem enrolação.</p>
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
          <Link
            to="/blog"
            className="mt-8 inline-block text-sm font-semibold text-brand-purple transition-colors hover:text-brand-rose"
          >
            Ver todos os artigos →
          </Link>
        </div>
      </section>

      <section className="dtm-purple-panel px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Pronto para entender sua situação de crédito?
          </h2>
          <p className="mt-4 text-base opacity-90">
            Faça o diagnóstico. Sem compromisso. Custos e opções explicados antes de qualquer contratação.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#diagnostico"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-purple shadow-md transition hover:opacity-90"
            >
              Começar diagnóstico
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp direto
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
