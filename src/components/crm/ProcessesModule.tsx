import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ALERT_DAYS, PROCESS_STATUS, daysUntil, fmtDate, needsAlert, processLabel } from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads, type Process } from "./shared";

export function useProcesses() {
  return useQuery({
    queryKey: ["crm", "processes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("legal_processes").select("*").order("expected_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });
}

export function ProcessesModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
  const procs = useProcesses();
  const [editing, setEditing] = useState<Process | "new" | null>(null);
  const [err, setErr] = useState("");

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim() || null;
    const row = {
      lead_id: String(f.get("lead_id")),
      documents_received_at: s("documents_received_at"),
      sent_to_lawyer_at: s("sent_to_lawyer_at"),
      status: String(f.get("status")),
      expected_date: s("expected_date"),
      process_number: s("process_number"),
      lawyer_name: s("lawyer_name"),
      notes: s("notes"),
    };
    if (!row.lead_id) return setErr("Escolha o cliente.");
    const res = editing && editing !== "new"
      ? await supabase.from("legal_processes").update(row).eq("id", editing.id)
      : await supabase.from("legal_processes").insert({ ...row, owner_id: userId });
    if (res.error) return setErr(res.error.message);
    setEditing(null); setErr("");
    void qc.invalidateQueries({ queryKey: ["crm"] });
  }

  const p = editing && editing !== "new" ? editing : null;
  return (
    <div className="space-y-5">
      <p className="rounded-2xl border border-accent bg-card p-4 text-sm">
        Prazos são <strong>estimativas</strong> que dependem da análise do advogado e do Poder Judiciário. Não há garantia de suspensão, liminar ou resultado. O alerta aparece {ALERT_DAYS} dias antes da data prevista.
      </p>
      <Card title="Processos" actions={<button className={btn} onClick={() => setEditing("new")}>+ Novo processo</button>}>
        {editing && (
          <form key={p?.id ?? "new"} onSubmit={save} className="mb-5 grid gap-3 rounded-2xl bg-card p-4 sm:grid-cols-2">
            <Field label="Cliente"><select name="lead_id" defaultValue={p?.lead_id ?? ""} className={input}><option value="">Escolha</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}</select></Field>
            <Field label="Status"><select name="status" defaultValue={p?.status ?? "aguardando"} className={input}>{PROCESS_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field>
            <Field label="Documentos recebidos em"><input type="date" name="documents_received_at" defaultValue={p?.documents_received_at ?? ""} className={input} /></Field>
            <Field label="Encaminhado ao advogado em"><input type="date" name="sent_to_lawyer_at" defaultValue={p?.sent_to_lawyer_at ?? ""} className={input} /></Field>
            <Field label="Data prevista (estimativa)"><input type="date" name="expected_date" defaultValue={p?.expected_date ?? ""} className={input} /></Field>
            <Field label="Nº do processo"><input name="process_number" defaultValue={p?.process_number ?? ""} className={input} /></Field>
            <Field label="Advogado(a)"><input name="lawyer_name" defaultValue={p?.lawyer_name ?? ""} className={input} /></Field>
            <div className="sm:col-span-2"><Field label="Observações"><textarea name="notes" rows={3} defaultValue={p?.notes ?? ""} className={input} /></Field></div>
            {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
            <div className="flex gap-2 sm:col-span-2"><button className={btn}>Salvar</button><button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancelar</button></div>
          </form>
        )}
        <ErrorNote error={procs.error} />
        {(procs.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nenhum processo cadastrado.</p>}
        <ul className="space-y-2">
          {(procs.data ?? []).map((x) => {
            const alert = x.status !== "concluido" && needsAlert(x.expected_date);
            const d = x.expected_date ? daysUntil(x.expected_date) : null;
            return (
              <li key={x.id} className={`rounded-2xl border p-4 text-sm ${alert ? "border-destructive bg-destructive/10" : "border-border"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="text-primary">{leads.find((l) => l.id === x.lead_id)?.full_name ?? "—"}</strong> · {processLabel(x.status)}
                    <span className="block text-xs text-muted-foreground">Docs: {fmtDate(x.documents_received_at)} · Advogado: {fmtDate(x.sent_to_lawyer_at)} · Prevista: {fmtDate(x.expected_date)}{x.process_number ? ` · Nº ${x.process_number}` : ""}{x.lawyer_name ? ` · ${x.lawyer_name}` : ""}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {alert && <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">{d! < 0 ? `Vencida há ${-d!} dia(s)` : `Faltam ${d} dia(s)`}</span>}
                    <button className={btnGhost} onClick={() => setEditing(x)}>Editar</button>
                  </span>
                </div>
                {x.notes && <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{x.notes}</p>}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
