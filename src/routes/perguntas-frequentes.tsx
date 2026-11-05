import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { FAQ, seo } from "@/lib/site";

export const Route = createFileRoute("/perguntas-frequentes")({
  head: () => ({
    ...seo(
      "/perguntas-frequentes",
      "Perguntas frequentes | DTM Assessoria e Consultoria em Regularização de Dados de Crédito",
      "Tire suas dúvidas sobre Limpa Nome, score, diagnóstico financeiro e proteção de dados.",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: () => (
    <TextPage eyebrow="Dúvidas" title="Perguntas frequentes">
      {FAQ.map((f) => (
        <details key={f.q} className="rounded-2xl border border-border bg-card p-5">
          <summary className="cursor-pointer font-semibold text-wine">{f.q}</summary>
          <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </TextPage>
  ),
});
