import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, fmtDate } from "@/lib/crm";
import { Card, ErrorNote, input, useLeads } from "./shared";

type ContractRow = {
  id: string;
  lead_id: string;
  number: string;
  amount: number;
  client_type: string;
  status: string;
  contract_date: string;
  created_at: string;
};

export function FinanceModule() {
  const { data: leads = [] } = useLeads();
  const [period, setPeriod] = useState("todos");
  const contracts = useQuery({
    queryKey: ["crm", "contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("id, lead_id, number, amount, client_type, status, contract_date, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContractRow[];
    },
  });
  const rows = useMemo(
    () =>
      (contracts.data ?? []).filter((c) => {
        if (period === "todos") return true;
        const date = new Date(c.contract_date + "T12:00:00");
        const now = new Date();
        if (period === "mes")
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        if (period === "ano") return date.getFullYear() === now.getFullYear();
        return true;
      }),
    [contracts.data, period],
  );
  const signed = rows.filter((c) => c.status === "assinado" || c.status === "arquivado");
  const pending = rows.filter((c) => c.status === "rascunho" || c.status === "enviado");
  const sum = (items: ContractRow[]) =>
    items.reduce((total, c) => total + Number(c.amount || 0), 0);
  const stat = (label: string, value: string, note: string) => (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <Card
        title="Visão financeira"
        actions={
          <select
            className={input + " w-40"}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Período financeiro"
          >
            <option value="todos">Todo o período</option>
            <option value="mes">Este mês</option>
            <option value="ano">Este ano</option>
          </select>
        }
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Resumo dos contratos cadastrados. Os valores abaixo representam valores contratuais, não
          confirmação de recebimento bancário.
        </p>
        <ErrorNote error={contracts.error} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stat("Contratos assinados", String(signed.length), "Assinados ou arquivados")}
          {stat(
            "Valor contratado",
            brl(sum(signed)),
            "Não equivale necessariamente a caixa recebido",
          )}
          {stat("Em negociação", String(pending.length), "Rascunhos e enviados")}
          {stat("Valor em aberto", brl(sum(pending)), "Valores de contratos ainda não assinados")}
        </div>
      </Card>
      <Card title="Movimentação por contrato">
        {contracts.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum contrato neste período.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-primary">
                    {c.number} · {leads.find((l) => l.id === c.lead_id)?.full_name ?? "Cliente"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(c.contract_date)} · {c.client_type} · {c.status}
                  </p>
                </div>
                <strong>{brl(Number(c.amount))}</strong>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
