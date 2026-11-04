import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Contract = Database["public"]["Tables"]["contracts"]["Row"];
export type Process = Database["public"]["Tables"]["legal_processes"]["Row"];
export type Template = Database["public"]["Tables"]["message_templates"]["Row"];

export const input =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring";
export const btn =
  "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60";
export const btnGhost =
  "rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-secondary";

export function Card({
  title,
  children,
  actions,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 shadow-elegant">
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="font-display text-xl font-semibold text-primary">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function useLeads() {
  return useQuery({
    queryKey: ["crm", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <p className="text-sm text-destructive">
      Não foi possível carregar: {(error as Error).message}
    </p>
  );
}
