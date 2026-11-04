import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, daysUntil, fmtDate, needsAlert } from "@/lib/crm";
import { Card, ErrorNote, useLeads } from "./shared";
import { useProcesses } from "./ProcessesModule";

export function ReportsModule() {
  const { data: leads = [] } = useLeads();
  const { data: procs = [] } = useProcesses();
  const contracts = useQuery({
    queryKey: ["crm", "contracts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const cs = contracts.data ?? [];
  const signed = cs.filter((c) => c.status === "assinado" || c.status === "arquivado");
  const byMonth = new Map<string, number>();
  for (const l of leads) {
    const k = l.created_at.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) ?? 0) + 1);
  }
  const months = [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);
  const max = Math.max(1, ...months.map((m) => m[1]));
  const rev = (t: string) => signed.filter((c) => c.client_type === t).reduce((s, c) => s + Number(c.amount), 0);
  const upcoming = procs.filter((p) => p.status !== "concluido" && needsAlert(p.expected_date));
  const conv = leads.length ? Math.round((signed.length / leads.length) * 100) : 0;

  const stat = (label: string, value: string) => (
    <div className="rounded-2xl bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-semibold text-primary">{value}</p></div>
  );
  return (
    <div className="space-y-5">
      <ErrorNote error={contracts.error} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stat("Leads", String(leads.length))}
        {stat("Contratos assinados", String(signed.length))}
        {stat("Conversão leads → contratos", `${conv}%`)}
        {stat("Faturamento PF", brl(rev("PF")))}
        {stat("Faturamento PJ", brl(rev("PJ")))}
      </div>
      <Card title="Leads por mês">
        {months.length === 0 ? <p className="text-sm text-muted-foreground">Sem dados.</p> : (
          <ul className="space-y-2 text-sm">
            {months.map(([m, n]) => (
              <li key={m} className="flex items-center gap-3">
                <span className="w-20 text-muted-foreground">{m.slice(5)}/{m.slice(0, 4)}</span>
                <span className="h-3 rounded-full bg-brand-purple" style={{ width: `${(n / max) * 70}%` }} />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Vencimentos próximos (15 dias)">
        {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum vencimento próximo.</p> : (
          <ul className="space-y-1 text-sm">
            {upcoming.map((p) => (
              <li key={p.id}>{leads.find((l) => l.id === p.lead_id)?.full_name ?? "—"} · {fmtDate(p.expected_date)} ({daysUntil(p.expected_date!)} dias)</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">Faturamento considera contratos com status Assinado ou Arquivado.</p>
      </Card>
    </div>
  );
}
