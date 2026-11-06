import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_STAGES, brl, stageLabel } from "@/lib/crm";
import { Card, ErrorNote, input, useLeads } from "./shared";

export function FunnelModule({ userId }: { userId?: string }) {
  const qc = useQueryClient();
  const { data: leads = [], error, isLoading } = useLeads();
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const visible = useMemo(
    () =>
      leads.filter(
        (lead) =>
          !search ||
          `${lead.full_name} ${lead.phone} ${lead.source ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [leads, search],
  );

  async function move(leadId: string, status: string) {
    setBusy(leadId);
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status,
        last_contact_at: new Date().toISOString(),
      })
      .eq("id", leadId);
    if (!updateError && userId) {
      await supabase.from("lead_activities").insert({
        lead_id: leadId,
        owner_id: userId,
        activity_type: "sistema",
        description: `Etapa alterada para: ${stageLabel(status)}`,
      });
    }
    setBusy(null);
    if (updateError) {
      window.alert("Não foi possível atualizar a etapa: " + updateError.message);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["crm"] });
  }

  return (
    <div className="space-y-4">
      <Card
        title="Funil de atendimento"
        actions={
          <span className="text-xs text-muted-foreground">{leads.length} clientes no total</span>
        }
      >
        <p className="mb-3 text-sm text-muted-foreground">
          Acompanhe cada cliente por etapa. Alterações ficam registradas na timeline do cliente.
        </p>
        <input
          className={input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente, telefone ou origem"
        />
        <ErrorNote error={error} />
        {isLoading ? (
          <p className="py-5 text-sm text-muted-foreground">Carregando funil…</p>
        ) : (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
            {LEAD_STAGES.map((stage) => {
              const items = visible.filter((lead) => lead.status === stage.value);
              return (
                <section
                  key={stage.value}
                  className="w-72 shrink-0 rounded-2xl border border-border bg-card p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-primary">{stage.label}</h3>
                    <span className="rounded-full bg-background px-2 py-1 text-xs">
                      {items.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((lead) => (
                      <li key={lead.id} className="rounded-xl border border-border bg-background p-3">
                        <p className="font-semibold text-primary">{lead.full_name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {lead.phone} · {lead.client_type}
                          {lead.source ? ` · ${lead.source}` : ""}
                        </p>
                        {lead.estimated_value != null && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Valor estimado: {brl(lead.estimated_value)}
                          </p>
                        )}
                        <select
                          className={input + " mt-3"}
                          value={lead.status}
                          disabled={busy === lead.id}
                          onChange={(e) => void move(lead.id, e.target.value)}
                          aria-label={"Etapa de " + lead.full_name}
                        >
                          {LEAD_STAGES.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {busy === lead.id && (
                          <p className="mt-1 text-xs text-muted-foreground">Salvando…</p>
                        )}
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                        Nenhum cliente nesta etapa.
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
