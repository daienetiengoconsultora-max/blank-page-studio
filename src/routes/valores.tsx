import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { DIAGNOSTIC_DELIVERABLES, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/valores")({
  head: () =>
    seo(
      "/valores",
      "Valores e condições | DTM Consultoria e Regularização de Crédito",
      "Valores claros antes de qualquer contratação. Veja o que você recebe no Diagnóstico Financeiro.",
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
        <div className="dtm-card mx-auto max-w-3xl rounded-3xl p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">
            Diagnóstico financeiro
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
            O que você recebe
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
            {DIAGNOSTIC_DELIVERABLES.map((item) => (
              <li key={item}>
                <span className="text-brand-purple">✓</span> {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            O valor do diagnóstico e de eventuais serviços adicionais é informado no atendimento,
            antes de qualquer contratação. Você decide se deseja prosseguir.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
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
          <p>
            As formas de pagamento disponíveis (como Pix e cartão) e as condições são informadas
            durante o atendimento, antes da contratação.
          </p>
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
