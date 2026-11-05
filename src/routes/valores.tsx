import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { DIAGNOSTIC_PRICE, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/valores")({
  head: () =>
    seo(
      "/valores",
      "Valores e condições | DTM Consultoria e Regularização de Crédito",
      "Diagnóstico Financeiro a partir de R$ 24,99. Valores claros antes de qualquer contratação.",
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
          <p className="mt-6 font-display text-4xl font-semibold text-brand-purple">
            {DIAGNOSTIC_PRICE}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            O diagnóstico reúne informações de birôs, SCR e score para você entender o cenário
            completo e decidir os próximos passos com segurança. Serviços adicionais, quando
            recomendados, têm escopo e valores apresentados separadamente antes de qualquer
            contratação.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              hash="diagnostico"
              className="inline-block rounded-full bg-brand-spectrum px-6 py-3 text-sm font-semibold text-white"
            >
              Solicitar diagnóstico
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-7">
          <h2 className="font-display text-2xl font-semibold text-primary">Formas de pagamento</h2>
          <p>As formas de pagamento disponíveis e as condições são informadas durante o atendimento, antes da contratação.</p>
          <h2 className="font-display text-2xl font-semibold text-primary">Importante</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>O diagnóstico não garante aumento de score, aprovação de crédito ou exclusão de registros.</li>
            <li>Qualquer serviço adicional depende de análise individual e aceite prévio do cliente.</li>
            <li>A DTM Consultoria e Regularização de Crédito presta consultoria e orientação; não é escritório de advocacia.</li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
