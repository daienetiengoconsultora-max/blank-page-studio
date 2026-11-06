import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fillTemplate, fmtDate, leadWhatsAppLink, stageLabel } from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads } from "./shared";
import { useProcesses } from "./ProcessesModule";

export function MessagesModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
  const { data: procs = [] } = useProcesses();
  const tpls = useQuery({
    queryKey: ["crm", "templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const [leadId, setLeadId] = useState("");
  const [tplId, setTplId] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("enviada");
  const [info, setInfo] = useState("");
  const [editTpl, setEditTpl] = useState(false);

  const lead = leads.find((l) => l.id === leadId);
  const tpl = tpls.data?.find((t) => t.id === tplId);

  function compose(lId: string, tId: string) {
    const l = leads.find((x) => x.id === lId);
    const t = tpls.data?.find((x) => x.id === tId);
    if (!t) return setText("");
    const p = procs.find((x) => x.lead_id === lId);
    setText(
      fillTemplate(t.body, {
        nome: l?.full_name.split(" ")[0],
        status: l ? stageLabel(l.status) : "",
        data: p?.expected_date ? fmtDate(p.expected_date) : "",
      }),
    );
  }

  async function copy() {
    await navigator.clipboard.writeText(text).catch(() => undefined);
    setInfo("Mensagem copiada. Cole no WhatsApp e depois registre o envio.");
  }

  async function register(nextStatus = status) {
    if (!lead || !text) return setInfo("Escolha cliente e mensagem.");
    const { error } = await supabase.from("message_logs").insert({
      lead_id: lead.id,
      owner_id: userId,
      template_key: tpl?.key ?? null,
      body: text,
      status: nextStatus,
    });
    if (!error) {
      await supabase
        .from("leads")
        .update({ last_contact_at: new Date().toISOString() })
        .eq("id", lead.id);
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        owner_id: userId,
        activity_type: "whatsapp",
        description: `Mensagem (${nextStatus}): ${text.slice(0, 280)}`,
      });
    }
    setInfo(error ? error.message : "Envio registrado no histórico do cliente.");
    void qc.invalidateQueries({ queryKey: ["crm"] });
  }

  async function openWhatsAppAndLog() {
    if (!lead || !text) return setInfo("Escolha cliente e mensagem.");
    await register("enviada");
    window.open(leadWhatsAppLink(lead.phone, text), "_blank", "noopener,noreferrer");
  }

  async function saveTpl() {
    if (!tpl) return;
    await supabase.from("message_templates").update({ body: text }).eq("id", tpl.id);
    setEditTpl(false);
    setInfo("Modelo salvo.");
    void qc.invalidateQueries({ queryKey: ["crm", "templates"] });
  }

  return (
    <Card title="Mensagens">
      <ErrorNote error={tpls.error} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cliente">
          <select
            className={input}
            value={leadId}
            onChange={(e) => {
              setLeadId(e.target.value);
              compose(e.target.value, tplId);
            }}
          >
            <option value="">Escolha</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.full_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Modelo">
          <select
            className={input}
            value={tplId}
            onChange={(e) => {
              setTplId(e.target.value);
              setEditTpl(false);
              compose(leadId, e.target.value);
            }}
          >
            <option value="">Escolha</option>
            {(tpls.data ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {editTpl && (
        <p className="mt-3 text-xs text-muted-foreground">
          Editando o modelo. Use {"{nome} {status} {data}"}.
        </p>
      )}
      <textarea
        className={`${input} mt-3 h-40`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {editTpl ? (
          <>
            <button className={btn} onClick={saveTpl}>
              Salvar modelo
            </button>
            <button
              className={btnGhost}
              onClick={() => {
                setEditTpl(false);
                compose(leadId, tplId);
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className={btn} onClick={copy} disabled={!text}>
              Copiar
            </button>
            {lead && (
              <button className={btnGhost} onClick={() => void openWhatsAppAndLog()} disabled={!text}>
                Abrir WhatsApp e registrar
              </button>
            )}
            <select
              className={`${input} w-40`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Status do envio"
            >
              <option value="copiada">Copiada</option>
              <option value="enviada">Enviada</option>
              <option value="respondida">Respondida</option>
            </select>
            <button className={btnGhost} onClick={() => void register()}>
              Registrar envio
            </button>
            {tpl && (
              <button
                className="text-xs text-brand-purple underline"
                onClick={() => {
                  setText(tpl.body);
                  setEditTpl(true);
                }}
              >
                Editar modelo
              </button>
            )}
          </>
        )}
      </div>
      {info && <p className="mt-2 text-sm text-muted-foreground">{info}</p>}
    </Card>
  );
}
