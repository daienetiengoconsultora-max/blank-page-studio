import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isAuthorizedEmail } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/acesso" });
    // Interface: só a conta autorizada. O banco (RLS is_dtm_owner) também bloqueia.
    const { data: owner } = await supabase.rpc("is_dtm_owner");
    if (!isAuthorizedEmail(data.user.email) || owner !== true) {
      await supabase.auth.signOut();
      throw redirect({ to: "/acesso" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
