import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { seo } from "@/lib/site";
import { PRICES, brl } from "@/lib/crm";

export const Route = createFileRoute("/valores")({
  head: () =>
    seo(
      "/valores",
      "Valores e condições | DTM CONSULTORIA FINANCEIRA",
      "Valores informativos da DTM: R$ 850 para pessoa física e R$ 950 para pessoa jurídica, à vista ou no cartão.",
    ),
  component: Valores,
});

function Valores() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Valores e condições"
        title="Transparência desde o primeiro contato"
        text="Valores informativos. As condições definitivas constam no contrato, revisado pelo advogado parceiro."
      />
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {(
            [
              ["Pessoa física", "CPF", PRICES.PF],
              ["Pessoa jurídica", "CNPJ", PRICES.PJ],
            ] as const
          ).map(([t, doc, v]) => (
            <div key={doc} className="dtm-card rounded-3xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">
                {doc}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-primary">{t}</h2>
              <p className="mt-4 font-display text-4xl font-semibold text-primary">{brl(v)}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-4xl space-y-4 text-sm leading-7">
          <h2 className="font-display text-2xl font-semibold text-primary">Formas de pagamento</h2>
          <p>
            À vista ou no cartão de crédito. No cartão, os juros da máquina ficam por conta do
            cliente.
          </p>
          <h2 className="font-display text-2xl font-semibold text-primary">Importante</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Os valores referem-se aos honorários da consultoria. A inclusão ou não de custas
              processuais é definida no contrato.
            </li>
            <li>
              Prazos informados são estimativas que dependem da análise do advogado parceiro e do
              Poder Judiciário.
            </li>
            <li>
              Não há garantia de suspensão, liminar, exclusão de registros ou aprovação de crédito.
            </li>
            <li>A DTM CONSULTORIA FINANCEIRA não é escritório de advocacia.</li>
          </ul>
          <Link
            to="/contato"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Fale conosco
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
