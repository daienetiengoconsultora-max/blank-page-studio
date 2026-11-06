import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactForm } from "@/components/site/ContactForm";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () =>
    seo(
      "/contato",
      "Fale conosco | DTM Consultoria e Regularização de Crédito",
      "Envie sua mensagem para a DTM Consultoria e Regularização de Crédito ou fale pelo WhatsApp.",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Fale conosco"
        title="Vamos entender sua situação financeira"
        text="Conte sua situação. Retornamos com atenção e sem promessas de resultado."
      />
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  ),
});
