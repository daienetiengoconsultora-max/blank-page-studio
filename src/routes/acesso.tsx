import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAuthorizedEmail } from "@/lib/crm";

export const Route = createFileRoute("/acesso")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área restrita | DTM CONSULTORIA FINANCEIRA" },
      { name: "description", content: "Acesso restrito." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: Acesso,
});

const LOCK_KEY = "dtm_login_lock_until";
const FAIL_KEY = "dtm_login_fails";
const MAX_FAILS = 6;
const LOCK_MS = 5 * 60 * 1000;

function readLockUntil() {
  const n = Number(sessionStorage.getItem(LOCK_KEY) ?? "0");
  return Number.isFinite(n) ? n : 0;
}

function Acesso() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const submitting = useRef(false);

  useEffect(() => {
    setLockedUntil(readLockUntil());
    // Se já existe sessão válida, manda pro CRM; se inválida, encerra.
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      if (!isAuthorizedEmail(data.user.email)) {
        await supabase.auth.signOut();
        return;
      }
      const { data: owner } = await supabase.rpc("is_dtm_owner");
      if (owner === true) navigate({ to: "/crm" });
      else await supabase.auth.signOut();
    })();
  }, [navigate]);

  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const t = window.setInterval(() => {
      if (readLockUntil() <= Date.now()) {
        setLockedUntil(0);
        sessionStorage.removeItem(LOCK_KEY);
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [lockedUntil]);

  function registerFail() {
    const fails = Number(sessionStorage.getItem(FAIL_KEY) ?? "0") + 1;
    sessionStorage.setItem(FAIL_KEY, String(fails));
    if (fails >= MAX_FAILS) {
      const until = Date.now() + LOCK_MS;
      sessionStorage.setItem(LOCK_KEY, String(until));
      sessionStorage.setItem(FAIL_KEY, "0");
      setLockedUntil(until);
      return true;
    }
    return false;
  }

  function clearFails() {
    sessionStorage.removeItem(FAIL_KEY);
    sessionStorage.removeItem(LOCK_KEY);
    setLockedUntil(0);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current || busy) return;
    setMsg("");

    if (mode === "login" && readLockUntil() > Date.now()) {
      setLockedUntil(readLockUntil());
      return setMsg("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
    }

    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (mode === "forgot") {
      // Mensagem sempre neutra: não revela se o e-mail existe ou é autorizado.
      if (isAuthorizedEmail(email)) {
        setBusy(true);
        submitting.current = true;
        try {
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/redefinir-senha`,
          });
        } catch {
          /* silencioso de propósito */
        }
        setBusy(false);
        submitting.current = false;
      }
      return setMsg("Se este e-mail tiver acesso, você receberá um link para redefinir a senha.");
    }

    // Não revela se o e-mail é o autorizado.
    if (!isAuthorizedEmail(email)) {
      if (registerFail()) {
        return setMsg("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
      }
      return setMsg("E-mail ou senha inválidos.");
    }

    setBusy(true);
    submitting.current = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: String(f.get("password") ?? ""),
    });

    if (error || !data.user) {
      setBusy(false);
      submitting.current = false;
      if (registerFail()) {
        return setMsg("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
      }
      return setMsg("E-mail ou senha inválidos.");
    }

    // Dupla checagem: e-mail autorizado + RPC de dono no banco.
    const { data: owner } = await supabase.rpc("is_dtm_owner");
    if (owner !== true) {
      await supabase.auth.signOut();
      setBusy(false);
      submitting.current = false;
      registerFail();
      return setMsg("E-mail ou senha inválidos.");
    }

    clearFails();
    setBusy(false);
    submitting.current = false;
    navigate({ to: "/crm" });
  }

  const locked = lockedUntil > Date.now();
  const field =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring";

  return (
    <main className="grid min-h-screen place-items-center bg-secondary px-5">
      <form
        onSubmit={submit}
        autoComplete="on"
        className="w-full max-w-sm rounded-3xl bg-background p-8 shadow-elegant"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-purple">
          Área restrita
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-primary">
          {mode === "login" ? "Entrar" : "Recuperar senha"}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Acesso exclusivo do administrador.</p>

        <label className="mt-6 block text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            inputMode="email"
            spellCheck={false}
            className={field}
            disabled={busy || locked}
          />
        </label>

        {mode === "login" && (
          <label className="mt-4 block text-sm font-medium">
            Senha
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={field}
              disabled={busy || locked}
              minLength={6}
            />
          </label>
        )}

        {msg && (
          <p className="mt-4 text-sm text-muted-foreground" role="status">
            {msg}
          </p>
        )}

        <button
          disabled={busy || locked}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Enviar link"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setMode(mode === "login" ? "forgot" : "login");
            setMsg("");
          }}
          className="mt-4 w-full text-sm text-brand-purple underline disabled:opacity-60"
        >
          {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground">
          ← Voltar ao site
        </Link>
      </form>
    </main>
  );
}
