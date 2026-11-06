import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FOLLOWUP_DAYS,
  LEAD_SOURCES,
  LEAD_STAGES,
  LOSS_REASONS,
  fmtDate,
  leadWhatsAppLink,
  lossReasonLabel,
  needsFollowUp,
  stageLabel,
} from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads, type Lead } from "./shared";

export function LeadsModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [], error, isLoading } = useLeads();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [type, setType] = useState("");
  const [source, setSource] = useState("");
  const [onlyFollowUp, setOnlyFollowUp] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const followUpCount = useMemo(
    () => leads.filter((l) => needsFollowUp(l.last_contact_at, l.status)).length,
    [leads],
  );

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          (!stage || l.status === stage) &&
          (!type || l.client_type === type) &&
          (!source || (l.source ?? "") === source) &&
          (!onlyFollowUp || needsFollowUp(l.last_contact_at, l.status)) &&
          (!q ||
            `${l.full_name} ${l.phone} ${l.email ?? ""} ${l.cpf_cnpj ?? ""} ${l.source ?? ""}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [leads, q, stage, type, source, onlyFollowUp],
  );
  const current = leads.find((l) => l.id === selected) ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <Card
        title={`Leads e clientes (${filtered.length})`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {followUpCount > 0 && (
              <button
                className={`${btnGhost} border-brand-rose text-brand-rose`}
                onClick={() => setOnlyFollowUp((v) => !v)}
              >
                {onlyFollowUp ? "Ver todos" : `Follow-up (${followUpCount})`}
              </button>
            )}
            <button
              className={btn}
              onClick={() => {
                setCreating(true);
                setSelected(null);
              }}
            >
              + Novo cliente
            </button>
          </div>
        }
      >
        <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
          <select
            className={input}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            aria-label="Filtrar origem"
          >
            <option value="">Todas as origens</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {onlyFollowUp && (
          <p className="mb-3 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
            Mostrando clientes sem contato há {FOLLOWUP_DAYS}+ dias (ou sem nenhum contato
            registrado).
          </p>
        )}
        <ErrorNote error={error} />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((l) => {
              const follow = needsFollowUp(l.last_contact_at, l.status);
              return (
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
                        {follow ? " · precisa follow-up" : ""}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-brand-purple">
                        {stageLabel(l.status)}
                      </span>
                      {follow && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-rose">
                          Follow-up
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
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
          <select name="source" defaultValue={lead?.source ?? "Site"} className={input}>
            {LEAD_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
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
  const [lossReason, setLossReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const history = useQuery({
    queryKey: ["crm", "history", lead.id],
    queryFn: async () => {
      const [a, m] = await Promise.all([
        supabase
          .from("lead_activities")
          .select("id, activity_type, description, due_at, created_at")
          .eq("lead_id", lead.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("message_logs")
          .select("id, template_key, status, body, created_at")
          .eq("lead_id", lead.id)
          .order("created_at", { ascending: false }),
      ]);
      if (a.error) throw a.error;
      if (m.error) throw m.error;
      return [
        ...a.data.map((x) => ({
          id: x.id,
          kind: x.description.startsWith("DTM_SERVICE:")
            ? "Serviço DTM"
            : x.activity_type,
          text: (() => {
            if (!x.description.startsWith("DTM_SERVICE:")) return x.description;
            try {
              const service = JSON.parse(x.description.slice("DTM_SERVICE:".length)) as {
                service?: string;
                status?: string;
                notes?: string;
              };
              return [service.service, service.status, service.notes].filter(Boolean).join(" · ");
            } catch {
              return "Registro de serviço DTM";
            }
          })(),
          due: x.due_at,
          at: x.created_at,
        })),
        ...m.data.map((x) => ({
          id: x.id,
          kind: `mensagem (${x.status})`,
          text: x.body,
          due: null as string | null,
          at: x.created_at,
        })),
      ].sort((x, y) => y.at.localeCompare(x.at));
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["crm"] });

  async function log(type: string, description: string, dueAt?: string | null) {
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      owner_id: userId,
      activity_type: type,
      description,
      due_at: dueAt ?? null,
    });
  }

  async function changeStage(status: string, reason?: string) {
    const { error } = await supabase
      .from("leads")
      .update({ status, last_contact_at: new Date().toISOString() })
      .eq("id", lead.id);
    if (error) return;
    if (status === "nao_fechou" && reason) {
      await log("sistema", `Caso perdido · Motivo: ${lossReasonLabel(reason)}`);
    } else {
      await log("sistema", `Etapa alterada para: ${stageLabel(status)}`);
    }
    setPendingStatus(null);
    setLossReason("");
    void refresh();
  }

  function onStageChange(status: string) {
    if (status === "nao_fechou") {
      setPendingStatus(status);
      return;
    }
    void changeStage(status);
  }

  async function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const t = String(new FormData(form).get("note") ?? "").trim();
    if (!t) return;
    await log("nota", t.slice(0, 2000));
    await supabase
      .from("leads")
      .update({ last_contact_at: new Date().toISOString() })
      .eq("id", lead.id);
    form.reset();
    void refresh();
  }

  async function scheduleFollowUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const when = String(f.get("due") ?? "");
    const note = String(f.get("follow_note") ?? "").trim() || "Follow-up agendado";
    if (!when) return;
    await log("follow_up", note.slice(0, 2000), `${when}T12:00:00`);
    form.reset();
    void refresh();
  }

  async function openWhatsApp() {
    const text = `Olá, ${lead.full_name.split(" ")[0]}! Aqui é da DTM Consultoria.`;
    const url = leadWhatsAppLink(lead.phone, text);
    await log("whatsapp", "Contato via WhatsApp iniciado");
    await supabase
      .from("leads")
      .update({ last_contact_at: new Date().toISOString() })
      .eq("id", lead.id);
    void refresh();
    window.open(url, "_blank", "noopener,noreferrer");
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

  const follow = needsFollowUp(lead.last_contact_at, lead.status);

  return (
    <Card
      title={lead.full_name}
      actions={
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={() => void openWhatsApp()}>
            WhatsApp
          </button>
          <button className={btnGhost} onClick={() => setEditing(true)}>
            Editar
          </button>
          <button className="text-xs text-destructive underline" onClick={remove}>
            Excluir
          </button>
        </div>
      }
    >
      {follow && (
        <p className="mb-3 rounded-xl border border-brand-rose/40 bg-secondary px-3 py-2 text-xs font-medium text-brand-rose">
          Este cliente precisa de follow-up (sem contato há {FOLLOWUP_DAYS}+ dias).
        </p>
      )}

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
        <dt className="text-muted-foreground">Último contato</dt>
        <dd>{lead.last_contact_at ? new Date(lead.last_contact_at).toLocaleString("pt-BR") : "—"}</dd>
      </dl>

      {lead.notes && <p className="mt-3 rounded-xl bg-card p-3 text-sm">Mensagem: {lead.notes}</p>}

      <div className="mt-4">
        <Field label="Status do caso">
          <select
            className={input}
            value={lead.status}
            onChange={(e) => onStageChange(e.target.value)}
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

      {pendingStatus === "nao_fechou" && (
        <div className="mt-3 rounded-2xl border border-border bg-secondary p-4">
          <p className="text-sm font-semibold text-primary">Motivo da perda</p>
          <select
            className={`${input} mt-2`}
            value={lossReason}
            onChange={(e) => setLossReason(e.target.value)}
          >
            <option value="">Selecione o motivo</option>
            {LOSS_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="mt-3 flex gap-2">
            <button
              className={btn}
              disabled={!lossReason}
              onClick={() => void changeStage("nao_fechou", lossReason)}
            >
              Confirmar perda
            </button>
            <button className={btnGhost} onClick={() => setPendingStatus(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <form onSubmit={addNote} className="mt-4 flex gap-2">
        <input name="note" className={input} placeholder="Adicionar nota na timeline" maxLength={2000} />
        <button className={btn}>Salvar</button>
      </form>

      <form onSubmit={scheduleFollowUp} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
        <input name="due" type="date" className={input} required aria-label="Data do follow-up" />
        <input
          name="follow_note"
          className={input}
          placeholder="Lembrete de follow-up"
          maxLength={500}
        />
        <button className={btnGhost}>Agendar</button>
      </form>

      <h3 className="mt-5 text-sm font-semibold text-primary">Timeline do cliente</h3>
      <ErrorNote error={history.error} />
      <ul className="mt-2 max-h-96 space-y-2 overflow-auto text-sm">
        {(history.data ?? []).map((h) => (
          <li key={h.id} className="rounded-xl bg-card p-3">
            <span className="text-xs text-muted-foreground">
              {new Date(h.at).toLocaleString("pt-BR")} · {h.kind}
              {h.due ? ` · agendado para ${fmtDate(h.due)}` : ""}
            </span>
            <p className="whitespace-pre-wrap">{h.text}</p>
          </li>
        ))}
        {history.data?.length === 0 && <li className="text-muted-foreground">Sem registros.</li>}
      </ul>
    </Card>
  );
}
