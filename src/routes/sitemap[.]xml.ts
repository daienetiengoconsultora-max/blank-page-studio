import { createFileRoute } from "@tanstack/react-router";
import { POSTS, SERVICES, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          "/",
          "/servicos",
          "/como-funciona",
          "/sobre",
          "/valores",
          "/contato",
          "/blog",
          "/perguntas-frequentes",
          "/privacidade",
          "/termos",
          ...SERVICES.map((s) => `/servicos/${s.slug}`),
          ...POSTS.map((p) => `/blog/${p.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
