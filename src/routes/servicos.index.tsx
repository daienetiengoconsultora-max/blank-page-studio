import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES, seo } from "@/lib/site";

export const Route = createFileRoute("/servicos/")({
  head: () =>
    seo(
      "/servicos",
      "Serviços | DTM CONSULTORIA FINANCEIRA",
      "Limpa Nome, Score, Rating Comercial e Bancário, Bacen/SCR, CCF, Cadin e Diagnóstico Financeiro explicados com transparência.",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Serviços"
        title="Serviços para entender e organizar sua situação financeira"
        text="Cada serviço começa com análise individual. Não prometemos resultados garantidos."
      />
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            to="/servicos/$slug"
            params={{ slug: s.slug }}
            className="rounded-3xl border border-border bg-card p-7 hover:shadow-elegant"
          >
            <h2 className="font-display text-2xl font-semibold text-wine">{s.name}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.short}</p>
          </Link>
        ))}
      </section>
    </SiteLayout>
  ),
});
