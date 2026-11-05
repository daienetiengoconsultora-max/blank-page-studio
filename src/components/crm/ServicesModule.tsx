import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads } from "./shared";

const PREFIX = "DTM_SERVICE:";
const SERVICE_TYPES = ["Limpa Nome", "Score / Escore", "Bacen / SCR", "Rating Comercial", "Rating Bancário", "CCF", "Cadin"] as const;
const SERVICE_STATUSES = ["Diagnóstico", "Aguardando documentos", "Em análise", "Contratado", "Em andamento", "Aguardando retorno", "Concluído", "Cancelado"] as const;

type ServiceStatus = typeof SERVICE_STATUSES[number];
type ServiceData = { service: string; status: ServiceStatus; value: number | null; notes: string };
type ServiceRow = { id: string; lead_id: string; owner_id: string; description: string; due_at: string | null; created_at: string };

function parseService(row: ServiceRow): ServiceData | null {
  if (!row.description.startsWith(PREFIX)) return null;
  try {
    const value = JSON.parse(row.description.slice(PREFIX.length)) as ServiceData;
    if (!value.service || !value.status) return null;
    return value;
  } catch { return null; }
}

export function ServicesModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
  const [filter, setFilter] = useState("Todos");
  const [editing, setEditing] = useState<ServiceRow | "new" | null>(null);
  const [errorText, setErrorText] = useState("");
  const query = useQuery({
    queryKey: ["crm", "dtm-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_activities")
        .select("id, lead_id, owner_id, description, due_at, created_at")
        .eq("activity_type", "sistema")
        .like("description", "DTM_SERVICE:%")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ServiceRow[];
    },
  });
  const rows = useMemo(() => (query.data ?? []).filter((row) => {
    const data = parseService(row);
    return data && (filter === "Todos" || data.service === filter);
  }), [query.data, filter]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const service = String(form.get("service") ?? "");
    const status = String(form.get("status") ?? "") as ServiceStatus;
    const notes = String(form.get("notes") ?? "").trim().slice(0, 1200);
    const valueText = String(form.get("value") ?? "").trim();
    const value = valueText ? Number(valueText.replace(",", ".")) : null;
    const leadId = String(form.get("lead_id") ?? "");
    if (!leadId || !SERVICE_TYPES.includes(service as typeof SERVICE_TYPES[number]) || !SERVICE_STATUSES.includes(status)) {
      setErrorText("Confira o cliente, o serviço e a etapa.");
      return;
    }
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      setErrorText("Informe um valor válido ou deixe o campo vazio.");
      return;
    }
    const payload: ServiceData = { service, status, value, notes };
    const result = editing === "new"
      ? await supabase.from("lead_activities").insert({ lead_id: leadId, owner_id: userId, activity_type: "sistema", description: PREFIX + JSON.stringify(payload) })
      : await supabase.from("lead_activities").update({ lead_id: leadId, description: PREFIX + JSON.stringify(payload) }).eq("id", editing.id);
    if (result.error) { setErrorText(result.error.message); return; }
    setEditing(null);
    setErrorText("");
    void qc.invalidateQueries({ queryKey: ["crm"] });
  }

  async function remove(row: ServiceRow) {
    if (!confirm("Excluir este acompanhamento de serviço?")) return;
    const { error } = await supabase.from("lead_activities").delete().eq("id", row.id);
    if (error) setErrorText(error.message);
    else void qc.invalidateQueries({ queryKey: ["crm"] });
  }

  const counts = SERVICE_STATUSES.map((status) => ({ status, count: (query.data ?? []).filter((r) => parseService(r)?.status === status).length }));
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {counts.filter((x) => x.count > 0).map((x) => <div key={x.status} className="rounded-2xl border border-border bg-background p-4"><p className="text-xs text-muted-foreground">{x.status}</p><p className="mt-1 text-2xl font-semibold text-primary">{x.count}</p></div>)}
    </div>
    <Card title="Serviços DTM por cliente" actions={<button className={btn} onClick={() => setEditing("new")}>+ Registrar serviço</button>}>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className={input + " max-w-sm"} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar serviço">
          <option>Todos</option>{SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {editing && <form key={editing === "new" ? "new" : editing.id} onSubmit={save} className="mb-5 grid gap-3 rounded-2xl bg-card p-4 sm:grid-cols-2">
        <Field label="Cliente"><select name="lead_id" className={input} defaultValue={editing === "new" ? "" : editing.lead_id} required><option value="">Selecione</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}</select></Field>
        <Field label="Serviço"><select name="service" className={input} defaultValue={editing === "new" ? SERVICE_TYPES[0] : parseService(editing)?.service ?? SERVICE_TYPES[0]}>{SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Etapa atual"><select name="status" className={input} defaultValue={editing === "new" ? SERVICE_STATUSES[0] : parseService(editing)?.status ?? SERVICE_STATUSES[0]}>{SERVICE_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Valor combinado (R$) — opcional"><input name="value" type="number" min="0" step="0.01" className={input} defaultValue={editing === "new" ? "" : parseService(editing)?.value ?? ""} /></Field>
        <div className="sm:col-span-2"><Field label="Observações (não inclua senhas nem dados bancários)"><textarea name="notes" rows={3} maxLength={1200} className={input} defaultValue={editing === "new" ? "" : parseService(editing)?.notes ?? ""} /></Field></div>
        {errorText && <p className="text-sm text-destructive sm:col-span-2">{errorText}</p>}
        <div className="flex gap-2 sm:col-span-2"><button className={btn}>Salvar acompanhamento</button><button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancelar</button></div>
      </form>}
      {errorText && !editing && <p className="mb-3 text-sm text-destructive">{errorText}</p>}
      <ErrorNote error={query.error} />
      {query.isLoading ? <p className="text-sm text-muted-foreground">Carregando serviços…</p> : rows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado nesta visualização.</p> : <ul className="space-y-2">{rows.map((row) => {
        const data = parseService(row)!;
        const lead = leads.find((l) => l.id === row.lead_id);
        return <li key={row.id} className="rounded-2xl border border-border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0">
            <p className="font-semibold text-primary">{data.service}</p>
            <p className="text-sm">{lead?.full_name ?? "Cliente não localizado"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{data.status} · {data.value === null ? "Valor não informado" : data.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            {data.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{data.notes}</p>}
          </div><div className="flex gap-2"><button className={btnGhost} onClick={() => setEditing(row)}>Editar</button><button className="px-2 text-xs text-destructive underline" onClick={() => void remove(row)}>Excluir</button></div></div>
        </li>;
      })}</ul>}
    </Card>
    <p className="text-xs text-muted-foreground">Este painel registra o acompanhamento administrativo. Não representa promessa de aprovação, retirada de restrições ou resultado jurídico.</p>
  </div>;
}
