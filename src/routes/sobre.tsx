import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () =>
    seo(
      "/sobre",
      "Sobre nós | DTM Assessoria e Consultoria em Regularização de Dados de Crédito",
      "Conheça a DTM Assessoria e Consultoria em Regularização de Dados de Crédito: orientação transparente para regularização de nome e diagnóstico financeiro.",
    ),
  component: () => (
    <TextPage
      eyebrow="Sobre nós"
      title="Crédito explicado com clareza"
      intro="A DTM Assessoria e Consultoria em Regularização de Dados de Crédito existe para traduzir o mundo do crédito em decisões simples e seguras."
    >
      <p>
        Atendemos pessoas e empresas que querem entender sua situação de crédito, regularizar
        pendências e se preparar para novas oportunidades.
      </p>
      <h2>Nossos compromissos</h2>
      <p>
        Transparência sobre o que pode e o que não pode ser feito; nenhuma promessa de aprovação de
        crédito, aumento garantido de score ou exclusão garantida de dívidas; respeito aos seus
        dados, conforme a LGPD.
      </p>
      <h2>Atendimento</h2>
      <p>Atendimento digital pelo WhatsApp para todo o Brasil.</p>
    </TextPage>
  ),
});
