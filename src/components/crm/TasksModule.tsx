import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fmtDate } from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads } from "./shared";

type TaskRow = {
  id: string;
  lead_id: string;
  owner_id: string;
  activity_type: string;
  description: string;
  due_at: string | null;
  created_at: string;
};

const TASK_TYPE = "tarefa";
const DONE_PREFIX = "[CONCLUÍDA] ";

function localDateTime(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TasksModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
  const [filter, setFilter] = useState<"abertas" | "atrasadas" | "concluidas" | "todas">("abertas");
  const [editing, setEditing] = useState<TaskRow | "new" | null>(null);
  const [errorText, setErrorText] = useState("");
  const tasks = useQuery({
    queryKey: ["crm", "tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_activities")
        .select("id, lead_id, owner_id, activity_type, description, due_at, created_at")
        .eq("activity_type", TASK_TYPE)
        .order("due_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as TaskRow[];
    },
  });

  const now = new Date();
  const rows = useMemo(() => {
    const all = tasks.data ?? [];
    return all.filter((task) => {
      const done = task.description.startsWith(DONE_PREFIX);
      const overdue = !done && !!task.due_at && new Date(task.due_at) < now;
      if (filter === "abertas") return !done;
      if (filter === "atrasadas") return overdue;
      if (filter === "concluidas") return done;
      return true;
    });
  }, [tasks.data, filter]);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["crm", "tasks"] });
    void qc.invalidateQueries({ queryKey: ["crm", "history"] });
  };

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const leadId = String(form.get("lead_id") ?? "");
    const description = String(form.get("description") ?? "").trim();
    const due = String(form.get("due_at") ?? "");
    if (!leadId || description.length < 3 || !due) {
      setErrorText("Selecione o cliente, descreva a ação e informe o prazo.");
      return;
    }
    const dueAt = new Date(due).toISOString();
    const result = editing && editing !== "new"
      ? await supabase.from("lead_activities").update({ lead_id: leadId, description, due_at: dueAt }).eq("id", editing.id)
      : await supabase.from("lead_activities").insert({
          lead_id: leadId,
          owner_id: userId,
          activity_type: TASK_TYPE,
          description,
          due_at: dueAt,
        });
    if (result.error) {
      setErrorText(result.error.message);
      return;
    }
    setEditing(null);
    setErrorText("");
    refresh();
  }

  async function toggle(task: TaskRow) {
    const done = task.description.startsWith(DONE_PREFIX);
    const description = done ? task.description.slice(DONE_PREFIX.length) : DONE_PREFIX + task.description;
    const { error } = await supabase.from("lead_activities").update({ description }).eq("id", task.id);
    if (error) setErrorText(error.message);
    else refresh();
  }

  async function remove(task: TaskRow) {
    if (!confirm("Excluir esta tarefa?")) return;
    const { error } = await supabase.from("lead_activities").delete().eq("id", task.id);
    if (error) setErrorText(error.message);
    else refresh();
  }

  const overdueCount = (tasks.data ?? []).filter((t) => t.activity_type === PENDING && t.due_at && new Date(t.due_at) < now).length;
  const openCount = (tasks.data ?? []).filter((t) => !t.description.startsWith(DONE_PREFIX)).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Tarefas abertas</p><p className="mt-1 text-2xl font-semibold text-primary">{openCount}</p></div>
        <div className="rounded-2xl border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Atrasadas</p><p className="mt-1 text-2xl font-semibold text-destructive">{overdueCount}</p></div>
        <div className="rounded-2xl border border-border bg-background p-4"><p className="text-xs text-muted-foreground">Concluídas</p><p className="mt-1 text-2xl font-semibold text-primary">{(tasks.data ?? []).filter((t) => t.description.startsWith(DONE_PREFIX)).length}</p></div>
      </div>
      <Card title="Agenda de tarefas e retornos" actions={<button className={btn} onClick={() => setEditing("new")}>+ Nova tarefa</button>}>
        <div className="mb-4 flex flex-wrap gap-2">
          {([["abertas", "A fazer"], ["atrasadas", "Atrasadas"], ["concluidas", "Concluídas"], ["todas", "Todas"]] as const).map(([value, label]) => (
            <button key={value} className={filter === value ? btn : btnGhost} onClick={() => setFilter(value)}>{label}</button>
          ))}
        </div>
        {editing && (
          <form key={editing === "new" ? "new" : editing.id} onSubmit={save} className="mb-5 grid gap-3 rounded-2xl bg-card p-4 sm:grid-cols-2">
            <Field label="Cliente">
              <select name="lead_id" className={input} defaultValue={editing === "new" ? "" : editing.lead_id} required>
                <option value="">Selecione</option>
                {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.full_name}</option>)}
              </select>
            </Field>
            <Field label="Prazo do retorno">
              <input name="due_at" type="datetime-local" className={input} defaultValue={editing === "new" ? "" : localDateTime(editing.due_at)} required />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Ação objetiva (ex.: ligar para confirmar o envio dos documentos)">
                <input name="description" maxLength={500} className={input} defaultValue={editing === "new" ? "" : editing.description} required />
              </Field>
            </div>
            {errorText && <p className="text-sm text-destructive sm:col-span-2">{errorText}</p>}
            <div className="flex gap-2 sm:col-span-2"><button className={btn}>Salvar tarefa</button><button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancelar</button></div>
          </form>
        )}
        <ErrorNote error={tasks.error} />
        {errorText && !editing && <p className="mb-3 text-sm text-destructive">{errorText}</p>}
        {tasks.isLoading ? <p className="text-sm text-muted-foreground">Carregando tarefas…</p> : rows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma tarefa nesta visualização.</p> : (
          <ul className="space-y-2">
            {rows.map((task) => {
              const lead = leads.find((item) => item.id === task.lead_id);
              const done = task.description.startsWith(DONE_PREFIX);
              const overdue = !done && !!task.due_at && new Date(task.due_at) < now;
              return <li key={task.id} className={`rounded-2xl border p-4 ${overdue ? "border-destructive bg-destructive/5" : "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary">{done ? task.description.slice(DONE_PREFIX.length) : task.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{lead?.full_name ?? "Cliente não localizado"} · {task.due_at ? new Date(task.due_at).toLocaleString("pt-BR") : "Sem prazo"}</p>
                    <p className={`mt-1 text-xs font-semibold ${overdue ? "text-destructive" : "text-muted-foreground"}`}>{done ? "Concluída" : overdue ? "Prazo vencido" : "Pendente"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className={btnGhost} onClick={() => setEditing(task)}>Editar</button>
                    <button className={btn} onClick={() => void toggle(task)}>{done ? "Reabrir" : "Concluir"}</button>
                    <button className="px-2 text-xs text-destructive underline" onClick={() => void remove(task)}>Excluir</button>
                  </div>
                </div>
              </li>;
            })}
          </ul>
        )}
      </Card>
      <p className="text-xs text-muted-foreground">As tarefas ficam vinculadas ao histórico do cliente. Esta tela organiza os prazos; ela não envia notificações automáticas ao celular.</p>
    </div>
  );
}
