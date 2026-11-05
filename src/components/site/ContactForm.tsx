import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { supabaseConfigured } from "@/lib/supabase-ready";
import { whatsappLink } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 10 && n <= 13;
    }, "Telefone inválido"),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido").max(254)]),
  kind: z.enum(["PF", "PJ"]),
  message: z.string().trim().max(1500),
  consent: z.literal(true, { message: "É necessário aceitar o tratamento de dados" }),
});

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: f.get("name"),
      phone: f.get("phone"),
      email: String(f.get("email") ?? "").trim(),
      kind: f.get("kind"),
      message: String(f.get("message") ?? ""),
      consent: f.get("consent") === "on",
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Verifique os campos");
    if (!supabaseConfigured)
      return setError("Envio indisponível no momento. Fale conosco pelo WhatsApp.");
    const d = parsed.data;
    setState("sending");
    const { error: rpcError } = await supabase.rpc("receive_contact_lead", {
      p_name: d.name,
      p_phone: d.phone,
      p_email: d.email,
      p_client_type: d.kind,
      p_message: d.message,
      p_consent: true,
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
        <p className="font-display text-2xl font-semibold text-primary">Recebemos sua mensagem!</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Vamos retornar pelo telefone ou e-mail informado. Se preferir, fale agora:
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
          Nome
          <input name="name" required maxLength={120} className={field} autoComplete="name" />
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
          E-mail
          <input name="email" type="email" maxLength={254} className={field} autoComplete="email" />
        </label>
        <label className="text-sm font-medium">
          Tipo
          <select name="kind" className={field}>
            <option value="PF">CPF (pessoa física)</option>
            <option value="PJ">CNPJ (pessoa jurídica)</option>
          </select>
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Mensagem
          <textarea
            name="message"
            rows={4}
            maxLength={1500}
            className={field}
            placeholder="Conte brevemente a sua situação"
          />
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
        {state === "sending" ? "Enviando..." : "Enviar mensagem"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Prefere conversar agora?{" "}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary underline"
        >
          Fale pelo WhatsApp
        </a>
      </p>
    </form>
  );
}
