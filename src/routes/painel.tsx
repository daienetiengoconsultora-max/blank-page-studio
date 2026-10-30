import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { supabaseConfigured } from "../lib/supabase-ready";
import { LeadsCrm } from "../components/crm/LeadsCrm";

const ADMIN_EMAIL = "daienetiengoconsultora@gmail.com";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Painel | Descomplica Crédito" }] }),
  component: () => (supabaseConfigured ? <SellerPanel /> : <Unavailable />),
});

function SellerPanel() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session || data.session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        window.location.replace("/acesso-vendedor");
        return;
      }
      const { data: admin } = await supabase.rpc("is_crm_admin");
      if (!active) return;
      setEmail(data.session.user.email ?? "");
      setUserId(data.session.user.id);
      setIsAdmin(admin === true);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        void supabase.auth.signOut();
        window.location.replace("/acesso-vendedor");
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  if (checking) return <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7] text-sm text-[#766D64]">Verificando acesso...</main>;

  return (
    <main className="min-h-screen bg-[#FCFAF7] px-5 py-10 text-[#252321]">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-[#EAE3D9] pb-6">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47B36]">Área restrita</p><h1 className="mt-2 text-2xl font-semibold text-[#541D2B]">Descomplica Crédito</h1></div>
          <button onClick={signOut} className="rounded-full border border-[#DED5C9] px-4 py-2 text-xs font-medium hover:bg-white">Sair</button>
        </header>
        <p className="mt-6 text-sm text-[#766D64]">Sessão autenticada: {email}{isAdmin ? " · Administradora" : ""}</p>
        <LeadsCrm userId={userId} isAdmin={isAdmin} />
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
