import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/termos")({
  head: () =>
    seo(
      "/termos",
      "Termos de uso | DTM DESCOMPLICA CRÉDITO",
      "Condições de uso do site e dos serviços de orientação da DTM DESCOMPLICA CRÉDITO.",
    ),
  component: () => (
    <TextPage eyebrow="Termos" title="Termos de uso">
      <h2>Natureza do serviço</h2>
      <p>
        A DTM DESCOMPLICA CRÉDITO presta orientação e consultoria. Não somos instituição
        financeira nem birô de crédito.
      </p>
      <h2>Sem garantia de resultado</h2>
      <p>
        Não garantimos aprovação de crédito, aumento de score, alteração de rating ou exclusão de
        dívidas. Os resultados dependem de terceiros e da situação de cada cliente.
      </p>
      <h2>Conteúdo</h2>
      <p>Os artigos do site são informativos e não substituem análise individual.</p>
      <h2>Contratação</h2>
      <p>
        Valores, prazos e escopo de qualquer serviço são apresentados e acordados antes da
        contratação.
      </p>
    </TextPage>
  ),
});
