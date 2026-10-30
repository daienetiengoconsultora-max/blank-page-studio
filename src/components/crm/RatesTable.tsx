import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { refreshBcbRates } from "../../lib/bcb-rates.functions";

export type RateRef = { id: string; category: string; institution: string; modality: string; monthly_rate: number; annual_rate: number; reference_period: string; source: string; source_url: string };
export type ConsAdmin = { id: string; name: string; cnpj8: string | null; city: string | null; state: string | null; website: string | null; segment: string | null; admin_fee: number | null; reserve_fund: number | null; term_months: number | null; reference_period: string; source: string; source_url: string };
export type RateLog = { id: string; details: string; created_at: string };

const input = "w-full rounded-xl border border-[#DED5C9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B58A45]";
const pct = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
const ND = <span className="text-[#9A8F84] italic">Não disponível</span>;

export function RatesTable({ rates, admins, lastLog, isAdmin, onRefreshed }: { rates: RateRef[]; admins: ConsAdmin[]; lastLog: RateLog | null; isAdmin: boolean; onRefreshed: () => Promise<void> }) {
  const [tab, setTab] = useState<"imobiliario" | "veiculo" | "consorcio">("imobiliario");
  const [q, setQ] = useState(""), [mod, setMod] = useState("todas"), [uf, setUf] = useState("todas"), [sort, setSort] = useState<"asc" | "desc" | "nome">("asc");
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState("");
  const refresh = useServerFn(refreshBcbRates);

  const list = useMemo(() => {
    const l = rates.filter((r) => r.category === tab && (mod === "todas" || r.modality === mod) && r.institution.toLowerCase().includes(q.toLowerCase()));
    return l.sort((a, b) => (sort === "nome" ? a.institution.localeCompare(b.institution) : sort === "asc" ? a.monthly_rate - b.monthly_rate : b.monthly_rate - a.monthly_rate));
  }, [rates, tab, mod, q, sort]);
  const modalities = Array.from(new Set(rates.filter((r) => r.category === tab).map((r) => r.modality))).sort();
  const adminList = admins.filter((a) => (uf === "todas" || a.state === uf) && [a.name, a.city ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
  const ufs = Array.from(new Set(admins.map((a) => a.state).filter(Boolean))).sort() as string[];

  async function doRefresh() {
    setBusy(true); setMsg("");
    try { const r = await refresh(); setMsg("Dados atualizados: " + r.details); await onRefreshed(); }
    catch (e) { setMsg("Não foi possível atualizar: " + (e instanceof Error ? e.message : "erro desconhecido")); }
    setBusy(false);
  }

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-[#EAE3D9] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#541D2B]">Tabela de Taxas e Administradoras</h2>
            <p className="mt-1 max-w-2xl text-xs text-[#766D64]">Dados públicos de referência do Banco Central do Brasil. As taxas são médias praticadas por cada instituição no período indicado — não são ofertas atuais nem garantem a taxa de uma proposta.</p>
            <p className="mt-2 text-xs text-[#8A6B3C]">Última atualização: {lastLog ? new Date(lastLog.created_at).toLocaleString("pt-BR") + " · " + lastLog.details : "ainda não importado"}</p>
          </div>
          {isAdmin && <button disabled={busy} onClick={doRefresh} className="rounded-full bg-[#541D2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6A2A39] disabled:opacity-50">{busy ? "Atualizando..." : "Atualizar dados do Banco Central"}</button>}
        </div>
        {msg && <p role="status" className="mt-3 rounded-xl bg-[#FCFAF7] p-3 text-xs text-[#541D2B]">{msg}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {([["imobiliario", "Financiamento imobiliário"], ["veiculo", "Financiamento de veículos"], ["consorcio", "Administradoras de consórcio"]] as const).map(([k, v]) => (
            <button key={k} onClick={() => { setTab(k); setMod("todas"); }} className={tab === k ? "rounded-full bg-[#A47B36] px-4 py-2 text-xs font-semibold text-white" : "rounded-full border border-[#DED5C9] px-4 py-2 text-xs text-[#541D2B]"}>{v}</button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <input className={input} placeholder={tab === "consorcio" ? "Buscar administradora ou cidade" : "Buscar instituição"} value={q} onChange={(e) => setQ(e.target.value)} />
          {tab === "consorcio"
            ? <select className={input} value={uf} onChange={(e) => setUf(e.target.value)}><option value="todas">Todos os estados</option>{ufs.map((u) => <option key={u}>{u}</option>)}</select>
            : <><select className={input} value={mod} onChange={(e) => setMod(e.target.value)}><option value="todas">Todas as modalidades</option>{modalities.map((m) => <option key={m}>{m}</option>)}</select>
              <select className={input} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="asc">Menor taxa primeiro</option><option value="desc">Maior taxa primeiro</option><option value="nome">Nome (A-Z)</option></select></>}
        </div>
      </article>

      {tab !== "consorcio" ? (
        <article className="overflow-x-auto rounded-2xl border border-[#EAE3D9] bg-white p-2">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs text-[#8A6B3C]"><tr><th className="p-3">Instituição</th><th className="p-3">Modalidade</th><th className="p-3">Taxa mensal</th><th className="p-3">Taxa anual</th><th className="p-3">Referência</th><th className="p-3">Fonte</th></tr></thead>
            <tbody>{list.map((r) => <tr key={r.id} className="border-t border-[#F0EBE4]"><td className="p-3 font-medium text-[#541D2B]">{r.institution}</td><td className="p-3 text-xs">{r.modality}</td><td className="p-3 font-semibold">{pct(r.monthly_rate)}</td><td className="p-3">{pct(r.annual_rate)}</td><td className="p-3 text-xs">{r.reference_period}</td><td className="p-3 text-xs"><a className="text-[#8A6B3C] underline" href={r.source_url} target="_blank" rel="noopener noreferrer">Banco Central</a></td></tr>)}</tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-sm text-[#766D64]">Nenhuma taxa encontrada.{rates.length === 0 && isAdmin ? " Clique em “Atualizar dados do Banco Central” para importar." : ""}</p>}
        </article>
      ) : (
        <article className="rounded-2xl border border-[#EAE3D9] bg-white p-5">
          <p className="rounded-xl bg-[#FFF8EC] p-3 text-xs text-[#875A20]">O Banco Central publica a lista de administradoras autorizadas, mas não publica a taxa de administração, fundo de reserva ou prazo de cada uma. Por isso esses campos aparecem como “Não disponível” — use a taxa da proposta comercial no simulador.</p>
          <p className="mt-3 text-xs text-[#766D64]">{adminList.length} administradora(s)</p>
          <div className="mt-2 divide-y divide-[#F0EBE4]">{adminList.map((a) => (
            <div key={a.id} className="py-3 text-sm">
              <b className="text-[#541D2B]">{a.name}</b>
              <p className="text-xs text-[#766D64]">{[a.city, a.state].filter(Boolean).join(" / ")}{a.website ? " · " : ""}{a.website && <a className="text-[#8A6B3C] underline" href={a.website.toLowerCase().startsWith("http") ? a.website.toLowerCase() : "https://" + a.website.toLowerCase()} target="_blank" rel="noopener noreferrer">{a.website.toLowerCase()}</a>}</p>
              <p className="mt-1 text-xs">Segmento: {a.segment ?? ND} · Taxa de administração: {a.admin_fee != null ? pct(a.admin_fee) : ND} · Fundo de reserva: {a.reserve_fund != null ? pct(a.reserve_fund) : ND} · Prazo: {a.term_months ? a.term_months + " meses" : ND}</p>
              <p className="text-[11px] text-[#9A8F84]">{a.reference_period} · Fonte: <a className="underline" href={a.source_url} target="_blank" rel="noopener noreferrer">Banco Central</a></p>
            </div>))}</div>
          {adminList.length === 0 && <p className="text-sm text-[#766D64]">Nenhuma administradora encontrada.</p>}
        </article>
      )}
    </section>
  );
}
