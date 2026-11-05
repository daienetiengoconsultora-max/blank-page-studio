import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DashboardModule = lazy(() => import("@/components/crm/DashboardModule").then((m) => ({ default: m.DashboardModule })));
const LeadsModule = lazy(() => import("@/components/crm/LeadsModule").then((m) => ({ default: m.LeadsModule })));
const ContractsModule = lazy(() => import("@/components/crm/ContractsModule").then((m) => ({ default: m.ContractsModule })));
const ProcessesModule = lazy(() => import("@/components/crm/ProcessesModule").then((m) => ({ default: m.ProcessesModule })));
const MessagesModule = lazy(() => import("@/components/crm/MessagesModule").then((m) => ({ default: m.MessagesModule })));
const ReportsModule = lazy(() => import("@/components/crm/ReportsModule").then((m) => ({ default: m.ReportsModule })));
const TasksModule = lazy(() => import("@/components/crm/TasksModule").then((m) => ({ default: m.TasksModule })));
const ServicesModule = lazy(() => import("@/components/crm/ServicesModule").then((m) => ({ default: m.ServicesModule })));
const FunnelModule = lazy(() => import("@/components/crm/FunnelModule").then((m) => ({ default: m.FunnelModule })));
const DocumentsModule = lazy(() => import("@/components/crm/DocumentsModule").then((m) => ({ default: m.DocumentsModule })));
const FinanceModule = lazy(() => import("@/components/crm/FinanceModule").then((m) => ({ default: m.FinanceModule })));

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({
    meta: [
      { title: "CRM | DTM DESCOMPLICA CRÉDITO" },
      { name: "description", content: "Área administrativa da DTM Descomplica Crédito." },
      { property: "og:title", content: "CRM | DTM DESCOMPLICA CRÉDITO" },
      { property: "og:description", content: "Área administrativa da DTM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Crm,
});

const TABS = [
  ["painel", "Painel"],
  ["leads", "Leads e clientes"],
  ["funil", "Funil"],
  ["tarefas", "Agenda e tarefas"],
  ["servicos", "Serviços DTM"],
  ["documentos", "Documentos"],
  ["contratos", "Contratos"],
  ["financeiro", "Financeiro"],
  ["processos", "Processos"],
  ["mensagens", "Mensagens"],
  ["relatorios", "Relatórios"],
] as const;

type Tab = (typeof TABS)[number][0];

function Crm() {
  const { user } = Route.useRouteContext();
  const [tab, setTab] = useState<Tab>("painel");
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
          <p className="font-display text-lg font-semibold">DTM DESCOMPLICA CRÉDITO · CRM</p>
          <button
            onClick={signOut}
            className="rounded-full border border-primary-foreground/40 px-4 py-1.5 text-sm"
          >
            Sair
          </button>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-3 sm:hidden">
          <label className="sr-only" htmlFor="crm-mobile-navigation">Abrir módulo</label>
          <select
            id="crm-mobile-navigation"
            value={tab}
            onChange={(event) => setTab(event.target.value as Tab)}
            className="min-h-11 w-full rounded-xl border border-primary-foreground/30 bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            {TABS.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <nav className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-5 sm:flex" aria-label="Navegação do CRM">
          {TABS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              aria-current={tab === k ? "page" : undefined}
              className={`min-h-11 whitespace-nowrap rounded-t-xl px-4 py-2 text-sm font-semibold ${tab === k ? "bg-secondary text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-6">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">Abrindo módulo…</div>}>
          {tab === "painel" && <DashboardModule onNavigate={setTab} />}
          {tab === "leads" && <LeadsModule userId={user.id} />}
          {tab === "funil" && <FunnelModule />}
          {tab === "tarefas" && <TasksModule userId={user.id} />}
          {tab === "servicos" && <ServicesModule userId={user.id} />}
          {tab === "documentos" && <DocumentsModule userId={user.id} />}
          {tab === "contratos" && <ContractsModule userId={user.id} />}
          {tab === "financeiro" && <FinanceModule />}
          {tab === "processos" && <ProcessesModule userId={user.id} />}
          {tab === "mensagens" && <MessagesModule userId={user.id} />}
          {tab === "relatorios" && <ReportsModule />}
        </Suspense>
      </main>
    </div>
  );
}
