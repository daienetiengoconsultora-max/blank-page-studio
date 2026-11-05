import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fmtDate } from "@/lib/crm";
import { Card, ErrorNote, Field, btn, btnGhost, input, useLeads } from "./shared";

const BUCKET = "client-documents";
const MAX_BYTES = 10 * 1024 * 1024;
const CATEGORIES = ["Documento pessoal", "Comprovante de endereço", "Relatório / diagnóstico", "Contrato", "Comprovante", "Outros"];

type DocumentRow = {
  id: string; lead_id: string; owner_id: string; file_name: string; storage_path: string;
  content_type: string | null; category: string; status: string; notes: string | null; created_at: string;
};

export function DocumentsModule({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useLeads();
  const [leadId, setLeadId] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const docs = useQuery({
    queryKey: ["crm", "documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_documents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DocumentRow[];
    },
  });

  async function upload(file?: File) {
    if (!file || !leadId) { setMessage("Selecione o cliente e o arquivo."); return; }
    if (file.size > MAX_BYTES) { setMessage("O arquivo deve ter no máximo 10 MB."); return; }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setMessage("Formato não permitido. Use PDF, JPG, PNG ou WEBP."); return; }
    setBusy(true); setMessage("");
    const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const path = `${userId}/${leadId}/${Date.now()}-${safeName}`;
    const stored = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (stored.error) { setBusy(false); setMessage(stored.error.message); return; }
    const saved = await supabase.from("client_documents").insert({
      lead_id: leadId, owner_id: userId, file_name: file.name, storage_path: path,
      content_type: file.type, category, status: "enviado",
    });
    if (saved.error) {
      await supabase.storage.from(BUCKET).remove([path]);
      setBusy(false); setMessage(saved.error.message); return;
    }
    setBusy(false); setMessage("Documento enviado com segurança.");
    await qc.invalidateQueries({ queryKey: ["crm", "documents"] });
  }

  async function openFile(row: DocumentRow) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(row.storage_path, 60);
    if (error) { setMessage(error.message); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function updateStatus(row: DocumentRow, status: string) {
    const { error } = await supabase.from("client_documents").update({ status }).eq("id", row.id);
    if (error) setMessage(error.message);
    else await qc.invalidateQueries({ queryKey: ["crm", "documents"] });
  }

  async function remove(row: DocumentRow) {
    if (!window.confirm(`Excluir o documento "${row.file_name}"?`)) return;
    const removed = await supabase.storage.from(BUCKET).remove([row.storage_path]);
    if (removed.error) { setMessage(removed.error.message); return; }
    const deleted = await supabase.from("client_documents").delete().eq("id", row.id);
    if (deleted.error) setMessage(deleted.error.message);
    else { setMessage("Documento excluído."); await qc.invalidateQueries({ queryKey: ["crm", "documents"] }); }
  }

  return <div className="space-y-5">
    <Card title="Documentos dos clientes">
      <p className="mb-4 text-sm text-muted-foreground">Arquivos privados, vinculados ao cadastro do cliente. Limite de 10 MB por arquivo.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Cliente"><select className={input} value={leadId} onChange={(e) => setLeadId(e.target.value)}><option value="">Selecione</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}</select></Field>
        <Field label="Categoria"><select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Selecionar arquivo"><input className={input} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" disabled={!leadId || busy} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); e.currentTarget.value = ""; }} /></Field>
      </div>
      {busy && <p className="mt-3 text-sm text-muted-foreground">Enviando arquivo…</p>}
      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </Card>
    <Card title={`Arquivos cadastrados (${docs.data?.length ?? 0})`}>
      <ErrorNote error={docs.error} />
      {docs.isLoading ? <p className="text-sm text-muted-foreground">Carregando documentos…</p> : !docs.data?.length ? <p className="text-sm text-muted-foreground">Nenhum documento cadastrado.</p> : (
        <ul className="divide-y divide-border">
          {docs.data.map((row) => <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0"><p className="break-all text-sm font-semibold text-primary">{row.file_name}</p><p className="text-xs text-muted-foreground">{leads.find((l) => l.id === row.lead_id)?.full_name ?? "Cliente"} · {row.category} · {fmtDate(row.created_at)}</p></div>
            <div className="flex flex-wrap items-center gap-2">
              <select className={input + " w-36"} value={row.status} onChange={(e) => void updateStatus(row, e.target.value)} aria-label="Status do documento">
                {["pendente", "enviado", "aprovado", "concluido", "reprovado"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className={btnGhost} onClick={() => void openFile(row)}>Abrir</button>
              <button className="px-2 text-xs text-destructive underline" onClick={() => void remove(row)}>Excluir</button>
            </div>
          </li>)}
        </ul>
      )}
    </Card>
  </div>;
}
