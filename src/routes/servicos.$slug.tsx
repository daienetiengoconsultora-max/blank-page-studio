import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo(`/servicos/${params.slug}`, `${loaderData.name} | DTM CONSULTORIA FINANCEIRA`, loaderData.short)
      : { meta: [{ title: "Serviço não encontrado" }, { name: "robots", content: "noindex" }] },
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow="Serviço" title={s.name} text={s.short} />
      <section className="mx-auto max-w-3xl px-5 py-16">
        {s.body.map((p) => <p key={p} className="mb-5 leading-7">{p}</p>)}
        <h2 className="mt-10 font-display text-2xl font-semibold text-wine">Etapas</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {s.steps.map((st, i) => <li key={st} className="rounded-2xl bg-secondary p-4 text-sm"><b className="text-primary">{i + 1}.</b> {st}</li>)}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" hash="diagnostico" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Fazer diagnóstico</Link>
          <a href={whatsappLink(`Olá! Quero saber mais sobre ${s.name}.`)} target="_blank" rel="noreferrer" className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary">Falar no WhatsApp</a>
        </div>
      </section>
    </SiteLayout>
  );
}
