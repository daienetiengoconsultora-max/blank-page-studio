import { createFileRoute, Link } from "@tanstack/react-router";
import { TextPage } from "@/components/site/TextPage";
import { RESPONSE_TIME, seo, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/como-funciona")({
  head: () =>
    seo(
      "/como-funciona",
      "Como funciona | DTM Consultoria e Regularização de Crédito",
      "Veja o passo a passo do diagnóstico financeiro da DTM: formulário, contato pelo WhatsApp, análise e orientação clara — sem compromisso inicial.",
    ),
  component: () => (
    <TextPage eyebrow="Como funciona" title="Do primeiro contato à orientação">
      <p>
        O processo foi pensado para ser simples, transparente e sem pressão. Você só decide seguir
        depois de entender o panorama e os custos.
      </p>

      <h2>1. Formulário ou WhatsApp</h2>
      <p>
        Você informa nome, WhatsApp, se é CPF ou CNPJ, valor aproximado e, se souber, o credor.
        Leva menos de um minuto. Também pode mandar mensagem direto no WhatsApp.
      </p>

      <h2>2. Contato humano</h2>
      <p>
        Nossa equipe retorna pelo WhatsApp {RESPONSE_TIME}. Sem robô, sem script engessado.
      </p>

      <h2>3. Análise com autorização</h2>
      <p>
        Com sua autorização, verificamos cadastros de inadimplência, SCR (Bacen) e score. O objetivo
        é montar o cenário real — não só a negativação visível.
      </p>

      <h2>4. Orientação e próximos passos</h2>
      <p>
        Você recebe um panorama claro: o que aparece, o que pesa mais, quais caminhos existem e
        quais custos estão envolvidos. Tudo isso <strong>antes</strong> de qualquer contratação.
        Você decide se quer seguir.
      </p>

      <h2>Importante</h2>
      <p>
        Não prometemos prazo garantido, exclusão de dívida nem aprovação de crédito. Quando a via
        judicial faz sentido, trabalhamos com advogado parceiro e explicamos o que depende do
        processo.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/"
          hash="diagnostico"
          className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Começar meu diagnóstico
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
    </TextPage>
  ),
});
