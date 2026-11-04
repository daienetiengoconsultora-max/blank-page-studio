import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { POSTS, seo } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo(
      "/blog",
      "Blog DTM | Limpa Nome, Score, SCR e Crédito",
      "Artigos sobre Limpa Nome, Score, Rating Bancário, CPF e CNPJ, Bacen/SCR, CCF, Cadin e Diagnóstico Financeiro.",
    ),
  component: BlogPage,
});

function BlogPage() {
  const cats = [...new Set(POSTS.map((p) => p.category))];
  return (
    <SiteLayout>
      <PageHero eyebrow="Blog DTM" title="Conteúdo para entender e cuidar do seu crédito" />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <a
              key={c}
              href={`#${encodeURIComponent(c)}`}
              className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground"
            >
              {c}
            </a>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              id={encodeURIComponent(p.category)}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="rounded-3xl border border-border bg-card p-7 hover:shadow-elegant"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {p.category}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-wine">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
