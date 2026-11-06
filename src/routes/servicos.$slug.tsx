import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES, seo } from "@/lib/site";

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo(
          `/servicos/${params.slug}`,
          `${loaderData.name} | DTM CONSULTORIA FINANCEIRA`,
          loaderData.short,
        )
      : { meta: [{ title: "Serviço não encontrado" }, { name: "robots", content: "noindex" }] },
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow="Serviço" title={s.name} text={s.short} />
      <section className="mx-auto max-w-3xl px-5 py-16">
        {s.forWho && (
          <p className="mb-6 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-primary">
            Para quem: {s.forWho}
          </p>
        )}
        {s.body.map((p) => (
          <p key={p} className="mb-5 leading-7">
            {p}
          </p>
        ))}
        <h2 className="mt-10 font-display text-2xl font-semibold text-wine">Etapas</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {s.steps.map((st, i) => (
            <li key={st} className="rounded-2xl bg-secondary p-4 text-sm">
              <b className="text-primary">{i + 1}.</b> {st}
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-3xl border border-accent/50 bg-secondary/50 p-6">
          <p className="text-sm font-semibold text-primary">Próximo passo</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Faça o diagnóstico. Você recebe o panorama da sua situação e as opções possíveis — com
            custos explicados — antes de qualquer contratação.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/"
              hash="diagnostico"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Fazer diagnóstico
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
