import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeadsModule } from "@/components/crm/LeadsModule";
import { ContractsModule } from "@/components/crm/ContractsModule";
import { ProcessesModule } from "@/components/crm/ProcessesModule";
import { MessagesModule } from "@/components/crm/MessagesModule";
import { ReportsModule } from "@/components/crm/ReportsModule";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({
    meta: [
      { title: "CRM | DTM CONSULTORIA FINANCEIRA" },
      { name: "description", content: "Área interna da DTM." },
      { property: "og:title", content: "CRM | DTM CONSULTORIA FINANCEIRA" },
      { property: "og:description", content: "Área interna da DTM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Crm,
});

const TABS = [
  ["leads", "Leads e clientes"],
  ["contratos", "Contratos"],
  ["processos", "Processos"],
  ["mensagens", "Mensagens"],
  ["relatorios", "Relatórios"],
] as const;

function Crm() {
  const { user } = Route.useRouteContext();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("leads");
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/acesso", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="font-display text-lg font-semibold">DTM CONSULTORIA FINANCEIRA · CRM</p>
          <button
            onClick={signOut}
            className="rounded-full border border-primary-foreground/40 px-4 py-1.5 text-sm"
          >
            Sair
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
          {TABS.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`whitespace-nowrap rounded-t-xl px-4 py-2 text-sm font-semibold ${tab === k ? "bg-secondary text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              {l}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-6">
        {tab === "leads" && <LeadsModule userId={user.id} />}
        {tab === "contratos" && <ContractsModule userId={user.id} />}
        {tab === "processos" && <ProcessesModule userId={user.id} />}
        {tab === "mensagens" && <MessagesModule userId={user.id} />}
        {tab === "relatorios" && <ReportsModule />}
      </main>
    </div>
  );
}
