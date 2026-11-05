import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/valores")({
  head: () =>
    seo(
      "/valores",
      "Valores e condições | DTM Consultoria Financeira",
      "Conheça como funciona a apresentação de valores e condições dos serviços da DTM Consultoria Financeira.",
    ),
  component: Valores,
});

function Valores() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Valores e condições"
        title="Valores claros antes de contratar"
        text="Cada atendimento começa pela compreensão da sua necessidade. Os valores são informados antes de qualquer contratação."
      />
      <section className="px-5 py-16">
        <div className="dtm-card mx-auto max-w-3xl rounded-3xl p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">
            Diagnóstico financeiro
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
            Análise inicial da sua situação
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            O diagnóstico reúne informações relevantes para entender seu cenário e indicar possíveis
            próximos passos. Serviços adicionais, quando recomendados, têm escopo e valores
            apresentados separadamente antes de qualquer contratação.
          </p>
          <Link
            to="/contato"
            className="mt-7 inline-block rounded-full bg-brand-spectrum px-6 py-3 text-sm font-semibold text-white"
          >
            Solicitar atendimento
          </Link>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-7">
          <h2 className="font-display text-2xl font-semibold text-primary">Formas de pagamento</h2>
          <p>
            As formas de pagamento disponíveis e as condições são informadas durante o atendimento,
            antes da contratação.
          </p>
          <h2 className="font-display text-2xl font-semibold text-primary">Importante</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              O diagnóstico não garante aumento de score, aprovação de crédito ou exclusão de
              registros.
            </li>
            <li>
              Qualquer serviço adicional depende de análise individual e aceite prévio do cliente.
            </li>
            <li>
              A DTM CONSULTORIA FINANCEIRA presta consultoria e orientação; não é escritório de
              advocacia.
            </li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
