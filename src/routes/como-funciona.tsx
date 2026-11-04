import { createFileRoute, Link } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/como-funciona")({
  head: () =>
    seo(
      "/como-funciona",
      "Como funciona | DTM CONSULTORIA FINANCEIRA",
      "Veja o passo a passo do diagnóstico financeiro da DTM: formulário, contato pelo WhatsApp, análise e orientação.",
    ),
  component: () => (
    <TextPage eyebrow="Como funciona" title="Do primeiro contato à orientação">
      <h2>1. Formulário</h2>
      <p>
        Você informa nome, WhatsApp, tipo de cadastro, valor aproximado e credor. Leva menos de um
        minuto.
      </p>
      <h2>2. Contato</h2>
      <p>Nossa equipe retorna pelo WhatsApp para entender melhor o seu caso.</p>
      <h2>3. Análise</h2>
      <p>Com sua autorização, verificamos cadastros de inadimplência, SCR e score.</p>
      <h2>4. Orientação</h2>
      <p>
        Você recebe um panorama claro e as opções possíveis, com custos e prazos explicados antes de
        qualquer contratação.
      </p>
      <Link
        to="/"
        hash="diagnostico"
        className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Começar meu diagnóstico
      </Link>
    </TextPage>
  ),
});
