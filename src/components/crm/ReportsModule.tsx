import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, daysUntil, fmtDate, needsAlert, needsFollowUp, stageLabel } from "@/lib/crm";
import { Card, ErrorNote, useLeads } from "./shared";
import { useProcesses } from "./ProcessesModule";

function countBy(items: string[]) {
  const map = new Map<string, number>();
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function ReportsModule() {
  const { data: leads = [] } = useLeads();
  const { data: procs = [] } = useProcesses();
  const contracts = useQuery({
    queryKey: ["crm", "contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const lossActs = useQuery({
    queryKey: ["crm", "loss-reasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_activities")
        .select("description")
        .eq("activity_type", "sistema")
        .ilike("description", "Caso perdido%");
      if (error) throw error;
      return data ?? [];
    },
  });

  const cs = contracts.data ?? [];
  const signed = cs.filter((c) => c.status === "assinado" || c.status === "arquivado");
  const lost = leads.filter((l) => l.status === "nao_fechou");
  const followUps = leads.filter((l) => needsFollowUp(l.last_contact_at, l.status));
  const byMonth = new Map<string, number>();
  for (const l of leads) {
    const k = l.created_at.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) ?? 0) + 1);
  }
  const months = [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);
  const max = Math.max(1, ...months.map((m) => m[1]));
  const rev = (t: string) =>
    signed.filter((c) => c.client_type === t).reduce((s, c) => s + Number(c.amount), 0);
  const upcoming = procs.filter((p) => p.status !== "concluido" && needsAlert(p.expected_date));
  const conv = leads.length ? Math.round((signed.length / leads.length) * 100) : 0;

  const bySource = useMemo(
    () => countBy(leads.map((l) => l.source?.trim() || "Não informada")),
    [leads],
  );
  const byStatus = useMemo(
    () => countBy(leads.map((l) => stageLabel(l.status))),
    [leads],
  );
  const byLoss = useMemo(() => {
    const reasons = (lossActs.data ?? []).map((a) => {
      const m = a.description.match(/Motivo:\s*(.+)$/i);
      return m?.[1]?.trim() || "Outro";
    });
    return countBy(reasons);
  }, [lossActs.data]);

  const stat = (label: string, value: string) => (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-primary">{value}</p>
    </div>
  );

  const bars = (rows: [string, number][], empty: string) =>
    rows.length === 0 ? (
      <p className="text-sm text-muted-foreground">{empty}</p>
    ) : (
      <ul className="space-y-2 text-sm">
        {rows.map(([label, n]) => {
          const width = Math.max(8, (n / Math.max(1, rows[0]![1])) * 70);
          return (
            <li key={label} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-muted-foreground">{label}</span>
              <span className="h-3 rounded-full bg-brand-purple" style={{ width: `${width}%` }} />
              <span>{n}</span>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="space-y-5">
      <ErrorNote error={contracts.error ?? lossActs.error} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stat("Leads", String(leads.length))}
        {stat("Contratos assinados", String(signed.length))}
        {stat("Conversão", `${conv}%`)}
        {stat("Perdidos", String(lost.length))}
        {stat("Follow-up pendente", String(followUps.length))}
        {stat("Faturamento total", brl(signed.reduce((s, c) => s + Number(c.amount), 0)))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {stat("Faturamento PF", brl(rev("PF")))}
        {stat("Faturamento PJ", brl(rev("PJ")))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Leads por origem">{bars(bySource, "Sem dados de origem.")}</Card>
        <Card title="Leads por status">{bars(byStatus, "Sem dados de status.")}</Card>
        <Card title="Motivos de perda">{bars(byLoss, "Nenhum caso perdido com motivo registrado.")}</Card>
        <Card title="Leads por mês">
          {months.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem dados.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {months.map(([m, n]) => (
                <li key={m} className="flex items-center gap-3">
                  <span className="w-20 text-muted-foreground">
                    {m.slice(5)}/{m.slice(0, 4)}
                  </span>
                  <span
                    className="h-3 rounded-full bg-brand-purple"
                    style={{ width: `${(n / max) * 70}%` }}
                  />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <Card title="Vencimentos próximos (15 dias)">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum vencimento próximo.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {upcoming.map((p) => (
              <li key={p.id}>
                {leads.find((l) => l.id === p.lead_id)?.full_name ?? "—"} ·{" "}
                {fmtDate(p.expected_date)} ({daysUntil(p.expected_date!)} dias)
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Faturamento considera contratos com status Assinado ou Arquivado.
        </p>
      </Card>
    </div>
  );
}
