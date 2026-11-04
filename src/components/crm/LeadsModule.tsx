import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_STAGES, fmtDate, stageLabel } from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads, type Lead } from "./shared";

export function LeadsModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [], error, isLoading } = useLeads();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          (!stage || l.status === stage) &&
          (!type || l.client_type === type) &&
          (!q ||
            `${l.full_name} ${l.phone} ${l.email ?? ""} ${l.cpf_cnpj ?? ""}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [leads, q, stage, type],
  );
  const current = leads.find((l) => l.id === selected) ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <Card
        title={`Leads e clientes (${filtered.length})`}
        actions={
          <button
            className={btn}
            onClick={() => {
              setCreating(true);
              setSelected(null);
            }}
          >
            + Novo cliente
          </button>
        }
      >
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <input
            className={input}
            placeholder="Buscar nome, telefone, doc."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className={input}
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            aria-label="Filtrar etapa"
          >
            <option value="">Todas as etapas</option>
            {LEAD_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filtrar tipo"
          >
            <option value="">PF e PJ</option>
            <option value="PF">PF</option>
            <option value="PJ">PJ</option>
          </select>
        </div>
        <ErrorNote error={error} />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => {
                    setSelected(l.id);
                    setCreating(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-2 py-3 text-left text-sm hover:bg-secondary ${selected === l.id ? "bg-secondary" : ""}`}
                >
                  <span>
                    <span className="font-semibold text-primary">{l.full_name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {l.client_type} · {l.phone} · {l.source ?? "—"} · {fmtDate(l.created_at)}
                    </span>
                  </span>
                  <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-brand-purple">
                    {stageLabel(l.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {creating && (
        <LeadForm
          userId={userId}
          onDone={(id) => {
            setCreating(false);
            setSelected(id);
            void qc.invalidateQueries({ queryKey: ["crm"] });
          }}
        />
      )}
      {current && <LeadDetail key={current.id} lead={current} userId={userId} />}
    </div>
  );
}

function LeadForm({
  userId,
  lead,
  onDone,
}: {
  userId: string;
  lead?: Lead;
  onDone: (id: string) => void;
}) {
  const [err, setErr] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const row = {
      full_name: String(f.get("full_name") ?? "").trim(),
      client_type: String(f.get("client_type")),
      cpf_cnpj: String(f.get("cpf_cnpj") ?? "").trim() || null,
      address: String(f.get("address") ?? "").trim() || null,
      phone: String(f.get("phone") ?? "").trim(),
      email: String(f.get("email") ?? "").trim() || null,
      source: String(f.get("source") ?? "").trim() || null,
    };
    if (row.full_name.length < 2 || row.phone.length < 8) return setErr("Informe nome e telefone.");
    const res = lead
      ? await supabase.from("leads").update(row).eq("id", lead.id).select("id").single()
      : await supabase
          .from("leads")
          .insert({ ...row, owner_id: userId, status: "novo" })
          .select("id")
          .single();
    if (res.error) return setErr(res.error.message);
    onDone(res.data.id);
  }
  return (
    <Card title={lead ? "Editar dados" : "Novo cliente"}>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <Field label="Nome / Razão social">
          <input name="full_name" defaultValue={lead?.full_name} className={input} required />
        </Field>
        <Field label="Tipo">
          <select name="client_type" defaultValue={lead?.client_type ?? "PF"} className={input}>
            <option value="PF">PF</option>
            <option value="PJ">PJ</option>
          </select>
        </Field>
        <Field label="CPF / CNPJ">
          <input name="cpf_cnpj" defaultValue={lead?.cpf_cnpj ?? ""} className={input} />
        </Field>
        <Field label="Telefone">
          <input name="phone" defaultValue={lead?.phone} className={input} required />
        </Field>
        <Field label="E-mail">
          <input name="email" type="email" defaultValue={lead?.email ?? ""} className={input} />
        </Field>
        <Field label="Origem">
          <input name="source" defaultValue={lead?.source ?? "Indicação"} className={input} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Endereço">
            <input name="address" defaultValue={lead?.address ?? ""} className={input} />
          </Field>
        </div>
        {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
        <button className={`${btn} sm:col-span-2`}>Salvar</button>
      </form>
    </Card>
  );
}

function LeadDetail({ lead, userId }: { lead: Lead; userId: string }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const history = useQuery({
    queryKey: ["crm", "history", lead.id],
    queryFn: async () => {
      const [a, m] = await Promise.all([
        supabase
          .from("lead_activities")
          .select("id, activity_type, description, created_at")
          .eq("lead_id", lead.id),
        supabase
          .from("message_logs")
          .select("id, template_key, status, body, created_at")
          .eq("lead_id", lead.id),
      ]);
      if (a.error) throw a.error;
      if (m.error) throw m.error;
      return [
        ...a.data.map((x) => ({
          id: x.id,
          kind: x.activity_type,
          text: x.description,
          at: x.created_at,
        })),
        ...m.data.map((x) => ({
          id: x.id,
          kind: `mensagem (${x.status})`,
          text: x.body,
          at: x.created_at,
        })),
      ].sort((x, y) => y.at.localeCompare(x.at));
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["crm"] });

  async function log(type: string, description: string) {
    await supabase
      .from("lead_activities")
      .insert({ lead_id: lead.id, owner_id: userId, activity_type: type, description });
  }
  async function changeStage(status: string) {
    const { error } = await supabase
      .from("leads")
      .update({ status, last_contact_at: new Date().toISOString() })
      .eq("id", lead.id);
    if (!error) await log("sistema", `Etapa alterada para: ${stageLabel(status)}`);
    void refresh();
  }
  async function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const t = String(new FormData(form).get("note") ?? "").trim();
    if (!t) return;
    await log("nota", t.slice(0, 2000));
    form.reset();
    void refresh();
  }
  async function remove() {
    if (
      !confirm(
        `Excluir ${lead.full_name}? Contratos, processos e histórico deste cliente também serão excluídos.`,
      )
    )
      return;
    await supabase.from("leads").delete().eq("id", lead.id);
    void refresh();
  }

  if (editing)
    return (
      <LeadForm
        userId={userId}
        lead={lead}
        onDone={() => {
          setEditing(false);
          void refresh();
        }}
      />
    );
  return (
    <Card
      title={lead.full_name}
      actions={
        <div className="flex gap-2">
          <button className={btnGhost} onClick={() => setEditing(true)}>
            Editar
          </button>
          <button className="text-xs text-destructive underline" onClick={remove}>
            Excluir
          </button>
        </div>
      }
    >
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Tipo</dt>
        <dd>{lead.client_type}</dd>
        <dt className="text-muted-foreground">CPF/CNPJ</dt>
        <dd>{lead.cpf_cnpj ?? "—"}</dd>
        <dt className="text-muted-foreground">Telefone</dt>
        <dd>{lead.phone}</dd>
        <dt className="text-muted-foreground">E-mail</dt>
        <dd className="break-all">{lead.email ?? "—"}</dd>
        <dt className="text-muted-foreground">Endereço</dt>
        <dd>{lead.address ?? "—"}</dd>
        <dt className="text-muted-foreground">Origem</dt>
        <dd>{lead.source ?? "—"}</dd>
      </dl>
      {lead.notes && <p className="mt-3 rounded-xl bg-card p-3 text-sm">Mensagem: {lead.notes}</p>}
      <div className="mt-4">
        <Field label="Etapa">
          <select
            className={input}
            value={lead.status}
            onChange={(e) => void changeStage(e.target.value)}
          >
            {LEAD_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            {!LEAD_STAGES.some((s) => s.value === lead.status) && (
              <option value={lead.status}>{lead.status}</option>
            )}
          </select>
        </Field>
      </div>
      <form onSubmit={addNote} className="mt-4 flex gap-2">
        <input name="note" className={input} placeholder="Adicionar nota" maxLength={2000} />
        <button className={btn}>Salvar</button>
      </form>
      <h3 className="mt-5 text-sm font-semibold text-primary">Histórico</h3>
      <ErrorNote error={history.error} />
      <ul className="mt-2 max-h-80 space-y-2 overflow-auto text-sm">
        {(history.data ?? []).map((h) => (
          <li key={h.id} className="rounded-xl bg-card p-3">
            <span className="text-xs text-muted-foreground">
              {new Date(h.at).toLocaleString("pt-BR")} · {h.kind}
            </span>
            <p className="whitespace-pre-wrap">{h.text}</p>
          </li>
        ))}
        {history.data?.length === 0 && <li className="text-muted-foreground">Sem registros.</li>}
      </ul>
    </Card>
  );
}
