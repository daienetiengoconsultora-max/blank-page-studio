import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, fmtDate, needsAlert, stageLabel } from "@/lib/crm";
import { Card, ErrorNote, useLeads } from "./shared";
import { useProcesses } from "./ProcessesModule";

type Props = { onNavigate: (tab: "leads" | "funil" | "tarefas" | "servicos" | "documentos" | "contratos" | "financeiro" | "processos" | "mensagens" | "relatorios") => void };

export function DashboardModule({ onNavigate }: Props) {
  const leadsQuery = useLeads();
  const processesQuery = useProcesses();
  const contractsQuery = useQuery({
    queryKey: ["crm", "contracts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const leads = leadsQuery.data ?? [];
  const processes = processesQuery.data ?? [];
  const contracts = contractsQuery.data ?? [];
  const signed = contracts.filter((c) => c.status === "assinado" || c.status === "arquivado");
  const openLeads = leads.filter((l) => !["concluido", "nao_fechou"].includes(l.status));
  const awaiting = leads.filter((l) => ["novo", "em_atendimento"].includes(l.status));
  const alerts = processes.filter((p) => p.status !== "concluido" && needsAlert(p.expected_date));
  const revenue = signed.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const today = new Date();
  const monthLeads = leads.filter((l) => {
    const d = new Date(l.created_at);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const stat = (label: string, value: string, hint: string) => (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple">Visão geral</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-primary">Painel de controle</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe clientes, contratos e prazos em um só lugar.</p>
        </div>
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => onNavigate("leads")}>+ Cadastrar cliente</button>
      </div>
      <ErrorNote error={leadsQuery.error ?? processesQuery.error ?? contractsQuery.error} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stat("Clientes cadastrados", String(leads.length), `${monthLeads.length} novos neste mês`)}
        {stat("Atendimentos em aberto", String(openLeads.length), `${awaiting.length} aguardando primeiro retorno`)}
        {stat("Contratos assinados", String(signed.length), `${contracts.length} contratos no total`)}
        {stat("Total contratado", brl(revenue), "Com base nos contratos assinados/arquivados")}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Atalhos rápidos">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["leads", "Clientes e leads", "Cadastrar, pesquisar e atualizar atendimentos"],
              ["funil", "Funil de atendimento", "Visualizar clientes por etapa e acompanhar conversões"],
              ["tarefas", "Agenda e tarefas", "Organizar retornos, prazos e pendências por cliente"],
              ["servicos", "Serviços DTM", "Acompanhar Limpa Nome, Score, Bacen e Ratings"],
              ["documentos", "Documentos", "Guardar e consultar arquivos privados dos clientes"],
              ["contratos", "Contratos", "Gerar, revisar e baixar contratos em PDF"],
              ["financeiro", "Financeiro", "Visualizar valores contratados e pendentes"],
              ["processos", "Processos", "Acompanhar etapas e datas estimadas"],
              ["mensagens", "Mensagens", "Preparar WhatsApp e registrar contatos"],
              ["relatorios", "Relatórios", "Consultar indicadores e conversão"],
            ].map(([tab, title, description]) => (
              <button key={tab} onClick={() => onNavigate(tab as Props["onNavigate"] extends (tab: infer T) => void ? T : never)} className="rounded-2xl border border-border p-3 text-left transition hover:border-brand-purple hover:bg-secondary">
                <span className="block text-sm font-semibold text-primary">{title} →</span>
                <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title={`Prazos que merecem atenção (${alerts.length})`}>
          {alerts.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum prazo próximo ou vencido cadastrado.</p> : (
            <ul className="space-y-3">
              {alerts.slice(0, 6).map((p) => {
                const lead = leads.find((l) => l.id === p.lead_id);
                return <li key={p.id} className="flex items-start justify-between gap-3 border-b border-border pb-2 text-sm last:border-0">
                  <span><strong className="block text-primary">{lead?.full_name ?? "Cliente não localizado"}</strong><span className="text-xs text-muted-foreground">{p.process_number ? `Processo ${p.process_number} · ` : ""}Data estimada: {fmtDate(p.expected_date)}</span></span>
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">{p.expected_date && new Date(p.expected_date + "T12:00:00") < new Date(new Date().toDateString()) ? "Atrasado" : "Próximo"}</span>
                </li>;
              })}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Datas são estimativas cadastradas e não representam garantia de andamento ou resultado.</p>
          <button className="mt-3 text-sm font-semibold text-primary underline" onClick={() => onNavigate("processos")}>Abrir processos</button>
        </Card>
      </div>
      <Card title="Clientes que precisam de acompanhamento">
        {awaiting.length === 0 ? <p className="text-sm text-muted-foreground">Não há clientes nas etapas iniciais.</p> : (
          <ul className="divide-y divide-border">
            {awaiting.slice(0, 8).map((l) => <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span><strong className="text-primary">{l.full_name}</strong><span className="block text-xs text-muted-foreground">{l.phone} · {l.client_type}</span></span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand-purple">{stageLabel(l.status)}</span>
            </li>)}
          </ul>
        )}
        <button className="mt-3 text-sm font-semibold text-primary underline" onClick={() => onNavigate("leads")}>Ver todos os clientes</button>
      </Card>
    </div>
  );
}
