import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { seo } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({
  head: () => seo("/privacidade", "Política de privacidade | DTM CONSULTORIA FINANCEIRA", "Como a DTM CONSULTORIA FINANCEIRA coleta, usa e protege seus dados pessoais, conforme a LGPD."),
  component: () => (
    <TextPage eyebrow="LGPD" title="Política de privacidade">
      <h2>Dados coletados</h2><p>Primeiro nome, telefone/WhatsApp, tipo de cadastro (CPF ou CNPJ), valor aproximado da dívida, credor e serviço de interesse, informados voluntariamente no formulário.</p>
      <h2>Finalidade</h2><p>Retornar o contato, conduzir o atendimento solicitado e manter o histórico do relacionamento. Não vendemos seus dados.</p>
      <h2>Base legal</h2><p>Consentimento do titular e execução de procedimentos preliminares a contrato (art. 7º, I e V, da LGPD).</p>
      <h2>Armazenamento e segurança</h2><p>Os dados ficam em ambiente com controle de acesso restrito à equipe autorizada.</p>
      <h2>Seus direitos</h2><p>Você pode pedir acesso, correção ou exclusão dos seus dados, ou revogar o consentimento, pelo nosso WhatsApp.</p>
    </TextPage>
  ),
});
