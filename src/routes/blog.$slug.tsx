import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { BRAND, POSTS, SITE_URL, seo } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? {
          ...seo(`/blog/${params.slug}`, `${loaderData.title} | Blog DTM`, loaderData.excerpt, "article"),
          scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: loaderData.title, datePublished: loaderData.date, author: { "@type": "Organization", name: BRAND }, mainEntityOfPage: `${SITE_URL}/blog/${params.slug}` }) }],
        }
      : { meta: [{ title: "Artigo indisponível" }, { name: "robots", content: "noindex" }] },
  component: PostPage,
});

function PostPage() {
  const p = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow={p.category} title={p.title} text={p.excerpt} />
      <article className="mx-auto max-w-3xl px-5 py-16">
        {p.content.map((t) => <p key={t} className="mb-5 leading-8">{t}</p>)}
        <div className="mt-10 rounded-3xl bg-secondary p-6">
          <p className="font-display text-xl font-semibold text-wine">Quer entender o seu caso?</p>
          <Link to="/" hash="diagnostico" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Fazer meu diagnóstico</Link>
        </div>
        <Link to="/blog" className="mt-8 inline-block text-sm font-semibold text-primary">← Voltar ao Blog DTM</Link>
      </article>
    </SiteLayout>
  );
}
