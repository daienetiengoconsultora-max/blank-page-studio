import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/valores")({
  head: () =>
    seo(
      "/valores",
      "Valores do diagnóstico financeiro | DTM Descomplica Crédito",
      "Conheça o valor do diagnóstico financeiro da DTM Descomplica Crédito. Serviços adicionais são avaliados individualmente e informados antes da contratação.",
    ),
  component: Valores,
});

function Valores() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Valores e condições"
        title="Transparência desde o primeiro contato"
        text="Você sabe o valor antes de contratar. Cada situação é analisada individualmente."
      />
      <section className="px-5 py-16">
        <div className="dtm-card mx-auto max-w-3xl rounded-3xl p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">
            Diagnóstico financeiro
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
            Análise inicial da sua situação
          </h2>
          <p className="mt-4 font-display text-5xl font-semibold text-primary">R$ 29,99</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            O diagnóstico reúne informações relevantes para entender seu cenário e indicar
            possíveis próximos passos. Serviços adicionais, quando recomendados, têm escopo e
            valores apresentados separadamente antes de qualquer contratação.
          </p>
          <Link
            to="/contato"
            className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Solicitar atendimento
          </Link>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-7">
          <h2 className="font-display text-2xl font-semibold text-primary">Formas de pagamento</h2>
          <p>O pagamento do diagnóstico é antecipado. As opções disponíveis são informadas no atendimento.</p>
          <h2 className="font-display text-2xl font-semibold text-primary">Importante</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>O diagnóstico não garante aumento de score, aprovação de crédito ou exclusão de registros.</li>
            <li>Qualquer serviço adicional depende de análise individual e aceite prévio do cliente.</li>
            <li>A DTM DESCOMPLICA CRÉDITO presta consultoria e orientação; não é escritório de advocacia.</li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
