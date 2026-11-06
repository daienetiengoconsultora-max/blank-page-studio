import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, COMPANY } from "@/lib/site";
import { brl, fmtDate } from "@/lib/crm";

type SignPayload = {
  id: string;
  number: string;
  amount: number;
  contract_date: string;
  status: string;
  body: string;
  client_name: string;
  client_type: string;
  client_signed_at: string | null;
  client_signer_name: string | null;
  company_signed_at: string | null;
  company_signer_name: string | null;
};

export const Route = createFileRoute("/assinar/$token")({
  head: () => ({
    meta: [
      { title: `Assinar contrato | ${BRAND}` },
      { name: "description", content: "Assinatura eletrônica do contrato de prestação de serviços." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignContractPage,
});

function SignContractPage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<SignPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      const { data: res, error: rpcError } = await supabase.rpc("get_contract_for_signing", {
        p_token: token,
      });
      if (!alive) return;
      if (rpcError) {
        setError(rpcError.message || "Não foi possível abrir este contrato.");
        setData(null);
      } else {
        setData(res as SignPayload);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data || data.client_signed_at) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const doc = String(form.get("doc") ?? "").trim();
    const accept = form.get("accept") === "on";
    setSending(true);
    setError("");
    const { data: res, error: rpcError } = await supabase.rpc("sign_contract_as_client", {
      p_token: token,
      p_signer_name: name,
      p_signer_doc: doc,
      p_accept: accept,
      p_ip: null,
    });
    setSending(false);
    if (rpcError) {
      setError(rpcError.message || "Não foi possível registrar a assinatura.");
      return;
    }
    const payload = res as { client_signed_at?: string; company_signed_at?: string | null; status?: string };
    setData((prev) =>
      prev
        ? {
            ...prev,
            client_signed_at: payload.client_signed_at ?? new Date().toISOString(),
            client_signer_name: name,
            company_signed_at: payload.company_signed_at ?? prev.company_signed_at,
            status: payload.status ?? prev.status,
          }
        : prev,
    );
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 rounded-3xl border border-border bg-background p-6 shadow-elegant">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple">
            Assinatura eletrônica
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-primary">{BRAND}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta página é exclusiva para leitura e assinatura do contrato. Não há acesso ao sistema
            interno da empresa.
          </p>
        </header>

        {loading && (
          <div className="rounded-3xl border border-border bg-background p-6 text-sm text-muted-foreground">
            Carregando contrato…
          </div>
        )}

        {!loading && error && !data && (
          <div className="rounded-3xl border border-destructive/30 bg-background p-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-5">
            <section className="rounded-3xl border border-border bg-background p-6 shadow-elegant">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Contrato:</span>{" "}
                  <strong className="text-primary">{data.number}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Cliente:</span> {data.client_name}
                </p>
                <p>
                  <span className="text-muted-foreground">Data:</span> {fmtDate(data.contract_date)}
                </p>
                <p>
                  <span className="text-muted-foreground">Valor:</span> {brl(Number(data.amount))}
                </p>
              </div>
              <div className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-foreground">
                {data.body}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-background p-6 shadow-elegant">
              <h2 className="font-display text-lg font-semibold text-primary">Status das assinaturas</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <strong>Cliente:</strong>{" "}
                  {data.client_signed_at
                    ? `Assinado em ${new Date(data.client_signed_at).toLocaleString("pt-BR")} por ${data.client_signer_name}`
                    : "Pendente"}
                </li>
                <li>
                  <strong>DTM:</strong>{" "}
                  {data.company_signed_at
                    ? `Assinado em ${new Date(data.company_signed_at).toLocaleString("pt-BR")} por ${data.company_signer_name}`
                    : "Pendente"}
                </li>
              </ul>
            </section>

            {!data.client_signed_at ? (
              <form
                onSubmit={submit}
                className="rounded-3xl border border-border bg-background p-6 shadow-elegant"
              >
                <h2 className="font-display text-lg font-semibold text-primary">Assinar como cliente</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ao assinar, você declara ter lido e concordado com o conteúdo do contrato acima.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Nome completo
                    <input
                      name="name"
                      required
                      maxLength={120}
                      defaultValue={data.client_name}
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    CPF ou CNPJ
                    <input
                      name="doc"
                      required
                      maxLength={20}
                      placeholder="Somente números ou com pontuação"
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    />
                  </label>
                </div>
                <label className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" name="accept" value="true" className="mt-1" required />
                  <span>
                    Li e aceito os termos deste contrato de prestação de serviços com a {COMPANY.legalName}.
                  </span>
                </label>
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                <button
                  disabled={sending}
                  className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {sending ? "Registrando…" : "Assinar contrato"}
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-elegant">
                {done
                  ? "Assinatura do cliente registrada com sucesso. A DTM também precisa assinar pelo sistema interno para concluir."
                  : "Este contrato já foi assinado pelo cliente."}
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Assinatura eletrônica simples registrada com data, hora e identificação do signatário.
              CNPJ {COMPANY.cnpj}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
