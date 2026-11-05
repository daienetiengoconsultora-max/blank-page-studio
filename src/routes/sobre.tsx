import { createFileRoute, Link } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { COMPANY, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () =>
    seo(
      "/sobre",
      "Sobre nós | DTM Consultoria e Regularização de Crédito",
      "Conheça a DTM: orientação transparente para regularização de nome, rating comercial e bancário e diagnóstico financeiro. 5 anos de atuação e mais de 2.000 diagnósticos.",
    ),
  component: () => (
    <TextPage
      eyebrow="Sobre nós"
      title="Crédito explicado com clareza"
      intro="A DTM Consultoria e Regularização de Crédito existe para traduzir o mundo do crédito em decisões simples e seguras."
    >
      <p>
        Atendemos pessoas físicas e empresas (incluindo MEI e autônomos) que querem entender sua
        situação de crédito, regularizar pendências e se preparar para novas oportunidades — sem
        ilusões e sem pressão.
      </p>

      <h2>Quem somos</h2>
      <p>
        {COMPANY.legalName} · CNPJ {COMPANY.cnpj}<br />
        {COMPANY.address}<br />
        {COMPANY.years} anos de atuação · {COMPANY.diagnoses} diagnósticos realizados
      </p>

      <h2>O que nos diferencia</h2>
      <p>
        A maioria do mercado promete "limpa nome em X dias" ou "score garantido". Nós não. Nosso
        trabalho é organizar a informação, mostrar o que é possível fazer e acompanhar o processo
        com transparência. Quando a medida judicial faz sentido, trabalhamos com advogado parceiro
        habilitado.
      </p>

      <h2>Nossos compromissos</h2>
      <ul>
        <li>Transparência sobre o que pode e o que não pode ser feito</li>
        <li>Nenhuma promessa de aprovação de crédito, aumento garantido de score ou exclusão garantida de dívidas</li>
        <li>Custos e opções explicados antes de qualquer contratação</li>
        <li>Respeito aos seus dados, conforme a LGPD</li>
        <li>Atendimento humano e individualizado</li>
      </ul>

      <h2>Atendimento</h2>
      <p>
        Atendimento digital pelo WhatsApp para todo o Brasil. Você fala com gente de verdade, não
        com robô.
      </p>

      <p className="mt-8">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Falar no WhatsApp
        </a>
        {" "}
        <Link
          to="/"
          hash="diagnostico"
          className="ml-3 inline-block rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
        >
          Fazer diagnóstico
        </Link>
      </p>
    </TextPage>
  ),
});
