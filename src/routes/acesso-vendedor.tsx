import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { supabaseConfigured } from "../lib/supabase-ready";

const ADMIN_EMAIL = "daienetiengoconsultora@gmail.com";

export const Route = createFileRoute("/acesso-vendedor")({
  head: () => ({ meta: [{ title: "Acesso do Vendedor | Descomplica Crédito" }] }),
  component: () => (supabaseConfigured ? <SellerLogin /> : <Unavailable />),
});

function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoveryMode(true);
        setMessage("Link confirmado. Agora cadastre sua nova senha.");
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setBusy(false);
      setMessage("Este acesso é exclusivo da administradora.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error || data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setBusy(false);
      setMessage("Não foi possível entrar. Confira sua senha ou use a recuperação.");
      return;
    }
    setBusy(false);
    window.location.assign("/painel");
  }

  async function recoverPassword() {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMessage("A recuperação está disponível somente para o e-mail administrador autorizado.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const request = supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: window.location.origin + "/acesso-vendedor",
      });
      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("RECOVERY_TIMEOUT")), 15000);
      });
      const { error } = await Promise.race([request, timeout]);

      if (error) {
        setMessage("Não foi possível solicitar a recuperação. Confira a conexão e as configurações de e-mail do Supabase e tente novamente.");
      } else {
        setMessage("Solicitação concluída. Confira sua caixa de entrada e a pasta de spam. Se não chegar, será necessário configurar o envio de e-mails no Supabase.");
      }
    } catch (error) {
      console.error("Password recovery request failed:", error);
      setMessage(
        error instanceof Error && error.message === "RECOVERY_TIMEOUT"
          ? "A solicitação demorou demais e foi interrompida. Verifique sua conexão e as configurações do Supabase antes de tentar novamente."
          : "Não foi possível conectar ao serviço de recuperação. Tente novamente mais tarde."
      );
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (newPassword.length < 8) {
      setMessage("Sua nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("As senhas não conferem. Digite novamente.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);

    if (error) {
      setMessage("Não foi possível atualizar a senha. Solicite um novo link de recuperação.");
      return;
    }

    await supabase.auth.signOut();
    setRecoveryMode(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Senha alterada com sucesso. Agora entre com sua nova senha.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7] px-5 py-12 text-[#252321]">
      <div className="w-full max-w-md">
        <a href="/" className="text-sm text-[#8A6B3C] hover:underline">← Voltar ao site</a>
        <section className="mt-6 rounded-3xl border border-[#EAE3D9] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47B36]">Área restrita</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#541D2B]">{recoveryMode ? "Criar nova senha" : "Acesso do Vendedor"}</h1>
          <p className="mt-3 text-sm leading-6 text-[#766D64]">
            {recoveryMode ? "Escolha uma nova senha para acessar sua área administrativa." : `Acesso exclusivo da administradora: ${ADMIN_EMAIL}`}
          </p>

          {recoveryMode ? (
            <form onSubmit={updatePassword} className="mt-8 space-y-5">
              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-medium">Nova senha</label>
                <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">Confirme a nova senha</label>
                <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" />
              </div>
              <button disabled={busy} className="w-full rounded-full bg-[#541D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6A2A39] disabled:opacity-60">{busy ? "Aguarde..." : "Salvar nova senha"}</button>
            </form>
          ) : (
            <>
              <form onSubmit={signIn} className="mt-8 space-y-5">
                <div><label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail</label><input id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" /></div>
                <div><label htmlFor="password" className="mb-2 block text-sm font-medium">Senha</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" /></div>
                <button disabled={busy} className="w-full rounded-full bg-[#541D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6A2A39] disabled:opacity-60">{busy ? "Aguarde..." : "Entrar"}</button>
              </form>
              <button type="button" onClick={recoverPassword} disabled={busy} className="mt-5 text-xs text-[#8A6B3C] hover:underline disabled:opacity-60">Esqueci minha senha</button>
            </>
          )}

          {message && <p role="status" className="mt-4 rounded-xl bg-[#F8F4ED] p-3 text-xs leading-5 text-[#6D5940]">{message}</p>}
          <p className="mt-7 border-t border-[#EEE8E0] pt-5 text-xs leading-5 text-[#93877A]">O cadastro de usuários é controlado pela administração. Não existe criação pública de contas.</p>
        </section>
      </div>
    </main>
  );
}

function Unavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7] px-5 text-center text-sm text-[#766D64]">
      <p>A área restrita está temporariamente indisponível. Tente novamente mais tarde. <a href="/" className="text-[#8A6B3C] underline">Voltar ao site</a></p>
    </main>
  );
}
