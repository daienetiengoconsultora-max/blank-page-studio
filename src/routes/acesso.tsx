import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAuthorizedEmail } from "@/lib/crm";

export const Route = createFileRoute("/acesso")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área restrita | DTM CONSULTORIA FINANCEIRA" },
      { name: "description", content: "Acesso restrito da equipe DTM." },
      { property: "og:title", content: "Área restrita | DTM CONSULTORIA FINANCEIRA" },
      { property: "og:description", content: "Acesso restrito da equipe DTM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Acesso,
});

function Acesso() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    if (mode === "forgot") {
      // Mensagem neutra: não revela qual e-mail é autorizado.
      if (isAuthorizedEmail(email)) {
        setBusy(true);
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        });
        setBusy(false);
      }
      return setMsg("Se este e-mail tiver acesso, você receberá um link para redefinir a senha.");
    }
    if (!isAuthorizedEmail(email)) return setMsg("E-mail ou senha inválidos.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: String(f.get("password") ?? ""),
    });
    setBusy(false);
    if (error) return setMsg("E-mail ou senha inválidos.");
    navigate({ to: "/crm" });
  }

  const field = "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring";
  return (
    <main className="grid min-h-screen place-items-center bg-secondary px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-background p-8 shadow-elegant">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">Área restrita</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-primary">
          {mode === "login" ? "Entrar no CRM" : "Recuperar senha"}
        </h1>
        <label className="mt-6 block text-sm font-medium">
          E-mail
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        {mode === "login" && (
          <label className="mt-4 block text-sm font-medium">
            Senha
            <input name="password" type="password" required autoComplete="current-password" className={field} />
          </label>
        )}
        {msg && <p className="mt-4 text-sm text-muted-foreground" role="status">{msg}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Enviar link"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setMsg(""); }} className="mt-4 w-full text-sm text-brand-purple underline">
          {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground">← Voltar ao site</Link>
      </form>
    </main>
  );
}
