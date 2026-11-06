import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { supabaseConfigured } from "@/lib/supabase-ready";
import { SERVICES, whatsappLink } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu primeiro nome").max(60),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 13,
      "Telefone inválido",
    ),
  kind: z.enum(["CPF", "CNPJ"]),
  debt: z.string().max(20),
  creditor: z.string().trim().max(60),
  service: z.string().min(2, "Escolha o serviço"),
  consent: z.literal(true, { message: "É necessário aceitar o tratamento de dados" }),
});

export function DiagnosticForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: f.get("name"),
      phone: f.get("phone"),
      kind: f.get("kind"),
      debt: String(f.get("debt") ?? ""),
      creditor: f.get("creditor") ?? "",
      service: f.get("service"),
      consent: f.get("consent") === "on",
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Verifique os campos");
    if (!supabaseConfigured)
      return setError("Envio indisponível no momento. Fale conosco pelo WhatsApp.");
    const d = parsed.data;
    const debtNum = Number(d.debt.replace(/\./g, "").replace(",", "."));
    const objective =
      `Diagnóstico: ${d.service} · ${d.kind}${d.creditor ? ` · Credor: ${d.creditor}` : ""}`.slice(
        0,
        100,
      );
    setState("sending");
    const { error: rpcError } = await supabase.rpc("receive_public_lead", {
      p_name: d.name,
      p_phone: d.phone,
      p_city: "Não informada",
      p_objective: objective,
      p_consent: true,
      ...(Number.isFinite(debtNum) && debtNum > 0 ? { p_estimated_value: debtNum } : {}),
    });
    if (rpcError) {
      setState("idle");
      return setError("Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.");
    }
    setState("ok");
  }

  if (state === "ok")
    return (
      <div className="rounded-3xl border-t-4 border-brand-gold bg-card p-8 text-card-foreground shadow-elegant">
        <p className="font-display text-2xl font-semibold text-wine">Recebemos seu pedido!</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Nossa equipe vai entrar em contato pelo WhatsApp informado. Se preferir, fale agora:
        </p>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-full bg-brand-spectrum px-6 py-3 text-sm font-semibold text-white"
        >
          Abrir WhatsApp
        </a>
      </div>
    );

  const field =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-pink/30";
  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-brand-rose/40 border-t-4 border-t-brand-gold bg-card p-6 text-card-foreground shadow-elegant md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Primeiro nome
          <input name="name" required maxLength={60} className={field} autoComplete="given-name" />
        </label>
        <label className="text-sm font-medium">
          Telefone / WhatsApp
          <input
            name="phone"
            required
            inputMode="tel"
            maxLength={20}
            placeholder="(27) 99999-9999"
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Tipo de cadastro
          <select name="kind" className={field}>
            <option>CPF</option>
            <option>CNPJ</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Valor aproximado da dívida
          <input
            name="debt"
            inputMode="decimal"
            maxLength={20}
            placeholder="Ex.: 5.000"
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Empresa ou instituição credora
          <input name="creditor" maxLength={60} className={field} />
        </label>
        <label className="text-sm font-medium">
          Serviço desejado
          <select name="service" className={field}>
            {SERVICES.map((s) => (
              <option key={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-muted-foreground">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-primary" />
        <span>
          Autorizo o tratamento dos meus dados para contato e atendimento, conforme a{" "}
          <Link to="/privacidade" className="font-semibold text-primary underline">
            Política de Privacidade
          </Link>{" "}
          (LGPD).
        </span>
      </label>
      {error && (
        <p className="mt-4 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <button
        disabled={state === "sending"}
        className="mt-6 w-full rounded-full bg-brand-spectrum px-6 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-elegant hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Enviando..." : "Quero fazer meu diagnóstico"}
      </button>
    </form>
  );
}
