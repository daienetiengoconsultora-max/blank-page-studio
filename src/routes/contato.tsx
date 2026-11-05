import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactForm } from "@/components/site/ContactForm";
import { WHATSAPP_DISPLAY, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () =>
    seo(
      "/contato",
      "Fale conosco | DTM CONSULTORIA FINANCEIRA",
      "Envie sua mensagem para a DTM CONSULTORIA FINANCEIRA ou fale pelo WhatsApp.",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Fale conosco"
        title="Vamos entender sua situação financeira"
        text="Conte sua situação. Retornamos com atenção e sem promessas de resultado."
      />
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <div className="space-y-4 text-sm leading-7">
            <h2 className="font-display text-2xl font-semibold text-primary">
              Prefere o WhatsApp?
            </h2>
            <p>Atendimento pelo número {WHATSAPP_DISPLAY}.</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-accent px-6 py-3 font-semibold text-primary"
            >
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
});
