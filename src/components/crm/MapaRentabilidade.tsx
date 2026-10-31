import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "../../integrations/supabase/client";

type Lead = { id: string; full_name: string; phone: string; objective: string | null };
type SavedSimulation = { id: string; lead_id: string; product_type: string; requested_amount: number | null; details: Record<string, unknown>; created_at: string; status: string };
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const field = "w-full rounded-xl border border-[#DED5C9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B58A45]";
const label = "mb-1.5 block text-xs font-semibold text-[#65594D]";

export function MapaRentabilidade({ userId }: { userId: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [saved, setSaved] = useState<SavedSimulation[]>([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [administrator, setAdministrator] = useState("Embracon");
  const [product, setProduct] = useState("Imóvel");
  const [credit, setCredit] = useState("300000");
  const [term, setTerm] = useState("180");
  const [adminFee, setAdminFee] = useState("20");
  const [reserve, setReserve] = useState("2");
  const [insurance, setInsurance] = useState("0");
  const [bid, setBid] = useState("0");
  const [appreciation, setAppreciation] = useState("4");
  const [contemplationMin, setContemplationMin] = useState("12");
  const [contemplationMax, setContemplationMax] = useState("48");
  const [tab, setTab] = useState("simulador");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [l, s] = await Promise.all([
      supabase.from("leads").select("id,full_name,phone,objective").order("full_name"),
      supabase.from("simulations").select("*").eq("owner_id", userId).order("created_at", { ascending: false }).limit(500),
    ]);
    if (!l.error) setLeads((l.data ?? []) as Lead[]);
    if (!s.error) setSaved((s.data ?? []) as SavedSimulation[]);
    if (l.error || s.error) setError("Não foi possível carregar clientes ou histórico. Confira as permissões e migrações do Supabase.");
  }
  useEffect(() => { void load(); }, [userId]);

  const nCredit = Math.max(0, Number(credit) || 0);
  const nTerm = Math.max(1, Number(term) || 1);
  const fee = Math.max(0, Number(adminFee) || 0) / 100;
  const reserveRate = Math.max(0, Number(reserve) || 0) / 100;
  const bidValue = Math.max(0, Number(bid) || 0);
  const monthly = (nCredit * (1 + fee + reserveRate)) / nTerm + Math.max(0, Number(insurance) || 0);
  const totalPaid = monthly * nTerm;
  const annual = Math.max(-99, Number(appreciation) || 0) / 100;
  const projectedAsset = nCredit * Math.pow(1 + annual, nTerm / 12);
  const projectedGain = projectedAsset - nCredit;
  const estimatedRoi = totalPaid > 0 ? ((projectedAsset - totalPaid) / totalPaid) * 100 : 0;
  const valid = nCredit > 0 && nTerm > 0 && contemplationMin !== "" && contemplationMax !== "" && Number(contemplationMin) >= 0 && Number(contemplationMax) >= Number(contemplationMin);
  const history = useMemo(() => saved.filter(s => !selectedLead || s.lead_id === selectedLead), [saved, selectedLead]);
  const currentCount = saved.length;

  async function save(event: FormEvent) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!selectedLead) { setError("Selecione o cliente para vincular a simulação."); return; }
    if (!valid) { setError("Revise crédito, prazo e intervalo estimado."); return; }
    if (bidValue > nCredit) { setError("O lance informado não pode superar o valor do crédito."); return; }
    setBusy(true);
    const details = {
      module: "mapa_rentabilidade", administrator, product, term_months: nTerm,
      administration_fee_percent: Number(adminFee) || 0, reserve_fund_percent: Number(reserve) || 0,
      insurance_monthly: Number(insurance) || 0, bid_value: bidValue,
      monthly_payment_estimate: monthly, total_paid_estimate: totalPaid,
      annual_asset_appreciation_assumption_percent: Number(appreciation) || 0,
      projected_asset_value: projectedAsset, projected_asset_gain: projectedGain,
      estimated_roi_percent: estimatedRoi, contemplation_window_months: [Number(contemplationMin), Number(contemplationMax)],
      disclaimer: "Estimativas ilustrativas. Não representam promessa de rentabilidade, valorização, prazo ou garantia de contemplação."
    };
    const result = await supabase.from("simulations").insert({
      owner_id: userId, lead_id: selectedLead, product_type: "Consórcio " + product,
      requested_amount: nCredit, details, status: "em_analise"
    });
    setBusy(false);
    if (result.error) { setError("Não foi possível salvar. Confira se as tabelas e permissões do CRM estão ativas."); return; }
    setMessage("Simulação salva e vinculada ao cliente.");
    await load();
    setTab("historico");
  }

  return <section className="mt-7 space-y-5">
    <div className="overflow-hidden rounded-3xl border border-[#E8DDCE] bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[#23191A] via-[#4B202A] to-[#7A5831] px-5 py-6 text-white sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E7C98D]">Ferramenta comercial · Área interna</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-2xl font-semibold sm:text-3xl">Mapa da Rentabilidade</h2><p className="mt-1 max-w-2xl text-sm text-white/75">Transforme os dados da conversa em cenários comparáveis, com premissas visíveis e histórico por cliente.</p></div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs text-[#F4DCA8]">{currentCount} simulações salvas</div>
        </div>
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-[#EEE7DE] p-3">
        <button onClick={() => setTab("simulador")} className={tab === "simulador" ? "rounded-full bg-[#641B2D] px-4 py-2 text-xs font-semibold text-white" : "rounded-full border border-[#DED5C9] px-4 py-2 text-xs text-[#641B2D]"}>Simulador</button>
        <button onClick={() => setTab("historico")} className={tab === "historico" ? "rounded-full bg-[#641B2D] px-4 py-2 text-xs font-semibold text-white" : "rounded-full border border-[#DED5C9] px-4 py-2 text-xs text-[#641B2D]"}>Histórico por cliente</button>
        <button onClick={() => setTab("planos")} className={tab === "planos" ? "rounded-full bg-[#641B2D] px-4 py-2 text-xs font-semibold text-white" : "rounded-full border border-[#DED5C9] px-4 py-2 text-xs text-[#641B2D]"}>Planos e teste</button>
      </nav>
      {error && <p role="alert" className="mx-5 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="mx-5 mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {tab === "simulador" && <form onSubmit={save} className="grid gap-5 p-5 lg:grid-cols-[1.1fr_.9fr] sm:p-7">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={label}>Cliente do CRM</label><select required value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className={field}><option value="">Selecione um cliente</option>{leads.map(l => <option key={l.id} value={l.id}>{l.full_name} · {l.phone}</option>)}</select></div>
            <div><label className={label}>Administradora</label><select value={administrator} onChange={e => setAdministrator(e.target.value)} className={field}>{["Embracon","Banco do Brasil","CNP","Rodobens","Magalu Consórcios","Itaú","Outra / informar na proposta"].map(x => <option key={x}>{x}</option>)}</select></div>
            <div><label className={label}>Objetivo</label><select value={product} onChange={e => setProduct(e.target.value)} className={field}><option>Imóvel</option><option>Veículo</option><option>Serviços</option></select></div>
            <div><label className={label}>Crédito contratado (R$)</label><input required type="number" min="1" step="1000" value={credit} onChange={e => setCredit(e.target.value)} className={field}/></div>
            <div><label className={label}>Prazo (meses)</label><input required type="number" min="1" max="300" value={term} onChange={e => setTerm(e.target.value)} className={field}/></div>
            <div><label className={label}>Taxa de administração total (%)</label><input type="number" min="0" max="100" step=".1" value={adminFee} onChange={e => setAdminFee(e.target.value)} className={field}/></div>
            <div><label className={label}>Fundo de reserva (%)</label><input type="number" min="0" max="30" step=".1" value={reserve} onChange={e => setReserve(e.target.value)} className={field}/></div>
            <div><label className={label}>Seguro mensal (R$)</label><input type="number" min="0" step=".01" value={insurance} onChange={e => setInsurance(e.target.value)} className={field}/></div>
            <div><label className={label}>Lance planejado (R$)</label><input type="number" min="0" step="100" value={bid} onChange={e => setBid(e.target.value)} className={field}/></div>
            <div><label className={label}>Valorização anual hipotética do bem (%)</label><input type="number" min="-50" max="50" step=".1" value={appreciation} onChange={e => setAppreciation(e.target.value)} className={field}/></div>
            <div><label className={label}>Janela estimada inicial (mês)</label><input type="number" min="0" max="300" value={contemplationMin} onChange={e => setContemplationMin(e.target.value)} className={field}/></div>
            <div><label className={label}>Janela estimada final (mês)</label><input type="number" min="0" max="300" value={contemplationMax} onChange={e => setContemplationMax(e.target.value)} className={field}/></div>
          </div>
          <p className="rounded-xl bg-[#F8F4ED] p-3 text-xs leading-5 text-[#776A5A]">Preencha as taxas conforme a proposta e o regulamento do grupo escolhido. Os parâmetros não são puxados automaticamente das administradoras.</p>
          <button disabled={busy || !leads.length} className="rounded-full bg-[#641B2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#842D43] disabled:opacity-50">{busy ? "Salvando..." : "Salvar simulação no cliente"}</button>
          {!leads.length && <p className="text-xs text-[#8A6B3C]">Cadastre primeiro o cliente na aba Clientes do CRM.</p>}
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl bg-[#F8F4ED] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6B3C]">Cenário calculado</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[["Parcela média estimada",money(monthly)],["Total estimado pago",money(totalPaid)],["Patrimônio projetado",money(projectedAsset)],["ROI estimado",estimatedRoi.toLocaleString("pt-BR",{maximumFractionDigits:1})+"%"]].map(([k,v])=><div key={k} className="rounded-xl border border-[#E7DCCB] bg-white p-3"><p className="text-[11px] text-[#766D64]">{k}</p><p className="mt-1 text-lg font-semibold text-[#641B2D]">{v}</p></div>)}
            </div>
            <div className="mt-4 border-t border-[#E6DACA] pt-4 text-xs leading-5 text-[#6E6255]">
              <p><b>Crédito:</b> {money(nCredit)} · <b>Prazo:</b> {nTerm} meses</p>
              <p><b>Valorização hipotética:</b> {money(projectedGain)} sobre o crédito inicial</p>
              <p><b>Contemplação:</b> janela informada de {contemplationMin || "—"} a {contemplationMax || "—"} meses, sem previsão garantida.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E8DDCE] p-4"><h3 className="text-sm font-semibold text-[#641B2D]">Linha do tempo ilustrativa</h3><div className="mt-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#A47B36]"/><div className="h-px flex-1 bg-[#D8C9B5]"/><span className="h-2 w-2 rounded-full bg-[#A47B36]"/><div className="h-px flex-1 bg-[#D8C9B5]"/><span className="h-2 w-2 rounded-full bg-[#A47B36]"/></div><div className="mt-2 flex justify-between text-[10px] text-[#766D64]"><span>Adesão</span><span>Janela {contemplationMin}–{contemplationMax} meses</span><span>Uso do crédito*</span></div><p className="mt-3 text-[10px] leading-4 text-[#8A8178]">*Somente após contemplação e cumprimento das regras contratuais e de análise da administradora.</p></div>
        </aside>
      </form>}
      {tab === "historico" && <div className="p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-[#641B2D]">Simulações salvas</h3><p className="text-xs text-[#766D64]">Cada registro permanece vinculado ao cadastro do cliente.</p></div><select value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className="max-w-xs rounded-xl border border-[#DED5C9] bg-white px-3 py-2 text-sm"><option value="">Todos os clientes</option>{leads.map(l => <option key={l.id} value={l.id}>{l.full_name}</option>)}</select></div>
        {history.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead><tr className="border-b border-[#EAE3D9] text-[#766D64]"><th className="p-3">Cliente</th><th className="p-3">Administradora</th><th className="p-3">Crédito</th><th className="p-3">Parcela estimada</th><th className="p-3">Data</th></tr></thead><tbody>{history.map(s => <tr key={s.id} className="border-b border-[#F0EBE4]"><td className="p-3 font-medium">{leads.find(l => l.id === s.lead_id)?.full_name ?? "Cliente"}</td><td className="p-3">{String(s.details.administrator ?? "—")}</td><td className="p-3">{money(Number(s.requested_amount ?? 0))}</td><td className="p-3">{money(Number(s.details.monthly_payment_estimate ?? 0))}</td><td className="p-3">{new Date(s.created_at).toLocaleDateString("pt-BR")}</td></tr>)}</tbody></table></div> : <p className="rounded-xl bg-[#F8F4ED] p-5 text-sm text-[#766D64]">Ainda não há simulações salvas para este filtro.</p>}
      </div>}
      {tab === "planos" && <div className="space-y-5 p-5 sm:p-7">
        <div className="rounded-2xl border border-[#DCCBAE] bg-[#FBF6EC] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#8A6B3C]">Oferta de entrada</p><h3 className="mt-1 text-2xl font-semibold text-[#641B2D]">Teste por 7 dias · R$ 9,90</h3><p className="mt-2 text-sm text-[#766D64]">Período de avaliação do Mapa da Rentabilidade, conforme oferta informada.</p></div>
        <div className="grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-[#EAE3D9] p-5"><h3 className="font-semibold text-[#641B2D]">Individual</h3><p className="mt-2 text-2xl font-semibold">1 usuário</p><p className="mt-2 text-sm text-[#766D64]">Simulações vinculadas aos próprios clientes e histórico individual. Limite e mensalidade a definir na contratação.</p></article><article className="rounded-2xl border border-[#EAE3D9] p-5"><h3 className="font-semibold text-[#641B2D]">Empresarial</h3><p className="mt-2 text-2xl font-semibold">Equipe</p><p className="mt-2 text-sm text-[#766D64]">Gestão centralizada, operação por membro e limites de simulações salvas por usuário. Quantidade de membros, limite e mensalidade a definir.</p></article></div>
        <p className="text-xs leading-5 text-[#8A8178]">A contratação, cobrança recorrente, cadastro de membros e bloqueio automático por limite ainda precisam ser conectados ao provedor de pagamento e às regras de assinatura. Esta tela não realiza cobrança.</p>
      </div>}
    </div>
    <p className="text-[11px] leading-5 text-[#8A8178]">Aviso obrigatório: ROI, patrimônio projetado, parcelas e janela de contemplação são estimativas calculadas a partir dos dados informados. Não representam garantia de retorno, valorização, prazo ou contemplação. A contemplação ocorre por sorteio ou lance e depende das regras e dos recursos do grupo.</p>
  </section>;
}
