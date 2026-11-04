import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAuthorizedEmail } from "@/lib/crm";

export const Route = createFileRoute("/redefinir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha | DTM CONSULTORIA FINANCEIRA" },
      { name: "description", content: "Redefinição de senha da área restrita." },
      { property: "og:title", content: "Redefinir senha | DTM CONSULTORIA FINANCEIRA" },
      { property: "og:description", content: "Redefinição de senha da área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("Validando link...");

  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.slice(1));
    const err = hash.get("error_code") ?? url.searchParams.get("error_code");
    if (err) {
      setMsg(
        err === "otp_expired"
          ? "Este link expirou ou já foi usado. Peça um novo."
          : "Link inválido. Peça um novo.",
      );
      return;
    }
    const code = url.searchParams.get("code");
    const check = async () => {
      if (code) await supabase.auth.exchangeCodeForSession(code);
      const { data } = await supabase.auth.getUser();
      if (data.user && isAuthorizedEmail(data.user.email)) {
        setReady(true);
        setMsg("");
        window.history.replaceState(null, "", "/redefinir-senha");
      } else if (data.user) {
        await supabase.auth.signOut();
        setMsg("Conta sem acesso.");
      } else setMsg("Link inválido ou expirado. Peça um novo.");
    };
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "PASSWORD_RECOVERY" || ev === "SIGNED_IN") void check();
    });
    void check();
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = String(f.get("p") ?? "");
    if (p.length < 8) return setMsg("A senha precisa ter pelo menos 8 caracteres.");
    if (p !== f.get("p2")) return setMsg("As senhas não conferem.");
    const { error } = await supabase.auth.updateUser({ password: p });
    if (error) return setMsg("Não foi possível alterar a senha. Tente um novo link.");
    navigate({ to: "/crm" });
  }

  const field = "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm";
  return (
    <main className="grid min-h-screen place-items-center bg-secondary px-5">
      <div className="w-full max-w-sm rounded-3xl bg-background p-8 shadow-elegant">
        <h1 className="font-display text-2xl font-semibold text-primary">Nova senha</h1>
        {ready && (
          <form onSubmit={submit}>
            <label className="mt-6 block text-sm font-medium">
              Nova senha
              <input name="p" type="password" className={field} autoComplete="new-password" />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Repita a senha
              <input name="p2" type="password" className={field} autoComplete="new-password" />
            </label>
            <button className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              Salvar senha
            </button>
          </form>
        )}
        {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
        <Link to="/acesso" className="mt-6 block text-center text-xs text-muted-foreground">
          Ir para o login
        </Link>
      </div>
    </main>
  );
}
