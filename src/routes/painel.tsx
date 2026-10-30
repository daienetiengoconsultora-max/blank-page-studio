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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#F4EBDD_0%,_#FCFAF7_46%,_#F7F3ED_100%)] px-4 py-6 text-[#252321] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1480px]">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E9DFD1] bg-white/90 px-5 py-4 shadow-sm backdrop-blur sm:px-7">
          <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#541D2B] to-[#8A6538] text-lg font-bold text-[#F5DCA7] shadow-md">D</div><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A47B36]">Área administrativa exclusiva</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-[#541D2B] sm:text-2xl">Descomplica Crédito</h1><p className="text-xs text-[#766D64]">CRM · Gestão comercial e relacionamento</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-medium text-[#541D2B]">{email}</p><p className="text-[10px] uppercase tracking-wider text-[#A47B36]">{isAdmin ? "Administradora" : "Acesso restrito"}</p></div><button onClick={signOut} className="rounded-full border border-[#DED5C9] bg-white px-5 py-2.5 text-xs font-semibold text-[#541D2B] transition hover:border-[#B58A45] hover:bg-[#FCFAF7]">Sair</button></div>
        </header>
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
