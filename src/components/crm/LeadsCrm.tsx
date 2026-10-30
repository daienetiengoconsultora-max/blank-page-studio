import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../integrations/supabase/client";

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  objective: string | null;
  estimated_value: number | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = [
  ["novo", "Novo"],
  ["em_contato", "Em contato"],
  ["em_analise", "Em análise"],
  ["aprovado", "Aprovado"],
  ["perdido", "Perdido"],
] as const;

const input = "w-full rounded-xl border border-[#DED5C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#B58A45]";

export function LeadsCrm({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", city: "", objective: "", estimated_value: "", notes: "" });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) setError("Não foi possível carregar os clientes.");
    else setLeads(data as Lead[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function addLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const value = form.estimated_value ? Number(form.estimated_value.replace(/\./g, "").replace(",", ".")) : null;
    const { error } = await supabase.from("leads").insert({
      owner_id: userId,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      city: form.city.trim() || null,
      objective: form.objective.trim() || null,
      estimated_value: value !== null && !Number.isNaN(value) ? value : null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) { setError("Não foi possível salvar o cliente."); return; }
    setForm({ full_name: "", phone: "", email: "", city: "", objective: "", estimated_value: "", notes: "" });
    void load();
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) setError("Não foi possível atualizar o status.");
    else setLeads(ls => ls.map(l => (l.id === id ? { ...l, status } : l)));
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este cliente definitivamente?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) setError("Não foi possível excluir o cliente.");
    else setLeads(ls => ls.filter(l => l.id !== id));
  }

  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: { target: { value: string } }) => setForm(s => ({ ...s, [k]: e.target.value })) });

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-2xl border border-[#EAE3D9] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#541D2B]">Novo cliente</h2>
        <form onSubmit={addLead} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required placeholder="Nome completo *" className={input} {...f("full_name")} />
          <input required placeholder="Telefone *" className={input} {...f("phone")} />
          <input type="email" placeholder="E-mail" className={input} {...f("email")} />
          <input placeholder="Cidade" className={input} {...f("city")} />
          <input placeholder="Objetivo (ex.: consórcio imóvel)" className={input} {...f("objective")} />
          <input inputMode="decimal" placeholder="Valor estimado (R$)" className={input} {...f("estimated_value")} />
          <textarea placeholder="Observações" className={`${input} sm:col-span-2`} rows={2} {...f("notes")} />
          <button disabled={saving} className="rounded-full bg-[#541D2B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6A2A39] disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{saving ? "Salvando..." : "Adicionar cliente"}</button>
        </form>
      </section>

      {error && <p role="alert" className="rounded-xl bg-[#F8EDED] p-3 text-sm text-[#7A2E2E]">{error}</p>}

      <section>
        <h2 className="text-lg font-semibold text-[#541D2B]">{isAdmin ? "Todos os clientes" : "Meus clientes"} ({leads.length})</h2>
        {loading ? (
          <p className="mt-4 text-sm text-[#766D64]">Carregando...</p>
        ) : leads.length === 0 ? (
          <p className="mt-4 text-sm text-[#766D64]">Nenhum cliente cadastrado ainda.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {leads.map(l => (
              <li key={l.id} className="rounded-2xl border border-[#EAE3D9] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{l.full_name}</p>
                    <p className="text-sm text-[#766D64]">{[l.phone, l.email, l.city].filter(Boolean).join(" · ")}</p>
                    {l.objective && <p className="mt-1 text-sm">{l.objective}{l.estimated_value != null && ` — R$ ${Number(l.estimated_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}</p>}
                    {l.notes && <p className="mt-1 text-xs text-[#93877A]">{l.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select aria-label="Status" value={l.status} onChange={e => setStatus(l.id, e.target.value)} className="rounded-full border border-[#DED5C9] bg-white px-3 py-1.5 text-xs">
                      {STATUSES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                    {isAdmin && <button onClick={() => remove(l.id)} className="rounded-full border border-[#E5CFCF] px-3 py-1.5 text-xs text-[#7A2E2E] hover:bg-[#F8EDED]">Excluir</button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
