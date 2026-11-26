import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ContactForm } from "@/components/site/ContactForm";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () =>
    seo(
      "/contato",
      "Contato DTM Soluções Financeiras | Atendimento para CPF e CNPJ",
      "Entre em contato com a DTM Soluções Financeiras para tirar dúvidas sobre regularização de CPF e CNPJ, score, rating bancário e diagnóstico financeiro.",
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