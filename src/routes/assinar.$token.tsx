import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
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

async function fileToCompressedDataUrl(file: Blob, maxSide = 720, quality = 0.72): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a foto.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

function SignContractPage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<SignPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    setError("");
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError("Não foi possível abrir a câmera. Permita o acesso ou envie uma foto do rosto.");
      setCameraOn(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function captureFromCamera() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return setError("Falha ao capturar a foto.");
    const dataUrl = await fileToCompressedDataUrl(blob);
    setSelfie(dataUrl);
    stopCamera();
  }

  async function onFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Envie uma imagem do rosto.");
      return;
    }
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setSelfie(dataUrl);
      setError("");
    } catch {
      setError("Não foi possível ler a foto.");
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data || data.client_signed_at) return;
    if (!selfie) {
      setError("Tire uma foto do rosto para confirmar a assinatura.");
      return;
    }
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
      p_selfie_base64: selfie,
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
                  Para confirmar a veracidade da assinatura, é obrigatório tirar uma foto do seu rosto.
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

                <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-primary">Foto do rosto (obrigatória)</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use a câmera frontal em um ambiente iluminado. Rosto centralizado e sem óculos escuros.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!cameraOn ? (
                      <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => void startCamera()}>
                        Abrir câmera
                      </button>
                    ) : (
                      <>
                        <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => void captureFromCamera()}>
                          Capturar foto
                        </button>
                        <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold" onClick={stopCamera}>
                          Fechar câmera
                        </button>
                      </>
                    )}
                    <label className="rounded-full border border-border px-4 py-2 text-sm font-semibold cursor-pointer">
                      Enviar foto
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={(e) => void onFileChange(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                  {cameraOn && (
                    <video ref={videoRef} className="mt-3 w-full max-w-sm rounded-xl bg-black" playsInline muted />
                  )}
                  {selfie && (
                    <div className="mt-3">
                      <img src={selfie} alt="Pré-visualização da selfie" className="max-h-56 rounded-xl border border-border" />
                      <button type="button" className="mt-2 text-xs font-semibold text-primary underline" onClick={() => setSelfie(null)}>
                        Tirar outra foto
                      </button>
                    </div>
                  )}
                </div>

                <label className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" name="accept" className="mt-1" required />
                  <span>
                    Li e aceito os termos deste contrato de prestação de serviços com a {COMPANY.legalName}.
                    Autorizo o uso da foto do rosto apenas como evidência desta assinatura.
                  </span>
                </label>
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                <button
                  disabled={sending || !selfie}
                  className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {sending ? "Registrando…" : "Assinar contrato"}
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-elegant">
                {done
                  ? "Assinatura do cliente registrada com sucesso, com foto de confirmação. A DTM também precisa assinar pelo sistema interno para concluir."
                  : "Este contrato já foi assinado pelo cliente."}
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Assinatura eletrônica simples com identificação, data/hora e foto do signatário. CNPJ{" "}
              {COMPANY.cnpj}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
