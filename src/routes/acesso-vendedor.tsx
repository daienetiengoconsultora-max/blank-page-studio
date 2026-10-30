import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/acesso-vendedor")({
  head: () => ({ meta: [{ title: "Acesso do Vendedor | Descomplica Crédito" }] }),
  component: SellerLogin,
});

function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage("Não foi possível entrar. Confira seus dados ou use a recuperação de senha.");
      return;
    }
    window.location.assign("/painel");
  }

  async function recoverPassword() {
    if (!email.trim()) {
      setMessage("Informe seu e-mail para receber o link de recuperação.");
      return;
    }
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/acesso-vendedor",
    });
    setBusy(false);
    setMessage(error ? "Não foi possível solicitar a recuperação agora." : "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7] px-5 py-12 text-[#252321]">
      <div className="w-full max-w-md">
        <a href="/" className="text-sm text-[#8A6B3C] hover:underline">← Voltar ao site</a>
        <section className="mt-6 rounded-3xl border border-[#EAE3D9] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47B36]">Área restrita</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#541D2B]">Acesso do Vendedor</h1>
          <p className="mt-3 text-sm leading-6 text-[#766D64]">Entre com o e-mail autorizado para acessar a área interna.</p>
          <form onSubmit={signIn} className="mt-8 space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail</label><input id="email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" /></div>
            <div><label htmlFor="password" className="mb-2 block text-sm font-medium">Senha</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-[#DED5C9] px-4 py-3 text-sm outline-none focus:border-[#B58A45]" /></div>
            <button disabled={busy} className="w-full rounded-full bg-[#541D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6A2A39] disabled:opacity-60">{busy ? "Aguarde..." : "Entrar"}</button>
          </form>
          <button type="button" onClick={recoverPassword} disabled={busy} className="mt-5 text-xs text-[#8A6B3C] hover:underline disabled:opacity-60">Esqueci minha senha</button>
          {message && <p role="status" className="mt-4 rounded-xl bg-[#F8F4ED] p-3 text-xs leading-5 text-[#6D5940]">{message}</p>}
          <p className="mt-7 border-t border-[#EEE8E0] pt-5 text-xs leading-5 text-[#93877A]">O cadastro de usuários é controlado pela administração. Não existe criação pública de contas.</p>
        </section>
      </div>
    </main>
  );
}
