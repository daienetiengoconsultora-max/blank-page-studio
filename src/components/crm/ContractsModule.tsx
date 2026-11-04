import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CONTRACT_STATUS, brl, fillTemplate, fmtDate, priceFor } from "@/lib/crm";
import {
  Card,
  ErrorNote,
  Field,
  btn,
  btnGhost,
  input,
  useLeads,
  type Contract,
  type Lead,
} from "./shared";

function varsFor(lead: Lead, c: { number: string; amount: number; contract_date: string }) {
  return {
    nome: lead.full_name,
    tipo_documento: lead.client_type === "PJ" ? "CNPJ" : "CPF",
    documento: lead.cpf_cnpj ?? "",
    endereco: lead.address ?? "",
    telefone: lead.phone,
    email: lead.email ?? "",
    valor: c.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
    numero: c.number,
    data: fmtDate(c.contract_date),
  };
}

async function downloadPdf(c: Contract, lead: Lead | undefined) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const text = lead ? fillTemplate(c.body, varsFor(lead, c)) : c.body;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const lines = doc.splitTextToSize(text, 180) as string[];
  let y = 18;
  for (const line of lines) {
    if (y > 282) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, 15, y);
    y += 5.2;
  }
  doc.save(`${c.number}.pdf`);
}

export function ContractsModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
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
  const template = useQuery({
    queryKey: ["crm", "contract-template"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_templates")
        .select("*")
        .order("created_at")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [leadId, setLeadId] = useState("");
  const [editingTpl, setEditingTpl] = useState(false);
  const [tplText, setTplText] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["crm"] });

  async function create() {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || !template.data) return setMsg("Escolha um cliente.");
    const { error } = await supabase.from("contracts").insert({
      lead_id: lead.id,
      owner_id: userId,
      client_type: lead.client_type === "PJ" ? "PJ" : "PF",
      amount: priceFor(lead.client_type),
      body: template.data.body,
    });
    setMsg(error ? error.message : "Contrato criado. Revise o texto antes de enviar.");
    void refresh();
  }
  async function saveTpl() {
    if (!template.data) return;
    await supabase.from("contract_templates").update({ body: tplText }).eq("id", template.data.id);
    setEditingTpl(false);
    void refresh();
  }
  async function update(
    id: string,
    patch: Partial<Pick<Contract, "status" | "amount" | "body" | "contract_date">>,
  ) {
    const { error } = await supabase.from("contracts").update(patch).eq("id", id);
    if (error) setMsg(error.message);
    void refresh();
  }

  return (
    <div className="space-y-5">
      <p className="rounded-2xl border border-accent bg-card p-4 text-sm">
        Modelo de contrato é uma <strong>minuta sujeita à revisão do advogado parceiro</strong>. Não
        utilize como versão definitiva sem essa validação.
      </p>
      <Card title="Novo contrato">
        <div className="flex flex-wrap gap-2">
          <select
            className={`${input} max-w-sm`}
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            aria-label="Cliente"
          >
            <option value="">Escolha o cliente</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.full_name} ({l.client_type} · {brl(priceFor(l.client_type))})
              </option>
            ))}
          </select>
          <button className={btn} onClick={create}>
            Gerar contrato
          </button>
          <button
            className={btnGhost}
            onClick={() => {
              setTplText(template.data?.body ?? "");
              setEditingTpl(!editingTpl);
            }}
          >
            Editar modelo
          </button>
        </div>
        {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
        {editingTpl && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              Campos:{" "}
              {
                "{nome} {tipo_documento} {documento} {endereco} {telefone} {email} {valor} {numero} {data}"
              }
            </p>
            <textarea
              className={`${input} h-80 font-mono`}
              value={tplText}
              onChange={(e) => setTplText(e.target.value)}
            />
            <button className={btn} onClick={saveTpl}>
              Salvar modelo
            </button>
          </div>
        )}
      </Card>
      <Card title="Contratos">
        <ErrorNote error={contracts.error ?? template.error} />
        {(contracts.data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum contrato.</p>
        )}
        <ul className="divide-y divide-border">
          {(contracts.data ?? []).map((c) => {
            const lead = leads.find((l) => l.id === c.lead_id);
            return (
              <li key={c.id} className="py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="text-primary">{c.number}</strong> · {lead?.full_name ?? "—"}{" "}
                    · {fmtDate(c.contract_date)} · {brl(c.amount)}
                  </span>
                  <span className="flex flex-wrap gap-2">
                    <select
                      className={`${input} w-36`}
                      value={c.status}
                      onChange={(e) => void update(c.id, { status: e.target.value })}
                      aria-label="Status do contrato"
                    >
                      {CONTRACT_STATUS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className={btnGhost}
                      onClick={() => setOpen(open === c.id ? null : c.id)}
                    >
                      {open === c.id ? "Fechar" : "Editar"}
                    </button>
                    <button className={btn} onClick={() => void downloadPdf(c, lead)}>
                      PDF
                    </button>
                  </span>
                </div>
                {open === c.id && <ContractEditor c={c} onSave={(p) => update(c.id, p)} />}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function ContractEditor({
  c,
  onSave,
}: {
  c: Contract;
  onSave: (p: { amount: number; body: string; contract_date: string }) => Promise<void>;
}) {
  const [amount, setAmount] = useState(String(c.amount));
  const [date, setDate] = useState(c.contract_date);
  const [body, setBody] = useState(c.body);
  return (
    <div className="mt-3 space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Valor (R$)">
          <input
            className={input}
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Data">
          <input
            className={input}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </div>
      <textarea
        className={`${input} h-72 font-mono`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        className={btn}
        onClick={() => void onSave({ amount: Number(amount) || 0, body, contract_date: date })}
      >
        Salvar contrato
      </button>
    </div>
  );
}
