import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BASE = "https://olinda.bcb.gov.br/olinda/servico";
const SRC_TAXAS = "Banco Central do Brasil — Taxas de juros por instituição (Dados Abertos)";
const SRC_CONS = "Banco Central do Brasil — Administradoras de consórcio autorizadas (Dados Abertos)";
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

async function getJson(url: string) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`Banco Central respondeu ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return ((await r.json()) as { value: Record<string, unknown>[] }).value;
}

/** Busca no Banco Central e substitui os dados de referência. Somente administradora (RLS). */
export const refreshBcbRates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: isAdmin } = await supabase.rpc("is_crm_admin");
    if (!isAdmin) throw new Error("Somente a administradora pode atualizar os dados.");

    // Imobiliário: mês mais recente publicado (tenta os últimos 4 meses)
    const now = new Date();
    let imob: Record<string, unknown>[] = [];
    let imobUrl = "";
    for (let i = 0; i < 4 && imob.length === 0; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      imobUrl = `${BASE}/taxaJuros/versao/v2/odata/TaxasJurosMensalPorMes?$format=json&$filter=anoMes eq '${ym}'`;
      imob = await getJson(encodeURI(imobUrl));
    }

    // Veículos: período semanal mais recente
    const datas = await getJson(`${BASE}/taxaJuros/versao/v2/odata/ConsultaDatas?$format=json&$orderby=${encodeURIComponent("InicioPeriodo desc")}&$top=1`).catch(() => []);
    let inicio = String((datas[0] as { InicioPeriodo?: string } | undefined)?.InicioPeriodo ?? "");
    let veicUrl = `${BASE}/taxaJuros/versao/v2/odata/ConsultaUnificada?$format=json&$filter=codigoModalidade eq '401101'` + (inicio ? ` and InicioPeriodo eq '${inicio}'` : "");
    let veic = await getJson(encodeURI(veicUrl));
    if (!inicio && veic.length) {
      inicio = String(veic.map((v) => v["InicioPeriodo"]).sort().pop());
      veic = veic.filter((v) => v["InicioPeriodo"] === inicio);
    }

    const cons = await getJson(`${BASE}/Instituicoes_em_funcionamento/versao/v1/odata/SedesConsorcios?$format=json`);

    if (!imob.length && !veic.length && !cons.length) throw new Error("O Banco Central não retornou dados agora. Tente mais tarde.");

    const rates = [
      ...imob.map((r) => ({
        category: "imobiliario", institution: String(r["InstituicaoFinanceira"]), modality: String(r["Modalidade"]),
        monthly_rate: Number(r["TaxaJurosAoMes"]), annual_rate: Number(r["TaxaJurosAoAno"]),
        reference_period: `Mês ${r["Mes"]}`, source: SRC_TAXAS, source_url: imobUrl.split("?")[0]!, position: Number(r["Posicao"]),
      })),
      ...veic.map((r) => ({
        category: "veiculo", institution: String(r["InstituicaoFinanceira"]), modality: String(r["Modalidade"]),
        monthly_rate: Number(r["TaxaJurosAoMes"]), annual_rate: Number(r["TaxaJurosAoAno"]),
        reference_period: `Semana ${r["InicioPeriodo"]} a ${r["FimPeriodo"]}`, source: SRC_TAXAS, source_url: veicUrl.split("?")[0]!, position: Number(r["Posicao"]),
      })),
    ];
    const ref = `${MESES[now.getMonth()]}/${now.getFullYear()}`;
    const admins = cons.map((r) => ({
      name: String(r["NOME_INSTITUICAO"]), cnpj8: (r["CNPJ"] as string) ?? null, city: (r["MUNICIPIO"] as string) ?? null,
      state: (r["UF"] as string) ?? null, website: (r["SITIO_NA_INTERNET"] as string) ?? null,
      reference_period: `Lista consultada em ${ref}`, source: SRC_CONS,
      source_url: `${BASE}/Instituicoes_em_funcionamento/versao/v1/odata/SedesConsorcios`,
    }));

    if (rates.length) {
      const del = await supabase.from("rate_references").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (del.error) throw new Error(del.error.message);
      const ins = await supabase.from("rate_references").insert(rates);
      if (ins.error) throw new Error(ins.error.message);
    }
    if (admins.length) {
      const del = await supabase.from("consortium_administrators").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (del.error) throw new Error(del.error.message);
      const ins = await supabase.from("consortium_administrators").insert(admins);
      if (ins.error) throw new Error(ins.error.message);
    }
    const details = `${imob.length} taxas de financiamento imobiliário, ${veic.length} taxas de veículos e ${admins.length} administradoras de consórcio.`;
    await supabase.from("rate_update_log").insert({ source: "Banco Central do Brasil", details });
    return { details };
  });
